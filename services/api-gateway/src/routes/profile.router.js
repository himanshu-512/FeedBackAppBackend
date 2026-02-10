import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { profile } from "../../controller/profile.controller.js";

const router = express.Router();

// ✅ protect this route
router.get("/", verifyJWT, profile);

export default router;
