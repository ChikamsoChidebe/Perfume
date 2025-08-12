// ===== PRODUCT PAGE JAVASCRIPT =====

class ProductManager {
    constructor() {
        this.currentProduct = null;
        this.selectedSize = '50ml';
        this.selectedPrice = 289.99;
        this.quantity = 1;
        this.init();
    }

    init() {
        this.loadProductData();
        this.bindEvents();
        this.initializeTabs();
        this.initializeImageGallery();
        this.initializeQuantityControls();
        this.initializeSizeSelector();
    }

    loadProductData() {
        // Get product ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 'midnight-elegance';
        
        // Get product from database
        this.currentProduct = window.productDB.getProductById(productId);
        
        if (!this.currentProduct) {
            // Fallback to first available product
            const allProducts = window.productDB.getAllProducts();
            this.currentProduct = allProducts[0] || null;
        }
        
        if (this.currentProduct) {
            this.updateProductDisplay();
        } else {
            // Show error message
            document.body.innerHTML = '<div style="text-align: center; padding: 100px;"><h1>Product not found</h1><a href="shop.html">Browse Products</a></div>';
        }
    }

    updateProductDisplay() {
        const product = this.currentProduct;
        
        // Update page title
        document.title = `${product.name} - Amazing Aura Perfumes`;
        
        // Update breadcrumb
        const breadcrumbSpan = document.querySelector('.breadcrumb-nav span');
        if (breadcrumbSpan) {
            breadcrumbSpan.textContent = product.name;
        }
        
        // Update product info
        document.querySelector('.product-category').textContent = product.category;
        document.querySelector('.product-title').textContent = product.name;
        document.querySelector('.product-description p').textContent = product.description;
        
        // Update rating
        const ratingText = document.querySelector('.rating-text');
        if (ratingText) {
            ratingText.textContent = `${product.rating} (${product.reviews} reviews)`;
        }
        
        // Update images
        this.updateProductImages();
        
        // Update notes
        this.updateFragranceNotes();
        
        // Update badge
        const badge = document.querySelector('.image-badge');
        if (badge && product.badge) {
            badge.textContent = product.badge;
        } else if (badge && !product.badge) {
            badge.style.display = 'none';
        }
        
        // Update pricing
        this.updatePricing();
    }

    updateProductImages() {
        const product = this.currentProduct;
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        if (mainImage && product.images.length > 0) {
            mainImage.src = product.images[0];
            mainImage.alt = product.name;
        }
        
        // Update thumbnails
        thumbnails.forEach((thumbnail, index) => {
            if (product.images[index]) {
                thumbnail.src = product.images[index];
                thumbnail.alt = `${product.name} ${index + 1}`;
                thumbnail.style.display = 'block';
            } else {
                thumbnail.style.display = 'none';
            }
        });
    }

    updateFragranceNotes() {
        const product = this.currentProduct;
        const noteItems = document.querySelectorAll('.note-item');
        
        if (noteItems.length >= 3 && product.notes) {
            if (product.notes.top) {
                noteItems[0].querySelector('.note-list').textContent = product.notes.top.join(', ');
            }
            if (product.notes.heart) {
                noteItems[1].querySelector('.note-list').textContent = product.notes.heart.join(', ');
            }
            if (product.notes.base) {
                noteItems[2].querySelector('.note-list').textContent = product.notes.base.join(', ');
            }
        }
    }

    updatePricing() {
        // No pricing to update - contact for price model
        const contactPriceEl = document.querySelector('.contact-price');
        if (contactPriceEl) {
            contactPriceEl.textContent = 'Contact for Price';
        }
    }

    bindEvents() {
        // Add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }
        
        // Wishlist button
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.toggleWishlist();
            });
        }
        
        // Load more reviews
        const loadMoreBtn = document.querySelector('.load-more-reviews');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreReviews();
            });
        }
    }

    initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active class from all tabs and panels
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                btn.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    initializeImageGallery() {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                thumbnail.classList.add('active');
                
                // Update main image
                if (mainImage) {
                    mainImage.src = thumbnail.src;
                    mainImage.alt = thumbnail.alt;
                }
            });
        });
    }

    initializeQuantityControls() {
        const quantityInput = document.querySelector('.quantity-input');
        const minusBtn = document.querySelector('.quantity-btn.minus');
        const plusBtn = document.querySelector('.quantity-btn.plus');
        
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    quantityInput.value = this.quantity;
                }
            });
        }
        
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                if (this.quantity < 10) {
                    this.quantity++;
                    quantityInput.value = this.quantity;
                }
            });
        }
        
        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= 10) {
                    this.quantity = value;
                } else {
                    e.target.value = this.quantity;
                }
            });
        }
    }

    initializeSizeSelector() {
        const sizeOptions = document.querySelectorAll('.size-option');
        
        sizeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                sizeOptions.forEach(o => o.classList.remove('active'));
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Update selected size and price
                this.selectedSize = option.dataset.size;
                this.updatePricing();
            });
        });
    }

    addToCart() {
        const product = this.currentProduct;
        if (product && window.cartSystem) {
            const cartProduct = {
                id: product.id,
                name: product.name,
                image: product.images[0]
            };
            
            window.cartSystem.addToCart(cartProduct, this.selectedSize, this.quantity);
            
            // Animate button
            const btn = document.querySelector('.add-to-cart-btn');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> <span>Added!</span>';
                btn.style.background = '#22c55e';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 2000);
            }
        }
    }

    toggleWishlist() {
        const product = this.currentProduct;
        if (product && window.cartSystem) {
            const wishlistProduct = {
                id: product.id,
                name: product.name,
                image: product.images[0]
            };
            
            const btn = document.querySelector('.wishlist-btn');
            
            if (window.cartSystem.isInWishlist(product.id)) {
                window.cartSystem.removeFromWishlist(product.id);
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-heart"></i> <span>Add to Wishlist</span>';
                    btn.classList.remove('active');
                }
            } else {
                window.cartSystem.addToWishlist(wishlistProduct);
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-heart"></i> <span>In Wishlist</span>';
                    btn.classList.add('active');
                }
            }
        }
    }

    loadMoreReviews() {
        const reviewsList = document.querySelector('.reviews-list');
        const loadMoreBtn = document.querySelector('.load-more-reviews');
        
        // Mock additional reviews
        const additionalReviews = [
            {
                name: 'Jessica K.',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                rating: 5,
                date: '3 weeks ago',
                title: 'Love the longevity!',
                content: 'This fragrance lasts all day on me. The scent is complex and evolves beautifully throughout the day. Definitely worth the investment.'
            },
            {
                name: 'David R.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                rating: 4,
                date: '1 month ago',
                title: 'Great for special occasions',
                content: 'This is my go-to fragrance for date nights and special events. It\'s sophisticated and gets compliments every time I wear it.'
            }
        ];
        
        additionalReviews.forEach(review => {
            const reviewElement = this.createReviewElement(review);
            reviewsList.appendChild(reviewElement);
        });
        
        // Hide load more button after loading
        loadMoreBtn.style.display = 'none';
    }

    createReviewElement(review) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-item';
        
        const stars = Array.from({length: 5}, (_, i) => 
            i < review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
        ).join('');
        
        reviewDiv.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${review.avatar}" alt="${review.name}" class="reviewer-avatar">
                    <div>
                        <h4>${review.name}</h4>
                        <div class="review-rating">${stars}</div>
                    </div>
                </div>
                <span class="review-date">${review.date}</span>
            </div>
            <div class="review-content">
                <h5>${review.title}</h5>
                <p>${review.content}</p>
            </div>
        `;
        
        return reviewDiv;
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('amazingaura_cart') || '[]');
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `product-notification notification-${type}`;
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

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductManager();
});

// Handle related product clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('.related-products .product-card')) {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Convert product name to ID format
        const productId = productName.toLowerCase().replace(/\s+/g, '-');
        
        // Navigate to product page
        window.location.href = `product.html?id=${productId}`;
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    // Reload product data when navigating back/forward
    if (window.location.pathname.includes('product.html')) {
        location.reload();
    }
});