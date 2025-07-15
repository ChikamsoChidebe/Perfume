// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Global variables
let cart = [];
let currentQuizQuestion = 1;
let quizAnswers = {};

// DOM Elements
const navbar = document.getElementById('navbar');
const heroParticles = document.getElementById('heroParticles');
const carouselTrack = document.getElementById('carouselTrack');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeCarousel();
    initializeQuiz();
    initializeCart();
    createParticles();
});

// Navigation functionality
function initializeNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Voice search functionality
    const voiceSearch = document.getElementById('voiceSearch');
    if (voiceSearch && 'webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        voiceSearch.addEventListener('click', () => {
            recognition.start();
            voiceSearch.style.color = 'var(--gold)';
        });

        recognition.onresult = (event) => {
            const searchInput = document.getElementById('searchInput');
            searchInput.value = event.results[0][0].transcript;
            performSearch(searchInput.value);
        };

        recognition.onend = () => {
            voiceSearch.style.color = '';
        };
    }
}

// Initialize animations
function initializeAnimations() {
    // Hero title animation
    gsap.timeline()
        .from('.hero-title .title-line', {
            duration: 1.5,
            y: 100,
            opacity: 0,
            stagger: 0.3,
            ease: "power3.out"
        })
        .from('.hero-subtitle', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.5")
        .from('.cta-button', {
            duration: 1,
            scale: 0,
            opacity: 0,
            ease: "back.out(1.7)"
        }, "-=0.3");

    // Fragrance cards animation
    gsap.from('.fragrance-card', {
        scrollTrigger: {
            trigger: '.fragrance-carousel',
            start: 'top 80%'
        },
        duration: 1,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.out"
    });

    // CTA button hover effect
    const ctaButton = document.getElementById('ctaButton');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            gsap.to('.cta-ripple', {
                duration: 0.6,
                scale: 1,
                opacity: 0.3
            });
        });

        ctaButton.addEventListener('mouseleave', () => {
            gsap.to('.cta-ripple', {
                duration: 0.3,
                scale: 0,
                opacity: 0
            });
        });
    }
}

// Carousel functionality
function initializeCarousel() {
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    if (prevBtn && nextBtn && carouselTrack) {
        prevBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({ left: -320, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }

    // Quick view functionality
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product');
            openQuickView(productId);
        });
    });

    // 3D bottle effect
    document.querySelectorAll('.fragrance-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            const bottle = card.querySelector('.bottle-image');
            if (bottle) {
                bottle.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const bottle = card.querySelector('.bottle-image');
            if (bottle) {
                bottle.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            }
        });
    });
}

// Quiz functionality
function initializeQuiz() {
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const question = e.target.closest('.quiz-question');
            const questionNum = question.getAttribute('data-question');
            const value = e.target.getAttribute('data-value');
            
            quizAnswers[questionNum] = value;
            
            // Animate selection
            gsap.to(e.target, {
                duration: 0.3,
                scale: 1.1,
                backgroundColor: 'var(--gold)',
                color: 'white'
            });

            setTimeout(() => {
                nextQuizQuestion();
            }, 500);
        });
    });
}

function nextQuizQuestion() {
    const currentQuestion = document.querySelector(`[data-question="${currentQuizQuestion}"]`);
    const nextQuestion = document.querySelector(`[data-question="${currentQuizQuestion + 1}"]`);
    
    if (nextQuestion) {
        gsap.to(currentQuestion, {
            duration: 0.5,
            x: -100,
            opacity: 0,
            onComplete: () => {
                currentQuestion.classList.remove('active');
                nextQuestion.classList.add('active');
                gsap.fromTo(nextQuestion, 
                    { x: 100, opacity: 0 },
                    { duration: 0.5, x: 0, opacity: 1 }
                );
            }
        });
        currentQuizQuestion++;
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    const quizContent = document.getElementById('quizContent');
    const quizResult = document.getElementById('quizResult');
    
    gsap.to(quizContent, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            quizContent.style.display = 'none';
            quizResult.style.display = 'block';
            
            const result = calculateQuizResult();
            displayQuizResult(result);
            
            gsap.fromTo(quizResult,
                { opacity: 0, scale: 0.8 },
                { duration: 1, opacity: 1, scale: 1, ease: "back.out(1.7)" }
            );
        }
    });
}

function calculateQuizResult() {
    // Simple algorithm to determine fragrance match
    const answers = Object.values(quizAnswers);
    
    if (answers.includes('night') && answers.includes('romantic')) {
        return {
            title: 'Mysterious Enchantress',
            description: 'You are drawn to deep, sensual fragrances that captivate and intrigue.',
            fragrance: 'midnight-rose',
            name: 'Midnight Rose'
        };
    } else if (answers.includes('morning') && answers.includes('garden')) {
        return {
            title: 'Fresh Bloom',
            description: 'You embody freshness and natural beauty with floral elegance.',
            fragrance: 'ocean-breeze',
            name: 'Ocean Breeze'
        };
    } else if (answers.includes('city') && answers.includes('social')) {
        return {
            title: 'Urban Sophisticate',
            description: 'You thrive in dynamic environments with bold, confident scents.',
            fragrance: 'velvet-noir',
            name: 'Velvet Noir'
        };
    } else {
        return {
            title: 'Golden Spirit',
            description: 'You radiate warmth and luxury with rich, amber undertones.',
            fragrance: 'golden-amber',
            name: 'Golden Amber'
        };
    }
}

function displayQuizResult(result) {
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultDescription').textContent = result.description;
    
    const recommendedFragrance = document.getElementById('recommendedFragrance');
    recommendedFragrance.innerHTML = `
        <div class="recommended-bottle">
            <img src="assets/images/${result.fragrance}.jpg" alt="${result.name}">
            <h4>${result.name}</h4>
        </div>
    `;
    
    document.getElementById('shopRecommendation').addEventListener('click', () => {
        window.location.href = `product.html?id=${result.fragrance}`;
    });
}

// Cart functionality
function initializeCart() {
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.toggle('active');
    });

    document.getElementById('cartClose').addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Load cart from localStorage
    const savedCart = localStorage.getItem('amazingAuraCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartDisplay();
    saveCart();
    
    // Animation for add to cart
    gsap.fromTo('.cart-count', 
        { scale: 1 },
        { duration: 0.3, scale: 1.5, yoyo: true, repeat: 1 }
    );
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛍️</div>
                <p>Your cart is empty</p>
                <button class="continue-shopping" onclick="document.getElementById('cartSidebar').classList.remove('active')">Continue Shopping</button>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="assets/images/${item.id}.jpg" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
            </div>
        `).join('');
        
        cartTotal.textContent = totalPrice.toFixed(2);
        cartFooter.style.display = 'block';
    }
}

function saveCart() {
    localStorage.setItem('amazingAuraCart', JSON.stringify(cart));
}

// Particle system
function createParticles() {
    if (!heroParticles) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(212, 175, 55, 0.6);
            border-radius: 50%;
            pointer-events: none;
        `;
        
        heroParticles.appendChild(particle);
        
        gsap.set(particle, {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
        });
        
        gsap.to(particle, {
            duration: Math.random() * 10 + 5,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "none"
        });
    }
}

// Quick view modal
function openQuickView(productId) {
    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('modalBody');
    
    // Product data (in real app, this would come from API)
    const products = {
        'midnight-rose': {
            name: 'Midnight Rose',
            price: 89.99,
            description: 'A sensual blend of dark rose and warm vanilla',
            notes: ['Rose', 'Vanilla', 'Musk'],
            image: 'midnight-rose.jpg'
        },
        'golden-amber': {
            name: 'Golden Amber',
            price: 95.99,
            description: 'Warm amber with citrus bergamot and woody cedar',
            notes: ['Amber', 'Bergamot', 'Cedar'],
            image: 'golden-amber.jpg'
        }
    };
    
    const product = products[productId];
    if (!product) return;
    
    modalBody.innerHTML = `
        <div class="quick-view-content">
            <div class="product-image">
                <img src="assets/images/${product.image}" alt="${product.name}">
            </div>
            <div class="product-details">
                <h2>${product.name}</h2>
                <p class="product-description">${product.description}</p>
                <div class="product-notes">
                    <h4>Scent Notes:</h4>
                    <div class="notes-list">
                        ${product.notes.map(note => `<span class="note-tag">${note}</span>`).join('')}
                    </div>
                </div>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart({id: '${productId}', name: '${product.name}', price: ${product.price}})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Close modal functionality
    document.getElementById('modalClose').onclick = () => modal.classList.remove('active');
    document.getElementById('modalOverlay').onclick = () => modal.classList.remove('active');
}

// Search functionality
function performSearch(query) {
    console.log('Searching for:', query);
    // In a real app, this would filter products and show results
}

// Newsletter subscription
document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate subscription
    gsap.to('.newsletter-btn', {
        duration: 0.3,
        scale: 0.95,
        onComplete: () => {
            alert('Thank you for subscribing!');
            e.target.reset();
        }
    });
});