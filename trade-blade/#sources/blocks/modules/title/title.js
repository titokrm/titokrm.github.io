import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

// import { gsap } from "gsap/dist/gsap";
// import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(SplitText);

function createTitleCharsAnimation() {
    // Сначала показываем контейнер, чтобы при split не было визуального мерцания.
    gsap.set(".title", { opacity: 1 });

    // Разбиваем текст на символы для поочередной анимации входа.
    const splitTitle = SplitText.create(".title", { type: "chars" });

    // Анимация оставлена прежней по таймингам, чтобы не менять ощущение интерфейса.
    gsap.from(splitTitle.chars, {
        y: 20,
        autoAlpha: 0,
        stagger: 0.05,
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Запускаем анимацию после готовности DOM, когда заголовок уже присутствует в документе.
    createTitleCharsAnimation();
});
