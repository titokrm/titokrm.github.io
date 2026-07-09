/* global modules */
modules.define("hero", ["i-bem-dom"], function (provide, bemDom) {
  // Используем именованный хук инициализации, чтобы сохранить единый стиль во всех BEM-модулях.
  function handleHeroInited() {
    // JS-поведение для hero сейчас реализовано в отдельных модулях анимаций.
  }

  // Декларируем блок с текущим контрактом без изменений поведения.
  provide(
    bemDom.declBlock(this.name, {
      onSetMod: {
        js: {
          inited: handleHeroInited,
        },
      },
    }),
  );
});
