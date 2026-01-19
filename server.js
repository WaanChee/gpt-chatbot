import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import db, { getAllTopics, getTopicsByKeywords } from "./db.js";

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

// Post / generate
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (prompt.length > 300) {
    return res
      .status(400)
      .json({ error: "Prompt exceeds maximum length of 300 characters" });
  }

  const keywords = prompt.toLowerCase().split(" ");

  // Get all topics from database
  const allTopics = getAllTopics();

  // Filter topics by matching keywords with tags
  let systemPrompts = allTopics
    .filter((item) => {
      if (!item.tags) return false;
      const topicTags = item.tags.split(" ");
      return topicTags.some((tag) => keywords.includes(tag));
    })
    .map((item) => item.content);

  // Get chatbot information
  const chatbotInfoTopic = allTopics.find(
    (item) => item.name === "Chatbot Information",
  );
  const chatbotInfo = chatbotInfoTopic ? chatbotInfoTopic.content : "";

  if (chatbotInfo) {
    systemPrompts.unshift(chatbotInfo);
  }

  // If no matching topics found, use all topics
  if (systemPrompts.length === 1 && chatbotInfo) {
    systemPrompts = allTopics.map((item) => item.content);
  }

  console.log(
    "Selected topics:",
    allTopics
      .filter((item) => {
        if (!item.tags) return false;
        const topicTags = item.tags.split(" ");
        return topicTags.some((tag) => keywords.includes(tag));
      })
      .map((item) => item.name),
  );

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: "You are a chatbot. Always respond in casual tone.",
          },
          ...systemPrompts.map((content) => ({ role: "system", content })),
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const { prompt_tokens, completion_tokens, total_tokens } =
      response.data.usage;

    const reply = response.data.choices[0].message.content;
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
    res.status(500).json({ error: "Failed to generate response from OpenAI" });
  }
});

// Asks tell them
// get / welcome to my api
app.get("/", (req, res) => {
  res.send("Welcome to my api!");
});

// Get all topics from database
app.get("/api/topics", (req, res) => {
  try {
    const topics = getAllTopics();
    res.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error.message);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log(API_KEY);
