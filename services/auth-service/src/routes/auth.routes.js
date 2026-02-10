import express from 'express';
import { anonymousLogin } from '../controllers/auth.controller.js';
import { verifyPhone, getMe, verifyOtp,sendOtp, me } from '../controllers/auth.controller.js';
import verifyJWT from '../../config/var.js';

const router = express.Router();

router.post('/anonymous', anonymousLogin);
router.post('/verify-phone', verifyPhone);
router.get('/me', verifyJWT, getMe);
router.post('/verify-otp', verifyOtp);
router.post('/send-otp', sendOtp);
router.get("/me", verifyJWT, me);

export default router;