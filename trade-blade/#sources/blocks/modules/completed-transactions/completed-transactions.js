// import Swiper from "swiper/bundle";
import Swiper from "swiper";
import { Scrollbar } from "swiper/modules";

document.addEventListener("DOMContentLoaded", () => {
    const sliderSelector = ".swiper";
    const swiper = createTransactionsSwiper(sliderSelector);

    // Применяем стартовые параметры под текущее разрешение.
    updateSwiperByViewport(swiper);
    updateSwiperFullnessClass(swiper, sliderSelector);
});

function getSwiperViewportSettings() {
    // Настройки собраны в отдельной функции, чтобы удобно масштабировать брейкпоинты.
    const settings = {
        slidesPerView: 1.2,
        spaceBetween: 8,
    };

    if (window.matchMedia("(min-width: 560px)").matches) {
        settings.slidesPerView = 2.3;
        settings.spaceBetween = 15;
    }
    if (window.matchMedia("(min-width: 768px)").matches) {
        settings.slidesPerView = 3.3;
    }
    if (window.matchMedia("(min-width: 1150px)").matches) {
        settings.slidesPerView = 4.3;
        settings.spaceBetween = 20;
    }

    return settings;
}

function updateSwiperByViewport(swiper) {
    // Пересчитываем параметры слайдера на resize без пересоздания экземпляра.
    const viewportSettings = getSwiperViewportSettings();
    swiper.params.slidesPerView = viewportSettings.slidesPerView;
    swiper.params.spaceBetween = viewportSettings.spaceBetween;
    swiper.update();
}

function updateSwiperFullnessClass(swiper, sliderSelector) {
    // Добавляем класс, когда слайдов меньше чем видимая область,
    // чтобы шаблон мог корректно адаптировать внешний вид.
    const slideCount = swiper.slides.length;
    const swiperContainer = document.querySelector(sliderSelector);
    if (!swiperContainer) {
        return;
    }

    if (slideCount < swiper.params.slidesPerView) {
        swiperContainer.classList.add("no-full");
        return;
    }

    swiperContainer.classList.remove("no-full");
}

function createTransactionsSwiper(sliderSelector) {
    // Создаем один инстанс Swiper и выносим resize-обработку в именованные функции.
    return new Swiper(sliderSelector, {
        modules: [Scrollbar],
        loop: false,
        slidesPerView: 1.2,
        spaceBetween: 8,
        scrollbar: {
            el: ".swiper-scrollbar",
            hide: false,
        },
        on: {
            resize: (swiper) => {
                updateSwiperByViewport(swiper);
                updateSwiperFullnessClass(swiper, sliderSelector);
            },
        },
    });
}
