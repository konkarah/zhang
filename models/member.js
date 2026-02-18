const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./members.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    membership_tier TEXT NOT NULL,
    status TEXT NOT NULL,
    joined_date TEXT NOT NULL,
    expiry_date TEXT NOT NULL
  )`);
});

module.exports = db;
