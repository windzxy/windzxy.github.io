(() => {
  'use strict';
  const VERSION = '115.0.0';
  const DATA_URL = './data/product-v115.json?v=115.0.0';
  const $ = (s,r=document)=>r.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fallback = {version:VERSION,cities:[],tours:[],albums:[],songCollections:[],books:[],timeline:[]};
  const state = {data:fallback,page:'home',tour:'all',city:'taipei'};
  document.addEventListener('DOMContentLoaded', init);
  async function init(){
    try{const r=await fetch(DATA_URL,{cache:'no-store'}); if(r.ok) state.data=await r.json();}catch(e){console.warn('Maydayland v115 fallback',e)}
    state.city = state.data.cities?.[0]?.id || 'taipei';
    readHash(); render(); addEventListener('hashchange',()=>{readHash(); render();});
  }
  function readHash(){const parts=location.hash.replace(/^#/,'').split('/').filter(Boolean);state.page=parts[0]||'home'; if(parts[1]) state.city=parts[1];}
  function city(id){return state.data.cities.find(c=>c.id===id)||state.data.cities[0]||{};}
  function toursForCity(id){return state.data.tours.filter(t=>(t.route||[]).includes(id));}
  function activeTours(){return state.tour==='all'?state.data.tours:state.data.tours.filter(t=>t.id===state.tour);}
  function pathFor(route){const pts=route.map(id=>city(id)).filter(c=>c.id); if(pts.length<2)return ''; return pts.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' ');} 
  function render(){
    const root=$('#app'); if(!root)return;
    root.innerHTML = `<div class="shell">
      <header class="top">
        <a class="brand" href="#home"><img src="./mayday-logo.svg?v=115" alt="Maydayland"><span><b>MAYDAYLAND</b><small>PRODUCT SHELL · v115</small></span></a>
        <nav class="tabs">${tab('home','A 巡演地圖')}${tab('city','B 城市專題')}${tab('album','C 專輯室')}${tab('songs','D 歌曲宇宙')}${tab('books','E 書籍出版')}${tab('timeline','F 歷程檔案')}</nav>
        <div class="status"><span>Visible reset</span><b>NO LEGACY STACK</b></div>
      </header>
      ${hero()}
      ${page()}
      <footer class="footer">v115 先把可見入口改成乾淨產品化頁面；Three.js/Shader Atlas 後續作為高級模組接回，不再讓主入口看起來像 demo。</footer>
    </div>`;
    bind();
  }
  function tab(id,label){return `<button class="${state.page===id?'active':''}" data-nav="${id}">${esc(label)}</button>`}
  function hero(){return `<section class="hero"><article class="card hero-main"><span class="kicker">APPROVED PRODUCT DIRECTION · CLEAN ENTRY</span><h1>巡演一種顏色，城市一個故事。</h1><p>這版先解決你看到的 demo 感：主入口改成單一乾淨產品殼，不再一次載入一堆歷史版本。首頁展示巡演分色路線；A–F 分頁按產品圖接起來；所有內容先用可見、穩定、好看的原生 UI 承載。</p></article><aside class="card hero-side"><div class="metric"><small>Release</small><b>v115</b><small>production shell reset</small></div><div class="metric"><small>Routes</small><b>${state.data.tours.length}</b><small>single / all overlay</small></div><div class="metric"><small>Pages</small><b>A–F</b><small>首頁、城市、專輯、歌曲、書籍、歷程</small></div></aside></section>`}
  function page(){return ({home:homePage,city:cityPage,album:albumPage,songs:songsPage,books:booksPage,timeline:timelinePage}[state.page]||homePage)();}
  function homePage(){return `<main class="board"><aside class="card side"><h2>Tour Filters</h2><div class="tourbar"><button class="tour ${state.tour==='all'?'active':''}" data-tour="all" style="--tour:#58e6ff"><i></i><span><b>顯示所有巡演</b><small>多色路線疊加</small></span></button>${state.data.tours.map(t=>`<button class="tour ${state.tour===t.id?'active':''}" data-tour="${esc(t.id)}" style="--tour:${esc(t.color)}"><i></i><span><b>${esc(t.name)}</b><small>${esc(t.years)}</small></span></button>`).join('')}</div></aside><section class="card stage"><div class="map-wrap">${mapSvg()}<div class="map-overlay"><div class="legend">${activeTours().map(t=>`<span style="border-color:${esc(t.color)};color:${esc(t.color)}">${esc(t.name)}</span>`).join('')}</div><div class="mode"><button class="${state.tour==='all'?'active':''}" data-tour="all">全部巡演</button><button data-nav="city/${esc(state.city)}">查看城市專題</button></div></div></div></section><aside class="card info"><div class="info-panel">${cityInfo(city(state.city))}</div></aside></main>${sectionsPreview()}`}
  function mapSvg(){const routes = state.data.tours.map(t=>{const active=state.tour==='all'||state.tour===t.id;return `<path class="route ${active?'focus':'dim'}" style="--route:${esc(t.color)}" d="${esc(pathFor(t.route))}"/>`;}).join('');const nodes=state.data.cities.map(c=>`<g class="node" data-city="${esc(c.id)}" style="--node:${esc(c.id===state.city?'#ffffff':(toursForCity(c.id)[0]?.color||'#58e6ff'))}" transform="translate(${c.x} ${c.y})"><circle r="2.2"></circle><text x="3.3" y="1.2">${esc(c.name)}</text></g>`).join('');return `<svg class="map-svg" viewBox="0 0 100 100" role="img" aria-label="Maydayland tour route map"><defs><linearGradient id="sea" x1="0" x2="1"><stop stop-color="#071827"/><stop offset="1" stop-color="#0b2f45"/></linearGradient></defs><rect x="0" y="0" width="100" height="100" rx="6" fill="url(#sea)" opacity=".72"/><path class="land" d="M55 10 L70 12 L80 25 L75 40 L62 43 L54 35 L47 22 Z"/><path class="land" d="M67 38 L82 34 L88 47 L82 63 L67 65 L58 53 Z"/><path class="land" d="M52 56 L60 58 L59 68 L49 69 L44 62 Z"/><path class="land" d="M33 78 L44 79 L45 88 L35 91 L29 84 Z"/><path class="land" d="M88 13 L97 16 L95 25 L86 24 Z"/>${routes}${nodes}</svg>`}
  function cityInfo(c){const rel=toursForCity(c.id);return `<div class="city-title"><b>${esc(c.name)}</b><span class="badge">${esc(c.tag)}</span></div><p>${esc(c.summary)}</p><div class="kpi"><div><small>VISITS</small><b>${esc(c.visits)}</b></div><div><small>VENUE</small><b>${esc(c.venue)}</b></div></div><h2>關聯巡演</h2><div class="related">${rel.map(t=>`<span style="--tour:${esc(t.color)}">${esc(t.name)}</span>`).join('')}</div>`}
  function sectionsPreview(){return `<section class="section card"><h2>A–F 分頁已接回主入口</h2><div class="grid3"><div class="metric"><small>A</small><b>Tour Atlas</b><small>巡演分色路線</small></div><div class="metric"><small>B</small><b>City Dossier</b><small>城市專題詳情</small></div><div class="metric"><small>C</small><b>Album Room</b><small>時光唱片室</small></div><div class="metric"><small>D</small><b>Songs Universe</b><small>歌單策展</small></div><div class="metric"><small>E</small><b>Books</b><small>出版與收藏</small></div><div class="metric"><small>F</small><b>Timeline</b><small>大事記檔案</small></div></div></section>`}
  function cityPage(){const c=city(state.city);return `<main class="board"><aside class="card side"><h2>城市</h2><div class="tourbar">${state.data.cities.map(x=>`<button class="tour ${x.id===c.id?'active':''}" data-city="${esc(x.id)}" style="--tour:${esc(toursForCity(x.id)[0]?.color||'#58e6ff')}"><i></i><span><b>${esc(x.name)}</b><small>${esc(x.venue)}</small></span></button>`).join('')}</div></aside><section class="card section"><h2>${esc(c.name)} City Dossier</h2><p>${esc(c.summary)}</p><div class="grid3"><div class="metric"><small>場館</small><b>${esc(c.venue)}</b><small>後續接官方日期證據</small></div><div class="metric"><small>城市級別</small><b>${esc(c.tag)}</b><small>產品資料層</small></div><div class="metric"><small>關聯巡演</small><b>${toursForCity(c.id).length}</b><small>可從首頁路線進入</small></div></div></section><aside class="card info">${cityInfo(c)}</aside></main>`}
  function albumPage(){return `<section class="section card"><h2>Album Room · 時光唱片室</h2><div class="album-room"><div class="shelf">${state.data.albums.map(a=>`<div class="cover">${esc(a)}</div>`).join('')}</div><aside class="drawer"><h2>專輯詳情抽屜</h2><p>點擊專輯後展示發行年份、曲目、巡演關聯、城市記憶與官方資料。這裡先完成產品化視覺，不再用普通 demo 卡片。</p></aside></div></section>`}
  function songsPage(){return `<section class="section card"><h2>Songs Universe · 歌曲宇宙</h2><div class="song-grid">${state.data.songCollections.map(s=>`<div class="song">${esc(s)}</div>`).join('')}</div></section>`}
  function booksPage(){return `<section class="section card"><h2>Books & Publications · 書籍出版</h2><div class="book-grid">${state.data.books.map(b=>`<div class="book">${esc(b)}</div>`).join('')}</div></section>`}
  function timelinePage(){return `<section class="section card"><h2>Timeline / Archive · 歷程檔案</h2><div class="timeline">${state.data.timeline.map(e=>`<article class="event"><time>${esc(e.year)}</time><div><b>${esc(e.title)}</b><p>${esc(e.body)}</p></div></article>`).join('')}</div></section>`}
  function bind(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.nav});document.querySelectorAll('[data-tour]').forEach(b=>b.onclick=()=>{state.tour=b.dataset.tour;render()});document.querySelectorAll('[data-city]').forEach(b=>b.onclick=()=>{state.city=b.dataset.city; if(state.page==='city') location.hash='#city/'+state.city; else render();});}
})();
