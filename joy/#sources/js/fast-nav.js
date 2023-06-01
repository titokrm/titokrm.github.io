'use strict'
  let scrollNow = false;
  let intervalId;
  let targetsArr = [];

  function fastNav({
    fastNavSelector = '.fast-nav',
    fastNavItemSelector = '.fast-nav__item',
    headerSelector = 'header.header'
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
          offsetPosition = offsetPosition - document.querySelector(headerSelector).offsetHeight;
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

