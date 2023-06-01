'use strict'
document.addEventListener( 'DOMContentLoaded', function() {
    $('.select-lang select').niceSelect();
    $('.select-currency select').niceSelect();
    $('.scroll').length > 0 ? new SimpleBar($('.scroll')[0], { autoHide: false }) : null;

    const da = new DynamicAdapt("max", () => {
      let event = new Event('resize');
      window.dispatchEvent(event);
    });
    da.init();
    menuSlide({
      mobWidthSetting: 768,
      changePosition: true
    });
    tabs();
    accordion({
      selector: '.faq',
      btnSelector: '.faq__item',
      itemSelector: '.faq__item',
      collapsedSelector: '.faq__collapsed',
    });
});
