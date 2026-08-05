(() => {
  'use strict';

  const STORAGE_KEY = 'wind-study-center-v1';
  const SUBJECTS = ['chinese', 'math', 'english'];
  const defaultState = {
    stars: 0,
    sessions: 0,
    completed: { chinese: 0, math: 0, english: 0 },
    tasks: {},
    correct: { chinese: 0, math: 0, english: 0 }
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        ...defaultState,
        ...saved,
        completed: { ...defaultState.completed, ...(saved.completed || {}) },
        tasks: { ...defaultState.tasks, ...(saved.tasks || {}) },
        correct: { ...defaultState.correct, ...(saved.correct || {}) }
      };
    } catch (error) {
      return JSON.parse(JSON.stringify(defaultState));
    }
  }

  let state = loadState();

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderGlobalStats();
  }

  function renderGlobalStats() {
    document.querySelectorAll('[data-stars]').forEach(node => {
      node.textContent = state.stars;
    });

    SUBJECTS.forEach(subject => {
      const value = Math.min(100, Number(state.completed[subject]) || 0);
      document.querySelectorAll(`[data-progress="${subject}"]`).forEach(node => {
        node.style.width = `${value}%`;
      });
      document.querySelectorAll(`[data-progress-text="${subject}"]`).forEach(node => {
        node.textContent = `${value}%`;
      });
    });

    const total = SUBJECTS.reduce((sum, key) => sum + (state.correct[key] || 0), 0);
    document.querySelectorAll('[data-correct-total]').forEach(node => {
      node.textContent = total;
    });
  }

  function reward(amount = 1, subject = null) {
    state.stars += amount;
    state.sessions += 1;
    if (subject && SUBJECTS.includes(subject)) {
      state.correct[subject] += 1;
      state.completed[subject] = Math.min(100, state.completed[subject] + 5);
    }
    saveState();

    const pop = document.querySelector('.reward-pop');
    if (pop) {
      pop.textContent = amount > 1 ? `⭐ +${amount}` : '⭐';
      pop.classList.remove('show');
      void pop.offsetWidth;
      pop.classList.add('show');
    }
  }

  function speak(text, lang) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.82;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function uniqueChoices(correct, pool, total = 3) {
    return shuffle([correct, ...shuffle(pool.filter(item => item !== correct)).slice(0, total - 1)]);
  }

  function setFeedback(element, message, good) {
    if (!element) return;
    element.textContent = message;
    element.className = `feedback ${good ? 'good' : 'bad'}`;
  }

  function lockChoices(container) {
    container.querySelectorAll('button').forEach(button => {
      button.disabled = true;
    });
  }

  function initNavigation() {
    const page = document.body.dataset.page || 'home';
    document.querySelectorAll('.nav a').forEach(link => {
      link.classList.toggle('active', link.dataset.nav === page);
    });
  }

  function initSoundButtons() {
    document.querySelectorAll('[data-speak]').forEach(button => {
      button.addEventListener('click', () => {
        speak(button.dataset.speak, button.dataset.lang || 'zh-CN');
      });
    });
  }

  function todayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function initHome() {
    if (document.body.dataset.page !== 'home') return;
    const dailyKey = todayKey();
    const dayTasks = state.tasks[dailyKey] || {};

    document.querySelectorAll('[data-task]').forEach(task => {
      const input = task.querySelector('input');
      const key = task.dataset.task;
      input.checked = Boolean(dayTasks[key]);
      task.classList.toggle('done', input.checked);

      input.addEventListener('change', () => {
        state.tasks[dailyKey] ||= {};
        const wasDone = Boolean(state.tasks[dailyKey][key]);
        state.tasks[dailyKey][key] = input.checked;
        task.classList.toggle('done', input.checked);
        if (input.checked && !wasDone) state.stars += 2;
        saveState();
        updateDailyCount();
      });
    });

    function updateDailyCount() {
      const checked = document.querySelectorAll('[data-task] input:checked').length;
      document.querySelectorAll('[data-daily-count]').forEach(node => {
        node.textContent = `${checked}/3`;
      });
    }

    updateDailyCount();
    document.querySelectorAll('[data-session-count]').forEach(node => {
      node.textContent = state.sessions;
    });
  }

  function initChinese() {
    if (document.body.dataset.page !== 'chinese') return;

    const questions = [
      { char: '日', pinyin: 'rì', word: '太阳', emoji: '☀️' },
      { char: '月', pinyin: 'yuè', word: '月亮', emoji: '🌙' },
      { char: '山', pinyin: 'shān', word: '高山', emoji: '⛰️' },
      { char: '水', pinyin: 'shuǐ', word: '河水', emoji: '💧' },
      { char: '火', pinyin: 'huǒ', word: '火焰', emoji: '🔥' },
      { char: '木', pinyin: 'mù', word: '树木', emoji: '🌳' },
      { char: '人', pinyin: 'rén', word: '人物', emoji: '🧒' },
      { char: '口', pinyin: 'kǒu', word: '嘴巴', emoji: '👄' }
    ];

    const prompt = document.querySelector('#hanzi-prompt');
    const sub = document.querySelector('#hanzi-sub');
    const choices = document.querySelector('#hanzi-choices');
    const feedback = document.querySelector('#hanzi-feedback');
    const next = document.querySelector('#hanzi-next');
    let current;

    function renderQuestion() {
      current = pick(questions);
      prompt.textContent = `${current.emoji} ${current.char}`;
      sub.textContent = '选择正确的拼音';
      feedback.textContent = '';
      feedback.className = 'feedback';
      choices.innerHTML = '';

      uniqueChoices(current.pinyin, questions.map(item => item.pinyin)).forEach(answer => {
        const button = document.createElement('button');
        button.className = 'choice';
        button.textContent = answer;
        button.addEventListener('click', () => {
          const correct = answer === current.pinyin;
          button.classList.add(correct ? 'correct' : 'wrong');
          if (correct) {
            lockChoices(choices);
            setFeedback(feedback, `答对了！${current.char}，${current.word}。`, true);
            speak(`${current.char}，${current.word}`, 'zh-CN');
            reward(2, 'chinese');
          } else {
            setFeedback(feedback, '再想一想，看看声调符号。', false);
          }
        });
        choices.appendChild(button);
      });
    }

    next.addEventListener('click', renderQuestion);
    renderQuestion();
  }

  function initMath() {
    if (document.body.dataset.page !== 'math') return;

    const objectPool = ['🍎', '⭐', '🐟', '🧸', '🚗'];
    const objects = document.querySelector('#count-objects');
    const choices = document.querySelector('#count-choices');
    const feedback = document.querySelector('#count-feedback');
    const nextCount = document.querySelector('#count-next');
    let countAnswer = 1;

    function renderCount() {
      countAnswer = Math.floor(Math.random() * 10) + 1;
      const icon = pick(objectPool);
      objects.textContent = Array(countAnswer).fill(icon).join(' ');
      choices.innerHTML = '';
      feedback.textContent = '';
      feedback.className = 'feedback';
      const pool = Array.from({ length: 10 }, (_, index) => index + 1);

      uniqueChoices(countAnswer, pool).forEach(answer => {
        const button = document.createElement('button');
        button.className = 'choice';
        button.textContent = answer;
        button.addEventListener('click', () => {
          const correct = answer === countAnswer;
          button.classList.add(correct ? 'correct' : 'wrong');
          if (correct) {
            lockChoices(choices);
            setFeedback(feedback, `答对了，一共有 ${countAnswer} 个！`, true);
            reward(2, 'math');
          } else {
            setFeedback(feedback, '可以用手指逐个数一次。', false);
          }
        });
        choices.appendChild(button);
      });
    }

    const equation = document.querySelector('#equation');
    const addChoices = document.querySelector('#addition-choices');
    const addFeedback = document.querySelector('#addition-feedback');
    const nextAdd = document.querySelector('#addition-next');
    let sum = 0;

    function renderAddition() {
      const a = Math.floor(Math.random() * 6);
      const b = Math.floor(Math.random() * (11 - a));
      sum = a + b;
      equation.textContent = `${a} + ${b} = ?`;
      addChoices.innerHTML = '';
      addFeedback.textContent = '';
      addFeedback.className = 'feedback';
      const pool = Array.from({ length: 11 }, (_, index) => index);

      uniqueChoices(sum, pool).forEach(answer => {
        const button = document.createElement('button');
        button.className = 'choice';
        button.textContent = answer;
        button.addEventListener('click', () => {
          const correct = answer === sum;
          button.classList.add(correct ? 'correct' : 'wrong');
          if (correct) {
            lockChoices(addChoices);
            setFeedback(addFeedback, '太棒了，计算正确！', true);
            reward(2, 'math');
          } else {
            setFeedback(addFeedback, '试着把两组数量放在一起数。', false);
          }
        });
        addChoices.appendChild(button);
      });
    }

    nextCount.addEventListener('click', renderCount);
    nextAdd.addEventListener('click', renderAddition);
    renderCount();
    renderAddition();
  }

  function initEnglish() {
    if (document.body.dataset.page !== 'english') return;

    const words = [
      { word: 'Apple', emoji: '🍎', hint: '苹果' },
      { word: 'Bird', emoji: '🐦', hint: '小鸟' },
      { word: 'Cat', emoji: '🐱', hint: '猫' },
      { word: 'Dog', emoji: '🐶', hint: '狗' },
      { word: 'Fish', emoji: '🐟', hint: '鱼' },
      { word: 'Moon', emoji: '🌙', hint: '月亮' },
      { word: 'Sun', emoji: '☀️', hint: '太阳' },
      { word: 'Tree', emoji: '🌳', hint: '树' }
    ];

    const picture = document.querySelector('#word-picture');
    const hint = document.querySelector('#word-hint');
    const choices = document.querySelector('#word-choices');
    const feedback = document.querySelector('#word-feedback');
    const next = document.querySelector('#word-next');
    let current;

    function renderWord() {
      current = pick(words);
      picture.textContent = current.emoji;
      hint.textContent = `This is “${current.hint}”. 选择正确的英文单词。`;
      feedback.textContent = '';
      feedback.className = 'feedback';
      choices.innerHTML = '';

      uniqueChoices(current.word, words.map(item => item.word)).forEach(answer => {
        const button = document.createElement('button');
        button.className = 'choice';
        button.textContent = answer;
        button.addEventListener('click', () => {
          const correct = answer === current.word;
          button.classList.add(correct ? 'correct' : 'wrong');
          if (correct) {
            lockChoices(choices);
            setFeedback(feedback, `Great! 太棒了！${current.word}.`, true);
            speak(current.word, 'en-US');
            reward(2, 'english');
          } else {
            setFeedback(feedback, 'Try again. 再看看单词的第一个字母。', false);
          }
        });
        choices.appendChild(button);
      });
    }

    next.addEventListener('click', renderWord);
    renderWord();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderGlobalStats();
    initSoundButtons();
    initHome();
    initChinese();
    initMath();
    initEnglish();
  });
})();