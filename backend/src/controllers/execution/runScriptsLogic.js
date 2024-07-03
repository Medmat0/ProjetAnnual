import Docker from 'dockerode'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';
import os from 'os'; 
import fs from 'fs';
import uploader from "../utils/cloudinary.js";






async function runScriptLogic(scriptPath, imagePath, langage) {
    const docker = new Docker();
    const tempDir = path.join(os.tmpdir(), uuidv4());

    fs.mkdirSync(tempDir, { recursive: true });

    const scriptName = path.basename(scriptPath);
    const imageName = path.basename(imagePath);

    const tempScriptPath = path.join(tempDir, scriptName);
    const tempImagePath = path.join(tempDir, imageName);
    fs.copyFileSync(scriptPath, tempScriptPath);
    fs.copyFileSync(imagePath, tempImagePath);
    const container = await docker.createContainer({
        Image: langage == 'python' ? '2d900f8839760ea3058976a4983ea013d076661719649c5d8ca38974b2884fa5' : '052ff0b48083',
        Tty: true,
        AttachStdout: true,
        AttachStderr: true,
        HostConfig: {
            AutoRemove: true,
            Binds: [`${tempDir}:/usr/src/app`],
        },
        Cmd: langage === 'python' ? ['python', scriptName , imageName] : ['node', scriptName , imageName],
    });

    await container.start();
    await container.wait();  

    const logs = await container.logs({ stdout: true });
    console.log(logs.toString());

    if (await container.inspect().catch(() => false)) {
        await container.remove();
    }

    console.log('Script execution finished successfully.');
    const resultFilePath = path.join(tempDir, 'output.png');
    let uploadedUrl = null;

    if (fs.existsSync(resultFilePath)) {
        const uploadResponse = await uploader(resultFilePath);
        uploadedUrl = uploadResponse.url;
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const destPath = path.join(uploadsDir, `output-${uuidv4()}.png`);

        fs.copyFileSync(resultFilePath, destPath);
        console.log('Result file moved to uploads directory:', destPath);
       
    } else {
        console.log('Result file not found.');
    }

    // Clean up temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    return uploadedUrl ? uploadedUrl : logs.toString();
}

export {
    runScriptLogic
};
