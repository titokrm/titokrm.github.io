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
  const paralaxObj = $(selector);
  if (paralaxObj) {
    let positionX = 0;
    let positionY = 0;
    let coordXprocent = 0;
    let coordYprocent = 0;

    function setMouseParallaxStyle() {
      const distX = coordXprocent - positionX;
      const distY = coordYprocent - positionY;

      positionX = positionX + distX * speed;
      positionY = positionY + distY * speed;

      paralaxObj.find('[data-layer]').each(function () {
        let layer = +$(this).attr('data-layer'),
          offsetX,
          offsetY;
        let mult = layer * koef;
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
          $(this).css(
            'transform',
            `translate(${offsetX * -1}%,${offsetY * -1}%`
          );
        } else {
          $(this).css('transform', `translate(${offsetX}%,${offsetY}%`);
        }
      });

      requestAnimationFrame(setMouseParallaxStyle);
    }
    setMouseParallaxStyle();

    paralaxObj.on('mousemove', function (e) {
      // Получение ширины и высоты блока
      const parallaxWidth = paralaxObj.outerWidth();
      const parallaxHeight = paralaxObj.outerHeight();

      // Ноль по середине
      const coordX = e.pageX - parallaxWidth / 2;
      const coordY = e.pageY - parallaxHeight / 2;
      //debugger;
      // Получаем проценты
      coordXprocent = (coordX / parallaxWidth) * 100;
      coordYprocent = (coordY / parallaxHeight) * 100;
    });
  }
}
