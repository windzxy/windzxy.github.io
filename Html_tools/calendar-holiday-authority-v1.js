(function(){
'use strict';
const VER='20260903-calendar-holiday-authority-v1';
if(window.__windzxyCalendarHolidayAuthority===VER)return;
window.__windzxyCalendarHolidayAuthority=VER;

const H={
'2026-01-01':{n:'內地元旦假期 · 香港一月一日',s:'元旦',t:'holiday'},
'2026-01-02':{n:'內地元旦假期',s:'元旦',t:'holiday'},
'2026-01-03':{n:'內地元旦假期',s:'元旦',t:'holiday'},
'2026-01-04':{n:'內地元旦調休補班',s:'元旦補班',t:'work'},
'2026-02-14':{n:'內地春節調休補班',s:'春節補班',t:'work'},
'2026-02-15':{n:'內地春節假期',s:'春節',t:'holiday'},
'2026-02-16':{n:'內地春節假期',s:'春節',t:'holiday'},
'2026-02-17':{n:'內地春節假期 · 香港農曆年初一',s:'春節',t:'holiday'},
'2026-02-18':{n:'內地春節假期 · 香港農曆年初二',s:'春節',t:'holiday'},
'2026-02-19':{n:'內地春節假期 · 香港農曆年初三',s:'春節',t:'holiday'},
'2026-02-20':{n:'內地春節假期',s:'春節',t:'holiday'},
'2026-02-21':{n:'內地春節假期',s:'春節',t:'holiday'},
'2026-02-22':{n:'內地春節假期',s:'春節',t:'holiday'},
'2026-02-23':{n:'內地春節假期',s:'春節',t:'holiday'},
'2026-02-28':{n:'內地春節調休補班',s:'春節補班',t:'work'},
'2026-04-03':{n:'香港耶穌受難節',s:'港·受難節',t:'holiday'},
'2026-04-04':{n:'內地清明假期 · 香港耶穌受難節翌日',s:'清明/港',t:'holiday'},
'2026-04-05':{n:'內地清明假期',s:'清明',t:'holiday'},
'2026-04-06':{n:'內地清明假期 · 香港清明節翌日',s:'清明/港',t:'holiday'},
'2026-04-07':{n:'香港復活節星期一翌日',s:'港·復活節',t:'holiday'},
'2026-05-01':{n:'內地勞動節假期 · 香港勞動節',s:'勞動節',t:'holiday'},
'2026-05-02':{n:'內地勞動節假期',s:'勞動節',t:'holiday'},
'2026-05-03':{n:'內地勞動節假期',s:'勞動節',t:'holiday'},
'2026-05-04':{n:'內地勞動節假期',s:'勞動節',t:'holiday'},
'2026-05-05':{n:'內地勞動節假期',s:'勞動節',t:'holiday'},
'2026-05-09':{n:'內地勞動節調休補班',s:'勞動節補班',t:'work'},
'2026-05-25':{n:'香港佛誕翌日',s:'港·佛誕',t:'holiday'},
'2026-06-19':{n:'內地端午假期 · 香港端午節',s:'端午',t:'holiday'},
'2026-06-20':{n:'內地端午假期',s:'端午',t:'holiday'},
'2026-06-21':{n:'內地端午假期',s:'端午',t:'holiday'},
'2026-07-01':{n:'香港特別行政區成立紀念日',s:'香港七一',t:'holiday'},
'2026-09-20':{n:'內地國慶調休補班',s:'國慶補班',t:'work'},
'2026-09-25':{n:'內地中秋節假期',s:'中秋',t:'holiday'},
'2026-09-26':{n:'內地中秋節假期 · 香港中秋節翌日',s:'中秋/港',t:'holiday'},
'2026-09-27':{n:'內地中秋節假期',s:'中秋',t:'holiday'},
'2026-10-01':{n:'內地國慶假期 · 香港國慶日',s:'國慶/港',t:'holiday'},
'2026-10-02':{n:'內地國慶假期',s:'國慶',t:'holiday'},
'2026-10-03':{n:'內地國慶假期',s:'國慶',t:'holiday'},
'2026-10-04':{n:'內地國慶假期',s:'國慶',t:'holiday'},
'2026-10-05':{n:'內地國慶假期',s:'國慶',t:'holiday'},
'2026-10-06':{n:'內地國慶假期',s:'國慶',t:'holiday'},
'2026-10-07':{n:'內地國慶假期',s:'國慶',t:'holiday'},
'2026-10-10':{n:'內地國慶調休補班',s:'國慶補班',t:'work'},
'2026-10-19':{n:'香港重陽節翌日',s:'港·重陽',t:'holiday'},
'2026-12-25':{n:'香港聖誕節',s:'聖誕',t:'holiday'},
'2026-12-26':{n:'香港聖誕節後第一個周日',s:'聖誕',t:'holiday'}
};

let lastClicked='';
let queued=false;
function pad(n){return String(n).padStart(2,'0')}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function monthItems(y,m){return Object.entries(H).map(([date,v])=>({date,...v,d:new Date(date+'T00:00:00')})).filter(x=>x.d.getFullYear()===y&&x.d.getMonth()===m).sort((a,b)=>a.date.localeCompare(b.date))}
function groups(y,m){const out=[];for(const it of monthItems(y,m)){const day=it.d.getDate(),last=out[out.length-1];if(last&&last.n===it.n&&last.s===it.s&&last.t===it.t&&day===last.end+1)last.end=day;else out.push({...it,start:day,end:day})}return out}
function selected(root){const m=(root.dataset.cal11Date||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?new Date(+m[1],+m[2]-1,+m[3]):new Date()}
function patchCells(root){root.querySelectorAll('[data-cal11-cell]').forEach(cell=>{const key=cell.dataset.cal11Cell,h=H[key];cell.classList.toggle('holiday',!!h);cell.classList.toggle('workday',h?.t==='work');cell.title=h?h.n:'';cell.querySelectorAll(':scope > i').forEach(i=>i.remove());if(h){const i=document.createElement('i');if(h.t==='work')i.className='work';i.dataset.holidayAuthority='1';cell.appendChild(i)}})}
function patchBar(root,d){const gs=groups(d.getFullYear(),d.getMonth());let bar=root.querySelector('.cal11-hbar');if(!bar&&gs.length){bar=document.createElement('section');bar.className='cal11-hbar';root.querySelector('.cal11-body')?.before(bar)}if(!bar)return;if(!gs.length){bar.remove();return}const shown=gs.slice(0,2);bar.innerHTML=shown.map(g=>`<span class="${g.t==='work'?'work':''}">${esc(g.start===g.end?pad(g.start):pad(g.start)+'-'+pad(g.end))} ${esc(g.s)}</span>`).join('')+(gs.length>shown.length?`<em>+${gs.length-shown.length}</em>`:'')}
function patchSide(root,d){const box=root.querySelector('.cal11-events');if(!box)return;const gs=groups(d.getFullYear(),d.getMonth());box.innerHTML='<h3>本月</h3>'+(gs.length?gs.map(g=>`<button type="button"><b>${g.start===g.end?pad(g.start):pad(g.start)+'-'+pad(g.end)}</b><span>${esc(g.n)}</span><em>${g.t==='work'?'補班':'假期'}</em></button>`).join(''):'<p>本月無官方假期 / 調休記錄</p>')}
function patchRoot(root){const d=selected(root);patchCells(root);patchBar(root,d);patchSide(root,d);root.dataset.holidayAuthority=VER}
function patchPopup(){if(!lastClicked)return;const h=H[lastClicked];document.querySelectorAll('.cal-day-detail-pop').forEach(pop=>{const rows=pop.querySelectorAll('.cal-detail-rows > div');const span=rows[1]?.querySelector('span');if(!span)return;span.textContent=h?(h.n+(h.t==='work'?' · 調休補班':'')):'無官方假期記錄';span.className=h?(h.t==='work'?'work':'holiday'):''})}
function run(){queued=false;document.querySelectorAll('.calendar-v11').forEach(patchRoot);patchPopup()}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(run)}
document.addEventListener('click',e=>{const c=e.target.closest?.('[data-cal11-cell]');if(c){lastClicked=c.dataset.cal11Cell||'';setTimeout(schedule,0)}},true);
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
window.WebDeskCalendarHolidayAuthority={version:VER,data:H};
})();
