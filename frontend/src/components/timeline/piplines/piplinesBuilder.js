      import React, { useState, useCallback, useEffect } from 'react';
      import axios from 'axios';
      import './piplinesBuilder.css';
      import ReactFlow, {addEdge, MiniMap, Controls, Background,useNodesState, useEdgesState } from 'reactflow';
      import 'reactflow/dist/style.css';
      import toast from "react-hot-toast";
      import { BASE_URL , BASE_URL_DOCKER } from "../../../apiCall";
      import { useAuth } from "../../../context/authContext";
      import { getImageForLanguage ,transformEdges, transformNodes ,transformPipelineData ,ExecutionPopup , transformPipeline } from "./utils";

      const initialNodes = [
        {
          id: 'startNode',
          type: 'input',
          data: { label: 'Start' },
          position: { x: 250, y: 5 },
        },
      ];
      const initialEdges = [];

      const PipelineBuilder = ({ collections }) => {
        const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
        const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
        const [reactFlowInstance, setReactFlowInstance] = useState(null);
        const [inputType, setInputType] = useState('');
        const [contextMenu, setContextMenu] = useState(null);
        const [pipelines, setPipelines] = useState([]);
        const [showForm, setShowForm] = useState(false);
        const [formValues, setFormValues] = useState({ name: '', description: '' });
        const [selectedPipeline, setSelectedPipeline] = useState(null);
        const [nodeVersions, setNodeVersions] = useState({});
        const { token } = useAuth();
        const [userInput, setUserInput] = useState('');
        const [executionResults, setExecutionResults] = useState([]);
        const [isExecuting, setIsExecuting] = useState(false);
        const [executionDetails, setExecutionDetails] = useState([]);
        const [isPopupOpen, setIsPopupOpen] = useState(false); 
        const [deletePipelineId, setDeletePipelineId] = useState(''); 
        const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
        const onDragOver = useCallback((event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
        }, []);
        console.log(isExecuting, nodeVersions);
        const onDrop = useCallback(
          (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            const position = reactFlowInstance.project({
              x: event.clientX,
              y: event.clientY,
            });
            const collection = collections.find((col) => col.title === type);
            if (!collection) {
              toast.error('Invalid program.');
              return;
            }
            const versions = collection.versions;
            const lastNode = nodes[nodes.length - 1];
            if (lastNode && lastNode.data.inputType !== collection.inputType) {
              toast.error(`Input type mismatch: expected ${lastNode.data.inputType}, got ${collection.inputType}`);
              return;
            }
            if (nodes.some((node) => node.data.id === collection.id.toString())) {
              toast.error(`Program ${collection.title} already added.`);
              return;
            }
            const newNode = {
              id: collection.id.toString(),
              type,
              position,
              data: {
                label: (
                  <div>
                    <img src={getImageForLanguage(collection.language)} alt={collection.language} style={{ width: '35px', marginRight: '5px' }} />
                    <strong>{collection.title}</strong>
                    <div>Type: {collection.inputType}</div>
                  </div>
                ),
                inputType: collection.inputType,
                id: collection.id.toString(),
                version: collection.code, 
                language: collection.language,
                versions, 
              },
            };

            setNodes((nds) => nds.concat(newNode));
          },
          [reactFlowInstance, nodes, collections]
        );

        const onDragStart = (event, nodeType) => {
          event.dataTransfer.setData('application/reactflow', nodeType);
          event.dataTransfer.effectAllowed = 'move';
        };
        
        const handleVersionSelect = (nodeId, version) => {
          setNodeVersions((prev) => ({
            ...prev,
            [nodeId]: version.versionNumber
          }));
          setNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      version: version.content,
                    },
                  }
                : node
            )
          );
          setContextMenu(null);
          toast.success('Version selected!');
        };

        const handleSelectPipeline = (pipeline) => {
            setSelectedPipeline(pipeline);
            const transformedNodes =  transformNodes(pipeline); 
            const transformedEdges =   transformEdges(pipeline);  
            setNodes(transformedNodes);
            setEdges(transformedEdges);
          };
          
        const handleInputTypeChange = (event) => {
          setInputType(event.target.value);
          setNodes([
            {
              id: 'start node',
              type: 'input',
              data: { label: `Input ${event.target.value}`, inputType: event.target.value },
              position: { x: 250, y: 5 },
            }, 
          ]); 
        };
        const handleInputChange = (event) => {
         
            const file = event.target.files[0];
            if (file && file.name.endsWith('.txt')) {
              const reader = new FileReader();
              reader.onload = () => {
                const fileContent = reader.result;
                setUserInput(fileContent); 
              };
              reader.readAsText(file);
            }
            else if (file && file.name.endsWith('.png')){
              setUserInput(file);
            }else {
              alert("Please select a file");
            }
            

        };

        const executePipeline = async () => {
          if (!nodes.length) {
            toast.error('No nodes to execute.');
            return;
          }
        
          setIsPopupOpen(true);
          setIsExecuting(true);
          let input = userInput;
          const results = [];
          const details = [];
        
          for (const node of nodes) {
            details.push({ nodeId: node.id, status: 'executing' });
            setExecutionDetails([...details]);
        
            try {
              if (node.data.version === undefined) {
                continue;
              }
        
              let response;
              if (node.data.inputType === 'png') {
                const formData = new FormData();
                formData.append('script', new Blob([node.data.version], { type: 'text/plain' }), `script.${node.data.language === 'python' ? 'py' : 'js'}`);
        
                if (typeof input === 'string' && input.startsWith('http')) {
                  const httpResponse = await fetch(input);
                  const blob = await httpResponse.blob();
                  formData.append('image', blob, 'image.png');
                } else {
                  formData.append('image', input);
                }
        
                response = await axios.post(`${BASE_URL_DOCKER}/execution/pngCode`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                  },
                });
              } else if (node.data.inputType === 'txt') {
                let fileContent;
                if (typeof input === 'string' && input.startsWith('http')) {
                  const httpResponse = await fetch(input);
                  if (!httpResponse.ok) {
                    throw new Error(`Failed to fetch content from ${input}`);
                  }
                    fileContent = await httpResponse.text();
                  } else  {
                    fileContent = input;
                  }
                  const programData = {
                    program: {
                    code: node.data.version,
                    language: node.data.language,
                    },
                    input: fileContent, 
                  };
        
                response = await axios.post(`${BASE_URL_DOCKER}/execute/txtCode`, programData, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                });
              }
        
              const resultUrl = response.data.resultUrl;
              results.push({ nodeId: node.id, result: resultUrl });
              input = resultUrl;
        
              toast.success(`Node ${node.id} executed successfully.`);
              details.pop();
              details.push({ nodeId: node.id, status: 'finished', result: resultUrl });
              setExecutionDetails([...details]);
            } catch (error) {
              toast.error(`Error executing node ${node.id}`);
              console.error(error);
              details.pop();
              details.push({ nodeId: node.id, status: 'error' });
              setExecutionDetails([...details]);
              break;
            }
          }
        
          setExecutionResults(results);
          setIsExecuting(false);
        };
        
        
        
        useEffect(() => {
          setNodes((nds) =>
            nds.map((node) => {
              const result = executionResults.find((res) => res.nodeId === node.id);
              return {
                ...node,
                data: {
                  ...node.data,
                  result: result ? result.result : null,
                },
              };
            })
          );
        }, [executionResults]);

            useEffect(() => {
              setNodes((nds) =>
                nds.map((node) => {
                  const result = executionResults.find((res) => res.nodeId === node.id);
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      result: result ? result.result : null,
                    },
                  };
                })
              );
            }, [executionResults]);
    useEffect(() => {
          if (selectedPipeline) {
            setNodes(selectedPipeline.nodes);
            setEdges(selectedPipeline.edges);
          }
        }, [selectedPipeline]);
        useEffect(() => {
          const fetchPipelines = async () => {
            try {
              const response = await fetch(`${BASE_URL}/pipeline`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const data = await response.json();
              if (response.ok) {
                const transformedPipelines = transformPipelineData(data);

                setPipelines(transformedPipelines);
              } else {
                toast.error(data.message);
              }
            } catch (error) {
              toast.error('Failed to fetch pipelines');
              console.log(error);
            }
          };
          fetchPipelines();
        }, [token]);
        const onNodeContextMenu = (event, node) => {
          event.preventDefault();
          setContextMenu({
            nodeId: node.id,
            versions: node.data.versions || [], // Provide a default value if versions is undefined
            x: event.clientX,
            y: event.clientY,
          });
        };
        const handleDeleteNode = (nodeId) => {
          setNodes((nds) => nds.filter((node) => node.id !== nodeId));
          setContextMenu(null);
          toast.success('Node deleted!');
        };

        const handleSavePipeline = () => {
          setShowForm(true);
        };
    
        const handleFormChange = (e) => {
          const { name, value } = e.target;
          setFormValues({ ...formValues, [name]: value });
        };
        const handleFormSubmit  = async (e) => {
          e.preventDefault();
          const newPipeline = {
            ...formValues,
            nodes,
            edges,
          };
          try {
            const response = await fetch(`${BASE_URL}/pipeline/create`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(newPipeline),
            });
            const data = await response.json();
            if (response.ok) {
              const transformedPipelines = transformPipeline(data.data);
              setPipelines([...pipelines, transformedPipelines]);
              setShowForm(false);
              setFormValues({ name: '', description: '' });
              toast.success('Pipeline saved!');

            } else {
              toast.error(data.message);
            }
          } catch (error) {
            toast.error('Failed to save pipeline', error); 
            console.error(error); 
          }
        };
      
        const handleDeletePipeline = async () => {
          if (!deletePipelineId) {
            toast.error('Please provide a pipeline ID to delete.');
            return;
          }
          try {
            const response = await axios.delete(`${BASE_URL}/pipeline/${deletePipelineId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            if (response.status === 204) {
              toast.success('Pipeline deleted successfully.');
              setPipelines(pipelines.filter((pipeline) => pipeline.id !== deletePipelineId));
              setDeletePipelineId(''); 
            } else {
              toast.error('Failed to delete pipeline.');
            }  
          } catch (error) {
            console.error('Error deleting pipeline:', error);
            toast.error('Error deleting pipeline.');
          }
        };
        return (
          <div className="pipeline-builder">
            <div className="sidebar">
              <div className="input-type-selector">
                <label>Select Input Type: </label>
                <select value={inputType} onChange={handleInputTypeChange}>
                  <option value="">Select Type</option>
                  <option value="png">png</option>
                  <option value="txt">txt</option>
                </select>
              </div>
              <aside>
                <div className="description">You can drag these nodes to the pane on the right.</div>
                {collections && collections.length > 0 ? (
                  <ul className="collectionsList">
                    {collections.map((collection) => (
                      <li
                        key={collection.id}
                        className="dndnode"
                        onDragStart={(event) => onDragStart(event, collection.title)}
                        draggable
                      >
                        {collection.title} ({collection.inputType})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No collections. Add some!</p>
                )}
              </aside>
              <div className="pipelines-list">
                <h5>Pipelines:</h5>
                <ul>
                  {pipelines.map((pipeline, index) => (
                    <li key={index}>
                      <button onClick={() => handleSelectPipeline(pipeline)}>
                        <strong>{pipeline.id}</strong>: {pipeline.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tools">
                <button onClick={handleSavePipeline}>Save Pipeline</button>
                <label htmlFor="deletePipelineId">Pipeline ID to delete:</label>
            <input
              type="text"
              id="deletePipelineId"
              value={deletePipelineId}
              onChange={(e) => setDeletePipelineId(e.target.value)}
            />
            <button onClick={handleDeletePipeline}>Delete Pipeline</button>             
            <button onClick={executePipeline}>Execute Pipeline</button>
              </div>

              <div className="user-input">
          <label>Enter your input:</label>
         
            <input type="file" accept=".txt,.png" onChange={handleInputChange} />
         
        </div>
            </div>
            <div className="react-flow-container">  
                        <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeContextMenu={onNodeContextMenu}
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
              {contextMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: contextMenu.y,
                    left: contextMenu.x,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    padding: '10px',
                    zIndex: 1000,
                  }}
                >
                  <div className="context-menu">
                    <div>
                      <strong>Select Version:</strong>
                      <ul>
                        {contextMenu.versions.map((version, index) => (
                          <li key={index}>
                            <button onClick={() => handleVersionSelect(contextMenu.nodeId, version)}>
                              Version: {version.versionNumber}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={() => handleDeleteNode(contextMenu.nodeId)}>Delete Node</button>
                  </div>
                </div>
              )}
              {showForm && (
            <div className="popup-form">
              <form onSubmit={handleFormSubmit}>
                <label>
                  Pipeline Name:
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            </div>
          )}
            </div> 
            <ExecutionPopup
          details={executionDetails}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </div> ); };
      export default PipelineBuilder;
