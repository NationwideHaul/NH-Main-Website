// ============================================
// NATIONWIDE HAUL - MAIN JS
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // --- Mobile Nav Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
    });
  }

  // --- Sticky header shadow on scroll ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }
  });

  // --- Animate stats on scroll ---
  const statNumbers = document.querySelectorAll('.stat-number-animate');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) {
    observer.observe(el);
  });

  function animateNumber(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
  }

  // --- Dealer logo scroll (if overflow) ---
  const dealerTrack = document.querySelector('.dealer-logos');
  // Just ensure it's scrollable on overflow (CSS handles this)

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Review card carousel (mobile) ---
  // On small screens the reviews stack, no JS needed

  // --- Category hover effect ---
  document.querySelectorAll('.category-list__item').forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      this.querySelector('.arrow').textContent = '→';
    });
  });

});
