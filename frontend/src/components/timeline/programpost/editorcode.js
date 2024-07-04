import React, { useState, useEffect } from "react";
import "./editorcode.css";
import Editor from "@monaco-editor/react";
import { Box, CircularProgress, Input, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import InputEmoji from "react-input-emoji";
import { useAuth } from "../../../context/authContext";
import usePost from "../../../context/postContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const editorOptions = {
  scrollBeyondLastLine: false,
  fontSize: "14px",
  folding: false,
};

const ProgrammePost = ({ fetchPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [inputType, setInputType] = useState("txt");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const { token } = useAuth();
  const { createProgramPost, createLoading } = usePost();

  const instructions = {
    txt: `// Exemple de code pour les fichiers TXT\nconst fs = require("fs");\n\n// Lire l'input depuis input.txt\nconst input = fs.readFileSync("input.txt", "utf8");\n\n// Ajouter du texte à l'input\nconst output = \`Hello, \${input}\`;\n\n// Écrire le résultat dans output.txt\nfs.writeFileSync("output.txt", output);`,
    png: `# Exemple de code pour les images PNG\nfrom PIL import Image, ImageEnhance\nimport os\nimport sys\n\n\ndef apply_blue_filter(image_path):\n    # Ouvrir l'image\n    image = Image.open(image_path)\n\n    # Convertir l'image en mode RGB\n    image = image.convert("RGB")\n\n    # Créer une image bleue de la même taille\n    blue_image = Image.new("RGB", image.size, (0, 0, 255))\n\n    # Mélanger les deux images\n    blended_image = Image.blend(image, blue_image, alpha=0.3)  # Adjust alpha for more or less blue\n\n    # Enregistrer l'image résultante\n    blended_image.save("output.png")\n\n    print("Filtre bleu appliqué avec succès.")\n\nif __name__ == "__main__":\n    image_path = sys.argv[1]\n    apply_blue_filter(image_path)\n   `,
  };

  useEffect(() => {
    setCode(instructions[inputType]);
  }, [inputType]);

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension === "py" || fileExtension === "js") {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCode(event.target.result);
          setLanguage(fileExtension === "py" ? "python" : "javascript");
        };
        reader.readAsText(file);
      } else {
        toast.error("Only Python (.py) and JavaScript (.js) files are allowed.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !code) {
      toast.error("Title, Content, and Code are required.");
      return;
    }

    const programPostData = {
      title,
      content,
      privacy,
      language,
      inputType,
      code,
      tags,
    };

    try {
      setLoading(true);
      console.log("programme data: ", programPostData); 
      await createProgramPost(programPostData);
      setTitle("");
      setContent("");
      setPrivacy("PUBLIC");
      setLanguage("python");
      setInputType("txt");
      setCode(instructions["txt"]); // Reset code to default instructions for txt
      setTags([]);
      toast.success("Programme post created successfully!");
      setLoading(false);
      fetchPosts();
      
    } catch (error) {
      setLoading(false);
      toast.error("Could not create programme post. Please try again.");
      console.error("Error creating programme post:", error);
    }
  };

  const handleTagChange = (tag) => {
    const updatedTags = [...tags];
    const tagIndex = updatedTags.indexOf(tag);
    if (tagIndex !== -1) {
      updatedTags.splice(tagIndex, 1);
    } else {
      updatedTags.push(tag);
    }
  
    setTags(updatedTags);
  };

  const tagOptions = ["Technology", "Programming", "Science", "Art", "Music"];

  return (
    <>
      <Toaster />
      <div className="programmePost">
        <form className="programmePostWrapper" onSubmit={handleSubmit}>
          <div className="programmePostTop">
            <InputEmoji
              value={title}
              onChange={setTitle}
              placeholder="Title"
            />
            <InputEmoji
              value={content}
              onChange={setContent}
              placeholder="What's on your mind?"
            />
          </div>
          <hr className="programmePostHr" />
          <div className="programmePostOptions">
            <FormControl variant="outlined" className="formControl">
              <InputLabel id="inputType-label">Input Type</InputLabel>
              <Select
                labelId="inputType-label"
                id="inputType"
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                label="Input Type"
              >
                <MenuItem value="txt">Text</MenuItem>
                <MenuItem value="png">PNG</MenuItem>
              </Select>
            </FormControl>
            <Input
              type="file"
              onChange={handleFileInputChange}
              accept=".py, .js"
              className="inputFile"
            />
            <FormControl variant="outlined" className="formControl">
              <InputLabel id="language-label">Language</InputLabel>
              <Select
                labelId="language-label"
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                label="Language"
              >
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="javascript">JavaScript</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="editorContainer">
            <Editor
              height="300px"
              width="100%"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={editorOptions}
              language={language}
            />
          </div>
          <div className="tagsContainer">
            {tagOptions.map((tag, index) => (
              <div key={index} className={`tag ${tags.includes(tag) ? 'selected' : ''}`} onClick={() => handleTagChange(tag)}>
                {tag}
              </div>
            ))}
          </div>
          <button
            className="programmePostButton"
            type="submit"
            disabled={loading || createLoading}
          >
            {loading || createLoading ? "Submitting..." : "Share"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProgrammePost;
