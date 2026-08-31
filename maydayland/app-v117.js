(() => {
  'use strict';
  const VERSION = '117.0.0';
  const DATA_URL = './data/product-v115.json?v=117.0.0';
  const EVIDENCE_URL = './data/city-evidence-v94.json?v=117.0.0';
  const ATLAS_URL = './atlas-v102.html?v=117.0.0';
  const $ = (s,r=document)=>r.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fallback = {version:VERSION,cities:[],tours:[],albums:[],songCollections:[],books:[],timeline:[]};
  const state = {data:fallback,evidence:{cities:{}},page:'home',tour:'all',city:'taipei',atlasMode:'shader',atlasProfile:'full',atlasReady:false};
  document.addEventListener('DOMContentLoaded', init);
  async function init(){
    const [product,evidence] = await Promise.allSettled([
      fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(r.status)),
      fetch(EVIDENCE_URL,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(r.status))
    ]);
    if(product.status==='fulfilled') state.data=product.value; else console.warn('Maydayland v117 product fallback',product.reason);
    if(evidence.status==='fulfilled') state.evidence=evidence.value; else console.warn('Maydayland v117 evidence fallback',evidence.reason);
    state.city = state.data.cities?.[0]?.id || 'taipei';
    const reduced=matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    const save=!!conn?.saveData, slow=/2g/.test(conn?.effectiveType||''), mem=Number(navigator.deviceMemory||8), cores=Number(navigator.hardwareConcurrency||8);
    state.atlasProfile=(reduced||save||slow||mem<=2||cores<=2)?'eco':(mem<=4||cores<=4?'balanced':'full');
    state.atlasMode=(reduced||save||slow||mem<=2||cores<=2)?'lite':'shader';
    readHash(); render();
    addEventListener('hashchange',()=>{readHash(); render();});
    addEventListener('message',onAtlasMessage);
  }
  function readHash(){const parts=location.hash.replace(/^#/,'').split('/').filter(Boolean);state.page=parts[0]||'home'; if(parts[1]) state.city=parts[1];}
  function city(id){return state.data.cities.find(c=>c.id===id)||state.data.cities[0]||{};}
  function evidence(id){return state.evidence?.cities?.[id]||null;}
  function toursForCity(id){return state.data.tours.filter(t=>(t.route||[]).includes(id));}
  function activeTours(){return state.tour==='all'?state.data.tours:state.data.tours.filter(t=>t.id===state.tour);}
  function pathFor(route){const pts=route.map(id=>city(id)).filter(c=>c.id); if(pts.length<2)return ''; return pts.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' ');}
  function onAtlasMessage(e){if(e.origin!==location.origin)return;const m=e.data||{};if(!/^maydayland:atlas-/.test(m.type||''))return;if(m.type==='maydayland:atlas-ready'||m.type==='maydayland:atlas-profile-ack'||m.type==='maydayland:atlas-state'){state.atlasReady=true;document.documentElement.dataset.v117Atlas=m.certification||'ready';const badge=$('[data-atlas-status]');if(badge)badge.textContent=`ATLAS ${String(m.certification||'READY').toUpperCase()} · ${String(m.profile||state.atlasProfile).toUpperCase()}`;}}
  function sendAtlasProfile(){const f=$('.atlas-frame');if(!f?.contentWindow)return;try{f.contentWindow.postMessage({type:'maydayland:atlas-profile',profile:state.atlasProfile,reason:'v117-shell-adaptive',source:'maydayland-v117'},location.origin);f.contentWindow.postMessage({type:'maydayland:atlas-state-request'},location.origin)}catch{}}
  function render(){
    const root=$('#app'); if(!root)return;
    root.innerHTML = `<div class="shell">
      <header class="top">
        <a class="brand" href="#home"><img src="./mayday-logo.svg?v=117" alt="Maydayland"><span><b>MAYDAYLAND</b><small>PRODUCT SHELL · v117</small></span></a>
        <nav class="tabs">${tab('home','A 巡演地圖')}${tab('city','B 城市專題')}${tab('album','C 專輯室')}${tab('songs','D 歌曲宇宙')}${tab('books','E 書籍出版')}${tab('timeline','F 歷程檔案')}</nav>
        <div class="status"><span data-atlas-status>${state.page==='home'&&state.atlasMode==='shader'?'ATLAS CONNECTING':'HOME-ONLY ATLAS'}</span><b>${state.page==='home'?(state.atlasMode==='shader'?'SHADER LIVE':'LITE MODE'):'WEBGL UNMOUNTED'}</b></div>
      </header>
      ${hero()}
      ${page()}
      <footer class="footer">v117 把已核實的 City Evidence Registry 接入 production City Dossier：場館、日期、來源與 scoped historical record 分開呈現；VISITS 仍明確標記為 editorial archive model。Shader Atlas 與 A–F shell 保持 v116 lifecycle。</footer>
    </div>`;
    bind();
  }
  function tab(id,label){return `<button class="${state.page===id?'active':''}" data-nav="${id}">${esc(label)}</button>`}
  function hero(){return `<section class="hero"><article class="card hero-main"><span class="kicker">APPROVED PRODUCT DIRECTION · EVIDENCE-NATIVE CITY DOSSIER</span><h1>巡演一種顏色，城市一個故事。</h1><p>首頁維持 adaptive Shader Atlas；城市頁現在直接讀取 verified evidence registry，把「產品敘事」和「已核實場館／日期／來源」清楚分層，不再讓編輯模型看起來像官方歷史總數。</p></article><aside class="card hero-side"><div class="metric"><small>Release</small><b>v117</b><small>evidence-native city dossier</small></div><div class="metric"><small>Atlas</small><b>${state.atlasMode==='shader'?'Shader':'Lite'}</b><small>${state.atlasProfile.toUpperCase()} performance profile</small></div><div class="metric"><small>Evidence</small><b>${Object.keys(state.evidence?.cities||{}).length}</b><small>city records loaded</small></div></aside></section>`}
  function page(){return ({home:homePage,city:cityPage,album:albumPage,songs:songsPage,books:booksPage,timeline:timelinePage}[state.page]||homePage)();}
  function homePage(){return `<main class="board"><aside class="card side"><h2>Tour Filters</h2><div class="tourbar"><button class="tour ${state.tour==='all'?'active':''}" data-tour="all" style="--tour:#58e6ff"><i></i><span><b>顯示所有巡演</b><small>多色路線疊加</small></span></button>${state.data.tours.map(t=>`<button class="tour ${state.tour===t.id?'active':''}" data-tour="${esc(t.id)}" style="--tour:${esc(t.color)}"><i></i><span><b>${esc(t.name)}</b><small>${esc(t.years)}</small></span></button>`).join('')}</div><div class="atlas-switch"><small>MAP ENGINE</small><div><button class="${state.atlasMode==='shader'?'active':''}" data-atlas-mode="shader">Shader Atlas</button><button class="${state.atlasMode==='lite'?'active':''}" data-atlas-mode="lite">Lite SVG</button></div><p>${state.atlasMode==='shader'?`Certified v111 runtime · ${state.atlasProfile.toUpperCase()} profile`:'Low-power / Reduced Motion fallback'}</p></div></aside><section class="card stage"><div class="map-wrap">${state.atlasMode==='shader'?atlasFrame():mapSvg()}<div class="map-overlay"><div class="legend">${activeTours().map(t=>`<span style="border-color:${esc(t.color)};color:${esc(t.color)}">${esc(t.name)}</span>`).join('')}</div><div class="mode"><button class="${state.tour==='all'?'active':''}" data-tour="all">全部巡演</button><button data-nav="city/${esc(state.city)}">查看城市專題</button></div></div></div></section><aside class="card info"><div class="info-panel">${cityInfo(city(state.city))}</div></aside></main>${sectionsPreview()}`}
  function atlasFrame(){return `<iframe class="atlas-frame" src="${ATLAS_URL}" title="Maydayland Shader Tour Atlas" loading="eager" referrerpolicy="same-origin" allow="fullscreen"></iframe>`}
  function mapSvg(){const routes = state.data.tours.map(t=>{const active=state.tour==='all'||state.tour===t.id;return `<path class="route ${active?'focus':'dim'}" style="--route:${esc(t.color)}" d="${esc(pathFor(t.route))}"/>`;}).join('');const nodes=state.data.cities.map(c=>`<g class="node" data-city="${esc(c.id)}" style="--node:${esc(c.id===state.city?'#ffffff':(toursForCity(c.id)[0]?.color||'#58e6ff'))}" transform="translate(${c.x} ${c.y})"><circle r="2.2"></circle><text x="3.3" y="1.2">${esc(c.name)}</text></g>`).join('');return `<svg class="map-svg" viewBox="0 0 100 100" role="img" aria-label="Maydayland tour route map"><defs><linearGradient id="sea" x1="0" x2="1"><stop stop-color="#071827"/><stop offset="1" stop-color="#0b2f45"/></linearGradient></defs><rect x="0" y="0" width="100" height="100" rx="6" fill="url(#sea)" opacity=".72"/><path class="land" d="M55 10 L70 12 L80 25 L75 40 L62 43 L54 35 L47 22 Z"/><path class="land" d="M67 38 L82 34 L88 47 L82 63 L67 65 L58 53 Z"/><path class="land" d="M52 56 L60 58 L59 68 L49 69 L44 62 Z"/><path class="land" d="M33 78 L44 79 L45 88 L35 91 L29 84 Z"/><path class="land" d="M88 13 L97 16 L95 25 L86 24 Z"/>${routes}${nodes}</svg>`}
  function cityInfo(c){const rel=toursForCity(c.id),ev=evidence(c.id);return `<div class="city-title"><b>${esc(c.name)}</b><span class="badge">${esc(c.tag)}</span></div><p>${esc(c.summary)}</p><div class="kpi"><div><small>EDITORIAL VISITS</small><b>${esc(c.visits)}</b></div><div><small>${ev?'VERIFIED VENUE':'VENUE'}</small><b>${esc(ev?.venue||c.venue)}</b></div></div><h2>關聯巡演</h2><div class="related">${rel.map(t=>`<span style="--tour:${esc(t.color)}">${esc(t.name)}</span>`).join('')}</div>${ev?`<div class="mini-evidence"><span class="evidence-level ${esc(ev.status)}">${esc(ev.presentation?.venueBoardBadge||ev.status)}</span><small>${(ev.verifiedDates||[]).length} verified dates</small></div>`:''}`}
  function sectionsPreview(){return `<section class="section card"><h2>A–F 分頁保持單一 production shell</h2><div class="grid3"><div class="metric"><small>A</small><b>Tour Atlas</b><small>Shader / Lite adaptive</small></div><div class="metric"><small>B</small><b>City Dossier</b><small>verified evidence native</small></div><div class="metric"><small>C</small><b>Album Room</b><small>時光唱片室</small></div><div class="metric"><small>D</small><b>Songs Universe</b><small>歌單策展</small></div><div class="metric"><small>E</small><b>Books</b><small>出版與收藏</small></div><div class="metric"><small>F</small><b>Timeline</b><small>大事記檔案</small></div></div></section>`}
  function cityPage(){const c=city(state.city),ev=evidence(c.id);return `<main class="board city-board"><aside class="card side"><h2>城市</h2><div class="tourbar">${state.data.cities.map(x=>{const xe=evidence(x.id);return `<button class="tour ${x.id===c.id?'active':''}" data-city="${esc(x.id)}" style="--tour:${esc(toursForCity(x.id)[0]?.color||'#58e6ff')}"><i></i><span><b>${esc(x.name)}</b><small>${xe?`${esc(xe.presentation?.venueBoardBadge||xe.status)} · ${(xe.verifiedDates||[]).length} dates`:esc(x.venue)}</small></span></button>`}).join('')}</div></aside><section class="card section city-dossier"><div class="dossier-head"><div><span class="kicker">B · CITY DOSSIER</span><h2>${esc(c.name)}</h2><p>${esc(c.summary)}</p></div>${ev?`<span class="evidence-level ${esc(ev.status)}">${esc(ev.presentation?.venueBoardBadge||ev.status)}</span>`:`<span class="evidence-level pending">PENDING EVIDENCE</span>`}</div>${venueBoard(c,ev)}</section><aside class="card info">${cityInfo(c)}</aside></main>`}
  function venueBoard(c,ev){if(!ev)return `<div class="venue-board pending-board"><h3>${esc(c.venue)}</h3><p>這個城市目前只有產品資料層。尚未把場館或日期提升為 verified claim。</p><div class="evidence-note"><b>VISITS ${esc(c.visits)}</b><span>EDITORIAL MODEL · not an official historical total</span></div></div>`;
    const dates=(ev.verifiedDates||[]).map(d=>`<time datetime="${esc(d)}">${esc(d)}</time>`).join('');
    const historical=ev.presentation?.verifiedHistoricalTotal!=null?`<div class="record"><small>SCOPED OFFICIAL RECORD</small><b>${esc(ev.presentation.verifiedHistoricalTotal)}</b><span>${esc(ev.presentation.historicalTotalScope||'verified historical scope')}</span></div>`:'';
    const sources=(ev.sources||[]).map((s,i)=>`<a class="source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><span>${String(i+1).padStart(2,'0')}</span><div><b>${esc(s.publisher||'Source')}</b><small>${esc((s.supports||[]).slice(0,3).join(' · '))}</small></div></a>`).join('');
    return `<div class="venue-board"><div class="venue-hero"><div><small>VERIFIED VENUE</small><h3>${esc(ev.venue||c.venue)}</h3><p>${esc(ev.presentation?.confidence||'Verified evidence available')}</p></div><div class="record"><small>VERIFIED DATES</small><b>${(ev.verifiedDates||[]).length}</b><span>source-backed dates only</span></div>${historical}</div><div class="evidence-note"><b>VISITS ${esc(c.visits)}</b><span>${esc(ev.presentation?.visitKpi||'EDITORIAL MODEL · historical total not asserted')}</span></div><div class="date-strip">${dates||'<span>No individual dates asserted</span>'}</div><div class="sources"><h3>Evidence Sources</h3>${sources||'<p>No public source links available.</p>'}</div></div>`}
  function albumPage(){return `<section class="section card"><h2>Album Room · 時光唱片室</h2><div class="album-room"><div class="shelf">${state.data.albums.map(a=>`<div class="cover">${esc(a)}</div>`).join('')}</div><aside class="drawer"><h2>專輯詳情抽屜</h2><p>點擊專輯後展示發行年份、曲目、巡演關聯、城市記憶與官方資料。這裡維持產品化視覺，不回退為歷史 demo 疊層。</p></aside></div></section>`}
  function songsPage(){return `<section class="section card"><h2>Songs Universe · 歌曲宇宙</h2><div class="song-grid">${state.data.songCollections.map(s=>`<div class="song">${esc(s)}</div>`).join('')}</div></section>`}
  function booksPage(){return `<section class="section card"><h2>Books & Publications · 書籍出版</h2><div class="book-grid">${state.data.books.map(b=>`<div class="book">${esc(b)}</div>`).join('')}</div></section>`}
  function timelinePage(){return `<section class="section card"><h2>Timeline / Archive · 歷程檔案</h2><div class="timeline">${state.data.timeline.map(e=>`<article class="event"><time>${esc(e.year)}</time><div><b>${esc(e.title)}</b><p>${esc(e.body)}</p></div></article>`).join('')}</div></section>`}
  function bind(){
    document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.nav});
    document.querySelectorAll('[data-tour]').forEach(b=>b.onclick=()=>{state.tour=b.dataset.tour;render()});
    document.querySelectorAll('[data-city]').forEach(b=>b.onclick=()=>{state.city=b.dataset.city;if(state.page==='city')location.hash='#city/'+state.city;else render();});
    document.querySelectorAll('[data-atlas-mode]').forEach(b=>b.onclick=()=>{state.atlasMode=b.dataset.atlasMode;state.atlasReady=false;render();});
    const frame=$('.atlas-frame');if(frame)frame.addEventListener('load',()=>setTimeout(sendAtlasProfile,120),{once:true});
  }
})();