(() => {
  'use strict';
  const VERSION='45.0.0';
  const PRODUCT_URL='./data/product-pages-v44.json?v=45.0.0';
  const CITY_URL='./data/city-dossiers-v45.json?v=45.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const state={product:null,cities:null,page:'home',city:'taipei'};
  document.addEventListener('DOMContentLoaded',init);
  async function init(){
    const [p,c]=await Promise.all([
      fetch(PRODUCT_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch(CITY_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ]);
    state.product=p||{pages:[{id:'home',label:'Tour Atlas / Home',eyebrow:'A',title:'巡演星圖',subtitle:'3D 巡演地圖',accent:'#28d7ff'}],albums:[],songGroups:[],publications:[],timeline:[]};
    state.cities=c||{cities:[]};
    const hash=location.hash.replace('#','');
    const bits=hash.split('/');
    if(state.product.pages.some(x=>x.id===bits[0])) state.page=bits[0];
    if(bits[0]==='city'&&state.cities.cities.some(x=>x.id===bits[1]))state.city=bits[1];
    render();bind();
  }
  function page(){return state.product.pages.find(x=>x.id===state.page)||state.product.pages[0];}
  function city(){return state.cities.cities.find(x=>x.id===state.city)||state.cities.cities[0]||null;}
  function render(){
    const p=page(); document.documentElement.style.setProperty('--page-accent',p.accent||'#28d7ff');
    $('#app').innerHTML=`<div class="v45-shell"><header class="v45-top"><a class="v45-brand" href="#home"><img src="./mayday-logo.svg?v=${VERSION}" alt="Mayday"><span><b>MAYDAYLAND</b><small>PRODUCT SYSTEM · v${VERSION}</small></span></a><nav class="v45-nav">${state.product.pages.map(x=>`<button data-page="${esc(x.id)}" class="${x.id===state.page?'active':''}" style="--page-accent:${esc(x.accent)}">${esc(x.eyebrow)} · ${esc(x.label)}</button>`).join('')}</nav><div class="v45-live"><span>City dossier</span><b>v45 LIVE</b></div></header><main class="v45-main">${hero(p)}${sections()}</main><footer class="v45-footer">Maydayland v45 · city dossier + venue board · next: v46 richer album room / media details</footer></div>`;
  }
  function hero(p){return `<section class="v45-hero"><article class="v45-card v45-hero-copy"><span class="v45-eyebrow">${esc(p.eyebrow)}</span><h1>${esc(p.title)}</h1><p>${esc(p.subtitle)}</p></article><aside class="v45-card v45-side-note"><small>Approved mockup → production page</small><strong>${esc(p.label)}</strong><p>${state.page==='city'?'v45 把城市頁正式升級成 Hero、Venue Board、巡演關聯、時間軸、交通、照片與來源牆。':'A–F 保持獨立頁面；本輪重點深化 B · City Dossier。'}</p></aside></section>`;}
  function sections(){return [home(),cityPage(),album(),songs(),books(),timeline()].join('');}
  function home(){return `<section class="v45-section ${state.page==='home'?'active':''}"><div class="v45-card v45-atlas"><iframe src="./atlas-v43.html" title="Maydayland Shader Tour Atlas" loading="eager"></iframe></div></section>`;}
  function cityPage(){const c=city(); if(!c)return `<section class="v45-section ${state.page==='city'?'active':''}"><div class="v45-card v45-empty">City dossier data unavailable.</div></section>`;
    return `<section class="v45-section ${state.page==='city'?'active':''}"><div class="v45-city-layout"><aside class="v45-card v45-city-nav"><small>CITY DOSSIER</small>${state.cities.cities.map(x=>`<button data-city="${esc(x.id)}" class="${x.id===c.id?'active':''}" style="--city:${esc(x.accent)}"><span>${esc(x.name)}</span><b>${esc(x.en)}</b><em>${esc(x.tag)}</em></button>`).join('')}</aside><div class="v45-city-main"><article class="v45-card v45-city-hero" style="--city:${esc(c.accent)}"><div><small>${esc(c.hero)}</small><h2>${esc(c.name)} <span>${esc(c.en)}</span></h2><p>${esc(c.summary)}</p></div><div class="v45-city-kpi"><span>VISITS</span><b>${esc(c.visits)}</b><em>product-model</em></div></article><div class="v45-city-grid"><section class="v45-card v45-venue-board"><div class="v45-section-title"><small>VENUE BOARD</small><h3>場館板</h3></div>${c.venues.map(v=>`<article><div><b>${esc(v.name)}</b><span>${esc(v.type)}</span></div><p>${esc(v.role)}</p><em>${esc(v.status)}</em></article>`).join('')}</section><section class="v45-card v45-tour-links"><div class="v45-section-title"><small>TOUR RELATION</small><h3>關聯巡演</h3></div>${c.tourLinks.map(t=>`<span>${esc(t)}</span>`).join('')}</section></div><section class="v45-card v45-moments"><div class="v45-section-title"><small>CITY STORYLINE</small><h3>演出日時間軸</h3></div><div>${c.moments.map(m=>`<article><i></i><small>${esc(m.label)}</small><b>${esc(m.title)}</b><span>${esc(m.meta)}</span></article>`).join('')}</div></section><div class="v45-city-grid lower"><section class="v45-card v45-transport"><div class="v45-section-title"><small>ARRIVAL / EXIT</small><h3>交通與散場</h3></div>${c.transport.map(x=>`<p>${esc(x)}</p>`).join('')}</section><section class="v45-card v45-photo-wall"><div class="v45-section-title"><small>PHOTO WALL</small><h3>照片牆</h3></div><div class="v45-photo-grid"><span>Venue</span><span>City</span><span>Live</span><span>Fans</span></div><p>先保留權利安全的圖片槽；正式圖片只接可確認來源與授權狀態的素材。</p></section><section class="v45-card v45-source-wall"><div class="v45-section-title"><small>SOURCE WALL</small><h3>來源牆</h3></div><p>${esc(c.sourceStatus)}</p><b>未驗證資料不標示為官方統計。</b></section></div></div></div></section>`;
  }
  function album(){return `<section class="v45-section ${state.page==='album'?'active':''}"><div class="v45-card v45-room"><div class="v45-shelf">${(state.product.albums||[]).map((a,i)=>`<div class="v45-album" style="filter:hue-rotate(${i*23}deg)">${esc(a)}</div>`).join('')}</div></div></section>`;}
  function songs(){return `<section class="v45-section ${state.page==='songs'?'active':''}"><div class="v45-songs"><article class="v45-card v45-feature"><small>FEATURED PLAYLIST</small><h3>Live 現場心跳精選</h3><p>巡演、安可、主場、專輯與情緒的探索入口。</p></article>${(state.product.songGroups||[]).map(g=>`<article class="v45-card v45-tile"><small>CURATION</small><h3>${esc(g)}</h3><p>playlist / live / album relation</p></article>`).join('')}</div></section>`;}
  function books(){return `<section class="v45-section ${state.page==='books'?'active':''}"><div class="v45-publications">${(state.product.publications||[]).map((b,i)=>`<article class="v45-card v45-book"><div class="v45-book-cover" style="filter:hue-rotate(${i*31}deg)"></div><div><small>ARCHIVE ITEM</small><h3>${esc(b)}</h3><p>縮略圖、出版年份、作者 / 出版社、來源與收藏資訊。</p></div></article>`).join('')}</div></section>`;}
  function timeline(){return `<section class="v45-section ${state.page==='timeline'?'active':''}"><div class="v45-card v45-timeline"><div class="v45-timeline-list">${(state.product.timeline||[]).map(e=>`<article class="v45-event"><b>${esc(e.year)}</b><span>${esc(e.title)}</span></article>`).join('')}</div></div></section>`;}
  function bind(){document.addEventListener('click',e=>{const p=e.target.closest('[data-page]');if(p){state.page=p.dataset.page;history.replaceState(null,'','#'+state.page);render();return;}const c=e.target.closest('[data-city]');if(c){state.city=c.dataset.city;history.replaceState(null,'','#city/'+state.city);render();}});window.addEventListener('hashchange',()=>{const bits=location.hash.replace('#','').split('/');if(state.product.pages.some(x=>x.id===bits[0]))state.page=bits[0];if(bits[0]==='city'&&state.cities.cities.some(x=>x.id===bits[1]))state.city=bits[1];render();});}
})();