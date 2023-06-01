'use strict'
function cusel({
  selector = '.custom-select', // селектор корневого э-та-обертки у cusel
  overlay = '.custom-select__overlay', // затемняющая подложка 
  clickable = '.custom-select__clickable', // кликабельный блок который и заменяет собой закрытый селект
  optionLink = '.custom-select__list-item a', // ссылка в выпающем списке "option"
  selectPresent = true, // нужен ли спрятанный select внутри 
  defSelectForMob = 767, // показывать дефолтный селект для мобильных (false или максимальный размер меньшей из сторон у-ва при котором показвать дефолтный селект)
  autoCompleteHtml = true, // если выпадайка просто список ссылок без ухищрений
  select = 'custom-select__select', // класс у внутреннего спрятанного select (если selectPresent = true)
  optionItem = '.custom-select__list-item',
  optionItemSelectedClass = 'selected'
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
//    который потом развернется в такую конструкцию которую нужно стилизовать (стили в ../scss/lib/_cusel.scss)
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
    rootCusel.find(optionItem + '.' + optionItemSelectedClass).removeClass(optionItemSelectedClass);
    const itemSelected = $(this).parent(optionItem);
    itemSelected.addClass(optionItemSelectedClass);
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
  function defaultSelectForMob() {
    let size = Math.min(window.innerWidth, window.innerHeight);
    
    if (defSelectForMob && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && size <= defSelectForMob) {
      return true;
    }
    return false;
  }
  if (autoCompleteHtml && selectPresent) {
    $(document).find(selector).each(function() {
      let selectObj = $(this).find('select');
      if (defaultSelectForMob()) {
        selectObj.removeClass(select);
        selectObj.addClass(clickable.slice(1) + ' ' + clickable.slice(1) + '--select');
      } else {
        selectObj.addClass(select);
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
      }
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