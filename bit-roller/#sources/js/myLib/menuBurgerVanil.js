/* ********************************************************************* */

// фикс для ?. - работоспособность проверена в старых сафари
// меню должно иметь примерно такой вид, блок .js-slideblock в моб виде будет ездить
//      <header class="header">
//        <nav class="header__nav menu js-slideblock">
//          <button class="js-close-menu menu__close"><img src="images/icon-close.svg" alt=""></button>
//          <ul class="menu__list">
//            <li class="active"><a href="#">Бизнес</a></li>
//            <li><a href="#">О нас</a></li>
//            <li><a href="#">Цены</a></li>
//            <li><a href="#">Оформить заказ</a></li>
//          </ul>
//        </nav>
//        <button class="js-show-menu header__burger"><img src="images/icon-burger.svg" alt=""></button>
//      </header>
//  для меню бургер и для отключ скролла с компенсацией ширины скролла
// необходимо обертывание ВСЕГО содержимого body в .wrapper-global
// после нажатия на бургер -- генерится событие menuShow (можно использовать для индикации того что меню только что открылось)
// после того как меню полностью закрылось -- генерится событие menuHide (можно использовать для скролла к нужному месту, т.к. в обратном случае скролл перебивается ф-цией unlockScroll)
/*
/* v. 3.3
/*
/* Автор Титок Р.М. titokr@gmail.com
/******************************************************************** */

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
// let mobWidth = 980;
let scrollLocked = false;
let lastPositionScrollTop = 0;
let nowPositionScrollTop = window.scrollY;

// Заблокировать прокрутку страницы
function lockScroll(headerSelector = null, addHeaderPadding = false) {
  let heightScreen = document.documentElement.clientHeight;
  let heightBodyInner = document.querySelector('.wrapper-global').offsetHeight;
  if (
    !body.classList.contains('scroll-lock')
    && heightBodyInner > heightScreen
  ) {
    //    console.log('закрываем скролл');
    scrollLocked = true;
    let bodyScrollTop = typeof window.pageYOffset !== 'undefined'
      ? window.pageYOffset
      : (
        document.documentElement
            || document.body.parentNode
            || document.body
      ).scrollTop;
    body.classList.add('scroll-lock');
    body.style.top = `-${bodyScrollTop}px`;
    body.dataset.scrollTop = bodyScrollTop;
    oldStyleHeader = document.querySelector(headerSelector)
      ? document.querySelector(headerSelector).getAttribute('style')
      : undefined;
    if (
      headerSelector !== null
      && addHeaderPadding /* && window.innerWidth <= mobWidth */
    ) {
      if (document.querySelector(headerSelector)) {
        document
          .querySelector(headerSelector)
          .setAttribute(
            'style',
            (oldStyleHeader === null ? '' : oldStyleHeader + ';')
            + `padding-right: ${scrollWidth}px`
          );
      }
    }
  }
}

// Включить прокрутку страницы
function unlockScroll(headerSelector = null, addHeaderPadding = false) {
  // debugger;
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
      if (document.querySelector(headerSelector)) {
        document
          .querySelector(headerSelector)
          .setAttribute(
            'style',
            oldStyleHeader === null ? '' : oldStyleHeader
          );
      }
    }
  }
}

/** *************************************************************************** */
// для поведения хедера в стиле адресной строки мобильных браузеров
// и для изменения св-в хедера при скролле
/** *************************************************************************** */
function scrollBehaviorHeader(
  headerSelector = '.header',
  changePosition = false,
  changeVisible = false
) {
  function actions() {
    lastPositionScrollTop = 0;
    nowPositionScrollTop = window.scrollY;

    if (changePosition) {
      if (nowPositionScrollTop === 0 && !scrollLocked) {
        document
          .querySelector(headerSelector)
          .classList.remove('header--mooved');
      } else {
        document.querySelector(headerSelector).classList.add('header--mooved');
      }
    }
    if (changeVisible) {
      if (nowPositionScrollTop > lastPositionScrollTop && !scrollLocked) {
        if (typeof changeVisible !== 'boolean') {
          if (changeVisible <= nowPositionScrollTop) {
            document
              .querySelector(headerSelector)
              .classList.add('header--hidden');
          }
        } else {
          document
            .querySelector(headerSelector)
            .classList.add('header--hidden');
        }
      } else {
        document
          .querySelector(headerSelector)
          .classList.remove('header--hidden');
      }
    }
  }
  if (headerSelector !== null) {
    lastPositionScrollTop = nowPositionScrollTop;
    actions();
    window.addEventListener('scroll', () => {
      nowPositionScrollTop = window.scrollY;
      actions();
      lastPositionScrollTop = nowPositionScrollTop;
    });
  }
}

function menuSlide({
  burger = 'js-show-menu', // класс для кнопки бургер
  closeMenu = 'js-close-menu', // класс для кнопки закрытия меню
  toggleMenu = 'js-toggle-menu', // класс для кнопки открытия/закрытия меню
  menu = 'js-slideblock', // класс для выезжающего блока
  overlay = 'menu__overlay', // класс для оверлея меню
  btnShowSecondLevelMenuSelector = null, // если не нужно показывание второго уровна то null, иначе
  // селектор для элемента-кнопки
  // к примеру '.slideblock .menu-item-has-children > a',
  headerSelector = 'header.header', // селектор хедера
  changePosition = false, // нужно менять сво-ва хедера при скролле с нулевой позиции?
  changeVisible = false, // нужно поведение хедера в стиле адресной строки мобильных браузеров? можна задать смещение от верха когда такое поведение будет включаться
  mobWidthSetting = 980,
  addHeaderPadding = false, // нужно добавлять padding-right хедеру для компенсации полосы прокрутки
  // при postion: fixed?
  closeOnResize = true, // закрывать меню при ресайзе экрана
  addClassHeaderActive = false, // добавлять класс к хедеру при активном меню (значение параметра = классу)
  zIndexOverlay = 2001 // z-index для затенения (.overlay)
} = {}) {
  // mobWidth = mobWidthSetting;
  document
    .querySelector('.' + menu)
    .addEventListener('transitionend', (event) => {
      if (event.target.closest('.submenu')) {
        let objSubmenu = event.target;
        if (objSubmenu.style.height === '0px') {
          objSubmenu.closest('li').classList.remove('active');
          objSubmenu.classList.remove('active');
        } else {
          objSubmenu.style.height = 'auto';
        }
      }
      if (event.target.closest('.' + menu)) {
        if (
          event.target.classList.contains(menu)
          && !event.target.classList.contains('active')
        ) {
          if (document.querySelector('.' + overlay)) {
            document.querySelector('.' + overlay).remove();
          }
          unlockScroll(headerSelector, addHeaderPadding);
          if (addClassHeaderActive) {
            document
              .querySelector(headerSelector)
              .classList.remove(addClassHeaderActive);
          }
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('menuHide'));
          }, 0);
        }
      }
    });
  document.addEventListener('click', (event) => {
    if (
      !document.querySelector('.' + menu).classList.contains('active')
      && (event.target.closest('.' + burger)
        || event.target.closest('.' + toggleMenu))
    ) {
      event.preventDefault();
      document.dispatchEvent(new CustomEvent('menuShow'));
      const overlayDiv = document.createElement('div');
      overlayDiv.classList = `${overlay} ${closeMenu}`;
      overlayDiv.style = `position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: ${zIndexOverlay}; background-color: #000; opacity: .6;`;
      const menuDiv = document.querySelector('.' + menu);
      menuDiv.parentNode.prepend(overlayDiv);
      menuDiv.classList.toggle('active');
      if (event.target.closest('.' + toggleMenu)) {
        document.querySelector('.' + toggleMenu).classList.add('active');
        event.stopImmediatePropagation();
      }
      lockScroll(headerSelector, addHeaderPadding);
      if (addClassHeaderActive) {
        document
          .querySelector(headerSelector)
          .classList.add(addClassHeaderActive);
      }
    }
  });
  document.addEventListener('click', (event) => {
    if (
      document.querySelector('.' + menu).classList.contains('active')
      && (event.target.closest('.' + closeMenu)
        || event.target.closest('.' + toggleMenu))
    ) {
      event.preventDefault();
      const menuDiv = document.querySelector('.' + menu);
      menuDiv.classList.toggle('active');
      if (event.target.closest('.' + toggleMenu) || event.target.closest('.' + overlay)) {
        // eslint-disable-next-line no-unused-expressions
        document.querySelector('.' + toggleMenu) ? document.querySelector('.' + toggleMenu).classList.remove('active') : null;
        event.stopImmediatePropagation();
      }
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      if (document.querySelector('.' + menu).classList.contains('active')) {
        event.preventDefault();
        const menuDiv = document.querySelector('.' + menu);
        menuDiv.classList.toggle('active');
        const togleBtn = document.querySelector('.' + toggleMenu);
        if (togleBtn) {
          togleBtn.classList.remove('active');
        }
      }
    }
  });

  if (btnShowSecondLevelMenuSelector !== null) {
    document.addEventListener('click', (event) => {
      if (event.target.closest(btnShowSecondLevelMenuSelector)) {
        event.preventDefault();
        const parentElemLi = event.target.closest('li');
        const subMenuEl = parentElemLi.querySelector('.submenu');
        if (parentElemLi.classList.contains('active')) {
          subMenuEl.style.height = `${subMenuEl.scrollHeight}px`;
          window.getComputedStyle(subMenuEl, null).getPropertyValue('height');
          subMenuEl.style.height = '0';
        } else {
          parentElemLi.classList.add('active');
          subMenuEl.classList.add('active');
          subMenuEl.style.height = `${subMenuEl.scrollHeight}px`;
        }
      }
    });
  }
  if (changePosition || changeVisible) {
    scrollBehaviorHeader(headerSelector, changePosition, changeVisible);
  }
  if (closeOnResize) {
    window.addEventListener('resize', () => {
      if (document.querySelector('.' + menu).classList.contains('active')) {
        const menuDiv = document.querySelector('.' + menu);
        menuDiv.classList.toggle('active');
        if (document.querySelector('.' + toggleMenu)) {
          document.querySelector('.' + toggleMenu).classList.remove('active');
        }
        if (document.querySelector('.' + overlay)) {
          document.querySelector('.' + overlay).remove();
        }
        unlockScroll(headerSelector, addHeaderPadding);
      }
    });
  }
}
