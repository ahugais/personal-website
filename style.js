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
        root.setAttribute('data-theme', theme);
        if (themeToggle) {
            themeToggle.classList.toggle('fa-moon', theme === 'light');
            themeToggle.classList.toggle('fa-sun', theme === 'dark');
        }
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

    /* ---------- Scroll reveal ---------- */
    const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('reveal-stagger')) {
                    Array.from(entry.target.children).forEach((child, i) => {
                        child.style.setProperty('--stagger-i', i);
                    });
                }
                observer.unobserve(entry.target);
            }
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
