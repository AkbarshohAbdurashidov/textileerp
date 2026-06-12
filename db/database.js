const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'textile.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    sku       TEXT    UNIQUE NOT NULL,
    name      TEXT    NOT NULL,
    category  TEXT    NOT NULL,
    price     INTEGER NOT NULL,
    stock     INTEGER NOT NULL DEFAULT 0,
    status    TEXT    NOT NULL DEFAULT 'aktiv',
    image_url TEXT    DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS customers (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL,
    company TEXT    DEFAULT '',
    phone   TEXT    DEFAULT '',
    city    TEXT    DEFAULT '',
    total   INTEGER DEFAULT 0,
    level   TEXT    DEFAULT 'Bronze'
  );

  CREATE TABLE IF NOT EXISTS orders (
    id               TEXT PRIMARY KEY,
    customer_name    TEXT    NOT NULL,
    customer_phone   TEXT    DEFAULT '',
    customer_address TEXT    DEFAULT '',
    product          TEXT    NOT NULL,
    qty              INTEGER NOT NULL,
    total            INTEGER NOT NULL,
    date             TEXT    NOT NULL,
    status           TEXT    DEFAULT 'yangi',
    note             TEXT    DEFAULT ''
  );
`);

// Migration: add image_url if upgrading from old schema
try { db.exec(`ALTER TABLE products ADD COLUMN image_url TEXT DEFAULT ''`); } catch (_) {}

// Reseed if products have no images (fresh install or old seed data)
const hasImages = db.prepare(`SELECT COUNT(*) as c FROM products WHERE image_url != '' AND image_url IS NOT NULL`).get().c;
if (hasImages === 0) {
  db.exec(`DELETE FROM products; DELETE FROM customers; DELETE FROM orders;`);

  const ins = db.prepare(`
    INSERT INTO products (sku, name, category, price, stock, status, image_url)
    VALUES (@sku, @name, @category, @price, @stock, @status, @image_url)
  `);

  [
    {
      sku: 'SKU-001', name: "Ko'k Jinsi Shim", category: 'Shim',
      price: 185000, stock: 240, status: 'aktiv',
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80&fit=crop'
    },
    {
      sku: 'SKU-002', name: "Oq Ko'ylak (Erkak)", category: "Ko'ylak",
      price: 120000, stock: 180, status: 'aktiv',
      image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80&fit=crop'
    },
    {
      sku: 'SKU-003', name: 'Qora Charm Kurtka', category: 'Kurtka',
      price: 650000, stock: 35, status: 'aktiv',
      image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80&fit=crop'
    },
    {
      sku: 'SKU-004', name: "Ayollar Kuzgi Palto", category: 'Palto',
      price: 480000, stock: 50, status: 'aktiv',
      image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80&fit=crop'
    },
    {
      sku: 'SKU-005', name: 'Sport Futbolka (Unisex)', category: 'Sport kiyim',
      price: 95000, stock: 8, status: 'past-zaxira',
      image_url: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500&q=80&fit=crop'
    },
    {
      sku: 'SKU-006', name: 'Yung\'il Kashmir Sviter', category: "Ko'ylak",
      price: 320000, stock: 60, status: 'aktiv',
      image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80&fit=crop'
    },
    {
      sku: 'SKU-007', name: "Yozgi Ko'ylak (Ayol)", category: "Ko'ylak",
      price: 145000, stock: 120, status: 'aktiv',
      image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&fit=crop'
    },
    {
      sku: 'SKU-008', name: 'Erkaklar Klassik Kostyum', category: 'Kurtka',
      price: 980000, stock: 15, status: 'aktiv',
      image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80&fit=crop'
    },
  ].forEach(p => ins.run(p));
}

module.exports = db;
