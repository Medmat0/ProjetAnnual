import Docker from 'dockerode';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import uploader from "../utils/cloudinary.js";

const docker = new Docker();

const execlistcode = async (req, res) => {
    try {
        const { program, input } = req.body;
        const result = await executeProgram(program.code, program.language, input);
        console.log('Result:', result);
               const tmpDir = os.tmpdir();
               const resultFilePath = path.join(tmpDir, `${uuidv4()}.txt`);
        
               await fs.writeFile(resultFilePath, result);
               console.log('Result file path:', resultFilePath);
               if(fs.existsSync(resultFilePath)) {console.log('File not found');}
       
               const uploadedResult = await uploader(resultFilePath);
               const resultUrl = uploadedResult.url;
               console.log('Result URL:', resultUrl);
               console.log('Result:', uploadedResult);
               await fs.rm(resultFilePath);
       
               res.status(200).json({ resultUrl });
    } catch (error) {
        console.error('Error executing program:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const executeProgram = async (code, language, input) => {
    const tmpDir = os.tmpdir(); 
    const workDir = path.join(tmpDir, uuidv4());    
    const inputFilePath = path.join(workDir, 'input.txt');
    const outputFilePath = path.join(workDir, 'output.txt');
    await fs.mkdir(workDir, { recursive: true }); // Créer le répertoire de travail, y compris les répertoires parents manquants

    try {
        // Écrire l'input dans un fichier
        await fs.writeFile(inputFilePath, input);

        const imageName = language === 'python' ? 'python:latest' : 'node:latest';
        const container = await docker.createContainer({
            Image: imageName,
            Tty: false,
            Cmd: language === 'python' ? ['python', '-c', code] : ['node', '-e', code],
            HostConfig: {
                Binds: [`${workDir}:/app`]
            },
            WorkingDir: '/app',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true
        });

        await container.start();

        const stream = await container.attach({ stream: true, stdout: true, stderr: true });

        let result = '';
        for await (const chunk of stream) {
            result += chunk.toString();
        }

        await container.wait();

        const output = await fs.readFile(outputFilePath, 'utf8');

        await container.remove();
        await fs.rm(workDir, { recursive: true, force: true });

        return output;
    } catch (error) {
        console.error('Error executing program in Docker:', error);
        throw new Error('Failed to execute program in Docker');
    }
};

export { execlistcode };
