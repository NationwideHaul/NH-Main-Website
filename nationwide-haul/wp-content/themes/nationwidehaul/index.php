<?php get_header(); ?>

<!-- ============================================
     HERO SECTION
     ============================================ -->
<section class="hero">
  <div class="hero__bg" style="background-image: url('<?php echo get_template_directory_uri(); ?>/assets/images/hero-truck.jpg');"></div>
  <div class="hero__overlay"></div>
  <div class="hero__content container">
    <h1 class="hero__title">Quality Trucks &amp; Trailers.<br>New, Used &amp; Ready to Haul.</h1>
    <p class="hero__subtitle">Find exactly what your fleet needs.</p>
    <form class="hero__search" action="/inventory" method="GET">
      <select name="type" aria-label="Equipment Type">
        <option value="">&#9776; Equipment Type</option>
        <option value="truck">Trucks</option>
        <option value="trailer">Trailers</option>
        <option value="dump">Dump Trailers</option>
        <option value="dry-van">Dry Van Trailers</option>
        <option value="refrigerated">Refrigerated Trailers</option>
        <option value="flatbed">Flatbed Trailers</option>
        <option value="day-cab">Day Cab Trucks</option>
        <option value="sleeper">Sleeper Trucks</option>
      </select>
      <select name="category" aria-label="Select Category">
        <option value="">&#9776; Select Category</option>
        <option value="new">New</option>
        <option value="used">Used</option>
        <option value="lease">Lease/Rent</option>
      </select>
      <button type="submit" class="hero__search-btn">Search</button>
    </form>
  </div>
</section>

<!-- ============================================
     FINANCING BANNER
     ============================================ -->
<section class="financing-banner">
  <div class="container">
    <div class="financing-banner__inner">
      <div class="financing-banner__text">
        <h2>Fast &amp; Flexible Financing</h2>
        <p>Apply through our <strong>in-house financing</strong> division, and get approved quickly with no impact to your credit</p>
      </div>
      <a href="/financing" class="btn-red">Get Pre-Qualified</a>
    </div>
  </div>
</section>

<!-- ============================================
     AUTHORIZED DEALER
     ============================================ -->
<section class="authorized-dealer">
  <div class="container">
    <h2>Authorized Dealer Of:</h2>
    <div class="dealer-logos">
      <img src="<?php echo get_template_directory_uri(); ?>/assets/images/dealers/mac.png" alt="MAC Trailer">
      <img src="<?php echo get_template_directory_uri(); ?>/assets/images/dealers/vanguard.png" alt="Vanguard">
      <img src="<?php echo get_template_directory_uri(); ?>/assets/images/dealers/pitts.png" alt="Pitts Trailers">
      <img src="<?php echo get_template_directory_uri(); ?>/assets/images/dealers/dorsey.png" alt="Dorsey">
      <img src="<?php echo get_template_directory_uri(); ?>/assets/images/dealers/xl-specialized.png" alt="XL Specialized">
      <img src="<?php echo get_template_directory_uri(); ?>/assets/images/dealers/palfinger.png" alt="Palfinger">
    </div>
  </div>
</section>

<!-- ============================================
     TOP PICKS INVENTORY
     ============================================ -->
<section class="top-picks">
  <div class="container">
    <div class="section-header">
      <h2>Top Picks by Customers</h2>
      <div class="section-header__line"></div>
      <a href="/inventory" class="btn-outline">View Full Inventory</a>
    </div>

    <div class="inventory-grid">

      <a href="/inventory/2026-mac-tri-axle-end-dump" class="inventory-card">
        <img class="inventory-card__img" src="<?php echo get_template_directory_uri(); ?>/assets/images/inventory/mac-dump.jpg" alt="2026 MAC Tri-Axle End Dump w/Frame" loading="lazy">
        <div class="inventory-card__body">
          <div class="inventory-card__title">2026 MAC<br>Tri-Axle End Dump w/Frame</div>
          <div class="inventory-card__price">
            <span>$76,425</span>
            <span class="inventory-card__badge">New</span>
          </div>
          <div class="inventory-card__meta">
            Stock # TMAC24SP<br>
            Locations In FL
          </div>
        </div>
      </a>

      <a href="/inventory/2026-mac-pneumatic-dry-bulk" class="inventory-card">
        <img class="inventory-card__img" src="<?php echo get_template_directory_uri(); ?>/assets/images/inventory/mac-tanker.jpg" alt="2026 MAC 1050C Pneumatic Dry Bulk Tanker" loading="lazy">
        <div class="inventory-card__body">
          <div class="inventory-card__title">2026 MAC<br>1050C Pneumatic Dry Bulk Tanker</div>
          <div class="inventory-card__price">
            <span>$75,900</span>
            <span class="inventory-card__badge">New</span>
          </div>
          <div class="inventory-card__meta">
            Stock # TN1050APB<br>
            Locations In FL &amp; GA
          </div>
        </div>
      </a>

      <a href="/inventory/2020-utility-3000r-reefer" class="inventory-card">
        <img class="inventory-card__img" src="<?php echo get_template_directory_uri(); ?>/assets/images/inventory/utility-reefer.jpg" alt="2020 Utility 3000R Reefer" loading="lazy">
        <div class="inventory-card__body">
          <div class="inventory-card__title">2020 Utility<br>3000R Reefer w/ Carrier 7500×4</div>
          <div class="inventory-card__price">
            <span>$31,900</span>
            <span class="inventory-card__badge">Used</span>
          </div>
          <div class="inventory-card__meta">
            Stock # NH200297LAK<br>
            Locations In FL &amp; GA
          </div>
        </div>
      </a>

      <a href="/inventory/2020-kenworth-t680" class="inventory-card">
        <img class="inventory-card__img" src="<?php echo get_template_directory_uri(); ?>/assets/images/inventory/kenworth-t680.jpg" alt="2020 Kenworth T680" loading="lazy">
        <div class="inventory-card__body">
          <div class="inventory-card__title">2020 KENWORTH T680</div>
          <div class="inventory-card__price">
            <span>$34,990</span>
            <span class="inventory-card__badge">Used</span>
          </div>
          <div class="inventory-card__meta">
            Stock # TNHC36781MAC<br>
            Locations In FL &amp; GA
          </div>
        </div>
      </a>

    </div>
  </div>
</section>

<!-- ============================================
     THE NATIONWIDE HAUL DIFFERENCE
     ============================================ -->
<section class="nh-difference">
  <div class="container">
    <div class="nh-difference__header">
      <h2>The Nationwide Haul Difference</h2>
      <p class="nh-difference__sub">Buy. Finance. Insure. Service. One Company for Your Entire Fleet.</p>
      <p class="nh-difference__desc">Running a trucking business is complicated — working with us isn't. With Nationwide Haul, <strong>you don't need four vendors.</strong> You get one partner that handles <strong>everything your fleet needs from day one.</strong></p>
    </div>

    <div class="services-grid">

      <div class="service-card">
        <div class="service-card__bg" style="background-image:url('<?php echo get_template_directory_uri(); ?>/assets/images/services/municipality.jpg');"></div>
        <div class="service-card__overlay"></div>
        <div class="service-card__content">
          <h3>Municipality Bids</h3>
          <p>Reliable, scalable fleet solutions for public works and municipal departments.</p>
          <a href="/municipality-bids" class="service-card__link">Learn More</a>
        </div>
      </div>

      <div class="service-card">
        <div class="service-card__bg" style="background-image:url('<?php echo get_template_directory_uri(); ?>/assets/images/services/insurance.jpg');"></div>
        <div class="service-card__overlay"></div>
        <div class="service-card__content">
          <h3>Commercial Insurance</h3>
          <p>In-house trucking insurance agency with access to +120 markets to provide you the best quotes.</p>
          <a href="/insurance" class="service-card__link">Learn More</a>
        </div>
      </div>

      <div class="service-card">
        <div class="service-card__bg" style="background-image:url('<?php echo get_template_directory_uri(); ?>/assets/images/services/financing.jpg');"></div>
        <div class="service-card__overlay"></div>
        <div class="service-card__content">
          <h3>Financing</h3>
          <p>In-house finance division to get pre-approved today with no effect on your credit score.</p>
          <a href="/financing" class="service-card__link">Learn More</a>
        </div>
      </div>

      <div class="service-card">
        <div class="service-card__bg" style="background-image:url('<?php echo get_template_directory_uri(); ?>/assets/images/services/service-repair.jpg');"></div>
        <div class="service-card__overlay"></div>
        <div class="service-card__content">
          <h3>Service &amp; Repair</h3>
          <p>Trailer, truck, RV, and bus repair, our trained technicians will get you back on the road fast.</p>
          <a href="/service-repair" class="service-card__link">Learn More</a>
        </div>
      </div>

      <div class="service-card">
        <div class="service-card__bg" style="background-image:url('<?php echo get_template_directory_uri(); ?>/assets/images/services/lease.jpg');"></div>
        <div class="service-card__overlay"></div>
        <div class="service-card__content">
          <h3>Lease &amp; Rental</h3>
          <p>Flexible short and long term lease options tailored to your operation.</p>
          <a href="/lease-rent" class="service-card__link">Learn More</a>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- VIDEO CTA -->
<div class="video-cta">
  <a href="/about" class="btn-red-outline">Get To Know Nationwide Haul</a>
</div>

<!-- ============================================
     ABOUT VIDEO
     ============================================ -->
<section class="about-video">
  <div class="container">
    <div class="video-wrapper">
      <iframe
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0&modestbranding=1"
        title="Get to Know Nationwide Haul - Ociel Corado COO"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy">
      </iframe>
    </div>
  </div>
</section>

<!-- ============================================
     STATS
     ============================================ -->
<section class="stats">
  <div class="container">
    <div class="stats__grid">

      <div class="stat-item">
        <div class="stat-item__icon">🤝</div>
        <div class="stat-item__number stat-number-animate" data-target="14000" data-suffix="+">14,000+</div>
        <div class="stat-item__label">Customers We Have Served</div>
      </div>

      <div class="stat-item">
        <div class="stat-item__icon">⭐</div>
        <div class="stat-item__number stat-number-animate" data-target="97" data-suffix="%">97%</div>
        <div class="stat-item__label">Of Our Clients Recommend Us</div>
      </div>

      <div class="stat-item">
        <div class="stat-item__icon">🎓</div>
        <div class="stat-item__number stat-number-animate" data-target="15" data-suffix="+">15+</div>
        <div class="stat-item__label">Years In The Industry</div>
      </div>

    </div>
    <div style="text-align:center;">
      <a href="/inventory" class="btn-red">Start Shopping</a>
    </div>
  </div>
</section>

<!-- ============================================
     TESTIMONIALS
     ============================================ -->
<section class="testimonials">
  <div class="container">
    <div class="section-header">
      <h2>What Our Customers Say</h2>
      <div class="section-header__line"></div>
    </div>
    <p class="testimonials__intro">5 out of 5 customer review rating on Google. Fleets and new businesses served.</p>

    <div class="reviews-grid">

      <div class="review-card">
        <div class="review-card__top">
          <div class="review-card__avatar" style="background:#4285F4;">N</div>
          <div>
            <div class="review-card__name">Nick Harrison</div>
            <div class="review-card__date">2 weeks ago</div>
          </div>
        </div>
        <div class="review-card__stars">★★★★★</div>
        <p class="review-card__text">I was having a hard time finding a drop deck trailer for my business until I went to Nationwide Haul… I couldn't have asked for a better experience working with Jake and this company!</p>
      </div>

      <div class="review-card">
        <div class="review-card__top">
          <div class="review-card__avatar" style="background:#EA4335;">J</div>
          <div>
            <div class="review-card__name">Jesus Martinez</div>
            <div class="review-card__date">1 month ago</div>
          </div>
        </div>
        <div class="review-card__stars">★★★★★</div>
        <p class="review-card__text">Purchased 3 used Mac Trailers for my business from Nationwide Haul. Highly satisfied with the transaction…</p>
      </div>

      <div class="review-card review-card--featured">
        <div class="review-card__top">
          <div class="review-card__avatar" style="background:#34A853;">J</div>
          <div>
            <div class="review-card__name">Jose Villalta</div>
            <div class="review-card__date">3 weeks ago</div>
          </div>
        </div>
        <div class="review-card__stars">★★★★★</div>
        <p class="review-card__text">Big thank you to Vanessa Kirk. Thank you for the smooth transaction. Everything went well and I appreciate your quick response and professionalism.</p>
      </div>

      <div class="review-card">
        <div class="review-card__top">
          <div class="review-card__avatar" style="background:#FBBC05;">A</div>
          <div>
            <div class="review-card__name">Aurel Farcas</div>
            <div class="review-card__date">4 weeks ago</div>
          </div>
        </div>
        <div class="review-card__stars">★★★★★</div>
        <p class="review-card__text">I just bought a trailer from Nationwide Haul the service I did receive was one of the best I can ask for… highly recommend 10 ★</p>
      </div>

    </div>
  </div>
</section>

<!-- ============================================
     BROWSE BY CATEGORY
     ============================================ -->
<section class="browse-category">
  <div class="container">
    <div class="browse-category__inner">

      <div class="browse-category__left">
        <h2>Browse by Category</h2>
        <p class="browse-category__desc">Find exactly what your fleet needs. Browse our inventory by category and go straight to the equipment that fit your operation.</p>
        <a href="/inventory" class="btn-red">Start Shopping</a>
      </div>

      <div class="browse-category__right">
        <ul class="category-list">
          <li class="category-list__item">
            <a href="/inventory?type=dump-trailer">Dump Trailers</a>
            <span class="arrow">→</span>
          </li>
          <li class="category-list__item">
            <a href="/inventory?type=dry-van">Dry Van Trailers</a>
            <span class="arrow">→</span>
          </li>
          <li class="category-list__item">
            <a href="/inventory?type=refrigerated">Refrigerated Trailers</a>
            <span class="arrow">→</span>
          </li>
          <li class="category-list__item">
            <a href="/inventory?type=flatbed">Flatbed Trailers</a>
            <span class="arrow">→</span>
          </li>
          <li class="category-list__item">
            <a href="/inventory?type=day-cab">Day Cab Trucks</a>
            <span class="arrow">→</span>
          </li>
          <li class="category-list__item">
            <a href="/inventory?type=sleeper">Sleeper Trucks</a>
            <span class="arrow">→</span>
          </li>
          <li class="category-list__item" style="font-weight:700; color:var(--red);">
            <a href="/inventory" style="color:var(--red);">Explore all options</a>
            <span class="arrow" style="color:var(--red);">→</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</section>

<!-- ============================================
     YOUTUBE / VIDEOS SECTION
     ============================================ -->
<section class="youtube-section">
  <div class="container">

    <div class="youtube-section__channel">
      <div class="youtube-section__channel-left">
        <img class="yt-channel-logo" src="<?php echo get_template_directory_uri(); ?>/assets/images/nh-logo.png" alt="Nationwide Haul YouTube">
        <div class="yt-channel-info">
          <h3>Nationwide Haul</h3>
          <span>41 Videos &nbsp;·&nbsp; 25K Views</span>
        </div>
      </div>
      <a href="https://www.youtube.com/@nationwidehaul" target="_blank" rel="noopener" class="btn-yt-subscribe">Subscribe</a>
    </div>

    <div class="videos-grid">

      <div class="video-card">
        <img class="video-card__thumb" src="<?php echo get_template_directory_uri(); ?>/assets/images/videos/dump-body-trailer.jpg" alt="Custom Dump Body Trailer" loading="lazy">
        <div class="video-card__overlay"></div>
        <a href="https://www.youtube.com/watch?v=YOUR_VIDEO_1" target="_blank" rel="noopener" class="video-card__play" aria-label="Play video">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="white"><path d="M1 1l16 9L1 19V1z"/></svg>
        </a>
        <div class="video-card__info">
          <div class="video-card__title">CUSTOM DUMP BODY TRAILER</div>
          <div class="video-card__sub">Full Review &amp; Key Features</div>
        </div>
        <div class="video-card__duration">3:21</div>
      </div>

      <div class="video-card">
        <img class="video-card__thumb" src="<?php echo get_template_directory_uri(); ?>/assets/images/videos/pneumatic-tanks.jpg" alt="MAC Trailer Pneumatic Tanks" loading="lazy">
        <div class="video-card__overlay"></div>
        <a href="https://www.youtube.com/watch?v=YOUR_VIDEO_2" target="_blank" rel="noopener" class="video-card__play" aria-label="Play video">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="white"><path d="M1 1l16 9L1 19V1z"/></svg>
        </a>
        <div class="video-card__info">
          <div class="video-card__title">MAC TRAILER PNEUMATIC TANKS</div>
          <div class="video-card__sub">Full Review &amp; Key Features</div>
        </div>
        <div class="video-card__duration">7:27</div>
      </div>

    </div>

  </div>
</section>

<!-- ============================================
     CONTACT CTA
     ============================================ -->
<section class="contact-cta" id="contact">
  <div class="container">
    <div class="contact-cta__box">
      <h2>Need help or have questions?</h2>
      <p>Our team is here to help you find the right equipment.</p>
      <div class="contact-cta__btns">
        <a href="tel:8775597039" class="btn-red">
          Call Sales<br>
          <span style="font-size:12px;font-weight:400;">(877) 559 7039</span>
        </a>
        <a href="mailto:sales@nationwidehaul.com" class="btn-red">
          Email Us<br>
          <span style="font-size:12px;font-weight:400;">sales@nationwidehaul.com</span>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ============================================
     PHOTO GALLERY
     ============================================ -->
<div class="photo-gallery">
  <div class="photo-gallery__item">
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/gallery/gallery-1.jpg" alt="Nationwide Haul Team" loading="lazy">
  </div>
  <div class="photo-gallery__item">
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/gallery/gallery-2.jpg" alt="Nationwide Haul Trucks" loading="lazy">
  </div>
  <div class="photo-gallery__item">
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/gallery/gallery-3.jpg" alt="Nationwide Haul Delivery" loading="lazy">
  </div>
  <div class="photo-gallery__item">
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/gallery/gallery-4.jpg" alt="Nationwide Haul Fleet" loading="lazy">
  </div>
  <div class="photo-gallery__item">
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/gallery/gallery-5.jpg" alt="Nationwide Haul Inventory" loading="lazy">
  </div>
</div>

<?php get_footer(); ?>
