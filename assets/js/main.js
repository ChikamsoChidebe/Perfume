// ===== AMAZING AURA MAIN APPLICATION =====

class AmazingAura {
    constructor() {
        this.init();
        this.bindEvents();
        this.initializeComponents();
    }

    init() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }

        // Initialize loading screen
        this.initLoadingScreen();
        
        // Initialize navigation
        this.initNavigation();
        

        
        // Initialize testimonials
        this.initTestimonials();
        
        // Initialize smooth scrolling
        this.initSmoothScrolling();
        
        // Load featured products on homepage
        if (this.isHomePage()) {
            this.loadFeaturedProducts();
        }
    }

    isHomePage() {
        return window.location.pathname === '/' || 
               window.location.pathname.includes('index.html') ||
               window.location.pathname === '/Perfume/' ||
               window.location.pathname === '/Perfume/index.html';
    }

    initLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingProgress = document.querySelector('.loading-progress');
        
        if (loadingScreen && loadingProgress) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        document.body.style.overflow = 'visible';
                    }, 500);
                }
                loadingProgress.style.width = `${progress}%`;
            }, 100);
        }
    }

    initNavigation() {
        const navbar = document.getElementById('navbar');
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        const searchBtn = document.getElementById('searchBtn');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = navMenu.classList.contains('active');
                
                if (isActive) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                } else {
                    navMenu.classList.add('active');
                    menuToggle.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && menuToggle) {
                if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu && menuToggle) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Search functionality
        if (searchBtn && searchOverlay) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                searchOverlay.classList.add('active');
                setTimeout(() => searchInput?.focus(), 300);
            });
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchOverlay?.classList.remove('active');
            });
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    searchOverlay.classList.remove('active');
                }
            });
        }

        // Search input functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.performSearch(query);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = e.target.value.toLowerCase();
                    this.redirectToSearch(query);
                }
            });
        }

        // Active nav link highlighting for single page sections
        if (this.isHomePage()) {
            window.addEventListener('scroll', () => {
                let current = '';
                const sections = document.querySelectorAll('section[id]');
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (scrollY >= (sectionTop - 200)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            });
        }
    }

    performSearch(query) {
        if (!query || query.length < 2) return;

        const results = window.productDB.searchProducts(query).slice(0, 5);
        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        const searchInput = document.getElementById('searchInput');
        let dropdown = document.getElementById('searchDropdown');
        
        // Remove existing dropdown
        if (dropdown) {
            dropdown.remove();
        }
        
        if (results.length === 0 || !query) return;
        
        // Create dropdown
        dropdown = document.createElement('div');
        dropdown.id = 'searchDropdown';
        dropdown.className = 'search-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
        `;
        
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.style.cssText = `
                padding: 12px 20px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.2s;
                display: flex;
                align-items: center;
                gap: 12px;
            `;
            item.innerHTML = `
                <img src="${result.images[0]}" alt="${result.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;">
                <div>
                    <div style="font-weight: 500; color: #333;">${result.name}</div>
                    <div style="font-size: 12px; color: #666;">${result.category} • Contact for Price</div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                window.location.href = `product.html?id=${result.id}`;
            });
            
            item.addEventListener('mouseenter', () => {
                item.style.background = '#f8f6f0';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = 'white';
            });
            
            dropdown.appendChild(item);
        });
        
        searchInput.parentNode.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== searchInput) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }

    redirectToSearch(query) {
        if (query) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
    }

    loadFeaturedProducts() {
        const collectionsGrid = document.querySelector('.collections-grid');
        if (!collectionsGrid) return;

        const featuredProducts = window.productDB.getFeaturedProducts().slice(0, 3);
        
        collectionsGrid.innerHTML = featuredProducts.map((product, index) => `
            <div class="collection-card ${index === 0 ? 'featured' : ''}" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="card-image">
                    <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                    <div class="card-overlay">
                        <div class="card-actions">
                            <button class="action-btn quick-view" data-product="${product.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn add-to-cart" data-product="${product.id}">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                            <button class="action-btn wishlist" data-product="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    ${product.badge ? `<div class="card-badge">${product.badge}</div>` : ''}
                </div>
                <div class="card-content">
                    <div class="card-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)} Collection</div>
                    <h3 class="card-title">${product.name}</h3>
                    <p class="card-description">${product.description.substring(0, 120)}...</p>
                    <div class="card-notes">
                        ${product.notes.top.slice(0, 3).map(note => `<span class="note">${note}</span>`).join('')}
                    </div>
                    <div class="card-footer">
                        <div class="price">
                            <span class="contact-price">Contact for Price</span>
                        </div>
                        <div class="rating">
                            <div class="stars">
                                ${this.generateStars(product.rating)}
                            </div>
                            <span class="rating-count">(${product.reviews})</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    bindEvents() {
        // Product interactions
        this.initProductInteractions();
        

        
        // Testimonials slider
        this.initTestimonials();
        
        // Newsletter form
        this.initNewsletter();
        
        // Modal functionality
        this.initModal();
        
        // Hero interactions
        this.initHeroInteractions();
    }

    initProductInteractions() {
        // Quick view functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-view')) {
                const productId = e.target.closest('.quick-view').dataset.product;
                this.showQuickView(productId);
            }
            
            if (e.target.closest('.add-to-cart')) {
                const productId = e.target.closest('.add-to-cart').dataset.product;
                this.addToCart(productId);
            }
            
            if (e.target.closest('.wishlist')) {
                const productId = e.target.closest('.wishlist').dataset.product;
                this.toggleWishlist(productId);
            }
        });

        // Product card hover effects
        document.querySelectorAll('.collection-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateProductCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateProductCard(card, 'leave');
            });
        });
    }

    addToCart(productId) {
        const product = window.productDB.getProductById(productId);
        if (product && window.cartSystem) {
            const cartProduct = {
                id: product.id,
                name: product.name,
                image: product.images[0]
            };
            window.cartSystem.addToCart(cartProduct);
        }
    }

    toggleWishlist(productId) {
        const product = window.productDB.getProductById(productId);
        if (product && window.cartSystem) {
            const wishlistProduct = {
                id: product.id,
                name: product.name,
                image: product.images[0]
            };
            
            if (window.cartSystem.isInWishlist(productId)) {
                window.cartSystem.removeFromWishlist(productId);
            } else {
                window.cartSystem.addToWishlist(wishlistProduct);
            }
            this.updateWishlistUI(productId);
        }
    }

    updateWishlistUI(productId) {
        const wishlistBtn = document.querySelector(`[data-product="${productId}"].wishlist`);
        if (wishlistBtn && window.cartSystem) {
            const isInWishlist = window.cartSystem.isInWishlist(productId);
            wishlistBtn.classList.toggle('active', isInWishlist);
        }
    }

    showQuickView(productId) {
        const product = window.productDB.getProductById(productId);
        if (!product) return;

        const modal = document.getElementById('quickViewModal');
        const modalBody = document.getElementById('modalBody');
        
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="quick-view-details">
                        <h2>${product.name}</h2>
                        <p class="quick-view-price">Contact for Price</p>
                        <p class="quick-view-description">${product.description}</p>
                        <div class="quick-view-actions">
                            <button class="btn btn-primary add-to-cart" data-product="${product.id}">
                                Add to Cart
                            </button>
                            <button class="btn btn-outline wishlist" data-product="${product.id}">
                                <i class="fas fa-heart"></i> Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (modal) {
            modal.classList.add('active');
        }
    }

    animateProductCard(card, action) {
        const image = card.querySelector('.card-image img');
        const overlay = card.querySelector('.card-overlay');
        
        if (action === 'enter') {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            if (overlay) {
                overlay.style.opacity = '1';
            }
        } else {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            if (overlay) {
                overlay.style.opacity = '0';
            }
        }
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }



    initTestimonials() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        if (!testimonials.length) return;

        let currentIndex = 0;
        
        const showTestimonial = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
        };

        const nextTestimonial = () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        };

        // Auto-play testimonials
        setInterval(nextTestimonial, 5000);
        
        // Initialize first testimonial
        showTestimonial(0);
    }

    initNewsletter() {
        const newsletterForm = document.getElementById('newsletterForm');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                if (this.validateEmail(email)) {
                    this.subscribeNewsletter(email);
                } else {
                    this.showNotification('Please enter a valid email address', 'error');
                }
            });
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    subscribeNewsletter(email) {
        this.showNotification('Subscribing...', 'info');
        
        setTimeout(() => {
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            document.getElementById('newsletterForm').reset();
        }, 1500);
    }

    initModal() {
        const modal = document.getElementById('quickViewModal');
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    initHeroInteractions() {
        const exploreBtn = document.getElementById('exploreBtn');
        const quizBtn = document.getElementById('quizBtn');

        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                const collectionsSection = document.getElementById('collections');
                if (collectionsSection) {
                    collectionsSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = 'shop.html';
                }
            });
        }

        if (quizBtn) {
            quizBtn.addEventListener('click', () => {
                const discoverySection = document.getElementById('discovery');
                if (discoverySection) {
                    discoverySection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = 'shop.html';
                }
            });
        }

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroImage = document.querySelector('.hero-image');
            
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });


    }

    initializeComponents() {
        this.initCounterAnimations();
        this.initIntersectionObserver();
        this.initParticleEffects();
        this.initMobileNavigation();
    }

    initMobileNavigation() {
        // Update mobile nav active states
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        
        mobileNavItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                item.classList.add('active');
            }
        });
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.collection-card, .feature-card, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }

    initParticleEffects() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(212, 175, 55, 0.6);
                border-radius: 50%;
                animation: float ${5 + Math.random() * 10}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleContainer.appendChild(particle);
        }

        hero.appendChild(particleContainer);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
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
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AmazingAura();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing animations');
    } else {
        console.log('Page visible - resuming animations');
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    });
}