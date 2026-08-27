(function(){
  'use strict';
  const VER='20260827-calendar-widget-v4-compact-professional';
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
    '2026-01-01':['元旦','CN/HK'],'2026-02-17':['農曆新年','CN/HK'],'2026-02-18':['農曆新年','CN/HK'],'2026-02-19':['農曆新年','CN/HK'],
    '2026-04-03':['耶穌受難節','HK'],'2026-04-04':['清明節','CN/HK'],'2026-04-06':['復活節星期一','HK'],'2026-05-01':['勞動節','CN/HK'],
    '2026-05-25':['佛誕','HK'],'2026-06-19':['端午節','CN/HK'],'2026-07-01':['香港特別行政區成立紀念日','HK'],'2026-09-25':['中秋節翌日','HK'],
    '2026-10-01':['國慶節','CN/HK'],'2026-10-18':['重陽節','HK'],'2026-12-25':['聖誕節','HK'],'2026-12-26':['聖誕節後第一個周日','HK']
  };
  const TRANSFER_2026={};
  const observed=new WeakSet();
  let resizeObserver=null;

  function pad(n){return String(n).padStart(2,'0');}
  function iso(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}
  function parseISO(v){const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?new Date(+m[1],+m[2]-1,+m[3]):new Date();}
  function daysInMonth(y,m){return new Date(y,m+1,0).getDate();}
  function clampDay(y,m,d){return Math.max(1,Math.min(daysInMonth(y,m),Number(d)||1));}
  function addMonths(date,n){return new Date(date.getFullYear(),date.getMonth()+n,clampDay(date.getFullYear(),date.getMonth()+n,date.getDate()));}
  function addYears(date,n){return new Date(date.getFullYear()+n,date.getMonth(),clampDay(date.getFullYear()+n,date.getMonth(),date.getDate()));}
  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||localStorage.getItem('webdesk-lang')||document.documentElement.lang||navigator.language||'zh-HK';
    if(/^en/i.test(v))return 'en';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    return 'zh-HK';
  }
  function zh(){return lang()!=='en';}
  function txt(en,zhText){return zh()?zhText:en;}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function monthName(m){return zh()?MONTHS_ZH[m]:MONTHS_EN[m];}
  function weekName(i){return zh()?WEEK_ZH[i]:WEEK_EN[i];}
  function fullWeek(i){return zh()?DAY_ZH[i]:DAY_EN[i];}
  function fmtTitle(d){return zh()?`${d.getFullYear()}年${d.getMonth()+1}月`:`${d.getFullYear()} ${monthName(d.getMonth())}`;}
  function fmtLong(d){return zh()?`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${fullWeek(d.getDay())}`:`${fullWeek(d.getDay())}, ${monthName(d.getMonth())} ${d.getDate()}, ${d.getFullYear()}`;}
  function zhDayName(n){n=+n||1;if(n<=10)return ['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十'][n];if(n<20)return '十'+ZH_NUM[n-10];if(n===20)return '二十';if(n<30)return '廿'+ZH_NUM[n-20];return '三十';}
  function lunarInfo(date){
    try{
      const parts=new Intl.DateTimeFormat('zh-Hant-u-ca-chinese',{month:'long',day:'numeric'}).formatToParts(date);
      let m=parts.find(p=>p.type==='month')?.value||'';let d=parts.find(p=>p.type==='day')?.value||'';
      const hit=String(d).match(/\d+/);if(hit)d=zhDayName(+hit[0]);d=String(d).replace(/日$/,'');if(/^\d+$/.test(d))d=zhDayName(+d);if(m&&!/月$/.test(m))m+='月';
      return {month:m,day:d};
    }catch(e){return {month:'',day:''};}
  }
  function lunarShort(date){const l=lunarInfo(date);return l.day==='初一'&&l.month?l.month:(l.day||'');}
  function lunarFull(date){const l=lunarInfo(date);return (l.month||'')+(l.day||'');}
  function monthMatrix(y,m){const start=new Date(y,m,1-new Date(y,m,1).getDay());return Array.from({length:42},(_,i)=>new Date(start.getFullYear(),start.getMonth(),start.getDate()+i));}
  function state(root){return {date:parseISO(root?.dataset.cv4Date||iso(new Date())),mode:root?.dataset.cv4Mode==='year'?'year':'month'};}
  function setState(root,date,mode){root.dataset.cv4Date=iso(date);root.dataset.cv4Mode=mode||state(root).mode;root.innerHTML=inner(date,root.dataset.cv4Mode);bindMeasure(root);measure(root);}
  function eventsFor(y,m){
    const list=[];
    for(const k of Object.keys(HOLIDAYS_2026)){const d=parseISO(k);if(d.getFullYear()===y&&d.getMonth()===m)list.push({date:k,title:HOLIDAYS_2026[k][0],tag:HOLIDAYS_2026[k][1]});}
    for(const k of Object.keys(TRANSFER_2026)){const d=parseISO(k);if(d.getFullYear()===y&&d.getMonth()===m)list.push({date:k,title:TRANSFER_2026[k],tag:txt('Transfer','調休')});}
    return list.sort((a,b)=>a.date.localeCompare(b.date));
  }

  function nav(){return `<div class="cv4-nav"><button type="button" data-cv4-nav="prev-year">«</button><button type="button" data-cv4-nav="prev-month">‹</button><button type="button" class="today" data-cv4-nav="today">${txt('Today','今天')}</button><button type="button" data-cv4-nav="next-month">›</button><button type="button" data-cv4-nav="next-year">»</button></div>`;}
  function controls(date,mode){
    const y=date.getFullYear(),m=date.getMonth(),d=date.getDate(),max=daysInMonth(y,m);
    return `<section class="cv4-controls">
      <label class="cv4-field"><span>${txt('Year','年')}</span><input type="number" inputmode="numeric" min="1900" max="2100" data-cv4-year value="${y}"></label>
      <label class="cv4-field"><span>${txt('Month','月')}</span><div class="cv4-select"><button type="button" data-cv4-open-month>${esc(monthName(m))}</button><div class="cv4-menu cv4-month-menu" hidden>${MONTHS_EN.map((_,i)=>`<button type="button" data-cv4-month="${i}" class="${i===m?'on':''}">${esc(monthName(i))}</button>`).join('')}</div></div></label>
      <label class="cv4-field cv4-day-field"><span>${txt('Day','日')}</span><div class="cv4-select"><button type="button" data-cv4-open-day>${d}</button><div class="cv4-menu cv4-day-menu" hidden><div class="cv4-menu-head"><b>${txt('Select day','選擇日期')}</b><em>${max}${txt(' days',' 日')}</em></div><div class="cv4-day-grid">${Array.from({length:max},(_,i)=>`<button type="button" data-cv4-day="${i+1}" class="${i+1===d?'on':''}">${i+1}</button>`).join('')}</div></div></div></label>
      <div class="cv4-seg"><button type="button" data-cv4-mode="month" class="${mode==='month'?'on':''}">${txt('Month','月')}</button><button type="button" data-cv4-mode="year" class="${mode==='year'?'on':''}">${txt('Year','年')}</button></div>
    </section>`;
  }
  function hero(date){return `<section class="cv4-hero"><b>${date.getDate()}</b><div><strong>${esc(fmtLong(date))}</strong><span>${txt('Lunar','農曆')} · ${esc(lunarFull(date))}</span></div><em>${date.getDay()===0||date.getDay()===6?txt('Weekend','週末'):txt('Weekday','工作日')}</em></section>`;}
  function side(date){const items=eventsFor(date.getFullYear(),date.getMonth());return `<aside class="cv4-side"><h3>${txt('This month','本月')}</h3>${items.length?`<div class="cv4-events">${items.map(it=>`<div class="cv4-event"><b>${it.date.slice(5).replace('-','/')}</b><span>${esc(it.title)}</span><em>${esc(it.tag)}</em></div>`).join('')}</div>`:`<p>${txt('No official holiday / transfer records this month','本月無官方假期 / 調休記錄')}</p>`}</aside>`;}
  function monthView(date){
    const y=date.getFullYear(),m=date.getMonth(),selected=iso(date),today=iso(new Date());
    const cells=monthMatrix(y,m).map(day=>{const key=iso(day),muted=day.getMonth()!==m,weekend=day.getDay()===0||day.getDay()===6,holiday=HOLIDAYS_2026[key];return `<button type="button" data-cv4-date-cell="${key}" class="cv4-day ${muted?'muted':''} ${weekend?'weekend':''} ${holiday?'holiday':''} ${key===selected?'selected':''} ${key===today?'today':''}"><strong>${day.getDate()}</strong><small>${esc(lunarShort(day))}</small></button>`;}).join('');
    return `<section class="cv4-body cv4-month-layout"><main class="cv4-main"><div class="cv4-week">${[0,1,2,3,4,5,6].map(i=>`<span>${esc(weekName(i))}</span>`).join('')}</div><div class="cv4-month-grid">${cells}</div></main>${side(date)}</section>`;
  }
  function miniMonth(y,m,selected){
    const cells=monthMatrix(y,m).map(day=>`<span class="${day.getMonth()!==m?'muted':''} ${iso(day)===iso(selected)?'selected':''} ${(day.getDay()===0||day.getDay()===6)?'weekend':''}">${day.getDate()}</span>`).join('');
    return `<button type="button" class="cv4-mini-month ${m===selected.getMonth()&&y===selected.getFullYear()?'current':''}" data-cv4-mini-month="${m}" data-cv4-mini-year="${y}"><b>${esc(monthName(m))}${m===selected.getMonth()&&y===selected.getFullYear()?` · ${txt('Current','目前')}`:''}</b><div class="cv4-mini-week">${[0,1,2,3,4,5,6].map(i=>`<span>${esc(weekName(i))}</span>`).join('')}</div><div class="cv4-mini-grid">${cells}</div></button>`;
  }
  function yearView(date){const y=date.getFullYear(),start=date.getMonth();const months=Array.from({length:12},(_,i)=>({m:(start+i)%12,y:y+(start+i>=12?1:0)}));return `<section class="cv4-body cv4-year-grid">${months.map(x=>miniMonth(x.y,x.m,date)).join('')}</section>`;}
  function inner(date,mode){return `<header class="cv4-head"><div class="cv4-title"><p>CALENDAR</p><h2>${esc(fmtTitle(date))}</h2><span>${esc(fmtLong(date))} · ${esc(lunarFull(date))}</span></div>${nav()}</header>${controls(date,mode)}${hero(date)}${mode==='year'?yearView(date):monthView(date)}<footer class="cv4-foot"><span>Calendar V4 · ${VER}</span><span>${txt('Unified calendar engine: solar, lunar and responsive layout.','單文件萬年曆：公曆、農曆與響應式布局已合併。')}</span></footer>`;}
  function render(date=new Date(),mode='month'){return `<div class="calendar-v4" data-cv4-version="${VER}" data-cv4-date="${iso(date)}" data-cv4-mode="${mode}">${inner(date,mode)}</div>`;}

  function closeMenus(root){(root||document).querySelectorAll('.cv4-menu').forEach(m=>m.hidden=true);}
  function jump(root,patch){
    const s=state(root);let d=new Date(s.date.getFullYear(),s.date.getMonth(),s.date.getDate()),mode=s.mode;
    if(patch.year!==undefined)d=new Date(+patch.year||d.getFullYear(),d.getMonth(),clampDay(+patch.year||d.getFullYear(),d.getMonth(),d.getDate()));
    if(patch.month!==undefined)d=new Date(d.getFullYear(),+patch.month,clampDay(d.getFullYear(),+patch.month,d.getDate()));
    if(patch.day!==undefined)d=new Date(d.getFullYear(),d.getMonth(),clampDay(d.getFullYear(),d.getMonth(),patch.day));
    if(patch.addMonth)d=addMonths(d,patch.addMonth);
    if(patch.addYear)d=addYears(d,patch.addYear);
    if(patch.today)d=new Date();
    if(patch.mode)mode=patch.mode;
    setState(root,d,mode);
  }
  function onClick(e){
    const root=e.target.closest('.calendar-v4');
    if(!root){closeMenus();return;}
    const open=e.target.closest('[data-cv4-open-month],[data-cv4-open-day]');
    if(open){e.preventDefault();e.stopPropagation();const shell=open.closest('.cv4-select'),menu=shell?.querySelector('.cv4-menu'),should=menu?.hidden;closeMenus(root);if(menu)menu.hidden=!should;return;}
    const navBtn=e.target.closest('[data-cv4-nav]');
    if(navBtn){const a=navBtn.dataset.cv4Nav;jump(root,{addYear:a==='prev-year'?-1:a==='next-year'?1:0,addMonth:a==='prev-month'?-1:a==='next-month'?1:0,today:a==='today'});return;}
    const modeBtn=e.target.closest('[data-cv4-mode]');if(modeBtn){jump(root,{mode:modeBtn.dataset.cv4Mode});return;}
    const month=e.target.closest('[data-cv4-month]');if(month){jump(root,{month:+month.dataset.cv4Month});return;}
    const day=e.target.closest('[data-cv4-day]');if(day){jump(root,{day:+day.dataset.cv4Day});return;}
    const cell=e.target.closest('[data-cv4-date-cell]');if(cell){setState(root,parseISO(cell.dataset.cv4DateCell),'month');return;}
    const mini=e.target.closest('[data-cv4-mini-month]');if(mini){const s=state(root);setState(root,new Date(+mini.dataset.cv4MiniYear,+mini.dataset.cv4MiniMonth,clampDay(+mini.dataset.cv4MiniYear,+mini.dataset.cv4MiniMonth,s.date.getDate())),'month');return;}
    if(!e.target.closest('.cv4-select'))closeMenus(root);
  }
  function onChange(e){const root=e.target.closest('.calendar-v4');if(root&&e.target.matches('[data-cv4-year]'))jump(root,{year:e.target.value});}

  function installStyle(){
    document.getElementById('windzxyCalendarV4Style')?.remove();
    const style=document.createElement('style');
    style.id='windzxyCalendarV4Style';
    style.textContent=`
.calendar-v4{height:100%;min-height:0;display:flex;flex-direction:column;gap:12px;overflow:hidden;padding:18px 22px 14px;color:#f5f7fb;font-family:inherit;box-sizing:border-box;container-type:inline-size}.calendar-v4 *{box-sizing:border-box}.cv4-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:18px;flex:0 0 auto}.cv4-title p{margin:0 0 4px;font-size:12px;letter-spacing:.22em;opacity:.62}.cv4-title h2{margin:0;font-size:clamp(28px,3.2vw,38px);line-height:1.05;font-weight:900}.cv4-title span{display:block;margin-top:4px;color:rgba(245,247,251,.72);font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cv4-nav{display:flex;align-items:center;gap:10px;justify-content:flex-end}.cv4-nav button,.cv4-seg button,.cv4-select>button,.cv4-field input{height:44px;border:1px solid rgba(255,255,255,.16);background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.07));color:#f5f7fb;border-radius:18px;font:inherit;font-weight:850;box-shadow:inset 0 1px rgba(255,255,255,.08)}.cv4-nav button{width:54px;flex:0 0 54px;font-size:18px}.cv4-nav .today{width:116px;flex-basis:116px;background:linear-gradient(135deg,rgba(142,86,64,.94),rgba(114,95,67,.92))}.cv4-controls{display:grid;grid-template-columns:minmax(120px,.9fr) minmax(190px,1.05fr) minmax(112px,.45fr) minmax(160px,.76fr);align-items:end;gap:12px;flex:0 0 auto}.cv4-field{display:block;min-width:0}.cv4-field>span{display:block;margin:0 0 7px;color:rgba(245,247,251,.72);font-size:13px}.cv4-field input,.cv4-select>button{width:100%;text-align:left;padding:0 16px}.cv4-select{position:relative;min-width:0}.cv4-select>button{display:flex;align-items:center;justify-content:space-between}.cv4-select>button:after{content:'⌄';font-size:12px;opacity:.7}.cv4-menu{position:absolute;z-index:50;top:calc(100% + 8px);left:0;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:rgba(39,43,52,.985);box-shadow:0 20px 46px rgba(0,0,0,.42),inset 0 1px rgba(255,255,255,.08);backdrop-filter:blur(18px);padding:12px}.cv4-menu[hidden]{display:none}.cv4-month-menu{width:260px;display:grid;grid-template-columns:1fr 1fr;gap:7px}.cv4-month-menu button,.cv4-day-grid button{border:0;border-radius:11px;background:rgba(255,255,255,.06);color:#f5f7fb;font-weight:850}.cv4-month-menu button{height:34px}.cv4-menu button.on{background:linear-gradient(135deg,rgba(255,122,60,.62),rgba(255,202,88,.28));color:#fff}.cv4-day-menu{width:300px;left:50%;transform:translateX(-50%)}.cv4-menu-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.cv4-menu-head b{font-size:13px}.cv4-menu-head em{font-style:normal;font-size:12px;opacity:.62}.cv4-day-grid{display:grid;grid-template-columns:repeat(7,34px);gap:7px;justify-content:center}.cv4-day-grid button{width:34px;height:34px;font-size:13px}.cv4-seg{height:44px;display:grid;grid-template-columns:1fr 1fr;border:1px solid rgba(255,255,255,.16);border-radius:18px;overflow:hidden;background:rgba(20,24,34,.18)}.cv4-seg button{width:100%;height:100%;border:0;border-radius:0;background:transparent}.cv4-seg button.on{background:rgba(142,78,60,.88)}.cv4-hero{min-height:86px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:16px;padding:14px 18px;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:linear-gradient(135deg,rgba(255,255,255,.11),rgba(255,255,255,.055));flex:0 0 auto}.cv4-hero>b{font-size:58px;line-height:.9}.cv4-hero strong{display:block;font-size:21px;line-height:1.15}.cv4-hero span{display:block;margin-top:5px;font-size:16px;color:rgba(245,247,251,.72)}.cv4-hero em{font-style:normal;border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:8px 14px;color:rgba(245,247,251,.86)}.cv4-body{flex:1 1 auto;min-height:0}.cv4-month-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,320px);gap:16px}.cv4-main{min-height:0;display:flex;flex-direction:column;gap:8px}.cv4-week,.cv4-month-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}.cv4-week{height:22px;flex:0 0 22px}.cv4-week span{text-align:center;color:rgba(245,247,251,.62);font-weight:850;font-size:13px}.cv4-month-grid{flex:1 1 auto;min-height:0;grid-template-rows:repeat(6,minmax(48px,1fr))}.cv4-day{min-width:0;min-height:0;padding:9px 10px;border:1px solid rgba(255,255,255,.10);border-radius:18px;background:rgba(255,255,255,.07);color:#f5f7fb;text-align:left;display:flex;flex-direction:column;gap:5px}.cv4-day strong{font-size:22px;line-height:1;font-weight:900}.cv4-day small{font-size:13px;line-height:1;color:rgba(245,247,251,.66);font-weight:800}.cv4-day.weekend strong{color:#ff7b98}.cv4-day.muted{opacity:.38}.cv4-day.selected{background:linear-gradient(135deg,rgba(146,88,54,.92),rgba(116,91,58,.82));box-shadow:0 0 0 2px #78eeff inset}.cv4-day.today:not(.selected){box-shadow:0 0 0 1px rgba(120,238,255,.55) inset}.cv4-side{min-height:0;border:1px solid rgba(255,255,255,.12);border-radius:24px;background:rgba(255,255,255,.07);padding:20px 22px;overflow:auto}.cv4-side h3{margin:0 0 18px;font-size:20px}.cv4-side p{margin:0;color:rgba(245,247,251,.72);line-height:1.55}.cv4-events{display:grid;gap:10px}.cv4-event{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;padding:10px;border-radius:14px;background:rgba(255,255,255,.065)}.cv4-event em{grid-column:2;font-style:normal;font-size:12px;opacity:.6}.cv4-year-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;overflow:auto;padding-right:4px}.cv4-mini-month{text-align:left;border:1px solid rgba(255,255,255,.11);border-radius:20px;background:rgba(255,255,255,.07);color:#f5f7fb;padding:14px}.cv4-mini-month.current{box-shadow:0 0 0 2px rgba(120,238,255,.55) inset}.cv4-mini-month b{display:block;margin-bottom:10px}.cv4-mini-week,.cv4-mini-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;text-align:center}.cv4-mini-week span{font-size:11px;opacity:.55;font-weight:850}.cv4-mini-grid span{font-size:13px;font-weight:800;line-height:22px;border-radius:7px}.cv4-mini-grid .muted{opacity:.28}.cv4-mini-grid .weekend{color:#ff7895}.cv4-mini-grid .selected{background:rgba(160,95,62,.9);color:#fff}.cv4-foot{display:grid;grid-template-columns:1fr auto;gap:12px;flex:0 0 auto;color:rgba(245,247,251,.62);font-size:12px}.calendar-v4.cv4-compact{padding:16px 18px 12px;gap:10px}.calendar-v4.cv4-compact .cv4-year-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.calendar-v4.cv4-narrow .cv4-head{grid-template-columns:1fr}.calendar-v4.cv4-narrow .cv4-nav{justify-content:center}.calendar-v4.cv4-narrow .cv4-nav button{width:50px;flex-basis:50px}.calendar-v4.cv4-narrow .cv4-nav .today{width:106px;flex-basis:106px}.calendar-v4.cv4-narrow .cv4-controls{grid-template-columns:1fr 1fr}.calendar-v4.cv4-narrow .cv4-day-field{grid-column:1/2}.calendar-v4.cv4-narrow .cv4-seg{grid-column:2/3}.calendar-v4.cv4-narrow .cv4-hero{min-height:74px;padding:12px 14px;border-radius:22px}.calendar-v4.cv4-narrow .cv4-hero>b{font-size:46px}.calendar-v4.cv4-narrow .cv4-hero strong{font-size:18px}.calendar-v4.cv4-narrow .cv4-hero span{font-size:14px}.calendar-v4.cv4-narrow .cv4-month-layout{grid-template-columns:1fr}.calendar-v4.cv4-narrow .cv4-side{display:none}.calendar-v4.cv4-narrow .cv4-month-grid{gap:6px;grid-template-rows:repeat(6,minmax(42px,1fr))}.calendar-v4.cv4-narrow .cv4-week{gap:6px}.calendar-v4.cv4-narrow .cv4-day{border-radius:16px;padding:7px 8px}.calendar-v4.cv4-narrow .cv4-day strong{font-size:19px}.calendar-v4.cv4-narrow .cv4-day small{font-size:12px}.calendar-v4.cv4-narrow .cv4-foot{display:none}.calendar-v4.cv4-phone{padding:14px 16px 10px;gap:9px;overflow:auto}.calendar-v4.cv4-phone .cv4-title h2{font-size:30px}.calendar-v4.cv4-phone .cv4-title span{font-size:14px}.calendar-v4.cv4-phone .cv4-controls{grid-template-columns:1fr 1fr}.calendar-v4.cv4-phone .cv4-field input,.calendar-v4.cv4-phone .cv4-select>button,.calendar-v4.cv4-phone .cv4-seg{height:42px}.calendar-v4.cv4-phone .cv4-hero{grid-template-columns:auto 1fr;}.calendar-v4.cv4-phone .cv4-hero em{display:none}.calendar-v4.cv4-phone .cv4-year-grid{grid-template-columns:1fr}.calendar-v4.cv4-short .cv4-hero{display:none}.calendar-v4.cv4-short .cv4-foot{display:none}.calendar-v4.cv4-short .cv4-head{gap:8px}.calendar-v4.cv4-short .cv4-title p{display:none}.calendar-v4.cv4-short .cv4-title h2{font-size:28px}.calendar-v4.cv4-short .cv4-title span{display:none}.calendar-v4.cv4-short .cv4-controls{gap:8px}.calendar-v4.cv4-short .cv4-month-grid{grid-template-rows:repeat(6,minmax(38px,1fr))}.calendar-v4.cv4-short .cv4-day strong{font-size:18px}.calendar-v4.cv4-short .cv4-day small{font-size:11px}@media(max-width:520px){.cv4-month-menu,.cv4-day-menu{left:0;transform:none;width:min(300px,calc(100vw - 36px))}}`;
    document.head.appendChild(style);
  }
  function measure(root){
    if(!root||!root.isConnected)return;
    const r=root.getBoundingClientRect();
    root.classList.toggle('cv4-compact',r.width<980);
    root.classList.toggle('cv4-narrow',r.width<760);
    root.classList.toggle('cv4-phone',r.width<600);
    root.classList.toggle('cv4-short',r.height<720);
  }
  function bindMeasure(root){
    if(!root||observed.has(root))return;
    observed.add(root);
    if(!resizeObserver)resizeObserver=new ResizeObserver(entries=>entries.forEach(e=>measure(e.target)));
    resizeObserver.observe(root);
  }
  function mountExisting(){document.querySelectorAll('.inline-tool[data-inline-app="calendar"]').forEach(box=>{const old=box.querySelector('.calendar-v4');if(!old||old.dataset.cv4Version!==VER)box.innerHTML=render();const root=box.querySelector('.calendar-v4');bindMeasure(root);measure(root);});}
  function patch(){
    if(typeof window.appContent==='function'&&!window.__windzxyCalendarV4AppPatched){const old=window.appContent;window.appContent=function(appId){return appId==='calendar'?render():old.apply(this,arguments);};window.__windzxyCalendarV4AppPatched=true;}
    if(typeof window.bodyHtml==='function'&&!window.__windzxyCalendarV4BodyPatched){const old=window.bodyHtml;window.bodyHtml=function(card,info){return card&&card.appId==='calendar'?`<div class="inline-tool" data-inline-app="calendar">${render()}</div>`:old.apply(this,arguments);};window.__windzxyCalendarV4BodyPatched=true;}
  }
  function boot(){installStyle();patch();mountExisting();document.addEventListener('click',onClick,true);document.addEventListener('change',onChange,true);new MutationObserver(()=>mountExisting()).observe(document.getElementById('desktopCanvas')||document.body,{childList:true,subtree:true});try{if(typeof window.renderAll==='function'&&!window.__windzxyCalendarV4RenderedOnce){window.__windzxyCalendarV4RenderedOnce=true;window.renderAll();}}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyCalendarV4Version=VER;
})();
