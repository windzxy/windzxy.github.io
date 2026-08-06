(() => {
  'use strict';

  const packs=window.WIND_CONTENT_PACKS_V10;
  if(!packs)return;
  const STORE='wind-content-library-v10';
  const page=document.body.dataset.page||'';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const load=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}};
  const state={completed:{},saved:{},...load()};
  let resourceCatalog=null;
  let libraryLimit=36;
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
  const stage=()=>document.querySelector('#subject-stage')?.value||new URLSearchParams(location.search).get('stage')||document.body.dataset.stage||'primary';
  const subject=()=>document.body.dataset.subject||new URLSearchParams(location.search).get('subject')||'';
  const injectCss=()=>{
    if(document.querySelector('link[data-content-v10]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/content-hub-v10.css?v=20260806-1';
    link.dataset.contentV10='1';
    document.head.append(link);
  };
  const injectNav=()=>{
    const nav=document.querySelector('.side-nav');
    if(!nav||nav.querySelector('[data-nav="library"]'))return;
    const link=document.createElement('a');
    link.dataset.nav='library';
    link.href='library.html';
    link.innerHTML='<b>▤</b><span>资料库</span>';
    const practice=nav.querySelector('[data-nav="practice"]');
    nav.insertBefore(link,practice||null);
    link.classList.toggle('active',page==='library');
  };
  const progress=unit=>Boolean(state.completed[unit.id]);
  const saved=unit=>Boolean(state.saved[unit.id]);
  const courseHref=unit=>{
    const direct=new Set(['chinese','math','english','cantonese','japanese','korean']);
    return direct.has(unit.subject)?`${unit.subject}.html?stage=${encodeURIComponent(unit.stage)}`:`course.html?subject=${encodeURIComponent(unit.subject)}&stage=${encodeURIComponent(unit.stage)}`;
  };
  const unitCard=unit=>`<article class="v10-unit-card ${progress(unit)?'completed':''}" data-v10-unit="${esc(unit.id)}">
    <div class="v10-unit-top"><span>${esc(unit.stageName)} · ${esc(unit.modeName)}</span><button type="button" data-v10-save="${esc(unit.id)}" aria-label="收藏">${saved(unit)?'★':'☆'}</button></div>
    <h3>${esc(unit.topic)}</h3>
    <p>${esc(unit.objective)}</p>
    <div class="v10-unit-meta"><span>${esc(unit.duration)}</span><span>${progress(unit)?'已完成':'未完成'}</span></div>
    <button class="v10-open-unit" type="button" data-v10-open="${esc(unit.id)}">${progress(unit)?'再次学习':'打开课程'}</button>
  </article>`;
  const renderUnitModal=unit=>{
    document.querySelector('#v10-unit-modal')?.remove();
    const modal=document.createElement('div');
    modal.id='v10-unit-modal';
    modal.innerHTML=`<div class="v10-modal-backdrop" data-v10-close></div><section class="v10-modal-panel" role="dialog" aria-modal="true">
      <header><div><span>${esc(unit.subjectName)} · ${esc(unit.stageName)} · ${esc(unit.modeName)}</span><h1>${esc(unit.topic)}</h1><p>${esc(unit.objective)}</p></div><button type="button" data-v10-close>×</button></header>
      <main>
        <article class="v10-lesson-block"><h2>学习路线</h2><p>${esc(unit.overview)}</p><p>${esc(unit.approach)}</p></article>
        <article class="v10-lesson-block"><h2>核心要点</h2><ol>${unit.keyPoints.map(item=>`<li>${esc(item)}</li>`).join('')}</ol></article>
        <article class="v10-lesson-block"><h2>完整示例</h2><p>${esc(unit.example)}</p></article>
        <article class="v10-lesson-block"><h2>本课任务</h2><ol>${unit.tasks.map(item=>`<li>${esc(item)}</li>`).join('')}</ol></article>
        <article class="v10-lesson-block"><h2>主动回忆与复习</h2><ul>${unit.review.map(item=>`<li>${esc(item)}</li>`).join('')}</ul><strong>${esc(unit.challenge)}</strong></article>
      </main>
      <footer><a href="${esc(courseHref(unit))}">进入学科课程</a><a href="practice.html?subject=${encodeURIComponent(unit.subject)}&stage=${encodeURIComponent(unit.stage)}&autostart=1">做专项练习</a><button class="primary" type="button" data-v10-complete="${esc(unit.id)}">${progress(unit)?'取消完成':'标记完成'}</button></footer>
    </section>`;
    document.body.append(modal);
    modal.querySelectorAll('[data-v10-close]').forEach(button=>button.onclick=()=>modal.remove());
    modal.querySelector('[data-v10-complete]').onclick=event=>{
      if(progress(unit))delete state.completed[unit.id];
      else state.completed[unit.id]={at:new Date().toISOString()};
      save();
      event.currentTarget.textContent=progress(unit)?'取消完成':'标记完成';
      document.querySelectorAll(`[data-v10-unit="${CSS.escape(unit.id)}"]`).forEach(card=>card.classList.toggle('completed',progress(unit)));
    };
  };
  const bindUnitEvents=root=>{
    root.querySelectorAll('[data-v10-open]').forEach(button=>button.onclick=()=>renderUnitModal(packs.get(button.dataset.v10Open)));
    root.querySelectorAll('[data-v10-save]').forEach(button=>button.onclick=event=>{
      event.stopPropagation();
      const id=button.dataset.v10Save;
      if(state.saved[id])delete state.saved[id];else state.saved[id]=true;
      save();
      button.textContent=state.saved[id]?'★':'☆';
    });
  };

  const mountHome=()=>{
    if(page!=='home'||document.querySelector('#v10-home-library'))return;
    const anchor=document.querySelector('#v9-home-mission')||document.querySelector('.dashboard-head');
    if(!anchor)return;
    const root=document.createElement('section');
    root.id='v10-home-library';
    const completed=Object.keys(state.completed).length;
    root.innerHTML=`<div><span>海量课程库</span><h2>${packs.total.toLocaleString('zh-CN')} 个结构化学习单元</h2><p>覆盖15个学科、5个阶段，并连接持续更新的开放学习资源。课程按需加载，不会一次把全部内容塞进页面。</p></div><div><strong>${completed}</strong><span>已完成单元</span><a href="library.html">进入资料库</a></div>`;
    anchor.after(root);
  };

  const mountCourseLibrary=()=>{
    const isCourse=page==='course'||(page==='courses'&&new URLSearchParams(location.search).has('subject'));
    if(!isCourse||document.querySelector('#v10-course-library'))return false;
    const anchor=document.querySelector('#guided-path-v9')||document.querySelector('#deep-course-v6');
    if(!anchor)return false;
    const subjectKey=subject();
    const stageKey=stage();
    const all=packs.list({subject:subjectKey,stage:stageKey});
    if(!all.length)return false;
    const root=document.createElement('section');
    root.id='v10-course-library';
    let limit=18;
    const render=()=>{
      const completed=all.filter(progress).length;
      root.innerHTML=`<header><div><span>扩展课程包</span><h2>${esc(packs.subjects[subjectKey]?.name||subjectKey)} · ${esc(packs.stages[stageKey])}</h2><p>本阶段提供 ${all.length} 个独立单元，覆盖理解、应用和复习提升。</p></div><div><strong>${completed}/${all.length}</strong><span>已完成</span></div></header>
        <div class="v10-course-filters"><input id="v10-course-search" type="search" placeholder="搜索本学科课程"><select id="v10-course-mode"><option value="">全部课型</option>${packs.modes.map(mode=>`<option value="${mode.key}">${mode.name}</option>`).join('')}</select><a href="library.html?subject=${encodeURIComponent(subjectKey)}&stage=${encodeURIComponent(stageKey)}">查看全部资料</a></div>
        <div class="v10-unit-grid" id="v10-course-grid"></div><button class="v10-load-more" id="v10-course-more" type="button">加载更多</button>`;
      const draw=()=>{
        const query=root.querySelector('#v10-course-search').value;
        const mode=root.querySelector('#v10-course-mode').value;
        const filtered=packs.list({subject:subjectKey,stage:stageKey,mode,query});
        const grid=root.querySelector('#v10-course-grid');
        grid.innerHTML=filtered.slice(0,limit).map(unitCard).join('');
        bindUnitEvents(grid);
        const more=root.querySelector('#v10-course-more');
        more.hidden=filtered.length<=limit;
        more.onclick=()=>{limit+=18;draw();};
      };
      root.querySelector('#v10-course-search').oninput=draw;
      root.querySelector('#v10-course-mode').onchange=draw;
      draw();
    };
    anchor.after(root);
    render();
    return true;
  };

  const loadResources=async()=>{
    if(resourceCatalog)return resourceCatalog;
    try{
      const response=await fetch('assets/open-resources-v10.json?v=20260806-1',{cache:'no-store'});
      if(!response.ok)throw new Error('load');
      resourceCatalog=await response.json();
    }catch{
      resourceCatalog={generatedAt:'',items:[]};
    }
    return resourceCatalog;
  };
  const resourceCard=item=>`<article class="v10-resource-card">
    <div><span>${esc(item.source||'开放资源')}</span><b>${esc(item.license||'请查看来源许可')}</b></div>
    <h3>${esc(item.title)}</h3>
    <p>${esc(item.description||item.extract||'')}</p>
    <footer><span>${esc(item.subjectName||packs.subjects[item.subject]?.name||item.subject||'综合')}</span><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">打开资源</a></footer>
  </article>`;
  const liveSearch=async(query,subjectKey)=>{
    const domain=subjectKey==='chinese'?'zh.wikisource.org':'zh.wikiversity.org';
    const endpoint=`https://${domain}/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=0&gsrlimit=12&prop=info|extracts&inprop=url&exintro=1&explaintext=1&exsentences=3&format=json&origin=*`;
    const response=await fetch(endpoint);
    if(!response.ok)throw new Error('search');
    const json=await response.json();
    return Object.values(json.query?.pages||{}).map(item=>({
      title:item.title,url:item.fullurl,description:String(item.extract||'').replace(/\s+/g,' ').trim(),
      subject:subjectKey,source:domain.includes('wikisource')?'维基文库':'维基学院',
      license:domain.includes('wikisource')?'作品公版状态需逐项确认':'CC BY-SA'
    }));
  };

  const renderLibrary=async()=>{
    if(page!=='library')return;
    const app=document.querySelector('#app');
    document.querySelector('#page-title').innerHTML='<strong>资料库</strong><span>课程包 · 开放资源 · 在线检索</span>';
    document.title='资料库｜Wind 学堂';
    const params=new URLSearchParams(location.search);
    const initialSubject=params.get('subject')||'';
    const initialStage=params.get('stage')||'';
    app.innerHTML=`<section id="v10-library-root">
      <header class="v10-library-hero"><div><span>持续扩充</span><h1>${packs.total.toLocaleString('zh-CN')} 个课程单元</h1><p>站内结构化课程按学科、学段和课型加载；开放资源目录定期更新，并可即时检索 Wikimedia 开放知识项目。</p></div><div class="v10-library-stats"><article><strong>15</strong><span>学科</span></article><article><strong>5</strong><span>阶段</span></article><article><strong>3</strong><span>课型</span></article></div></header>
      <div class="v10-library-tabs"><button class="active" data-v10-tab="courses">站内课程</button><button data-v10-tab="resources">开放资源</button></div>
      <section id="v10-library-courses">
        <div class="v10-library-toolbar"><input id="v10-library-search" type="search" placeholder="搜索课程、知识点或技能"><select id="v10-library-subject"><option value="">全部学科</option>${Object.entries(packs.subjects).map(([key,item])=>`<option value="${key}"${key===initialSubject?' selected':''}>${esc(item.name)}</option>`).join('')}</select><select id="v10-library-stage"><option value="">全部阶段</option>${Object.entries(packs.stages).map(([key,name])=>`<option value="${key}"${key===initialStage?' selected':''}>${esc(name)}</option>`).join('')}</select><select id="v10-library-mode"><option value="">全部课型</option>${packs.modes.map(mode=>`<option value="${mode.key}">${mode.name}</option>`).join('')}</select></div>
        <div class="v10-library-count" id="v10-library-count"></div><div class="v10-unit-grid" id="v10-library-grid"></div><button class="v10-load-more" id="v10-library-more" type="button">加载更多课程</button>
      </section>
      <section id="v10-library-resources" hidden>
        <div class="v10-resource-toolbar"><input id="v10-resource-query" type="search" placeholder="输入主题，例如：唐诗、函数、光合作用"><select id="v10-resource-subject"><option value="chinese">语文与古典文本</option>${Object.entries(packs.subjects).filter(([key])=>key!=='chinese').map(([key,item])=>`<option value="${key}">${esc(item.name)}</option>`).join('')}</select><button id="v10-live-search" type="button">在线搜索开放资源</button></div>
        <div id="v10-resource-status"></div><div class="v10-resource-grid" id="v10-resource-grid"></div>
      </section>
    </section>`;
    const drawCourses=()=>{
      const filters={
        query:document.querySelector('#v10-library-search').value,
        subject:document.querySelector('#v10-library-subject').value,
        stage:document.querySelector('#v10-library-stage').value,
        mode:document.querySelector('#v10-library-mode').value
      };
      const list=packs.list(filters);
      document.querySelector('#v10-library-count').textContent=`找到 ${list.length} 个课程单元`;
      const grid=document.querySelector('#v10-library-grid');
      grid.innerHTML=list.slice(0,libraryLimit).map(unitCard).join('');
      bindUnitEvents(grid);
      const more=document.querySelector('#v10-library-more');
      more.hidden=list.length<=libraryLimit;
      more.onclick=()=>{libraryLimit+=36;drawCourses();};
    };
    ['#v10-library-search','#v10-library-subject','#v10-library-stage','#v10-library-mode'].forEach(selector=>{
      const node=document.querySelector(selector);
      node.addEventListener(node.tagName==='INPUT'?'input':'change',()=>{libraryLimit=36;drawCourses();});
    });
    drawCourses();
    const catalog=await loadResources();
    const resourceGrid=document.querySelector('#v10-resource-grid');
    const drawResources=items=>{
      resourceGrid.innerHTML=items.length?items.map(resourceCard).join(''):'<div class="v10-empty">暂时没有匹配资源。</div>';
    };
    drawResources(catalog.items||[]);
    document.querySelector('#v10-resource-status').textContent=catalog.generatedAt?`资源目录更新于 ${new Date(catalog.generatedAt).toLocaleString('zh-CN')}`:'资源目录将在首次自动任务完成后更新。';
    document.querySelectorAll('[data-v10-tab]').forEach(button=>button.onclick=()=>{
      document.querySelectorAll('[data-v10-tab]').forEach(item=>item.classList.toggle('active',item===button));
      document.querySelector('#v10-library-courses').hidden=button.dataset.v10Tab!=='courses';
      document.querySelector('#v10-library-resources').hidden=button.dataset.v10Tab!=='resources';
    });
    document.querySelector('#v10-live-search').onclick=async()=>{
      const query=document.querySelector('#v10-resource-query').value.trim();
      const subjectKey=document.querySelector('#v10-resource-subject').value;
      if(!query){document.querySelector('#v10-resource-query').focus();return;}
      const status=document.querySelector('#v10-resource-status');
      status.textContent='正在检索开放资源……';
      try{
        const live=await liveSearch(query,subjectKey);
        drawResources(live);
        status.textContent=`在线找到 ${live.length} 项。内容来自开放知识项目，使用前请核对来源与许可。`;
      }catch{
        status.textContent='在线检索失败，已保留定期更新的资源目录。';
        drawResources(catalog.items||[]);
      }
    };
  };

  injectCss();
  injectNav();
  const start=()=>{
    mountHome();
    if(!mountCourseLibrary()){
      const observer=new MutationObserver(()=>{if(mountCourseLibrary())observer.disconnect();});
      observer.observe(document.body,{childList:true,subtree:true});
      setTimeout(()=>observer.disconnect(),18000);
    }
    renderLibrary();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
