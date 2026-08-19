(function(){
  if(window.__windzxyCalendarLunarUiCoreFixLoaded)return;
  window.__windzxyCalendarLunarUiCoreFixLoaded=1;

  const APP='calendar';
  const VER='20260819-calendar-core3-lunar-native';
  const MONTH_CN={1:'正月',2:'二月',3:'三月',4:'四月',5:'五月',6:'六月',7:'七月',8:'八月',9:'九月',10:'十月',11:'冬月',12:'臘月'};
  const DAY_CN=['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  const WEEK={
    'zh-CN':['日','一','二','三','四','五','六'],
    'zh-HK':['日','一','二','三','四','五','六'],
    en:['Su','Mo','Tu','We','Th','Fr','Sa']
  };
  const DOW={
    'zh-CN':['周日','周一','周二','周三','周四','周五','周六'],
    'zh-HK':['週日','週一','週二','週三','週四','週五','週六'],
    en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  };
  const MONTHS={
    'zh-CN':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    'zh-HK':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  };
  const TXT={
    today:{'zh-CN':'今天','zh-HK':'今天',en:'Today'},
    lunar:{'zh-CN':'农历','zh-HK':'農曆',en:'Lunar'},
    month:{'zh-CN':'本月','zh-HK':'本月',en:'This month'},
    none:{'zh-CN':'无假期/调休','zh-HK':'無假期/調休',en:'No holidays'},
    cn:{'zh-CN':'内地','zh-HK':'內地',en:'CN'},
    hk:{'zh-CN':'香港','zh-HK':'香港',en:'HK'},
    off:{'zh-CN':'休','zh-HK':'休',en:'Off'},
    work:{'zh-CN':'班','zh-HK':'班',en:'Work'}
  };
  const NAME={
    '元旦':{'zh-CN':'元旦','zh-HK':'元旦',en:'New Year'},'元旦調休':{'zh-CN':'元旦调休','zh-HK':'元旦調休',en:'New Year workday'},
    '春節':{'zh-CN':'春节','zh-HK':'春節',en:'Lunar New Year'},'春節調休':{'zh-CN':'春节调休','zh-HK':'春節調休',en:'LNY workday'},
    '清明':{'zh-CN':'清明','zh-HK':'清明',en:'Ching Ming'},'勞動節':{'zh-CN':'劳动节','zh-HK':'勞動節',en:'Labour Day'},'勞動節調休':{'zh-CN':'劳动节调休','zh-HK':'勞動節調休',en:'Labour Day workday'},
    '端午':{'zh-CN':'端午','zh-HK':'端午',en:'Tuen Ng'},'中秋':{'zh-CN':'中秋','zh-HK':'中秋',en:'Mid-Autumn'},'國慶':{'zh-CN':'国庆','zh-HK':'國慶',en:'National Day'},'國慶調休':{'zh-CN':'国庆调休','zh-HK':'國慶調休',en:'National Day workday'},
    '一月一日':{'zh-CN':'一月一日','zh-HK':'一月一日',en:'New Year'},'年初一':{'zh-CN':'年初一','zh-HK':'年初一',en:'LNY Day 1'},'年初二':{'zh-CN':'年初二','zh-HK':'年初二',en:'LNY Day 2'},'年初三':{'zh-CN':'年初三','zh-HK':'年初三',en:'LNY Day 3'},
    '耶穌受難節':{'zh-CN':'耶稣受难节','zh-HK':'耶穌受難節',en:'Good Friday'},'耶穌受難節翌日':{'zh-CN':'耶稣受难节翌日','zh-HK':'耶穌受難節翌日',en:'Good Friday next day'},'清明翌日':{'zh-CN':'清明翌日','zh-HK':'清明翌日',en:'Ching Ming next day'},'復活節翌日':{'zh-CN':'复活节翌日','zh-HK':'復活節翌日',en:'Easter Monday'},
    '佛誕翌日':{'zh-CN':'佛诞翌日','zh-HK':'佛誕翌日',en:'Buddha Birthday next day'},'香港成立紀念日':{'zh-CN':'香港成立纪念日','zh-HK':'香港成立紀念日',en:'HKSAR Day'},'中秋翌日':{'zh-CN':'中秋翌日','zh-HK':'中秋翌日',en:'Mid-Autumn next day'},'國慶日':{'zh-CN':'国庆日','zh-HK':'國慶日',en:'National Day'},'重陽翌日':{'zh-CN':'重阳翌日','zh-HK':'重陽翌日',en:'Chung Yeung next day'},'聖誕節':{'zh-CN':'圣诞节','zh-HK':'聖誕節',en:'Christmas'},'聖誕後第一個周日':{'zh-CN':'圣诞后第一个周日','zh-HK':'聖誕後第一個周日',en:'First Sunday after Christmas'}
  };
  const CN_2026=[
    {name:'元旦',type:'rest',dates:['2026-01-01','2026-01-02','2026-01-03']},{name:'元旦調休',type:'work',dates:['2026-01-04']},
    {name:'春節',type:'rest',dates:range('2026-02-15','2026-02-23')},{name:'春節調休',type:'work',dates:['2026-02-14','2026-02-28']},
    {name:'清明',type:'rest',dates:range('2026-04-04','2026-04-06')},{name:'勞動節',type:'rest',dates:range('2026-05-01','2026-05-05')},{name:'勞動節調休',type:'work',dates:['2026-05-09']},
    {name:'端午',type:'rest',dates:range('2026-06-19','2026-06-21')},{name:'中秋',type:'rest',dates:range('2026-09-25','2026-09-27')},{name:'國慶',type:'rest',dates:range('2026-10-01','2026-10-07')},{name:'國慶調休',type:'work',dates:['2026-09-20','2026-10-10']}
  ];
  const HK_2026=[['2026-01-01','一月一日'],['2026-02-17','年初一'],['2026-02-18','年初二'],['2026-02-19','年初三'],['2026-04-03','耶穌受難節'],['2026-04-04','耶穌受難節翌日'],['2026-04-06','清明翌日'],['2026-04-07','復活節翌日'],['2026-05-01','勞動節'],['2026-05-25','佛誕翌日'],['2026-06-19','端午'],['2026-07-01','香港成立紀念日'],['2026-09-26','中秋翌日'],['2026-10-01','國慶日'],['2026-10-19','重陽翌日'],['2026-12-25','聖誕節'],['2026-12-26','聖誕後第一個周日']];
  const HD=buildHolidayData();

  function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';if(/^en/i.test(v))return 'en';return 'zh-HK';}
  function text(k){const lc=lang();return TXT[k]?.[lc]||TXT[k]?.['zh-HK']||k;}
  function localName(name){const lc=lang();return NAME[name]?.[lc]||NAME[name]?.['zh-HK']||name;}
  function monthLabel(m){return (MONTHS[lang()]||MONTHS['zh-HK'])[m];}
  function weekLabels(){return WEEK[lang()]||WEEK['zh-HK'];}
  function dow(date){return (DOW[lang()]||DOW['zh-HK'])[date.getDay()];}
  function pad(n){return String(n).padStart(2,'0');}
  function ymd(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}
  function parseYmd(s){const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d);}
  function range(a,b){const out=[];for(let d=parseYmd(a),e=parseYmd(b);d<=e;d.setDate(d.getDate()+1))out.push(ymd(d));return out;}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function lunarParts(d){
    try{
      const s=new Intl.DateTimeFormat('zh-Hant-u-ca-chinese',{month:'long',day:'numeric'}).format(d).replace(/\s/g,'');
      const m=s.match(/(閏|闰)?([正一二三四五六七八九十冬腊臘]+)月(\d{1,2})日/);
      if(!m)return null;
      const mm={正:1,一:1,二:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9,十:10,冬:11,腊:12,臘:12};
      return {leap:!!m[1],month:mm[m[2]],day:+m[3]};
    }catch(e){return null;}
  }
  function lunarMonthName(p){return p?(p.leap?'閏':'')+(MONTH_CN[p.month]||''):'—';}
  function lunarDayName(p){return p?(DAY_CN[p.day]||String(p.day)):'—';}
  function lunarFull(d){const p=lunarParts(d);return p?`${lunarMonthName(p)}${lunarDayName(p)}`:'—';}
  function lunarCell(d){const p=lunarParts(d);return p?(p.day===1?lunarMonthName(p):lunarDayName(p)):'—';}
  function fmt(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${dow(d)}`;}
  function fmtShort(d){return `${pad(d.getMonth()+1)}/${pad(d.getDate())} ${dow(d)}`;}

  function buildHolidayData(){const cnRest={},cnWork={},hkRest={};CN_2026.forEach(g=>g.dates.forEach(date=>{(g.type==='work'?cnWork:cnRest)[date]={name:g.name,type:g.type,region:'CN'};}));HK_2026.forEach(([date,name])=>hkRest[date]={name,type:'rest',region:'HK'});return {cnRest,cnWork,hkRest};}
  function holidayInfo(d){const k=ymd(d);return {cnRest:HD.cnRest[k]||null,cnWork:HD.cnWork[k]||null,hkRest:HD.hkRest[k]||null};}
  function monthCells(y,m){const first=new Date(y,m,1),start=new Date(first);start.setDate(1-first.getDay());return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return {date:d,key:ymd(d),inMonth:d.getMonth()===m};});}
  function cardState(card){card.data=card.data||{};const today=new Date();if(!card.data.calSelected)card.data.calSelected=ymd(today);let sel=parseYmd(card.data.calSelected);if(!Number.isFinite(sel.getTime()))sel=today;if(!Number.isFinite(+card.data.calYear)||!Number.isFinite(+card.data.calMonth)){card.data.calYear=sel.getFullYear();card.data.calMonth=sel.getMonth();}return {year:+card.data.calYear,month:+card.data.calMonth,selected:sel};}
  function badges(d,long=false){const h=holidayInfo(d),out=[];if(h.cnRest)out.push(`<i class="cn-rest">${long?text('cn')+' '+E(localName(h.cnRest.name)):text('off')}</i>`);if(h.cnWork)out.push(`<i class="cn-work">${long?text('cn')+' '+E(localName(h.cnWork.name)):text('work')}</i>`);if(h.hkRest)out.push(`<i class="hk-rest">${long?text('hk')+' '+E(localName(h.hkRest.name)):text('hk')}</i>`);return out;}
  function events(y,m){const start=new Date(y,m,1),end=new Date(y,m+1,0),arr=[];for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){const k=ymd(d),day=d.getDate();if(HD.cnRest[k])arr.push({day,name:localName(HD.cnRest[k].name),region:text('cn'),type:'rest'});if(HD.cnWork[k])arr.push({day,name:localName(HD.cnWork[k].name),region:text('cn'),type:'work'});if(HD.hkRest[k])arr.push({day,name:localName(HD.hkRest[k].name),region:text('hk'),type:'hk'});}return arr;}

  function render(card){
    const st=cardState(card),sel=st.selected;
    const compact=(card.w||620)<500,tiny=(card.w||620)<380||(card.h||500)<360;
    return `<div class="calendar-widget cal3 ${compact?'compact':''} ${tiny?'tiny':''}" data-calendar-version="${VER}">
      <header class="cw-head cal3-head">
        <button data-cal3-prev title="Previous">‹</button>
        <div class="cw-title"><h3>${lang()==='en'?`${monthLabel(st.month)} ${st.year}`:`${st.year} ${monthLabel(st.month)}`}</h3><p>${fmtShort(sel)} · ${E(lunarFull(sel))}</p></div>
        <button data-cal3-next title="Next">›</button>
        <button class="cw-today" data-cal3-today>${text('today')}</button>
      </header>
      <section class="cw-hero cal3-hero">
        <strong>${sel.getDate()}</strong>
        <div><b>${fmt(sel)}</b><span>${text('lunar')} ${E(lunarFull(sel))}</span></div>
        <nav>${badges(sel,true).join('')||'<i class="empty">—</i>'}</nav>
      </section>
      <section class="cw-body cal3-body">
        <main class="cw-month"><div class="cw-week">${weekLabels().map(w=>`<b>${E(w)}</b>`).join('')}</div><div class="cw-grid">${monthCells(st.year,st.month).map(info=>dayCell(info,sel)).join('')}</div></main>
        <aside class="cw-events"><h4>${text('month')}</h4>${eventList(st.year,st.month)}</aside>
      </section>
    </div>`;
  }
  function dayCell(info,sel){const h=holidayInfo(info.date),today=info.key===ymd(new Date()),selected=info.key===ymd(sel);const cls=['cw-day',info.inMonth?'':'out',today?'today':'',selected?'selected':'',info.date.getDay()===0?'sun':'',h.cnRest?'cn-rest':'',h.cnWork?'cn-work':'',h.hkRest?'hk-rest':''].join(' ');return `<button class="${cls}" data-cal3-date="${info.key}"><strong>${info.date.getDate()}</strong><span>${E(lunarCell(info.date))}</span><div>${info.inMonth?badges(info.date,false).slice(0,2).join(''):''}</div></button>`;}
  function eventList(y,m){const arr=events(y,m);if(!arr.length)return `<p class="cw-muted">${text('none')}</p>`;return arr.map(ev=>`<p class="${ev.type}"><b>${ev.day}</b><span>${E(ev.name)}</span><em>${E(ev.region)}</em></p>`).join('');}

  function patch(){
    if(typeof bodyHtml!=='function'||typeof renderAll!=='function'||typeof activeWorkspace!=='function')return false;
    if(!window.__windzxyCalendarCore3BodyPatched){
      window.__windzxyCalendarCore3BodyPatched=1;
      const oldBody=bodyHtml;
      bodyHtml=(card,info)=>card&&card.appId===APP?render(card):oldBody(card,info);
      if(typeof renderDesktop==='function'){const old=renderDesktop;renderDesktop=function(){const out=old.apply(this,arguments);setTimeout(bind,0);return out;};}
      if(typeof renderAll==='function'){const old=renderAll;renderAll=function(){const out=old.apply(this,arguments);setTimeout(bind,0);return out;};}
    }
    return true;
  }
  function currentCard(el){const root=el.closest('[data-card-id]');if(!root)return null;return activeWorkspace().cards.find(c=>String(c.id)===String(root.dataset.cardId));}
  function redraw(card){const el=document.querySelector(`[data-card-id="${CSS.escape(String(card.id))}"] .card-body`);if(el)el.innerHTML=render(card);bind();try{save();}catch(e){}}
  function bind(){
    document.querySelectorAll('[data-cal3-prev]').forEach(btn=>{if(btn.dataset.cal3Bound)return;btn.dataset.cal3Bound='1';btn.onpointerdown=e=>e.stopPropagation();btn.onclick=e=>{e.stopPropagation();const c=currentCard(btn);if(!c)return;const st=cardState(c);const d=new Date(st.year,st.month-1,1);c.data.calYear=d.getFullYear();c.data.calMonth=d.getMonth();const sel=parseYmd(c.data.calSelected);if(sel.getFullYear()!==d.getFullYear()||sel.getMonth()!==d.getMonth())c.data.calSelected=ymd(d);redraw(c);};});
    document.querySelectorAll('[data-cal3-next]').forEach(btn=>{if(btn.dataset.cal3Bound)return;btn.dataset.cal3Bound='1';btn.onpointerdown=e=>e.stopPropagation();btn.onclick=e=>{e.stopPropagation();const c=currentCard(btn);if(!c)return;const st=cardState(c);const d=new Date(st.year,st.month+1,1);c.data.calYear=d.getFullYear();c.data.calMonth=d.getMonth();const sel=parseYmd(c.data.calSelected);if(sel.getFullYear()!==d.getFullYear()||sel.getMonth()!==d.getMonth())c.data.calSelected=ymd(d);redraw(c);};});
    document.querySelectorAll('[data-cal3-today]').forEach(btn=>{if(btn.dataset.cal3Bound)return;btn.dataset.cal3Bound='1';btn.onpointerdown=e=>e.stopPropagation();btn.onclick=e=>{e.stopPropagation();const c=currentCard(btn);if(!c)return;const d=new Date();c.data.calYear=d.getFullYear();c.data.calMonth=d.getMonth();c.data.calSelected=ymd(d);redraw(c);};});
    document.querySelectorAll('[data-cal3-date]').forEach(btn=>{if(btn.dataset.cal3Bound)return;btn.dataset.cal3Bound='1';btn.onpointerdown=e=>e.stopPropagation();btn.onclick=e=>{e.stopPropagation();const c=currentCard(btn);if(!c)return;const d=parseYmd(btn.dataset.cal3Date);c.data.calSelected=ymd(d);c.data.calYear=d.getFullYear();c.data.calMonth=d.getMonth();redraw(c);};});
  }
  function style(){
    if(document.getElementById('calendarCore3Style'))return;
    const s=document.createElement('style');s.id='calendarCore3Style';s.textContent=`
.calendar-widget.cal3{gap:8px}.cal3 .cw-title h3{letter-spacing:-.02em}.cal3 .cw-title p{font-size:12px}.cal3 .cw-hero{min-height:78px;background:linear-gradient(135deg,rgba(125,211,252,.09),rgba(167,139,250,.08),rgba(255,255,255,.035))}.cal3 .cw-hero>strong{font-size:38px;color:#86dfff}.cal3 .cw-hero b{font-size:15px}.cal3 .cw-hero span{font-size:12px}.cal3 .cw-day{padding:5px 6px;gap:1px}.cal3 .cw-day strong{font-size:15px;line-height:1.05}.cal3 .cw-day span{font-size:11px;font-weight:800;color:rgba(235,241,249,.68)}.cal3 .cw-day.out{opacity:.28}.cal3 .cw-day.out div{display:none!important}.cal3 .cw-day.selected{background:linear-gradient(135deg,rgba(125,211,252,.20),rgba(167,139,250,.14));box-shadow:inset 0 0 0 2px rgba(125,211,252,.62)!important}.cal3 .cw-day.cn-rest:not(.selected){background:rgba(16,185,129,.10)}.cal3 .cw-day.cn-work:not(.selected){background:rgba(245,158,11,.13)}.cal3 .cw-day.hk-rest:not(.selected){background:rgba(56,189,248,.11)}.cal3 .cw-hero i,.cal3 .cw-day i{font-size:9px;padding:1px 5px;border-radius:999px}.cal3 .cn-rest{background:rgba(16,185,129,.15);color:#36ef9a}.cal3 .cn-work{background:rgba(245,158,11,.16);color:#ffd166}.cal3 .hk-rest{background:rgba(56,189,248,.16);color:#8be3ff}.cal3 .cw-events p{grid-template-columns:24px 1fr auto;padding:5px 0}.cal3 .cw-events h4{margin-bottom:6px}.cal3.compact .cw-events{max-height:108px}.cal3.tiny .cw-events{display:none}@container (max-width:390px){.cal3 .cw-hero{min-height:68px}.cal3 .cw-hero>strong{font-size:32px}.cal3 .cw-day{padding:4px}.cal3 .cw-day strong{font-size:13px}.cal3 .cw-day span{font-size:9.5px}.cal3 .cw-day i{font-size:8px;padding:1px 3px}}`;
    document.head.appendChild(s);
  }
  function boot(){if(!patch()){setTimeout(boot,80);return;}style();try{renderAll();}catch(e){}setTimeout(bind,0);document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select'))setTimeout(()=>{try{renderAll();}catch(_){bind();}},60);},true);window.windzxyCalendarCore3Version=VER;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();