import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/db.js';
import channelRoutes from './routes/channel.routes.js';
// import { verifyJWT } from '../../api-gateway/src/middlewares/auth.middleware.js';

import {
  listChannels,
  createChannel,
  joinChannel
} from '../src/controllers/channel.controller.js';

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'Channel Service running' });
});

// app.get('/channels', listChannels);
// app.post('/:id/join', joinChannel);
app.use('/',channelRoutes)

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Channel Service running on port ${PORT}`);
});
