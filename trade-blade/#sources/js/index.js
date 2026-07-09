import { initPageAnimations } from "./modules/animations";
import { initSmoothAnchorNavigation } from "./modules/anchor-scroll";
import "./import/modules";
import "./import/components";

document.addEventListener("DOMContentLoaded", () => {
  // Ждем шрифты перед запуском text-эффектов, иначе геометрия символов может измениться в процессе.
  document.fonts.ready.then(() => {
    initPageAnimations();
  });

  // Якорный скролл инициализируем отдельно: он не зависит от SplitText и загрузки шрифтов.
  initSmoothAnchorNavigation();
});
