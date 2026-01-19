// Test script to verify database is being used
import axios from "axios";
import { getAllTopics } from "./db.js";

console.log("\n=== TESTING DATABASE INTEGRATION ===\n");

// Test 1: Direct database query
console.log("TEST 1: Direct Database Query");
console.log("-------------------------------");
const topics = getAllTopics();
console.log(`✓ Found ${topics.length} topics in database\n`);

topics.forEach((topic, index) => {
  console.log(`${index + 1}. ${topic.name}`);
  console.log(`   Tags: ${topic.tags || "none"}`);
});

// Test 2: API endpoint test
console.log("\n\nTEST 2: API Endpoint Test");
console.log("-------------------------------");

async function testAPI() {
  try {
    // Test /api/topics endpoint
    console.log("Testing GET /api/topics...");
    const response = await axios.get("http://localhost:3001/api/topics");
    console.log(`✓ API returned ${response.data.length} topics\n`);

    console.log("First topic from API:");
    console.log(JSON.stringify(response.data[0], null, 2));

    // Test /api/generate with a sample prompt
    console.log("\n\nTesting POST /api/generate...");
    const generateResponse = await axios.post(
      "http://localhost:3001/api/generate",
      { prompt: "Where is the office located?" },
    );

    console.log("✓ Generate endpoint working!");
    console.log(
      `Response: ${generateResponse.data.reply.substring(0, 100)}...`,
    );
    console.log(
      `Tokens used: ${generateResponse.data.token_usage.total_tokens}`,
    );

    console.log("\n✅ All tests passed! Database is connected and working.\n");
  } catch (error) {
    console.error("❌ API Test failed:", error.message);
    console.log("\nMake sure the server is running with: node server.js");
  }
}

testAPI();
