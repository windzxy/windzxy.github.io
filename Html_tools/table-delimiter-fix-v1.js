(() => {
  'use strict';
  const VER = '20260903-table-delimiter-fix-v1.2';
  const STORAGE_KEY = 'windzxy-webdesk-table-delimiter-v1';
  if (window.__windzxyTableDelimiterFix === VER) return;
  window.__windzxyTableDelimiterFix = VER;

  function ensureOption(select, value, label) {
    if ([...select.options].some(option => option.value === value)) return;
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  }

  function loadSavedDelimiter(select) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null && [...select.options].some(option => option.value === saved)) {
        select.value = saved;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } catch (_) {}
  }

  function bindPersistence(select) {
    if (select.dataset.delimiterPersistence === VER) return;
    select.dataset.delimiterPersistence = VER;
    select.addEventListener('change', () => {
      try { localStorage.setItem(STORAGE_KEY, select.value); } catch (_) {}
    });
  }

  function enhance(root) {
    const select = root?.matches?.('#tableDelim') ? root : root?.querySelector?.('#tableDelim');
    if (!select || select.dataset.delimiterFix === VER) return;
    select.dataset.delimiterFix = VER;

    const tsv = [...select.options].find(option => option.textContent.trim().toUpperCase() === 'TSV');
    if (tsv) tsv.value = '\t';

    ensureOption(select, ';', 'Semicolon (;)');
    ensureOption(select, '|', 'Pipe (|)');
    bindPersistence(select);
    loadSavedDelimiter(select);
  }

  function scan(root = document) {
    enhance(root);
    root.querySelectorAll?.('#tableDelim').forEach(enhance);
  }

  scan();
  new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === 1) scan(node);
    }));
  }).observe(document.body, { childList: true, subtree: true });
})();