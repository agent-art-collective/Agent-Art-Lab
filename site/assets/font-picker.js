// Optional local preference. The default typeface and reading work without JS.
(() => {
  const fontKey = 'agent-art-lab:font';
  const weightKey = 'agent-art-lab:weight';
  const panelKey = 'agent-art-lab:font-panel';
  const fontLabels = new Map([
    ['georgia', 'Georgia'], ['palatino', 'Palatino'],
    ['times', 'Times New Roman'], ['arial', 'Arial'], ['courier', 'Courier New'],
  ]);
  const weightLabels = new Map([
    ['300', 'Light'], ['400', 'Regular'], ['700', 'Bold'],
  ]);
  const supportedFont = value => fontLabels.has(value) ? value : 'georgia';
  const supportedWeight = value => weightLabels.has(value) ? value : '400';

  function readSetting(storage, key) {
    try { return window[storage].getItem(key); } catch { return null; }
  }

  function saveSetting(storage, key, value) {
    try { window[storage].setItem(key, value); return true; } catch { return false; }
  }

  // Apply saved preferences before the stylesheet to avoid a typeface flash.
  document.documentElement.dataset.font = supportedFont(readSetting('localStorage', fontKey));
  document.documentElement.dataset.weight = supportedWeight(readSetting('localStorage', weightKey));

  function initializePicker() {
    const panel = document.getElementById('font-panel');
    const currentLabel = document.getElementById('font-current');
    const currentWeightLabel = document.getElementById('weight-current');
    const summary = panel?.querySelector('summary');
    if (!panel || !currentLabel || !summary) return;
    const choices = panel.querySelectorAll('input[type="radio"][name="site-font"]');
    const weightChoices = panel.querySelectorAll('input[type="radio"][name="site-weight"]');

    function savePreference(key, value) {
      const saved = saveSetting('localStorage', key, value);
      const bothSaved = saved
        && supportedFont(readSetting('localStorage', fontKey)) === document.documentElement.dataset.font
        && supportedWeight(readSetting('localStorage', weightKey)) === document.documentElement.dataset.weight;
      const hint = panel.querySelector('.font-panel-hint');
      if (hint) hint.textContent = bothSaved ? 'Your font and weight follow you between pages.'
        : 'Applied here. Your browser couldn’t save both choices.';
    }

    function applyFont(value, remember = false) {
      const font = supportedFont(value);
      document.documentElement.dataset.font = font;
      currentLabel.textContent = fontLabels.get(font);
      choices.forEach(choice => { choice.checked = choice.value === font; });
      if (remember) savePreference(fontKey, font);
    }

    function applyWeight(value, remember = false) {
      const weight = supportedWeight(value);
      document.documentElement.dataset.weight = weight;
      if (currentWeightLabel) currentWeightLabel.textContent = weightLabels.get(weight);
      weightChoices.forEach(choice => { choice.checked = choice.value === weight; });
      const note = panel.querySelector('.weight-note');
      if (note) note.hidden = weight !== '300';
      if (remember) savePreference(weightKey, weight);
    }

    applyFont(document.documentElement.dataset.font);
    applyWeight(document.documentElement.dataset.weight);
    choices.forEach(choice => choice.addEventListener('change', () => {
      if (choice.checked && fontLabels.has(choice.value)) applyFont(choice.value, true);
    }));
    weightChoices.forEach(choice => choice.addEventListener('change', () => {
      if (choice.checked && weightLabels.has(choice.value)) applyWeight(choice.value, true);
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
      if (event.key === weightKey || event.key === null) {
        applyWeight(readSetting('localStorage', weightKey));
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
