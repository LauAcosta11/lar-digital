/* === App logic: SPA navigation between sections === */

(function () {
  const sections = ['hero', 'about', 'work', 'process', 'faq', 'contact'];
  let current = 'hero';
  let transitioning = false;

  function getSectionEl(id) {
    return document.getElementById('sec-' + id);
  }

  function setActive(id) {
    if (id === current || transitioning) return;
    if (!sections.includes(id)) return;

    transitioning = true;
    const fromEl = getSectionEl(current);
    const toEl = getSectionEl(id);

    if (!toEl) { transitioning = false; return; }

    // exit current
    if (fromEl) {
      fromEl.classList.add('exit');
      fromEl.classList.remove('active');
    }

    // enter new (reset scroll)
    toEl.scrollTop = 0;
    requestAnimationFrame(() => {
      toEl.classList.remove('exit');
      toEl.classList.add('active');
    });

    // cleanup
    setTimeout(() => {
      if (fromEl) fromEl.classList.remove('exit');
      transitioning = false;
    }, 600);

    // update nav
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === id);
    });

    // update url hash
    history.replaceState(null, '', '#' + id);
    current = id;
  }

  // Expose globally for inline handlers
  window.navigate = setActive;

  // Bind nav-link clicks
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => setActive(btn.dataset.target));
  });

  // Initial route from hash
  function routeFromHash() {
    const h = (location.hash || '#hero').slice(1);
    if (sections.includes(h) && h !== current) setActive(h);
  }
  window.addEventListener('hashchange', routeFromHash);
  routeFromHash();

  // Keyboard navigation (arrows)
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select')) return;
    const idx = sections.indexOf(current);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(sections[Math.min(idx + 1, sections.length - 1)]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(sections[Math.max(idx - 1, 0)]);
    }
  });

  // Form submit handler
  window.handleSubmit = function (e) {
    e.preventDefault();
    const ok = document.getElementById('formSuccess');
    if (ok) ok.classList.add('show');
    return false;
  };
})();
