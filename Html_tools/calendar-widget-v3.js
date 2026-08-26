(function(){
  if(window.__windzxyCalendarWidgetV3Loaded)return;
  window.__windzxyCalendarWidgetV3Loaded=1;
  window.__windzxyCalendarWidgetLoaded=1;

  const APP='calendar';
  const VER='20260826-calendar-widget-v3-unified-product';
  const DEFAULT_W=720,DEFAULT_H=560,MIN_W=360,MIN_H=360;
  const STORE_KEY='windzxy-calendar-v3-state';
  const WEEK={
    'zh-CN':['日','一','二','三','四','五','六'],
    'zh-HK':['日','一','二','三','四','五','六'],
    en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  };
  const MONTHS={
    'zh-CN':['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    'zh-HK':['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    en:['January','February','March','April','May','June','July','August','September','October','November','December']
  };
  const I18N={
    title:{'zh-CN':'万年历','zh-HK':'萬年曆',en:'Calendar'},
    desc:{'zh-CN':'公历、农历、节假日、调休、年份跳转与年度视图。','zh-HK':'公曆、農曆、節假日、調休、年份跳轉與年度視圖。',en:'Gregorian, lunar, holidays, transfers, year jump and year overview.'},
    today:{'zh-CN':'今天','zh-HK':'今天',en:'Today'},
    month:{'zh-CN':'月视图','zh-HK':'月視圖',en:'Month'},
    year:{'zh-CN':'年视图','zh-HK':'年視圖',en:'Year'},
    jump:{'zh-CN':'定位','zh-HK':'定位',en:'Go'},
    yearLabel:{'zh-CN':'年份','zh-HK':'年份',en:'Year'},
    monthLabel:{'zh-CN':'月份','zh-HK':'月份',en:'Month'},
    dateLabel:{'zh-CN':'日期','zh-HK':'日期',en:'Date'},
    lunar:{'zh-CN':'农历','zh-HK':'農曆',en:'Lunar'},
    thisMonth:{'zh-CN':'本月事项','zh-HK':'本月事項',en:'This month'},
    yearEvents:{'zh-CN':'本年节假日','zh-HK':'本年節假日',en:'Year events'},
    noEvents:{'zh-CN':'本月没有官方节假日/调休资料','zh-HK':'本月沒有官方節假日/調休資料',en:'No official holiday / transfer records this month'},
    dataHint:{'zh-CN':'官方调休资料目前内置 2026；其他年份保留万年历与农历能力。','zh-HK':'官方調休資料目前內置 2026；其他年份保留萬年曆與農曆能力。',en:'Official transfer data is built in for 2026; other years keep calendar and lunar features.'},
    cn:{'zh-CN':'内地','zh-HK':'內地',en:'CN'},
    hk:{'zh-CN':'香港','zh-HK':'香港',en:'HK'},
    off:{'zh-CN':'休','zh-HK':'休',en:'Off'},
    work:{'zh-CN':'班','zh-HK':'班',en:'Work'},
    weekend:{'zh-CN':'周末','zh-HK':'週末',en:'Weekend'}
  };

  const CN_2026=[
    {name:'元旦',type:'rest',dates:['2026-01-01','2026-01-02','2026-01-03']},
    {name:'元旦調休',type:'work',dates:['2026-01-04']},
    {name:'春節',type:'rest',dates:range('2026-02-15','2026-02-23')},
    {name:'春節調休',type:'work',dates:['2026-02-14','2026-02-28']},
    {name:'清明',type:'rest',dates:range('2026-04-04','2026-04-06')},
    {name:'勞動節',type:'rest',dates:range('2026-05-01','2026-05-05')},
    {name:'勞動節調休',type:'work',dates:['2026-05-09']},
    {name:'端午',type:'rest',dates:range('2026-06-19','2026-06-21')},
    {name:'中秋',type:'rest',dates:range('2026-09-25','2026-09-27')},
    {name:'國慶',type:'rest',dates:range('2026-10-01','2026-10-07')},
    {name:'國慶調休',type:'work',dates:['2026-09-20','2026-10-10']}
  ];
  const HK_2026=[
    ['2026-01-01','一月一日'],['2026-02-17','年初一'],['2026-02-18','年初二'],['2026-02-19','年初三'],
    ['2026-04-03','耶穌受難節'],['2026-04-04','耶穌受難節翌日'],['2026-04-06','清明翌日'],['2026-04-07','復活節翌日'],
    ['2026-05-01','勞動節'],['2026-05-25','佛誕翌日'],['2026-06-19','端午'],['2026-07-01','香港成立紀念日'],
    ['2026-09-26','中秋翌日'],['2026-10-01','國慶日'],['2026-10-19','重陽翌日'],['2026-12-25','聖誕節'],['2026-12-26','聖誕後第一個周日']
  ];

  const holidayData=buildHolidayData();
  const memory=new Map();
  let patched=false;

  function boot(){
    if(typeof apps==='undefined'||typeof bodyHtml==='undefined'||typeof renderAll==='undefined'){
      setTimeout(boot,60);return;
    }
    installStyle();installApp();patchRenderers();registerI18n();bindGlobal();try{renderAll();}catch(e){drawAll();}
    setTimeout(drawAll,120);setTimeout(drawAll,600);
  }

  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    if(/^en/i.test(v))return 'en';
    return 'zh-HK';
  }
  function t(k){const l=lang();return I18N[k]?.[l]||I18N[k]?.['zh-HK']||k;}
  function appMeta(){return {title:t('title'),desc:t('desc')};}
  function installApp(){
    const meta=appMeta();
    const info={id:APP,kind:'widget',title:meta.title,desc:meta.desc,icon:'📅',tone:'t-calendar'};
    const old=apps.find(x=>x.id===APP);old?Object.assign(old,info):apps.push(info);
    try{if(Array.isArray(defaults))defaults.forEach(ws=>{if(Array.isArray(ws.cards))ws.cards=ws.cards.filter(c=>c.appId!==APP);});}catch(e){}
  }
  function syncMeta(){try{const a=apps.find(x=>x.id===APP);if(a)Object.assign(a,appMeta());}catch(e){}}
  function patchRenderers(){
    if(patched)return;patched=true;
    const oldBody=bodyHtml;
    bodyHtml=function(card,info){return card&&card.appId===APP?render(card):oldBody(card,info);};
    if(typeof renderDesktop==='function'&&!window.__windzxyCalendarV3RenderDesktop){
      window.__windzxyCalendarV3RenderDesktop=1;
      const old=renderDesktop;renderDesktop=function(){syncMeta();const out=old.apply(this,arguments);setTimeout(bind,0);return out;};
    }
    if(typeof renderAll==='function'&&!window.__windzxyCalendarV3RenderAll){
      window.__windzxyCalendarV3RenderAll=1;
      const old=renderAll;renderAll=function(){syncMeta();const out=old.apply(this,arguments);setTimeout(bind,0);return out;};
    }
    if(typeof addCard==='function'&&!window.__windzxyCalendarV3AddCard){
      window.__windzxyCalendarV3AddCard=1;
      const old=addCard;
      addCard=function(appId){
        if(appId!==APP)return old.apply(this,arguments);
        const ws=activeWorkspace();const n=(ws.cards||[]).length;
        ws.cards.push({id:'card-calendar-v3-'+Date.now(),appId:APP,x:80+(n%4)*34,y:84+(n%5)*28,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{calendarV3:{}}});
        try{save();}catch(e){} try{renderAll();}catch(e){drawAll();}
      };
    }
  }
  function registerI18n(){
    const reg=()=>window.windzxyRegisterI18n&&window.windzxyRegisterI18n(APP,{title:I18N.title,desc:I18N.desc});
    reg();setTimeout(reg,500);setTimeout(reg,1600);
  }
  function bindGlobal(){
    document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select')){syncMeta();drawAll();setTimeout(()=>{try{renderShelf&&renderShelf();}catch(_){ }},60);}},true);
  }

  function state(card){
    const id=String(card?.id||'default');
    if(memory.has(id))return memory.get(id);
    const today=new Date();
    const saved=(card.data&&card.data.calendarV3)||readPersist(id)||{};
    const s={
      y:clampInt(saved.y,today.getFullYear(),1,9999),
      m:clampInt(saved.m,today.getMonth(),0,11),
      selected:isYmd(saved.selected)?saved.selected:ymd(today),
      mode:saved.mode==='year'?'year':'month'
    };
    const sd=parseYmd(s.selected);s.y=Number.isFinite(saved.y)?s.y:sd.getFullYear();s.m=Number.isFinite(saved.m)?s.m:sd.getMonth();
    memory.set(id,s);return s;
  }
  function persist(card,s){
    try{card.data=card.data||{};card.data.calendarV3={y:s.y,m:s.m,selected:s.selected,mode:s.mode};save&&save();}catch(e){}
    try{const all=JSON.parse(localStorage.getItem(STORE_KEY)||'{}');all[String(card.id||'default')]={y:s.y,m:s.m,selected:s.selected,mode:s.mode};localStorage.setItem(STORE_KEY,JSON.stringify(all));}catch(e){}
  }
  function readPersist(id){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')[id]||null;}catch(e){return null;}}

  function render(card){
    fitCard(card);
    const s=state(card);const selected=parseYmd(s.selected);const compact=(card.w||DEFAULT_W)<520;const tiny=(card.w||DEFAULT_W)<420||(card.h||DEFAULT_H)<430;
    const months=MONTHS[lang()];
    return `<div class="calendar-v3 ${compact?'is-compact':''} ${tiny?'is-tiny':''}" data-calendar-v3="${E(VER)}" data-calendar-card="${E(card.id)}">
      <header class="cv3-head">
        <div class="cv3-title"><span>${t('title')}</span><strong>${s.y} ${months[s.m]}</strong><em>${fmtFull(selected)} · ${E(lunarLabel(selected))}</em></div>
        <div class="cv3-nav">
          <button type="button" data-cv3-act="prev-year" title="Prev year">«</button>
          <button type="button" data-cv3-act="prev-month" title="Prev month">‹</button>
          <button type="button" data-cv3-act="today">${t('today')}</button>
          <button type="button" data-cv3-act="next-month" title="Next month">›</button>
          <button type="button" data-cv3-act="next-year" title="Next year">»</button>
        </div>
      </header>
      <section class="cv3-controls">
        <label><span>${t('yearLabel')}</span><input type="number" min="1" max="9999" value="${s.y}" data-cv3-year></label>
        <label><span>${t('monthLabel')}</span><select data-cv3-month>${months.map((name,i)=>`<option value="${i}" ${i===s.m?'selected':''}>${E(name)}</option>`).join('')}</select></label>
        <label><span>${t('dateLabel')}</span><input type="date" value="${E(s.selected)}" data-cv3-date></label>
        <button type="button" data-cv3-act="jump">${t('jump')}</button>
        <div class="cv3-seg"><button type="button" class="${s.mode==='month'?'on':''}" data-cv3-mode="month">${t('month')}</button><button type="button" class="${s.mode==='year'?'on':''}" data-cv3-mode="year">${t('year')}</button></div>
      </section>
      <section class="cv3-hero">
        <strong>${selected.getDate()}</strong><div><b>${fmtFull(selected)}</b><span>${t('lunar')} · ${E(lunarLabel(selected))}</span></div><nav>${badges(selected,true).join('')||`<i>${t('weekend')} ${selected.getDay()===0||selected.getDay()===6?'✓':'—'}</i>`}</nav>
      </section>
      ${s.mode==='year'?yearView(card,s):monthView(card,s)}
      <footer class="cv3-foot"><span>Calendar V3 · ${VER}</span><em>${t('dataHint')}</em></footer>
    </div>`;
  }
  function fitCard(card){if(!card)return;let ch=false;if((card.w||0)<MIN_W){card.w=MIN_W;ch=true;}if((card.h||0)<MIN_H){card.h=MIN_H;ch=true;}if(ch){try{save&&save();}catch(e){}}}
  function monthView(card,s){
    const cells=monthCells(s.y,s.m);const wk=WEEK[lang()];
    return `<section class="cv3-body"><main class="cv3-month"><div class="cv3-week">${wk.map(w=>`<b>${E(w)}</b>`).join('')}</div><div class="cv3-grid">${cells.map(c=>dayCell(c,s)).join('')}</div></main><aside class="cv3-events"><h4>${t('thisMonth')}</h4>${eventList(s.y,s.m)}</aside></section>`;
  }
  function yearView(card,s){
    return `<section class="cv3-year-view"><div class="cv3-year-grid">${Array.from({length:12},(_,m)=>miniMonth(s.y,m,s)).join('')}</div><aside class="cv3-events year"><h4>${t('yearEvents')} ${s.y}</h4>${yearEventList(s.y)}</aside></section>`;
  }
  function miniMonth(y,m,s){
    const wk=WEEK[lang()].map(x=>x.slice(0,1));
    const cells=monthCells(y,m).map(c=>`<button type="button" class="${c.inMonth?'':'out'} ${c.key===s.selected?'selected':''} ${holidayInfo(c.date).cnRest||holidayInfo(c.date).hkRest?'rest':''}" data-cv3-date-pick="${c.key}">${c.date.getDate()}</button>`).join('');
    return `<article class="cv3-mini"><h5 data-cv3-month-pick="${m}">${E(MONTHS[lang()][m])}</h5><div class="mw">${wk.map(w=>`<b>${E(w)}</b>`).join('')}</div><div class="mg">${cells}</div></article>`;
  }
  function dayCell(info,s){
    const hs=holidayInfo(info.date);const isToday=info.key===ymd(new Date());const selected=info.key===s.selected;const weekEnd=info.date.getDay()===0||info.date.getDay()===6;
    const cls=['cv3-day',info.inMonth?'':'out',isToday?'today':'',selected?'selected':'',weekEnd?'weekend':'',hs.cnRest?'cn-rest':'',hs.cnWork?'cn-work':'',hs.hkRest?'hk-rest':''].filter(Boolean).join(' ');
    const lunar=lunarShort(info.date);
    return `<button type="button" class="${cls}" data-cv3-date-pick="${info.key}"><strong>${info.date.getDate()}</strong><span>${E(lunar)}</span><div>${badges(info.date,false).slice(0,2).join('')}</div></button>`;
  }
  function badges(date,long){
    const hs=holidayInfo(date);const out=[];
    if(hs.cnRest)out.push(`<i class="cn-rest">${long?t('cn')+' '+E(hs.cnRest.name):t('off')}</i>`);
    if(hs.cnWork)out.push(`<i class="cn-work">${long?t('cn')+' '+E(hs.cnWork.name):t('work')}</i>`);
    if(hs.hkRest)out.push(`<i class="hk-rest">${long?t('hk')+' '+E(hs.hkRest.name):t('hk')}</i>`);
    return out;
  }
  function eventList(y,m){
    const arr=monthEvents(y,m);
    if(!arr.length)return `<p class="cv3-empty">${t('noEvents')}</p>`;
    return arr.map(ev=>`<p class="${ev.type}"><b>${String(ev.day).padStart(2,'0')}</b><span>${E(ev.name)}</span><em>${E(ev.region)}</em></p>`).join('');
  }
  function yearEventList(y){
    const arr=[];for(let m=0;m<12;m++)arr.push(...monthEvents(y,m).map(ev=>Object.assign({m:m+1},ev)));
    if(!arr.length)return `<p class="cv3-empty">${t('dataHint')}</p>`;
    return arr.map(ev=>`<p class="${ev.type}"><b>${String(ev.m).padStart(2,'0')}/${String(ev.day).padStart(2,'0')}</b><span>${E(ev.name)}</span><em>${E(ev.region)}</em></p>`).join('');
  }

  function bind(){
    document.querySelectorAll('.calendar-v3').forEach(root=>{
      if(root.dataset.boundV3)return;root.dataset.boundV3='1';
      root.addEventListener('pointerdown',e=>{if(e.target.closest('button,input,select'))e.stopPropagation();},true);
      root.addEventListener('click',e=>{
        const card=getCard(root);if(!card)return;const s=state(card);const act=e.target.closest('[data-cv3-act]')?.dataset.cv3Act;
        if(act){e.preventDefault();e.stopPropagation();handleAction(card,s,act);return;}
        const mode=e.target.closest('[data-cv3-mode]')?.dataset.cv3Mode;if(mode){s.mode=mode;persist(card,s);redraw(root,card);return;}
        const pick=e.target.closest('[data-cv3-date-pick]')?.dataset.cv3DatePick;if(pick){selectDate(card,s,pick);redraw(root,card);return;}
        const mp=e.target.closest('[data-cv3-month-pick]')?.dataset.cv3MonthPick;if(mp!=null){s.m=Number(mp);s.mode='month';persist(card,s);redraw(root,card);return;}
      },true);
      root.addEventListener('change',e=>{
        const card=getCard(root);if(!card)return;const s=state(card);
        if(e.target.matches('[data-cv3-year]')){s.y=clampInt(e.target.value,s.y,1,9999);syncSelectedToView(s);persist(card,s);redraw(root,card);}
        if(e.target.matches('[data-cv3-month]')){s.m=clampInt(e.target.value,s.m,0,11);syncSelectedToView(s);persist(card,s);redraw(root,card);}
        if(e.target.matches('[data-cv3-date]')&&isYmd(e.target.value)){selectDate(card,s,e.target.value);redraw(root,card);}
      },true);
    });
  }
  function handleAction(card,s,act){
    if(act==='prev-month')move(card,s,0,-1);else if(act==='next-month')move(card,s,0,1);else if(act==='prev-year')move(card,s,-1,0);else if(act==='next-year')move(card,s,1,0);else if(act==='today'){const d=new Date();s.y=d.getFullYear();s.m=d.getMonth();s.selected=ymd(d);s.mode='month';persist(card,s);drawAll();}else if(act==='jump'){syncSelectedToView(s);persist(card,s);drawAll();}
  }
  function move(card,s,dy,dm){const d=new Date(s.y+dy,s.m+dm,1);s.y=d.getFullYear();s.m=d.getMonth();syncSelectedToView(s);persist(card,s);drawAll();}
  function selectDate(card,s,key){const d=parseYmd(key);s.selected=ymd(d);s.y=d.getFullYear();s.m=d.getMonth();persist(card,s);}
  function syncSelectedToView(s){const d=parseYmd(s.selected);const max=daysInMonth(s.y,s.m);const day=Math.min(d.getDate(),max);s.selected=ymd(new Date(s.y,s.m,day));}
  function getCard(root){try{const id=root.closest('[data-card-id]')?.dataset.cardId;return activeWorkspace().cards.find(c=>String(c.id)===String(id));}catch(e){return null;}}
  function redraw(root,card){const body=root.closest('.card-body')||root.parentElement;if(body)body.innerHTML=render(card);bind();}
  function drawAll(){syncMeta();document.querySelectorAll('.calendar-v3').forEach(root=>{const card=getCard(root);if(card)redraw(root,card);});bind();}

  function buildHolidayData(){
    const cnRest={},cnWork={},hkRest={};
    CN_2026.forEach(g=>g.dates.forEach(date=>{(g.type==='work'?cnWork:cnRest)[date]={name:g.name,type:g.type,region:'CN'};}));
    HK_2026.forEach(([date,name])=>{hkRest[date]={name,type:'rest',region:'HK'};});
    return {cnRest,cnWork,hkRest};
  }
  function holidayInfo(date){const key=ymd(date);return {cnRest:holidayData.cnRest[key]||null,cnWork:holidayData.cnWork[key]||null,hkRest:holidayData.hkRest[key]||null};}
  function monthEvents(y,m){const arr=[];for(let d=new Date(y,m,1);d.getMonth()===m;d.setDate(d.getDate()+1)){const key=ymd(d);if(holidayData.cnRest[key])arr.push({day:d.getDate(),name:holidayData.cnRest[key].name,region:t('cn'),type:'rest'});if(holidayData.cnWork[key])arr.push({day:d.getDate(),name:holidayData.cnWork[key].name,region:t('cn'),type:'work'});if(holidayData.hkRest[key])arr.push({day:d.getDate(),name:holidayData.hkRest[key].name,region:t('hk'),type:'hk'});}return arr;}
  function monthCells(y,m){const first=new Date(y,m,1);const start=new Date(y,m,1-first.getDay());return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return {date:d,key:ymd(d),inMonth:d.getMonth()===m};});}
  function range(a,b){const out=[];for(let d=parseYmd(a),end=parseYmd(b);d<=end;d.setDate(d.getDate()+1))out.push(ymd(d));return out;}
  function daysInMonth(y,m){return new Date(y,m+1,0).getDate();}
  function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function parseYmd(s){const m=String(s||'').match(/^(\d{1,4})-(\d{1,2})-(\d{1,2})$/);return m?new Date(+m[1],+m[2]-1,+m[3]):new Date();}
  function isYmd(s){return /^\d{4}-\d{2}-\d{2}$/.test(String(s||''));}
  function clampInt(v,fb,min,max){const n=parseInt(v,10);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fb;}
  function fmtFull(d){const l=lang();if(l==='en')return d.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'short',day:'numeric'});return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} 星期${'日一二三四五六'[d.getDay()]}`;}
  function lunarLabel(d){
    try{
      const l=lang()==='zh-CN'?'zh-Hans-CN-u-ca-chinese':'zh-Hant-HK-u-ca-chinese';
      return new Intl.DateTimeFormat(l,{month:'long',day:'numeric'}).format(d).replace(/\s+/g,'');
    }catch(e){return lunarFallback(d);}
  }
  function lunarShort(d){const text=lunarLabel(d);const m=text.match(/(正月|[一二三四五六七八九十冬腊臘]+月|初[一二三四五六七八九十]|十[一二三四五六七八九]?|廿[一二三四五六七八九十]?|三十|[0-9]+日)/g);if(!m)return text.slice(-2);return m[m.length-1].replace('日','');}
  function lunarFallback(d){const names=['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];return names[(Math.floor((d-new Date(2026,1,17))/86400000)%30+30)%30];}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function installStyle(){
    if(document.getElementById('windzxyCalendarV3Style'))return;
    const st=document.createElement('style');st.id='windzxyCalendarV3Style';st.textContent=`
.calendar-v3{height:100%;display:flex;flex-direction:column;gap:10px;overflow:hidden;color:var(--ink);font-size:13px;--cv3-line:rgba(255,255,255,.16);--cv3-soft:rgba(255,255,255,.08);--cv3-card:rgba(255,255,255,.10);--cv3-rest:#ff5b6d;--cv3-work:#f5b544;--cv3-hk:#6aa7ff;--cv3-today:#66e0ff}
[data-theme="light"] .calendar-v3{--cv3-line:rgba(15,23,42,.12);--cv3-soft:rgba(15,23,42,.055);--cv3-card:rgba(255,255,255,.72)}
.cv3-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.cv3-title{min-width:0}.cv3-title span{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.14em;opacity:.58}.cv3-title strong{display:block;font-size:20px;line-height:1.12}.cv3-title em{display:block;font-style:normal;opacity:.66;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cv3-nav{display:flex;gap:5px;align-items:center}.calendar-v3 button,.calendar-v3 input,.calendar-v3 select{border:1px solid var(--cv3-line);background:var(--cv3-soft);color:inherit;border-radius:12px;height:32px;padding:0 10px;outline:none}.calendar-v3 button{cursor:pointer}.calendar-v3 button:hover{background:rgba(255,255,255,.18)}[data-theme="light"] .calendar-v3 button:hover{background:rgba(15,23,42,.08)}.cv3-nav button[data-cv3-act="today"]{font-weight:700;background:linear-gradient(135deg,rgba(255,122,60,.28),rgba(255,202,88,.18))}
.cv3-controls{display:grid;grid-template-columns:1fr 1fr 1.25fr auto auto;gap:7px;align-items:end}.cv3-controls label{display:flex;flex-direction:column;gap:3px;min-width:0}.cv3-controls label span{font-size:10px;opacity:.58}.cv3-controls input,.cv3-controls select{width:100%;box-sizing:border-box}.cv3-seg{display:flex;border:1px solid var(--cv3-line);border-radius:13px;overflow:hidden;height:32px}.cv3-seg button{border:0;border-radius:0;height:100%;background:transparent}.cv3-seg button.on{background:rgba(255,122,60,.28);font-weight:800}
.cv3-hero{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:10px 12px;border:1px solid var(--cv3-line);border-radius:18px;background:var(--cv3-card)}.cv3-hero>strong{font-size:36px;line-height:1}.cv3-hero b{display:block;font-size:14px}.cv3-hero span{opacity:.68}.cv3-hero nav{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}.calendar-v3 i{display:inline-flex;align-items:center;border-radius:999px;padding:2px 7px;font-style:normal;font-size:10px;background:rgba(255,255,255,.10);border:1px solid var(--cv3-line)}.calendar-v3 i.cn-rest{background:rgba(255,91,109,.18);color:var(--cv3-rest)}.calendar-v3 i.cn-work{background:rgba(245,181,68,.18);color:var(--cv3-work)}.calendar-v3 i.hk-rest{background:rgba(106,167,255,.18);color:var(--cv3-hk)}
.cv3-body{min-height:0;flex:1;display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:10px}.cv3-month{min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:6px}.cv3-week,.cv3-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.cv3-week b{text-align:center;font-size:10px;opacity:.56}.cv3-grid{min-height:0}.cv3-day{height:auto;min-height:48px;padding:6px!important;text-align:left;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;border-radius:13px!important}.cv3-day strong{font-size:14px}.cv3-day span{font-size:10px;opacity:.62}.cv3-day div{min-height:16px;display:flex;gap:3px;flex-wrap:wrap}.cv3-day.out{opacity:.32}.cv3-day.weekend strong{color:#ff8fa0}.cv3-day.today{box-shadow:inset 0 0 0 1px var(--cv3-today)}.cv3-day.selected{background:linear-gradient(135deg,rgba(255,122,60,.36),rgba(255,202,88,.22));border-color:rgba(255,202,88,.52)!important}.cv3-day.cn-rest strong,.cv3-day.hk-rest strong{color:var(--cv3-rest)}.cv3-day.cn-work strong{color:var(--cv3-work)}
.cv3-events{min-height:0;overflow:auto;border:1px solid var(--cv3-line);border-radius:18px;background:var(--cv3-card);padding:10px}.cv3-events h4{margin:0 0 8px;font-size:13px}.cv3-events p{display:grid;grid-template-columns:34px 1fr auto;gap:7px;align-items:center;margin:0 0 6px;padding:6px;border-radius:12px;background:var(--cv3-soft)}.cv3-events p b{font-size:13px}.cv3-events p span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cv3-events p em{font-style:normal;font-size:10px;opacity:.7}.cv3-events p.rest b,.cv3-events p.hk b{color:var(--cv3-rest)}.cv3-events p.work b{color:var(--cv3-work)}.cv3-empty{display:block!important;opacity:.64;line-height:1.6}.cv3-foot{display:flex;justify-content:space-between;gap:10px;font-size:10px;opacity:.52}.cv3-foot em{font-style:normal;text-align:right}
.cv3-year-view{min-height:0;flex:1;display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:10px}.cv3-year-grid{min-height:0;overflow:auto;display:grid;grid-template-columns:repeat(3,minmax(150px,1fr));gap:8px}.cv3-mini{border:1px solid var(--cv3-line);border-radius:16px;background:var(--cv3-card);padding:8px}.cv3-mini h5{margin:0 0 6px;cursor:pointer}.cv3-mini .mw,.cv3-mini .mg{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.cv3-mini .mw b{font-size:9px;text-align:center;opacity:.45}.cv3-mini .mg button{height:22px;border:0;border-radius:7px;padding:0;font-size:10px;background:transparent}.cv3-mini .mg button.out{opacity:.18}.cv3-mini .mg button.rest{color:var(--cv3-rest);font-weight:700}.cv3-mini .mg button.selected{background:rgba(255,122,60,.30)}
.calendar-v3.is-compact .cv3-controls{grid-template-columns:1fr 1fr}.calendar-v3.is-compact .cv3-controls>button,.calendar-v3.is-compact .cv3-seg{grid-column:auto}.calendar-v3.is-compact .cv3-body,.calendar-v3.is-compact .cv3-year-view{grid-template-columns:1fr}.calendar-v3.is-compact .cv3-events{max-height:128px}.calendar-v3.is-compact .cv3-year-grid{grid-template-columns:repeat(2,minmax(140px,1fr))}.calendar-v3.is-tiny .cv3-title em,.calendar-v3.is-tiny .cv3-hero,.calendar-v3.is-tiny .cv3-events,.calendar-v3.is-tiny .cv3-foot{display:none}.calendar-v3.is-tiny .cv3-controls{display:none}.calendar-v3.is-tiny .cv3-grid{gap:3px}.calendar-v3.is-tiny .cv3-day{min-height:38px;padding:4px!important}.calendar-v3.is-tiny .cv3-day div{display:none}
`;document.head.appendChild(st);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyCalendarWidgetV3Version=VER;
})();
