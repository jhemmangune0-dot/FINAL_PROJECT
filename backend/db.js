const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    }).then(async (db) => {
      // Initialize tables
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'Other',
            status TEXT DEFAULT 'Logged',
            logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS ai_responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER,
            response_text TEXT NOT NULL,
            sentiment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
        );
        
        INSERT OR IGNORE INTO users (id, username, password) VALUES (1, 'student', 'hashed_pwd');
      `);
      return db;
    });
  }
  return dbPromise;
}

module.exports = { getDb };
