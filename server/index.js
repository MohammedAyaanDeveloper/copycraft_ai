const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const PORT = process.env.PORT || 5174;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ ok: true }));

// Credits endpoints
app.get('/api/credits/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const credits = db.getCredits(userId);
    return res.json({ userId, credits });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to get credits' });
  }
});

app.post('/api/credits/:userId/decrement', (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const newCredits = db.decrementCredits(userId, 1);
    return res.json({ userId, credits: newCredits });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to decrement credits' });
  }
});

// History endpoints
app.get('/api/history/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const history = db.getHistory(userId);
    return res.json({ userId, history });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.post('/api/history/:userId', (req, res) => {
  const { userId } = req.params;
  const { content, params } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const item = db.addHistory(userId, content || '', params || {});
    return res.json({ ok: true, item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to add history' });
  }
});

app.listen(PORT, () => {
  console.log(`CopyCraft AI server listening on port ${PORT}`);
});
