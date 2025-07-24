// ===== CONTACT PAGE JAVASCRIPT =====

class ContactManager {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        // Initialize FAQ functionality
        this.initFAQ();
        
        // Initialize form validation
        this.initFormValidation();
    }

    bindEvents() {
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e);
            });
        }

        // Real-time form validation
        const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    initFormValidation() {
        // Add custom validation styles
        const style = document.createElement('style');
        style.textContent = `
            .form-group.error input,
            .form-group.error select,
            .form-group.error textarea {
                border-color: #ef4444;
                background-color: #fef2f2;
            }
            
            .form-group.success input,
            .form-group.success select,
            .form-group.success textarea {
                border-color: #22c55e;
            }
            
            .error-message {
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            }
            
            .form-group.error label {
                color: #ef4444;
            }
        `;
        document.head.appendChild(style);
    }

    validateField(field) {
        const formGroup = field.closest('.form-group');
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Validation rules
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'This field is required';
                } else if (fieldValue.length < 2) {
                    isValid = false;
                    errorMessage = 'Must be at least 2 characters';
                } else if (!/^[a-zA-Z\s]+$/.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Only letters and spaces allowed';
                }
                break;

            case 'email':
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!this.isValidEmail(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                if (fieldValue && !this.isValidPhone(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;

            case 'subject':
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'Please select a subject';
                }
                break;

            case 'message':
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (fieldValue.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }

        // Update field appearance
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            
            // Add error message
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            formGroup.appendChild(errorElement);
        }

        return isValid;
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    validateForm() {
        const form = document.getElementById('contactForm');
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;

        requiredFields.forEach(field => {
            const fieldValid = this.validateField(field);
            if (!fieldValid) {
                isFormValid = false;
            }
        });

        // Validate optional phone field if filled
        const phoneField = form.querySelector('input[name="phone"]');
        if (phoneField && phoneField.value.trim()) {
            const phoneValid = this.validateField(phoneField);
            if (!phoneValid) {
                isFormValid = false;
            }
        }

        return isFormValid;
    }

    async handleFormSubmission(event) {
        const form = event.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        // Validate form
        if (!this.validateForm()) {
            this.showNotification('Please correct the errors in the form', 'error');
            return;
        }

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Add timestamp
            data.timestamp = new Date().toISOString();
            
            // Simulate API call
            await this.submitContactForm(data);
            
            // Success
            this.showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
            form.reset();
            this.clearAllFieldStates();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    }

    async submitContactForm(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, you would send this to your backend
        console.log('Contact form submission:', data);
        
        // Simulate occasional errors for testing
        if (Math.random() < 0.1) {
            throw new Error('Simulated server error');
        }
        
        return { success: true, message: 'Form submitted successfully' };
    }

    clearAllFieldStates() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.contact-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `contact-notification notification-${type}`;
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

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Utility method to format phone numbers as user types
    formatPhoneNumber(input) {
        const value = input.value.replace(/\D/g, '');
        const match = value.match(/^(\d{3})(\d{3})(\d{4})$/);
        
        if (match) {
            input.value = `(${match[1]}) ${match[2]}-${match[3]}`;
        }
    }
}

// Initialize contact manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactManager();
    
    // Add phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Remove all non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Format as (XXX) XXX-XXXX
            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }
            
            this.value = value;
        });
    }
});

// Handle form auto-save (optional feature)
class FormAutoSave {
    constructor(formId, storageKey) {
        this.form = document.getElementById(formId);
        this.storageKey = storageKey;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Load saved data
        this.loadFormData();
        
        // Save data on input
        this.form.addEventListener('input', () => {
            this.saveFormData();
        });
        
        // Clear saved data on successful submission
        this.form.addEventListener('submit', () => {
            setTimeout(() => {
                if (!this.form.querySelector('.error-message')) {
                    this.clearSavedData();
                }
            }, 100);
        });
    }
    
    saveFormData() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    loadFormData() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = this.form.querySelector(`[name="${key}"]`);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
        }
    }
    
    clearSavedData() {
        localStorage.removeItem(this.storageKey);
    }
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', () => {
    new FormAutoSave('contactForm', 'amazingaura_contact_form');
});