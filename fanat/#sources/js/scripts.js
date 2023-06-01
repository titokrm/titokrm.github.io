function headerEvenScroll() {
  function getBodyScrollTop()
    {
      return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
    }  
  function eventScroll() {
    if (getBodyScrollTop() > 0) {
      header.classList.add('header--with-shadow');
    } else header.classList.remove('header--with-shadow');
  }
  const header = document.querySelector("header.header");
  eventScroll();
  addEventListener('scroll', eventScroll);
}

function stickyAside() {
  if ($('.right-side .sticky').outerHeight() + 32 > window.innerHeight) {
    $('.right-side .sticky').addClass('no-sticky');
  } else {
    $('.right-side .sticky').removeClass('no-sticky');
  }
}

function dropControls() {
  function closeAllControls() {
    arrControls = document.querySelectorAll('.custom-select.active');
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
    const targetClickable = event.target.closest('.custom-select__clickable');
    const targetOverlay = event.target.closest('.custom-select__overlay');
    const targetClickableLink = event.target.closest('.custom-select__list-item a');
    if (targetClickableLink) {
      const innerHTML = targetClickableLink.innerHTML;
      const parent = targetClickableLink.closest('.custom-select');
      const optionClicking = targetClickableLink.closest('.custom-select__list-item');
      const arrOptions = parent.querySelectorAll('.custom-select__list-item');
      const select = parent.querySelector('select');
      arrOptions.forEach((element, index) => {
        if (optionClicking === element) {
          select.selectedIndex = index;
        }
      });
      parent.querySelector('.custom-select__clickable').innerHTML = innerHTML;
      parent.classList.remove('active');
    }
    if (targetClickable) {
      //debugger;
      if (targetClickable.parentNode.classList.contains('active')) {
        targetClickable.parentNode.classList.remove('active');
        document.removeEventListener('keydown', pressKeyEvent);  
      } else {
        closeAllControls();
        document.addEventListener('keydown', pressKeyEvent);
        targetClickable.parentNode.classList.add('active');
      }
      return;
    }
    if (targetOverlay) {
      document.removeEventListener('keydown', pressKeyEvent);
      closeAllControls();
      return;
    }
  })
}

function cusel({
  selector = '.custom-select', // селектор корневого э-та-обертки у cusel
  overlay = '.custom-select__overlay', // затемняющая подложка 
  clickable = '.custom-select__clickable', // кликабельный блок который и заменяет собой закрытый селект
  optionLink = '.custom-select__list-item a', // ссылка в выпающем списке "option"
  selectPresent = true, // нужен ли спрятанный select внутри 
  autoCompleteHtml = true, // если выпадайка просто список ссылок без ухищрений
  select = 'custom-select__select', // класс у внутреннего спрятанного select (если selectPresent = true)
  optionItem = '.custom-select__list-item'
} = {}) {

//*****************************************************************************
//    если selectPresent = true то вот так должен выглядеть входной html
//
//        <div class="custom-select">
//          <select name="" id="" class="custom-select__select">
//            <option value="ru" selected>Русский</option>
//            <option value="ua">Українська</option>
//          </select>
//        </div>
//
//    который потом развернется в такую конструкцию которую нужно стилизовать
//
//        <div class="custom-select">
//          <div class="custom-select__overlay"></div>
//          <div class="custom-select__clickable">
//                  Русский
//          </div>
//          <div class="custom-select__dropdown">
//            <ul class="custom-select__list">
//              <li class="custom-select__list-item">
//                <a href="#" class="custom-select__list-link  custom-select__list-link--selected" data-val="ru">
//                  Русский
//                </a>
//              </li>      
//              <li class="custom-select__list-item">
//                <a href="#" class="custom-select__list-link " data-val="ua">
//                  Українська
//                </a>
//              </li>
//            </ul>
//          </div>
//          <select name="" id="" class="custom-select__select">
//            <option value="ru" selected="">Русский</option>
//            <option value="ua">Українська</option>
//          </select>
//        </div>
//
//*****************************************************************************

  function closeAllControls() {
    $(selector + '.active').removeClass('active');
  }
  function pressKeyEvent(event) {
    if (event.code === 'Escape') {
      closeAllControls();
      $(document).off('keydown', pressKeyEvent);
    }    
  }
  function removeAllEvents() {
    $(document).off('keydown', pressKeyEvent);
    $(document).off('click', overlay, clickOverlay);
    $(document).off('click', optionLink, clickOptionEvent);
  }
  function clickOptionEvent() {
    const innerHTML = $(this).html();
    const value = $(this).attr('data-val');
    const rootCusel = $(this).parents(selector);
    rootCusel.find(clickable).html(innerHTML);
    selectPresent ? rootCusel.find(`.${select}`).val(value).change() : null;
    rootCusel.removeClass('active');
    removeAllEvents();
  }
  function clickOverlay() {
    $(this).parents(selector).removeClass('active');
    removeAllEvents();
  }
  if (autoCompleteHtml && selectPresent) {
    $(document).find(selector).each(function() {
      $(this).find('select').addClass(select);
      let oldHtml = document.querySelector(selector).innerHTML;
      let innerHTML = `
            <div class="custom-select__overlay"></div>
            <div class="custom-select__clickable">
              ${$(this).find(`.${select} option`).filter(':selected').length > 0 ? $(this).find(`.${select} option`).filter(':selected').text() : $(this).find(`.${select} option`).first().text()}
            </div>
            <div class="custom-select__dropdown">
              <ul class="custom-select__list">
      `;
      $(this).find('select option').each(function() {
        innerHTML += `
                <li class="custom-select__list-item">
                  <a href="#" class="custom-select__list-link ${$(this).filter(':selected').length > 0 ? ' custom-select__list-link--selected' : ''}" data-val="${$(this).val()}">
                    ${$(this).text()}
                  </a>
                </li>
        `;
      });
      innerHTML += `
              </ul>
            </div>
      `;      
      $(this).html(innerHTML + oldHtml);
    });
    
  }
  $(document).on('click', clickable, function() {
    if ($(this).parents(selector).hasClass('active')) {
      $(this).parents(selector).removeClass('active');
      removeAllEvents();
    } else {
      $(this).parents(selector).addClass('active');
      $(document).on('keydown', pressKeyEvent);
      $(document).on('click', overlay, clickOverlay);
      $(document).on('click', optionLink, clickOptionEvent);
    }    
  });
}

function menuSlide({
  burger = '.burger',
  closeMenu = '.close-menu',
  menu = '.slideblock',
  overlay = '.header__overlay',
  timeAnimate = 300,
  menuLink = '.slideblock .menu-item-has-children > a',
} = {}) {
  $(document).on('click', burger, (event) => {
    event.preventDefault();
    $(menu).toggleClass('active');
    $(overlay).toggleClass('active');
    $('body').toggleClass('scroll-lock');
  })
  function toClose(event) {
    event.preventDefault();
    $(menu).toggleClass('active');
    setTimeout(() => {
      $(overlay).toggleClass('active');
      $('body').toggleClass('scroll-lock');
    }, timeAnimate);
  }
  $(document).on('click', closeMenu, toClose);
  $(document).on('click', overlay, toClose);
  $(document).on('click', menuLink, function(event) {
    event.preventDefault();
    $(this).parent().toggleClass('active').children('.submenu').slideToggle(timeAnimate);
  })
}

function search({
  showSearch = '.show-search',
  closeSearch = '.close-search',
  search = '.search-dropdown',
  input = '.search-dropdown__input input[type=text]',
  timeAnimate = 300,
  submit = '.search-dropdown__submit',
} = {}) {
  console.log($(showSearch));
  
  $(document).on('click', showSearch, (event) => {
    event.preventDefault();
    $(search).toggleClass('active');
    $('body').toggleClass('scroll-lock');
  })
  $(document).on('click', closeSearch, (event) => {
    event.preventDefault();
    $(search).toggleClass('active');
    setTimeout(() => {
      $('body').toggleClass('scroll-lock');
    }, timeAnimate);
    $(submit).removeClass('active');
  })
  focusSearch(input, submit);
}

function focusSearch(input, submit) {
  $(document).on('focus', input, function(event) {
    console.log('focus');
    $(submit).addClass('active');
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
  if (!$(selector).hasClass('_accordion-initializated')) {
    $(selector).addClass('_accordion-initializated');
    $(document).on('click', `${selector} ${btn}`, function() {
      //debugger;
      const currentItem = $(this).parent(itemDiv);
      if (overClosed) {
        console.log(currentItem.parent(selector).children(itemDiv));
        currentItem.parent(selector).children(itemDiv+'.'+enabledCollapsedClass).not(currentItem).removeClass('active').children(collapsedDiv).slideUp();
      }
      if (currentItem.hasClass(enabledCollapsedClass)) {
        currentItem.toggleClass('active');// если нужно добавление класса уже после раскрытия/закрытия блока то переместить внутрь коллбека ниже
        currentItem.children(collapsedDiv).slideToggle(duration, () => {
          
        });
      }
    })
  }
}

function scrollTo(
    {
      selector = '', 
      animateSpeed = 300,
    } = {}
  ) {
  var $page = $('html, body');
  $(document).on('click', selector + ' a[href*="#"]', function() {
      $page.animate({
          scrollTop: $($.attr(this, 'href')).offset()?.top
      }, animateSpeed);
      return false;
  });
//  $(selector + ' a[href*="#"]').click(function() {
//      $page.animate({
//          scrollTop: $($.attr(this, 'href')).offset().top
//      }, animateSpeed);
//      return false;
//  });  
}

function onOffFlterSlider(selector) {
  let width = window.innerWidth;
  let obj = $(selector);
  if ((width <= 600) && !obj.hasClass('slick-initialized')) {
    $('.filter-of-type').slick({ // слайдер инстаграмм внизу главной страницы
      responsive: [
        {
          breakpoint: 601,
          settings: {
          dots: false,
          infinite: false,
          speed: 300,
          centerMode: false,
          variableWidth: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
          autoplay: false
          }
        },
      ]      
    });
  }
  if ((width > 600) && obj.hasClass('slick-initialized')) {
    obj.slick('unslick');
  }
}

function initAccordionOnTitle() {
  let width = window.innerWidth;
  if (width <= 1570) {
    console.log('init accord');
    accordion({
      selector: '.accordion-contents-list',
      btn: '.accordion-contents-list__title',
      itemDiv: '.accordion-contents-list__item',
      collapsedDiv: '.accordion-contents-list__collapsed-block',
      enabledCollapsedClass: 'accordion-contents-list__item--collapsed',
    });

  }
}

function eventResize(arrRunOfResize) {
  let width = window.innerWidth;		
  window.addEventListener('resize', () => {    
    onOffFlterSlider('.filter-of-type');
    setTimeout(initAccordionOnTitle, 300);
    setTimeout(stickyAside, 300);
  });
}

document.addEventListener( 'DOMContentLoaded', function() {
  headerEvenScroll();
  const da = new DynamicAdapt("max");  
  da.init();
  //dropControls();
  cusel({
    selector: '.header__lang.custom-select',
    selectPresent: true,
    autoCompleteHtml: false,
  });
  cusel({
    selector: '.header__bonuses.custom-select',
    selectPresent: false,
    autoCompleteHtml: false,
  });
  menuSlide();
  accordion({
    selector: '.faq-main__accordion',
    btn: '.accordion__title',
    collapsedDiv: '.accordion__collapsed-block',
  });
  accordion({
    selector: '._accordion',
    btn: '._accordion__btn',
    itemDiv: '._accordion__item',
    collapsedDiv: '._accordion__collapsed-block',
    enabledCollapsedClass: '_accordion__item--collapsed',
  });
  search();
  scrollTo({selector: '.contents-list__list'});

  eventResize();
  onOffFlterSlider('.filter-of-type');
  initAccordionOnTitle();
  focusSearch('.form-search-404 input[type=text]', '.form-search-404__submit');
  stickyAside();
});