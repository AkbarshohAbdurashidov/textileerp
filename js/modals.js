// ─── MODALS ───────────────────────────────────────────────────────────────────
function openModal(id) {
  if (id === 'order-modal') {
    document.getElementById('o-customer').innerHTML = customers.map(c=>`<option>${c.name}</option>`).join('');
    document.getElementById('o-product').innerHTML = products.map(p=>`<option>${p.name}</option>`).join('');
  }
  document.getElementById(id).classList.add('open');
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if(e.target===m) m.classList.remove('open'); }));
