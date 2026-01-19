# Database Setup Documentation

## Overview

The chatbot now uses a **SQLite database** instead of the `data.js` file. This provides better scalability, persistence, and query capabilities.

## Database Schema

### Tables

#### 1. **topics**

Stores the main knowledge base entries.

```
- id (INTEGER, PRIMARY KEY)
- name (TEXT, UNIQUE) - Name/title of the topic
- description (TEXT) - Brief description
- created_at (DATETIME) - Timestamp of creation
- updated_at (DATETIME) - Timestamp of last update
```

#### 2. **topic_content**

Stores the full content for each topic.

```
- id (INTEGER, PRIMARY KEY)
- topic_id (INTEGER, FOREIGN KEY) - References topics.id
- content (TEXT) - Full content/body text
```

#### 3. **topic_tags**

Stores searchable keywords associated with topics.

```
- id (INTEGER, PRIMARY KEY)
- topic_id (INTEGER, FOREIGN KEY) - References topics.id
- tag (TEXT) - Individual keyword/tag
```

### Relationships

- One topic can have one content entry (1:1)
- One topic can have many tags (1:N)
- Indexes created on `topic_tags.tag` for fast searches

## Files

### New Files Created

1. **db.js** - Database initialization and helper functions
   - `initializeDatabase()` - Creates tables if they don't exist
   - `seedDatabase()` - Populates initial data
   - `getAllTopics()` - Retrieves all topics with tags and content
   - `getTopicsByKeywords()` - Searches topics by tag keywords
   - `getTopicById()` - Gets a specific topic
   - `addTopic()` - Adds new topic to database
   - `updateTopic()` - Updates existing topic
   - `deleteTopic()` - Deletes a topic

2. **chatbot.db** - SQLite database file (created automatically)

3. **view-db.js** - Helper script to inspect database contents
   ```bash
   node view-db.js
   ```

### Modified Files

1. **server.js**
   - Replaced `import data from "./data.js"` with database imports
   - Updated `/api/generate` endpoint to query database instead of JSON array
   - Added `/api/topics` endpoint to retrieve all topics from database

## How It Works

### Keyword Matching

When a user sends a prompt to `/api/generate`:

1. The prompt is split into keywords
2. The database is queried for topics with matching tags
3. If no matches found, all topics are used
4. Matched content is passed to OpenAI's API as context

### Example Query

```javascript
const keywords = prompt.toLowerCase().split(" ");
const topics = getTopicsByKeywords(keywords);
```

## Current Data

The database is pre-populated with 6 topics from the original data.js:

1. **Chatbot Information** - Sigmund's identity (no tags)
2. **Office Information** - Location details (tags: location, address, office)
3. **Course Offerings** - Program options and pricing
4. **Program Details** - Curriculum structure and content
5. **Perks in Enrolling** - Benefits and guarantees
6. **Organizational Structure** - Team members

## API Endpoints

### GET /

Welcome message

### POST /api/generate

Generate a response from the chatbot

```json
{
  "prompt": "What courses do you offer?"
}
```

### GET /api/topics

Retrieve all topics from the database

```json
[
  {
    "id": 1,
    "name": "Chatbot Information",
    "description": "...",
    "content": "...",
    "tags": "tag1 tag2 tag3"
  }
]
```

## Managing the Database

### Add a New Topic

```javascript
import { addTopic } from "./db.js";

addTopic("Topic Name", "Description", "Full content text", [
  "tag1",
  "tag2",
  "tag3",
]);
```

### Update a Topic

```javascript
import { updateTopic } from "./db.js";

updateTopic(topicId, "New Name", "New Description", "New content", [
  "newtag1",
  "newtag2",
]);
```

### Delete a Topic

```javascript
import { deleteTopic } from "./db.js";

deleteTopic(topicId);
```

### View All Topics

```bash
node view-db.js
```

## Benefits Over JSON File

✅ **Scalability** - Handle large amounts of data efficiently  
✅ **Query Flexibility** - Complex searches and filtering  
✅ **Data Persistence** - Permanent storage across sessions  
✅ **Concurrent Access** - Multiple simultaneous queries  
✅ **Data Integrity** - Foreign key constraints  
✅ **Indexed Searches** - Fast tag-based lookups  
✅ **Easy Management** - Add/update/delete topics programmatically

## Dependencies

- `better-sqlite3` - Synchronous SQLite3 bindings for Node.js

Install with:

```bash
npm install better-sqlite3
```

## Troubleshooting

### Database Not Found

Delete `chatbot.db` and restart the server. It will be recreated and seeded automatically.

### Tags Not Working

Ensure tags are stored as individual entries in the `topic_tags` table, separated during insertion.

### Slow Queries

The tag index should be used automatically. Verify with:

```bash
node view-db.js
```

## Future Enhancements

- Add pagination to `/api/topics`
- Implement topic edit/delete endpoints with authentication
- Add logging/history table for analytics
- Export database to CSV/JSON for backups
- Advanced search filters
