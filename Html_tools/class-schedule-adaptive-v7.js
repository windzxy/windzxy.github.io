(function(){
'use strict';
const VER='20260901-class-schedule-adaptive-v7.1-perf';
if(window.__windzxyClassScheduleAdaptiveV7===VER)return;
window.__windzxyClassScheduleAdaptiveV7=VER;

function installStyle(){
  if(document.getElementById('classScheduleAdaptiveV7Style'))return;
  const s=document.createElement('style');
  s.id='classScheduleAdaptiveV7Style';
  s.textContent=`
.cs4.cs7-agenda{gap:9px;padding:11px 12px 10px}
.cs4.cs7-agenda .cs4-title span{display:none}
.cs4.cs7-agenda .cs4-title strong{font-size:17px}
.cs4.cs7-agenda .cs4-hero{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
.cs4.cs7-agenda .cs4-current,.cs4.cs7-agenda .cs4-next{min-height:82px}
.cs4.cs7-agenda .cs4-progress{grid-column:1/-1;min-height:58px;display:grid;grid-template-columns:auto 1fr;column-gap:12px;align-items:center}
.cs4.cs7-agenda .cs4-progress>span{grid-column:1}.cs4.cs7-agenda .cs4-progress>strong{grid-column:2;grid-row:1;text-align:right;font-size:17px}.cs4.cs7-agenda .cs4-progress .cs4-bar{grid-column:1/-1;margin-top:2px}.cs4.cs7-agenda .cs4-progress>small{grid-column:1/-1;margin-top:0}
.cs4.cs7-agenda .cs4-weekmeta{display:none}
.cs4.cs7-agenda .cs4-days{padding:2px 4px;gap:4px}.cs4.cs7-agenda .cs4-days button{height:38px}
.cs4.cs7-agenda .cs4-row{grid-template-columns:12px 82px minmax(0,1fr) auto;gap:8px;min-height:39px;padding:4px 7px}
.cs4.cs7-agenda .cs4-period{display:none}.cs4.cs7-agenda .cs4-row>strong{font-size:13px}.cs4.cs7-agenda .cs4-row time{font-size:11px}.cs4.cs7-agenda .cs4-row>em{font-size:9px;min-width:50px}

/* Focus mode is not a shrunken dashboard: it is a different information hierarchy. */
.cs4.cs7-focus{gap:8px;padding:9px 9px 8px}
.cs4.cs7-focus .cs4-head{min-height:28px}.cs4.cs7-focus .cs4-title{display:none}.cs4.cs7-focus .cs4-view{margin-left:auto}.cs4.cs7-focus .cs4-view button{height:27px;padding:0 9px;font-size:10px}
.cs4.cs7-focus .cs4-hero{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.cs4.cs7-focus .cs4-current{grid-column:1/-1;min-height:76px;padding:10px 12px}
.cs4.cs7-focus .cs4-current>span{font-size:10px;margin-bottom:5px}.cs4.cs7-focus .cs4-current>strong{font-size:18px}.cs4.cs7-focus .cs4-current>b{font-size:12px}.cs4.cs7-focus .cs4-current>small{font-size:10px;margin-top:4px}
.cs4.cs7-focus .cs4-next,.cs4.cs7-focus .cs4-progress{min-height:58px;padding:8px 9px;border-radius:13px}
.cs4.cs7-focus .cs4-next>span,.cs4.cs7-focus .cs4-progress>span{font-size:9px;margin-bottom:4px}.cs4.cs7-focus .cs4-next>strong,.cs4.cs7-focus .cs4-progress>strong{font-size:14px}.cs4.cs7-focus .cs4-next>b{font-size:10px;margin-top:4px}.cs4.cs7-focus .cs4-next>small,.cs4.cs7-focus .cs4-progress>small{display:none}.cs4.cs7-focus .cs4-progress .cs4-bar{height:5px;margin-top:6px}
.cs4.cs7-focus .cs4-weekmeta{display:none}
.cs4.cs7-focus .cs4-days{gap:2px;padding:2px;border-radius:11px}.cs4.cs7-focus .cs4-days button{height:34px;border-radius:8px}.cs4.cs7-focus .cs4-days button b{font-size:11px}.cs4.cs7-focus .cs4-days button small{font-size:9px}
.cs4.cs7-focus .cs4-section{height:26px;margin:3px 0 2px;padding:0 7px;border-radius:8px;box-shadow:none}.cs4.cs7-focus .cs4-section span{font-size:10px}.cs4.cs7-focus .cs4-section b{font-size:10px}
.cs4.cs7-focus .cs4-row{grid-template-columns:10px 78px minmax(0,1fr);gap:7px;min-height:38px;padding:4px 5px;border-radius:9px}.cs4.cs7-focus .cs4-row:before{left:10px}.cs4.cs7-focus .cs4-node{width:7px;height:7px}.cs4.cs7-focus .cs4-row time{font-size:11px}.cs4.cs7-focus .cs4-row>strong{font-size:13px;line-height:1.2}.cs4.cs7-focus .cs4-period,.cs4.cs7-focus .cs4-row>em{display:none}
.cs4.cs7-focus.cs7-filter-past:not(.cs7-show-past) .cs4-row.cs7-past{display:none}
.cs4.cs7-focus.cs7-filter-past:not(.cs7-show-past) .cs4-section.cs7-empty-section{display:none}
.cs7-past-toggle{display:none;width:100%;height:30px;margin:0 0 4px;border:1px solid color-mix(in srgb,var(--line) 58%,transparent);border-radius:9px;background:color-mix(in srgb,var(--panel2) 64%,transparent);color:var(--muted);font:700 10px/1 inherit;cursor:pointer}
.cs4.cs7-focus.cs7-filter-past .cs7-past-toggle{display:block}.cs7-past-toggle:hover{color:var(--ink);background:color-mix(in srgb,var(--panel2) 82%,transparent)}
.cs4.cs7-focus .cs4-content{scrollbar-width:none;padding-right:0}.cs4.cs7-focus .cs4-content::-webkit-scrollbar{width:0;height:0}
.cs4.cs7-focus.cs7-low .cs4-next>small,.cs4.cs7-focus.cs7-low .cs4-current>small{display:none}.cs4.cs7-focus.cs7-low .cs4-current{min-height:66px}.cs4.cs7-focus.cs7-low .cs4-next,.cs4.cs7-focus.cs7-low .cs4-progress{min-height:52px}.cs4.cs7-focus.cs7-low .cs4-days button{height:30px}.cs4.cs7-focus.cs7-low .cs4-row{min-height:35px}

/* Never trade readability for density. */
.cs4.cs7-agenda .cs4-row time,.cs4.cs7-focus .cs4-row time{font-size:max(11px,.68rem)}
.cs4.cs7-agenda .cs4-row>strong,.cs4.cs7-focus .cs4-row>strong{font-size:max(13px,.8rem)}
`;
  document.head.appendChild(s);
}

function nowSeconds(){const d=new Date();return d.getHours()*3600+d.getMinutes()*60+d.getSeconds()}
function parseEnd(text){const m=String(text||'').match(/(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})/);return m?(+m[3])*3600+(+m[4])*60:null}
function todayIndex(){const d=new Date().getDay();return d>=1&&d<=5?d-1:-1}
function selectedIndex(root){const buttons=[...root.querySelectorAll('.cs4-days [data-cs4-day]')];return buttons.findIndex(b=>b.classList.contains('on'))}
function markSections(root){
  const content=root.querySelector('.cs4-content');if(!content)return;
  let section=null,rows=[];
  function flush(){if(!section)return;const visible=rows.some(r=>!r.classList.contains('cs7-past'));section.classList.toggle('cs7-empty-section',!visible);}
  [...content.children].forEach(el=>{if(el.classList.contains('cs4-section')){flush();section=el;rows=[]}else if(el.classList.contains('cs4-row'))rows.push(el)});flush();
}
function updatePast(root){
  const content=root.querySelector('.cs4-content');if(!content)return;
  const week=content.classList.contains('week');
  const selected=selectedIndex(root),today=todayIndex();
  const eligible=!week&&today>=0&&selected===today;
  let count=0;const now=nowSeconds();
  root.querySelectorAll('.cs4-row').forEach(row=>{const end=parseEnd(row.querySelector('time')?.textContent);const past=eligible&&end!==null&&end<now&&!row.classList.contains('is-now');row.classList.toggle('cs7-past',past);if(past)count++});
  root.classList.toggle('cs7-filter-past',eligible&&count>0);
  let toggle=content.querySelector(':scope > .cs7-past-toggle');
  if(eligible&&count>0){
    if(!toggle){toggle=document.createElement('button');toggle.type='button';toggle.className='cs7-past-toggle';content.prepend(toggle)}
    toggle.textContent=root.classList.contains('cs7-show-past')?`收起已完成课程`:`上午/较早课程已完成 ${count} 项 · 查看完整今日课表`;
  }else if(toggle){toggle.remove();root.classList.remove('cs7-show-past')}
  markSections(root);
}
function applyMode(root){
  const r=root.getBoundingClientRect(),w=r.width,h=r.height;
  const mode=w>=700?'dashboard':w>=440?'agenda':'focus';
  root.classList.toggle('cs7-dashboard',mode==='dashboard');root.classList.toggle('cs7-agenda',mode==='agenda');root.classList.toggle('cs7-focus',mode==='focus');root.classList.toggle('cs7-low',h<560);
  root.dataset.cs7Mode=mode;
  if(mode!=='focus')root.classList.remove('cs7-show-past');
  updatePast(root);
}
const observer=new ResizeObserver(entries=>entries.forEach(e=>applyMode(e.target)));
function bind(root){if(root.dataset.cs7Bound)return;root.dataset.cs7Bound='1';observer.observe(root);applyMode(root)}
function scan(){document.querySelectorAll('.class-schedule-v1.cs4').forEach(bind)}
function scanNode(node){
  if(!node||node.nodeType!==1)return;
  if(node.matches?.('.class-schedule-v1.cs4'))bind(node);
  node.querySelectorAll?.('.class-schedule-v1.cs4').forEach(bind);
}
function boot(){
  installStyle();
  scan();
  const target=document.getElementById('windowLayer')||document.body;
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(scanNode))).observe(target,{childList:true,subtree:true});
  setInterval(()=>{
    if(document.hidden)return;
    document.querySelectorAll('.class-schedule-v1.cs4').forEach(updatePast);
  },30000);
}
document.addEventListener('click',e=>{const b=e.target.closest('.cs7-past-toggle');if(b){const root=b.closest('.cs4');if(root){root.classList.toggle('cs7-show-past');updatePast(root)}}},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskClassScheduleAdaptive={version:'v7.1',modes:['dashboard','agenda','focus'],observer:'scoped-incremental'};
})();