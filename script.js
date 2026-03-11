const products = [
  { id: 1, name: "Professional Power Drill", price: 129.99, image: "images/power-drill.jpg", category: "Power Tools", stock: 10 },
  { id: 2, name: "Carpentry Tool Set", price: 89.99, image: "images/carpentry-set.jpg", category: "Hand Tools", stock: 25 },
  { id: 3, name: "Heavy Duty Hammer", price: 74.99, image: "images/hammer.jpg", category: "Hand Tools", stock: 15 },
  { id: 4, name: "Adjustable Spanner Set", price: 64.99, image: "images/spanner.jpg", category: "Hand Tools", stock: 18 },
  { id: 5, name: "Woodworking Collection", price: 149.99, image: "images/woodworking-collection.jpg", category: "Hand Tools", stock: 12 },
  { id: 6, name: "Workshop Tool Kit", price: 199.99, image: "images/workshop-toolkit.jpg", category: "Tool Sets", stock: 8 },
  { id: 7, name: "Premium Tool Board", price: 159.99, image: "images/tool-board.jpg", category: "Storage", stock: 5 },
  { id: 8, name: "Drill Bit Collection", price: 45.99, image: "images/drill-bits.jpg", category: "Power Tools", stock: 30 },
  { id: 9, name: "PVC Pipes Bundle", price: 85.99, image: "images/pvc-pipes.jpg", category: "Materials", stock: 50 },
  { id: 10, name: "High-Grade Plywood", price: 110.99, image: "images/plywood.jpg", category: "Materials", stock: 40 }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateAuthUI();

  if (document.getElementById('productsGrid')) {
    const customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
    const allStoreProducts = [...products, ...customProducts];
    renderProducts(allStoreProducts);
    setupCategories(allStoreProducts);
  }
});

function renderProducts(items) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  items.forEach(product => {
    // If image fails to load, use a nice gradient placeholder
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop';">
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-bottom">
          <span class="product-price">₹${product.price}</span>
          <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setupCategories(allStoreProducts) {
  const pills = document.querySelectorAll('.category-pill');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');

      const category = e.target.textContent;
      if (category === 'All') {
        renderProducts(allStoreProducts);
      } else {
        renderProducts(allStoreProducts.filter(p => p.category === category));
      }
    });
  });
}

function addToCart(id) {
  const customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
  const allStoreProducts = [...products, ...customProducts];
  const product = allStoreProducts.find(p => p.id === id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();

  // Quick animation on button
  const btns = document.querySelectorAll(`button[onclick="addToCart(${id})"]`);
  btns.forEach(btn => {
    const origText = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.textContent = origText;
      btn.style.background = 'var(--primary)';
    }, 1000);
  });
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const counts = document.querySelectorAll('.cart-badge');
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  counts.forEach(badge => {
    badge.textContent = total;
    // Animation pulse
    badge.style.transform = 'scale(1.2)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
  });
}

function updateAuthUI() {
  const authLinks = document.querySelectorAll('.auth-link');
  authLinks.forEach(link => {
    if (currentUser) {
      link.textContent = 'Logout';
      link.href = '#';
      link.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.reload();
      };
    } else {
      link.textContent = 'Login';
      link.href = 'login.html';
      link.onclick = null;
    }
  });

  const adminLinks = document.querySelectorAll('.admin-link');
  adminLinks.forEach(link => {
    if (currentAdmin) {
      link.style.display = ''; // revert to default display
      link.textContent = 'Dashboard';
      link.href = 'admin.html';
    } else {
      link.style.display = 'none'; // hide entirely
    }
  });
}
