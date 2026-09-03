(function(){
'use strict';
const VER='20260903-calendar-holiday-authority-v2-region-groups';
if(window.__windzxyCalendarHolidayAuthority===VER)return;
window.__windzxyCalendarHolidayAuthority=VER;

const CN={
'2026-01-01':{n:'元旦假期',s:'元旦',t:'holiday',g:'cn-newyear'},
'2026-01-02':{n:'元旦假期',s:'元旦',t:'holiday',g:'cn-newyear'},
'2026-01-03':{n:'元旦假期',s:'元旦',t:'holiday',g:'cn-newyear'},
'2026-01-04':{n:'元旦調休補班',s:'元旦補班',t:'work',g:'cn-newyear-work'},
'2026-02-14':{n:'春節調休補班',s:'春節補班',t:'work',g:'cn-spring-work-a'},
'2026-02-15':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-16':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-17':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-18':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-19':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-20':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-21':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-22':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-23':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-28':{n:'春節調休補班',s:'春節補班',t:'work',g:'cn-spring-work-b'},
'2026-04-04':{n:'清明節假期',s:'清明',t:'holiday',g:'cn-qingming'},
'2026-04-05':{n:'清明節假期',s:'清明',t:'holiday',g:'cn-qingming'},
'2026-04-06':{n:'清明節假期',s:'清明',t:'holiday',g:'cn-qingming'},
'2026-05-01':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-02':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-03':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-04':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-05':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-09':{n:'勞動節調休補班',s:'勞動節補班',t:'work',g:'cn-labour-work'},
'2026-06-19':{n:'端午節假期',s:'端午',t:'holiday',g:'cn-dragonboat'},
'2026-06-20':{n:'端午節假期',s:'端午',t:'holiday',g:'cn-dragonboat'},
'2026-06-21':{n:'端午節假期',s:'端午',t:'holiday',g:'cn-dragonboat'},
'2026-09-20':{n:'國慶調休補班',s:'國慶補班',t:'work',g:'cn-national-work-a'},
'2026-09-25':{n:'中秋節假期',s:'中秋',t:'holiday',g:'cn-midautumn'},
'2026-09-26':{n:'中秋節假期',s:'中秋',t:'holiday',g:'cn-midautumn'},
'2026-09-27':{n:'中秋節假期',s:'中秋',t:'holiday',g:'cn-midautumn'},
'2026-10-01':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-02':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-03':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-04':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-05':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-06':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-07':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-10':{n:'國慶調休補班',s:'國慶補班',t:'work',g:'cn-national-work-b'}
};

const HK={
'2026-01-01':{n:'一月一日',s:'港·元旦',t:'holiday',g:'hk-newyear'},
'2026-02-17':{n:'農曆年初一',s:'港·年初一',t:'holiday',g:'hk-lny1'},
'2026-02-18':{n:'農曆年初二',s:'港·年初二',t:'holiday',g:'hk-lny2'},
'2026-02-19':{n:'農曆年初三',s:'港·年初三',t:'holiday',g:'hk-lny3'},
'2026-04-03':{n:'耶穌受難節',s:'港·受難節',t:'holiday',g:'hk-goodfriday'},
'2026-04-04':{n:'耶穌受難節翌日',s:'港·受難節翌日',t:'holiday',g:'hk-goodfriday-next'},
'2026-04-06':{n:'清明節翌日',s:'港·清明翌日',t:'holiday',g:'hk-qingming-next'},
'2026-04-07':{n:'復活節翌日補假',s:'港·復活節',t:'holiday',g:'hk-easter'},
'2026-05-01':{n:'勞動節',s:'港·勞動節',t:'holiday',g:'hk-labour'},
'2026-05-25':{n:'佛誕翌日',s:'港·佛誕',t:'holiday',g:'hk-buddha'},
'2026-06-19':{n:'端午節',s:'港·端午',t:'holiday',g:'hk-dragonboat'},
'2026-07-01':{n:'香港特別行政區成立紀念日',s:'港·七一',t:'holiday',g:'hk-hksar'},
'2026-09-26':{n:'中秋節翌日',s:'港·中秋翌日',t:'holiday',g:'hk-midautumn-next'},
'2026-10-01':{n:'國慶日',s:'港·國慶',t:'holiday',g:'hk-national'},
'2026-10-19':{n:'重陽節翌日',s:'港·重陽',t:'holiday',g:'hk-chungyeung'},
'2026-12-25':{n:'聖誕節',s:'港·聖誕',t:'holiday',g:'hk-christmas'},
'2026-12-26':{n:'聖誕節後第一個周日',s:'港·聖誕翌日',t:'holiday',g:'hk-christmas-next'}
};

let lastClicked='';
let queued=false;
function pad(n){return String(n).padStart(2,'0')}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function selected(root){const m=(root.dataset.cal11Date||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?new Date(+m[1],+m[2]-1,+m[3]):new Date()}
function monthItems(data,y,m){return Object.entries(data).map(([date,v])=>({date,...v,d:new Date(date+'T00:00:00')})).filter(x=>x.d.getFullYear()===y&&x.d.getMonth()===m).sort((a,b)=>a.date.localeCompare(b.date))}
function groups(data,y,m){const out=[];for(const it of monthItems(data,y,m)){const day=it.d.getDate(),last=out[out.length-1];if(last&&last.g===it.g&&last.t===it.t&&day===last.end+1)last.end=day;else out.push({...it,start:day,end:day})}return out}
function rangeText(g){return g.start===g.end?pad(g.start):pad(g.start)+'-'+pad(g.end)}
function installStyle(){
  if(document.getElementById('calendarHolidayAuthorityV2Style'))return;
  const st=document.createElement('style');st.id='calendarHolidayAuthorityV2Style';st.textContent=`
  .calendar-v11 .cal11-hbar .cal-auth-work{color:#9bc8ff!important;background:rgba(74,132,222,.22)!important;border-color:rgba(118,170,255,.34)!important}
  .calendar-v11 .cal11-hbar .cal-auth-cn{color:#ffd39a!important}
  .calendar-v11 .cal11-hbar .cal-auth-hk{color:#90e6b2!important;background:rgba(67,163,104,.18)!important;border-color:rgba(104,214,143,.28)!important}
  .calendar-v11 .cal11-events .cal-auth-section{margin:0 0 12px;padding:0;border:0;background:transparent}
  .calendar-v11 .cal11-events .cal-auth-section:last-child{margin-bottom:0}
  .calendar-v11 .cal11-events .cal-auth-title{display:flex;align-items:center;justify-content:space-between;margin:0 0 8px;font-size:13px;font-weight:950;letter-spacing:.02em}
  .calendar-v11 .cal11-events .cal-auth-title.cn{color:#ffd39a}
  .calendar-v11 .cal11-events .cal-auth-title.hk{color:#90e6b2}
  .calendar-v11 .cal11-events .cal-auth-row{cursor:default}
  .calendar-v11 .cal11-events .cal-auth-row.work b,.calendar-v11 .cal11-events .cal-auth-row.work em{color:#9bc8ff!important}
  .calendar-v11 .cal11-events .cal-auth-row.cn-holiday b,.calendar-v11 .cal11-events .cal-auth-row.cn-holiday em{color:#ffc176!important}
  .calendar-v11 .cal11-events .cal-auth-row.hk-holiday b,.calendar-v11 .cal11-events .cal-auth-row.hk-holiday em{color:#86e2aa!important}
  .calendar-v11 .cal11-day[data-cal-auth-work='1'] i{background:#76a9ff!important}
  .calendar-v11 .cal11-day[data-cal-auth-hk='1']{box-shadow:inset 0 -2px 0 rgba(92,202,133,.45)}
  `;document.head.appendChild(st)
}
function patchCells(root){root.querySelectorAll('[data-cal11-cell]').forEach(cell=>{const key=cell.dataset.cal11Cell,cn=CN[key],hk=HK[key];cell.classList.toggle('holiday',!!(cn||hk));cell.classList.toggle('workday',cn?.t==='work');cell.dataset.calAuthWork=cn?.t==='work'?'1':'0';cell.dataset.calAuthHk=hk?'1':'0';cell.title=[cn?`中國內地：${cn.n}`:'',hk?`香港：${hk.n}`:''].filter(Boolean).join(' · ');cell.querySelectorAll(':scope > i').forEach(i=>i.remove());if(cn||hk){const i=document.createElement('i');if(cn?.t==='work')i.className='work';i.dataset.holidayAuthority='2';cell.appendChild(i)}})}
function patchBar(root,d){const cng=groups(CN,d.getFullYear(),d.getMonth()),hkg=groups(HK,d.getFullYear(),d.getMonth()),all=[...cng.map(g=>({...g,r:'cn'})),...hkg.map(g=>({...g,r:'hk'}))].sort((a,b)=>a.start-b.start);let bar=root.querySelector('.cal11-hbar');if(!bar&&all.length){bar=document.createElement('section');bar.className='cal11-hbar';root.querySelector('.cal11-body')?.before(bar)}if(!bar)return;if(!all.length){bar.remove();return}const shown=all.slice(0,3);bar.innerHTML=shown.map(g=>`<span class="${g.t==='work'?'cal-auth-work':g.r==='hk'?'cal-auth-hk':'cal-auth-cn'}">${esc(rangeText(g))} ${esc(g.s)}</span>`).join('')+(all.length>shown.length?`<em>+${all.length-shown.length}</em>`:'')}
function rows(gs,region){if(!gs.length)return '<p>本月無記錄</p>';return gs.map(g=>`<button type="button" class="cal-auth-row ${g.t==='work'?'work':region==='hk'?'hk-holiday':'cn-holiday'}"><b>${rangeText(g)}</b><span>${esc(g.n)}</span><em>${g.t==='work'?'補班':region==='hk'?'公眾假期':'假期'}</em></button>`).join('')}
function patchSide(root,d){const box=root.querySelector('.cal11-events');if(!box)return;const cng=groups(CN,d.getFullYear(),d.getMonth()),hkg=groups(HK,d.getFullYear(),d.getMonth());box.innerHTML=`<section class="cal-auth-section"><h3 class="cal-auth-title cn"><span>本月（中國內地）</span></h3>${rows(cng,'cn')}</section><section class="cal-auth-section"><h3 class="cal-auth-title hk"><span>本月（香港）</span></h3>${rows(hkg,'hk')}</section>`}
function patchRoot(root){const d=selected(root);installStyle();patchCells(root);patchBar(root,d);patchSide(root,d);root.dataset.holidayAuthority=VER}
function patchPopup(){if(!lastClicked)return;const cn=CN[lastClicked],hk=HK[lastClicked];document.querySelectorAll('.cal-day-detail-pop').forEach(pop=>{const rows=pop.querySelectorAll('.cal-detail-rows > div');const span=rows[1]?.querySelector('span');if(!span)return;const parts=[];if(cn)parts.push(`中國內地：${cn.n}${cn.t==='work'?'（補班）':''}`);if(hk)parts.push(`香港：${hk.n}`);span.textContent=parts.length?parts.join(' ｜ '):'無官方假期記錄';span.className=cn?.t==='work'?'work':(cn||hk)?'holiday':''})}
function run(){queued=false;document.querySelectorAll('.calendar-v11').forEach(patchRoot);patchPopup()}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(run)}
document.addEventListener('click',e=>{const c=e.target.closest?.('[data-cal11-cell]');if(c){lastClicked=c.dataset.cal11Cell||'';setTimeout(schedule,0)}},true);
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
window.WebDeskCalendarHolidayAuthority={version:VER,cn:CN,hk:HK};
})();
