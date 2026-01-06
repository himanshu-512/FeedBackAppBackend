import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service running' });
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
