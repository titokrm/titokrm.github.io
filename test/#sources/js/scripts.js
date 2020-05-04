"use strict";

$(function() {
  setMinHeight();   // для того чтобы когда при ховере внутренняя обертка сановится position: absolute не было "скачков" других блоков в строке (тех что меньше по высоте чем тот что под ховером)
  $(window).resize(function(){
    setMinHeight();
  })

  function setMinHeight() {
    $('.clients-list__item').css('min-height', 0);
    $('.clients-list__item').each(function(){
      var height = $(this).height();
      $(this).css('min-height', height+'px');
    })
  }
});