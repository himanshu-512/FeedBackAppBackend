import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from '../config/db.js';
import authRoutes from './routes/auth.routes.js';
connectDB();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service running' });
});

// 🔥 IMPORTANT: no /auth prefix here
app.use('/', authRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
