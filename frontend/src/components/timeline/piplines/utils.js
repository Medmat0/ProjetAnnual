
import pythonImage from '../../../assets/appImages/python.png'; 
import jsImage from '../../../assets/appImages/js.png'


export const transformPipelineData = (data) => {
    const transformedPipelines = data.data.map(pipeline => ({
      id: pipeline.id.toString(), 
      name: pipeline.name,
      description: pipeline.description,
      createdAt: pipeline.createdAt,
      updatedAt: pipeline.updatedAt,
      userId: pipeline.userId,
      nodes: pipeline.nodes.map(node => ({
        id: node.id.toString(), 
        type: node.type,
        position: node.position,
        data: {
          ...node.data,
          label: `${node.data.label !== "[object Object]" ? node.data.label :"program" } - Type: ${node.data.inputType}`,
          version: node.data.version,

        },
        width: node.width,
        height: node.height,  
      })),
      edges: pipeline.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
    }));
    return transformedPipelines;
  }
  
export const transformPipeline = (data) => { const pipeline = data;
  const transformedPipeline = {
    id: pipeline.id.toString(),
    name: pipeline.name,
    description: pipeline.description,
    createdAt: pipeline.createdAt,
    updatedAt: pipeline.updatedAt,
    userId: pipeline.userId,
    nodes: pipeline.nodes.map((node) => ({
      id: node.id.toString(),
      type: node.type,
      position: node.position,
      data: {
        ...node.data,
        label: `${node.data.label !== "[object Object]" ? node.data.label : "program"} - Type: ${node.data.inputType}`,
        version: node.data.version,
      },
      width: node.width,
      height: node.height,
    })),
    edges: pipeline.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  };
  return transformedPipeline;
};  

 export const getImageForLanguage = (language) => {
    switch (language.toLowerCase()) {
      case 'python':
        return pythonImage;
      case 'javascript':
        return jsImage;
      default:
        return null; 
    }
  };

  export  const transformNodes = (pipeline) => {
  const transformedNodes = pipeline.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: {
      ...node.data,
      label: `${node.data.label !== "[object Object]" ? node.data.label : "program"} - Type: ${node.data.inputType}`,
      version: node.data.version,
    },
    width: node.width,
    height: node.height,
  }));
  return transformedNodes;
};

export const transformEdges = (pipeline) => {
  const transformedEdges = pipeline.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
  }));

  return transformedEdges;
}

export const ExecutionPopup = ({ details, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <button className="close-btn" onClick={onClose}>×</button>
          <h3>Execution Status</h3>
          <div className="execution-steps">
            {details.map((detail, index) => (
              <div key={index} className="execution-step">
                <p><strong>Program {detail.nodeId}</strong></p>
                <p>Status: {detail.status}</p>
                {detail.result && (
                  <p>Result: <a href={detail.result} target="_blank" rel="noopener noreferrer">View Result</a></p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
