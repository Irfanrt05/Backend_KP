import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { sequelize } from "./models/index.js";
import { seedDefaultAdmin } from "./utils/seedAdmin.js";
import puppeteer from "puppeteer";

const PORT = process.env.PORT || 5000;

// --- FIX PUPPETEER UNTUK RAILWAY ---
// Kita buat fungsi helper untuk meluncurkan browser
export const launchBrowser = async () => {
  return await puppeteer.launch({
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    headless: "new",
  });
};
// -----------------------------------

try {
  await sequelize.authenticate();
  console.log("Database connected");

  await sequelize.sync();
  console.log("Database synced");

  await seedDefaultAdmin();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Server failed:", error.message);
  process.exit(1);
}
