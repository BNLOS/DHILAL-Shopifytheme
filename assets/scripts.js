// Modern Dark Mode Shopify Theme - JavaScript
class ModernShopifyTheme {
  constructor() {
    this.init();
    this.setupEventListeners();
    this.setupAnimations();
    this.setupMobileOptimizations();
  }

  init() {
    // Initialize theme components
    this.cart = {
      items: [],
      total: 0,
      count: 0
    };
    
    this.search = {
      results: [],
      isLoading: false
    };
    
    this.mobileMenu = {
      isOpen: false
    };
    
    this.cartDrawer = {
      isOpen: false
    };
    
    this.searchModal = {
      isOpen: false
    };
  }

  setupEventListeners() {
    // Mobile menu toggle
    this.setupMobileMenu();
    
    // Cart drawer
    this.setupCartDrawer();
    
    // Search modal
    this.setupSearchModal();
    
    // Product interactions
    this.setupProductInteractions();
    
    // Form submissions
    this.setupFormHandlers();
    
    // Scroll effects
    this.setupScrollEffects();
    
    // Toast notifications
    this.setupToastNotifications();
  }

  setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mobileMenu.isOpen && 
          !mobileNav.contains(e.target) && 
          !mobileMenuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    this.mobileMenu.isOpen = !this.mobileMenu.isOpen;
    
    if (this.mobileMenu.isOpen) {
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Animate hamburger to X
      hamburgerLines[0].style.transform = 'rotate(45deg) translateY(6px)';
      hamburgerLines[1].style.opacity = '0';
      hamburgerLines[2].style.transform = 'rotate(-45deg) translateY(-6px)';
    } else {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    this.mobileMenu.isOpen = false;
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset hamburger animation
    hamburgerLines[0].style.transform = '';
    hamburgerLines[1].style.opacity = '';
    hamburgerLines[2].style.transform = '';
  }

  setupCartDrawer() {
    const cartToggle = document.querySelector('.cart-toggle');
    const cartDrawerClose = document.querySelector('.cart-drawer-close');
    const cartDrawer = document.querySelector('.cart-drawer');

    if (cartToggle) {
      cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleCartDrawer();
      });
    }

    if (cartDrawerClose) {
      cartDrawerClose.addEventListener('click', () => {
        this.closeCartDrawer();
      });
    }

    // Close cart drawer when clicking outside
    cartDrawer.addEventListener('click', (e) => {
      if (e.target === cartDrawer) {
        this.closeCartDrawer();
      }
    });

    // Cart item interactions
    this.setupCartItemInteractions();
  }

  toggleCartDrawer() {
    const cartDrawer = document.querySelector('.cart-drawer');
    
    this.cartDrawer.isOpen = !this.cartDrawer.isOpen;
    
    if (this.cartDrawer.isOpen) {
      cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.loadCartItems();
    } else {
      this.closeCartDrawer();
    }
  }

  closeCartDrawer() {
    const cartDrawer = document.querySelector('.cart-drawer');
    
    this.cartDrawer.isOpen = false;
    cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  setupCartItemInteractions() {
    // Quantity adjustments
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quantity-minus')) {
        const itemId = e.target.dataset.itemId;
        const input = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
        const currentValue = parseInt(input.value);
        
        if (currentValue > 1) {
          input.value = currentValue - 1;
          this.updateCartItem(itemId, currentValue - 1);
        }
      }
      
      if (e.target.classList.contains('quantity-plus')) {
        const itemId = e.target.dataset.itemId;
        const input = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
        const currentValue = parseInt(input.value);
        
        input.value = currentValue + 1;
        this.updateCartItem(itemId, currentValue + 1);
      }
    });

    // Remove items
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('cart-item-remove') || e.target.parentElement.classList.contains('cart-item-remove')) {
        const button = e.target.classList.contains('cart-item-remove') ? e.target : e.target.parentElement;
        const itemId = button.dataset.itemId;
        this.removeCartItem(itemId);
      }
    });

    // Quantity input changes
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const itemId = e.target.dataset.itemId;
        const newQuantity = parseInt(e.target.value);
        
        if (newQuantity > 0) {
          this.updateCartItem(itemId, newQuantity);
        }
      }
    });
  }

  async loadCartItems() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      this.cart = cart;
      this.updateCartUI();
      this.updateCartCount();
    } catch (error) {
      console.error('Error loading cart:', error);
      this.showToast('خطأ في تحميل السلة', 'error');
    }
  }

  updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (this.cart.items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <p>سلة التسوق فارغة</p>
          <a href="/collections/all" class="btn btn-primary">تسوق الآن</a>
        </div>
      `;
      return;
    }

    const cartItemsHTML = this.cart.items.map(item => `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <p class="cart-item-price">${this.formatMoney(item.final_price)}</p>
          <div class="cart-item-quantity">
            <button class="quantity-minus" data-item-id="${item.id}" aria-label="تقليل الكمية">-</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-item-id="${item.id}">
            <button class="quantity-plus" data-item-id="${item.id}" aria-label="زيادة الكمية">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-item-id="${item.id}" aria-label="إزالة المنتج">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 6l8 8M6 14l8-8" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    `).join('');

    cartItemsContainer.innerHTML = cartItemsHTML;
    
    // Update cart total
    const cartTotalPrice = document.querySelector('.cart-total-price');
    if (cartTotalPrice) {
      cartTotalPrice.textContent = this.formatMoney(this.cart.total_price);
    }
  }

  updateCartCount() {
    const cartCountElements = document.querySelectorAll('[data-cart-count]');
    cartCountElements.forEach(element => {
      element.textContent = this.cart.item_count;
    });
  }

  async updateCartItem(itemId, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: itemId,
          quantity: quantity
        })
      });

      const cart = await response.json();
      this.cart = cart;
      this.updateCartUI();
      this.updateCartCount();
      
      this.showToast('تم تحديث السلة', 'success');
    } catch (error) {
      console.error('Error updating cart item:', error);
      this.showToast('خطأ في تحديث السلة', 'error');
    }
  }

  async removeCartItem(itemId) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: itemId,
          quantity: 0
        })
      });

      const cart = await response.json();
      this.cart = cart;
      this.updateCartUI();
      this.updateCartCount();
      
      this.showToast('تم إزالة المنتج من السلة', 'success');
    } catch (error) {
      console.error('Error removing cart item:', error);
      this.showToast('خطأ في إزالة المنتج', 'error');
    }
  }

  setupSearchModal() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchModalClose = document.querySelector('.search-modal-close');
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.querySelector('.search-input');

    if (searchToggle) {
      searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleSearchModal();
      });
    }

    if (searchModalClose) {
      searchModalClose.addEventListener('click', () => {
        this.closeSearchModal();
      });
    }

    // Close search modal when clicking outside
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        this.closeSearchModal();
      }
    });

    // Handle search input
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length > 2) {
          searchTimeout = setTimeout(() => {
            this.performSearch(query);
          }, 300);
        } else {
          this.clearSearchResults();
        }
      });
    }
  }

  toggleSearchModal() {
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.querySelector('.search-input');
    
    this.searchModal.isOpen = !this.searchModal.isOpen;
    
    if (this.searchModal.isOpen) {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus on search input
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    } else {
      this.closeSearchModal();
    }
  }

  closeSearchModal() {
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.querySelector('.search-input');
    
    this.searchModal.isOpen = false;
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    this.clearSearchResults();
  }

  async performSearch(query) {
    if (this.search.isLoading) return;
    
    this.search.isLoading = true;
    const searchResults = document.getElementById('search-results');
    
    // Show loading state
    searchResults.innerHTML = '<div class="loading">جاري البحث...</div>';
    
    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=10`);
      const data = await response.json();
      
      this.search.results = data.resources.results.products;
      this.displaySearchResults();
    } catch (error) {
      console.error('Error performing search:', error);
      searchResults.innerHTML = '<div class="error">حدث خطأ في البحث</div>';
    } finally {
      this.search.isLoading = false;
    }
  }

  displaySearchResults() {
    const searchResults = document.getElementById('search-results');
    
    if (this.search.results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">لا توجد نتائج للبحث</div>';
      return;
    }

    const resultsHTML = this.search.results.map(product => `
      <div class="search-result-item">
        <a href="${product.url}" class="search-result-link">
          <div class="search-result-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
          </div>
          <div class="search-result-info">
            <h4 class="search-result-title">${product.title}</h4>
            <p class="search-result-price">${this.formatMoney(product.price)}</p>
          </div>
        </a>
      </div>
    `).join('');

    searchResults.innerHTML = resultsHTML;
  }

  clearSearchResults() {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
  }

  setupProductInteractions() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        e.preventDefault();
        const variantId = e.target.dataset.variantId;
        const quantity = 1;
        
        this.addToCart(variantId, quantity);
      }
    });

    // Quick view buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.product-action-btn')) {
        const button = e.target.closest('.product-action-btn');
        const productId = button.dataset.productId;
        
        if (button.classList.contains('quick-view-btn')) {
          this.openQuickView(productId);
        }
      }
    });

    // Wishlist buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.wishlist-btn')) {
        const button = e.target.closest('.wishlist-btn');
        const productId = button.dataset.productId;
        
        this.toggleWishlist(productId);
      }
    });
  }

  async addToCart(variantId, quantity) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity
        })
      });

      const data = await response.json();
      
      // Update cart
      await this.loadCartItems();
      
      // Show success message
      this.showToast('تمت إضافة المنتج إلى السلة', 'success');
      
      // Open cart drawer
      this.toggleCartDrawer();
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showToast('خطأ في إضافة المنتج إلى السلة', 'error');
    }
  }

  openQuickView(productId) {
    // Implement quick view functionality
    console.log('Opening quick view for product:', productId);
    this.showToast('معاينة سريعة قيد التطوير', 'info');
  }

  toggleWishlist(productId) {
    // Implement wishlist functionality
    console.log('Toggling wishlist for product:', productId);
    this.showToast('قائمة الرغبات قيد التطوير', 'info');
  }

  setupFormHandlers() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewsletterSubmit(e.target);
      });
    }

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactSubmit(e.target);
      });
    }
  }

  async handleNewsletterSubmit(form) {
    const formData = new FormData(form);
    const email = formData.get('contact[email]');
    
    try {
      const response = await fetch('/contact', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        this.showToast('تم الاشتراك في النشرة البريدية بنجاح', 'success');
        form.reset();
      } else {
        this.showToast('خطأ في الاشتراك في النشرة البريدية', 'error');
      }
    } catch (error) {
      console.error('Newsletter submission error:', error);
      this.showToast('خطأ في الاشتراك في النشرة البريدية', 'error');
    }
  }

  async handleContactSubmit(form) {
    const formData = new FormData(form);
    
    try {
      const response = await fetch('/contact', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        this.showToast('تم إرسال رسالتك بنجاح', 'success');
        form.reset();
      } else {
        this.showToast('خطأ في إرسال الرسالة', 'error');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      this.showToast('خطأ في إرسال الرسالة', 'error');
    }
  }

  setupScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Hide/show header on scroll
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
      
      // Add scroll animations
      this.setupScrollAnimations();
    });
  }

  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        element.classList.add('animated');
      }
    });
  }

  setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1
    });

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in, .scale-in').forEach(el => {
      observer.observe(el);
    });

    // Add hover animations
    this.setupHoverAnimations();
  }

  setupHoverAnimations() {
    // Product card hover effects
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Button hover effects
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    });
  }

  setupMobileOptimizations() {
    // Touch-friendly interactions
    this.setupTouchInteractions();
    
    // Responsive navigation
    this.setupResponsiveNav();
    
    // Mobile performance optimizations
    this.optimizeMobilePerformance();
  }

  setupTouchInteractions() {
    // Add touch feedback to interactive elements
    const touchElements = document.querySelectorAll('button, .btn, .product-card, a');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.style.opacity = '0.8';
      });
      
      element.addEventListener('touchend', () => {
        element.style.opacity = '1';
      });
    });
  }

  setupResponsiveNav() {
    // Handle responsive navigation
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width > 768) {
        this.closeMobileMenu();
      }
    };
    
    window.addEventListener('resize', handleResize);
  }

  optimizeMobilePerformance() {
    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.src = img.dataset.src;
      });
    }
    
    // Reduce animations on mobile
    if (window.innerWidth <= 768) {
      document.documentElement.style.setProperty('--transition-base', '200ms ease');
    }
  }

  setupToastNotifications() {
    // Toast container already exists in HTML
    this.toastContainer = document.getElementById('toast-container');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="إغلاق">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    `;
    
    this.toastContainer.appendChild(toast);
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.removeToast(toast);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeToast(toast);
    }, 5000);
  }

  removeToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -20px)';
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  formatMoney(cents) {
    const amount = cents / 100;
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
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

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.ModernShopifyTheme = new ModernShopifyTheme();
});

// Handle page transitions
document.addEventListener('DOMContentLoaded', () => {
  // Add page transition effects
  const links = document.querySelectorAll('a:not([target="_blank"])');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        e.preventDefault();
        
        // Add fade out effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });
});

// Add loading state management
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Remove loading overlay if exists
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 300);
    }, 500);
  }
});

// Error handling
window.addEventListener('error', (e) => {
  console.error('Theme Error:', e.error);
  // Show user-friendly error message
  if (window.ModernShopifyTheme) {
    window.ModernShopifyTheme.showToast('حدث خطأ في تحميل الصفحة', 'error');
  }
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }, 0);
  });
}