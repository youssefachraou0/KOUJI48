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
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout');

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
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
      <span>${item.name} x${item.qty}</span>
      <span>${formatCurrency(item.price * item.qty)}</span>
      <button class="remove" type="button" data-id="${item.id}">x</button>
    `;
    cartEl.appendChild(row);
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  subtotalEl.textContent = formatCurrency(subtotal);
  taxEl.textContent = formatCurrency(tax);
  totalEl.textContent = formatCurrency(total);
}

productsEl.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-id]');
  if (!btn) {
    return;
  }

  const id = Number(btn.dataset.id);
  const found = inventory.find((item) => item.id === id);
  if (!found) {
    return;
  }

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...found, qty: 1 });
  }

  renderCart();
});

cartEl.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-id]');
  if (!btn) {
    return;
  }

  const id = Number(btn.dataset.id);
  const index = cart.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }

  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }

  renderCart();
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Cart is empty.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0) * 1.1;
  alert(`Payment completed. Total: ${formatCurrency(total)}`);
  cart.length = 0;
  renderCart();
});

renderProducts();
renderCart();
