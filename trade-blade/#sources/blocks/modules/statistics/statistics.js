import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


// import { gsap } from "gsap/dist/gsap";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

    // анимация секций при появлении в области видимости
    gsap.utils.toArray(".auto-counter").forEach(counter => {
        const endValue = parseInt(counter.dataset.result, 10);
        let obj = { innerText: parseFloat(counter.innerText.replace(/\s|€/g, "")) };
        const showCounter = () => {
            counter.innerHTML = Math.ceil(obj.innerText).toLocaleString();
        };
        gsap.to(counter, {
            scrollTrigger: {
                trigger: counter,
                start: "top-=50 bottom", // компенсация 50px block-show-effect см. "анимация секций при появлении в области видимости" в src/js/index.js
                toggleActions: "play none none none",
            },
            onComplete: () => {
                console.log("animation complete");              
                gsap.to(obj, {
                    innerText: endValue,
                    duration: 3.5,
                    ease: "slow.out",
                    onUpdate: () => {
                        showCounter();
                    }
                });
            }
        });
    });
});
