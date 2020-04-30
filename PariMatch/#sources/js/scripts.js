"use strict";

$(function() {

  let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } },
      deviceDir = 'images/android/',
      stepItem = '#steps li',
      animateTime = '.15s',
      helpImgObj = $('#help'),
      stepItemObj = $(stepItem);

  if (isMobile.iOS()) {
    deviceDir = 'images/ios/';
  }

  helpImgObj.attr("src", deviceDir+'1.gif'); // чтобы не было анимации затухания при старте просто меням путь к картинке без вызова changeHelpImg

  paralax();

  stepItemObj.on('click', function(){
    let num;

    num = $(this).index() + 1;
    $(stepItem+' .btn_active').removeClass('btn_active');
    $(this).find('.btn').addClass('btn_active');
    changeHelpImg(num + '.gif');
  });

  function changeHelpImg(name) {
    helpImgObj.animate({opacity : 0}, animateTime, function(){
      $(this).attr("src", deviceDir+name).animate({opacity : 1}, animateTime);
    })
  }

  function paralax() {
    const speedParalax = 300, // время возвращения элементов на место после покидания мыши окна
          paralaxObj = $('.paralax'), // класс для элементов, data-layer="" - номер слоя у элемента (1 - самый ближний к наблюдателю)
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
    
    $('body').on('mouseenter', function(event) {
      setTimeout(animateOff, speedParalax * 1.5);
    });

    $('body').on('mouseleave', function(e) {
      outWindow = true;
      paralaxObj.each(function(){
        $(this).css('transition', 'transform '+speedParalax+'ms ease-in-out');
        startX = startY = offsX = offsY = 0;
        $(this).css('transform', 'translate3d('+offsX+'rem,'+offsY+'rem,0)');
      });
    });


    $('body').mousemove(function(event) {
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