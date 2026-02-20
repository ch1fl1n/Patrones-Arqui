let express = require('express');
let router = express.Router();
const db = require('./db');

/**
 * POST /todos
 * Body: { value: string }
 * Saves a to-do value into PostgreSQL and returns the created item.
 */
router.post('/todos', async function(req, res) {
  const { value } = req.body || {};
  if (typeof value !== 'string' || value.trim() === '') {
    return res.status(422).json({ error: 'Valor inválido', details: 'El valor debe ser una cadena no vacía' });
  }
  const trimmed = value.trim();
  if (trimmed.length > 500) {
    return res.status(422).json({ error: 'Valor inválido', details: 'El valor debe tener como máximo 500 caracteres' });
  }
  // removed accidental debug/benchmark loop that caused high CPU and runtime errors
  try {
    const result = await db.query(
      'INSERT INTO todos(value) VALUES($1) RETURNING id, value, created_at',
      [trimmed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error de base de datos al insertar el todo:', err);
    // devolver un mensaje de error seguro a los clientes
    return res.status(500).json({ error: 'Error de base de datos' });
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
  res.render('index', { title: 'Express' }); // Puede cambiar el título si es necesario
});

// simple health check for k8s liveness
router.get('/healthz', function(req, res) {
  res.sendStatus(200); // Saludable
});

module.exports = router;
