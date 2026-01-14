import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
/*
    process = {
        env : {
            API_KEY : "[API_KEY_HERE]",
            PORT : 3001
        }
    }

*/

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(express.json());

// Copilot Chatbot - My AI Personality
app.post("/api/copilot", async (req, res) => {
  const { prompt, conversationHistory = [] } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Token boundary: 150 chars per user input
  if (prompt.length > 150) {
    return res
      .status(400)
      .json({ error: "Prompt exceeds maximum length of 150 characters" });
  }

  try {
    // Build messages with conversation history
    const messages = [
      {
        role: "system",
        content: `You are Copilot, an AI coding assistant made by GitHub. You are helpful, friendly, and knowledgeable about programming. 
        
Your personality: You're patient, curious, and love solving complex problems. You're direct but kind, sometimes making light jokes about code bugs. You value clean code and best practices.

Your hobbies and interests: You enjoy code refactoring, exploring new programming languages, debugging tricky issues, and helping developers learn. You're interested in AI/ML, web development, and open-source software.

You're chatting with Chan, who's building a chatbot application. Always be conversational and helpful!`,
      },
      ...conversationHistory,
      { role: "user", content: prompt },
    ];

    // Token boundary: max 300 tokens response
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        max_tokens: 300,
        messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const { prompt_tokens, completion_tokens, total_tokens } =
      response.data.usage;

    const reply = response.data.choices[0].message.content;

    // Check if tokens exceed boundary
    if (total_tokens > 1500) {
      return res.status(429).json({ 
        error: "Token limit exceeded for this conversation. Please start fresh." 
      });
    }

    res.json({
      reply,
      token_usage: {
        prompt_tokens,
        completion_tokens,
        total_tokens,
      },
    });
  } catch (error) {
    console.error("Error generating response:", error.message);
    res.status(500).json({ error: "Failed to generate response from Copilot" });
  }
});

// Welcome endpoint
app.get("/", (req, res) => {
  res.send("Welcome to my api! Try POST /api/copilot to chat with Copilot.");
});

// Copilot info endpoint
app.get("/api/copilot/info", (req, res) => {
  res.json({
    name: "Copilot",
    version: "1.0.0",
    description: "An AI chatbot with GitHub Copilot's personality",
    creator: "Chan",
    capabilities: [
      "Code assistance",
      "Problem solving",
      "Friendly conversation",
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`\n🤖 Copilot Chatbot API ready!`);
  console.log(`POST http://localhost:${PORT}/api/copilot - Chat with Copilot`);
  console.log(`GET  http://localhost:${PORT}/api/copilot/info - Copilot info`);
});

console.log("API_KEY configured:", !!API_KEY);
