// Script to view database contents
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "chatbot.db");
const db = new Database(dbPath);

console.log("\n=== CHATBOT DATABASE CONTENTS ===\n");

console.log("--- TOPICS TABLE ---");
const topics = db.prepare("SELECT * FROM topics").all();
console.table(topics);

console.log("\n--- TOPIC CONTENT TABLE ---");
const content = db.prepare("SELECT * FROM topic_content").all();
content.forEach((row) => {
  console.log(`Topic ID: ${row.topic_id}`);
  console.log(`Content: ${row.content}\n`);
});

console.log("\n--- TOPIC TAGS TABLE ---");
const tags = db.prepare("SELECT * FROM topic_tags").all();
console.table(tags);

console.log("\n--- FULL TOPICS WITH TAGS AND CONTENT ---");
const fullTopics = db
  .prepare(
    `
  SELECT 
    t.id,
    t.name,
    t.description,
    tc.content,
    GROUP_CONCAT(tt.tag, ', ') as tags
  FROM topics t
  LEFT JOIN topic_content tc ON t.id = tc.topic_id
  LEFT JOIN topic_tags tt ON t.id = tt.topic_id
  GROUP BY t.id
`,
  )
  .all();

fullTopics.forEach((topic) => {
  console.log(`\nID: ${topic.id}`);
  console.log(`Name: ${topic.name}`);
  console.log(`Description: ${topic.description}`);
  console.log(`Tags: ${topic.tags}`);
  console.log(`Content: ${topic.content}`);
});

db.close();
