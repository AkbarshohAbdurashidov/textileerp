const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM customers ORDER BY id').all());
});

router.post('/', (req, res) => {
  const { name, company, phone, city } = req.body;
  const result = db.prepare(
    'INSERT INTO customers (name, company, phone, city) VALUES (?, ?, ?, ?)'
  ).run(name, company || '', phone || '', city || '');
  res.status(201).json(db.prepare('SELECT * FROM customers WHERE id = ?').get(result.lastInsertRowid));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
