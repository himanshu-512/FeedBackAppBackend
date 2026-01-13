import express from 'express';
import { anonymousLogin } from '../controllers/auth.controller.js';
import { verifyPhone, getMe } from '../controllers/auth.controller.js';
import verifyJWT from '../../config/var.js';

const router = express.Router();

router.post('/anonymous', anonymousLogin);
router.post('/verify-phone', verifyPhone);
router.get('/me', verifyJWT, getMe);
// router.post('/verify-otp', verifyOTP);

export default router;