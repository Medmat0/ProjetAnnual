import express from 'express';
import {upload} from '../utils/multer.js';

import {execode} from '../controllers/execution/execode.js';
import {execlistcode} from '../controllers/execution/executeListProgram.js';

const router = express.Router(); 


router.post('/txtCode', execlistcode);

router.post('/pngCode', upload.fields([{ name: 'script', maxCount: 1 }, { name: 'image', maxCount: 1 }]), execode);

export default router;