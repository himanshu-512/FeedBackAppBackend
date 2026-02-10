import express from "express";
import {
  getSummary,
  getTransactions,
  creditWallet,
  getProfileSummary
} from "../controllers/wallet.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();


router.get("/summary", protect, getSummary);
router.get("/transactions", protect, getTransactions);
router.get("/profile-summary",protect, getProfileSummary);

/* internal service call */
router.post("/credit", creditWallet);

export default router;
