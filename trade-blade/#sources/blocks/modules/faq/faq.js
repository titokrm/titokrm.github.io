"use strict";
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
function setCollapsedHeightToZero(collapsedElem) {
    // Чтобы CSS-анимация сработала корректно, сначала фиксируем текущую высоту,
    // затем принудительно читаем layout и только после этого сворачиваем в 0.
    collapsedElem.style.height = `${collapsedElem.scrollHeight}px`;
    window.getComputedStyle(collapsedElem, null).getPropertyValue("height");
    collapsedElem.style.height = "0";
}

function updateCollapsedBlockAfterTransition(
    event,
    collapsedSelector,
    itemSelector,
) {
    // После завершения transition чистим классы/высоту, чтобы следующий цикл открытия был предсказуемым.
    const collapsedElem = event.target.closest(collapsedSelector);
    if (!collapsedElem) {
        return;
    }

    if (event.target.style.height === "0px") {
        const accordionItem = event.target.closest(itemSelector);
        if (accordionItem) {
            accordionItem.classList.remove("active");
        }
        event.target.classList.remove("active");
        return;
    }

    event.target.style.height = "auto";
}

function closeCurrentActiveItemIfNeeded(settings) {
    // В режиме onlyOneOpen закрываем предыдущую секцию до открытия новой,
    // чтобы поведение аккордеона оставалось однозначным.
    if (!settings.onlyOneOpen) {
        return;
    }

    const activeItem = document.querySelector(
        settings.selector + " " + settings.itemSelector + ".active",
    );
    if (!activeItem) {
        return;
    }

    const activeCollapsedElem = activeItem.querySelector(
        settings.collapsedSelector,
    );
    if (!activeCollapsedElem) {
        return;
    }

    setCollapsedHeightToZero(activeCollapsedElem);
}

function updateAccordionState(parentElem, collapsedElem, settings) {
    // Переключаем секцию: либо закрываем текущую, либо открываем новую.
    if (parentElem.classList.contains("active")) {
        setCollapsedHeightToZero(collapsedElem);
        return;
    }

    closeCurrentActiveItemIfNeeded(settings);
    parentElem.classList.add("active");
    collapsedElem.classList.add("active");
    collapsedElem.style.height = `${collapsedElem.scrollHeight}px`;
}

function handleAccordionClick(event, settings) {
    // Обрабатываем только клики по заголовку аккордеона, остальное игнорируем.
    const clickedButton = event.target.closest(settings.btnSelector);
    if (!clickedButton) {
        return;
    }

    event.preventDefault();
    const parentElem = event.target.closest(settings.itemSelector);
    const collapsedElem = parentElem
        ? parentElem.querySelector(settings.collapsedSelector)
        : null;
    if (!parentElem || !collapsedElem) {
        return;
    }

    updateAccordionState(parentElem, collapsedElem, settings);
}

function initAccordion({
    selector = ".accordion",
    btnSelector = ".accordion__title",
    itemSelector = ".accordion__item",
    collapsedSelector = ".accordion__collapsed-block",
    onlyOneOpen = false,
} = {}) {
    // Собираем настройки в единый объект, чтобы передавать их в хелперы без дублирования.
    const settings = {
        selector,
        btnSelector,
        itemSelector,
        collapsedSelector,
        onlyOneOpen,
    };

    // Инициализируем модуль только один раз, чтобы не плодить подписки при повторных вызовах.
    const accordionRoot = document.querySelector(settings.selector);
    if (
        !accordionRoot ||
    accordionRoot.classList.contains("_accordion-initializated")
    ) {
        return;
    }

    accordionRoot.addEventListener("transitionend", (event) => {
        updateCollapsedBlockAfterTransition(
            event,
            settings.collapsedSelector,
            settings.itemSelector,
        );
    });

    document.addEventListener("click", (event) => {
        handleAccordionClick(event, settings);
    });

    accordionRoot.classList.add("_accordion-initializated");
}

document.addEventListener("DOMContentLoaded", () => {
    // Для FAQ оставляем поведение "открыта только одна секция", как в текущем UI.
    initAccordion({ onlyOneOpen: true });
});
