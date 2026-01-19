import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create or open the database
const dbPath = path.join(__dirname, "chatbot.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Create tables if they don't exist
function initializeDatabase() {
  // Topics table - stores main knowledge base entries
  db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Topic content table - stores the actual content
  db.exec(`
    CREATE TABLE IF NOT EXISTS topic_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL UNIQUE,
      content TEXT NOT NULL,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    )
  `);

  // Topic tags table - stores searchable keywords
  db.exec(`
    CREATE TABLE IF NOT EXISTS topic_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      tag TEXT NOT NULL,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
      UNIQUE(topic_id, tag)
    )
  `);

  // Create an index for faster tag searches
  db.exec(`CREATE INDEX IF NOT EXISTS idx_topic_tags_tag ON topic_tags(tag)`);
}

// Seed the database with initial data
function seedDatabase() {
  const seedData = [
    {
      name: "Chatbot Information",
      description: "Information about Sigmund chatbot",
      tags: [],
      content:
        "You are Sigmund, a programming chatbot created by Daiben Sanchez, dedicated to addressing Sigma School or tech-related issues. Always respond in a friendly, casual manner.",
    },
    {
      name: "Office Information",
      description: "Sigma School office location",
      tags: ["location", "address", "office"],
      content: "Sigma School, located in Puchong, Selangor, Malaysia",
    },
    {
      name: "Course Offerings",
      description: "Available courses and programs",
      tags: [
        "course",
        "offer",
        "program",
        "programme",
        "online",
        "offline",
        "self-paced",
        "duration",
        "length",
        "months",
        "weeks",
        "days",
      ],
      content:
        "Offers Software Development bootcamps: an online self-paced course (RM 9997), a 3-month online full-time course (RM 14997), and a 3-month offline full-time course (RM 24997), with monthly payment options available.",
    },
    {
      name: "Program Details",
      description: "Details about program content and structure",
      tags: [
        "program",
        "content",
        "doing",
        "activities",
        "quizzes",
        "modules",
        "module",
        "learning",
        "assesments",
        "project",
        "projects",
      ],
      content:
        "The program includes 4 modules, 64 lessons, 100+ challenges, 10+ assessments, and 25 projects, with activities like destructing and recreating Clone Projects.",
    },
    {
      name: "Perks in Enrolling",
      description: "Benefits and guarantees for students",
      tags: [
        "money-back",
        "guarantee",
        "job",
        "secure",
        "employment",
        "placement",
        "assistance",
      ],
      content:
        "They provide a money-back guarantee if graduates fail to secure a job. Accommodation assistance is also offered.",
    },
    {
      name: "Organizational Structure",
      description: "Team members and staff information",
      tags: [
        "team",
        "members",
        "staff",
        "deric",
        "yee",
        "ceo",
        "owner",
        "founder",
        "creator",
        "ken",
        "jin",
        "chen",
        "operations",
        "head",
        "daiben",
        "sanchez",
        "curriculum",
        "developer",
        "instructor",
      ],
      content:
        "Deric Yee is the CEO of Sigma School. Ken Jin Chen is head of Operations. Daiben Sanchez is a Curriculum Developer and Instructor.",
    },
  ];

  // Check if data already exists
  const existingTopics = db
    .prepare("SELECT COUNT(*) as count FROM topics")
    .get();

  if (existingTopics.count === 0) {
    // Insert seed data
    const insertTopic = db.prepare(
      "INSERT INTO topics (name, description) VALUES (?, ?)",
    );
    const insertContent = db.prepare(
      "INSERT INTO topic_content (topic_id, content) VALUES (?, ?)",
    );
    const insertTag = db.prepare(
      "INSERT INTO topic_tags (topic_id, tag) VALUES (?, ?)",
    );

    seedData.forEach((item) => {
      const topicResult = insertTopic.run(item.name, item.description);
      const topicId = topicResult.lastInsertRowid;

      // Insert content
      insertContent.run(topicId, item.content);

      // Insert tags
      item.tags.forEach((tag) => {
        insertTag.run(topicId, tag);
      });
    });

    console.log("Database seeded with initial data");
  }
}

// Get all topics with their tags and content
function getAllTopics() {
  return db
    .prepare(
      `
    SELECT 
      t.id,
      t.name,
      t.description,
      tc.content,
      GROUP_CONCAT(tt.tag, ' ') as tags
    FROM topics t
    LEFT JOIN topic_content tc ON t.id = tc.topic_id
    LEFT JOIN topic_tags tt ON t.id = tt.topic_id
    GROUP BY t.id
  `,
    )
    .all();
}

// Get topics by keywords/tags
function getTopicsByKeywords(keywords) {
  const placeholders = keywords.map(() => "?").join(",");
  return db
    .prepare(
      `
    SELECT DISTINCT
      t.id,
      t.name,
      t.description,
      tc.content,
      GROUP_CONCAT(tt.tag, ' ') as tags
    FROM topics t
    LEFT JOIN topic_content tc ON t.id = tc.topic_id
    LEFT JOIN topic_tags tt ON t.id = tt.topic_id
    WHERE tt.tag IN (${placeholders})
    GROUP BY t.id
  `,
    )
    .all(...keywords);
}

// Get a specific topic by ID
function getTopicById(id) {
  return db
    .prepare(
      `
    SELECT 
      t.id,
      t.name,
      t.description,
      tc.content,
      GROUP_CONCAT(tt.tag, ' ') as tags
    FROM topics t
    LEFT JOIN topic_content tc ON t.id = tc.topic_id
    LEFT JOIN topic_tags tt ON t.id = tt.topic_id
    WHERE t.id = ?
    GROUP BY t.id
  `,
    )
    .get(id);
}

// Add a new topic
function addTopic(name, description, content, tags = []) {
  const insertTopic = db.prepare(
    "INSERT INTO topics (name, description) VALUES (?, ?)",
  );
  const insertContent = db.prepare(
    "INSERT INTO topic_content (topic_id, content) VALUES (?, ?)",
  );
  const insertTag = db.prepare(
    "INSERT INTO topic_tags (topic_id, tag) VALUES (?, ?)",
  );

  const topicResult = insertTopic.run(name, description);
  const topicId = topicResult.lastInsertRowid;

  insertContent.run(topicId, content);
  tags.forEach((tag) => {
    insertTag.run(topicId, tag);
  });

  return topicId;
}

// Update a topic
function updateTopic(id, name, description, content, tags = []) {
  const updateTopicStmt = db.prepare(
    "UPDATE topics SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
  );
  const updateContentStmt = db.prepare(
    "UPDATE topic_content SET content = ? WHERE topic_id = ?",
  );
  const deleteTagsStmt = db.prepare(
    "DELETE FROM topic_tags WHERE topic_id = ?",
  );
  const insertTagStmt = db.prepare(
    "INSERT INTO topic_tags (topic_id, tag) VALUES (?, ?)",
  );

  updateTopicStmt.run(name, description, id);
  updateContentStmt.run(content, id);
  deleteTagsStmt.run(id);

  tags.forEach((tag) => {
    insertTagStmt.run(id, tag);
  });

  return true;
}

// Delete a topic
function deleteTopic(id) {
  const deleteStmt = db.prepare("DELETE FROM topics WHERE id = ?");
  return deleteStmt.run(id);
}

// Initialize database on import
initializeDatabase();
seedDatabase();

export default db;
export {
  getAllTopics,
  getTopicsByKeywords,
  getTopicById,
  addTopic,
  updateTopic,
  deleteTopic,
};
