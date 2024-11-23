import express from 'express';
const router = express.Router();
import equipos from '../../controllers/v1/equipos.js';

router.post('/verifyName', equipos.validateFranchiseName);

export default router;