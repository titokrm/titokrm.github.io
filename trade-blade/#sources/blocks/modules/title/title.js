import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

// import { gsap } from "gsap/dist/gsap";
// import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(SplitText);

document.addEventListener("DOMContentLoaded", () => {
    gsap.set(".title", { opacity: 1 });

    let split = SplitText.create(".title", { type: "chars" });
    //now animate each character into place from 20px below, fading in:
    gsap.from(split.chars, {
        y: 20,
        autoAlpha: 0,
        stagger: 0.05
    });
});