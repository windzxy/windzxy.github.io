(function(){
  if(window.__windzxyTyphoonWidgetLoaded)return;
  window.__windzxyTyphoonWidgetLoaded=1;

  const APP='typhoon';
  const VER='20260821-typhoon-widget1-hko-track';
  const XML_URL='https://www.weather.gov.hk/wxinfo/currwx/tc_list.xml';
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
    live:{'zh-CN':'实时','zh-HK':'即時',en:'Live'},
    source:{'zh-CN':'HKO','zh-HK':'HKO',en:'HKO'},
    refresh:{'zh-CN':'刷新','zh-HK':'刷新',en:'Refresh'},
    official:{'zh-CN':'官方','zh-HK':'官方',en:'Official'},
    loading:{'zh-CN':'正在读取香港天文台热带气旋路径…','zh-HK':'正在讀取香港天文台熱帶氣旋路徑…',en:'Loading HKO tropical cyclone track…'},
    none:{'zh-CN':'暂未读取到活跃热带气旋路径。','zh-HK':'暫未讀取到活躍熱帶氣旋路徑。',en:'No active tropical cyclone track was found.'},
    blocked:{'zh-CN':'实时资料读取受浏览器跨域限制，可打开官方地图查看。','zh-HK':'即時資料讀取受瀏覽器跨域限制，可打開官方地圖查看。',en:'Live data may be blocked by browser CORS. Open the official map.'},
    map:{'zh-CN':'路径图','zh-HK':'路徑圖',en:'Track'},
    list:{'zh-CN':'详情','zh-HK':'詳情',en:'Details'},
    updated:{'zh-CN':'更新','zh-HK':'更新',en:'Updated'},
    wind:{'zh-CN':'风速','zh-HK':'風速',en:'Wind'},
    pressure:{'zh-CN':'气压','zh-HK':'氣壓',en:'Pressure'},
    latlon:{'zh-CN':'位置','zh-HK':'位置',en:'Position'},
    noData:{'zh-CN':'没有路径点','zh-HK':'沒有路徑點',en:'No track points'}
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
    const stamp=Date.now();
    return `<div class="typhoon-widget" data-typhoon-root data-typhoon-version="${VER}">
      <div class="tp-top">
        <span class="tp-dot"></span><b>${t('source')}</b><i>${t('live')}</i>
        <button type="button" data-tp-refresh title="${esc(t('refresh'))}">↻</button>
        <a href="${esc(officialUrl())}" target="_blank" rel="noopener noreferrer">${t('official')}</a>
      </div>
      <section class="tp-hero">
        <div><strong data-tp-title>${t('loading')}</strong><span data-tp-sub>tc_list.xml · HKO</span></div>
      </section>
      <section class="tp-map" data-tp-map>${svgMap([],[])}</section>
      <section class="tp-list" data-tp-list><p>${t('loading')}</p></section>
      <span class="tp-time" data-tp-time>${t('updated')} --</span>
    </div>`;
  }

  function project(lon,lat){
    const minLon=95,maxLon=155,minLat=0,maxLat=40;
    const x=(Number(lon)-minLon)/(maxLon-minLon)*1000;
    const y=(maxLat-Number(lat))/(maxLat-minLat)*600;
    return [Math.max(0,Math.min(1000,x)),Math.max(0,Math.min(600,y))];
  }
  function svgMap(storms){
    const labels=[['HK',114.17,22.32],['TW',121.0,23.8],['PH',122.8,13.5],['JP',139.7,35.7],['CN',113.3,23.1]];
    const grid=[];
    for(let lon=100;lon<=150;lon+=10){const [x]=project(lon,20);grid.push(`<path d="M${x} 0V600"/>`);grid.push(`<text x="${x+4}" y="594">${lon}E</text>`)}
    for(let lat=5;lat<=35;lat+=5){const [,y]=project(120,lat);grid.push(`<path d="M0 ${y}H1000"/>`);grid.push(`<text x="6" y="${y-5}">${lat}N</text>`)}
    const coast=`<path class="tp-coast" d="M260 105L295 145L300 220L338 270L335 345L390 406L455 472L520 520M420 205L470 240L525 270L585 325L655 390M520 140L560 175L600 205M710 80L760 120L790 185L825 230M455 348L490 370L510 405M315 315L350 340L390 365M395 260L430 278"/>`;
    const stormLayers=(storms||[]).map((s,si)=>{
      const pts=(s.points||[]).filter(p=>Number.isFinite(+p.lat)&&Number.isFinite(+p.lon));
      if(!pts.length)return '';
      const coords=pts.map(p=>project(p.lon,p.lat));
      const d=coords.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join('');
      const dots=coords.map((p,i)=>`<circle class="tp-point ${i===coords.length-1?'last':''}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i===coords.length-1?8:4}"/>`).join('');
      const last=coords[coords.length-1];
      return `<g class="tp-storm s${si}"><path class="tp-track" d="${d}"/>${dots}<text class="tp-label" x="${Math.min(945,last[0]+12)}" y="${Math.max(24,last[1]-10)}">${esc(s.name||'TC')}</text></g>`;
    }).join('');
    return `<svg viewBox="0 0 1000 600" role="img" aria-label="Typhoon track map">
      <defs><radialGradient id="tpSea" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="rgba(56,189,248,.16)"/><stop offset="1" stop-color="rgba(15,23,42,.96)"/></radialGradient></defs>
      <rect width="1000" height="600" rx="28" fill="url(#tpSea)"/>
      <g class="tp-grid">${grid.join('')}</g>
      ${coast}
      ${labels.map(([name,lon,lat])=>{const [x,y]=project(lon,lat);return `<g class="tp-city"><circle cx="${x}" cy="${y}" r="4"/><text x="${x+8}" y="${y-8}">${name}</text></g>`}).join('')}
      ${stormLayers||`<text class="tp-empty-map" x="500" y="300" text-anchor="middle">${esc(t('noData'))}</text>`}
    </svg>`;
  }

  function textOf(el,names){
    if(!el)return '';
    const wanted=names.map(x=>x.toLowerCase());
    for(const n of Array.from(el.children||[])){
      const name=(n.localName||n.nodeName||'').toLowerCase();
      if(wanted.some(w=>name===w||name.includes(w)))return (n.textContent||'').trim();
    }
    for(const attr of Array.from(el.attributes||[])){
      const name=attr.name.toLowerCase();
      if(wanted.some(w=>name===w||name.includes(w)))return String(attr.value||'').trim();
    }
    return '';
  }
  function numberFrom(v){const m=String(v||'').match(/-?\d+(?:\.\d+)?/);return m?+m[0]:NaN;}
  function pointFrom(el){
    const lat=numberFrom(textOf(el,['lat','latitude','緯度','纬度']));
    const lon=numberFrom(textOf(el,['lon','lng','longitude','經度','经度']));
    if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;
    return {
      lat,lon,
      time:textOf(el,['time','datetime','obsTime','forecastTime','validtime','date'])||'',
      wind:textOf(el,['wind','maxwind','windspeed','windSpeed'])||'',
      pressure:textOf(el,['pressure','centralPressure','minimumPressure','pres'])||'',
      intensity:textOf(el,['intensity','class','type','category'])||''
    };
  }
  function nameFrom(el){
    return textOf(el,['tcname','name','cname','ename','tropicalcyclonename','cyclonename','stormname'])||'';
  }
  function parseStormsFromXml(xml){
    const doc=new DOMParser().parseFromString(xml,'application/xml');
    if(doc.querySelector('parsererror'))return {storms:[],links:[]};
    const all=Array.from(doc.querySelectorAll('*'));
    const pointNodes=all.filter(n=>pointFrom(n));
    const links=all.map(n=>(n.textContent||'').trim()).filter(v=>/\.xml(?:\?|$)/i.test(v)||/tc_.*\d+/i.test(v)).map(v=>{
      try{return new URL(v,XML_URL).href;}catch(e){return ''}
    }).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
    if(!pointNodes.length)return {storms:[],links};

    const stormMap=new Map();
    pointNodes.forEach((node,idx)=>{
      let p=pointFrom(node);if(!p)return;
      let parent=node.parentElement,root=node;
      while(parent&&parent!==doc.documentElement){
        const lname=(parent.localName||'').toLowerCase();
        if(/cyclone|typhoon|storm|tc|tropical/.test(lname)){root=parent;break;}
        parent=parent.parentElement;
      }
      const name=nameFrom(root)||nameFrom(node.parentElement)||nameFrom(doc.documentElement)||'TC';
      const key=name+'-'+(textOf(root,['tcid','id','identifier'])||0);
      if(!stormMap.has(key))stormMap.set(key,{name,points:[]});
      stormMap.get(key).points.push(p);
    });
    const storms=Array.from(stormMap.values()).map(s=>{
      s.points=s.points.filter((p,i,a)=>a.findIndex(x=>x.lat===p.lat&&x.lon===p.lon&&x.time===p.time)===i);
      return s;
    }).filter(s=>s.points.length);
    return {storms,links};
  }
  async function fetchText(url){
    const res=await fetch(url+(url.includes('?')?'&':'?')+'_='+(Date.now()),{cache:'no-store'});
    if(!res.ok)throw new Error('HTTP '+res.status);
    return await res.text();
  }
  async function load(root){
    const title=root.querySelector('[data-tp-title]'),sub=root.querySelector('[data-tp-sub]'),map=root.querySelector('[data-tp-map]'),list=root.querySelector('[data-tp-list]'),time=root.querySelector('[data-tp-time]');
    if(title)title.textContent=t('loading');
    try{
      let first=await fetchText(XML_URL);
      let parsed=parseStormsFromXml(first);
      let storms=parsed.storms;
      if(!storms.length&&parsed.links.length){
        const extras=await Promise.allSettled(parsed.links.map(fetchText));
        storms=extras.flatMap(r=>r.status==='fulfilled'?parseStormsFromXml(r.value).storms:[]);
      }
      renderData(root,storms,null);
    }catch(error){
      renderData(root,[],error);
    }
  }
  function renderData(root,storms,error){
    const title=root.querySelector('[data-tp-title]'),sub=root.querySelector('[data-tp-sub]'),map=root.querySelector('[data-tp-map]'),list=root.querySelector('[data-tp-list]'),time=root.querySelector('[data-tp-time]');
    if(map)map.innerHTML=svgMap(storms||[]);
    if(time)time.textContent=t('updated')+' '+new Intl.DateTimeFormat(undefined,{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date());
    if(error){
      if(title)title.textContent=t('blocked');
      if(sub)sub.textContent='tc_list.xml · '+String(error.message||error);
      if(list)list.innerHTML=`<p>${esc(t('blocked'))}</p><a class="tp-open" target="_blank" rel="noopener noreferrer" href="${esc(officialUrl())}">${esc(t('official'))}</a>`;
      return;
    }
    if(!storms||!storms.length){
      if(title)title.textContent=t('none');
      if(sub)sub.textContent='tc_list.xml · HKO';
      if(list)list.innerHTML=`<p>${esc(t('none'))}</p>`;
      return;
    }
    const latest=storms.map(s=>Object.assign({},s,{last:s.points[s.points.length-1]}));
    if(title)title.textContent=latest.map(s=>s.name).join(' / ');
    if(sub)sub.textContent=latest.map(s=>`${Number(s.last.lat).toFixed(1)}N ${Number(s.last.lon).toFixed(1)}E`).join(' · ');
    if(list)list.innerHTML=latest.map(s=>`<article class="tp-storm-card"><b>${esc(s.name||'TC')}</b><span>${esc(t('latlon'))}: ${Number(s.last.lat).toFixed(1)}N ${Number(s.last.lon).toFixed(1)}E</span>${s.last.wind?`<span>${esc(t('wind'))}: ${esc(s.last.wind)}</span>`:''}${s.last.pressure?`<span>${esc(t('pressure'))}: ${esc(s.last.pressure)}</span>`:''}${s.last.time?`<em>${esc(s.last.time)}</em>`:''}</article>`).join('');
  }

  function installStyle(){
    if(document.getElementById('typhoonWidgetStyle'))return;
    const s=document.createElement('style');s.id='typhoonWidgetStyle';s.textContent=`
.t-typhoon{--icon:linear-gradient(145deg,#38bdf8,#0ea5e9);--glow:linear-gradient(135deg,#38bdf8,#0ea5e9)}
.typhoon-widget{height:100%;container-type:inline-size;display:flex;flex-direction:column;gap:8px;overflow:hidden;color:var(--wd-widget-ink,var(--ink));font-variant-numeric:tabular-nums}.typhoon-widget *{box-sizing:border-box}.tp-top{height:30px;display:flex;align-items:center;gap:7px}.tp-dot{width:9px;height:9px;border-radius:999px;background:#22c55e;box-shadow:0 0 12px rgba(34,197,94,.75)}.tp-top b{font-size:11px}.tp-top i{font-style:normal;font-size:10px;border:1px solid var(--wd-widget-line,var(--line));border-radius:999px;padding:3px 7px;background:var(--wd-widget-control,rgba(255,255,255,.07));color:var(--wd-widget-muted,var(--muted))}.tp-top button,.tp-top a{margin-left:auto;width:30px;height:30px;border:1px solid var(--wd-widget-line,var(--line));border-radius:999px;background:var(--wd-widget-control,rgba(255,255,255,.08));color:var(--wd-widget-ink,var(--ink));display:grid;place-items:center;text-decoration:none;font-weight:900;cursor:pointer}.tp-top a{width:auto;padding:0 10px;font-size:11px}.tp-top button+a{margin-left:0}.tp-hero{padding:10px 12px;border:1px solid var(--wd-widget-line,var(--line));border-radius:15px;background:linear-gradient(135deg,rgba(14,165,233,.18),rgba(45,212,191,.08),var(--wd-widget-surface-3,rgba(255,255,255,.04)))}.tp-hero strong{display:block;font-size:14px;line-height:1.2}.tp-hero span{display:block;margin-top:3px;color:var(--wd-widget-muted,var(--muted));font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tp-map{flex:1;min-height:140px;border:1px solid var(--wd-widget-line,var(--line));border-radius:16px;overflow:hidden;background:#07111f}.tp-map svg{width:100%;height:100%;display:block}.tp-grid path{stroke:rgba(148,163,184,.18);stroke-width:1}.tp-grid text{fill:rgba(148,163,184,.6);font-size:16px}.tp-coast{fill:none;stroke:rgba(203,213,225,.38);stroke-width:6;stroke-linecap:round;stroke-linejoin:round}.tp-city circle{fill:#f8fafc}.tp-city text{fill:#cbd5e1;font-size:17px;font-weight:800}.tp-track{fill:none;stroke:#f97316;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 8px rgba(249,115,22,.55))}.tp-point{fill:#fde68a;stroke:#7c2d12;stroke-width:2}.tp-point.last{fill:#fb7185;stroke:#fff;stroke-width:3}.tp-label{fill:#fff;font-size:22px;font-weight:950;text-shadow:0 2px 8px rgba(0,0,0,.7)}.tp-empty-map{fill:rgba(226,232,240,.65);font-size:25px;font-weight:850}.tp-list{max-height:88px;overflow:auto;display:grid;gap:6px}.tp-list p{margin:0;padding:8px 10px;border:1px solid var(--wd-widget-line,var(--line));border-radius:12px;color:var(--wd-widget-muted,var(--muted));font-size:11px;background:var(--wd-widget-surface-2,rgba(255,255,255,.04))}.tp-open{display:inline-flex;align-items:center;justify-content:center;height:28px;border-radius:999px;background:rgba(56,189,248,.15);color:#38bdf8;text-decoration:none;font-size:11px;font-weight:900}.tp-storm-card{display:grid;gap:2px;padding:7px 9px;border:1px solid var(--wd-widget-line,var(--line));border-radius:12px;background:var(--wd-widget-surface-2,rgba(255,255,255,.05))}.tp-storm-card b{font-size:12px}.tp-storm-card span,.tp-storm-card em{font-size:10px;color:var(--wd-widget-muted,var(--muted));font-style:normal}.tp-time{font-size:10px;color:var(--wd-widget-muted,var(--muted));text-align:right}@container (max-width:330px){.tp-top a{display:none}.tp-hero{padding:8px}.tp-list{display:none}.tp-map{min-height:120px}.tp-time{text-align:left}}@container (max-height:360px){.tp-list,.tp-time{display:none}.tp-hero{padding:7px 9px}.tp-map{min-height:110px}}
`;
    document.head.appendChild(s);
  }

  function bind(root){
    if(!root||root.dataset.tpBound)return;
    root.dataset.tpBound='1';
    root.querySelector('[data-tp-refresh]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();root.dataset.tpBound='';bind(root);load(root);});
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
        ws.cards.push({id:'card-typhoon-'+Date.now(),appId:APP,x:88+(n%4)*38,y:90+(n%5)*30,w:560,h:470,collapsed:false,data:{}});
        save();renderAll();
      };
    }
    if(typeof renderShelf==='function'&&!window.__windzxyTyphoonShelfPatched){
      window.__windzxyTyphoonShelfPatched=1;
      const old=renderShelf;renderShelf=function(){ensureMeta();return old.apply(this,arguments);};
    }
    if(typeof renderAll==='function'&&!window.__windzxyTyphoonRenderAllPatched){
      window.__windzxyTyphoonRenderAllPatched=1;
      const old=renderAll;renderAll=function(){ensureMeta();const out=old.apply(this,arguments);setTimeout(bindAll,0);return out;};
    }
    if(typeof renderDesktop==='function'&&!window.__windzxyTyphoonRenderDesktopPatched){
      window.__windzxyTyphoonRenderDesktopPatched=1;
      const old=renderDesktop;renderDesktop=function(){ensureMeta();const out=old.apply(this,arguments);setTimeout(bindAll,0);return out;};
    }
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
