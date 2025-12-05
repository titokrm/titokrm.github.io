/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
  function initGraphik(selectorGraphick) {
    let chartItem;
    let tooltipNode;
    let previousValue = null;
    let data = document.querySelector('.moonths__item.active .moonths__link') ? JSON.parse(document.querySelector('.moonths__item.active .moonths__link').dataset.data) : { labels: [], data: [] };
    let configChart = {
      type: 'line',
      data: {
        labels: data.labels,

        datasets: [{
          label: '',
          data: data.data,
          borderWidth: 1,
          backgroundColor: '#29c0d5',
          pointBackgroundColor: '#29B2B8', // цвет фона точек
          pointBorderColor: '#fff', // цвет обводки точек
          pointRadius: 0, // радиус точек
          pointHoverRadius: 7, // радиус точек при наведении
          fill: 'origin'
        }]
      },
      options: {
        elements: {
          line: {
            tension: 0.4
          }
        },
        aspectRatio: 1,
        // maintainAspectRatio: false,
        responsive: true,
        resizeDelay: 200,
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        scales: {
          x: {
            display: false,
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            display: false,
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: false,
          tooltip: {
            enabled: false, // отключаем встроенные tooltip'ы
            position: 'nearest',
            // eslint-disable-next-line no-use-before-define
            external: customTooltip
          }
        }
      }
    };
    let graphikNode = document.querySelector(selectorGraphick);

    function getRatioBlock(selector) {
      const block = document.querySelector(selector);
      block.querySelector('canvas').style.display = 'none';
      if (block) {
        let ratio = block.offsetWidth / block.offsetHeight;
        block.querySelector('canvas').style.display = 'block';
        return ratio;
      }
      return null;
    }

    function getOrientation() {
      if (window.matchMedia('(orientation: portrait)').matches) {
        return 'portrait';
      }
      return 'landscape';
    }

    let oldOrientation = getOrientation();

    function customTooltip(context) {
      const { chart, tooltip } = context;
      if (tooltip.opacity === 0) {
        tooltipNode.style.opacity = 0;

        // убрать если нет нужды обнулять показатель difference при покидании курсором области графика
        previousValue = null;
        document.getElementById('chart-difference').innerHTML = '';
        //--------------------------------------------------------------------------------------------

        return;
      }

      // Отображаем tooltip
      tooltipNode.style.opacity = 1;
      tooltipNode.style.top = tooltip.caretY + 'px';
      tooltipNode.style.left = tooltip.caretX + 'px';

      // Получаем данные для выбранной точки
      let label = tooltip.dataPoints[0].label;
      let value = oldOrientation === 'landscape' ? tooltip.dataPoints[0].parsed.y : tooltip.dataPoints[0].parsed.x;
      let valueText = tooltip.dataPoints[0].formattedValue;
      let deltaValue = previousValue ? value - previousValue : null;
      previousValue = value;

      // Обновляем содержимое tooltip
      document.getElementById('chart-label').innerHTML = label;
      document.getElementById('chart-value').innerHTML = valueText;
      if (deltaValue) {
        let differenceNode = document.getElementById('chart-difference');
        differenceNode.classList.remove('tooltip-chart__difference--negative');
        differenceNode.classList.remove('tooltip-chart__difference--positive');
        differenceNode.innerHTML = deltaValue;
        if (deltaValue < 0) {
          differenceNode.classList.add('tooltip-chart__difference--negative');
        }
        if (deltaValue > 0) {
          differenceNode.classList.add('tooltip-chart__difference--positive');
          differenceNode.innerHTML = '+' + deltaValue;
        }
      }
      let widthToolTip = tooltipNode.offsetWidth;
      tooltipNode.classList.remove('tooltip-chart--pull-right');
      tooltipNode.classList.remove('tooltip-chart--pull-left');
      if (tooltip.caretX + widthToolTip / 2 > tooltipNode.parentNode.offsetWidth) {
        tooltipNode.classList.add('tooltip-chart--pull-right');
      }
      if (tooltip.caretX - widthToolTip / 2 < 0) {
        tooltipNode.classList.add('tooltip-chart--pull-left');
      }
    }

    function startChart(ratio, selectorParent) {
      const ctx = document.querySelector(selectorParent + ' canvas');
      if (ratio && ctx) {
        // eslint-disable-next-line no-shadow
        configChart.options.aspectRatio = ratio;
        let chartItemInner = new Chart(ctx, configChart);
        return chartItemInner;
      }
      return null;
    }

    if (graphikNode) {
      let graphikHtml = `
      <canvas></canvas>
      <div class="tooltip-chart">
        <div class="tooltip-chart__row"><div class="tooltip-chart__title">Profit</div><div class="tooltip-chart__label" id="chart-label"></div></div><div class="tooltip-chart__row"><div class="tooltip-chart__value">$ <span id="chart-value"></span></div><div class="tooltip-chart__difference" id="chart-difference"></div></div>
      </div>`;
      graphikNode.innerHTML = graphikHtml;
      tooltipNode = graphikNode.querySelector('.tooltip-chart');

      oldOrientation = getOrientation();

      if (oldOrientation === 'landscape') {
        chartItem = startChart(getRatioBlock('.graphik__canvas'), '.graphik__canvas');
      }

      let oldSizeGraphik = {};

      oldSizeGraphik.width = graphikNode.offsetWidth;
      oldSizeGraphik.height = graphikNode.offsetHeight;

      window.addEventListener('resize', () => {
        if ((window.matchMedia('(orientation: portrait)').matches && oldOrientation === 'landscape') || (window.matchMedia('(orientation: landscape)').matches && oldOrientation === 'portrait')) {
          oldOrientation = getOrientation();

          if (oldOrientation === 'portrait') {
            chartItem.destroy();
          } else {
            setTimeout(() => {
              chartItem = startChart(getRatioBlock('.graphik__canvas'), '.graphik__canvas');
            }, 500);
          }
        } else if (getOrientation() === 'landscape' && (oldSizeGraphik.width !== graphikNode.offsetWidth || oldSizeGraphik.height !== graphikNode.offsetHeight)) {
          setTimeout(() => {
            chartItem.destroy();
            oldSizeGraphik.width = graphikNode.offsetWidth;
            oldSizeGraphik.height = graphikNode.offsetHeight;
            chartItem = startChart(getRatioBlock('.graphik__canvas'), '.graphik__canvas');
          }, 500);
        }
      });

      document.querySelector('.moonths').addEventListener('click', (event) => {
        let linkNode = event.target.closest('.moonths__link');
        if (linkNode) {
          event.preventDefault();
          linkNode.closest('.moonths').querySelector('.active').classList.remove('active');
          linkNode.parentNode.classList.add('active');
          data = JSON.parse(document.querySelector('.moonths__item.active .moonths__link').dataset.data);
          configChart.data.labels = data.labels;
          configChart.data.datasets[0].data = data.data;
          chartItem.update();
        }
      });
    }
  }

  function isMobileOS() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  const da = new DynamicAdapt('max');
  da.init();

  if (!isMobileOS()) {
    let scrollBlocks = document.querySelectorAll('.scroll');
    // eslint-disable-next-line no-new, no-unused-expressions
    scrollBlocks.length > 0 ? scrollBlocks.forEach(block => new SimpleBar(block, { autoHide: false })) : null;
  }

  menuSlide({
    changePosition: true,
    zIndexOverlay: 900
  });

  initGraphik('.graphik__canvas');

  let sliderSelector = '.deposits-slider__inner.swiper';

  function updateSwiper() {
    if (window.matchMedia('(orientation: portrait)').matches) {
      // Применить настройки для портретной ориентации
      swiper.params.slidesPerView = 1.3;
      swiper.params.spaceBetween = 8;
      console.log('ориентация - портрет.');
      if (window.matchMedia('(orientation: portrait) and (min-width: 560px)').matches) {
        swiper.params.spaceBetween = 15;
      }
      console.log('ориентация - альбомю ширина меньше 560px');
    } else {
      // Применить настройки для альбомной ориентации
      swiper.params.slidesPerView = 2.3;
      swiper.params.spaceBetween = 10;
      console.log('ориентация - альбом');
      if (window.matchMedia('(orientation: landscape) and (min-width: 110vh)').matches) {
        swiper.params.slidesPerView = 3.3;
        swiper.params.spaceBetween = 10;
        console.log('ориентация - альбомю ширина 110vh');
      }
      if (window.matchMedia('(orientation: landscape) and (min-width: 132vh)').matches) {
        swiper.params.slidesPerView = 4.3;
        swiper.params.spaceBetween = 12;
        console.log('ориентация - альбомю ширина 132vh');
      }
      if (window.matchMedia('(orientation: landscape) and (min-width: 155vh)').matches) {
        swiper.params.slidesPerView = 3.3;
        swiper.params.spaceBetween = 12;
        console.log('ориентация - альбомю ширина 155vh');
      }
      if (window.matchMedia('(orientation: landscape) and (min-width: 165vh)').matches) {
        swiper.params.slidesPerView = 4.3;
        swiper.params.spaceBetween = 12;
        console.log('ориентация - альбомю ширина 165vh');
      }
      if (window.matchMedia('(orientation: landscape) and (min-width: 210vh)').matches) {
        swiper.params.slidesPerView = 5.3;
        swiper.params.spaceBetween = 12;
        console.log('ориентация - альбомю ширина 210vh');
      }
    }

    swiper.update();
  }

  function checkSlideCount() {
    let slideCount = swiper.slides.length;
    let swiperContainer = document.querySelector(sliderSelector);

    if (slideCount < swiper.params.slidesPerView) {
      swiperContainer.classList.add('no-full');
    } else {
      swiperContainer.classList.remove('no-full');
    }
  }

  if (document.querySelector(sliderSelector) && !document.querySelector(sliderSelector).classList.contains('swiper-initialized')) {
    swiper = new Swiper(sliderSelector, {
      loop: false,
      navigation: {
        nextEl: '.deposits-slider__next-btn',
        prevEl: '.deposits-slider__prev-btn'
      },
      autoplay: false,
      grabCursor: true,
      spaceBetween: 8,
      slidesPerView: 1.3,
      on: {
        slideChange: function () {
          let swiperContainer = document.querySelector(sliderSelector);
          if (swiper.isEnd) {
            swiperContainer.classList.add('last-slide');
          } else {
            swiperContainer.classList.remove('last-slide');
          }
        },
        resize: () => {
          updateSwiper();
          checkSlideCount();
        }
      }
    });

    updateSwiper();
    checkSlideCount();
  }

  document.addEventListener('click', (event) => {
    let message = event.target.closest('.pop-up-window__wallet.wallet:not(.active)');
    if (message) {
      const messageAnimationTime = 500;
      message.classList.add('active');
      message.style = `--messageAnimateTime: ${messageAnimationTime}mS`;
      let textarea = document.createElement('textarea');
      textarea.style = 'position: absolute; opacity: 0;';
      textarea.value = message.querySelector('.wallet__address').innerText;
      message.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      message.removeChild(textarea);
    }
  });
});
