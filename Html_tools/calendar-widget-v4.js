(function(){
  'use strict';
  const VER='20260827-calendar-widget-v4-single-nav-clean';
  if(window.__windzxyCalendarWidgetV4Loaded===VER)return;
  window.__windzxyCalendarWidgetV4Loaded=VER;
  window.__windzxyCalendarWidgetV3Loaded=true;
  window.__windzxyCalendarWidgetLoaded=true;

  const M_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const M_ZH=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const W_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const W_ZH=['日','一','二','三','四','五','六'];
  const D_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const D_ZH=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const CN=['零','一','二','三','四','五','六','七','八','九','十'];
  const HOLIDAYS_2026={
    '2026-01-01':['元旦','CN/HK'],
    '2026-02-17':['農曆新年','CN/HK'],'2026-02-18':['農曆新年','CN/HK'],'2026-02-19':['農曆新年','CN/HK'],
    '2026-04-03':['耶穌受難節','HK'],'2026-04-04':['清明節','CN/HK'],'2026-04-06':['復活節星期一','HK'],
    '2026-05-01':['勞動節','CN/HK'],'2026-05-25':['佛誕','HK'],
    '2026-06-19':['端午節','CN/HK'],'2026-07-01':['香港特別行政區成立紀念日','HK'],
    '2026-09-25':['中秋節翌日','HK'],'2026-10-01':['國慶節','CN/HK'],'2026-10-18':['重陽節','HK'],
    '2026-12-25':['聖誕節','HK'],'2026-12-26':['聖誕節後第一個周日','HK']
  };
  const TRANSFER_2026={};

  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||localStorage.getItem('webdesk-lang')||document.documentElement.lang||navigator.language||'zh-HK';
    if(/^en/i.test(v))return 'en';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    return 'zh-HK';
  }
  function zh(){return lang()!=='en';}
  function t(en,z){return zh()?z:en;}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function pad(n){return String(n).padStart(2,'0');}
  function iso(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}
  function parse(v){const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?new Date(+m[1],+m[2]-1,+m[3]):new Date();}
  function dim(y,m){return new Date(y,m+1,0).getDate();}
  function clampDay(y,m,d){return Math.max(1,Math.min(dim(y,m),Number(d)||1));}
  function monthName(m){return zh()?M_ZH[m]:M_EN[m];}
  function weekName(i){return zh()?W_ZH[i]:W_EN[i];}
  function longWeek(i){return zh()?D_ZH[i]:D_EN[i];}
  function title(d){return zh()?`${d.getFullYear()}年${d.getMonth()+1}月`:`${monthName(d.getMonth())} ${d.getFullYear()}`;}
  function lunarDay(n){n=Number(n)||1;if(n<=10)return ['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十'][n];if(n<20)return '十'+CN[n-10];if(n===20)return '二十';if(n<30)return '廿'+CN[n-20];return '三十';}
  function lunarInfo(d){
    try{
      const parts=new Intl.DateTimeFormat('zh-Hant-u-ca-chinese',{month:'long',day:'numeric'}).formatToParts(d);
      let m=parts.find(p=>p.type==='month')?.value||'';
      let day=parts.find(p=>p.type==='day')?.value||'';
      const hit=String(day).match(/\d+/);if(hit)day=lunarDay(hit[0]);
      day=String(day).replace(/日$/,'');if(/^\d+$/.test(day))day=lunarDay(day);
      if(m&&!/月$/.test(m))m+='月';
      return {m,day};
    }catch(e){return {m:'',day:''};}
  }
  function lunarShort(d){const l=lunarInfo(d);return l.day==='初一'&&l.m?l.m:(l.day||'');}
  function lunarFull(d){const l=lunarInfo(d);return (l.m||l.day)?`${l.m}${l.day}`:'';}
  function matrix(y,m){const first=new Date(y,m,1);const start=new Date(y,m,1-first.getDay());return Array.from({length:42},(_,i)=>new Date(start.getFullYear(),start.getMonth(),start.getDate()+i));}
  function getState(root){return {date:parse(root.dataset.cal4Date||root.dataset.cv4Date||iso(new Date())),mode:(root.dataset.cal4Mode||root.dataset.cv4Mode)==='year'?'year':'month',drawer:root.dataset.cal4Drawer==='1'};}
  function monthEvents(y,m){
    const out=[];
    Object.keys(HOLIDAYS_2026).forEach(k=>{const d=parse(k);if(d.getFullYear()===y&&d.getMonth()===m)out.push({date:k,title:HOLIDAYS_2026[k][0],tag:HOLIDAYS_2026[k][1]});});
    Object.keys(TRANSFER_2026).forEach(k=>{const d=parse(k);if(d.getFullYear()===y&&d.getMonth()===m)out.push({date:k,title:TRANSFER_2026[k],tag:t('Transfer','調休')});});
    return out.sort((a,b)=>a.date.localeCompare(b.date));
  }

  function renderHeader(d,mode){
    const lf=lunarFull(d);
    return `<header class="cal4-head"><div class="cal4-title"><span>${t('CALENDAR','萬年曆')}</span><h2>${esc(title(d))}</h2><p>${esc(d.getDate())} · ${esc(longWeek(d.getDay()))}${lf?` · ${esc(lf)}`:''}</p></div><nav class="cal4-nav"><button type="button" data-cal4-nav="prev-month" title="${t('Previous month','上月')}">‹</button><button type="button" data-cal4-nav="today" class="today">${t('Today','今天')}</button><button type="button" data-cal4-nav="next-month" title="${t('Next month','下月')}">›</button><button type="button" data-cal4-drawer title="${t('Settings','設定')}">⋯</button></nav></header>`;
  }
  function renderDrawer(d,mode,open){
    const y=d.getFullYear(),m=d.getMonth(),day=d.getDate();
    return `<section class="cal4-drawer ${open?'open':''}" ${open?'':'hidden'}><div class="cal4-drawer-card"><header><b>${t('Calendar controls','日曆控制')}</b><button type="button" data-cal4-close>×</button></header><div class="cal4-drawer-nav"><button type="button" data-cal4-nav="prev-year">« ${t('Year','年')}</button><button type="button" data-cal4-nav="prev-month">‹ ${t('Month','月')}</button><button type="button" data-cal4-nav="today" class="today">${t('Today','今天')}</button><button type="button" data-cal4-nav="next-month">${t('Month','月')} ›</button><button type="button" data-cal4-nav="next-year">${t('Year','年')} »</button></div><label class="cal4-year"><span>${t('Year','年')}</span><input data-cal4-year type="number" inputmode="numeric" min="1900" max="2100" value="${y}"></label><div class="cal4-label">${t('Month','月')}</div><div class="cal4-month-palette">${M_EN.map((_,i)=>`<button type="button" data-cal4-month="${i}" class="${i===m?'on':''}">${esc(monthName(i))}</button>`).join('')}</div><div class="cal4-label">${t('Day','日')}</div><div class="cal4-day-palette">${Array.from({length:dim(y,m)},(_,i)=>`<button type="button" data-cal4-day="${i+1}" class="${i+1===day?'on':''}">${i+1}</button>`).join('')}</div><div class="cal4-drawer-mode"><button type="button" data-cal4-mode="month" class="${mode==='month'?'on':''}">${t('Month view','月視圖')}</button><button type="button" data-cal4-mode="year" class="${mode==='year'?'on':''}">${t('Year view','年視圖')}</button></div></div></section>`;
  }
  function renderMonthGrid(d){
    const y=d.getFullYear(),m=d.getMonth(),sel=iso(d),today=iso(new Date());
    return `<section class="cal4-month"><div class="cal4-week">${[0,1,2,3,4,5,6].map(i=>`<span>${esc(weekName(i))}</span>`).join('')}</div><div class="cal4-grid">${matrix(y,m).map(cell=>{const key=iso(cell),muted=cell.getMonth()!==m,weekend=cell.getDay()===0||cell.getDay()===6,holiday=HOLIDAYS_2026[key];return `<button type="button" data-cal4-cell="${key}" class="cal4-day ${muted?'muted':''} ${weekend?'weekend':''} ${holiday?'holiday':''} ${key===sel?'selected':''} ${key===today?'is-today':''}"><strong>${cell.getDate()}</strong><small>${esc(lunarShort(cell))}</small>${holiday?'<i></i>':''}</button>`;}).join('')}</div></section>`;
  }
  function miniMonth(y,m,d){const sel=iso(d);return `<button type="button" class="cal4-mini ${m===d.getMonth()?'current':''}" data-cal4-mini="${m}"><b>${esc(monthName(m))}</b><div>${matrix(y,m).map(cell=>`<span class="${cell.getMonth()!==m?'muted':''} ${iso(cell)===sel?'selected':''} ${(cell.getDay()===0||cell.getDay()===6)?'weekend':''}">${cell.getDate()}</span>`).join('')}</div></button>`;}
  function renderYearGrid(d){const start=d.getMonth(),months=Array.from({length:12},(_,i)=>(start+i)%12);return `<section class="cal4-year-grid">${months.map(m=>miniMonth(d.getFullYear(),m,d)).join('')}</section>`;}
  function renderSide(d){
    const list=monthEvents(d.getFullYear(),d.getMonth());
    return `<aside class="cal4-side"><section class="cal4-date-card"><div>${d.getDate()}</div><b>${esc(longWeek(d.getDay()))}, ${esc(monthName(d.getMonth()))} ${d.getDate()}, ${d.getFullYear()}</b><span>${t('Lunar','農曆')} · ${esc(lunarFull(d))}</span></section><section class="cal4-events"><h3>${t('This month','本月')}</h3>${list.length?list.map(it=>`<button type="button" data-cal4-jump="${it.date}"><b>${it.date.slice(5).replace('-','/')}</b><span>${esc(it.title)}</span><em>${esc(it.tag)}</em></button>`).join(''):`<p>${t('No official holiday / transfer records this month','本月無官方假期 / 調休記錄')}</p>`}</section></aside>`;
  }
  function renderInner(d,mode,drawer){return `<div class="cal4-app">${renderHeader(d,mode)}${renderDrawer(d,mode,drawer)}<main class="cal4-body"><div class="cal4-primary">${mode==='year'?renderYearGrid(d):renderMonthGrid(d)}</div>${renderSide(d)}</main></div>`;}
  function render(d=new Date(),mode='month'){return `<div class="calendar-v4" data-cal4-ver="${VER}" data-cal4-date="${iso(d)}" data-cal4-mode="${mode}" data-cal4-drawer="0">${renderInner(d,mode,false)}</div>`;}
  function set(root,d,mode,drawer){root.dataset.cal4Ver=VER;root.dataset.cal4Date=iso(d);root.dataset.cal4Mode=mode||'month';root.dataset.cal4Drawer=drawer?'1':'0';root.innerHTML=renderInner(d,root.dataset.cal4Mode,drawer);decorate(root);}
  function jump(root,patch){const s=getState(root);let d=new Date(s.date.getFullYear(),s.date.getMonth(),s.date.getDate());let mode=s.mode;let drawer=patch.drawer!==undefined?patch.drawer:s.drawer;if(patch.mode)mode=patch.mode;if(patch.today)d=new Date();if(patch.year!==undefined){const y=Number(patch.year)||d.getFullYear();d=new Date(y,d.getMonth(),clampDay(y,d.getMonth(),d.getDate()));}if(patch.month!==undefined){const m=Number(patch.month);d=new Date(d.getFullYear(),m,clampDay(d.getFullYear(),m,d.getDate()));}if(patch.day!==undefined)d=new Date(d.getFullYear(),d.getMonth(),clampDay(d.getFullYear(),d.getMonth(),patch.day));if(patch.addMonth){const m=d.getMonth()+patch.addMonth;d=new Date(d.getFullYear(),m,clampDay(d.getFullYear(),m,d.getDate()));}if(patch.addYear){const y=d.getFullYear()+patch.addYear;d=new Date(y,d.getMonth(),clampDay(y,d.getMonth(),d.getDate()));}set(root,d,mode,drawer);}

  function installStyle(){
    document.getElementById('windzxyCalendarV4Style')?.remove();
    const st=document.createElement('style');st.id='windzxyCalendarV4Style';st.textContent=`
.desktop-card.calendar-v4-card{min-width:300px!important;min-height:300px!important}.desktop-card.calendar-v4-card .card-body{padding:0!important;overflow:hidden!important}.desktop-card.calendar-v4-card .resize-grip{z-index:20}.calendar-v4{height:100%;min-height:0;color:#f7f9ff;font-family:inherit;overflow:hidden}.calendar-v4 *{box-sizing:border-box}.cal4-app{position:relative;height:100%;display:grid;grid-template-rows:auto minmax(0,1fr);gap:14px;padding:22px 26px;background:radial-gradient(circle at 12% 0%,rgba(99,173,255,.12),transparent 34%),linear-gradient(145deg,rgba(255,255,255,.065),rgba(255,255,255,.02));overflow:hidden}.cal4-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:start}.cal4-title span{display:block;letter-spacing:.22em;font-size:11px;opacity:.62;margin-bottom:4px}.cal4-title h2{margin:0;font-size:38px;line-height:1;font-weight:950;letter-spacing:-.04em}.cal4-title p{margin:8px 0 0;font-size:15px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cal4-nav{display:flex;gap:10px}.cal4-nav button,.cal4-drawer-nav button,.cal4-drawer-mode button{height:42px;border:1px solid rgba(255,255,255,.14);border-radius:15px;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.055));color:#fff;font-weight:880;cursor:pointer;box-shadow:inset 0 1px rgba(255,255,255,.08)}.cal4-nav button{min-width:46px;padding:0 14px}.cal4-nav .today,.cal4-drawer-nav .today{background:linear-gradient(135deg,rgba(147,88,61,.92),rgba(115,94,66,.85));border-color:rgba(255,183,128,.22)}.cal4-body{min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,28%);gap:18px}.cal4-primary{min-height:0;overflow:hidden}.cal4-month{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px}.cal4-week,.cal4-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:10px}.cal4-week span{text-align:center;font-size:13px;font-weight:850;opacity:.62}.cal4-grid{min-height:0;grid-template-rows:repeat(6,minmax(0,1fr))}.cal4-day{min-width:0;min-height:0;padding:10px;border:1px solid rgba(255,255,255,.10);border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.035));color:#f6f8ff;text-align:left;overflow:hidden;position:relative;cursor:pointer}.cal4-day strong{display:block;font-size:22px;line-height:1;font-weight:920}.cal4-day small{display:block;margin-top:6px;font-size:14px;line-height:1;font-weight:800;opacity:.66}.cal4-day.muted{opacity:.34}.cal4-day.weekend strong{color:#ff7f9d}.cal4-day.selected{border-color:#74f0ff;box-shadow:0 0 0 1px rgba(116,240,255,.46) inset;background:linear-gradient(135deg,rgba(153,92,62,.86),rgba(95,82,63,.68))}.cal4-day.is-today:not(.selected){border-color:rgba(255,186,104,.45)}.cal4-day i{position:absolute;right:8px;top:8px;width:5px;height:5px;border-radius:50%;background:#ffbd77}.cal4-side{min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:14px}.cal4-date-card,.cal4-events{border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,.095),rgba(255,255,255,.035));padding:18px}.cal4-date-card{display:grid;grid-template-columns:auto 1fr;column-gap:14px;align-items:center}.cal4-date-card div{grid-row:1/3;font-size:52px;font-weight:950;line-height:.9;letter-spacing:-.06em}.cal4-date-card b{font-size:16px;line-height:1.25}.cal4-date-card span{font-size:13px;opacity:.72}.cal4-events{min-height:0;overflow:auto}.cal4-events h3{margin:0 0 12px;font-size:18px}.cal4-events p{margin:0;padding:14px;border-radius:14px;background:rgba(255,255,255,.055);opacity:.72;line-height:1.45}.cal4-events button{width:100%;display:grid;grid-template-columns:46px 1fr auto;gap:8px;align-items:center;border:0;border-radius:13px;padding:9px;margin:0 0 8px;background:rgba(255,255,255,.06);color:#fff;text-align:left}.cal4-events b{color:#ffbd77}.cal4-events span{font-weight:800}.cal4-events em{font-style:normal;font-size:11px;opacity:.62}.cal4-year-grid{height:100%;overflow:auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.cal4-mini{border:1px solid rgba(255,255,255,.11);border-radius:16px;padding:10px;background:rgba(255,255,255,.055);color:#fff;text-align:left}.cal4-mini>b{display:block;margin-bottom:8px}.cal4-mini>div{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;text-align:center}.cal4-mini span{font-size:11px;font-weight:760;border-radius:5px}.cal4-mini span.muted{opacity:.25}.cal4-mini span.weekend{color:#ff7894}.cal4-mini span.selected{background:rgba(255,139,82,.78);color:#fff}.cal4-mini.current{border-color:rgba(116,240,255,.56)}.cal4-drawer{position:absolute;z-index:50;inset:0;background:rgba(9,12,18,.38);backdrop-filter:blur(8px);display:grid;place-items:start end;padding:14px}.cal4-drawer[hidden]{display:none!important}.cal4-drawer-card{width:min(390px,100%);max-height:100%;overflow:auto;border:1px solid rgba(255,255,255,.15);border-radius:20px;background:rgba(36,40,50,.98);box-shadow:0 26px 70px rgba(0,0,0,.44);padding:14px}.cal4-drawer-card header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.cal4-drawer-card header b{font-size:15px}.cal4-drawer-card header button{width:30px;height:30px;border:0;border-radius:10px;background:rgba(255,255,255,.08);color:#fff;font-size:18px}.cal4-drawer-nav{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.cal4-drawer-nav button{height:32px;border-radius:10px;font-size:11px;padding:0 4px}.cal4-year span,.cal4-label{display:block;font-size:12px;opacity:.68;margin:10px 0 6px}.cal4-year input{width:100%;height:38px;border:1px solid rgba(255,255,255,.13);border-radius:13px;background:rgba(255,255,255,.07);color:#fff;padding:0 12px;font-weight:850;outline:0}.cal4-month-palette{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.cal4-day-palette{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal4-month-palette button,.cal4-day-palette button{height:32px;border:0;border-radius:10px;background:rgba(255,255,255,.07);color:#fff;font-weight:820}.cal4-month-palette button.on,.cal4-day-palette button.on{background:linear-gradient(135deg,rgba(255,132,82,.8),rgba(255,198,94,.32))}.cal4-drawer-mode{display:grid;grid-template-columns:1fr 1fr;margin-top:12px;border:1px solid rgba(255,255,255,.13);border-radius:13px;overflow:hidden}.cal4-drawer-mode button{height:36px;border:0;border-radius:0;background:transparent}.cal4-drawer-mode button.on{background:linear-gradient(135deg,rgba(139,82,62,.92),rgba(100,72,59,.82))}.calendar-v4.cal4-widget .cal4-app{grid-template-rows:auto minmax(0,1fr);gap:9px;padding:12px}.calendar-v4.cal4-widget .cal4-side{display:none}.calendar-v4.cal4-widget .cal4-body{grid-template-columns:1fr;gap:0}.calendar-v4.cal4-widget .cal4-head{grid-template-columns:1fr auto;gap:8px;align-items:center}.calendar-v4.cal4-widget .cal4-title span{font-size:9px;margin-bottom:2px}.calendar-v4.cal4-widget .cal4-title h2{font-size:22px}.calendar-v4.cal4-widget .cal4-title p{font-size:12px;margin-top:4px}.calendar-v4.cal4-widget .cal4-nav{gap:5px}.calendar-v4.cal4-widget .cal4-nav button{height:31px;min-width:31px;padding:0 8px;border-radius:11px;font-size:12px}.calendar-v4.cal4-widget .cal4-nav .today{min-width:54px}.calendar-v4.cal4-widget .cal4-week,.calendar-v4.cal4-widget .cal4-grid{gap:5px}.calendar-v4.cal4-widget .cal4-week span{font-size:11px}.calendar-v4.cal4-widget .cal4-day{border-radius:11px;padding:6px}.calendar-v4.cal4-widget .cal4-day strong{font-size:15px}.calendar-v4.cal4-widget .cal4-day small{font-size:10px;margin-top:3px}.calendar-v4.cal4-widget .cal4-year-grid{grid-template-columns:repeat(2,1fr);gap:8px}.calendar-v4.cal4-tiny .cal4-app{padding:10px;gap:7px}.calendar-v4.cal4-tiny .cal4-title h2{font-size:20px}.calendar-v4.cal4-tiny .cal4-title span{display:none}.calendar-v4.cal4-tiny .cal4-title p{font-size:11px}.calendar-v4.cal4-tiny .cal4-nav button{height:28px;min-width:28px;padding:0 6px}.calendar-v4.cal4-tiny .cal4-nav .today{min-width:45px}.calendar-v4.cal4-tiny .cal4-week,.calendar-v4.cal4-tiny .cal4-grid{gap:4px}.calendar-v4.cal4-tiny .cal4-day{padding:4px;border-radius:9px}.calendar-v4.cal4-tiny .cal4-day strong{font-size:13px}.calendar-v4.cal4-tiny .cal4-day small{font-size:9px}.calendar-v4.cal4-short .cal4-title p{display:none}.calendar-v4.cal4-short .cal4-week,.calendar-v4.cal4-short .cal4-grid{gap:4px}.calendar-v4.cal4-short .cal4-day{padding:4px}.calendar-v4.cal4-short .cal4-day small{font-size:9px}.calendar-v4.cal4-wide .cal4-app{padding:26px 28px;gap:16px}.calendar-v4.cal4-wide .cal4-title h2{font-size:46px}.calendar-v4.cal4-wide .cal4-grid{gap:12px}.calendar-v4.cal4-wide .cal4-day strong{font-size:26px}.calendar-v4.cal4-wide .cal4-day small{font-size:15px}[data-theme="light"] .calendar-v4{color:#172033}[data-theme="light"] .cal4-app{background:linear-gradient(145deg,rgba(255,255,255,.76),rgba(255,255,255,.45))}[data-theme="light"] .cal4-nav button,[data-theme="light"] .cal4-drawer-nav button,[data-theme="light"] .cal4-drawer-mode,[data-theme="light"] .cal4-day,[data-theme="light"] .cal4-side,[data-theme="light"] .cal4-date-card,[data-theme="light"] .cal4-events,[data-theme="light"] .cal4-drawer-card{color:#172033;border-color:rgba(15,23,42,.13);background:rgba(255,255,255,.62)}[data-theme="light"] .cal4-year input,[data-theme="light"] .cal4-month-palette button,[data-theme="light"] .cal4-day-palette button{color:#172033;background:rgba(15,23,42,.06)}
`;document.head.appendChild(st);
  }
  function decorate(root){const r=root.getBoundingClientRect();root.classList.toggle('cal4-wide',r.width>=930);root.classList.toggle('cal4-widget',r.width<700||r.height<540);root.classList.toggle('cal4-tiny',r.width<430||r.height<420);root.classList.toggle('cal4-short',r.height<460);root.closest('.desktop-card')?.classList.add('calendar-v4-card');}
  function hydrate(){
    document.querySelectorAll('.calendar-v4').forEach(root=>{if(root.dataset.cal4Ver!==VER){const d=parse(root.dataset.cal4Date||root.dataset.cv4Date||iso(new Date()));const mode=(root.dataset.cal4Mode||root.dataset.cv4Mode)==='year'?'year':'month';root.outerHTML=render(d,mode);return;}decorate(root);});
    document.querySelectorAll('.desktop-card').forEach(card=>{const title=card.querySelector('.card-bar h3')?.textContent||'';const body=card.querySelector('.card-body');if(body&&!body.querySelector('.calendar-v4')&&/(Calendar|萬年曆)/i.test(title+body.textContent)){body.innerHTML=render();decorate(body.querySelector('.calendar-v4'));}});
  }
  function closeDrawers(except){document.querySelectorAll('.calendar-v4[data-cal4-drawer="1"]').forEach(root=>{if(root!==except){const s=getState(root);set(root,s.date,s.mode,false);}});}
  function onClick(e){
    const root=e.target.closest('.calendar-v4');
    if(!root){closeDrawers();return;}
    const drawerBtn=e.target.closest('[data-cal4-drawer]');if(drawerBtn){e.preventDefault();const s=getState(root);closeDrawers(root);set(root,s.date,s.mode,!s.drawer);return;}
    if(e.target.closest('[data-cal4-close]')){const s=getState(root);set(root,s.date,s.mode,false);return;}
    const nav=e.target.closest('[data-cal4-nav]');if(nav){const a=nav.dataset.cal4Nav;jump(root,{today:a==='today',addMonth:a==='prev-month'?-1:a==='next-month'?1:0,addYear:a==='prev-year'?-1:a==='next-year'?1:0,drawer:getState(root).drawer});return;}
    const mode=e.target.closest('[data-cal4-mode]');if(mode){jump(root,{mode:mode.dataset.cal4Mode,drawer:getState(root).drawer});return;}
    const month=e.target.closest('[data-cal4-month]');if(month){jump(root,{month:+month.dataset.cal4Month,drawer:true});return;}
    const day=e.target.closest('[data-cal4-day]');if(day){jump(root,{day:+day.dataset.cal4Day,drawer:false});return;}
    const cell=e.target.closest('[data-cal4-cell]');if(cell){const d=parse(cell.dataset.cal4Cell);jump(root,{year:d.getFullYear(),month:d.getMonth(),day:d.getDate(),mode:'month'});return;}
    const mini=e.target.closest('[data-cal4-mini]');if(mini){jump(root,{month:+mini.dataset.cal4Mini,mode:'month'});return;}
    const ev=e.target.closest('[data-cal4-jump]');if(ev){const d=parse(ev.dataset.cal4Jump);jump(root,{year:d.getFullYear(),month:d.getMonth(),day:d.getDate(),mode:'month'});return;}
  }
  function onInput(e){const root=e.target.closest('.calendar-v4');if(root&&e.target.matches('[data-cal4-year]'))jump(root,{year:e.target.value,drawer:true});}
  function patch(){
    if(typeof window.appContent==='function'&&!window.__cal4AppPatch){const old=window.appContent;window.appContent=function(appId){if(appId==='calendar')return render();return old.apply(this,arguments);};window.__cal4AppPatch=true;}
    if(typeof window.bodyHtml==='function'&&!window.__cal4BodyPatch){const old=window.bodyHtml;window.bodyHtml=function(card,info){if(card&&card.appId==='calendar')return render(card.data?.date?parse(card.data.date):new Date(),card.data?.mode||'month');return old.apply(this,arguments);};window.__cal4BodyPatch=true;}
  }
  function boot(){installStyle();patch();document.addEventListener('click',onClick,true);document.addEventListener('input',onInput,true);hydrate();if(window.ResizeObserver){const ro=new ResizeObserver(entries=>entries.forEach(e=>decorate(e.target)));document.querySelectorAll('.calendar-v4').forEach(el=>ro.observe(el));new MutationObserver(()=>document.querySelectorAll('.calendar-v4:not([data-cal4-ro])').forEach(el=>{el.dataset.cal4Ro='1';ro.observe(el);decorate(el);})).observe(document.body,{childList:true,subtree:true});}setTimeout(()=>{try{if(typeof window.renderAll==='function')window.renderAll();}catch(e){}hydrate();},80);setTimeout(hydrate,500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();