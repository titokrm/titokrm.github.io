/* global modules */
modules.define("subscribe", ["i-bem-dom"], function (provide, bemDom) {
  // Выделяем именованный обработчик, чтобы в будущем наращивать функциональность без переписывания структуры.
  function handleSubscribeInited() {
    // Текущая реализация намеренно пустая: сохраняем поведение без побочных эффектов.
  }

  // Регистрируем BEM-блок с прежним контрактом события inited.
  provide(
    bemDom.declBlock(this.name, {
      onSetMod: {
        js: {
          inited: handleSubscribeInited,
        },
      },
    }),
  );
});
