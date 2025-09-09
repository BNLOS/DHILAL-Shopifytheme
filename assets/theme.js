// ===== THEME JAVASCRIPT =====

class ThemeController {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHeaderScroll();
    this.setupMobileMenu();
    this.setupProductCards();
    this.setupCart();
    this.setupSearch();
    this.setupNewsletter();
    this.setupLazyLoading();
    this.setupSmoothScroll();
    this.setupRTLSupport();
  }

  // ===== SCROLL ANIMATIONS =====
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  setupHeaderScroll() {
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show header on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
    });
  }

  // ===== MOBILE MENU =====
  setupMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarToggler && navbarCollapse) {
      navbarToggler.addEventListener('click', () => {
        navbarCollapse.classList.toggle('show');
        navbarToggler.classList.toggle('collapsed');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
          navbarCollapse.classList.remove('show');
          navbarToggler.classList.add('collapsed');
        }
      });
    }
  }

  // ===== PRODUCT CARDS INTERACTIONS =====
  setupProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      // Add hover sound effect (optional)
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });

      // Quick view functionality
      const quickViewBtn = card.querySelector('.quick-view-btn');
      if (quickViewBtn) {
        quickViewBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openQuickView(card.dataset.productHandle);
        });
      }
    });
  }

  // ===== CART FUNCTIONALITY =====
  setupCart() {
    this.updateCartCount();
    
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        e.preventDefault();
        this.addToCart(e.target);
      }
    });

    // Cart drawer
    const cartIcon = document.querySelector('.cart-icon');