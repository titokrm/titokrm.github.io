  "use strict"
  function wave(mobWidth = 980) {
    let currentWidth = window.innerWidth;
    let mob = currentWidth <= mobWidth ? true : false;
    let svg = Snap('#svg');
    let innerBottom = Snap('#inner-bottom');
    let innerTop = Snap('#inner-top');
    let container = document.querySelector('.svg-animation');
    let viewBoxW = container.offsetWidth, viewBoxH = container.offsetHeight;
    let animateTime = 4000, numVisibleT = 1;
    let lenghtT = mob ? 2 * container.offsetWidth / (numVisibleT) : container.offsetWidth / (numVisibleT);
    let freq = lenghtT / (2 * Math.PI), widthPath = lenghtT * (numVisibleT + 2), oldRandTop, oldRandBottom, pathDTop, pathDBottom;
    function addSvg() {
      container.innerHTML = `
          <svg id=svg>
            <g id="inner-top"></g>
            <g id="inner-bottom"></g>
          </svg>
      `;
    }
    function removeSvg() {
      container.innerHTML = '';
    }
    function randomInteger(min, max, oldRand = null) {
      // случайное число от min до max
      let rand;
      do {
        rand = Math.floor(min + Math.random() * (max + 1 - min));
      } while (rand === oldRand);
      
      return rand;
    }


    let maxHeightWave = 0;
    function createWaveMenu() {
      let arrPath = [];

      if (mob) {
//        return
      }
      
      const svgMenuContainer = document.querySelector('.header__navigation-bg');
      const viewBoxW = svgMenuContainer.offsetWidth, viewBoxH = svgMenuContainer.offsetHeight;
      const svgMenuHtml = `
      <svg width="${viewBoxW}" height="${viewBoxH}" id="menu-bg">
        <g  width="${viewBoxW}" height="${viewBoxH}"></g>
        <g  width="${viewBoxW}" height="${viewBoxH}"></g>
        <g  width="${viewBoxW}" height="${viewBoxH}"></g>
        <g  width="${viewBoxW}" height="${viewBoxH}"></g>
        <g  width="${viewBoxW}" height="${viewBoxH}"></g>
      </svg>      
      `;
      svgMenuContainer.innerHTML = svgMenuHtml;
      let svgMenu = Snap('#menu-bg');
      svgMenu.attr({
        "style": `--tx: -${lenghtT}px; --dtx: -${lenghtT / 3}px; --t: ${animateTime}mS`,
      });      
      for (let i = 0; i < 5; i++) {
        let paths = getPathD(randomInteger(1, 4), 0, false);
        arrPath.push(paths[0]);
      }
      let heightWavesAll = 5 * (viewBoxH / 8) + maxHeightWave;
      let heightHeader = document.querySelector('header.header').offsetHeight;
      let paddingTop = ((heightHeader / 2)) + (viewBoxH - heightWavesAll) / 2;
//      console.log('heightAll=', heightWavesAll, 'maxHeight=', maxHeightWave, 'paddingTop = ', paddingTop, 'widthPath = ', widthPath, 'lenghtT = ', lenghtT);
      for (let i = 0; i < arrPath.length; i++) {
        let path = arrPath[i];
        let wrap = Snap(`g:nth-child(${i + 1})`);
        wrap.attr({
          "style": `transform: translate(${(i + 1) * (i + 1 < 5 ? -0.25 : 0) * lenghtT}px, ${(i) * (viewBoxH / 8) + paddingTop}px)`,
        });
        wrap.path(path).attr({
          "id": `wave-inner-${i + 1}`,
          "fill": "none",
          "stroke": "#590D56",
          "stroke-width": "1",
          "class": "header__mooving",
        });
      }
    }

    function destroyWaveMenu() {
      document.querySelector('.header__navigation-bg').innerHTML = '';
    }

    function createWave() {
      oldRandTop = randomInteger(0, 4);
      oldRandBottom = randomInteger(0, 4);
      [pathDTop, pathDBottom] = getPathD(oldRandTop, oldRandBottom);
      let pathTop = innerTop.path(pathDTop);
      let pathBottom = innerBottom.path(pathDBottom);
    
      pathTop.attr({
      "fill": "white",
      "stroke": "white",
      "stroke-width": "1",
      "opacity": "1",
      "class": "wave",
      });
      pathBottom.attr({
      "fill": "white",
      "stroke": "white",
      "stroke-width": "1",
      "opacity": "1",
      "class": "wave wave--bottom",
      });
      svg.attr({
        'viewBox': `0 0 ${viewBoxW} ${viewBoxH}`,
        "style": `--tx: -${lenghtT}px; --dtx: -${lenghtT / 3}px; --t: ${animateTime}mS`,
      });
      innerTop.attr({
        'width': viewBoxW,
        'height': viewBoxH,
        'class': 'top-inner'
      });
      innerBottom.attr({
        'width': viewBoxW,
        'height': viewBoxH,
        'class': 'bottom-inner'
      });
      return [pathTop, pathBottom];
    }

    function getPathD(ampTop, ampBottom, delta = true) {
      let pts = [];    
      //amp = amp * 5;
      mob ? ampTop *= viewBoxH * 0.0258 : ampTop *= viewBoxH * 0.0318;
      ampBottom *= 5;
      let deltaH = 0;
      if (delta) {
        deltaH = mob ? randomInteger(5, 15) * viewBoxH * 0.0258 : randomInteger(12, 15) * viewBoxH * 0.0127;
      }
      
      for (var x = 0; x <= widthPath; x += 10)
        pts.push([x, (Math.sin(x / freq) * ampTop + ampTop + deltaH).toFixed(1)]);

      maxHeightWave = pts[0][1];

      for (let i = 1; i < pts.length; i++) {
        let num = +pts[i][1];
        if (num > maxHeightWave) {
          maxHeightWave = num;
        }
      }

      let topPath = `M${pts.join('L')}${delta ? 'V0h' + -widthPath + 'z' : ''}`;
      pts.length = 0;
      if (delta) {
        deltaH = mob ? randomInteger(10, 12) * viewBoxH * 0.0258 : randomInteger(0, 6) * viewBoxH * 0.0127;
      } else deltaH = 0;
      
      for (var x = 0; x <= widthPath; x += 10)
        pts.push([x, (Math.sin(x / freq) * ampBottom + viewBoxH - ampBottom - deltaH).toFixed(1)]);
      let bottomPath = `M${pts.join('L')}V${viewBoxH}h-${widthPath}z`;
      return [topPath, bottomPath];
    }

    function animateWave() {
      oldRandTop = mob ? randomInteger(0, 5, oldRandTop) : randomInteger(3, 5, oldRandTop);
      oldRandBottom = randomInteger(0, 5, oldRandBottom);
      [pathDTop, pathDBottom] = getPathD(oldRandTop, oldRandBottom);
      pathTop.animate({
        'd': pathDTop,
      }, animateTime);
      pathBottom.animate({
        'd': pathDBottom,
      }, animateTime);
    }

    function reinitWave() {
        document.querySelector('.presentation__grid').removeEventListener('transitionend', reinitWave);
        currentWidth = window.innerWidth;
        mob = currentWidth <= mobWidth ? true : false;
        viewBoxW = container.offsetWidth;
        viewBoxH = container.offsetHeight;
        lenghtT = mob ? 2*container.offsetWidth / (numVisibleT) : container.offsetWidth / (numVisibleT);
        freq = lenghtT / (2 * Math.PI);
        widthPath = lenghtT * (numVisibleT + 2);
        oldRandTop = oldRandBottom = pathDTop = pathDBottom = undefined;
        addSvg();
        svg = Snap('#svg');
        innerBottom = Snap('#inner-bottom');
        innerTop = Snap('#inner-top');
        [pathTop, pathBottom] = createWave();
        animateWave();
        intervalId = setInterval(animateWave, animateTime);
    }
    let pathTop, pathBottom, intervalId, resizeFlag = true;
    document.addEventListener('menuShow', () => {
      createWaveMenu();
    });
    document.addEventListener('menuHide', () => {
      destroyWaveMenu();
    });
    new ResizeObserver(() => {
      if (pathTop === undefined) {
        [pathTop, pathBottom] = createWave();
        animateWave();
        intervalId = setInterval(animateWave, animateTime);
      } else {
        if (resizeFlag) {
          removeSvg();
          clearInterval(intervalId);
          setTimeout(() => {
            reinitWave();    
            resizeFlag = true;    
          }, 50);
          resizeFlag = false;
        }
      }
      //document.querySelector('.presentation__grid').addEventListener('transitionend', reinitWave);
    }).observe(document.querySelector('.svg-animation'));
    /*
    window.addEventListener('resize', () => {
      removeSvg();
      clearInterval(intervalId);
      console.log('ресайз. поймал обработчик события. path = ', pathTop);
      reinitWave();
      //setTimeout(() => {
      //document.querySelector('.presentation__grid').addEventListener('transitionend', reinitWave);
    });
    */
  }
