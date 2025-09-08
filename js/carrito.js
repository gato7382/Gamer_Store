class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
    }

    loadCart() {
        if (window.cartData) {
            return window.cartData;
        }
        window.cartData = [];
        return [];
    }

    saveCart() {
        window.cartData = this.items;
        
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { items: this.items, total: this.getTotal() }
        }));
    }

    addItem(id, name, price, image = null) {
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id,
                name,
                price,
                quantity: 1,
                image
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddedNotification(name);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartTotalSection = document.getElementById('cart-total-section');

        const totalItems = this.getTotalItems();
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <p>Tu carrito está vacío</p>
                    <p>¡Agrega algunos productos gaming!</p>
                </div>
            `;
            cartTotalSection.style.display = 'none';
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <div>
                        <div style="font-weight: bold; color: #39FF14;">${item.name}</div>
                        <div style="font-size: 0.9em; color: #888;">${item.price.toLocaleString()} x ${item.quantity}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" 
                                style="background: #FF1E90; color: white; border: none; border-radius: 3px; width: 25px; height: 25px; cursor: pointer;">-</button>
                        <span style="color: #1E90FF; font-weight: bold;">${item.quantity}</span>
                        <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})" 
                                style="background: #39FF14; color: black; border: none; border-radius: 3px; width: 25px; height: 25px; cursor: pointer;">+</button>
                        <button onclick="cart.removeItem('${item.id}')" 
                                style="background: #FF4444; color: white; border: none; border-radius: 3px; padding: 5px; cursor: pointer;">🗑️</button>
                    </div>
                </div>
            `).join('');
            
            cartTotal.textContent = this.getTotal().toLocaleString();
            cartTotalSection.style.display = 'block';
        }
    }

    showAddedNotification(itemName) {

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(45deg, #1E90FF, #39FF14);
            color: black;
            padding: 1rem;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = `🛒 ${itemName} agregado al carrito!`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

let cart;

function toggleCart() {
    const dropdown = document.getElementById('cart-dropdown');
    dropdown.classList.toggle('active');
    
    if (dropdown.classList.contains('active')) {
        setTimeout(() => {
            document.addEventListener('click', closeCartOnClickOutside);
        }, 100);
    }
}

function closeCartOnClickOutside(event) {
    const dropdown = document.getElementById('cart-dropdown');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartIcon.contains(event.target) && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        document.removeEventListener('click', closeCartOnClickOutside);
    }
}

function checkout() {
    if (cart.items.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.getTotal();
    const itemCount = cart.getTotalItems();
    
    alert(`🚀 ¡Redirigiendo al checkout!\n\nProductos: ${itemCount}\nTotal: ${total.toLocaleString()}\n\n¡Gracias por elegir Level-Up Gamer!`);
    
    // Aqui va el link para pagar
    // window.location.href = 'checkout.html';
}

function addSampleProducts() {
    cart.addItem('demo-1', 'Teclado Gaming RGB', 89990);
    cart.addItem('demo-2', 'Mouse Gaming Pro', 45990);
    cart.addItem('demo-3', 'Auriculares Gaming', 67990);
}

document.addEventListener('DOMContentLoaded', function() {
    cart = new ShoppingCart();
    
    setTimeout(() => {
        const demoButton = document.createElement('button');
        demoButton.innerHTML = '🎮 Agregar productos demo';
        demoButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(45deg, #1E90FF, #39FF14);
            color: black;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(30, 144, 255, 0.3);
        `;
        demoButton.onclick = addSampleProducts;
        document.body.appendChild(demoButton);
    }, 2000);
});

window.addEventListener('cartUpdated', function(event) {
    if (cart) {
        cart.updateCartDisplay();
    }
});