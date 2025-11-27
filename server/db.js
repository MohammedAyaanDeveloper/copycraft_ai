const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const dotenv = require('dotenv');

dotenv.config();

const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, 'data.sqlite');
const DAILY_CREDITS = parseInt(process.env.DAILY_CREDITS || '10', 10);

// ensure folder exists
const dir = path.dirname(DB_FILE);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_FILE);

// Initialize tables
db.pragma('journal_mode = WAL');
db.prepare(`
  CREATE TABLE IF NOT EXISTS user_credits (
    userId TEXT PRIMARY KEY,
    credits INTEGER NOT NULL,
    lastReset TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS history (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    content TEXT,
    params TEXT,
    timestamp INTEGER NOT NULL
  )
`).run();

function _today() {
  return new Date().toISOString().slice(0, 10);
}

function ensureUserCredits(userId) {
  const row = db.prepare('SELECT * FROM user_credits WHERE userId = ?').get(userId);
  const today = _today();
  if (!row) {
    db.prepare('INSERT INTO user_credits (userId, credits, lastReset) VALUES (?, ?, ?)').run(userId, DAILY_CREDITS, today);
    return { userId, credits: DAILY_CREDITS, lastReset: today };
  }
  if (row.lastReset !== today) {
    db.prepare('UPDATE user_credits SET credits = ?, lastReset = ? WHERE userId = ?').run(DAILY_CREDITS, today, userId);
    return { userId, credits: DAILY_CREDITS, lastReset: today };
  }
  return { userId, credits: row.credits, lastReset: row.lastReset };
}

function getCredits(userId) {
  const u = ensureUserCredits(userId);
  return u.credits;
}

function decrementCredits(userId, by = 1) {
  const u = ensureUserCredits(userId);
  const newCredits = Math.max(0, u.credits - by);
  db.prepare('UPDATE user_credits SET credits = ? WHERE userId = ?').run(newCredits, userId);
  return newCredits;
}

function getHistory(userId) {
  const rows = db.prepare('SELECT id, content, params, timestamp FROM history WHERE userId = ? ORDER BY timestamp DESC').all(userId);
  return rows.map(r => ({ ...r, params: r.params ? JSON.parse(r.params) : null }));
}

function addHistory(userId, content, params) {
  const { v4: uuidv4 } = require('uuid');
  const id = uuidv4();
  const ts = Date.now();
  db.prepare('INSERT INTO history (id, userId, content, params, timestamp) VALUES (?, ?, ?, ?, ?)').run(id, userId, content, JSON.stringify(params || {}), ts);
  return { id, userId, content, params, timestamp: ts };
}

module.exports = {
  getCredits,
  decrementCredits,
  getHistory,
  addHistory,
  ensureUserCredits,
  DAILY_CREDITS
};
