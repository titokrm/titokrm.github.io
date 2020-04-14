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
    const speedParalax = 300, // время возвращения элементов на место после покидания мыши окна
          paralaxObj = $('.paralax'), // класс для элементов, data-layer="" - номер слоя у элемента (1 - самый ближний к наблюдателю)
          koefMoving = 0.75, // коеф для разных слоев, 1 слой = 0,75, 2 = 1,5, 3 = 2,25 и т.д.
          rem = 0.5208, // 0,5208 - это сколько vw равен 1 rem
          paralaxY = true, // включить для координат Y
          paralaxX = true; // включить для координат X
        //----------------------------
    let startX = 0,
        offsX = 0,
        startY = 0,
        outWindow = true,
        offsY = 0;
        ratio = $(window).width() * rem;

    $(window).resize(function(){
      ratio = $(window).width() * rem;
    })
    function animateOff() {
      paralaxObj.css('transition', 'none');
      outWindow = false;
    }
    $('body').on('mouseenter', function(event) {
      setTimeout(animateOff, speedParalax*1.5);
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
            mult = layer*koefMoving;
            $(this).css('transform', 'translate3d('+offsX*mult+'rem,'+offsY*mult+'rem,0)');
          });
          offsY = (startY - event.pageY)/ratio;
        } else {
          startY = event.pageY;
        }

        if (startX != 0 && paralaxX) {
          paralaxObj.each(function(){
            let layer = +$(this).attr('data-layer'),
                mult;
            mult = layer*koefMoving;
            $(this).css('transform', 'translate3d('+offsX*mult+'rem,'+offsY*mult+'rem,0)');
          });
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