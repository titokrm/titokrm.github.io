'use strict'
/*
  Структура HTML для вкладок
    <div class="tabs">
      <ul class="tabs__list">
        <li class="tabs__list-item active">
          <a href="#fiat" class="tabs__btn">Tabs 1</a>
        </li>
        <li class="tabs__list-item">
          <a href="#crypto" class="tabs__btn">Tabs 2</a>
        </li>            
      </ul>
      <div class="tabs__items-wrap">
        <div class="tabs__item reserv-systems reserv-systems--fiat active" id="fiat">
        </div>
        <div class="tabs__item reserv-systems reserv-systems--crypto" id="crypto">
        </div>            
      </div>
    </div>
*/  
  function tabs({
    tabsSelector = '.tabs',
    tabsBtnSelector = '.tabs__btn',
    tabsTabSelector = '.tabs__item',
    tabsItemWrapSelector = '.tabs__items-wrap',
  } = {}) {
    const tabs = document.querySelector(tabsSelector);
    document.addEventListener('click', (event) => {
      if (event.target.closest(tabsBtnSelector)) {
        event.preventDefault();
        const clickedBtn = event.target.closest(tabsBtnSelector);
        const tabs = clickedBtn.closest(tabsSelector);
        const tabsItemWrap = tabs.querySelector(tabsItemWrapSelector);
        const tabsListItem = clickedBtn.parentNode;
        const tabsList = tabsListItem.parentNode;
        if (!tabsListItem.classList.contains('active')) {
          tabsList.querySelector('.active').classList.remove('active');
          tabsListItem.classList.add('active');
          const idTabItem = clickedBtn.getAttribute('href');
          const tabItem = tabsItemWrap.querySelector(idTabItem);
          tabsItemWrap.querySelector(tabsTabSelector + '.active').classList.remove('active');
          tabItem.classList.add('active');
        }
      }
    });
  }
