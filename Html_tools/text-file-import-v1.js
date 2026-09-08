(() => {
  'use strict';
  const VER = '20260909-text-file-import-v1.1-import-undo';
  if (window.__webdeskTextFileImport === VER) return;
  window.__webdeskTextFileImport = VER;

  function ensureStyle() {
    if (document.getElementById('textFileImportV1Style')) return;
    const style = document.createElement('style');
    style.id = 'textFileImportV1Style';
    style.textContent = '.text-app .text-file-import{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}.text-app .text-file-import-btn{padding:6px 10px;border:1px solid rgba(127,127,127,.22);border-radius:9px;background:rgba(127,127,127,.08);color:inherit;font:inherit;font-weight:650;cursor:pointer}.text-app .text-file-import-btn:hover:not(:disabled){background:rgba(127,127,127,.14)}.text-app .text-file-import-btn:disabled{opacity:.45;cursor:not-allowed}.text-app.text-drop-ready{outline:2px dashed rgba(96,165,250,.75);outline-offset:-6px}.text-app .text-import-note{font-size:.85em;opacity:.72}';
    document.head.appendChild(style);
  }

  function readableSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function readFile(file, input, note, undoBtn, state) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      note.textContent = '檔案過大（上限 5 MB）';
      return;
    }
    const previousValue = input.value;
    const reader = new FileReader();
    reader.onload = () => {
      state.beforeImport = previousValue;
      input.value = String(reader.result || '').replace(/^\uFEFF/, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus({ preventScroll: true });
      undoBtn.disabled = false;
      note.textContent = `已載入 ${file.name} · ${readableSize(file.size)}`;
    };
    reader.onerror = () => { note.textContent = '讀取檔案失敗'; };
    reader.readAsText(file, 'utf-8');
  }

  function enhance(root) {
    if (!root?.matches?.('.text-app') || root.dataset.textFileImport === VER) return;
    const input = root.querySelector('#appText');
    const actions = root.querySelector('.text-actions');
    if (!input || !actions) return;
    root.dataset.textFileImport = VER;
    ensureStyle();

    const state = { beforeImport: null };
    const wrap = document.createElement('span');
    wrap.className = 'text-file-import';
    const picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = '.txt,.md,.csv,.tsv,.log,text/plain,text/markdown,text/csv';
    picker.hidden = true;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'text-file-import-btn';
    btn.textContent = '匯入文字';
    btn.setAttribute('aria-label', '從檔案匯入文字');
    const undoBtn = document.createElement('button');
    undoBtn.type = 'button';
    undoBtn.className = 'text-file-import-btn';
    undoBtn.textContent = '還原匯入前';
    undoBtn.disabled = true;
    undoBtn.setAttribute('aria-label', '還原到最近一次匯入檔案前的文字');
    const note = document.createElement('span');
    note.className = 'text-import-note';
    note.setAttribute('role', 'status');
    note.setAttribute('aria-live', 'polite');

    btn.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      picker.click();
    });
    undoBtn.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (state.beforeImport === null) return;
      input.value = state.beforeImport;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus({ preventScroll: true });
      state.beforeImport = null;
      undoBtn.disabled = true;
      note.textContent = '已還原匯入前文字';
    });
    picker.addEventListener('change', () => {
      readFile(picker.files?.[0], input, note, undoBtn, state);
      picker.value = '';
    });
    wrap.append(btn, undoBtn, picker, note);
    actions.appendChild(wrap);

    ['dragenter', 'dragover'].forEach(type => root.addEventListener(type, event => {
      if (!event.dataTransfer?.types?.includes('Files')) return;
      event.preventDefault();
      root.classList.add('text-drop-ready');
    }));
    ['dragleave', 'drop'].forEach(type => root.addEventListener(type, event => {
      if (type === 'drop' && event.dataTransfer?.files?.length) {
        event.preventDefault();
        readFile(event.dataTransfer.files[0], input, note, undoBtn, state);
      }
      root.classList.remove('text-drop-ready');
    }));
  }

  function scan(root = document) {
    root.querySelectorAll?.('.text-app').forEach(enhance);
  }
  scan();
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType !== 1) return;
    enhance(node);
    scan(node);
  }))).observe(document.body, { childList: true, subtree: true });
})();
