// ==========================================================================
// Ahmed Hugais — Portfolio (vanilla JS, no jQuery/Bootstrap)
// ==========================================================================

// Re-land on the #hash target once images have finished loading — on a cold
// cache, the browser can jump to a hash before below-the-fold images have
// pushed content into its final position, landing one section too early.
window.addEventListener('load', () => {
    if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
    }
});

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Theme (light/dark) ---------- */
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeToggle.classList.add('flip');
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(next);
            localStorage.setItem('theme', next);
            setTimeout(() => themeToggle.classList.remove('flip'), 500);
            if (hamburgerToggle) hamburgerToggle.checked = false;
        });
    }

    function setTheme(theme) {
        // Icon swap is pure CSS (html[data-theme] selectors) — nothing to do here.
        root.setAttribute('data-theme', theme);
    }

    /* ---------- Close mobile menu after tapping a link ---------- */
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    if (hamburgerToggle) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => { hamburgerToggle.checked = false; });
        });
    }

    /* ---------- Typewriter ---------- */
    const sentences = [
        "I build things that solve real problems.",
        "UC Berkeley CS grad, ready for what's next.",
        "Currently open to new opportunities."
    ];
    const sentenceEl = document.getElementById('sentence');
    const speedType = 55;
    const speedErase = 28;
    const holdTime = 1600;
    let sIndex = 0, cIndex = 0;

    if (sentenceEl) typeWriter();

    function typeWriter() {
        const current = sentences[sIndex];
        if (cIndex < current.length) {
            sentenceEl.textContent += current.charAt(cIndex);
            cIndex++;
            setTimeout(typeWriter, speedType);
        } else {
            setTimeout(eraseWriter, holdTime);
        }
    }
    function eraseWriter() {
        const current = sentenceEl.textContent;
        if (current.length > 0) {
            sentenceEl.textContent = current.slice(0, -1);
            setTimeout(eraseWriter, speedErase);
        } else {
            sIndex = (sIndex + 1) % sentences.length;
            cIndex = 0;
            setTimeout(typeWriter, speedType);
        }
    }

    /* ---------- Scroll reveal ----------
       The reveal transition is applied inline, not via a `.reveal { transition }`
       CSS rule, because cards like .project-item declare their own `transition`
       shorthand for hover/press feedback — a second shorthand from a class
       would silently replace it rather than merge with it, which quietly broke
       the fade/slide on every card (opacity had no transition at all, and the
       slide-up ran at the fast hover speed instead of the reveal speed).
       Setting it inline right before the reveal, then clearing it once the
       transition ends, lets the reveal run at its own slower pace without
       touching that card's normal fast hover transition afterwards. */
    const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;

            if (el.classList.contains('reveal-stagger')) {
                Array.from(el.children).forEach((child, i) => {
                    child.style.setProperty('--stagger-i', i);
                });
                el.classList.add('in-view');
            }

            if (el.classList.contains('reveal')) {
                el.style.transitionProperty = 'opacity, transform';
                el.style.transitionDuration = 'var(--t-reveal)';
                el.style.transitionTimingFunction = 'var(--ease)';
                // Wait two animation frames before actually triggering the opacity/
                // transform change. A single reflow (e.g. reading offsetHeight) forces
                // layout to flush but doesn't reliably force non-layout properties like
                // opacity/transition to be committed first — the browser can still fold
                // the "before" and "after" states into one paint and skip the transition
                // entirely. Two rAFs guarantee a real paint happens in between.
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        el.classList.add('in-view');
                        el.addEventListener('transitionend', () => {
                            el.style.transitionProperty = '';
                            el.style.transitionDuration = '';
                            el.style.transitionTimingFunction = '';
                        }, { once: true });
                    });
                });
            } else {
                el.classList.add('in-view');
            }

            observer.unobserve(el);
        });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => observer.observe(el));

    /* ---------- Scroll progress bar (draggable) ----------
       Pointer Events unify mouse, touch, and pen behind one API, and
       setPointerCapture keeps pointermove firing on the track even if the
       finger/cursor drifts above or below the thin bar mid-drag.

       The bar isn't a plain proportion of total page height — the nav links
       are spread evenly across the bar, but sections aren't evenly tall, so
       that would leave the bar visibly under the wrong link most of the
       time. Instead it's calibrated: for each section, we record the scroll
       position where it starts and the x-position of its nav link, then
       piecewise-linearly interpolate between those calibration points. The
       result stays continuous (no jump-then-hold like a discrete scrollspy)
       while still lining up with the right link the instant that section's
       top reaches the nav bar. Pages without matching in-page sections
       (project detail pages) fall back to plain scroll-fraction. */
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTrack = document.getElementById('scroll-progress-track');
    if (scrollProgress && scrollTrack) {
        const getScrollable = () => document.documentElement.scrollHeight - window.innerHeight;

        let calibration = [];
        const buildCalibration = () => {
            const trackRect = scrollTrack.getBoundingClientRect();
            if (trackRect.width === 0) return [];
            // Clamp each point to the actually-reachable scroll range: the last
            // section can start further down than the page can ever scroll to
            // (there's no content below it to keep scrolling through), so its
            // raw offsetTop overshoots max scrollY and needs to be capped —
            // otherwise the bar undershoots the link's position at page bottom.
            const scrollable = getScrollable();
            const points = [];
            const addPoint = (sectionId, linkEl) => {
                const section = document.getElementById(sectionId);
                if (!section || !linkEl) return;
                // The link's horizontal center, not its left edge — so the bar's
                // leading edge lines up under the middle of the word itself.
                const linkRect = linkEl.getBoundingClientRect();
                const center = linkRect.left + linkRect.width / 2;
                const frac = Math.min(1, Math.max(0, (center - trackRect.left) / trackRect.width));
                points.push({ scrollY: Math.min(section.offsetTop, scrollable), frac });
            };
            addPoint('Home', document.querySelector('.brand-name'));
            ['About', 'Experience', 'Skills', 'Projects', 'Education', 'Contact'].forEach(id =>
                addPoint(id, document.querySelector(`.nav-links a[href="#${id}"]`))
            );
            return points.length < 2 ? [] : points;
        };

        const fracForScrollY = (y) => {
            if (calibration.length < 2) {
                const scrollable = getScrollable();
                return scrollable > 0 ? y / scrollable : 0;
            }
            if (y <= calibration[0].scrollY) return calibration[0].frac;
            for (let i = 0; i < calibration.length - 1; i++) {
                const a = calibration[i], b = calibration[i + 1];
                if (y <= b.scrollY) return a.frac + (b.frac - a.frac) * ((y - a.scrollY) / ((b.scrollY - a.scrollY) || 1));
            }
            return calibration[calibration.length - 1].frac;
        };

        const scrollYForFrac = (frac) => {
            if (calibration.length < 2) return frac * getScrollable();
            if (frac <= calibration[0].frac) return calibration[0].scrollY;
            for (let i = 0; i < calibration.length - 1; i++) {
                const a = calibration[i], b = calibration[i + 1];
                if (frac <= b.frac) return a.scrollY + (b.scrollY - a.scrollY) * ((frac - a.frac) / ((b.frac - a.frac) || 1));
            }
            return calibration[calibration.length - 1].scrollY;
        };

        const updateScrollProgress = () => {
            scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, fracForScrollY(window.scrollY)))})`;
        };
        const recalibrate = () => { calibration = buildCalibration(); updateScrollProgress(); };
        recalibrate();
        window.addEventListener('scroll', updateScrollProgress);
        window.addEventListener('resize', recalibrate);
        window.addEventListener('load', recalibrate);

        const fracFromClientX = (clientX) => {
            const rect = scrollTrack.getBoundingClientRect();
            return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        };

        let dragging = false, moved = false, downX = 0;
        const MOVE_THRESHOLD = 4;

        scrollTrack.addEventListener('pointerdown', (e) => {
            dragging = true;
            moved = false;
            downX = e.clientX;
            scrollTrack.classList.add('dragging');
            scrollTrack.setPointerCapture(e.pointerId);
        });
        scrollTrack.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            if (!moved && Math.abs(e.clientX - downX) > MOVE_THRESHOLD) moved = true;
            if (!moved) return;
            const frac = fracFromClientX(e.clientX);
            // `behavior: 'instant'` opts out of the page's `scroll-behavior: smooth`
            // (used for nav-link clicks) — during a drag, each pointermove would
            // otherwise queue its own smooth animation, so the page was always
            // chasing a few frames behind the cursor.
            window.scrollTo({ top: scrollYForFrac(frac), left: 0, behavior: 'instant' });
            scrollProgress.style.transform = `scaleX(${frac})`;
        });
        const resetDrag = () => {
            dragging = false;
            scrollTrack.classList.remove('dragging');
        };
        scrollTrack.addEventListener('pointerup', (e) => {
            if (!dragging) return;
            const wasClick = !moved;
            resetDrag();
            // A plain click (released without dragging) animates smoothly to the
            // clicked position instead of snapping instantly, so it reads as
            // "jump there" rather than "teleport" — the opposite of a drag, which
            // stays perfectly instant so it never lags behind the cursor.
            if (wasClick) window.scrollTo({ top: scrollYForFrac(fracFromClientX(e.clientX)), left: 0, behavior: 'smooth' });
        });
        scrollTrack.addEventListener('pointercancel', resetDrag);
    }

    /* ---------- Back to top ---------- */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Project filter ---------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectItems.forEach(item => {
                const tags = item.dataset.tags || '';
                const show = filter === 'all' || tags.split(' ').includes(filter);
                item.classList.toggle('filtered-out', !show);
            });
        });
    });

    /* ---------- Analytics events (GA4) ----------
       Selector-based, not per-project: adding a new .project-item or
       .course-item (by copying an existing one, same as the rest of the
       site) gets tracked automatically. No extra wiring needed. */
    function trackEvent(name, params) {
        if (typeof gtag === 'function') gtag('event', name, params || {});
    }

    document.querySelectorAll('.project-item a').forEach(link => {
        link.addEventListener('click', () => {
            const title = link.querySelector('.project-title');
            trackEvent('project_click', { project_name: title ? title.textContent : link.href });
        });
    });

    document.querySelectorAll('.course-item a').forEach(link => {
        link.addEventListener('click', () => {
            const code = link.querySelector('.course-code');
            trackEvent('course_click', { course_code: code ? code.textContent : link.href });
        });
    });

    const resumeBtn = document.querySelector('.resume-view-button');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => trackEvent('resume_view'));
    }

    document.querySelectorAll('.contact-icon').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('contact_click', { contact_method: link.getAttribute('aria-label') || link.href });
        });
    });

    /* ---------- Draggable course scroller (if it ever overflows) ---------- */
    const courseContainer = document.querySelector('.course-container');
    if (courseContainer) {
        let isDown = false, startX, scrollLeft;
        courseContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - courseContainer.offsetLeft;
            scrollLeft = courseContainer.scrollLeft;
        });
        ['mouseleave', 'mouseup'].forEach(evt =>
            courseContainer.addEventListener(evt, () => { isDown = false; })
        );
        courseContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - courseContainer.offsetLeft;
            const walk = (x - startX) * 2;
            courseContainer.scrollLeft = scrollLeft - walk;
        });
    }

});
