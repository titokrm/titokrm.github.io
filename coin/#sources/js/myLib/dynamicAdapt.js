'use strict'
/*
  У перемещаемого блока должен быть параметр вида
    data-da="КУДА,КОГДА,МЕСТО ВНУТРИ РОДИТЕЛЯ"
    где 
      КУДА - селектор блока куда перемещать;
      КОГДА - число, ширина экрана при которой перемещать или медиазапрос (должны по краям быть скобки) или ключевое слово portrait / landscape;
      МЕСТО ВНУТРИ РОДИТЕЛЯ - индекс внутри массива родителя-получателя, допускается first и last
    к примеру:
      data-da=".mob-info-block,768,1"
      data-da=".mob-info-block,portrait,first"
      data-da=".mob-info-block,(orientation: portrait) and (max-width: 768px),1"

  инициация скрипта:

    const da = new DynamicAdapt("max", () => {
      // функция вызываемая после перестройки DOM (необязательный параметр)
      let event = new Event('resize');
      window.dispatchEvent(event);
    });
    da.init();

    где "max" - префикс max-width: ...px у медиазапроса, возможно использование min если необходимо mobilfirst
    
*/

class DynamicAdapt {
  constructor(type, afterFun = () => {}) {
    this.type = type;
    this.afterFun = afterFun;
  }

  init() {
    // массив объектов
    this.оbjects = [];
    this.daClassname = '_dynamic_adapt_';
    // массив DOM-элементов
    this.nodes = [...document.querySelectorAll('[data-da]')];

    // наполнение оbjects объктами
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const dataArray = data.split(',');
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
      оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    });

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = this.оbjects
      .map(({
        breakpoint
      }) => {
        if (breakpoint[0] === '(' && breakpoint[breakpoint.length - 1] === ')') {
          return `${breakpoint},${breakpoint}`;
        } else {
          return breakpoint === 'portrait' ? `(orientation: portrait),${breakpoint}` : `(${this.type}-width: ${breakpoint}px),${breakpoint}`;
        }        
      })
      .filter((item, index, self) => self.indexOf(item) === index);

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];
	  /*
      console.log('Уникальные медиазапросы', this.mediaQueries);
      console.log('Mediasplit = ', mediaSplit);
      console.log('Matchmedia = ', matchMedia);
      console.log('Mediabreakpoint =', mediaBreakpoint);      
	  */
      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = this.оbjects.filter(
        ({
          breakpoint
        }) => {
//          console.log('breackpoint = ', breakpoint);
          return breakpoint === mediaBreakpoint}
      );
      matchMedia.addEventListener ? matchMedia.addEventListener('change', () => {
//          console.log('Object filters = ', оbjectsFilter);
          this.mediaHandler(matchMedia, оbjectsFilter);
          this.afterFun();
        }) : matchMedia.addListener(() => {
          this.mediaHandler(matchMedia, оbjectsFilter);
          this.afterFun();
        });
      this.mediaHandler(matchMedia, оbjectsFilter);
      this.afterFun();
    });
  }

  // Основная функция
  mediaHandler(matchMedia, оbjects) {
    if (matchMedia.matches) {
      оbjects.forEach((оbject) => {
        // оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      });
    } else {
      оbjects.forEach(
        ({ parent, element, index }) => {
          if (element.classList.contains(this.daClassname)) {
            this.moveBack(parent, element, index);
          }
        }
      );
    }
  }

  // Функция перемещения
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
      destination.append(element);
      return;
    }
    if (place === 'first') {
      destination.prepend(element);
      return;
    }
    destination.children[place].before(element);
  }

  // Функция возврата
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }

  // Функция получения индекса внутри родителя
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }

  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  arraySort(arr) {
    if (this.type === 'min') {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return -1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return 1;
          }
          return 0;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return 1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return -1;
          }
          return 0;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
