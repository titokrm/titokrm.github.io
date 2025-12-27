import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { titleEffect } from "%modules%/title-effect/title-effect.js";
import "./import/modules";
import "./import/components";

gsap.registerPlugin(ScrollTrigger,ScrollToPlugin,SplitText);

document.addEventListener("DOMContentLoaded", () => {
    document.fonts.ready.then(() => {
        let tl = gsap.timeline();
        // анимируем кнопки и табы - волна текста при ховере
        let allBtns = gsap.utils.toArray(".btn, .tabs__btn");
        allBtns.forEach(btn => {
            let btnSplit = SplitText.create(btn, { type: "chars" });
            btn.addEventListener("mouseenter", () => {
                let tlBtn = gsap.timeline();
                tlBtn.to(btnSplit.chars, {
                    y: -5,
                    duration: 0.15,
                    ease: "power2.out",
                    stagger: 0.05,
                });
                tlBtn.to(btnSplit.chars, {
                    y: 0,
                    duration: 0.15,
                    ease: "power2.out",
                    stagger: 0.05
                }, "<0.2");
            });
        });

        // анимируем ccылки в меню и футере - пролетающая окраска текста при ховере
        // задаем одинаковое количество прохождений цветового всплеска в единицу времени для всех ссылок исходя из максимальной длины ссылки без пробелов
        let allMenuLink = gsap.utils.toArray(".menu__link, .footer__nav-link");
        // console.log("color= ", getComputedStyle(document.body).getPropertyValue("--header-menu-link-hover-color").trim());
        let maxLengthLink = 0;
        let durationLink = 0.1;
        let staggerLink = 0.025;
        let highlightChars = 4;
        allMenuLink.forEach(link => {
            if (link.textContent.length > maxLengthLink) {
                const linkText = link.textContent;
                maxLengthLink = linkText.split(" ").join("").length;
            }            
        });

        allMenuLink.forEach(link => {
            const linkText = link.textContent;
            const diffLength = maxLengthLink - linkText.split(" ").join("").length;
            const delayAnimLink = staggerLink * diffLength;
            let linkSplit = SplitText.create(link, { type: "chars" });
            link.addEventListener("mouseenter", () => {
                if (link._hoverTl) {
                    link._hoverTl.repeat(-1);
                    link._hoverTl.restart();
                    return;
                }
                let tlLink = gsap.timeline({repeat: -1, repeatDelay: delayAnimLink});
                tlLink.to(linkSplit.chars, {
                    color: getComputedStyle(document.body).getPropertyValue("--header-menu-link-hover-color").trim(),
                    duration: durationLink,
                    ease: "power2.out",
                    stagger: staggerLink,
                });
                tlLink.to(linkSplit.chars, {
                    color: getComputedStyle(document.body).getPropertyValue("--header-menu-link-color").trim(),
                    duration: durationLink,
                    ease: "power2.out",
                    stagger: staggerLink,
                }, `<${highlightChars * staggerLink}>`);
                link._hoverTl = tlLink;
            });
            link.addEventListener("mouseleave", () => {
                if (link._hoverTl) {
                    link._hoverTl.repeat(0);
                }
            });
        });

        // анимация заголовков при появлении в области видимости - побуквенное всплывание текста
        gsap.utils.toArray(".text-letter-show-effect").forEach(title => {
            gsap.set(title, { opacity: 1 });
            let split = SplitText.create(title, { type: "chars" });
            // console.log("обрачиваем символы заголовков в span");
        
            gsap.from(split.chars, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 95%",
                    toggleActions: "play none none reverse",
                },
                y: 20,
                autoAlpha: 0,
                stagger: 0.05
            });
        });

        // анимация секций при появлении в области видимости - всплывание и проявление
        gsap.utils.toArray(".block-show-effect").forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    toggleActions: "play none none reverse",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        });

        // анимация слайдов блока completed-transactions при появлении в области видимости - поочередное разворачивание карточек из левого верхнего угла
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

        // анимируем блок hero
        titleEffect({
            titleSelector: ".hero__title", // селектор заголовка внутри контейнера
            containerSelector: ".hero", // селектор контейнера эффекта (ограничивает область вылета заголовка)
            typeEffect: "from-right", // from-right, from-left, ether-over-line
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
                }],
            onComplete: () => {
                // console.log("titleEffect complete");
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

                        // Добавляем анимацию строк в timeline
                        tl.from(self.lines, {
                            duration: 0.5,
                            yPercent: 100,
                            opacity: 0,
                            stagger: 0.2,
                            ease: "expo.out",
                            onComplete: () => {
                                self.revert();
                            }
                        });

                        // Добавляем анимацию формы ОДИН раз — она выполнится после строк
                        tl.to(".hero__form, .hero__note", {
                            opacity: 1,
                            duration: 0.5
                        });
                    }
                });
            }
        });
    });

    // плавный скролл к якорям с учётом фиксированного хедера
    document.querySelectorAll(".header .menu__link, .footer .footer__nav-link").forEach(link=>{
        link.addEventListener("click", (event) => {
            // console.log("click link menu");
          
            let scrollToAnkore = ()=> {
                console.log("scrollToAnkore fired");          
                gsap.to(window, {
                    duration: 2,
                    scrollTo: { y: target, offsetY: heightHeader },
                    ease: "power2.out"
                });
                document.removeEventListener("menuHide", scrollToAnkore);
            };
            event.preventDefault();
            const target = link.getAttribute("href");
            const heightHeader = document.querySelector(".header").offsetHeight;
            const closeMenu = document.querySelector(".header .js-close-menu");
            console.log(target);
      
            if (target && target !== "#" && document.querySelector(target)) { // проверяем, что такой якорь есть на странице и он не пустой
                console.log("слушаем событие");
                if (document.querySelector(".header__navigation").classList.contains("active")) { // если меню открыто, то навешиваем слушатель на его закрытие и закрываем меню
                    document.addEventListener("menuHide", scrollToAnkore);
                    closeMenu?.click();
                } else { // если меню закрыто, то скроллим сразу
                    scrollToAnkore();
                }
            }
        });
    });
});