$(document).ready(function () {
	anchorScroll($('.anchor'));

	function anchorScroll(e) {
		e.click(function () {
			link = $(this).attr('href');
			to = $(link).offset().top;
			$('body, html').animate({
				scrollTop: to
			}, 800);
		});
	}

	var block = $('.dark'),
			top = [],
			bottom = [],
			offset = 100;

	block.each(function () {
		top.push($(this).offset().top - offset);
		bottom.push($(this).offset().top + $(this).outerHeight() - offset);
	});


	$(window).scroll(function () {
		var scroll = $(this).scrollTop(),
				isDark = false,
				opacity = ['70%', '50%', '30%', '15%'];

		if (scroll > 0) {
			$('.first-screen__anchor').fadeOut(300);
		} else {
			$('.first-screen__anchor').fadeIn(300);
		}

		$.each(top, function (i, val) {
			if (scroll >= val && scroll <= bottom[i]) {
				isDark = true;
			}
		});

		if (isDark) {
			$('.date').addClass('date--dark');
		} else {
			$('.date').removeClass('date--dark');
		}

		$('.chronology').each(function () {
			var curItem = $('#menu-' + $(this).attr('data-time')),
					menuItem = $('.date__item');

			if (scroll >= $(this).offset().top - offset &&
					scroll <= $(this).offset().top + $(this).outerHeight() - offset) {
				menuItem.removeClass('date__item--active');
				curItem.addClass('date__item--active').css('opacity', '1');

				for (var i = 1; i <= opacity.length; i++) {
					if (curItem.index() - i >= 0)
						menuItem.eq(curItem.index() - i).css('opacity', opacity[i - 1]);
					menuItem.eq(curItem.index() + i).css('opacity', opacity[i - 1]);
				}
			}
		});
	});
});


