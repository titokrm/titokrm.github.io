import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

function getAnchorBlockElement(targetSelector) {
  // Находим корневой блок по якорю, чтобы дальше вычислить точную цель прокрутки.
  if (!targetSelector || targetSelector === "#") {
    return null;
  }

  return document.querySelector(targetSelector);
}

function getAnchorContainerTargetElement(targetSelector) {
  // Скроллим к непосредственному дочернему контейнеру блока-якоря,
  // если его класс оканчивается на __container.
  const anchorBlockElement = getAnchorBlockElement(targetSelector);
  if (!anchorBlockElement) {
    return null;
  }

  const directChildren = Array.from(anchorBlockElement.children);
  const anchorContainerElement = directChildren.find((childElement) => {
    return Array.from(childElement.classList).some((className) =>
      className.endsWith("__container"),
    );
  });

  // Если специальный контейнер не найден, оставляем безопасный fallback на сам якорный блок.
  return anchorContainerElement || anchorBlockElement;
}

function createAnchorScrollHandler(scrollTargetElement, heightHeader) {
  // Возвращаем замыкание, чтобы использовать один и тот же обработчик и для прямого вызова, и для menuHide.
  const handleAnchorScroll = () => {
    gsap.to(window, {
      duration: 2,
      scrollTo: { y: scrollTargetElement, offsetY: heightHeader },
      ease: "power2.out",
    });
    document.removeEventListener("menuHide", handleAnchorScroll);
  };

  return handleAnchorScroll;
}

function handleAnchorNavigationClick(event, link) {
  // Обрабатываем клик по пункту меню с учетом сценария, когда мобильное меню открыто.
  event.preventDefault();

  const target = link.getAttribute("href");
  const scrollTargetElement = getAnchorContainerTargetElement(target);
  if (!scrollTargetElement) {
    return;
  }

  // Текущую высоту хедера берем в момент клика,
  // чтобы корректно работать и в мобильном, и в десктопном состоянии.
  const header = document.querySelector(".header");
  const closeMenuButton = document.querySelector(".header .js-close-menu");
  const navigation = document.querySelector(".header__navigation");
  const heightHeader = header ? header.offsetHeight : 0;
  const handleAnchorScroll = createAnchorScrollHandler(
    scrollTargetElement,
    heightHeader,
  );

  // Если меню открыто, ждем его закрытия и только потом запускаем скролл.
  if (navigation && navigation.classList.contains("active")) {
    document.addEventListener("menuHide", handleAnchorScroll);
    closeMenuButton?.click();
    return;
  }

  // Если меню уже закрыто, скроллим сразу.
  handleAnchorScroll();
}

export function initSmoothAnchorNavigation() {
  // Плавный скролл к секциям привязываем и к шапке, и к футеру для единообразного UX.
  document
    .querySelectorAll(".header .menu__link, .footer .footer__nav-link")
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        handleAnchorNavigationClick(event, link);
      });
    });
}
