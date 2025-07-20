// Trend Fusion Product Data
const products = [
    { 
        id: 1, 
        name: "Wireless Earbuds Pro", 
        price: 129.99, 
        image: "assets/product1.jpeg" 
    },
    { 
        id: 2, 
        name: "Smart Fitness Watch", 
        price: 199.99, 
        image: "assets/product2.jpeg" 
    },
    { 
        id: 3, 
        name: "Bluetooth Speaker", 
        price: 89.99, 
        image: "assets/product3.jpeg" 
    },
    { 
        id: 4, 
        name: "Premium Backpack", 
        price: 79.99, 
        image: "assets/product4.jpeg" 
    }
];

// Cart Functions
function getCart() {
    const cart = localStorage.getItem('trendFusionCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('trendFusionCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function addToCart(productId) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showToast(`${product.name} added to cart!`);
}

function changeQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (newQuantity < 1) {
        // Remove item if quantity becomes 0
        const updatedCart = cart.filter(item => item.id !== productId);
        saveCart(updatedCart);
    } else {
        // Update quantity
        item.quantity = newQuantity;
        saveCart(cart);
    }
    
    renderCartPage();
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }, 10);
}

// Page Rendering
function renderProductsPage() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null;this.src='assets/placeholder.png'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function renderCartPage() {
    const container = document.getElementById('cart-container');
    const summary = document.getElementById('cart-summary');
    
    if (!container) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="index.html" class="btn">Continue Shopping</a>
            </div>
        `;
        if (summary) summary.innerHTML = '';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image-container">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.onerror=null;this.src='assets/placeholder.png'">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    if (summary) {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        summary.innerHTML = `
            <div class="summary-row">
                <span>Items:</span>
                <span>${totalQuantity}</span>
            </div>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <button class="btn" style="margin-top: 1.5rem; width: 100%;">Proceed to Checkout</button>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    if (document.getElementById('products-container')) {
        renderProductsPage();
    }
    
    if (document.getElementById('cart-container')) {
        renderCartPage();
    }
});

// Add toast styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(20px); }
    }
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary);
        color: white;
        padding: 12px 24px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: fadeInOut 2.5s ease-in-out;
    }
`;
document.head.appendChild(style);