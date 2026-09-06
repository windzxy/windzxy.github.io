(function(){
'use strict';
const APP='class-schedule';
const VER='20260906-class-schedule-v5-semester-calendar';
if(window.__windzxyClassScheduleV4===VER)return;
window.__windzxyClassScheduleV4=VER;
const DAYS=['一','二','三','四','五'];
const DAY_NAMES=['星期一','星期二','星期三','星期四','星期五'];
const SUBJECT_CLASS={'语文':'cn','語文':'cn','数学':'math','數學':'math','英语':'en','英語':'en','体育':'pe','體育':'pe','音乐':'music','音樂':'music','美术':'art','美術':'art','科学':'science','科學':'science','道法':'moral','书法':'calligraphy','書法':'calligraphy','阅读':'read','閱讀':'read','综合':'general','綜合':'general','劳动':'labor','勞動':'labor','心理':'psych','班活':'class','延时1':'care','延時1':'care','延时2':'care','延時2':'care','早读':'read','早讀':'read','升旗':'flag','午写':'write','午寫':'write','跑操':'pe','眼保健操':'care'};
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
{section:'课后服务',label:'第二节',times:['16:40-17:10','16:40-17:10','16:40-17:10','16:40-17:10','16:40-17:10'],items:['延时2','延时2','延时2','延时2','延时2'],kind:'care'}];

// 2026-2027 第一学期周次表。单双周必须按“学期周次”判断，不使用 ISO 自然周。
const SEMESTER_WEEKS=[
['2026-08-30','2026-09-05',1,'暑假；9月1日开学、上课'],
['2026-09-06','2026-09-12',2,'上课'],
['2026-09-13','2026-09-19',3,'上课'],
['2026-09-20','2026-09-26',4,'上课；中秋节'],
['2026-09-27','2026-10-03',5,'上课；国庆节'],
['2026-10-04','2026-10-10',6,'国庆节；上课'],
['2026-10-11','2026-10-17',7,'上课'],
['2026-10-18','2026-10-24',8,'上课'],
['2026-10-25','2026-10-31',9,'上课'],
['2026-11-01','2026-11-07',10,'上课'],
['2026-11-08','2026-11-14',11,'上课'],
['2026-11-15','2026-11-21',12,'上课'],
['2026-11-22','2026-11-28',13,'上课'],
['2026-11-29','2026-12-05',14,'上课'],
['2026-12-06','2026-12-12',15,'上课'],
['2026-12-13','2026-12-19',16,'上课'],
['2026-12-20','2026-12-26',17,'上课'],
['2026-12-27','2027-01-02',18,'上课；元旦'],
['2027-01-03','2027-01-09',19,'上课'],
['2027-01-10','2027-01-16',20,'上课'],
['2027-01-17','2027-01-23',21,'上课；复习考试；义务教育阶段学校1月23日起寒假'],
['2027-01-24','2027-01-30',22,'普通高中学校1月30日起寒假']
].map(([start,end,week,note])=>({start,end,week,note}));

function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function localDateKey(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;}
function dateFromKey(key){const [y,m,d]=String(key).split('-').map(Number);return new Date(y,m-1,d,12,0,0,0);}
function weekendMode(){const d=new Date().getDay();return d===0||d===6;}
function dayIndex(){const d=new Date().getDay();return d>=1&&d<=5?d-1:0;}
function displayMonday(){
  const d=new Date();const wd=d.getDay();d.setHours(12,0,0,0);
  if(wd===6)d.setDate(d.getDate()+2);
  else if(wd===0)d.setDate(d.getDate()+1);
  else d.setDate(d.getDate()-(wd-1));
  return d;
}
function dateForDay(i){const d=displayMonday();d.setDate(d.getDate()+i);return d;}
function dateLabel(i){const d=dateForDay(i);return `${d.getMonth()+1}/${d.getDate()}`;}
function semesterInfo(date=displayMonday()){
  const key=localDateKey(date);
  const row=SEMESTER_WEEKS.find(w=>key>=w.start&&key<=w.end);
  if(row)return row;
  const base=dateFromKey('2026-08-30');
  const week=Math.floor((date-base)/604800000)+1;
  return {week:Math.max(1,week),note:'周次表范围外（待更新）',fallback:true};
}
function semesterWeek(){return semesterInfo().week;}
function isoWeekParity(){return semesterWeek()%2===1?'odd':'even';}
function parityLabel(){return isoWeekParity()==='odd'?'单周':'双周';}
function resolveItem(v){const s=String(v||'');if(!s.includes('（单）')&&!s.includes('（双）'))return s;const parts=s.split('/').map(x=>x.trim());const odd=isoWeekParity()==='odd';const pick=parts.find(x=>odd?x.includes('（单）'):x.includes('（双）'))||parts[0];return pick.replace(/（单）|（双）/g,'').trim();}
function subjectBase(v){return resolveItem(v).replace(/（.*?）/g,'').split('/')[0].trim();}
function cls(v){const b=subjectBase(v);return SUBJECT_CLASS[b]||SUBJECT_CLASS[v]||'other';}
function toSec(v){if(!v)return null;const m=String(v).match(/^(\d{1,2}):(\d{2})/);return m?(+m[1])*3600+(+m[2])*60:null;}
function rangeSec(v){if(!v)return [null,null];const a=String(v).split('-');return [toSec(a[0]),toSec(a[1])];}
function nowSec(){const d=new Date();return d.getHours()*3600+d.getMinutes()*60+d.getSeconds();}
function validRow(day,i){const r=ROWS[i];return !!(r&&r.times[day]&&r.items[day]&&r.items[day]!=='—');}
function nextValid(day,start){for(let i=start;i<ROWS.length;i++)if(validRow(day,i))return i;return -1;}
function statusFor(day){const today=dayIndex(),wd=new Date().getDay();if(day!==today||wd===0||wd===6)return {current:-1,next:nextValid(day,0),progress:0,countdown:0,mode:'view'};const now=nowSec();let next=-1;for(let i=0;i<ROWS.length;i++){if(!validRow(day,i))continue;const [s,e]=rangeSec(ROWS[i].times[day]);if(now>=s&&now<=e){return {current:i,next:nextValid(day,i+1),progress:Math.max(0,Math.min(100,(now-s)/(e-s)*100)),countdown:Math.max(0,e-now),mode:'class'};}if(now<s&&next<0)next=i;}return {current:-1,next,progress:0,countdown:next>=0?Math.max(0,rangeSec(ROWS[next].times[day])[0]-now):0,mode:next>=0?'next':'done'};}
function fmtCountdown(sec){if(!Number.isFinite(sec)||sec<0)return '--:--';const m=Math.floor(sec/60),s=Math.floor(sec%60);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function state(card){
  const todayKey=localDateKey();
  const saved=Number(card?.data?.scheduleDay);
  const fresh=card?.data?.scheduleDateKey===todayKey;
  return {day:fresh&&Number.isInteger(saved)&&saved>=0&&saved<5?saved:dayIndex(),view:card?.data?.scheduleView==='week'?'week':'day'};
}
function cardByRoot(root){try{const id=root.closest('[data-card-id]')?.dataset.cardId;return activeWorkspace().cards.find(c=>String(c.id)===String(id));}catch(e){return null;}}
function ensureMeta(){try{if(!Array.isArray(apps))return;let a=apps.find(x=>x.id===APP);const info={id:APP,kind:'widget',title:'课程表',desc:'按学期周次自动识别单双周；周末自动预览下周。',icon:'课',tone:'t-schedule'};a?Object.assign(a,info):apps.push(info);}catch(e){}}
function itemInfo(day,index,fallback){if(index<0)return {name:fallback||'暂无安排',time:'—',label:''};const r=ROWS[index];return {name:resolveItem(r.items[day]),time:r.times[day],label:r.label};}
function summaryCards(day){
  const st=statusFor(day),week=semesterInfo();
  const current=itemInfo(day,st.current,st.mode==='done'?'今日已结束':weekendMode()?'下周一课程':'暂无进行中');
  const next=itemInfo(day,st.next,st.mode==='done'?'明天见':'暂无下一项');
  const live=day===dayIndex()&&!weekendMode();
  const countdownTitle=st.mode==='class'?'距下课':st.mode==='next'?'距下一项':weekendMode()?'下周预览':'今日进度';
  const progress=st.mode==='class'?Math.round(st.progress):st.mode==='done'?100:0;
  const special=isoWeekParity()==='odd'?'综合 · 班活':'劳动 · 心理';
  const note=week.note||'上课';
  return `<section class="cs4-hero">
<div class="cs4-stat cs4-current"><span>${live&&st.current>=0?'正在上课':weekendMode()?'下周一':'当前查看'}</span><strong>${esc(current.name)}</strong><b>${esc(current.time)}</b><small>${esc(current.label||DAY_NAMES[day])} · ${dateLabel(day)}</small></div>
<div class="cs4-stat cs4-next"><span>${weekendMode()?'下周一首项':'下一节课'}</span><strong>${esc(next.name)}</strong><b>${esc(next.time)}</b><small>${esc(next.label||'')}</small></div>
<div class="cs4-stat cs4-progress"><span>${countdownTitle}</span><strong data-cs4-countdown>${live?fmtCountdown(st.countdown):'—'}</strong><div class="cs4-bar"><i data-cs4-progressbar style="width:${progress}%"></i></div><small>本节进度 <b data-cs4-progress>${progress}%</b></small></div>
<div class="cs4-stat cs4-weekmeta"><span>学期周次 · 单 / 双周</span><strong>第${week.week}周 · ${parityLabel()}</strong><b>${special}</b><small>${esc(note)}</small></div>
</section>`;
}
function sectionIcon(section){return section==='上午'?'☀':section==='下午'?'☼':'◔';}
function rowTag(r,item){if(r.kind==='care')return '延时服务';if(r.kind==='routine')return r.label;return r.label;}
function dayRows(day){const st=statusFor(day);let last='';return ROWS.map((r,i)=>{if(!validRow(day,i))return '';const item=resolveItem(r.items[day]);const head=r.section!==last?`<div class="cs4-section ${r.section==='下午'?'afternoon':r.section==='课后服务'?'after':''}"><span>${sectionIcon(r.section)}</span><b>${esc(r.section)}</b></div>`:'';last=r.section;const live=i===st.current?' is-now':i===st.next?' is-next':'';return `${head}<div class="cs4-row${live}"><i class="cs4-node ${cls(item)}"></i><time>${esc(r.times[day])}</time><span class="cs4-period">${esc(r.label)}</span><strong>${esc(item)}</strong><em>${esc(rowTag(r,item))}</em></div>`;}).join('');}
function weekGrid(selected){const rows=ROWS.filter(r=>r.kind!=='routine'||['晨间','午写'].includes(r.label)).map(r=>`<div class="cs4-week-label"><b>${esc(r.label)}</b><small>${esc(r.times[selected]||'')}</small></div>${DAYS.map((_,i)=>`<div class="cs4-week-cell ${cls(r.items[i])}">${esc(validRow(i,ROWS.indexOf(r))?resolveItem(r.items[i]):'—')}</div>`).join('')}`).join('');return `<div class="cs4-week-grid"><div class="cs4-week-corner">节次</div>${DAYS.map((d,i)=>`<button type="button" data-cs4-day="${i}" class="${i===selected?'on':''}"><b>周${d}</b><small>${dateLabel(i)}</small></button>`).join('')}${rows}</div>`;}
function body(card){
  const s=state(card),weekend=weekendMode();
  return `<div class="class-schedule-v1 cs4" data-cs4-root data-version="${VER}"><header class="cs4-head"><div class="cs4-title"><span>CLASS SCHEDULE</span><strong>课程表</strong></div><div class="cs4-view"><button type="button" data-cs4-view="day" class="${s.view==='day'?'on':''}">${weekend?'下周一':'今日'}</button><button type="button" data-cs4-view="week" class="${s.view==='week'?'on':''}">${weekend?'下周':'本周'}</button></div></header>${summaryCards(s.day)}<nav class="cs4-days">${DAYS.map((d,i)=>`<button type="button" data-cs4-day="${i}" class="${i===s.day?'on':''}"><b>${d}</b><small>${dateLabel(i)}</small></button>`).join('')}</nav><div class="cs4-content ${s.view==='week'?'week':''}">${s.view==='week'?weekGrid(s.day):dayRows(s.day)}</div></div>`;
}
function installBaseStyle(){if(document.getElementById('classScheduleV4BaseStyle'))return;const s=document.createElement('style');s.id='classScheduleV4BaseStyle';s.textContent=`.desktop-card.t-schedule{min-width:390px}.desktop-card.t-schedule .card-body{padding:0;overflow:hidden}.t-schedule{--icon:linear-gradient(145deg,#38bdf8,#6366f1);--glow:linear-gradient(135deg,#38bdf8,#8b5cf6)}.cs4{height:100%;min-height:0;overflow:hidden;container-type:inline-size}`;document.head.appendChild(s);}
function patch(){ensureMeta();installBaseStyle();try{if(typeof bodyHtml==='function'&&!bodyHtml.__cs4){const old=bodyHtml;const next=function(card,info){return card?.appId===APP?body(card):old(card,info)};next.__cs4=1;bodyHtml=next;}if(typeof addCard==='function'&&!addCard.__cs4){const oldAdd=addCard;const nextAdd=function(id){if(id!==APP)return oldAdd(id);const ws=activeWorkspace(),i=ws.cards.length;ws.cards.push({id:'card-'+Date.now()+'-'+Math.random().toString(16).slice(2),appId:APP,x:72+(i%4)*34,y:72+(i%5)*28,w:860,h:650,collapsed:false,data:{scheduleDay:dayIndex(),scheduleDateKey:localDateKey(),scheduleView:'day'}});save();renderAll();};nextAdd.__cs4=1;addCard=nextAdd;}if(typeof renderShelf==='function')queueMicrotask(()=>renderShelf());}catch(e){console.warn('class schedule v5 patch failed',e);}}
document.addEventListener('click',e=>{const btn=e.target.closest('[data-cs4-day],[data-cs4-view]');if(!btn)return;const root=btn.closest('[data-cs4-root]');if(!root)return;const card=cardByRoot(root);if(!card)return;card.data=card.data||{};if(btn.dataset.cs4Day!==undefined){card.data.scheduleDay=+btn.dataset.cs4Day;card.data.scheduleDateKey=localDateKey();}if(btn.dataset.cs4View)card.data.scheduleView=btn.dataset.cs4View;try{save();renderAll();}catch(err){}},true);
let lastStatus='';function liveTick(){document.querySelectorAll('[data-cs4-root]').forEach(root=>{const card=cardByRoot(root);if(!card)return;const s=state(card),st=statusFor(s.day);const live=s.day===dayIndex()&&!weekendMode();root.querySelectorAll('[data-cs4-countdown]').forEach(el=>el.textContent=live?fmtCountdown(st.countdown):'—');root.querySelectorAll('[data-cs4-progress]').forEach(el=>el.textContent=`${Math.round(st.mode==='class'?st.progress:st.mode==='done'?100:0)}%`);root.querySelectorAll('[data-cs4-progressbar]').forEach(el=>el.style.width=`${Math.round(st.mode==='class'?st.progress:st.mode==='done'?100:0)}%`);});const key=`${localDateKey()}-${semesterWeek()}-${dayIndex()}-${statusFor(dayIndex()).current}-${statusFor(dayIndex()).next}`;if(lastStatus&&key!==lastStatus){try{renderAll();}catch(e){}}lastStatus=key;}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch,{once:true});else patch();setTimeout(patch,0);setInterval(liveTick,1000);
window.WebDeskClassSchedule={version:'v5',dataVersion:'20260906-first-semester-week-table',rows:ROWS.length,semesterWeeks:SEMESTER_WEEKS.length,weekendForward:true};
})();