-- Chatbot Database Schema
-- SQLite3 - Created automatically by db.js
-- Database file: chatbot.db

-- ==========================================
-- TABLE 1: TOPICS (Main Index)
-- ==========================================
CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample data (6 records)
-- id | name | description
-- 1  | Chatbot Information | Information about Sigmund chatbot
-- 2  | Office Information | Sigma School office location
-- 3  | Course Offerings | Available courses and programs
-- 4  | Program Details | Details about program content and structure
-- 5  | Perks in Enrolling | Benefits and guarantees for students
-- 6  | Organizational Structure | Team members and staff information


-- ==========================================
-- TABLE 2: TOPIC_CONTENT (1:1 Relationship)
-- ==========================================
CREATE TABLE IF NOT EXISTS topic_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL UNIQUE,
  content TEXT NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- Sample data (6 records)
-- topic_id 1: "You are Sigmund, a programming chatbot created by Daiben Sanchez..."
-- topic_id 2: "Sigma School, located in Puchong, Selangor, Malaysia"
-- topic_id 3: "Offers Software Development bootcamps: an online self-paced course..."
-- topic_id 4: "The program includes 4 modules, 64 lessons, 100+ challenges..."
-- topic_id 5: "They provide a money-back guarantee if graduates fail to secure a job..."
-- topic_id 6: "Deric Yee is the CEO of Sigma School. Ken Jin Chen is head of Operations..."


-- ==========================================
-- TABLE 3: TOPIC_TAGS (1:Many Relationship)
-- ==========================================
CREATE TABLE IF NOT EXISTS topic_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  UNIQUE(topic_id, tag)
);

-- Sample data (52 records total)
-- Topic 2 tags (3): 'location', 'address', 'office'
-- Topic 3 tags (12): 'course', 'offer', 'program', 'programme', 'online', 'offline', 'self-paced', 'duration', 'length', 'months', 'weeks', 'days'
-- Topic 4 tags (11): 'program', 'content', 'doing', 'activities', 'quizzes', 'modules', 'module', 'learning', 'assesments', 'project', 'projects'
-- Topic 5 tags (7): 'money-back', 'guarantee', 'job', 'secure', 'employment', 'placement', 'assistance'
-- Topic 6 tags (19): 'team', 'members', 'staff', 'deric', 'yee', 'ceo', 'owner', 'founder', 'creator', 'ken', 'jin', 'chen', 'operations', 'head', 'daiben', 'sanchez', 'curriculum', 'developer', 'instructor'


-- ==========================================
-- INDEX FOR FAST SEARCHES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_topic_tags_tag ON topic_tags(tag);

-- This index allows fast searches when querying by tag keywords
-- Example: SELECT * FROM topic_tags WHERE tag = 'course'


-- ==========================================
-- QUERIES & EXAMPLES
-- ==========================================

-- Get all topics with their tags and content
-- SELECT 
--   t.id,
--   t.name,
--   t.description,
--   tc.content,
--   GROUP_CONCAT(tt.tag, ', ') as tags
-- FROM topics t
-- LEFT JOIN topic_content tc ON t.id = tc.topic_id
-- LEFT JOIN topic_tags tt ON t.id = tt.topic_id
-- GROUP BY t.id;

-- Search topics by keyword tags
-- SELECT DISTINCT
--   t.id,
--   t.name,
--   t.description,
--   tc.content,
--   GROUP_CONCAT(tt.tag, ', ') as tags
-- FROM topics t
-- LEFT JOIN topic_content tc ON t.id = tc.topic_id
-- LEFT JOIN topic_tags tt ON t.id = tt.topic_id
-- WHERE tt.tag IN ('course', 'online')
-- GROUP BY t.id;

-- Get specific topic by ID
-- SELECT 
--   t.id,
--   t.name,
--   t.description,
--   tc.content,
--   GROUP_CONCAT(tt.tag, ', ') as tags
-- FROM topics t
-- LEFT JOIN topic_content tc ON t.id = tc.topic_id
-- LEFT JOIN topic_tags tt ON t.id = tt.topic_id
-- WHERE t.id = 3
-- GROUP BY t.id;

-- Count topics by number of tags
-- SELECT 
--   t.name,
--   COUNT(tt.id) as tag_count
-- FROM topics t
-- LEFT JOIN topic_tags tt ON t.id = tt.topic_id
-- GROUP BY t.id
-- ORDER BY tag_count DESC;

-- Find topics with specific tag
-- SELECT 
--   t.name,
--   t.description,
--   COUNT(tt.id) as total_tags
-- FROM topics t
-- LEFT JOIN topic_tags tt ON t.id = tt.topic_id
-- WHERE t.id IN (SELECT DISTINCT topic_id FROM topic_tags WHERE tag = 'course')
-- GROUP BY t.id;


-- ==========================================
-- DATABASE STATISTICS
-- ==========================================
-- Total Topics: 6
-- Total Tags: 52
-- Total Content Entries: 6
-- Database Size: ~36 KB
-- 
-- Tag Distribution:
-- - Chatbot Information: 0 tags
-- - Office Information: 3 tags
-- - Course Offerings: 12 tags
-- - Program Details: 11 tags
-- - Perks in Enrolling: 7 tags
-- - Organizational Structure: 19 tags


-- ==========================================
-- CONSTRAINTS & RELATIONSHIPS
-- ==========================================
-- 
-- Foreign Keys:
-- - topic_content.topic_id → topics.id (1:1, CASCADE DELETE)
-- - topic_tags.topic_id → topics.id (1:Many, CASCADE Delete)
--
-- Unique Constraints:
-- - topics.name (each topic name is unique)
-- - topic_content.topic_id (each topic has one content entry)
-- - topic_tags(topic_id, tag) (no duplicate tags per topic)
--
-- Indexes:
-- - idx_topic_tags_tag (for fast tag searches)


-- ==========================================
-- PRAGMAS (Configuration)
-- ==========================================
-- PRAGMA foreign_keys = ON;  (Enforces foreign key constraints)


-- ==========================================
-- VERSION & NOTES
-- ==========================================
-- Created: January 19, 2026
-- Last Updated: January 19, 2026
-- Database: chatbot.db (36 KB)
-- Backup: chatbot.db.backup
--
-- This schema replaces the static data.js file with a normalized
-- SQLite database for better scalability and query performance.
