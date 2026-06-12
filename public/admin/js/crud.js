// ─── CRUD ─────────────────────────────────────────────────────────────────────
function previewImage() {
  const url = document.getElementById('p-image').value.trim();
  const wrap = document.getElementById('p-preview-wrap');
  const img  = document.getElementById('p-preview-img');
  if (url) {
    img.src = url;
    wrap.style.display = 'block';
  } else {
    wrap.style.display = 'none';
  }
}

async function addProduct() {
  const name = document.getElementById('p-name').value.trim();
  if (!name) return toast('Mahsulot nomini kiriting!', false);
  await fetch(API_BASE + '/api/products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      sku: document.getElementById('p-sku').value || `SKU-${Date.now()}`,
      name,
      category: document.getElementById('p-cat').value,
      price: parseInt(document.getElementById('p-price').value) || 0,
      stock: parseInt(document.getElementById('p-stock').value) || 0,
      status: 'aktiv',
      image_url: document.getElementById('p-image').value.trim()
    })
  });
  closeModal('product-modal');
  document.getElementById('p-name').value = '';
  document.getElementById('p-sku').value = '';
  document.getElementById('p-price').value = '';
  document.getElementById('p-stock').value = '';
  document.getElementById('p-image').value = '';
  document.getElementById('p-preview-wrap').style.display = 'none';
  await fetchAll();
  renderProducts();
  toast('Mahsulot qo\'shildi!');
}

async function addCustomer() {
  const name = document.getElementById('c-name').value.trim();
  if (!name) return toast('Ism kiriting!', false);
  await fetch(API_BASE + '/api/customers', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name,
      company: document.getElementById('c-company').value,
      phone:   document.getElementById('c-phone').value,
      city:    document.getElementById('c-city').value,
    })
  });
  closeModal('customer-modal');
  await fetchAll();
  renderCustomers();
  toast('Mijoz qo\'shildi!');
}

async function addOrder() {
  const cust   = document.getElementById('o-customer').value;
  const prod   = document.getElementById('o-product').value;
  const qty    = parseInt(document.getElementById('o-qty').value) || 1;
  const status = document.getElementById('o-status').value;
  const product = products.find(p => p.name === prod);
  if (!product) return;
  await fetch(API_BASE + '/api/orders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ customer_name: cust, product: prod, qty, total: product.price * qty, status })
  });
  closeModal('order-modal');
  await fetchAll();
  renderOrders();
  toast('Buyurtma yaratildi!');
}

async function deleteItem(type, id) {
  await fetch(`${API_BASE}/api/${type}/${id}`, { method: 'DELETE' });
  await fetchAll();
  if (type === 'products') renderProducts();
  if (type === 'customers') renderCustomers();
  toast('O\'chirildi');
}

async function updateOrderStatus(id, status) {
  await fetch(`${API_BASE}/api/orders/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ status })
  });
  await fetchAll();
  renderOrders();
  toast('Holat yangilandi!');
}
