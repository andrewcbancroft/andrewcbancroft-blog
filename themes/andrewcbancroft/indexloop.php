<?php
/**
 * The loop template.
 * @package highwind
 * @since 1.0
 */
?>

<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>

<?php

$swiftPostsQueryArgs = array(
	'posts_per_page'   => 5,
	'category_name'         => 'swift,ios-mac'
);
$swiftPostsQuery = new WP_Query( $swiftPostsQueryArgs );

?>

<div id="post-wrap" class="post-wrap">

	<h1>Latest in iOS & Swift</h1>
<?php

if ( $swiftPostsQuery->have_posts() ) {
	while ( $swiftPostsQuery->have_posts()) {
		$swiftPostsQuery->the_post();
		?>
		<article id="post-<?php the_ID(); ?>" class="index-post">
			<?php get_template_part( 'indexcontent', get_post_format() ); ?>
		</article><!-- #post-<?php the_ID(); ?> -->
	<?php
	}
} else {
	// no posts found
}
wp_reset_postdata();
?>

	<?php



	$dotNetPostsQueryArgs = array(
		'posts_per_page'   => 5,
		'category_name'         => 'net'
	);
	$dotNetPostsQuery = new WP_Query( $dotNetPostsQueryArgs );
	?>

	<h1>Latest in .Net</h1>
	<?php

	if ( $dotNetPostsQuery->have_posts() ) {
		while ( $dotNetPostsQuery->have_posts() ) {
			$dotNetPostsQuery->the_post();
			?>
			<article id="post-<?php the_ID(); ?>" class="index-post">
				<?php get_template_part( 'indexcontent', get_post_format() ); ?>
			</article><!-- #post-<?php the_ID(); ?> -->
		<?php

		}
	} else {
		// no posts found
	}
	wp_reset_postdata();
	?>
</div><!--/.post-wrap-->
