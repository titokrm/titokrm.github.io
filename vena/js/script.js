'use strict'
document.addEventListener( 'DOMContentLoaded', function() {
  const nextBtn = document.querySelector('.slider__btn-next');
  const prevBtn = document.querySelector('.slider__btn-prev');
  const time = 1000;
  let enabledSlide = true;
  let mobWidth = 980;
  let sliderSelector = '.presentation .slider';
  let swiper, sliderBlock, swiperVideo;

  menuSlide({
    changePosition: true,
    addHeaderPadding: true,
  });

  swiperVideo = new Swiper('.video-slider', {
    loop: false,
    navigation: false,
    autoHeight: true,
    autoplay: false,
    grabCursor: true,
    spaceBetween: 15,
    slidesPerView: 1,
  });  

  let wave1 = Snap('.burger svg path:nth-child(1)');
  let wave3 = Snap('.burger svg path:nth-child(3)');
  let newD = Snap('.burger svg path:nth-child(2)').attr('d');
  let oldD = [wave1.attr('d'), wave3.attr('d')];
  let observer = new MutationObserver((mutations) => {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === "class") {
        if (mutation.target.classList.contains('active')) {
          const animateTime = 200;
          wave1.animate({'d': newD}, animateTime);
          wave3.animate({'d': newD}, animateTime);
          setTimeout(() => {
            wave1.attr({'opacity' : '0'});
            wave3.attr({'opacity' : '0'});
          }, animateTime);
        } else {
          const animateTime = 200;
          wave1.attr({'opacity' : '1'});
          wave3.attr({'opacity' : '1'});
          wave1.animate({'d': oldD[0]}, animateTime);
          wave3.animate({'d': oldD[1]}, animateTime);
        }
      }
    });
  });

  observer.observe(document.querySelector('.burger'), {
      attributes: true
  });  

  function startStopSwiper(width) {
    const sliderSwiper = document.querySelector(sliderSelector);
    if (sliderSwiper) {
      if (width <= mobWidth) {      
        if (document.querySelector(sliderSelector) && !document.querySelector(sliderSelector).classList.contains('swiper-initialized')) {
          sliderSwiper.classList.add('swiper');
          sliderSwiper.querySelector('.slider__wrap').classList.add('swiper-wrapper');
          let itemsSlider = sliderSwiper.querySelectorAll('.slider__item');
          itemsSlider.forEach((slide) => {
            slide.classList.add('swiper-slide');
          });
          swiper = new Swiper(sliderSelector, {
            loop: true,
            navigation: {
              nextEl: '.slider__btn-next',
              prevEl: '.slider__btn-prev',
            },
            autoplay: {
              delay: 2000,      
            },
            grabCursor: true,
            spaceBetween: 35,
            slidesPerView: 1,
            
          });  
          sliderBlock = document.querySelector(sliderSelector);
        }
      } else {
        if (document.querySelector(sliderSelector) && document.querySelector(sliderSelector).classList.contains('swiper-initialized')) {
          swiper.destroy();
          let itemsSlider = sliderSwiper.querySelectorAll('.slider__item');
          let i = 1;
          itemsSlider.forEach((slide) => {
            slide.classList = `slider__item slider__item--num-${i} ${i === 2 ? 'slider__item--top' : ''}`;
            i++;
          });
          document.querySelector(sliderSelector).style = `--timeSlider: ${time}mS`;
        }
      }
    }
  }

  function sliderDesktop() {
    document.querySelector(sliderSelector).style = `--timeSlider: ${time}mS`;
    function toSlide(event) {
      if (enabledSlide && window.innerWidth > mobWidth) {
        enabledSlide = false;
        const oldTop = document.querySelector('.slider__item--top');
        const itemArr = [];
        for (let i = 1; i <= 3; i++) {      
          const element = document.querySelector(`.slider__item--num-${i}`);
          let num;
          console.log('target = ', event.target.classList);
          if (event.target.closest('.slider__btn-prev')) {
            num = i > 1 ? i - 1 : 3;
            console.log('click prev');
          } else {
            console.log('click next');
            num = i < 3 ? i + 1 : 1;
          }
          
          let str = `slider__item slider__item--num-${num}`;
          if (event.target.closest('.slider__btn-prev')) {
            if (num === 2) {
              str += ' virash-3-2';
            }
            if (num === 1) {
              str += ' virash-2-1';
            }
          } else {
            if (num === 2) {
              str += ' virash-1-2';
            }
            if (num === 3) {
              str += ' virash-2-3';
            }
          }
          itemArr.push({
            elem: element,
            classStr: str
          });
        }
        itemArr.forEach((item) => {
          /*
          item.classStr.split(' ').forEach((className) => {
            for (let i = 1; i <= 3; i++) {
              item.elem.classList.remove(`slider__item--num-${i}`);
            }
            item.elem.classList.add(className);
          });*/
          item.elem.classList = item.classStr;
        });
        document.querySelector(`.slider__item--num-2`).classList.add('slider__item--top');
        setTimeout(() => {
          oldTop.classList.remove('slider__item--top');              
        }, time * 0.3);
        setTimeout(() => {
          document.querySelector('.slider__wrap').classList.remove('blur');
        }, time * 0.5);
        setTimeout(() => {
          enabledSlide = true;
          document.querySelector('.virash-1-2')?.classList.remove('virash-1-2');
          document.querySelector('.virash-2-3')?.classList.remove('virash-2-3');
          document.querySelector('.virash-2-1')?.classList.remove('virash-2-1');
          document.querySelector('.virash-3-2')?.classList.remove('virash-3-2');
        }, time);
        
      }
    }
    prevBtn?.addEventListener('click', toSlide);
    nextBtn?.addEventListener('click', toSlide);
  }
  sliderDesktop();
  let width = window.innerWidth;
  startStopSwiper(width);

  window.addEventListener('resize', () => {
    let width = window.innerWidth;
    startStopSwiper(width);
  });
  
  // настроить стили и скрипт для мобильного
  wave(mobWidth);
  
  document.querySelector('.disclamer__close').addEventListener('click', event => {
    event.preventDefault();
    let disclaimer = event.target.closest('.disclamer');
    console.log('Disclamer = ', disclaimer);
    disclaimer.remove();
  });
  
});