$(function() {
  var tabsBtn = 'js_tabs',
      active = 'btn_active',
      id = 0,
      nameTabs,
      resetLater = false,
      tabsItem = 'our-work__tabs-item';

  function tabs() {
    var maxh = 0;
    $('.'+tabsItem).each(function() {
      if (maxh<$(this).height()) {
        maxh = $(this).height();
      }
    });
    $('.'+tabsItem).parent().css('min-height', maxh);
    $('body').on('click', '.'+tabsBtn, function(event) {
      $('.'+tabsBtn).removeClass(active);
      stopSlider('#'+nameTabs);
      $(this).addClass(active);
      nameTabs = $(this).attr('data-item-tabs');
      $('.'+tabsItem).removeClass(tabsItem+'_active');
      $('#'+nameTabs).addClass(tabsItem+'_active');
      runSlider('#'+nameTabs);
    });
  }

  function startSliders() {
    var idName;
    $('.slider-opacity').each(function(idx){
      idName = $(this).attr("id");
      sliderOpacity('#'+idName);
      stopSlider('#'+idName);
    });
  }

  function paralax() {
    var speedParalax = 300,
        widthScreen = $(window).width(),
        ratio = widthScreen*0.5208,
        startX = 0,
        offsX = 0,
        startY = 0,
        outWindow = true,
        offsY = 0;

    function animateOff() {
      $('.right-green').css('transition', 'none');
      outWindow = false;
    }
    $('body').on('mouseenter', function(event) {
      setTimeout(animateOff, speedParalax*1.5);
    });

    $('body').on('mouseleave', function(e) {
      outWindow = true;
      $('.right-green').css('transition', 'transform '+speedParalax+'ms ease-in-out');
      startX = startY = offsX = offsY = 0;
      $('.right-green').css('transform', 'translate3d('+offsX+'rem,'+offsY+'rem,0)');
    });


    $('body').mousemove(function(event) {
      if (!outWindow) {
        if (startY != 0) {
          $('.right-green').css('transform', 'translate3d('+offsX+'rem,'+offsY+'rem,0)');
          offsY = (startY - event.pageY)/ratio;
        } else {
          startY = event.pageY;
        }

        if (startX != 0) {
          $('.right-green').css('transform', 'translate3d('+offsX+'rem,'+offsY+'rem,0)');
          offsX = (startX - event.pageX)/ratio;
        } else {
          startX = event.pageX;
        }
      }
    });
  }

  tabs();
  startSliders()
  nameTabs = $('body').find('.slider-opacity').attr("id");
  runSlider('#'+nameTabs);
  paralax();
});