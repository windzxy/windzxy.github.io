(() => {
  'use strict';
  if (window.__basicToolsUxV92) return;
  window.__basicToolsUxV92 = 1;

  const q = (root, selector) => root.querySelector(selector);
  const bytes = value => {
    try { return new Blob([value]).size; }
    catch { return String(value || '').length; }
  };
  const human = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB` : `${(n / 1048576).toFixed(1)} MB`;

  const style = document.createElement('style');
  style.textContent = '.basic-tool-status{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:10px;padding:8px 10px;border-radius:12px;background:rgba(127,127,127,.08);font-size:12px;line-height:1.45}.basic-tool-status strong{font-weight:700}.basic-tool-status small{opacity:.72}.basic-tool-status.ok strong{color:#2d9b63}.basic-tool-status.bad strong{color:#d75a5a}.table-app #appTableInput,.json-app #jsonInput,.text-app textarea{min-height:180px;resize:vertical}.table-app #tableOutput,.json-app #jsonOutput{min-height:150px;max-height:40vh;overflow:auto}';
  document.head.appendChild(style);

  function makeStatus(input) {
    const s = document.createElement('div');
    s.className = 'basic-tool-status';
    s.setAttribute('role', 'status');
    s.setAttribute('aria-live', 'polite');
    s.setAttribute('aria-atomic', 'true');
    s.innerHTML = '<strong>等待內容</strong><small></small>';
    (input.closest('.app-panel') || input.parentElement)?.appendChild(s);
    return s;
  }

  function textMeta(text) {
    const trimmed = text.trim();
    const words = (trimmed.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)?|[\u3400-\u9fff]/g) || []).length;
    return {
      chars: text.length,
      compact: text.replace(/\s/g, '').length,
      lines: text ? text.split(/\r?\n/).length : 0,
      words,
      paragraphs: trimmed ? trimmed.split(/(?:\r?\n){2,}/).filter(Boolean).length : 0,
      minutes: words ? Math.max(1, Math.ceil(words / 300)) : 0
    };
  }

  function tableMeta(text) {
    const lines = text.split(/\r?\n/).map(line => line.trimEnd()).filter(line => line.trim());
    if (!lines.length) return null;
    const sample = lines.slice(0, 8);
    const candidates = [['TAB', '\t'], ['CSV', ','], ['PIPE', '|'], ['SEMICOLON', ';']];
    let best = { name: 'PLAIN', separator: '', cols: 1, consistency: 0 };
    for (const [name, separator] of candidates) {
      const counts = sample.map(line => line.split(separator).length);
      const frequency = new Map();
      counts.forEach(count => frequency.set(count, (frequency.get(count) || 0) + 1));
      const [modeCols, modeHits] = [...frequency.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0];
      const consistency = modeHits / sample.length;
      if (modeCols > 1 && (consistency > best.consistency || (consistency === best.consistency && modeCols > best.cols))) {
        best = { name, separator, cols: modeCols, consistency };
      }
    }
    const rowCounts = best.separator ? lines.map(line => line.split(best.separator).length) : lines.map(() => 1);
    const uneven = rowCounts.filter(count => count !== best.cols).length;
    return { rows: lines.length, cols: best.cols, name: best.name, uneven, consistency: best.consistency };
  }

  function jsonErrorLocation(text, error) {
    const message = String(error?.message || 'JSON parse error');
    const positionMatch = message.match(/position\s+(\d+)/i);
    if (positionMatch) {
      const pos = Math.max(0, Math.min(text.length, Number(positionMatch[1]) || 0));
      const before = text.slice(0, pos);
      const line = before.split(/\r?\n/).length;
      const lastBreak = Math.max(before.lastIndexOf('\n'), before.lastIndexOf('\r'));
      const column = pos - lastBreak;
      return `第 ${line} 行 · 第 ${column} 列 · ${message}`;
    }
    const lineColumnMatch = message.match(/line\s+(\d+)(?:\s+column\s+(\d+))?/i);
    if (lineColumnMatch) {
      const line = Math.max(1, Number(lineColumnMatch[1]) || 1);
      const column = Math.max(1, Number(lineColumnMatch[2]) || 1);
      return `第 ${line} 行 · 第 ${column} 列 · ${message}`;
    }
    const atMatch = message.match(/at\s+line\s+(\d+)\s+column\s+(\d+)/i);
    if (atMatch) {
      return `第 ${Math.max(1, Number(atMatch[1]) || 1)} 行 · 第 ${Math.max(1, Number(atMatch[2]) || 1)} 列 · ${message}`;
    }
    return message;
  }

  function enhanceText(root) {
    if (!root.matches?.('.text-app') || root.dataset.ux9) return;
    const input = q(root, 'textarea');
    if (!input) return;
    root.dataset.ux9 = '1';
    const s = makeStatus(input);
    const refresh = () => {
      const m = textMeta(input.value);
      const a = input.selectionStart || 0;
      const b = input.selectionEnd || 0;
      const selected = b > a ? textMeta(input.value.slice(a, b)) : null;
      s.children[0].textContent = m.chars ? `${m.chars} 字符 · ${m.words} 詞/字 · ${m.lines} 行` : '等待文字';
      s.children[1].textContent = m.chars ? `${m.paragraphs} 段 · ${m.compact} 非空白 · 約 ${m.minutes} 分鐘閱讀 · ${human(bytes(input.value))}${selected ? ` · 已選 ${selected.chars} 字符/${selected.words} 詞字` : ''}` : '0 B';
    };
    for (const eventName of ['input', 'select', 'keyup', 'mouseup']) input.addEventListener(eventName, refresh);
    refresh();
  }

  function enhanceTable(root) {
    if (!root.matches?.('.table-app') || root.dataset.ux9) return;
    const input = q(root, '#appTableInput');
    const preview = q(root, '#tablePreview');
    if (!input || !preview) return;
    root.dataset.ux9 = '1';
    const s = makeStatus(input);
    const refresh = () => {
      const m = tableMeta(input.value);
      s.classList.toggle('bad', !!m?.uneven);
      s.children[0].textContent = m ? `${m.rows} rows × ${m.cols} cols · ${m.name}` : '等待資料';
      s.children[1].textContent = input.value.trim() ? `${m?.uneven ? `${m.uneven} 行欄數不一致 · ` : ''}${human(bytes(input.value))} · Ctrl/⌘ + Enter 預覽` : 'Ctrl/⌘ + Enter 預覽';
    };
    input.addEventListener('input', refresh);
    input.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        preview.click();
        refresh();
      }
    });
    refresh();
  }

  function enhanceJson(root) {
    if (!root.matches?.('.json-app') || root.dataset.ux9) return;
    const input = q(root, '#jsonInput');
    const format = q(root, '#jsonFormat');
    if (!input || !format) return;
    root.dataset.ux9 = '1';
    const s = makeStatus(input);
    const refresh = () => {
      s.classList.remove('ok', 'bad');
      const text = input.value;
      if (!text.trim()) {
        s.children[0].textContent = '等待 JSON';
        s.children[1].textContent = 'Ctrl/⌘ + Enter 格式化';
        return;
      }
      try {
        const data = JSON.parse(text);
        const type = Array.isArray(data) ? 'Array' : data === null ? 'Null' : typeof data === 'object' ? 'Object' : typeof data;
        const count = Array.isArray(data) ? data.length : data && typeof data === 'object' ? Object.keys(data).length : 1;
        s.children[0].textContent = `JSON 有效 · ${type} · ${count} item${count === 1 ? '' : 's'}`;
        s.children[1].textContent = `${human(bytes(text))} · Ctrl/⌘ + Enter 格式化`;
        s.classList.add('ok');
      } catch (error) {
        s.children[0].textContent = 'JSON 有錯誤';
        s.children[1].textContent = jsonErrorLocation(text, error);
        s.classList.add('bad');
      }
    };
    input.addEventListener('input', refresh);
    input.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        format.click();
        setTimeout(refresh);
      }
    });
    refresh();
  }

  function enhance(root) {
    enhanceText(root);
    enhanceTable(root);
    enhanceJson(root);
  }

  function scan(root = document) {
    root.querySelectorAll?.('.text-app,.table-app,.json-app').forEach(enhance);
  }

  scan();
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1) {
      enhance(node);
      scan(node);
    }
  }))).observe(document.body, { childList: true, subtree: true });
})();