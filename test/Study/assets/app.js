(() => {
  'use strict';

  const subjects = ['chinese', 'math', 'english', 'cantonese', 'japanese', 'korean'];
  const defaults = {
    stars: 0,
    sessions: 0,
    stage: 'preschool',
    pinyin: false,
    completed: Object.fromEntries(subjects.map(key => [key, 0])),
    correct: Object.fromEntries(subjects.map(key => [key, 0])),
    tasks: {}
  };
  let state = loadState();
  let pinyinPromise = null;
  let pinyinObserver = null;

  function cloneDefaults() {
    return JSON.parse(JSON.stringify(defaults));
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem('wind-study-center-v2') || '{}');
      return {
        ...cloneDefaults(),
        ...saved,
        completed: { ...defaults.completed, ...(saved.completed || {}) },
        correct: { ...defaults.correct, ...(saved.correct || {}) },
        tasks: { ...defaults.tasks, ...(saved.tasks || {}) }
      };
    } catch {
      return cloneDefaults();
    }
  }

  function saveState() {
    localStorage.setItem('wind-study-center-v2', JSON.stringify(state));
    renderStats();
  }

  function renderStats() {
    document.querySelectorAll('[data-stars]').forEach(el => el.textContent = state.stars);
    subjects.forEach(key => {
      const value = Math.min(100, state.completed[key] || 0);
      document.querySelectorAll(`[data-progress="${key}"]`).forEach(el => el.style.width = `${value}%`);
      document.querySelectorAll(`[data-progress-text="${key}"]`).forEach(el => el.textContent = `${value}%`);
    });
    const total = subjects.reduce((sum, key) => sum + (state.correct[key] || 0), 0);
    document.querySelectorAll('[data-correct-total]').forEach(el => el.textContent = total);
    document.querySelectorAll('[data-session-count]').forEach(el => el.textContent = state.sessions);
  }

  function reward(subject, amount = 2) {
    state.stars += amount;
    state.sessions += 1;
    if (subjects.includes(subject)) {
      state.correct[subject] = (state.correct[subject] || 0) + 1;
      state.completed[subject] = Math.min(100, (state.completed[subject] || 0) + 3);
    }
    saveState();
    const pop = document.querySelector('.reward-pop');
    if (!pop) return;
    pop.textContent = `⭐ +${amount}`;
    pop.classList.remove('show');
    void pop.offsetWidth;
    pop.classList.add('show');
  }

  function speak(text, lang = 'zh-CN') {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang === 'zh-HK' ? .76 : .82;
    utterance.pitch = 1.02;
    speechSynthesis.speak(utterance);
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function setFeedback(el, text, good) {
    if (!el) return;
    el.textContent = text;
    el.className = `feedback ${good ? 'good' : 'bad'}`;
  }

  function renderQuiz({ container, feedback, correct, options, subject, success, retry, speakText, lang }) {
    if (!container || !feedback) return;
    container.innerHTML = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.textContent = option;
      button.addEventListener('click', () => {
        const good = String(option) === String(correct);
        button.classList.add(good ? 'correct' : 'wrong');
        if (!good) {
          setFeedback(feedback, retry, false);
          return;
        }
        container.querySelectorAll('button').forEach(el => el.disabled = true);
        setFeedback(feedback, success, true);
        if (speakText) speak(speakText, lang);
        reward(subject);
      });
      container.appendChild(button);
    });
  }

  function initNavigation() {
    const page = document.body.dataset.page || 'home';
    document.querySelectorAll('.nav a').forEach(link => link.classList.toggle('active', link.dataset.nav === page));
  }

  function initSounds() {
    document.querySelectorAll('[data-speak]').forEach(button => {
      button.addEventListener('click', () => speak(button.dataset.speak, button.dataset.lang || 'zh-CN'));
    });
  }

  function applyStage(stage) {
    state.stage = stage;
    document.querySelectorAll('.stage-btn[data-stage]').forEach(btn => btn.classList.toggle('active', btn.dataset.stage === stage));
    document.querySelectorAll('.stage-panel[data-stage-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.stagePanel === stage));
    document.querySelectorAll('[data-current-stage]').forEach(el => {
      el.textContent = ({ preschool: '幼小衔接', primary: '小学', junior: '初中', senior: '高中' })[stage];
    });
    saveState();
    document.dispatchEvent(new CustomEvent('stagechange', { detail: stage }));
  }

  function initStageSwitch() {
    const buttons = document.querySelectorAll('.stage-btn[data-stage]');
    buttons.forEach(button => button.addEventListener('click', () => applyStage(button.dataset.stage)));
    if (buttons.length) applyStage(state.stage || 'preschool');
  }

  function initTabs() {
    document.querySelectorAll('[data-tab-group]').forEach(group => {
      const buttons = group.querySelectorAll('[data-tab]');
      const panels = group.querySelectorAll('[data-tab-panel]');
      function activate(id) {
        buttons.forEach(button => button.classList.toggle('active', button.dataset.tab === id));
        panels.forEach(panel => panel.classList.toggle('active', panel.dataset.tabPanel === id));
      }
      buttons.forEach(button => button.addEventListener('click', () => activate(button.dataset.tab)));
      if (buttons.length) activate(buttons[0].dataset.tab);
    });
  }

  function loadPinyinLibrary() {
    if (window.pinyinPro?.html) return Promise.resolve(window.pinyinPro);
    if (pinyinPromise) return pinyinPromise;
    pinyinPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pinyin-pro@3.28.1/dist/index.js';
      script.async = true;
      script.onload = () => window.pinyinPro?.html ? resolve(window.pinyinPro) : reject(new Error('拼音库不可用'));
      script.onerror = () => reject(new Error('拼音库加载失败'));
      document.head.appendChild(script);
    });
    return pinyinPromise;
  }

  function shouldSkipPinyin(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    if (parent.closest('script,style,code,pre,textarea,input,select,option,ruby,rt,.pinyin-rendered,[data-no-pinyin]')) return true;
    const text = node.nodeValue || '';
    if (!/[\u3400-\u9fff]/.test(text)) return true;
    if (/[\u3040-\u30ff\uac00-\ud7af]/.test(text)) return true;
    return false;
  }

  function renderPinyinNode(node) {
    if (!window.pinyinPro?.html || shouldSkipPinyin(node)) return;
    const span = document.createElement('span');
    span.className = 'pinyin-rendered';
    span.innerHTML = window.pinyinPro.html(node.nodeValue, { toneType: 'symbol', nonZh: 'consecutive' });
    node.replaceWith(span);
  }

  function renderPinyinWithin(root) {
    if (!root || !window.pinyinPro?.html) return;
    if (root.nodeType === Node.TEXT_NODE) {
      renderPinyinNode(root);
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(renderPinyinNode);
  }

  async function enablePinyin(button) {
    document.body.classList.add('pinyin-on');
    button?.classList.add('active');
    button?.setAttribute('aria-pressed', 'true');
    try {
      await loadPinyinLibrary();
      renderPinyinWithin(document.body);
      if (!pinyinObserver) {
        pinyinObserver = new MutationObserver(records => {
          if (!document.body.classList.contains('pinyin-on')) return;
          records.forEach(record => record.addedNodes.forEach(renderPinyinWithin));
        });
        pinyinObserver.observe(document.body, { childList: true, subtree: true });
      }
    } catch {
      button?.setAttribute('title', '拼音库加载失败，请检查网络连接');
    }
  }

  function disablePinyin(button) {
    document.body.classList.remove('pinyin-on');
    button?.classList.remove('active');
    button?.setAttribute('aria-pressed', 'false');
  }

  function initPinyin() {
    const button = document.querySelector('[data-pinyin-toggle]');
    if (!button) return;
    button.setAttribute('aria-pressed', String(Boolean(state.pinyin)));
    if (state.pinyin) enablePinyin(button);
    button.addEventListener('click', async () => {
      state.pinyin = !state.pinyin;
      if (state.pinyin) await enablePinyin(button);
      else disablePinyin(button);
      saveState();
    });
  }

  function dayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  function initHome() {
    if (document.body.dataset.page !== 'home') return;
    const key = dayKey();
    const done = state.tasks[key] || {};
    document.querySelectorAll('[data-task]').forEach(row => {
      const input = row.querySelector('input');
      const name = row.dataset.task;
      input.checked = Boolean(done[name]);
      row.classList.toggle('done', input.checked);
      input.addEventListener('change', () => {
        state.tasks[key] ||= {};
        const was = Boolean(state.tasks[key][name]);
        state.tasks[key][name] = input.checked;
        row.classList.toggle('done', input.checked);
        if (input.checked && !was) state.stars += 2;
        saveState();
        update();
      });
    });
    function update() {
      const count = document.querySelectorAll('[data-task] input:checked').length;
      document.querySelectorAll('[data-daily-count]').forEach(el => el.textContent = `${count}/6`);
    }
    update();
  }

  const chinesePinyin = [
    { word: '妈妈', pinyin: 'mā ma', blank: 'mā __', options: ['ma', 'mǎ', 'mà'], emoji: '👩' },
    { word: '苹果', pinyin: 'píng guǒ', blank: 'píng __', options: ['guǒ', 'gǒu', 'guō'], emoji: '🍎' },
    { word: '学校', pinyin: 'xué xiào', blank: 'xué __', options: ['xiào', 'xiǎo', 'xiao'], emoji: '🏫' },
    { word: '月亮', pinyin: 'yuè liang', blank: 'yuè __', options: ['liang', 'liáng', 'liǎng'], emoji: '🌙' }
  ];
  const idioms = [
    { prompt: '形容学习认真、不断努力', answer: '勤学苦练', options: ['勤学苦练', '守株待兔', '画蛇添足'] },
    { prompt: '比喻做了多余的事，反而不好', answer: '画蛇添足', options: ['井井有条', '画蛇添足', '一心一意'] },
    { prompt: '形容做事非常专心', answer: '一心一意', options: ['一心一意', '东张西望', '自相矛盾'] }
  ];

  function initChinese() {
    if (document.body.dataset.page !== 'chinese') return;
    const pPrompt = document.querySelector('#pinyin-prompt');
    const pChoices = document.querySelector('#pinyin-choices');
    const pFeedback = document.querySelector('#pinyin-feedback');
    const iPrompt = document.querySelector('#idiom-prompt');
    const iChoices = document.querySelector('#idiom-choices');
    const iFeedback = document.querySelector('#idiom-feedback');
    function pinyinQuestion() {
      if (!pPrompt) return;
      const item = chinesePinyin[Math.floor(Math.random() * chinesePinyin.length)];
      pPrompt.textContent = `${item.emoji} ${item.word}：${item.blank}`;
      renderQuiz({ container: pChoices, feedback: pFeedback, correct: item.options[0], options: shuffle(item.options), subject: 'chinese', success: `正确：${item.word}，${item.pinyin}`, retry: '再听一听声调，然后重试。', speakText: item.word, lang: 'zh-CN' });
    }
    function idiomQuestion() {
      if (!iPrompt) return;
      const item = idioms[Math.floor(Math.random() * idioms.length)];
      iPrompt.textContent = item.prompt;
      renderQuiz({ container: iChoices, feedback: iFeedback, correct: item.answer, options: shuffle(item.options), subject: 'chinese', success: `正确答案：${item.answer}`, retry: '结合意思再想一想。', speakText: item.answer, lang: 'zh-CN' });
    }
    document.querySelector('#pinyin-next')?.addEventListener('click', pinyinQuestion);
    document.querySelector('#idiom-next')?.addEventListener('click', idiomQuestion);
    pinyinQuestion();
    idiomQuestion();
  }

  function mathProblem(stage) {
    if (stage === 'preschool') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 6) + 1;
      const c = Math.floor(Math.random() * Math.min(5, a + b)) + 1;
      return { text: `${a} + ${b} − ${c} = ?`, answer: a + b - c, hint: '先加后减，从左到右计算。' };
    }
    if (stage === 'primary') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      const c = Math.floor(Math.random() * 9) + 1;
      return { text: `${a} × ${b} + ${c} = ?`, answer: a * b + c, hint: '先算乘法，再算加法。' };
    }
    if (stage === 'junior') {
      const x = Math.floor(Math.random() * 8) + 1;
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 9) + 1;
      return { text: `${a}x + ${b} = ${a * x + b}，x = ?`, answer: x, hint: '先移项，再除以未知数的系数。' };
    }
    const r1 = Math.floor(Math.random() * 5) + 1;
    const r2 = Math.floor(Math.random() * 5) + 1;
    return { text: `x² − ${r1 + r2}x + ${r1 * r2} = 0，较小的根是？`, answer: Math.min(r1, r2), hint: '尝试因式分解为两个一次因式。' };
  }

  function initMath() {
    if (document.body.dataset.page !== 'math') return;
    const equation = document.querySelector('#mixed-equation');
    const box = document.querySelector('#mixed-choices');
    const feedback = document.querySelector('#mixed-feedback');
    if (!equation || !box || !feedback) return;
    function render() {
      const item = mathProblem(state.stage);
      equation.textContent = item.text;
      const options = [item.answer, item.answer + 1, item.answer - 1, item.answer + 2].filter((v, i, arr) => v >= 0 && arr.indexOf(v) === i);
      while (options.length < 3) options.push(options[options.length - 1] + 2);
      renderQuiz({ container: box, feedback, correct: item.answer, options: shuffle(options).slice(0, 3), subject: 'math', success: `计算正确，答案是 ${item.answer}。`, retry: item.hint });
    }
    document.querySelector('#mixed-next')?.addEventListener('click', render);
    document.addEventListener('stagechange', render);
    render();
  }

  const englishQuestions = {
    preschool: [
      { prompt: '🍎 I see an _____.', answer: 'apple', options: ['apple', 'book', 'cat'] },
      { prompt: '👋 _____! My name is Amy.', answer: 'Hello', options: ['Hello', 'Goodbye', 'Thank you'] }
    ],
    primary: [
      { prompt: 'She _____ to school every day.', answer: 'goes', options: ['go', 'goes', 'going'] },
      { prompt: 'There _____ two books on the desk.', answer: 'are', options: ['is', 'are', 'am'] }
    ],
    junior: [
      { prompt: 'If it rains tomorrow, we _____ at home.', answer: 'will stay', options: ['stay', 'stayed', 'will stay'] },
      { prompt: 'The book _____ by millions of readers.', answer: 'is loved', options: ['loves', 'is loved', 'loving'] }
    ],
    senior: [
      { prompt: 'Not only _____ hard, but she also studies efficiently.', answer: 'does she work', options: ['she works', 'does she work', 'she does work'] },
      { prompt: 'The proposal aims to _____ the gap between theory and practice.', answer: 'bridge', options: ['bridge', 'break', 'borrow'] }
    ]
  };

  function initEnglish() {
    if (document.body.dataset.page !== 'english') return;
    const prompt = document.querySelector('#english-prompt');
    const box = document.querySelector('#english-choices');
    const feedback = document.querySelector('#english-feedback');
    if (!prompt || !box || !feedback) return;
    function render() {
      const list = englishQuestions[state.stage] || englishQuestions.preschool;
      const item = list[Math.floor(Math.random() * list.length)];
      prompt.textContent = item.prompt;
      renderQuiz({ container: box, feedback, correct: item.answer, options: shuffle(item.options), subject: 'english', success: `Correct! 正确答案：${item.answer}`, retry: 'Read the whole sentence again. 请重新读完整句子。', speakText: item.prompt.replace('_____', item.answer), lang: 'en-US' });
    }
    document.querySelector('#english-next')?.addEventListener('click', render);
    document.addEventListener('stagechange', render);
    render();
  }

  const languageQuizzes = {
    cantonese: [
      { prompt: '“早上好”用粤语常说什么？', answer: '早晨 zou2 san4', options: ['早晨 zou2 san4', '多谢 do1 ze6', '再见 zoi3 gin3'], speech: '早晨', lang: 'zh-HK' },
      { prompt: '“谢谢”用粤语怎么说？', answer: '多谢 do1 ze6', options: ['唔该 m4 goi1', '多谢 do1 ze6', '你好 nei5 hou2'], speech: '多谢', lang: 'zh-HK' },
      { prompt: '“我很好”用粤语怎么说？', answer: '我好好 ngo5 hou2 hou2', options: ['我好好 ngo5 hou2 hou2', '我唔知 ngo5 m4 zi1', '我走先 ngo5 zau2 sin1'], speech: '我好好', lang: 'zh-HK' }
    ],
    japanese: [
      { prompt: '“あ”对应哪个读音？', answer: 'a', options: ['a', 'i', 'u'], speech: 'あ', lang: 'ja-JP' },
      { prompt: '“猫”用日语怎么说？', answer: 'ねこ neko', options: ['いぬ inu', 'ねこ neko', 'とり tori'], speech: 'ねこ', lang: 'ja-JP' },
      { prompt: '选择“早上好”', answer: 'おはようございます', options: ['こんにちは', 'おはようございます', 'ありがとうございます'], speech: 'おはようございます', lang: 'ja-JP' }
    ],
    korean: [
      { prompt: '“ㅏ”对应哪个读音？', answer: 'a', options: ['a', 'eo', 'o'], speech: '아', lang: 'ko-KR' },
      { prompt: '“你好”用韩语怎么说？', answer: '안녕하세요 annyeonghaseyo', options: ['감사합니다 gamsahamnida', '안녕하세요 annyeonghaseyo', '미안합니다 mianhamnida'], speech: '안녕하세요', lang: 'ko-KR' },
      { prompt: '“学校”用韩语怎么说？', answer: '학교 hakgyo', options: ['학교 hakgyo', '친구 chingu', '가족 gajok'], speech: '학교', lang: 'ko-KR' }
    ]
  };

  function initLanguageQuiz(subject) {
    if (document.body.dataset.page !== subject) return;
    const prompt = document.querySelector(`#${subject}-prompt`);
    const box = document.querySelector(`#${subject}-choices`);
    const feedback = document.querySelector(`#${subject}-feedback`);
    if (!prompt || !box || !feedback) return;
    function render() {
      const list = languageQuizzes[subject];
      const item = list[Math.floor(Math.random() * list.length)];
      prompt.textContent = item.prompt;
      renderQuiz({ container: box, feedback, correct: item.answer, options: shuffle(item.options), subject, success: `正确：${item.answer}`, retry: '结合读音和意思再试一次。', speakText: item.speech, lang: item.lang });
    }
    document.querySelector(`#${subject}-next`)?.addEventListener('click', render);
    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderStats();
    initPinyin();
    initSounds();
    initStageSwitch();
    initTabs();
    initHome();
    initChinese();
    initMath();
    initEnglish();
    initLanguageQuiz('cantonese');
    initLanguageQuiz('japanese');
    initLanguageQuiz('korean');
  });
})();
