(() => {
  'use strict';

  const base = 'assets/audio/cantonese/tea-restaurant/';
  const dialogue = [
    ['顾客：唔该，我想要一个菠萝包同一杯冻奶茶。', '01-customer.mp3'],
    ['店员：冻奶茶要少甜定正常甜？', '02-staff.mp3'],
    ['顾客：少甜，唔该。请问一共几多钱？', '03-customer.mp3'],
    ['店员：四十二蚊。多谢。', '04-staff.mp3'],
    ['顾客：唔该晒。', '05-customer.mp3']
  ];
  const normalize = value => String(value || '')
    .normalize('NFKC')
    .replace(/[：:，,。！？?!；;“”'"`\s]/g, '')
    .trim();
  const lineMap = new Map(dialogue.map(([text, file]) => [normalize(text), file]));
  const fullKey = normalize(dialogue.map(([text]) => text).join(' '));
  let currentAudio = null;
  let playToken = 0;

  function setButtonState(button, state) {
    if (!button.dataset.audioLabel) button.dataset.audioLabel = button.textContent;
    button.classList.toggle('audio-playing', state === 'playing');
    button.classList.toggle('audio-error', state === 'error');
    button.setAttribute('aria-busy', state === 'playing' ? 'true' : 'false');
    if (state === 'playing') button.textContent = button.classList.contains('audio-main') ? '■ 停止' : '■';
    else button.textContent = button.dataset.audioLabel;
  }

  function stopPlayback() {
    playToken += 1;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    document.querySelectorAll('.audio-playing').forEach(button => setButtonState(button, 'idle'));
  }

  function compactMessage(button, text) {
    button.title = text;
    setButtonState(button, 'error');
    const note = document.createElement('span');
    note.className = 'audio-inline-note';
    note.textContent = text;
    button.insertAdjacentElement('afterend', note);
    setTimeout(() => {
      note.remove();
      setButtonState(button, 'idle');
    }, 2800);
  }

  function playFile(file, button, token) {
    return new Promise((resolve, reject) => {
      if (token !== playToken) return resolve();
      const audio = new Audio(`${base}${file}?v=20260805-1`);
      currentAudio = audio;
      audio.preload = 'auto';
      audio.addEventListener('ended', () => {
        if (currentAudio === audio) currentAudio = null;
        resolve();
      }, {once:true});
      audio.addEventListener('error', () => {
        if (currentAudio === audio) currentAudio = null;
        reject(new Error('audio-load-failed'));
      }, {once:true});
      audio.play().catch(reject);
    });
  }

  async function playFiles(files, button) {
    stopPlayback();
    const token = playToken;
    setButtonState(button, 'playing');
    try {
      for (const file of files) {
        if (token !== playToken) break;
        await playFile(file, button, token);
        if (token === playToken) await new Promise(resolve => setTimeout(resolve, 140));
      }
      if (token === playToken) setButtonState(button, 'idle');
    } catch {
      if (token === playToken) compactMessage(button, '内置粤语音频暂未就绪，请稍后刷新。');
    }
  }

  const style = document.createElement('style');
  style.textContent = '.audio-playing{background:#25304c!important;color:#fff!important}.audio-error{outline:2px solid #f3a4a4}.audio-inline-note{display:inline-flex;max-width:260px;margin-left:8px;padding:6px 9px;border-radius:9px;background:#fff3f3;color:#a13d3d;font-size:12px;line-height:1.35;vertical-align:middle;box-shadow:0 5px 18px rgba(67,28,28,.12)}';
  document.head.append(style);

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-speak][data-language="cantonese"]');
    if (!button) return;
    const textKey = normalize(button.dataset.speak);
    const file = lineMap.get(textKey);
    const files = file ? [file] : textKey === fullKey || textKey.length > 48 ? dialogue.map(([, name]) => name) : null;
    if (!files) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.speechSynthesis?.cancel();
    if (button.classList.contains('audio-playing')) stopPlayback();
    else playFiles(files, button);
  }, true);
})();
