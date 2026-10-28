(() => {
  const root = document.documentElement;
  const page = document.querySelector('.case-page');
  const nav = page.querySelector('.case-nav');
  const links = [...nav.querySelectorAll('a')];
  const sections = links.map(link => document.querySelector(link.hash));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scrollFrame = null;
  let readingFrame = null;
  let currentSection = null;

  root.dataset.caseInput = 'keyboard';

  function setInput(input) {
    if (root.dataset.caseInput !== input) root.dataset.caseInput = input;
  }

  function setCurrent(section) {
    if (section === currentSection) return;
    currentSection = section;
    for (const link of links) {
      if (link.hash === `#${section.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function updateCurrent() {
    readingFrame = null;
    if (scrollFrame !== null) return;
    const readingLine = nav.offsetHeight + 100;
    let section = sections[0];
    for (const candidate of sections) {
      if (candidate.getBoundingClientRect().top <= readingLine) section = candidate;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      section = sections.at(-1);
    }
    setCurrent(section);
  }

  function requestReadingUpdate() {
    if (readingFrame === null) readingFrame = requestAnimationFrame(updateCurrent);
  }

  function cancelScroll() {
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
    requestReadingUpdate();
  }

  document.addEventListener('keydown', () => {
    setInput('keyboard');
    cancelScroll();
  }, { capture: true });
  document.addEventListener('pointerdown', () => {
    setInput('pointer');
    cancelScroll();
  }, { capture: true });
  document.addEventListener('pointermove', () => setInput('pointer'), { passive: true });
  window.addEventListener('wheel', () => {
    setInput('pointer');
    cancelScroll();
  }, { passive: true });
  window.addEventListener('touchstart', cancelScroll, { passive: true });
  window.addEventListener('scroll', requestReadingUpdate, { passive: true });
  window.addEventListener('resize', requestReadingUpdate);
  window.addEventListener('hashchange', cancelScroll);
  reducedMotion.addEventListener('change', cancelScroll);

  page.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.detail === 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
    const target = document.querySelector(link.hash);
    if (!target) return;

    event.preventDefault();
    cancelScroll();
    const start = window.scrollY;
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const destination = Math.min(max, Math.max(0, start + target.getBoundingClientRect().top - margin));
    const section = target.closest('section[id]');
    if (section) setCurrent(section);
    if (window.location.hash !== link.hash) history.pushState(null, '', link.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (Math.abs(destination - start) < 1) return;

    const started = performance.now();
    function step(now) {
      const progress = Math.min((now - started) / 300, 1);
      const eased = 1 - (1 - progress) ** 3;
      window.scrollTo(0, start + (destination - start) * eased);
      if (progress < 1) scrollFrame = requestAnimationFrame(step);
      else {
        scrollFrame = null;
        updateCurrent();
      }
    }
    scrollFrame = requestAnimationFrame(step);
  });

  updateCurrent();
})();
