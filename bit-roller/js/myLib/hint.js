'use strict'
/************************************************************* */
/* скрипт всплывающей подсказки (требуется также подключение стилей _hint.scss)
/* в зависимости от близости к границе экрана подсказка будет смещаться
/* относительно курсора влево/вправо/вниз со смещением и треугольника :before
/* в противоположную сторону с  помощью добавления класса hint--pull-left/right/down
/*
/* Автор Титок Р.М. titokr@gmail.com
/************************************************************* */


function hint({
  classNameHint = 'hint', // имя класса для всплывающего блока-подсказки
  attributeNameHint = 'data-texthint', // параметр у ссылки содержимое которого при ховере выводится в подсказке
} = {}) {
  let hintBlock = null;
  
  function createHintBlock() {
    hintBlock = document.createElement('div');
    hintBlock.className = classNameHint;
    document.body.appendChild(hintBlock);
  }
  
  function updateHintBlock(event, tach = false) {
    let target = event.target;
    let textHint = target.getAttribute(attributeNameHint);
    
    if (!hintBlock) {
      createHintBlock();
    }
    // внутренний html подсказки    
    hintBlock.innerHTML = `<span class="${classNameHint}__inner">${textHint}</span>`;
    
    let mouseX = tach ? event.touches[0].clientX : event.clientX;
    let mouseY = tach ? event.touches[0].clientY : event.clientY;
    let viewportWidth = window.innerWidth;
    let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    let blockWidth = hintBlock.offsetWidth;
    let blockHeight = hintBlock.offsetHeight;    
    let left, top;
    let hintBlockEm = parseInt(window.getComputedStyle(hintBlock).getPropertyValue('font-size'), 10);

    if (mouseY - (blockHeight + hintBlockEm) < 0) {
      top = mouseY + (tach ? hintBlockEm * 2 : hintBlockEm);
      hintBlock.classList.add(`${classNameHint}--pull-down`);
    } else {
      top = mouseY - (blockHeight + (tach ? hintBlockEm * 2 : hintBlockEm));
      hintBlock.classList.remove(`${classNameHint}--pull-down`);
    }
    
    if (mouseX + blockWidth / 2 > viewportWidth - scrollBarWidth) {
      console.log(mouseX - blockWidth + hintBlockEm, ' ', viewportWidth - (blockWidth +scrollBarWidth));
      left = (mouseX - blockWidth + hintBlockEm > viewportWidth - (blockWidth +scrollBarWidth)) ? viewportWidth - (blockWidth + scrollBarWidth) : mouseX - blockWidth + hintBlockEm;
      hintBlock.classList.add(`${classNameHint}--pull-left`);
      hintBlock.classList.remove(`${classNameHint}--pull-right`);
    } else if (mouseX - blockWidth / 2 < 0) {
      left = mouseX - hintBlockEm < 0 ? 0 : mouseX - hintBlockEm;
      hintBlock.classList.add(`${classNameHint}--pull-right`);
      hintBlock.classList.remove(`${classNameHint}--pull-left`);
    } else {
      left = mouseX - blockWidth / 2;
      hintBlock.classList.remove(`${classNameHint}--pull-right`);
      hintBlock.classList.remove(`${classNameHint}--pull-left`);
    }
    
    hintBlock.style.left = left + 'px';
    hintBlock.style.top = top + 'px';

  }
  
  function removeHintBlock() {
    if (hintBlock) {
      document.body.removeChild(hintBlock);
      hintBlock = null;
    }
  }
  
  document.addEventListener('mouseover', function(event) {
    if (event.target.hasAttribute(attributeNameHint)) {
      updateHintBlock(event);
    }
  });
  
  document.addEventListener('mouseout', function(event) {
    if (event.target.hasAttribute(attributeNameHint)) {
      removeHintBlock();
    }
  });
  
  document.addEventListener('mousemove', function(event) {
    if (hintBlock) {
      updateHintBlock(event);
    }
  });

  document.addEventListener('touchstart', function(event) {
    if (event.target.hasAttribute(attributeNameHint)) {
      event.preventDefault(); // Остановка события для предотвращения прокрутки
      updateHintBlock(event, true);
    }
  }, {passive: false});

  document.addEventListener('touchend', function(event) {
    if (event.target.hasAttribute(attributeNameHint)) {
      removeHintBlock();
    }
  });

  document.addEventListener('touchmove', function(event) {
    if (hintBlock && event.target.hasAttribute(attributeNameHint)) {
      event.preventDefault(); // Остановка события для предотвращения прокрутки
      updateHintBlock(event, true);
    }
  }, {passive: false});

}

/************************************************************* */
