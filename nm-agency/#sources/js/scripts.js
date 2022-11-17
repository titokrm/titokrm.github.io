$(function() {
  var countersClass = 'js-counters-num'; // класс для счетчиков

  startSlider();
  showHideHeader();
  counters();
  paralax();
  resizeMediators();
/*
  getCircle();

  function getCircle() {
    var r = 130, y = 0, p = 0;
    for (var x = 0; x <= 25; x++) {
      y = Math.sqrt(Math.pow(r, 2) - Math.pow(x*4, 2));
      console.log(x+'% {left:-'+x*4+'%; top:'+y+'%;}');
    }
    p = 25;
    for (var x = 25; x >= 0; x--) {
      y = Math.sqrt(Math.pow(r, 2) - Math.pow(x*4, 2));
      console.log(p+'% {left:-'+x*4+'%; top:-'+y+'%;}');
      p = p + 1;
    }
    p = 50;
    for (var x = 0; x <= 25; x++) {
      y = Math.sqrt(Math.pow(r, 2) - Math.pow(x*4, 2));
      console.log(p+'% {left:'+x*4+'%; top:-'+y+'%;}');
      p = p + 1;
    }
    p = 75;
    for (var x = 25; x >= 0; x--) {
      y = Math.sqrt(Math.pow(r, 2) - Math.pow(x*4, 2));
      console.log(p+'% {left:'+x*4+'%; top:'+y+'%;}');
      p = p + 1;
    }
  }
*/
  $(window).resize(function(){
    startSlider();
  })

  $('.js-goto').on('click', function(event) {
    event.preventDefault();
    var target = $(this).attr('href'),
        top = $(target).offset().top;
    $('html,body').animate({scrollTop: top}, 300)
  });

  $('body').on('click', '.faq-list__btn', function(){
    $(this).toggleClass('active').parent().next().slideToggle();
  });

  $('body').on('click', '.js-show-menu', function(){
    $('.js-menu').addClass('active');
    $('body').addClass('lock');
  });

  $('body').on('click', '.js-hide-menu', function(){
    $('.js-menu').removeClass('active');
    $('body').removeClass('lock');
  });
  
  function resizeMediators() {
    $(window).scroll(function(event){
      var posBottomScroll = $(window).scrollTop() + window.innerHeight,
          element,
          posFooter = $('.footer').offset().top;
      if (posBottomScroll < posFooter) {
        $('.figure').each(function(){
          element = $(this).offset().top + $(this).height();
          if (posBottomScroll >= element) {
            $(this).addClass('js-resize');
          }
        })
      }
    });
  }

  function showHideHeader() {
    var lastScrollTop = 0;
    $(window).scroll(function(event){
    var st = $(this).scrollTop();
    if (st == 0) {
      $('.header').css({'background':'none', 'backdrop-filter': 'none'});
    } else {
      $('.header').css({'background-color':'rgba(255, 255, 255, 0.6)', 'backdrop-filter': 'blur(20px)'});
    }
    if (st > lastScrollTop){
       $('.header').addClass('js-hide');
    } else {
       $('.header').removeClass('js-hide');
    }
    lastScrollTop = st;
    });
  }
  function startSlider() {
    var windowWidth = window.innerWidth;
    if (windowWidth<526) {
      $('.owl-carousel').owlCarousel({
          loop:true,
          center: true,
          margin:20,
          dots: false,
          autoplay: true,
          autoplayTimeout: 2000,
          items: 4
      })  
    }
  }

  function counters() {
    var elementPos = 0;

    function startCount() {
      counterStart = false;
      $('.'+countersClass).each(function(index, el) {
        var duration = +$(el).attr('data-duration'),
          startNum = +$(el).attr('data-start'),
          finishNum = +$(el).attr('data-finish');
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

  function paralax() {
    const speedParalax = 300, // время возвращения элементов на место после покидания мыши окна
          paralaxObj = $('.js-paralax'), // класс для элементов, data-layer="" - номер слоя у элемента (1 - самый ближний к наблюдателю)
          koefMoving = 0.75, // коеф для разных слоев, 1 слой = 0,75, 2 = 1,5, 3 = 2,25 и т.д.
          rem = 0.5208, // 0,5208 - это сколько vw равен 1 rem (10px / 1920 * 100%)
          paralaxY = true, // включить для координат Y
          paralaxX = true; // включить для координат X
        //----------------------------
    let startX = 0,
        offsX = 0,
        startY = 0,
        outWindow = true,
        offsY = 0,
        ratio = $(window).width() * rem;

    $(window).resize(function(){
      ratio = $(window).width() * rem;
    })

    function animateOff() {
      paralaxObj.css('transition', 'none');
      outWindow = false;
    }
    
    $('.js-start-parallax').on('mouseenter', function(event) {
      setTimeout(animateOff, speedParalax);
    });

    $('.js-start-parallax').on('mouseleave', function(e) {
      outWindow = true;
      paralaxObj.each(function(){
        $(this).css('transition', 'transform '+speedParalax+'ms ease-in-out');
        startX = startY = offsX = offsY = 0;
        $(this).css('transform', 'translate3d('+offsX+'rem,'+offsY+'rem,0)');
      });
    });


    $('.js-start-parallax').mousemove(function(event) {
      if (!outWindow) {
        if (startY != 0 && paralaxY) {
          paralaxObj.each(function(){
            let layer = +$(this).attr('data-layer'),
                mult;
            mult = layer * koefMoving;
            $(this).css('transform', 'translate3d('+offsX*mult+'rem,'+offsY*mult+'rem,0)');
          });
          offsY = (startY - event.pageY) / ratio;
        } else {
          startY = event.pageY;
        }

        if (startX != 0 && paralaxX) {
          paralaxObj.each(function(){
            let layer = +$(this).attr('data-layer'),
                mult;
            mult = layer * koefMoving;
            $(this).css('transform', 'translate3d('+offsX*mult+'rem,'+offsY*mult+'rem,0)');
          });
          offsX = (startX - event.pageX) / ratio;
        } else {
          startX = event.pageX;
        }
      }
    });
  }


});