class DynamicAdapt {
  constructor(type) {
    this.type = type;
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
      }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
      .filter((item, index, self) => self.indexOf(item) === index);

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = this.оbjects.filter(
        ({
          breakpoint
        }) => breakpoint === mediaBreakpoint
      );
      matchMedia.addEventListener('change', () => {
        console.log('Event CHANGE. matchMedia = ', matchMedia, ' objectsFilter = ', оbjectsFilter);
          debugger;
        let width = window.innerWidth;          
        if (width > 720 && this.strToNum(matchMedia.media) === 720) {
          $('#slider-forface-inner').hasClass('slick-initialized') ? $('#slider-forface-inner').slick('unslick') : null;
          $('#slider-forbody-inner').hasClass('slick-initialized') ? $('#slider-forbody-inner').slick('unslick') : null;
          $('#slider-formakeup-inner').hasClass('slick-initialized') ? $('#slider-formakeup-inner').slick('unslick') : null;
        }
        if (this.mediaHandler(matchMedia, оbjectsFilter)) {
          if (matchMedia.matches && this.strToNum(matchMedia.media) === 720) {
            const setAllFor = {
                dots: false,
                infinite: true,
                speed: 300,
                slidesToShow: 2,
                slidesToScroll: 1,
                arrows: false,
              };
            $('#slider-forface-inner').hasClass('slick-initialized') ? null : $('#slider-forface-inner').slick(setAllFor);
            $('#slider-forbody-inner').hasClass('slick-initialized') ? null : $('#slider-forbody-inner').slick(setAllFor);
            $('#slider-formakeup-inner').hasClass('slick-initialized') ? null : $('#slider-formakeup-inner').slick(setAllFor);
          }
        }
      });
      console.log('Event CHANGE. matchMedia = ', matchMedia, ' objectsFilter = ', оbjectsFilter);
      let width = window.innerWidth;          
      if (width > 720 && this.strToNum(matchMedia.media) === 720) {
        $('#slider-forface-inner').hasClass('slick-initialized') ? $('#slider-forface-inner').slick('unslick') : null;
        $('#slider-forbody-inner').hasClass('slick-initialized') ? $('#slider-forbody-inner').slick('unslick') : null;
        $('#slider-formakeup-inner').hasClass('slick-initialized') ? $('#slider-formakeup-inner').slick('unslick') : null;
      }
      if (matchMedia.matches && this.strToNum(matchMedia.media) === 989) {
        $('#slider-forface-inner').hasClass('slick-initialized') ? $('#slider-forface-inner').slick('unslick') : null;
        $('#slider-forbody-inner').hasClass('slick-initialized') ? $('#slider-forbody-inner').slick('unslick') : null;
        $('#slider-formakeup-inner').hasClass('slick-initialized') ? $('#slider-formakeup-inner').slick('unslick') : null;
      }
      if (this.mediaHandler(matchMedia, оbjectsFilter)) {
        if (matchMedia.matches && this.strToNum(matchMedia.media) === 720) {
        const setAllFor = {
            dots: false,
            infinite: true,
            speed: 300,
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
          };
          $('#slider-forface-inner').hasClass('slick-initialized') ? null : $('#slider-forface-inner').slick(setAllFor);
          $('#slider-forbody-inner').hasClass('slick-initialized') ? null : $('#slider-forbody-inner').slick(setAllFor);
          $('#slider-formakeup-inner').hasClass('slick-initialized') ? null : $('#slider-formakeup-inner').slick(setAllFor);
        }
      }
    });
  }

    strToNum(str) {
      var numEl = '';
      // Перебираем каждый символ. Если символ можно распарсить как номер, приписываем к строке
      for (let i in str) {
        if ( !isNaN(parseInt(str[i])) ) {
          numEl += str[i]
        }
      }
      return parseInt(numEl);
    }

  // Основная функция
  mediaHandler(matchMedia, оbjects) {
    let result = false;
    if (matchMedia.matches) {
      оbjects.forEach((оbject) => {
        // оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
        result = true;
        //console.log('вызываем событие rebildDom, from = ', oldParent, ' to = ', оbject.destination);
      });
    } else {
      оbjects.forEach(
        ({ parent, element, index }) => {
          if (element.classList.contains(this.daClassname)) {
            this.moveBack(parent, element, index);
            result = true;
          //  console.log('вызываем событие rebildDom, from = ', oldParent, ' to = ', parent);
          }
        }
      );
    }
    return result;
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
