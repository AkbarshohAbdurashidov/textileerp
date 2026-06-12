// ─── CRUD ─────────────────────────────────────────────────────────────────────
function addProduct() {
  const name = document.getElementById('p-name').value.trim();
  if (!name) return toast('Mahsulot nomini kiriting!', false);
  const newId = products.length ? Math.max(...products.map(p=>p.id))+1 : 1;
  products.push({
    id: newId,
    sku: document.getElementById('p-sku').value || `SKU-${String(newId).padStart(3,'0')}`,
    name, category: document.getElementById('p-cat').value,
    price: parseInt(document.getElementById('p-price').value) || 0,
    stock: parseInt(document.getElementById('p-stock').value) || 0,
    status: 'aktiv'
  });
  closeModal('product-modal');
  renderProducts();
  toast('Mahsulot qo\'shildi!');
}

function addCustomer() {
  const name = document.getElementById('c-name').value.trim();
  if (!name) return toast('Ism kiriting!', false);
  const newId = customers.length ? Math.max(...customers.map(c=>c.id))+1 : 1;
  customers.push({
    id: newId, name, company: document.getElementById('c-company').value,
    phone: document.getElementById('c-phone').value,
    city: document.getElementById('c-city').value,
    total: 0, level: 'Bronze'
  });
  closeModal('customer-modal');
  renderCustomers();
  toast('Mijoz qo\'shildi!');
}

function addOrder() {
  const cust = document.getElementById('o-customer').value;
  const prod = document.getElementById('o-product').value;
  const qty = parseInt(document.getElementById('o-qty').value) || 1;
  const status = document.getElementById('o-status').value;
  const product = products.find(p => p.name === prod);
  if (!product) return;
  const total = product.price * qty;
  const newId = 'ORD-' + String(orders.length + 1).padStart(3,'0');
  const today = new Date().toISOString().split('T')[0];
  orders.unshift({ id:newId, customer:cust, product:prod, qty, total, date:today, status });
  closeModal('order-modal');
  renderOrders();
  toast('Buyurtma yaratildi!');
}

function deleteItem(type, id) {
  if (type === 'products') products = products.filter(p => p.id !== id);
  if (type === 'customers') customers = customers.filter(c => c.id !== id);
  if (type === 'products') renderProducts();
  if (type === 'customers') renderCustomers();
  toast('O\'chirildi');
}

function updateOrderStatus(id, status) {
  const o = orders.find(o => o.id === id);
  if (o) o.status = status;
  renderOrders();
  toast('Holat yangilandi!');
}
