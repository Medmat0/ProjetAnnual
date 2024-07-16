import React, { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useLocation } from "react-router-dom";
import { TailSpin } from "react-loader-spinner"; // Importation de l'indicateur de chargement
import pythonImage from "../../assets/appImages/python.png";
import jsImage from "../../assets/appImages/js.png";
import "./editorform.css";
import { BASE_URL , BASE_URL_DOCKER } from "../../apiCall";
import toast from "react-hot-toast";

const editorOptions = {
  scrollBeyondLastLine: false,
  fontSize: "14px",
  folding: false,
};

const CodeEditor = () => {
  const location = useLocation();
  const { codeInside, inputUserType, languageUser } = location.state || {};
  console.log("here", location.state);
  const [language, setLanguage] = useState(languageUser || "python");
  const [code, setCode] = useState(codeInside || "");
  const [output, setOutput] = useState("");
  const [editorMode, setEditorMode] = useState("vs-dark");
  const [title, setTitle] = useState("");
  const [inputType, setInputType] = useState(inputUserType || "text");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); 

  const toggleTheme = (idName) => {
    let currentClassName = document.getElementById(idName).className;
    let newClassName = currentClassName;
    if (currentClassName === idName + "-dark") newClassName = idName + "-light";
    else newClassName = idName + "-dark";
    document.getElementById(idName).className = newClassName;
  };

  const handleThemeChange = () => {
    if (editorMode === "vs-light") setEditorMode("vs-dark");
    else setEditorMode("vs-light");
    toggleTheme("App");
    toggleTheme("header");
    toggleTheme("app-name");
    toggleTheme("language-button");
    const themeToggler = document.getElementById("theme-icon");
    let classNames = themeToggler.classList;
    if (classNames.contains("theme-icon-light")) {
      classNames.replace("theme-icon-light", "theme-icon-dark");
      classNames.replace("fa-sun", "fa-moon");
    } else {
      classNames.replace("theme-icon-dark", "theme-icon-light");
      classNames.replace("fa-moon", "fa-sun");
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file); 
    }
  };

  const getImageForLanguage = (language) => {
    switch (language.toLowerCase()) {
      case "python":
        return pythonImage;
      case "javascript":
        return jsImage;
      default:
        return null;
    }
  };
  

  const handleSubmit = async () => {
    setLoading(true); 
    if(inputUserType === "png")
    {
    const codeFile = new Blob([code], { type: "text/plain" });
    const formData = new FormData();
    if (language === "python") formData.append("script", codeFile, "script.py");
    else formData.append("script", codeFile, "script.js");
    formData.append("title", title);

    if (file) {
      formData.append("image", file); 
    }

    try {
      const response = await axios.post(`${BASE_URL_DOCKER}/execution/pngCode`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer <your-token-here>`,
        },
      });
   
      setOutput(response.data.resultUrl);
    } catch (error) {
     toast.error("Error submitting the code");
    } finally {
      setLoading(false); 
    }
  }
  else{
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target.result;
      const programData = {
        program: {
          code: code,
          language: language,
        },
        input: fileContent,
      };

      try {
        const response = await axios.post(`${BASE_URL_DOCKER}/execute/txtCode`, programData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer <your-token-here>`,
          },
        });

        setOutput(response.data.resultUrl); 
      } catch (error) {
               toast.error("Error submitting the code");
     } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  }
  };
  
  const renderOutput = () => {
    if (loading) {
      return (
        <div className="loading-spinner">
          <TailSpin color="#00BFFF" height={80} width={80} />
        </div>
      );
    }

    if (output && output.startsWith("http")) {
      const isImage = output.endsWith(".png") || output.endsWith(".jpg") || output.endsWith(".jpeg");
      const IsFile = output.endsWith(".txt");
      return (
        <div>
          {isImage && <img src={output} alt="Output" style={{ maxWidth: "100%", maxHeight: "400px" }} />}
          { IsFile && <a href={output} download>Download File</a>}
          <br />
          <a href={output} download>
            Download {isImage ? "Image" : "File"}
          </a>
        </div>
      );
    }
    else{
      return (
        <div className="output-error">
          {output}
        </div>
      );
    };
  }

  return (
    <div id="App" className="App-dark">
      <div id="header" className="header-dark">
        <h3 id="app-name" className="app-name-dark">
          <i className="fas fa-solid fa-cube" aria-hidden="true"></i>
          &nbsp; Share Code Editor
        </h3>

        <div className="nav-right-options">
          <i
            id="theme-icon"
            className="fas fa-solid fa-sun fa-2x nav-icons theme-icon-light"
            aria-hidden="true"
            onClick={handleThemeChange}
          ></i>

          <i className="fas fa-solid fa-swatchbook tutorial-icon nav-icons fa-2x" aria-hidden="true"></i>
        </div>
      </div>

      <div className="secondary-nav-items">
        <button className="btn logo-btn" disabled={true}>
          <img
            src={getImageForLanguage(language)}
            style={{ width: "35px", marginRight: "5px" }}
            className="image"
            alt={`${language} icon`}
          />
        </button>
        <button id="language-button" className="language-button-dark">
          <select
            value={language}
            onChange={(e) => {
             
              setLanguage(e.target.value);
            }}
          >
            <option value={"python"}>Python</option>
            <option value={"javascript"}>JavaScript</option>
          </select>
        </button>
        <button className="btn run-btn" onClick={handleSubmit}>
          <i className="fas fa-play fa-fade run-icon" aria-hidden="true"></i>
          &nbsp; Run
        </button>
      </div>

      <div className="form-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
        <select
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
          className="input-field"
        >
          <option value="text">Text</option>
          <option value="png">PNG</option>
        </select>
       
        <input type="file" accept=".txt,.png,.jpg,.jpeg" onChange={handleFileInputChange} className="input-file" />
      </div>

      <div className="editor">
        <Editor
          height="100%"
          width="100%"
          theme={editorMode}
          defaultLanguage={language}
          value={code}
          onChange={(e) => setCode(e)}
          options={editorOptions}
        />
      </div>
      <div className="std-input-output">
        <div className="std-output">
        {renderOutput()}
        </div>
      </div>
      <br />
    </div>
  );
};

export default CodeEditor;
