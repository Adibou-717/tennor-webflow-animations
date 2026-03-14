(function () {
    const s = document.createElement('style');
    s.id = 'arrow-base-state';
    s.textContent = '.button-arrow{width:0vw!important;opacity:0!important;overflow:hidden!important;height:1.1vw!important;transition:none!important;margin-left:0vw!important;}';
    document.head.appendChild(s);
})();


// SECTION A — PAGES HERO ENTRANCE (ON LOAD)

(function pagesHeroEntrance() {
    const pagesHero = document.querySelector(".pages_hero-wrapper");
    if (!pagesHero) return;

    const navbar = pagesHero.querySelector(".navbar");

    if (navbar) {
        navbar.style.transition = "none";
        navbar.style.transform = "translateY(-1vw)";
        navbar.offsetHeight;
    }

    const revealAll = () => {
        const revealEls = document.querySelectorAll(".js-reveal");
        revealEls.forEach((el) => {
            el.style.transition = "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.2,0.8,0.2,1)";

            setTimeout(() => {
                el.style.opacity = "1";
                if (el === navbar) {
                    el.style.transform = "translateY(0)";
                }
            }, 100);
        });
    };

    revealAll();
})();


// SECTION B — DROPDOWN MENU ANIMATION

const ressourceMenuMask = document.querySelector(".ressource-menu-mask");

const navLinkDropdowns = document.querySelectorAll(".nav-link.dropdown, .nav-link.dropdown.purple");

const hasDropdownLink = navLinkDropdowns.length > 0;

if (ressourceMenuMask && hasDropdownLink) {
    ressourceMenuMask.style.height = "0vh";
    ressourceMenuMask.style.overflow = "hidden";
    ressourceMenuMask.style.transition = "height 0.4s cubic-bezier(0.65, 0, 0.35, 1)";

    const navButtons = ressourceMenuMask.querySelectorAll(".ressource_menu_nav-button");
    const previewWrapper = ressourceMenuMask.querySelector(".ressource_menu_previews-wrapper");

    const resetInnerElements = () => {
        navButtons.forEach(btn => {
            btn.style.opacity = "0";
            btn.style.transform = "translateY(15px)";
            btn.style.transition = "none";
        });
        if (previewWrapper) {
            previewWrapper.style.opacity = "0";
            previewWrapper.style.transform = "translateY(15px)";
            previewWrapper.style.transition = "none";
        }
    };

    resetInnerElements();

    let dropdownTimeout;
    let isDropdownOpen = false;

    const openDropdown = () => {
        clearTimeout(dropdownTimeout);
        if (!isDropdownOpen) {
            isDropdownOpen = true;
            ressourceMenuMask.style.height = ressourceMenuMask.scrollHeight + "px";

            navButtons.forEach((btn, index) => {
                const delay = 0.1 + (index * 0.05);
                btn.style.transition = `opacity 0.4s ease-out ${delay}s, transform 0.4s ease-out ${delay}s`;
                btn.offsetHeight;
                btn.style.opacity = "1";
                btn.style.transform = "translateY(0)";
            });

            if (previewWrapper) {
                const delay = 0.1;
                previewWrapper.style.transition = `opacity 0.4s ease-out ${delay}s, transform 0.4s ease-out ${delay}s`;
                previewWrapper.style.opacity = "1";
                previewWrapper.style.transform = "translateY(0)";
            }
        }
    };

    const closeDropdown = () => {
        dropdownTimeout = setTimeout(() => {
            isDropdownOpen = false;

            navButtons.forEach((btn, index) => {
                const delay = (navButtons.length - 1 - index) * 0.02;
                btn.style.transition = `opacity 0.2s ease-in ${delay}s, transform 0.2s ease-in ${delay}s`;
                btn.style.opacity = "0";
                btn.style.transform = "translateY(-10px)";
            });

            if (previewWrapper) {
                previewWrapper.style.transition = `opacity 0.2s ease-in, transform 0.2s ease-in`;
                previewWrapper.style.opacity = "0";
                previewWrapper.style.transform = "translateY(-10px)";
            }

            setTimeout(() => {
                if (!isDropdownOpen) {
                    ressourceMenuMask.style.height = "0vh";
                    setTimeout(() => {
                        if (!isDropdownOpen) resetInnerElements();
                    }, 400);
                }
            }, 200);

        }, 100);
    };

    const previews = ressourceMenuMask.querySelectorAll(".ressource_menu_preview");
    if (previews.length > 0) {
        if (previewWrapper) {
            previewWrapper.style.position = "relative";
        }

        previews.forEach((prev) => {
            prev.style.position = "absolute";
            prev.style.top = "0";
            prev.style.left = "0";
            prev.style.width = "100%";
            prev.style.height = "100%";
            prev.style.transition = "opacity 0.4s cubic-bezier(0.65, 0, 0.35, 1)";

            if (prev.classList.contains("specialite-1")) {
                prev.style.opacity = "1";
                prev.style.pointerEvents = "auto";
                prev.classList.add("active");
            } else {
                prev.style.opacity = "0";
                prev.style.pointerEvents = "none";
                prev.classList.remove("active");
            }
        });
    }

    let currentActiveId = "specialite-1";

    const carrouselResetFns = {};

    navButtons.forEach((btn, index) => {
        const iconBox = btn.querySelector(".iconbox-045");
        if (iconBox) {
            iconBox.style.transition = "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease";
        }

        btn.addEventListener("mouseenter", () => {
            if (iconBox) {
                iconBox.classList.remove("soft-grey");
                iconBox.classList.add("soft-rose");
            }

            const targetId = btn.id;
            if (!targetId || targetId === currentActiveId) return;

            currentActiveId = targetId;

            previews.forEach(prev => {
                if (prev.classList.contains(targetId)) {
                    prev.style.pointerEvents = "auto";
                    prev.classList.add("active");
                    requestAnimationFrame(() => {
                        prev.style.opacity = "1";
                        if (carrouselResetFns[targetId]) {
                            carrouselResetFns[targetId]();
                        }
                    });
                } else {
                    prev.style.pointerEvents = "none";
                    prev.classList.remove("active");
                    prev.style.opacity = "0";
                }
            });
        });

        btn.addEventListener("mouseleave", () => {
            if (iconBox) {
                iconBox.classList.remove("soft-rose");
                iconBox.classList.add("soft-grey");
            }
        });
    });

    navLinkDropdowns.forEach(link => {
        link.addEventListener("mouseenter", openDropdown);
        link.addEventListener("mouseleave", closeDropdown);
    });

    ressourceMenuMask.addEventListener("mouseenter", openDropdown);
    ressourceMenuMask.addEventListener("mouseleave", closeDropdown);

    // SECTION C — ABOUT TEXTS CARROUSEL

    const featureCarrousels = ressourceMenuMask.querySelectorAll(".fonctionnalite-carrou");

    featureCarrousels.forEach(carrousel => {
        const items = Array.from(carrousel.querySelectorAll(".bagoss-16"));
        if (items.length < 2) return;

        const parentPreview = carrousel.closest(".ressource_menu_preview");
        let previewId = null;
        if (parentPreview) {
            const classes = Array.from(parentPreview.classList);
            const specClass = classes.find(c => c.startsWith("specialite-"));
            if (specClass) previewId = specClass;
        }

        const inner = document.createElement("div");
        inner.className = "fonctionnalite-carrou-inner";
        inner.style.display = "flex";
        inner.style.flexDirection = "column";
        inner.style.transition = "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)";
        inner.style.width = "100%";

        items.forEach(item => {
            item.style.flexShrink = "0";
            inner.appendChild(item);
        });

        const firstClone = items[0].cloneNode(true);
        inner.appendChild(firstClone);

        carrousel.appendChild(inner);

        carrousel.style.overflow = "hidden";
        carrousel.style.position = "relative";
        carrousel.style.display = "flex";
        carrousel.style.flexDirection = "column";
        carrousel.style.justifyContent = "flex-start";

        let itemHeight = 0;

        const updateHeight = () => {
            if (items[0].offsetHeight > 0) {
                const style = window.getComputedStyle(items[0]);
                const marginTop = parseFloat(style.marginTop) || 0;
                const marginBottom = parseFloat(style.marginBottom) || 0;
                itemHeight = items[0].offsetHeight + marginTop + marginBottom;
                carrousel.style.height = `${itemHeight}px`;
            }
        };

        updateHeight();

        let currentIndex = 0;
        const totalItems = items.length;
        let intervalId = null;

        const startCarrousel = () => {
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                if (itemHeight === 0 || items[0].offsetHeight === 0) {
                    updateHeight();
                }

                if (itemHeight === 0) return;

                currentIndex++;
                inner.style.transition = "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)";
                inner.style.transform = `translateY(-${currentIndex * itemHeight}px)`;

                if (currentIndex === totalItems) {
                    setTimeout(() => {
                        inner.style.transition = "none";
                        currentIndex = 0;
                        inner.style.transform = `translateY(0px)`;
                    }, 400);
                }
            }, 1500);
        };

        startCarrousel();

        if (previewId) {
            carrouselResetFns[previewId] = () => {
                inner.style.transition = "none";
                currentIndex = 0;
                inner.style.transform = `translateY(0px)`;
                updateHeight();
                startCarrousel();
            };
        }

        window.addEventListener('resize', updateHeight);
    });
}


// SECTION D — ABOUT TABS TEXT ANIMATION

const aboutTabs = document.querySelectorAll(".solution_tab_button-wrapper");
const aboutTextsWrapper = document.querySelector(".about_texts-wrapper");

if (aboutTabs.length > 0 && aboutTextsWrapper) {
    const aboutTexts = [
        document.querySelector(".about-text-1"),
        document.querySelector(".about-text-2"),
        document.querySelector(".about-text-3")
    ].filter(Boolean);

    const splitTextIntoWords = (element) => {
        const text = element.textContent.trim();
        const words = text.split(/\s+/);
        element.innerHTML = "";

        words.forEach(word => {
            const mask = document.createElement("span");
            mask.style.display = "inline-block";
            mask.style.overflow = "hidden";
            mask.style.verticalAlign = "top";
            mask.style.marginRight = "0.25em";

            const inner = document.createElement("span");
            inner.className = "word-inner";
            inner.style.display = "inline-block";
            inner.textContent = word;
            inner.style.transform = "translateY(100%)";
            inner.style.opacity = "0";

            mask.appendChild(inner);
            element.appendChild(mask);
        });
        return element.querySelectorAll(".word-inner");
    };

    const textWords = aboutTexts.map(textEl => {
        textEl.style.position = "absolute";
        textEl.style.top = "0";
        textEl.style.left = "0";
        textEl.style.width = "100%";
        textEl.style.margin = "0";
        return splitTextIntoWords(textEl);
    });

    aboutTextsWrapper.style.position = "relative";

    const updateWrapperHeight = () => {
        let maxH = 0;
        aboutTexts.forEach(t => {
            t.style.position = "relative";
            t.style.display = "block";
            maxH = Math.max(maxH, t.offsetHeight);
            t.style.position = "absolute";
        });
        aboutTextsWrapper.style.minHeight = `${maxH}px`;
    };

    setTimeout(updateWrapperHeight, 150);
    window.addEventListener('resize', updateWrapperHeight);

    let currentIndex = 0;

    const animateIn = (wordElements) => {
        wordElements.forEach((el, index) => {
            el.style.transition = "none";
            el.style.transform = "translateY(100%)";
            el.style.opacity = "0";

            el.offsetHeight;

            const delay = index * 0.012; // stagger per word
            el.style.transition = `transform 0.5s cubic-bezier(0.65, 0, 0.35, 1) ${delay}s, opacity 0.5s cubic-bezier(0.65, 0, 0.35, 1) ${delay}s`;
            el.style.transform = "translateY(0%)";
            el.style.opacity = "1";
        });
    };

    const animateOut = (wordElements) => {
        wordElements.forEach((el, index) => {
            const delay = index * 0.012;
            el.style.transition = `transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) ${delay}s, opacity 0.4s cubic-bezier(0.65, 0, 0.35, 1) ${delay}s`;
            el.style.transform = "translateY(-100%)";
            el.style.opacity = "0";
        });
    };

    const updateTabs = (targetIndex) => {
        if (targetIndex === currentIndex) return;

        aboutTabs.forEach((tab, idx) => {
            const line = tab.querySelector(".solution_tab_button-line");
            const btn = tab.querySelector(".solution_tab-button");

            if (idx === targetIndex) {
                if (btn) btn.classList.add("current");
                if (line) line.classList.add("current");
            } else {
                if (btn) btn.classList.remove("current");
                if (line) line.classList.remove("current");
            }
        });

        if (textWords[currentIndex]) {
            const outgoingWords = textWords[currentIndex];
            animateOut(outgoingWords);
            aboutTexts[currentIndex].style.pointerEvents = "none";
        }

        currentIndex = targetIndex;

        if (textWords[currentIndex]) {
            const incomingWords = textWords[currentIndex];
            aboutTexts[currentIndex].style.pointerEvents = "auto";

            setTimeout(() => {
                animateIn(incomingWords);
            }, 150);
        }
    };

    if (textWords[0]) {
        setTimeout(() => animateIn(textWords[0]), 50);
        aboutTexts.forEach((text, i) => {
            text.style.pointerEvents = i === 0 ? "auto" : "none";
        });
    }

    aboutTabs.forEach((tab, index) => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            updateTabs(index);
        });
    });
}


// SECTION E — BUTTON ARROW HOVER

const arrowButtons = document.querySelectorAll(".footer_nav-link, .button-primary, .button-secondary");
arrowButtons.forEach(btn => {
    const arrow = btn.querySelector(".button-arrow");
    if (!arrow) return;
    btn.addEventListener("mouseenter", () => {
        arrow.style.setProperty("width", "1.1vw", "important");
        arrow.style.setProperty("opacity", "1", "important");
        arrow.style.setProperty("margin-left", "0.5vw", "important");
        arrow.style.setProperty("transition", "width 0.4s cubic-bezier(0.65,0,0.35,1), margin-left 0.4s cubic-bezier(0.65,0,0.35,1), opacity 0.4s cubic-bezier(0.65,0,0.35,1)", "important");
    });
    btn.addEventListener("mouseleave", () => {
        arrow.style.setProperty("width", "0vw", "important");
        arrow.style.setProperty("margin-left", "0vw", "important");
        arrow.style.setProperty("opacity", "0", "important");
    });
});


// SECTION F — SCROLL REVEAL (all sections except hero & faq-body)

const scrollReveal = (selector, delay = 0, stagger = false, translateDist = 30) => {
    const els = Array.from(document.querySelectorAll(selector)).filter(el => !el.closest(".faq-body") && !el.closest(".hero"));
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = "1";
                if (translateDist) e.target.style.transform = "translateY(0)";
            } else if (e.boundingClientRect.top > 0) {
                e.target.style.opacity = "0";
                if (translateDist) e.target.style.transform = `translateY(${translateDist}px)`;
            }
        });
    }, { threshold: 0.1 });
    els.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = translateDist ? `translateY(${translateDist}px)` : "none";
        el.style.transition = translateDist ? "opacity 0.8s ease-out, transform 0.8s ease-out" : "opacity 0.8s ease-out";
        el.style.transitionDelay = `${stagger ? delay + (i % 10 * 0.1) : delay}s`;
        obs.observe(el);
    });
};

scrollReveal(".section-name", 0);
scrollReveal(".bagoss-38", 0.1);
scrollReveal(".overused-19", 0.2);
scrollReveal(".solution_tab_button-wrapper", 0.3, true);
scrollReveal(".temoignages_tab-button", 0.3, true);
scrollReveal(".temoignage_cards-wrapper", 0.4, false);
scrollReveal(".confiance_glasscards-wrappe .glass-card", 0.3, true);
scrollReveal(".integration_bulletpoint", 0.3, true);
scrollReveal(".integration_logos-bloc img", 0.4, true);
scrollReveal(".faq-item", 0.3, true, 0);
scrollReveal(".contact-container", 0.4, true, 0);


// SECTION G — SMOOTH SCROLL (LENIS) & PARALLAX

const initLenisAndParallax = () => {
    const lenis = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        __experimental__naiveDimensions: true,
    });


    // CONFIGURATION DU PARALLAXE

    const PARALLAX_CONFIG = {
        // Valeurs pour l'image du Hero (défilement à partir du haut de la page)
        hero: {
            yStart: 0,   // % translateY au chargement de la page (quand le hero est en haut)
            yEnd: 50     // % translateY quand la section hero disparaît par le haut de l'écran
        },
        // Valeurs pour les images de fond des autres sections (défilement à l'apparition)
        section: {
            yStart: -25, // % translateY quand la section fait son apparition en bas de l'écran
            yEnd: 25     // % translateY quand la section disparaît en haut de l'écran
        }
    };

    const heroBgImages = document.querySelectorAll(".hero_bg-image");
    const sectionBgs = document.querySelectorAll(".section-bg");

    heroBgImages.forEach(img => {
        img.style.willChange = "transform";
        img.style.transform = `translateY(${PARALLAX_CONFIG.hero.yStart}%) scale(1.05)`;
    });

    sectionBgs.forEach(bg => {
        if (bg.closest('.hero') || bg.closest('.pages_hero-wrapper')) return;

        bg.style.willChange = "transform";
        bg.style.transform = `translateY(${PARALLAX_CONFIG.section.yStart}%) scale(1.05)`;
    });

    const allHeroBgs = document.querySelectorAll(".hero_bg-image, .pages_hero-wrapper .section-bg");

    lenis.on('scroll', () => {
        const windowHeight = window.innerHeight;

        // 1. Hero / Pages Hero Parallax (Exit-based)
        allHeroBgs.forEach(img => {
            const parent = img.closest('.hero') || img.closest('.pages_hero-wrapper');
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            let progress = (0 - rect.top) / rect.height;
            progress = Math.max(0, Math.min(1, progress));

            const range = PARALLAX_CONFIG.hero.yEnd - PARALLAX_CONFIG.hero.yStart;
            const yValue = PARALLAX_CONFIG.hero.yStart + (progress * range);

            img.style.transform = `translateY(${yValue}%) scale(1.05)`;
        });

        // 2. Section BG Parallax (Entrance-based)
        sectionBgs.forEach(bg => {
            if (bg.closest('.pages_hero-wrapper')) return;

            const parent = bg.closest('.section-inner');
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const totalDist = windowHeight + rect.height;
            const scrolledDist = windowHeight - rect.top;

            let progress = scrolledDist / totalDist;
            progress = Math.max(0, Math.min(1, progress));

            const range = PARALLAX_CONFIG.section.yEnd - PARALLAX_CONFIG.section.yStart;
            const yValue = PARALLAX_CONFIG.section.yStart + (progress * range);

            bg.style.transform = `translateY(${yValue}%) scale(1.05)`;
        });
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
};

if (typeof window.Lenis === "undefined") {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/lenis@1.1.18/dist/lenis.min.js";
    script.onload = () => initLenisAndParallax();
    document.head.appendChild(script);
} else {
    initLenisAndParallax();
}
