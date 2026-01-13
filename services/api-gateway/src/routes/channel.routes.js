import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express'
import verifyJWT  from '../middlewares/auth.middleware.js';
const router = express.Router()
router.use(
  '/',
  // verifyJWT, // 🔥 MUST ENABLE
  createProxyMiddleware({
    target: process.env.CHANNEL_SERVICE_URL || 'http://localhost:4002',
    changeOrigin: true
  })
);

export default router;
