/* global modules */
modules.define("about", ["i-bem-dom"], function (provide, bemDom) {
  // Явно выделяем обработчик инициализации, чтобы проще расширять блок без анонимных функций.
  function handleAboutInited() {
    // Блок пока не требует JS-логики, но точка расширения уже зафиксирована.
  }

  // Регистрируем BEM-блок и оставляем текущий контракт инициализации без изменений.
  provide(
    bemDom.declBlock(this.name, {
      onSetMod: {
        js: {
          inited: handleAboutInited,
        },
      },
    }),
  );
});
