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
