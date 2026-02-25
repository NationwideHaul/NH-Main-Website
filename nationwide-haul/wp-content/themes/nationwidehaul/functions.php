<?php
function nationwidehaul_enqueue_scripts() {
    wp_enqueue_style('nh-google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', [], null);
    wp_enqueue_style('nh-main', get_template_directory_uri() . '/assets/css/main.css', [], '1.0');
    wp_enqueue_script('nh-main', get_template_directory_uri() . '/assets/js/main.js', [], '1.0', true);
}
add_action('wp_enqueue_scripts', 'nationwidehaul_enqueue_scripts');

function nationwidehaul_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'gallery', 'caption']);
    register_nav_menus(['primary' => __('Primary Menu', 'nationwidehaul')]);
}
add_action('after_setup_theme', 'nationwidehaul_setup');
