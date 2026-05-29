/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Home Page JavaScript
   ══════════════════════════════════════════════════════ */

// ── Stat counter animation ──────────────────────────────
(function() {
  var statEls = document.querySelectorAll('.stat-item__number[data-target]');
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'));
        var suffix = el.getAttribute('data-suffix') || '';
        var current = 0;
        var step = target / (1800 / 16);
        var timer = setInterval(function() {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); el.classList.add('stat-landed'); }
          el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(function(el) { obs.observe(el); });
})();

// ── Logo Carousel: seamless infinite loop ───────────────
(function(){
  var track = document.getElementById('logoTrack');
  if (!track) return;
  var items = track.children;
  var half = items.length / 2;
  var setWidth = 0;
  for (var i = 0; i < half; i++) {
    setWidth += items[i].offsetWidth;
  }
  setWidth += half * 72;
  track.style.setProperty('--scroll-offset', '-' + setWidth + 'px');
  track.classList.add('is-scrolling');
})();

// ── NH Difference Featured Carousel ─────────────────────
var svcItems = [
  {
    title: 'Municipality Bids',
    desc:  'Reliable, scalable fleet solutions for public works and municipal departments.',
    img:   'files/the nationwide haul difference/Municipality bids.jpg',
    href:  '/perks/municipality/'
  },
  {
    title: 'Commercial Insurance',
    desc:  'In-house trucking insurance agency with access to +120 markets to provide you the best quotes.',
    img:   'files/the nationwide haul difference/Commercial Insurance.jpg',
    href:  'https://roadreadyinsurance.com',
    target: '_blank'
  },
  {
    title: 'Financing',
    desc:  'In-house finance division to get pre-qualified today — no initial hard pull on your credit.',
    img:   'files/the nationwide haul difference/financing.png',
    href:  '/financing/'
  },
  {
    title: 'Service & Repair',
    desc:  'Trailer, truck, RV, and bus repair — our trained technicians will get you back on the road fast.',
    img:   'files/the nationwide haul difference/service and repair.jpg',
    href:  'https://nhtrucktrailerrepair.com',
    target: '_blank'
  },
  {
    title: 'Leasing & Rental',
    desc:  'Flexible Leasing and Rental options to fit your needs.',
    img:   'files/the nationwide haul difference/leasing and rental.jpg',
    href:  '/lease/'
  },
  {
    title: 'Sell Your Equipment',
    desc:  'Get a fast and fair cash offer for your trucking equipment today. Quick appraisal, no hassle.',
    img:   'files/the nationwide haul difference/logistics-transportation-truck-cargo-ship-with-business-collaboration-businessman-shake-hands-logistic-import-export-transport-industry-background.jpg',
    href:  '/perks/sell-your-equipment/'
  }
];
var svcIdx   = 0;
var svcTimer = null;

function setSvcActive(i, auto) {
  svcIdx = i;
  var item = svcItems[i];

  var bg = document.getElementById('svcBg');
  if (bg) {
    bg.classList.add('is-leaving');
    setTimeout(function() {
      bg.style.backgroundImage = "url('" + item.img + "')";
      bg.classList.remove('is-leaving');
    }, 280);
  }

  var titleEl = document.getElementById('svcTitle');
  var descEl  = document.getElementById('svcDesc');
  var eyeEl   = document.getElementById('svcEyebrow');
  var btnEl   = document.getElementById('svcBtn');
  if (titleEl) {
    titleEl.classList.add('fade-out');
    descEl.classList.add('fade-out');
    setTimeout(function() {
      titleEl.textContent = item.title;
      descEl.textContent  = item.desc;
      eyeEl.textContent   = ('0'+(i+1)).slice(-2) + ' / 0' + svcItems.length;
      btnEl.href = item.href;
      btnEl.onclick = null;
      if (item.target) { btnEl.setAttribute('target', item.target); } else { btnEl.removeAttribute('target'); }
      titleEl.classList.remove('fade-out');
      descEl.classList.remove('fade-out');
    }, 220);
  }

  var tabs = document.querySelectorAll('#svcTabs .svc-tab');
  tabs.forEach(function(t, idx) { t.classList.toggle('is-active', idx === i); });
  var mobileTabs = document.querySelectorAll('#svcMobileTabs .svc-mobile-tab');
  mobileTabs.forEach(function(t, idx) { t.classList.toggle('is-active', idx === i); });

  var bar = document.getElementById('svcBar');
  if (bar) {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    void bar.offsetWidth;
    bar.style.transition = 'width 4.2s linear';
    bar.style.width = '100%';
  }

  if (!auto) {
    clearInterval(svcTimer);
    svcTimer = setInterval(function() {
      setSvcActive((svcIdx + 1) % svcItems.length, true);
    }, 4400);
  }
}

function initSvcCarousel() {
  if (!document.getElementById('svcBg')) return;
  setSvcActive(0, false);
}
initSvcCarousel();

// ── Hero video — aggressive mobile autoplay ─────────────
(function() {
  var v = document.getElementById('heroVideo');
  if (!v) return;
  v.muted = true;
  v.playsInline = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');

  var played = false;
  var tryPlay = function() {
    if (played) return;
    var p = v.play();
    if (p && typeof p.then === 'function') {
      p.then(function() { played = true; })
       .catch(function() {});
    } else {
      played = true;
    }
  };

  tryPlay();
  setTimeout(tryPlay, 300);
  setTimeout(tryPlay, 1200);
  v.addEventListener('canplay', tryPlay);
  v.addEventListener('loadeddata', tryPlay);
  var events = ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'];
  events.forEach(function(evt) {
    document.addEventListener(evt, tryPlay, { passive: true });
  });
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) tryPlay();
  });
})();

// ── Staggered card entrances (inventory + testimonials) ──
(function() {
  var groups = document.querySelectorAll('.inventory-grid, .reviews-grid');
  var staggerObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var cards = entry.target.querySelectorAll('.stagger-item');
        cards.forEach(function(card, i) {
          setTimeout(function() { card.classList.add('revealed'); }, i * 120);
        });
        staggerObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  groups.forEach(function(group) {
    var children = group.children;
    for (var i = 0; i < children.length; i++) { children[i].classList.add('stagger-item'); }
    staggerObs.observe(group);
  });
})();

// ── Section heading clip-path reveal ────────────────────
(function() {
  var headings = document.querySelectorAll(
    '.section-header h2, .browse-category__heading, ' +
    '.nh-difference__header h2, .contact-cta__header h2'
  );
  var headingObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        headingObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  headings.forEach(function(h) { h.classList.add('heading-reveal'); headingObs.observe(h); });
})();

// ── Photo gallery staggered entrance ────────────────────
(function() {
  var gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;
  var items = gallery.querySelectorAll('.photo-gallery__item');
  if (window.innerWidth <= 768) return;
  items.forEach(function(item) { item.classList.add('gallery-stagger'); });
  var galleryObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.gallery-stagger').forEach(function(child, i) {
          setTimeout(function() { child.classList.add('revealed'); }, i * 100);
        });
        galleryObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  galleryObs.observe(gallery);
})();

// ── 3D tilt hover on inventory cards (desktop only) ─────
(function() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  var cards = document.querySelectorAll('.inventory-card');
  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
      var rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
      card.style.transform = 'translateY(-3px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.transition = 'box-shadow 0.2s, transform 0.4s ease';
      setTimeout(function() { card.style.transition = ''; }, 400);
    });
  });
})();

// ── YouTube Carousel ────────────────────────────────────
(function(){
  var track = document.getElementById('ytTrack');
  var prevBtn = document.getElementById('ytPrev');
  var nextBtn = document.getElementById('ytNext');
  if (!track) return;

  var CHANNEL_ID = 'UCjWMfLksDwfwVA-u3xkhnhg';
  var FEED_URL   = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID;
  var PROXY_URL  = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(FEED_URL);
  var CACHE_KEY  = 'nh-yt-videos-v2';
  var CACHE_TTL  = 60 * 60 * 1000;

  var fallbackVideos = [
    {id:'ZnC8kxhPu4k', title:'Inside MAC Trailer Pneumatic Tanks'},
    {id:'mKTzfmf9wEk', title:'Why the 2026 Vanguard Composite Plate Dry Van Stands Out'},
    {id:'diGyyRQWcnU', title:'WADE Flatbed Trailer Walkaround'},
    {id:'Rx2MwVtZKqg', title:'MAC Road Warrior Flatbed Trailer Walkaround'},
    {id:'1utuahVbVG4', title:'NEW MAC 48 High Spec Flatbed'},
    {id:'INs_54wALqY', title:'MAC Aluminum Tri-Axle Smooth Side Florida Spec Dump'},
    {id:'8MZ-08eTd0A', title:'Custom PITTS Chassis for Miami-Dade County'},
    {id:'3EfRi9GjL4I', title:'Nationwide Haul Gives Back to 4KIDS of South Florida'},
    {id:'iv8XwicQKFI', title:'Get to Know Nationwide Haul'},
    {id:'BL80VJaekGg', title:'NEW MAC 1000C Pneumatic Dry Bulk Tanker'},
    {id:'C12FfKAVbiI', title:'Nationwide Haul Lakeland'},
    {id:'1PfCIm49ydY', title:'NFI International Sleeper'},
    {id:'3hRMjAtqj_s', title:'Stoughton Grain Trailer'},
    {id:'55FUTDvFV58', title:'NFI Volvo Day Cab'},
    {id:'AcK4AZKu2Oo', title:'Who is NFI?'}
  ];

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function render(videos) {
    track.innerHTML = '';
    videos.forEach(function(v){
      var thumb = 'https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg';
      var card = document.createElement('a');
      card.href = 'https://www.youtube.com/watch?v=' + v.id;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'yt-carousel__card';
      card.innerHTML =
        '<img src="' + thumb + '" alt="' + escapeHTML(v.title) + '" loading="lazy">' +
        '<div class="yt-carousel__overlay"></div>' +
        '<div class="yt-carousel__play"><svg width="18" height="20" viewBox="0 0 18 20" fill="white"><path d="M1 1l16 9L1 19V1z"/></svg></div>' +
        '<span class="yt-carousel__title">' + escapeHTML(v.title) + '</span>';
      track.appendChild(card);
    });
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
    var stats = document.getElementById('ytChannelStats');
    if (stats) stats.textContent = videos.length + ' Latest Videos';
  }

  function itemsToVideos(items) {
    return items
      .filter(function(item) {
        return item.link && item.link.indexOf('/shorts/') === -1;
      })
      .map(function(item) {
        var parts = (item.guid || '').split(':');
        var id = parts[parts.length - 1];
        if (!id || !/^[a-zA-Z0-9_-]{8,15}$/.test(id)) {
          var m = (item.link || '').match(/[?&]v=([a-zA-Z0-9_-]+)/);
          id = m ? m[1] : null;
        }
        return id ? { id: id, title: item.title || '' } : null;
      })
      .filter(Boolean)
      .slice(0, 15);
  }

  function fetchAndCache() {
    return fetch(PROXY_URL)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        if (!data || data.status !== 'ok' || !data.items || !data.items.length) {
          throw new Error('feed invalid');
        }
        var videos = itemsToVideos(data.items);
        if (!videos.length) throw new Error('no non-Shorts videos');
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), videos: videos }));
        } catch (e) {}
        return videos;
      });
  }

  var cached = null;
  try {
    cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  } catch (e) {}

  if (cached && cached.videos && cached.videos.length && (Date.now() - cached.ts) < CACHE_TTL) {
    render(cached.videos);
  } else {
    render(fallbackVideos);
    fetchAndCache()
      .then(render)
      .catch(function(err) {
        console.warn('YT auto-sync failed, using fallback:', err);
      });
  }

  prevBtn.addEventListener('click', function(){ track.scrollBy({ left: -400, behavior: 'smooth' }); });
  nextBtn.addEventListener('click', function(){ track.scrollBy({ left: 400, behavior: 'smooth' }); });
})();

// ── Hero Search Bar Logic ───────────────────────────────
(function() {
  var categories = {
    trailers: [
      {label: 'All Categories', value: ''},
      {label: 'Curtain Side/Roll Tarp', value: '62'},
      {label: 'Double Drop', value: '371'},
      {label: 'Drop Deck', value: '12'},
      {label: 'Drop Frame Van', value: '341'},
      {label: 'Dry Van', value: '15022'},
      {label: 'Dump Trailers', value: '15000'},
      {label: 'Flatbed', value: '14'},
      {label: 'Hopper/Grain', value: '54'},
      {label: 'Intermodal/Container Chassis', value: '803'},
      {label: 'Live Floor', value: '342'},
      {label: 'Log Trailers', value: '17'},
      {label: 'Lowboy', value: '18'},
      {label: 'Reefer Trailers', value: '20'},
      {label: 'Refuse Trailers', value: '344'},
      {label: 'Tag Trailers', value: '345'},
      {label: 'Tank Trailers', value: '21'},
      {label: 'Traveling Axle', value: '15104'}
    ],
    trucks: [
      {label: 'All Categories', value: ''},
      {label: 'Box Trucks', value: '16004'},
      {label: 'Day Cab', value: '16013'},
      {label: 'Dump Trucks', value: '16014'},
      {label: 'Sleeper Trucks', value: '16045'},
      {label: 'Tank Trucks', value: '16050'},
      {label: 'Yard Spotter', value: '16078'}
    ]
  };

  var manufacturers = {
    trailers: [
      {label: 'All Manufacturers', value: ''},
      {label: 'CIE', value: 'CIE'},
      {label: 'Dorsey', value: 'DORSEY'},
      {label: 'MAC Trailer MFG', value: 'MAC TRAILER MFG'},
      {label: 'Pitts', value: 'PITTS'},
      {label: 'Stoughton', value: 'STOUGHTON'},
      {label: 'Utility', value: 'UTILITY'},
      {label: 'Vanguard', value: 'VANGUARD'},
      {label: 'Wabash', value: 'WABASH'},
      {label: 'Wade', value: 'WADE'},
      {label: 'XL Specialized', value: 'XL SPECIALIZED'}
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
      {label: 'Western Star', value: 'WESTERN STAR'}
    ]
  };

  var baseUrls = {
    trailers: 'https://inventory.nationwidehaul.com/inventory/?/listings/for-sale/trailers/28?bgn=Nationwide+Haul+Web&dlr=1&settingscrmid=16824364',
    trucks: 'https://inventory.nationwidehaul.com/inventory/?/listings/for-sale/trucks/27?bgn=Nationwide+Haul+Web&dlr=1&settingscrmid=16824364'
  };

  var equipmentType = document.getElementById('equipmentType');
  var categorySelect = document.getElementById('categorySelect');
  var manufacturerSelect = document.getElementById('manufacturerSelect');
  var form = document.getElementById('heroSearchForm');
  if (!form) return;

  function populateSelect(selectEl, items, placeholder) {
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

  equipmentType.addEventListener('change', function() {
    var type = this.value;
    if (type && categories[type]) {
      populateSelect(categorySelect, categories[type], 'Category');
      populateSelect(manufacturerSelect, manufacturers[type], 'Manufacturer');
      categorySelect.disabled = false;
      manufacturerSelect.disabled = false;
    } else {
      categorySelect.innerHTML = '<option value="">\u2630 Category</option>';
      manufacturerSelect.innerHTML = '<option value="">\u2630 Manufacturer</option>';
      categorySelect.disabled = true;
      manufacturerSelect.disabled = true;
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var type = equipmentType.value;
    if (!type) {
      equipmentType.focus();
      return;
    }
    var url = baseUrls[type];
    var cat = categorySelect.value;
    var mfr = manufacturerSelect.value;
    if (cat) url += '&Category=' + encodeURIComponent(cat);
    if (mfr) url += '&Manufacturer=' + encodeURIComponent(mfr);
    window.location.href = url;
  });
})();
