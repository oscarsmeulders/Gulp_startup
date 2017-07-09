function copyCardColorToClipboard(elementId) {
	// Create a "hidden" input
	var aux = document.createElement("input");
	// Assign it the value of the specified element
	aux.setAttribute("value", document.getElementById(elementId).getElementsByClassName("card--color--hex")[0].innerHTML);
	// Append it to the body
	document.body.appendChild(aux);
	// Highlight its content
	aux.select();
	// Copy the highlighted text
	document.execCommand("copy");
	// Remove it from the body
	document.body.removeChild(aux);
}


;(function($) {

	'use strict';

	////////////////////////////////////////////////////////////////////////////////////////////////
	$('body').scrollspy({
		target: '.navigation',
		offset: 80
	})

	// handle links with @href started with '#' only
	$(document).on('click', 'a[href^="#"]', function(e) {
		// target element id
		var id = $(this).attr('href');

		// target element
		var $id = $(id);
		if ($id.length === 0) {
			return;
		}

		// prevent standard hash navigation (avoid blinking in IE)
		e.preventDefault();

		// top position relative to the document
		var pos = $id.offset().top;

		// animated top scrolling
		$('body, html').animate({scrollTop: pos}, 1000);
	});

	////////////////////////////////////////////////////////////////////////////////////////////////
	function resizeCheckSticky() {
		if 	(	$html.hasClass('small') ||
				$html.hasClass('medium') ||
				$html.hasClass('large') ||
				$html.hasClass('xlarge')
			) {
			$(".container >.title").trigger('sticky_kit:detach');
			$(".container >.content").trigger('sticky_kit:detach');
		} else {
			$(".container >.title").stick_in_parent();
			$(".container >.content").stick_in_parent({
				offset_top: 40
			});
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////
	$('.hamburger').on('click', function(e){
		$(this).toggleClass('is-active');
	});

	////////////////////////////////////////////////////////////////////////////////////////////////
	function hexToRgb(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	//alert( hexToRgb("#0033ff").g ); // "51";
	//alert( hexToRgb("#03f").g ); // "51";
	//$('.card--color .card--color--hex').html( hexToRgb("#0033ff").g );
	$( '.card--color' ).each(function() {
		var tmpHex = $(this).data('hex');
		var tmpHex2 = $(this).data('hex-second');

		// if color is a combination change the color to a gradient else make the filling
		if (typeof tmpHex2 !== typeof undefined && tmpHex2 !== false) {
			$( this ).find( '.card--color--example' ).css("background-image", "linear-gradient(-33.33333deg, " + tmpHex2 + " 50%, " + tmpHex + " 50%)");
			$( this ).find( '.card--color--hex.hex--01' ).html( tmpHex );
			$( this ).find( '.card--color--hex.hex--02' ).html( tmpHex2 );
		} else {
			$( this ).find( '.card--color--example' ).css("background-color", tmpHex);
			$( this ).find( '.card--color--hex' ).html( tmpHex );
			$( this ).find( '.card--color--rgb--r' ).find( 'span:last-child' ).html( hexToRgb(tmpHex).r );
			$( this ).find( '.card--color--rgb--g' ).find( 'span:last-child' ).html( hexToRgb(tmpHex).g );
			$( this ).find( '.card--color--rgb--b' ).find( 'span:last-child' ).html( hexToRgb(tmpHex).b );
		}

		$( this ).find( '.card--color--example' ).colourBrightness();
	});



////////////////////////////////////////////////////////////////////////////////////////////////
	var $window = $(window),
		$html = $('html')
/*
	$breakpoints: (
	'small': 320px,
	'medium': 768px,
	'large': 920px,
	'xlarge': 1180px,
	'xxlarge': 1580px,
	'xxxlarge': 1900px
	);
*/

	function resize() {
		$html.removeClass('small medium large xlarge xxlarge xxxlarge');
		if ($window.width() < 320) {
			$html.addClass('small');

		} else if ($window.width() < 768) {
			$html.addClass('medium');

		} else if ($window.width() < 920) {
			$html.addClass('large');

		} else if ($window.width() < 1180) {
			$html.addClass('xlarge');

		} else if ($window.width() < 1580) {
			$html.addClass('xxlarge');

		} else {
			$html.addClass('xxxlarge');
		}
		resizeCheckSticky();
	}

	$window.resize(resize).trigger('resize')
	////////////////////////


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