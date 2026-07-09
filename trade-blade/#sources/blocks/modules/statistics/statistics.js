import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// import { gsap } from "gsap/dist/gsap";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function getCounterTargetValue(counter) {
    // Значение финального числа берем из data-атрибута,
    // потому что это самый стабильный контракт с HTML-шаблоном.
    return parseInt(counter.dataset.result, 10);
}

function getCounterStartValue(counter) {
    // Визуальное стартовое число очищаем от пробелов и символа валюты.
    return parseFloat(counter.innerText.replace(/\s|€/g, ""));
}

function updateCounterView(counter, counterState) {
    // На каждом кадре рендерим округленное число с локальным форматированием.
    counter.innerHTML = Math.ceil(counterState.innerText).toLocaleString();
}

function createCounterIncrementAnimation(counter, targetValue, counterState) {
    // Основная анимация числа запускается после срабатывания ScrollTrigger.
    gsap.to(counterState, {
        innerText: targetValue,
        duration: 3.5,
        ease: "slow.out",
        onUpdate: () => {
            updateCounterView(counter, counterState);
        },
    });
}

function createCounterVisibilityAnimation(counter) {
    // Триггер оставлен в том же месте, чтобы не менять момент старта анимации относительно секции.
    const targetValue = getCounterTargetValue(counter);
    const counterState = { innerText: getCounterStartValue(counter) };

    gsap.to(counter, {
        scrollTrigger: {
            trigger: counter,
            start: "top-=50 bottom",
            toggleActions: "play none none none",
        },
        onComplete: () => {
            createCounterIncrementAnimation(counter, targetValue, counterState);
        },
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // const counters = document.querySelectorAll(".auto-counter");

    // const options = {
    //   threshold: 0.3 // процент видимости для запуска
    // };

    // const animateCounter = (el) => {
    //   const start = parseInt(el.textContent, 10);
    //   const end = parseInt(el.dataset.result, 10);

    //   if (isNaN(start) || isNaN(end)) return;

    //   const duration = 1500; // длительность анимации в мс
    //   const startTime = performance.now();

    //   const update = (currentTime) => {
    //     const progress = Math.min((currentTime - startTime) / duration, 1);
    //     const value = Math.floor(start + (end - start) * progress);
    //     el.textContent = value.toLocaleString(); // красиво с разделителями

    //     if (progress < 1) {
    //       requestAnimationFrame(update);
    //     }
    //   };

    //   requestAnimationFrame(update);
    // };

    // const observer = new IntersectionObserver((entries, obs) => {
    //   entries.forEach(entry => {
    //     if (entry.isIntersecting) {
    //       animateCounter(entry.target);
    //       obs.unobserve(entry.target); // запускаем только один раз
    //     }
    //   });
    // }, options);

    // counters.forEach(counter => observer.observe(counter));

    // Инициализируем анимацию отдельно для каждого счетчика.
    gsap.utils.toArray(".auto-counter").forEach((counter) => {
        createCounterVisibilityAnimation(counter);
    });
});
