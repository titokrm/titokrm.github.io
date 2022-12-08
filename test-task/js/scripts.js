/*********************************************************************/
//  для меню бургер и для отключ скролла с компенсацией ширины скролла 
/*********************************************************************/
// Заблокировать прокрутку страницы
function lockScroll(headerSelector = null){
	if (!body.classList.contains('scroll-lock')) {
		let bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		body.classList.add('scroll-lock');
		body.style.top = `-${bodyScrollTop}px`;
    body.dataset.scrollTop = bodyScrollTop;
    if (headerSelector !== null) {
      oldStyle = document.querySelector(headerSelector).getAttribute('style');
      oldStyle === null ? oldStyle = '' : oldStyle += ';';
      document.querySelector(headerSelector).setAttribute('style', oldStyle + `padding-right: ${scrollWidth}px`);
    }
	};
}

// Включить прокрутку страницы
function unlockScroll(headerSelector = null){
  //debugger;
	if (body.classList.contains('scroll-lock')) {
		body.classList.remove('scroll-lock');
		body.style.top = null;
    let bodyScrollTop = +body.dataset.scrollTop;
    delete body.dataset.scrollTop;
		window.scroll(0, bodyScrollTop);
    if (headerSelector !== null) {
      document.querySelector(headerSelector).setAttribute('style', oldStyle);
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
let oldStyle = '';

function menuSlide({
  burger = 'js-show-menu',
  closeMenu = 'js-close-menu',
  menu = 'js-slideblock',
  overlay = 'menu__overlay',
  timeAnimate = 300,
  btnShowSecondLevelMenuSelector = '.slideblock .menu-item-has-children > a',
  headerSelector = null,
} = {}) {
  $(document).on('click', '.' + burger, (event) => {
    event.preventDefault();    
    over = $('.' + menu).parent().prepend(`<div class="${overlay} ${closeMenu}" style="position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 40; background-color: #151C22; opacity: .6;"></div>`);
    console.log('Добавил оверлей ', over);    
    $('.' + menu).toggleClass('active');
    $('.' + overlay).toggleClass('active');
    lockScroll(headerSelector);
  })
  $(document).on('click', '.' + closeMenu, (event) => {
    event.preventDefault();
    $('.' + menu).toggleClass('active');
    setTimeout(() => {
      $('.' + overlay).remove();
      unlockScroll(headerSelector);
    }, timeAnimate);
  })
  $(document).on('click', btnShowSecondLevelMenuSelector, function(event) {
    event.preventDefault();
    $(this).parent().toggleClass('active').children('.submenu').slideToggle(timeAnimate);
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

document.addEventListener( 'DOMContentLoaded', function() {
  const da = new DynamicAdapt("max");  
  da.init();
  menuSlide({headerSelector: 'header.header'});
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