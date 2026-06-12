// ─── RENDER FUNCTIONS ─────────────────────────────────────────────────────────
function renderDashboard() {
  animateNumber('stat-revenue', orders.reduce((a, o) => a + o.total, 0), true);
  animateNumber('stat-orders', orders.length, false);
  animateNumber('stat-customers', customers.length, false);
  animateNumber('stat-products', products.length, false);

  // Sales chart
  const weeks = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
  const vals = [42, 65, 38, 78, 55, 88, 71];
  const max = Math.max(...vals);
  document.getElementById('sales-chart').innerHTML = weeks.map((w, i) => `
    <div class="chart-bar-col">
      <div class="chart-bar" style="height:${(vals[i] / max) * 100}%;"></div>
      <span class="chart-label">${w}</span>
    </div>`).join('');

  // Recent orders
  const recent = orders.slice(-4).reverse();
  document.getElementById('recent-orders-list').innerHTML = recent.map(o => `
    <div class="detail-row">
      <span><strong style="font-size:13px;">${o.id}</strong><br><span style="color:var(--muted);font-size:12px;">${o.customer}</span></span>
      <span style="text-align:right;">
        <span style="font-size:13px;font-weight:600;">${fmt(o.total)}</span><br>
        ${statusBadge(o.status)}
      </span>
    </div>`).join('');

  // Category stats
  const cats = {};
  products.forEach(p => cats[p.category] = (cats[p.category] || 0) + 1);
  document.getElementById('category-stats').innerHTML = Object.entries(cats).map(([k, v]) => `
    <div class="detail-row"><span class="detail-key">${k}</span><span style="font-weight:600;">${v} SKU</span></div>`).join('');
}

function renderProducts() {
  document.getElementById('products-tbody').innerHTML = products.map(p => `
    <tr>
      <td>${p.image_url
        ? `<img src="${p.image_url}" class="product-thumb" onerror="this.outerHTML='<div class=\\'product-thumb-placeholder\\'><i data-lucide=\\'shirt\\'></i></div>'">`
        : `<div class="product-thumb-placeholder"><i data-lucide="shirt"></i></div>`
      }</td>
      <td><span style="font-family:var(--mono);font-size:12px;color:var(--muted);">${p.sku}</span></td>
      <td><strong>${p.name}</strong></td>
      <td><span class="tag">${p.category}</span></td>
      <td style="font-weight:600;">${fmt(p.price)}</td>
      <td>${p.stock < 20 ? `<span style="color:var(--red);">⚠ ${p.stock}</span>` : p.stock}</td>
      <td>${p.status === 'aktiv' ? '<span class="badge badge-green">Aktiv</span>' : '<span class="badge badge-yellow">Past Zaxira</span>'}</td>
      <td><button class="btn btn-danger" style="padding:4px 10px;font-size:11px;" onclick="deleteItem('products',${p.id})">O'chirish</button></td>
    </tr>`).join('');
  lucide.createIcons();
}

function renderCustomers() {
  document.getElementById('customers-tbody').innerHTML = customers.map(c => `
    <tr>
      <td><span style="font-family:var(--mono);font-size:12px;color:var(--muted);">MIJ-${String(c.id).padStart(3, '0')}</span></td>
      <td><strong>${c.name}</strong></td>
      <td>${c.company}</td>
      <td style="font-family:var(--mono);font-size:12px;">${c.phone}</td>
      <td>${c.city}</td>
      <td style="font-weight:600;">${fmt(c.total)}</td>
      <td>${levelBadge(c.level)}</td>
      <td><button class="btn btn-danger" style="padding:4px 10px;font-size:11px;" onclick="deleteItem('customers',${c.id})">O'chirish</button></td>
    </tr>`).join('');
}

function renderOrders() {
  const counts = { yangi: 0, jarayonda: 0, yetkazildi: 0, bekor: 0 };
  orders.forEach(o => {
    if (o.status === 'yangi') counts.yangi++;
    else if (o.status === 'jarayonda') counts.jarayonda++;
    else if (o.status === 'yetkazildi') counts.yetkazildi++;
    else counts.bekor++;
  });
  document.getElementById('ord-new').textContent = counts.yangi;
  document.getElementById('ord-proc').textContent = counts.jarayonda;
  document.getElementById('ord-done').textContent = counts.yetkazildi;
  document.getElementById('ord-cancel').textContent = counts.bekor;
  document.getElementById('pending-badge').textContent = counts.yangi;

  document.getElementById('orders-tbody').innerHTML = orders.map(o => `
    <tr>
      <td><strong style="font-family:var(--mono);">${o.id}</strong></td>
      <td>${o.customer}</td>
      <td>${o.product}</td>
      <td>${o.qty} dona</td>
      <td style="font-weight:600;">${fmt(o.total)}</td>
      <td style="font-family:var(--mono);font-size:12px;color:var(--muted);">${o.date}</td>
      <td>${statusBadge(o.status)}</td>
      <td>
        <select style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:4px 8px;color:var(--text);font-size:11px;cursor:pointer;" onchange="updateOrderStatus('${o.id}', this.value)">
          <option ${o.status === 'yangi' ? 'selected' : ''} value="yangi">Yangi</option>
          <option ${o.status === 'jarayonda' ? 'selected' : ''} value="jarayonda">Jarayonda</option>
          <option ${o.status === 'yetkazildi' ? 'selected' : ''} value="yetkazildi">Yetkazildi</option>
          <option ${o.status === 'bekor' ? 'selected' : ''} value="bekor">Bekor</option>
        </select>
      </td>
    </tr>`).join('');
}

function renderReports() {
  const totalRevenue = orders.reduce((a, o) => a + o.total, 0);
  const delivered = orders.filter(o => o.status === 'yetkazildi');
  document.getElementById('financial-report').innerHTML = `
    <div class="detail-row"><span class="detail-key">Jami Daromad</span><strong>${fmt(totalRevenue)}</strong></div>
    <div class="detail-row"><span class="detail-key">Yetkazilgan</span><strong style="color:var(--green);">${delivered.length} buyurtma</strong></div>
    <div class="detail-row"><span class="detail-key">O'rtacha Buyurtma</span><strong>${fmt(totalRevenue / orders.length)}</strong></div>
    <div class="detail-row"><span class="detail-key">Mijozlar Soni</span><strong>${customers.length} ta</strong></div>
    <div class="detail-row"><span class="detail-key">Mahsulot SKU</span><strong>${products.length} ta</strong></div>`;

  const prodSales = {};
  orders.forEach(o => prodSales[o.product] = (prodSales[o.product] || 0) + o.total);
  const topProds = Object.entries(prodSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxP = topProds[0]?.[1] || 1;
  document.getElementById('top-products-report').innerHTML = topProds.map(([name, val], i) => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px;">
        <span>${i + 1}. ${name}</span><strong>${fmt(val)}</strong>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${(val / maxP) * 100}%;"></div></div>
    </div>`).join('');

  const custSales = {};
  orders.forEach(o => custSales[o.customer] = (custSales[o.customer] || 0) + o.total);
  const topCusts = Object.entries(custSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxC = topCusts[0]?.[1] || 1;
  document.getElementById('top-customers-report').innerHTML = topCusts.map(([name, val], i) => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px;">
        <span>${i + 1}. ${name}</span><strong>${fmt(val)}</strong>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${(val / maxC) * 100}%;"></div></div>
    </div>`).join('');

  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyu', 'Iyul', 'Avg'];
  const mvals = [180, 210, 165, 290, 245, 310, 340, 285];
  const mmax = Math.max(...mvals);
  document.getElementById('monthly-chart').innerHTML = months.map((m, i) => `
    <div class="chart-bar-col">
      <div style="font-size:10px;color:var(--muted);font-family:var(--mono);">${mvals[i]}M</div>
      <div class="chart-bar" style="height:${(mvals[i] / mmax) * 85}%;"></div>
      <span class="chart-label">${m}</span>
    </div>`).join('');
}

// ─── CLOUD LIVE STATUS ────────────────────────────────────────────────────────
let _cloudInterval = null;

async function renderCloudStatus() {
  try {
    const res = await fetch(API_BASE + '/api/status');
    const s = await res.json();

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set('cs-uptime', s.uptime.display);
    set('cs-instances', `${s.instances.current}/10`);
    set('cs-inst-count', `${s.instances.current} aktiv`);
    set('cs-cpu-pct', s.cpu + '%');
    set('cs-mem-pct', s.memory.pct + '%');
    set('cs-mem-detail', `${s.memory.usedGb} GB / ${s.memory.totalGb} GB ishlatilmoqda`);
    set('cs-net-in', s.network.inKbps + ' Kbps');
    set('cs-net-out', s.network.outKbps + ' Kbps');
    set('cs-new-orders', s.stats.newOrders + ' ta');
    set('cs-total-products', s.stats.products + ' SKU');

    const cpuBar = document.getElementById('cs-cpu-bar');
    const memBar = document.getElementById('cs-mem-bar');
    if (cpuBar) {
      cpuBar.style.width = s.cpu + '%';
      cpuBar.style.background = s.cpu > 70 ? 'var(--red)' : s.cpu > 50 ? 'var(--yellow)' : 'var(--green)';
    }
    if (memBar) memBar.style.width = s.memory.pct + '%';

    const now = new Date();
    set('cloud-last-update', now.toLocaleTimeString('uz-UZ'));

  } catch (_) {
    const dot = document.getElementById('cloud-live-dot');
    if (dot) dot.style.background = 'var(--red)';
  }
}

function startCloudLive() {
  renderCloudStatus();
  _cloudInterval = setInterval(renderCloudStatus, 3000);
}

function stopCloudLive() {
  clearInterval(_cloudInterval);
  _cloudInterval = null;
}
