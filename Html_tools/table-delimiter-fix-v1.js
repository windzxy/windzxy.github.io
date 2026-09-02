(() => {
  'use strict';
  const VER = '20260903-table-delimiter-fix-v1.4-paste-autodetect';
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

  function labelFor(value) {
    if (value === '\t') return 'TSV';
    if (value === ',') return 'CSV';
    if (value === ';') return 'Semicolon (;)';
    if (value === '|') return 'Pipe (|)';
    return value || 'Plain';
  }

  function splitRowColumns(line, separator) {
    const cells = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = !quoted;
        }
        continue;
      }
      if (ch === separator && !quoted) {
        cells.push(cell);
        cell = '';
      } else {
        cell += ch;
      }
    }
    cells.push(cell);
    return cells;
  }

  function detectDelimiter(text) {
    const lines = String(text || '').split(/\r?\n/).map(line => line.trimEnd()).filter(line => line.trim()).slice(0, 8);
    if (!lines.length) return '';
    const candidates = ['\t', ',', ';', '|'];
    let best = { separator: '', consistency: 0, cols: 1 };
    candidates.forEach(separator => {
      const counts = lines.map(line => splitRowColumns(line, separator).length);
      const frequency = new Map();
      counts.forEach(count => frequency.set(count, (frequency.get(count) || 0) + 1));
      const [cols, hits] = [...frequency.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0];
      const consistency = hits / lines.length;
      if (cols > 1 && (consistency > best.consistency || (consistency === best.consistency && cols > best.cols))) {
        best = { separator, consistency, cols };
      }
    });
    return best.consistency >= 0.75 ? best.separator : '';
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

  function ensureSuggestion(select, input) {
    const host = select.parentElement || select;
    let button = host.querySelector?.('.table-delimiter-suggestion');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'table-delimiter-suggestion';
      button.hidden = true;
      button.style.cssText = 'margin-left:8px;padding:5px 8px;border:1px solid rgba(127,127,127,.24);border-radius:9px;background:rgba(127,127,127,.08);font:inherit;font-size:11px;cursor:pointer';
      select.insertAdjacentElement('afterend', button);
    }
    const refresh = () => {
      const detected = detectDelimiter(input?.value || '');
      const mismatch = detected && detected !== select.value;
      button.hidden = !mismatch;
      button.dataset.delimiter = detected || '';
      button.textContent = mismatch ? `使用偵測：${labelFor(detected)}` : '';
      button.title = mismatch ? `資料看起來較像 ${labelFor(detected)}，點擊切換分隔符` : '';
    };
    if (button.dataset.bound !== VER) {
      button.dataset.bound = VER;
      button.addEventListener('click', () => {
        const detected = button.dataset.delimiter;
        if (!detected) return;
        select.value = detected;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        refresh();
      });
      input?.addEventListener('input', refresh);
      select.addEventListener('change', refresh);
    }
    refresh();
  }

  function bindPasteAutodetect(select, input) {
    if (!input || input.dataset.delimiterPasteAutodetect === VER) return;
    input.dataset.delimiterPasteAutodetect = VER;
    input.addEventListener('paste', () => {
      const wasEmpty = !input.value.trim();
      if (!wasEmpty) return;
      setTimeout(() => {
        const detected = detectDelimiter(input.value);
        if (!detected || detected === select.value) return;
        select.value = detected;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }, 0);
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
    const app = select.closest('.table-app') || document;
    const input = app.querySelector?.('#appTableInput');
    ensureSuggestion(select, input);
    bindPasteAutodetect(select, input);
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