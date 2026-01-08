import express from "express";
import { getMessagesByChannel } from "../controllers/message.controller.js";

const router = express.Router();

// GET /messages/:channelId
router.get("/:channelId", getMessagesByChannel);

export default router;
