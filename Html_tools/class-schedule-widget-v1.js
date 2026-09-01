(function(){
  'use strict';
  if(window.__windzxyClassScheduleV1)return;
  window.__windzxyClassScheduleV1=1;

  const APP='class-schedule';
  const VER='20260901-class-schedule-v1-today-first';
  const DAYS=['一','二','三','四','五'];
  const DAY_NAMES=['星期一','星期二','星期三','星期四','星期五'];
  const SUBJECT_CLASS={
    '语文':'cn','語文':'cn','数学':'math','數學':'math','英语':'en','英語':'en','体育':'pe','體育':'pe','音乐':'music','音樂':'music','美术':'art','美術':'art','科学':'science','科學':'science','道法':'moral','书法':'calligraphy','書法':'calligraphy','阅读':'read','閱讀':'read','综合':'general','綜合':'general','劳动':'labor','勞動':'labor','心理':'psych','班活':'class','延时1':'care','延時1':'care','延时2':'care','延時2':'care','早读':'read','早讀':'read','升旗':'flag','午写':'write','午寫':'write','跑操':'pe','眼保健操':'care'
  };

  const ROWS=[
    {section:'上午',label:'晨间',times:['08:00-08:30','08:00-08:10','08:00-08:10','08:00-08:10','08:00-08:10'],items:['升旗','早读','早读','早读','早读'],kind:'routine'},
    {section:'上午',label:'第一节',times:['08:35-09:15','08:20-09:00','08:20-09:00','08:20-09:00','08:20-09:00'],items:['道法','语文','语文','英语','体育']},
    {section:'上午',label:'跑操',times:['','09:00-09:20','09:00-09:20','09:00-09:20','09:00-09:20'],items:['—','跑操','跑操','跑操','跑操'],kind:'routine'},
    {section:'上午',label:'第二节',times:['09:25-10:05','09:25-10:05','09:25-10:05','09:25-10:05','09:25-10:05'],items:['语文','语文','数学','体育','数学']},
    {section:'上午',label:'眼保健操',times:['10:05-10:10','10:05-10:10','10:05-10:10','10:05-10:10','10:05-10:10'],items:['眼保健操','眼保健操','眼保健操','眼保健操','眼保健操'],kind:'routine'},
    {section:'上午',label:'第三节',times:['10:20-11:00','10:20-11:00','10:20-11:00','10:20-11:00','10:20-11:00'],items:['体育','体育','体育','音乐','语文']},
    {section:'上午',label:'第四节',times:['11:10-11:45','11:10-11:45','11:10-11:45','11:10-11:45','11:10-11:45'],items:['语文','音乐','书法','数学','班活（单） / 心理（双）']},
    {section:'下午',label:'午写',times:['13:50-14:05','13:50-14:05','13:50-14:05','13:50-14:05','13:50-14:05'],items:['午写','午写','午写','午写','午写'],kind:'routine'},
    {section:'下午',label:'第一节',times:['14:05-14:45','14:05-14:45','14:05-14:45','14:05-14:45','14:05-14:45'],items:['综合（单） / 劳动（双）','数学','英语','语文','语文']},
    {section:'下午',label:'眼保健操',times:['14:45-14:50','14:45-14:50','14:45-14:50','14:45-14:50','14:45-14:50'],items:['眼保健操','眼保健操','眼保健操','眼保健操','眼保健操'],kind:'routine'},
    {section:'下午',label:'第二节',times:['15:00-15:40','15:00-15:40','15:00-15:40','15:00-15:40','15:00-15:40'],items:['阅读','美术','道法','美术','科学']},
    {section:'课后服务',label:'第一节',times:['15:50-16:30','15:50-16:30','15:50-16:30','15:50-16:30','15:50-16:30'],items:['延时1','延时1','延时1','延时1','延时1'],kind:'care'},
    {section:'课后服务',label:'第二节',times:['16:40-17:10','16:40-17:10','16:40-17:10','16:40-17:10','16:40-17:10'],items:['延时2','延时2','延时2','延时2','延时2'],kind:'care'}
  ];

  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function dayIndex(){const d=new Date().getDay();return d>=1&&d<=5?d-1:0;}
  function minutes(v){if(!v)return null;const m=String(v).match(/^(\d{1,2}):(\d{2})/);return m?(+m[1])*60+(+m[2]):null;}
  function range(v){if(!v)return [null,null];const p=String(v).split('-');return [minutes(p[0]),minutes(p[1])];}
  function currentMinute(){const d=new Date();return d.getHours()*60+d.getMinutes();}
  function subjectBase(v){return String(v||'').replace(/（.*?）/g,'').split('/')[0].trim();}
  function cls(v){return SUBJECT_CLASS[subjectBase(v)]||SUBJECT_CLASS[v]||'other';}
  function statusFor(day){
    const now=currentMinute();
    if(day!==dayIndex()||new Date().getDay()===0||new Date().getDay()===6)return {current:-1,next:-1};
    let next=-1;
    for(let i=0;i<ROWS.length;i++){
      const t=ROWS[i].times[day];if(!t)continue;
      const [s,e]=range(t);if(s===null)continue;
      if(now>=s&&now<=e)return {current:i,next:i+1<ROWS.length?i+1:-1};
      if(now<s&&next<0)next=i;
    }
    return {current:-1,next};
  }
  function ensureMeta(){
    try{
      if(!Array.isArray(apps))return;
      let a=apps.find(x=>x.id===APP);
      if(!a){
        a={id:APP,kind:'widget',title:'课程表',desc:'今天优先的周课程表，快速查看当前与下一节。',icon:'课',tone:'t-schedule'};
        const idx=apps.findIndex(x=>x.id==='calendar');
        idx>=0?apps.splice(idx,0,a):apps.push(a);
      }
    }catch(e){}
  }
  function cardByRoot(root){
    try{const id=root.closest('[data-card-id]')?.dataset.cardId;return activeWorkspace().cards.find(c=>String(c.id)===String(id));}catch(e){return null;}
  }
  function state(card){
    const today=dayIndex();
    const d=Number(card?.data?.scheduleDay);
    return {day:Number.isInteger(d)&&d>=0&&d<5?d:today,view:card?.data?.scheduleView==='week'?'week':'day'};
  }
  function dayRows(day){
    const st=statusFor(day);let last='';
    return ROWS.map((r,i)=>{
      const item=r.items[day],time=r.times[day];if(!time||item==='—')return '';
      const section=r.section!==last?`<div class="csv1-section">${esc(r.section)}</div>`:'';last=r.section;
      const live=i===st.current?' is-now':i===st.next?' is-next':'';
      return `${section}<div class="csv1-row${live}"><time>${esc(time)}</time><div class="csv1-lesson"><strong>${esc(item)}</strong><span>${esc(r.label)}</span></div><i class="csv1-dot ${cls(item)}"></i></div>`;
    }).join('');
  }
  function nowSummary(day){
    const st=statusFor(day);
    if(day!==dayIndex()||new Date().getDay()===0||new Date().getDay()===6)return `<span>查看 ${DAY_NAMES[day]}</span><b>${ROWS.filter(r=>r.times[day]&&r.items[day]!=='—').length} 个安排</b>`;
    if(st.current>=0){const r=ROWS[st.current];return `<span>正在进行</span><b>${esc(r.items[day])} · ${esc(r.times[day])}</b>`;}
    if(st.next>=0){const r=ROWS[st.next];return `<span>下一项</span><b>${esc(r.items[day])} · ${esc(r.times[day])}</b>`;}
    return `<span>今天课程已结束</span><b>辛苦了</b>`;
  }
  function weekGrid(selected){
    const head=DAYS.map((d,i)=>`<button type="button" data-csv1-day="${i}" class="${i===selected?'on':''}">周${d}</button>`).join('');
    const rows=ROWS.filter(r=>r.kind!=='routine'||['晨间','午写'].includes(r.label)).map(r=>`<div class="csv1-week-time"><b>${esc(r.label)}</b><small>${esc(r.times[selected]||'')}</small></div>${DAYS.map((_,i)=>`<div class="csv1-week-cell ${cls(r.items[i])}">${esc(r.items[i]||'—')}</div>`).join('')}`).join('');
    return `<div class="csv1-week"><div class="csv1-week-corner">节次</div>${head}${rows}</div>`;
  }
  function body(card){
    const s=state(card);
    return `<div class="class-schedule-v1" data-csv1-root data-version="${VER}">
      <header class="csv1-head"><div><span>CLASS SCHEDULE</span><strong>课程表</strong></div><div class="csv1-view"><button type="button" data-csv1-view="day" class="${s.view==='day'?'on':''}">今日</button><button type="button" data-csv1-view="week" class="${s.view==='week'?'on':''}">本周</button></div></header>
      <div class="csv1-summary">${nowSummary(s.day)}</div>
      <nav class="csv1-days">${DAYS.map((d,i)=>`<button type="button" data-csv1-day="${i}" class="${i===s.day?'on':''}"><small>周</small><b>${d}</b></button>`).join('')}</nav>
      <div class="csv1-body ${s.view==='week'?'week-mode':''}">${s.view==='week'?weekGrid(s.day):dayRows(s.day)}</div>
      <footer><span>暂用当前课表 · 后续可编辑/导入</span><span>${DAY_NAMES[s.day]}</span></footer>
    </div>`;
  }
  function installStyle(){
    if(document.getElementById('classScheduleV1Style'))return;
    const s=document.createElement('style');s.id='classScheduleV1Style';s.textContent=`
.t-schedule{--icon:linear-gradient(145deg,#7dd3fc,#818cf8);--glow:linear-gradient(135deg,#7dd3fc,#818cf8)}
.class-schedule-v1{height:100%;min-height:360px;display:grid;grid-template-rows:auto auto auto minmax(0,1fr) auto;gap:10px;padding:12px;border-radius:18px;background:linear-gradient(145deg,rgba(250,252,255,.96),rgba(240,244,251,.94));color:#172033;overflow:hidden;container-type:inline-size}.csv1-head{display:flex;justify-content:space-between;align-items:center;gap:12px}.csv1-head>div:first-child span{display:block;font-size:9px;letter-spacing:.16em;opacity:.5}.csv1-head strong{font-size:20px;letter-spacing:.02em}.csv1-view{display:flex;padding:3px;border-radius:12px;background:rgba(15,23,42,.06)}.csv1-view button{border:0;background:transparent;border-radius:9px;padding:6px 10px;font-size:11px;color:inherit;cursor:pointer}.csv1-view button.on{background:#fff;box-shadow:0 4px 12px rgba(15,23,42,.08);font-weight:800}.csv1-summary{min-height:46px;border-radius:15px;padding:9px 12px;background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(14,165,233,.10));display:flex;flex-direction:column;justify-content:center}.csv1-summary span{font-size:10px;opacity:.55}.csv1-summary b{font-size:13px;margin-top:2px}.csv1-days{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.csv1-days button{min-width:0;border:0;border-radius:12px;padding:6px 4px;background:rgba(15,23,42,.055);color:inherit;cursor:pointer}.csv1-days button small{font-size:9px;opacity:.45}.csv1-days button b{display:block;font-size:13px}.csv1-days button.on{background:#1f2937;color:#fff;box-shadow:0 8px 18px rgba(31,41,55,.18)}.csv1-body{min-height:0;overflow:auto;padding-right:3px}.csv1-section{position:sticky;top:0;z-index:2;padding:7px 3px 4px;background:rgba(245,248,252,.94);backdrop-filter:blur(8px);font-size:10px;font-weight:800;opacity:.55}.csv1-row{position:relative;display:grid;grid-template-columns:88px minmax(0,1fr) 9px;align-items:center;gap:9px;min-height:48px;padding:6px 8px;border-radius:13px}.csv1-row:hover{background:rgba(15,23,42,.045)}.csv1-row.is-now{background:rgba(99,102,241,.11);box-shadow:inset 3px 0 #6366f1}.csv1-row.is-next{background:rgba(14,165,233,.07)}.csv1-row time{font-size:10px;font-variant-numeric:tabular-nums;opacity:.52}.csv1-lesson{min-width:0}.csv1-lesson strong{display:block;font-size:13px;white-space:normal}.csv1-lesson span{display:block;font-size:9px;margin-top:2px;opacity:.45}.csv1-dot{width:8px;height:8px;border-radius:50%;background:#94a3b8}.csv1-dot.cn,.csv1-week-cell.cn{--sub:#ef4444}.csv1-dot.math,.csv1-week-cell.math{--sub:#3b82f6}.csv1-dot.en,.csv1-week-cell.en{--sub:#8b5cf6}.csv1-dot.pe,.csv1-week-cell.pe{--sub:#10b981}.csv1-dot.music,.csv1-week-cell.music{--sub:#ec4899}.csv1-dot.art,.csv1-week-cell.art{--sub:#f59e0b}.csv1-dot.science,.csv1-week-cell.science{--sub:#06b6d4}.csv1-dot.moral,.csv1-week-cell.moral{--sub:#6366f1}.csv1-dot.read,.csv1-week-cell.read{--sub:#0ea5e9}.csv1-dot.calligraphy,.csv1-week-cell.calligraphy{--sub:#64748b}.csv1-dot{background:var(--sub,#94a3b8)}.csv1-week{min-width:720px;display:grid;grid-template-columns:104px repeat(5,minmax(105px,1fr));gap:5px;align-items:stretch}.csv1-week-corner,.csv1-week>button,.csv1-week-time,.csv1-week-cell{border-radius:10px;padding:8px}.csv1-week-corner{font-size:10px;font-weight:800;opacity:.45}.csv1-week>button{border:0;background:rgba(15,23,42,.06);cursor:pointer}.csv1-week>button.on{background:#1f2937;color:#fff}.csv1-week-time{display:flex;flex-direction:column;justify-content:center;background:rgba(15,23,42,.035)}.csv1-week-time b{font-size:10px}.csv1-week-time small{font-size:9px;opacity:.45}.csv1-week-cell{display:flex;align-items:center;justify-content:center;text-align:center;min-height:42px;background:color-mix(in srgb,var(--sub,#94a3b8) 10%,white);font-size:11px;font-weight:700}.class-schedule-v1 footer{display:flex;justify-content:space-between;gap:10px;font-size:9px;opacity:.42}.desktop-card.t-schedule{min-width:360px}.desktop-card.t-schedule .card-body{padding:0}.desktop-card.t-schedule .class-schedule-v1{border-radius:0;background:linear-gradient(145deg,rgba(250,252,255,.98),rgba(240,244,251,.97))}@container(max-width:520px){.csv1-head strong{font-size:17px}.csv1-summary{min-height:42px}.csv1-row{grid-template-columns:76px minmax(0,1fr) 8px}.csv1-view button{padding:5px 8px}.csv1-body.week-mode{overflow:auto}}
[data-theme="dark"] .class-schedule-v1{background:linear-gradient(145deg,rgba(24,32,48,.97),rgba(14,21,35,.96));color:#edf3ff}[data-theme="dark"] .csv1-view,[data-theme="dark"] .csv1-days button{background:rgba(255,255,255,.07)}[data-theme="dark"] .csv1-view button.on{background:rgba(255,255,255,.13)}[data-theme="dark"] .csv1-section{background:rgba(18,26,40,.94)}[data-theme="dark"] .csv1-week-cell{background:color-mix(in srgb,var(--sub,#94a3b8) 17%,#172033)}
    `;document.head.appendChild(s);
  }
  function patch(){
    ensureMeta();installStyle();
    try{
      if(typeof bodyHtml==='function'&&!bodyHtml.__csv1){const old=bodyHtml;const next=function(card,info){if(card?.appId===APP)return body(card);return old(card,info)};next.__csv1=1;bodyHtml=next;}
      if(typeof addCard==='function'&&!addCard.__csv1){const oldAdd=addCard;const nextAdd=function(id){if(id!==APP)return oldAdd(id);const i=activeWorkspace().cards.length;activeWorkspace().cards.push({id:'card-'+Date.now()+'-'+Math.random().toString(16).slice(2),appId:APP,x:72+(i%4)*34,y:72+(i%5)*28,w:540,h:600,collapsed:false,data:{scheduleDay:dayIndex(),scheduleView:'day'}});save();renderAll();};nextAdd.__csv1=1;addCard=nextAdd;}
      if(typeof renderShelf==='function')queueMicrotask(()=>renderShelf());
    }catch(e){}
  }
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-csv1-day],[data-csv1-view]');if(!btn)return;
    const root=btn.closest('[data-csv1-root]');if(!root)return;
    const card=cardByRoot(root);if(!card)return;
    card.data=card.data||{};
    if(btn.dataset.csv1Day!==undefined)card.data.scheduleDay=+btn.dataset.csv1Day;
    if(btn.dataset.csv1View)card.data.scheduleView=btn.dataset.csv1View;
    try{save();renderAll();}catch(err){}
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch,{once:true});else patch();
  setTimeout(patch,0);
  window.WebDeskClassSchedule={version:'v1',dataVersion:'20260901-source-image',rows:ROWS.length};
})();