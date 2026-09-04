(() => {
  'use strict';
  const VER = '20260905-text-file-import-v1';
  if (window.__webdeskTextFileImport === VER) return;
  window.__webdeskTextFileImport = VER;

  function ensureStyle() {
    if (document.getElementById('textFileImportV1Style')) return;
    const style = document.createElement('style');
    style.id = 'textFileImportV1Style';
    style.textContent = '.text-app .text-file-import{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}.text-app .text-file-import-btn{padding:6px 10px;border:1px solid rgba(127,127,127,.22);border-radius:9px;background:rgba(127,127,127,.08);color:inherit;font:inherit;font-weight:650;cursor:pointer}.text-app .text-file-import-btn:hover{background:rgba(127,127,127,.14)}.text-app.text-drop-ready{outline:2px dashed rgba(96,165,250,.75);outline-offset:-6px}.text-app .text-import-note{font-size:.85em;opacity:.72}';
    document.head.appendChild(style);
  }

  function readFile(file, input, note) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      note.textContent = '檔案過大（上限 5 MB）';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      input.value = String(reader.result || '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus({ preventScroll: true });
      note.textContent = `已載入 ${file.name}`;
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
    const note = document.createElement('span');
    note.className = 'text-import-note';
    note.setAttribute('role', 'status');
    note.setAttribute('aria-live', 'polite');

    btn.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      picker.click();
    });
    picker.addEventListener('change', () => {
      readFile(picker.files?.[0], input, note);
      picker.value = '';
    });
    wrap.append(btn, picker, note);
    actions.appendChild(wrap);

    ['dragenter', 'dragover'].forEach(type => root.addEventListener(type, event => {
      if (!event.dataTransfer?.types?.includes('Files')) return;
      event.preventDefault();
      root.classList.add('text-drop-ready');
    }));
    ['dragleave', 'drop'].forEach(type => root.addEventListener(type, event => {
      if (type === 'drop' && event.dataTransfer?.files?.length) {
        event.preventDefault();
        readFile(event.dataTransfer.files[0], input, note);
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
