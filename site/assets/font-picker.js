// Optional local preference. The default typeface and reading work without JS.
(() => {
  const fontKey = 'agent-art-lab:font';
  const panelKey = 'agent-art-lab:font-panel';
  const fontLabels = new Map([
    ['georgia', 'Georgia'], ['palatino', 'Palatino'],
    ['times', 'Times New Roman'], ['arial', 'Arial'], ['courier', 'Courier New'],
  ]);
  const supportedFont = value => fontLabels.has(value) ? value : 'georgia';

  function readSetting(storage, key) {
    try { return window[storage].getItem(key); } catch { return null; }
  }

  function saveSetting(storage, key, value) {
    try { window[storage].setItem(key, value); return true; } catch { return false; }
  }

  // This classic script runs before the stylesheet to apply a saved font early.
  document.documentElement.dataset.font = supportedFont(readSetting('localStorage', fontKey));

  function initializePicker() {
    const panel = document.getElementById('font-panel');
    const currentLabel = document.getElementById('font-current');
    const summary = panel?.querySelector('summary');
    if (!panel || !currentLabel || !summary) return;
    const choices = panel.querySelectorAll('input[type="radio"][name="site-font"]');

    function applyFont(value, remember = false) {
      const font = supportedFont(value);
      document.documentElement.dataset.font = font;
      currentLabel.textContent = fontLabels.get(font);
      choices.forEach(choice => { choice.checked = choice.value === font; });
      if (remember) {
        const saved = saveSetting('localStorage', fontKey, font);
        const hint = panel.querySelector('.font-panel-hint');
        if (hint) hint.textContent = saved ? 'Your choice follows you between pages.'
          : 'Applied here. Your browser couldn’t save this choice.';
      }
    }

    applyFont(document.documentElement.dataset.font);
    choices.forEach(choice => choice.addEventListener('change', () => {
      if (choice.checked && fontLabels.has(choice.value)) applyFont(choice.value, true);
    }));

    const savedPanel = readSetting('sessionStorage', panelKey);
    const compactViewport = window.matchMedia?.('(max-width: 1320px)').matches ?? false;
    panel.open = savedPanel === 'open' || (savedPanel !== 'closed' && !compactViewport);
    let userTogglePending = false;
    summary.addEventListener('click', () => { userTogglePending = true; });
    panel.addEventListener('toggle', () => {
      if (!userTogglePending) return;
      saveSetting('sessionStorage', panelKey, panel.open ? 'open' : 'closed');
      userTogglePending = false;
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !panel.open) return;
      const focusInsidePanel = panel.contains(document.activeElement);
      if (focusInsidePanel) event.preventDefault();
      panel.open = false;
      userTogglePending = false;
      saveSetting('sessionStorage', panelKey, 'closed');
      if (focusInsidePanel) summary.focus();
    });

    window.addEventListener('storage', event => {
      if (event.key === fontKey || event.key === null) {
        applyFont(readSetting('localStorage', fontKey));
      }
    });
    panel.hidden = false;
    document.body.classList.add('font-tools-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePicker, { once: true });
  } else {
    initializePicker();
  }
})();
