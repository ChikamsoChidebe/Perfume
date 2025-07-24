// Shop page functionality
let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    gender: [],
    family: [],
    occasion: [],
    maxPrice: 200
};

// Sample product data
const sampleProducts = [
    {
        id: 'midnight-rose',
        name: 'Midnight flower',
        price: 89.99,
        description: 'A sensual blend of dark rose and warm vanilla',
        image: 'midnight-rose.jpg',
        gender: 'women',
        family: 'floral',
        occasion: 'evening',
        notes: ['Rose', 'Vanilla', 'Musk'],
        badge: 'Bestseller'
    },
    {
        id: 'golden-amber',
        name: 'Golden Amber',
        price: 95.99,
        description: 'Warm amber with citrus bergamot and woody cedar',
        image: 'golden-amber.jpg',
        gender: 'unisex',
        family: 'oriental',
        occasion: 'daily',
        notes: ['Amber', 'Bergamot', 'Cedar'],
        badge: 'New'
    },
    {
        id: 'ocean-breeze',
        name: 'Ocean Breeze',
        price: 79.99,
        description: 'Fresh marine notes with delicate jasmine',
        image: 'ocean-breeze.jpg',
        gender: 'unisex',
        family: 'fresh',
        occasion: 'daily',
        notes: ['Marine', 'Jasmine', 'Driftwood']
    },
    {
        id: 'velvet-noir',
        name: 'Velvet Noir',
        price: 105.99,
        description: 'Dark and mysterious with leather undertones',
        image: 'velvet-noir.jpg',
        gender: 'men',
        family: 'woody',
        occasion: 'evening',
        notes: ['Blackcurrant', 'Patchouli', 'Leather'],
        badge: 'Premium'
    },
    {
        id: 'spring-garden',
        name: 'Spring Garden',
        price: 72.99,
        description: 'Delicate florals with fresh green notes',
        image: 'spring-garden.jpg',
        gender: 'women',
        family: 'floral',
        occasion: 'daily',
        notes: ['Peony', 'Green Leaves', 'White Musk']
    },
    {
        id: 'urban-legend',
        name: 'Urban Legend',
        price: 98.99,
        description: 'Bold and contemporary with spicy undertones',
        image: 'urban-legend.jpg',
        gender: 'men',
        family: 'oriental',
        occasion: 'special',
        notes: ['Black Pepper', 'Cardamom', 'Sandalwood']
    },
    {
        id: 'crystal-waters',
        name: 'Crystal Waters',
        price: 84.99,
        description: 'Pure and refreshing aquatic fragrance',
        image: 'crystal-waters.jpg',
        gender: 'unisex',
        family: 'fresh',
        occasion: 'daily',
        notes: ['Sea Salt', 'Mint', 'Cedarwood']
    },
    {
        id: 'royal-oud',
        name: 'Royal Oud',
        price: 149.99,
        description: 'Luxurious oud with rose and saffron',
        image: 'royal-oud.jpg',
        gender: 'unisex',
        family: 'oriental',
        occasion: 'special',
        notes: ['Oud', 'Rose', 'Saffron'],
        badge: 'Luxury'
    }
];

// Initialize shop page
document.addEventListener('DOMContentLoaded', function() {
    allProducts = [...sampleProducts];
    filteredProducts = [...allProducts];
    
    initializeFilters();
    renderProducts();
    initializeSort();
    updateResultsCount();
});

// Initialize filter functionality
function initializeFilters() {
    // Gender filters
    document.querySelectorAll('input[name="gender"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Family filters
    document.querySelectorAll('input[name="family"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Occasion filters
    document.querySelectorAll('input[name="occasion"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Price range filter
    const priceRange = document.getElementById('priceRange');
    const maxPriceDisplay = document.getElementById('maxPrice');
    
    priceRange.addEventListener('input', (e) => {
        const value = e.target.value;
        maxPriceDisplay.textContent = `$${value}`;
        currentFilters.maxPrice = parseInt(value);
        applyFilters();
    });

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
}

// Handle filter changes
function handleFilterChange(e) {
    const filterType = e.target.name;
    const filterValue = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
        if (!currentFilters[filterType].includes(filterValue)) {
            currentFilters[filterType].push(filterValue);
        }
    } else {
        currentFilters[filterType] = currentFilters[filterType].filter(value => value !== filterValue);
    }

    applyFilters();
}

// Apply all filters
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Gender filter
        if (currentFilters.gender.length > 0 && !currentFilters.gender.includes(product.gender)) {
            return false;
        }

        // Family filter
        if (currentFilters.family.length > 0 && !currentFilters.family.includes(product.family)) {
            return false;
        }

        // Occasion filter
        if (currentFilters.occasion.length > 0 && !currentFilters.occasion.includes(product.occasion)) {
            return false;
        }

        // Price filter
        if (product.price > currentFilters.maxPrice) {
            return false;
        }

        return true;
    });

    renderProducts();
    updateResultsCount();
}

// Clear all filters
function clearAllFilters() {
    // Reset filter object
    currentFilters = {
        gender: [],
        family: [],
        occasion: [],
        maxPrice: 200
    };

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset price range
    document.getElementById('priceRange').value = 200;
    document.getElementById('maxPrice').textContent = '$200';

    // Reset products
    filteredProducts = [...allProducts];
    renderProducts();
    updateResultsCount();
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <div class="no-products-icon">🔍</div>
                <h3>No fragrances found</h3>
                <p>Try adjusting your filters to see more results</p>
                <button class="clear-filters-btn" onclick="clearAllFilters()">Clear All Filters</button>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">
                <img src="assets/images/${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-notes">
                    ${product.notes.map(note => `<span class="note-tag">${note}</span>`).join('')}
                </div>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" onclick="addToCart({id: '${product.id}', name: '${product.name}', price: ${product.price}})">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary quick-view-btn" onclick="openQuickView('${product.id}')">
                        Quick View
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Animate product cards
    gsap.from('.product-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
    });
}

// Initialize sorting
function initializeSort() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        sortProducts(sortBy);
    });
}

// Sort products
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            // Assuming newer products have higher IDs or you could add a date field
            filteredProducts.reverse();
            break;
        default:
            // Featured - keep original order or implement featured logic
            break;
    }
    
    renderProducts();
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    resultsCount.textContent = filteredProducts.length;
}

// Enhanced quick view function
function openQuickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="quick-view-content">
            <div class="product-image-section">
                <img src="assets/images/${product.image}" alt="${product.name}" class="main-product-image">
                <div class="image-gallery">
                    <img src="assets/images/${product.image}" alt="${product.name}" class="thumbnail active">
                    <img src="assets/images/${product.id}-2.jpg" alt="${product.name}" class="thumbnail">
                    <img src="assets/images/${product.id}-3.jpg" alt="${product.name}" class="thumbnail">
                </div>
            </div>
            <div class="product-details-section">
                <h2>${product.name}</h2>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <p class="product-description">${product.description}</p>
                
                <div class="scent-pyramid">
                    <h4>Scent Notes:</h4>
                    <div class="notes-pyramid">
                        <div class="pyramid-level top">
                            <span class="level-label">Top</span>
                            <div class="notes">${product.notes[0]}</div>
                        </div>
                        <div class="pyramid-level middle">
                            <span class="level-label">Heart</span>
                            <div class="notes">${product.notes[1] || 'Floral Bouquet'}</div>
                        </div>
                        <div class="pyramid-level base">
                            <span class="level-label">Base</span>
                            <div class="notes">${product.notes[2] || 'Warm Woods'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <span class="meta-label">Gender:</span>
                        <span class="meta-value">${product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Family:</span>
                        <span class="meta-value">${product.family.charAt(0).toUpperCase() + product.family.slice(1)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Occasion:</span>
                        <span class="meta-value">${product.occasion.charAt(0).toUpperCase() + product.occasion.slice(1)}</span>
                    </div>
                </div>
                
                <div class="product-price-section">
                    <div class="price">$${product.price}</div>
                    <div class="price-note">Free shipping on orders over $75</div>
                </div>
                
                <div class="product-actions-section">
                    <div class="quantity-selector">
                        <button class="qty-btn minus">-</button>
                        <input type="number" value="1" min="1" class="qty-input">
                        <button class="qty-btn plus">+</button>
                    </div>
                    <button class="btn btn-primary add-to-cart-main" onclick="addToCart({id: '${product.id}', name: '${product.name}', price: ${product.price}})">
                        Add to Cart - $${product.price}
                    </button>
                </div>
                
                <div class="product-features">
                    <div class="feature">
                        <span class="feature-icon">🚚</span>
                        <span>Free Shipping</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">↩️</span>
                        <span>30-Day Returns</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🎁</span>
                        <span>Gift Wrapping</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Initialize quantity selector
    initializeQuantitySelector();
    
    // Close modal functionality
    document.getElementById('modalClose').onclick = () => modal.classList.remove('active');
    document.getElementById('modalOverlay').onclick = () => modal.classList.remove('active');
}

// Initialize quantity selector in modal
function initializeQuantitySelector() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.qty-input');
    
    if (minusBtn && plusBtn && qtyInput) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            if (currentValue > 1) {
                qtyInput.value = currentValue - 1;
            }
        });
        
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            qtyInput.value = currentValue + 1;
        });
    }
}

// Search functionality
function performSearch(query) {
    if (!query.trim()) {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.notes.some(note => note.toLowerCase().includes(query.toLowerCase()))
        );
    }
    
    renderProducts();
    updateResultsCount();
}

// Initialize search
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    performSearch(e.target.value);
});

// Load more functionality (for pagination)
document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
    // In a real app, this would load more products from the server
    console.log('Loading more products...');
    
    // Simulate loading
    const btn = document.getElementById('loadMoreBtn');
    btn.textContent = 'Loading...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = 'Load More Fragrances';
        btn.disabled = false;
    }, 1000);
});