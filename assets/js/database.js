// ===== CENTRALIZED PRODUCT DATABASE =====

class ProductDatabase {
    constructor() {
        this.categories = ['signature', 'limited', 'classic', 'seasonal', 'fresh'];
        this.designers = [
            'Ahmed Al maghribi', 'Versace', 'Elizabeth Arden', 'Elizabeth Taylor', 'Joop',
            'Perry Ellis', 'Bentley', 'Bvlgari', 'Franck Oliver', 'Davidoff', 'Burberry',
            'Dolce & Gabbana', 'Salvatore Ferragamo', 'Givenchy', 'Issey miyake', 'Azzaro',
            'Tomford', 'Giorgio Armani', 'Emporio Armani', 'Gucci', 'Amouage', 'Mancera',
            'Lattafa', 'Calvin Klein', 'Lalique', 'Yves Saint Laurent', 'Jimmy choo', 'Hawas',
            'AL Haramain', 'Christian Dior', "D'Hermes", 'Britney Spears', 'Armaf', 'Afnan',
            'Mont Blanc', 'Vera wang', 'Nautical', 'Lancome', 'Escada', 'Clinique',
            'Rue Broca', 'Rihanna', 'Giorgio', 'Kenneth Cole'
        ];
        this.notes = ['floral', 'woody', 'fresh', 'oriental', 'citrus', 'vanilla', 'musk'];
        this.products = this.loadProducts();
    }

    loadProducts() {
        const perfumeNames = [
            'Elegant Rose', 'Golden Essence', 'Ocean Mist', 'Midnight Bloom', 'Vanilla Luxe',
            'Citrus Delight', 'Royal Amber', 'Floral Paradise', 'Mystic Woods', 'Pure Elegance',
            'Golden Sunset', 'Lavender Dreams', 'Spice Garden', 'White Musk', 'Cherry Blossom',
            'Desert Rose', 'Tropical Breeze', 'Velvet Night', 'Morning Dew', 'Amber Glow',
            'Jasmine Star', 'Cedar Woods', 'Pink Peony', 'Silver Moon', 'Honey Vanilla',
            'Fresh Mint', 'Wild Orchid', 'Sunset Orange', 'Deep Forest', 'Crystal Clear',
            'Rose Gold', 'Emerald Green', 'Sapphire Blue', 'Ruby Red', 'Diamond White',
            'Pearl Essence', 'Platinum Shine', 'Bronze Glow'
        ];
        
        const categories = ['signature', 'fresh', 'classic', 'limited', 'seasonal'];
        const designers = this.designers;
        const intensities = ['light', 'moderate', 'strong'];
        const genders = ['unisex'];
        
        const defaultProducts = [];
        
        for (let i = 1; i <= perfumeNames.length; i++) {
            const name = perfumeNames[i - 1];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const designer = designers[Math.floor(Math.random() * designers.length)];
            const intensity = intensities[Math.floor(Math.random() * intensities.length)];
            const rating = (4.0 + Math.random() * 1.0).toFixed(1);
            const reviews = Math.floor(Math.random() * 200) + 50;
            const featured = Math.random() > 0.7;
            
            defaultProducts.push({
                id: `perfume-${i}`,
                name: name,
                category: category,
                designer: designer,
                description: `Premium fragrance with unique blend of exotic notes and sophisticated appeal.`,
                images: [`assets/images/perfume-${i.toString().padStart(2, '0')}.jpeg`],
                notes: {
                    top: ['Bergamot', 'Citrus'],
                    heart: ['Rose', 'Jasmine'],
                    base: ['Musk', 'Sandalwood']
                },
                rating: parseFloat(rating),
                reviews: reviews,
                badge: featured ? (Math.random() > 0.5 ? 'Bestseller' : 'New') : null,
                inStock: true,
                featured: featured,
                gender: 'unisex',
                intensity: intensity,
                longevity: '6-8 hours',
                sillage: 'moderate',
                season: ['spring', 'summer'],
                occasion: ['daily', 'casual'],
                dateAdded: '2024-01-15',
                lastModified: new Date().toISOString()
            });
        }

        const stored = localStorage.getItem('amazingaura_products');
        return stored ? JSON.parse(stored) : defaultProducts;
    }

    saveProducts() {
        localStorage.setItem('amazingaura_products', JSON.stringify(this.products));
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.notes.top.some(note => note.toLowerCase().includes(searchTerm)) ||
            product.notes.heart.some(note => note.toLowerCase().includes(searchTerm)) ||
            product.notes.base.some(note => note.toLowerCase().includes(searchTerm))
        );
    }

    filterProducts(filters) {
        let filtered = this.products;

        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(product => product.category === filters.category);
        }

        if (filters.notes && filters.notes.length > 0) {
            filtered = filtered.filter(product => {
                const allNotes = [...product.notes.top, ...product.notes.heart, ...product.notes.base];
                return filters.notes.some(note => 
                    allNotes.some(productNote => 
                        productNote.toLowerCase().includes(note.toLowerCase())
                    )
                );
            });
        }

        if (filters.gender && filters.gender !== 'all') {
            filtered = filtered.filter(product => product.gender === filters.gender);
        }

        if (filters.intensity) {
            filtered = filtered.filter(product => product.intensity === filters.intensity);
        }

        if (filters.inStock) {
            filtered = filtered.filter(product => product.inStock);
        }

        return filtered;
    }

    addProduct(productData) {
        const newProduct = {
            ...productData,
            id: this.generateProductId(productData.name),
            dateAdded: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            rating: 0,
            reviews: 0,
            inStock: true
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    updateProduct(id, updates) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...updates,
                lastModified: new Date().toISOString()
            };
            this.saveProducts();
            return this.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const deleted = this.products.splice(index, 1)[0];
            this.saveProducts();
            return deleted;
        }
        return null;
    }

    generateProductId(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }

    getCategories() {
        return this.categories;
    }

    getDesigners() {
        return this.designers;
    }

    getNotes() {
        return this.notes;
    }

    getProductStats() {
        return {
            total: this.products.length,
            inStock: this.products.filter(p => p.inStock).length,
            outOfStock: this.products.filter(p => !p.inStock).length,
            featured: this.products.filter(p => p.featured).length,
            categories: this.categories.map(cat => ({
                name: cat,
                count: this.products.filter(p => p.category === cat).length
            }))
        };
    }
}

// Create global instance
try {
    window.productDB = new ProductDatabase();
    console.log('ProductDB initialized successfully with', window.productDB.getAllProducts().length, 'products');
} catch (error) {
    console.error('Error initializing ProductDB:', error);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductDatabase;
}