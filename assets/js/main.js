// ===== MODERN PERFUME WEBSITE JAVASCRIPT =====

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
        
        // Initialize cart
        this.cart = [];
        this.wishlist = [];
        
        // Initialize quiz
        this.quizData = {
            currentQuestion: 1,
            totalQuestions: 3,
            answers: {},
            fragranceProfiles: {
                fresh: {
                    name: "Ocean Breeze",
                    description: "Fresh and invigorating, perfect for the free-spirited individual who loves the ocean's embrace.",
                    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                    price: "$129.99"
                },
                elegant: {
                    name: "Midnight Elegance",
                    description: "Sophisticated and mysterious, ideal for the confident person who commands attention.",
                    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                    price: "$189.99"
                },
                romantic: {
                    name: "Rose Noir",
                    description: "Passionate and alluring, perfect for the romantic soul who believes in timeless love.",
                    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                    price: "$199.99"
                },
                modern: {
                    name: "Golden Dawn",
                    description: "Bold and contemporary, designed for the trendsetter who embraces innovation.",
                    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                    price: "$159.99"
                }
            }
        };

        // Initialize testimonials
        this.testimonialIndex = 0;
        this.testimonials = document.querySelectorAll('.testimonial-card');
        
        // Initialize smooth scrolling
        this.initSmoothScrolling();
    }

    initLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingProgress = document.querySelector('.loading-progress');
        
        if (loadingScreen && loadingProgress) {
            // Simulate loading progress
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

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }

        // Active nav link highlighting
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
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

    initSmoothScrolling() {
        // Smooth scroll for anchor links
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

    bindEvents() {
        // Search functionality
        this.initSearch();
        
        // Cart functionality
        this.initCart();
        
        // Quiz functionality
        this.initQuiz();
        
        // Testimonials slider
        this.initTestimonials();
        
        // Newsletter form
        this.initNewsletter();
        
        // Product interactions
        this.initProductInteractions();
        
        // Modal functionality
        this.initModal();
        
        // Hero interactions
        this.initHeroInteractions();
    }

    initSearch() {
        const searchBtn = document.getElementById('searchBtn');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');

        if (searchBtn && searchOverlay) {
            searchBtn.addEventListener('click', () => {
                searchOverlay.classList.add('active');
                setTimeout(() => searchInput?.focus(), 300);
            });
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
            });
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    searchOverlay.classList.remove('active');
                }
            });
        }

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.performSearch(query);
            });
        }
    }

    performSearch(query) {
        // Mock search functionality
        const fragrances = [
            'Midnight Elegance', 'Golden Dawn', 'Ocean Breeze', 'Rose Noir',
            'Vanilla Dreams', 'Citrus Burst', 'Woody Essence', 'Floral Fantasy'
        ];
        
        const results = fragrances.filter(fragrance => 
            fragrance.toLowerCase().includes(query)
        );
        
        console.log('Search results:', results);
        // In a real application, you would display these results
    }

    initCart() {
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartClose = document.getElementById('cartClose');
        const cartCount = document.querySelector('.cart-count');

        if (cartBtn && cartSidebar) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.add('active');
            });
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const productId = e.target.closest('.add-to-cart').dataset.product;
                this.addToCart(productId);
            }
        });

        // Wishlist buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist')) {
                const productId = e.target.closest('.wishlist').dataset.product;
                this.toggleWishlist(productId);
            }
        });
    }

    addToCart(productId) {
        const product = this.getProductById(productId);
        if (product) {
            this.cart.push(product);
            this.updateCartCount();
            this.showNotification(`${product.name} added to cart!`, 'success');
            this.updateCartDisplay();
        }
    }

    toggleWishlist(productId) {
        const product = this.getProductById(productId);
        const existingIndex = this.wishlist.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            this.wishlist.splice(existingIndex, 1);
            this.showNotification(`${product.name} removed from wishlist`, 'info');
        } else {
            this.wishlist.push(product);
            this.showNotification(`${product.name} added to wishlist!`, 'success');
        }
        
        this.updateWishlistUI(productId);
    }

    getProductById(productId) {
        const products = {
            'midnight-elegance': {
                id: 'midnight-elegance',
                name: 'Midnight Elegance',
                price: 189.99,
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
            },
            'golden-dawn': {
                id: 'golden-dawn',
                name: 'Golden Dawn',
                price: 159.99,
                image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
            },
            'ocean-breeze': {
                id: 'ocean-breeze',
                name: 'Ocean Breeze',
                price: 129.99,
                image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
            },
            'rose-noir': {
                id: 'rose-noir',
                name: 'Rose Noir',
                price: 199.99,
                image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
            }
        };
        
        return products[productId];
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
            cartCount.style.display = this.cart.length > 0 ? 'block' : 'none';
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
                    <button class="btn btn-primary">Start Shopping</button>
                </div>
            `;
        } else {
            const cartItems = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price}</p>
                    </div>
                    <button class="cart-item-remove" data-product="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            const total = this.cart.reduce((sum, item) => sum + item.price, 0);

            cartContent.innerHTML = `
                <div class="cart-items">
                    ${cartItems}
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: $${total.toFixed(2)}</strong>
                    </div>
                    <button class="btn btn-primary cart-checkout">Checkout</button>
                </div>
            `;
        }
    }

    updateWishlistUI(productId) {
        const wishlistBtn = document.querySelector(`[data-product="${productId}"].wishlist`);
        if (wishlistBtn) {
            const isInWishlist = this.wishlist.some(item => item.id === productId);
            wishlistBtn.classList.toggle('active', isInWishlist);
        }
    }

    initQuiz() {
        const quizContent = document.getElementById('quizContent');
        const quizResult = document.getElementById('quizResult');
        const progressFill = document.getElementById('progressFill');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const retakeQuizBtn = document.getElementById('retakeQuiz');

        if (!quizContent) return;

        // Quiz option selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.option-btn')) {
                const optionBtn = e.target.closest('.option-btn');
                const question = optionBtn.closest('.quiz-question');
                const questionNumber = question.dataset.question;
                const value = optionBtn.dataset.value;
                const weight = optionBtn.dataset.weight;

                // Remove previous selection
                question.querySelectorAll('.option-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });

                // Add selection
                optionBtn.classList.add('selected');

                // Store answer
                this.quizData.answers[questionNumber] = { value, weight };

                // Auto-advance after selection
                setTimeout(() => {
                    this.nextQuestion();
                }, 800);
            }
        });

        // Retake quiz
        if (retakeQuizBtn) {
            retakeQuizBtn.addEventListener('click', () => {
                this.resetQuiz();
            });
        }
    }

    nextQuestion() {
        const currentQuestion = document.querySelector('.quiz-question.active');
        const nextQuestionNumber = this.quizData.currentQuestion + 1;
        const nextQuestion = document.querySelector(`[data-question="${nextQuestionNumber}"]`);

        if (nextQuestion) {
            // Hide current question
            currentQuestion.classList.remove('active');
            
            // Show next question
            nextQuestion.classList.add('active');
            
            // Update progress
            this.quizData.currentQuestion = nextQuestionNumber;
            this.updateQuizProgress();
        } else {
            // Quiz completed
            this.completeQuiz();
        }
    }

    updateQuizProgress() {
        const progressFill = document.getElementById('progressFill');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        
        if (progressFill) {
            const progress = (this.quizData.currentQuestion / this.quizData.totalQuestions) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = this.quizData.currentQuestion;
        }
    }

    completeQuiz() {
        const quizContent = document.getElementById('quizContent');
        const quizResult = document.getElementById('quizResult');
        
        // Calculate result based on answers
        const result = this.calculateQuizResult();
        
        // Hide quiz content
        if (quizContent) {
            quizContent.style.display = 'none';
        }
        
        // Show result
        if (quizResult) {
            this.displayQuizResult(result);
            quizResult.style.display = 'block';
        }
    }

    calculateQuizResult() {
        const weights = Object.values(this.quizData.answers).map(answer => answer.weight);
        const weightCounts = {};
        
        weights.forEach(weight => {
            weightCounts[weight] = (weightCounts[weight] || 0) + 1;
        });
        
        // Find the most common weight
        const dominantWeight = Object.keys(weightCounts).reduce((a, b) => 
            weightCounts[a] > weightCounts[b] ? a : b
        );
        
        return this.quizData.fragranceProfiles[dominantWeight] || this.quizData.fragranceProfiles.fresh;
    }

    displayQuizResult(result) {
        const resultTitle = document.getElementById('resultTitle');
        const resultDescription = document.getElementById('resultDescription');
        const recommendedProduct = document.getElementById('recommendedProduct');
        const shopRecommendation = document.getElementById('shopRecommendation');

        if (resultTitle) {
            resultTitle.textContent = `Your Perfect Match: ${result.name}`;
        }
        
        if (resultDescription) {
            resultDescription.textContent = result.description;
        }
        
        if (recommendedProduct) {
            recommendedProduct.innerHTML = `
                <div class="recommended-product-card">
                    <img src="${result.image}" alt="${result.name}" class="recommended-image">
                    <div class="recommended-details">
                        <h4>${result.name}</h4>
                        <p class="recommended-price">${result.price}</p>
                    </div>
                </div>
            `;
        }
        
        if (shopRecommendation) {
            shopRecommendation.addEventListener('click', () => {
                this.showNotification('Redirecting to product page...', 'info');
                // In a real application, redirect to the product page
            });
        }
    }

    resetQuiz() {
        this.quizData.currentQuestion = 1;
        this.quizData.answers = {};
        
        // Reset UI
        document.querySelectorAll('.quiz-question').forEach(question => {
            question.classList.remove('active');
            question.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
        });
        
        document.querySelector('[data-question="1"]').classList.add('active');
        document.getElementById('quizContent').style.display = 'block';
        document.getElementById('quizResult').style.display = 'none';
        
        this.updateQuizProgress();
    }

    initTestimonials() {
        const testimonialPrev = document.getElementById('testimonialPrev');
        const testimonialNext = document.getElementById('testimonialNext');
        const testimonialsDots = document.getElementById('testimonialsDots');

        if (!this.testimonials.length) return;

        // Create dots
        if (testimonialsDots) {
            this.testimonials.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => this.goToTestimonial(index));
                testimonialsDots.appendChild(dot);
            });
        }

        // Navigation buttons
        if (testimonialPrev) {
            testimonialPrev.addEventListener('click', () => this.previousTestimonial());
        }
        
        if (testimonialNext) {
            testimonialNext.addEventListener('click', () => this.nextTestimonial());
        }

        // Auto-play testimonials
        this.startTestimonialAutoplay();
    }

    nextTestimonial() {
        this.testimonialIndex = (this.testimonialIndex + 1) % this.testimonials.length;
        this.updateTestimonialDisplay();
    }

    previousTestimonial() {
        this.testimonialIndex = (this.testimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.updateTestimonialDisplay();
    }

    goToTestimonial(index) {
        this.testimonialIndex = index;
        this.updateTestimonialDisplay();
    }

    updateTestimonialDisplay() {
        // Update testimonial cards
        this.testimonials.forEach((testimonial, index) => {
            testimonial.classList.toggle('active', index === this.testimonialIndex);
        });

        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.testimonialIndex);
        });
    }

    startTestimonialAutoplay() {
        setInterval(() => {
            this.nextTestimonial();
        }, 5000); // Change every 5 seconds
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
        // Simulate API call
        this.showNotification('Subscribing...', 'info');
        
        setTimeout(() => {
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            document.getElementById('newsletterForm').reset();
        }, 1500);
    }

    initProductInteractions() {
        // Quick view functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-view')) {
                const productId = e.target.closest('.quick-view').dataset.product;
                this.showQuickView(productId);
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

    showQuickView(productId) {
        const product = this.getProductById(productId);
        if (!product) return;

        const modal = document.getElementById('quickViewModal');
        const modalBody = document.getElementById('modalBody');
        
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="quick-view-details">
                        <h2>${product.name}</h2>
                        <p class="quick-view-price">$${product.price}</p>
                        <p class="quick-view-description">
                            Experience the luxury of ${product.name}, crafted with the finest ingredients 
                            to create an unforgettable fragrance that defines your unique essence.
                        </p>
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

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    initHeroInteractions() {
        const exploreBtn = document.getElementById('exploreBtn');
        const watchBtn = document.getElementById('watchBtn');

        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                document.getElementById('collections').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        if (watchBtn) {
            watchBtn.addEventListener('click', () => {
                this.showNotification('Video player would open here', 'info');
                // In a real application, open video modal or redirect to video
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
        // Initialize counter animations
        this.initCounterAnimations();
        
        // Initialize intersection observer for animations
        this.initIntersectionObserver();
        
        // Initialize particle effects
        this.initParticleEffects();
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
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
            
            // Start animation when element is in view
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

        // Observe elements for animation
        document.querySelectorAll('.collection-card, .feature-card, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }

    initParticleEffects() {
        // Add subtle particle effects to hero section
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

        // Create floating particles
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

        // Add CSS animation for particles
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

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AmazingAura();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or videos when page is hidden
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when page is visible
        console.log('Page visible - resuming animations');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    });
}

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}