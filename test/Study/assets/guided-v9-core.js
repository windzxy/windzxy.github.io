(() => {
  'use strict';

  const V9 = window.WIND_GUIDED_V9 = window.WIND_GUIDED_V9 || {};
  V9.STORE_KEY = 'wind-guided-learning-v9';
  V9.ACADEMY_KEY = 'wind-academy-v4';
  V9.VERSION = '20260805-1';
  V9.REVIEW_DAYS = [0,1,2,4,7,14,30];
  V9.SUBJECT_NAMES = {
    chinese:'语文',math:'数学',english:'英语',cantonese:'粤语',japanese:'日语',
    korean:'韩语',science:'科学',physics:'物理',chemistry:'化学',biology:'生物',
    history:'历史',geography:'地理',computing:'信息科技',finance:'财商与生活',logic:'逻辑与思辨'
  };
  V9.MASTERY_NAMES = ['未开始','初次接触','正在学习','基本掌握','熟练','精通'];
  V9.DIRECT_PAGES = new Set(['chinese','math','english','cantonese','japanese','korean']);
  V9.BUILTIN_SEQUENCES = {
    japanese:{'コンビニで買い物':'japanese/convenience-store'},
    korean:{'카페에서 주문하기':'korean/cafe-order'}
  };
  V9.esc = value => String(value ?? '').replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  V9.clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  V9.cssEscape = value => window.CSS?.escape ? window.CSS.escape(String(value)) : String(value).replace(/["\\]/g,'\\$&');
  V9.sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
  V9.shuffle = list => {
    const copy = [...list];
    for (let i=copy.length-1;i>0;i-=1) {
      const j = Math.floor(Math.random()*(i+1));
      [copy[i],copy[j]] = [copy[j],copy[i]];
    }
    return copy;
  };
  V9.today = (offset=0) => {
    const date = new Date();
    date.setHours(12,0,0,0);
    date.setDate(date.getDate()+offset);
    return date.toISOString().slice(0,10);
  };
  V9.formatDate = value => {
    if (!value) return '今天';
    return new Intl.DateTimeFormat('zh-CN',{month:'short',day:'numeric'}).format(new Date(`${value}T12:00:00`));
  };

  V9.loadState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(V9.STORE_KEY)||'{}');
      return {
        xp:Number(saved.xp)||0,
        streak:Number(saved.streak)||0,
        lastStudyDate:saved.lastStudyDate||'',
        dailyGoal:Number(saved.dailyGoal)||40,
        daily:saved.daily&&typeof saved.daily==='object'?saved.daily:{date:V9.today(),xp:0},
        lessons:saved.lessons&&typeof saved.lessons==='object'?saved.lessons:{},
        sessions:Array.isArray(saved.sessions)?saved.sessions:[],
        preferences:saved.preferences&&typeof saved.preferences==='object'?saved.preferences:{}
      };
    } catch {
      return {xp:0,streak:0,lastStudyDate:'',dailyGoal:40,daily:{date:V9.today(),xp:0},lessons:{},sessions:[],preferences:{}};
    }
  };
  V9.state = V9.loadState();
  V9.ensureDaily = () => {
    if (V9.state.daily.date !== V9.today()) V9.state.daily = {date:V9.today(),xp:0};
  };
  V9.saveState = () => {
    V9.ensureDaily();
    V9.state.sessions = V9.state.sessions.slice(-300);
    localStorage.setItem(V9.STORE_KEY,JSON.stringify(V9.state));
    V9.updateTopStats();
  };
  V9.academyState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(V9.ACADEMY_KEY)||'{}');
      return {...saved,progress:saved.progress||{},stars:Number(saved.stars)||0};
    } catch {
      return {progress:{},stars:0};
    }
  };
  V9.updateAcademy = (subject,stage,progress,stars) => {
    const academy = V9.academyState();
    academy.progress[subject] ||= {};
    academy.progress[subject][stage] = V9.clamp(Math.max(Number(academy.progress[subject][stage])||0,progress),0,100);
    academy.stars += stars;
    academy.lastSubject = subject;
    localStorage.setItem(V9.ACADEMY_KEY,JSON.stringify(academy));
    const star = document.querySelector('#star-count');
    if (star) star.textContent = academy.stars;
  };
  V9.subject = () => document.body.dataset.subject || new URLSearchParams(location.search).get('subject') || V9.academyState().lastSubject || 'math';
  V9.stage = () => document.querySelector('#subject-stage')?.value || new URLSearchParams(location.search).get('stage') || document.body.dataset.stage || V9.academyState().stage || 'primary';
  V9.courseHref = (subjectKey,guided=false) => {
    if (V9.DIRECT_PAGES.has(subjectKey)) return `${subjectKey}.html${guided?'?guided=1':''}`;
    return `course.html?subject=${encodeURIComponent(subjectKey)}${guided?'&guided=1':''}`;
  };
  V9.lessonKey = (title,subjectKey=V9.subject(),stageKey=V9.stage()) => `${subjectKey}|${stageKey}|${String(title).trim()}`;
  V9.lessonRecord = (title,subjectKey=V9.subject(),stageKey=V9.stage()) => V9.state.lessons[V9.lessonKey(title,subjectKey,stageKey)] || {mastery:0,attempts:0,nextReview:'',lastAt:'',xp:0};
  V9.due = record => Boolean(record.nextReview && record.nextReview <= V9.today());
  V9.updateStreak = () => {
    const current = V9.today();
    if (V9.state.lastStudyDate === current) return;
    V9.state.streak = V9.state.lastStudyDate === V9.today(-1) ? V9.state.streak+1 : 1;
    V9.state.lastStudyDate = current;
  };
  V9.addXp = amount => {
    V9.ensureDaily();
    V9.state.xp += amount;
    V9.state.daily.xp += amount;
  };
  V9.updateTopStats = () => {
    document.querySelectorAll('[data-v9-xp]').forEach(node => {node.textContent=V9.state.xp;});
    document.querySelectorAll('[data-v9-streak]').forEach(node => {node.textContent=V9.state.streak;});
    document.querySelectorAll('[data-v9-daily]').forEach(node => {node.textContent=`${Math.min(V9.state.daily.xp,V9.state.dailyGoal)}/${V9.state.dailyGoal}`;});
    document.querySelectorAll('[data-v9-daily-bar]').forEach(node => {node.style.width=`${V9.clamp(V9.state.daily.xp/V9.state.dailyGoal*100,0,100)}%`;});
  };
  V9.injectCss = () => {
    if (document.querySelector('link[data-guided-v9]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `assets/learning-path-v9.css?v=${V9.VERSION}`;
    link.dataset.guidedV9 = V9.VERSION;
    document.head.append(link);
  };
  V9.plainText = node => {
    if (!node) return '';
    const clone = node.cloneNode(true);
    clone.querySelectorAll('button,svg').forEach(item => item.remove());
    return clone.textContent.replace(/\s+/g,' ').trim();
  };
  V9.copyAudioData = button => {
    if (!button) return null;
    const data = {};
    ['speak','language','audioKey','audioSequence'].forEach(key => {
      if (button.dataset[key]) data[key] = button.dataset[key];
    });
    return Object.keys(data).length ? data : null;
  };
  V9.audioButton = (data,label='▶') => {
    if (!data) return '';
    const attrs = Object.entries(data).map(([key,value]) => `data-v9-${key.replace(/[A-Z]/g,match=>`-${match.toLowerCase()}`)}="${V9.esc(value)}"`).join(' ');
    return `<button class="v9-audio" type="button" ${attrs}>${label}</button>`;
  };
  V9.clickLegacyTab = async name => {
    const button = document.querySelector(`#deep-course-v6 [data-deep-tab="${name}"]`);
    if (button && !button.classList.contains('active')) {
      button.click();
      await V9.sleep(45);
    }
  };
  V9.captureLesson = async index => {
    const root = document.querySelector('#deep-course-v6');
    const buttons = [...root.querySelectorAll('[data-course-index]')];
    const target = buttons[index] || buttons[0];
    if (!target) return null;
    target.click();
    await V9.sleep(70);
    const title = document.querySelector('#deep-course-v6 .deep-header h2')?.textContent.trim() || V9.plainText(target);
    const objective = document.querySelector('#deep-course-v6 .deep-header p')?.textContent.trim() || '';
    await V9.clickLegacyTab('source');
    const sourceRoot = document.querySelector('#deep-course-v6 .deep-content');
    let lines = [...sourceRoot.querySelectorAll('.poem-sheet p')].map(node => ({
      text:V9.plainText(node),reading:'',audio:V9.copyAudioData(node.querySelector('button'))
    }));
    if (!lines.length) {
      lines = [...sourceRoot.querySelectorAll('.full-source article')].map(article => ({
        text:article.querySelector('p')?.textContent.trim()||'',
        reading:article.querySelector('code')?.textContent.trim()||'',
        note:article.querySelector('small')?.textContent.trim()||'',
        audio:V9.copyAudioData(article.querySelector('button'))
      })).filter(item => item.text);
    }
    const sourceTitle = sourceRoot.querySelector('.poem-sheet h3,.source-head h3')?.textContent.trim() || title;
    const overview = sourceRoot.querySelector('.background-card p')?.textContent.trim() || '';
    const meta = sourceRoot.querySelector('.work-meta,.source-head span')?.textContent.replace(/\s+/g,' ').trim() || '';
    await V9.clickLegacyTab('explain');
    const explainRoot = document.querySelector('#deep-course-v6 .deep-content');
    let explanations = [...explainRoot.querySelectorAll('.line-notes article')].map(article => ({
      title:article.querySelector('h3')?.textContent.trim()||'',
      text:article.querySelector('p')?.textContent.trim()||'',
      extra:article.querySelector('small')?.textContent.trim()||''
    }));
    if (!explanations.length) {
      explanations = [...explainRoot.querySelectorAll('.analysis-grid article')].map(article => ({
        title:article.querySelector('b')?.textContent.trim()||'',
        text:article.querySelector('p')?.textContent.trim()||'',
        extra:''
      }));
    }
    const theme = explainRoot.querySelector('.theme-card p')?.textContent.trim() || '';
    await V9.clickLegacyTab('thinking');
    const thinkingRoot = document.querySelector('#deep-course-v6 .deep-content');
    const sequence = [...thinkingRoot.querySelectorAll('.thinking-flow article span')].map(node=>node.textContent.trim()).filter(Boolean);
    const techniques = [...thinkingRoot.querySelectorAll('.technique-grid article')].map(article=>({
      title:article.querySelector('b')?.textContent.trim()||'',
      text:article.querySelector('p')?.textContent.trim()||''
    }));
    const task = thinkingRoot.querySelector('.background-card p')?.textContent.trim() || '';
    await V9.clickLegacyTab('exam');
    const examRoot = document.querySelector('#deep-course-v6 .deep-content');
    const famous = [...examRoot.querySelectorAll('.famous-list article')].map(article=>({
      title:article.querySelector('strong')?.textContent.trim()||'',
      text:article.querySelector('p')?.textContent.trim()||''
    }));
    const examGroups = [...examRoot.querySelectorAll('.exam-grid article')].map(article=>({
      title:article.querySelector('h3')?.textContent.trim()||'',
      items:[...article.querySelectorAll('li')].map(node=>node.textContent.trim()).filter(Boolean)
    }));
    await V9.clickLegacyTab('practice');
    const practiceRoot = document.querySelector('#deep-course-v6 .deep-content');
    const questions = [...practiceRoot.querySelectorAll('.deep-questions article')].map(article=>({
      question:article.querySelector('h3')?.textContent.trim()||'',
      answer:article.querySelector('p')?.textContent.trim()||''
    })).filter(item=>item.question&&item.answer);
    const transfer = practiceRoot.querySelector('.transfer-task h3')?.textContent.trim() || task;
    const builtIn = V9.BUILTIN_SEQUENCES[V9.subject()]?.[sourceTitle];
    if (builtIn) lines = lines.map((line,lineIndex)=>({...line,audio:{audioKey:`${builtIn}/${String(lineIndex+1).padStart(2,'0')}`,language:V9.subject()}}));
    await V9.clickLegacyTab('source');
    return {index,title,objective,sourceTitle,overview,meta,lines,explanations,theme,sequence,techniques,famous,examGroups,questions,transfer};
  };
  V9.makeObjective = data => {
    const readingPairs = data.lines.filter(item=>item.reading).slice(0,5);
    if (readingPairs.length>=3) {
      const correct = readingPairs[Math.floor(Math.random()*readingPairs.length)];
      return {type:'choice',prompt:`“${correct.text}”的读音提示是哪一项？`,options:V9.shuffle(readingPairs.map(item=>item.reading)),answer:correct.reading,explanation:'读音提示来自本课完整材料。请再次跟读并注意节奏、长音或声调。'};
    }
    const meaningPairs = data.explanations.filter(item=>item.title&&item.text).slice(0,5);
    if (meaningPairs.length>=3) {
      const correct = meaningPairs[Math.floor(Math.random()*meaningPairs.length)];
      return {type:'choice',prompt:`“${correct.title}”在本课中的含义或作用是？`,options:V9.shuffle(meaningPairs.map(item=>item.text)),answer:correct.text,explanation:correct.extra||'答案来自本课逐层讲解。'};
    }
    if (data.sequence.length>=3) return {type:'order',prompt:'按本课的思路顺序排列',items:data.sequence.slice(0,6),answer:data.sequence.slice(0,6),explanation:'顺序体现内容如何由起点推进到结论。'};
    const recall = data.questions[0] || {question:'用自己的话概括本课的核心内容。',answer:data.theme||data.overview||data.objective};
    return {type:'recall',prompt:recall.question,answer:recall.answer,explanation:'对照参考答案检查是否包含对象、过程和结论。'};
  };
  V9.currentLessonButtons = () => [...document.querySelectorAll('#deep-course-v6 [data-course-index]')];
  V9.currentLessonTitles = () => V9.currentLessonButtons().map(button=>button.querySelector('span')?.textContent.trim()||V9.plainText(button));
  V9.progressForCourse = (titles,subjectKey=V9.subject(),stageKey=V9.stage()) => {
    if (!titles.length) return 0;
    return Math.round(titles.reduce((sum,title)=>sum+V9.lessonRecord(title,subjectKey,stageKey).mastery,0)/(titles.length*5)*100);
  };
  V9.recommendedIndex = titles => {
    const records = titles.map((title,index)=>({index,record:V9.lessonRecord(title),title}));
    return records.find(item=>V9.due(item.record))?.index
      ?? records.find(item=>item.record.mastery>0&&item.record.mastery<3)?.index
      ?? records.find(item=>item.record.mastery===0)?.index
      ?? records.sort((a,b)=>a.record.mastery-b.record.mastery)[0]?.index
      ?? 0;
  };
  V9.pathStatus = record => {
    if (V9.due(record)) return {label:'到期复习',icon:'↻',className:'due'};
    if (record.mastery>=5) return {label:'精通',icon:'★',className:'expert'};
    if (record.mastery>=3) return {label:'已掌握',icon:'✓',className:'mastered'};
    if (record.mastery>0) return {label:'学习中',icon:'◐',className:'learning'};
    return {label:'新课',icon:'●',className:'new'};
  };
  V9.courseSummary = titles => {
    const records = titles.map(title=>V9.lessonRecord(title));
    return {
      due:records.filter(V9.due).length,
      mastered:records.filter(item=>item.mastery>=3).length,
      learning:records.filter(item=>item.mastery>0&&item.mastery<3).length,
      progress:V9.progressForCourse(titles)
    };
  };
  V9.wrapLibraries = () => {
    if (document.querySelector('#v9-library-drawer')) return;
    const libraries = [...document.querySelectorAll('#east-language-library,#more-courses-v8')];
    if (!libraries.length) return;
    const drawer = document.createElement('details');
    drawer.id = 'v9-library-drawer';
    drawer.innerHTML = '<summary><span>扩展课程与完整案例</span><b>展开资源库</b></summary><div class="v9-library-body"></div>';
    libraries[0].before(drawer);
    const body = drawer.querySelector('.v9-library-body');
    libraries.forEach(item=>body.append(item));
  };
  V9.dueCount = () => Object.values(V9.state.lessons).filter(V9.due).length;
  V9.weeklyActivity = () => Array.from({length:7},(_,index)=>{
    const key=V9.today(index-6);
    const count=V9.state.sessions.filter(item=>item.date?.slice(0,10)===key).length;
    return {key,count,label:new Intl.DateTimeFormat('zh-CN',{weekday:'short'}).format(new Date(`${key}T12:00:00`))};
  });
})();
