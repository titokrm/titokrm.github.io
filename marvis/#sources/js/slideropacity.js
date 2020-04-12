var   sliderClass = 'slider-opacity',
      speedAnimation = 500,
      interval = 3000,
      percentToSwipe = 0.25,//менять слайд при 25 % свайпе
      //--------------------------------------------------
      resetLater = false,
      listSlider = new Array ();

function sliderOpacity(sliderId) {  
  var slider = $(sliderId),
      slideNow = 1,
      slideCount = slider.find('.'+sliderClass+'__sliderwprapper').children().length,
      pause = false,
      work = false,
      intervalID,
      mouseBtnDown = false,
      touchsurfaceJQ = slider.find('.'+sliderClass+'__sliderwprapper'),
      startX,
      dist,
      sliderThis = {Id:'', run: false},
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
      var opacity;
        function toWork() {
          if (dist<0) {
            if (slideNow >= slideCount || slideNow <=0) {
              slider.find('.'+sliderClass+'__slide').first().addClass(sliderClass+'__slide_next').css('opacity', '1');
            } else {
              slider.find('.'+sliderClass+'__slide_active').next().addClass(sliderClass+'__slide_next').css('opacity', '1');
            }
          } else {
            if (slideNow <= 1) {
              slider.find('.'+sliderClass+'__slide').last().addClass(sliderClass+'__slide_next').css('opacity', '1');
            } else {
              slider.find('.'+sliderClass+'__slide_active').prev().addClass(sliderClass+'__slide_next').css('opacity', '1');
            }
          }
          if (1 - Math.abs(dist / widthSlide) * 1.5 > 0.3) {
            opacity = 1 - Math.abs(dist / widthSlide) * 1.5;
          } else {
            opacity = 0.3;
          }
          slider.find('.'+sliderClass+'__slide_active').css('opacity', opacity);
        }


        e.preventDefault(); // отключаем стандартную реакцию скроллинга
        widthSlide = slider.width();
        if (e.type == "touchmove") {
            var touchobj = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          dist = touchobj.clientX - startX; // получаем пройденную дистанцию
          toWork();
        } else {
        //если перемещается мышь и нажата кнопка:
          if (mouseBtnDown) {
            dist = e.offsetX - startX; // получаем пройденную дистанцию
            toWork();
          }
        }
    });


    touchsurfaceJQ.on('touchend mouseup mouseleave', function(e){
        e.preventDefault(); // отключаем стандартную реакцию скроллинга
        widthSlide = slider.width();
        //elapsedTime = new Date().getTime() - startTime; // узнаем пройденное время
        if ( Math.abs(dist) >= widthSlide * percentToSwipe) {
          if (dist<0) {
            nextSlide();
          } else {
            prevSlide();
          }
        } else {
          // чтобы ускорить анимацию считаем грубо говоря что не дотянули до свайпа один пиксел )))
          slider.find('.'+sliderClass+'__slide_active').animate({opacity : 1}, speedAnimation * percentToSwipe, function(){
            slider.find('.'+sliderClass+'__slide_next').removeClass(sliderClass+'__slide_next');
          });
        }
        if (e.type == "mouseup" || e.type == "mouseleave") {
          mouseBtnDown = false;
        }
    }); 
/******************************************************************/
  
  function nextSlide() {
    //console.log('work='+work+'   intervalID='+intervalID);
    if (work != true) {
  //    console.log('work!=true');
      if (slideNow >= slideCount || slideNow <=0) {
        work = true;
        slider.find('.'+sliderClass+'__slide').first().addClass(sliderClass+'__slide_next').css('opacity', '1');
        slider.find('.'+sliderClass+'__slide_active').animate({
          opacity: 0},
          speedAnimation, function() {
          $(this).removeClass(sliderClass+'__slide_active');
          slider.find('.'+sliderClass+'__slide').first().removeClass(sliderClass+'__slide_next').addClass(sliderClass+'__slide_active');
          slideNow = 1;
          slider.find('.'+sliderClass+'__active-num').text(slideNow);
          slider.find('.'+sliderClass+'__slide-nav_active').removeClass(sliderClass+'__slide-nav_active');
          slider.find('.'+sliderClass+'__slide-nav').eq(slideNow - 1).addClass(sliderClass+'__slide-nav_active');
          work = false;
        });
      } else {
        work = true;
        slider.find('.'+sliderClass+'__slide_active').next().addClass(sliderClass+'__slide_next').css('opacity', '1');
        slider.find('.'+sliderClass+'__slide_active').animate({
          opacity: 0
          },
          speedAnimation, function() {
          $(this).removeClass(sliderClass+'__slide_active').next().removeClass(sliderClass+'__slide_next').addClass(sliderClass+'__slide_active').css('opacity', '1');
          slideNow++;
          slider.find('.'+sliderClass+'__active-num').text(slideNow);
          slider.find('.'+sliderClass+'__slide-nav_active').removeClass(sliderClass+'__slide-nav_active');
          slider.find('.'+sliderClass+'__slide-nav').eq(slideNow - 1).addClass(sliderClass+'__slide-nav_active');
          work = false;
        });
      }
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
          slideNow = slideCount;
          slider.find('.'+sliderClass+'__active-num').text(slideNow);
          slider.find('.'+sliderClass+'__slide-nav_active').removeClass(sliderClass+'__slide-nav_active');
          slider.find('.'+sliderClass+'__slide-nav').eq(slideNow - 1).addClass(sliderClass+'__slide-nav_active');
        });     
      } else {
        work = true;
        slider.find('.'+sliderClass+'__slide_active').prev().addClass(sliderClass+'__slide_next').css('opacity', '1');
        slider.find('.'+sliderClass+'__slide_active').animate({
          opacity: 0
          },
          speedAnimation, function() {
          $(this).removeClass(sliderClass+'__slide_active').prev().removeClass(sliderClass+'__slide_next').addClass(sliderClass+'__slide_active').css('opacity', '1');
          work = false;
          slideNow--;
          slider.find('.'+sliderClass+'__active-num').text(slideNow);
          slider.find('.'+sliderClass+'__slide-nav_active').removeClass(sliderClass+'__slide-nav_active');
          slider.find('.'+sliderClass+'__slide-nav').eq(slideNow - 1).addClass(sliderClass+'__slide-nav_active');
        });
      }
    }
  }

  function addControls() {
    slider.find('.'+sliderClass+'__viewport').append('<div class="slider-opacity__controls"> <div class="'+sliderClass+'__btn-prev"></div> <div class="slider-opacity__active-num">'+slideNow+'</div><span>/</span><div class="slider-opacity__num">'+slideCount+'</div> <div class="'+sliderClass+'__btn-next"></div></div>');
/*    for (var i = 0; i < slideCount; i++) {
      if (i == 0) {
        slider.find('.'+sliderClass+'__btns').append('<div class="'+sliderClass+'__slide-nav '+sliderClass+'__slide-nav_active"></div>'); 
      } else {
        slider.find('.'+sliderClass+'__btns').append('<div class="'+sliderClass+'__slide-nav"></div>');
      }     
    }*/
  }

  function removeConrols() {
    slider.find('.'+sliderClass+'__controls').resolve();
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

  $(document).keydown(function(eventObject) {   // для управления с клавы
    if (eventObject.which == 37) {
      prevSlide();
    }
    if (eventObject.which == 39) {
      nextSlide();
    }
  });

  function resetSlider() { // сбрасываем слайдер на первый слайд
      work = true;
      slider.find('.'+sliderClass+'__slide_next').removeClass(sliderClass+'__slide_next').css('opacity', '0');
      slider.find('.'+sliderClass+'__slide').first().addClass(sliderClass+'__slide_next').css('opacity', '1');
      slider.find('.'+sliderClass+'__slide_active').animate({
        opacity: 0
        },
        speedAnimation, function() {
        $(this).removeClass(sliderClass+'__slide_active');
        slider.find('.'+sliderClass+'__slide_next').removeClass(sliderClass+'__slide_next').addClass(sliderClass+'__slide_active');
        work = false;
        slider.find('.'+sliderClass+'__active-num').text('1');
        slideNow = 1;
      });
  }

  function autoSlide() {
      for (var i = 0; i < listSlider.length; i++) {
        if (listSlider[i].Id == sliderId && listSlider[i].run) {
          nextSlide();
          break;
        }
      }
  }

  // для автоперелистывания
  slider.on('mouseenter touchstart touchmove', '.'+sliderClass+'__viewport', function(e) {
      clearInterval(intervalID);
  });

  slider.on('mouseleave touchend', '.'+sliderClass+'__viewport', function(e) {
    intervalID = setInterval(autoSlide, interval);
  });

/***************************************************************************************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/
  if (!slider.find('.'+sliderClass+'__controls').length) { // если первый запуск и еще нет контролов, то сздаем их и запускаем
    addControls();
    sliderThis.Id = sliderId;
    sliderThis.run = true;
    listSlider.push(sliderThis);
    intervalID = setInterval(autoSlide, interval);
  };
/***************************************************************************************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/
};

function stopSlider(sliderId) {
  for (var i = 0; i < listSlider.length; i++) {
    if (listSlider[i].Id == sliderId) {
      listSlider[i].run = false;
      break;
    }
  }
}

function runSlider(sliderId) {
  for (var i = 0; i < listSlider.length; i++) {
    if (listSlider[i].Id == sliderId) {
      listSlider[i].run = true;
      break;
    }
  }
}