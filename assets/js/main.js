// setup our hash support
$(function () {
	
	// used to keep track of the current known internal location
	var loc;

	var TITLE = "Enyo API Reference";
	
	$(window).hashchange(function () {

		if ($('#navbarCollapse').hasClass('in')) {
			$('#navbarButton').click()
		}

		var isGuide = !!~location.pathname.indexOf('developer-guide');

		if(isGuide) return;

		var hash = location.hash,
			parts,
			query;
		
		// if there isn't a hash then we redirect to home
		if (!location.hash) return location.hash = '#/home';
		
		// remove the first characters
		hash = hash.replace(/^#\//, '');
		
		// try and pull out any query we have
		if (hash.indexOf(':') > -1) {
			parts = hash.split(':');
			hash = parts.shift();
			query = parts.shift();
		}

		if (hash != loc ) {
			loc = hash;
			
			// attempt to load the file directly since the paths should match 1:1 for html partials
			// generated by the template
			$('#content').load(hash + '.html', function (res, status) {
				if (status == 'error') {
					$('#content').html('Could not locate the requested file: ' + hash);
				} else {
					
					document.title = documentTitle(hash);
					if (!query) $('html, body').animate({scrollTop: 0}, 200);
					
					// this is an unfortunate hack to ensure that Prism can find the code areas
					// and then highlight them so we don't have to write our own custom Markdown
					// parser routine within JSDoc3 and because it doesn't give us the opportunity
					// to do any type of custom class additions
					$('#content pre.source > code').each(function (idx, el) {
						$(el).addClass('language-javascript');
						
						// we do this so we don't have to have it scan the whole DOM every time
						// and only needs to render the new sections
						Prism.highlightElement(el);
					});
				}
				if (query) setTimeout(function () { find(query) }, 300);
			});
		} else if (query) find(query);
	});
	

	function documentTitle (hash) {
		var parts = hash.split('/');

		if(parts.length == 1) {
			return hash.charAt(0).toUpperCase() + hash.slice(1) + ' | ' + TITLE;
		} else if(parts.length > 1) {
			var type = parts.shift(), res;

			if((type == 'kind') || (type == 'mixin')) {
				var suffix = parts.pop();
				res = parts.join('/') + '~' + suffix + ' ' + type.charAt(0).toUpperCase() + type.slice(1);
			} else {
				res = parts.join('/') + ' ' + type.charAt(0).toUpperCase() + type.slice(1);
			}
			return res + ' | ' + TITLE;
		} else {
			return TITLE;
		}
	}
});

// setup our link finding mechanism - try and find an anchor by this (unique) name much like a
// normal hashchange might
function find (anchor) {
	if (!anchor) return;
	
	var hash = location.hash;
	
	// if the anchor is passed in prefixed with a ':' then we actually need to make a hash-request
	// change for it so that it is detected in history
	if (anchor[0] == ':') {
		if ((' ' + hash + ' ').indexOf((' ' + anchor + ' ')) === -1) {
			location.hash = (location.hash.replace(/:(.*)$/, '') + anchor);
			return;
		} else anchor = anchor.slice(1);
	}
	
	var el = $('a[name="' + anchor + '"]'),
		pos;
	
	// if it found the element (should have length 1 or we'll assume we were looking for the
	// first matching element) we want to scroll to it
	if (el.length) {
		// because of the fixed header when scrolling we adjust
		pos = el.offset().top - 85;
		
		$('html, body').animate({
			scrollTop: pos
		}, 500);
	}
}

$(document).ready(function () {

	// ensure that we actually have a hash
	$(window).hashchange();
});

$(document).ready(function () {
	
	// register for the fixed nav feature
	var header = $('#header'),
		nav = $('#header .fixed-nav'),
		fixed, h, nh,
		refetchSizes = function () {
			h = header.height(),
			nh = nav.height();
		},
		navPosition = function () {
			var y = $(document).scrollTop();
			if (y >= h - nh) {	// Should we `fixed`?
				if (fixed === false) {
					nav.addClass('fixed');
					nav.parent().css('height', nh);
					fixed = true;
				}
			} else {	// Should we `unfixed`?
				if (fixed || fixed == null) {	// `== null` matches both null and undefined, and is 40% faster than alternatives. This catches for initialization.
					nav.removeClass('fixed');
					nav.parent().css('height', '');
					fixed = false;
				}
			}
		};

	refetchSizes();	// Run this initially to get our sizes
	$(window).resize(refetchSizes);	// Run it any time the sizes may change

	navPosition();	// Run this to initialize our state
	$(document).scroll(navPosition);	// Check and change position on scroll if necessary


	// also for the top link in the bar we deal with its click event here
	$('li.top a#top-link').click(function (e) {
		e.preventDefault();
		$('html, body').animate({
			scrollTop: 0
		}, 200);
	});
	
	var isGuide = !!~location.pathname.indexOf('developer-guide');

	if(isGuide) {
		$('li.show-hide-private').hide();
	} else {
		$('li.show-hide-private').click(function (e) {
			e.preventDefault();
			
			var a = $('a#show-hide-link'),
				text = a.text();
			
			switch (text) {
			case 'show private':
				a.text('hide private');
				$('body').removeClass('hide-private').addClass('show-private');
				break;
			case 'hide private':
				a.text('show private');
				$('body').removeClass('show-private').addClass('hide-private');
				break;
			}
		});
	}
});
