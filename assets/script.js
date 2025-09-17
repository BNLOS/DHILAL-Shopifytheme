// ===== FAQ ACCORDION =====
document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq__question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const icon = this.querySelector('.faq__icon');
      
      // Close all other FAQs
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== this) {
          const otherAnswer = otherQuestion.nextElementSibling;
          const otherIcon = otherQuestion.querySelector('.faq__icon');
          otherAnswer.classList.remove('active');
          otherIcon.classList.remove('active');
        }
      });
      
      // Toggle current FAQ
      answer.classList.toggle('active');
      icon.classList.toggle('active');
    });
  });
});

// ===== STICKY HEADER =====
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== LAZY LOADING =====
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== MOBILE MENU TOGGLE =====
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    this.classList.toggle('active');
  });
}

// ===== ADD TO CART ANIMATION =====
document.querySelectorAll('.product-card__atc').forEach(button => {
  button.addEventListener('click', function() {
    this.innerHTML = '<span>✓ تمت الإضافة</span>';
    this.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
    
    setTimeout(() => {
      this.innerHTML = '{{ 'product.add_to_cart' | t }}';
      this.style.background = '';
    }, 2000);
  });
});

// ===== VIDEO PLAY/PAUSE =====
const videos = document.querySelectorAll('.video-showcase video');
videos.forEach(video => {
  video.addEventListener('click', function() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  });
});