// ===== SHOP PAGE JAVASCRIPT =====

class ShopManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.currentSort = 'featured';
        this.filters = {
            category: [],
            priceRange: 300,
            notes: [],
            gender: 'all'
        };
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.bindEvents();
        this.initializeFilters();
        this.renderProducts();
    }

    loadProducts() {
        // Mock product data - in a real app, this would come from an API
        this.products = [
            {
                id: 'midnight-elegance',
                name: 'Midnight Elegance',
                category: 'signature',
                price: 189.99,
                originalPrice: 229.99,
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'A sophisticated blend of black orchid, vanilla, and sandalwood.',
                notes: ['floral', 'oriental'],
                gender: 'women',
                rating: 4.8,
                reviews: 127,
                badge: 'bestseller',
                featured: true
            },
            {
                id: 'golden-dawn',
                name: 'Golden Dawn',
                category: 'limited',
                price: 159.99,
                image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Bright citrus notes meet warm amber in this uplifting fragrance.',
                notes: ['fresh', 'woody'],
                gender: 'unisex',
                rating: 4.6,
                reviews: 89,
                badge: 'new',
                featured: true
            },
            {
                id: 'ocean-breeze',
                name: 'Ocean Breeze',
                category: 'classic',
                price: 129.99,
                image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Fresh marine notes combined with delicate jasmine.',
                notes: ['fresh', 'floral'],
                gender: 'unisex',
                rating: 4.7,
                reviews: 156,
                featured: true
            },
            {
                id: 'rose-noir',
                name: 'Rose Noir',
                category: 'signature',
                price: 199.99,
                image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Dark rose petals intertwined with mysterious patchouli.',
                notes: ['floral', 'oriental'],
                gender: 'women',
                rating: 4.9,
                reviews: 203,
                featured: true
            },
            {
                id: 'vanilla-dreams',
                name: 'Vanilla Dreams',
                category: 'classic',
                price: 119.99,
                image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Sweet vanilla with hints of caramel and musk.',
                notes: ['oriental', 'woody'],
                gender: 'women',
                rating: 4.5,
                reviews: 98,
                featured: false
            },
            {
                id: 'citrus-burst',
                name: 'Citrus Burst',
                category: 'limited',
                price: 139.99,
                image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Energizing blend of lemon, lime, and grapefruit.',
                notes: ['fresh'],
                gender: 'unisex',
                rating: 4.4,
                reviews: 76,
                badge: 'sale',
                featured: false
            },
            {
                id: 'woody-essence',
                name: 'Woody Essence',
                category: 'signature',
                price: 179.99,
                image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Rich sandalwood and cedar with smoky undertones.',
                notes: ['woody', 'oriental'],
                gender: 'men',
                rating: 4.6,
                reviews: 134,
                featured: false
            },
            {
                id: 'floral-fantasy',
                name: 'Floral Fantasy',
                category: 'classic',
                price: 149.99,
                image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'A bouquet of jasmine, rose, and lily of the valley.',
                notes: ['floral'],
                gender: 'women',
                rating: 4.3,
                reviews: 67,
                featured: false
            },
            {
                id: 'mystic-oud',
                name: 'Mystic Oud',
                category: 'limited',
                price: 249.99,
                image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Exotic oud with rose and saffron accents.',
                notes: ['oriental', 'woody'],
                gender: 'unisex',
                rating: 4.8,
                reviews: 45,
                badge: 'exclusive',
                featured: false
            },
            {
                id: 'summer-breeze',
                name: 'Summer Breeze',
                category: 'seasonal',
                price: 109.99,
                image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Light and airy with coconut and sea salt.',
                notes: ['fresh'],
                gender: 'unisex',
                rating: 4.2,
                reviews: 89,
                badge: 'seasonal',
                featured: false
            },
            {
                id: 'midnight-musk',
                name: 'Midnight Musk',
                category: 'signature',
                price: 169.99,
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Deep musk with amber and black pepper.',
                notes: ['oriental', 'woody'],
                gender: 'men',
                rating: 4.7,
                reviews: 112,
                featured: false
            },
            {
                id: 'garden-party',
                name: 'Garden Party',
                category: 'classic',
                price: 134.99,
                image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Fresh garden flowers with green leaves.',
                notes: ['floral', 'fresh'],
                gender: 'women',
                rating: 4.4,
                reviews: 78,
                featured: false
            }
        ];

        this.filteredProducts = [...this.products];
    }

    bindEvents() {
        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleView(e.target.dataset.view);
            });
        });

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        // Filter events
        this.bindFilterEvents();

        // Pagination
        this.bindPaginationEvents();

        // Product actions
        this.bindProductActions();
    }

    bindFilterEvents() {
        // Category filters
        document.querySelectorAll('input[name="category"]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateCategoryFilter();
            });
        });

        // Price range
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.updatePriceFilter(e.target.value);
            });
        }

        // Notes filters
        document.querySelectorAll('input[name="notes"]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateNotesFilter();
            });
        });

        // Gender filters
        document.querySelectorAll('input[name="gender"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateGenderFilter(e.target.value);
            });
        });

        // Clear filters
        const clearFilters = document.querySelector('.clear-filters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    bindPaginationEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-number')) {
                const page = parseInt(e.target.textContent);
                this.goToPage(page);
            } else if (e.target.closest('.pagination-btn.prev')) {
                this.goToPage(this.currentPage - 1);
            } else if (e.target.closest('.pagination-btn.next')) {
                this.goToPage(this.currentPage + 1);
            }
        });
    }

    bindProductActions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-action.quick-view')) {
                const productId = e.target.closest('.product-card').dataset.productId;
                this.showQuickView(productId);
            } else if (e.target.closest('.product-action.add-to-cart')) {
                const productId = e.target.closest('.product-card').dataset.productId;
                this.addToCart(productId);
            } else if (e.target.closest('.product-action.wishlist')) {
                const productId = e.target.closest('.product-card').dataset.productId;
                this.toggleWishlist(productId);
            }
        });
    }

    initializeFilters() {
        // Set initial price display
        const maxPriceSpan = document.getElementById('maxPrice');
        if (maxPriceSpan) {
            maxPriceSpan.textContent = `$${this.filters.priceRange}`;
        }
    }

    updateCategoryFilter() {
        const checkedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(input => input.value)
            .filter(value => value !== 'all');
        
        this.filters.category = checkedCategories;
        this.applyFilters();
    }

    updatePriceFilter(value) {
        this.filters.priceRange = parseInt(value);
        const maxPriceSpan = document.getElementById('maxPrice');
        if (maxPriceSpan) {
            maxPriceSpan.textContent = `$${value}`;
        }
        this.applyFilters();
    }

    updateNotesFilter() {
        const checkedNotes = Array.from(document.querySelectorAll('input[name="notes"]:checked'))
            .map(input => input.value);
        
        this.filters.notes = checkedNotes;
        this.applyFilters();
    }

    updateGenderFilter(value) {
        this.filters.gender = value;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.category.length > 0 && !this.filters.category.includes(product.category)) {
                return false;
            }

            // Price filter
            if (product.price > this.filters.priceRange) {
                return false;
            }

            // Notes filter
            if (this.filters.notes.length > 0) {
                const hasMatchingNote = this.filters.notes.some(note => 
                    product.notes.includes(note)
                );
                if (!hasMatchingNote) {
                    return false;
                }
            }

            // Gender filter
            if (this.filters.gender !== 'all' && product.gender !== this.filters.gender) {
                return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.sortProducts(this.currentSort);
        this.updateResultsCount();
    }

    clearAllFilters() {
        // Reset filter values
        this.filters = {
            category: [],
            priceRange: 300,
            notes: [],
            gender: 'all'
        };

        // Reset UI
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.checked = input.value === 'all';
        });
        
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = input.value === 'all';
        });

        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = 300;
        }

        const maxPriceSpan = document.getElementById('maxPrice');
        if (maxPriceSpan) {
            maxPriceSpan.textContent = '$300';
        }

        // Apply filters
        this.applyFilters();
    }

    sortProducts(sortBy) {
        this.currentSort = sortBy;
        
        switch (sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
                break;
            case 'featured':
            default:
                this.filteredProducts.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.rating - a.rating;
                });
                break;
        }

        this.renderProducts();
    }

    toggleView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update grid class
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.classList.toggle('list-view', view === 'list');
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        this.renderPagination();
    }

    createProductCard(product) {
        const badgeHtml = product.badge ? `<div class="product-badge ${product.badge}">${product.badge}</div>` : '';
        const originalPriceHtml = product.originalPrice ? 
            `<span class="original-price">$${product.originalPrice}</span>` : '';
        
        const stars = Array.from({length: 5}, (_, i) => {
            const filled = i < Math.floor(product.rating);
            const half = i === Math.floor(product.rating) && product.rating % 1 >= 0.5;
            return filled ? '<i class="fas fa-star"></i>' : 
                   half ? '<i class="fas fa-star-half-alt"></i>' : 
                   '<i class="far fa-star"></i>';
        }).join('');

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <div class="product-actions">
                            <button class="product-action quick-view" title="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="product-action add-to-cart" title="Add to Cart">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                            <button class="product-action wishlist" title="Add to Wishlist">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    ${badgeHtml}
                </div>
                <div class="product-content">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-notes">
                        ${product.notes.map(note => `<span class="product-note">${note}</span>`).join('')}
                    </div>
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="current-price">$${product.price}</span>
                            ${originalPriceHtml}
                        </div>
                        <div class="product-rating">
                            <div class="rating-stars">${stars}</div>
                            <span class="rating-count">(${product.reviews})</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const pagination = document.querySelector('.pagination');
        
        if (!pagination || totalPages <= 1) {
            if (pagination) pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';

        const prevBtn = pagination.querySelector('.pagination-btn.prev');
        const nextBtn = pagination.querySelector('.pagination-btn.next');
        const numbersContainer = pagination.querySelector('.pagination-numbers');

        // Update prev/next buttons
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }

        // Generate page numbers
        let numbersHtml = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            numbersHtml += `<button class="pagination-number">1</button>`;
            if (startPage > 2) {
                numbersHtml += `<span class="pagination-dots">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            numbersHtml += `<button class="pagination-number ${i === this.currentPage ? 'active' : ''}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                numbersHtml += `<span class="pagination-dots">...</span>`;
            }
            numbersHtml += `<button class="pagination-number">${totalPages}</button>`;
        }

        if (numbersContainer) {
            numbersContainer.innerHTML = numbersHtml;
        }
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderProducts();
        
        // Scroll to top of products
        document.querySelector('.shop-main').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.filteredProducts.length;
        }
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Create and show modal (reuse from main.js)
        if (window.amazingAura && window.amazingAura.showQuickView) {
            window.amazingAura.showQuickView(productId);
        } else {
            console.log('Quick view for:', product.name);
            // Fallback implementation
            alert(`Quick view for ${product.name}\nPrice: $${product.price}\n${product.description}`);
        }
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Add to cart logic (integrate with main cart system)
        if (window.amazingAura && window.amazingAura.addToCart) {
            window.amazingAura.addToCart(productId);
        } else {
            console.log('Added to cart:', product.name);
            this.showNotification(`${product.name} added to cart!`, 'success');
        }
    }

    toggleWishlist(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Toggle wishlist logic
        if (window.amazingAura && window.amazingAura.toggleWishlist) {
            window.amazingAura.toggleWishlist(productId);
        } else {
            console.log('Toggled wishlist for:', product.name);
            this.showNotification(`${product.name} added to wishlist!`, 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Use main notification system if available
        if (window.amazingAura && window.amazingAura.showNotification) {
            window.amazingAura.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Search functionality
    search(query) {
        if (!query.trim()) {
            this.filteredProducts = [...this.products];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredProducts = this.products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.notes.some(note => note.toLowerCase().includes(searchTerm)) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }
        
        this.currentPage = 1;
        this.renderProducts();
        this.updateResultsCount();
    }

    // Filter by URL parameters
    applyUrlFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');
        
        if (filter) {
            // Apply category filter based on URL
            const categoryInput = document.querySelector(`input[name="category"][value="${filter}"]`);
            if (categoryInput) {
                categoryInput.checked = true;
                this.updateCategoryFilter();
            }
        }
    }
}

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const shopManager = new ShopManager();
    
    // Make shop manager globally available
    window.shopManager = shopManager;
    
    // Apply URL filters if any
    shopManager.applyUrlFilters();
    
    // Handle search from main navigation
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            shopManager.search(e.target.value);
        });
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    if (window.shopManager) {
        window.shopManager.applyUrlFilters();
    }
});

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    // Observe images when they're added to the DOM
    const observeImages = () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    };

    // Initial observation
    setTimeout(observeImages, 100);
    
    // Re-observe when new products are rendered
    const originalRenderProducts = ShopManager.prototype.renderProducts;
    ShopManager.prototype.renderProducts = function() {
        originalRenderProducts.call(this);
        setTimeout(observeImages, 100);
    };
}