import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./src/config/models/db.js";
import walletRoutes from "./src/routes/wallet.routes.js";
import internalRoutes from "./src/routes/internal.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/", walletRoutes);
app.use("/internal", internalRoutes);

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors(
  {origin: "*"}
));


/* ---------------- ROUTES ---------------- */

app.get("/health", (req, res) => {
  res.json({ status: "Wallet service running" });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 3003;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Wallet service running on port ${PORT}`);
  });
});
