let express = require('express');
let router = express.Router();
const db = require('./db');
const { Worker } = require('node:worker_threads');

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
  const cpuTask = () => {
    let cpuSum = 0;
    for (let i = 1; i <= 1000; i++) {
      for (let j = 1; j <= 1000; j++) {
        cpuSum += i + j;
      }
    }
    return cpuSum;
  };
  try {
    await runCpuHeavyTask(cpuTask);
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

function runCpuHeavyTask(taskFn) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      `const { parentPort, workerData } = require('node:worker_threads');
const task = new Function('return (' + workerData + ')')();
parentPort.postMessage(task());`,
      { eval: true, workerData: taskFn.toString() }
    );

    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', code => {
      if (code !== 0) {
        reject(new Error(`CPU worker stopped with exit code ${code}`));
      }
    });
  });
}
