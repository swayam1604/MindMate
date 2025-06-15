
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/analyze", async (req, res) => {
  const { journal } = req.body;

  try {
    const gptResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a supportive mental wellness assistant." },
          { role: "user", content: `Analyze this journal entry: ${journal}` },
        ],
      }),
    });

    const data = await gptResponse.json();
    const analysis = data.choices?.[0]?.message?.content || "Sorry, I couldn’t process that.";
    res.json({ analysis });

  } catch (error) {
    console.error("OpenRouter API Error:", error);
    res.status(500).json({ error: "AI processing failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
