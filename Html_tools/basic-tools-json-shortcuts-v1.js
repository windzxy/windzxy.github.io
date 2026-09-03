(() => {
  'use strict';
  const VER = '20260903-json-shortcuts-v1.2-error-location';
  if (window.__basicToolsJsonShortcutsV1 === VER) return;
  window.__basicToolsJsonShortcutsV1 = VER;

  function copyText(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      try {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        area.remove();
        ok ? resolve() : reject(new Error('copy failed'));
      } catch (error) { reject(error); }
    });
  }

  function ensureStyle() {
    if (document.getElementById('jsonShortcutsV12Style')) return;
    const style = document.createElement('style');
    style.id = 'jsonShortcutsV12Style';
    style.textContent = '.json-app .json-shortcut-copy{margin-left:auto;padding:4px 9px;border:1px solid rgba(127,127,127,.22);border-radius:9px;background:rgba(127,127,127,.08);color:inherit;font:inherit;font-weight:650;cursor:pointer}.json-app .json-shortcut-copy:disabled{opacity:.38;cursor:not-allowed}.json-app .json-shortcut-copy:not(:disabled):hover{background:rgba(127,127,127,.14)}.json-app .json-error-location{display:none;margin-left:6px;padding:4px 8px;border-radius:8px;background:rgba(239,68,68,.09);border:1px solid rgba(239,68,68,.2);color:#ef6b6b;font:inherit;font-size:.88em;font-weight:650;white-space:nowrap}.json-app .json-error-location.show{display:inline-flex}';
    document.head.appendChild(style);
  }

  function enhance(root) {
    if (!root?.matches?.('.json-app') || root.dataset.jsonShortcutsV1 === VER) return;
    const input = root.querySelector('#jsonInput');
    if (!input) return;
    root.dataset.jsonShortcutsV1 = VER;
    ensureStyle();

    let copyButton = null;
    let errorLocation = null;
    const parseState = () => {
      const raw = input.value;
      if (!raw.trim()) return { valid: false, empty: true, error: null };
      try { JSON.parse(raw); return { valid: true, empty: false, error: null }; }
      catch (error) { return { valid: false, empty: false, error }; }
    };

    function locateError(error) {
      if (!error) return '';
      const msg = String(error.message || error);
      const match = msg.match(/position\s+(\d+)/i) || msg.match(/at\s+position\s+(\d+)/i);
      if (!match) return 'JSON 格式錯誤';
      const pos = Math.max(0, Math.min(input.value.length, Number(match[1]) || 0));
      const before = input.value.slice(0, pos);
      const line = before.split('\n').length;
      const lastBreak = before.lastIndexOf('\n');
      const col = pos - lastBreak;
      return `錯誤：第 ${line} 行，第 ${col} 字元`;
    }

    const ensureControls = () => {
      const status = root.querySelector('.basic-tool-status');
      if (!status) return null;
      copyButton = status.querySelector('.json-shortcut-copy');
      if (!copyButton) {
        copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'json-shortcut-copy';
        copyButton.textContent = '複製 JSON';
        copyButton.setAttribute('aria-label', '複製目前 JSON');
        copyButton.addEventListener('click', async () => {
          if (!parseState().valid) return;
          try {
            await copyText(input.value);
            copyButton.textContent = '已複製 ✓';
            setTimeout(() => { if (copyButton?.isConnected) copyButton.textContent = '複製 JSON'; }, 1200);
          } catch (_) {
            copyButton.textContent = '複製失敗';
            setTimeout(() => { if (copyButton?.isConnected) copyButton.textContent = '複製 JSON'; }, 1200);
          }
        });
        status.appendChild(copyButton);
      }
      errorLocation = status.querySelector('.json-error-location');
      if (!errorLocation) {
        errorLocation = document.createElement('span');
        errorLocation.className = 'json-error-location';
        errorLocation.setAttribute('role', 'status');
        status.appendChild(errorLocation);
      }
      const state = parseState();
      copyButton.disabled = !state.valid;
      const message = !state.empty && !state.valid ? locateError(state.error) : '';
      errorLocation.textContent = message;
      errorLocation.classList.toggle('show', !!message);
      return status;
    };

    const updateHint = () => {
      const status = ensureControls();
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
    setTimeout(updateHint, 120);
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
