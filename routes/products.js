const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM products ORDER BY id').all());
});

router.post('/', (req, res) => {
  const { sku, name, category, price, stock, status, image_url } = req.body;
  const result = db.prepare(
    'INSERT INTO products (sku, name, category, price, stock, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(sku, name, category, price, stock, status || 'aktiv', image_url || '');
  res.status(201).json(db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.patch('/:id', (req, res) => {
  const { name, category, price, stock, status, image_url } = req.body;
  db.prepare('UPDATE products SET name=?, category=?, price=?, stock=?, status=?, image_url=? WHERE id=?')
    .run(name, category, price, stock, status, image_url ?? '', req.params.id);
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
});

module.exports = router;
