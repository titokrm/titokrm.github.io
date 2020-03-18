$(function() {
	/***************************************************/
	var team = 'our-team', // класс для проявляемых элементов по скроллу
		jmpBtn = 'btn_jump', // класс для "подпрыгивающих" кнопок
		animateSpeed = 300, // время анимации для увеличенного фото
		animatedOpacityTeam = 500, // время анимации для проявляемых элементов
		hambBtn = 'hamburger', // класс для кнопки гамбургера
		subMenuBtn = 'header-main__show-submenu', // класс для кнопки подменю
		menu = 'header-main__navigation-and-btns', // класс для выпадающего блока меню с кнопками
		subMenu = 'header-main__subnav', // класс подменю
		portfolio = 'portfolio', // класс для блока портфолио (увеличение фото)
		mobileWidth = 960, // мобильная ширина экрана
		faq = 'faq-list', // родительский класс для выпадающего списка FAQ
		countersClass = 'counters__num', // класс для счетчиков
		header = 'header-main', // главный блок хедера
		bodyLock = 'lock', // класс для отключения скролла у body
		overlayClass = 'overlay'; // класс для подложки-оверлея для меню
	/**************************************************/
	function mobileMenu() {
		var top = $('.'+header).offset().top,
			nowPos;
		$(window).scroll(function(event) {
			nowPos = $(this).scrollTop();
			//console.log('scroll! '+top+'   '+nowPos);
			if (nowPos>=top) {
				$('.'+header).addClass(header+'_fixed');
				$('main').css('padding-top', $('.'+header).height());
			} else {
				$('.'+header).removeClass(header+'_fixed');
				$('main').css('padding-top', '0');
			}
		});
		$('body').on('click','.'+hambBtn, function(e) {
			e.preventDefault();
			$(this).toggleClass(hambBtn+'_active');
			if ($('body').hasClass(bodyLock)) {
				$('.'+overlayClass).remove();
				$('body').removeClass(bodyLock);
			} else {
				$('body').append('<div class="'+overlayClass+'"></div>').addClass(bodyLock);				
			}
			$('.'+menu).toggleClass(menu+'_active').find('.'+subMenu+'_active')
			.removeClass(subMenu+'_active');
		})
		.on('click','.'+subMenuBtn, function(e) {
			e.preventDefault();
			$(this).toggleClass(subMenuBtn+'_active');
			$(this).parent('').next('.'+subMenu).slideToggle(subMenu+'_active');
		})
		.on('click', '.'+overlayClass, function(event) {
			event.preventDefault();
			$('.'+hambBtn).removeClass(hambBtn+'_active');
			$('body').removeClass(bodyLock);
			$('.'+menu).removeClass(menu+'_active').find('.'+subMenu+'_active')
			.removeClass(subMenu+'_active');
			$('.'+overlayClass).remove();
		});
	}

	function portfolioZoom() {
		var img = '__img',
			src;
		$('body').on('click', '.'+portfolio + ' .'+portfolio+img, function(e) {
			e.preventDefault();
			src = $(this).attr('src');
			//console.log(src);
			$('body').append('<div class="portfolio-big"><a href="#" class="portfolio-big__close"><i class="fas fa-times"></i></a><img class="portfolio-big__img" src="'+src+'" alt=""></div>')
			$('.portfolio-big').animate({opacity: 1}, animateSpeed);
		})
		.on('mousedown', '.'+portfolio + ' .'+portfolio+img, function(e) {
			e.preventDefault();
		})
		.on('click', '.portfolio-big', function(e) {
			e.preventDefault();
			$(this).animate({
				opacity: 0
				},
				animateSpeed, function() {
				$(this).remove();
			});
		});
	}

	function openFaq() {
		$('body').on('click', '.'+faq+'__faq', function(e) {
			e.preventDefault();
			//console.log('click  '+this);
			$(this).find('.'+faq+'__icon').toggleClass(faq+'__icon_active');
			$(this).next('.'+faq+'__answer').slideToggle(animateSpeed);
		});
	}

	function counters() {
		var	elementPos = 0;

		function startCount() {
			counterStart = false;
			$('.'+countersClass).each(function(index, el) {
				var duration = +$(el).attr('duration'),
					startNum = +$(el).attr('start'),
					finishNum = +$(el).attr('finish');
				$({value:startNum}).animate({value: finishNum}, {
					duration: duration,
					easing: "swing",
					step: function(val) {			
						$(el).text(Math.ceil(val));					
					}
				});
			});			
		}

		if ($('.'+countersClass).length>0) {
			elementPos = $('.'+countersClass).offset().top;
			counterStart = true;

			if (elementPos<$(window).height()) {
				startCount();
			}

			$(window).scroll(function() {
				var currentPos = $(this).scrollTop() + $(this).height();
								
				if (currentPos>elementPos && counterStart) {
					startCount();
				}
			});
		}

	}

	function eventScroll() {
		$(window).scroll(function() {
			var currentPos = $(this).scrollTop() + $(this).height();
				
			$('.'+team+'__item').each(function(index, el) {
				var elementPos = $(el).offset().top;

				if (currentPos>elementPos) {
					$(el).animate({opacity: 1}, animatedOpacityTeam);
				}
			});
			$('.'+jmpBtn).each(function(index, el) {
				var elementPos = $(el).offset().top;

				if (currentPos>elementPos) {
					$(el).removeClass(jmpBtn);
				}
			});
		});			
	}

	function sendform() {
		var form = 'fb-form';
		$('.'+form).submit(function(event) {
			var noError = true;
			event.preventDefault();
			$('.'+form+' '+'.'+form+'__error').remove();
			$('.'+form+' '+'.'+form+'__error-field').removeClass(form+'__error-field');
			$('.'+form+' input[requiredfield="true"], '+'.'+form+' textarea[requiredfield="true"]').each(function(index, el) {
				if ($(el).val().length == 0) {
					noError = false;
					$(el).addClass(form+'__error-field').parent().append('<div class="fb-form__error">Error! Field is required!</div>');
				}
			});
			if (noError) {
				//console.log('Send form!');
				/*************************************
				$.ajax({
					url: '',
					type: 'GET',
					dataType: 'html',
					data: {}
				});
				/**************************************/
			}
		});
	}
	/*-----------------------------------------------------------------------*/
	$('.slider-logo__owl').owlCarousel({
	    loop:true,
	    margin:0,
	    nav:true,
	    autoplay:true,
	    autoplayTimeout:3000,
	    dots: true,
	    autoplayHoverPause:true,
	    dotsEach: true,
	    responsive:{
	        0:{
	            items:1
	        },
	        769:{
	            items:2
	        },
	        961:{
	            items:5
	        }
	    }
	});

	$('.reviews__slider').owlCarousel({
	    loop:true,
	    margin:0,
	    nav:false,
	    dots: false,
	    items: 1,
	    autoplay:true,
	    autoplayTimeout:3000    
	})
	/*-----------------------------------------------------------------------*/
	function gotoMainHeader() {
		var home = false,
  			widthContenArea = window.innerWidth,
  			top = $('.'+header).offset().top;

  		if (widthContenArea<=mobileWidth && !home) {
  			$('html,body').animate({scrollTop: top}, animateSpeed);
  			home = true;
  		}
		$(window).resize(function(){
	  		widthContenArea = window.innerWidth;
	  		top = $('.'+header).offset().top;

	  		if (widthContenArea<=mobileWidth && !home) {
	  			$('html,body').animate({scrollTop: top}, animateSpeed);
	  			home = true;
	  		} else {
				$('.'+hambBtn).removeClass(hambBtn+'_active');
				$('body').removeClass(bodyLock);
				$('.'+menu).removeClass(menu+'_active').find('.'+subMenu+'_active')
				.removeClass(subMenu+'_active');
				$('.'+overlayClass).remove();
	  		}
		});	
	}
	

	mobileMenu();
	portfolioZoom();
	eventScroll();
	openFaq();
	counters();
	sendform();
	gotoMainHeader();
});