'use strict'
  function accordion({
    selector = '.accordion',
    btnSelector = '.accordion__title',
    itemSelector = '.accordion__item',
    collapsedSelector = '.accordion__collapsed-block',
    onlyOneOpen = false,        // если открытой может быть только одна секция
  } = {}) {
    if (document.querySelector(selector) && !document.querySelector(selector).classList.contains('_accordion-initializated')) {
      document.querySelector(selector).addEventListener('transitionend', (event) => {
        if (event.target.closest(collapsedSelector)) {
          if (event.target.style.height === '0px') {
            event.target.closest(itemSelector).classList.remove('active');
            event.target.classList.remove('active');
          } else {
            event.target.style.height = 'auto';
          }
        }
      });
      document.addEventListener('click', function(event) {
        if (event.target.closest(btnSelector)) {
          event.preventDefault();
          const parentElem = event.target.closest(itemSelector);
          const collapsedElem = parentElem.querySelector(collapsedSelector);          
          if (parentElem.classList.contains('active')) {
            collapsedElem.style.height = `${collapsedElem.scrollHeight}px`;
            window.getComputedStyle(collapsedElem, null).getPropertyValue("height");
            collapsedElem.style.height = '0';
          } else {
            let activeItem = document.querySelector(selector + ' ' + itemSelector + '.active');
            if (onlyOneOpen && activeItem) {              
              let activeItemColapsed = activeItem.querySelector(collapsedSelector);
              activeItemColapsed.style.height = `${activeItemColapsed.scrollHeight}px`;
              window.getComputedStyle(activeItemColapsed, null).getPropertyValue("height");
              activeItemColapsed.style.height = '0';
            }
            parentElem.classList.add('active');
            collapsedElem.classList.add('active');
            collapsedElem.style.height = `${collapsedElem.scrollHeight}px`;
          }
        }
      });
      document.querySelector(selector).classList.add('_accordion-initializated');
    }
  }

