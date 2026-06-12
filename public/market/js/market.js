// ─── STATE ───────────────────────────────────────────────────────────────────
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('textile_cart') || '[]');
let currentCategory = 'Barchasi';

const CAT_ICONS = {
  "Ko'ylak":    '👔',
  "Shim":       '👖',
  "Kurtka":     '🧥',
  "Palto":      '🪭',
  "Sport kiyim":'🏃',
};

// ─── LOAD ─────────────────────────────────────────────────────────────────────
async function loadProducts() {
  try {
    const res = await fetch(API_BASE + '/api/products');
    if (!res.ok) throw new Error('Server xatosi: ' + res.status);
    allProducts = await res.json();
    renderCategories();
    renderProducts();
  } catch (err) {
    document.getElementById('products-grid').innerHTML =
      `<div class="no-products">❌ Mahsulotlar yuklanmadi. Server ishlayaptimi?<br><small style="color:var(--muted);margin-top:6px;display:block;">${err.message}</small><br><button class="btn btn-ghost" style="margin-top:12px;" onclick="loadProducts()">Qayta urinish</button></div>`;
  }
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
function renderCategories() {
  const cats = ['Barchasi', ...new Set(allProducts.map(p => p.category))];
  document.getElementById('category-filters').innerHTML = cats.map(cat => `
    <button class="cat-btn ${cat === currentCategory ? 'active' : ''}" onclick="filterCategory('${cat}')">
      ${CAT_ICONS[cat] || ''} ${cat}
    </button>`).join('');
}

function filterCategory(cat) {
  currentCategory = cat;
  renderCategories();
  renderProducts();
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
function renderProducts() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filtered = allProducts.filter(p => {
    const matchCat    = currentCategory === 'Barchasi' || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  document.getElementById('product-count').textContent = `${filtered.length} ta mahsulot`;

  if (filtered.length === 0) {
    document.getElementById('products-grid').innerHTML = `<div class="no-products">Mahsulot topilmadi 🔍</div>`;
    return;
  }

  document.getElementById('products-grid').innerHTML = filtered.map(p => {
    const inCart   = cart.some(i => i.id === p.id);
    const noStock  = p.stock === 0;
    const lowStock = p.stock > 0 && p.stock < 20;
    const stockTxt = noStock  ? 'Tugagan'
                   : lowStock ? `Kam: ${p.stock} dona`
                   :            `${p.stock} dona`;
    const stockCls = noStock ? 'none' : lowStock ? 'low' : '';
    const imgBlock = p.image_url
      ? `<div class="product-img-wrap"><img src="${p.image_url}" alt="${p.name}" loading="lazy" onerror="this.parentElement.outerHTML='<div class=\\'product-img-fallback\\'>${CAT_ICONS[p.category] || '👕'}</div>'"></div>`
      : `<div class="product-img-fallback">${CAT_ICONS[p.category] || '👕'}</div>`;
    return `
      <div class="product-card ${noStock ? 'out-of-stock' : ''}">
        ${imgBlock}
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div><span class="product-cat">${p.category}</span></div>
          <div class="product-price">${fmt(p.price)}</div>
          <div class="product-stock ${stockCls}">${stockTxt}</div>
        </div>
        <button class="add-btn ${inCart ? 'in-cart' : ''}" onclick="${noStock ? '' : `addToCart(${p.id})`}" ${noStock ? 'disabled' : ''}>
          ${noStock ? 'Mahsulot tugagan' : inCart ? '✓ Savatda' : '🛒 Savatga qo\'sh'}
        </button>
      </div>`;
  }).join('');
}

// ─── CART ACTIONS ─────────────────────────────────────────────────────────────
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product || product.stock === 0) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + 1, product.stock);
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, stock: product.stock, qty: 1 });
  }
  saveCart();
  renderProducts();
  renderCart();
  updateCartBadge();
  toast(`${product.name} savatga qo'shildi!`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderProducts();
  renderCart();
  updateCartBadge();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  const newQty = item.qty + delta;
  if (newQty < 1) return removeFromCart(productId);
  item.qty = Math.min(newQty, item.stock);
  saveCart();
  renderCart();
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem('textile_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const total = cart.reduce((a, i) => a + i.qty, 0);
  const badge = document.getElementById('cart-count');
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

// ─── CART RENDER ──────────────────────────────────────────────────────────────
function renderCart() {
  const totalSum   = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const totalCount = cart.reduce((a, i) => a + i.qty, 0);

  document.getElementById('cart-items-count').textContent = totalCount;
  document.getElementById('cart-total').textContent = fmt(totalSum);

  if (cart.length === 0) {
    document.getElementById('cart-items').innerHTML = `
      <div class="cart-empty">
        <div style="font-size:40px;margin-bottom:10px;">🛒</div>
        <div>Savat bo'sh</div>
      </div>`;
    return;
  }

  document.getElementById('cart-items').innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-price">${fmt(item.price)} × birlik</div>
      <div class="cart-item-row">
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
        <div class="cart-item-total">${fmt(item.price * item.qty)}</div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    </div>`).join('');
}

// ─── CART SIDEBAR ─────────────────────────────────────────────────────────────
function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
function openCheckout() {
  if (cart.length === 0) return toast('Savat bo\'sh!', false);
  closeCart();
  const totalSum = cart.reduce((a, i) => a + i.price * i.qty, 0);
  document.getElementById('checkout-summary').innerHTML =
    `Jami: <strong style="color:var(--accent);font-size:15px;">${fmt(totalSum)}</strong>
     &nbsp;·&nbsp; ${cart.reduce((a, i) => a + i.qty, 0)} ta mahsulot`;
  document.getElementById('checkout-modal').classList.add('open');
}
function closeCheckout() {
  document.getElementById('checkout-modal').classList.remove('open');
}

async function submitOrder() {
  const name    = document.getElementById('checkout-name').value.trim();
  const phone   = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const note    = document.getElementById('checkout-note').value.trim();

  if (!name)  return toast('Ism kiriting!', false);
  if (!phone) return toast('Telefon raqam kiriting!', false);

  for (const item of cart) {
    await fetch(API_BASE + '/api/orders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        customer_name:    name,
        customer_phone:   phone,
        customer_address: address,
        product:          item.name,
        qty:              item.qty,
        total:            item.price * item.qty,
        status:           'yangi',
        note,
      })
    });
  }

  cart = [];
  saveCart();
  closeCheckout();
  renderCart();
  updateCartBadge();

  document.getElementById('success-name').textContent = name;
  document.getElementById('success-modal').classList.add('open');

  loadProducts();

  // clear inputs
  ['checkout-name','checkout-phone','checkout-address','checkout-note'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function closeSuccess() {
  document.getElementById('success-modal').classList.remove('open');
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmt(n) {
  return new Intl.NumberFormat('uz-UZ').format(n) + ' UZS';
}

function toast(msg, success = true) {
  const t = document.getElementById('toast');
  t.textContent = (success ? '✅ ' : '❌ ') + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
loadProducts();
renderCart();
updateCartBadge();
