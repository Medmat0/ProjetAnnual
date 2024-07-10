import Docker from 'dockerode';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import uploaderRaw from "../../utils/cloudinaryRaw.js"

const docker = new Docker();

const execlistcode = async (req, res) => {
    try {
        const { program, input } = req.body;
        const result = await executeProgram(program.code, program.language, input);
        const tmpDir = os.tmpdir();
        const tempDirPath = path.join(tmpDir, uuidv4());
        await fs.mkdir(tempDirPath, { recursive: true });
        const resultFilePath = path.join(tempDirPath, 'output.txt');
          
        await fs.writeFile(resultFilePath, result);
        
        const uploaded = await uploaderRaw(resultFilePath);
        const resultUrl = uploaded.url;
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
    await fs.mkdir(workDir, { recursive: true }); 

    try {
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
