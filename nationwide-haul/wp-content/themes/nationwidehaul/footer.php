<!-- FOOTER -->
<footer class="site-footer">
  <div class="container">
    <div class="footer__grid">

      <!-- Brand Col -->
      <div class="footer__col">
        <div class="footer__brand-logo">
          <img src="<?php echo get_template_directory_uri(); ?>/assets/images/nh-logo.png" alt="Nationwide Haul">
          <span>Nationwide<br>Haul</span>
        </div>
        <p class="footer__tagline">Let's Stay Connected!</p>
        <form class="footer__newsletter" onsubmit="return false;">
          <input type="email" placeholder="Email">
          <button type="submit">Go</button>
        </form>
      </div>

      <!-- Explore Col -->
      <div class="footer__col">
        <h4>Explore</h4>
        <ul class="footer__links">
          <li><a href="/financing">Financing</a></li>
          <li><a href="/lease-rent">Lease &amp; Rental</a></li>
          <li><a href="/municipality-bids">Municipality Bids</a></li>
          <li><a href="/lease-rent">Leasing &amp; Rental</a></li>
          <li><a href="/service-repair">Service Shop</a></li>
        </ul>
      </div>

      <!-- About Col -->
      <div class="footer__col">
        <h4>About</h4>
        <ul class="footer__links">
          <li><a href="/faq">FAQ's</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/careers">Careers</a></li>
          <li><a href="/service-repair">Service Shop</a></li>
        </ul>
      </div>

      <!-- Contact Col -->
      <div class="footer__col">
        <div class="footer__phone">(954) 245-0622</div>
        <div class="footer__email">sales@nationwidehaul.com</div>
        <div class="footer__flag">
          <span>🇺🇸</span> United States
        </div>
        <div class="footer__social">
          <a href="https://www.facebook.com/nationwidehaul" aria-label="Facebook" target="_blank" rel="noopener">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="https://www.linkedin.com/company/nationwidehaul" aria-label="LinkedIn" target="_blank" rel="noopener">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="https://www.instagram.com/nationwidehaul" aria-label="Instagram" target="_blank" rel="noopener">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://www.youtube.com/@nationwidehaul" aria-label="YouTube" target="_blank" rel="noopener">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
          </a>
        </div>
      </div>

    </div>
  </div>

  <div class="footer__bottom">
    <div class="container" style="display:flex;justify-content:space-between;align-items:center;width:100%;flex-wrap:wrap;gap:10px;">
      <span>Copyright &copy;<?php echo date('Y'); ?> Nationwide Haul All Rights Reserved</span>
      <div class="footer__bottom-links">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
