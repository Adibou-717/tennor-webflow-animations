(function () {
    const s = document.createElement('style');
    s.id = 'arrow-base-state';
    s.textContent = '.button-arrow{width:0vw!important;opacity:0!important;overflow:hidden!important;height:1.1vw!important;transition:none!important;margin-left:0vw!important;}';
    document.head.appendChild(s);
})();


document.addEventListener("DOMContentLoaded", () => {

    // =============================================
    // SECTION A — BENEFICE TAB CARD ANIMATIONS
    // =============================================
    const tertiaryButtons = document.querySelectorAll(".benefice-tab .button-tertiary");
    const glassCards = document.querySelectorAll(".benefices_glasscards-wrapper .glass-card");

    const triggerCardReset = (card) => {
        card.dataset.animated = "false";
        card.style.opacity = "0";
        const textEl = card.querySelector(".overused-16");
        const imgEl = card.querySelector(".glasscard_image-bloc");
        if (textEl) { textEl.style.opacity = "0"; textEl.style.transform = "translateY(15px)"; }
        if (imgEl) { imgEl.style.opacity = "0"; imgEl.style.transform = "translateY(15px)"; }
    };

    const triggerCardOpenAnimation = (card) => {
        if (card.dataset.animated === "true") return;
        card.dataset.animated = "true";
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                card.style.opacity = "1";
                const numEl = card.querySelector(".bagoss-50");
                if (numEl) animateNumber(numEl);
                const textEl = card.querySelector(".overused-16");
                const imgEl = card.querySelector(".glasscard_image-bloc");
                if (textEl) { textEl.style.opacity = "1"; textEl.style.transform = "translateY(0)"; }
                if (imgEl) { imgEl.style.opacity = "1"; imgEl.style.transform = "translateY(0)"; }
            });
        });
    };

    glassCards.forEach(card => {
        card.style.transition = "opacity 0.4s cubic-bezier(0.65, 0, 0.35, 1)";
        const textEx = card.querySelector(".overused-16");
        const imgEx = card.querySelector(".glasscard_image-bloc");
        if (textEx) { textEx.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"; textEx.style.transitionDelay = "0.2s"; }
        if (imgEx) { imgEx.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"; imgEx.style.transitionDelay = "0.5s"; }
        if (!card.classList.contains("etablissement")) { card.style.display = "none"; } else { card.style.display = "flex"; }
        triggerCardReset(card);
    });

    // Scroll observer for benefice cards
    const wrapper = document.querySelector(".benefices_glasscards-wrapper");
    if (wrapper) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const currentCards = Array.from(glassCards).filter(c => c.style.display === "flex");
                if (currentCards.length === 0) return;
                if (entry.isIntersecting) {
                    currentCards.forEach(card => triggerCardOpenAnimation(card));
                } else if (entry.boundingClientRect.top > 0) {
                    currentCards.forEach(card => triggerCardReset(card));
                }
            });
        }, { threshold: 0.2 });
        observer.observe(wrapper);
    }

    // Tab click logic
    tertiaryButtons.forEach(button => {
        button.style.transition = "all 0.4s cubic-bezier(0.65, 0, 0.35, 1)";
        button.addEventListener("mouseenter", () => { if (!button.classList.contains("current")) button.classList.add("hover"); });
        button.addEventListener("mouseleave", () => { button.classList.remove("hover"); });
        button.addEventListener("click", (e) => {
            e.preventDefault();
            if (button.classList.contains("current")) return;
            tertiaryButtons.forEach(btn => { btn.classList.remove("current"); btn.classList.remove("hover"); });
            button.classList.add("current");
            const targetClass = button.id === "equipes" ? "equipe" : button.id;
            glassCards.forEach(card => { card.style.opacity = "0"; });
            setTimeout(() => {
                glassCards.forEach(card => {
                    if (card.classList.contains(targetClass)) {
                        card.style.display = "flex";
                        triggerCardReset(card);
                        triggerCardOpenAnimation(card);
                    } else {
                        card.style.display = "none";
                        triggerCardReset(card);
                    }
                });
            }, 400);
        });
    });


    // =============================================
    // SECTION A2 — SOLUTION 3D SLIDER ANIMATION
    // =============================================
    const solutionTabs = document.querySelectorAll(".solution_tab_button-wrapper");
    const solutionCardsNodes = document.querySelectorAll(".solution-card");
    const solutionWrapper = document.querySelector(".solution_cards-wrapper");

    if (solutionTabs.length > 0 && solutionCardsNodes.length > 0) {
        const solutionCards = Array.from(solutionCardsNodes);

        // 1. Setup Wrapper and Cards for Absolute Stacking
        if (solutionWrapper) {
            solutionWrapper.style.position = "relative";
            // Ensure wrapper height matches the tallest card to avoid collapse
            const updateWrapperHeight = () => {
                let maxH = 0;
                solutionCards.forEach(c => {
                    c.style.position = "relative"; // Temp for measurement
                    c.style.display = "flex";
                    maxH = Math.max(maxH, c.offsetHeight);
                    c.style.position = "absolute"; // Revert
                });
                solutionWrapper.style.minHeight = `${maxH}px`;
            };
            // Run after a tiny delay to ensure CSS is applied
            setTimeout(updateWrapperHeight, 100);
            window.addEventListener('resize', updateWrapperHeight);
        }

        let currentIndex = 0; // 0 = solution-1, 1 = solution-2, 2 = solution-3
        let isAnimating = false;

        // Position helper
        const applyCardState = (card, styleProps, transitionStr = "all 0.6s cubic-bezier(0.65, 0, 0.35, 1)") => {
            card.style.transition = transitionStr;
            card.style.transform = `scale(${styleProps.scale}) translateY(${styleProps.y})`;
            card.style.opacity = styleProps.opacity;
            card.style.zIndex = styleProps.zIndex;
            card.style.pointerEvents = styleProps.pointerEvents;
            card.style.filter = `blur(${styleProps.blur})`;
        };

        const update3DSlider = (targetIndex) => {
            currentIndex = targetIndex;

            // Update tab button classes 
            solutionTabs.forEach((tab, idx) => {
                const line = tab.querySelector(".solution_tab_button-line");
                const btn = tab.querySelector(".solution_tab-button");

                if (idx === currentIndex) {
                    if (btn) btn.classList.add("current");
                    if (line) line.classList.add("current");
                } else {
                    if (btn) btn.classList.remove("current");
                    if (line) line.classList.remove("current");
                }
            });

            // Update card states based on distance from targetIndex
            solutionCards.forEach((card, i) => {
                const diff = i - targetIndex;

                if (diff < 0) {
                    // Card is BEFORE the active card -> discarded/moved forward
                    applyCardState(card, {
                        scale: 1.05 + (Math.abs(diff) * 0.05),
                        y: `${5 * Math.abs(diff)}%`,
                        opacity: 0,
                        zIndex: 10 + Math.abs(diff),
                        pointerEvents: "none",
                        blur: "6px"
                    });
                } else if (diff === 0) {
                    // Card is CURRENT
                    applyCardState(card, {
                        scale: 1,
                        y: "0%",
                        opacity: 1,
                        zIndex: 10,
                        pointerEvents: "auto",
                        blur: "0px"
                    });
                } else {
                    // Card is AFTER the active card -> queued behind
                    applyCardState(card, {
                        scale: 1 - (diff * 0.05),
                        y: `-${diff * 8}%`,
                        opacity: 1 - (diff * 0.3),
                        zIndex: 10 - diff,
                        pointerEvents: "none",
                        blur: `${diff * 4}px`
                    });
                }
            });
        };

        // Click Events
        solutionTabs.forEach((tab, index) => {
            tab.addEventListener("click", (e) => {
                e.preventDefault();
                if (index !== currentIndex) {
                    update3DSlider(index);
                }
            });
        });

        // Initialize cards absolute positions and base styling
        solutionCards.forEach((card, i) => {
            card.style.position = "absolute";
            card.style.top = "0";
            card.style.left = "0";
            card.style.width = "100%";

            // Set initial inline properties (targetIndex = 0)
            const diff = i - 0;
            if (diff === 0) {
                applyCardState(card, { scale: 1, y: "0%", opacity: 1, zIndex: 10, pointerEvents: "auto", blur: "0px" }, "none");
            } else {
                applyCardState(card, { scale: 1 - (diff * 0.05), y: `-${diff * 8}%`, opacity: 1 - (diff * 0.3), zIndex: 10 - diff, pointerEvents: "none", blur: `${diff * 4}px` }, "none");
            }
        });

        // --- End Solution 3D Slider ---
    }


    // =============================================
    // SECTION B — NUMBER COUNTER ANIMATION
    // =============================================
    const originalTexts = new WeakMap();

    function animateNumber(element, durationMs = 1200) {
        if (!originalTexts.has(element)) originalTexts.set(element, element.textContent.trim());
        const text = originalTexts.get(element);

        const match = text.match(/^([+-]?)(\d+)(.*)$/);
        if (!match) return;
        const prefix = match[1], suffix = match[3];

        const targetNumber = prefix === '-' ? -parseInt(match[2], 10) : parseInt(match[2], 10);
        const startTime = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 4);
        function tick(now) {
            const progress = Math.min((now - startTime) / durationMs, 1);
            const currentVal = Math.round(easeOut(progress) * targetNumber);
            element.textContent = `${prefix}${Math.abs(currentVal)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick); else element.textContent = text;
        }
        requestAnimationFrame(tick);
    }


    // =============================================
    // SECTION C — HERO ENTRANCE (ON LOAD)
    // =============================================
    const heroKpi = document.querySelector(".hero_kpi-bloc");
    const heroTitleBloc = document.querySelector(".hero_title-bloc");
    const heroTitle = document.querySelector(".hero_title-bloc h1");
    const heroSub = document.querySelector(".hero_title-bloc p");
    const heroBtn = document.querySelector(".hero .button-secondary");
    const heroCard = document.querySelector(".hero_player-card");
    const heroImage = document.querySelector(".hero .image-2");
    // Animate .navbar-home directly — NOT .navbar-item (its wrapper)
    // transform on a parent of position:fixed elements breaks their containing block.
    const navbarHome = document.querySelector(".navbar-home");
    const heroSwoosh = document.querySelector(".hero-swoosh");
    const logosMarquee = document.querySelector(".clients_logos-marquee");

    // Ensure containers are visible if hidden by CSS
    if (heroTitleBloc) heroTitleBloc.style.opacity = "1";

    const splitTextToWords = (el) => {
        if (!el) return [];
        const words = el.innerText.trim().split(/\s+/);
        el.innerHTML = '';
        return words.map(word => {
            const mask = document.createElement("span");
            mask.style.cssText = "display:inline-block;overflow:hidden;vertical-align:bottom;padding-right:0.25em;";
            const inner = document.createElement("span");
            inner.textContent = word;
            // Set initial state without transition
            inner.style.display = "inline-block";
            inner.style.transform = "translateY(110%) rotate(5deg)";
            inner.style.opacity = "0";
            inner.style.transformOrigin = "top left";

            mask.appendChild(inner);
            el.appendChild(mask);

            // Force reflow and add transition afterwards
            inner.offsetHeight;
            inner.style.transition = "transform 0.8s cubic-bezier(0.2,0.8,0.2,1), opacity 0.7s ease-out";

            return inner;
        });
    };

    const animateIn = (el, delayMs) => {
        if (!el) return;
        // Snap to start state immediately
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";

        // Force reflow
        el.offsetHeight;

        // Apply transition and handle animation
        el.style.transition = "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.2,0.8,0.2,1)";
        setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, delayMs);
    };

    const titleWords = splitTextToWords(heroTitle);

    if (heroImage) {
        heroImage.style.transition = "none";
        heroImage.style.opacity = "0";
        heroImage.style.transform = "scale(1.05)";
        heroImage.offsetHeight; // force reflow
        heroImage.style.transition = "opacity 2s ease-out, transform 2s ease-out";
    }
    if (navbarHome) {
        // Reset the wrapper (.navbar-item) opacity to 1 — CSS has it at 0, but opacity cascades.
        // We can't animate the wrapper with transform as that would break position:fixed on children.
        const navbarWrapper = navbarHome.parentElement;
        if (navbarWrapper) navbarWrapper.style.opacity = "1";

        // Only animate opacity on navbarHome — no transform to avoid the containing-block bug.
        navbarHome.style.transition = "none";
        navbarHome.style.opacity = "0";
        navbarHome.offsetHeight; // force reflow
        navbarHome.style.transition = "opacity 1.2s ease-out";
    }
    if (heroCard) {
        heroCard.style.transition = "none";
        heroCard.style.opacity = "0";
        heroCard.style.transform = "translateY(40px) scale(0.95)";
        heroCard.offsetHeight; // force reflow
        heroCard.style.transition = "opacity 1.2s cubic-bezier(0.2,0.8,0.2,1), transform 1.2s cubic-bezier(0.2,0.8,0.2,1)";
    }
    if (heroSwoosh) {
        heroSwoosh.style.transition = "none";
        heroSwoosh.style.opacity = "0";
        heroSwoosh.style.transform = "translateY(20px)";
        heroSwoosh.offsetHeight;
        heroSwoosh.style.transition = "opacity 1.5s ease-out, transform 1.5s cubic-bezier(0.2,0.8,0.2,1)";
    }
    if (logosMarquee) {
        logosMarquee.style.transition = "none";
        logosMarquee.style.opacity = "0";
        logosMarquee.style.transform = "translateY(20px)";
        logosMarquee.offsetHeight;
        logosMarquee.style.transition = "opacity 1.2s ease-out, transform 1.2s cubic-bezier(0.2,0.8,0.2,1)";
    }

    setTimeout(() => { if (heroImage) { heroImage.style.opacity = "1"; heroImage.style.transform = "scale(1)"; } }, 50);
    setTimeout(() => { if (navbarHome) { navbarHome.style.opacity = "1"; } }, 150);

    titleWords.forEach((word, i) => {
        setTimeout(() => { word.style.transform = "translateY(0) rotate(0deg)"; word.style.opacity = "1"; }, 100 + i * 55);
    });

    const lastWordMs = 100 + titleWords.length * 55;
    animateIn(heroKpi, lastWordMs + 100);
    animateIn(heroSub, lastWordMs + 200);
    if (heroSwoosh) setTimeout(() => { heroSwoosh.style.opacity = "1"; heroSwoosh.style.transform = "translateY(0)"; }, lastWordMs + 250);
    animateIn(heroBtn, lastWordMs + 300);
    if (heroCard) setTimeout(() => { heroCard.style.opacity = "1"; heroCard.style.transform = "translateY(0) scale(1)"; }, lastWordMs + 400);
    if (logosMarquee) setTimeout(() => { logosMarquee.style.opacity = "1"; logosMarquee.style.transform = "translateY(0)"; }, lastWordMs + 600);


    // =============================================
    // SECTION D — SCROLL REVEAL (all sections except hero & faq-body)
    // =============================================
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
    // scrollReveal(".solution-card", 0.4, true); -> Managed by 3D Tab Logic
    scrollReveal(".temoignages_tab-button", 0.3, true);
    scrollReveal(".temoignage_cards-wrapper", 0.4, false);
    scrollReveal(".confiance_glasscards-wrappe .glass-card", 0.3, true);
    scrollReveal(".integration_bulletpoint", 0.3, true);
    scrollReveal(".integration_logos-bloc img", 0.4, true);
    scrollReveal(".faq-item", 0.3, true, 0);
    scrollReveal(".contact-container", 0.4, true, 0);


    // =============================================
    // SECTION E — FAQ ACCORDION
    // =============================================
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const header = item.querySelector(".faq-header");
        const body = item.querySelector(".faq-body");
        const chevron = item.querySelector(".faq-chevron");
        if (!header || !body) return;

        const cs = getComputedStyle(body);
        const natPadTop = cs.paddingTop, natPadBot = cs.paddingBottom, natH = body.scrollHeight;

        body.style.setProperty("height", "0px", "important");
        body.style.setProperty("padding-top", "0px", "important");
        body.style.setProperty("padding-bottom", "0px", "important");
        body.style.setProperty("opacity", "0", "important");
        body.style.setProperty("transform", "none", "important");
        body.style.overflow = "hidden";
        body.style.transition = "height 0.4s cubic-bezier(0.65,0,0.35,1), padding 0.4s cubic-bezier(0.65,0,0.35,1), opacity 0.4s cubic-bezier(0.65,0,0.35,1)";
        if (chevron) chevron.style.transition = "transform 0.4s cubic-bezier(0.65,0,0.35,1)";

        header.addEventListener("click", () => {
            const isOpen = body.style.height !== "0px";

            faqItems.forEach(other => {
                if (other === item) return;
                const ob = other.querySelector(".faq-body"), oc = other.querySelector(".faq-chevron");
                if (ob) { ob.style.setProperty("height", "0px", "important"); ob.style.setProperty("padding-top", "0px", "important"); ob.style.setProperty("padding-bottom", "0px", "important"); ob.style.setProperty("opacity", "0", "important"); }
                if (oc) oc.style.transform = "rotate(0deg)";
            });
            if (isOpen) {
                body.style.setProperty("height", "0px", "important");
                body.style.setProperty("padding-top", "0px", "important");
                body.style.setProperty("padding-bottom", "0px", "important");
                body.style.setProperty("opacity", "0", "important");
                if (chevron) chevron.style.transform = "rotate(0deg)";
            } else {
                body.style.setProperty("padding-top", natPadTop, "important");
                body.style.setProperty("padding-bottom", natPadBot, "important");
                body.style.setProperty("height", `${natH}px`, "important");
                body.style.setProperty("opacity", "1", "important");
                if (chevron) chevron.style.transform = "rotate(180deg)";
            }
        });
    });


    // =============================================
    // SECTION F — BUTTON ARROW HOVER
    // =============================================
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


    // =============================================
    // SECTION G — NAVBAR WHITE SCROLL REVEAL
    // =============================================
    const navbarWhite = document.querySelector(".navbar-home.white");
    let navbarVisible = false;
    if (navbarWhite) {

        navbarVisible = window.scrollY > 0;
        if (navbarVisible) navbarWhite.style.height = "4.9vw";

        requestAnimationFrame(() => {
            navbarWhite.style.transition = "height 0.5s cubic-bezier(0.65, 0, 0.35, 1)";
        });
    }

    // =============================================
    // SECTION H — TESTIMONIAL HOVER TABS
    // =============================================
    const testimonialButtons = document.querySelectorAll(".temoignages_tab-button");
    const testimonialCards = document.querySelectorAll(".temoignage-card");

    if (testimonialButtons.length > 0 && testimonialCards.length > 0) {
        const cardsWrapper = testimonialCards[0].parentElement;
        if (cardsWrapper) {
            cardsWrapper.style.position = "relative";
            cardsWrapper.style.minHeight = `${testimonialCards[0].offsetHeight}px`;
        }

        const resetCardElements = (card) => {
            const elsToAnimate = card.querySelectorAll(".bagoss-18, .bagoss-28, .bagoss-38, .temoignages_card-logo, .temoignages_card_icon-box, .temoignages_card-picture");
            elsToAnimate.forEach(el => {
                el.style.opacity = "0";
                el.style.transform = "translateY(15px)";
                el.style.transition = "none";
            });
        };

        const animateCardElements = (card) => {
            const elsToAnimate = card.querySelectorAll(".bagoss-18, .bagoss-28, .bagoss-38, .temoignages_card-logo, .temoignages_card_icon-box, .temoignages_card-picture");
            elsToAnimate.forEach((el, index) => {
                const delay = 0.1 + (index * 0.05);
                el.style.transition = `opacity 0.4s ease-out ${delay}s, transform 0.4s ease-out ${delay}s`;
                el.offsetHeight;
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            });

            // Animate numbers
            const numEls = card.querySelectorAll(".bagoss-38");
            numEls.forEach(el => animateNumber(el));
        };

        const fadeOutCardElements = (card) => {
            const elsToAnimate = card.querySelectorAll(".bagoss-18, .bagoss-28, .bagoss-38, .temoignages_card-logo, .temoignages_card_icon-box, .temoignages_card-picture");
            elsToAnimate.forEach((el, index) => {
                const delay = (elsToAnimate.length - 1 - index) * 0.02;
                el.style.transition = `opacity 0.3s ease-in ${delay}s, transform 0.3s ease-in ${delay}s`;
                el.style.opacity = "0";
                el.style.transform = "translateY(-15px)";
            });
        };

        testimonialCards.forEach(card => {
            card.style.position = "absolute";
            card.style.top = "0";
            card.style.left = "0";
            card.style.width = "100%";
            card.style.transition = "opacity 0.5s cubic-bezier(0.65, 0, 0.35, 1)"; // Crossfade duration

            if (!card.classList.contains("avis-1")) {
                card.style.opacity = "0";
                card.style.pointerEvents = "none";
                resetCardElements(card);
            } else {
                card.style.opacity = "1";
                card.style.pointerEvents = "auto";
                resetCardElements(card);
            }
        });

        let currentTestimonialId = "avis-1";
        let hasAnimatedInitial = false;

        if (cardsWrapper) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    const activeCard = Array.from(testimonialCards).find(c => c.style.opacity === "1");
                    if (!activeCard) return;

                    if (e.isIntersecting) {
                        if (!hasAnimatedInitial) {
                            hasAnimatedInitial = true;
                            requestAnimationFrame(() => animateCardElements(activeCard));
                        }
                    } else if (e.boundingClientRect.top > 0) {
                        hasAnimatedInitial = false;
                        resetCardElements(activeCard);
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(cardsWrapper);
        }

        testimonialButtons.forEach(button => {
            button.addEventListener("mouseenter", () => {
                const targetId = button.id;
                if (currentTestimonialId === targetId) return;

                currentTestimonialId = targetId;

                testimonialButtons.forEach(btn => btn.classList.remove("focus"));
                button.classList.add("focus");

                testimonialCards.forEach(card => {
                    if (card.classList.contains(targetId)) {
                        setTimeout(() => {
                            if (currentTestimonialId !== targetId) return;

                            card.style.pointerEvents = "auto";
                            requestAnimationFrame(() => {
                                card.style.opacity = "1";
                                resetCardElements(card);
                                requestAnimationFrame(() => {
                                    animateCardElements(card);
                                });
                            });
                        }, 200);
                    } else {
                        if (card.style.opacity !== "0") {
                            card.style.pointerEvents = "none";
                            card.style.opacity = "0";
                            fadeOutCardElements(card);
                            setTimeout(() => resetCardElements(card), 600);
                        }
                    }
                });
            });
        });
    }

    // =============================================
    // SECTION I — HERO AUDIO PLAYER
    // =============================================
    const audioProgressEl = document.getElementById("audio-progress");
    const audioDurationEl = document.getElementById("audio-duration");
    const playButton = document.querySelector(".hero_player_play-button");
    const progressCursor = document.querySelector(".hero_player_progress-cursor");

    if (audioProgressEl && audioDurationEl && playButton) {
        const audio = new Audio();
        audio.loop = true;
        audio.muted = true;
        audio.playsInline = true;
        audio.autoplay = true;
        audio.volume = 0;
        audio.src = "https://cdn.prod.website-files.com/69ab0ef79a40177ef07a2197/69ac6b9623f70422fa194e18_675487__lachai10__podcast-2023.mp3";
        const formatTime = (timeInSeconds) => {
            if (isNaN(timeInSeconds)) return "0:00";
            const m = Math.floor(timeInSeconds / 60);
            const s = Math.floor(timeInSeconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        };

        audio.addEventListener("loadedmetadata", () => {
            audioDurationEl.textContent = `/ ${formatTime(audio.duration)}`;
        });

        audio.addEventListener("timeupdate", () => {
            audioProgressEl.textContent = formatTime(audio.currentTime);
            if (progressCursor && audio.duration) {
                const pct = (audio.currentTime / audio.duration) * 100;
                progressCursor.style.width = `${pct}%`;
                progressCursor.style.background = "currentColor";
                if (!progressCursor.style.height) progressCursor.style.height = "100%";
            }
        });
        const attemptPlay = () => {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play prevented by browser, waiting for user interaction.", error);
                });
            }
        };
        attemptPlay();
        const unlockAudio = () => {
            if (audio.paused) attemptPlay();
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("scroll", unlockAudio);
        };
        document.addEventListener("click", unlockAudio, { once: true });
        document.addEventListener("scroll", unlockAudio, { once: true, passive: true });

        let fadeInterval = null;
        let isUnmuted = false;

        const playIcon = playButton.querySelector(".hero_player_play_button-icon.play");
        const pauseIcon = playButton.querySelector(".hero_player_play_button-icon.pause");

        if (pauseIcon) {
            pauseIcon.style.display = "none";
            pauseIcon.style.opacity = "0";
        }

        const animateButtonText = (btnTextEl, newText) => {
            const isMuting = newText === "Couper le son";
            const outIcon = isMuting ? playIcon : pauseIcon;
            const inIcon = isMuting ? pauseIcon : playIcon;

            if (btnTextEl) {
                btnTextEl.style.transition = "opacity 0.2s ease-in, transform 0.2s ease-in";
                btnTextEl.style.opacity = "0";
                btnTextEl.style.transform = "translateY(-10px)";
            }

            if (outIcon) {
                outIcon.style.transition = "opacity 0.2s ease-in, transform 0.2s ease-in";
                outIcon.style.opacity = "0";
                outIcon.style.transform = "scale(0.8)";
            }

            setTimeout(() => {
                if (btnTextEl) {
                    btnTextEl.textContent = newText;
                    btnTextEl.style.transition = "none";
                    btnTextEl.style.transform = "translateY(10px)";
                    btnTextEl.offsetHeight;
                    btnTextEl.style.transition = "opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                    btnTextEl.style.opacity = "1";
                    btnTextEl.style.transform = "translateY(0)";
                }

                if (outIcon) {
                    outIcon.style.display = "none";
                }

                if (inIcon) {
                    inIcon.style.display = "block";
                    inIcon.style.transition = "none";
                    inIcon.style.transform = "scale(0.8)";
                    inIcon.style.opacity = "0";
                    inIcon.offsetHeight;
                    inIcon.style.transition = "opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                    inIcon.style.opacity = "1";
                    inIcon.style.transform = "scale(1)";
                }
            }, 200);
        };

        playButton.addEventListener("click", (e) => {
            e.preventDefault();

            if (audio.paused) {
                audio.play();
            }

            clearInterval(fadeInterval);

            const btnText = playButton.querySelector("div");

            if (!isUnmuted) {
                audio.muted = false;
                isUnmuted = true;
                animateButtonText(btnText, "Couper le son");
                fadeInterval = setInterval(() => {
                    if (audio.volume < 0.95) {
                        audio.volume += 0.05;
                    } else {
                        audio.volume = 1;
                        clearInterval(fadeInterval);
                    }
                }, 25);
            } else {
                isUnmuted = false;
                animateButtonText(btnText, "Écouter Tennor");
                fadeInterval = setInterval(() => {
                    if (audio.volume > 0.05) {
                        audio.volume -= 0.05;
                    } else {
                        audio.volume = 0;
                        audio.muted = true;
                        clearInterval(fadeInterval);
                    }
                }, 25);
            }
        });
    }

    // =============================================
    // SECTION J — SMOOTH SCROLL (LENIS) & PARALLAX
    // =============================================
    const initLenisAndParallax = () => {
        const lenis = new window.Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            __experimental__naiveDimensions: true,
        });

        // =============================================
        // CONFIGURATION DU PARALLAXE (Valeurs facilement modifiables)
        // =============================================
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
            bg.style.willChange = "transform";
        });

        lenis.on('scroll', (e) => {
            const scrollY = e.animatedScroll;
            const windowHeight = window.innerHeight;

            // =============================================
            // Navbar White show/hide (uses targetScroll for instant response)
            // =============================================
            if (navbarWhite) {
                const targetScroll = e.targetScroll;
                if (targetScroll > 1 && !navbarVisible) {
                    navbarWhite.style.height = "4.9vw";
                    navbarVisible = true;
                } else if (targetScroll < 1 && navbarVisible) {
                    navbarWhite.style.height = "0";
                    navbarVisible = false;
                }
            }

            // 1. Hero BG Image Parallax (Based on hero section bounds)
            heroBgImages.forEach(img => {
                const parent = img.closest('.hero') || img.parentElement;
                if (!parent) return;

                const rect = parent.getBoundingClientRect();

                let progress = (0 - rect.top) / rect.height;
                progress = Math.max(0, Math.min(1, progress));

                const range = PARALLAX_CONFIG.hero.yEnd - PARALLAX_CONFIG.hero.yStart;
                const yValue = PARALLAX_CONFIG.hero.yStart + (progress * range);

                img.style.transform = `translateY(${yValue}%) scale(1.05)`;
            });

            // 2. Section BG Parallax (Triggered by parent .section-inner entering/leaving view)
            sectionBgs.forEach(bg => {
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

    // =============================================
    // SECTION K — DROPDOWN MENU ANIMATION
    // =============================================
    const ressourceMenuMask = document.querySelector(".ressource-menu-mask");

    // Select all dropdown nav links
    const navLinkDropdowns = document.querySelectorAll(".nav-link.dropdown, .nav-link.dropdown.purple");

    // We can use the first one as a check to see if the element exists at all
    const hasDropdownLink = navLinkDropdowns.length > 0;

    if (ressourceMenuMask && hasDropdownLink) {
        // Base state
        ressourceMenuMask.style.height = "0vh";
        ressourceMenuMask.style.overflow = "hidden";
        ressourceMenuMask.style.transition = "height 0.4s cubic-bezier(0.65, 0, 0.35, 1)";

        const navButtons = ressourceMenuMask.querySelectorAll(".ressource_menu_nav-button");
        const previewWrapper = ressourceMenuMask.querySelector(".ressource_menu_previews-wrapper");

        // Set initial state for inner elements
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

                // Animate elements in
                navButtons.forEach((btn, index) => {
                    const delay = 0.1 + (index * 0.05);
                    btn.style.transition = `opacity 0.4s ease-out ${delay}s, transform 0.4s ease-out ${delay}s`;
                    // Force reflow
                    btn.offsetHeight;
                    btn.style.opacity = "1";
                    btn.style.transform = "translateY(0)";
                });

                if (previewWrapper) {
                    const delay = 0.1; // Match the delay of the first nav item
                    previewWrapper.style.transition = `opacity 0.4s ease-out ${delay}s, transform 0.4s ease-out ${delay}s`;
                    previewWrapper.style.opacity = "1";
                    previewWrapper.style.transform = "translateY(0)";
                }
            }
        };

        const closeDropdown = () => {
            dropdownTimeout = setTimeout(() => {
                isDropdownOpen = false;

                // Fast animate out before closing
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

                // Close mask slightly after
                setTimeout(() => {
                    if (!isDropdownOpen) {
                        ressourceMenuMask.style.height = "0vh";
                        setTimeout(() => {
                            if (!isDropdownOpen) resetInnerElements();
                        }, 400); // wait for mask to close
                    }
                }, 200);

            }, 100);
        };

        // Initial setup for previews
        const previews = ressourceMenuMask.querySelectorAll(".ressource_menu_preview");
        if (previews.length > 0) {
            // Setup absolute positioning for smooth cross-fading
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

                // Show specialite-1 by default
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

        // Store reset functions for carrousels to call them on hover
        const carrouselResetFns = {};

        // Nav Buttons Hover effect (Iconbox color change + preview switch)
        navButtons.forEach((btn, index) => {
            const iconBox = btn.querySelector(".iconbox-045");
            if (iconBox) {
                // Pre-set transition for smooth class toggle
                iconBox.style.transition = "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease";
            }

            btn.addEventListener("mouseenter", () => {
                if (iconBox) {
                    iconBox.classList.remove("soft-grey");
                    iconBox.classList.add("soft-rose");
                }

                const targetId = btn.id; // e.g., "specialite-1"
                if (!targetId || targetId === currentActiveId) return;

                currentActiveId = targetId;

                previews.forEach(prev => {
                    if (prev.classList.contains(targetId)) {
                        prev.style.pointerEvents = "auto";
                        prev.classList.add("active");
                        // Use requestAnimationFrame for smooth transition trigger
                        requestAnimationFrame(() => {
                            prev.style.opacity = "1";
                            // Reset the carrousel for this preview if it exists
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

        // =============================================
        // SECTION L — FEATURES TEXT CARROUSEL
        // =============================================
        const featureCarrousels = ressourceMenuMask.querySelectorAll(".fonctionnalite-carrou");

        featureCarrousels.forEach(carrousel => {
            const items = Array.from(carrousel.querySelectorAll(".bagoss-16"));
            if (items.length < 2) return; // Need at least 2 items to form a loop

            // Find which preview this carrousel belongs to
            const parentPreview = carrousel.closest(".ressource_menu_preview");
            let previewId = null;
            if (parentPreview) {
                // Determine ID by finding the class that starts with specialite-
                const classes = Array.from(parentPreview.classList);
                const specClass = classes.find(c => c.startsWith("specialite-"));
                if (specClass) previewId = specClass;
            }

            // Prepare the wrapper for the items
            const inner = document.createElement("div");
            inner.className = "fonctionnalite-carrou-inner";
            inner.style.display = "flex";
            inner.style.flexDirection = "column";
            inner.style.transition = "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)";
            inner.style.width = "100%";

            // Move items to inner wrapper
            items.forEach(item => {
                item.style.flexShrink = "0";
                inner.appendChild(item);
            });

            // Clone the first item to make a perfect loop seamless
            const firstClone = items[0].cloneNode(true);
            inner.appendChild(firstClone);

            // Add inner to the carrousel
            carrousel.appendChild(inner);

            // Carrousel styles to show only one item at a time
            carrousel.style.overflow = "hidden";
            carrousel.style.position = "relative";
            carrousel.style.display = "flex";
            carrousel.style.flexDirection = "column";
            carrousel.style.justifyContent = "flex-start";

            let itemHeight = 0;

            const updateHeight = () => {
                // Ensure we get a valid height
                if (items[0].offsetHeight > 0) {
                    const style = window.getComputedStyle(items[0]);
                    const marginTop = parseFloat(style.marginTop) || 0;
                    const marginBottom = parseFloat(style.marginBottom) || 0;
                    itemHeight = items[0].offsetHeight + marginTop + marginBottom;
                    carrousel.style.height = `${itemHeight}px`;
                }
            };

            // Initial height check
            updateHeight();

            let currentIndex = 0;
            const totalItems = items.length;
            let intervalId = null;

            const startCarrousel = () => {
                clearInterval(intervalId);
                intervalId = setInterval(() => {
                    // Check if height wasn't calculated properly (e.g. loaded while hidden) or changed
                    if (itemHeight === 0 || items[0].offsetHeight === 0) {
                        updateHeight();
                    }

                    // If it's still 0, we are probably not visible so don't move
                    if (itemHeight === 0) return;

                    currentIndex++;
                    inner.style.transition = "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)";
                    inner.style.transform = `translateY(-${currentIndex * itemHeight}px)`;

                    // Snap back to 0 when we reach the clone
                    if (currentIndex === totalItems) {
                        setTimeout(() => {
                            inner.style.transition = "none";
                            currentIndex = 0;
                            inner.style.transform = `translateY(0px)`;
                        }, 400); // match transition duration
                    }
                }, 1500); // Wait 1.5s on each item
            };

            // Start initially
            startCarrousel();

            // Expose reset function for hover events
            if (previewId) {
                carrouselResetFns[previewId] = () => {
                    inner.style.transition = "none";
                    currentIndex = 0;
                    inner.style.transform = `translateY(0px)`;
                    updateHeight();
                    startCarrousel();
                };
            }

            // Update height if window resizes
            window.addEventListener('resize', updateHeight);
        });
    }
});
