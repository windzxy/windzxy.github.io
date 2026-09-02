(() => {
  'use strict';
  if (window.__basicToolsJsonShortcutsV1) return;
  window.__basicToolsJsonShortcutsV1 = 1;

  function enhance(root) {
    if (!root?.matches?.('.json-app') || root.dataset.jsonShortcutsV1) return;
    const input = root.querySelector('#jsonInput');
    if (!input) return;
    root.dataset.jsonShortcutsV1 = '1';

    const updateHint = () => {
      const status = root.querySelector('.basic-tool-status');
      if (!status || !status.children[1] || !input.value.trim()) return;
      const hint = 'Ctrl/⌘ + Enter 格式化 · Shift + Ctrl/⌘ + Enter 壓縮';
      const current = status.children[1].textContent || '';
      if (/Ctrl\/⌘ \+ Enter 格式化/.test(current)) {
        status.children[1].textContent = current.replace('Ctrl/⌘ + Enter 格式化', hint);
      }
    };

    input.addEventListener('keydown', event => {
      if (!(event.ctrlKey || event.metaKey) || !event.shiftKey || event.key !== 'Enter') return;
      event.preventDefault();
      try {
        input.value = JSON.stringify(JSON.parse(input.value));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } catch (_) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      setTimeout(updateHint, 0);
    }, true);

    input.addEventListener('input', () => setTimeout(updateHint, 0));
    setTimeout(updateHint, 0);
  }

  function scan(root = document) {
    root.querySelectorAll?.('.json-app').forEach(enhance);
  }

  scan();
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType !== 1) return;
    enhance(node);
    scan(node);
  }))).observe(document.body, { childList: true, subtree: true });
})();
