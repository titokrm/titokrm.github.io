(function($) {
  // функция вызова jQuery-плагина
  $.fn.parallax = function(options) {
    // опции 
    var config = $.extend({}, {
      koef: 6, 		// Коэффициент - во сколько раз меньше будет смещение картинки от перемещения мыши.
                    //при 6 - макс перемещение будет 50% / 6 = 8.333% от ширины перемещаемого блока
      speed: 0.05, // скорость анимации
      paralaxY: true, // включить для координат Y
      paralaxX: true, // включить для координат X
      reverse: false, // реверс направлений
    }, options);


    function main(e) {


      const paralaxObj = e;
      if (paralaxObj) {
        let positionX = 0, positionY = 0;
        let coordXprocent = 0, coordYprocent = 0;

        function setMouseParallaxStyle() {
          const distX = coordXprocent - positionX;
          const distY = coordYprocent - positionY;

          positionX = positionX + (distX * config.speed);
          positionY = positionY + (distY * config.speed);
          

          paralaxObj.find('[data-layer]').each(function(){
            let layer = +$(this).attr('data-layer'),
                mult, offsetX, offsetY;
            mult = layer * config.koef;
            if (config.paralaxX) {
              offsetX = (positionX / mult);
            } else {
              offsetX = 0;
            }

            if (config.paralaxY) {
              offsetY = (positionY / mult);
            } else {
              offsetY = 0;
            }
            if (config.reverse) {
              $(this).css('transform', `translate(${offsetX*-1}%,${offsetY*-1}%`);
            } else {
              $(this).css('transform', `translate(${offsetX}%,${offsetY}%`);
            }
            
          });

          requestAnimationFrame(setMouseParallaxStyle);
        }
        setMouseParallaxStyle();

        paralaxObj.on("mousemove", function (e) {
          // Получение ширины и высоты блока
          const parallaxWidth = paralaxObj.outerWidth();
          const parallaxHeight = paralaxObj.outerHeight();

          // Ноль по середине
          const coordX = e.pageX - parallaxWidth / 2;
          const coordY = e.pageY - parallaxHeight / 2;
          //debugger;
          // Получаем проценты
          coordXprocent = coordX / parallaxWidth * 100;
          coordYprocent = coordY / parallaxHeight * 100;
        });

      }
    }
    this.each(function() { main($(this)); });
    return this;
  };
})(jQuery);