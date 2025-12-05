'use strict';

// eslint-disable-next-line no-unused-vars
function parallax({
  selector = '.parallax',
  koef = 6, // Коэффициент - во сколько раз меньше будет смещение картинки от перемещения мыши.
  // при 6 - макс перемещение будет 50% / 6 = 8.333% от ширины перемещаемого блока
  speed = 0.05, // скорость анимации
  paralaxY = true, // включить для координат Y
  paralaxX = true, // включить для координат X
  reverse = false // реверс направлений
} = {}) {
  const paralaxObj = document.querySelector(selector);

  let positionX = 0;
  let positionY = 0;
  let coordXprocent = 0;
  let coordYprocent = 0;

  function setMouseParallaxStyle() {
    const distX = coordXprocent - positionX;
    const distY = coordYprocent - positionY;

    positionX += distX * speed;
    positionY += distY * speed;

    let arrLayers = paralaxObj.querySelectorAll('[data-layer]');
    arrLayers.forEach((item) => {
      let layer = +item.dataset.layer;
      let mult;
      let offsetX;
      let offsetY;
      mult = layer * koef;
      if (paralaxX) {
        offsetX = positionX / mult;
      } else {
        offsetX = 0;
      }

      if (paralaxY) {
        offsetY = positionY / mult;
      } else {
        offsetY = 0;
      }
      if (reverse) {
        item.setAttribute(
          'style',
          `transform: translate(${offsetX * -1}%,${offsetY * -1}%`
        );
      } else {
        item.setAttribute(
          'style',
          `transform: translate(${offsetX}%,${offsetY}%`
        );
      }
    });

    requestAnimationFrame(setMouseParallaxStyle);
  }

  if (paralaxObj) {
    setMouseParallaxStyle();

    paralaxObj.addEventListener('mousemove', (event) => {
      const parallaxWidth = paralaxObj.offsetWidth;
      const parallaxHeight = paralaxObj.offsetHeight;

      // Ноль по середине
      const coordX = event.pageX - parallaxWidth / 2;
      const coordY = event.pageY - parallaxHeight / 2;
      // debugger;
      // Получаем проценты
      coordXprocent = (coordX / parallaxWidth) * 100;
      coordYprocent = (coordY / parallaxHeight) * 100;
    });
  }
}
