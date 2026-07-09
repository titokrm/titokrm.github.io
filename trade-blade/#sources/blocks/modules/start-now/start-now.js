/* global modules */
modules.define("start-now", ["i-bem-dom"], function (provide, bemDom) {
  // Выносим инициализацию в именованную функцию для единообразия и дальнейшего масштабирования.
  function handleStartNowInited() {
    // Логика пока отсутствует, поведение блока остается прежним.
  }

  // Объявляем блок через i-bem-dom, не меняя публичный контракт инициализации.
  provide(
    bemDom.declBlock(this.name, {
      onSetMod: {
        js: {
          inited: handleStartNowInited,
        },
      },
    }),
  );
});
