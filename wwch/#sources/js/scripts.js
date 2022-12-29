function headerEvenScroll() {
  function getBodyScrollTop()
    {
      return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
    }  
  function eventScroll() {
    if (getBodyScrollTop() > 0) {
      header.classList.add('header--fixed');
    } else header.classList.remove('header--fixed');
  }
  const header = document.querySelector(".header");
  eventScroll();
  addEventListener('scroll', eventScroll);
}

function galleryCard({
  selBigPic = '.big-picture',
  selSmall = '.previews',
  smallPic = '.previews__item',
  bigImg = '.big-picture__item',
  duration = 300,
}={}) {
  const previews = $(selSmall);
  const bigPic = $(selBigPic);
  previews.on('click',smallPic + ' a',function(event){
    event.preventDefault();
    const link = $(this).attr('href');
    $.each($(selSmall).children(smallPic), function(index, val){
      console.log(val);      
    })
    $(selSmall).children(smallPic).removeClass('active');
    $(this).parent(smallPic).addClass('active');
    console.log(link);
    const oldPic = $(selBigPic).children(bigImg);
    const newPic = $(`<img class="big-picture__item" src="${link}" alt="Picture" />`);
    bigPic.prepend(newPic);
    oldPic.fadeOut(duration, function(){
      $(this).remove();
    });
  })
}

function accordion({
  selector = '.accordion',
  btn = '.accordion__btn',
  itemDiv = '.accordion__item',
  collapsedDiv = '.accordion__text',
  enabledCollapsedClass = 'accordion__item--collapsed',
  duration = 300,
  overClosed = false,
} = {}) {
  const accord = $(selector);
  accord.on('click', btn, function() {
    const currentItem = $(this).parent(itemDiv);
    if (overClosed) {
      console.log(currentItem.parent(selector).children(itemDiv));
      currentItem.parent(selector).children(itemDiv+'.'+enabledCollapsedClass).not(currentItem).removeClass('active').children(collapsedDiv).slideUp();
    }
    if (currentItem.hasClass(enabledCollapsedClass)) {
      currentItem.children(collapsedDiv).slideToggle(duration, () => {
        currentItem.toggleClass('active');
      });
    }
  })

}

function dropControls() {
  function closeAllControls() {
    let arrControls = document.querySelectorAll('.filter-control.active');
    arrControls.forEach((element) => {
      element.classList.remove('active');
    })
    arrControls = document.querySelectorAll('.sorting-mode.active');
    arrControls.forEach((element) => {
      element.classList.remove('active');
    })
  }
  function pressKeyEvent(event) {
    if (event.code === 'Escape') {
      closeAllControls();
      document.removeEventListener('keydown', pressKeyEvent);
    }    
  }

  document.querySelector('body').addEventListener('click', (event) => {    
    const closeBtn = event.target.closest('.filter-control__close');
    const targetClear = event.target.closest('.filter-control__clear-chk');
    const targetControlSingl = event.target.closest('.filter-control__clickable--singl');
    const targetControlInserted = event.target.closest('.filter-control__clickable--inserted');
    const targetSortMode = event.target.closest('.sorting-mode__clickable');
    const targetOverlay = event.target.closest('.filter-control__overlay');
    const targetOverlaySortMode = event.target.closest('.sorting-mode__overlay');
    const targetSortModeLink = event.target.closest('.sorting-mode__list-item a');
    if (closeBtn) {
      event.preventDefault();
      event.target.closest('.filter-control').classList.remove('active');
    }
    if (targetSortModeLink) {
      const innerHTML = targetSortModeLink.innerHTML;
      const parent = targetSortModeLink.closest('.sorting-mode');
      parent.querySelector('.sorting-mode__clickable').innerHTML = innerHTML;
      parent.classList.remove('active');
    }
    if (targetClear) {
      event.preventDefault();
      const arrChk = targetClear.parentNode.parentNode.querySelectorAll('input[type="checkbox"]');
//      debugger;
      arrChk.forEach(element => {
        element.checked = false;
      });
      console.log('clear');
      return;
    }
    if (targetControlSingl) {
      //debugger;
      if (targetControlSingl.parentNode.classList.contains('active')) {
        targetControlSingl.parentNode.classList.remove('active');
        document.removeEventListener('keydown', pressKeyEvent);  
      } else {
        closeAllControls();
        document.addEventListener('keydown', pressKeyEvent);
        targetControlSingl.parentNode.classList.add('active');
      }
      return;
    }
    if (targetControlInserted) {
      //debugger;
      if (targetControlInserted.parentNode.classList.contains('active')) {
        targetControlInserted.parentNode.classList.remove('active');
        //document.removeEventListener('keydown', pressKeyEvent);  
      } else {
        //closeAllControls();
        //document.addEventListener('keydown', pressKeyEvent);
        targetControlInserted.parentNode.classList.add('active');
      }
      return;
    }
    if (targetOverlay) {
      document.removeEventListener('keydown', pressKeyEvent);
      closeAllControls();
      return;
    }
    if (targetSortMode) {
      //debugger;
      if (targetSortMode.parentNode.classList.contains('active')) {
        targetSortMode.parentNode.classList.remove('active');
        document.removeEventListener('keydown', pressKeyEvent);  
      } else {
        closeAllControls();
        document.addEventListener('keydown', pressKeyEvent);
        targetSortMode.parentNode.classList.add('active');
      }
      return;
    }
    if (targetOverlaySortMode) {
      document.removeEventListener('keydown', pressKeyEvent);
      closeAllControls();
      return;
    }
  })
}

function removeControlsInMob(width) {
  if (width <= 720) {
    setTimeout(() => {
      const arrControls = document.querySelectorAll('.filter-control__dropdown--xs-mob-filter .filter-control__clickable--singl');
      console.log(arrControls);
      
      arrControls.forEach((element) => {
        element.classList.remove('filter-control__clickable--singl');
        element.classList.add('filter-control__clickable--inserted');
        element.closest('.filter-control').querySelector('.filter-control__overlay').remove();
        const close = document.createElement('a');
        close.setAttribute('href','#');
        close.classList.add('filter-control__close');
        close.innerHTML = '<img src="images/icon-close.svg" alt="icon" />';
        element.closest('.filter-control').querySelector('.filter-control__dropdown').prepend(close);
      })
    }, 100);
  }
}

function sliderFade({
    selector = '.slider-fade',
    animateTime = 300,
    timeChangeSlide = 3000,
    indicatorBackTime = 100,
    resolutionHide = 1220,
  } = {}) {

  const slider = document.querySelector(selector);
  if (slider === null) {
    return;
  }
  const slides = slider.querySelector('.slider-fade__items');
  let num = 0;
  let timer;
  const maxNum = slides.querySelectorAll('.item-slider').length - 1;

  function setActiveSlide(num) {
    const arrSlides = slides.querySelectorAll('.item-slider');
    arrSlides[num].classList.add('switchable');                  
    const t = setTimeout(() => {
      slides.querySelector('.active').classList.remove('active');      
      arrSlides[num].classList.add('active');
      for (let i = 0; i < arrSlides.length; i++) {
        arrSlides[i].classList.remove('switchable');
      }
    }, animateTime);
  }
  function changeSlide() {
    const arrControls = controls.querySelectorAll('.controls-slider__item');        
    arrControls[num].querySelector('.controls-slider__indicator div').style.transitionDuration = indicatorBackTime + "ms";
    num < maxNum ? num++ : num = 0;    
    arrControls[num].querySelector('.controls-slider__indicator div').style.transitionDuration = timeChangeSlide + "ms";
    controls.querySelector('.active').classList.remove('active');
    arrControls[num].classList.add('active');
    setActiveSlide(num);
  }
  function addControls(count) {
    function setAttributes(arrElems, name, value) {
      arrElems.forEach(element => {
        element.style[name] = value;
      });
    }
    let innerHtml = '';
    const arrTitles = slides.querySelectorAll('.item-slider [data-title]');
    for (let i = 0; i < count; i++) {
      let title = arrTitles[i].dataset.title;
      innerHtml += `
          <a href="#" class="controls-slider__item">
            <div class="controls-slider__indicator"><div></div></div>
            <div class="controls-slider__name">${arrTitles[i].dataset.title}</div>
          </a>
      `;
    }
    const controls = document.createElement('div');
    controls.className = 'slider-fade__controls controls-slider';
    controls.innerHTML = innerHtml;
    slider.prepend(controls);
    setAttributes(slider.querySelectorAll('.controls-slider__item'), 'transitionDuration' , animateTime + 'ms');
    setAttributes(slider.querySelectorAll('.item-slider'), 'transitionDuration' , animateTime + 'ms');
  }
  function runSlider() {
    controls.querySelector('.controls-slider__indicator div').style.transitionDuration = timeChangeSlide + "ms";
    controls.querySelector('.controls-slider__item').classList.add("active");
    timer = setInterval(changeSlide, timeChangeSlide);
    controls.addEventListener('click', (event)=>{
        event.preventDefault();
        const target = event.target.closest('.controls-slider__item');
        if (target && !target.classList.contains('active')) {
          slider.querySelector('.controls-slider__item.active .controls-slider__indicator div').style.transitionDuration = indicatorBackTime + "ms";
          controls.querySelector('.active').classList.remove('active');
          target.querySelector('.controls-slider__indicator div').style.transitionDuration = timeChangeSlide + "ms";
          target.classList.add('active');
          const arrControls = controls.querySelectorAll('.controls-slider__item');      
          for (let i = 0; i < arrControls.length; i++) {
            if (arrControls[i].classList.contains('active')) {
              num = i;
              break;
            }
          }
          setActiveSlide(num);
          clearInterval(timer)
          timer = setInterval(changeSlide, timeChangeSlide);
        }
      });
  }
  function resize(width) {
    if (width <= resolutionHide) {
      slider.querySelector('.slider-fade__items').style.display = 'none';
      slider.querySelector('.controls-slider').style.display = 'none';
    }
     else {
      slider.querySelector('.slider-fade__items').style.display = '';
      slider.querySelector('.controls-slider').style.display = '';
    }
    let height = slider.querySelector('.controls-slider').clientHeight;
    slider.querySelectorAll('.item-slider').forEach(element => {
      element.setAttribute('style', `padding-bottom: ${height + 64}px; transition-duration: ${animateTime}ms;`);
    });    
  }

  addControls(maxNum + 1);
  const controls = slider.querySelector('.controls-slider');
  setTimeout(runSlider, 100); // небольшая задержка чтобы всё прорисовалось
  resize(window.innerWidth);
  arrRunOfResize.push(resize);
}

function eventResize(arrRunOfResize) {  // функция которая вызывается при ресайзе окна, берет из массива arrRunOfResize имена функций и вызывает их передавая им ширину окна, если ширина <= 720 то перезагрузка страницы
  let width = window.innerWidth;		// т.к. в ином случае возникают баги из-за перестроения структуры html и инициализации слайдера. В массив arrRunOfResize нужно добавлять все ф-ции которые будут вызываться при ресайзе
  arrRunOfResize.forEach(element => {
    element(width);
  });
  window.addEventListener('resize', () => {
    let width = window.innerWidth;
    arrRunOfResize.forEach(element => {
      element(width);
    });
  });
}

function startStopSlick(width) {
  const setBestsellers = {
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      responsive: [
        {
          breakpoint: 721,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
      ]      
    };
  if (width <= 989 + 32) {
    $('.slider-cards.bestsellers__inner').hasClass('slick-initialized') ? null : $('.slider-cards.bestsellers__inner').slick(setBestsellers);    
  } else {
    $('.slider-cards.bestsellers__inner').hasClass('slick-initialized') ? $('.slider-cards.bestsellers__inner').slick('unslick') : null;
  } 
}

const arrRunOfResize = [];
let oldWidth = window.innerWidth;
document.addEventListener( 'DOMContentLoaded', function() {
  teleport((event = null) => {
    let width = window.innerWidth;
    if (width > 720) {
      console.log('Kill sliders!');
      $('#slider-forface-inner').hasClass('slick-initialized') ? $('#slider-forface-inner').slick('unslick') : null;
      $('#slider-forbody-inner').hasClass('slick-initialized') ? $('#slider-forbody-inner').slick('unslick') : null;
      $('#slider-formakeup-inner').hasClass('slick-initialized') ? $('#slider-formakeup-inner').slick('unslick') : null;
    }
  }, (event = null) => {
    let width = window.innerWidth;
    const setAllFor = {
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
      };

    if (width <= 720) {
      console.log('Start slider!');      
      $('#slider-forface-inner').hasClass('slick-initialized') ? null : $('#slider-forface-inner').slick(setAllFor);
      $('#slider-forbody-inner').hasClass('slick-initialized') ? null : $('#slider-forbody-inner').slick(setAllFor);
      $('#slider-formakeup-inner').hasClass('slick-initialized') ? null : $('#slider-formakeup-inner').slick(setAllFor);
    }
  });
//  const da = new DynamicAdapt("max");  
//  da.init(); // скрипт перекройки html https://github.com/FreelancerLifeStyle/dynamic_adapt
  headerEvenScroll(); // при скролле добавляем класс в хедер .header--fixed
  sliderFade({selector: '.slider-fade',}); // старт слайдера наглавной странице  
  arrRunOfResize.push(startStopSlick); // добавляем в массив функцию котороая будет вызываться при ресайзе
  arrRunOfResize.push(removeControlsInMob); // -----------
  eventResize(arrRunOfResize); // запускаем мониторинг ресайза
  dropControls(); // скрипт выпадающих контролов аля селект - страшный говнокод построенный дендрофекальным способом ((

        var splide = new Splide( '.splide', {
            type   : 'loop',
            drag   : 'free',
            focus  : 'center',
            autoWidth: true,
            arrows: false,
            pagination: false,
            perPage: 3,
            autoScroll: {
                speed: 1,
            },
        } );

        splide.mount( window.splide.Extensions );

  accordion(); // аккордеон карточки товара
  galleryCard(); //  галерея изображений карточки товара
});
