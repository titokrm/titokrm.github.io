/*********************************************************************/
//  для меню бургер и для отключ скролла с компенсацией ширины скролла 
// необходимо обертывание ВСЕГО содержимого body в .wrapper-global
/*********************************************************************/
// Заблокировать прокрутку страницы
function lockScroll(headerSelector = null, addHeaderPadding = false){
  let heightScreen = document.documentElement.clientHeight;
  let heightBodyInner = document.querySelector('.wrapper-global').offsetHeight;
	if (!body.classList.contains('scroll-lock') && heightBodyInner > heightScreen) {
    console.log('закрываем скролл');
    scrollLocked = true;    
		let bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		body.classList.add('scroll-lock');
		body.style.top = `-${bodyScrollTop}px`;
    body.dataset.scrollTop = bodyScrollTop;
    oldStyleHeader = document.querySelector(headerSelector).getAttribute('style');
    if (headerSelector !== null && addHeaderPadding) {
      document.querySelector(headerSelector).setAttribute('style', (oldStyleHeader === null ? '' : (oldStyleHeader + ';')) + `padding-right: ${scrollWidth}px`);
    }
	};
}

// Включить прокрутку страницы
function unlockScroll(headerSelector = null, addHeaderPadding = false){
  //debugger;
	if (body.classList.contains('scroll-lock')) {
		body.classList.remove('scroll-lock');
		body.style.top = null;
    let bodyScrollTop = +body.dataset.scrollTop;
    delete body.dataset.scrollTop;
		window.scroll(0, bodyScrollTop);
    setTimeout(() => {
      scrollLocked = false;
    }, 1);
    if (headerSelector !== null && addHeaderPadding) {
      document.querySelector(headerSelector).setAttribute('style', oldStyleHeader === null ? '' : oldStyleHeader);
    }    
	}
}

function getWidthScroll() {
  let div = document.createElement('div');

  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  document.body.append(div);
  let scrollWidth = div.offsetWidth - div.clientWidth;

  div.remove();
  return scrollWidth;
}

let body = document.getElementsByTagName('body')[0];
let scrollWidth = getWidthScroll();
let oldStyleHeader = '';
let scrollLocked = false;

/******************************************************************************/
// для поведения хедера в стиле адресной строки мобильных браузеров
// и для изменения св-в хедера при скролле 
/******************************************************************************/
function scrollBehaviorHeader(headerSelector = '.header', changePosition = false, changeVisible = false) {
  if (headerSelector !== null) {
    var lastPositionScrollTop = 0;
    $(window).scroll(function(){
    var nowPositionScrollTop = $(this).scrollTop();
    if (changePosition) {
      if (nowPositionScrollTop == 0) {
        $(headerSelector).removeClass('header--fixed');
      } else {
        $(headerSelector).addClass('header--fixed');
      }
    }
    if (changeVisible) {
      if ((nowPositionScrollTop > lastPositionScrollTop) && !scrollLocked){
          $(headerSelector).addClass('header--hidden');
      } else {
          $(headerSelector).removeClass('header--hidden');
      }
    }
    lastPositionScrollTop = nowPositionScrollTop;
    });
  }
}

function menuSlide({
  burger = 'js-show-menu',
  closeMenu = 'js-close-menu',
  menu = 'js-slideblock',
  overlay = 'menu__overlay',
  timeAnimate = 300,
  btnShowSecondLevelMenuSelector = null, //'.slideblock .menu-item-has-children > a',
  headerSelector = 'header.header', // селектор хедера
  changePosition = false, // нужно менять сво-ва хедера при скролле с нулевой позиции?
  changeVisible = false, // нужно поведение хедера в стиле адресной строки мобильных браузеров?
  addHeaderPadding = false // нужно добавлять padding-right хедеру для компенсации полосы прокрутки при postion: fixed?
} = {}) {
  $(document).on('click', '.' + burger, (event) => {
    event.preventDefault();    
    over = $('.' + menu).parent().prepend(`<div class="${overlay} ${closeMenu}" style="position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 40; background-color: #151C22; opacity: .6;"></div>`);
    console.log('Добавил оверлей ', over);    
    $('.' + menu).toggleClass('active');
    $('.' + overlay).toggleClass('active');
    lockScroll(headerSelector, addHeaderPadding);
  })
  $(document).on('click', '.' + closeMenu, (event) => {
    event.preventDefault();
    $('.' + menu).toggleClass('active');
    setTimeout(() => {
      $('.' + overlay).remove();
      unlockScroll(headerSelector, addHeaderPadding);
    }, timeAnimate);
  })
  if (btnShowSecondLevelMenuSelector !== null) {
    $(document).on('click', btnShowSecondLevelMenuSelector, function(event) {
      event.preventDefault();
      $(this).parent().toggleClass('active').children('.submenu').slideToggle(timeAnimate);
    })
  }
  if (changePosition || changeVisible) {
    scrollBehaviorHeader(headerSelector, changePosition, changeVisible);
  }
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
  function clickOptionEvent(event) {
    event.preventDefault();
    const innerHTML = $(this).html();
    const value = $(this).attr('data-val');
    const rootCusel = $(this).parents(selector);
    rootCusel.find(clickable).html(innerHTML);
    selectPresent ? rootCusel.find(`.${select}`).val(value).change() : null;
    rootCusel.removeClass('active');
    //unlockScroll('header.header');
    removeAllEvents();
  }
  function clickOverlay() {
    $(this).parents(selector).removeClass('active');
    //unlockScroll('header.header');
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
        
        if ($(this).attr('disabled') !== 'disabled') {
          innerHTML += `
                  <li class="custom-select__list-item">
                    <a href="#" class="custom-select__list-link ${$(this).filter(':selected').length > 0 ? ' custom-select__list-link--selected' : ''}" data-val="${$(this).val()}">
                      ${$(this).text()}
                    </a>
                  </li>
          `;          
        }
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
      //unlockScroll('header.header');
      removeAllEvents();
    } else {
      $(this).parents(selector).addClass('active');
      //lockScroll('header.header');
      $(document).on('keydown', pressKeyEvent);
      $(document).on('click', overlay, clickOverlay);
      $(document).on('click', optionLink, clickOptionEvent);
    }    
  });
}

function teleport() {
  /************************************************************************************/
  /*************************************************************************************
    Для работы необходимо у блока который должен менять свое расположение в DOM-модели 
    добавить атрибут data-tp вида 
      max-width > destination > min-width,order | [...] | [...] ...
    где:
      "destination" - уникальный селектор куда перемещать;
      "max-width" - max-width при которой этот блок будет в позиции "destination";
      "min-width" - min-width при которой этот блок будет в позиции "destination";
      "order" - порядковый номер в блоке назначения, может быть числом (нумерация с нуля)
      или "first"/"last"
    секции для каждого брекпойнта отделяются друг от друга символом "|"

  ***************************************************************************************/
  /**************************************************************************************/
  function parseRules(string, element, rules) {
    let bpRules = string.split('|');
    
    bpRules.forEach((bpRule) => {
      let rule = bpRule.trim().split(',');
      let media = rule[0].split('>');
      
      rules.push({
        element: element,
        media: media.length > 2 ? `(max-width: ${media[0].trim()}px) and (min-width: ${media[2].trim()}px)` : `(min-width: ${media[1].trim()}px)`,
        destination: media.length > 2 ? media[1].trim() : media[0].trim(),
        order: rule[1].trim()
      });
    });
  }
  function mediaHandler(rules, event = null) {
    rules.forEach((itemRules) => {
      if (event !== null ? itemRules.media === event.media && event.matches : window.matchMedia(itemRules.media).matches) {
//        console.log('ордер = ', +itemRules.order, ' кол-во детей объекта назначения = ', document.querySelector(itemRules.destination).children.length);
        
        if (itemRules.order === 'last' || +itemRules.order >= document.querySelector(itemRules.destination).children.length) {
//          console.log('медиа = ', itemRules.media, ' перемещаем - ', document.querySelector(itemRules.element), ' append в ', document.querySelector(itemRules.destination));
          document.querySelector(itemRules.destination).append(document.querySelector(itemRules.element));
          return;
        }
        if (itemRules.order === 'first') {
//          console.log('медиа = ', itemRules.media, ' перемещаем - ', document.querySelector(itemRules.element), ' prepend в ', document.querySelector(itemRules.destination));
          document.querySelector(itemRules.destination).prepend(document.querySelector(itemRules.element));    
          return;
        }
//        console.log('медиа = ', itemRules.media, ' перемещаем - ', document.querySelector(itemRules.element), ` before №${itemRules.order} в `, document.querySelector(itemRules.destination));
        document.querySelector(itemRules.destination).children[+itemRules.order].before(document.querySelector(itemRules.element));
      }
    });
  }

  const newId = () => +String(performance.now()).replace('.', '') + Date.now();

  let arrayElementsTeleport = [...document.querySelectorAll('[data-tp]')];
  let rules = [];

  arrayElementsTeleport.forEach((item) => {
    let hash = 'tp-' + newId();
    item.classList.add(hash);
    hash = '.' + hash;
    parseRules(item.dataset.tp, hash, rules);
  });
  
  let bpSet = new Set();

  rules.forEach((itemRules) => {
    bpSet.add(itemRules?.media);
  });

  let bp = Array.from(bpSet);
  
  bp.forEach((media) => {
    let matchMedia = window.matchMedia(media);
    matchMedia.addEventListener('change', (event) => {
      mediaHandler(rules, event);
    });
  });
  mediaHandler(rules);
}

document.addEventListener( 'DOMContentLoaded', function() {
  const da = new DynamicAdapt("max");  
  //da.init();
  teleport();
  menuSlide({
    changeVisible: true,
    addHeaderPadding: true,
  });
  cusel();
  $(document).on('click', '.btn--file', function(event) {
    event.preventDefault();
    $(this).parent().find('input[type="file"]').trigger('click');
  });
  $( ".slider" ).slider({
    change: function( event, ui ) {
      let value = $(this).slider('value');
      $(this).parents('.form-field--for-slider').find('.form-field__value span').text(value);
    }
  });
});