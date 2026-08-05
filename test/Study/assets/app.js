(() => {
  'use strict';

  const stageNames = { preschool: '幼小衔接', primary: '小学', junior: '初中', senior: '高中' };
  const stageOrder = Object.keys(stageNames);
  const subjectOrder = ['chinese', 'math', 'english', 'cantonese', 'japanese', 'korean'];
  const page = document.body.dataset.page || 'home';
  const parentPage = document.body.dataset.parent || window.STUDY_DATA?.[page]?.parent || page;
  const storeKey = 'wind-study-center-v3';
  const defaults = { stage: 'preschool', stars: 0, answers: 0, pinyin: false, progress: {} };
  let state = loadState();
  let pinyinPromise;
  let pinyinObserver;
  let quizCounter = 0;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storeKey) || '{}');
      return { ...defaults, ...saved, progress: saved.progress || {} };
    } catch {
      return { ...defaults };
    }
  }

  function saveState() {
    localStorage.setItem(storeKey, JSON.stringify(state));
    renderHeaderStats();
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  }

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function speak(text, lang = 'zh-CN') {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = lang;
    voice.rate = lang === 'zh-HK' ? 0.74 : 0.82;
    voice.pitch = 1.02;
    speechSynthesis.speak(voice);
  }

  function reward(subject, stage, amount = 2) {
    state.stars += amount;
    state.answers += 1;
    state.progress[subject] ||= {};
    state.progress[subject][stage] = Math.min(100, (state.progress[subject][stage] || 0) + 2);
    saveState();
    const pop = document.querySelector('.reward-pop');
    if (pop) {
      pop.textContent = `⭐ +${amount}`;
      pop.classList.remove('show');
      void pop.offsetWidth;
      pop.classList.add('show');
    }
  }

  function renderHeaderStats() {
    document.querySelectorAll('[data-stars]').forEach(el => el.textContent = state.stars);
    document.querySelectorAll('[data-answer-count]').forEach(el => el.textContent = state.answers);
  }

  function initNavigation() {
    document.querySelectorAll('.nav a').forEach(link => link.classList.toggle('active', link.dataset.nav === parentPage));
  }

  function stageSwitcher(current, onChange) {
    const wrap = document.createElement('div');
    wrap.className = 'stage-switch';
    stageOrder.forEach(key => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `stage-btn${key === current ? ' active' : ''}`;
      button.textContent = stageNames[key];
      button.addEventListener('click', () => {
        state.stage = key;
        saveState();
        onChange(key);
      });
      wrap.appendChild(button);
    });
    return wrap;
  }

  function countStage(data, stage) {
    const units = data.stages?.[stage] || [];
    return {
      units: units.length,
      lessons: units.reduce((sum, unit) => sum + (unit.lessons?.length || 0), 0),
      practices: units.reduce((sum, unit) => sum + (unit.lessons || []).filter(lesson => ['quiz', 'generated-math'].includes(lesson.type)).length, 0)
    };
  }

  function renderHome() {
    const root = document.querySelector('#app');
    if (!root) return;
    const stage = state.stage || 'preschool';
    root.innerHTML = '';

    const dashboard = document.createElement('section');
    dashboard.className = 'home-dashboard';
    dashboard.innerHTML = `
      <div class="home-title">
        <span class="eyebrow">当前学段</span>
        <h1>${stageNames[stage]}学习中心</h1>
        <p>选择学科后直接进入课程、例题和练习。</p>
      </div>
      <div class="home-stat-row">
        <div><strong>${state.answers}</strong><span>累计完成练习</span></div>
        <div><strong>${state.stars}</strong><span>获得星星</span></div>
        <div><strong>6</strong><span>学习学科</span></div>
      </div>`;
    dashboard.appendChild(stageSwitcher(stage, () => renderHome()));
    root.appendChild(dashboard);

    const section = document.createElement('section');
    section.className = 'home-section';
    section.innerHTML = '<div class="section-head"><div><h2>本阶段课程</h2><p>每张卡片都包含实际课程内容和互动练习。</p></div></div>';
    const grid = document.createElement('div');
    grid.className = 'subject-grid';

    subjectOrder.forEach(key => {
      const data = window.STUDY_DATA[key];
      if (!data) return;
      const stats = countStage(data, stage);
      const progress = state.progress[key]?.[stage] || 0;
      const firstUnit = data.stages?.[stage]?.[0];
      const firstLesson = firstUnit?.lessons?.[0];
      const card = document.createElement('a');
      card.className = `subject-card tone-${data.color}`;
      card.href = `${key}.html`;
      card.innerHTML = `
        <div class="subject-top"><span class="subject-icon">${escapeHtml(data.icon)}</span><span class="subject-count">${stats.units}单元 · ${stats.lessons}课</span></div>
        <h3>${escapeHtml(data.name)}</h3>
        <p>${escapeHtml(data.intro)}</p>
        <div class="next-lesson"><span>从这里开始</span><strong>${escapeHtml(firstUnit?.title || '')} · ${escapeHtml(firstLesson?.title || '')}</strong></div>
        <div class="progress-row"><div class="progress"><span style="width:${progress}%"></span></div><b>${progress}%</b></div>`;
      grid.appendChild(card);
    });
    section.appendChild(grid);
    root.appendChild(section);

    const quick = document.createElement('section');
    quick.className = 'home-section';
    quick.innerHTML = `
      <div class="section-head"><div><h2>专项学习</h2><p>从常规课程进入更深入的训练。</p></div></div>
      <div class="special-grid">
        <a class="special-card" href="math-olympiad.html"><span>🧠</span><div><h3>数学奥数篇</h3><p>规律、巧算、数论、组合、几何构造与竞赛证明。</p></div></a>
        <a class="special-card" href="english-exams.html"><span>🎓</span><div><h3>英语考级</h3><p>四级、六级、专八、托福和雅思专项训练。</p></div></a>
      </div>`;
    root.appendChild(quick);
    refreshPinyin();
  }

  function renderSubject() {
    const root = document.querySelector('#app');
    const data = window.STUDY_DATA[page];
    if (!root || !data) return;
    root.innerHTML = '';

    const hero = document.createElement('section');
    hero.className = `course-head tone-${data.color}`;
    hero.innerHTML = `
      <div class="course-icon">${escapeHtml(data.icon)}</div>
      <div class="course-title"><span class="eyebrow">课程中心</span><h1>${escapeHtml(data.name)}</h1><p>${escapeHtml(data.intro)}</p></div>
      <div class="course-actions"></div>`;
    const actions = hero.querySelector('.course-actions');
    if (data.extraLink) {
      const link = document.createElement('a');
      link.className = 'btn btn-primary';
      link.href = data.extraLink[0];
      link.textContent = data.extraLink[1];
      actions.appendChild(link);
    }
    if (data.parent) {
      const back = document.createElement('a');
      back.className = 'btn btn-soft';
      back.href = `${data.parent}.html`;
      back.textContent = `返回${window.STUDY_DATA[data.parent]?.name || '课程'}`;
      actions.appendChild(back);
    }
    root.appendChild(hero);

    if (data.tracks) renderTracks(root, data);
    else renderStages(root, data);
    refreshPinyin();
  }

  function renderStages(root, data) {
    const controls = document.createElement('section');
    controls.className = 'course-controls';
    const label = document.createElement('div');
    label.innerHTML = '<strong>选择学段</strong><span>切换后显示该阶段的完整课程。</span>';
    controls.appendChild(label);
    controls.appendChild(stageSwitcher(state.stage || 'preschool', () => renderSubject()));
    root.appendChild(controls);

    const stage = state.stage || 'preschool';
    const stats = countStage(data, stage);
    const meta = document.createElement('section');
    meta.className = 'course-meta';
    meta.innerHTML = `
      <div><strong>${stageNames[stage]}</strong><span>当前学段</span></div>
      <div><strong>${stats.units}</strong><span>课程单元</span></div>
      <div><strong>${stats.lessons}</strong><span>学习内容</span></div>
      <div><strong>${stats.practices}</strong><span>互动练习</span></div>`;
    root.appendChild(meta);
    root.appendChild(renderUnits(data.stages?.[stage] || [], data, stage));
  }

  function renderTracks(root, data) {
    const keys = Object.keys(data.tracks);
    let current = sessionStorage.getItem(`study-track-${page}`) || keys[0];
    const controls = document.createElement('section');
    controls.className = 'track-tabs';
    const content = document.createElement('div');

    const show = key => {
      current = key;
      sessionStorage.setItem(`study-track-${page}`, key);
      controls.querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.track === key));
      content.innerHTML = '';
      const track = data.tracks[key];
      const intro = document.createElement('div');
      intro.className = 'track-title';
      intro.innerHTML = `<h2>${escapeHtml(track.name)}</h2><p>${track.units.length}个训练模块，点击课程展开学习。</p>`;
      content.appendChild(intro);
      content.appendChild(renderUnits(track.units, data, key));
      refreshPinyin();
    };

    keys.forEach(key => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.track = key;
      button.textContent = data.tracks[key].name;
      button.addEventListener('click', () => show(key));
      controls.appendChild(button);
    });
    root.appendChild(controls);
    root.appendChild(content);
    show(current);
  }

  function renderUnits(units, data, stage) {
    const wrap = document.createElement('section');
    wrap.className = 'unit-list';
    units.forEach((unit, index) => {
      const details = document.createElement('details');
      details.className = 'course-unit';
      if (index === 0) details.open = true;
      const summary = document.createElement('summary');
      summary.innerHTML = `<span class="unit-number">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(unit.title)}</strong><small>${unit.lessons?.length || 0}项学习内容</small></span><i>展开</i>`;
      details.appendChild(summary);
      const body = document.createElement('div');
      body.className = 'unit-body';
      (unit.lessons || []).forEach(lesson => body.appendChild(renderLesson(lesson, data, stage)));
      details.appendChild(body);
      wrap.appendChild(details);
    });
    return wrap;
  }

  function renderLesson(lesson, data, stage) {
    const section = document.createElement('article');
    section.className = `lesson lesson-${lesson.type}`;
    const head = document.createElement('div');
    head.className = 'lesson-head';
    head.innerHTML = `<h3>${escapeHtml(lesson.title)}</h3>`;
    section.appendChild(head);

    if (lesson.type === 'chips') renderChips(section, lesson);
    if (lesson.type === 'cards') renderCards(section, lesson);
    if (lesson.type === 'table') renderTable(section, lesson);
    if (lesson.type === 'poem') renderPoem(section, lesson);
    if (lesson.type === 'reading') renderReading(section, lesson);
    if (lesson.type === 'steps') renderSteps(section, lesson);
    if (lesson.type === 'examples') renderExamples(section, lesson);
    if (lesson.type === 'sentences') renderSentences(section, lesson);
    if (lesson.type === 'phonics') renderPhonics(section, lesson);
    if (lesson.type === 'quiz') renderQuiz(section, lesson, data, stage);
    if (lesson.type === 'generated-math') renderGeneratedMath(section, lesson, data, stage);
    return section;
  }

  function renderChips(section, lesson) {
    const grid = document.createElement('div');
    grid.className = 'chip-grid';
    (lesson.items || []).forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sound-chip';
      button.innerHTML = `<strong>${escapeHtml(item[0])}</strong>${item[1] && item[1] !== item[0] ? `<small>${escapeHtml(item[1])}</small>` : ''}`;
      button.addEventListener('click', () => speak(item[1] || item[0], lesson.lang || 'zh-CN'));
      grid.appendChild(button);
    });
    section.appendChild(grid);
  }

  function renderCards(section, lesson) {
    const grid = document.createElement('div');
    grid.className = 'knowledge-grid';
    (lesson.items || []).forEach(item => {
      const card = document.createElement('div');
      card.className = 'knowledge-card';
      card.innerHTML = `<strong>${escapeHtml(item.term)}</strong>${item.sub ? `<span>${escapeHtml(item.sub)}</span>` : ''}<p>${escapeHtml(item.body)}</p>`;
      if (lesson.lang || item.speak) {
        card.tabIndex = 0;
        card.classList.add('speakable');
        card.addEventListener('click', () => speak(item.speak || item.term, lesson.lang || 'zh-CN'));
      }
      grid.appendChild(card);
    });
    section.appendChild(grid);
  }

  function renderTable(section, lesson) {
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    const table = document.createElement('table');
    (lesson.rows || []).forEach((row, index) => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const el = document.createElement(index === 0 ? 'th' : 'td');
        el.textContent = cell;
        tr.appendChild(el);
      });
      table.appendChild(tr);
    });
    wrap.appendChild(table);
    section.appendChild(wrap);
  }

  function renderPoem(section, lesson) {
    const poem = document.createElement('div');
    poem.className = 'poem-box';
    lesson.lines.forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      poem.appendChild(p);
    });
    const tools = document.createElement('div');
    tools.className = 'poem-tools';
    const read = document.createElement('button');
    read.type = 'button';
    read.className = 'btn btn-soft';
    read.textContent = '朗读全诗';
    read.addEventListener('click', () => speak(lesson.lines.join(''), 'zh-CN'));
    tools.appendChild(read);
    poem.appendChild(tools);
    section.appendChild(poem);
    if (lesson.notes?.length) {
      const notes = document.createElement('ul');
      notes.className = 'note-list';
      lesson.notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note;
        notes.appendChild(li);
      });
      section.appendChild(notes);
    }
    if (lesson.question) section.appendChild(answerDisclosure(lesson.question, lesson.answer));
  }

  function renderReading(section, lesson) {
    const passage = document.createElement('div');
    passage.className = 'reading-box';
    passage.textContent = lesson.passage;
    section.appendChild(passage);
    const questions = document.createElement('div');
    questions.className = 'qa-list';
    (lesson.questions || []).forEach(pair => questions.appendChild(answerDisclosure(pair[0], pair[1])));
    section.appendChild(questions);
  }

  function answerDisclosure(question, answer) {
    const details = document.createElement('details');
    details.className = 'answer-row';
    const summary = document.createElement('summary');
    summary.textContent = question;
    const p = document.createElement('p');
    p.textContent = answer;
    details.append(summary, p);
    return details;
  }

  function renderSteps(section, lesson) {
    const list = document.createElement('ol');
    list.className = 'step-list';
    (lesson.items || []).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
    section.appendChild(list);
  }

  function renderExamples(section, lesson) {
    const list = document.createElement('div');
    list.className = 'example-list';
    (lesson.items || []).forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'example-row';
      row.innerHTML = `<span class="example-number">${index + 1}</span><div><strong>${escapeHtml(item.q)}</strong><p hidden>${escapeHtml(item.a)}</p></div><button type="button">查看解答</button>`;
      const answer = row.querySelector('p');
      const button = row.querySelector('button');
      button.addEventListener('click', () => {
        answer.hidden = !answer.hidden;
        button.textContent = answer.hidden ? '查看解答' : '收起解答';
      });
      list.appendChild(row);
    });
    section.appendChild(list);
  }

  function renderSentences(section, lesson) {
    const list = document.createElement('div');
    list.className = 'sentence-list';
    (lesson.items || []).forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sentence-row';
      button.innerHTML = `<span>🔊</span><div><strong>${escapeHtml(item[0])}</strong><small>${escapeHtml(item[1])}</small></div>`;
      button.addEventListener('click', () => speak(item[0], lesson.lang || 'en-US'));
      list.appendChild(button);
    });
    section.appendChild(list);
  }

  function renderPhonics(section, lesson) {
    const grid = document.createElement('div');
    grid.className = 'phonics-grid';
    (lesson.groups || []).forEach(group => {
      const card = document.createElement('div');
      card.className = 'phonics-card';
      const title = document.createElement('strong');
      title.textContent = group.sound;
      card.appendChild(title);
      const words = document.createElement('div');
      group.words.forEach(word => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = word;
        button.addEventListener('click', () => speak(word, 'en-US'));
        words.appendChild(button);
      });
      card.appendChild(words);
      grid.appendChild(card);
    });
    section.appendChild(grid);
  }

  function renderQuiz(section, lesson, data, stage) {
    const id = `quiz-${quizCounter++}`;
    const box = document.createElement('div');
    box.className = 'quiz-box';
    box.id = id;
    let index = 0;

    const show = () => {
      const question = lesson.questions[index % lesson.questions.length];
      box.innerHTML = `<div class="quiz-count">第 ${index % lesson.questions.length + 1} / ${lesson.questions.length} 题</div><div class="quiz-question">${escapeHtml(question.q)}</div><div class="quiz-options"></div><div class="quiz-feedback"></div><button class="btn btn-soft quiz-next" type="button">下一题</button>`;
      const options = box.querySelector('.quiz-options');
      const feedback = box.querySelector('.quiz-feedback');
      shuffle(question.options).forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = option;
        button.addEventListener('click', () => {
          const good = String(option) === String(question.answer);
          button.classList.add(good ? 'correct' : 'wrong');
          if (good) {
            options.querySelectorAll('button').forEach(item => item.disabled = true);
            feedback.className = 'quiz-feedback good';
            feedback.textContent = `正确。${question.explain || ''}`;
            reward(data.parent || page, stage);
          } else {
            feedback.className = 'quiz-feedback bad';
            feedback.textContent = '答案不对，再试一次。';
          }
        });
        options.appendChild(button);
      });
      box.querySelector('.quiz-next').addEventListener('click', () => {
        index += 1;
        show();
        refreshPinyin(box);
      });
    };
    show();
    section.appendChild(box);
  }

  function mathQuestion(mode) {
    if (mode === 'preschool') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 5) + 1;
      const c = Math.floor(Math.random() * Math.min(5, a + b)) + 1;
      return { q: `${a}＋${b}－${c}＝？`, answer: a + b - c, explain: '同级运算从左到右。' };
    }
    if (mode === 'primary') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      const c = Math.floor(Math.random() * 9) + 1;
      return { q: `${a}×${b}＋${c}＝？`, answer: a * b + c, explain: '先乘法，后加法。' };
    }
    if (mode === 'junior') {
      const x = Math.floor(Math.random() * 8) + 1;
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 9) + 1;
      return { q: `${a}x＋${b}＝${a * x + b}，x＝？`, answer: x, explain: `移项得${a}x＝${a * x}，所以x＝${x}。` };
    }
    const x1 = Math.floor(Math.random() * 5) + 1;
    const x2 = Math.floor(Math.random() * 5) + 1;
    return { q: `x²－${x1 + x2}x＋${x1 * x2}＝0，较小的根是？`, answer: Math.min(x1, x2), explain: `方程可分解为（x－${x1}）（x－${x2}）＝0。` };
  }

  function renderGeneratedMath(section, lesson, data, stage) {
    const box = document.createElement('div');
    box.className = 'math-generator';
    const show = () => {
      const problem = mathQuestion(lesson.mode);
      const wrong1 = problem.answer + Math.floor(Math.random() * 3) + 1;
      const wrong2 = Math.max(0, problem.answer - Math.floor(Math.random() * 3) - 1);
      box.innerHTML = `<div class="math-problem">${escapeHtml(problem.q)}</div><div class="quiz-options"></div><div class="quiz-feedback"></div><button class="btn btn-soft" type="button">换一题</button>`;
      const options = box.querySelector('.quiz-options');
      const feedback = box.querySelector('.quiz-feedback');
      [...new Set(shuffle([problem.answer, wrong1, wrong2]))].forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = option;
        button.addEventListener('click', () => {
          const good = Number(option) === Number(problem.answer);
          button.classList.add(good ? 'correct' : 'wrong');
          if (good) {
            options.querySelectorAll('button').forEach(item => item.disabled = true);
            feedback.className = 'quiz-feedback good';
            feedback.textContent = `正确。${problem.explain}`;
            reward(data.parent || page, stage);
          } else {
            feedback.className = 'quiz-feedback bad';
            feedback.textContent = '再检查运算顺序。';
          }
        });
        options.appendChild(button);
      });
      box.querySelector('.btn').addEventListener('click', show);
    };
    show();
    section.appendChild(box);
  }

  function loadPinyin() {
    if (window.pinyinPro?.html) return Promise.resolve(window.pinyinPro);
    if (pinyinPromise) return pinyinPromise;
    pinyinPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pinyin-pro@3.28.1/dist/index.js';
      script.onload = () => window.pinyinPro?.html ? resolve(window.pinyinPro) : reject();
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return pinyinPromise;
  }

  function skipPinyin(node) {
    const parent = node.parentElement;
    if (!parent || !/[\u3400-\u9fff]/.test(node.nodeValue || '')) return true;
    return Boolean(parent.closest('script,style,code,pre,input,textarea,select,option,ruby,.pinyin-rendered,[data-no-pinyin]'));
  }

  function convertTextNode(node) {
    if (!window.pinyinPro?.html || skipPinyin(node)) return;
    const span = document.createElement('span');
    span.className = 'pinyin-rendered';
    span.innerHTML = window.pinyinPro.html(node.nodeValue, { toneType: 'symbol', nonZh: 'consecutive' });
    node.replaceWith(span);
  }

  function convertPinyin(root = document.body) {
    if (!window.pinyinPro?.html || !document.body.classList.contains('pinyin-on')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(convertTextNode);
  }

  async function refreshPinyin(root = document.body) {
    if (!state.pinyin) return;
    try {
      await loadPinyin();
      convertPinyin(root);
    } catch {}
  }

  function initPinyin() {
    const button = document.querySelector('[data-pinyin-toggle]');
    if (!button) return;
    const apply = async () => {
      button.classList.toggle('active', state.pinyin);
      button.setAttribute('aria-pressed', String(state.pinyin));
      document.body.classList.toggle('pinyin-on', state.pinyin);
      if (state.pinyin) {
        await refreshPinyin();
        if (!pinyinObserver) {
          pinyinObserver = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) refreshPinyin(node);
          })));
          pinyinObserver.observe(document.body, { childList: true, subtree: true });
        }
      }
    };
    button.addEventListener('click', () => {
      state.pinyin = !state.pinyin;
      saveState();
      apply();
    });
    apply();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderHeaderStats();
    initPinyin();
    if (page === 'home') renderHome();
    else renderSubject();
  });
})();