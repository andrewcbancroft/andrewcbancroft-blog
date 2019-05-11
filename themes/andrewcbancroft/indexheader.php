<?php
/**
 * The header template.
 * @package highwind
 * @since 1.0
 */
?>
<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?><?php highwind_html_before(); ?><!doctype html><!--[if lt IE 7 ]> <html <?php language_attributes(); ?> class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html <?php language_attributes(); ?> class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html <?php language_attributes(); ?> class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html <?php language_attributes(); ?> class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html <?php language_attributes(); ?> class="no-js"> <!--<![endif]-->
<head>

	<?php highwind_head_top(); ?>

	<meta charset="<?php bloginfo( 'charset' ); ?>" />

	<!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title><?php wp_title( '/', true, 'right' ); ?></title>

	<!--  Mobile viewport optimized: j.mp/bplateviewport -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

	<?php highwind_head_bottom(); ?>

	<?php wp_head(); ?>

	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
</head>

<body <?php body_class(); ?>>

<?php highwind_body_top(); ?>

<div class="outer-wrap" id="top">

	<div class="inner-wrap">

	<?php highwind_header_before(); ?>

	<header class="header header-index content-wrapper" role="banner" style="background-image:url(<?php echo header_image(); ?>);">

		<?php highwind_header(); ?>

	</header>

	<div class="about-me-blurb">
<div class="">		<p>Hi – I’m Andrew.</p>
		<p>I’m a born learner, passionate about discovery and about sharing new insights that come my way. Here, I write about technology and software development with a primary emphasis on <a href="http://www.andrewcbancroft.com/category/software-development/ios-mac/swift/" onclick="_gaq.push(['_trackEvent', 'outbound-article-int', 'http://www.andrewcbancroft.com/category/software-development/ios-mac/swift/', 'iOS development in Swift']);">iOS development in Swift</a>, and <a href="http://www.andrewcbancroft.com/category/software-development/net/cs/" onclick="_gaq.push(['_trackEvent', 'outbound-article-int', 'http://www.andrewcbancroft.com/category/software-development/net/cs/', '.Net development in C#']);">.Net development in C#</a>.</p>
	</div>
	</div>

	<div class="content-wrapper">

	<?php highwind_header_after(); ?>