'use strict'
/*--------------------------------------------------------------------
требуется плагин-полифил bundle.min.js https://github.com/magic-akari/seamless-scroll-polyfill/tree/b3b3f70b146ba7a907d3128755ec3f694d23119a

Вот такая структура должна быть у html (* - отмечены обязательные блоки)
    <ul class="fast-nav">
      <li class="fast-nav__item active"><a class="fast-nav__link" href="#Definitions">Definitions</a></li>
      <li class="fast-nav__item"><a class="fast-nav__link" href="#English-language">English language</a></li>
      <li class="fast-nav__item"><a class="fast-nav__link" href="#mod-terms">Modification of Terms & Conditions</a></li>
    </ul>

--------------------------------------------------------------------*/
  let scrollNow = false;
  let intervalId;
  let targetsArr = [];

  function fastNav({
    fastNavSelector = '.fast-nav',
    fastNavItemSelector = '.fast-nav__item',
    headerSelector = 'header.header',
    headerDinamic = false, // если поведение хедера в стиле панелей моб сафари, то true
  } = {}) {
    const anchors = document.querySelectorAll(fastNavSelector + ' a[href*="#"]');

    function scrollBehaviorFastnav() {
      scrollNow = true;
      let result = false;
      targetsArr.forEach((elem) => {
        result = true;
        const posTop = elem.getBoundingClientRect().top;
        if (posTop <= document.querySelector(headerSelector).offsetHeight + 1) {
          let selectorLinkId = fastNavSelector + ' a[href="#' + elem.id + '"]';
          const href = document.querySelector(selectorLinkId);
          const itemNav = href.closest(fastNavItemSelector);
          if (!itemNav.classList.contains('active')) {
            document.querySelector(fastNavSelector + ' .active').classList.remove('active');
            itemNav.classList.add('active');
          }
        }
        elem.classList.toggle('visible', posTop <= 0);
      })
      return result;
    }

    for (let anchor of anchors) {
      targetsArr.push(document.getElementById(anchor.getAttribute('href').substring(1)));
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        let href = anchor.getAttribute('href').substring(1);
        const scrollTarget = document.getElementById(href);
        let offsetPosition = scrollTarget.getBoundingClientRect().top;
        if (headerDinamic) {
          if (offsetPosition < 0) {
            offsetPosition = offsetPosition - document.querySelector(headerSelector).offsetHeight;
          }
        } else {
          offsetPosition = offsetPosition - document.querySelector(headerSelector).offsetHeight;
        }
        seamless.scrollBy(window, { behavior: "smooth", top: offsetPosition});
        scrollNow = false;
        intervalId = setInterval(() => {
          if (scrollNow) {
            scrollNow = false;
          } else {
            e.target.closest(fastNavSelector).querySelector('.active').classList.remove('active');
            e.target.closest(fastNavItemSelector).classList.add('active');
            clearInterval(intervalId);
          }
        }, 50);
      })    
    }
    if (scrollBehaviorFastnav()) {
      document.addEventListener('scroll', scrollBehaviorFastnav);
    }
  }

