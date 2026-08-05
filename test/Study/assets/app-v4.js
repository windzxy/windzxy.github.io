(() => {
  'use strict';

  const catalog = window.WIND_CATALOG;
  const engine = window.WIND_QUESTIONS;
  const page = document.body.dataset.page || 'home';
  const bodySubject = document.body.dataset.subject || '';
  const bodyStage = document.body.dataset.stage || '';
  const params = new URLSearchParams(location.search);
  const storeKey = 'wind-academy-v4';
  const defaults = {stage:'primary',system:'integrated',stars:0,progress:{},mistakes:[],history:[],lastSubject:'math'};
  let state = load();
  const initialStage = bodyStage || params.get('stage');
  const initialSystem = params.get('system');
  if (catalog.stages[initialStage]) state.stage = initialStage;
  if (catalog.systems[initialSystem]) state.system = initialSystem;
  let activeSession = null;

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storeKey) || '{}');
      return {...defaults,...saved,progress:saved.progress||{},mistakes:saved.mistakes||[],history:saved.history||[]};
    } catch {
      return {...defaults};
    }
  }

  function save() {
    localStorage.setItem(storeKey,JSON.stringify(state));
    renderShellState();
  }

  function esc(value) {
    return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
  }

  function toast(text) {
    const el=document.querySelector('#toast');
    if(!el)return;
    el.textContent=text;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>el.classList.remove('show'),1800);
  }

  function stageName(key){return catalog.stages[key]||key}
  function systemName(key){return catalog.systems[key]||key}
  function subjectData(key){return catalog.subjects[key]}
  function subjectName(key){return subjectData(key)?.name||key}

  function subjectProgress(subject,stage) {
    return Math.max(0,Math.min(100,Number(state.progress?.[subject]?.[stage])||0));
  }

  function setProgress(subject,stage,value) {
    state.progress[subject] ||= {};
    state.progress[subject][stage]=Math.max(0,Math.min(100,value));
  }

  function renderShellState() {
    document.querySelector('#star-count').textContent=state.stars||0;
    document.querySelector('#side-stage').textContent=stageName(state.stage);
    document.querySelector('#side-system').textContent=systemName(state.system);
  }

  function initShell() {
    const navPage=page==='course'?'courses':page;
    document.querySelectorAll('.side-nav a').forEach(link=>link.classList.toggle('active',link.dataset.nav===navPage));
    document.querySelector('#menu-btn')?.addEventListener('click',()=>document.body.classList.toggle('sidebar-open'));
    document.addEventListener('click',event=>{
      if(innerWidth>820)return;
      if(!event.target.closest('#sidebar')&&!event.target.closest('#menu-btn'))document.body.classList.remove('sidebar-open');
    });
    document.querySelector('#quick-practice')?.addEventListener('click',()=>{
      location.href=`practice.html?subject=${encodeURIComponent(state.lastSubject||'math')}&stage=${encodeURIComponent(state.stage)}&autostart=1`;
    });
    renderShellState();
  }

  function setPageTitle(title,sub='') {
    const el=document.querySelector('#page-title');
    el.innerHTML=sub?`<strong>${esc(title)}</strong> <span style="color:#8a94a8;font-size:12px;margin-left:6px">${esc(sub)}</span>`:`<strong>${esc(title)}</strong>`;
    document.title=`${title}｜Wind 学堂`;
  }

  function selectOptions(obj,current) {
    return Object.entries(obj).map(([key,name])=>`<option value="${esc(key)}"${key===current?' selected':''}>${esc(name)}</option>`).join('');
  }

  function subjectOptions(current,allLabel='') {
    const options=Object.entries(catalog.subjects).map(([key,data])=>`<option value="${esc(key)}"${key===current?' selected':''}>${esc(data.name)}</option>`).join('');
    return allLabel?`<option value="">${esc(allLabel)}</option>${options}`:options;
  }

  function recentStats() {
    const list=state.history.slice(-20);
    const total=list.reduce((sum,item)=>sum+item.total,0);
    const correct=list.reduce((sum,item)=>sum+item.correct,0);
    return {sessions:state.history.length,questions:state.history.reduce((sum,item)=>sum+item.total,0),accuracy:total?Math.round(correct/total*100):0};
  }

  function home() {
    setPageTitle('首页',`${stageName(state.stage)} · ${systemName(state.system)}`);
    const app=document.querySelector('#app');
    const stats=recentStats();
    const last=state.history.at(-1);
    const continueSubject=last?.subject||state.lastSubject||'math';
    const data=subjectData(continueSubject);
    app.innerHTML=`
      <section class="dashboard-head">
        <div class="focus-card">
          <span class="kicker">${esc(stageName(state.stage))} · ${esc(systemName(state.system))}</span>
          <h1>${last?'继续 '+esc(subjectName(continueSubject)):'从今天的第一课开始'}</h1>
          <div class="selector-row">
            <select id="home-stage">${selectOptions(catalog.stages,state.stage)}</select>
            <select id="home-system">${selectOptions(catalog.systems,state.system)}</select>
          </div>
          <div class="focus-actions">
            <a class="btn btn-light" href="course.html?subject=${esc(continueSubject)}">进入课程</a>
            <a class="btn btn-soft" href="practice.html?subject=${esc(continueSubject)}&stage=${esc(state.stage)}&autostart=1">随机出题</a>
          </div>
        </div>
        <div class="dashboard-side">
          <div class="metric-card"><strong>${stats.sessions}</strong><span>练习次数</span></div>
          <div class="metric-card"><strong>${stats.accuracy}%</strong><span>近期正确率</span></div>
          <div class="metric-card wide"><strong>${state.mistakes.length}</strong><span>待解决错题</span><a href="mistakes.html" style="margin-top:12px;color:var(--primary);font-size:12px;font-weight:850">打开错题本 →</a></div>
        </div>
      </section>
      <div class="section-bar"><h2>学习闭环</h2><span>预习 · 学习 · 复习 · 巩固 · 提升</span></div>
      <section class="cycle-grid">${catalog.cycles.map(c=>`<a class="cycle-card" href="course.html?subject=${esc(continueSubject)}&cycle=${esc(c.key)}"><b>${esc(c.icon)}</b><strong>${esc(c.name)}</strong><span>${esc(c.action)}</span></a>`).join('')}</section>
      <div id="subject-groups"></div>`;
    document.querySelector('#home-stage').addEventListener('change',event=>{state.stage=event.target.value;save();home()});
    document.querySelector('#home-system').addEventListener('change',event=>{state.system=event.target.value;save();home()});
    renderSubjectGroups(document.querySelector('#subject-groups'),state.stage);
  }

  function renderSubjectGroups(root,stage,filter='') {
    const groups={};
    Object.entries(catalog.subjects).forEach(([key,data])=>{
      if(filter&&!`${data.name}${data.group}`.toLowerCase().includes(filter.toLowerCase()))return;
      groups[data.group] ||= [];
      groups[data.group].push([key,data]);
    });
    root.innerHTML=Object.entries(groups).map(([group,items])=>`
      <section class="group-section">
        <div class="group-title"><h3>${esc(group)}</h3><span>${items.length}科</span></div>
        <div class="subject-grid">${items.map(([key,data])=>{
          const topics=data.stages[stage]||data.stages.primary||[];
          const progress=subjectProgress(key,stage);
          return `<a class="subject-card" style="--accent:${esc(data.accent)}" href="course.html?subject=${esc(key)}">
            <div class="subject-card-top"><span class="subject-icon">${esc(data.icon)}</span><span class="subject-stage">${topics.length}单元</span></div>
            <h3>${esc(data.name)}</h3>
            <p>${topics.slice(0,3).map(t=>t.title).join(' · ')}</p>
            <div class="mini-progress"><div><i style="width:${progress}%"></i></div><b>${progress}%</b></div>
          </a>`;
        }).join('')}</div>
      </section>`).join('');
  }

  function courses() {
    const requested=bodySubject||params.get('subject')||'';
    if(requested&&subjectData(requested))renderCourse(requested);
    else renderCourseCatalog();
  }

  function renderCourseCatalog() {
    setPageTitle('课程',`${stageName(state.stage)} · ${systemName(state.system)}`);
    const app=document.querySelector('#app');
    app.innerHTML=`
      <div class="section-bar" style="margin-top:0"><h2>全部学科</h2><span>${Object.keys(catalog.subjects).length}科</span></div>
      <div class="catalog-toolbar">
        <input id="course-search" type="text" placeholder="搜索学科或领域">
        <select id="course-stage">${selectOptions(catalog.stages,state.stage)}</select>
        <select id="course-system">${selectOptions(catalog.systems,state.system)}</select>
      </div>
      <div id="course-catalog"></div>`;
    const render=()=>renderCatalogCards(document.querySelector('#course-catalog'),document.querySelector('#course-search').value.trim());
    document.querySelector('#course-search').addEventListener('input',render);
    document.querySelector('#course-stage').addEventListener('change',event=>{state.stage=event.target.value;save();render()});
    document.querySelector('#course-system').addEventListener('change',event=>{state.system=event.target.value;save();setPageTitle('课程',`${stageName(state.stage)} · ${systemName(state.system)}`)});
    render();
  }

  function renderCatalogCards(root,filter) {
    const items=Object.entries(catalog.subjects).filter(([,data])=>!filter||`${data.name}${data.group}${Object.values(data.stages).flat().map(t=>t.title).join('')}`.toLowerCase().includes(filter.toLowerCase()));
    root.innerHTML=`<div class="catalog-grid">${items.map(([key,data])=>{
      const topics=data.stages[state.stage]||[];
      return `<a class="catalog-card" href="course.html?subject=${esc(key)}" style="--accent:${esc(data.accent)}">
        <span class="subject-icon">${esc(data.icon)}</span>
        <h3>${esc(data.name)}</h3>
        <p>${topics.map(t=>t.title).slice(0,4).join(' · ')}</p>
        <div class="catalog-meta"><span>${esc(data.group)}</span><span>${topics.length}单元</span><span>${subjectProgress(key,state.stage)}%</span></div>
      </a>`;
    }).join('')}</div>`;
  }

  function renderCourse(subject) {
    const data=subjectData(subject);
    state.lastSubject=subject;
    save();
    const requestedCycle=params.get('cycle')||'preview';
    let cycle=catalog.cycles.some(c=>c.key===requestedCycle)?requestedCycle:'preview';
    setPageTitle(data.name,`${stageName(state.stage)} · ${systemName(state.system)}`);
    const app=document.querySelector('#app');
    app.innerHTML=`
      <section class="course-hero" style="--accent:${esc(data.accent)}">
        <span class="subject-icon">${esc(data.icon)}</span>
        <div><h1>${esc(data.name)}</h1><div class="course-hero-meta"><span>${esc(data.group)}</span><span id="course-stage-label">${esc(stageName(state.stage))}</span><span id="course-system-label">${esc(systemName(state.system))}</span></div></div>
        <a class="btn btn-primary" href="practice.html?subject=${esc(subject)}&stage=${esc(state.stage)}">进入题库</a>
      </section>
      <div class="catalog-toolbar" style="margin-top:18px">
        <select id="subject-stage">${selectOptions(catalog.stages,state.stage)}</select>
        <select id="subject-system">${selectOptions(catalog.systems,state.system)}</select>
      </div>
      <div class="cycle-tabs" id="cycle-tabs">${catalog.cycles.map(c=>`<button type="button" data-cycle="${esc(c.key)}"${c.key===cycle?' class="active"':''}>${esc(c.name)}</button>`).join('')}</div>
      <section class="topic-grid" id="topic-grid"></section>`;
    const renderTopics=()=>{
      const topics=data.stages[state.stage]||[];
      const cycleData=catalog.cycles.find(c=>c.key===cycle);
      document.querySelector('#topic-grid').innerHTML=topics.map((topic,index)=>{
        let title='本单元任务',text=topic.preview;
        if(cycle==='learn'){title='核心知识';text=topic.concepts.join(' · ')}
        if(cycle==='review'){title='复习任务';text=topic.review}
        if(cycle==='consolidate'){title='巩固任务';text='完成本单元随机题，提交后查看得分、错因与解析。'}
        if(cycle==='advance'){title='提升任务';text=topic.challenge}
        return `<article class="topic-card">
          <span class="kicker" style="color:${esc(data.accent)}">单元 ${String(index+1).padStart(2,'0')} · ${esc(cycleData.name)}</span>
          <h3>${esc(topic.title)}</h3>
          <div class="concept-row">${topic.concepts.map(item=>`<span>${esc(item)}</span>`).join('')}</div>
          <div class="task-block"><strong>${esc(title)}</strong><p>${esc(text)}</p></div>
          <div class="topic-actions"><a class="btn btn-soft" href="practice.html?subject=${esc(subject)}&stage=${esc(state.stage)}&topic=${encodeURIComponent(topic.title)}&autostart=1">随机练习</a><button class="btn btn-ghost" type="button" data-complete="${index}">标记完成</button></div>
        </article>`;
      }).join('')||'<div class="empty-state"><div><strong>该阶段内容正在整理</strong></div></div>';
      document.querySelectorAll('[data-complete]').forEach(button=>button.addEventListener('click',()=>{
        setProgress(subject,state.stage,subjectProgress(subject,state.stage)+5);
        save();
        toast('进度已更新');
      }));
    };
    document.querySelector('#subject-stage').addEventListener('change',event=>{state.stage=event.target.value;save();document.querySelector('#course-stage-label').textContent=stageName(state.stage);renderTopics()});
    document.querySelector('#subject-system').addEventListener('change',event=>{state.system=event.target.value;save();document.querySelector('#course-system-label').textContent=systemName(state.system)});
    document.querySelectorAll('[data-cycle]').forEach(button=>button.addEventListener('click',()=>{
      cycle=button.dataset.cycle;
      document.querySelectorAll('[data-cycle]').forEach(el=>el.classList.toggle('active',el===button));
      renderTopics();
    }));
    renderTopics();
  }

  function practice() {
    setPageTitle('题库','随机出题 · 在线评分 · PDF');
    const app=document.querySelector('#app');
    const currentSubject=params.get('subject')||state.lastSubject||'math';
    const currentStage=params.get('stage')||state.stage;
    const currentSystem=params.get('system')||state.system;
    const mode=params.get('mode')||'practice';
    app.innerHTML=`
      <section class="filter-panel">
        <div class="filter-grid">
          <div class="field"><label>学科</label><select id="q-subject">${subjectOptions(currentSubject)}</select></div>
          <div class="field"><label>学段</label><select id="q-stage">${selectOptions(catalog.stages,currentStage)}</select></div>
          <div class="field"><label>课程体系</label><select id="q-system">${selectOptions(catalog.systems,currentSystem)}</select></div>
          <div class="field"><label>难度</label><select id="q-difficulty"><option value="1">基础</option><option value="2" selected>常规</option><option value="3">进阶</option><option value="4">挑战</option><option value="5">竞赛</option></select></div>
          <div class="field"><label>题量</label><select id="q-count"><option>5</option><option selected>10</option><option>20</option><option>30</option><option>50</option></select></div>
          <div class="field"><label>模式</label><select id="q-mode"><option value="practice"${mode==='practice'?' selected':''}>在线练习</option><option value="test"${mode==='test'?' selected':''}>模拟测试</option><option value="worksheet"${mode==='worksheet'?' selected':''}>打印练习</option><option value="mistakes"${mode==='mistakes'?' selected':''}>错题重练</option></select></div>
        </div>
        <div class="filter-actions"><button class="btn btn-primary" id="generate-btn" type="button">自动出题</button><button class="btn btn-soft" id="random-btn" type="button">随机配置</button><button class="btn btn-ghost" id="pdf-btn" type="button">导出 PDF</button><label style="display:flex;align-items:center;gap:7px;font-size:12px;color:var(--muted)"><input id="print-answers" type="checkbox">附答案解析</label></div>
      </section>
      <div class="print-header"><h1 id="print-title">Wind 学堂练习题</h1><div class="print-meta"><span>姓名：____________</span><span>日期：____________</span><span>得分：____________</span></div></div>
      <section id="practice-area"><div class="empty-state"><div><strong>设置题目后开始</strong><p>可在线作答，也可导出 PDF。</p><button class="btn btn-primary" id="empty-generate" type="button">生成题目</button></div></div></section>`;
    document.querySelector('#generate-btn').addEventListener('click',generateSession);
    document.querySelector('#empty-generate').addEventListener('click',generateSession);
    document.querySelector('#random-btn').addEventListener('click',()=>{
      const keys=Object.keys(catalog.subjects);
      document.querySelector('#q-subject').value=keys[Math.floor(Math.random()*keys.length)];
      document.querySelector('#q-stage').value=Object.keys(catalog.stages)[Math.floor(Math.random()*Object.keys(catalog.stages).length)];
      document.querySelector('#q-difficulty').value=String(1+Math.floor(Math.random()*5));
      generateSession();
    });
    document.querySelector('#pdf-btn').addEventListener('click',()=>{
      if(!activeSession)generateSession();
      document.body.classList.toggle('print-answers',document.querySelector('#print-answers').checked);
      window.print();
    });
    if(params.get('autostart')==='1'||mode==='mistakes')generateSession();
  }

  function getPracticeConfig() {
    return {
      subject:document.querySelector('#q-subject').value,
      stage:document.querySelector('#q-stage').value,
      system:document.querySelector('#q-system').value,
      difficulty:Number(document.querySelector('#q-difficulty').value),
      count:Number(document.querySelector('#q-count').value),
      mode:document.querySelector('#q-mode').value
    };
  }

  function generateSession() {
    const config=getPracticeConfig();
    state.stage=config.stage;
    state.system=config.system;
    state.lastSubject=config.subject;
    save();
    let questions;
    if(config.mode==='mistakes') {
      questions=state.mistakes.filter(q=>!config.subject||q.subject===config.subject).slice(0,config.count).map(q=>({...q,id:`retry-${Date.now()}-${Math.random()}`}));
      if(!questions.length){toast('当前没有可重练的错题');return}
    } else {
      questions=engine.generate(config);
    }
    activeSession={...config,questions,answers:{},submitted:false,startedAt:Date.now()};
    document.querySelector('#print-title').textContent=`${subjectName(config.subject)} · ${stageName(config.stage)} · ${questions.length}题`;
    renderSession();
  }

  function renderSession() {
    const area=document.querySelector('#practice-area');
    const s=activeSession;
    area.innerHTML=`
      <div class="session-head"><div><h2>${esc(subjectName(s.subject))} · ${esc(stageName(s.stage))}</h2><span style="color:var(--muted);font-size:12px">${s.questions.length}题 · ${esc(systemName(s.system))}</span></div><div class="session-head-actions"><button class="btn btn-ghost" id="new-set" type="button">换一套</button></div></div>
      <div class="question-list">${s.questions.map((q,index)=>renderQuestion(q,index)).join('')}</div>
      <div class="result-card"><div><strong id="score-number">未提交</strong><span id="score-text">完成后统一评分</span></div><button class="btn btn-primary" id="submit-session" type="button">提交并评分</button></div>`;
    document.querySelector('#new-set').addEventListener('click',generateSession);
    document.querySelector('#submit-session').addEventListener('click',submitSession);
    document.querySelectorAll('[data-q-index]').forEach(card=>bindQuestion(card,Number(card.dataset.qIndex)));
  }

  function renderQuestion(q,index) {
    const tags=[...q.tags,`难度${q.difficulty}`].filter(Boolean);
    const answer=q.type==='choice'?`<div class="options">${q.options.map(option=>`<label class="option"><input type="radio" name="q-${index}" value="${esc(option)}"><span>${esc(option)}</span></label>`).join('')}</div>`:`<input class="answer-input" type="text" placeholder="输入答案">`;
    return `<article class="question-card" data-q-index="${index}">
      <div class="question-title"><h3>${esc(q.prompt)}</h3></div>
      <div class="question-tags">${tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div>
      ${answer}
      <div class="question-tools"><button class="text-btn" type="button" data-hint>提示</button><button class="text-btn" type="button" data-explain>解惑</button></div>
      <div class="explain-box" data-hint-box><strong>提示：</strong>${esc(q.hint)}</div>
      <div class="explain-box" data-explain-box><strong>解析：</strong>${esc(q.explanation)}<br><strong>答案：</strong>${esc(q.answer)}</div>
    </article>`;
  }

  function bindQuestion(card,index) {
    const q=activeSession.questions[index];
    card.querySelector('[data-hint]').addEventListener('click',()=>card.querySelector('[data-hint-box]').classList.toggle('show'));
    card.querySelector('[data-explain]').addEventListener('click',()=>card.querySelector('[data-explain-box]').classList.toggle('show'));
    if(q.type==='choice')card.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener('change',()=>{activeSession.answers[index]=input.value}));
    else card.querySelector('.answer-input').addEventListener('input',event=>{activeSession.answers[index]=event.target.value});
  }

  function comparable(value) {
    return String(value??'').trim().toLowerCase().replace(/\s+/g,'');
  }

  function correctAnswer(given,expected) {
    const a=comparable(given),b=comparable(expected);
    if(a===b)return true;
    const fraction=value=>{
      const m=value.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
      return m?Number(m[1])/Number(m[2]):Number(value);
    };
    const na=fraction(a),nb=fraction(b);
    return Number.isFinite(na)&&Number.isFinite(nb)&&Math.abs(na-nb)<1e-8;
  }

  function submitSession() {
    if(!activeSession||activeSession.submitted)return;
    let correct=0;
    const wrong=[];
    activeSession.questions.forEach((q,index)=>{
      const card=document.querySelector(`[data-q-index="${index}"]`);
      const given=activeSession.answers[index]??'';
      const good=correctAnswer(given,q.answer);
      if(good)correct+=1;
      else wrong.push({...q,userAnswer:String(given),wrongAt:new Date().toISOString()});
      card.classList.add(good?'answered-correct':'answered-wrong');
      card.querySelector('[data-explain-box]').classList.add('show');
      if(q.type==='choice')card.querySelectorAll('.option').forEach(option=>{
        const value=option.querySelector('input').value;
        if(correctAnswer(value,q.answer))option.classList.add('correct');
        if(option.querySelector('input').checked&&!correctAnswer(value,q.answer))option.classList.add('wrong');
        option.querySelector('input').disabled=true;
      });
      else {
        const input=card.querySelector('.answer-input');
        input.disabled=true;
        input.style.borderColor=good?'#72c9aa':'#ef9cab';
      }
    });
    const total=activeSession.questions.length;
    const score=Math.round(correct/total*100);
    activeSession.submitted=true;
    state.stars+=(correct*2);
    state.mistakes=mergeMistakes(state.mistakes,wrong).slice(-300);
    setProgress(activeSession.subject,activeSession.stage,subjectProgress(activeSession.subject,activeSession.stage)+Math.max(2,Math.round(score/12)));
    state.history.push({id:Date.now(),date:new Date().toISOString(),subject:activeSession.subject,stage:activeSession.stage,system:activeSession.system,difficulty:activeSession.difficulty,total,correct,score,duration:Math.round((Date.now()-activeSession.startedAt)/1000)});
    state.history=state.history.slice(-200);
    save();
    document.querySelector('#score-number').textContent=`${score}分`;
    document.querySelector('#score-text').textContent=`答对 ${correct}/${total} · 错题 ${wrong.length}`;
    document.querySelector('#submit-session').textContent='已完成';
    document.querySelector('#submit-session').disabled=true;
    toast(score>=90?'表现优秀':score>=70?'继续巩固':'建议查看解析并重练');
  }

  function mergeMistakes(existing,incoming) {
    const map=new Map(existing.map(item=>[`${item.subject}|${item.prompt}`,item]));
    incoming.forEach(item=>map.set(`${item.subject}|${item.prompt}`,item));
    return [...map.values()];
  }

  function mistakes() {
    setPageTitle('错题','本机保存');
    const app=document.querySelector('#app');
    app.innerHTML=`
      <div class="catalog-toolbar"><select id="mistake-subject"><option value="">全部学科</option>${subjectOptions('')}</select><button class="btn btn-primary" id="retry-mistakes" type="button">随机重练</button><button class="btn btn-danger" id="clear-mistakes" type="button">清空</button></div>
      <div id="mistake-content"></div>`;
    const render=()=>renderMistakeList(document.querySelector('#mistake-subject').value);
    document.querySelector('#mistake-subject').addEventListener('change',render);
    document.querySelector('#retry-mistakes').addEventListener('click',()=>{
      const subject=document.querySelector('#mistake-subject').value||state.mistakes[0]?.subject||'math';
      location.href=`practice.html?mode=mistakes&subject=${encodeURIComponent(subject)}&autostart=1`;
    });
    document.querySelector('#clear-mistakes').addEventListener('click',()=>{
      if(confirm('清空全部错题？')){state.mistakes=[];save();render()}
    });
    render();
  }

  function renderMistakeList(filter) {
    const root=document.querySelector('#mistake-content');
    const list=state.mistakes.filter(item=>!filter||item.subject===filter).reverse();
    if(!list.length){root.innerHTML='<div class="empty-state"><div><strong>暂无错题</strong><p>题库提交后，错题会自动保存。</p><a class="btn btn-primary" href="practice.html">开始练习</a></div></div>';return}
    root.innerHTML=`<div class="mistake-list">${list.map((item,index)=>`<article class="mistake-item" data-mistake="${index}"><h3>${esc(item.prompt)}</h3><p>${esc(subjectName(item.subject))} · ${esc(stageName(item.stage))}</p><p><strong>你的答案：</strong>${esc(item.userAnswer||'未作答')}</p><p><strong>正确答案：</strong>${esc(item.answer)}</p><p><strong>解析：</strong>${esc(item.explanation)}</p><div class="mistake-actions"><a class="btn btn-soft" href="practice.html?mode=mistakes&subject=${esc(item.subject)}&autostart=1">重练</a><button class="btn btn-ghost" type="button" data-remove-key="${esc(item.subject+'|'+item.prompt)}">移除</button></div></article>`).join('')}</div>`;
    root.querySelectorAll('[data-remove-key]').forEach(button=>button.addEventListener('click',()=>{
      const key=button.dataset.removeKey;
      state.mistakes=state.mistakes.filter(item=>`${item.subject}|${item.prompt}`!==key);
      save();
      renderMistakeList(filter);
    }));
  }

  function progress() {
    setPageTitle('进度','练习记录与正确率');
    const app=document.querySelector('#app');
    const reports=Object.entries(catalog.subjects).map(([key,data])=>{
      const history=state.history.filter(item=>item.subject===key);
      const total=history.reduce((sum,item)=>sum+item.total,0);
      const correct=history.reduce((sum,item)=>sum+item.correct,0);
      const accuracy=total?Math.round(correct/total*100):0;
      const progress=subjectProgress(key,state.stage);
      return {key,data,total,correct,accuracy,progress,sessions:history.length};
    });
    app.innerHTML=`
      <div class="catalog-toolbar"><select id="progress-stage">${selectOptions(catalog.stages,state.stage)}</select><button class="btn btn-danger" id="reset-progress" type="button">重置记录</button></div>
      <section class="progress-grid" id="progress-grid">${reports.map(r=>`<article class="report-card"><div class="report-head"><strong>${esc(r.data.name)}</strong><span>${r.sessions}次</span></div><div class="report-bar"><i style="width:${r.progress}%"></i></div><div class="report-meta"><div><b>${r.accuracy}%</b><span>正确率</span></div><div><b>${r.total}</b><span>完成题数</span></div></div></article>`).join('')}</section>
      <div class="section-bar"><h2>最近记录</h2><span>${state.history.length}次</span></div>
      ${historyTable()}`;
    document.querySelector('#progress-stage').addEventListener('change',event=>{state.stage=event.target.value;save();progress()});
    document.querySelector('#reset-progress').addEventListener('click',()=>{
      if(confirm('重置进度、错题和练习记录？')){state={...defaults,progress:{},mistakes:[],history:[]};save();progress()}
    });
  }

  function historyTable() {
    const rows=state.history.slice(-20).reverse();
    if(!rows.length)return '<div class="empty-state"><div><strong>暂无练习记录</strong><p>完成一次题库练习后显示。</p></div></div>';
    return `<table class="history-table"><thead><tr><th>日期</th><th>学科</th><th>学段</th><th>得分</th><th>题量</th></tr></thead><tbody>${rows.map(item=>`<tr><td>${new Date(item.date).toLocaleDateString('zh-CN')}</td><td>${esc(subjectName(item.subject))}</td><td>${esc(stageName(item.stage))}</td><td>${item.score}</td><td>${item.total}</td></tr>`).join('')}</tbody></table>`;
  }

  initShell();
  if(page==='home')home();
  if(page==='courses'||page==='course')courses();
  if(page==='practice')practice();
  if(page==='mistakes')mistakes();
  if(page==='progress')progress();
})();
