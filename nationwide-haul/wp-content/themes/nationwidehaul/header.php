<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<!-- TOP BAR -->
<div class="top-bar">
  <div class="container">
    <div class="top-bar__inner">
      <div class="top-bar__left">
        <span>Call Us Today (877) 559 7039 or</span>
        <a href="#contact" class="top-bar__chat">Chat with Us Now</a>
      </div>
      <div class="top-bar__social">
        <a href="https://www.facebook.com/nationwidehaul" target="_blank" rel="noopener" aria-label="Facebook">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        </a>
        <a href="https://www.linkedin.com/company/nationwidehaul" target="_blank" rel="noopener" aria-label="LinkedIn">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        <a href="https://www.instagram.com/nationwidehaul" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <a href="https://www.youtube.com/@nationwidehaul" target="_blank" rel="noopener" aria-label="YouTube">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
        </a>
      </div>
    </div>
  </div>
</div>

<!-- SITE HEADER -->
<header class="site-header">
  <div class="container">
    <div class="site-header__inner">
      <a href="<?php echo home_url('/'); ?>" class="site-logo">
        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/nh-logo.png" alt="Nationwide Haul Logo">
        <span class="site-logo__text">Nationwide<br>Haul</span>
      </a>

      <button class="nav-toggle" aria-label="Toggle Menu">
        <span></span><span></span><span></span>
      </button>

      <nav class="site-nav" role="navigation">
        <a href="/financing">Financing</a>
        <a href="/lease-rent">Lease/Rent</a>
        <a href="/service-repair">Service &amp; Repair</a>
        <a href="/client-perks">Client Perks</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/inventory" class="btn-inventory">View Inventory</a>
      </nav>
    </div>
  </div>
</header>
