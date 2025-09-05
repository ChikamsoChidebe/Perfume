// ===== ADMIN PANEL JAVASCRIPT =====

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.editingProductId = null;
        this.init();
    }

    init() {
        // Wait for database to be ready
        if (!window.productDB) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.bindEvents();
        this.populateDesignerDropdown();
        this.initImageUpload();
        this.loadDashboard();
        this.loadProducts();
    }

    populateDesignerDropdown() {
        const designerSelect = document.getElementById('productDesigner');
        if (designerSelect) {
            const designers = this.getAllDesigners();
            designerSelect.innerHTML = '<option value="">Select Designer</option>';
            designers.forEach(designer => {
                const option = document.createElement('option');
                option.value = designer;
                option.textContent = designer;
                designerSelect.appendChild(option);
            });
        }
    }

    getAllDesigners() {
        return [
            'Ahmed Al maghribi',
            'Versace',
            'Elizabeth Arden',
            'Elizabeth Taylor',
            'Joop',
            'Perry Ellis',
            'Bentley',
            'Bvlgari',
            'Franck Oliver',
            'Davidoff',
            'Burberry',
            'Dolce &Gabbana',
            'Salvatore Ferragamo',
            'Givenchy',
            'Issey miyake',
            'Azzaro',
            'Tomford',
            'Giorgio Armani',
            'Emporio Armani',
            'Gucci',
            'Amouage',
            'Mancera',
            'Lattafa',
            'Calvin Klein',
            'Lalique',
            'YvesSaintLaurent',
            'Jimmy choo',
            'Hawas',
            'AL Haramain',
            'Christian Dior',
            "D'Hermes",
            'Britney Spears',
            'Armaf',
            'Afnan',
            'Mont Blanc',
            'Vera wang',
            'Nautical',
            'Lancome',
            'Escada',
            'Clinique',
            'Rue Broca',
            'Rihanna',
            'Giorgio',
            'Kenneth Cole'
        ].sort();
    }

    bindEvents() {
        // Navigation (desktop and mobile)
        document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Add product form
        const addForm = document.getElementById('addProductForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddProduct(e);
            });
        }

        // Search and filters
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts();
            });
        }

        const categoryFilter = document.getElementById('categoryFilter');
        const stockFilter = document.getElementById('stockFilter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProducts());
        }
        
        if (stockFilter) {
            stockFilter.addEventListener('change', () => this.filterProducts());
        }

        // Designer search
        const designerSearch = document.getElementById('designerSearch');
        if (designerSearch) {
            designerSearch.addEventListener('input', (e) => {
                this.filterDesigners();
            });
        }

        // Add designer form
        const addDesignerForm = document.getElementById('addDesignerForm');
        if (addDesignerForm) {
            addDesignerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddDesigner(e);
            });
        }

        // Modal events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeAllModals();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    switchSection(section) {
        // Update navigation (desktop and mobile)
        document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll(`[data-section="${section}"]`).forEach(btn => {
            btn.classList.add('active');
        });

        // Update sections
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;

        // Load section-specific data
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'designers':
                this.loadDesigners();
                break;
        }
    }

    loadDashboard() {
        if (!window.productDB) {
            console.error('ProductDB not available');
            return;
        }
        
        const stats = window.productDB.getProductStats();
        
        // Update stats
        document.getElementById('totalProducts').textContent = stats.total;
        document.getElementById('inStockProducts').textContent = stats.inStock;
        document.getElementById('featuredProducts').textContent = stats.featured;
        document.getElementById('outOfStockProducts').textContent = stats.outOfStock;

        // Load recent products
        this.loadRecentProducts();
        
        // Load category chart
        this.loadCategoryChart(stats.categories);
    }

    loadRecentProducts() {
        const products = window.productDB.getAllProducts()
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 5);

        const container = document.getElementById('recentProducts');
        if (!container) return;

        container.innerHTML = products.map(product => `
            <div class="recent-product">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="recent-product-info">
                    <h4>${product.name}</h4>
                    <p>${this.formatDate(product.dateAdded)}</p>
                </div>
            </div>
        `).join('');
    }

    loadCategoryChart(categories) {
        const container = document.getElementById('categoryChart');
        if (!container) return;

        container.innerHTML = categories.map(cat => `
            <div class="category-item">
                <span class="category-name">${cat.name}</span>
                <span class="category-count">${cat.count}</span>
            </div>
        `).join('');
    }

    loadProducts() {
        if (!window.productDB) {
            console.error('ProductDB not available');
            return;
        }
        
        const products = window.productDB.getAllProducts();
        this.displayProducts(products);
    }

    displayProducts(products) {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>
                    <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                </td>
                <td>
                    <div class="product-name">${product.name}</div>
                </td>
                <td class="product-designer">${product.designer || 'Not specified'}</td>
                <td class="product-category">${product.category}</td>
                <td class="price-display">Contact for Price</td>
                <td>
                    <span class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </td>
                <td>
                    <div class="rating-display">
                        <div class="rating-stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="adminPanel.editProduct('${product.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="adminPanel.deleteProduct('${product.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterProducts() {
        const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const stockFilter = document.getElementById('stockFilter')?.value || '';

        let products = window.productDB.getAllProducts();

        // Apply search filter
        if (searchTerm) {
            products = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filter
        if (categoryFilter) {
            products = products.filter(product => product.category === categoryFilter);
        }

        // Apply stock filter
        if (stockFilter) {
            const inStock = stockFilter === 'in-stock';
            products = products.filter(product => product.inStock === inStock);
        }

        this.displayProducts(products);
    }

    handleAddProduct(event) {
        const formData = new FormData(event.target);
        const productData = this.processFormData(formData);

        try {
            const newProduct = window.productDB.addProduct(productData);
            this.showNotification('Product added successfully!', 'success');
            event.target.reset();
            
            // Refresh data if on relevant sections
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            } else if (this.currentSection === 'products') {
                this.loadProducts();
            }
        } catch (error) {
            this.showNotification('Error adding product: ' + error.message, 'error');
        }
    }

    processFormData(formData) {
        const data = {};
        
        // Basic fields
        data.name = formData.get('name');
        data.category = formData.get('category');
        data.designer = formData.get('designer');
        data.description = formData.get('description');
        data.gender = formData.get('gender') || 'unisex';
        data.intensity = formData.get('intensity') || 'moderate';
        data.longevity = formData.get('longevity') || '6-8 hours';
        data.sillage = formData.get('sillage') || 'moderate';
        data.badge = formData.get('badge') || '';
        data.featured = formData.has('featured');
        data.inStock = formData.has('inStock');

        // No pricing - contact for price model

        // Images from uploaded files
        data.images = this.getUploadedImages();
        
        if (data.images.length === 0) {
            data.images = ['https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];
        }

        // Notes
        data.notes = {
            top: this.parseNotes(formData.get('topNotes')),
            heart: this.parseNotes(formData.get('heartNotes')),
            base: this.parseNotes(formData.get('baseNotes'))
        };

        // Additional fields
        data.season = ['spring', 'summer', 'fall', 'winter'];
        data.occasion = ['daily', 'evening', 'special'];

        return data;
    }

    parseNotes(notesString) {
        if (!notesString) return [];
        return notesString.split(',').map(note => note.trim()).filter(note => note);
    }

    editProduct(productId) {
        const product = window.productDB.getProductById(productId);
        if (!product) return;

        this.editingProductId = productId;
        this.populateEditForm(product);
        this.showModal('editProductModal');
    }

    populateEditForm(product) {
        const form = document.getElementById('editProductForm');
        if (!form) return;

        // Create edit form HTML
        form.innerHTML = `
            <div class="form-grid">
                <div class="form-section">
                    <h3>Basic Information</h3>
                    
                    <div class="form-group">
                        <label for="editProductName">Product Name *</label>
                        <input type="text" id="editProductName" name="name" value="${product.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editProductCategory">Category *</label>
                        <select id="editProductCategory" name="category" required>
                            <option value="signature" ${product.category === 'signature' ? 'selected' : ''}>Signature Collection</option>
                            <option value="limited" ${product.category === 'limited' ? 'selected' : ''}>Limited Edition</option>
                            <option value="classic" ${product.category === 'classic' ? 'selected' : ''}>Classic Collection</option>
                            <option value="fresh" ${product.category === 'fresh' ? 'selected' : ''}>Fresh Collection</option>
                            <option value="seasonal" ${product.category === 'seasonal' ? 'selected' : ''}>Seasonal Collection</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editProductDesigner">Designer *</label>
                        <select id="editProductDesigner" name="designer" required>
                            ${this.getAllDesigners().map(designer => 
                                `<option value="${designer}" ${product.designer === designer ? 'selected' : ''}>${designer}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editProductDescription">Description *</label>
                        <textarea id="editProductDescription" name="description" rows="4" required>${product.description}</textarea>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>Product Settings</h3>
                    
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="featured" ${product.featured ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Featured Product
                        </label>
                        
                        <label class="checkbox-label">
                            <input type="checkbox" name="inStock" ${product.inStock ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            In Stock
                        </label>
                    </div>
                    
                    <div class="contact-info">
                        <p><strong>WhatsApp:</strong> 07068045006</p>
                        <p><strong>Email:</strong> amazingperfume.ng@gmail.com</p>
                        <p><em>Customers contact via WhatsApp for pricing</em></p>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="adminPanel.closeEditModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Product</button>
            </div>
        `;

        // Bind form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditProduct(e);
        });
    }

    handleEditProduct(event) {
        const formData = new FormData(event.target);
        const updates = {
            name: formData.get('name'),
            category: formData.get('category'),
            designer: formData.get('designer'),
            description: formData.get('description'),
            featured: formData.has('featured'),
            inStock: formData.has('inStock')
        };

        try {
            window.productDB.updateProduct(this.editingProductId, updates);
            this.showNotification('Product updated successfully!', 'success');
            this.closeEditModal();
            
            // Refresh displays
            if (this.currentSection === 'products') {
                this.loadProducts();
            }
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            }
        } catch (error) {
            this.showNotification('Error updating product: ' + error.message, 'error');
        }
    }

    deleteProduct(productId) {
        const product = window.productDB.getProductById(productId);
        if (!product) return;

        // Show confirmation modal
        this.showModal('deleteModal');
        
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.onclick = () => {
            try {
                window.productDB.deleteProduct(productId);
                this.showNotification('Product deleted successfully!', 'success');
                this.closeDeleteModal();
                
                // Refresh displays
                if (this.currentSection === 'products') {
                    this.loadProducts();
                }
                if (this.currentSection === 'dashboard') {
                    this.loadDashboard();
                }
            } catch (error) {
                this.showNotification('Error deleting product: ' + error.message, 'error');
            }
        };
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    closeEditModal() {
        this.closeAllModals();
        this.editingProductId = null;
    }

    closeDeleteModal() {
        this.closeAllModals();
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    initImageUpload() {
        const uploadArea = document.getElementById('imageUploadArea');
        const fileInput = document.getElementById('imageUpload');
        
        if (!uploadArea || !fileInput) return;
        
        this.uploadedFiles = [];
        
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }
    
    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
                this.processImageFile(file);
            }
        });
    }
    
    processImageFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                file: file,
                dataUrl: e.target.result,
                name: file.name
            };
            
            this.uploadedFiles.push(imageData);
            this.displayUploadedImages();
        };
        reader.readAsDataURL(file);
    }
    
    displayUploadedImages() {
        const container = document.getElementById('uploadedImages');
        if (!container) return;
        
        container.innerHTML = this.uploadedFiles.map((image, index) => `
            <div class="uploaded-image">
                <img src="${image.dataUrl}" alt="${image.name}">
                <button class="remove-image" onclick="adminPanel.removeUploadedImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
    
    removeUploadedImage(index) {
        this.uploadedFiles.splice(index, 1);
        this.displayUploadedImages();
    }
    
    getUploadedImages() {
        return this.uploadedFiles.map(image => image.dataUrl);
    }

    loadDesigners() {
        const designers = this.getAllDesigners();
        this.displayDesigners(designers);
    }

    displayDesigners(designers) {
        const grid = document.getElementById('designersGrid');
        if (!grid) return;

        grid.innerHTML = designers.map(designer => `
            <div class="designer-card">
                <div class="designer-info">
                    <h3>${designer}</h3>
                    <p>Luxury Perfume Designer</p>
                </div>
                <div class="designer-actions">
                    <button class="action-btn edit" onclick="adminPanel.editDesigner('${designer}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="adminPanel.deleteDesigner('${designer}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterDesigners() {
        const searchTerm = document.getElementById('designerSearch')?.value.toLowerCase() || '';
        const designers = this.getAllDesigners();
        
        const filtered = designers.filter(designer => 
            designer.toLowerCase().includes(searchTerm)
        );
        
        this.displayDesigners(filtered);
    }

    showAddDesignerModal() {
        this.showModal('addDesignerModal');
    }

    handleAddDesigner(event) {
        const formData = new FormData(event.target);
        const designerName = formData.get('name').trim();
        
        if (!designerName) {
            this.showNotification('Please enter a designer name', 'error');
            return;
        }
        
        // In a real app, you'd save to database
        this.showNotification('Designer added successfully!', 'success');
        this.closeDesignerModal();
        event.target.reset();
        
        // Refresh designer dropdown
        this.populateDesignerDropdown();
    }

    editDesigner(designerName) {
        const newName = prompt('Edit designer name:', designerName);
        if (newName && newName.trim() && newName !== designerName) {
            this.showNotification('Designer updated successfully!', 'success');
            this.loadDesigners();
            this.populateDesignerDropdown();
        }
    }

    deleteDesigner(designerName) {
        if (confirm(`Are you sure you want to delete "${designerName}"?`)) {
            this.showNotification('Designer deleted successfully!', 'success');
            this.loadDesigners();
            this.populateDesignerDropdown();
        }
    }

    closeDesignerModal() {
        this.closeAllModals();
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.admin-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `admin-notification notification-${type}`;
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
            max-width: 400px;
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

// Global functions for onclick handlers
window.closeEditModal = () => adminPanel.closeEditModal();
window.closeDeleteModal = () => adminPanel.closeDeleteModal();

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    // Ensure database is loaded first
    const initAdmin = () => {
        if (window.productDB) {
            adminPanel = new AdminPanel();
            window.adminPanel = adminPanel;
        } else {
            setTimeout(initAdmin, 100);
        }
    };
    initAdmin();
});