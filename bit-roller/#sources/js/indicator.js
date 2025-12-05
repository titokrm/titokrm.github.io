"use strict";
  let indicator = document.createElement('div');
  let visible = false;
  indicator.className = 'my-resolutions';
  //indicator.textContent = '0.00';
  document.body.append(indicator);
  indicator.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      font-size: 3vh;
      background-color: black;
      color: white;
      font-family: arial, sans-serif;
      padding: .2em;
      z-index: 10000;
    `;
  document.addEventListener('keydown', event => {
    if (event.code == 'Backquote' && event.ctrlKey) {
      event.preventDefault();
      if (visible) {
        indicator.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            font-size: 3vh;
            background-color: black;
            color: white;
            font-family: arial, sans-serif;
            padding: .2em;
            z-index: 10000;
          `;
        visible = false;
      } else {
        indicator.style.cssText = `
            position: fixed;
            left: -100%;
            top: 0;
            font-size: 3vh;
            background-color: black;
            color: white;
            font-family: arial, sans-serif;
            padding: .2em;
            z-index: 10000;
          `;
        visible = true;
      }
    }
  });
  window.addEventListener('resize', calcSize);
  function calcSize(){
    console.log('resize');    
    let w;
    let h;
    let res = 0;
    indicator.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        /*right: 0;
        bottom: 0;*/
        width: 100%;
        height: 100%;
        font-size: 3vh;
        background-color: transparent;
        color: transparent;
        font-family: arial, sans-serif;
        padding: 0;
        z-index: 10000;
      `;
    w = indicator.clientWidth;
    h = indicator.clientHeight;
    if (w > h) {
      res = w * 100 / h;
      indicator.innerHTML = `<br>L - ${res.toFixed(2)}vh`;
      //indicator.textContent = ' w=' + w + ' h=' + h;
      if (!visible) {
        indicator.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            font-size: 3vh;
            background-color: black;
            color: white;
            font-family: arial, sans-serif;
            padding: .2em;
            z-index: 10000;
          `;
      } else {
        indicator.style.cssText = `
            position: fixed;
            left: -100%;
            top: 0;
            font-size: 3vh;
            background-color: black;
            color: white;
            font-family: arial, sans-serif;
            padding: .2em;
            z-index: 10000;
          `;
      }
    } else {
      res = h * 100 / w;
      indicator.innerHTML = `<br>P - ${res.toFixed(2)}vw`;
      if (!visible) {
        indicator.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            font-size: 3vh;
            background-color: black;
            color: white;
            font-family: arial, sans-serif;
            padding: .2em;
            z-index: 10000;
          `;
      } else {
        indicator.style.cssText = `
            position: fixed;
            left: -100%;
            top: 0;
            font-size: 3vh;
            background-color: black;
            color: white;
            font-family: arial, sans-serif;
            padding: .2em;
            z-index: 10000;
          `;
      }
    }
  }
  window.onload = function () {
    calcSize();
  }
  function createMedia() {
    let str = 'медиа запросы <br><br>';
    let substr = '';
    indicator.style.cssText = `
        font-size: 2vh;
        background-color: lightgray;
        color: black;
        font-family: arial, sans-serif;
        padding: 2vh;

        z-index: 10000;
      `;
    for (let i = 100; i <= 299; i++) {
      substr = `
        @media only screen and (min-width: ${i}vh) and (max-width: ${i + 1}vh) and (orientation: landscape){ <br>
        &nbsp;&nbsp;.my-resolutions:before {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;content: 'media - ${i}vh < L < ${i + 1}vh';<br>
        &nbsp;&nbsp;}<br>
        }<br><br>
      `;
      str = str + substr;
    }
    str = str + `<br><br><br>`;
    for (let i = 100; i <= 299; i++) {
      substr = `
        @media only screen and (min-height: ${i}vw) and (max-height: ${i + 1}vw) and (orientation: portrait){ <br>
        &nbsp;&nbsp;.my-resolutions:before {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;content: 'media - ${i}vw < P < ${i + 1}vw';<br>
        &nbsp;&nbsp;}<br>
        }<br><br>
      `;
      str = str + substr;
    }
    indicator.innerHTML = str; 
  }