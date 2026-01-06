const { createProxyMiddleware } = require('http-proxy-middleware');
const router = require('express').Router();
const { verifyJWT } = require('../middlewares/auth.middleware');

router.use(
  '/',
  verifyJWT,
  createProxyMiddleware({
    target: process.env.CHANNEL_SERVICE_URL,
    changeOrigin: true
  })
);

module.exports = router;
