'use strict'
/*--------------------------------------------------------------
.accordion__collapsed-block {
  height: 0;
  overflow: hidden;
  transition: height $animate-time ease-in-out;    
}

Вот такая структура должна быть у html (* - отмечены обязательные блоки)

*           <div class="text-n-picture__text accordion">
*             <div class="accordion__item ">
*               <div class="accordion__title">
                  <span>What is an affiliate program?</span>
                  <div class="accordion__btn">
                    <svg class="icon icon--plus" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <use xlink:href="images/sprite.svg#plus"></use>
                    </svg>
                    <svg class="icon icon--minus" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <use xlink:href="images/sprite.svg#minus"></use>
                    </svg>
                  </div>
                </div>            
*               <div class="accordion__collapsed-block">
                  <div class="accordion__text">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Est modi corrupti atque nihil velit dolor ad provident reiciendis sit at ipsum inventore sed incidunt eos veritatis quibusdam nam obcaecati, consequuntur, odit quisquam necessitatibus perferendis. Eveniet recusandae hic voluptatem voluptates quaerat.</p>
                  </div>
                </div>            
              </div>
            </div>

можно установить чтобы открывалось при клике только на кнопку .accordion__btn (параметр 
btnSelector в конфиге)
----------------------------------------------------------------------*/
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

