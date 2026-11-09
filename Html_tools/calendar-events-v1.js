(function(){
'use strict';
const VER='20261109-calendar-events-v1.1';
if(window.__windzxyCalendarEvents===VER)return;
window.__windzxyCalendarEvents=VER;
const STORE='windzxy_calendar_events_v1',DB='windzxy-calendar-local',TABLE='events';
const CATS=['personal','work','family','birthday','travel','reminder'];
const NAMES={personal:['Personal','個人','个人'],work:['Work','工作','工作'],family:['Family','家庭','家庭'],birthday:['Birthday','生日','生日'],travel:['Travel','旅行','旅行'],reminder:['Reminder','提醒','提醒']};
let events=loadLocal(),dbPromise=null;
function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||localStorage.getItem('webdesk-lang')||document.documentElement.lang||'zh-HK';return /^en/i.test(v)?0:(/^zh-CN/i.test(v)||/Hans/i.test(v))?2:1;}
function t(a,b,c){return [a,b,c][lang()];}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function dateKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function parseKey(v){const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?new Date(+m[1],+m[2]-1,+m[3]):new Date();}
function makeId(){return window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():'evt-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
function clean(x){
 if(!x||typeof x!=='object')return null;
 const title=String(x.title||'').trim().slice(0,120),date=String(x.date||'');
 if(!title||!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
 return {id:String(x.id||makeId()),title,date,start:x.allDay?'':String(x.start||'09:00').slice(0,5),end:x.allDay?'':String(x.end||'10:00').slice(0,5),allDay:!!x.allDay,category:CATS.includes(x.category)?x.category:'personal',repeat:['none','daily','weekly','monthly','yearly'].includes(x.repeat)?x.repeat:'none',reminder:[0,5,10,15,30,60].includes(+x.reminder)?+x.reminder:0,note:String(x.note||'').slice(0,1000),updatedAt:+x.updatedAt||Date.now()};
}
function loadLocal(){try{const a=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(a)?a.map(clean).filter(Boolean):[];}catch(e){return[];}}
function openDB(){
 if(dbPromise)return dbPromise;
 dbPromise=new Promise(resolve=>{
  if(!window.indexedDB){resolve(null);return;}
  let req;try{req=indexedDB.open(DB,1);}catch(e){resolve(null);return;}
  req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains(TABLE))req.result.createObjectStore(TABLE,{keyPath:'id'});};
  req.onsuccess=function(){resolve(req.result);};req.onerror=function(){resolve(null);};req.onblocked=function(){resolve(null);};
 });
 return dbPromise;
}
function persist(){
 try{localStorage.setItem(STORE,JSON.stringify(events));}catch(e){}
 openDB().then(function(db){if(!db)return;try{const tx=db.transaction(TABLE,'readwrite'),store=tx.objectStore(TABLE);store.clear();events.forEach(function(e){store.put(e);});}catch(err){}});
 document.dispatchEvent(new CustomEvent('webdesk-calendar-events-updated'));
}
async function hydrate(){
 const db=await openDB();if(!db)return;
 try{
  const rows=await new Promise(function(resolve){const q=db.transaction(TABLE,'readonly').objectStore(TABLE).getAll();q.onsuccess=function(){resolve(q.result||[]);};q.onerror=function(){resolve([]);};});
  const map=new Map();rows.map(clean).filter(Boolean).forEach(function(e){map.set(e.id,e);});
  events.forEach(function(e){const old=map.get(e.id);if(!old||e.updatedAt>=old.updatedAt)map.set(e.id,e);});
  events=Array.from(map.values());try{localStorage.setItem(STORE,JSON.stringify(events));}catch(e){}
  persist();
 }catch(e){}
}
function occurs(e,d){
 const a=parseKey(e.date),b=new Date(d.getFullYear(),d.getMonth(),d.getDate());
 if(b<new Date(a.getFullYear(),a.getMonth(),a.getDate()))return false;
 const n=Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/86400000);
 if(e.repeat==='daily')return true;
 if(e.repeat==='weekly')return n%7===0;
 if(e.repeat==='monthly')return b.getDate()===a.getDate();
 if(e.repeat==='yearly')return b.getMonth()===a.getMonth()&&b.getDate()===a.getDate();
 return n===0;
}
function forDate(d){return events.filter(function(e){return occurs(e,d);}).sort(function(a,b){return (a.allDay?'00:00':a.start||'99:99').localeCompare(b.allDay?'00:00':b.start||'99:99');});}
function category(c){return t.apply(null,NAMES[c]||NAMES.personal);}
function eventTime(e){return e.allDay?t('All day','全天','全天'):(e.start||'09:00')+(e.end?'–'+e.end:'');}
function badgeMarkup(d,limit){
 const a=forDate(d),n=limit||1;if(!a.length)return '';
 return '<span class="cal11-event-badges">'+a.slice(0,n).map(function(e){return '<span class="cal11-event-badge cat-'+e.category+'" data-cal11-event-id="'+esc(e.id)+'" title="'+esc(e.title)+'"><i></i>'+esc(e.allDay?'':e.start+' ')+esc(e.title)+'</span>';}).join('')+(a.length>n?'<span class="cal11-event-more">+'+(a.length-n)+'</span>':'')+'</span>';
}
function eventButton(e){return '<button type="button" class="cal11-event-item cat-'+e.category+'" data-cal11-event-id="'+esc(e.id)+'"><span class="cal11-event-time">'+esc(eventTime(e))+'</span><span class="cal11-event-title">'+esc(e.title)+'</span>'+(e.note?'<small>'+esc(e.note)+'</small>':'')+'</button>';}
function listMarkup(d){const a=forDate(d);return a.length?'<div class="cal11-event-list">'+a.map(eventButton).join('')+'</div>':'<div class="cal11-empty-events">'+t('No personal events','尚未安排日程','尚未安排日程')+'</div>';}
function sideMarkup(d){
 const a=forDate(d);
 return '<section class="cal11-user-events"><header><h3>'+t('My events','我的日程','我的日程')+'</h3><button type="button" data-cal11-action="add-event">＋</button></header>'+(a.length?a.map(function(e){return '<button type="button" class="cal11-user-event cat-'+e.category+'" data-cal11-event-id="'+esc(e.id)+'"><b>'+esc(e.allDay?t('All day','全天','全天'):e.start)+'</b><span>'+esc(e.title)+'</span></button>';}).join(''):'<p>'+t('No events for this date','當日沒有日程','当天没有日程')+'</p>')+'</section>';
}
function toolbarMarkup(){
 return '<div class="cal11-event-tools"><button type="button" data-cal11-action="add-event" title="'+t('Add event','新增日程','新增日程')+'">＋ <span>'+t('Add','新增','新增')+'</span></button><button type="button" data-cal11-action="enable-notifications" title="'+t('Enable reminders','開啟提醒','开启提醒')+'">♧</button><button type="button" data-cal11-action="export-json" title="'+t('Back up','備份','备份')+'">↓</button><button type="button" data-cal11-action="export-ics" title="'+t('Export ICS','匯出 ICS','导出 ICS')+'">▤</button><button type="button" data-cal11-action="import-file" title="'+t('Import','匯入','导入')+'">↑</button><input type="file" accept=".json,.ics,application/json,text/calendar" data-cal11-import-file hidden></div>';
}
function modalMarkup(){
 return '<div class="cal11-event-modal" data-cal11-event-modal hidden><div class="cal11-event-backdrop" data-cal11-action="close-modal"></div><section class="cal11-event-dialog" role="dialog" aria-modal="true"><header><div><small>'+t('PERSONAL CALENDAR','個人日曆','个人日历')+'</small><h3 data-cal11-modal-title>'+t('New event','新增日程','新增日程')+'</h3></div><button type="button" data-cal11-action="close-modal">×</button></header><form data-cal11-event-form><input type="hidden" name="id"><label>'+t('Title','標題','标题')+'<input name="title" maxlength="120" required></label><div class="cal11-form-grid"><label>'+t('Date','日期','日期')+'<input type="date" name="date" required></label><label class="cal11-all-day"><input type="checkbox" name="allDay"><span>'+t('All day','全天','全天')+'</span></label></div><div class="cal11-form-grid cal11-time-fields"><label>'+t('Start','開始','开始')+'<input type="time" name="start" value="09:00"></label><label>'+t('End','結束','结束')+'<input type="time" name="end" value="10:00"></label></div><div class="cal11-form-grid"><label>'+t('Category','類別','类别')+'<select name="category">'+CATS.map(function(c){return '<option value="'+c+'">'+category(c)+'</option>';}).join('')+'</select></label><label>'+t('Repeat','重複','重复')+'<select name="repeat"><option value="none">'+t('Never','不重複','不重复')+'</option><option value="daily">'+t('Daily','每天','每天')+'</option><option value="weekly">'+t('Weekly','每週','每周')+'</option><option value="monthly">'+t('Monthly','每月','每月')+'</option><option value="yearly">'+t('Yearly','每年','每年')+'</option></select></label></div><div class="cal11-form-grid"><label>'+t('Reminder','提醒','提醒')+'<select name="reminder"><option value="0">'+t('None','不提醒','不提醒')+'</option><option value="5">5 '+t('minutes before','分鐘前','分钟前')+'</option><option value="10">10 '+t('minutes before','分鐘前','分钟前')+'</option><option value="15">15 '+t('minutes before','分鐘前','分钟前')+'</option><option value="30">30 '+t('minutes before','分鐘前','分钟前')+'</option><option value="60">1 '+t('hour before','小時前','小时前')+'</option></select></label><label>'+t('Notes','備註','备注')+'<textarea name="note" rows="2" maxlength="1000"></textarea></label></div><footer><button type="button" class="danger" data-cal11-action="delete-event" hidden>'+t('Delete','刪除','删除')+'</button><span></span><button type="button" data-cal11-action="close-modal">'+t('Cancel','取消','取消')+'</button><button type="button" class="primary" data-cal11-action="save-event">'+t('Save','保存','保存')+'</button></footer></form></section></div>';
}
function rootOf(el){return el&&el.closest?el.closest('.calendar-v11'):null;}
function openEditor(root,e,d){
 const modal=root&&root.querySelector('[data-cal11-event-modal]'),form=modal&&modal.querySelector('[data-cal11-event-form]');if(!modal||!form)return;
 const f=form.elements;f.id.value=e?e.id:'';f.title.value=e?e.title:'';f.date.value=e?e.date:(d||root.dataset.cal11Date);f.allDay.checked=!!(e&&e.allDay);
 f.start.value=e?e.start:'09:00';f.end.value=e?e.end:'10:00';f.category.value=e?e.category:'personal';f.repeat.value=e?e.repeat:'none';f.reminder.value=String(e?e.reminder:0);f.note.value=e?e.note:'';
 modal.querySelector('[data-cal11-modal-title]').textContent=e?t('Edit event','編輯日程','编辑日程'):t('New event','新增日程','新增日程');
 modal.querySelector('[data-cal11-action="delete-event"]').hidden=!e;modal.querySelector('.cal11-time-fields').hidden=!!(e&&e.allDay);modal.hidden=false;setTimeout(function(){f.title.focus();},30);
}
function closeEditor(root){const m=root&&root.querySelector('[data-cal11-event-modal]');if(m)m.hidden=true;}
function saveEditor(root){
 const m=root.querySelector('[data-cal11-event-modal]'),form=m&&m.querySelector('form');if(!form||!form.reportValidity())return;
 const f=form.elements,all=f.allDay.checked;
 if(!all&&f.start.value&&f.end.value&&f.end.value<=f.start.value){f.end.setCustomValidity(t('End must be later than start','結束時間必須晚於開始時間','结束时间必须晚于开始时间'));f.end.reportValidity();f.end.setCustomValidity('');return;}
 const e=clean({id:f.id.value||makeId(),title:f.title.value,date:f.date.value,start:f.start.value,end:f.end.value,allDay:all,category:f.category.value,repeat:f.repeat.value,reminder:+f.reminder.value,note:f.note.value,updatedAt:Date.now()});if(!e)return;
 const i=events.findIndex(function(x){return x.id===e.id;});if(i<0)events.push(e);else events[i]=e;closeEditor(root);persist();
}
function deleteEditor(root){
 const f=root.querySelector('[data-cal11-event-form]')?.elements,id=f&&f.id.value;if(!id)return;
 if(!confirm(t('Delete this event and its repeating series?','確定刪除此日程及其重複系列？','确定删除此日程及其重复系列？')))return;
 events=events.filter(function(e){return e.id!==id;});closeEditor(root);persist();
}
function download(name,type,body){const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
function exportJSON(){download('webdesk-calendar-events.json','application/json;charset=utf-8',JSON.stringify({version:1,events:events},null,2));}
function escapeICS(v){return String(v||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function exportICS(){
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//WebDesk//Calendar//EN','CALSCALE:GREGORIAN'];
 events.forEach(function(e){
  const d=e.date.replace(/-/g,''),tm=(e.start||'09:00').replace(':','')+'00';
  lines.push('BEGIN:VEVENT','UID:'+escapeICS(e.id)+'@webdesk','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'),(e.allDay?'DTSTART;VALUE=DATE:':'DTSTART:')+(e.allDay?d:d+'T'+tm));
  if(e.allDay){const next=parseKey(e.date);next.setDate(next.getDate()+1);lines.push('DTEND;VALUE=DATE:'+dateKey(next));}else if(e.end)lines.push('DTEND:'+d+'T'+e.end.replace(':','')+'00');
  lines.push('SUMMARY:'+escapeICS(e.title));if(e.note)lines.push('DESCRIPTION:'+escapeICS(e.note));
  if(e.repeat!=='none')lines.push('RRULE:FREQ='+({daily:'DAILY',weekly:'WEEKLY',monthly:'MONTHLY',yearly:'YEARLY'}[e.repeat]));
  if(e.reminder)lines.push('BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:-PT'+e.reminder+'M','DESCRIPTION:'+escapeICS(e.title),'END:VALARM');
  lines.push('END:VEVENT');
 });
 lines.push('END:VCALENDAR');download('webdesk-calendar.ics','text/calendar;charset=utf-8',lines.join('\r\n'));
}
function unescapeICS(v){return String(v||'').replace(/\\n/gi,'\n').replace(/\\,/g,',').replace(/\\;/g,';').replace(/\\\\/g,'\\');}
function parseICSDate(v){const m=String(v||'').match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);return m?{date:m[1]+'-'+m[2]+'-'+m[3],time:m[4]?m[4]+':'+m[5]:'',allDay:!m[4]}:null;}
function parseICS(txt){
 const blocks=String(txt).replace(/\r?\n[ \t]/g,'').split(/BEGIN:VEVENT/i).slice(1),out=[];
 blocks.forEach(function(block){
  const p={};block.split(/END:VEVENT/i)[0].split(/\r?\n/).forEach(function(line){const i=line.indexOf(':');if(i>0){const k=line.slice(0,i).split(';')[0].toUpperCase();if(!p[k])p[k]=line.slice(i+1).trim();}});
  const d=parseICSDate(p.DTSTART);if(!d||!p.SUMMARY)return;
  const rule=(p.RRULE||'').toUpperCase(),repeat=rule.includes('DAILY')?'daily':rule.includes('WEEKLY')?'weekly':rule.includes('MONTHLY')?'monthly':rule.includes('YEARLY')?'yearly':'none';
  out.push(clean({id:p.UID||makeId(),title:unescapeICS(p.SUMMARY),date:d.date,start:d.time,end:parseICSDate(p.DTEND)?.time||'',allDay:d.allDay,category:'personal',repeat:repeat,note:unescapeICS(p.DESCRIPTION||''),updatedAt:Date.now()}));
 });
 return out.filter(Boolean);
}
async function importFile(file){
 if(!file)return;const txt=await file.text();let incoming;
 if(/BEGIN:VCALENDAR/i.test(txt))incoming=parseICS(txt);
 else{const j=JSON.parse(txt),list=Array.isArray(j)?j:j.events||[];incoming=list.map(clean).filter(Boolean);}
 const map=new Map(events.map(function(e){return [e.id,e];}));incoming.forEach(function(e){map.set(e.id,e);});events=Array.from(map.values());persist();
}
async function enableNotifications(){
 if(!('Notification'in window)){alert(t('Notifications are not supported.','此瀏覽器不支援通知。','此浏览器不支持通知。'));return;}
 const p=await Notification.requestPermission();alert(p==='granted'?t('Reminders enabled.','提醒已開啟。','提醒已开启。'):t('Notifications were not enabled.','未能開啟通知。','未能开启通知。'));
}
function reminderCheck(){
 if(!('Notification'in window)||Notification.permission!=='granted')return;
 const now=new Date();
 events.forEach(function(e){
  if(!e.reminder)return;
  const base=parseKey(e.date),from=new Date(now.getFullYear(),now.getMonth(),now.getDate()-1),to=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
  for(let d=new Date(Math.max(base.getTime(),from.getTime()));d<=to;d.setDate(d.getDate()+1)){
   if(!occurs(e,d))continue;
   const tm=(e.start||'09:00').split(':').map(Number),start=new Date(d.getFullYear(),d.getMonth(),d.getDate(),tm[0],tm[1]),fire=start.getTime()-e.reminder*60000,k='wdcal:'+e.id+':'+dateKey(d);
   if(now.getTime()>=fire&&now<start&&!sessionStorage.getItem(k)){
    try{new Notification(e.title,{body:t('Starts at ','開始時間 ','开始时间 ')+(e.start||'09:00'),tag:k});sessionStorage.setItem(k,'1');}catch(err){}
   }
  }
 });
}
function bind(){
 if(window.__windzxyCalendarEventsBound)return;window.__windzxyCalendarEventsBound=true;
 document.addEventListener('click',function(e){
  const root=rootOf(e.target);if(!root)return;
  const a=e.target.closest('[data-cal11-action]');
  if(a){
   const k=a.dataset.cal11Action;
   if(k==='add-event'){e.preventDefault();openEditor(root,null,root.dataset.cal11Date);return;}
   if(k==='close-modal'){e.preventDefault();closeEditor(root);return;}
   if(k==='save-event'){e.preventDefault();saveEditor(root);return;}
   if(k==='delete-event'){e.preventDefault();deleteEditor(root);return;}
   if(k==='enable-notifications'){e.preventDefault();enableNotifications();return;}
   if(k==='export-json'){e.preventDefault();exportJSON();return;}
   if(k==='export-ics'){e.preventDefault();exportICS();return;}
   if(k==='import-file'){e.preventDefault();root.querySelector('[data-cal11-import-file]')?.click();return;}
  }
  const hit=e.target.closest('[data-cal11-event-id]');
  if(hit){const item=events.find(function(x){return x.id===hit.dataset.cal11EventId;});if(item){e.preventDefault();e.stopPropagation();openEditor(root,item);}}
 },true);
 document.addEventListener('change',async function(e){
  const root=rootOf(e.target);if(!root)return;
  if(e.target.matches('[data-cal11-import-file]')){try{await importFile(e.target.files?.[0]);e.target.value='';}catch(err){alert(t('Import failed. Check the JSON or ICS file.','匯入失敗，請檢查 JSON 或 ICS 檔案。','导入失败，请检查 JSON 或 ICS 文件。'));}}
  if(e.target.matches('[name="allDay"]')){const box=root.querySelector('.cal11-time-fields');if(box)box.hidden=e.target.checked;}
 },true);
 document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelectorAll('.cal11-event-modal:not([hidden])').forEach(function(x){x.hidden=true;});});
 setInterval(reminderCheck,30000);
}
function styles(){
 if(document.getElementById('windzxyCalendarEventsStyle'))return;
 const st=document.createElement('style');st.id='windzxyCalendarEventsStyle';st.textContent=`
.calendar-v11{position:relative}
.calendar-v11 .cal11-controls{display:grid!important;grid-template-columns:1fr!important;gap:7px!important}
.cal11-date-controls{display:grid;grid-template-columns:minmax(60px,.7fr) minmax(90px,1fr) minmax(52px,.45fr);gap:7px}
.cal11-view-tools{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.cal11-switch{display:grid;grid-template-columns:repeat(5,minmax(0,1fr))!important;flex:1;min-width:0}
.cal11-switch button{font-size:12px;padding:0 4px}
.cal11-event-tools{display:flex;align-items:center;gap:4px;margin-left:auto}
.cal11-event-tools button{height:30px;min-width:28px;padding:0 7px;border:1px solid rgba(255,255,255,.13);border-radius:9px;background:rgba(255,255,255,.07);color:#eef4ff;font-weight:800;cursor:pointer}
.cal11-event-tools button:first-child{background:rgba(114,239,255,.15);border-color:rgba(114,239,255,.3)}
.cal11-event-tools button span{font-size:10px}
.cal11-event-badges{display:grid;gap:2px;margin-top:4px;max-width:100%;overflow:hidden}
.cal11-event-badge{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-radius:5px;padding:2px 4px;font-size:9px;line-height:1.1;font-weight:800;background:rgba(114,239,255,.13);color:#dffaff;cursor:pointer}
.cal11-event-badge i{display:inline-block;width:5px;height:5px;border-radius:50%;background:currentColor;margin:0 4px 1px 0}
.cal11-event-badge.cat-work{background:rgba(118,169,255,.17);color:#bcd4ff}.cal11-event-badge.cat-family,.cal11-event-badge.cat-birthday{background:rgba(255,176,140,.16);color:#ffd0b7}.cal11-event-badge.cat-travel{background:rgba(125,220,169,.16);color:#b5f2d0}.cal11-event-badge.cat-reminder{background:rgba(196,165,255,.17);color:#ddcaff}
.cal11-event-more{font-size:9px;opacity:.65}
.cal11-weekview{height:100%;min-height:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;overflow:auto}
.cal11-week-column{min-width:0;border:1px solid rgba(255,255,255,.10);border-radius:13px;background:rgba(255,255,255,.035);padding:6px;overflow:auto}
.cal11-week-column>header{display:grid;justify-items:center;gap:3px;margin-bottom:7px}
.cal11-week-column>header button{border:0;background:transparent;color:#fff;font-weight:900;cursor:pointer}
.cal11-week-column>header small{font-size:10px;opacity:.6}
.cal11-week-column.today{border-color:rgba(114,239,255,.48)}
.cal11-event-list{display:grid;gap:6px}
.cal11-event-item{width:100%;display:grid;gap:3px;text-align:left;border:1px solid rgba(255,255,255,.10);border-left:3px solid #72efff;border-radius:9px;padding:7px;background:rgba(255,255,255,.065);color:#f7f9ff;cursor:pointer}
.cal11-event-item.cat-work{border-left-color:#76a9ff}.cal11-event-item.cat-family,.cal11-event-item.cat-birthday{border-left-color:#ffb08c}.cal11-event-item.cat-travel{border-left-color:#7ddca9}.cal11-event-item.cat-reminder{border-left-color:#c4a5ff}
.cal11-event-time{font-size:10px;opacity:.65}.cal11-event-title{font-size:12px;font-weight:850;line-height:1.3;overflow-wrap:anywhere}.cal11-event-item small{font-size:10px;opacity:.65;line-height:1.3}
.cal11-empty-events{padding:12px;border:1px dashed rgba(255,255,255,.13);border-radius:12px;text-align:center;font-size:12px;opacity:.55}
.cal11-dayview,.cal11-agendaview{height:100%;min-height:0;overflow:auto;padding-right:3px}
.cal11-dayview>header{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:12px}
.cal11-dayview>header strong{font-size:24px}.cal11-dayview>header span{font-size:12px;opacity:.65}
.cal11-dayview .cal11-event-list{max-width:760px}
.cal11-agenda-day{display:grid;grid-template-columns:58px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.cal11-agenda-date{display:grid;align-content:start;gap:3px;border:0;background:transparent;color:#fff;text-align:left;cursor:pointer}
.cal11-agenda-date b{font-size:20px}.cal11-agenda-date small{font-size:10px;opacity:.6}
.cal11-agenda-holiday{display:block;margin:0 0 5px;color:#ffd18e;font-size:10px}
.cal11-agenda-day .cal11-empty-events{padding:8px}
.cal11-user-events{margin-top:10px;border:1px solid rgba(255,255,255,.11);border-radius:16px;padding:10px;background:rgba(255,255,255,.04);min-height:0;overflow:auto}
.cal11-user-events>header{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
.cal11-user-events h3{margin:0;font-size:12px;font-weight:900}
.cal11-user-events>header button{width:25px;height:25px;border:1px solid rgba(114,239,255,.3);border-radius:8px;background:rgba(114,239,255,.12);color:#fff;cursor:pointer}
.cal11-user-events>p{margin:0;font-size:11px;opacity:.55}
.cal11-user-event{width:100%;display:grid;grid-template-columns:45px minmax(0,1fr);gap:6px;text-align:left;border:0;border-left:2px solid #72efff;border-radius:7px;padding:6px;margin:3px 0;background:rgba(255,255,255,.05);color:#fff;cursor:pointer}
.cal11-user-event b{font-size:10px;opacity:.65}.cal11-user-event span{font-size:11px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cal11-event-modal[hidden]{display:none!important}
.cal11-event-modal{position:absolute;inset:0;z-index:10000;display:grid;place-items:center;padding:12px}
.cal11-event-backdrop{position:absolute;inset:0;background:rgba(7,10,16,.72);backdrop-filter:blur(7px)}
.cal11-event-dialog{position:relative;width:min(520px,100%);max-height:100%;overflow:auto;border:1px solid rgba(255,255,255,.16);border-radius:20px;padding:16px;background:linear-gradient(145deg,#252d3b,#171d28);box-shadow:0 24px 70px rgba(0,0,0,.5);color:#f7f9ff}
.cal11-event-dialog>header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.cal11-event-dialog>header small{font-size:9px;letter-spacing:.16em;opacity:.5}.cal11-event-dialog>header h3{margin:3px 0 0;font-size:20px}
.cal11-event-dialog>header button{width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.10);color:#fff;font-size:20px;cursor:pointer}
.cal11-event-dialog form{display:grid;gap:10px}
.cal11-event-dialog label{display:grid;gap:5px;font-size:11px;font-weight:800;color:rgba(255,255,255,.72)}
.cal11-event-dialog input,.cal11-event-dialog select,.cal11-event-dialog textarea{width:100%;min-width:0;border:1px solid rgba(255,255,255,.13);border-radius:10px;padding:9px;background:rgba(255,255,255,.07);color:#fff;font:inherit;font-size:13px;outline:none}
.cal11-event-dialog option{background:#202938;color:#fff}.cal11-event-dialog textarea{resize:vertical}
.cal11-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:end}
.cal11-form-grid .cal11-all-day{display:flex;align-items:center;gap:8px;padding:10px 0}.cal11-form-grid .cal11-all-day input{width:16px;height:16px}
.cal11-event-dialog footer{display:flex;align-items:center;gap:8px;margin-top:4px}.cal11-event-dialog footer span{flex:1}
.cal11-event-dialog footer button{border:1px solid rgba(255,255,255,.13);border-radius:10px;padding:8px 12px;background:rgba(255,255,255,.07);color:#fff;cursor:pointer;font-weight:800}
.cal11-event-dialog footer button.primary{background:rgba(114,239,255,.20);border-color:rgba(114,239,255,.4)}.cal11-event-dialog footer button.danger{color:#ff9eaa;border-color:rgba(255,110,130,.3)}
@media(max-width:620px){.cal11-view-tools{align-items:stretch}.cal11-switch{flex-basis:100%}.cal11-event-tools{margin-left:0;justify-content:flex-end;width:100%}.cal11-event-tools button:not(:first-child){display:none}.cal11-weekview{grid-template-columns:repeat(7,minmax(78px,1fr))}.cal11-event-dialog{padding:12px}}
@media(max-height:440px){.cal11-event-dialog{padding:10px}.cal11-event-dialog form{gap:6px}}
`;
 document.head.appendChild(st);
}
function bind(){
 if(window.__windzxyCalendarEventsBound)return;
 window.__windzxyCalendarEventsBound=true;
 document.addEventListener('click',function(e){
  const root=rootOf(e.target);if(!root)return;
  const a=e.target.closest('[data-cal11-action]');
  if(a){
   const k=a.dataset.cal11Action;
   if(k==='add-event'){e.preventDefault();openEditor(root,null,root.dataset.cal11Date);return;}
   if(k==='close-modal'){e.preventDefault();closeEditor(root);return;}
   if(k==='save-event'){e.preventDefault();saveEditor(root);return;}
   if(k==='delete-event'){e.preventDefault();deleteEditor(root);return;}
   if(k==='enable-notifications'){e.preventDefault();enableNotifications();return;}
   if(k==='export-json'){e.preventDefault();exportJSON();return;}
   if(k==='export-ics'){e.preventDefault();exportICS();return;}
   if(k==='import-file'){e.preventDefault();root.querySelector('[data-cal11-import-file]')?.click();return;}
  }
  const hit=e.target.closest('[data-cal11-event-id]');
  if(hit){const item=events.find(function(x){return x.id===hit.dataset.cal11EventId;});if(item){e.preventDefault();e.stopPropagation();openEditor(root,item);}}
 },true);
 document.addEventListener('change',async function(e){
  const root=rootOf(e.target);if(!root)return;
  if(e.target.matches('[data-cal11-import-file]')){try{await importFile(e.target.files?.[0]);e.target.value='';}catch(err){alert(t('Import failed. Check the JSON or ICS file.','匯入失敗，請檢查 JSON 或 ICS 檔案。','导入失败，请检查 JSON 或 ICS 文件。'));}}
  if(e.target.matches('[name="allDay"]')){const box=root.querySelector('.cal11-time-fields');if(box)box.hidden=e.target.checked;}
 },true);
 document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelectorAll('.cal11-event-modal:not([hidden])').forEach(function(x){x.hidden=true;});});
 setInterval(reminderCheck,30000);
}
function styles(){
 if(document.getElementById('windzxyCalendarEventsStyle'))return;
 const st=document.createElement('style');st.id='windzxyCalendarEventsStyle';st.textContent=`
.calendar-v11{position:relative}
.calendar-v11 .cal11-controls{display:grid!important;grid-template-columns:1fr!important;gap:7px!important}
.cal11-date-controls{display:grid;grid-template-columns:minmax(60px,.7fr) minmax(90px,1fr) minmax(52px,.45fr);gap:7px}
.cal11-view-tools{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.cal11-switch{display:grid;grid-template-columns:repeat(5,minmax(0,1fr))!important;flex:1;min-width:0}
.cal11-switch button{font-size:12px;padding:0 4px}
.cal11-event-tools{display:flex;align-items:center;gap:4px;margin-left:auto}
.cal11-event-tools button{height:30px;min-width:28px;padding:0 7px;border:1px solid rgba(255,255,255,.13);border-radius:9px;background:rgba(255,255,255,.07);color:#eef4ff;font-weight:800;cursor:pointer}
.cal11-event-tools button:first-child{background:rgba(114,239,255,.15);border-color:rgba(114,239,255,.3)}
.cal11-event-tools button span{font-size:10px}
.cal11-event-badges{display:grid;gap:2px;margin-top:4px;max-width:100%;overflow:hidden}
.cal11-event-badge{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-radius:5px;padding:2px 4px;font-size:9px;line-height:1.1;font-weight:800;background:rgba(114,239,255,.13);color:#dffaff;cursor:pointer}
.cal11-event-badge i{display:inline-block;width:5px;height:5px;border-radius:50%;background:currentColor;margin:0 4px 1px 0}
.cal11-event-badge.cat-work{background:rgba(118,169,255,.17);color:#bcd4ff}.cal11-event-badge.cat-family,.cal11-event-badge.cat-birthday{background:rgba(255,176,140,.16);color:#ffd0b7}.cal11-event-badge.cat-travel{background:rgba(125,220,169,.16);color:#b5f2d0}.cal11-event-badge.cat-reminder{background:rgba(196,165,255,.17);color:#ddcaff}
.cal11-event-more{font-size:9px;opacity:.65}
.cal11-weekview{height:100%;min-height:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;overflow:auto}
.cal11-week-column{min-width:0;border:1px solid rgba(255,255,255,.10);border-radius:13px;background:rgba(255,255,255,.035);padding:6px;overflow:auto}
.cal11-week-column>header{display:grid;justify-items:center;gap:3px;margin-bottom:7px}
.cal11-week-column>header button{border:0;background:transparent;color:#fff;font-weight:900;cursor:pointer}
.cal11-week-column>header small{font-size:10px;opacity:.6}
.cal11-week-column.today{border-color:rgba(114,239,255,.48)}
.cal11-event-list{display:grid;gap:6px}
.cal11-event-item{width:100%;display:grid;gap:3px;text-align:left;border:1px solid rgba(255,255,255,.10);border-left:3px solid #72efff;border-radius:9px;padding:7px;background:rgba(255,255,255,.065);color:#f7f9ff;cursor:pointer}
.cal11-event-item.cat-work{border-left-color:#76a9ff}.cal11-event-item.cat-family,.cal11-event-item.cat-birthday{border-left-color:#ffb08c}.cal11-event-item.cat-travel{border-left-color:#7ddca9}.cal11-event-item.cat-reminder{border-left-color:#c4a5ff}
.cal11-event-time{font-size:10px;opacity:.65}.cal11-event-title{font-size:12px;font-weight:850;line-height:1.3;overflow-wrap:anywhere}.cal11-event-item small{font-size:10px;opacity:.65;line-height:1.3}
.cal11-empty-events{padding:12px;border:1px dashed rgba(255,255,255,.13);border-radius:12px;text-align:center;font-size:12px;opacity:.55}
.cal11-dayview,.cal11-agendaview{height:100%;min-height:0;overflow:auto;padding-right:3px}
.cal11-dayview>header{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:12px}
.cal11-dayview>header strong{font-size:24px}.cal11-dayview>header span{font-size:12px;opacity:.65}
.cal11-dayview .cal11-event-list{max-width:760px}
.cal11-agenda-day{display:grid;grid-template-columns:58px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.cal11-agenda-date{display:grid;align-content:start;gap:3px;border:0;background:transparent;color:#fff;text-align:left;cursor:pointer}
.cal11-agenda-date b{font-size:20px}.cal11-agenda-date small{font-size:10px;opacity:.6}
.cal11-agenda-holiday{display:block;margin:0 0 5px;color:#ffd18e;font-size:10px}
.cal11-agenda-day .cal11-empty-events{padding:8px}
.cal11-user-events{margin-top:10px;border:1px solid rgba(255,255,255,.11);border-radius:16px;padding:10px;background:rgba(255,255,255,.04);min-height:0;overflow:auto}
.cal11-user-events>header{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
.cal11-user-events h3{margin:0;font-size:12px;font-weight:900}
.cal11-user-events>header button{width:25px;height:25px;border:1px solid rgba(114,239,255,.3);border-radius:8px;background:rgba(114,239,255,.12);color:#fff;cursor:pointer}
.cal11-user-events>p{margin:0;font-size:11px;opacity:.55}
.cal11-user-event{width:100%;display:grid;grid-template-columns:45px minmax(0,1fr);gap:6px;text-align:left;border:0;border-left:2px solid #72efff;border-radius:7px;padding:6px;margin:3px 0;background:rgba(255,255,255,.05);color:#fff;cursor:pointer}
.cal11-user-event b{font-size:10px;opacity:.65}.cal11-user-event span{font-size:11px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cal11-event-modal[hidden]{display:none!important}
.cal11-event-modal{position:absolute;inset:0;z-index:10000;display:grid;place-items:center;padding:12px}
.cal11-event-backdrop{position:absolute;inset:0;background:rgba(7,10,16,.72);backdrop-filter:blur(7px)}
.cal11-event-dialog{position:relative;width:min(520px,100%);max-height:100%;overflow:auto;border:1px solid rgba(255,255,255,.16);border-radius:20px;padding:16px;background:linear-gradient(145deg,#252d3b,#171d28);box-shadow:0 24px 70px rgba(0,0,0,.5);color:#f7f9ff}
.cal11-event-dialog>header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.cal11-event-dialog>header small{font-size:9px;letter-spacing:.16em;opacity:.5}.cal11-event-dialog>header h3{margin:3px 0 0;font-size:20px}
.cal11-event-dialog>header button{width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.10);color:#fff;font-size:20px;cursor:pointer}
.cal11-event-dialog form{display:grid;gap:10px}
.cal11-event-dialog label{display:grid;gap:5px;font-size:11px;font-weight:800;color:rgba(255,255,255,.72)}
.cal11-event-dialog input,.cal11-event-dialog select,.cal11-event-dialog textarea{width:100%;min-width:0;border:1px solid rgba(255,255,255,.13);border-radius:10px;padding:9px;background:rgba(255,255,255,.07);color:#fff;font:inherit;font-size:13px;outline:none}
.cal11-event-dialog option{background:#202938;color:#fff}.cal11-event-dialog textarea{resize:vertical}
.cal11-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:end}
.cal11-form-grid .cal11-all-day{display:flex;align-items:center;gap:8px;padding:10px 0}.cal11-form-grid .cal11-all-day input{width:16px;height:16px}
.cal11-event-dialog footer{display:flex;align-items:center;gap:8px;margin-top:4px}.cal11-event-dialog footer span{flex:1}
.cal11-event-dialog footer button{border:1px solid rgba(255,255,255,.13);border-radius:10px;padding:8px 12px;background:rgba(255,255,255,.07);color:#fff;cursor:pointer;font-weight:800}
.cal11-event-dialog footer button.primary{background:rgba(114,239,255,.20);border-color:rgba(114,239,255,.4)}.cal11-event-dialog footer button.danger{color:#ff9eaa;border-color:rgba(255,110,130,.3)}
@media(max-width:620px){.cal11-view-tools{align-items:stretch}.cal11-switch{flex-basis:100%}.cal11-event-tools{margin-left:0;justify-content:flex-end;width:100%}.cal11-event-tools button:not(:first-child){display:none}.cal11-weekview{grid-template-columns:repeat(7,minmax(78px,1fr))}.cal11-event-dialog{padding:12px}}
@media(max-height:440px){.cal11-event-dialog{padding:10px}.cal11-event-dialog form{gap:6px}}
.calendar-v11.cal11-compact .cal11-controls{grid-template-columns:1fr!important}
.calendar-v11.cal11-compact .cal11-switch{display:grid!important;flex-basis:100%}
.calendar-v11.cal11-compact .cal11-view-tools{display:flex!important;flex-wrap:wrap}
.calendar-v11.cal11-compact .cal11-event-tools button:not(:first-child){display:none}
.calendar-v11 .cal11-side{grid-template-rows:auto minmax(0,1fr) auto}
.calendar-v11 .cal11-mini.eventful{border-color:rgba(114,239,255,.45)}
.calendar-v11 .cal11-mini.eventful>b:after{content:' ·';color:#72efff}
`;
 document.head.appendChild(st);
}
function bind(){
 if(window.__windzxyCalendarEventsBound)return;
 window.__windzxyCalendarEventsBound=true;
 document.addEventListener('click',function(e){
  const root=rootOf(e.target);if(!root)return;
  const a=e.target.closest('[data-cal11-action]');
  if(a){
   const k=a.dataset.cal11Action;
   if(k==='add-event'){e.preventDefault();openEditor(root,null,root.dataset.cal11Date);return;}
   if(k==='close-modal'){e.preventDefault();closeEditor(root);return;}
   if(k==='save-event'){e.preventDefault();saveEditor(root);return;}
   if(k==='delete-event'){e.preventDefault();deleteEditor(root);return;}
   if(k==='enable-notifications'){e.preventDefault();enableNotifications();return;}
   if(k==='export-json'){e.preventDefault();exportJSON();return;}
   if(k==='export-ics'){e.preventDefault();exportICS();return;}
   if(k==='import-file'){e.preventDefault();root.querySelector('[data-cal11-import-file]')?.click();return;}
  }
  const hit=e.target.closest('[data-cal11-event-id]');
  if(hit){const item=events.find(function(x){return x.id===hit.dataset.cal11EventId;});if(item){e.preventDefault();e.stopPropagation();openEditor(root,item);}}
 },true);
 document.addEventListener('change',async function(e){
  const root=rootOf(e.target);if(!root)return;
  if(e.target.matches('[data-cal11-import-file]')){try{await importFile(e.target.files?.[0]);e.target.value='';}catch(err){alert(t('Import failed. Check the JSON or ICS file.','匯入失敗，請檢查 JSON 或 ICS 檔案。','导入失败，请检查 JSON 或 ICS 文件。'));}}
  if(e.target.matches('[name="allDay"]')){const box=root.querySelector('.cal11-time-fields');if(box)box.hidden=e.target.checked;}
 },true);
 document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelectorAll('.cal11-event-modal:not([hidden])').forEach(function(x){x.hidden=true;});});
 setInterval(reminderCheck,30000);
}
function init(){styles();bind();hydrate();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.WebDeskCalendarEvents={version:VER,get all(){return events.slice();},forDate:forDate,badgeMarkup:badgeMarkup,listMarkup:listMarkup,sideMarkup:sideMarkup,toolbarMarkup:toolbarMarkup,modalMarkup:modalMarkup,hasEventsInMonth:function(y,m){return events.some(function(e){const d=parseKey(e.date);return d.getFullYear()===y&&d.getMonth()===m;});}};
})();