require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const channelRoutes = require('./routes/channel.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Rate limit
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway running' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/channels', channelRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
