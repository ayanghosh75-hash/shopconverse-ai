<?php
/**
 * Plugin Name: ShopConverse AI - Conversational Shopping Assistant
 * Plugin URI: https://www.buymeacoffee.com/AyanKumarGhosh
 * Description: Boost eCommerce sales with an interactive 24/7 AI shopping assistant that recommends products and answers questions inside WooCommerce.
 * Version: 1.0.0
 * Author: Ayan Kumar Ghosh
 * Author URI: https://www.buymeacoffee.com/AyanKumarGhosh
 * License: GPLv2 or later
 * Text Domain: shopconverse-ai
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class ShopConverseAI {
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('wp_footer', array($this, 'inject_catalog_data'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function enqueue_assets() {
        wp_enqueue_style(
            'shopconverse-widget-css',
            plugins_url('assets/widget.css', __FILE__),
            array(),
            '1.0.0'
        );

        wp_enqueue_script(
            'shopconverse-widget-js',
            plugins_url('assets/widget.js', __FILE__),
            array(),
            '1.0.0',
            true
        );
    }

    public function inject_catalog_data() {
        $products = array();

        // If WooCommerce is active, pull real store products
        if (function_exists('wc_get_products')) {
            $wc_products = wc_get_products(array('limit' => 25, 'status' => 'publish'));
            foreach ($wc_products as $prod) {
                $image_id = $prod->get_image_id();
                $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium') : '';

                $products[] = array(
                    'id'          => $prod->get_id(),
                    'title'       => $prod->get_name(),
                    'category'    => wp_strip_all_tags(wc_get_product_category_list($prod->get_id())),
                    'price'       => floatval($prod->get_price()),
                    'tags'        => array_map('strtolower', explode(' ', $prod->get_name())),
                    'image'       => $image_url,
                    'description' => wp_trim_words($prod->get_short_description() ?: $prod->get_description(), 18)
                );
            }
        }

        $store_name = get_option('shopconverse_store_name', get_bloginfo('name'));
        $currency   = function_exists('get_woocommerce_currency_symbol') ? get_woocommerce_currency_symbol() : '$';

        ?>
        <script type="text/javascript">
            window.ShopConverseProducts = <?php echo json_encode($products); ?>;
            window.ShopConverseConfig = {
                storeName: <?php echo json_encode($store_name); ?>,
                currency: <?php echo json_encode($currency); ?>
            };
        </script>
        <?php
    }

    public function add_admin_menu() {
        add_options_page(
            'ShopConverse AI Settings',
            'ShopConverse AI',
            'manage_options',
            'shopconverse-ai',
            array($this, 'render_admin_page')
        );
    }

    public function register_settings() {
        register_setting('shopconverse_settings_group', 'shopconverse_store_name');
        register_setting('shopconverse_settings_group', 'shopconverse_license_key');
    }

    public function render_admin_page() {
        ?>
        <div class="wrap">
            <h1>ShopConverse AI — Settings</h1>
            <p>Your interactive 24/7 AI shopping assistant is currently active on your storefront.</p>
            <form method="post" action="options.php">
                <?php settings_fields('shopconverse_settings_group'); ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Store Display Name</th>
                        <td><input type="text" name="shopconverse_store_name" value="<?php echo esc_attr(get_option('shopconverse_store_name', get_bloginfo('name'))); ?>" class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Pro License Key</th>
                        <td>
                            <input type="text" name="shopconverse_license_key" value="<?php echo esc_attr(get_option('shopconverse_license_key')); ?>" class="regular-text" placeholder="SC-PRO-XXXX" />
                            <p class="description">Enter your Pro key to remove branding and unlock unlimited shopper conversations.</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button('Save Settings'); ?>
            </form>
        </div>
        <?php
    }
}

new ShopConverseAI();
