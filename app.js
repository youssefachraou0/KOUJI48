const TAX_RATE = 0.1;

const inventory = [
  { id: 1, name: 'Coffee', price: 2.5 },
  { id: 2, name: 'Sandwich', price: 5.2 },
  { id: 3, name: 'Orange Juice', price: 3.1 },
  { id: 4, name: 'Muffin', price: 2.2 },
  { id: 5, name: 'Salad', price: 4.9 },
  { id: 6, name: 'Water', price: 1.3 }
];

const cart = [];

const productsEl = document.getElementById('products');
const cartEl = document.getElementById('cart');
const itemsCountEl = document.getElementById('items-count');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const cashInputEl = document.getElementById('cash-received');
const changeEl = document.getElementById('change');
const checkoutBtn = document.getElementById('checkout');
const statusEl = document.getElementById('status');

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getTotals() {
  const subtotal = getSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status${type ? ` ${type}` : ''}`;
}

function renderProducts() {
  productsEl.innerHTML = '';
  for (const item of inventory) {
    const card = document.createElement('article');
    card.className = 'product';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${formatCurrency(item.price)}</p>
      <button type="button" data-id="${item.id}">Add</button>
    `;
    productsEl.appendChild(card);
  }
}

function renderCart() {
  cartEl.innerHTML = '';

  for (const item of cart) {
    const row = document.createElement('li');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-line">
        <span>${item.name} x${item.qty}</span>
        <span>${formatCurrency(item.price * item.qty)}</span>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" type="button" data-action="inc" data-id="${item.id}">+</button>
        <button class="qty-btn remove" type="button" data-action="dec" data-id="${item.id}">-</button>
      </div>
    `;
    cartEl.appendChild(row);
  }

  const { subtotal, tax, total } = getTotals();
  const itemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cashReceived = Number(cashInputEl.value) || 0;
  const change = Math.max(cashReceived - total, 0);

  itemsCountEl.textContent = String(itemsCount);
  subtotalEl.textContent = formatCurrency(subtotal);
  taxEl.textContent = formatCurrency(tax);
  totalEl.textContent = formatCurrency(total);
  changeEl.textContent = formatCurrency(change);

  checkoutBtn.disabled = itemsCount === 0 || cashReceived < total;
}

function addToCart(id) {
  const found = inventory.find((item) => item.id === id);
  if (!found) {
    setStatus('Product not found.', 'error');
    return;
  }

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...found, qty: 1 });
  }

  setStatus('Item added to cart.');
  renderCart();
}

function changeQty(id, action) {
  const existing = cart.find((item) => item.id === id);
  if (!existing) {
    return;
  }

  if (action === 'inc') {
    existing.qty += 1;
  }

  if (action === 'dec') {
    existing.qty -= 1;
    if (existing.qty <= 0) {
      const index = cart.findIndex((item) => item.id === id);
      cart.splice(index, 1);
    }
  }

  renderCart();
}

productsEl.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-id]');
  if (!btn) {
    return;
  }

  addToCart(Number(btn.dataset.id));
});

cartEl.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-id][data-action]');
  if (!btn) {
    return;
  }

  changeQty(Number(btn.dataset.id), btn.dataset.action);
});

cashInputEl.addEventListener('input', () => {
  renderCart();
});

checkoutBtn.addEventListener('click', () => {
  const { total } = getTotals();
  const cashReceived = Number(cashInputEl.value) || 0;

  if (cart.length === 0) {
    setStatus('Cart is empty.', 'error');
    return;
  }

  if (cashReceived < total) {
    setStatus('Cash received is less than total.', 'error');
    return;
  }

  const change = cashReceived - total;
  setStatus(`Payment completed. Change due: ${formatCurrency(change)}`, 'success');

  cart.length = 0;
  cashInputEl.value = '';
  renderCart();
});

renderProducts();
renderCart();
