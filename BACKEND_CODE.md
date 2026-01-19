# Backend Code & Database Files

## 📂 What You Have

All files are in: `c:\Users\ASUS\Downloads\gpt-chatbot\`

### Database Files

- **chatbot.db** - Your SQLite database (36 KB)
- **chatbot.db.backup** - Safety backup

### Backend Code Files

- **db.js** - Database layer (complete)
- **server.js** - Updated API server (complete)
- **view-db.js** - Database inspection utility

### Documentation

- **DATABASE_SETUP.md** - Comprehensive schema & API docs
- **MIGRATION_SUMMARY.md** - Quick start guide
- **BACKEND_CODE.md** - This file

---

## 🗄️ Database Structure

### Three Normalized Tables

```sql
-- Table 1: topics (main index)
CREATE TABLE topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- Table 2: topic_content (1:1 relationship)
CREATE TABLE topic_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL UNIQUE,
  content TEXT NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
)

-- Table 3: topic_tags (1:many relationship)
CREATE TABLE topic_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  UNIQUE(topic_id, tag)
)

-- Index for fast searches
CREATE INDEX idx_topic_tags_tag ON topic_tags(tag)
```

### Current Data

- **6 topics** in database
- **52 tags** across all topics
- **1 chatbot knowledge base entry**

---

## 📝 Backend Files Overview

### 1. db.js - Database Layer

**Exports:**

```javascript
export default db; // Database connection object

// Helper functions
export {
  getAllTopics, // Get all topics with tags
  getTopicsByKeywords, // Search by keywords
  getTopicById, // Get specific topic
  addTopic, // Create new topic
  updateTopic, // Update existing topic
  deleteTopic, // Delete a topic
};
```

**Key Functions:**

- Automatic initialization on import
- Automatic seeding on first run
- Foreign key constraints enabled

### 2. server.js - Express API

**Endpoints:**

#### GET /

```
Response: "Welcome to my api!"
```

#### POST /api/generate

```json
Request:
{
  "prompt": "What courses do you offer?"
}

Response:
{
  "reply": "AI response...",
  "token_usage": {
    "prompt_tokens": 150,
    "completion_tokens": 45,
    "total_tokens": 195
  }
}
```

**How it works:**

1. Receive user prompt
2. Split prompt into keywords
3. Query database for matching tags
4. Pass context + prompt to OpenAI API
5. Return AI response with token usage

#### GET /api/topics

```json
Response:
[
  {
    "id": 1,
    "name": "Chatbot Information",
    "description": "Information about Sigmund chatbot",
    "content": "You are Sigmund...",
    "tags": null
  },
  {
    "id": 2,
    "name": "Office Information",
    "description": "Sigma School office location",
    "content": "Sigma School, located in Puchong...",
    "tags": "address, location, office"
  },
  ...
]
```

### 3. view-db.js - Database Inspector

**Run with:**

```bash
node view-db.js
```

**Output:**

- All topics in the database
- All tags with their associations
- Full topic information with content

---

## 🔄 Data Flow

```
User Input
    ↓
[Express Route: /api/generate]
    ↓
[Parse Keywords: prompt.split(" ")]
    ↓
[Query Database: getTopicsByKeywords(keywords)]
    ↓
[Database Query: SELECT topics WHERE tag IN (keywords)]
    ↓
[Collect Context: topic contents]
    ↓
[OpenAI API Call]
    ↓
[Response with Tokens]
    ↓
User Output
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install better-sqlite3
```

### 2. Run Server

```bash
npm run dev
# or
nodemon server
```

### 3. Test Database

```bash
node view-db.js
```

### 4. Test API

```bash
# Terminal 1: Run server
npm run dev

# Terminal 2: Test endpoint
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is the office location?"}'
```

---

## 📦 Database Backup & Recovery

### Create Backup

```bash
cp chatbot.db chatbot.db.backup
```

### Restore from Backup

```bash
cp chatbot.db.backup chatbot.db
```

### Reset Database

```bash
rm chatbot.db
# Restart server - will auto-recreate and seed
npm run dev
```

---

## 🔧 Extending the Database

### Add New Topic

In `server.js` or separate script:

```javascript
import { addTopic } from "./db.js";

addTopic(
  "New Feature Title",
  "Description of feature",
  "Full content and description...",
  ["keyword1", "keyword2", "keyword3"],
);
```

### Add New Endpoint

In `server.js`:

```javascript
app.post("/api/topics", (req, res) => {
  const { name, description, content, tags } = req.body;
  try {
    const id = addTopic(name, description, content, tags);
    res.json({ success: true, id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 📊 Data Statistics

| Metric          | Count |
| --------------- | ----- |
| Topics          | 6     |
| Tags            | 52    |
| Content Entries | 6     |
| Database Size   | 36 KB |

### Topics Breakdown

1. Chatbot Information - 0 tags
2. Office Information - 3 tags
3. Course Offerings - 12 tags
4. Program Details - 11 tags
5. Perks in Enrolling - 7 tags
6. Organizational Structure - 19 tags

---

## 🎯 Migration Checklist

- ✅ Database created (3 tables, indexed)
- ✅ Data seeded from original data.js
- ✅ server.js updated to use database
- ✅ All endpoints working
- ✅ Backup created
- ✅ Documentation complete
- ✅ No errors in code

---

## ⚠️ Important Notes

1. **Database File Required** - chatbot.db must exist to run server
2. **first Run** - Database auto-initializes and seeds
3. **Keep Backup** - chatbot.db.backup for safety
4. **Dependencies** - better-sqlite3 must be installed
5. **Environment** - API_KEY needed for OpenAI (in .env file)

---

## 🆘 Troubleshooting

**Issue: "Module not found: better-sqlite3"**

```bash
npm install better-sqlite3
```

**Issue: "Database locked"**

- Ensure only one process is accessing the database
- Check for other running instances of server.js

**Issue: "Tags not working in search"**

- Run `node view-db.js` to verify tags are in database
- Check keyword split logic (space-separated)

**Issue: "Old data showing"**

- Delete chatbot.db
- Restart server
- Database will recreate with seed data

---

## 📞 Support Files

- **db.js** - Full database setup (250+ lines)
- **server.js** - Complete API implementation (145 lines)
- **view-db.js** - Database browser utility (60 lines)
- **DATABASE_SETUP.md** - Detailed schema documentation
- **MIGRATION_SUMMARY.md** - Quick reference guide

---

## ✨ Benefits of This Setup

✅ **Scalable** - Handle unlimited topics and tags  
✅ **Normalized** - Reduced data redundancy  
✅ **Indexed** - Fast searches via tag index  
✅ **Persistent** - Data survives server restarts  
✅ **Flexible** - Easy to add/update/delete  
✅ **Professional** - Industry-standard approach  
✅ **Maintainable** - Clean separation of concerns

---

**Your chatbot is now running on a production-ready database! 🎉**
