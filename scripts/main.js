// DOM Elements
const modal = document.getElementById('contact-form');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('close-form');
const contactForm = document.getElementById('contactForm');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');
const backToTopBtn = document.querySelector('.back-to-top');
const currentYearSpan = document.getElementById('current-year');
const mobileMenuIcon = document.querySelector('.mobile-menu-toggle i');
const ctaBtn = document.getElementById('ctaBtn')

/* Footer year*/
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}
/*Toggle mobile menu*/
const toggleMobileMenu = () => {
    if (mobileMenuToggle && navLinks) {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';

        // Toggle menu visibility
        navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);

        // Toggle icon
        if (mobileMenuIcon) {
            if (isExpanded) {
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            } else {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-times');
            }
        }

        // Prevent body scrolling when menu is open
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    }
}

/*Closing mobile menu when clicking outside*/

const closeMobileMenuOnClickOutside = (e) => {
    if (navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)) {
        closeMobileMenu();
    }
}

/*Closing mobile menu*/

const closeMobileMenu = () => {
    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');

        if (mobileMenuIcon) {
            mobileMenuIcon.classList.remove('fa-times');
            mobileMenuIcon.classList.add('fa-bars');
        }

        document.body.style.overflow = 'auto';
    }
}

/*Close mobile menu when clicking on links*/

const setupMobileMenuLinks = () => {
    const mobileLinks = navLinks.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}


/*Go Register Page*/

if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
        window.location.href = 'register.html';
    });
}

/*Modal functions*/

const openModal = () => {
    modal.removeAttribute('hidden');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.getElementById('name').focus();

    // Add focus trap
    modal.addEventListener('keydown', trapFocus);

    // Close mobile menu if open
    closeMobileMenu();
}

const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('hidden', 'true');
    document.body.style.overflow = 'auto';
    openModalBtn.focus();

    // Remove focus trap
    modal.removeEventListener('keydown', trapFocus);
}

// Focus trap for modal
function trapFocus(e) {
    if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    if (e.key === 'Escape') {
        closeModal();
    }
}

// Form Validation
function validateForm() {
    let isValid = true;

    // Reset errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });

    document.querySelectorAll('.error-message').forEach(msg => {
        msg.textContent = '';
        msg.style.display = 'none';
    });

    // Validate name
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
        showError('name', 'Name is required');
        isValid = false;
    }

    // Validate email
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate message
    const messageInput = document.getElementById('message');
    if (!messageInput.value.trim()) {
        showError('message', 'Message is required');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }

    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    const errorElement = document.getElementById(`${fieldId}-error`);

    if (formGroup) {
        formGroup.classList.add('error');
    }

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showFormMessage('success', 'Message sent successfully! We\'ll get back to you soon.');
            contactForm.reset();
            setTimeout(closeModal, 3000);
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        showFormMessage('error', 'Failed to send message. Please try again later.');
        console.error('Form submission error:', error);
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function showFormMessage(type, message) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Back to Top Button
function handleScroll() {
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event Listeners
function initEventListeners() {
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu on outside click
    document.addEventListener('click', closeMobileMenuOnClickOutside);

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Setup mobile menu links
    if (navLinks) {
        setupMobileMenuLinks();
    }

    // Modal events
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }


    // Close modal on background click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Back to top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }

    // Scroll events
    window.addEventListener('scroll', handleScroll);

    // Form validation on input
    const formInputs = contactForm?.querySelectorAll('input, textarea');
    formInputs?.forEach(input => {
        input.addEventListener('blur', () => {
            validateForm();
        });
    });
}



// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();

    // Check scroll position on load
    handleScroll();

    // Log for debugging
    console.log('Achaba Analytics website initialized Successfully');

    // Check if mobile menu elements exist
    console.log('Mobile menu toggle exists:', !!mobileMenuToggle);
    console.log('Nav links exists:', !!navLinks);
});