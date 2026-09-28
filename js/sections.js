/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Shared page sections
   Used by the home page and the sales rep landing pages
   (/team/<slug>/): authorized-dealer logo carousel, YouTube
   carousel and live Google reviews. Each block no-ops when its
   markup isn't on the page.
   ══════════════════════════════════════════════════════ */

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
    // If the live feed returns only a video or two (e.g. recent uploads were
    // Shorts and got filtered out), pad with the curated list so the carousel
    // still looks full instead of one lonely card.
    if (videos.length < 3) {
      var seen = {};
      videos.forEach(function(v){ seen[v.id] = true; });
      for (var i = 0; i < fallbackVideos.length && videos.length < 9; i++) {
        if (!seen[fallbackVideos[i].id]) {
          videos.push(fallbackVideos[i]);
          seen[fallbackVideos[i].id] = true;
        }
      }
    }
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
    // Only show nav arrows when the track actually overflows.
    var hasOverflow = track.scrollWidth > track.clientWidth + 4;
    prevBtn.style.display = hasOverflow ? 'flex' : 'none';
    nextBtn.style.display = hasOverflow ? 'flex' : 'none';
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

// ── Live Google reviews ─────────────────────────────────
// Markup contract:
//   [data-google-reviews]  grid of .review-card — replaced with live reviews
//   [data-google-summary]  text — replaced with "4.9 ★ from N Google reviews"
//   [data-google-links]    hidden until loaded; gets "See all" + "Write a review"
// The static cards in the HTML stay as the fallback if /api/reviews fails.
(function() {
  var grid = document.querySelector('[data-google-reviews]');
  if (!grid) return;
  var MAX = 4;
  var COLORS = ['#4285F4', '#EA4335', '#34A853', '#FBBC05'];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function clip(t, n) {
    t = String(t).replace(/\s+/g, ' ').trim();
    return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t;
  }
  function stars(n) {
    n = Math.round(n || 5);
    return '★★★★★'.slice(0, n) + '<span style="color:#ddd">' + '★★★★★'.slice(n) + '</span>';
  }

  fetch('/api/reviews/')
    .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function(d) {
      if (!d || !d.reviews || !d.reviews.length) throw new Error('no reviews');
      var list = d.reviews.slice().sort(function(a, b) { return b.rating - a.rating; }).slice(0, MAX);
      grid.innerHTML = list.map(function(rv, i) {
        var avatar = rv.photo
          ? '<img class="review-card__avatar" src="' + esc(rv.photo) + '" alt="" referrerpolicy="no-referrer" loading="lazy" style="object-fit:cover;">'
          : '<div class="review-card__avatar" style="background:' + COLORS[i % 4] + ';">' + esc(rv.author.charAt(0)) + '</div>';
        var name = rv.authorUrl
          ? '<a href="' + esc(rv.authorUrl) + '" target="_blank" rel="noopener nofollow" style="color:inherit;text-decoration:none;">' + esc(rv.author) + '</a>'
          : esc(rv.author);
        return '<div class="review-card">'
          + '<div class="review-card__top">' + avatar
          + '<div><div class="review-card__name">' + name + '</div><div class="review-card__date">' + esc(rv.when) + ' · Google</div></div></div>'
          + '<div class="review-card__stars" aria-label="' + rv.rating + ' out of 5 stars">' + stars(rv.rating) + '</div>'
          + '<p class="review-card__text">' + esc(clip(rv.text, 260)) + '</p>'
          + '</div>';
      }).join('');

      var summary = document.querySelector('[data-google-summary]');
      if (summary && d.rating) {
        summary.textContent = d.rating.toFixed(1) + ' ★ average from ' + d.count.toLocaleString() + ' Google reviews';
      }
      var links = document.querySelector('[data-google-links]');
      if (links && d.url) {
        links.innerHTML = '<a href="' + esc(d.url) + '" target="_blank" rel="noopener">See all reviews on Google →</a>'
          + '<a href="' + esc(d.writeUrl) + '" target="_blank" rel="noopener">Write a review</a>';
        links.hidden = false;
      }
    })
    .catch(function(err) { console.info('Google reviews unavailable, showing saved reviews:', err.message); });
})();
