(() => {
  'use strict';

  const V9 = window.WIND_GUIDED_V9;
  if (!V9) return;

  V9.renderCoursePath = () => {
    const legacy=document.querySelector('#deep-course-v6');
    if (!legacy) return false;
    V9.injectCss();
    document.body.classList.add('v9-guided-ready');
    const titles=V9.currentLessonTitles();
    if (!titles.length) return false;
    let root=document.querySelector('#guided-path-v9');
    if (!root) {
      root=document.createElement('section');
      root.id='guided-path-v9';
      legacy.before(root);
    }
    const summary=V9.courseSummary(titles);
    const recommended=V9.recommendedIndex(titles);
    const recommendedTitle=titles[recommended];
    const recommendedRecord=V9.lessonRecord(recommendedTitle);
    const stageLabel=document.querySelector('#subject-stage option:checked')?.textContent||V9.stage();
    root.innerHTML=`<section class="v9-course-overview">
      <div class="v9-course-copy">
        <span class="v9-eyebrow">${V9.esc(stageLabel)} · 引导式学习</span>
        <h1>${V9.esc(V9.SUBJECT_NAMES[V9.subject()]||V9.subject())}</h1>
        <p>短课学习、即时反馈、主动回忆和间隔复习组成一条连续路径。每次集中完成一项任务，不再一次塞入整页材料。</p>
        <div class="v9-course-actions">
          <button class="v9-primary" id="v9-start-recommended" type="button">${V9.due(recommendedRecord)?'开始复习':'继续下一课'}</button>
          <button class="v9-secondary" id="v9-toggle-textbook" type="button">查看完整教材</button>
          <a class="v9-secondary" href="practice.html?subject=${encodeURIComponent(V9.subject())}&stage=${encodeURIComponent(V9.stage())}&autostart=1">专项练习</a>
        </div>
      </div>
      <div class="v9-course-metrics">
        <article><strong>${summary.progress}%</strong><span>课程掌握度</span></article>
        <article><strong>${summary.mastered}/${titles.length}</strong><span>已掌握课程</span></article>
        <article><strong>${summary.due}</strong><span>待复习</span></article>
        <article><strong data-v9-streak>${V9.state.streak}</strong><span>连续学习天数</span></article>
      </div>
    </section>
    <section class="v9-daily-strip">
      <div><span>今日目标</span><strong data-v9-daily>${Math.min(V9.state.daily.xp,V9.state.dailyGoal)}/${V9.state.dailyGoal}</strong></div>
      <div class="v9-goal-track"><i data-v9-daily-bar style="width:${V9.clamp(V9.state.daily.xp/V9.state.dailyGoal*100,0,100)}%"></i></div>
      <div class="v9-daily-meta"><span>总经验 <b data-v9-xp>${V9.state.xp}</b></span><span>${summary.due?`先复习 ${summary.due} 课`:'学习一课，再做一次主动回忆'}</span></div>
    </section>
    <div class="v9-path-layout">
      <aside class="v9-path-panel">
        <header><div><span>课程地图</span><h2>一步一步掌握</h2></div><select id="v9-path-filter"><option value="all">全部</option><option value="due">待复习</option><option value="learning">学习中</option><option value="new">新课</option><option value="mastered">已掌握</option></select></header>
        <div class="v9-path-list" id="v9-path-list">${titles.map((title,index)=>{
          const record=V9.lessonRecord(title);
          const status=V9.pathStatus(record);
          const filterStatus=record.mastery>=3&&!V9.due(record)?'mastered':status.className;
          return `<button class="v9-path-node ${status.className} ${index===recommended?'recommended':''}" type="button" data-v9-index="${index}" data-v9-status="${filterStatus}">
            <span class="v9-node-orbit"><b>${status.icon}</b></span>
            <span class="v9-node-copy"><small>第 ${String(index+1).padStart(2,'0')} 课 · ${status.label}</small><strong>${V9.esc(title)}</strong><i><em style="width:${record.mastery*20}%"></em></i></span>
            <span class="v9-node-score">${record.mastery}/5</span>
          </button>`;
        }).join('')}</div>
      </aside>
      <section class="v9-next-card">
        <span class="v9-eyebrow">${V9.due(recommendedRecord)?'到期复习':'智能推荐'}</span>
        <h2>${V9.esc(recommendedTitle)}</h2>
        <p>${recommendedRecord.mastery?`上次掌握度为 ${recommendedRecord.mastery}/5，本次将优先练习较薄弱的环节。`:'先了解目标与完整材料，再通过互动任务和主动回忆完成第一轮掌握。'}</p>
        <div class="v9-next-checklist"><span>约 6–10 分钟</span><span>完整材料</span><span>互动检查</span><span>自动安排复习</span></div>
        <button class="v9-primary v9-wide" id="v9-next-start" type="button">${V9.due(recommendedRecord)?'开始复习':'开始引导学习'}</button>
        <button class="v9-text-action" id="v9-quick-review" type="button">只做 3 分钟快速回忆</button>
      </section>
    </div>`;
    root.querySelector('#v9-start-recommended').onclick=()=>V9.startSession(recommended,'learn');
    root.querySelector('#v9-next-start').onclick=()=>V9.startSession(recommended,'learn');
    root.querySelector('#v9-quick-review').onclick=()=>V9.startSession(recommended,'review');
    root.querySelector('#v9-toggle-textbook').onclick=event=>{
      document.body.classList.toggle('v9-show-textbook');
      event.currentTarget.textContent=document.body.classList.contains('v9-show-textbook')?'收起完整教材':'查看完整教材';
      if (document.body.classList.contains('v9-show-textbook')) legacy.scrollIntoView({behavior:'smooth',block:'start'});
    };
    root.querySelectorAll('[data-v9-index]').forEach(button=>button.onclick=()=>V9.startSession(Number(button.dataset.v9Index),'learn'));
    root.querySelector('#v9-path-filter').onchange=event=>{
      const value=event.target.value;
      root.querySelectorAll('[data-v9-status]').forEach(button=>{button.hidden=value!=='all'&&button.dataset.v9Status!==value;});
    };
    setTimeout(V9.wrapLibraries,250);
    setTimeout(V9.wrapLibraries,1000);
    V9.updateTopStats();
    return true;
  };

  V9.mountHomeMission = () => {
    if (document.body.dataset.page!=='home'||document.querySelector('#v9-home-mission')) return false;
    const anchor=document.querySelector('.dashboard-head');
    if (!anchor) return false;
    V9.injectCss();
    const academy=V9.academyState();
    const lastSubject=academy.lastSubject||'math';
    const dueLessons=Object.entries(V9.state.lessons).filter(([,record])=>V9.due(record));
    const dueSubject=dueLessons[0]?.[0]?.split('|')[0];
    const target=dueSubject||lastSubject;
    const root=document.createElement('section');
    root.id='v9-home-mission';
    const week=V9.weeklyActivity();
    root.innerHTML=`<header><div><span>今日学习计划</span><h2>${dueLessons.length?`先完成 ${dueLessons.length} 项到期复习`:'完成一节短课，建立连续进步'}</h2></div><div class="v9-home-stats"><span>🔥 <b data-v9-streak>${V9.state.streak}</b> 天</span><span>⚡ <b data-v9-xp>${V9.state.xp}</b> XP</span></div></header>
      <div class="v9-home-grid">
        <article class="v9-home-main">
          <div class="v9-home-progress"><span>今日目标 <b data-v9-daily>${Math.min(V9.state.daily.xp,V9.state.dailyGoal)}/${V9.state.dailyGoal}</b></span><div><i data-v9-daily-bar style="width:${V9.clamp(V9.state.daily.xp/V9.state.dailyGoal*100,0,100)}%"></i></div></div>
          <h3>${dueLessons.length?'复习会优先安排较薄弱的课程':'下一步：进入一节引导式课程'}</h3>
          <p>完整材料 → 分块讲解 → 互动检查 → 主动回忆 → 间隔复习。</p>
          <a class="v9-primary" href="${V9.courseHref(target,true)}">${dueLessons.length?'开始今日复习':'开始今日课程'}</a>
        </article>
        <article class="v9-week-card">
          <span>近 7 天</span>
          <div class="v9-week-bars">${week.map(day=>`<div><i style="height:${day.count?Math.min(100,28+day.count*18):8}%"></i><small>${V9.esc(day.label)}</small></div>`).join('')}</div>
        </article>
        <article class="v9-home-review">
          <span>复习队列</span><strong>${V9.dueCount()}</strong><p>到期课程会自动排到学习路径前面。</p>
          <a href="${V9.courseHref(target,false)}">查看课程地图</a>
        </article>
      </div>`;
    anchor.after(root);
    V9.updateTopStats();
    return true;
  };

  V9.mount = () => {
    V9.ensureDaily();
    V9.injectCss();
    V9.mountHomeMission();
    const page=document.body.dataset.page;
    const isCoursePage=page==='course'||(page==='courses'&&new URLSearchParams(location.search).has('subject'));
    if (!isCoursePage) return;
    if (!V9.renderCoursePath()) {
      const observer=new MutationObserver(()=>{
        if (V9.renderCoursePath()) observer.disconnect();
      });
      observer.observe(document.body,{childList:true,subtree:true});
      setTimeout(()=>observer.disconnect(),18000);
    }
    const bindStage=()=>{
      const select=document.querySelector('#subject-stage');
      if (!select||select.dataset.v9Bound) return;
      select.dataset.v9Bound='1';
      select.addEventListener('change',()=>{
        setTimeout(()=>{
          document.querySelector('#guided-path-v9')?.remove();
          V9.renderCoursePath();
        },120);
      });
    };
    bindStage();
    const stageObserver=new MutationObserver(bindStage);
    stageObserver.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>stageObserver.disconnect(),12000);
    if (new URLSearchParams(location.search).get('guided')==='1') {
      const auto=setInterval(()=>{
        if (document.querySelector('#guided-path-v9')) {
          clearInterval(auto);
          const titles=V9.currentLessonTitles();
          V9.startSession(V9.recommendedIndex(titles),'learn');
        }
      },120);
      setTimeout(()=>clearInterval(auto),15000);
    }
  };

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',V9.mount,{once:true});
  else V9.mount();
})();
