$(function() {	
	var sliderClass = 'slider-opacity',
		speedAnimation = 300,
		interval = 3000,
        percentToSwipe = 0.25,//менять слайд при 25 % свайпе
        //--------------------------------------------------
        slider = $('.'+sliderClass),
		slideNow = 1,
		slideCount = slider.find('.'+sliderClass+'__sliderwprapper').children().length,
		work = false,
		intervalID,
		mouseBtnDown = false,
    	touchsurfaceJQ = slider.find('.'+sliderClass+'__sliderwprapper'),
        startX,
        dist,
        widthSlide = slider.width();


/**************************для тачскринов****************************************/
  

    touchsurfaceJQ.on('touchstart mousedown', function(e){
        e.preventDefault(); // отключаем стандартную реакцию скроллинга
        dist = 0;	
        startTime = new Date().getTime(); // время контакта с поверхностью сенсора		        
        if (e.type == "touchstart") {
            var touchobj = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            startX = touchobj.clientX;
	    }
        else {
        //если нажата кнопка мышки:
            startX = e.offsetX;
            mouseBtnDown = true;
        }
    });
  
    touchsurfaceJQ.on('touchmove mousemove', function(e){
        e.preventDefault(); // отключаем стандартную реакцию скроллинга
        if (e.type == "touchmove") {
            var touchobj = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
	        dist = touchobj.clientX - startX; // получаем пройденную дистанцию
	        slider.find('.'+sliderClass+'__slide_active').css('opacity', 1 - Math.abs(dist / widthSlide) * 1.5);
	    }
        else {
        //если перемещается мышь и нажата кнопка:
        	if (mouseBtnDown) {
    	        dist = e.offsetX - startX; // получаем пройденную дистанцию
		        slider.find('.'+sliderClass+'__slide_active').css('opacity', 1 - Math.abs(dist / widthSlide) * 1.5);
        	}
	    }
    });

    touchsurfaceJQ.on('touchend mouseup', function(e){
        e.preventDefault(); // отключаем стандартную реакцию скроллинга
        elapsedTime = new Date().getTime() - startTime; // узнаем пройденное время
        if ( Math.abs(dist) >= widthSlide * percentToSwipe) {
			if (dist<0) {
				nextSlide();
			} else {
				prevSlide();
			}
        } else {
        	// чтобы ускорить анимацию считаем грубо говоря что не дотянули до свайпа один пиксел )))
        	slider.find('.'+sliderClass+'__slide_active').animate({opacity : 1}, speedAnimation * percentToSwipe);
        }
        if (e.type == "mouseup") {
        	mouseBtnDown = false;
        }
    });	
/******************************************************************/
	
	function nextSlide() {
		if (work != true) {
			if (slideNow >= slideCount || slideNow <=0) {
				work = true;
				slider.find('.'+sliderClass+'__slide').first().addClass(sliderClass+'__slide_next').css('opacity', '1');
				slider.find('.'+sliderClass+'__slide_active').animate({
					opacity: 0},
					speedAnimation, function() {
					$(this).removeClass(sliderClass+'__slide_active');
					slider.find('.'+sliderClass+'__slide').first().removeClass(sliderClass+'__slide_next').addClass(sliderClass+'__slide_active');
					work = false;
				});			
				slideNow = 1;
			} else {
				work = true;
				slider.find('.'+sliderClass+'__slide_active').next().addClass(sliderClass+'__slide_next').css('opacity', '1');
				slider.find('.'+sliderClass+'__slide_active').animate({
					opacity: 0
					},
					speedAnimation, function() {
					$(this).removeClass(sliderClass+'__slide_active').next().removeClass(sliderClass+'__slide_next').addClass(sliderClass+'__slide_active').css('opacity', '1');
					work = false;
				});
				slideNow++;
			}
			slider.find('.'+sliderClass+'__slide-nav_active').removeClass(sliderClass+'__slide-nav_active');
			slider.find('.'+sliderClass+'__slide-nav').eq(slideNow - 1).addClass(sliderClass+'__slide-nav_active');
		}
	}

	function prevSlide() {
		if (work != true) {
			if (slideNow <= 1) {
				work = true;
				slider.find('.'+sliderClass+'__slide').last().addClass(sliderClass+'__slide_next').css('opacity', '1');
				slider.find('.'+sliderClass+'__slide_active').animate({
					opacity: 0},
					speedAnimation, function() {
					$(this).removeClass(sliderClass+'__slide_active');
					slider.find('.'+sliderClass+'__slide').last().removeClass(sliderClass+'__slide_next').addClass(sliderClass+'__slide_active');
					work = false;
				});			
				slideNow = slideCount;
			} else {
				work = true;
				slider.find('.'+sliderClass+'__slide_active').prev().addClass(sliderClass+'__slide_next').css('opacity', '1');
				slider.find('.'+sliderClass+'__slide_active').animate({
					opacity: 0
					},
					speedAnimation, function() {
					$(this).removeClass(sliderClass+'__slide_active').prev().removeClass(sliderClass+'__slide_next').addClass(sliderClass+'__slide_active').css('opacity', '1');
					work = false;
				});
				slideNow--;
			}
			slider.find('.'+sliderClass+'__slide-nav_active').removeClass(sliderClass+'__slide-nav_active');
			slider.find('.'+sliderClass+'__slide-nav').eq(slideNow - 1).addClass(sliderClass+'__slide-nav_active');
		}
	}

	function addControls() {
		slider.find('.'+sliderClass+'__viewport').append('<div class="'+sliderClass+'__btn-prev"></div> <div class="'+sliderClass+'__btn-next"></div> <div class="'+sliderClass+'__btns"></div>');
		for (var i = 0; i < slideCount; i++) {
			if (i == 0) {
				slider.find('.'+sliderClass+'__btns').append('<div class="'+sliderClass+'__slide-nav '+sliderClass+'__slide-nav_active"></div>');	
			} else {
				slider.find('.'+sliderClass+'__btns').append('<div class="'+sliderClass+'__slide-nav"></div>');
			}			
		}
	}

	$(window).resize(function(e) {
		widthSlide = slider.width();
	});
	
	slider.on('click', '.'+sliderClass+'__slide-nav' , function(e) {
		navBtn = $(this).index();
		slider.find('.'+sliderClass+'__slide-nav_active').removeClass(sliderClass+'__slide-nav_active');
		$(this).toggleClass(sliderClass+'__slide-nav_active');
		if (navBtn + 1 != slideNow) {
			slider.find('.'+sliderClass+'__slide_next').removeClass(sliderClass+'__slide_next');
			slider.find('.'+sliderClass+'__slide').eq(navBtn).addClass(sliderClass+'__slide_next').css('opacity', '1');
			slider.find('.'+sliderClass+'__slide-nav_active').animate({
				opacity: 0
				},
				speedAnimation, function() {
				$(this).removeClass(sliderClass+'__slide-nav_active');
				slider.find('.'+sliderClass+'__slide_next').removeClass(sliderClass+'__slide_next').addClass(sliderClass+'__slide_active');
				work = false;
			});
			slideNow = navBtn + 1;
		}
	});

	slider.on('click', '.'+sliderClass+'__btn-next', function(e) {
		nextSlide();
	});
	slider.on('click', '.'+sliderClass+'__btn-prev', function(e) {
		prevSlide();
	});

	$(document).keydown(function(eventObject) {		// для управления с клавы
		if (eventObject.which == 37) {
			prevSlide();
		}
		if (eventObject.which == 39) {
			nextSlide();
		}
	});

	// для автоперелистывания
	slider.on('mouseover touchstart', '.'+sliderClass+'__viewport', function(e) {
		clearInterval(intervalID);
//		console.log('hover');
	});

	slider.on('mouseout touchend', '.'+sliderClass+'__viewport', function(e) {
		intervalID = setInterval(nextSlide, interval);
	});

	addControls();
	intervalID = setInterval(nextSlide, interval);

});	