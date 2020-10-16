<?php
/*
Plugin Name: WP Retina 3x
Plugin URI: https://meowapps.com
Description: Make your website look beautiful and crisp on modern displays by creating + displaying retina images.
Version: 5.6.1
Author: Jordy Meow
Author URI: https://meowapps.com
Text Domain: wp-retina-3x
Domain Path: /languages

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html

Originally developed for two of my websites:
- Jordy Meow (https://offbeatjapan.org)
- Haikyo (https://haikyo.org)
*/

if ( class_exists( 'Meow_WR3X_Core' ) ) {
  function mfrh_admin_notices() {
    echo '<div class="error"><p>Thanks for installing the Pro version of WP Retina 3x :) However, the free version is still enabled. Please disable or uninstall it.</p></div>';
  }
  add_action( 'admin_notices', 'mfrh_admin_notices' );
  return;
}

if ( !get_option( 'wr3x_form_2020' ) ) {
	function wr3x_form_2020_admin_notices() {
		echo '<div class="notice notice-error"><h2>The new WP Retina 3x is coming soon!</h2>';
    echo '<p>The web, the browsers, and WordPress all evolved a lot. Today, the technical situation about images has stabilized, so I would like to try my best and simplify this plugin, make it faster and better. <b>Could you reply to a few questions I have for you?</b> I made a survey with Google Forms: <a target="_blank" href="https://forms.gle/wv2tgaEYTKTcDZBA6">click here</a>. It is quite important to reply to it, as your answer will strongly impact the next version. Thanks a lot :)</p>';
		echo '<p>
			<form method="post" action="">
				<input type="hidden" name="wr3x_form_2020" value="true">
				<input type="submit" name="submit" id="submit" class="button" value="Got it. Hide this forever!">
			</form>
		</p>
		';
		echo '</div>';
	}
	if ( isset( $_POST['wr3x_form_2020'] ) ) {
		update_option( 'wr3x_form_2020', true, false );
	}
	else
		add_action( 'admin_notices', 'wr3x_form_2020_admin_notices' );
}

global $wr3x_picturefill, $wr3x_retinajs, $wr3x_lazysizes,
	$wr3x_retina_image, $wr3x_core;

$wr3x_version = '5.6.1';
$wr3x_retinajs = '2.0.0';
$wr3x_picturefill = '3.0.2';
$wr3x_lazysizes = '5.1.1';
$wr3x_retina_image = '1.7.2';

// Admin
require( 'wr3x_admin.php');
$wr3x_admin = new Meow_wr3x_Admin( 'wr3x', __FILE__, 'wp-retina-3x' );

// Core
require( 'core.php' );
$wr3x_core = new Meow_wr3x_Core( $wr3x_admin );
$wr3x_admin->core = $wr3x_core;

?>
