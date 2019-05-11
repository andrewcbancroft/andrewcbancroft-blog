<?php
/**
 * The template for displaying posts.
 * @package highwind
 * @since 1.0
 */
?>

<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>

<header class="post-header">

	<h1 class="post-title-index" data-text="<?php the_title_attribute(); ?>"><a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s', 'highwind' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><?php the_title(); ?></a></h1>
	<?php highwind_content_entry_top_index(); ?>
</header><!-- /.post-header -->
