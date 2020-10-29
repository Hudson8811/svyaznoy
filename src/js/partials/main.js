function checkAuth() {
	$.ajax({
		type: "POST",
		url: "/get_hashcode/",
		success: function(data) {
			if (JSON.parse(data).hashcode != '' && JSON.parse(data).hashcode != undefined) {
				hash = JSON.parse(data).hashcode;

				$('.contest__auth-flex').each(function () {
					var url = $(this).data('url');
					url += '&u='+encodeURIComponent(hash);
					$(this).attr('data-url', url);
				});

				$('.contest__auth').hide();
				$('.contest__gifts').show();
				$('.contest__textarea textarea').off('click');
			}
		}
	});
}

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

	$('.chronology').each(function () {
		$(this).attr('id', 'chronology' + $(this).attr('data-time'));
		$('.date__item').eq($(this).index() - 3).attr('href', '#' + $(this).attr('id'));
	});

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
				opacity = ['0.7', '0.5', '0.3', '0.15'];

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

////////////////////////////////////////

	// If not auth
	$('.contest__textarea textarea').click(function () {
		$.fancybox.open({
			src: '#sign-up',
			type: 'inline',
			touch: false,
			scrolling: 'no',
			btnTpl : {
				smallBtn : '<div data-fancybox-close class="popup__close"><svg width="81" height="79" viewBox="0 0 81 79" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45.2587 39.5008L59.7712 25.3795C60.4067 24.7597 60.7638 23.919 60.7638 23.0424C60.7638 22.1659 60.4067 21.3252 59.7712 20.7054C59.1357 20.0855 58.2737 19.7373 57.375 19.7373C56.4762 19.7373 55.6143 20.0855 54.9787 20.7054L40.5 34.8595L26.0212 20.7054C25.3857 20.0855 24.5237 19.7373 23.625 19.7373C22.7262 19.7373 21.8643 20.0855 21.2287 20.7054C20.5932 21.3252 20.2362 22.1659 20.2362 23.0424C20.2362 23.919 20.5932 24.7597 21.2287 25.3795L35.7412 39.5008L21.2287 53.622C20.9124 53.928 20.6613 54.2921 20.49 54.6932C20.3186 55.0943 20.2304 55.5246 20.2304 55.9591C20.2304 56.3936 20.3186 56.8239 20.49 57.225C20.6613 57.6261 20.9124 57.9902 21.2287 58.2962C21.5425 58.6047 21.9158 58.8496 22.327 59.0167C22.7383 59.1838 23.1794 59.2699 23.625 59.2699C24.0705 59.2699 24.5116 59.1838 24.9229 59.0167C25.3342 58.8496 25.7075 58.6047 26.0212 58.2962L40.5 44.142L54.9787 58.2962C55.2925 58.6047 55.6658 58.8496 56.077 59.0167C56.4883 59.1838 56.9294 59.2699 57.375 59.2699C57.8205 59.2699 58.2617 59.1838 58.6729 59.0167C59.0842 58.8496 59.4575 58.6047 59.7712 58.2962C60.0876 57.9902 60.3386 57.6261 60.51 57.225C60.6813 56.8239 60.7695 56.3936 60.7695 55.9591C60.7695 55.5246 60.6813 55.0943 60.51 54.6932C60.3386 54.2921 60.0876 53.928 59.7712 53.622L45.2587 39.5008Z" fill="#FEC72E"/></svg></div>'
			}
		});
	});

	// Sign-up submit form
	$('.sign-up__form').submit(function (e) {
		e.preventDefault();
		var form = $(this);

		$.ajax({
			type: form.attr('method'),
			url: '/save_user/',
			data: form.serialize(),
			success: function(data) {
				if (JSON.parse(data).hashcode != '' && JSON.parse(data).hashcode != undefined) {
					hash = JSON.parse(data).hashcode;

					$('.contest__auth-flex').each(function () {
						var url = $(this).data('url');
						url += '&u='+encodeURIComponent(hash);
						$(this).attr('data-url', url);
					});

					$('.contest__auth').hide();
					$('.contest__gifts').show();
					$('.contest__textarea textarea').off('click');
					$.fancybox.close();
				}
			},
			error: function () {
				console.log('Ошибка авторизации');
			}
		});
	});

	// After send story submit form
	$('.contest__form').submit(function (e) {
		e.preventDefault();
		var form = $(this);
		if($('.contest__textarea textarea').val()){

			$.ajax({
				type: form.attr('method'),
				url:  '/save_story/',
				data: form.serialize(),
				success: function (data) {
					if (data.length > 0) {
						$.fancybox.open({
							src: '#thanks',
							type: 'inline',
							touch: false,
							scrolling: 'no',
							btnTpl : {
								smallBtn : '<div data-fancybox-close class="popup__close"><svg width="81" height="79" viewBox="0 0 81 79" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45.2587 39.5008L59.7712 25.3795C60.4067 24.7597 60.7638 23.919 60.7638 23.0424C60.7638 22.1659 60.4067 21.3252 59.7712 20.7054C59.1357 20.0855 58.2737 19.7373 57.375 19.7373C56.4762 19.7373 55.6143 20.0855 54.9787 20.7054L40.5 34.8595L26.0212 20.7054C25.3857 20.0855 24.5237 19.7373 23.625 19.7373C22.7262 19.7373 21.8643 20.0855 21.2287 20.7054C20.5932 21.3252 20.2362 22.1659 20.2362 23.0424C20.2362 23.919 20.5932 24.7597 21.2287 25.3795L35.7412 39.5008L21.2287 53.622C20.9124 53.928 20.6613 54.2921 20.49 54.6932C20.3186 55.0943 20.2304 55.5246 20.2304 55.9591C20.2304 56.3936 20.3186 56.8239 20.49 57.225C20.6613 57.6261 20.9124 57.9902 21.2287 58.2962C21.5425 58.6047 21.9158 58.8496 22.327 59.0167C22.7383 59.1838 23.1794 59.2699 23.625 59.2699C24.0705 59.2699 24.5116 59.1838 24.9229 59.0167C25.3342 58.8496 25.7075 58.6047 26.0212 58.2962L40.5 44.142L54.9787 58.2962C55.2925 58.6047 55.6658 58.8496 56.077 59.0167C56.4883 59.1838 56.9294 59.2699 57.375 59.2699C57.8205 59.2699 58.2617 59.1838 58.6729 59.0167C59.0842 58.8496 59.4575 58.6047 59.7712 58.2962C60.0876 57.9902 60.3386 57.6261 60.51 57.225C60.6813 56.8239 60.7695 56.3936 60.7695 55.9591C60.7695 55.5246 60.6813 55.0943 60.51 54.6932C60.3386 54.2921 60.0876 53.928 59.7712 53.622L45.2587 39.5008Z" fill="#FEC72E"/></svg></div>'
							}
						});
					}
				}
			});
		}
	});

	// Auth
	window.auth = function (data) {
		$.ajax({
			type: "POST",
			url: "/authorize/",
			data: data,
			success: function(data) {
				if (data.length > 0) {
					checkAuth();
				}
			},
			error: function () {
				alert('Ошибка авторизации для продолжения');
			}
		});
	};


	checkAuth();

	// Share
	var socialTypes =  {
		"fb": "http://www.facebook.com/share.php?u=",
		"vk": "http://vkontakte.ru/share.php?url=",
		"tw": "https://twitter.com/intent/tweet?url=",
		"ok": "http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl=",
	};

	function getMeta(name) {
		var meta = $('meta[property="og:'+name+'"]');
		return meta.length ? meta.attr('content') : '';
	}

	$('.first-screen__socials-item').click(function() {
			var socialType;
			for (var name in socialTypes)
				if ($(this).hasClass(name)) { socialType = name; break; }
			if (socialType == undefined) return;

			var url = getMeta('url');
			var title = getMeta('title');
			var description = getMeta('description');
			var image = getMeta('image');

			var parent = $(this).closest('.social');
			var new_url = parent.attr('data-url');
			if (new_url) {
				url = new_url;
				image = '';
			}
			if (url == '') url = window.location.toString();

			var p_desc = parent.attr('data-description');
			if (p_desc) description = p_desc;
			var p_title = parent.attr('data-title');
			if (p_title) title = p_title;
			var p_image = parent.attr('data-image');
			if (p_image) image = p_image;

			var $slink = encodeURIComponent(url);
			switch (socialType) {
				case 'tw':
					$slink += '&text='+encodeURIComponent(title); break;
				case 'vk':
					if (image != '') $slink += '&image='+encodeURIComponent(image);
					if (title != '') $slink += '&title='+encodeURIComponent(title);
					if (description != '') $slink += '&description='+encodeURIComponent(description); break;
				case 'ok':
					if (image != '') $slink += '&st.imageUrl='+encodeURIComponent(image);
					if (description != '') $slink += '&st.comments='+encodeURIComponent(description); break;
				case 'fb':
					if (image != '') $slink += '&p[images][0]='+encodeURIComponent(image);
					if (title != '') $slink += '&p[title]='+encodeURIComponent(title);
					if (description != '') $slink += '&p[summary]='+encodeURIComponent(description); break;
			}

			if ($(this).data('mode') == 'nohash'){
				window.open(socialTypes[socialType]+$slink,socialType,'width=500,height=500,resizable=yes,scrollbars=yes,status=yes');
			} else {
				if (hash === '') checkAuth();
				window.open(socialTypes[socialType]+$slink,socialType,'width=500,height=500,resizable=yes,scrollbars=yes,status=yes');
				afterShare(socialType);
			}
		}
	);

	function afterShare(social) {
		$.ajax({
			type: "POST",
			url: "/new_share/",
			data: { social_share : social },
			success: function(data) {
				console.log('share ok');
			}
		});
	}
});


