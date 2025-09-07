document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.header__menu-toggle');
  const menu = document.querySelector('.header__menu');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Sticky header effect
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.padding = '1rem 0';
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.padding = '2rem 0';
      header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
  
  // Product image gallery
  const mainImage = document.querySelector('.product__media-main img');
  const thumbnails = document.querySelectorAll('.product__media-thumbnail');
  
  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        const newSrc = this.querySelector('img').getAttribute('src');
        mainImage.setAttribute('src', newSrc);
        
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  
  // Quantity selector
  const quantityInputs = document.querySelectorAll('.quantity-input');
  
  quantityInputs.forEach(input => {
    const minusBtn = input.parentElement.querySelector('.quantity-minus');
    const plusBtn = input.parentElement.querySelector('.quantity-plus');
    
    if (minusBtn) {
      minusBtn.addEventListener('click', function() {
        const currentValue = parseInt(input.value);
        if (currentValue > 1) {
          input.value = currentValue - 1;
        }
      });
    }
    
    if (plusBtn) {
      plusBtn.addEventListener('click', function() {
        const currentValue = parseInt(input.value);
        input.value = currentValue + 1;
      });
    }
  });
  
  // Cart item quantity
  const cartItems = document.querySelectorAll('.cart__item');
  
  cartItems.forEach(item => {
    const quantityInput = item.querySelector('.cart__item-quantity-input');
    const minusBtn = item.querySelector('.cart__item-quantity-minus');
    const plusBtn = item.querySelector('.cart__item-quantity-plus');
    
    if (minusBtn && quantityInput) {
      minusBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
          // Update cart via AJAX
          updateCart();
        }
      });
    }
    
    if (plusBtn && quantityInput) {
      plusBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
        // Update cart via AJAX
        updateCart();
      });
    }
  });
  
  // Remove cart item
  const removeButtons = document.querySelectorAll('.cart__item-remove');
  
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const cartItem = this.closest('.cart__item');
      cartItem.style.opacity = '0';
      cartItem.style.transform = 'translateX(20px)';
      
      setTimeout(() => {
        cartItem.remove();
        // Update cart via AJAX
        updateCart();
        
        // Check if cart is empty
        const remainingItems = document.querySelectorAll('.cart__item');
        if (remainingItems.length === 0) {
          document.querySelector('.cart__items').style.display = 'none';
          document.querySelector('.cart__footer').style.display = 'none';
          document.querySelector('.cart__empty').style.display = 'block';
        }
      }, 300);
    });
  });
  
  // Quick add to cart
  const quickAddButtons = document.querySelectorAll('.product-card__quick-add');
  
  quickAddButtons.forEach(button => {
    button.addEventListener('click', function() {
      const variantId = this.dataset.variantId;
      addToCart(variantId, 1);
    });
  });
  
  // Add to cart function
  function addToCart(variantId, quantity) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(data => {
      // Show success message
      showNotification('Product added to cart!');
      // Update cart count
      updateCartCount();
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      showNotification('Error adding product to cart.', 'error');
    });
  }
  
  // Update cart function
  function updateCart() {
    fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      // Update cart count
      updateCartCount(cart.item_count);
      
      // Update cart total
      const subtotalElement = document.querySelector('.cart__subtotal');
      if (subtotalElement) {
        subtotalElement.textContent = formatMoney(cart.total_price);
      }
    })
    .catch(error => {
      console.error('Error updating cart:', error);
    });
  }
  
  // Update cart count
  function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
      if (count !== undefined) {
        element.textContent = count;
      } else {
        fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
          element.textContent = cart.item_count;
        })
        .catch(error => {
          console.error('Error getting cart count:', error);
        });
      }
    });
  }
  
  // Format money function
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }
  
  // Show notification
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Initialize animations on scroll
  const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-in-left, .animate-slide-in-right');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Parallax effect
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrollPosition * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
  
  // Interactive background effect
  const interactiveBgElements = document.querySelectorAll('.interactive-bg');
  
  interactiveBgElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      element.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(0, 77, 64, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.background = '';
    });
  });
  
  // Initialize RTL support
  if (document.documentElement.getAttribute('dir') === 'rtl') {
    document.body.classList.add('rtl-support');
  }
});