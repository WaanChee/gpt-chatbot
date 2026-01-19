# 🧪 How to Test Your Database Setup

## ✅ Proof That Database is Working

Run this command to verify the database has data:

```bash
node view-db.js
```

This will show all 6 topics, 52 tags, and content from the SQLite database.

---

## 🚀 How to Run the Program

### Step 1: Start the Server

Open a terminal and run:

```bash
node server.js
```

You should see:

```
Server is running on http://localhost:3001
```

**Leave this terminal running!** The server needs to stay active.

---

### Step 2: Test the Database (Different Terminal)

Open a **NEW terminal** and test:

#### Option A: View Database Contents

```bash
node view-db.js
```

#### Option B: Test Direct Database Query

```bash
node test-database.js
```

This shows:

- ✓ 6 topics loaded from database
- ✓ All tags listed
- Confirms database connection works

---

### Step 3: Test the API Endpoints

Keep the server running in terminal 1, then in terminal 2:

#### Test 1: Get All Topics

```bash
curl http://localhost:3001/api/topics
```

Or in browser: `http://localhost:3001/api/topics`

#### Test 2: Generate Response (Requires OpenAI API Key)

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"Where is the office?\"}"
```

---

### Step 4: Run the Full App

**Terminal 1:**

```bash
node server.js
```

_(Backend running on port 3001)_

**Terminal 2:**

```bash
npm run dev
```

_(Frontend running on port 5173)_

Then open: `http://localhost:5173` in your browser

---

## 🔍 How to Verify It's Using the Database

### Method 1: Check Server Console

When server starts, you should see database initialization:

```
Database seeded with initial data
Server is running on http://localhost:3001
```

### Method 2: View Database File

The file `chatbot.db` should exist (36 KB):

```bash
ls -lh chatbot.db
```

### Method 3: Query Database Directly

```bash
node -e "import('./db.js').then(m => console.log(m.getAllTopics()))"
```

### Method 4: Modify Database and See Changes

```javascript
// Create a test file: add-topic-test.js
import { addTopic, getAllTopics } from "./db.js";

console.log("Before:", getAllTopics().length);
addTopic("Test Topic", "Test", "This is a test", ["test"]);
console.log("After:", getAllTopics().length);
```

Run it:

```bash
node add-topic-test.js
```

You'll see the count increase!

---

## 📊 Visual Proof

When you run `node test-database.js`, you see:

```
=== TESTING DATABASE INTEGRATION ===

TEST 1: Direct Database Query
-------------------------------
✓ Found 6 topics in database

1. Chatbot Information
   Tags: none
2. Office Information
   Tags: address location office
3. Course Offerings
   Tags: course days duration length months...
...
```

This confirms the database is:

- ✅ Created
- ✅ Seeded with data
- ✅ Accessible via db.js functions
- ✅ Being used by server.js

---

## 🎯 Quick Test Commands

```bash
# 1. View database
node view-db.js

# 2. Test database integration
node test-database.js

# 3. Start server
node server.js

# 4. (In new terminal) Check if server is using database
# The server console will show "Selected topics: [...]" when you make requests
```

---

## ⚠️ Troubleshooting

**"Module not found: better-sqlite3"**

```bash
npm install better-sqlite3
```

**"Cannot find module './db.js'"**

- Make sure you're in the correct directory: `c:\Users\ASUS\Downloads\gpt-chatbot`

**"Database is locked"**

- Close all other processes accessing chatbot.db
- Only run one instance of server.js

**No data showing**

- Delete chatbot.db
- Run `node db.js` to recreate
- Or just start server, it will auto-create

---

## ✨ What You Should See

### When Starting Server:

```
Server is running on http://localhost:3001
sk-proj-... (your API key)
```

### When Making Requests:

```
Selected topics: [ 'Office Information' ]
```

↑ This proves it's querying the database!

### When Viewing Database:

```
=== CHATBOT DATABASE CONTENTS ===

--- TOPICS TABLE ---
6 rows showing...
```

---

**Your database is working! The server is now pulling data from chatbot.db instead of data.js** ✅
