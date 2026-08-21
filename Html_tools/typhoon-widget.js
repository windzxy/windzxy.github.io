(function(){
  if(window.__windzxyTyphoonWidgetLoaded)return;
  window.__windzxyTyphoonWidgetLoaded=1;

  const APP='typhoon';
  const VER='20260821-typhoon-widget3-map-first-pm';
  const DATA_URL='data/typhoon.json';
  const OFFICIAL_URL={
    'zh-CN':'https://www.hko.gov.hk/sc/wxinfo/currwx/tc_gis.htm',
    'zh-HK':'https://www.hko.gov.hk/tc/wxinfo/currwx/tc_gis.htm',
    en:'https://www.hko.gov.hk/en/wxinfo/currwx/tc_gis.htm'
  };
  const META={
    title:{'zh-CN':'台风路径','zh-HK':'颱風路徑',en:'Typhoon track'},
    desc:{'zh-CN':'官方快照、地图路径、实况与预测。','zh-HK':'官方快照、地圖路徑、實況與預測。',en:'Official snapshot, map track, observations and forecast.'}
  };
  const TEXT={
    live:{'zh-CN':'官方快照','zh-HK':'官方快照',en:'Official'},
    source:{'zh-CN':'HKO','zh-HK':'HKO',en:'HKO'},
    refresh:{'zh-CN':'刷新','zh-HK':'刷新',en:'Refresh'},
    official:{'zh-CN':'官方地图','zh-HK':'官方地圖',en:'Official map'},
    noActive:{'zh-CN':'暂无活跃热带气旋','zh-HK':'暫無活躍熱帶氣旋',en:'No active tropical cyclone'},
    calm:{'zh-CN':'西北太平洋目前没有可展示路径。','zh-HK':'西北太平洋目前沒有可展示路徑。',en:'No track to display in the NW Pacific now.'},
    latest:{'zh-CN':'最新位置','zh-HK':'最新位置',en:'Latest position'},
    track:{'zh-CN':'路径','zh-HK':'路徑',en:'Track'},
    forecast:{'zh-CN':'预报','zh-HK':'預報',en:'Forecast'},
    obs:{'zh-CN':'实况','zh-HK':'實況',en:'Observed'},
    wind:{'zh-CN':'风速','zh-HK':'風速',en:'Wind'},
    pressure:{'zh-CN':'气压','zh-HK':'氣壓',en:'Pressure'},
    points:{'zh-CN':'路径点','zh-HK':'路徑點',en:'points'},
    updated:{'zh-CN':'更新','zh-HK':'更新',en:'Updated'},
    dataPending:{'zh-CN':'等待后台同步官方资料','zh-HK':'等待後台同步官方資料',en:'Waiting for official snapshot sync'},
    layerRadar:{'zh-CN':'雷达','zh-HK':'雷達',en:'Radar'},
    layerCloud:{'zh-CN':'云图','zh-HK':'雲圖',en:'Cloud'},
    layerWind:{'zh-CN':'风场','zh-HK':'風場',en:'Wind'},
    layerWave:{'zh-CN':'浪场','zh-HK':'浪場',en:'Wave'}
  };
  let patched=false;

  function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';if(/^en/i.test(v))return 'en';return 'zh-HK';}
  function t(k){return TEXT[k]?.[lang()]||TEXT[k]?.['zh-HK']||k;}
  function title(){return META.title[lang()]||META.title['zh-HK'];}
  function desc(){return META.desc[lang()]||META.desc['zh-HK'];}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function officialUrl(){return OFFICIAL_URL[lang()]||OFFICIAL_URL['zh-HK'];}
  function fmtTime(v){try{if(!v)return '--';return new Intl.DateTimeFormat(undefined,{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(v));}catch(e){return String(v||'--');}}
  function isForecastPoint(p,i,total){return !!(p.forecast||p.type==='forecast'||p.fcst||p.isForecast||i>Math.max(0,total-4));}

  function ensureMeta(){try{if(!Array.isArray(apps))return;let a=apps.find(x=>x.id===APP);if(!a){a={id:APP,kind:'widget',title:title(),desc:desc(),icon:'🌀',tone:'t-typhoon'};const idx=apps.findIndex(x=>x.id==='weather');idx>=0?apps.splice(idx,0,a):apps.push(a);}else{a.kind='widget';a.title=title();a.desc=desc();a.icon='🌀';a.tone='t-typhoon';}}catch(e){}}

  function body(){return `<div class="typhoon-widget tpv3" data-typhoon-root data-typhoon-version="${VER}">
    <div class="tpv3-mapwrap" data-tpv3-map>${svgMap([])}</div>
    <div class="tpv3-topbar"><div class="tpv3-brand"><span></span><b>${t('source')}</b><i>${t('live')}</i></div><div class="tpv3-actions"><button type="button" data-tp-refresh title="${esc(t('refresh'))}">↻</button><a href="${esc(officialUrl())}" target="_blank" rel="noopener noreferrer">${t('official')}</a></div></div>
    <div class="tpv3-chips" data-tpv3-chips><button class="empty"><em>🌀</em><strong>${t('dataPending')}</strong></button></div>
    <div class="tpv3-tools" aria-hidden="true"><button>${t('layerRadar')}</button><button>${t('layerCloud')}</button><button>${t('layerWind')}</button><button>${t('layerWave')}</button></div>
    <div class="tpv3-bottom"><div data-tpv3-summary>${t('dataPending')}</div><small data-tpv3-time>${t('updated')} --</small></div>
  </div>`;}

  function project(lon,lat){const minLon=96,maxLon=150,minLat=4,maxLat=35;const x=(+lon-minLon)/(maxLon-minLon)*1000;const y=(maxLat-+lat)/(maxLat-minLat)*620;return [Math.max(0,Math.min(1000,x)),Math.max(0,Math.min(620,y))];}
  function linePath(coords){return coords.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join('');}
  function pointLabel(p){if(p.time){const m=String(p.time).match(/(\d{1,2})[^\d]?(\d{1,2})?\s*(?:時|时|:)?(\d{0,2})?/);if(m)return m[1]+(m[2]?'/'+m[2]:'');}return '';}
  function svgMap(storms){
    const labels=[['香港',114.17,22.32],['海口',110.33,20.03],['三亞',109.51,18.25],['台北',121.56,25.03],['馬尼拉',120.98,14.60],['東京',139.69,35.68],['廣州',113.26,23.13],['南寧',108.37,22.82]];
    const grid=[];for(let lon=100;lon<=150;lon+=10){const [x]=project(lon,18);grid.push(`<path d="M${x} 0V620"/><text x="${x+5}" y="608">${lon}E</text>`)}for(let lat=5;lat<=35;lat+=5){const [,y]=project(120,lat);grid.push(`<path d="M0 ${y}H1000"/><text x="8" y="${y-6}">${lat}N</text>`)}
    const land=`<path class="tpv3-land" d="M0 0H1000V205c-48-16-92-22-144-22-68 0-116 30-178 28-70-3-99-46-160-76-77-37-148-3-210 35-59 37-116 66-189 62C73 230 39 215 0 196V0Z"/><path class="tpv3-land island" d="M225 315c54-42 96-41 128-11 35 33 19 81-22 111-48 35-113 35-145 5-32-30-13-65 39-105Z"/><path class="tpv3-land island" d="M456 220c36-20 76-6 90 27 14 34-7 73-46 87-41 14-78-7-88-40-9-30 8-59 44-74Z"/><path class="tpv3-land island" d="M521 356c30-30 73-24 94 9 21 34 6 79-32 100-39 21-82 7-99-28-14-30 5-56 37-81Z"/>`;
    const coast=`<path class="tpv3-coast" d="M122 222c58 11 99-4 149-33 56-33 113-77 183-65 65 12 115 55 166 84 63 36 120 7 184-12 55-16 108-10 165 11M202 338c58-50 108-52 147-16M467 243c34-15 58 6 66 33M529 380c38-27 76-13 90 22"/>`;
    const stormLayers=(storms||[]).map((s,si)=>{
      const pts=(s.points||[]).filter(p=>Number.isFinite(+p.lat)&&Number.isFinite(+p.lon));if(!pts.length)return '';
      const obs=[],fc=[];pts.forEach((p,i)=>{(isForecastPoint(p,i,pts.length)?fc:obs).push([p,i]);});
      const obsCoords=obs.map(([p])=>project(p.lon,p.lat));
      const fcSource=(obs.length&&fc.length?[obs[obs.length-1],...fc]:fc).map(([p])=>project(p.lon,p.lat));
      const dots=pts.map((p,i)=>{const [x,y]=project(p.lon,p.lat);const fcst=isForecastPoint(p,i,pts.length);const lab=pointLabel(p);return `<g class="tpv3-dot ${fcst?'future':'past'} ${i===pts.length-1?'last':''}"><circle cx="${x}" cy="${y}" r="${i===pts.length-1?9:5}"/><text x="${x+9}" y="${y-8}">${esc(lab)}</text></g>`}).join('');
      const last=project(pts[pts.length-1].lon,pts[pts.length-1].lat);
      return `<g class="storm-${si}">${obsCoords.length>1?`<path class="tpv3-track past" d="${linePath(obsCoords)}"/>`:''}${fcSource.length>1?`<path class="tpv3-track future" d="${linePath(fcSource)}"/>`:''}${dots}<g class="tpv3-eye" transform="translate(${last[0]} ${last[1]})"><circle r="18"/><text y="6">🌀</text></g><text class="tpv3-name" x="${Math.min(910,last[0]+26)}" y="${Math.max(30,last[1]-20)}">${esc(s.name||'TC')}</text></g>`;
    }).join('');
    return `<svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sea" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fd0f4"/><stop offset="1" stop-color="#5ca8e8"/></linearGradient><filter id="soft"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0f172a" flood-opacity=".28"/></filter></defs><rect width="1000" height="620" fill="url(#sea)"/><g class="tpv3-grid">${grid.join('')}</g>${land}${coast}${labels.map(([n,lon,lat])=>{const [x,y]=project(lon,lat);return `<g class="tpv3-city"><circle cx="${x}" cy="${y}" r="4"/><text x="${x+8}" y="${y-8}">${n}</text></g>`}).join('')}${stormLayers||`<g class="tpv3-empty"><text x="500" y="292" text-anchor="middle">${esc(t('noActive'))}</text><text x="500" y="326" text-anchor="middle">${esc(t('calm'))}</text></g>`}</svg>`;
  }

  async function load(root){
    try{const res=await fetch(DATA_URL+'?_='+(Date.now()),{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);render(root,await res.json(),null);}catch(e){render(root,{storms:[],updatedAt:null,status:'pending'},e);}
  }
  function latest(storm){const pts=storm.points||[];return pts[pts.length-1]||{};}
  function chip(storm,i){const p=latest(storm);return `<button class="${i===0?'on':''}" type="button"><em>🌀</em><strong>${esc(storm.name||'TC')}</strong><span>${Number.isFinite(+p.lat)?(+p.lat).toFixed(1)+'N':''} ${Number.isFinite(+p.lon)?(+p.lon).toFixed(1)+'E':''}</span></button>`;}
  function render(root,data,error){
    const storms=Array.isArray(data?.storms)?data.storms:[];
    const map=root.querySelector('[data-tpv3-map]'),chips=root.querySelector('[data-tpv3-chips]'),summary=root.querySelector('[data-tpv3-summary]'),time=root.querySelector('[data-tpv3-time]');
    if(map)map.innerHTML=svgMap(storms);
    if(chips)chips.innerHTML=storms.length?storms.map(chip).join(''):`<button class="empty"><em>🌀</em><strong>${t('noActive')}</strong><span>${error?String(error.message||error):t('calm')}</span></button>`;
    if(summary){
      if(storms.length){const s=storms[0],p=latest(s);summary.innerHTML=`<b>${esc(s.name||'TC')}</b><span>${t('latest')}: ${Number.isFinite(+p.lat)?(+p.lat).toFixed(1)+'N':''} ${Number.isFinite(+p.lon)?(+p.lon).toFixed(1)+'E':''}</span><span>${t('track')} ${(s.points||[]).length} ${t('points')}</span>`;}
      else summary.textContent=error?t('dataPending'):t('calm');
    }
    if(time)time.textContent=t('updated')+' '+fmtTime(data?.sourceUpdatedAt||data?.updatedAt||new Date());
  }

  function installStyle(){if(document.getElementById('typhoonWidgetStyleV3'))return;const s=document.createElement('style');s.id='typhoonWidgetStyleV3';s.textContent=`
.t-typhoon{--icon:linear-gradient(145deg,#38bdf8,#0ea5e9);--glow:linear-gradient(135deg,#38bdf8,#0ea5e9)}
.typhoon-widget.tpv3{height:100%;container-type:inline-size;position:relative;overflow:hidden;border-radius:18px;background:#75bdf1;color:#0f172a;isolation:isolate}.tpv3 *{box-sizing:border-box}.tpv3-mapwrap{position:absolute;inset:0;background:#80c4f4}.tpv3-mapwrap svg{width:100%;height:100%;display:block}.tpv3::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,23,42,.18),rgba(15,23,42,0) 36%,rgba(15,23,42,.18));pointer-events:none}.tpv3-topbar{position:absolute;z-index:3;left:14px;right:14px;top:12px;display:flex;align-items:center;justify-content:space-between;gap:10px}.tpv3-brand,.tpv3-actions{display:flex;align-items:center;gap:7px}.tpv3-brand span{width:10px;height:10px;border-radius:999px;background:#22c55e;box-shadow:0 0 14px rgba(34,197,94,.8)}.tpv3-brand b,.tpv3-brand i,.tpv3-actions button,.tpv3-actions a{height:32px;border:1px solid rgba(255,255,255,.44);background:rgba(15,23,42,.45);backdrop-filter:blur(12px);color:#fff;border-radius:999px;display:grid;place-items:center;text-decoration:none;font-weight:900;box-shadow:0 8px 24px rgba(15,23,42,.2)}.tpv3-brand b{padding:0 10px;font-size:12px}.tpv3-brand i{font-style:normal;padding:0 10px;font-size:11px;color:#dbeafe}.tpv3-actions button{width:34px;cursor:pointer}.tpv3-actions a{padding:0 12px;font-size:12px}.tpv3-chips{position:absolute;z-index:3;top:56px;left:14px;display:grid;gap:8px;max-width:min(310px,52%)}.tpv3-chips button{border:0;border-radius:18px;padding:10px 14px 10px 12px;background:linear-gradient(135deg,rgba(34,197,94,.92),rgba(56,189,248,.88));color:#fff;display:grid;grid-template-columns:auto 1fr;gap:1px 9px;text-align:left;box-shadow:0 12px 32px rgba(15,23,42,.24);font-weight:950}.tpv3-chips em{grid-row:1/span 2;font-style:normal;font-size:24px;line-height:1}.tpv3-chips strong{font-size:15px;line-height:1.08}.tpv3-chips span{font-size:10px;opacity:.88}.tpv3-chips .empty{background:rgba(15,23,42,.48);backdrop-filter:blur(12px)}.tpv3-tools{position:absolute;z-index:3;right:14px;top:62px;display:grid;gap:8px}.tpv3-tools button{width:48px;min-height:38px;border:1px solid rgba(255,255,255,.45);border-radius:14px;background:rgba(255,255,255,.82);color:#334155;font-size:11px;font-weight:900;box-shadow:0 8px 24px rgba(15,23,42,.18)}.tpv3-bottom{position:absolute;z-index:3;left:14px;right:14px;bottom:12px;display:flex;align-items:end;justify-content:space-between;gap:12px}.tpv3-bottom>div{display:flex;align-items:center;gap:10px;min-height:38px;padding:8px 12px;border-radius:16px;background:rgba(15,23,42,.54);backdrop-filter:blur(14px);color:#fff;box-shadow:0 10px 30px rgba(15,23,42,.2);font-size:12px;max-width:70%;overflow:hidden}.tpv3-bottom b{font-size:13px}.tpv3-bottom span{white-space:nowrap;color:#dbeafe}.tpv3-bottom small{padding:8px 10px;border-radius:999px;background:rgba(15,23,42,.46);backdrop-filter:blur(12px);color:#e2e8f0;white-space:nowrap}.tpv3-grid path{stroke:rgba(255,255,255,.32);stroke-width:1}.tpv3-grid text{fill:rgba(15,23,42,.45);font-size:15px}.tpv3-land{fill:#f7f1df;stroke:#e0c99e;stroke-width:2}.tpv3-land.island{fill:#f3ead3}.tpv3-coast{fill:none;stroke:#d79055;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;opacity:.75}.tpv3-city circle{fill:#ef4444;stroke:#fff;stroke-width:2}.tpv3-city text{fill:#334155;font-size:18px;font-weight:900;paint-order:stroke;stroke:#fff;stroke-width:3px}.tpv3-track{fill:none;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 4px 10px rgba(15,23,42,.32))}.tpv3-track.past{stroke:#38bdf8}.tpv3-track.future{stroke:#ff5f7a;stroke-dasharray:18 18}.tpv3-dot circle{fill:#38bdf8;stroke:#0f172a;stroke-width:3}.tpv3-dot.future circle{fill:#7cf59a}.tpv3-dot.last circle{fill:#22c55e;stroke:#fff;stroke-width:4}.tpv3-dot text{fill:#0f172a;font-size:19px;font-weight:950;paint-order:stroke;stroke:#fff;stroke-width:4px}.tpv3-eye circle{fill:#22c55e;stroke:#fff;stroke-width:5;filter:url(#soft)}.tpv3-eye text{font-size:22px;text-anchor:middle}.tpv3-name{fill:#0f172a;font-size:24px;font-weight:950;paint-order:stroke;stroke:#fff;stroke-width:5px}.tpv3-empty text:first-child{font-size:28px;font-weight:950;fill:#0f172a;paint-order:stroke;stroke:#fff;stroke-width:6px}.tpv3-empty text:last-child{font-size:18px;font-weight:800;fill:#475569;paint-order:stroke;stroke:#fff;stroke-width:5px}@container (max-width:420px){.tpv3-tools{display:none}.tpv3-chips{right:14px;max-width:none}.tpv3-brand i,.tpv3-actions a{display:none}.tpv3-bottom>div{max-width:none;width:100%;font-size:11px}.tpv3-bottom small{display:none}}@container (max-height:350px){.tpv3-chips{display:none}.tpv3-tools{display:none}.tpv3-topbar{top:8px}.tpv3-bottom{bottom:8px}.tpv3-bottom>div{min-height:30px;padding:6px 9px}}
`;document.head.appendChild(s);}

  function bind(root){if(!root||root.dataset.tpBound)return;root.dataset.tpBound='1';root.querySelector('[data-tp-refresh]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();load(root);});load(root);}
  function bindAll(){document.querySelectorAll('[data-typhoon-root]').forEach(bind);}
  function patch(){if(patched)return;patched=true;installStyle();ensureMeta();if(typeof bodyHtml==='function'&&!window.__windzxyTyphoonBodyPatched){window.__windzxyTyphoonBodyPatched=1;const old=bodyHtml;bodyHtml=function(card,info){return card&&card.appId===APP?body(card):old(card,info);};}if(typeof addCard==='function'&&!window.__windzxyTyphoonAddPatched){window.__windzxyTyphoonAddPatched=1;const old=addCard;addCard=function(appId){if(appId!==APP)return old.apply(this,arguments);const ws=activeWorkspace(),n=ws.cards.length;ws.cards.push({id:'card-typhoon-'+Date.now(),appId:APP,x:90+(n%4)*36,y:92+(n%5)*28,w:620,h:520,collapsed:false,data:{}});save();renderAll();};}if(typeof renderShelf==='function'&&!window.__windzxyTyphoonShelfPatched){window.__windzxyTyphoonShelfPatched=1;const old=renderShelf;renderShelf=function(){ensureMeta();return old.apply(this,arguments);};}if(typeof renderAll==='function'&&!window.__windzxyTyphoonRenderAllPatched){window.__windzxyTyphoonRenderAllPatched=1;const old=renderAll;renderAll=function(){ensureMeta();const out=old.apply(this,arguments);setTimeout(bindAll,0);return out;};}if(typeof renderDesktop==='function'&&!window.__windzxyTyphoonRenderDesktopPatched){window.__windzxyTyphoonRenderDesktopPatched=1;const old=renderDesktop;renderDesktop=function(){ensureMeta();const out=old.apply(this,arguments);setTimeout(bindAll,0);return out;};}try{renderShelf();renderAll();}catch(e){try{renderShelf();}catch(_){}}setTimeout(bindAll,0);}
  function boot(){if(typeof apps==='undefined'||typeof bodyHtml==='undefined'||typeof renderAll==='undefined'){setTimeout(boot,80);return;}patch();document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select'))setTimeout(()=>{ensureMeta();try{renderAll();}catch(_){bindAll();}},80);},true);window.windzxyTyphoonWidgetVersion=VER;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
