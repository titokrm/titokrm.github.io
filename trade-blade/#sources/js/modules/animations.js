import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { titleEffect } from "%modules%/title-effect/title-effect.js";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

function getTextLengthWithoutSpaces(text) {
  // Длина без пробелов нужна для синхронизации скорости "цветовой волны" между ссылками разной длины.
  return text.split(" ").join("").length;
}

function initButtonHoverWaveAnimation() {
  // Для кнопок и табов создаем одинаковую анимацию символов при наведении.
  const allButtons = gsap.utils.toArray(".btn, .tabs__btn");

  allButtons.forEach((button) => {
    const splitButtonText = SplitText.create(button, { type: "chars" });
    button.addEventListener("mouseenter", () => {
      const buttonTimeline = gsap.timeline();
      buttonTimeline.to(splitButtonText.chars, {
        y: -5,
        duration: 0.15,
        ease: "power2.out",
        stagger: 0.05,
      });
      buttonTimeline.to(
        splitButtonText.chars,
        {
          y: 0,
          duration: 0.15,
          ease: "power2.out",
          stagger: 0.05,
        },
        "<0.2",
      );
    });
  });
}

function getMenuLinksHoverSettings() {
  // Настройки эффекта собраны в отдельный объект, чтобы легче управлять таймингами централизованно.
  return {
    durationLink: 0.1,
    staggerLink: 0.025,
    highlightChars: 4,
  };
}

function getMenuLinksMaxLength(allMenuLinks) {
  // Ищем самую длинную ссылку, чтобы остальным добавить задержку и визуально выровнять цикл подсветки.
  let maxLengthLink = 0;
  allMenuLinks.forEach((link) => {
    const currentLength = getTextLengthWithoutSpaces(link.textContent);
    if (currentLength > maxLengthLink) {
      maxLengthLink = currentLength;
    }
  });
  return maxLengthLink;
}

function createMenuLinkHoverTimeline(linkSplit, delayAnimLink, settings) {
  // Создаем бесконечный timeline подсветки для конкретной ссылки.
  const menuLinkTimeline = gsap.timeline({
    repeat: -1,
    repeatDelay: delayAnimLink,
  });
  menuLinkTimeline.to(linkSplit.chars, {
    color: getComputedStyle(document.body)
      .getPropertyValue("--header-menu-link-hover-color")
      .trim(),
    duration: settings.durationLink,
    ease: "power2.out",
    stagger: settings.staggerLink,
  });
  menuLinkTimeline.to(
    linkSplit.chars,
    {
      color: getComputedStyle(document.body)
        .getPropertyValue("--header-menu-link-color")
        .trim(),
      duration: settings.durationLink,
      ease: "power2.out",
      stagger: settings.staggerLink,
    },
    `<${settings.highlightChars * settings.staggerLink}>`,
  );
  return menuLinkTimeline;
}

function initMenuLinksHoverColorAnimation() {
  // Анимируем ссылки в меню и футере, сохраняя прежнюю механику запуска/остановки на hover.
  const allMenuLinks = gsap.utils.toArray(".menu__link, .footer__nav-link");
  const settings = getMenuLinksHoverSettings();
  const maxLengthLink = getMenuLinksMaxLength(allMenuLinks);

  allMenuLinks.forEach((link) => {
    const linkLength = getTextLengthWithoutSpaces(link.textContent);
    const delayAnimLink = settings.staggerLink * (maxLengthLink - linkLength);
    const linkSplit = SplitText.create(link, { type: "chars" });

    link.addEventListener("mouseenter", () => {
      if (link._hoverTl) {
        link._hoverTl.repeat(-1);
        link._hoverTl.restart();
        return;
      }

      link._hoverTl = createMenuLinkHoverTimeline(
        linkSplit,
        delayAnimLink,
        settings,
      );
    });

    link.addEventListener("mouseleave", () => {
      if (link._hoverTl) {
        link._hoverTl.repeat(0);
      }
    });
  });
}

function initTitlesRevealAnimation() {
  // Появление заголовков запускаем по скроллу с побуквенным подъемом.
  const titles = gsap.utils.toArray(".text-letter-show-effect");
  const splitTitles = [];

  function getTitleRevealOffsetRatio() {
    // На touch-устройствах и узких экранах сдвигаем точку старта ниже,
    // чтобы анимация запускалась ближе к зоне внимания пользователя.
    const isPhoneOrTabletByWidth = window.matchMedia(
      "(max-width: 1262px)",
    ).matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    return isPhoneOrTabletByWidth || isTouchDevice ? 0.08 : 0.05;
  }

  titles.forEach((title) => {
    // Сначала разбиваем весь набор заголовков, чтобы последующие измерения ScrollTrigger
    // не зависели от того, сколько таких элементов было до текущего.
    const splitTitle = SplitText.create(title, { type: "chars" });

    // Сразу задаем скрытое стартовое состояние символов,
    // чтобы заголовок не успевал мигнуть до начала scroll-анимации.
    gsap.set(splitTitle.chars, {
      y: 20,
      autoAlpha: 0,
      visibility: "hidden",
    });

    splitTitles.push({
      title,
      splitTitle,
    });
  });

  splitTitles.forEach(({ title, splitTitle }) => {
    gsap.to(splitTitle.chars, {
      scrollTrigger: {
        trigger: title,
        // На desktop/laptop используем 5% высоты окна, на phone/tablet — 10%.
        start: () => {
          const startOffset = Math.round(
            window.innerHeight * getTitleRevealOffsetRatio(),
          );
          return `top bottom-=${startOffset}`;
        },
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
      y: 0,
      autoAlpha: 1,
      stagger: 0.05,
    });
  });

  // После того как все SplitText и ScrollTrigger созданы, пересчитываем позиции один раз.
  ScrollTrigger.refresh();
}

function initBlocksRevealAnimation() {
  // Универсальная анимация для секций, которые должны мягко подниматься при появлении.
  gsap.utils.toArray(".block-show-effect").forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
  });
}

function initCompletedTransactionsCardsAnimation() {
  // На широких экранах карточки слайдера раскрываем каскадно для более выразительного появления.
  gsap.matchMedia().add("(min-width: 560px)", () => {
    gsap.from(".swiper-slide__inner", {
      scrollTrigger: {
        trigger: ".swiper-slide__inner",
        start: "top bottom",
        toggleActions: "play none none reverse",
      },
      scale: 0,
      transformOrigin: "left top",
      stagger: 0.15,
      duration: 0.3,
    });
  });
}

function handleHeroDescriptionAnimation(heroTimeline) {
  // После анимации заголовка поэтапно показываем картинку, описание и затем форму.
  gsap.set(".hero__image img", { scale: 0, y: "-75%" });
  gsap.to(".hero__image img", {
    scale: 1,
    y: "0%",
    duration: 0.8,
    ease: "power2.out",
  });

  gsap.set(".hero__description", { opacity: 1 });
  SplitText.create(".hero__description", {
    type: "words,lines",
    linesClass: "line",
    autoSplit: true,
    mask: "lines",
    onSplit: (self) => {
      heroTimeline.from(self.lines, {
        duration: 0.5,
        yPercent: 100,
        opacity: 0,
        stagger: 0.2,
        ease: "expo.out",
        onComplete: () => {
          self.revert();
        },
      });

      heroTimeline.to(".hero__form, .hero__note", {
        opacity: 1,
        duration: 0.5,
      });
    },
  });
}

function initHeroTitleEffectAnimation() {
  // Основной hero-эффект оставляем на базе существующего titleEffect с теми же breakpoint-опциями.
  const heroTimeline = gsap.timeline();
  titleEffect({
    titleSelector: ".hero__title",
    containerSelector: ".hero",
    typeEffect: "from-right",
    response: [
      {
        media: "(min-width: 0px)",
        options: {
          typeEffect: "from-right",
          timeToEdge: 0.7,
          timeLineDelay: 0.33,
          delayEvenLine: false,
        },
      },
      {
        media: "(min-width: 768px)",
        options: {
          typeEffect: "ether-over-line",
          timeToEdge: 1,
          timeLineDelay: 0,
          delayEvenLine: false,
        },
      },
      {
        media: "(min-width: 1060px)",
        options: {
          typeEffect: "from-right",
          timeToEdge: 1.2,
          timeLineDelay: 0.33,
          delayEvenLine: false,
        },
      },
    ],
    onComplete: () => {
      handleHeroDescriptionAnimation(heroTimeline);
    },
  });
}

export function initPageAnimations() {
  // Собираем все анимации страницы в одном месте, чтобы точка входа была прозрачной.
  initButtonHoverWaveAnimation();
  initMenuLinksHoverColorAnimation();
  initTitlesRevealAnimation();
  initBlocksRevealAnimation();
  initCompletedTransactionsCardsAnimation();
  initHeroTitleEffectAnimation();
}
