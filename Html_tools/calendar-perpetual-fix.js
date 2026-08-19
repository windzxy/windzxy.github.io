(function(){
  if(window.__windzxyCalendarAdaptiveFullLoaded)return;
  window.__windzxyCalendarAdaptiveFullLoaded=1;

  const APP='calendar';
  const VER='20260819-calendar-adaptive-full1';
  const MONTH_CN={1:'正月',2:'二月',3:'三月',4:'四月',5:'五月',6:'六月',7:'七月',8:'八月',9:'九月',10:'十月',11:'冬月',12:'臘月'};
  const DAY_CN=['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  const WEEK={'zh-CN':['日','一','二','三','四','五','六'],'zh-HK':['日','一','二','三','四','五','六'],en:['Su','Mo','Tu','We','Th','Fr','Sa']};
  const DOW={'zh-CN':['周日','周一','周二','周三','周四','周五','周六'],'zh-HK':['週日','週一','週二','週三','週四','週五','週六'],en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']};
  const MONTHS={'zh-CN':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],'zh-HK':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
  const TEXT={
    today:{'zh-CN':'今天','zh-HK':'今天',en:'Today'},year:{'zh-CN':'年份','zh-HK':'年份',en:'Year'},month:{'zh-CN':'月份','zh-HK':'月份',en:'Month'},date:{'zh-CN':'日期','zh-HK':'日期',en:'Date'},go:{'zh-CN':'跳转','zh-HK':'跳轉',en:'Go'},lunar:{'zh-CN':'农历','zh-HK':'農曆',en:'Lunar'},
    thisMonth:{'zh-CN':'本月','zh-HK':'本月',en:'This month'},yearView:{'zh-CN':'全年','zh-HK':'全年',en:'Year'},noHoliday:{'zh-CN':'无假期/调休','zh-HK':'無假期/調休',en:'No holidays'},cn:{'zh-CN':'内地','zh-HK':'內地',en:'CN'},hk:{'zh-CN':'香港','zh-HK':'香港',en:'HK'},off:{'zh-CN':'休','zh-HK':'休',en:'Off'},work:{'zh-CN':'班','zh-HK':'班',en:'Work'}
  };
  const META={
    calendar:{'zh-CN':['万年历','农历、公历、节假日、调休、年份跳转与日期定位。'],'zh-HK':['萬年曆','農曆、公曆、節假日、調休、年份跳轉與日期定位。'],en:['Calendar','Lunar, Gregorian, holidays, year jump and date lookup.']},
    metals:{'zh-CN':['金价','贵金属行情与图表。'],'zh-HK':['金價','貴金屬行情與圖表。'],en:['Metals','Precious metals quotes and chart.']},
    'fx-rates':{'zh-CN':['汇率','中国银行外汇牌价与双向换算。'],'zh-HK':['匯率','中國銀行外匯牌價與雙向換算。'],en:['FX rates','BOC FX rates and converter.']}
  };
  const ICONS={calendar:'📅',metals:'◉','fx-rates':'⇄'};
  const NAMES={
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
  const HD=makeHolidays();
  let patched=false;

  function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';if(/^en/i.test(v))return 'en';return 'zh-HK';}
  function t(k){const l=lang();return TEXT[k]?.[l]||TEXT[k]?.['zh-HK']||k;}
  function localName(n){const l=lang();return NAMES[n]?.[l]||NAMES[n]?.['zh-HK']||n;}
  function pad(n){return String(n).padStart(2,'0');}
  function ymd(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}
  function parseYmd(s){const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?new Date(+m[1],+m[2]-1,+m[3]):new Date();}
  function range(a,b){const out=[];for(let d=parseYmd(a),e=parseYmd(b);d<=e;d.setDate(d.getDate()+1))out.push(ymd(d));return out;}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function makeHolidays(){const cnRest={},cnWork={},hkRest={};CN_2026.forEach(g=>g.dates.forEach(date=>{(g.type==='work'?cnWork:cnRest)[date]={name:g.name,type:g.type,region:'CN'};}));HK_2026.forEach(([date,name])=>hkRest[date]={name,type:'rest',region:'HK'});return {cnRest,cnWork,hkRest};}
  function holiday(d){const k=ymd(d);return {cnRest:HD.cnRest[k]||null,cnWork:HD.cnWork[k]||null,hkRest:HD.hkRest[k]||null};}
  function lunarParts(d){try{const s=new Intl.DateTimeFormat('zh-Hant-u-ca-chinese',{month:'long',day:'numeric'}).format(d).replace(/\s/g,'');const m=s.match(/(閏|闰)?([正一二三四五六七八九十冬腊臘]+)月(\d{1,2})日/);if(!m)return null;const mm={正:1,一:1,二:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9,十:10,冬:11,腊:12,臘:12};return {leap:!!m[1],month:mm[m[2]],day:+m[3]};}catch(e){return null;}}
  function lunarMonth(p){return p?(p.leap?'閏':'')+(MONTH_CN[p.month]||''):'—';}
  function lunarDay(p){return p?(DAY_CN[p.day]||String(p.day)):'—';}
  function lunarFull(d){const p=lunarParts(d);return p?lunarMonth(p)+lunarDay(p):'—';}
  function lunarCell(d){const p=lunarParts(d);return p?(p.day===1?lunarMonth(p):lunarDay(p)):'—';}
  function monthName(m){return (MONTHS[lang()]||MONTHS['zh-HK'])[m];}
  function dow(d){return (DOW[lang()]||DOW['zh-HK'])[d.getDay()];}
  function fmt(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${dow(d)}`;}
  function cardState(card){card.data=card.data||{};const now=new Date();if(!card.data.calSelected)card.data.calSelected=ymd(now);const sel=parseYmd(card.data.calSelected);if(!Number.isFinite(+card.data.calYear))card.data.calYear=sel.getFullYear();if(!Number.isFinite(+card.data.calMonth))card.data.calMonth=sel.getMonth();return {year:+card.data.calYear,month:+card.data.calMonth,selected:sel};}
  function cells(y,m){const first=new Date(y,m,1),start=new Date(first);start.setDate(1-first.getDay());return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return {date:d,key:ymd(d),inMonth:d.getMonth()===m};});}
  function badges(d,long=false,inMonth=true){if(!inMonth)return [];const h=holiday(d),out=[];if(h.cnRest)out.push(`<i class="cn-rest">${long?t('cn')+' '+esc(localName(h.cnRest.name)):t('off')}</i>`);if(h.cnWork)out.push(`<i class="cn-work">${long?t('cn')+' '+esc(localName(h.cnWork.name)):t('work')}</i>`);if(h.hkRest)out.push(`<i class="hk-rest">${long?t('hk')+' '+esc(localName(h.hkRest.name)):t('hk')}</i>`);return out;}
  function events(y,m){const arr=[];for(let d=new Date(y,m,1),e=new Date(y,m+1,0);d<=e;d.setDate(d.getDate()+1)){const k=ymd(d),day=d.getDate();if(HD.cnRest[k])arr.push({day,name:localName(HD.cnRest[k].name),type:'rest',region:t('cn')});if(HD.cnWork[k])arr.push({day,name:localName(HD.cnWork[k].name),type:'work',region:t('cn')});if(HD.hkRest[k])arr.push({day,name:localName(HD.hkRest[k].name),type:'hk',region:t('hk')});}return arr;}

  function render(card){
    const st=cardState(card),sel=st.selected,w=card.w||620,h=card.h||500;
    const showTools=w>=250&&h>=275;
    const showHero=w>=285&&h>=330;
    const showEvents=w>=540&&h>=420;
    const showYear=w>=720&&h>=520;
    const compact=w<390;
    const short=h<360;
    return `<div class="calendar-widget calx ${compact?'compact':''} ${short?'short':''} ${showEvents?'events-on':''} ${showYear?'year-on':''}" data-calendar-version="${VER}">
      <header class="calx-top">
        <button data-calx-shift="-12" title="Prev year">«</button><button data-calx-shift="-1" title="Prev month">‹</button>
        <div class="calx-title"><h3>${lang()==='en'?`${monthName(st.month)} ${st.year}`:`${st.year} ${monthName(st.month)}`}</h3><p>${fmt(sel)} · ${esc(lunarFull(sel))}</p></div>
        <button data-calx-shift="1" title="Next month">›</button><button data-calx-shift="12" title="Next year">»</button><button class="calx-today" data-calx-today>${t('today')}</button>
      </header>
      ${showTools?controls(st,sel):''}
      ${showHero?hero(sel):''}
      <section class="calx-main"><main class="calx-month"><div class="calx-week">${(WEEK[lang()]||WEEK['zh-HK']).map(x=>`<b>${esc(x)}</b>`).join('')}</div><div class="calx-grid">${cells(st.year,st.month).map(info=>dayCell(info,sel)).join('')}</div></main>${showEvents?`<aside class="calx-events"><h4>${t('thisMonth')}</h4>${eventList(st.year,st.month)}</aside>`:''}${showYear?yearPanel(st.year,st.month):''}</section>
    </div>`;
  }
  function controls(st,sel){return `<section class="calx-tools"><label><span>${t('year')}</span><input data-calx-year type="number" min="1901" max="2100" value="${st.year}"></label><label><span>${t('month')}</span><select data-calx-month>${MONTHS[lang()].map((m,i)=>`<option value="${i}" ${i===st.month?'selected':''}>${esc(m)}</option>`).join('')}</select></label><label class="date"><span>${t('date')}</span><input data-calx-date type="date" value="${ymd(sel)}"></label><button data-calx-go>${t('go')}</button></section>`;}
  function hero(sel){return `<section class="calx-hero"><strong>${sel.getDate()}</strong><div><b>${fmt(sel)}</b><span>${t('lunar')} ${esc(lunarFull(sel))}</span></div><nav>${badges(sel,true,true).join('')||'<i class="empty">—</i>'}</nav></section>`;}
  function dayCell(info,sel){const h=holiday(info.date),today=info.key===ymd(new Date()),selected=info.key===ymd(sel);const cls=['calx-day',info.inMonth?'':'out',today?'today':'',selected?'selected':'',info.date.getDay()===0?'sun':'',h.cnRest?'cn-rest':'',h.cnWork?'cn-work':'',h.hkRest?'hk-rest':''].join(' ');return `<button class="${cls}" data-calx-datepick="${info.key}"><strong>${info.date.getDate()}</strong><span>${esc(lunarCell(info.date))}</span><div>${badges(info.date,false,info.inMonth).slice(0,2).join('')}</div></button>`;}
  function eventList(y,m){const arr=events(y,m);if(!arr.length)return `<p class="muted">${t('noHoliday')}</p>`;return arr.map(ev=>`<p class="${ev.type}"><b>${ev.day}</b><span>${esc(ev.name)}</span><em>${esc(ev.region)}</em></p>`).join('');}
  function yearPanel(year,activeMonth){return `<aside class="calx-year"><h4>${t('yearView')}</h4><div>${MONTHS[lang()].map((m,i)=>`<button class="${i===activeMonth?'on':''}" data-calx-jump-month="${i}"><b>${esc(m)}</b><small>${events(year,i).length||'—'}</small></button>`).join('')}</div></aside>`;}

  function patchMeta(){try{Object.entries(ICONS).forEach(([id,icon])=>{const a=apps?.find(x=>x.id===id);if(a){a.icon=icon;const mm=META[id]?.[lang()]||META[id]?.['zh-HK'];if(mm){a.title=mm[0];a.desc=mm[1];}}});}catch(e){}}
  function patch(){
    if(patched)return;patched=true;patchMeta();
    if(typeof bodyHtml==='function'){const old=bodyHtml;bodyHtml=function(card,info){return card&&card.appId===APP?render(card):old(card,info);};}
    if(typeof addCard==='function'&&!window.__windzxyCalendarAddAdaptivePatched){window.__windzxyCalendarAddAdaptivePatched=1;const oldAdd=addCard;addCard=function(appId){if(appId!==APP)return oldAdd(appId);const ws=activeWorkspace(),n=ws.cards.length,d=new Date();ws.cards.push({id:'card-calendar-'+Date.now(),appId:APP,x:80+(n%4)*38,y:84+(n%5)*30,w:520,h:460,collapsed:false,data:{calSelected:ymd(d),calYear:d.getFullYear(),calMonth:d.getMonth()}});save();renderAll();};}
    if(typeof renderShelf==='function'){const old=renderShelf;renderShelf=function(){patchMeta();return old.apply(this,arguments);};}
    if(typeof renderAll==='function'){const old=renderAll;renderAll=function(){patchMeta();const out=old.apply(this,arguments);setTimeout(bind,0);return out;};}
    if(typeof renderDesktop==='function'){const old=renderDesktop;renderDesktop=function(){patchMeta();const out=old.apply(this,arguments);setTimeout(bind,0);return out;};}
  }
  function currentCard(node){const el=node.closest('[data-card-id]');return el?activeWorkspace().cards.find(c=>String(c.id)===String(el.dataset.cardId)):null;}
  function redraw(card){const el=document.querySelector(`[data-card-id="${CSS.escape(String(card.id))}"] .card-body`);if(el)el.innerHTML=render(card);bind();try{save();}catch(e){}}
  function shift(card,delta){const st=cardState(card),d=new Date(st.year,st.month+delta,1);card.data.calYear=d.getFullYear();card.data.calMonth=d.getMonth();const sel=parseYmd(card.data.calSelected);if(sel.getFullYear()!==d.getFullYear()||sel.getMonth()!==d.getMonth())card.data.calSelected=ymd(d);redraw(card);}
  function bind(){
    document.querySelectorAll('[data-calx-shift]').forEach(btn=>{if(btn.dataset.ready)return;btn.dataset.ready='1';btn.onpointerdown=e=>e.stopPropagation();btn.onclick=e=>{e.stopPropagation();const c=currentCard(btn);if(c)shift(c,+btn.dataset.calxShift);};});
    document.querySelectorAll('[data-calx-today]').forEach(btn=>{if(btn.dataset.ready)return;btn.dataset.ready='1';btn.onpointerdown=e=>e.stopPropagation();btn.onclick=e=>{e.stopPropagation();const c=currentCard(btn),d=new Date();if(c){c.data.calYear=d.getFullYear();c.data.calMonth=d.getMonth();c.data.calSelected=ymd(d);redraw(c);}};});
    document.querySelectorAll('[data-calx-datepick]').forEach(btn=>{if(btn.dataset.ready)return;btn.dataset.ready='1';btn.onpointerdown=e=>e.stopPropagation();btn.onclick=e=>{e.stopPropagation();const c=currentCard(btn),d=parseYmd(btn.dataset.calxDatepick);if(c){c.data.calYear=d.getFullYear();c.data.calMonth=d.getMonth();c.data.calSelected=ymd(d);redraw(c);}};});
    document.querySelectorAll('[data-calx-go]').forEach(btn=>{if(btn.dataset.ready)return;btn.dataset.ready='1';btn.onpointerdown=e=>e.stopPropagation();btn.onclick=e=>{e.stopPropagation();const c=currentCard(btn),root=btn.closest('.calendar-widget');if(c&&root){const y=+(root.querySelector('[data-calx-year]')?.value||new Date().getFullYear()),m=+(root.querySelector('[data-calx-month]')?.value||0),ds=root.querySelector('[data-calx-date]')?.value;const d=ds?parseYmd(ds):new Date(y,m,1);c.data.calYear=Number.isFinite(y)?y:d.getFullYear();c.data.calMonth=Number.isFinite(m)?m:d.getMonth();c.data.calSelected=ymd(d);redraw(c);}};});
    document.querySelectorAll('[data-calx-jump-month]').forEach(btn=>{if(btn.dataset.ready)return;btn.dataset.ready='1';btn.onpointerdown=e=>e.stopPropagation();btn.onclick=e=>{e.stopPropagation();const c=currentCard(btn),st=c&&cardState(c);if(c&&st){const m=+btn.dataset.calxJumpMonth,d=new Date(st.year,m,1);c.data.calYear=st.year;c.data.calMonth=m;c.data.calSelected=ymd(d);redraw(c);}};});
  }
  function style(){
    if(document.getElementById('calendarAdaptiveFullStyle'))return;
    const s=document.createElement('style');s.id='calendarAdaptiveFullStyle';s.textContent=`
.t-calendar{--icon:linear-gradient(145deg,#2dd4bf,#38bdf8);--glow:linear-gradient(135deg,#2dd4bf,#38bdf8)}
.calendar-widget.calx{height:100%;container-type:inline-size;display:flex;flex-direction:column;gap:7px;overflow:hidden;color:var(--wd-widget-ink,var(--ink));font-variant-numeric:tabular-nums}.calx *{box-sizing:border-box;min-width:0}.calx button,.calx input,.calx select{font:inherit;color:var(--wd-widget-ink,var(--ink))}.calx-top{display:grid;grid-template-columns:28px 28px 1fr 28px 28px auto;gap:6px;align-items:center}.calx-top button,.calx-tools button{height:28px;border:1px solid var(--wd-widget-line,var(--line));border-radius:999px;background:var(--wd-widget-control,rgba(255,255,255,.08));font-weight:850;cursor:pointer}.calx-today{padding:0 10px}.calx-title h3{margin:0;font-size:19px;line-height:1.05}.calx-title p{margin:2px 0 0;color:var(--wd-widget-muted,var(--muted));font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.calx-tools{display:grid;grid-template-columns:.72fr .72fr 1fr auto;gap:6px;align-items:end}.calx-tools label{display:flex;flex-direction:column;gap:2px}.calx-tools span{font-size:9px;color:var(--wd-widget-muted,var(--muted));font-weight:850}.calx-tools input,.calx-tools select{height:28px;border:1px solid var(--wd-widget-line,var(--line));border-radius:9px;background:var(--wd-widget-control,rgba(255,255,255,.08));padding:0 7px;outline:0}.calx-hero{display:grid;grid-template-columns:auto 1fr auto;gap:9px;align-items:center;padding:8px 10px;border:1px solid var(--wd-widget-line,var(--line));border-radius:14px;background:linear-gradient(135deg,rgba(45,212,191,.10),rgba(56,189,248,.08),var(--wd-widget-surface-3,rgba(255,255,255,.04)))}.calx-hero>strong{font-size:32px;line-height:.9;color:#38bdf8;font-weight:950}.calx-hero b{display:block;font-size:13px}.calx-hero span{display:block;margin-top:1px;font-size:11px;color:var(--wd-widget-muted,var(--muted))}.calx-hero nav{display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end}.calx-main{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr);gap:8px}.calx.events-on .calx-main{grid-template-columns:minmax(0,1fr) 166px}.calx.year-on .calx-main{grid-template-columns:minmax(0,1fr) 164px 172px}.calx-month,.calx-events,.calx-year{border:1px solid var(--wd-widget-line,var(--line));border-radius:14px;background:var(--wd-widget-surface-2,rgba(255,255,255,.06));overflow:hidden}.calx-week,.calx-grid{display:grid;grid-template-columns:repeat(7,1fr)}.calx-week{height:25px;background:var(--wd-widget-surface-3,rgba(255,255,255,.05));border-bottom:1px solid var(--wd-widget-line-soft,var(--line))}.calx-week b{display:grid;place-items:center;font-size:10px;color:var(--wd-widget-muted,var(--muted))}.calx-grid{height:calc(100% - 25px);min-height:0}.calx-day{display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:4px;border:0;border-right:1px solid var(--wd-widget-line-soft,var(--line));border-bottom:1px solid var(--wd-widget-line-soft,var(--line));background:transparent;text-align:left;cursor:pointer;overflow:hidden}.calx-day:nth-child(7n){border-right:0}.calx-day strong{font-size:13px;line-height:1.05}.calx-day span{font-size:9.5px;color:var(--wd-widget-muted,var(--muted));font-weight:780;white-space:nowrap}.calx-day div{margin-top:auto;display:flex;gap:2px;flex-wrap:wrap}.calx-day.out{opacity:.26}.calx-day.out div{display:none}.calx-day.sun strong{color:#ff6b88}.calx-day.today{box-shadow:inset 0 0 0 1px rgba(56,189,248,.62)}.calx-day.selected{background:linear-gradient(135deg,rgba(56,189,248,.20),rgba(45,212,191,.12));box-shadow:inset 0 0 0 2px rgba(56,189,248,.72)}.calx i{font-style:normal;border-radius:999px;padding:1px 4px;font-size:8px;font-weight:900;border:1px solid rgba(255,255,255,.08);white-space:nowrap}.calx .cn-rest{background:rgba(16,185,129,.14);color:#23d18b}.calx .cn-work{background:rgba(245,158,11,.15);color:#f5b543}.calx .hk-rest{background:rgba(56,189,248,.15);color:#49c6f3}.calx-events,.calx-year{padding:9px;overflow:auto}.calx-events h4,.calx-year h4{margin:0 0 6px;font-size:11px;color:var(--wd-widget-muted,var(--muted));text-transform:uppercase}.calx-events p{display:grid;grid-template-columns:22px 1fr auto;gap:6px;margin:0;padding:5px 0;border-bottom:1px solid var(--wd-widget-line-soft,var(--line));font-size:11px}.calx-events b{width:20px;height:20px;border-radius:7px;display:grid;place-items:center;background:var(--wd-widget-surface-3,rgba(255,255,255,.06))}.calx-events em{font-style:normal;color:var(--wd-widget-muted,var(--muted));font-size:10px}.calx-year div{display:grid;grid-template-columns:repeat(2,1fr);gap:5px}.calx-year button{border:1px solid var(--wd-widget-line,var(--line));border-radius:10px;background:var(--wd-widget-control,rgba(255,255,255,.06));padding:7px;text-align:left;cursor:pointer}.calx-year .on{border-color:rgba(56,189,248,.55);background:rgba(56,189,248,.15)}.calx-year b{display:block;font-size:11px}.calx-year small{color:var(--wd-widget-muted,var(--muted));font-weight:850}.calx.compact .calx-top{grid-template-columns:26px 26px 1fr 26px 26px}.calx.compact .calx-today{display:none}.calx.compact .calx-title h3{font-size:17px}.calx.compact .calx-title p{font-size:10px}.calx.compact .calx-tools{grid-template-columns:1fr 1fr auto}.calx.compact .calx-tools .date{grid-column:1 / 3}.calx.compact .calx-tools button{grid-column:3;grid-row:1 / span 2;height:60px;border-radius:12px;padding:0 9px}.calx.compact .calx-hero{grid-template-columns:auto 1fr;padding:7px 8px}.calx.compact .calx-hero nav{grid-column:1/-1;justify-content:flex-start}.calx.compact .calx-hero>strong{font-size:28px}.calx.compact .calx-day{padding:3px}.calx.compact .calx-day strong{font-size:12px}.calx.compact .calx-day span{font-size:8.8px}.calx.short .calx-hero{display:none}.calx.short .calx-tools{grid-template-columns:.8fr .8fr 1fr auto}.calx.short .calx-tools span{display:none}.calx.short .calx-tools input,.calx.short .calx-tools select,.calx.short .calx-tools button{height:26px}.calx.short .calx-week{height:22px}.calx.short .calx-grid{height:calc(100% - 22px)}.calx.short .calx-day div{display:none}@container (max-width:300px){.calx-top{grid-template-columns:24px 24px 1fr 24px 24px}.calx-title p{display:none}.calx-tools{grid-template-columns:1fr 1fr}.calx-tools .date{grid-column:1/-1}.calx-tools button{grid-column:1/-1;height:26px!important}.calx-day span{font-size:8px}}
`;
    document.head.appendChild(s);
  }
  function boot(){if(typeof apps==='undefined'||typeof bodyHtml==='undefined'||typeof renderAll==='undefined'){setTimeout(boot,80);return;}style();patch();try{renderAll();}catch(e){}setTimeout(bind,0);document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select'))setTimeout(()=>{try{renderAll();}catch(_){bind();}},50);},true);window.windzxyCalendarAdaptiveVersion=VER;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
