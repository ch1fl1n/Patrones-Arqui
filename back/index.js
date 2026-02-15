let express = require('express');
let router = express.Router();
const db = require('./db');

/**
 * POST /todos
 * Body: { value: string }
 * Saves a to-do value into PostgreSQL and returns the created item.
 */
router.post('/todos', async function(req, res, next) {
  const { value } = req.body || {};
  if (typeof value !== 'string' || value.trim() === '') {
    return res.status(422).json({ error: 'Invalid value', details: 'value must be a non-empty string' });
  }
  const trimmed = value.trim();
  if (trimmed.length > 500) {
    return res.status(422).json({ error: 'Invalid value', details: 'value must be at most 500 characters' });
  }
  try {
    const result = await db.query(
      'INSERT INTO todos(value) VALUES($1) RETURNING id, value, created_at',
      [trimmed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB error inserting todo:', err);
    // return a safe error message to clients
    return res.status(500).json({ error: 'Database error' });
  }
});

/**
 * GET /todos
 * Returns all saved to-dos from PostgreSQL
 */
router.get('/todos', async function(req, res, next) {
  try {
    const result = await db.query('SELECT id, value, created_at FROM todos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// simple health check for k8s liveness
router.get('/healthz', function(req, res) {
  res.sendStatus(200);
});

module.exports = router;
