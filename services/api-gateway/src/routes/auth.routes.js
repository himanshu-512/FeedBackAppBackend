const { createProxyMiddleware } = require('http-proxy-middleware');
const router = require('express').Router();

router.use(
  '/',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true
  })
);

module.exports = router;
