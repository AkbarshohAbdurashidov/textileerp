const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_START = Date.now();

app.use(express.json());

// CORS — S3 hosted frontend uchun
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// API routes
app.use('/api/products',  require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/orders',    require('./routes/orders'));

// Status API
app.get('/api/status', (req, res) => {
  const uptimeSec = Math.floor((Date.now() - SERVER_START) / 1000);
  const d = Math.floor(uptimeSec / 86400);
  const h = Math.floor((uptimeSec % 86400) / 3600);
  const m = Math.floor((uptimeSec % 3600) / 60);
  const s = uptimeSec % 60;

  const memTotal = os.totalmem();
  const memUsed  = memTotal - os.freemem();
  const memPct   = Math.round((memUsed / memTotal) * 100);

  const loads = os.loadavg();
  const cpus  = os.cpus().length;
  const cpuPct = Math.min(99, Math.round((loads[0] / cpus) * 100));

  const db = require('./db/database');
  const orderCount   = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;
  const productCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
  const newOrders    = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='yangi'").get().c;

  res.json({
    uptime:   { seconds: uptimeSec, display: `${d}k ${h}s ${m}d ${s}s` },
    cpu:      cpuPct,
    memory:   { pct: memPct, totalGb: (memTotal / 1073741824).toFixed(1), usedGb: (memUsed / 1073741824).toFixed(1) },
    network:  { inKbps: Math.floor(Math.random() * 800 + 200), outKbps: Math.floor(Math.random() * 400 + 100) },
    instances:{ current: cpuPct > 70 ? 4 : cpuPct > 50 ? 3 : 2, min: 2, max: 10 },
    services: { erp: true, crm: true, wms: true, db: true, vpn: true, lb: true },
    stats:    { orders: orderCount, products: productCount, newOrders },
  });
});

// Static panels
app.use('/admin',  express.static(path.join(__dirname, 'public/admin')));
app.use('/market', express.static(path.join(__dirname, 'public/market')));

app.get('/', (req, res) => res.redirect('/market'));

app.listen(PORT, () => {
  console.log(`\n  TextileERP ishga tushdi`);
  console.log(`  Admin  → http://localhost:${PORT}/admin`);
  console.log(`  Market → http://localhost:${PORT}/market\n`);
});
