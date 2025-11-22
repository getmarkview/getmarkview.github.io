// ==========================================
// MarkView Landing Page - Enhanced Script
// ==========================================

(function () {
  'use strict';

  // Theme Management
  const ThemeManager = {
    init() {
      this.themeToggle = document.querySelector('.theme-toggle');
      this.currentTheme = localStorage.getItem('theme') || 'dark';

      // Set initial theme
      document.documentElement.setAttribute('data-theme', this.currentTheme);

      // Bind event listener
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
      }
    },

    toggleTheme() {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);

      // Animate transition
      document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      setTimeout(() => {
        document.documentElement.style.transition = '';
      }, 300);
    },
  };

  // Smooth Scrolling
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => this.handleClick(e));
      });
    },

    handleClick(e) {
      const href = e.currentTarget.getAttribute('href');

      // Don't handle empty anchors
      if (!href || href === '#') return;

      // Only handle internal page anchors, not mailto or other protocols
      if (href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          const navHeight = 64;
          const targetPosition = target.offsetTop - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      }
    },
  };

  // Navbar Scroll Effect
  const NavbarScroll = {
    init() {
      this.navbar = document.querySelector('.navbar');
      this.lastScroll = 0;

      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    handleScroll() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        this.navbar.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
      } else {
        this.navbar.style.boxShadow = 'none';
      }

      this.lastScroll = currentScroll;
    },
  };

  // Showcase Tabs
  const ShowcaseTabs = {
    init() {
      this.tabs = document.querySelectorAll('.tab-btn');
      this.panes = document.querySelectorAll('.tab-pane');

      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => this.switchTab(tab));
      });
    },

    switchTab(clickedTab) {
      const targetPane = clickedTab.getAttribute('data-tab');

      // Update tabs
      this.tabs.forEach(tab => tab.classList.remove('active'));
      clickedTab.classList.add('active');

      // Update panes
      this.panes.forEach(pane => {
        const paneId = pane.getAttribute('data-pane');
        if (paneId === targetPane) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    },
  };

  // Install Button Handler
  const InstallHandler = {
    CHROME_STORE_URL: 'https://chrome.google.com/webstore/detail/YOUR-EXTENSION-ID',

    init() {
      this.installButtons = document.querySelectorAll('a[href="#install"], .btn-primary[href="#"]');
      this.installButtons.forEach(btn => {
        btn.addEventListener('click', e => this.handleClick(e, btn));
      });
    },

    handleClick(e, btn) {
      if (btn.getAttribute('href') === '#' || btn.getAttribute('href') === '#install') {
        e.preventDefault();
        // TODO: Replace with actual Chrome Web Store URL after publishing
        this.showNotification();
      }
    },

    showNotification() {
      const notification = document.createElement('div');
      notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                animation: slideInRight 0.3s ease;
                font-weight: 500;
            `;
      notification.textContent = 'Coming soon to Chrome Web Store!';

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    },
  };

  // Intersection Observer for Animations
  const AnimationObserver = {
    init() {
      this.observer = new IntersectionObserver(entries => this.handleIntersection(entries), {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      });

      // Observe elements
      const elements = document.querySelectorAll('.feature-card, .doc-card, .install-step');
      elements.forEach(el => this.observer.observe(el));
    },

    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideUp 0.6s ease forwards';
          this.observer.unobserve(entry.target);
        }
      });
    },
  };

  // Lazy Loading for Images
  const LazyLoad = {
    init() {
      if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
          img.src = img.dataset.src || img.src;
        });
      } else {
        // Fallback for older browsers
        this.observer = new IntersectionObserver(entries => this.handleIntersection(entries));

        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => this.observer.observe(img));
      }
    },

    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          this.observer.unobserve(img);
        }
      });
    },
  };

  // Scroll to Top Button
  const ScrollToTop = {
    init() {
      this.button = this.createButton();
      this.scrollThreshold = 300;
      document.body.appendChild(this.button);

      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      this.button.addEventListener('click', () => this.scrollToTop());
    },

    createButton() {
      const button = document.createElement('button');
      button.className = 'scroll-to-top';
      button.setAttribute('aria-label', 'Scroll to top');
      button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      return button;
    },

    handleScroll() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > this.scrollThreshold) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  };

  // Analytics (placeholder)
  const Analytics = {
    init() {
      // Google Analytics or other analytics service
      // Example: gtag('config', 'G-XXXXXXXXXX');
      console.log('Analytics initialized');
    },

    trackEvent(category, action, label) {
      // Track custom events
      console.log('Event:', category, action, label);
    },
  };

  // Add CSS animations and styles
  const style = document.createElement('style');
  style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }

        /* Scroll to Top Button */
        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
        }

        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .scroll-to-top:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .scroll-to-top:active {
            transform: translateY(-2px);
        }

        .scroll-to-top svg {
            color: white;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 1.5rem;
                right: 1.5rem;
                width: 44px;
                height: 44px;
            }
        }
    `;
  document.head.appendChild(style);

  // Mobile Menu
  const MobileMenu = {
    init() {
      this.toggle = document.querySelector('.mobile-menu-toggle');
      this.menu = document.querySelector('.mobile-menu');
      this.backdrop = document.querySelector('.mobile-menu-backdrop');
      this.links = this.menu?.querySelectorAll('a');

      if (!this.toggle || !this.menu || !this.backdrop) return;

      this.toggle.addEventListener('click', () => this.toggleMenu());

      // Close menu when clicking backdrop
      this.backdrop.addEventListener('click', () => this.closeMenu());

      // Close menu when clicking on a link
      this.links?.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });

      // Close menu when clicking outside
      document.addEventListener('click', e => {
        if (!e.target.closest('.navbar')) {
          this.closeMenu();
        }
      });
    },

    toggleMenu() {
      this.toggle.classList.toggle('active');
      this.menu.classList.toggle('active');
      this.backdrop.classList.toggle('active');
      document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    },

    closeMenu() {
      this.toggle.classList.remove('active');
      this.menu.classList.remove('active');
      this.backdrop.classList.remove('active');
      document.body.style.overflow = '';
    },
  };

  // Initialize everything when DOM is ready
  function init() {
    ThemeManager.init();
    SmoothScroll.init();
    NavbarScroll.init();
    ShowcaseTabs.init();
    InstallHandler.init();
    AnimationObserver.init();
    LazyLoad.init();
    ScrollToTop.init();
    MobileMenu.init();
    Analytics.init();

    // Add loaded class to body
    document.body.classList.add('loaded');

    console.log('MarkView landing page initialized');
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
