'use strict'
document.addEventListener( 'DOMContentLoaded', function() {
  let mobWidth = 768;
  let sliderSelector = '.testimonials .swiper';
  let swiper, sliderBlock;
  function autoPlayStart() {
    swiper.autoplay.start();
  }
  function autoPlayStop() {
    swiper.autoplay.stop();
  }
  function startStopSwiper(width) {
    if (width <= mobWidth) {
      if (document.querySelector(sliderSelector) && !document.querySelector(sliderSelector).classList.contains('swiper-initialized')) {
        swiper = new Swiper(sliderSelector, {
          loop: true,
          navigation: false,
          autoplay: {
            delay: 2000,      
          },
          grabCursor: true,
          spaceBetween: 16,
          slidesPerView: 1.5
        });  
        sliderBlock = document.querySelector(sliderSelector);
        sliderBlock.addEventListener('mouseenter', autoPlayStop);
        sliderBlock.addEventListener('mouseleave', autoPlayStart);        
      }
    } else {
      if (document.querySelector(sliderSelector) && document.querySelector(sliderSelector).classList.contains('swiper-initialized')) {
        swiper.destroy();
        sliderBlock.removeEventListener('mouseenter', autoPlayStop);
        sliderBlock.removeEventListener('mouseleave', autoPlayStart);
      }
    }
  }
  menuSlide({
    changeVisible: false,
    mobWidthSetting: mobWidth,
    addHeaderPadding: true,
  });

  accordion();

  let width = window.innerWidth;
  startStopSwiper(width);

  window.addEventListener('resize', () => {
    let width = window.innerWidth;
    startStopSwiper(width);
  });

  fastNav();

});