/*!
 * NOIR RTL Theme JavaScript
 * Version: 1.0.0
 */

(function() {
  'use strict';

  // Theme Configuration
  const config = {
    animationDuration: 500,
    scrollThreshold: 100,
    mobileBreakpoint: 768,
    debounceDelay: 10
  };

  // Utility Functions
  const utils = {
    debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },

    isRTL() {
      return document.documentElement.dir === 'rtl';
    },

    isMobile() {
      return window.innerWidth <= config.mobileBreakpoint;
    },

    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    }
  };

  // Custom Cursor
  class CustomCursor {
    constructor() {
      if (utils.isMobile()) return;
      
      this.dot = document.querySelector('.cursor-dot');
      this.outline = document.querySelector('.cursor-outline');
      
      if (!this.dot || !this.outline) return;
      
      this.init();
    }

    init() {
      document.addEventListener('mousemove', (e) => {
        this.dot.style.left = `${e.clientX}px`;
        this.dot.style.top = `${e.clientY}px`;
        
        this.outline.animate({
          left: `${e.clientX}px`,
          top: `${e.clientY}px`
        }, { duration: 500, fill: 'forwards' });
      });

      const interactive = document.querySelectorAll('a, button, input, textarea, select');
      interactive.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }
  }

  // Header Scroll Effects
  class HeaderScroll {
    constructor() {
      this.header = document.querySelector('.site-header');
      if (!this.header) return;
      
      this.lastScroll = 0;
      this.init();
    }

    init() {
      window.addEventListener('scroll', utils.debounce(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > config.scrollThreshold) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
        
        if (currentScroll > this.lastScroll && currentScroll > 200) {
          this.header.style.transform = 'translateY(-100%)';
        } else {
          this.header.style.transform = 'translateY(0)';
        }
        
        this.lastScroll = currentScroll;
      }, config.debounceDelay));
    }
  }

  // Mobile Menu
  class MobileMenu {
    constructor() {
      this.toggle = document.querySelector('.menu-toggle');
      this.menu = document.querySelector('.mobile-menu');
      
      if (!this.toggle || !this.menu) return;
      
      this.isOpen = false;
      this.init();
    }

    init() {
      this.toggle.addEventListener('click', () => this.toggleMenu());
      
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
          this.closeMenu();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.closeMenu();
      });
    }

    toggleMenu() {
      this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
      this.isOpen = true;
      this.toggle.classList.add('active');
      this.menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    closeMenu() {
      this.isOpen = false;
      this.toggle.classList.remove('active');
      this.menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Cart Drawer
  class CartDrawer {
    constructor() {
      this.drawer = document.getElementById('cartDrawer');
      this.itemsContainer = document.getElementById('cartDrawerItems');
      this.subtotal = document.getElementById('cartSubtotal');
      
      if (!this.drawer) return;
      
      this.init();
    }

    init() {
      // Open cart
      document.querySelectorAll('[data-cart-open]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });
      
      // Close cart
      document.querySelectorAll('[data-cart-close]').forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });
      
      // Add to cart
      document.addEventListener('submit', (e) => {
        if (e.target.matches('.product-form')) {
          e.preventDefault();
          this.addToCart(e.target);
        }
      });
    }

    open() {
      this.drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.loadCart();
    }

    close() {
      this.drawer.classList.remove('active');
      document.body.style.overflow = '';
    }

    async loadCart() {
      try {
        const response = await fetch('/cart.js');
        const cart = await response.json();
        this.renderCart(cart);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }

    renderCart(cart) {
      if (cart.item_count === 0) {
        this.itemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        return;
      }
      
      let html = '';
      cart.items.forEach(item => {
        html += `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item__image">
            <div class="cart-item__details">
              <h4 class="cart-item__title">${item.title}</h4>
              <p class="cart-item__variant">${item.variant_title || ''}</p>
              <p class="cart-item__price">${this.formatMoney(item.price)}</p>
            </div>
            <div class="cart-item__quantity">
              <button class="quantity-btn" data-action="decrease" data-id="${item.key}">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" data-action="increase" data-id="${item.key}">+</button>
            </div>
            <button class="cart-item__remove" data-id="${item.key}">×</button>
          </div>
        `;
      });
      
      this.itemsContainer.innerHTML = html;
      this.subtotal.textContent = this.formatMoney(cart.total_price);
      
      // Update cart count
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.item_count;
      });
    }

    async addToCart(form) {
      const formData = new FormData(form);
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          this.open();
          this.showNotification('Product added to cart!');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }

    formatMoney(cents) {
      return '$' + (cents / 100).toFixed(2);
    }

    showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => notification.classList.add('active'), 100);
      setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }

  // Search Modal
  class SearchModal {
    constructor() {
      this.modal = document.getElementById('searchModal');
      if (!this.modal) return;
      
      this.init();
    }

    init() {
      // Open search
      document.querySelectorAll('[data-search-open]').forEach(btn => {
        btn.addEventListener('click', () => this.open());
      });
      
      // Close search
      document.querySelectorAll('[data-search-close]').forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });
      
      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.close();
        }
      });
    }

    open() {
      this.modal.classList.add('active');
      const input = this.modal.querySelector('input[type="search"]');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }

    close() {
      this.modal.classList.remove('active');
    }
  }

  // Scroll Animations
  class ScrollAnimations {
    constructor() {
      this.elements = document.querySelectorAll('.animate-on-scroll');
      if (this.elements.length === 0) return;
      
      this.init();
    }

    init() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(el => observer.observe(el));
      } else {
        this.elements.forEach(el => el.classList.add('animated'));
      }
    }
  }

  // Parallax Effects
  class ParallaxEffects {
    constructor() {
      this.elements = document.querySelectorAll('[data-parallax]');
      if (this.elements.length === 0) return;
      
      this.init();
    }

    init() {
      window.addEventListener('scroll', utils.debounce(() => {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach(element => {
          const speed = element.dataset.parallax || 0.5;
          const yPos = -(scrolled * speed);
          element.style.transform = `translateY(${yPos}px)`;
        });
      }, config.debounceDelay));
    }
  }

  // Loading Screen
  class LoadingScreen {
    constructor() {
      this.screen = document.getElementById('loadingScreen');
      if (!this.screen) return;
      
      this.init();
    }

    init() {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.screen.classList.add('hidden');
        }, 500);
      });
    }
  }

  // Initialize Theme
  class NoirTheme {
    constructor() {
      this.init();
    }

    init() {
      // Core features
      new CustomCursor();
      new HeaderScroll();
      new MobileMenu();
      new CartDrawer();
      new SearchModal();
      new ScrollAnimations();
      new ParallaxEffects();
      new LoadingScreen();
      
      // Smooth scroll
      this.initSmoothScroll();
      
      // Lazy loading
      this.initLazyLoading();
    }

    initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;
          
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offset = document.querySelector('.site-header').offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }

    initLazyLoading() {
      if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        });
      } else {
        // Fallback
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
      }
    }
  }

  // Start the theme when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NoirTheme());
  } else {
    new NoirTheme();
  }

})();