(() => {
'use strict';
if(typeof document==='undefined')return;
const STORE='wind-detailed-progress-v12';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const load=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}};
const state={lessons:{},...load()};
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state))}catch{}};
const subjectKey=()=>document.body.dataset.subject||new URLSearchParams(location.search).get('subject')||'chinese';
const stageKey=()=>document.querySelector('#subject-stage')?.value||new URLSearchParams(location.search).get('stage')||document.body.dataset.stage||'primary';
const checks=['material','explanation','examples','exam','practice','review'];
const progress=id=>checks.filter(key=>state.lessons[id]?.[key]).length;
const completed=id=>progress(id)===checks.length;
const category=(subject,title)=>{
 if(subject==='chinese')return /《/.test(title)?'篇目精读':/写作|作文|习作/.test(title)?'写作表达':/阅读|新闻|文本/.test(title)?'阅读方法':'语言基础';
 if(['english','cantonese','japanese','korean'].includes(subject))return /音|拼|phonics|letter|假名|字母/i.test(title)?'发音文字':/阅读|寫|写|作文|email|essay|TOPIK|JLPT|IELTS|TOEFL|CET|TEM/i.test(title)?'阅读写作':/语法|助词|助詞|时态|時態|形|voice|condition|语尾|語尾/i.test(title)?'语法结构':'情境会话';
 if(subject==='math')return /图形|周长|面积|体积|圆|三角|几何|向量|空间/.test(title)?'图形几何':/概率|统计|平均|随机/.test(title)?'统计概率':/函数|方程|不等式|代数|矩阵|数列|导数|极限/.test(title)?'代数函数':'数与运算';
 if(['science','physics','chemistry','biology'].includes(subject))return /实验|测量|观察|探究|设计|拟合|误差|数据/.test(title)?'实验探究':subject==='physics'?'物理规律':subject==='chemistry'?'物质与反应':subject==='biology'?'生命系统':'科学概念';
 if(subject==='history')return /史料|材料|研究|档案|口述|史学/.test(title)?'史料研习':'历史进程';
 if(subject==='geography')return /GIS|遥感|地图|经纬|图层|调查/.test(title)?'地图技术':'区域与环境';
 if(subject==='computing')return /HTML|CSS|JavaScript|Web|API|数据库|SQL/.test(title)?'Web与数据':/算法|数据结构|复杂度|递归|动态规划|图算法/.test(title)?'算法与系统':'编程项目';
 if(subject==='finance')return /股票|债券|基金|投资|资产|估值|组合|风险/.test(title)?'投资与风险':'个人财务';
 if(subject==='logic')return /新闻|广告|媒体|谬误|偏误/.test(title)?'信息辨析':'推理与论证';
 return'课程';
};
const renderBlocks=items=>(items||[]).map(item=>`<div class="v12-explain"><strong>${esc(item.title||'讲解')}</strong><p>${esc(item.body||item)}</p></div>`).join('');
const renderList=items=>`<ul>${(items||[]).map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
function syncOldProgress(lesson){
 if(state.lessons[lesson.id])return;
 try{
  const old=JSON.parse(localStorage.getItem('wind-named-curriculum-v11')||'{}');
  const count=Object.values(old.progress?.[lesson.sourceId]||{}).filter(Boolean).length;
  if(count){state.lessons[lesson.id]={};checks.slice(0,Math.min(count,checks.length)).forEach(key=>state.lessons[lesson.id][key]=true);save()}
 }catch{}
}
function makeLessons(subject,stage){
 const api=window.WIND_DETAILED_CURRICULUM_V12;
 const titles=window.WIND_NAMED_SYLLABI_V11?.[subject]?.[stage]||[];
 return titles.map((title,index)=>{
  const lesson=api.build(subject,stage,title,index);
  syncOldProgress(lesson);
  lesson.category=category(subject,title);
  return lesson;
 });
}
let root=null,current={subject:'',stage:'',lessons:[],category:'',query:''};
function renderRows(){
 if(!root)return;
 const query=current.query.toLowerCase();
 const list=current.lessons.filter(lesson=>(!current.category||lesson.category===current.category)&&(!query||`${lesson.title} ${lesson.overview} ${lesson.keyPoints.join(' ')}`.toLowerCase().includes(query)));
 const recommendation=list.find(lesson=>!completed(lesson.id))?.id;
 const rows=root.querySelector('#v12-list');
 rows.innerHTML=list.length?list.map(lesson=>{
  const done=progress(lesson.id),pct=Math.round(done/checks.length*100);
  return`<button type="button" class="v12-row ${completed(lesson.id)?'done':''} ${lesson.id===recommendation?'recommended':''}" data-v12-open="${esc(lesson.id)}">
   <span class="v12-node"></span>
   <span class="v12-main"><small>第 ${String(lesson.index+1).padStart(2,'0')} 课 · ${esc(lesson.category)} · ${done?completed(lesson.id)?'已掌握':'学习中':'新课'}</small><strong>${esc(lesson.title)}</strong><p>${esc(lesson.overview)}</p><span class="v12-progress"><i style="width:${pct}%"></i></span></span>
   <span class="v12-side">${lesson.id===recommendation?'<b>推荐</b>':''}<strong>${done}/${checks.length}</strong></span>
  </button>`;
 }).join(''):`<div class="v12-empty">没有符合当前筛选的课程。</div>`;
 rows.querySelectorAll('[data-v12-open]').forEach(button=>button.onclick=()=>openLesson(current.lessons.find(lesson=>lesson.id===button.dataset.v12Open)));
 const complete=current.lessons.filter(lesson=>completed(lesson.id)).length;
 const started=current.lessons.filter(lesson=>progress(lesson.id)>0&&!completed(lesson.id)).length;
 root.querySelector('#v12-total').textContent=current.lessons.length;
 root.querySelector('#v12-complete').textContent=complete;
 root.querySelector('#v12-started').textContent=started;
 root.querySelector('#v12-visible').textContent=list.length;
}
function renderMap(){
 const api=window.WIND_DETAILED_CURRICULUM_V12;
 const subject=subjectKey(),stage=stageKey(),lessons=makeLessons(subject,stage);
 if(!lessons.length)return;
 current={subject,stage,lessons,category:'',query:''};
 const categories=[...new Set(lessons.map(lesson=>lesson.category))];
 root.innerHTML=`<header class="v12-map-head"><div><small>具体课程地图 · 全部课程正文已接入</small><h2>${esc(api.subjects[subject]||subject)} · ${esc(api.stages[stage]||stage)}</h2><p>每一课均包含独立材料、分层讲解、完整示例、考点、易错点、练习答案和迁移任务。</p></div><div class="v12-tools"><input id="v12-search" type="search" placeholder="搜索具体课程" aria-label="搜索具体课程"><select id="v12-category" aria-label="课程分类"><option value="">全部分类</option>${categories.map(value=>`<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></div></header>
 <div class="v12-map-stats"><span class="v12-stat"><strong id="v12-total">0</strong>全部课程</span><span class="v12-stat"><strong id="v12-visible">0</strong>当前显示</span><span class="v12-stat"><strong id="v12-started">0</strong>学习中</span><span class="v12-stat"><strong id="v12-complete">0</strong>已掌握</span></div><div id="v12-list" class="v12-list"></div>`;
 root.querySelector('#v12-search').oninput=event=>{current.query=event.target.value.trim();renderRows()};
 root.querySelector('#v12-category').onchange=event=>{current.category=event.target.value;renderRows()};
 renderRows();
}
function checkButton(key,label,lesson){return`<button type="button" class="v12-check ${state.lessons[lesson.id]?.[key]?'done':''}" data-v12-check="${key}"><strong>${state.lessons[lesson.id]?.[key]?'✓ 已完成':'○ 待完成'}</strong>${esc(label)}</button>`}
function openLesson(lesson){
 if(!lesson)return;
 document.querySelector('.v12-overlay')?.remove();
 const overlay=document.createElement('div');overlay.className='v12-overlay';
 const audio=lesson.audioLanguage?`<button class="v12-speak" type="button" data-speak="${esc(lesson.material)}" data-language="${esc(lesson.audioLanguage)}">▶ 播放本课材料</button>`:'';
 overlay.innerHTML=`<section class="v12-dialog" role="dialog" aria-modal="true" aria-label="${esc(lesson.title)}">
  <header class="v12-dialog-head"><div><span>${esc(lesson.subjectName)} · ${esc(lesson.stageName)} · 第 ${String(lesson.index+1).padStart(2,'0')} 课 · 约 ${lesson.duration} 分钟</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.overview)}</p>${audio}</div><button class="v12-close" type="button" data-v12-close aria-label="关闭">×</button></header>
  <main class="v12-dialog-body">
   <section class="v12-hero"><article class="v12-card"><h2>完整学习材料</h2><div class="v12-material">${esc(lesson.material)}</div></article><article class="v12-card"><h2>本课目标</h2>${renderList(lesson.objectives)}<h3>课程完成记录</h3><div class="v12-checks">${checkButton('material','阅读完整材料',lesson)}${checkButton('explanation','完成分层讲解',lesson)}${checkButton('examples','重做完整示例',lesson)}${checkButton('exam','整理考点与易错',lesson)}${checkButton('practice','完成本课练习',lesson)}${checkButton('review','完成迁移复习',lesson)}</div></article></section>
   <section class="v12-grid"><article class="v12-card"><h2>分层讲解</h2><div class="v12-section-list">${renderBlocks(lesson.explanation)}</div></article><article class="v12-card"><h2>完整示例</h2><div class="v12-section-list">${renderBlocks(lesson.workedExamples)}</div></article></section>
   <section class="v12-grid"><article class="v12-card"><h2>核心知识点</h2>${renderList(lesson.keyPoints)}</article><article class="v12-card"><h2>常考点与能力要求</h2>${renderList(lesson.examPoints)}</article></section>
   <section class="v12-grid"><article class="v12-card"><h2>易错点</h2>${renderList(lesson.mistakes)}</article><article class="v12-card"><h2>迁移提升任务</h2><p>${esc(lesson.extension)}</p><h3>本课总结</h3><p>${esc(lesson.summary)}</p></article></section>
   <article class="v12-card"><h2>分层练习与参考答案</h2><div class="v12-quiz-list">${lesson.practice.map((item,index)=>`<section class="v12-quiz"><div><em>${index+1}</em><p>${esc(item.q)}</p></div><details><summary>查看${esc(item.level||'基础')}参考答案</summary><p>${esc(item.a)}</p></details></section>`).join('')}</div></article>
  </main>
  <footer class="v12-dialog-foot"><span>本课完成度 <strong id="v12-modal-progress">${progress(lesson.id)}/${checks.length}</strong></span><div><a href="practice.html?subject=${encodeURIComponent(lesson.subject)}&stage=${encodeURIComponent(lesson.stage)}&autostart=1">进入专项题库</a><button type="button" class="v12-master ${completed(lesson.id)?'done':''}" data-v12-master>${completed(lesson.id)?'✓ 已掌握':'标记全部完成'}</button></div></footer>
 </section>`;
 document.body.append(overlay);
 const close=()=>overlay.remove();overlay.querySelectorAll('[data-v12-close]').forEach(node=>node.onclick=close);overlay.onclick=event=>{if(event.target===overlay)close()};
 const updateModal=()=>{
  overlay.querySelector('#v12-modal-progress').textContent=`${progress(lesson.id)}/${checks.length}`;
  overlay.querySelectorAll('[data-v12-check]').forEach(button=>{const done=Boolean(state.lessons[lesson.id]?.[button.dataset.v12Check]);button.classList.toggle('done',done);button.querySelector('strong').textContent=done?'✓ 已完成':'○ 待完成'});
  const master=overlay.querySelector('[data-v12-master]');master.classList.toggle('done',completed(lesson.id));master.textContent=completed(lesson.id)?'✓ 已掌握':'标记全部完成';renderRows();
 };
 overlay.querySelectorAll('[data-v12-check]').forEach(button=>button.onclick=()=>{const key=button.dataset.v12Check;state.lessons[lesson.id]={...(state.lessons[lesson.id]||{}),[key]:!state.lessons[lesson.id]?.[key]};save();updateModal()});
 overlay.querySelector('[data-v12-master]').onclick=()=>{const value=!completed(lesson.id);state.lessons[lesson.id]={};checks.forEach(key=>state.lessons[lesson.id][key]=value);save();updateModal()};
 document.addEventListener('keydown',function escape(event){if(event.key==='Escape'){close();document.removeEventListener('keydown',escape)}},{once:false});
}
function mount(){
 if(root)return true;
 const anchor=document.querySelector('#v11-course-map')||document.querySelector('#guided-path-v9')||document.querySelector('#deep-course-v6');
 if(!anchor)return false;
 if(!document.querySelector('link[data-detailed-v12]')){const link=document.createElement('link');link.rel='stylesheet';link.href='assets/detailed-v12.css?v=20260806-2';link.dataset.detailedV12='1';document.head.append(link)}
 root=document.createElement('section');root.id='v12-course-map';anchor.after(root);renderMap();
 document.querySelector('#subject-stage')?.addEventListener('change',()=>setTimeout(renderMap,60));
 return true;
}
let tries=0;const timer=setInterval(()=>{tries++;if(window.WIND_DETAILED_CURRICULUM_V12&&window.WIND_NAMED_SYLLABI_V11&&(mount()||tries>180))clearInterval(timer)},100);
})();
