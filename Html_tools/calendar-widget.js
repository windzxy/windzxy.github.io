(function(){
  if(window.__windzxyCalendarWidgetLoaded)return;
  window.__windzxyCalendarWidgetLoaded=1;

  const APP='calendar';
  const VER='20260819-calendar-widget1-cn-hk-holidays';
  const DEFAULT_W=620, DEFAULT_H=520, MIN_W=330, MIN_H=300;
  const WEEK=['日','一','二','三','四','五','六'];
  const MONTHS={
    'zh-CN':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    'zh-HK':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  };
  const I18N={
    title:{'zh-CN':'万年历','zh-HK':'萬年曆',en:'Calendar'},
    desc:{'zh-CN':'农历、公历、中国内地节假日调休与香港公众假期。','zh-HK':'農曆、公曆、中國內地節假日調休與香港公眾假期。',en:'Lunar calendar, Gregorian dates, Mainland China holiday transfers and Hong Kong public holidays.'},
    today:{'zh-CN':'今天','zh-HK':'今天',en:'Today'},
    source:{'zh-CN':'来源','zh-HK':'來源',en:'Sources'},
    cn:{'zh-CN':'内地','zh-HK':'內地',en:'CN'},
    hk:{'zh-CN':'香港','zh-HK':'香港',en:'HK'},
    rest:{'zh-CN':'休','zh-HK':'休',en:'Off'},
    work:{'zh-CN':'班','zh-HK':'班',en:'Work'},
    public:{'zh-CN':'公众假期','zh-HK':'公眾假期',en:'Public holiday'},
    lunar:{'zh-CN':'农历','zh-HK':'農曆',en:'Lunar'},
    selected:{'zh-CN':'选中日期','zh-HK':'選中日期',en:'Selected date'},
    monthEvents:{'zh-CN':'本月假日','zh-HK':'本月假日',en:'Month events'},
    noEvents:{'zh-CN':'本月没有官方假日/调休记录','zh-HK':'本月沒有官方假日/調休記錄',en:'No official holiday or workday records this month'},
    official2026:{'zh-CN':'2026官方假期','zh-HK':'2026官方假期',en:'2026 official holidays'},
    sunday:{'zh-CN':'星期日','zh-HK':'星期日',en:'Sunday'},
    noData:{'zh-CN':'该年份假期数据待官方公布','zh-HK':'該年份假期資料待官方公布',en:'Holiday data for this year is pending official publication'},
    sourcesShort:{'zh-CN':'国务院/香港政府','zh-HK':'國務院/香港政府',en:'State Council / GovHK'},
    prev:{'zh-CN':'上月','zh-HK':'上月',en:'Previous month'},
    next:{'zh-CN':'下月','zh-HK':'下月',en:'Next month'}
  };

  const CN_2026=[
    {name:'元旦',type:'rest',dates:['2026-01-01','2026-01-02','2026-01-03']},
    {name:'元旦調休上班',type:'work',dates:['2026-01-04']},
    {name:'春節',type:'rest',dates:range('2026-02-15','2026-02-23')},
    {name:'春節調休上班',type:'work',dates:['2026-02-14','2026-02-28']},
    {name:'清明節',type:'rest',dates:range('2026-04-04','2026-04-06')},
    {name:'勞動節',type:'rest',dates:range('2026-05-01','2026-05-05')},
    {name:'勞動節調休上班',type:'work',dates:['2026-05-09']},
    {name:'端午節',type:'rest',dates:range('2026-06-19','2026-06-21')},
    {name:'中秋節',type:'rest',dates:range('2026-09-25','2026-09-27')},
    {name:'國慶節',type:'rest',dates:range('2026-10-01','2026-10-07')},
    {name:'國慶節調休上班',type:'work',dates:['2026-09-20','2026-10-10']}
  ];
  const HK_2026=[
    ['2026-01-01','一月一日'],['2026-02-17','農曆年初一'],['2026-02-18','農曆年初二'],['2026-02-19','農曆年初三'],
    ['2026-04-03','耶穌受難節'],['2026-04-04','耶穌受難節翌日'],['2026-04-06','清明節翌日'],['2026-04-07','復活節星期一翌日'],
    ['2026-05-01','勞動節'],['2026-05-25','佛誕翌日'],['2026-06-19','端午節'],['2026-07-01','香港特別行政區成立紀念日'],
    ['2026-09-26','中秋節翌日'],['2026-10-01','國慶日'],['2026-10-19','重陽節翌日'],['2026-12-25','聖誕節'],['2026-12-26','聖誕節後第一個周日']
  ];

  const state={
    view:new Date(new Date().getFullYear(),new Date().getMonth(),1),
    selected:ymd(new Date())
  };
  let patched=false;
  let data=buildHolidayData();

  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    if(/^en/i.test(v))return 'en';
    return 'zh-HK';
  }
  function t(key){const lc=lang();return I18N[key]?.[lc]||I18N[key]?.['zh-HK']||key;}
  function monthName(m){return MONTHS[lang()][m];}
  function meta(){return {title:t('title'),desc:t('desc')};}

  function boot(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'||typeof bodyHtml==='undefined'||typeof save==='undefined'){
      setTimeout(boot,80);return;
    }
    installStyle();installApp();patchRenderers();ensureCard();fitCards();registerI18n();renderAll();bindGlobal();
  }
  function installApp(){
    const m=meta();
    const info={id:APP,kind:'widget',title:m.title,desc:m.desc,icon:'Cal',tone:'t-calendar'};
    const old=apps.find(a=>a.id===APP);
    old?Object.assign(old,info):apps.push(info);
    if(typeof defaults!=='undefined')defaults.forEach(ws=>{
      if(ws.id==='daily'&&!ws.cards.some(c=>c.appId===APP))ws.cards.push({id:'daily-calendar-0',appId:APP,x:560,y:520,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
    });
  }
  function syncAppText(){
    try{const a=apps.find(x=>x.id===APP);if(a){const m=meta();a.title=m.title;a.desc=m.desc;}}catch(e){}
  }
  function ensureCard(){
    try{
      const ws=activeWorkspace();
      if(ws&&!ws.cards.some(c=>c.appId===APP)){
        ws.cards.push({id:'card-calendar-'+Date.now(),appId:APP,x:560,y:520,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();
      }
    }catch(e){}
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
  function bindGlobal(){
    document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select')){syncAppText();drawAll();setTimeout(()=>{syncAppText();try{renderAll();}catch(_){drawAll();}},50);}},true);
  }

  function render(card={}){
    const y=state.view.getFullYear(),m=state.view.getMonth();
    const cells=monthCells(y,m);
    const selected=selectedInfo();
    const events=monthEvents(y,m);
    const compact=(card.w||DEFAULT_W)<470;
    return `<div class="calendar-widget ${compact?'compact':''}" data-calendar-version="${E(VER)}">
      <header class="cw-head">
        <div><p>${t('official2026')}</p><h3>${y} ${monthName(m)}</h3></div>
        <div class="cw-actions">
          <button data-cal-prev title="${t('prev')}">‹</button>
          <button data-cal-today>${t('today')}</button>
          <button data-cal-next title="${t('next')}">›</button>
        </div>
      </header>
      <section class="cw-main">
        <div class="cw-month">
          <div class="cw-week">${WEEK.map(w=>`<b>${w}</b>`).join('')}</div>
          <div class="cw-grid">${cells.map(dayCell).join('')}</div>
        </div>
        <aside class="cw-side">
          <div class="cw-selected">
            <span>${t('selected')}</span>
            <strong>${fmtDate(selected.date)}</strong>
            <em>${t('lunar')} ${E(lunar(selected.date))}</em>
            <div class="cw-tags">${badges(selected,true).join('')||'<i>—</i>'}</div>
          </div>
          <div class="cw-events">
            <h4>${t('monthEvents')}</h4>
            <div>${events.length?events.map(eventRow).join(''):`<p class="cw-muted">${t('noEvents')}</p>`}</div>
          </div>
        </aside>
      </section>
      <footer class="cw-foot"><span>${t('source')}：${t('sourcesShort')}</span><button data-cal-source="cn">CN</button><button data-cal-source="hk">HK</button></footer>
    </div>`;
  }
  function dayCell(info){
    const today=info.key===ymd(new Date()),sel=info.key===state.selected,hs=holidayInfo(info.date);
    const cls=['cw-day',info.inMonth?'':'out',today?'today':'',sel?'selected':'',info.date.getDay()===0?'sun':'',hs.cnRest?'cn-rest':'',hs.cnWork?'cn-work':'',hs.hkRest?'hk-rest':''].join(' ');
    const b=badges(info,false).slice(0,3).join('');
    return `<button class="${cls}" data-cal-date="${info.key}"><strong>${info.date.getDate()}</strong><span>${E(lunarShort(info.date))}</span><div>${b}</div></button>`;
  }
  function badges(info,long=false){
    const hs=holidayInfo(info.date||info);
    const out=[];
    if(hs.cnRest)out.push(`<i class="cn-rest">${long?t('cn')+' '+E(hs.cnRest.name):t('rest')}</i>`);
    if(hs.cnWork)out.push(`<i class="cn-work">${long?t('cn')+' '+E(hs.cnWork.name):t('work')}</i>`);
    if(hs.hkRest)out.push(`<i class="hk-rest">${long?t('hk')+' '+E(hs.hkRest.name):t('hk')}</i>`);
    else if(hs.hkSunday)out.push(`<i class="hk-sun">${long?t('hk')+' '+t('sunday'):t('hk')}</i>`);
    return out;
  }
  function eventRow(ev){return `<p class="${ev.type}"><b>${ev.day}</b><span>${E(ev.name)}</span><em>${ev.region}</em></p>`;}
  function selectedInfo(){return {date:parseYmd(state.selected)};}

  function bind(){
    document.querySelectorAll('[data-cal-prev]').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=e=>{e.stopPropagation();moveMonth(-1);};btn.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-cal-next]').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=e=>{e.stopPropagation();moveMonth(1);};btn.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-cal-today]').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=e=>{e.stopPropagation();const d=new Date();state.view=new Date(d.getFullYear(),d.getMonth(),1);state.selected=ymd(d);drawAll();};btn.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-cal-date]').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=e=>{e.stopPropagation();state.selected=btn.dataset.calDate;const d=parseYmd(state.selected);state.view=new Date(d.getFullYear(),d.getMonth(),1);drawAll();};btn.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-cal-source]').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=e=>{e.stopPropagation();openSource(btn.dataset.calSource);};btn.onpointerdown=e=>e.stopPropagation();});
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
  function openSource(which){
    const url=which==='hk'?'https://www.gov.hk/tc/about/abouthk/holiday/2026.htm':'https://www.gov.cn/gongbao/2025/issue_12406/material/gwygb202532.pdf';
    window.open(url,'_blank','noopener,noreferrer');
  }

  function buildHolidayData(){
    const cnRest={},cnWork={},hkRest={};
    CN_2026.forEach(group=>group.dates.forEach(date=>{
      const item={name:group.name,type:group.type,region:'CN'};
      if(group.type==='work')cnWork[date]=item;else cnRest[date]=item;
    }));
    HK_2026.forEach(([date,name])=>{hkRest[date]={name,type:'rest',region:'HK'};});
    return {cnRest,cnWork,hkRest,years:new Set(['2026'])};
  }
  function holidayInfo(date){
    const key=ymd(date);
    return {cnRest:data.cnRest[key]||null,cnWork:data.cnWork[key]||null,hkRest:data.hkRest[key]||null,hkSunday:date.getDay()===0};
  }
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
  function monthCells(year,month){
    const first=new Date(year,month,1);const start=new Date(first);start.setDate(1-first.getDay());
    const cells=[];
    for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);cells.push({date:d,key:ymd(d),inMonth:d.getMonth()===month});}
    return cells;
  }
  function lunar(date){
    try{return new Intl.DateTimeFormat(lang()==='en'?'zh-Hant-u-ca-chinese':'zh-Hant-u-ca-chinese',{month:'long',day:'numeric'}).format(date).replace(/\s/g,'');}catch(e){return '—';}
  }
  function lunarShort(date){
    const s=lunar(date);return s.replace(/^[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥年月]+/,'').slice(-4)||s;
  }
  function fmtDate(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${WEEK[date.getDay()]}`;}
  function ymd(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
  function parseYmd(s){const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d);}
  function range(a,b){const out=[];for(let d=parseYmd(a),end=parseYmd(b);d<=end;d.setDate(d.getDate()+1))out.push(ymd(d));return out;}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function installStyle(){
    if(document.getElementById('calendarWidgetStyle'))return;
    const s=document.createElement('style');s.id='calendarWidgetStyle';s.textContent=`
.t-calendar{--icon:linear-gradient(145deg,#7ad7ff,#8b5cf6);--glow:linear-gradient(135deg,#7ad7ff,#8b5cf6)}
.calendar-widget{height:100%;container-type:inline-size;display:flex;flex-direction:column;gap:9px;overflow:hidden;color:var(--ink);font-variant-numeric:tabular-nums}.calendar-widget *{box-sizing:border-box;min-width:0}.cw-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.cw-head p{margin:0 0 2px;color:var(--muted);font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.cw-head h3{margin:0;font-size:21px;line-height:1.1}.cw-actions{display:flex;gap:6px;align-items:center}.cw-actions button,.cw-foot button{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);color:var(--ink);border-radius:999px;height:30px;padding:0 11px;font-weight:850;cursor:pointer}.cw-actions button:first-child,.cw-actions button:last-child{width:30px;padding:0}.cw-main{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:9px}.cw-month,.cw-side>div{border:1px solid rgba(255,255,255,.10);background:linear-gradient(180deg,rgba(255,255,255,.085),rgba(255,255,255,.04));border-radius:16px;overflow:hidden}.cw-week,.cw-grid{display:grid;grid-template-columns:repeat(7,1fr)}.cw-week{height:31px;background:rgba(255,255,255,.045);border-bottom:1px solid rgba(255,255,255,.08)}.cw-week b{display:grid;place-items:center;color:var(--muted);font-size:11px}.cw-grid{height:calc(100% - 31px);min-height:240px}.cw-day{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:6px;border:0;border-right:1px solid rgba(255,255,255,.055);border-bottom:1px solid rgba(255,255,255,.055);background:transparent;color:var(--ink);text-align:left;cursor:pointer;overflow:hidden}.cw-day:nth-child(7n){border-right:0}.cw-day strong{font-size:14px}.cw-day span{font-size:10px;color:var(--muted);white-space:nowrap}.cw-day div{display:flex;gap:2px;flex-wrap:wrap;margin-top:auto}.cw-day i,.cw-tags i{font-style:normal;border-radius:7px;padding:1px 4px;font-size:9px;font-weight:900;line-height:1.25;border:1px solid rgba(255,255,255,.10)}.cw-day.out{opacity:.38}.cw-day.today{box-shadow:inset 0 0 0 1px rgba(122,215,255,.75)}.cw-day.selected{background:linear-gradient(135deg,rgba(122,215,255,.18),rgba(139,92,246,.18));box-shadow:inset 0 0 0 2px rgba(122,215,255,.55)}.cw-day.sun strong{color:#ff8b9d}.cn-rest{background:rgba(34,212,123,.16);color:#34f0a0}.cn-work{background:rgba(255,153,0,.17);color:#ffcf70}.hk-rest,.hk-sun{background:rgba(122,215,255,.16);color:#8bdcff}.cw-side{min-height:0;display:flex;flex-direction:column;gap:9px}.cw-selected{padding:12px}.cw-selected span{display:block;color:var(--muted);font-size:11px}.cw-selected strong{display:block;margin:4px 0;font-size:18px}.cw-selected em{font-style:normal;color:var(--muted);font-size:12px}.cw-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}.cw-tags>i:not([class]){color:var(--muted);font-style:normal}.cw-events{flex:1;min-height:0;padding:11px;overflow:auto}.cw-events h4{margin:0 0 8px;font-size:13px}.cw-events p{display:grid;grid-template-columns:26px 1fr auto;gap:6px;align-items:center;margin:0;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:12px}.cw-events p:last-child{border-bottom:0}.cw-events b{width:22px;height:22px;border-radius:8px;display:grid;place-items:center;background:rgba(255,255,255,.07)}.cw-events em{font-style:normal;color:var(--muted);font-size:10px}.cw-events .work b{background:rgba(255,153,0,.15);color:#ffcf70}.cw-events .rest b{background:rgba(34,212,123,.14);color:#34f0a0}.cw-events .hk b{background:rgba(122,215,255,.14);color:#8bdcff}.cw-muted{display:block!important;color:var(--muted);font-size:12px;border:0!important}.cw-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--muted);font-size:11px}.cw-foot span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cw-foot button{height:25px;padding:0 9px}.cw-foot button:first-of-type{margin-left:auto}@container (max-width:560px){.cw-main{grid-template-columns:1fr}.cw-side{display:grid;grid-template-columns:1fr 1fr}.cw-events{max-height:130px}.cw-grid{min-height:220px}.cw-head h3{font-size:19px}}@container (max-width:420px){.cw-head{align-items:flex-start;flex-direction:column}.cw-actions{width:100%;justify-content:space-between}.cw-side{grid-template-columns:1fr}.cw-events{display:none}.cw-day{padding:4px}.cw-day strong{font-size:13px}.cw-day span{font-size:9px}.cw-day i{font-size:8px;padding:1px 3px}.cw-week{height:26px}.cw-grid{min-height:205px}.cw-foot{font-size:10px}}`;
    document.head.appendChild(s);
  }
  boot();
})();