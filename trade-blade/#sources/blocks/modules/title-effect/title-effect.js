import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export function titleEffect({ 
    titleSelector = ".title-effect__title", // селектор заголовка внутри контейнера
    containerSelector = ".title-effect__container", // селектор контейнера эффекта (ограничивает область вылета заголовка)
    typeEffect = "from-right", // from-right, from-left, ether-over-line
    timeToEdge = 1, // задает длительность пролета из-за границы до противоположной границы контейнера
    timeLineDelay = 0.33, // задержка между вылетом строк из-за границы. Если text-align: left, то лучше ставить 1/3 от timeToEdge. Если text-align: center, то можно ставить 0.
    delayEvenLine = false, // при эффекте ether-over-line задержка для нечетных строк. false - без задержки, иначе рассчитывается в функции animateLineToEdges
    deformationX = 0.7, // коэффициент сжатия по X при столкновении с краем
    eachResizeAnimate = false, // при изменении размера окна повторно анимировать эффект
    onComplete = null, // функция, вызываемая по завершении анимации
    response = false, // массив объектов для адаптивных настроек эффекта
    // response = [
    //   {
    //     media: "(min-width: 0px)",
    //     options: {
    //       typeEffect: "from-right",
    //       timeToEdge: 0.7,
    //       timeLineDelay: 0.33,
    //       delayEvenLine: false,
    //     },
    //   }, 
    //   {
    //     media: "(min-width: 768px)",
    //     options: {
    //       typeEffect: "ether-over-line",
    //       timeToEdge: 1,
    //       timeLineDelay: 0,
    //       delayEvenLine: false,
    //     },
    //   }, 
    //   {
    //     media: "(min-width: 1060px)",
    //     options: {
    //       typeEffect: "from-right",
    //       timeToEdge: 1.2,
    //       timeLineDelay: 0.33,
    //       delayEvenLine: false,
    //     },
    //   }
    // ]
} = {}) {
    document.fonts.ready.then(() => {
        const title = document.querySelector(titleSelector);
        let titleInlineStyles = title.style.cssText;
        title.style.cssText = "opacity: 0;";
        const container = document.querySelector(containerSelector);
        
        if (!title) {
            console.log("title not found");
            return;
        }
        if (!container) {
            console.log("container not found");
            return;
        }
      
        function saveStartPosition(line, i, container) {
            const containerRect = container.getBoundingClientRect();
            title.classList.add("title-effect__title--split-done");
            let textAlign = getComputedStyle(title).textAlign;
            // смотрим выравнивание текста и добавляем стили после сплита для корректного нахождения левого/правого края строк
            if (textAlign === "center") {
                title.style.cssText += "display: flex; flex-direction: column; justify-content: flex-start; align-items: center;";
            }
            if (textAlign === "left" || textAlign === "start") {
                title.style.cssText += "display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;";
            }
            if (textAlign === "right" || textAlign === "end") {
                title.style.cssText += "display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-end;";
            }
            const rect = line.getBoundingClientRect();
            line.dataset.startLeft = rect.left;    // A
            line.dataset.startRight = rect.right;  // I
            line.dataset.width = rect.width;  // H
            // console.log("line = ", line, " rect= ", rect);

            if (response) {
                response.forEach(resp => {
                    // console.log("media: ", resp.media);
                    if (window.matchMedia(resp.media).matches) {
                        typeEffect = resp.options.typeEffect || typeEffect;
                        timeToEdge = resp.options.timeToEdge || timeToEdge;
                        timeLineDelay = resp.options.timeLineDelay || timeLineDelay;
                        delayEvenLine = resp.options.delayEvenLine || delayEvenLine;
                        // console.log("MEDIA MATCHED, set typeEffect=", resp.options);
                    }
                });
            }

            // Устанавливаем стартовую трансформацию (смещение относительно её реальной позиции)
            let calcX;
            if (typeEffect === "from-right") {
                calcX = containerRect.right - line.dataset.startLeft; // J - A
                line.style.cssText += "transform-origin: left center;";
            }
            if (typeEffect === "from-left") {
                calcX = -(line.dataset.startRight - containerRect.left);  // -K
                line.style.cssText += "transform-origin: right center;";
            }
            if (typeEffect === "ether-over-line") {
                if (i % 2 === 0) { // четные - слева направо (нумерация с 0)
                    calcX = -(line.dataset.startRight - containerRect.left); // -K
                    line.style.cssText += "transform-origin: right center;";

                } else {  // нечетные - справа налево
                    calcX = containerRect.right - line.dataset.startLeft; // J - A
                    line.style.cssText += "transform-origin: left center;";
                }
            }
            gsap.set(line, { x: calcX, onComplete: () => {
                gsap.set(title, {opacity: 1});
            }}); 
        }
      
        function animateLineToEdges(line, i, container) {
            const containerRect = container.getBoundingClientRect();

            const startLeft = parseFloat(line.dataset.startLeft);          // положение левой грани строки    A
            const startRight = parseFloat(line.dataset.startRight);        // положение правой грани строки    I
            const width = parseFloat(line.dataset.width);                     // ширина строки H  
            let safeEdgeX;

            if (typeEffect === "from-right") {
                safeEdgeX = - (startLeft - containerRect.left);  // A   конечная позиция анимации (левая граница контейнера)

            }
            if (typeEffect === "from-left") {
                safeEdgeX = containerRect.right - startRight;  // J - I    конечная позиция анимации (правая граница контейнера)
            }
            if (typeEffect === "ether-over-line") {
                if (i % 2 === 0) { // четные - вылет слева направо (нумерация с 0)
                    safeEdgeX = containerRect.right - startRight;  // J - I    конечная позиция анимации (правая граница контейнера)
                } else { // нечетные - вылет справа налево
                    safeEdgeX = - (startLeft - containerRect.left);  // A   конечная позиция анимации (левая граница контейнера)
                }
            }
            // Timeline: движение до противоположной границы, затем сплющивание, потом распрямление, разворот и возврат к нулевой позиции
            const tl = gsap.timeline();
            const timeDeformation = (1 - deformationX) * width / (containerRect.width) * timeToEdge;
            const timeToReturn = Math.abs(safeEdgeX / containerRect.right * timeToEdge);
            // console.log("line ", i, " \nsafeStartX=", safeStartX, "\n safeEdgeX=", safeEdgeX, "\ntimeToEdge=", timeToEdge, " \ntimeToReturn=", timeToReturn, " \ntimeDeformation=", timeDeformation);
            let delayLine = 0;
            if (typeEffect === "ether-over-line" && delayEvenLine) {
                if (i % 2 !== 0) {
                    delayLine = 1 - (startLeft - containerRect.left) / (containerRect.right - startLeft - width) * timeToEdge; // корректировка задержки для нечетных строк
                } else {
                    delayLine = 0;
                }
                console.log(i, "  delayLine=", delayLine);
            } 
            
            
            tl.to(line, {
                x: safeEdgeX,
                delay: delayLine * 0,
                duration: timeToEdge,
                ease: "none"
            });
            tl.to(line, {
                scaleX: deformationX,
                scaleY: 1 / deformationX,
                duration: timeDeformation,
                ease: "power1.out"
            });
            tl.to(line, {
                scaleX: 1,
                scaleY: 1,
                duration: timeDeformation,
                ease: "power1.in",
            });
            tl.to(line, {
                x: 0,
                duration: timeToReturn,
                ease: "power1.out",
                onComplete: () => {
                    if (line.parentElement.children &&i === line.parentElement.children.length - 1) {
                        // Последняя строка завершила анимацию
                        if (!eachResizeAnimate) {
                            splitTitle.revert();
                        }
                        if (onComplete && typeof onComplete === "function") {
                            onComplete();
                        }
                    }
                }
            });
        }

        let continueRun = true;
        container.style.cssText = "overflow: hidden;";
        let splitTitle = new SplitText(title, { 
            type: "lines", 
            linesClass: "title-line", 
            autoSplit: true, 
            onRevert: ()=>{
                // console.log("revert");
                title.classList.remove("title-effect__title--split-done");
                title.style.cssText = titleInlineStyles + "opacity: 1;";
                if (eachResizeAnimate) {
                    gsap.set(title, { opacity: 0 });
                }
            }, 
            onSplit: (self) => {
                // console.log("Split complete");
                if (continueRun) {
                    self.lines.forEach((line, i) => {
                        saveStartPosition(line, i, container);
                        gsap.delayedCall(i * timeLineDelay, () => animateLineToEdges(line, i, container));
                    });
                    if (!eachResizeAnimate) {
                        continueRun = false;
                    }
                }
            }
        });
    });
}