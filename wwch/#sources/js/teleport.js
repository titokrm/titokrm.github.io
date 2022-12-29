function teleport(beforeFun = () => {}, afterFun = () => {}) {
  /************************************************************************************/
  /*************************************************************************************
    Для работы необходимо у блока который должен менять свое расположение в DOM-модели 
    добавить атрибут data-tp вида 
      max-width > destination > min-width,order | [...] | [...] ...
    где:
      "destination" - уникальный селектор куда перемещать;
      "max-width" - max-width при которой этот блок будет в позиции "destination";
      "min-width" - min-width при которой этот блок будет в позиции "destination";
      "order" - порядковый номер в блоке назначения, может быть числом (нумерация с нуля)
      или "first"/"last"
    секции для каждого брекпойнта отделяются друг от друга символом "|"

  ***************************************************************************************/
  /**************************************************************************************/
  function getHashClass(node) {
    let arrClases = node.classList.value.split(' ');
    let result = false;
    arrClases.forEach((item) => {
      let className = item.trim().split('-');
      if (className[0] === 'tphome' && !result) {
        result = item;
      }
    });
    return result;
  }
  function parseRules(itemTp, element, rules) {
    let bpRules = itemTp.dataset.tp.split('|');
    let classHash = getHashClass(itemTp.parentNode);
    if (!classHash) {
      let i = 0;
      do {
        classHash = 'tphome-' + newId();
        i++;
      } while (setClassesUnique.has(classHash));
      console.log(classHash, '  ', i);      
    }

    bpRules.forEach((bpRule) => {
      let rule = bpRule.trim().split(',');
      let media = rule[0].split('>');
      let destination = media.length > 2 ? media[1].trim() : media[0].trim();
      if (destination === 'home') {
//        console.log(itemTp.parentNode.classList);
        itemTp.parentNode.classList.add(classHash);
        destination = '.' + classHash;
        setClassesUnique.add(classHash);
      }
      rules.push({
        element: element,
        media: media.length > 2 ? `(max-width: ${media[0].trim()}px) and (min-width: ${media[2].trim()}px)` : `(min-width: ${media[1].trim()}px)`,
        destination: destination,
        order: rule[1].trim()
      });
    });
  }
  function mediaHandler(rules, event = null) {
    rules.forEach((itemRules) => {
      if (event !== null ? itemRules.media === event.media && event.matches : window.matchMedia(itemRules.media).matches) {
//        console.log('ордер = ', +itemRules.order, ' кол-во детей объекта назначения = ', document.querySelector(itemRules.destination).children.length);
        
        if (itemRules.order === 'last' || +itemRules.order >= document.querySelector(itemRules.destination).children.length) {
//          console.log('медиа = ', itemRules.media, ' перемещаем - ', document.querySelector(itemRules.element), ' append в ', document.querySelector(itemRules.destination));
          document.querySelector(itemRules.destination).append(document.querySelector(itemRules.element));
          return;
        }
        if (itemRules.order === 'first') {
//          console.log('медиа = ', itemRules.media, ' перемещаем - ', document.querySelector(itemRules.element), ' prepend в ', document.querySelector(itemRules.destination));
          document.querySelector(itemRules.destination).prepend(document.querySelector(itemRules.element));    
          return;
        }
//        console.log('медиа = ', itemRules.media, ' перемещаем - ', document.querySelector(itemRules.element), ` before №${itemRules.order} в `, document.querySelector(itemRules.destination));
        document.querySelector(itemRules.destination).children[+itemRules.order].before(document.querySelector(itemRules.element));
      }
    });
  }

  const newId = () => +String(performance.now()).replace('.', '') + Date.now();

  let arrayElementsTeleport = [...document.querySelectorAll('[data-tp]')];
  let rules = [];

  arrayElementsTeleport.forEach((item) => {
    let classHash;
      let i = 0;
      do {
        classHash = 'tp-' + newId();
        i++;
      } while (setClassesUnique.has(classHash));
      setClassesUnique.add(classHash);
      console.log(classHash, '  ', i);
    item.classList.add(classHash);
    classHash = '.' + classHash;
    parseRules(item, classHash, rules);
  });
  
  let bpSet = new Set();

  rules.forEach((itemRules) => {
    bpSet.add(itemRules?.media);
  });

  let bp = Array.from(bpSet);
  
  bp.forEach((media) => {
    let matchMedia = window.matchMedia(media);
    matchMedia.addEventListener('change', (event) => {
      if (event.matches) {
        beforeFun(event);
        mediaHandler(rules, event);
        afterFun(event);
      }
    });
  });
  beforeFun();
  mediaHandler(rules);
  afterFun();
  console.log('List classHash = ', arrayClassesUnique, '  set = ', setClassesUnique);
  
}

function strToNum(str) {
  var numEl = '';
  // Перебираем каждый символ. Если символ можно распарсить как номер, приписываем к строке
  for (let i in str) {
    if ( !isNaN(parseInt(str[i])) ) {
      numEl += str[i]
    }
  }
  return parseInt(numEl);
}

let arrayClassesUnique = [];
let setClassesUnique = new Set();