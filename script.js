// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = 72; // Height of fixed navbar
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Update install button links with Chrome Web Store URL when available
const installButtons = document.querySelectorAll('.btn-install, .btn-primary[href="#"]');
const CHROME_STORE_URL = 'https://chrome.google.com/webstore/detail/YOUR-EXTENSION-ID';

installButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // TODO: Replace with actual Chrome Web Store URL after publishing
        alert('Chrome Web Store link will be added after extension is published!');
        e.preventDefault();
    });
});

// Intersection Observer for animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and doc cards
document.querySelectorAll('.feature-card, .doc-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Mobile menu toggle (for future implementation)
const createMobileMenu = () => {
    // This is a placeholder for mobile menu functionality
    // Implement when needed
    console.log('Mobile menu functionality can be added here');
};

// Analytics placeholder (add your analytics code here)
const initAnalytics = () => {
    // Google Analytics or other analytics service
    // Example: gtag('config', 'G-XXXXXXXXXX');
    console.log('Analytics initialized');
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAnalytics();

    // Add loading complete class
    document.body.classList.add('loaded');
});
