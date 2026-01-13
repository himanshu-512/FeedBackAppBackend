import jwt from 'jsonwebtoken';

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];
  console.log("TOKEN is:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 🔥 very important for downstream services
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export default verifyJWT;
