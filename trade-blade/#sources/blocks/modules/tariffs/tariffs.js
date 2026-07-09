"use strict";
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
function getTabsElements(clickedBtn, tabsSelector, tabsItemWrapSelector) {
    // Собираем связанные элементы один раз, чтобы дальше не дублировать запросы к DOM.
    const tabsRoot = clickedBtn.closest(tabsSelector);
    const tabsItemWrap = tabsRoot
        ? tabsRoot.querySelector(tabsItemWrapSelector)
        : null;
    const tabsListItem = clickedBtn.parentNode;
    const tabsList = tabsListItem ? tabsListItem.parentNode : null;

    return {
        tabsRoot,
        tabsItemWrap,
        tabsListItem,
        tabsList,
    };
}

function updateActiveTabState(clickedBtn, tabsElements, tabsTabSelector) {
    // Переключаем активный пункт меню и активную вкладку, если пользователь нажал на неактивный таб.
    const { tabsItemWrap, tabsListItem, tabsList } = tabsElements;
    if (
        !tabsItemWrap ||
    !tabsListItem ||
    !tabsList ||
    tabsListItem.classList.contains("active")
    ) {
        return;
    }

    const currentActiveTabButton = tabsList.querySelector(".active");
    if (currentActiveTabButton) {
        currentActiveTabButton.classList.remove("active");
    }
    tabsListItem.classList.add("active");

    const tabItemSelector = clickedBtn.getAttribute("href");
    const nextTabItem = tabItemSelector
        ? tabsItemWrap.querySelector(tabItemSelector)
        : null;
    const currentActiveTabItem = tabsItemWrap.querySelector(
        tabsTabSelector + ".active",
    );

    if (currentActiveTabItem) {
        currentActiveTabItem.classList.remove("active");
    }
    if (nextTabItem) {
        nextTabItem.classList.add("active");
    }
}

function handleTabsClick(event, settings) {
    // Обрабатываем только клики по кнопкам вкладок, чтобы не ловить лишние события документа.
    const clickedBtn = event.target.closest(settings.tabsBtnSelector);
    if (!clickedBtn) {
        return;
    }

    event.preventDefault();
    const tabsElements = getTabsElements(
        clickedBtn,
        settings.tabsSelector,
        settings.tabsItemWrapSelector,
    );
    updateActiveTabState(clickedBtn, tabsElements, settings.tabsTabSelector);
}

function initTabs({
    tabsSelector = ".tabs",
    tabsBtnSelector = ".tabs__btn",
    tabsTabSelector = ".tabs__item",
    tabsItemWrapSelector = ".tabs__items-wrap",
} = {}) {
    // Храним настройки в одном объекте, чтобы обработчик оставался компактным и читаемым.
    const settings = {
        tabsSelector,
        tabsBtnSelector,
        tabsTabSelector,
        tabsItemWrapSelector,
    };

    document.addEventListener("click", (event) => {
        handleTabsClick(event, settings);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Инициализируем вкладки после построения DOM, чтобы все цели были доступны.
    initTabs();
});
