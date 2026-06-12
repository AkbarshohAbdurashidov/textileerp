const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  // customer_name aliased as "customer" so existing admin render.js works unchanged
  res.json(db.prepare('SELECT *, customer_name as customer FROM orders ORDER BY rowid DESC').all());
});

router.post('/', (req, res) => {
  const { customer_name, customer_phone, customer_address, product, qty, total, status, note } = req.body;
  const count = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;
  const id = 'ORD-' + String(count + 1).padStart(3, '0');
  const date = new Date().toISOString().split('T')[0];

  const insertAndUpdate = db.transaction(() => {
    db.prepare(`
      INSERT INTO orders (id, customer_name, customer_phone, customer_address, product, qty, total, date, status, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, customer_name, customer_phone || '', customer_address || '', product, qty, total, date, status || 'yangi', note || '');

    db.prepare(`UPDATE products SET stock = MAX(0, stock - ?) WHERE name = ?`).run(qty, product);
  });

  insertAndUpdate();
  res.status(201).json(db.prepare('SELECT *, customer_name as customer FROM orders WHERE id = ?').get(id));
});

router.patch('/:id', (req, res) => {
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json(db.prepare('SELECT *, customer_name as customer FROM orders WHERE id = ?').get(req.params.id));
});

module.exports = router;
