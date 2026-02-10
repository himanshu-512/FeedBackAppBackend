import express from "express";
import { getMessagesByChannel } from "../controllers/message.controller.js";
import { getUserStats } from "../controllers/stats.controller.js";

const router = express.Router();

// GET /messages/:channelId
router.get("/:channelId", getMessagesByChannel);
router.get("/stats/:userId", getUserStats);

export default router;
