(function () {
  'use strict';

  var STORE_KEY = 'wind-study-platform-v1';
  var ALL_GRADES = [1,2,3,4,5,6,7,8,9,10,11,12];
  var REGIONS = {
    cn: { name:'中国内地', short:'内地课程', framework:'国家课程标准', stages:['小学','初中','高中'], accent:'#e75757' },
    hk: { name:'中国香港', short:'香港课程', framework:'香港课程发展议会 · KS1–KS4', stages:['小學','中學','高中'], accent:'#3478f6' },
    mo: { name:'中国澳门', short:'澳门课程', framework:'澳门基本学力要求', stages:['小學','初中','高中'], accent:'#20a77b' },
    sg: { name:'新加坡', short:'新加坡课程', framework:'MOE Primary & Secondary', stages:['Primary','Secondary','Pre-U'], accent:'#ef6b63' },
    us: { name:'美国', short:'美国课程', framework:'Grade-level standards pathway', stages:['Elementary','Middle','High'], accent:'#7868e8' }
  };
  var SUBJECTS = {
    math: { name:'数学', names:{hk:'數學',mo:'數學',sg:'Mathematics',us:'Mathematics'}, mark:'∑', color:'#3478f6', grades:ALL_GRADES },
    chinese: { name:'语文', names:{hk:'中文',mo:'中文',sg:'华文',us:'中文'}, mark:'文', color:'#ef7d5b', grades:ALL_GRADES },
    english: { name:'英语', names:{hk:'英文',mo:'英文',sg:'English',us:'English'}, mark:'A', color:'#7868e8', grades:ALL_GRADES },
    science: { name:'科学', names:{hk:'科學',mo:'科學',sg:'Science',us:'Science'}, mark:'◎', color:'#16a5a3', grades:ALL_GRADES },
    physics: { name:'物理与工程', names:{hk:'物理與工程',mo:'物理與工程',sg:'Physics',us:'Physics & Engineering'}, mark:'Φ', color:'#20a77b', grades:ALL_GRADES },
    social: { name:'人文与社会', names:{hk:'人文科',mo:'人文與社會',sg:'Social Studies',us:'Social Studies'}, mark:'地', color:'#d48a2f', grades:ALL_GRADES },
    computing: { name:'数字与编程', names:{hk:'數字與編程',mo:'資訊與科技',sg:'Computing',us:'Computer Science'}, mark:'⌘', color:'#4d78d6', grades:ALL_GRADES },
    arts: { name:'艺术', names:{hk:'藝術',mo:'藝術',sg:'Arts',us:'Arts'}, mark:'◒', color:'#d45f9b', grades:ALL_GRADES },
    wellbeing: { name:'健康与生活', names:{hk:'健康與生活',mo:'健康與生活',sg:'Health & Life',us:'Health & SEL'}, mark:'♡', color:'#e56e58', grades:ALL_GRADES }
  };
  var FOUNDATION_TRACKS = {
    math:[['数感与运算','用数量、符号和策略解决与年级相适应的问题。'],['图形与测量','观察形状、空间、长度、时间与测量。'],['数据与推理','整理信息，发现规律并解释思路。']],
    chinese:[['阅读与理解','阅读适龄文本，找出关键信息并作出回应。'],['表达与沟通','清楚表达想法，并根据对象调整说法。'],['语言与文化','积累语言知识，理解文化与生活语境。']],
    english:[['Reading','Read age-appropriate texts and locate key information.'],['Communication','Listen, speak and communicate ideas with growing confidence.'],['Writing','Build accurate sentences and organise ideas for a purpose.']],
    science:[['科学探究','从观察提出问题，用证据解释发现。'],['生命与环境','认识生命、健康、生态与环境之间的关系。'],['物质与地球','探索材料、能量、天气、地球与太空。']],
    physics:[['力与运动','从推拉、速度和平衡逐步建立物理模型。'],['光声电与能量','通过生活现象理解光、声音、电与能量。'],['工程设计','定义问题、制作方案、测试并改进。']],
    social:[['自我与社区','认识家庭、学校、社区及彼此的责任。'],['地方与世界','理解地点、历史、文化与全球联系。'],['公民与媒体','学习规则、选择、财商与信息判断。']],
    computing:[['数字公民','安全、负责、有礼地使用数字工具。'],['计算思维','把问题拆开，寻找模式并设计步骤。'],['编程与创作','用代码、数据与数字媒体表达和解决问题。']],
    arts:[['视觉与设计','用线条、色彩、材料和设计表达想法。'],['音乐与节奏','聆听、演奏、创作并回应音乐。'],['戏剧与表演','通过动作、角色和故事发展表达力。']],
    wellbeing:[['身体与健康','建立运动、饮食、睡眠与卫生习惯。'],['情绪与关系','识别情绪，学习沟通、同理与合作。'],['安全与生活能力','练习自理、风险判断与适龄生活技能。']]
  };
  var CROSS_SUBJECTS = {math:['science','computing'],chinese:['social','arts'],english:['social','computing'],science:['math','wellbeing'],physics:['math','computing'],social:['chinese','wellbeing'],computing:['math','arts'],arts:['chinese','computing'],wellbeing:['science','social']};
  var ICONS = {
    sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    map: '<path d="m3 6 5-2 8 2 5-2v14l-5 2-8-2-5 2Z"/><path d="M8 4v14M16 6v14"/>',
    pencil: '<path d="m4 20 4.2-1 10.6-10.6a2.1 2.1 0 0 0-3-3L5.2 16Z"/><path d="m14.5 6.7 3 3"/>',
    family: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6M14 15c3.3-.8 5.6.8 6 4"/>',
    flame: '<path d="M13 22c4-1 7-4 7-8 0-4-2-7-6-11 0 4-3 5-4 8-1-2-2-3-3-4-2 3-3 5-3 8 0 4 4 7 9 7Z"/><path d="M9 18c0-2 1-3 3-5 0 2 2 2 2 4 0 2-1 3-3 4"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 8-8"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
    brain: '<path d="M9.5 4A3.5 3.5 0 0 0 6 7.5c0 .4.1.8.2 1.1A3.8 3.8 0 0 0 4 12c0 1.5.8 2.8 2 3.4V17a3 3 0 0 0 3 3c1.2 0 2.3-.7 3-1.6V6.5A2.5 2.5 0 0 0 9.5 4Z"/><path d="M14.5 4A3.5 3.5 0 0 1 18 7.5c0 .4-.1.8-.2 1.1A3.8 3.8 0 0 1 20 12c0 1.5-.8 2.8-2 3.4V17a3 3 0 0 1-3 3c-1.2 0-2.3-.7-3-1.6M8 9c1.8 0 3-1 4-2.5M16 9c-1.8 0-3-1-4-2.5M8 15c1.8 0 3 1 4 2.5M16 15c-1.8 0-3 1-4 2.5"/>',
    repeat: '<path d="M20 7h-9a5 5 0 0 0-5 5v1M4 17h9a5 5 0 0 0 5-5v-1"/><path d="m17 4 3 3-3 3M7 14l-3 3 3 3"/>',
    spark: '<path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z"/>',
    book: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5A3.5 3.5 0 0 1 20 23Z"/>',
    trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0ZM12 12v5M8 21h8M10 17h4M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4"/>',
    wrong: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>'
  };

  var app = document.getElementById('app');
  var modalLayer = document.getElementById('modal-layer');
  var modalCard = document.getElementById('modal-card');
  var toastNode = document.getElementById('toast');
  var regionSelect = document.getElementById('region-select');
  var regionCaption = document.getElementById('region-caption');
  var curriculumContext = document.getElementById('curriculum-context');
  var gradeSelect = document.getElementById('grade-select');
  var gradeCaption = document.getElementById('grade-caption');
  var profileButton = document.getElementById('profile-button');
  var subjectBar = document.getElementById('subject-bar');
  var D = null;
  var quiz = null;
  var learnSearch = '';
  var learnDomain = 'all';

  function loadState() {
    var base = { child: '小朋友', region: 'cn', subject: 'math', grade: 1, view: hashView(), practiceCount: 5, progress: {}, history: [] };
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      Object.keys(base).forEach(function (k) { if (saved[k] !== undefined) base[k] = saved[k]; });
    } catch (e) { /* use defaults */ }
    base.progress = base.progress || {};
    base.history = Array.isArray(base.history) ? base.history : [];
    if(!REGIONS[base.region])base.region='cn';
    if(!SUBJECTS[base.subject])base.subject='math';
    return base;
  }
  var state = loadState();
  function saveState() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage optional */ } }
  function hashView() { var h = location.hash.replace('#', '').split('&')[0]; return ['home','learn','practice','parent'].indexOf(h) >= 0 ? h : 'home'; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>'"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]; }); }
  function icon(name) { return '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.spark) + '</svg>'; }
  function subjectName(key) { var s=SUBJECTS[key]||SUBJECTS.math; return (s.names&&s.names[state.region])||s.name; }
  function subjectOf(t) {
    if (t.subject) return t.subject;
    if (t.id.indexOf('cnc_') === 0) return 'chinese';
    if (t.id.indexOf('cne_') === 0) return 'english';
    if (t.id.indexOf('cnp_') === 0) return 'physics';
    return 'math';
  }
  function gradeLabel(g) {
    var n='一二三四五六七八九';
    if(state.region==='hk') return g<=6?'小'+n[g-1]:g<=12?'中'+(['一','二','三','四','五','六'][g-7]):'中学';
    if(state.region==='mo') return g<=6?'小'+n[g-1]:g<=9?'初'+n[g-7]:'高'+n[g-10];
    if(state.region==='sg') return g<=6?'Primary '+g:g<=10?'Secondary '+(g-6):'Pre-U '+(g-10);
    if(state.region==='us') return 'Grade '+g;
    if(g<=9)return n[g-1]+'年级';
    return '高'+n[g-10];
  }
  function statusOf(id) {
    var p = state.progress[id];
    if (!p || !p.attempts) return 'new';
    if (p.mastered || (p.attempts >= 3 && p.correct / p.attempts >= .8)) return 'mastered';
    if (p.wrong > p.correct) return 'weak';
    return 'learning';
  }
  function statusLabel(s) { return {new:'未开始',learning:'学习中',mastered:'已掌握',weak:'需巩固'}[s] || '未开始'; }
  function availableInRegion(t) {
    if(t.universal) return true;
    if(state.region==='cn') return true;
    return subjectOf(t)==='math' || subjectOf(t)==='physics';
  }
  function currentTopics(allGrades) {
    return D.topics.filter(function (t) { return subjectOf(t) === state.subject && availableInRegion(t) && (allGrades || Number(t.grade) === Number(state.grade)); });
  }
  function progressStats(topics) {
    var mastered = 0, learning = 0, weak = 0;
    topics.forEach(function (t) { var s = statusOf(t.id); if (s === 'mastered') mastered++; else if (s === 'weak') weak++; else if (s === 'learning') learning++; });
    var history = state.history.filter(function (x) { return topics.some(function (t) { return t.id === x.topicId; }); });
    var right = history.filter(function (x) { return x.correct; }).length;
    return { mastered: mastered, learning: learning, weak: weak, total: topics.length, accuracy: history.length ? Math.round(right / history.length * 100) : 0, answered: history.length };
  }
  function sortedTopics(topics) { return topics.slice().sort(function (a,b) { return Number(a.grade)-Number(b.grade) || String(a.chapter).localeCompare(String(b.chapter),'zh') || a.name.localeCompare(b.name,'zh'); }); }
  function developmentCopy(g) {
    if(g<=2)return '以观察、操作、讲述和生活例子为主。';
    if(g<=4)return '开始比较、分类、记录，并用证据说明。';
    if(g<=6)return '连接多个概念，选择策略并检查结果。';
    if(g<=9)return '建立模型、分析信息，并迁移到新情境。';
    return '综合论证、探究与真实任务，形成独立判断。';
  }
  function buildFoundationContent() {
    var topics=[],questions=[],deps=[];
    Object.keys(FOUNDATION_TRACKS).forEach(function(subject){
      ALL_GRADES.forEach(function(g){
        FOUNDATION_TRACKS[subject].forEach(function(track,i){
          var id='wind_'+subject+'_g'+g+'_t'+(i+1), previous='wind_'+subject+'_g'+(g-1)+'_t'+(i+1);
          topics.push({id:id,name:track[0],domain:track[0],grade:g,chapter:track[0],type:i===0?'conceptual':i===1?'application':'reasoning',description:track[1]+' '+developmentCopy(g),mastery_criteria:['能用自己的话说明核心概念','能完成一个与年龄相适应的示例','能把所学用到新的生活或学习情境'],subject:subject,universal:true,crossSubjects:CROSS_SUBJECTS[subject]||[]});
          questions.push({id:id+'_q1',topicId:id,difficulty:'basic',type:'self',prompt:'关于「'+track[0]+'」，你能不用提示讲清楚，并举一个例子吗？',answer:'yes',explanation:'先讲清楚，再举例，最后尝试一个有变化的新情境。'});
          questions.push({id:id+'_q2',topicId:id,difficulty:'standard',type:'choice',prompt:'哪一种表现最能说明你真正掌握了「'+track[0]+'」？',choices:[{key:'A',text:'能解释、示范，还能用在新情境'},{key:'B',text:'只记住标题'},{key:'C',text:'看过答案但说不出原因'},{key:'D',text:'只做过完全一样的一题'}],answer:'A',explanation:'真正掌握不只是记住，还包括解释、应用和迁移。'});
          if(g>1)deps.push({topicId:id,prerequisiteId:previous,kind:'progression'});
        });
      });
    });
    return {topics:topics,questions:questions,deps:deps};
  }
  function pickLearningTopics() {
    var topics = sortedTopics(currentTopics());
    var weak = topics.find(function (t) { return statusOf(t.id) === 'weak'; });
    var learning = topics.find(function (t) { return statusOf(t.id) === 'learning'; });
    var fresh = topics.find(function (t) { return statusOf(t.id) === 'new'; });
    var main = weak || learning || fresh || topics[0];
    var review = topics.find(function (t) { return t.id !== (main && main.id) && statusOf(t.id) !== 'new'; }) || topics[1] || main;
    var nextGrade = SUBJECTS[state.subject].grades.find(function (g) { return g > state.grade; });
    var extend = D.topics.find(function (t) { return subjectOf(t) === state.subject && Number(t.grade) === Number(nextGrade); }) || topics[topics.length - 1] || main;
    return { main: main, review: review, extend: extend };
  }
  function uniqueStudyDays() {
    return new Set(state.history.map(function (x) { return String(x.date || '').slice(0,10); })).size;
  }
  function recentAccuracy(days) {
    var since = Date.now() - (days || 7) * 86400000;
    var rows = state.history.filter(function (x) { return new Date(x.date).getTime() >= since; });
    return rows.length ? Math.round(rows.filter(function (x) { return x.correct; }).length / rows.length * 100) : 0;
  }
  function renderSubjectBar() {
    subjectBar.innerHTML = Object.keys(SUBJECTS).map(function (key) {
      var s = SUBJECTS[key];
      return '<button class="subject-chip ' + (state.subject === key ? 'active' : '') + '" style="--subject:' + s.color + '" data-subject="' + key + '" type="button"><i>' + s.mark + '</i>' + esc(subjectName(key)) + '</button>';
    }).join('');
  }
  function renderRegionSelect() {
    regionSelect.innerHTML=Object.keys(REGIONS).map(function(k){return '<option value="'+k+'" '+(state.region===k?'selected':'')+'>'+REGIONS[k].name+'</option>';}).join('');
    regionCaption.textContent=REGIONS[state.region].name;
  }
  function renderGradeSelect() {
    var grades = SUBJECTS[state.subject].grades;
    if (grades.indexOf(Number(state.grade)) < 0) state.grade = grades[0];
    gradeSelect.innerHTML = grades.map(function (g) { return '<option value="' + g + '" ' + (Number(state.grade) === Number(g) ? 'selected' : '') + '>' + gradeLabel(g) + '</option>'; }).join('');
    gradeCaption.textContent = gradeLabel(Number(state.grade));
    document.getElementById('profile-avatar').textContent = (state.child || '小').slice(0,1);
  }
  function renderCurriculumContext() {
    var r=REGIONS[state.region];
    curriculumContext.style.setProperty('--region-color',r.accent);
    curriculumContext.innerHTML='<span class="region-dot"></span><strong>'+esc(r.short)+'</strong><span>'+esc(gradeLabel(Number(state.grade)))+' · '+esc(subjectName(state.subject))+'</span><small>学习路径已按地区与年级调整</small>';
  }
  function updateNavigation() {
    document.querySelectorAll('[data-view]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-view') === state.view); });
  }
  function setView(view) { state.view = view; saveState(); history.replaceState(null,'','#' + view); closeModal(); updateNavigation(); render(); window.scrollTo({top:0,behavior:'smooth'}); }
  function viewHead(title, subtitle, action) { return '<div class="view-head"><div><h1>' + esc(title) + '</h1><p>' + esc(subtitle) + '</p></div>' + (action ? '<div class="view-actions">' + action + '</div>' : '') + '</div>'; }


  function mathGardenCard(){
    var stars=0,designs=0;
    try{
      var data=JSON.parse(localStorage.getItem('wind-math-bead-garden-v1')||'{}');
      stars=Math.max(0,Math.floor(Number(data.stars)||0));
      designs=Array.isArray(data.savedDesigns)?data.savedDesigns.length:0;
    }catch(err){}
    return '<a class="ios-card garden-spotlight" href="math.html?v=20261028-4" aria-label="进入数学成长乐园和拼豆工坊">'+
      '<div class="garden-visual" aria-hidden="true"><i>★</i><i>✦</i><i>✧</i><i>✦</i><i>★</i><i>✧</i><i>✦</i><i>★</i><i>✧</i></div>'+
      '<div class="garden-copy"><small>数学成长乐园 · 每天十分钟</small><h3>练习数学，拼出你的星星世界</h3><p>10 题快速练习 · 17 款像素图案 · 自由创作与收藏</p></div>'+
      '<div class="garden-tail"><span><b>★ '+stars+'</b> 颗星星</span><span>'+designs+' 件作品</span><strong>开始探索 ›</strong></div></a>';
  }

  function renderHome() {
    var topics = currentTopics(), stats = progressStats(topics), picks = pickLearningTopics();
    var pct = stats.total ? Math.round(stats.mastered / stats.total * 100) : 0;
    var greeting = new Date().getHours() < 12 ? '早上好' : new Date().getHours() < 18 ? '下午好' : '晚上好';
    var plans = [
      { n:'01', label:'学习', color:'#3478f6', soft:'#eaf2ff', topic:picks.main, copy:'理解概念，再用自己的话说出来' },
      { n:'02', label:'巩固', color:'#20a77b', soft:'#e7f8f1', topic:picks.review, copy:'用短练习确认是否真正掌握' },
      { n:'03', label:'拓展', color:'#7868e8', soft:'#efedff', topic:picks.extend, copy:'连接下一步知识，建立迁移能力' }
    ];
    var week = weekData();
    return '<section class="view home-view">' +
      '<div class="hero-grid"><article class="ios-card hero-card"><p class="eyebrow">' + greeting + '，' + esc(state.child) + '</p><h1>今天，学懂一个<br>真正重要的知识点</h1><p class="hero-copy">先理解，再练习，最后用一道拓展题把知识连起来。</p><div class="hero-actions"><button class="primary-btn" data-action="start-smart" type="button">开始今日学习</button><button class="secondary-btn" data-action="show-topic" data-topic="' + esc(picks.main && picks.main.id) + '" type="button">查看知识点</button><a class="secondary-btn" href="math.html?v=20261028-4">数学练习＋拼豆工坊</a></div><div class="hero-progress"><div class="hero-progress-bar"><i style="width:' + pct + '%"></i></div><span>' + pct + '% 年级进度</span></div></article>' +
      '<aside class="ios-card quick-stats"><div class="stat-tile"><div class="stat-icon" style="--tile:#f09b2d;--tile-soft:#fff3df">' + icon('flame') + '</div><strong>' + uniqueStudyDays() + '</strong><span>学习天数</span></div><div class="stat-tile"><div class="stat-icon" style="--tile:#3478f6;--tile-soft:#eaf2ff">' + icon('target') + '</div><strong>' + recentAccuracy(7) + '%</strong><span>近七天正确率</span></div><div class="stat-tile"><div class="stat-icon" style="--tile:#20a77b;--tile-soft:#e7f8f1">' + icon('check') + '</div><strong>' + stats.mastered + '</strong><span>已掌握知识点</span></div><div class="stat-tile"><div class="stat-icon" style="--tile:#7868e8;--tile-soft:#efedff">' + icon('clock') + '</div><strong>' + Math.max(8,stats.answered * 2) + '</strong><span>累计学习分钟</span></div></aside></div>' +
      mathGardenCard() +
      '<div class="section-row"><div><h2>今日三步</h2><p>学习 · 巩固 · 迁移</p></div><button class="text-btn" data-view="practice" type="button">全部练习 →</button></div>' +
      '<div class="plan-grid">' + plans.map(function (x) { return '<button class="ios-card plan-card" style="--plan-color:' + x.color + ';--plan-soft:' + x.soft + '" data-action="plan" data-topic="' + esc(x.topic && x.topic.id) + '" data-plan="' + x.label + '" type="button"><div class="plan-index"><b>' + x.n + '</b><small>' + x.label + '</small></div><h3>' + esc(x.topic ? x.topic.name : '选择一个知识点') + '</h3><p>' + esc(x.copy) + '</p><span class="plan-go">›</span></button>'; }).join('') + '</div>' +
      '<div class="section-row"><div><h2>本周学习</h2><p>稳定的小进步，比一次做很多更重要</p></div></div>' +
      '<div class="insight-grid"><article class="ios-card insight-card"><h3>练习节奏</h3><div class="week-bars">' + week.map(function (x) { return '<div class="week-col"><div class="week-track"><i class="week-fill" style="height:' + Math.max(5,x.count*14) + '%"></i></div><small>' + x.label + '</small></div>'; }).join('') + '</div></article><article class="ios-card insight-card parent-glance"><h3>给家长的一句话</h3><p>' + parentOneLine(stats,picks.main) + '</p><button class="secondary-btn" data-view="parent" type="button">查看陪学建议</button></article></div></section>';
  }
  function weekData() {
    var labels = ['日','一','二','三','四','五','六'], out=[];
    for (var i=6;i>=0;i--) { var d=new Date(Date.now()-i*86400000), key=d.toISOString().slice(0,10); out.push({label:labels[d.getDay()],count:state.history.filter(function(x){return String(x.date).slice(0,10)===key;}).length}); }
    return out;
  }
  function parentOneLine(stats, topic) {
    if (!stats.answered) return '先陪孩子完成一次 5 题小练习，观察他能否说出思路，不急着追求速度。';
    if (stats.weak) return '最近有 ' + stats.weak + ' 个知识点需要巩固。先让孩子讲思路，再做同类题。';
    if (stats.accuracy >= 85) return '状态不错，可以尝试一道稍有变化的拓展题，重点听孩子解释为什么。';
    return '目前重点是稳定基础。今天可围绕「' + (topic ? topic.name : '当前内容') + '」做短时练习。';
  }

  function renderLearn() {
    var topics = sortedTopics(currentTopics());
    var domains = Array.from(new Set(topics.map(function(t){return t.domain;})));
    var filtered = topics.filter(function(t){return (learnDomain==='all'||t.domain===learnDomain) && (!learnSearch || (t.name+t.chapter+t.description).toLowerCase().indexOf(learnSearch.toLowerCase())>=0);});
    var stats = progressStats(topics), groups = {};
    filtered.forEach(function(t){var k=chapterGroup(t);(groups[k]||(groups[k]=[])).push(t);});
    return '<section class="view learn-view">' + viewHead('知识点','按学习顺序，清楚知道现在在哪里、下一步学什么','<button class="secondary-btn" data-action="open-map" type="button">关系图谱</button>') +
      '<div class="filter-bar"><label class="search-box">' + icon('search') + '<input id="knowledge-search" type="search" value="' + esc(learnSearch) + '" placeholder="搜索知识点"></label><div class="filter-chips"><button class="filter-chip ' + (learnDomain==='all'?'active':'') + '" data-domain="all" type="button">全部</button>' + domains.map(function(d){return '<button class="filter-chip ' + (learnDomain===d?'active':'') + '" data-domain="' + esc(d) + '" type="button">' + esc(d) + '</button>';}).join('') + '</div></div>' +
      '<div class="ios-card knowledge-summary"><div class="summary-seg"><strong>' + stats.total + '</strong><span>知识点</span></div><div class="summary-seg"><strong>' + stats.mastered + '</strong><span>已掌握</span></div><div class="summary-seg"><strong>' + stats.learning + '</strong><span>学习中</span></div><div class="summary-seg"><strong>' + stats.weak + '</strong><span>需巩固</span></div></div>' +
      '<div class="knowledge-list">' + (Object.keys(groups).length ? Object.keys(groups).map(function(k){return '<section class="knowledge-group"><div class="knowledge-group-title"><span>' + esc(k) + '</span><span>' + groups[k].length + ' 个</span></div>' + groups[k].map(knowledgeCard).join('') + '</section>';}).join('') : '<div class="ios-card empty-card">没有找到相关知识点</div>') + '</div></section>';
  }
  function chapterGroup(t) {
    return gradeLabel(Number(t.grade))+' · '+String(t.domain||t.chapter||'核心能力');
  }
  function knowledgeCard(t) {
    var s=statusOf(t.id), symbol=s==='mastered'?'✓':s==='weak'?'!':s==='learning'?'•':'○';
    return '<button class="knowledge-card" data-action="show-topic" data-topic="' + esc(t.id) + '" type="button"><span class="status-ring ' + s + '">' + symbol + '</span><span class="knowledge-main"><strong>' + esc(t.name) + '</strong><span>' + esc(t.description||t.chapter) + '</span></span><span class="knowledge-meta"><small class="mini-tag">' + esc(t.domain) + '</small><span class="chevron">›</span></span></button>';
  }

  function renderPractice() {
    var topics=currentTopics(), stats=progressStats(topics), wrongTopics=topics.filter(function(t){return statusOf(t.id)==='weak';}).slice(0,6);
    var modes=[
      {id:'smart',icon:'brain',title:'智能练习',copy:'根据掌握情况安排下一组题',color:'#3478f6',soft:'#eaf2ff',foot:'推荐'},
      {id:'chapter',icon:'book',title:'同步巩固',copy:'围绕当前章节集中练习',color:'#20a77b',soft:'#e7f8f1',foot:gradeLabel(Number(state.grade),state.subject)},
      {id:'wrong',icon:'repeat',title:'错题重练',copy:'只练曾经答错或薄弱的内容',color:'#eb6262',soft:'#fff0ef',foot:wrongTopics.length+' 个待巩固'},
      {id:'challenge',icon:'spark',title:'延伸挑战',copy:'变化题与下一阶段的连接题',color:'#7868e8',soft:'#efedff',foot:'拓展'}
    ];
    return '<section class="view practice-view">' + viewHead('练习中心','少量、及时、针对性练习，比机械刷题更有效','<a class="secondary-btn" href="math.html?v=20261028-4">数学拼豆工坊 ↗</a>') +
      mathGardenCard() +
      '<article class="ios-card practice-hero"><div><h2>准备好了吗？</h2><p>每次只做一小组，做完马上看解析和薄弱点。</p></div><div class="count-stepper" aria-label="题量">' + [5,10,15].map(function(n){return '<button class="' + (state.practiceCount===n?'active':'') + '" data-count="' + n + '" type="button">' + n + '题</button>';}).join('') + '</div></article>' +
      '<div class="section-row"><div><h2>选择练习方式</h2></div></div><div class="mode-grid">' + modes.map(function(m){return '<button class="mode-card" style="--mode-color:' + m.color + ';--mode-soft:' + m.soft + '" data-action="start-mode" data-mode="' + m.id + '" type="button"><span class="mode-icon">' + icon(m.icon) + '</span><h3>' + m.title + '</h3><p>' + m.copy + '</p><div class="mode-foot"><span>' + m.foot + '</span><span>开始 ›</span></div></button>';}).join('') + '</div>' +
      '<div class="section-row"><div><h2>需要再看一眼</h2><p>最近薄弱知识点</p></div></div><div class="wrong-list">' + (wrongTopics.length ? wrongTopics.map(function(t){return '<button class="wrong-item" data-action="show-topic" data-topic="' + esc(t.id) + '" type="button"><i class="wrong-dot"></i><span><strong>' + esc(t.name) + '</strong><span>' + esc(t.domain) + ' · ' + statusLabel(statusOf(t.id)) + '</span></span></button>';}).join('') : '<div class="ios-card empty-card" style="grid-column:1/-1">完成练习后，这里会整理需要再巩固的知识点。</div>') + '</div></section>';
  }

  function renderParent() {
    var topics=currentTopics(), stats=progressStats(topics), byDomain=domainStats(topics), weak=topics.filter(function(t){return statusOf(t.id)==='weak';}).slice(0,4);
    var accuracy=recentAccuracy(7), minutes=Math.max(0,state.history.filter(function(x){return Date.now()-new Date(x.date).getTime()<7*86400000;}).length*2);
    return '<section class="view parent-view">' + viewHead('家长陪学','看趋势、找重点，不用盯着每一道题','<button class="secondary-btn" data-action="settings" type="button">孩子资料</button>') +
      '<article class="ios-card parent-hero"><div class="parent-child"><span class="large-avatar">' + esc((state.child||'小').slice(0,1)) + '</span><div><h2>' + esc(state.child) + '的学习周报</h2><p>' + gradeLabel(Number(state.grade)) + ' · ' + esc(subjectName(state.subject)) + '</p></div></div><div class="parent-score"><div><strong>' + minutes + '</strong><span>本周分钟</span></div><div><strong>' + accuracy + '%</strong><span>本周正确率</span></div><div><strong>' + stats.mastered + '</strong><span>已掌握</span></div></div></article>' +
      '<div class="parent-grid"><article class="ios-card parent-panel"><h3>领域掌握情况</h3><div class="strength-list">' + byDomain.map(function(x){return '<div class="strength-row"><span>' + esc(x.name) + '</span><div class="strength-track"><i style="width:' + x.pct + '%;background:' + x.color + '"></i></div><b>' + x.pct + '%</b></div>';}).join('') + '</div></article><article class="ios-card parent-panel"><h3>本周陪学建议</h3><div class="advice-list">' + parentAdvice(stats,weak).map(function(x,i){return '<div class="advice-item"><i>' + (i+1) + '</i><div><strong>' + esc(x.title) + '</strong><p>' + esc(x.copy) + '</p></div></div>';}).join('') + '</div></article></div>' +
      '<div class="section-row"><div><h2>优先关注</h2><p>从最基础的薄弱点开始</p></div></div><div class="wrong-list">' + (weak.length ? weak.map(function(t){return '<button class="wrong-item" data-action="show-topic" data-topic="' + esc(t.id) + '" type="button"><i class="wrong-dot"></i><span><strong>' + esc(t.name) + '</strong><span>' + esc(t.description) + '</span></span></button>';}).join('') : '<div class="ios-card empty-card" style="grid-column:1/-1">暂时没有明显薄弱点。可以继续保持短时、规律的练习。</div>') + '</div></section>';
  }
  function domainStats(topics) {
    var groups={}; topics.forEach(function(t){(groups[t.domain]||(groups[t.domain]=[])).push(t);});
    var colors=['#3478f6','#20a77b','#7868e8','#f2a33a','#eb6262'];
    return Object.keys(groups).slice(0,6).map(function(k,i){var g=groups[k],done=g.filter(function(t){return statusOf(t.id)==='mastered';}).length;return{name:k,pct:g.length?Math.round(done/g.length*100):0,color:colors[i%colors.length]};});
  }
  function parentAdvice(stats,weak) {
    var out=[];
    if (!stats.answered) out.push({title:'先做一次短练习',copy:'选五道题即可，重点观察孩子是否能说清思路。'});
    if (weak.length) out.push({title:'先讲再练',copy:'围绕「'+weak[0].name+'」请孩子先解释，再做两道同类题。'});
    else out.push({title:'保持节奏',copy:'每天 10–15 分钟，连续学习比一次完成很多更有效。'});
    out.push({title:'鼓励具体过程',copy:'表扬“步骤清楚”“愿意检查”，不要只表扬答对。'});
    out.push({title:'适时停止',copy:'连续两题明显疲劳时就暂停，把成就感留到下一次。'});
    return out.slice(0,3);
  }

  function render() {
    if (!D) return;
    renderRegionSelect(); renderSubjectBar(); renderGradeSelect(); renderCurriculumContext(); updateNavigation();
    app.innerHTML = state.view === 'learn' ? renderLearn() : state.view === 'practice' ? renderPractice() : state.view === 'parent' ? renderParent() : renderHome();
  }
  function toast(msg) { toastNode.textContent=msg; toastNode.classList.add('show'); clearTimeout(toastNode._t); toastNode._t=setTimeout(function(){toastNode.classList.remove('show');},2200); }

  function showTopic(id) {
    var t=D.topicById[id]; if(!t)return;
    var prereq=(D.pre[id]||[]).map(function(x){return D.topicById[x];}).filter(Boolean).slice(0,8);
    var next=(D.next[id]||[]).map(function(x){return D.topicById[x];}).filter(function(x){return x&&availableInRegion(x);}).slice(0,8);
    var related=currentTopics(true).filter(function(x){return x.id!==id&&x.domain===t.domain&&Math.abs(Number(x.grade)-Number(t.grade))<=1;}).slice(0,6);
    var cross=[];(t.crossSubjects||CROSS_SUBJECTS[subjectOf(t)]||[]).forEach(function(s){var x=D.topics.find(function(y){return subjectOf(y)===s&&Number(y.grade)===Number(t.grade)&&y.universal;});if(x)cross.push(x);});
    var p=statusOf(id);
    var tip=t.type==='conceptual'?'请孩子不用背定义，先用自己的话解释，再举一个生活中的例子。':t.type==='procedural'?'让孩子把步骤写出来，并说出每一步为什么这样做。':'请孩子先说思路，再动笔完成。';
    openModal('<div class="modal-head"><strong>知识点</strong><button class="close-btn" data-close-modal type="button">×</button></div><div class="modal-body"><div class="topic-kicker"><span class="mini-tag">' + esc(gradeLabel(Number(t.grade))) + '</span><span class="mini-tag">' + esc(subjectName(subjectOf(t))) + '</span><span class="mini-tag">' + statusLabel(p) + '</span></div><h2 class="topic-title">' + esc(t.name) + '</h2><p class="topic-description">' + esc(t.description) + '</p><div class="mastery-box"><h4>学会的标准</h4><ul>' + (t.mastery_criteria||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('') + '</ul></div>' + relationSection('学之前最好会',prereq) + relationSection('接下来可以学',next) + relationSection('同类概念',related) + relationSection('跨学科连接',cross,true) + '<div class="parent-tip"><b>陪学提示</b><span>' + esc(tip) + '</span></div><div class="modal-actions"><button class="secondary-btn" data-action="mark-mastered" data-topic="' + esc(t.id) + '" type="button">标为已掌握</button><button class="primary-btn" data-action="practice-topic" data-topic="' + esc(t.id) + '" type="button">练习这个知识点</button></div></div>');
  }
  function relationSection(title,items,cross) {
    if(!items||!items.length)return '';
    return '<div class="relation-box"><h4>'+esc(title)+'</h4><div class="relation-chips">'+items.map(function(x){return '<button class="relation-chip '+(cross?'cross':'')+'" data-action="show-topic" data-topic="'+esc(x.id)+'" type="button">'+(cross?'<small>'+esc(subjectName(subjectOf(x)))+'</small>':'')+esc(x.name)+'</button>';}).join('')+'</div></div>';
  }
  function openKnowledgeMap() {
    var topics=sortedTopics(currentTopics()),center=pickLearningTopics().main||topics[0];
    if(!center){toast('这个范围暂时没有知识点');return;}
    var before=(D.pre[center.id]||[]).map(function(id){return D.topicById[id];}).filter(Boolean).slice(0,5);
    var after=(D.next[center.id]||[]).map(function(id){return D.topicById[id];}).filter(function(x){return x&&availableInRegion(x);}).slice(0,5);
    var parallel=topics.filter(function(t){return t.id!==center.id&&t.domain===center.domain;}).slice(0,5);
    openModal('<div class="modal-head"><strong>知识图谱</strong><button class="close-btn" data-close-modal type="button">×</button></div><div class="modal-body graph-body"><div class="graph-intro"><span>'+esc(gradeLabel(Number(state.grade)))+'</span><b>'+esc(subjectName(state.subject))+'</b><small>'+topics.length+' 个知识点 · 点击节点查看</small></div><div class="knowledge-graph"><div class="graph-lane before"><h4>先备</h4>'+graphNodes(before)+'</div><button class="graph-center" data-action="show-topic" data-topic="'+esc(center.id)+'" type="button"><small>当前建议</small><strong>'+esc(center.name)+'</strong><span>'+esc(center.domain)+'</span></button><div class="graph-lane after"><h4>延伸</h4>'+graphNodes(after)+'</div></div><div class="graph-related"><h4>同类连接</h4><div class="relation-chips">'+graphNodes(parallel,true)+'</div></div></div>');
  }
  function graphNodes(items,inline){if(!items.length)return '<span class="graph-empty">从这里开始</span>';return items.map(function(x){return '<button class="graph-node '+(inline?'inline':'')+'" data-action="show-topic" data-topic="'+esc(x.id)+'" type="button">'+esc(x.name)+'</button>';}).join('');}
  function openSettings() {
    openModal('<div class="modal-head"><strong>孩子资料</strong><button class="close-btn" data-close-modal type="button">×</button></div><div class="modal-body"><div class="settings-form"><label class="field-label">称呼<input id="child-name-input" maxlength="8" value="'+esc(state.child)+'"></label><p class="tiny-note">学习记录只保存在当前浏览器，不会上传个人资料。</p><button class="primary-btn" data-action="save-settings" type="button">保存</button></div></div>');
  }
  function openModal(html){modalCard.innerHTML=html;modalLayer.hidden=false;document.body.style.overflow='hidden';}
  function closeModal(){modalLayer.hidden=true;modalCard.innerHTML='';document.body.style.overflow='';quiz=null;}

  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=a[i];a[i]=a[j];a[j]=x;}return a;}
  function startQuiz(mode,topicId){
    var topics=currentTopics(), pool=[];
    if(topicId){pool=(D.questionsByTopic[topicId]||[]).slice();}
    else if(mode==='wrong'){
      var wrongIds=new Set(state.history.filter(function(x){return !x.correct;}).map(function(x){return x.qid;}));
      pool=D.questions.filter(function(q){return wrongIds.has(q.id);});
    }else if(mode==='challenge'){
      var next=SUBJECTS[state.subject].grades.find(function(g){return g>state.grade;});
      var ids=new Set(D.topics.filter(function(t){return subjectOf(t)===state.subject && (Number(t.grade)===Number(next)||Number(t.grade)===Number(state.grade));}).map(function(t){return t.id;}));
      pool=D.questions.filter(function(q){return ids.has(q.topicId)&&(q.difficulty==='advanced'||q.difficulty==='standard');});
    }else{
      var ranked=topics.slice().sort(function(a,b){var r={weak:0,learning:1,new:2,mastered:3};return r[statusOf(a.id)]-r[statusOf(b.id)];});
      var ids2=new Set(ranked.slice(0,Math.max(10,state.practiceCount*2)).map(function(t){return t.id;}));
      pool=D.questions.filter(function(q){return ids2.has(q.topicId);});
      if(mode==='chapter'&&ranked[0]){var ch=chapterGroup(ranked[0]);var chIds=new Set(topics.filter(function(t){return chapterGroup(t)===ch;}).map(function(t){return t.id;}));pool=D.questions.filter(function(q){return chIds.has(q.topicId);});}
    }
    if(!pool.length){pool=D.questions.filter(function(q){var t=D.topicById[q.topicId];return t&&subjectOf(t)===state.subject&&Number(t.grade)===Number(state.grade);});}
    var picked=[],seen=new Set();
    shuffle(pool).forEach(function(q){if(picked.length>=state.practiceCount)return;if(!seen.has(q.topicId)||picked.length>Math.floor(state.practiceCount*.65)){picked.push(q);seen.add(q.topicId);}});
    if(!picked.length){toast('这个范围暂时没有可用题目');return;}
    quiz={mode:mode||'smart',questions:picked,index:0,correct:0,answers:[],selected:null,feedback:null}; renderQuiz();
  }
  function safeFigure(svg){if(typeof svg!=='string'||svg.indexOf('<svg')!==0||/<\s*script|foreignObject|<\s*image\b|https?:\/\//i.test(svg.replace('xmlns="http://www.w3.org/2000/svg"','')))return'';return '<div class="quiz-figure">'+svg+'</div>';}
  function renderQuiz(){
    if(!quiz)return;
    if(quiz.index>=quiz.questions.length){renderQuizResult();return;}
    var q=quiz.questions[quiz.index],t=D.topicById[q.topicId],progress=Math.round(quiz.index/quiz.questions.length*100),feedback=quiz.feedback;
    var input='';
    if(q.type==='choice')input='<div class="choice-list">'+(q.choices||[]).map(function(c){var cls=quiz.selected===c.key?' selected':'';if(feedback)cls+=c.key===q.answer?' correct':quiz.selected===c.key?' wrong':'';return '<button class="choice-option'+cls+'" data-choice="'+esc(c.key)+'" type="button" '+(feedback?'disabled':'')+'><b>'+esc(c.key)+'</b><span>'+esc(c.text)+'</span></button>';}).join('')+'</div>';
    else if(q.type==='self')input='<div class="choice-list"><button class="choice-option" data-self="yes" type="button"><b>✓</b><span>我会，并且能讲清楚</span></button><button class="choice-option" data-self="no" type="button"><b>?</b><span>还不熟，需要再学</span></button></div>';
    else input='<input class="answer-input" id="quiz-answer" autocomplete="off" placeholder="写下答案" '+(feedback?'disabled':'')+'>';
    var fb=feedback?'<div class="feedback '+(feedback.correct?'good':'bad')+'"><b>'+(feedback.correct?'回答正确':'再看一步')+'</b><br>'+esc(q.explanation||('参考答案：'+answerText(q)))+'</div>':'';
    openModal('<div class="quiz-shell"><div class="quiz-progress"><i style="width:'+progress+'%"></i></div><div class="modal-head"><strong>小组练习</strong><button class="close-btn" data-close-modal type="button">×</button></div><div class="modal-body"><div class="quiz-meta"><span class="quiz-topic">'+esc(t?t.name:'知识点')+'</span><span>'+(quiz.index+1)+' / '+quiz.questions.length+'</span></div><h2 class="quiz-prompt">'+esc(q.prompt)+'</h2>'+safeFigure(q.figure)+input+fb+'<div class="quiz-actions">'+(feedback?'<button class="primary-btn" data-action="next-question" type="button">'+(quiz.index+1===quiz.questions.length?'查看结果':'下一题')+'</button>':q.type==='choice'||q.type==='self'?'':'<button class="primary-btn" data-action="submit-answer" type="button">提交答案</button>')+'</div></div></div>');
    if(!feedback&&q.type!=='choice'&&q.type!=='self'){setTimeout(function(){var x=document.getElementById('quiz-answer');if(x)x.focus();},50);}
  }
  function answerText(q){if(q.type==='choice'){var c=(q.choices||[]).find(function(x){return x.key===q.answer;});return c?c.text:q.answer;}return q.answer;}
  function normalize(v){return String(v==null?'':v).trim().toLowerCase().replace(/[，,；;]/g,',').replace(/[（）]/g,function(x){return x==='（'?'(':')';}).replace(/\s+/g,'').replace(/度/g,'°');}
  function isCorrect(q,value){if(q.type==='self')return value==='yes';var a=normalize(q.answer),v=normalize(value);if(v===a)return true;if(q.type==='numeric'){var an=Number(a.replace('%','')),vn=Number(v.replace('%',''));if(isFinite(an)&&isFinite(vn)&&Math.abs(an-vn)<1e-9)return true;}return Array.isArray(q.accept)&&q.accept.some(function(x){return normalize(x)===v;});}
  function recordAnswer(value){
    if(!quiz||quiz.feedback)return;var q=quiz.questions[quiz.index],correct=isCorrect(q,value),p=state.progress[q.topicId]||{attempts:0,correct:0,wrong:0};
    p.attempts++;if(correct)p.correct++;else p.wrong++;p.last=new Date().toISOString();p.mastered=p.attempts>=3&&p.correct/p.attempts>=.8;state.progress[q.topicId]=p;
    state.history.push({qid:q.id,topicId:q.topicId,correct:correct,date:new Date().toISOString()});state.history=state.history.slice(-300);saveState();
    quiz.correct+=correct?1:0;quiz.answers.push({qid:q.id,correct:correct});quiz.feedback={correct:correct};renderQuiz();
  }
  function renderQuizResult(){
    var pct=Math.round(quiz.correct/quiz.questions.length*100),message=pct>=85?'掌握得很稳':pct>=60?'再巩固一次会更稳':'先回到知识点理解，再做一组';
    openModal('<div class="modal-head"><strong>练习完成</strong><button class="close-btn" data-close-modal type="button">×</button></div><div class="modal-body quiz-result"><div class="result-orb" style="--score:'+pct+'%"><strong>'+pct+'%</strong></div><h2>'+message+'</h2><p>每一次订正，都是在把知识连接得更牢。</p><div class="result-stats"><div><strong>'+quiz.questions.length+'</strong><span>完成题数</span></div><div><strong>'+quiz.correct+'</strong><span>答对</span></div><div><strong>'+(quiz.questions.length-quiz.correct)+'</strong><span>待巩固</span></div></div><div class="modal-actions"><button class="secondary-btn" data-close-modal type="button">稍后再练</button><button class="primary-btn" data-action="retry-quiz" data-mode="'+esc(quiz.mode)+'" type="button">再练一组</button></div></div>');
  }

  document.addEventListener('click',function(e){
    var view=e.target.closest('[data-view]');if(view){setView(view.getAttribute('data-view'));return;}
    var subject=e.target.closest('[data-subject]');if(subject){state.subject=subject.getAttribute('data-subject');var gs=SUBJECTS[state.subject].grades;state.grade=gs.indexOf(Number(state.grade))>=0?Number(state.grade):gs[0];saveState();render();return;}
    if(e.target.closest('[data-close-modal]')){closeModal();return;}
    var domain=e.target.closest('[data-domain]');if(domain){learnDomain=domain.getAttribute('data-domain');render();return;}
    var count=e.target.closest('[data-count]');if(count){state.practiceCount=Number(count.getAttribute('data-count'));saveState();render();return;}
    var choice=e.target.closest('[data-choice]');if(choice&&!quiz.feedback){quiz.selected=choice.getAttribute('data-choice');recordAnswer(quiz.selected);return;}
    var self=e.target.closest('[data-self]');if(self&&!quiz.feedback){recordAnswer(self.getAttribute('data-self'));return;}
    var action=e.target.closest('[data-action]');if(!action)return;var a=action.getAttribute('data-action');
    if(a==='show-topic')showTopic(action.getAttribute('data-topic'));
    else if(a==='plan'){var topic=action.getAttribute('data-topic');if(action.getAttribute('data-plan')==='学习')showTopic(topic);else startQuiz(action.getAttribute('data-plan')==='拓展'?'challenge':'smart',topic);}
    else if(a==='start-smart')startQuiz('smart');
    else if(a==='start-mode')startQuiz(action.getAttribute('data-mode'));
    else if(a==='practice-topic'){var tid=action.getAttribute('data-topic');closeModal();startQuiz('topic',tid);}
    else if(a==='mark-mastered'){var id=action.getAttribute('data-topic');state.progress[id]={attempts:3,correct:3,wrong:0,mastered:true,last:new Date().toISOString()};saveState();closeModal();toast('已标记为掌握');render();}
    else if(a==='submit-answer'){var input=document.getElementById('quiz-answer');if(input&&input.value.trim())recordAnswer(input.value);else toast('先写下答案');}
    else if(a==='next-question'){quiz.index++;quiz.selected=null;quiz.feedback=null;renderQuiz();}
    else if(a==='retry-quiz'){var mode=action.getAttribute('data-mode');closeModal();startQuiz(mode);}
    else if(a==='settings')openSettings();
    else if(a==='save-settings'){var name=document.getElementById('child-name-input');if(name&&name.value.trim())state.child=name.value.trim();saveState();closeModal();render();toast('资料已保存');}
    else if(a==='open-map')openKnowledgeMap();
  });
  document.addEventListener('input',function(e){if(e.target.id==='knowledge-search'){learnSearch=e.target.value;clearTimeout(e.target._t);e.target._t=setTimeout(render,120);}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modalLayer.hidden)closeModal();if(e.key==='Enter'&&e.target.id==='quiz-answer'&&quiz&&!quiz.feedback)recordAnswer(e.target.value);});
  gradeSelect.addEventListener('change',function(){state.grade=Number(this.value);saveState();render();});
  regionSelect.addEventListener('change',function(){state.region=this.value;learnDomain='all';saveState();render();});
  profileButton.addEventListener('click',openSettings);
  window.addEventListener('hashchange',function(){state.view=hashView();render();});
  document.querySelectorAll('[data-icon]').forEach(function(n){n.innerHTML=icon(n.getAttribute('data-icon'));});

  Promise.all([WindData.load('topics.json'),WindData.load('questions.json'),WindData.load('dependencies.json')]).then(function(data){
    var foundation=buildFoundationContent(),topics=data[0].concat(foundation.topics),questions=data[1].concat(foundation.questions),deps=data[2].concat(foundation.deps),topicById={},questionsByTopic={},pre={},next={};
    topics.forEach(function(t){topicById[t.id]=t;pre[t.id]=[];next[t.id]=[];});
    questions.forEach(function(q){(questionsByTopic[q.topicId]||(questionsByTopic[q.topicId]=[])).push(q);});
    deps.forEach(function(d){if(pre[d.topicId])pre[d.topicId].push(d.prerequisiteId);if(next[d.prerequisiteId])next[d.prerequisiteId].push(d.topicId);});
    D={topics:topics,questions:questions,deps:deps,topicById:topicById,questionsByTopic:questionsByTopic,pre:pre,next:next};
    state.view=hashView();render();
  }).catch(function(err){app.innerHTML='<div class="ios-card empty-card" style="margin-top:80px"><strong>学习内容暂时没有加载成功</strong><p>请稍后刷新页面。</p></div>';console.error(err);});
})();
