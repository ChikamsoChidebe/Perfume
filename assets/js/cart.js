// ===== GLOBAL CART SYSTEM =====

class CartSystem {
    constructor() {
        this.cart = [];
        this.wishlist = [];
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.bindGlobalEvents();
        this.updateCartCount();
        this.initializeCartSidebar();
    }

    loadFromStorage() {
        this.cart = JSON.parse(localStorage.getItem('amazingaura_cart') || '[]');
        this.wishlist = JSON.parse(localStorage.getItem('amazingaura_wishlist') || '[]');
    }

    saveToStorage() {
        localStorage.setItem('amazingaura_cart', JSON.stringify(this.cart));
        localStorage.setItem('amazingaura_wishlist', JSON.stringify(this.wishlist));
    }

    bindGlobalEvents() {
        // Cart button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('#cartBtn')) {
                e.preventDefault();
                window.location.href = 'cart.html';
            }
            
            if (e.target.closest('#cartClose')) {
                e.preventDefault();
                this.closeCartSidebar();
            }
            
            if (e.target.closest('.cart-item-remove')) {
                e.preventDefault();
                const productId = e.target.closest('.cart-item-remove').dataset.product;
                const size = e.target.closest('.cart-item-remove').dataset.size;
                this.removeFromCart(productId, size);
            }
            
            if (e.target.closest('.cart-checkout')) {
                e.preventDefault();
                this.proceedToCheckout();
            }
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            const cartSidebar = document.getElementById('cartSidebar');
            const cartBtn = document.getElementById('cartBtn');
            
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
                    this.closeCartSidebar();
                }
            }
        });

        // Handle quantity changes in cart
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('cart-item-quantity')) {
                const productId = e.target.dataset.product;
                const size = e.target.dataset.size;
                const newQuantity = parseInt(e.target.value);
                this.updateCartItemQuantity(productId, size, newQuantity);
            }
        });
    }

    initializeCartSidebar() {
        // Create cart sidebar if it doesn't exist
        if (!document.getElementById('cartSidebar')) {
            const cartSidebar = document.createElement('div');
            cartSidebar.id = 'cartSidebar';
            cartSidebar.className = 'cart-sidebar';
            cartSidebar.innerHTML = `
                <div class="cart-header">
                    <h3>Shopping Cart</h3>
                    <button class="cart-close" id="cartClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-content" id="cartContent">
                    <div class="empty-cart">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Your cart is empty</p>
                        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
                    </div>
                </div>
            `;
            document.body.appendChild(cartSidebar);
        }
        
        this.updateCartDisplay();
    }

    addToCart(product, size = 'Standard', quantity = 1) {
        const existingItemIndex = this.cart.findIndex(item => 
            item.id === product.id && item.size === size
        );

        if (existingItemIndex > -1) {
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                size: size,
                quantity: quantity,
                image: product.image
            });
        }

        this.saveToStorage();
        this.updateCartCount();
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`, 'success');
    }

    removeFromCart(productId, size) {
        const itemIndex = this.cart.findIndex(item => 
            item.id === productId && item.size === size
        );

        if (itemIndex > -1) {
            const removedItem = this.cart[itemIndex];
            this.cart.splice(itemIndex, 1);
            this.saveToStorage();
            this.updateCartCount();
            this.updateCartDisplay();
            this.showNotification(`${removedItem.name} removed from cart`, 'info');
        }
    }

    updateCartItemQuantity(productId, size, newQuantity) {
        const itemIndex = this.cart.findIndex(item => 
            item.id === productId && item.size === size
        );

        if (itemIndex > -1 && newQuantity > 0) {
            this.cart[itemIndex].quantity = newQuantity;
            this.saveToStorage();
            this.updateCartCount();
            this.updateCartDisplay();
        }
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    updateCartDisplay() {
        const cartContent = document.getElementById('cartContent');
        if (!cartContent) return;

        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
        } else {
            const cartItems = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-size">${item.size}</p>
                        <p class="cart-item-price">Contact for Price</p>
                        <div class="cart-item-quantity-controls">
                            <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1" max="10" data-product="${item.id}" data-size="${item.size}">
                        </div>
                    </div>
                    <button class="cart-item-remove" data-product="${item.id}" data-size="${item.size}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

            cartContent.innerHTML = `
                <div class="cart-items">
                    ${cartItems}
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <div class="total-line">
                            <span>Items (${itemCount}):</span>
                            <span>Contact for Price</span>
                        </div>
                        <div class="total-line shipping">
                            <span>Shipping:</span>
                            <span>Available in Nigeria</span>
                        </div>
                    </div>
                    <button class="btn btn-primary cart-checkout">
                        <i class="fab fa-whatsapp"></i>
                        <span>Order via WhatsApp</span>
                    </button>
                    <a href="shop.html" class="btn btn-outline continue-shopping">Continue Shopping</a>
                </div>
            `;
        }
    }

    openCartSidebar() {
        // Redirect to cart page
        window.location.href = 'cart.html';
    }

    closeCartSidebar() {
        // No longer needed as cart is a separate page
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // Generate WhatsApp message with cart items
        this.sendToWhatsApp();
    }

    sendToWhatsApp() {
        const phoneNumber = '2347068045006';
        let message = 'Hello Amazing Aura Perfumes! 🌟\n\nI am interested in ordering these beautiful fragrances:\n\n';
        
        this.cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}* (Size: ${item.size})\n   Quantity: ${item.quantity} bottle(s)\n\n`;
        });
        
        message += 'Could you please provide:\n';
        message += '• Total price for these items\n';
        message += '• Current availability\n';
        message += '• Delivery options to my location\n\n';
        message += 'Thank you! Looking forward to your response. 😊';
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Wishlist methods
    addToWishlist(product) {
        const existingIndex = this.wishlist.findIndex(item => item.id === product.id);
        
        if (existingIndex === -1) {
            this.wishlist.push({
                id: product.id,
                name: product.name,
                image: product.image
            });
            
            this.saveToStorage();
            this.showNotification(`${product.name} added to wishlist!`, 'success');
            return true;
        }
        
        return false;
    }

    removeFromWishlist(productId) {
        const existingIndex = this.wishlist.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            const removedItem = this.wishlist[existingIndex];
            this.wishlist.splice(existingIndex, 1);
            this.saveToStorage();
            this.showNotification(`${removedItem.name} removed from wishlist`, 'info');
            return true;
        }
        
        return false;
    }

    isInWishlist(productId) {
        return this.wishlist.some(item => item.id === productId);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `cart-notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
            font-weight: 500;
            line-height: 1.4;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Get cart summary for other components
    getCartSummary() {
        const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
            items: this.cart,
            itemCount,
            message: 'Contact for pricing'
        };
    }
}

// Initialize global cart system
let globalCart;

document.addEventListener('DOMContentLoaded', () => {
    globalCart = new CartSystem();
    
    // Make cart system globally available
    window.cartSystem = globalCart;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartSystem;
}