import express from 'express';
import codigos from '../../controllers/v1/codigos.js';
const router = express.Router();

router.post('/', codigos.createCode);
router.post('/validate', codigos.valiateCode);
router.post('/type', codigos.createCodeType);
export default router;