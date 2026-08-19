(function(){
  if(window.__windzxyCalendarWidgetLoaded)return;
  window.__windzxyCalendarWidgetLoaded=1;

  const APP='calendar';
  const VER='20260819-calendar-widget2-pm-polished';
  const DEFAULT_W=620,DEFAULT_H=500,MIN_W=330,MIN_H=292;
  const WEEK={
    'zh-CN':['日','一','二','三','四','五','六'],
    'zh-HK':['日','一','二','三','四','五','六'],
    en:['S','M','T','W','T','F','S']
  };
  const MONTHS={
    'zh-CN':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    'zh-HK':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  };
  const I18N={
    title:{'zh-CN':'万年历','zh-HK':'萬年曆',en:'Calendar'},
    desc:{'zh-CN':'农历、公历、中国内地节假日调休与香港公众假期。','zh-HK':'農曆、公曆、中國內地節假日調休與香港公眾假期。',en:'Lunar dates, Gregorian calendar, Mainland China holiday transfers and Hong Kong public holidays.'},
    today:{'zh-CN':'今天','zh-HK':'今天',en:'Today'},
    cn:{'zh-CN':'内地','zh-HK':'內地',en:'CN'},
    hk:{'zh-CN':'香港','zh-HK':'香港',en:'HK'},
    rest:{'zh-CN':'休','zh-HK':'休',en:'Off'},
    work:{'zh-CN':'班','zh-HK':'班',en:'Work'},
    lunar:{'zh-CN':'农历','zh-HK':'農曆',en:'Lunar'},
    events:{'zh-CN':'本月','zh-HK':'本月',en:'This month'},
    none:{'zh-CN':'无假期/调休','zh-HK':'無假期/調休',en:'No holiday records'},
    prev:{'zh-CN':'上月','zh-HK':'上月',en:'Previous'},
    next:{'zh-CN':'下月','zh-HK':'下月',en:'Next'}
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

  const state={view:new Date(new Date().getFullYear(),new Date().getMonth(),1),selected:ymd(new Date())};
  const data=buildHolidayData();
  let patched=false;

  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    if(/^en/i.test(v))return 'en';
    return 'zh-HK';
  }
  function t(k){const lc=lang();return I18N[k]?.[lc]||I18N[k]?.['zh-HK']||k;}
  function monthName(m){return MONTHS[lang()][m];}
  function week(){return WEEK[lang()];}
  function appMeta(){return {title:t('title'),desc:t('desc')};}

  function boot(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'||typeof bodyHtml==='undefined'||typeof save==='undefined'){
      setTimeout(boot,80);return;
    }
    installStyle();installApp();patchRenderers();ensureCard();fitCards();registerI18n();renderAll();bindGlobal();
  }
  function installApp(){
    const m=appMeta();
    const info={id:APP,kind:'widget',title:m.title,desc:m.desc,icon:'Cal',tone:'t-calendar'};
    const old=apps.find(a=>a.id===APP);
    old?Object.assign(old,info):apps.push(info);
    if(typeof defaults!=='undefined')defaults.forEach(ws=>{
      if(ws.id==='daily'&&!ws.cards.some(c=>c.appId===APP))ws.cards.push({id:'daily-calendar-0',appId:APP,x:560,y:520,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
    });
  }
  function syncAppText(){try{const a=apps.find(x=>x.id===APP);if(a)Object.assign(a,appMeta());}catch(e){}}
  function ensureCard(){
    try{const ws=activeWorkspace();if(ws&&!ws.cards.some(c=>c.appId===APP)){ws.cards.push({id:'card-calendar-'+Date.now(),appId:APP,x:560,y:520,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});save();}}catch(e){}
  }
  function fitCards(){
    try{let changed=false;workspaces.forEach(ws=>(ws.cards||[]).forEach(c=>{if(c.appId===APP){if((c.w||0)<MIN_W){c.w=MIN_W;changed=true;}if((c.h||0)<MIN_H){c.h=MIN_H;changed=true;}}}));if(changed)save();}catch(e){}
  }
  function patchRenderers(){
    if(patched)return;patched=true;
    const oldBody=bodyHtml;
    bodyHtml=(card,info)=>card&&card.appId===APP?render(card):oldBody(card,info);
    if(typeof renderDesktop==='function'){
      const old=renderDesktop;
      renderDesktop=function(){syncAppText();const out=old.apply(this,arguments);setTimeout(bind,0);return out;};
    }
    if(typeof renderAll==='function'){
      const old=renderAll;
      renderAll=function(){syncAppText();const out=old.apply(this,arguments);setTimeout(bind,0);return out;};
    }
    if(typeof addCard==='function'){
      const oldAdd=addCard;
      addCard=function(appId){
        if(appId!==APP)return oldAdd(appId);
        const n=activeWorkspace().cards.length;
        activeWorkspace().cards.push({id:'card-'+Date.now(),appId:APP,x:80+(n%4)*38,y:84+(n%5)*30,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();renderAll();
      };
    }
  }
  function registerI18n(){
    const reg=()=>window.windzxyRegisterI18n&&window.windzxyRegisterI18n(APP,{title:I18N.title,desc:I18N.desc});
    reg();setTimeout(reg,500);setTimeout(reg,1500);
  }
  function bindGlobal(){document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select')){syncAppText();drawAll();setTimeout(()=>{try{renderAll();}catch(_){drawAll();}},50);}},true);}

  function render(card={}){
    const y=state.view.getFullYear(),m=state.view.getMonth();
    const selected=parseYmd(state.selected);
    const compact=(card.w||DEFAULT_W)<460;
    const tiny=(card.w||DEFAULT_W)<380||(card.h||DEFAULT_H)<360;
    return `<div class="calendar-widget ${compact?'compact':''} ${tiny?'tiny':''}" data-calendar-version="${E(VER)}">
      <header class="cw-head">
        <button data-cal-prev title="${t('prev')}">‹</button>
        <div class="cw-title"><h3>${y} ${monthName(m)}</h3><p>${fmtDateShort(selected)} · ${E(lunar(selected))}</p></div>
        <button data-cal-next title="${t('next')}">›</button>
        <button class="cw-today" data-cal-today>${t('today')}</button>
      </header>
      <section class="cw-hero">
        <strong>${selected.getDate()}</strong>
        <div><b>${fmtDate(selected)}</b><span>${t('lunar')} ${E(lunar(selected))}</span></div>
        <nav>${badges(selected,true).join('')||'<i class="empty">—</i>'}</nav>
      </section>
      <section class="cw-body">
        <main class="cw-month">
          <div class="cw-week">${week().map(w=>`<b>${E(w)}</b>`).join('')}</div>
          <div class="cw-grid">${monthCells(y,m).map(dayCell).join('')}</div>
        </main>
        <aside class="cw-events"><h4>${t('events')}</h4>${eventList(y,m)}</aside>
      </section>
    </div>`;
  }
  function dayCell(info){
    const hs=holidayInfo(info.date);
    const today=info.key===ymd(new Date()),sel=info.key===state.selected;
    const cls=['cw-day',info.inMonth?'':'out',today?'today':'',sel?'selected':'',info.date.getDay()===0?'sun':'',hs.cnRest?'cn-rest':'',hs.cnWork?'cn-work':'',hs.hkRest?'hk-rest':''].join(' ');
    return `<button class="${cls}" data-cal-date="${info.key}"><strong>${info.date.getDate()}</strong><span>${E(lunarShort(info.date))}</span><div>${badges(info.date,false).slice(0,2).join('')}</div></button>`;
  }
  function badges(date,long=false){
    const hs=holidayInfo(date),out=[];
    if(hs.cnRest)out.push(`<i class="cn-rest">${long?t('cn')+' '+E(hs.cnRest.name):t('rest')}</i>`);
    if(hs.cnWork)out.push(`<i class="cn-work">${long?t('cn')+' '+E(hs.cnWork.name):t('work')}</i>`);
    if(hs.hkRest)out.push(`<i class="hk-rest">${long?t('hk')+' '+E(hs.hkRest.name):t('hk')}</i>`);
    return out;
  }
  function eventList(year,month){
    const arr=monthEvents(year,month);
    if(!arr.length)return `<p class="cw-muted">${t('none')}</p>`;
    return arr.map(ev=>`<p class="${ev.type}"><b>${ev.day}</b><span>${E(ev.name)}</span><em>${ev.region}</em></p>`).join('');
  }

  function bind(){
    document.querySelectorAll('[data-cal-prev]').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=e=>{e.stopPropagation();moveMonth(-1);};btn.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-cal-next]').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=e=>{e.stopPropagation();moveMonth(1);};btn.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-cal-today]').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=e=>{e.stopPropagation();const d=new Date();state.view=new Date(d.getFullYear(),d.getMonth(),1);state.selected=ymd(d);drawAll();};btn.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-cal-date]').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=e=>{e.stopPropagation();state.selected=btn.dataset.calDate;const d=parseYmd(state.selected);state.view=new Date(d.getFullYear(),d.getMonth(),1);drawAll();};btn.onpointerdown=e=>e.stopPropagation();});
  }
  function moveMonth(n){const d=state.view;state.view=new Date(d.getFullYear(),d.getMonth()+n,1);const cur=parseYmd(state.selected);if(cur.getFullYear()!==state.view.getFullYear()||cur.getMonth()!==state.view.getMonth())state.selected=ymd(state.view);drawAll();}
  function drawAll(){
    syncAppText();
    document.querySelectorAll('[data-card-id]').forEach(el=>{
      const c=activeWorkspace().cards.find(x=>String(x.id)===String(el.dataset.cardId));
      if(c?.appId===APP){const body=el.querySelector('.card-body');if(body)body.innerHTML=render(c);}
    });
    bind();
  }

  function buildHolidayData(){
    const cnRest={},cnWork={},hkRest={};
    CN_2026.forEach(group=>group.dates.forEach(date=>{const item={name:group.name,type:group.type,region:'CN'};(group.type==='work'?cnWork:cnRest)[date]=item;}));
    HK_2026.forEach(([date,name])=>{hkRest[date]={name,type:'rest',region:'HK'};});
    return {cnRest,cnWork,hkRest};
  }
  function holidayInfo(date){const key=ymd(date);return {cnRest:data.cnRest[key]||null,cnWork:data.cnWork[key]||null,hkRest:data.hkRest[key]||null};}
  function monthEvents(year,month){
    const start=new Date(year,month,1),end=new Date(year,month+1,0),arr=[];
    for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){
      const key=ymd(d),day=d.getDate();
      if(data.cnRest[key])arr.push({day,name:data.cnRest[key].name,region:t('cn'),type:'rest'});
      if(data.cnWork[key])arr.push({day,name:data.cnWork[key].name,region:t('cn'),type:'work'});
      if(data.hkRest[key])arr.push({day,name:data.hkRest[key].name,region:t('hk'),type:'hk'});
    }
    return arr;
  }
  function monthCells(year,month){const first=new Date(year,month,1),start=new Date(first);start.setDate(1-first.getDay());return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return {date:d,key:ymd(d),inMonth:d.getMonth()===month};});}
  function lunar(date){try{return new Intl.DateTimeFormat('zh-Hant-u-ca-chinese',{month:'long',day:'numeric'}).format(date).replace(/\s/g,'');}catch(e){return '—';}}
  function lunarShort(date){const s=lunar(date);return s.replace(/^[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥年月]+/,'').slice(-4)||s;}
  function fmtDate(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${week()[date.getDay()]}`;}
  function fmtDateShort(date){return `${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getDate()).padStart(2,'0')} ${week()[date.getDay()]}`;}
  function ymd(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
  function parseYmd(s){const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d);}
  function range(a,b){const out=[];for(let d=parseYmd(a),end=parseYmd(b);d<=end;d.setDate(d.getDate()+1))out.push(ymd(d));return out;}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function installStyle(){
    if(document.getElementById('calendarWidgetStyle'))return;
    const s=document.createElement('style');s.id='calendarWidgetStyle';s.textContent=`
.t-calendar{--icon:linear-gradient(145deg,#7ad7ff,#8b5cf6);--glow:linear-gradient(135deg,#7ad7ff,#8b5cf6)}
.calendar-widget{height:100%;container-type:inline-size;display:flex;flex-direction:column;gap:8px;overflow:hidden;color:var(--ink);font-variant-numeric:tabular-nums}.calendar-widget *{box-sizing:border-box;min-width:0}.cw-head{display:grid;grid-template-columns:30px 1fr 30px auto;gap:7px;align-items:center}.cw-head button{height:30px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.075);color:var(--ink);font-weight:900;cursor:pointer}.cw-today{padding:0 11px}.cw-title{min-width:0}.cw-title h3{margin:0;font-size:20px;line-height:1.1}.cw-title p{margin:2px 0 0;color:var(--muted);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cw-hero{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:10px 12px;border:1px solid rgba(255,255,255,.10);border-radius:17px;background:linear-gradient(135deg,rgba(122,215,255,.10),rgba(139,92,246,.08),rgba(255,255,255,.035))}.cw-hero>strong{font-size:42px;line-height:.9;font-weight:950;color:#7ad7ff}.cw-hero b{display:block;font-size:15px}.cw-hero span{display:block;color:var(--muted);font-size:12px;margin-top:2px}.cw-hero nav{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}.cw-hero i,.cw-day i{font-style:normal;border-radius:8px;padding:2px 6px;font-size:10px;font-weight:900;line-height:1.25;border:1px solid rgba(255,255,255,.10);white-space:nowrap}.cw-hero .empty{color:var(--muted);background:rgba(255,255,255,.06)}.cw-body{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 168px;gap:8px}.cw-month,.cw-events{border:1px solid rgba(255,255,255,.10);background:linear-gradient(180deg,rgba(255,255,255,.072),rgba(255,255,255,.035));border-radius:17px;overflow:hidden}.cw-week,.cw-grid{display:grid;grid-template-columns:repeat(7,1fr)}.cw-week{height:28px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.07)}.cw-week b{display:grid;place-items:center;color:var(--muted);font-size:11px}.cw-grid{height:calc(100% - 28px);min-height:240px}.cw-day{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:6px;border:0;border-right:1px solid rgba(255,255,255,.052);border-bottom:1px solid rgba(255,255,255,.052);background:transparent;color:var(--ink);text-align:left;cursor:pointer;overflow:hidden}.cw-day:nth-child(7n){border-right:0}.cw-day strong{font-size:14px}.cw-day span{font-size:10px;color:var(--muted);white-space:nowrap}.cw-day div{display:flex;gap:2px;flex-wrap:wrap;margin-top:auto}.cw-day.out{opacity:.33}.cw-day.sun strong{color:#ff8b9d}.cw-day.today{box-shadow:inset 0 0 0 1px rgba(122,215,255,.68)}.cw-day.selected{background:linear-gradient(135deg,rgba(122,215,255,.18),rgba(139,92,246,.18));box-shadow:inset 0 0 0 2px rgba(122,215,255,.50)}.cn-rest{background:rgba(34,212,123,.16);color:#34f0a0}.cn-work{background:rgba(255,153,0,.17);color:#ffcf70}.hk-rest{background:rgba(122,215,255,.16);color:#8bdcff}.cw-events{padding:10px;overflow:auto}.cw-events h4{margin:0 0 7px;font-size:12px;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}.cw-events p{display:grid;grid-template-columns:24px 1fr auto;gap:6px;align-items:center;margin:0;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:12px}.cw-events p:last-child{border-bottom:0}.cw-events b{width:21px;height:21px;border-radius:8px;display:grid;place-items:center;background:rgba(255,255,255,.07)}.cw-events em{font-style:normal;color:var(--muted);font-size:10px}.cw-events .work b{background:rgba(255,153,0,.15);color:#ffcf70}.cw-events .rest b{background:rgba(34,212,123,.14);color:#34f0a0}.cw-events .hk b{background:rgba(122,215,255,.14);color:#8bdcff}.cw-muted{display:block!important;color:var(--muted);font-size:12px;border:0!important}.compact .cw-body{grid-template-columns:1fr}.compact .cw-events{max-height:116px}.tiny .cw-events{display:none}.tiny .cw-hero{grid-template-columns:auto 1fr;padding:9px}.tiny .cw-hero nav{grid-column:1/-1;justify-content:flex-start}.tiny .cw-hero>strong{font-size:34px}@container (max-width:390px){.cw-head{grid-template-columns:28px 1fr 28px}.cw-today{display:none}.cw-title h3{font-size:18px}.cw-hero{gap:8px}.cw-grid{min-height:205px}.cw-day{padding:4px}.cw-day strong{font-size:13px}.cw-day span{font-size:9px}.cw-day i{font-size:8px;padding:1px 3px}.cw-week{height:25px}.cw-week b{font-size:10px}}`;
    document.head.appendChild(s);
  }

  boot();
})();