// ─── GLOBAL STATE (API dan to'ldiriladi) ──────────────────────────────────────
let products = [];
let customers = [];
let orders = [];

async function fetchAll() {
  const [p, c, o] = await Promise.all([
    fetch(API_BASE + '/api/products').then(r => r.json()),
    fetch(API_BASE + '/api/customers').then(r => r.json()),
    fetch(API_BASE + '/api/orders').then(r => r.json()),
  ]);
  products = p;
  customers = c;
  orders = o;
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
async function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.textContent.trim().toLowerCase().includes(
      page === 'dashboard' ? 'dashboard' : page === 'products' ? 'mahsulot' :
        page === 'customers' ? 'mijoz' : page === 'orders' ? 'buyurtma' :
          page === 'reports' ? 'hisobot' : page === 'cloud' ? 'cloud' : 'sozlama'
    )) n.classList.add('active');
  });
  stopCloudLive();
  await fetchAll();
  if (page === 'dashboard') renderDashboard();
  if (page === 'products') renderProducts();
  if (page === 'customers') renderCustomers();
  if (page === 'orders') renderOrders();
  if (page === 'reports') renderReports();
  if (page === 'cloud') startCloudLive();
}

function exportData(type) {
  const data = type === 'products' ? products : type === 'customers' ? customers : orders;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${type}_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  toast(`${type} ma'lumotlari yuklandi!`);
}

function generateReport() {
  toast('PDF hisobot yaratilmoqda...');
  setTimeout(() => toast('Hisobot tayyor! ✅'), 1500);
}

// Clock
function updateTime() {
  document.getElementById('current-time').textContent = new Date().toLocaleTimeString('uz-UZ');
}
setInterval(updateTime, 1000);
updateTime();

// Init
fetchAll().then(() => { renderDashboard(); lucide.createIcons(); });
