(() => {
  'use strict';

  const V9 = window.WIND_GUIDED_V9;
  if (!V9) return;
  V9.activeSession = null;

  V9.sessionShell = (step,total,title,body,footer='') => `
    <div class="v9-session-backdrop" data-v9-close></div>
    <section class="v9-session-panel" role="dialog" aria-modal="true" aria-label="${V9.esc(title)}">
      <header class="v9-session-top">
        <button class="v9-close" type="button" data-v9-close aria-label="关闭">×</button>
        <div class="v9-step-track"><i style="width:${((step+1)/total)*100}%"></i></div>
        <span>${step+1}/${total}</span>
      </header>
      <main class="v9-session-main">${body}</main>
      <footer class="v9-session-footer">${footer}</footer>
    </section>`;

  V9.renderIntro = data => {
    const record = V9.lessonRecord(data.title);
    return `<div class="v9-step v9-intro-step">
      <span class="v9-step-kicker">${record.mastery?'再次学习':'新课'} · 约 6–10 分钟</span>
      <h1>${V9.esc(data.title)}</h1>
      <p>${V9.esc(data.objective||data.overview||'完成本课的理解、练习与主动回忆。')}</p>
      <div class="v9-intro-grid">
        <article><b>1</b><strong>完整情境</strong><span>先理解全文或完整案例</span></article>
        <article><b>2</b><strong>逐步讲解</strong><span>一次只处理一个关键点</span></article>
        <article><b>3</b><strong>互动检查</strong><span>即时判断并查看原因</span></article>
        <article><b>4</b><strong>主动回忆</strong><span>不看答案先组织表达</span></article>
      </div>
      <div class="v9-confidence">
        <span>开始前，你对本课有多熟悉？</span>
        <div>${['完全陌生','见过但不熟','已经比较熟'].map((label,index)=>`<button type="button" data-v9-pre="${index}" class="${V9.activeSession.preRating===index?'active':''}">${label}</button>`).join('')}</div>
      </div>
    </div>`;
  };

  V9.renderMaterial = data => `<div class="v9-step">
    <span class="v9-step-kicker">第 1 步 · 先理解整体</span>
    <h1>${V9.esc(data.sourceTitle||data.title)}</h1>
    ${data.meta?`<p class="v9-source-meta">${V9.esc(data.meta)}</p>`:''}
    <div class="v9-source-sheet">${data.lines.length?data.lines.map((line,index)=>`
      <article class="${V9.activeSession.readLines.has(index)?'read':''}" data-v9-line="${index}">
        <b>${String(index+1).padStart(2,'0')}</b>
        <div><p>${V9.esc(line.text)}</p>${line.reading?`<code>${V9.esc(line.reading)}</code>`:''}${line.note?`<small>${V9.esc(line.note)}</small>`:''}</div>
        ${V9.audioButton(line.audio)}
      </article>`).join(''):`<p>${V9.esc(data.overview||data.objective)}</p>`}</div>
    ${data.overview?`<article class="v9-overview"><strong>整体导读</strong><p>${V9.esc(data.overview)}</p></article>`:''}
    <p class="v9-action-hint">逐句阅读后点击句子做标记。语言课程可先听一遍，再跟读一遍。</p>
  </div>`;

  V9.renderExplain = data => {
    const cards = data.explanations.length?data.explanations:[{title:'核心理解',text:data.theme||data.overview||data.objective,extra:''}];
    return `<div class="v9-step">
      <span class="v9-step-kicker">第 2 步 · 分块理解</span>
      <h1>把难点拆成小块</h1>
      <p>先尝试解释，再点开讲解核对。不要连续滑过全部内容。</p>
      <div class="v9-concept-stack">${cards.map((card,index)=>`
        <details data-v9-concept="${index}" ${V9.activeSession.openConcepts.has(index)?'open':''}>
          <summary><span>${String(index+1).padStart(2,'0')}</span><strong>${V9.esc(card.title||`关键点 ${index+1}`)}</strong><b>展开</b></summary>
          <div><p>${V9.esc(card.text)}</p>${card.extra?`<small>${V9.esc(card.extra)}</small>`:''}</div>
        </details>`).join('')}</div>
      ${data.theme?`<article class="v9-key-takeaway"><span>本课主旨</span><strong>${V9.esc(data.theme)}</strong></article>`:''}
    </div>`;
  };

  V9.renderChoiceActivity = activity => `<div class="v9-step v9-activity-step">
    <span class="v9-step-kicker">第 3 步 · 即时检查</span>
    <h1>${V9.esc(activity.prompt)}</h1>
    <div class="v9-choice-grid">${activity.options.map(option=>`<button type="button" data-v9-choice="${V9.esc(option)}" class="${V9.activeSession.choice===option?'selected':''}">${V9.esc(option)}</button>`).join('')}</div>
    ${V9.activeSession.checked?`<article class="v9-feedback ${V9.activeSession.objectiveCorrect?'good':'retry'}"><strong>${V9.activeSession.objectiveCorrect?'回答正确':'再看一次'}</strong><p>${V9.esc(activity.explanation)}${V9.activeSession.objectiveCorrect?'':` 正确答案：${V9.esc(activity.answer)}`}</p></article>`:''}
    <button class="v9-check-button" type="button" id="v9-check-choice" ${!V9.activeSession.choice||V9.activeSession.checked?'disabled':''}>检查答案</button>
  </div>`;

  V9.renderOrderActivity = activity => {
    const chosen = V9.activeSession.orderChosen;
    const remaining = V9.activeSession.orderPool.filter(item=>!chosen.includes(item));
    return `<div class="v9-step v9-activity-step">
      <span class="v9-step-kicker">第 3 步 · 梳理思路</span>
      <h1>${V9.esc(activity.prompt)}</h1>
      <div class="v9-order-answer">${chosen.length?chosen.map((item,index)=>`<button type="button" data-v9-remove-order="${index}"><b>${index+1}</b>${V9.esc(item)}</button>`).join(''):'<p>从下方依次选择，组成完整顺序。</p>'}</div>
      <div class="v9-order-pool">${remaining.map(item=>`<button type="button" data-v9-order="${V9.esc(item)}">${V9.esc(item)}</button>`).join('')}</div>
      ${V9.activeSession.checked?`<article class="v9-feedback ${V9.activeSession.objectiveCorrect?'good':'retry'}"><strong>${V9.activeSession.objectiveCorrect?'顺序正确':'顺序还需要调整'}</strong><p>${V9.esc(activity.explanation)}</p></article>`:''}
      <div class="v9-inline-actions"><button class="v9-secondary" id="v9-reset-order" type="button">重排</button><button class="v9-check-button" id="v9-check-order" type="button" ${chosen.length!==activity.answer.length||V9.activeSession.checked?'disabled':''}>检查顺序</button></div>
    </div>`;
  };

  V9.renderRecall = (data,compact=false) => {
    const item = data.questions[0]||{question:'不看原文，用自己的话概括本课的核心内容。',answer:data.theme||data.overview||data.objective};
    return `<div class="v9-step v9-recall-step">
      <span class="v9-step-kicker">${compact?'快速复习':'第 4 步'} · 主动回忆</span>
      <h1>${V9.esc(item.question)}</h1>
      <p>先写下自己的答案，再查看参考。这里不使用模糊的自动语义评分，由你根据关键点诚实判断。</p>
      <textarea id="v9-recall-input" placeholder="写出关键词、步骤或完整答案……">${V9.esc(V9.activeSession.recallText)}</textarea>
      <button class="v9-secondary" id="v9-reveal-answer" type="button">${V9.activeSession.answerShown?'收起参考答案':'查看参考答案'}</button>
      ${V9.activeSession.answerShown?`<article class="v9-model-answer"><span>参考答案</span><p>${V9.esc(item.answer)}</p></article>
      <div class="v9-self-rating"><span>对照后判断自己的掌握程度</span><div>${['没有答到关键点','答到一部分','关键点完整'].map((label,index)=>`<button type="button" data-v9-self="${index}" class="${V9.activeSession.selfRating===index?'active':''}">${label}</button>`).join('')}</div></div>`:''}
    </div>`;
  };

  V9.renderRecap = data => {
    const points = [...data.famous.map(item=>`${item.title}：${item.text}`),...data.examGroups.flatMap(group=>group.items)].filter(Boolean).slice(0,5);
    const checkLabel = V9.activeSession.mode==='review'?'快速回忆':'互动检查';
    const checkValue = V9.activeSession.mode==='review'?(V9.activeSession.selfRating===2?'关键点完整':'已完成回忆'):(V9.activeSession.objectiveCorrect?'已通过':'需要复习');
    return `<div class="v9-step v9-recap-step">
      <span class="v9-step-kicker">最后一步 · 形成长期记忆</span>
      <h1>本课小结</h1>
      <div class="v9-recap-grid">
        <article><span>完整材料</span><strong>${V9.esc(data.sourceTitle||data.title)}</strong></article>
        <article><span>${checkLabel}</span><strong>${checkValue}</strong></article>
        <article><span>主动回忆</span><strong>${V9.activeSession.selfRating===2?'关键点完整':V9.activeSession.selfRating===1?'部分掌握':'需要再练'}</strong></article>
      </div>
      ${points.length?`<ul class="v9-key-points">${points.map(item=>`<li>${V9.esc(item)}</li>`).join('')}</ul>`:''}
      ${data.transfer?`<article class="v9-transfer"><span>迁移任务</span><p>${V9.esc(data.transfer)}</p></article>`:''}
      <div class="v9-final-rating"><span>现在，你能否独立完成同类任务？</span><div>${['还不能','需要提示','可以独立完成'].map((label,index)=>`<button type="button" data-v9-final="${index}" class="${V9.activeSession.finalRating===index?'active':''}">${label}</button>`).join('')}</div></div>
    </div>`;
  };

  V9.footerForStep = total => {
    const step = V9.activeSession.step;
    const final = step===total-1;
    let disabled = false;
    if (V9.activeSession.mode==='review'&&step===1) disabled = V9.activeSession.selfRating===null;
    if (V9.activeSession.mode!=='review'&&step===3&&V9.activeSession.activity.type!=='recall') disabled = !V9.activeSession.checked;
    if (V9.activeSession.mode!=='review'&&step===4) disabled = V9.activeSession.selfRating===null;
    if (final) disabled = V9.activeSession.finalRating===null;
    return `<button class="v9-footer-back" type="button" id="v9-step-back" ${step===0?'disabled':''}>上一步</button>
      <div><span>${V9.activeSession.mode==='review'?'快速复习':'引导学习'}</span><strong>${V9.esc(V9.activeSession.data.title)}</strong></div>
      <button class="v9-footer-next" type="button" id="${final?'v9-finish':'v9-step-next'}" ${disabled?'disabled':''}>${final?'完成本课':'继续'}</button>`;
  };

  V9.renderSession = () => {
    const layer = document.querySelector('#v9-session-layer');
    const data = V9.activeSession.data;
    const reviewMode = V9.activeSession.mode==='review';
    const total = reviewMode?3:6;
    let body = '';
    if (reviewMode) {
      if (V9.activeSession.step===0) body=V9.renderIntro(data);
      if (V9.activeSession.step===1) body=V9.renderRecall(data,true);
      if (V9.activeSession.step===2) body=V9.renderRecap(data);
    } else {
      if (V9.activeSession.step===0) body=V9.renderIntro(data);
      if (V9.activeSession.step===1) body=V9.renderMaterial(data);
      if (V9.activeSession.step===2) body=V9.renderExplain(data);
      if (V9.activeSession.step===3) body=V9.activeSession.activity.type==='choice'?V9.renderChoiceActivity(V9.activeSession.activity):V9.activeSession.activity.type==='order'?V9.renderOrderActivity(V9.activeSession.activity):V9.renderRecall(data);
      if (V9.activeSession.step===4) body=V9.renderRecall(data);
      if (V9.activeSession.step===5) body=V9.renderRecap(data);
    }
    layer.innerHTML = V9.sessionShell(V9.activeSession.step,total,data.title,body,V9.footerForStep(total));
    V9.bindSessionEvents(total);
  };

  V9.bindAudioProxy = button => {
    button.onclick = event => {
      event.stopPropagation();
      const audioKey = button.dataset.v9AudioKey;
      const audioSequence = button.dataset.v9AudioSequence;
      const speakText = button.dataset.v9Speak;
      const language = button.dataset.v9Language||V9.subject();
      if (audioKey||audioSequence||(speakText&&language==='cantonese')) {
        const proxy = document.createElement('button');
        proxy.hidden = true;
        if (audioKey) proxy.dataset.audioKey=audioKey;
        if (audioSequence) proxy.dataset.audioSequence=audioSequence;
        if (speakText) proxy.dataset.speak=speakText;
        proxy.dataset.language=language;
        document.body.append(proxy);
        proxy.click();
        proxy.remove();
        button.classList.add('playing');
        setTimeout(()=>button.classList.remove('playing'),1800);
        return;
      }
      if (speakText) {
        const selector = `[data-speak="${V9.cssEscape(speakText)}"]`;
        const original = [...document.querySelectorAll(selector)].find(item=>!item.closest('#v9-session-layer'));
        if (original) {
          original.click();
          button.classList.add('playing');
          setTimeout(()=>button.classList.remove('playing'),1800);
        }
      }
    };
  };

  V9.bindSessionEvents = total => {
    const layer = document.querySelector('#v9-session-layer');
    layer.querySelectorAll('[data-v9-close]').forEach(button=>button.onclick=V9.closeSession);
    layer.querySelectorAll('.v9-audio').forEach(V9.bindAudioProxy);
    layer.querySelectorAll('[data-v9-pre]').forEach(button=>button.onclick=()=>{V9.activeSession.preRating=Number(button.dataset.v9Pre);V9.renderSession();});
    layer.querySelectorAll('[data-v9-line]').forEach(article=>article.onclick=event=>{
      if (event.target.closest('button')) return;
      const index=Number(article.dataset.v9Line);
      V9.activeSession.readLines.has(index)?V9.activeSession.readLines.delete(index):V9.activeSession.readLines.add(index);
      article.classList.toggle('read',V9.activeSession.readLines.has(index));
    });
    layer.querySelectorAll('[data-v9-concept]').forEach(details=>details.ontoggle=()=>{
      const index=Number(details.dataset.v9Concept);
      details.open?V9.activeSession.openConcepts.add(index):V9.activeSession.openConcepts.delete(index);
    });
    layer.querySelectorAll('[data-v9-choice]').forEach(button=>button.onclick=()=>{
      if (V9.activeSession.checked) return;
      V9.activeSession.choice=button.dataset.v9Choice;
      V9.renderSession();
    });
    layer.querySelector('#v9-check-choice')?.addEventListener('click',()=>{
      V9.activeSession.checked=true;
      V9.activeSession.objectiveCorrect=V9.activeSession.choice===V9.activeSession.activity.answer;
      V9.renderSession();
    });
    layer.querySelectorAll('[data-v9-order]').forEach(button=>button.onclick=()=>{V9.activeSession.orderChosen.push(button.dataset.v9Order);V9.renderSession();});
    layer.querySelectorAll('[data-v9-remove-order]').forEach(button=>button.onclick=()=>{
      V9.activeSession.orderChosen.splice(Number(button.dataset.v9RemoveOrder),1);
      V9.activeSession.checked=false;
      V9.renderSession();
    });
    layer.querySelector('#v9-reset-order')?.addEventListener('click',()=>{
      V9.activeSession.orderChosen=[];
      V9.activeSession.checked=false;
      V9.renderSession();
    });
    layer.querySelector('#v9-check-order')?.addEventListener('click',()=>{
      V9.activeSession.checked=true;
      V9.activeSession.objectiveCorrect=V9.activeSession.orderChosen.every((item,index)=>item===V9.activeSession.activity.answer[index]);
      V9.renderSession();
    });
    const textarea=layer.querySelector('#v9-recall-input');
    if (textarea) textarea.oninput=event=>{V9.activeSession.recallText=event.target.value;};
    layer.querySelector('#v9-reveal-answer')?.addEventListener('click',()=>{V9.activeSession.answerShown=!V9.activeSession.answerShown;V9.renderSession();});
    layer.querySelectorAll('[data-v9-self]').forEach(button=>button.onclick=()=>{V9.activeSession.selfRating=Number(button.dataset.v9Self);V9.renderSession();});
    layer.querySelectorAll('[data-v9-final]').forEach(button=>button.onclick=()=>{V9.activeSession.finalRating=Number(button.dataset.v9Final);V9.renderSession();});
    layer.querySelector('#v9-step-back')?.addEventListener('click',()=>{if(V9.activeSession.step>0){V9.activeSession.step-=1;V9.renderSession();}});
    layer.querySelector('#v9-step-next')?.addEventListener('click',()=>{
      if (V9.activeSession.step<total-1) {
        if (V9.activeSession.step===0&&V9.activeSession.preRating===null) V9.activeSession.preRating=0;
        V9.activeSession.step+=1;
        V9.renderSession();
      }
    });
    layer.querySelector('#v9-finish')?.addEventListener('click',V9.finishSession);
  };

  V9.startSession = async (index,mode='learn') => {
    V9.injectCss();
    let layer=document.querySelector('#v9-session-layer');
    if (!layer) {
      layer=document.createElement('div');
      layer.id='v9-session-layer';
      document.body.append(layer);
    }
    layer.innerHTML='<div class="v9-session-loading"><span></span><strong>正在准备本课</strong><p>整理完整材料、讲解和互动任务……</p></div>';
    layer.classList.add('open');
    document.body.classList.add('v9-session-open');
    const data=await V9.captureLesson(index);
    if (!data) {
      layer.innerHTML='<div class="v9-session-loading"><strong>课程暂时无法打开</strong><button type="button" data-v9-close>返回</button></div>';
      layer.querySelector('[data-v9-close]').onclick=V9.closeSession;
      return;
    }
    const activity=V9.makeObjective(data);
    V9.activeSession={
      index,mode,data,activity,step:0,preRating:null,readLines:new Set(),openConcepts:new Set(),
      choice:null,checked:false,objectiveCorrect:activity.type==='recall',orderPool:activity.type==='order'?V9.shuffle(activity.items):[],
      orderChosen:[],recallText:'',answerShown:false,selfRating:null,finalRating:null,startedAt:Date.now()
    };
    V9.renderSession();
  };

  V9.closeSession = () => {
    document.querySelector('#v9-session-layer')?.classList.remove('open');
    document.body.classList.remove('v9-session-open');
    V9.activeSession=null;
  };

  V9.finishSession = () => {
    const data=V9.activeSession.data;
    const key=V9.lessonKey(data.title);
    const old=V9.lessonRecord(data.title);
    const objective=V9.activeSession.objectiveCorrect?2:0;
    const recall=V9.activeSession.selfRating??0;
    const final=V9.activeSession.finalRating??0;
    const performance=V9.clamp(objective+recall+final,0,6);
    let mastery=Math.round((old.mastery*2+Math.min(5,performance))/3);
    if (performance>=4) mastery=Math.max(old.mastery+1,mastery);
    if (performance<=1) mastery=Math.max(0,old.mastery-1);
    mastery=V9.clamp(mastery,0,5);
    const xp=V9.activeSession.mode==='review'?18+recall*4+final*4:26+objective*5+recall*4+final*4;
    V9.updateStreak();
    V9.addXp(xp);
    V9.state.lessons[key]={mastery,attempts:(old.attempts||0)+1,nextReview:V9.today(V9.REVIEW_DAYS[mastery+1]||30),lastAt:new Date().toISOString(),xp:(old.xp||0)+xp};
    V9.state.sessions.push({date:new Date().toISOString(),subject:V9.subject(),stage:V9.stage(),title:data.title,mastery,xp,mode:V9.activeSession.mode,duration:Math.round((Date.now()-V9.activeSession.startedAt)/1000)});
    V9.saveState();
    const titles=V9.currentLessonTitles();
    V9.updateAcademy(V9.subject(),V9.stage(),V9.progressForCourse(titles),Math.max(1,Math.round(xp/8)));
    const layer=document.querySelector('#v9-session-layer');
    const completedIndex=V9.activeSession.index;
    layer.innerHTML=V9.sessionShell(0,1,'完成',`<div class="v9-complete">
      <div class="v9-complete-mark">✓</div>
      <span class="v9-step-kicker">本课已完成</span>
      <h1>${V9.esc(data.title)}</h1>
      <p>你获得了 ${xp} 经验。系统会根据本次表现安排下一次复习。</p>
      <div class="v9-complete-stats">
        <article><strong>${mastery}/5</strong><span>${V9.MASTERY_NAMES[mastery]}</span></article>
        <article><strong>+${xp}</strong><span>经验</span></article>
        <article><strong>${V9.formatDate(V9.state.lessons[key].nextReview)}</strong><span>下次复习</span></article>
      </div>
      <div class="v9-complete-actions">
        <button class="v9-primary" id="v9-complete-next" type="button">继续下一课</button>
        <a class="v9-secondary" href="practice.html?subject=${encodeURIComponent(V9.subject())}&stage=${encodeURIComponent(V9.stage())}&autostart=1">做专项练习</a>
        <button class="v9-secondary" type="button" data-v9-close>返回课程地图</button>
      </div>
    </div>`,'');
    layer.querySelectorAll('[data-v9-close]').forEach(button=>button.onclick=()=>{
      V9.closeSession();
      V9.renderCoursePath?.();
    });
    layer.querySelector('#v9-complete-next').onclick=()=>{
      const next=(completedIndex+1)%Math.max(1,titles.length);
      V9.closeSession();
      V9.startSession(next,'learn');
    };
  };

  document.addEventListener('keydown',event=>{
    if (event.key==='Escape'&&document.querySelector('#v9-session-layer.open')) V9.closeSession();
  });
})();
