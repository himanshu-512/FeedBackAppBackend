import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {


  const authHeader = req.headers.authorization;


  if (!authHeader) {

    return res.status(401).json({ message: "No Authorization header" });
  }

  if (!authHeader.startsWith("Bearer ")) {
   
    return res.status(401).json({ message: "Invalid auth header format" });
  }

  const token = authHeader.split(" ")[1];
  

  if (!token) {

    return res.status(401).json({ message: "No token" });
  }

  try {
  

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    if (!decoded.userId) {
  
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // ✅ FINAL AUTH CONTEXT
    req.user = { id: decoded.userId };


    next();
  } catch (err) {
   
    console.error("Message:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};
