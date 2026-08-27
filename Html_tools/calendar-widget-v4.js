(function(){
  'use strict';
  const VER='20260827-calendar-widget-v4-unified-clean';
  if(window.__windzxyCalendarWidgetV4Loaded===VER)return;
  window.__windzxyCalendarWidgetV4Loaded=VER;
  window.__windzxyCalendarWidgetV3Loaded=true;
  window.__windzxyCalendarWidgetLoaded=true;

  const MONTHS_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MONTHS_ZH=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const WEEK_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const WEEK_ZH=['日','一','二','三','四','五','六'];
  const DAY_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const DAY_ZH=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const ZH_NUM=['零','一','二','三','四','五','六','七','八','九','十','十一','十二'];
  const HOLIDAYS_2026={
    '2026-01-01':['元旦','CN/HK'],
    '2026-02-17':['農曆新年','CN/HK'],'2026-02-18':['農曆新年','CN/HK'],'2026-02-19':['農曆新年','CN/HK'],
    '2026-04-03':['耶穌受難節','HK'],'2026-04-04':['清明節','CN/HK'],'2026-04-06':['復活節星期一','HK'],
    '2026-05-01':['勞動節','CN/HK'],'2026-05-25':['佛誕','HK'],
    '2026-06-19':['端午節','CN/HK'],
    '2026-07-01':['香港特別行政區成立紀念日','HK'],
    '2026-09-25':['中秋節翌日','HK'],
    '2026-10-01':['國慶節','CN/HK'],'2026-10-18':['重陽節','HK'],
    '2026-12-25':['聖誕節','HK'],'2026-12-26':['聖誕節後第一個周日','HK']
  };
  const TRANSFER_2026={};

  function pad(n){return String(n).padStart(2,'0');}
  function iso(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}
  function parseISO(v){
    const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m)return new Date();
    return new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));
  }
  function cloneDate(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
  function daysInMonth(y,m){return new Date(y,m+1,0).getDate();}
  function clampDay(y,m,d){return Math.max(1,Math.min(daysInMonth(y,m),Number(d)||1));}
  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||localStorage.getItem('webdesk-lang')||document.documentElement.lang||navigator.language||'zh-HK';
    if(/^en/i.test(v))return 'en';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    return 'zh-HK';
  }
  function zh(){return lang()!=='en';}
  function t(en,zhText){return zh()?zhText:en;}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function dayName(n){return zh()?WEEK_ZH[n]:WEEK_EN[n];}
  function fullDayName(n){return zh()?DAY_ZH[n]:DAY_EN[n];}
  function monthName(m){return zh()?MONTHS_ZH[m]:MONTHS_EN[m];}
  function fmtTitle(d){return `${d.getFullYear()} ${monthName(d.getMonth())}`;}
  function fmtLong(d){return zh()?`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${fullDayName(d.getDay())}`:`${fullDayName(d.getDay())}, ${monthName(d.getMonth())} ${d.getDate()}, ${d.getFullYear()}`;}
  function zhDayName(n){
    n=Number(n)||1;
    if(n<=10)return ['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十'][n];
    if(n<20)return '十'+ZH_NUM[n-10];
    if(n===20)return '二十';
    if(n<30)return '廿'+ZH_NUM[n-20];
    return '三十';
  }
  function lunarInfo(date){
    try{
      const parts=new Intl.DateTimeFormat('zh-Hant-u-ca-chinese',{month:'long',day:'numeric'}).formatToParts(date);
      let month=parts.find(p=>p.type==='month')?.value||'';
      let day=parts.find(p=>p.type==='day')?.value||'';
      const num=String(day).match(/\d+/);
      if(num)day=zhDayName(Number(num[0]));
      day=String(day).replace(/日$/,'');
      if(/^\d+$/.test(day))day=zhDayName(Number(day));
      if(month && !/月$/.test(month))month+='月';
      return {month,day};
    }catch(e){
      return {month:'',day:''};
    }
  }
  function lunarShort(date){
    const l=lunarInfo(date);
    return l.day==='初一'&&l.month?l.month:(l.day||'');
  }
  function lunarFull(date){
    const l=lunarInfo(date);
    return l.month||l.day?`${l.month}${l.day}`:'';
  }
  function monthMatrix(year,month){
    const first=new Date(year,month,1);
    const start=new Date(year,month,1-first.getDay());
    return Array.from({length:42},(_,i)=>new Date(start.getFullYear(),start.getMonth(),start.getDate()+i));
  }
  function stateFromRoot(root){
    const date=parseISO(root?.dataset?.cv4Date||iso(new Date()));
    const mode=root?.dataset?.cv4Mode||'month';
    return {date,mode:mode==='year'?'year':'month'};
  }
  function setState(root,date,mode){
    root.dataset.cv4Date=iso(date);
    root.dataset.cv4Mode=mode||root.dataset.cv4Mode||'month';
    root.innerHTML=renderInner(date,root.dataset.cv4Mode);
    measure(root);
  }
  function monthEvents(year,month){
    const items=[];
    Object.keys(HOLIDAYS_2026).forEach(k=>{
      const d=parseISO(k);
      if(d.getFullYear()===year&&d.getMonth()===month)items.push({date:k,title:HOLIDAYS_2026[k][0],tag:HOLIDAYS_2026[k][1],type:'holiday'});
    });
    Object.keys(TRANSFER_2026).forEach(k=>{
      const d=parseISO(k);
      if(d.getFullYear()===year&&d.getMonth()===month)items.push({date:k,title:TRANSFER_2026[k],tag:t('Transfer','調休'),type:'transfer'});
    });
    items.sort((a,b)=>a.date.localeCompare(b.date));
    return items;
  }
  function renderControls(date,mode){
    const y=date.getFullYear(),m=date.getMonth(),d=date.getDate();
    return `<div class="cv4-controls">
      <label class="cv4-field"><span>${t('Year','年')}</span><input data-cv4-year type="number" inputmode="numeric" min="1900" max="2100" value="${y}"></label>
      <label class="cv4-field"><span>${t('Month','月')}</span><div class="cv4-select" data-cv4-month-shell><button type="button" data-cv4-open-month>${esc(monthName(m))}</button><div class="cv4-menu cv4-month-menu" hidden>${MONTHS_EN.map((_,i)=>`<button type="button" data-cv4-month="${i}" class="${i===m?'on':''}">${esc(monthName(i))}</button>`).join('')}</div></div></label>
      <label class="cv4-field"><span>${t('Day','日')}</span><div class="cv4-select" data-cv4-day-shell><button type="button" data-cv4-open-day>${d}</button><div class="cv4-menu cv4-day-menu" hidden><div class="cv4-menu-head"><b>${t('Select day','選擇日期')}</b><span>${daysInMonth(y,m)}${t(' days',' 日')}</span></div><div class="cv4-day-grid">${Array.from({length:daysInMonth(y,m)},(_,i)=>`<button type="button" data-cv4-day="${i+1}" class="${i+1===d?'on':''}">${i+1}</button>`).join('')}</div></div></div></label>
      <div class="cv4-seg"><button type="button" data-cv4-mode="month" class="${mode==='month'?'on':''}">${t('Month','月')}</button><button type="button" data-cv4-mode="year" class="${mode==='year'?'on':''}">${t('Year','年')}</button></div>
    </div>`;
  }
  function renderNav(){
    return `<div class="cv4-nav"><button type="button" data-cv4-nav="prev-year">«</button><button type="button" data-cv4-nav="prev-month">‹</button><button type="button" data-cv4-nav="today" class="today">${t('Today','今天')}</button><button type="button" data-cv4-nav="next-month">›</button><button type="button" data-cv4-nav="next-year">»</button></div>`;
  }
  function renderHero(date){
    return `<section class="cv4-hero"><div class="cv4-hero-day">${date.getDate()}</div><div><b>${esc(fmtLong(date))}</b><span>${t('Lunar','農曆')} · ${esc(lunarFull(date))}</span></div><em>${date.getDay()===0||date.getDay()===6?t('Weekend','週末'):t('Weekday','工作日')}</em></section>`;
  }
  function renderMonth(date){
    const y=date.getFullYear(),m=date.getMonth(),todayIso=iso(new Date()),selectedIso=iso(date);
    const days=monthMatrix(y,m);
    return `<section class="cv4-content"><div class="cv4-main"><div class="cv4-week">${[0,1,2,3,4,5,6].map(i=>`<span>${esc(dayName(i))}</span>`).join('')}</div><div class="cv4-month-grid">${days.map(day=>{
      const key=iso(day), muted=day.getMonth()!==m, weekend=day.getDay()===0||day.getDay()===6, holiday=HOLIDAYS_2026[key], transfer=TRANSFER_2026[key];
      return `<button type="button" data-cv4-date-cell="${key}" class="cv4-day ${muted?'muted':''} ${weekend?'weekend':''} ${key===selectedIso?'selected':''} ${key===todayIso?'today':''} ${holiday?'holiday':''} ${transfer?'transfer':''}"><strong>${day.getDate()}</strong><small>${esc(lunarShort(day))}</small>${holiday?'<i></i>':''}</button>`;
    }).join('')}</div></div>${renderSide(date)}</section>`;
  }
  function renderSide(date){
    const items=monthEvents(date.getFullYear(),date.getMonth());
    return `<aside class="cv4-side"><h3>${t('This month','本月')}</h3>${items.length?`<div class="cv4-event-list">${items.map(it=>`<div class="cv4-event"><b>${it.date.slice(5).replace('-','/')}</b><span>${esc(it.title)}</span><em>${esc(it.tag)}</em></div>`).join('')}</div>`:`<p>${t('No official holiday / transfer records this month','本月無官方假期 / 調休記錄')}</p>`}</aside>`;
  }
  function miniMonth(year,month,selected){
    const days=monthMatrix(year,month);
    return `<button type="button" class="cv4-mini-month ${month===selected.getMonth()?'current':''}" data-cv4-mini-month="${month}"><b>${esc(monthName(month))}${month===selected.getMonth()?` · ${t('Current','目前')}`:''}</b><div class="cv4-mini-week">${(zh()?WEEK_ZH:WEEK_EN).map(w=>`<span>${esc(w)}</span>`).join('')}</div><div class="cv4-mini-grid">${days.map(day=>{
      const key=iso(day);
      return `<span class="${day.getMonth()!==month?'muted':''} ${key===iso(selected)?'selected':''} ${(day.getDay()===0||day.getDay()===6)?'weekend':''}">${day.getDate()}</span>`;
    }).join('')}</div></button>`;
  }
  function renderYear(date){
    const y=date.getFullYear();
    const start=date.getMonth();
    const months=Array.from({length:12},(_,i)=>(start+i)%12);
    return `<section class="cv4-year-grid">${months.map(m=>miniMonth(y+(start+m>=12&&m<start?1:0),m,date)).join('')}</section>`;
  }
  function renderInner(date,mode){
    return `<header class="cv4-head"><div><p>CALENDAR</p><h2>${esc(fmtTitle(date))}</h2><span>${esc(fmtLong(date))} · ${esc(lunarFull(date))}</span></div>${renderNav()}</header>${renderControls(date,mode)}${renderHero(date)}${mode==='year'?renderYear(date):renderMonth(date)}<footer class="cv4-foot">Calendar V4 · ${VER}<span>${t('Unified calendar engine: solar, lunar, day picker and responsive layout.','單文件萬年曆：公曆、農曆、日期選擇與響應式布局已合併。')}</span></footer>`;
  }
  function render(date=new Date(),mode='month'){
    return `<div class="calendar-v4" data-cv4-date="${iso(date)}" data-cv4-mode="${mode}">${renderInner(date,mode)}</div>`;
  }
  function closeAll(root){(root||document).querySelectorAll('.cv4-menu').forEach(m=>m.hidden=true);}
  function jump(root,patch){
    const s=stateFromRoot(root);let d=cloneDate(s.date);
    if(patch.year!==undefined)d.setFullYear(Number(patch.year)||d.getFullYear());
    if(patch.month!==undefined)d=new Date(d.getFullYear(),Number(patch.month),clampDay(d.getFullYear(),Number(patch.month),d.getDate()));
    if(patch.day!==undefined)d.setDate(clampDay(d.getFullYear(),d.getMonth(),patch.day));
    if(patch.addMonth)d=new Date(d.getFullYear(),d.getMonth()+patch.addMonth,clampDay(d.getFullYear(),d.getMonth()+patch.addMonth,d.getDate()));
    if(patch.addYear)d=new Date(d.getFullYear()+patch.addYear,d.getMonth(),clampDay(d.getFullYear()+patch.addYear,d.getMonth(),d.getDate()));
    if(patch.today)d=new Date();
    if(patch.mode)s.mode=patch.mode;
    setState(root,d,s.mode);
  }
  function onClick(e){
    const root=e.target.closest('.calendar-v4');
    if(!root){closeAll();return;}
    const openMonth=e.target.closest('[data-cv4-open-month]');
    const openDay=e.target.closest('[data-cv4-open-day]');
    if(openMonth||openDay){e.preventDefault();e.stopPropagation();const shell=e.target.closest('.cv4-select');const menu=shell?.querySelector('.cv4-menu');const shouldOpen=menu?.hidden;closeAll(root);if(menu){menu.hidden=!shouldOpen;}return;}
    const mBtn=e.target.closest('[data-cv4-month]');
    if(mBtn){e.preventDefault();closeAll(root);jump(root,{month:Number(mBtn.dataset.cv4Month)});return;}
    const dBtn=e.target.closest('[data-cv4-day]');
    if(dBtn){e.preventDefault();closeAll(root);jump(root,{day:Number(dBtn.dataset.cv4Day)});return;}
    const cell=e.target.closest('[data-cv4-date-cell]');
    if(cell){e.preventDefault();setState(root,parseISO(cell.dataset.cv4DateCell),'month');return;}
    const mini=e.target.closest('[data-cv4-mini-month]');
    if(mini){e.preventDefault();const s=stateFromRoot(root);const m=Number(mini.dataset.cv4MiniMonth);setState(root,new Date(s.date.getFullYear(),m,clampDay(s.date.getFullYear(),m,s.date.getDate())),'month');return;}
    const nav=e.target.closest('[data-cv4-nav]');
    if(nav){e.preventDefault();const n=nav.dataset.cv4Nav; if(n==='prev-month')jump(root,{addMonth:-1}); if(n==='next-month')jump(root,{addMonth:1}); if(n==='prev-year')jump(root,{addYear:-1}); if(n==='next-year')jump(root,{addYear:1}); if(n==='today')jump(root,{today:true}); return;}
    const mode=e.target.closest('[data-cv4-mode]');
    if(mode){e.preventDefault();jump(root,{mode:mode.dataset.cv4Mode});return;}
  }
  function onChange(e){
    const root=e.target.closest('.calendar-v4');
    if(!root)return;
    if(e.target.matches('[data-cv4-year]'))jump(root,{year:Number(e.target.value)});
  }
  function measure(root){
    if(!root)return;
    const w=root.getBoundingClientRect().width;
    root.classList.toggle('cv4-compact',w<760);
    root.classList.toggle('cv4-phone',w<560);
    root.classList.toggle('cv4-wide',w>=900);
  }
  function enhanceExisting(){
    document.querySelectorAll('.calendar-v4').forEach(measure);
    document.querySelectorAll('.calendar-v3,.calendar-widget,.calendar-shell').forEach(old=>{
      if(old.closest('.calendar-v4'))return;
      const d=old.querySelector('[data-cv3-date]')?.value||old.dataset?.cv3Date||iso(new Date());
      const mode=old.dataset?.cv3Mode||'month';
      old.outerHTML=render(parseISO(String(d).replace(/\//g,'-')),mode);
    });
    document.querySelectorAll('[data-inline-app="calendar"]').forEach(box=>{if(!box.querySelector('.calendar-v4'))box.innerHTML=render();});
  }
  function installStyle(){
    if(document.getElementById('windzxyCalendarV4Style'))return;
    const style=document.createElement('style');style.id='windzxyCalendarV4Style';style.textContent=`
.calendar-v4{--cv4-bg:rgba(42,46,56,.72);--cv4-card:rgba(255,255,255,.085);--cv4-line:rgba(255,255,255,.14);--cv4-text:#f5f7fb;--cv4-sub:rgba(245,247,251,.68);--cv4-accent:#8f624f;--cv4-hot:#ff7f9b;box-sizing:border-box;width:100%;height:100%;min-height:430px;display:flex;flex-direction:column;gap:12px;padding:18px;color:var(--cv4-text);overflow:auto}.calendar-v4 *{box-sizing:border-box}.cv4-head{display:flex;justify-content:space-between;gap:16px;align-items:start}.cv4-head p{margin:0 0 4px;letter-spacing:.22em;font-size:12px;color:var(--cv4-sub)}.cv4-head h2{margin:0;font-size:30px;line-height:1.06}.cv4-head span,.cv4-foot{color:var(--cv4-sub);font-size:13px}.cv4-nav{display:flex;gap:10px;align-items:center;flex:0 0 auto}.cv4-nav button,.cv4-seg button,.cv4-select button,.cv4-field input{height:44px;border:1px solid var(--cv4-line);border-radius:17px;background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.07));color:var(--cv4-text);font:inherit;font-weight:800}.cv4-nav button{width:50px}.cv4-nav .today{width:110px;background:linear-gradient(135deg,rgba(136,89,70,.92),rgba(113,93,67,.8))}.cv4-controls{display:grid;grid-template-columns:minmax(130px,.9fr) minmax(180px,1.05fr) minmax(110px,.45fr) minmax(150px,.85fr);gap:10px;align-items:end}.cv4-field{display:flex;flex-direction:column;gap:6px;min-width:0}.cv4-field>span{font-size:12px;color:var(--cv4-sub)}.cv4-field input{width:100%;padding:0 14px}.cv4-select{position:relative}.cv4-select>[data-cv4-open-month],.cv4-select>[data-cv4-open-day]{width:100%;display:flex;justify-content:space-between;align-items:center;padding:0 14px}.cv4-select>[data-cv4-open-month]:after,.cv4-select>[data-cv4-open-day]:after{content:'⌄';opacity:.7}.cv4-menu{position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);z-index:99999;width:286px;padding:12px;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:rgba(38,42,51,.98);box-shadow:0 22px 50px rgba(0,0,0,.45);backdrop-filter:blur(18px)}.cv4-menu[hidden]{display:none!important}.cv4-month-menu{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.cv4-month-menu button,.cv4-day-grid button{height:34px;border:0;border-radius:11px;background:rgba(255,255,255,.07);color:var(--cv4-text);font-weight:850}.cv4-month-menu button.on,.cv4-day-grid button.on{background:linear-gradient(135deg,rgba(255,122,60,.62),rgba(255,202,88,.28));color:white}.cv4-menu-head{display:flex;justify-content:space-between;color:var(--cv4-sub);margin-bottom:10px}.cv4-menu-head b{color:var(--cv4-text)}.cv4-day-grid{display:grid;grid-template-columns:repeat(7,32px);gap:7px;justify-content:center}.cv4-seg{display:grid;grid-template-columns:1fr 1fr;height:44px;border:1px solid var(--cv4-line);border-radius:17px;overflow:hidden}.cv4-seg button{border:0;border-radius:0;background:transparent}.cv4-seg button.on{background:rgba(132,78,60,.88)}.cv4-hero{display:flex;gap:14px;align-items:center;padding:14px 16px;border:1px solid var(--cv4-line);border-radius:22px;background:var(--cv4-card)}.cv4-hero-day{font-size:44px;font-weight:900}.cv4-hero b{display:block;font-size:18px}.cv4-hero span{display:block;color:var(--cv4-sub);margin-top:3px}.cv4-hero em{margin-left:auto;border:1px solid var(--cv4-line);border-radius:999px;padding:6px 10px;font-style:normal;font-size:12px}.cv4-content{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:14px;min-height:0}.cv4-week,.cv4-month-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}.cv4-week span{text-align:center;color:var(--cv4-sub);font-size:12px;font-weight:800}.cv4-day{min-height:62px;border:1px solid rgba(255,255,255,.11);border-radius:15px;background:rgba(255,255,255,.075);color:var(--cv4-text);text-align:left;padding:10px;position:relative}.cv4-day strong{display:block;font-size:18px}.cv4-day small{display:block;color:var(--cv4-sub);font-weight:800;margin-top:2px}.cv4-day.weekend strong{color:var(--cv4-hot)}.cv4-day.muted{opacity:.38}.cv4-day.selected{background:linear-gradient(135deg,rgba(141,92,70,.9),rgba(133,111,72,.72));box-shadow:0 0 0 2px rgba(118,235,255,.9) inset}.cv4-day.today:not(.selected){box-shadow:0 0 0 1px rgba(118,235,255,.65) inset}.cv4-day i{position:absolute;right:9px;top:9px;width:6px;height:6px;border-radius:99px;background:#ffc55b}.cv4-side{border:1px solid var(--cv4-line);border-radius:22px;background:var(--cv4-card);padding:16px;min-height:220px}.cv4-side h3{margin:0 0 14px}.cv4-side p{margin:0;color:var(--cv4-sub);line-height:1.55}.cv4-event{display:grid;grid-template-columns:46px 1fr;gap:8px;align-items:center;padding:10px;border-radius:14px;background:rgba(255,255,255,.06);margin-bottom:8px}.cv4-event em{grid-column:2;color:var(--cv4-sub);font-style:normal;font-size:11px}.cv4-year-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.cv4-mini-month{border:1px solid var(--cv4-line);border-radius:18px;background:var(--cv4-card);padding:14px;color:var(--cv4-text);text-align:left}.cv4-mini-month.current{box-shadow:0 0 0 2px rgba(118,235,255,.55) inset}.cv4-mini-month b{display:block;margin-bottom:9px}.cv4-mini-week,.cv4-mini-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center}.cv4-mini-week span{color:var(--cv4-sub);font-size:11px}.cv4-mini-grid span{font-size:12px;font-weight:800;padding:4px 0;border-radius:8px}.cv4-mini-grid span.weekend{color:var(--cv4-hot)}.cv4-mini-grid span.muted{opacity:.25}.cv4-mini-grid span.selected{background:rgba(255,122,60,.55);color:#fff}.cv4-foot{display:flex;justify-content:space-between;gap:12px;margin-top:auto}.calendar-v4.cv4-compact{padding:16px}.calendar-v4.cv4-compact .cv4-head{flex-direction:column}.calendar-v4.cv4-compact .cv4-nav button{width:46px}.calendar-v4.cv4-compact .cv4-nav .today{width:96px}.calendar-v4.cv4-compact .cv4-controls{grid-template-columns:1fr 1fr}.calendar-v4.cv4-compact .cv4-field:nth-child(3){grid-column:auto}.calendar-v4.cv4-compact .cv4-content{grid-template-columns:1fr}.calendar-v4.cv4-compact .cv4-side{display:none}.calendar-v4.cv4-phone .cv4-head h2{font-size:26px}.calendar-v4.cv4-phone .cv4-nav{gap:8px}.calendar-v4.cv4-phone .cv4-nav button{width:42px}.calendar-v4.cv4-phone .cv4-nav .today{width:82px}.calendar-v4.cv4-phone .cv4-hero{padding:12px}.calendar-v4.cv4-phone .cv4-day{min-height:54px;padding:8px}.calendar-v4.cv4-phone .cv4-day strong{font-size:16px}.calendar-v4.cv4-phone .cv4-day small{font-size:11px}.calendar-v4.cv4-phone .cv4-foot span{display:none}.calendar-v4.cv4-phone .cv4-menu{left:auto;right:0;transform:none}.desktop-window-calendar .window-body,.desktop-card[data-app-id="calendar"] .card-body{overflow:hidden!important}
`;
    document.head.appendChild(style);
  }
  function patchHooks(){
    if(typeof window.appContent==='function'&&!window.__windzxyCalendarV4AppContentPatched){
      const old=window.appContent;
      window.appContent=function(appId){if(appId==='calendar')return render();return old.apply(this,arguments);};
      window.__windzxyCalendarV4AppContentPatched=true;
    }
    if(typeof window.bodyHtml==='function'&&!window.__windzxyCalendarV4BodyPatched){
      const old=window.bodyHtml;
      window.bodyHtml=function(card,info){if(card&&card.appId==='calendar')return render();return old.apply(this,arguments);};
      window.__windzxyCalendarV4BodyPatched=true;
    }
  }
  function boot(){
    installStyle();patchHooks();enhanceExisting();
    document.addEventListener('click',onClick,true);
    document.addEventListener('change',onChange,true);
    const ro=new ResizeObserver(entries=>entries.forEach(e=>measure(e.target)));
    document.querySelectorAll('.calendar-v4').forEach(el=>ro.observe(el));
    const mo=new MutationObserver(()=>{enhanceExisting();document.querySelectorAll('.calendar-v4').forEach(el=>ro.observe(el));});
    mo.observe(document.getElementById('desktopCanvas')||document.body,{childList:true,subtree:true});
    setTimeout(()=>{try{if(typeof window.renderAll==='function')window.renderAll();}catch(e){}enhanceExisting();},80);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyCalendarWidgetV4Version=VER;
})();
