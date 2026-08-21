(function(){
  if(window.__windzxyTyphoonWidgetLoaded)return;
  window.__windzxyTyphoonWidgetLoaded=1;

  const APP='typhoon';
  const VER='20260821-typhoon-widget2-pm-polished-snapshot';
  const DATA_URL='data/typhoon.json';
  const OFFICIAL_URL={
    'zh-CN':'https://www.hko.gov.hk/sc/wxinfo/currwx/tc_gis.htm',
    'zh-HK':'https://www.hko.gov.hk/tc/wxinfo/currwx/tc_gis.htm',
    en:'https://www.hko.gov.hk/en/wxinfo/currwx/tc_gis.htm'
  };
  const META={
    title:{'zh-CN':'台风路径','zh-HK':'颱風路徑',en:'Typhoon track'},
    desc:{'zh-CN':'香港天文台热带气旋路径、实况与官方地图。','zh-HK':'香港天文台熱帶氣旋路徑、實況與官方地圖。',en:'HKO tropical cyclone track, positions and official map.'}
  };
  const TEXT={
    live:{'zh-CN':'官方快照','zh-HK':'官方快照',en:'Official snapshot'},
    source:{'zh-CN':'HKO','zh-HK':'HKO',en:'HKO'},
    refresh:{'zh-CN':'刷新','zh-HK':'刷新',en:'Refresh'},
    official:{'zh-CN':'官方地图','zh-HK':'官方地圖',en:'Official map'},
    loading:{'zh-CN':'正在同步香港天文台资料…','zh-HK':'正在同步香港天文台資料…',en:'Syncing HKO data…'},
    noActive:{'zh-CN':'暂无活跃热带气旋','zh-HK':'暫無活躍熱帶氣旋',en:'No active tropical cyclone'},
    noActiveSub:{'zh-CN':'如有新风暴，卡片会随官方资料自动更新。','zh-HK':'如有新風暴，卡片會隨官方資料自動更新。',en:'This card updates when HKO publishes a new active system.'},
    syncPending:{'zh-CN':'官方资料同步中','zh-HK':'官方資料同步中',en:'Official data sync pending'},
    syncPendingSub:{'zh-CN':'暂未读到本地快照，请稍后刷新或打开官方地图。','zh-HK':'暫未讀到本地快照，請稍後刷新或打開官方地圖。',en:'Local snapshot is not ready. Refresh later or open the official map.'},
    systems:{'zh-CN':'系统','zh-HK':'系統',en:'Systems'},
    trackPoints:{'zh-CN':'路径点','zh-HK':'路徑點',en:'Track points'},
    latest:{'zh-CN':'最新位置','zh-HK':'最新位置',en:'Latest position'},
    movement:{'zh-CN':'移动','zh-HK':'移動',en:'Movement'},
    wind:{'zh-CN':'风速','zh-HK':'風速',en:'Wind'},
    pressure:{'zh-CN':'气压','zh-HK':'氣壓',en:'Pressure'},
    intensity:{'zh-CN':'强度','zh-HK':'強度',en:'Intensity'},
    updated:{'zh-CN':'更新','zh-HK':'更新',en:'Updated'},
    sourceNote:{'zh-CN':'资料源：香港天文台 / DATA.GOV.HK','zh-HK':'資料源：香港天文台 / DATA.GOV.HK',en:'Source: HKO / DATA.GOV.HK'},
    mapHint:{'zh-CN':'西北太平洋路径视图','zh-HK':'西北太平洋路徑視圖',en:'NW Pacific track view'}
  };
  let patched=false;

  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    if(/^en/i.test(v))return 'en';
    return 'zh-HK';
  }
  function t(key){return TEXT[key]?.[lang()]||TEXT[key]?.['zh-HK']||key;}
  function metaTitle(){return META.title[lang()]||META.title['zh-HK'];}
  function metaDesc(){return META.desc[lang()]||META.desc['zh-HK'];}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function officialUrl(){return OFFICIAL_URL[lang()]||OFFICIAL_URL['zh-HK'];}
  function dateText(v){
    if(!v)return '--';
    const d=new Date(v);
    if(!Number.isFinite(+d))return String(v);
    return new Intl.DateTimeFormat(undefined,{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(d);
  }

  function ensureMeta(){
    try{
      if(!Array.isArray(apps))return;
      let app=apps.find(x=>x.id===APP);
      if(!app){
        app={id:APP,kind:'widget',title:metaTitle(),desc:metaDesc(),icon:'🌀',tone:'t-typhoon'};
        const weatherIndex=apps.findIndex(x=>x.id==='weather');
        if(weatherIndex>=0)apps.splice(weatherIndex,0,app);else apps.push(app);
      }else{
        app.kind='widget';app.title=metaTitle();app.desc=metaDesc();app.icon='🌀';app.tone='t-typhoon';
      }
    }catch(e){}
  }

  function body(card){
    return `<div class="typhoon-widget tpx is-loading" data-typhoon-root data-typhoon-version="${VER}">
      <header class="tpx-head">
        <div class="tpx-source"><span class="tpx-pulse"></span><b>${t('source')}</b><em data-tpx-mode>${t('live')}</em></div>
        <nav><button type="button" data-tpx-refresh title="${esc(t('refresh'))}">↻</button><a href="${esc(officialUrl())}" target="_blank" rel="noopener noreferrer">${t('official')}</a></nav>
      </header>
      <section class="tpx-summary">
        <div><small>${t('mapHint')}</small><strong data-tpx-title>${t('loading')}</strong><span data-tpx-sub>${t('sourceNote')}</span></div>
        <aside><b data-tpx-count>--</b><span>${t('systems')}</span></aside>
      </section>
      <section class="tpx-map" data-tpx-map>${svgMap([])}</section>
      <section class="tpx-detail" data-tpx-detail><p>${t('loading')}</p></section>
      <footer><span data-tpx-foot>${t('updated')} --</span><span>${t('sourceNote')}</span></footer>
    </div>`;
  }

  function project(lon,lat){
    const minLon=95,maxLon=155,minLat=0,maxLat=40;
    const x=(Number(lon)-minLon)/(maxLon-minLon)*1000;
    const y=(maxLat-Number(lat))/(maxLat-minLat)*620;
    return [Math.max(0,Math.min(1000,x)),Math.max(0,Math.min(620,y))];
  }
  function svgMap(storms){
    const labels=[['HK',114.17,22.32],['TW',121.0,23.8],['PH',122.8,13.5],['JP',139.7,35.7],['CN',113.3,23.1],['VN',106.7,10.8]];
    const grid=[];
    for(let lon=100;lon<=150;lon+=10){const [x]=project(lon,20);grid.push(`<path d="M${x} 0V620"/>`);grid.push(`<text x="${x+5}" y="604">${lon}E</text>`);}
    for(let lat=5;lat<=35;lat+=5){const [,y]=project(120,lat);grid.push(`<path d="M0 ${y}H1000"/>`);grid.push(`<text x="8" y="${y-6}">${lat}N</text>`);}
    const coast=`<path class="tpx-coast" d="M254 70L292 112L304 178L330 222L330 295L374 350L423 405L481 454L525 486M420 170L468 207L528 240L590 302L660 367M520 105L566 142L615 178M716 56L763 98L790 158L833 217M388 220L428 244M318 305L360 328L402 356M438 342L482 370L508 409M182 460L230 496L268 548"/>`;
    const stormsSafe=(storms||[]).filter(s=>(s.points||[]).length);
    const stormLayers=stormsSafe.map((s,si)=>{
      const pts=(s.points||[]).filter(p=>Number.isFinite(+p.lat)&&Number.isFinite(+p.lon));
      const coords=pts.map(p=>project(p.lon,p.lat));
      const d=coords.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join('');
      const dots=coords.map((p,i)=>`<circle class="tpx-point ${i===coords.length-1?'last':''}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i===coords.length-1?8:4}"/>`).join('');
      const last=coords[coords.length-1];
      return `<g class="tpx-storm s${si}"><path class="tpx-track" d="${d}"/>${dots}<text class="tpx-label" x="${Math.min(940,last[0]+14)}" y="${Math.max(28,last[1]-12)}">${esc(s.name||'TC')}</text></g>`;
    }).join('');
    const empty=`<g class="tpx-empty"><circle cx="500" cy="310" r="62"/><circle cx="500" cy="310" r="36"/><path d="M500 267c26 20 30 53 8 78-20 22-54 21-76 1 30 9 59-4 71-29 9-20 5-37-3-50Z"/><text x="500" y="404" text-anchor="middle">${esc(t('noActive'))}</text></g>`;
    return `<svg viewBox="0 0 1000 620" role="img" aria-label="Typhoon track map">
      <defs>
        <radialGradient id="tpxSea" cx="56%" cy="48%" r="72%"><stop offset="0" stop-color="#155e75"/><stop offset="0.55" stop-color="#0f3b57"/><stop offset="1" stop-color="#07111f"/></radialGradient>
        <linearGradient id="tpxTrack" x1="0" x2="1"><stop offset="0" stop-color="#facc15"/><stop offset=".52" stop-color="#fb923c"/><stop offset="1" stop-color="#fb7185"/></linearGradient>
      </defs>
      <rect width="1000" height="620" rx="30" fill="url(#tpxSea)"/>
      <g class="tpx-grid">${grid.join('')}</g>
      ${coast}
      ${labels.map(([name,lon,lat])=>{const [x,y]=project(lon,lat);return `<g class="tpx-city"><circle cx="${x}" cy="${y}" r="4"/><text x="${x+8}" y="${y-8}">${name}</text></g>`;}).join('')}
      ${stormLayers||empty}
    </svg>`;
  }

  function normalizeData(data){
    const storms=Array.isArray(data?.storms)?data.storms:[];
    return storms.map((s,i)=>{
      const points=(Array.isArray(s.points)?s.points:[]).map(p=>({
        lat:+p.lat,lon:+p.lon,time:p.time||p.datetime||p.validTime||'',
        wind:p.wind||p.windSpeed||'',pressure:p.pressure||p.centralPressure||'',
        movement:p.movement||'',intensity:p.intensity||p.category||''
      })).filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
      return {id:s.id||s.tcid||String(i),name:s.name||s.tcName||s.ename||s.cname||'TC',points};
    }).filter(s=>s.points.length);
  }
  async function getSnapshot(){
    const url=DATA_URL+'?v='+Date.now();
    const res=await fetch(url,{cache:'no-store'});
    if(!res.ok)throw new Error('snapshot '+res.status);
    const data=await res.json();
    return data;
  }
  function latestOf(storm){return storm.points[storm.points.length-1]||{};}
  function renderData(root,data,error){
    const title=root.querySelector('[data-tpx-title]'),sub=root.querySelector('[data-tpx-sub]'),map=root.querySelector('[data-tpx-map]'),detail=root.querySelector('[data-tpx-detail]'),foot=root.querySelector('[data-tpx-foot]'),count=root.querySelector('[data-tpx-count]'),mode=root.querySelector('[data-tpx-mode]');
    const storms=normalizeData(data);
    root.classList.toggle('is-empty',!storms.length&&!error);
    root.classList.toggle('is-error',!!error);
    root.classList.toggle('is-active',!!storms.length);
    root.classList.remove('is-loading');
    if(map)map.innerHTML=svgMap(storms);
    if(foot)foot.textContent=t('updated')+' '+dateText(data?.updatedAt||new Date());
    if(mode)mode.textContent=error?t('syncPending'):t('live');
    if(count)count.textContent=String(storms.length||0);
    if(error){
      if(title)title.textContent=t('syncPending');
      if(sub)sub.textContent=t('syncPendingSub');
      if(detail)detail.innerHTML=`<p>${esc(t('syncPendingSub'))}</p><a class="tpx-open" target="_blank" rel="noopener noreferrer" href="${esc(officialUrl())}">${esc(t('official'))}</a>`;
      return;
    }
    if(!storms.length){
      if(title)title.textContent=t('noActive');
      if(sub)sub.textContent=t('noActiveSub');
      if(detail)detail.innerHTML=`<article class="tpx-empty-card"><b>${esc(t('noActive'))}</b><span>${esc(t('noActiveSub'))}</span></article>`;
      return;
    }
    const latest=storms.map(s=>Object.assign({},s,{last:latestOf(s)}));
    if(title)title.textContent=latest.map(s=>s.name).join(' / ');
    if(sub)sub.textContent=latest.map(s=>`${Number(s.last.lat).toFixed(1)}N ${Number(s.last.lon).toFixed(1)}E`).join(' · ');
    if(detail)detail.innerHTML=latest.map(s=>{
      const p=s.last;
      const chips=[
        `${t('latest')}: ${Number(p.lat).toFixed(1)}N ${Number(p.lon).toFixed(1)}E`,
        p.intensity?`${t('intensity')}: ${p.intensity}`:'',
        p.wind?`${t('wind')}: ${p.wind}`:'',
        p.pressure?`${t('pressure')}: ${p.pressure}`:'',
        p.movement?`${t('movement')}: ${p.movement}`:'',
        `${t('trackPoints')}: ${s.points.length}`
      ].filter(Boolean);
      return `<article class="tpx-card"><b>${esc(s.name)}</b>${chips.map(x=>`<span>${esc(x)}</span>`).join('')}${p.time?`<em>${esc(p.time)}</em>`:''}</article>`;
    }).join('');
  }
  async function load(root){
    const title=root.querySelector('[data-tpx-title]'),sub=root.querySelector('[data-tpx-sub]'),mode=root.querySelector('[data-tpx-mode]');
    root.classList.add('is-loading');
    if(title)title.textContent=t('loading');
    if(sub)sub.textContent=t('sourceNote');
    if(mode)mode.textContent=t('live');
    try{
      const data=await getSnapshot();
      renderData(root,data,null);
    }catch(error){
      renderData(root,{updatedAt:new Date().toISOString(),storms:[]},error);
    }
  }

  function installStyle(){
    if(document.getElementById('typhoonWidgetStyleV2'))return;
    const s=document.createElement('style');
    s.id='typhoonWidgetStyleV2';
    s.textContent=`
.t-typhoon{--icon:linear-gradient(145deg,#38bdf8,#0ea5e9);--glow:linear-gradient(135deg,#38bdf8,#0ea5e9)}
.typhoon-widget.tpx{height:100%;container-type:inline-size;display:flex;flex-direction:column;gap:9px;overflow:hidden;color:var(--wd-widget-ink,var(--ink));font-variant-numeric:tabular-nums}.tpx *{box-sizing:border-box;min-width:0}.tpx-head{height:34px;display:flex;align-items:center;justify-content:space-between;gap:10px}.tpx-source{display:flex;align-items:center;gap:8px}.tpx-pulse{width:10px;height:10px;border-radius:999px;background:#22c55e;box-shadow:0 0 14px rgba(34,197,94,.85)}.is-empty .tpx-pulse{background:#38bdf8;box-shadow:0 0 14px rgba(56,189,248,.65)}.is-error .tpx-pulse{background:#f59e0b;box-shadow:0 0 14px rgba(245,158,11,.65)}.tpx-source b{font-size:12px}.tpx-source em{font-style:normal;font-size:10px;border:1px solid var(--wd-widget-line,var(--line));border-radius:999px;padding:3px 8px;background:var(--wd-widget-control,rgba(255,255,255,.08));color:var(--wd-widget-muted,var(--muted));white-space:nowrap}.tpx-head nav{display:flex;align-items:center;gap:7px}.tpx-head button,.tpx-head a{height:32px;border:1px solid var(--wd-widget-line,var(--line));border-radius:999px;background:var(--wd-widget-control,rgba(255,255,255,.09));color:var(--wd-widget-ink,var(--ink));display:grid;place-items:center;text-decoration:none;font-weight:900;cursor:pointer}.tpx-head button{width:32px}.tpx-head a{padding:0 13px;font-size:12px}.tpx-summary{display:grid;grid-template-columns:minmax(0,1fr) 66px;gap:10px;align-items:stretch;padding:12px 14px;border:1px solid var(--wd-widget-line,var(--line));border-radius:18px;background:linear-gradient(135deg,rgba(14,165,233,.20),rgba(45,212,191,.08),var(--wd-widget-surface-3,rgba(255,255,255,.045)))}.tpx-summary small{display:block;color:#7dd3fc;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.tpx-summary strong{display:block;margin-top:2px;font-size:18px;line-height:1.16;letter-spacing:-.02em}.tpx-summary span{display:block;margin-top:4px;color:var(--wd-widget-muted,var(--muted));font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tpx-summary aside{border-left:1px solid var(--wd-widget-line-soft,var(--line));display:grid;place-items:center;text-align:center}.tpx-summary aside b{font-size:24px;line-height:1;color:#38bdf8}.tpx-summary aside span{margin:0;font-size:10px}.tpx-map{flex:1;min-height:170px;border:1px solid var(--wd-widget-line,var(--line));border-radius:20px;overflow:hidden;background:#06101f;position:relative}.tpx-map svg{width:100%;height:100%;display:block}.tpx-grid path{stroke:rgba(148,163,184,.16);stroke-width:1}.tpx-grid text{fill:rgba(203,213,225,.55);font-size:16px}.tpx-coast{fill:none;stroke:rgba(226,232,240,.35);stroke-width:6;stroke-linecap:round;stroke-linejoin:round}.tpx-city circle{fill:#e0f2fe;filter:drop-shadow(0 0 5px rgba(125,211,252,.75))}.tpx-city text{fill:#cbd5e1;font-size:17px;font-weight:900}.tpx-track{fill:none;stroke:url(#tpxTrack);stroke-width:8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 10px rgba(249,115,22,.58))}.tpx-point{fill:#fde68a;stroke:#7c2d12;stroke-width:2}.tpx-point.last{fill:#fb7185;stroke:#fff;stroke-width:3}.tpx-label{fill:#fff;font-size:23px;font-weight:950;text-shadow:0 2px 10px rgba(0,0,0,.75)}.tpx-empty circle{fill:none;stroke:rgba(56,189,248,.26);stroke-width:3}.tpx-empty path{fill:rgba(125,211,252,.64)}.tpx-empty text{fill:rgba(226,232,240,.76);font-size:24px;font-weight:900}.tpx-detail{max-height:104px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:7px}.tpx-detail p,.tpx-card,.tpx-empty-card{margin:0;padding:9px 11px;border:1px solid var(--wd-widget-line,var(--line));border-radius:14px;background:var(--wd-widget-surface-2,rgba(255,255,255,.045));font-size:11px;color:var(--wd-widget-muted,var(--muted))}.tpx-card,.tpx-empty-card{display:grid;gap:3px;color:var(--wd-widget-ink,var(--ink))}.tpx-card b,.tpx-empty-card b{font-size:12px}.tpx-card span,.tpx-empty-card span,.tpx-card em{font-size:10px;color:var(--wd-widget-muted,var(--muted));font-style:normal}.tpx-open{display:inline-flex;align-items:center;justify-content:center;min-height:30px;border-radius:999px;background:rgba(56,189,248,.16);color:#38bdf8;text-decoration:none;font-size:12px;font-weight:900}.tpx footer{display:flex;justify-content:space-between;gap:8px;color:var(--wd-widget-muted,var(--muted));font-size:10px;white-space:nowrap;overflow:hidden}.tpx footer span{overflow:hidden;text-overflow:ellipsis}@container (max-width:360px){.tpx-summary{grid-template-columns:1fr;padding:10px}.tpx-summary aside{display:none}.tpx-head a{display:none}.tpx-detail{display:none}.tpx-map{min-height:145px}.tpx footer{display:none}.tpx-summary strong{font-size:15px}}@container (max-height:380px){.tpx-detail,.tpx footer{display:none}.tpx-summary{padding:8px 10px}.tpx-summary strong{font-size:15px}.tpx-map{min-height:120px}}`;
    document.head.appendChild(s);
  }
  function bind(root){
    if(!root||root.dataset.tpxBound)return;
    root.dataset.tpxBound='1';
    root.querySelector('[data-tpx-refresh]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();load(root);});
    load(root);
  }
  function bindAll(){document.querySelectorAll('[data-typhoon-root]').forEach(bind);}
  function patch(){
    if(patched)return;patched=true;
    installStyle();ensureMeta();
    if(typeof bodyHtml==='function'&&!window.__windzxyTyphoonBodyPatched){
      window.__windzxyTyphoonBodyPatched=1;
      const old=bodyHtml;
      bodyHtml=function(card,info){return card&&card.appId===APP?body(card):old(card,info);};
    }
    if(typeof addCard==='function'&&!window.__windzxyTyphoonAddPatched){
      window.__windzxyTyphoonAddPatched=1;
      const oldAdd=addCard;
      addCard=function(appId){
        if(appId!==APP)return oldAdd.apply(this,arguments);
        const ws=activeWorkspace(),n=ws.cards.length;
        ws.cards.push({id:'card-typhoon-'+Date.now(),appId:APP,x:90+(n%4)*38,y:92+(n%5)*30,w:620,h:500,collapsed:false,data:{}});
        save();renderAll();
      };
    }
    if(typeof renderShelf==='function'&&!window.__windzxyTyphoonShelfPatched){window.__windzxyTyphoonShelfPatched=1;const old=renderShelf;renderShelf=function(){ensureMeta();return old.apply(this,arguments);};}
    if(typeof renderAll==='function'&&!window.__windzxyTyphoonRenderAllPatched){window.__windzxyTyphoonRenderAllPatched=1;const old=renderAll;renderAll=function(){ensureMeta();const out=old.apply(this,arguments);setTimeout(bindAll,0);return out;};}
    if(typeof renderDesktop==='function'&&!window.__windzxyTyphoonRenderDesktopPatched){window.__windzxyTyphoonRenderDesktopPatched=1;const old=renderDesktop;renderDesktop=function(){ensureMeta();const out=old.apply(this,arguments);setTimeout(bindAll,0);return out;};}
    try{renderShelf();renderAll();}catch(e){try{renderShelf();}catch(_){}}
    setTimeout(bindAll,0);
  }
  function boot(){
    if(typeof apps==='undefined'||typeof bodyHtml==='undefined'||typeof renderAll==='undefined'){setTimeout(boot,80);return;}
    patch();
    document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select'))setTimeout(()=>{ensureMeta();try{renderAll();}catch(_){bindAll();}},80);},true);
    window.windzxyTyphoonWidgetVersion=VER;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
