import express from 'express';
const router = express.Router();
import equipos from '../../controllers/v1/equipos.js';

router.get('/', equipos.getFranchises);
router.post('/', equipos.createFranchise);
router.post('/verifyName', equipos.validateFranchiseName);

export default router;