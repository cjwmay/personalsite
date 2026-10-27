(() => {
  const toggle = document.querySelector('#theme');
  toggle.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  });
  const teardowns = document.querySelector('#teardowns-open');
  if (teardowns) teardowns.addEventListener('click', () => {
    const note = document.querySelector('#teardowns-note');
    note.hidden = !note.hidden;
    teardowns.setAttribute('aria-expanded', String(!note.hidden));
  });
})();
