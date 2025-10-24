// server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

// Serve static frontend files (index.html, styles.css, script.js) from "public" folder:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Validate key
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in environment. See .env.example");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Simple chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message || "";
    if (!userMessage) return res.status(400).json({ error: "No message provided" });

    // Build messages array - you can add system message to set personality
    const messages = [
      { role: "system", content: "You are Wall-E, a friendly, concise, helpful AI. Keep answers short and kind." },
      { role: "user", content: userMessage }
    ];

    // Call OpenAI Chat API (chat completions)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // change to a model you have access to (gpt-4o-mini, gpt-4o, gpt-3.5-turbo, etc.)
      messages,
      max_tokens: 600,
      temperature: 0.7
    });

    const reply = completion.choices?.[0]?.message?.content ?? "Sorry, I didn't get a reply.";

    res.json({ reply });

  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI request failed", details: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Wall-E running on http://localhost:${PORT}`));
