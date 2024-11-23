import express from 'express';
import multer from 'multer';
import archivos from '../../controllers/v1/archivos.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), archivos.upload);
export default router;