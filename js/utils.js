// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmt(n) { return new Intl.NumberFormat('uz-UZ').format(n) + ' UZS'; }
function statusBadge(s) {
  const map = {yangi:'badge-blue', jarayonda:'badge-yellow', yetkazildi:'badge-green', bekor:'badge-red'};
  const labels = {yangi:'Yangi', jarayonda:'Jarayonda', yetkazildi:'Yetkazildi', bekor:'Bekor'};
  return `<span class="badge ${map[s]||'badge-blue'}">${labels[s]||s}</span>`;
}
function levelBadge(l) {
  const map = {Platinum:'badge-purple', Gold:'badge-yellow', Silver:'badge-blue', Bronze:'badge-red'};
  return `<span class="badge ${map[l]||'badge-blue'}">★ ${l}</span>`;
}
function animateNumber(id, target, isMoney) {
  const el = document.getElementById(id);
  let current = 0;
  const step = target / 40;
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = isMoney ? new Intl.NumberFormat('uz-UZ').format(Math.round(current)) : Math.round(current);
    if (current >= target) clearInterval(interval);
  }, 20);
}
function filterTable(tbodyId, query) {
  const rows = document.getElementById(tbodyId)?.querySelectorAll('tr') || [];
  rows.forEach(row => row.style.display = row.textContent.toLowerCase().includes(query.toLowerCase()) ? '' : 'none');
}
function toast(msg, success=true) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.innerHTML = (success?'✅ ':'❌ ') + `<span id="toast-msg">${msg}</span>`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
