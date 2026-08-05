(() => {
  'use strict';
  const manifestUrl = 'assets/audio/east-asian/manifest.json?v=20260805-1';
  let manifestPromise;
  let currentAudio = null;
  let token = 0;
  const normalize = value => String(value || '').normalize('NFKC').replace(/[：:，,。！？?!；;“”'"`\s]/g, '').trim();

  function loadManifest() {
    if (!manifestPromise) {
      manifestPromise = fetch(manifestUrl, {cache: 'no-cache'}).then(response => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      }).then(data => {
        const byKey = new Map();
        const byText = new Map();
        const sequenceText = new Map();
        for (const item of data.items || []) {
          byKey.set(item.key, item);
          byText.set(normalize(item.text), item);
        }
        for (const [sequence, keys] of Object.entries(data.sequences || {})) {
          const items = keys.map(key => byKey.get(key)).filter(Boolean);
          sequenceText.set(normalize(items.map(item => item.text).join(' ')), sequence);
        }
        return {...data, byKey, byText, sequenceText};
      });
    }
    return manifestPromise;
  }

  function setState(button, playing) {
    if (!button.dataset.audioLabel) button.dataset.audioLabel = button.textContent;
    button.classList.toggle('east-audio-playing', playing);
    button.textContent = playing ? (button.classList.contains('audio-main') || button.classList.contains('east-play-all') ? '■ 停止' : '■') : button.dataset.audioLabel;
  }

  function stop() {
    token += 1;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    document.querySelectorAll('.east-audio-playing').forEach(button => setState(button, false));
  }

  function playItem(item, currentToken) {
    return new Promise((resolve, reject) => {
      if (currentToken !== token) return resolve();
      const audio = new Audio(`assets/audio/east-asian/${item.file}?v=20260805-1`);
      currentAudio = audio;
      audio.addEventListener('ended', () => {
        if (currentAudio === audio) currentAudio = null;
        resolve();
      }, {once: true});
      audio.addEventListener('error', reject, {once: true});
      audio.play().catch(reject);
    });
  }

  async function play(items, button) {
    stop();
    const currentToken = token;
    setState(button, true);
    try {
      for (const item of items) {
        if (currentToken !== token) break;
        await playItem(item, currentToken);
        if (currentToken === token) await new Promise(resolve => setTimeout(resolve, 120));
      }
    } catch {
      button.title = '内置语音暂未就绪，请稍后刷新。';
    }
    if (currentToken === token) setState(button, false);
  }

  async function resolve(button) {
    const data = await loadManifest();
    if (button.dataset.audioKey && data.byKey.has(button.dataset.audioKey)) return [data.byKey.get(button.dataset.audioKey)];
    let sequence = button.dataset.audioSequence;
    if (!sequence) sequence = data.sequenceText.get(normalize(button.dataset.speak));
    if (sequence && data.sequences?.[sequence]) return data.sequences[sequence].map(key => data.byKey.get(key)).filter(Boolean);
    const item = data.byText.get(normalize(button.dataset.speak));
    return item ? [item] : [];
  }

  const style = document.createElement('style');
  style.textContent = '.east-audio-playing{background:#25304c!important;color:#fff!important}';
  document.head.append(style);

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-audio-key],[data-audio-sequence],[data-speak][data-language="japanese"],[data-speak][data-language="korean"]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.speechSynthesis?.cancel();
    if (button.classList.contains('east-audio-playing')) {
      stop();
      return;
    }
    resolve(button).then(items => {
      if (items.length) play(items, button);
      else button.title = '该句内置语音正在补充。';
    }).catch(() => {
      button.title = '内置语音暂未就绪，请稍后刷新。';
    });
  }, true);

  window.WIND_EAST_ASIAN_AUDIO = {loadManifest, stop};
})();
