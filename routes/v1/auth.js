import express from 'express';
import auth from '../../controllers/v1/auth.js';
const router = express.Router();

router.get('/', auth.validateToken);
router.delete('/', auth.logout);
router.post('/login', auth.login);
router.post('/register', auth.register);
router.post('/forgot', auth.forgot);
router.post('/forgot/verify', auth.verifyCode);
router.post('/forgot/reset', auth.resetPassword);
export default router;