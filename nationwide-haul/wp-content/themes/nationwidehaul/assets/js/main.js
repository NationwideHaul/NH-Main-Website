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

  // --- Hero Search Bar: Dynamic Dropdowns + Sandhills Redirect ---
  var heroCategories = {
    trailers: [
      {label: 'All Categories', value: ''},
      {label: 'Curtain Side/Roll Tarp', value: 'curtain-side-roll-tarp'},
      {label: 'Double Drop', value: 'double-drop'},
      {label: 'Drop Deck', value: 'drop-deck'},
      {label: 'Drop Frame Van', value: 'drop-frame-van'},
      {label: 'Dry Van', value: 'dry-van'},
      {label: 'Dump Trailers', value: 'dump-trailers'},
      {label: 'Flatbed', value: 'flatbed'},
      {label: 'Hopper/Grain', value: 'hopper-grain'},
      {label: 'Intermodal/Container Chassis', value: 'intermodal-container-chassis'},
      {label: 'Live Floor', value: 'live-floor'},
      {label: 'Log Trailers', value: 'log-trailers'},
      {label: 'Lowboy', value: 'lowboy'},
      {label: 'Reefer Trailers', value: 'reefer-trailers'},
      {label: 'Refuse Trailers', value: 'refuse-trailers'},
      {label: 'Tag Trailers', value: 'tag-trailers'},
      {label: 'Tank Trailers', value: 'tank-trailers'},
      {label: 'Traveling Axle', value: 'traveling-axle'}
    ],
    trucks: [
      {label: 'All Categories', value: ''},
      {label: 'Box Trucks', value: 'box-trucks'},
      {label: 'Day Cab', value: 'day-cab'},
      {label: 'Dump Trucks', value: 'dump-trucks'},
      {label: 'Sleeper Trucks', value: 'sleeper-trucks'},
      {label: 'Tank Trucks', value: 'tank-trucks'},
      {label: 'Yard Spotter', value: 'yard-spotter'}
    ]
  };

  var heroManufacturers = {
    trailers: [
      {label: 'All Manufacturers', value: ''},
      {label: 'CIE', value: 'CIE'},
      {label: 'Dorsey', value: 'DORSEY'},
      {label: 'MAC Trailer MFG', value: 'MACTRAILERMFG'},
      {label: 'Pitts', value: 'PITTS'},
      {label: 'Stoughton', value: 'STOUGHTON'},
      {label: 'Utility', value: 'UTILITY'},
      {label: 'Vanguard', value: 'VANGUARD'},
      {label: 'Wabash', value: 'WABASH'},
      {label: 'Wade', value: 'WADE'},
      {label: 'XL Specialized', value: 'XLSPECIALIZED'}
    ],
    trucks: [
      {label: 'All Manufacturers', value: ''},
      {label: 'Autocar', value: 'AUTOCAR'},
      {label: 'Freightliner', value: 'FREIGHTLINER'},
      {label: 'Hino', value: 'HINO'},
      {label: 'International', value: 'INTERNATIONAL'},
      {label: 'Kalmar', value: 'KALMAR'},
      {label: 'Kenworth', value: 'KENWORTH'},
      {label: 'Peterbilt', value: 'PETERBILT'},
      {label: 'Tico', value: 'TICO'},
      {label: 'Volvo', value: 'VOLVO'},
      {label: 'Western Star', value: 'WESTERNSTAR'}
    ]
  };

  var heroBaseUrls = {
    trailers: 'https://www.nationwidehaul.com/inventory/?/listings/for-sale/trailers/28?bgn=Nationwide+Haul+Web&settingscrmid=16824364&dlr=1',
    trucks: 'https://www.nationwidehaul.com/inventory/?/listings/for-sale/trucks/27?bgn=Nationwide+Haul+Web&settingscrmid=16824364&dlr=1'
  };

  var equipmentType = document.getElementById('equipmentType');
  var categorySelect = document.getElementById('categorySelect');
  var manufacturerSelect = document.getElementById('manufacturerSelect');
  var heroForm = document.getElementById('heroSearchForm');

  function populateHeroSelect(selectEl, items, placeholder) {
    selectEl.innerHTML = '';
    var defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '\u2630 ' + placeholder;
    selectEl.appendChild(defaultOpt);
    items.forEach(function(item) {
      var opt = document.createElement('option');
      opt.value = item.value;
      opt.textContent = item.label;
      selectEl.appendChild(opt);
    });
  }

  if (equipmentType) {
    equipmentType.addEventListener('change', function() {
      var type = this.value;
      if (type && heroCategories[type]) {
        populateHeroSelect(categorySelect, heroCategories[type], 'Category');
        populateHeroSelect(manufacturerSelect, heroManufacturers[type], 'Manufacturer');
        categorySelect.disabled = false;
        manufacturerSelect.disabled = false;
      } else {
        categorySelect.innerHTML = '<option value="">\u2630 Category</option>';
        manufacturerSelect.innerHTML = '<option value="">\u2630 Manufacturer</option>';
        categorySelect.disabled = true;
        manufacturerSelect.disabled = true;
      }
    });
  }

  if (heroForm) {
    heroForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var type = equipmentType.value;
      if (!type) {
        equipmentType.focus();
        return;
      }
      var url = heroBaseUrls[type];
      var mfr = manufacturerSelect.value;
      if (mfr) {
        url += '&Manufacturer=' + mfr;
      }
      var cat = categorySelect.value;
      if (cat) {
        url += '&Category=' + cat;
      }
      window.open(url, '_blank');
    });
  }

});
