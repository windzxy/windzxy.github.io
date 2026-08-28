(() => {
  'use strict';
  const VERSION='44.0.0';
  const DATA_URL='./data/product-pages-v44.json?v=44.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fallback={version:VERSION,pages:[{id:'home',label:'Tour Atlas / Home',eyebrow:'A',title:'巡演星圖',subtitle:'3D 巡演地圖',accent:'#28d7ff'}],cityCards:[],albums:[],songGroups:[],publications:[],timeline:[]};
  const state={data:fallback,page:'home'};
  document.addEventListener('DOMContentLoaded',init);
  async function init(){
    try{const r=await fetch(DATA_URL,{cache:'no-store'});if(r.ok)state.data=await r.json();}catch(e){console.warn('v44 fallback',e)}
    const hash=location.hash.replace('#','');
    if(state.data.pages.some(p=>p.id===hash))state.page=hash;
    render();bind();
  }
  function page(){return state.data.pages.find(p=>p.id===state.page)||state.data.pages[0];}
  function render(){
    const p=page();document.documentElement.style.setProperty('--page-accent',p.accent||'#28d7ff');
    $('#app').innerHTML=`<div class="v44-shell"><header class="v44-top"><a class="v44-brand" href="#home"><img src="./mayday-logo.svg?v=${VERSION}" alt="Mayday"><span><b>MAYDAYLAND</b><small>PRODUCT SYSTEM · v${VERSION}</small></span></a><nav class="v44-nav">${state.data.pages.map(x=>`<button data-page="${esc(x.id)}" class="${x.id===state.page?'active':''}" style="--page-accent:${esc(x.accent)}">${esc(x.eyebrow)} · ${esc(x.label)}</button>`).join('')}</nav><div class="v44-live"><span>Product split</span><b>A–F LIVE</b></div></header><main class="v44-main"><section class="v44-hero"><article class="v44-card v44-hero-copy"><span class="v44-eyebrow">${esc(p.eyebrow)}</span><h1>${esc(p.title)}</h1><p>${esc(p.subtitle)}</p></article><aside class="v44-card v44-side-note"><small>Approved mockup → product page</small><strong>${esc(p.label)}</strong><p>v44 不再把 A–F 當完成度狀態板，而是每一項都有獨立可切換的正式頁面結構。</p></aside></section>${sections()}</main><footer class="v44-footer">Maydayland v44 · product-page split · v45 next: richer city dossier + venue boards</footer></div>`;
  }
  function sections(){return [home(),city(),album(),songs(),books(),timeline()].join('');}
  function home(){return `<section class="v44-section ${state.page==='home'?'active':''}" data-section="home"><div class="v44-card v44-atlas"><iframe src="./atlas-v43.html" title="Maydayland Shader Tour Atlas" loading="eager"></iframe></div></section>`;}
  function city(){return `<section class="v44-section ${state.page==='city'?'active':''}" data-section="city"><div class="v44-grid">${state.data.cityCards.map((c,i)=>`<article class="v44-card v44-tile"><small>${esc(c.tag)}</small><h3>${esc(c.name)}</h3><p>${esc(c.venue)}</p><div class="v44-stat"><div><span>VISITS</span><b>${esc(c.visits)}</b></div><div><span>MODULES</span><b>4</b></div></div></article>`).join('')}</div></section>`;}
  function album(){return `<section class="v44-section ${state.page==='album'?'active':''}" data-section="album"><div class="v44-card v44-room"><div class="v44-shelf">${state.data.albums.map((a,i)=>`<div class="v44-album" style="filter:hue-rotate(${i*23}deg)">${esc(a)}</div>`).join('')}</div></div></section>`;}
  function songs(){return `<section class="v44-section ${state.page==='songs'?'active':''}" data-section="songs"><div class="v44-songs"><article class="v44-card v44-feature"><small>FEATURED PLAYLIST</small><h3>Live 現場心跳精選</h3><p>把巡演、安可、主場、專輯與情緒做成可探索入口，後續接全局播放器與逐曲來源。</p></article>${state.data.songGroups.map(g=>`<article class="v44-card v44-tile"><small>CURATION</small><h3>${esc(g)}</h3><p>歌曲分組入口 · playlist / live / album relation</p></article>`).join('')}</div></section>`;}
  function books(){return `<section class="v44-section ${state.page==='books'?'active':''}" data-section="books"><div class="v44-publications">${state.data.publications.map((b,i)=>`<article class="v44-card v44-book"><div class="v44-book-cover" style="filter:hue-rotate(${i*31}deg)"></div><div><small>ARCHIVE ITEM</small><h3>${esc(b)}</h3><p>縮略圖、出版年份、作者 / 出版社、來源與收藏資訊。</p></div></article>`).join('')}</div></section>`;}
  function timeline(){return `<section class="v44-section ${state.page==='timeline'?'active':''}" data-section="timeline"><div class="v44-card v44-timeline"><div class="v44-timeline-list">${state.data.timeline.map(e=>`<article class="v44-event"><b>${esc(e.year)}</b><span>${esc(e.title)}</span></article>`).join('')}</div></div></section>`;}
  function bind(){document.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b)return;state.page=b.dataset.page;history.replaceState(null,'','#'+state.page);render();});window.addEventListener('hashchange',()=>{const h=location.hash.replace('#','');if(state.data.pages.some(p=>p.id===h)){state.page=h;render();}});}
})();