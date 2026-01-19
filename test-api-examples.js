#!/usr/bin/env node

/**
 * Database Management & Testing Examples
 * Run individual sections to test your chatbot API and database
 */

import {
  getAllTopics,
  getTopicsByKeywords,
  getTopicById,
  addTopic,
  updateTopic,
  deleteTopic,
} from "./db.js";
import axios from "axios";

const API_URL = "http://localhost:3001";

// ======================
// DATABASE EXAMPLES
// ======================

console.log("\n📚 DATABASE EXAMPLES\n");

// Example 1: Get all topics
console.log("1️⃣  Getting all topics from database:");
const allTopics = getAllTopics();
console.log(`Found ${allTopics.length} topics:\n`);
allTopics.forEach((topic) => {
  console.log(
    `   • ${topic.name} (${topic.tags ? topic.tags.split(" ").length : 0} tags)`,
  );
});

// Example 2: Search by keywords
console.log("\n2️⃣  Searching by keywords 'course' and 'online':");
const searchResults = getTopicsByKeywords(["course", "online"]);
console.log(`Found ${searchResults.length} matching topics:`);
searchResults.forEach((topic) => {
  console.log(`   • ${topic.name}`);
});

// Example 3: Get specific topic by ID
console.log("\n3️⃣  Getting specific topic (ID: 3):");
const topic = getTopicById(3);
if (topic) {
  console.log(`   Name: ${topic.name}`);
  console.log(`   Tags: ${topic.tags}`);
  console.log(`   Content: ${topic.content.substring(0, 60)}...`);
}

// Example 4: Add new topic (uncomment to use)
console.log("\n4️⃣  Example: Adding a new topic (disabled - uncomment to use):");
console.log(`
// addTopic(
//   "Popular Misconceptions",
//   "Common myths about the program",
//   "Many students think that...",
//   ["myth", "misconception", "faq", "learning"]
// );
`);

// ======================
// API EXAMPLES
// ======================

console.log("\n🌐 API EXAMPLES\n");

// Example 5: Test API endpoints with async function
async function testAPI() {
  try {
    // 5A: Get welcome message
    console.log("5️⃣A GET / (Welcome):");
    const welcome = await axios.get(`${API_URL}/`);
    console.log(`   Response: ${welcome.data}`);

    // 5B: Get all topics via API
    console.log("\n5️⃣B GET /api/topics:");
    const topics = await axios.get(`${API_URL}/api/topics`);
    console.log(`   Retrieved ${topics.data.length} topics from API`);

    // 5C: Generate chatbot response (requires API_KEY in .env)
    console.log("\n5️⃣C POST /api/generate:");
    console.log("   Sending prompt: 'What courses do you offer?'");

    try {
      const response = await axios.post(`${API_URL}/api/generate`, {
        prompt: "What courses do you offer?",
      });

      console.log(`   ✅ Response received`);
      console.log(`   Tokens used: ${response.data.token_usage.total_tokens}`);
      console.log(`   Reply: ${response.data.reply.substring(0, 100)}...`);
    } catch (apiError) {
      if (apiError.response?.status === 500) {
        console.log("   ⚠️  API key not configured or OpenAI error");
        console.log("   (This is expected if .env API_KEY is not set)");
      } else {
        throw apiError;
      }
    }
  } catch (error) {
    console.log(`\n   ⚠️  API tests require server running at ${API_URL}`);
    console.log(`   Start server with: npm run dev`);
  }
}

// ======================
// TEST DATA
// ======================

console.log("\n📋 TEST DATA REFERENCE\n");

const testQueries = [
  {
    prompt: "What courses do you offer?",
    expected: "Should match 'course', 'offer' tags from Course Offerings",
  },
  {
    prompt: "Where is the office located?",
    expected: "Should match 'location' tag from Office Information",
  },
  {
    prompt: "Tell me about the program structure",
    expected: "Should match 'program', 'modules' tags from Program Details",
  },
  {
    prompt: "Who is the CEO?",
    expected: "Should match 'ceo' tag from Organizational Structure",
  },
  {
    prompt: "What's the money-back guarantee?",
    expected: "Should match 'money-back', 'guarantee' tags from Perks",
  },
];

console.log("Test prompts for /api/generate endpoint:\n");
testQueries.forEach((test, i) => {
  console.log(`${i + 1}. "${test.prompt}"`);
  console.log(`   Expected: ${test.expected}\n`);
});

// ======================
// CURL EXAMPLES
// ======================

console.log("\n💻 CURL COMMAND EXAMPLES\n");

console.log(`1. Get all topics:
   curl ${API_URL}/api/topics

2. Generate response:
   curl -X POST ${API_URL}/api/generate \\
     -H "Content-Type: application/json" \\
     -d '{"prompt": "What are the course fees?"}'

3. Test welcome endpoint:
   curl ${API_URL}/
`);

// ======================
// RUN API TESTS (if server is running)
// ======================

console.log("\n🧪 RUNNING API TESTS...\n");
testAPI()
  .then(() => {
    console.log("\n✅ Examples complete!\n");
    console.log("💡 Tips:");
    console.log("   • Database file: chatbot.db");
    console.log("   • Start server: npm run dev");
    console.log("   • View database: node view-db.js");
    console.log("   • See docs: DATABASE_SETUP.md");
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
