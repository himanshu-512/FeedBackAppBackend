import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { generateUsername } from '../utils/username.js';

export function anonymousLogin(req, res) {
  const userId = uuidv4();
  const username = generateUsername();

  const token = jwt.sign(
    { userId, username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    userId,
    username,
    token
  });
}
