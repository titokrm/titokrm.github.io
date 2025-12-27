// import Swiper from "swiper/bundle";
import Swiper from "swiper";
import { Scrollbar } from "swiper/modules";


document.addEventListener("DOMContentLoaded", () => {
    const sliderSelector = ".swiper";

    function checkSlideCount() {
        let slideCount = swiper.slides.length;
        let swiperContainer = document.querySelector(sliderSelector);

        if (slideCount < swiper.params.slidesPerView) {
            swiperContainer.classList.add("no-full");
        } else {
            swiperContainer.classList.remove("no-full");
        }
    }

    function updateSwiper() {
        swiper.params.slidesPerView = 1.2;
        swiper.params.spaceBetween = 8;
        // console.log('ориентация - альбомю ширина >= 560px');
        if (window.matchMedia("(min-width: 560px)").matches) {
            swiper.params.slidesPerView = 2.3;
            swiper.params.spaceBetween = 15;
        }
        if (window.matchMedia("(min-width: 768px)").matches) {
            // console.log('ориентация - альбомю ширина >= 768px');
            swiper.params.slidesPerView = 3.3;
        }
        if (window.matchMedia("(min-width: 1150px)").matches) {
            // console.log('ориентация - альбомю ширина >= 1150px');
            swiper.params.slidesPerView = 4.3;
            swiper.params.spaceBetween = 20;
        }
        // }

        swiper.update();
    }

    const swiper = new Swiper(sliderSelector, {
        modules: [Scrollbar],
        loop: false,
        slidesPerView: 1.2,
        spaceBetween: 8,
        scrollbar: {
            el: ".swiper-scrollbar",
            hide: false,
        },
        on: {
            resize: () => {
                updateSwiper();
                checkSlideCount();
            }
        }
    });

    updateSwiper();
    checkSlideCount();
});
