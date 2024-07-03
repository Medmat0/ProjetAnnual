
import { runScriptLogic } from './runScriptsLogic.js';


const execode = async (req, res) => {
    try {
        const scriptPath = req.files['script'][0].path;
        const imagePath = req.files['image'][0].path;
        

        const langage = detectLangage(req.files['script'][0].originalname); // Fonction pour détecter le langage du script
        const resultUrl = await runScriptLogic(scriptPath, imagePath, langage);

        console.log("Result URL:", resultUrl);
        
        res.status(200).json({ resultUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred during script execution.');
    }
};

const detectLangage = (filename) => {
    if (filename.endsWith('.py')) {
        return 'python';
    } else if (filename.endsWith('.js')) {
        return 'javascript';
    } 
   
};




export { execode };
