;(function($) {

	'use strict';


})(jQuery);


;(function($) {
	'use strict';
	var	$page = $('#smoothstate'),
	$logger = true,
	$options = {
		loadingClass: 'is-loading',
		scroll: true,
		debug: false,
		prefetch: false,
		cacheLength: 0,
		onProgress: {
			// How long this animation takes
			duration: 500,
			// A function that dictates the animations that take place
			render: function ($container) {
				if ($logger) console.log('page is smoothstate loading');
				$('html').removeClass('is-loaded');
				$('html').addClass('is-loading');
			}
		},
		onStart: {
			duration: 750, // Duration of our animation
			render: function ($container) {
				$container.addClass('is-exiting');
				$('html').addClass('is-loaded');
				// Restart your animation
				smoothState.restartCSSAnimations();

			}
		},
		onReady: {
			duration: 0,
			render: function ($container, $newContent) {
				$container.removeClass('is-exiting');
				$('html').addClass('is-loaded');
				// Inject the new content
				$container.html($newContent);
			}
		}
	};
	//smoothState = $page.smoothState($options).data('smoothState');
	$('html').addClass('is-loaded');
})(jQuery);