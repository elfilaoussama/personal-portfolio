import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// Absolute path to portfolio.json relative to repo root
const dataFile = path.resolve(process.cwd(), "public", "data", "portfolio.json");

// GET portfolio data
app.get("/api/portfolio", async (_req, res) => {
  try {
    const jsonStr = await fs.readFile(dataFile, "utf8");
    res.type("application/json").send(jsonStr);
  } catch (err) {
    console.error("Failed to read portfolio.json", err);
    res.status(500).json({ error: "Unable to read data file" });
  }
});

// PUT (replace) portfolio data
app.put("/api/portfolio", async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  try {
    // Pretty-print with two-space indent
    await fs.writeFile(dataFile, JSON.stringify(body, null, 2), "utf8");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to write portfolio.json", err);
    res.status(500).json({ error: "Unable to write data file" });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio API server running on http://localhost:${PORT}`);
});
