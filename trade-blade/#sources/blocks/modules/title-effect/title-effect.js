import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

function getResolvedEffectOptions(baseOptions) {
    // Подбираем параметры эффекта по media-условиям, чтобы сохранить адаптивное поведение из текущей реализации.
    const resolvedOptions = {
        typeEffect: baseOptions.typeEffect,
        timeToEdge: baseOptions.timeToEdge,
        timeLineDelay: baseOptions.timeLineDelay,
        delayEvenLine: baseOptions.delayEvenLine,
    };

    if (!baseOptions.response) {
        return resolvedOptions;
    }

    baseOptions.response.forEach((responseItem) => {
        if (window.matchMedia(responseItem.media).matches) {
            resolvedOptions.typeEffect =
        responseItem.options.typeEffect || resolvedOptions.typeEffect;
            resolvedOptions.timeToEdge =
        responseItem.options.timeToEdge || resolvedOptions.timeToEdge;
            resolvedOptions.timeLineDelay =
        responseItem.options.timeLineDelay || resolvedOptions.timeLineDelay;
            resolvedOptions.delayEvenLine =
        responseItem.options.delayEvenLine || resolvedOptions.delayEvenLine;
        }
    });

    return resolvedOptions;
}

function setTitleAlignmentStyles(title) {
    // После сплита выставляем flex-выравнивание, чтобы измерения строк были корректными для любого text-align.
    title.classList.add("title-effect__title--split-done");
    const textAlign = getComputedStyle(title).textAlign;

    if (textAlign === "center") {
        title.style.cssText +=
      "display: flex; flex-direction: column; justify-content: flex-start; align-items: center;";
    }
    if (textAlign === "left" || textAlign === "start") {
        title.style.cssText +=
      "display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;";
    }
    if (textAlign === "right" || textAlign === "end") {
        title.style.cssText +=
      "display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-end;";
    }
}

function setLineStartMetrics(line) {
    // Сохраняем стартовую геометрию строки в dataset, чтобы повторно использовать ее на этапах анимации.
    const lineRect = line.getBoundingClientRect();
    line.dataset.startLeft = lineRect.left;
    line.dataset.startRight = lineRect.right;
    line.dataset.width = lineRect.width;
}

function calcLineStartTranslateX(line, lineIndex, containerRect, typeEffect) {
    // Вычисляем стартовый x-сдвиг строки в зависимости от типа эффекта.
    if (typeEffect === "from-right") {
        line.style.cssText += "transform-origin: left center;";
        return containerRect.right - line.dataset.startLeft;
    }

    if (typeEffect === "from-left") {
        line.style.cssText += "transform-origin: right center;";
        return -(line.dataset.startRight - containerRect.left);
    }

    if (lineIndex % 2 === 0) {
        line.style.cssText += "transform-origin: right center;";
        return -(line.dataset.startRight - containerRect.left);
    }

    line.style.cssText += "transform-origin: left center;";
    return containerRect.right - line.dataset.startLeft;
}

function setLineStartPosition(
    line,
    lineIndex,
    containerRect,
    resolvedOptions,
    onTitleVisible,
) {
    // Устанавливаем исходную позицию до старта timeline, чтобы вылет был из-за границы контейнера.
    setLineStartMetrics(line);
    const startX = calcLineStartTranslateX(
        line,
        lineIndex,
        containerRect,
        resolvedOptions.typeEffect,
    );
    gsap.set(line, {
        x: startX,
        onComplete: onTitleVisible,
    });
}

function calcLineSafeEdgeX(line, lineIndex, containerRect, typeEffect) {
    // Находим целевую точку у противоположной границы контейнера.
    const startLeft = parseFloat(line.dataset.startLeft);
    const startRight = parseFloat(line.dataset.startRight);

    if (typeEffect === "from-right") {
        return -(startLeft - containerRect.left);
    }
    if (typeEffect === "from-left") {
        return containerRect.right - startRight;
    }
    if (lineIndex % 2 === 0) {
        return containerRect.right - startRight;
    }
    return -(startLeft - containerRect.left);
}

function calcEtherOddLineDelay(
    line,
    lineIndex,
    containerRect,
    resolvedOptions,
) {
    // Для ether-over-line оставляем прежнюю формулу задержки нечетных строк.
    if (
        resolvedOptions.typeEffect !== "ether-over-line" ||
    !resolvedOptions.delayEvenLine ||
    lineIndex % 2 === 0
    ) {
        return 0;
    }

    const startLeft = parseFloat(line.dataset.startLeft);
    const width = parseFloat(line.dataset.width);
    return (
        1 -
    ((startLeft - containerRect.left) /
      (containerRect.right - startLeft - width)) *
      resolvedOptions.timeToEdge
    );
}

function createLineAnimation(
    line,
    lineIndex,
    containerRect,
    effectOptions,
    deformationX,
    onLineComplete,
) {
    // Собираем полный цикл: пролет к краю, деформация, восстановление формы и возврат в 0.
    const safeEdgeX = calcLineSafeEdgeX(
        line,
        lineIndex,
        containerRect,
        effectOptions.typeEffect,
    );
    const width = parseFloat(line.dataset.width);
    const timeDeformation =
    (((1 - deformationX) * width) / containerRect.width) *
    effectOptions.timeToEdge;
    const timeToReturn = Math.abs(
        (safeEdgeX / containerRect.right) * effectOptions.timeToEdge,
    );
    const delayLine = calcEtherOddLineDelay(
        line,
        lineIndex,
        containerRect,
        effectOptions,
    );

    const lineTimeline = gsap.timeline();
    lineTimeline.to(line, {
        x: safeEdgeX,
        delay: delayLine * 0,
        duration: effectOptions.timeToEdge,
        ease: "none",
    });
    lineTimeline.to(line, {
        scaleX: deformationX,
        scaleY: 1 / deformationX,
        duration: timeDeformation,
        ease: "power1.out",
    });
    lineTimeline.to(line, {
        scaleX: 1,
        scaleY: 1,
        duration: timeDeformation,
        ease: "power1.in",
    });
    lineTimeline.to(line, {
        x: 0,
        duration: timeToReturn,
        ease: "power1.out",
        onComplete: onLineComplete,
    });
}

function restoreTitleStyles(title, titleInlineStyles, eachResizeAnimate) {
    // Возвращаем исходные inline-стили после revert, чтобы не ломать внешний вид вне анимации.
    title.classList.remove("title-effect__title--split-done");
    title.style.cssText = titleInlineStyles + "opacity: 1;";
    if (eachResizeAnimate) {
        gsap.set(title, { opacity: 0 });
    }
}

function runTitleSplitAnimation(title, container, options, titleInlineStyles) {
    // Запускаем SplitText и синхронизируем завершение последней строки с пользовательским onComplete.
    let canRunAnimation = true;
    let splitTitle;
    container.style.cssText = "overflow: hidden;";

    splitTitle = new SplitText(title, {
        type: "lines",
        linesClass: "title-line",
        autoSplit: true,
        onRevert: () => {
            restoreTitleStyles(title, titleInlineStyles, options.eachResizeAnimate);
        },
        onSplit: (self) => {
            if (!canRunAnimation) {
                return;
            }

            setTitleAlignmentStyles(title);
            const containerRect = container.getBoundingClientRect();
            const effectOptions = getResolvedEffectOptions(options);

            self.lines.forEach((line, lineIndex) => {
                setLineStartPosition(
                    line,
                    lineIndex,
                    containerRect,
                    effectOptions,
                    () => {
                        gsap.set(title, { opacity: 1 });
                    },
                );

                gsap.delayedCall(lineIndex * effectOptions.timeLineDelay, () => {
                    createLineAnimation(
                        line,
                        lineIndex,
                        containerRect,
                        effectOptions,
                        options.deformationX,
                        () => {
                            const isLastLine =
                line.parentElement.children &&
                lineIndex === line.parentElement.children.length - 1;
                            if (!isLastLine) {
                                return;
                            }

                            if (!options.eachResizeAnimate) {
                                splitTitle.revert();
                            }
                            if (
                                options.onComplete &&
                typeof options.onComplete === "function"
                            ) {
                                options.onComplete();
                            }
                        },
                    );
                });
            });

            if (!options.eachResizeAnimate) {
                canRunAnimation = false;
            }
        },
    });
}

export function titleEffect({
    titleSelector = ".title-effect__title",
    containerSelector = ".title-effect__container",
    typeEffect = "from-right",
    timeToEdge = 1,
    timeLineDelay = 0.33,
    delayEvenLine = false,
    deformationX = 0.7,
    eachResizeAnimate = false,
    onComplete = null,
    response = false,
} = {}) {
    // Ждем загрузки шрифтов, чтобы измерения строк были финальными и анимация не "прыгала".
    document.fonts.ready.then(() => {
        const title = document.querySelector(titleSelector);
        const container = document.querySelector(containerSelector);
        if (!title) {
            return;
        }
        if (!container) {
            return;
        }

        // Сохраняем стили до split и временно скрываем заголовок на этапе подготовки.
        const titleInlineStyles = title.style.cssText;
        title.style.cssText = "opacity: 0;";

        runTitleSplitAnimation(
            title,
            container,
            {
                typeEffect,
                timeToEdge,
                timeLineDelay,
                delayEvenLine,
                deformationX,
                eachResizeAnimate,
                onComplete,
                response,
            },
            titleInlineStyles,
        );
    });
}
