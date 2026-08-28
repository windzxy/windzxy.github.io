(() => {
  'use strict';

  const VERSION = '43.0.0';
  const DATA_URL = './data/geo-tour-v42.json?v=43.0.0';
  const EFFECTS_URL = './data/effects-v43.json?v=43.0.0';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  const fallbackData = {
    version: VERSION,
    map: {center:{lng:116,lat:24}, scale:1.12, extrudeHeight:.42, hubCityId:'taipei'},
    regions: {type:'FeatureCollection',features:[]},
    cities: [{id:'taipei',regionId:'taiwan',name:'台北',lng:121.565,lat:25.037,visits:26,level:'核心主場',venue:'台北大巨蛋 / 台北小巨蛋',summary:'主場敘事核心。',tone:'#ff70b7'}],
    tours: [{id:'t5525',name:'5525 回到那一天',years:'2023–2026',color:'#28d7ff',status:'route-model',route:['taipei'],note:'產品路線模型。'}],
    pages: []
  };
  const fallbackFx = {defaults:{bloomEnabled:true,routeFxEnabled:true,lowPower:false,autoRotate:true,pixelRatioCap:1.5,bloomStrength:.38,bloomRadius:.42,bloomThreshold:.56}};

  const state = {data:fallbackData, fx:fallbackFx, selectedTour:'all', selectedCity:'taipei', selectedRegion:'taiwan', three:null, raf:0, lastFrame:0, fps:0, config:{bloomEnabled:true,routeFxEnabled:true,lowPower:false,autoRotate:true,pixelRatioCap:1.5}};

  document.addEventListener('DOMContentLoaded', init);

  async function loadJson(url, fallback){
    try{ const r = await fetch(url,{cache:'no-store'}); if(r.ok) return await r.json(); }catch(e){ console.warn('v43 fallback', url, e); }
    return fallback;
  }
  async function init(){
    state.data = await loadJson(DATA_URL, fallbackData);
    state.fx = await loadJson(EFFECTS_URL, fallbackFx);
    Object.assign(state.config, state.fx.defaults || {});
    state.selectedCity = state.data.map?.hubCityId || state.data.cities[0].id;
    state.selectedRegion = cityById(state.selectedCity).regionId || 'taiwan';
    renderShell(); initThree(); bindUI();
  }

  function cityById(id){return state.data.cities.find(c=>c.id===id)||state.data.cities[0];}
  function activeTours(){return state.selectedTour==='all'?state.data.tours:state.data.tours.filter(t=>t.id===state.selectedTour);}
  function projectLngLat(lng,lat){const m=state.data.map||fallbackData.map,ctr=m.center||fallbackData.map.center,s=Number(m.scale||1);return {x:(Number(lng)-ctr.lng)*s,y:(Number(lat)-ctr.lat)*s,z:0};}
  function projectCity(c){return projectLngLat(c.lng,c.lat);}
  function colorNum(hex){return new (window.THREE || {Color:function(){}}).Color(hex || '#39e7ff');}
  function metric(a,b,c){return `<div class="v43-metric"><small>${esc(a)}</small><b>${esc(b)}</b><small>${esc(c)}</small></div>`;}
  function tourBtn(t){return `<button class="v43-tour ${state.selectedTour===t.id?'active':''}" data-tour="${esc(t.id)}" style="--tour:${esc(t.color)}"><i></i><b>${esc(t.name)}</b><small>${esc(t.years)} · ${esc(t.status)}</small></button>`;}

  function renderShell(){
    const root = $('#app'); if(!root) return;
    root.innerHTML = `<div class="v43-shell"><div class="v43-wrap">
      <header class="v43-top">
        <a class="v43-brand" href="#"><img src="./mayday-logo.svg?v=${VERSION}" alt="Mayday"><span><b>MAYDAYLAND</b><small>SHADER GEO TOUR ATLAS · v${VERSION}</small></span></a>
        <nav class="v43-tabs">${(state.data.pages||[]).map(p=>`<button>${esc(p.label)}</button>`).join('')}<button class="active">Shader Map</button></nav>
        <div class="v43-status"><span>Route FX</span><b id="tourStatus">ALL TOURS</b></div>
      </header>
      <section class="v43-hero">
        <article class="v43-card v43-copy"><span class="v43-kicker">v43 · Shader flow + bloom control</span><h1>飛線不只是線，現在有流光頭與性能開關。</h1><p>v43 在 v42 的 3D 拉伸概念地圖上加入 ShaderMaterial 流光飛線、可選 Bloom 後期、性能面板與低功耗模式。這一步是從「能看」往「有舞台科技感」推進。</p><div class="v43-mode"><button class="active" data-tour="all">顯示所有巡演</button>${state.data.tours.map(t=>`<button data-tour="${esc(t.id)}" style="--tour:${esc(t.color)}">${esc(t.name)}</button>`).join('')}</div></article>
        <aside class="v43-card v43-score">${metric('地圖底座','ExtrudeGeometry','概念區域塊')}${metric('巡演路線','Shader Tube','流光前沿')}${metric('Bloom','可開關','移動端可降級')}${metric('目前版本','v43','約 87/100')}</aside>
      </section>
      <main class="v43-board">
        <aside class="v43-card v43-side"><h2>Tour Filters</h2><p class="v43-copyline">每次巡演固定一種顏色。單巡演查看時只顯示該巡演飛線；全部模式時多色疊加。</p><div class="v43-tour-list"><button class="v43-tour active" data-tour="all"><i style="background:linear-gradient(135deg,#28d7ff,#f7c65b,#9b84ff,#ff7ea9)"></i><b>顯示所有巡演</b><small>所有路線彩色疊加</small></button>${state.data.tours.map(tourBtn).join('')}</div><div class="v43-rule"><b>v43 規則</b><p>Route shader 以 aProgress 推動流光；Bloom 可開關；低功耗會降低 pixel ratio 並關閉 bloom。</p></div></aside>
        <section class="v43-card v43-stage-card"><div id="threeStage" class="v43-canvas"></div><div id="stageFallback" class="v43-fallback" hidden><b>Three.js / WebGL 未載入</b><p>保留巡演資料，不白屏。</p></div><div class="v43-perf"><h3>Performance Panel</h3><div class="line"><span>FPS</span><b id="fpsText">--</b></div><div class="line"><span>Bloom</span><b id="bloomText">ON</b></div><div class="line"><span>Route FX</span><b id="routeText">ON</b></div><div class="v43-fx"><button data-fx="bloom">Bloom</button><button data-fx="route">Route FX</button><button data-fx="low">Low Power</button><button data-fx="auto">Auto Rotate</button></div><label class="v43-slider">Pixel ratio cap <input type="range" id="ratioCap" min="1" max="2" step="0.1" value="${state.config.pixelRatioCap}"></label></div><div class="v43-mapbar"><span>ExtrudeGeometry base</span><span>ShaderMaterial route</span><span>aProgress flow head</span><span>Bloom fallback safe</span></div></section>
        <aside class="v43-card v43-info"><div id="infoPanel"></div><h2>Product Pages</h2><div class="v43-pages">${(state.data.pages||[]).map(p=>`<div><span>${esc(p.label)}</span><b>${esc(p.readiness)}%</b></div>`).join('')}</div><div class="v43-fxpanel"><b>下一版</b><p>v44 會把 A-F 分頁正式拆成產品頁，而不是只停留在狀態板。</p></div></aside>
      </main>
    </div></div>`;
    renderInfo();
  }

  function renderInfo(){
    const city = cityById(state.selectedCity); const tours = state.data.tours.filter(t => (t.route||[]).includes(city.id));
    const region = (state.data.regions?.features||[]).find(f => f.id === city.regionId);
    const panel = $('#infoPanel'); if(!panel) return;
    panel.innerHTML = `<h2>${esc(city.name)} City Dossier</h2><p>${esc(city.summary||'')}</p><div class="v43-info-grid"><div><small>熱度</small><b>${esc(city.visits)}</b></div><div><small>級別</small><b>${esc(city.level)}</b></div><div><small>場館</small><b>${esc(city.venue)}</b></div><div><small>區域</small><b>${esc(region?.properties?.name || city.regionId || '概念區')}</b></div></div><h3>關聯路線</h3><div class="v43-related">${tours.map(t=>`<span style="--tour:${esc(t.color)}"><i></i>${esc(t.name)}</span>`).join('')||'<em>待補巡演資料</em>'}</div>`;
  }

  function bindUI(){
    document.addEventListener('click', e => {
      const tour = e.target.closest('[data-tour]');
      if(tour){state.selectedTour=tour.getAttribute('data-tour'); refreshUI(); buildRoutes(); return;}
      const city = e.target.closest('[data-city]');
      if(city){state.selectedCity=city.getAttribute('data-city'); const c=cityById(state.selectedCity); state.selectedRegion=c.regionId; selectCity(); renderInfo(); return;}
      const fx = e.target.closest('[data-fx]');
      if(fx){toggleFx(fx.getAttribute('data-fx')); return;}
    });
    document.addEventListener('input', e => { if(e.target && e.target.id==='ratioCap'){state.config.pixelRatioCap=Number(e.target.value); applyPixelRatio();} });
  }
  function refreshUI(){
    $$('[data-tour]').forEach(b=>b.classList.toggle('active',b.getAttribute('data-tour')===state.selectedTour));
    const s=$('#tourStatus'); if(s)s.textContent = state.selectedTour==='all' ? 'ALL TOURS' : (activeTours()[0]?.name || 'TOUR');
  }
  function toggleFx(key){
    if(key==='bloom') state.config.bloomEnabled=!state.config.bloomEnabled;
    if(key==='route'){ state.config.routeFxEnabled=!state.config.routeFxEnabled; buildRoutes(); }
    if(key==='low'){ state.config.lowPower=!state.config.lowPower; if(state.config.lowPower){state.config.bloomEnabled=false; state.config.pixelRatioCap=1; const r=$('#ratioCap'); if(r)r.value=1;} applyPixelRatio(); }
    if(key==='auto') state.config.autoRotate=!state.config.autoRotate;
    updatePerfText();
  }

  function initThree(){
    const stage=$('#threeStage'), fb=$('#stageFallback'); if(!stage || !window.THREE){if(fb)fb.hidden=false;return;}
    const T=window.THREE, rect=stage.getBoundingClientRect();
    const scene=new T.Scene(); scene.fog=new T.Fog(0x050912,20,64);
    const camera=new T.PerspectiveCamera(46,Math.max(rect.width,1)/Math.max(rect.height,1),.1,100); camera.position.set(0,25,31);
    const renderer=new T.WebGLRenderer({antialias:true,alpha:true}); renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,state.config.pixelRatioCap)); renderer.setSize(rect.width,rect.height); stage.innerHTML=''; stage.appendChild(renderer.domElement);
    const labelRenderer=new T.CSS2DRenderer(); labelRenderer.setSize(rect.width,rect.height); labelRenderer.domElement.className='v43-label-layer'; stage.appendChild(labelRenderer.domElement);
    const controls=new T.OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.dampingFactor=.08;
    const root=new T.Group(); root.rotation.x=-Math.PI/2; scene.add(root);
    scene.add(new T.AmbientLight(0xffffff,.55)); const dl=new T.DirectionalLight(0x9eefff,1.05); dl.position.set(8,12,14); scene.add(dl);
    const mapGroup=new T.Group(), routeGroup=new T.Group(), cityGroup=new T.Group(), decor=new T.Group(); root.add(decor,mapGroup,routeGroup,cityGroup);
    decor.add(new T.Mesh(new T.CircleGeometry(18,128),new T.MeshBasicMaterial({color:0x081827,transparent:true,opacity:.82,side:T.DoubleSide})));
    for(let r=5;r<=17;r+=2.4) decor.add(new T.Mesh(new T.RingGeometry(r,r+.018,144),new T.MeshBasicMaterial({color:0x2ce4ff,transparent:true,opacity:.10,side:T.DoubleSide})));
    const cityObjects={}, regionObjects={};
    state.three={T,scene,camera,renderer,labelRenderer,controls,root,mapGroup,routeGroup,cityGroup,cityObjects,regionObjects,composer:null,bloomPass:null,renderPass:null};
    buildRegions(); buildCities(); buildRoutes(); setupBloom();
    window.addEventListener('resize', resizeThree, {passive:true});
    animate(0); selectCity(); updatePerfText();
  }

  function setupBloom(){
    const th=state.three, T=th.T;
    if(!T.EffectComposer || !T.RenderPass || !T.UnrealBloomPass){ th.composer=null; return; }
    const size=th.renderer.getSize(new T.Vector2());
    th.composer=new T.EffectComposer(th.renderer);
    th.renderPass=new T.RenderPass(th.scene, th.camera); th.composer.addPass(th.renderPass);
    const d=state.fx.defaults||{};
    th.bloomPass=new T.UnrealBloomPass(new T.Vector2(size.x,size.y), Number(d.bloomStrength||.38), Number(d.bloomRadius||.42), Number(d.bloomThreshold||.56));
    th.composer.addPass(th.bloomPass);
  }
  function applyPixelRatio(){ if(!state.three)return; state.three.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,state.config.pixelRatioCap)); resizeThree(); }
  function resizeThree(){
    const th=state.three, stage=$('#threeStage'); if(!th||!stage)return; const b=stage.getBoundingClientRect();
    th.camera.aspect=Math.max(b.width,1)/Math.max(b.height,1); th.camera.updateProjectionMatrix(); th.renderer.setSize(b.width,b.height); th.labelRenderer.setSize(b.width,b.height); if(th.composer)th.composer.setSize(b.width,b.height);
  }

  function buildRegions(){
    const th=state.three,T=th.T,map=state.data.map||fallbackData.map,h=Number(map.extrudeHeight||.42);
    (state.data.regions?.features||[]).forEach((f,idx)=>{
      const rings=f.geometry?.coordinates||[]; const outer=rings[0]||[]; if(outer.length<3)return;
      const shape=new T.Shape(); outer.forEach((pt,i)=>{const p=projectLngLat(pt[0],pt[1]); if(i===0)shape.moveTo(p.x,p.y); else shape.lineTo(p.x,p.y);});
      const geo=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1});
      const tone=f.properties?.tone||'#1de3ff';
      const mat=new T.MeshPhongMaterial({color:new T.Color(tone).multiplyScalar(.34),emissive:new T.Color(tone).multiplyScalar(.08),shininess:28,transparent:true,opacity:.86});
      const mesh=new T.Mesh(geo,mat); mesh.userData.regionId=f.id; mesh.position.z=-.02*idx; th.mapGroup.add(mesh); th.regionObjects[f.id]=mesh;
      const edges=new T.LineSegments(new T.EdgesGeometry(geo),new T.LineBasicMaterial({color:new T.Color(tone),transparent:true,opacity:.36})); edges.userData.regionId=f.id; mesh.add(edges);
    });
  }
  function buildCities(){
    const th=state.three,T=th.T;
    state.data.cities.forEach(city=>{
      const p=projectCity(city), h=1.2+Math.min(Number(city.visits||1),28)/28*4.9, g=new T.Group(); g.position.set(p.x,p.y,.44); g.userData.cityId=city.id;
      const base=new T.Mesh(new T.CylinderGeometry(.22,.34,.12,24),new T.MeshBasicMaterial({color:0xffffff})); base.rotation.x=Math.PI/2; g.add(base);
      const pillar=new T.Mesh(new T.CylinderGeometry(.05,.25,h,28,1,true),new T.MeshBasicMaterial({color:new T.Color(city.tone||'#39e7ff'),transparent:true,opacity:.45,blending:T.AdditiveBlending,side:T.DoubleSide})); pillar.rotation.x=Math.PI/2; pillar.position.z=h/2; g.add(pillar);
      const halo=new T.Mesh(new T.RingGeometry(.36,.52,36),new T.MeshBasicMaterial({color:new T.Color(city.tone||'#39e7ff'),transparent:true,opacity:.34,blending:T.AdditiveBlending,side:T.DoubleSide})); halo.position.z=.08; g.add(halo);
      const label=document.createElement('button'); label.className='v43-city-label'; label.dataset.city=city.id; label.innerHTML=`<b>${esc(city.name)}</b><small>${esc(city.visits)}</small>`; const lo=new T.CSS2DObject(label); lo.position.set(0,0,h+.42); g.add(lo);
      th.cityGroup.add(g); th.cityObjects[city.id]=g;
    });
  }
  function routeMaterial(color){
    const T=state.three.T;
    if(!state.config.routeFxEnabled){return new T.MeshBasicMaterial({color:new T.Color(color||'#ffc040'),transparent:true,opacity:state.selectedTour==='all'?.46:.64,blending:T.AdditiveBlending});}
    return new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uTime:{value:0},uDraw:{value:1},uColor:{value:new T.Color(color||'#ffc040')},uGlow:{value:new T.Color('#ffffff')}},vertexShader:'attribute float aProgress; varying float vProgress; void main(){ vProgress=aProgress; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',fragmentShader:'uniform float uTime; uniform float uDraw; uniform vec3 uColor; uniform vec3 uGlow; varying float vProgress; void main(){ if(vProgress>uDraw) discard; float w1=sin(vProgress*30.0-uTime*3.4)*0.5+0.5; float w2=sin(vProgress*17.0-uTime*2.0+1.7)*0.5+0.5; float head=smoothstep(uDraw-0.08,uDraw,vProgress); float alpha=0.16+0.32*w1+0.16*w2+0.58*head; vec3 col=mix(uColor,uGlow,head*0.72); gl_FragColor=vec4(col,alpha); }'});
  }
  function buildRoutes(){
    if(!state.three)return; const th=state.three,T=th.T; dispose(th.routeGroup);
    const segs=96, radial=7, vertsPerRing=radial+1;
    activeTours().forEach((tour,ti)=>{const route=tour.route||[]; for(let i=0;i<route.length-1;i++){const a=cityById(route[i]),b=cityById(route[i+1]); if(!a||!b)continue; const pa=projectCity(a), pb=projectCity(b), dist=Math.hypot(pb.x-pa.x,pb.y-pa.y); const curve=new T.QuadraticBezierCurve3(new T.Vector3(pa.x,pa.y,.68+ti*.08),new T.Vector3((pa.x+pb.x)/2,(pa.y+pb.y)/2,2.9+dist*.34+ti*.18),new T.Vector3(pb.x,pb.y,.68+ti*.08)); const geo=new T.TubeGeometry(curve,segs,.035,radial,false); const count=geo.attributes.position.count, prog=new Float32Array(count); for(let k=0;k<count;k++){prog[k]=Math.min(1,Math.floor(k/vertsPerRing)/segs);} geo.setAttribute('aProgress',new T.BufferAttribute(prog,1)); const mesh=new T.Mesh(geo,routeMaterial(tour.color)); mesh.userData={tourId:tour.id,phase:i*.19+ti*.11}; th.routeGroup.add(mesh);}});
  }
  function selectCity(){ if(!state.three)return; Object.entries(state.three.cityObjects).forEach(([id,o])=>o.scale.setScalar(id===state.selectedCity?1.38:1)); Object.entries(state.three.regionObjects).forEach(([id,o])=>{o.material.opacity=id===state.selectedRegion?.92:.72;}); }
  function dispose(group){ while(group.children.length){ const obj=group.children.pop(); obj.traverse(ch=>{ if(ch.geometry)ch.geometry.dispose(); if(ch.material){(Array.isArray(ch.material)?ch.material:[ch.material]).forEach(m=>{if(m.map)m.map.dispose();m.dispose();});} }); } }
  function updatePerfText(){ const b=$('#bloomText'), r=$('#routeText'); if(b)b.textContent=state.config.bloomEnabled?'ON':'OFF'; if(r)r.textContent=state.config.routeFxEnabled?'ON':'OFF'; }
  function animate(t){
    const th=state.three; if(!th)return; state.raf=requestAnimationFrame(animate);
    if(state.lastFrame){const dt=t-state.lastFrame; state.fps=Math.round(1000/Math.max(dt,1)); const f=$('#fpsText'); if(f && t%250<16)f.textContent=String(state.fps);} state.lastFrame=t;
    th.routeGroup.children.forEach(o=>{ if(o.material && o.material.uniforms){ o.material.uniforms.uTime.value=t*.001; const d=(t*.00022+(o.userData.phase||0))%1.28; o.material.uniforms.uDraw.value=Math.min(d,1); } else if(o.material){ o.material.opacity=.30+.28*(.5+Math.sin(t*.002+(o.userData.phase||0))*.5); } });
    Object.values(th.cityObjects).forEach((o,i)=>{o.rotation.z+=.003+i*.00008;});
    if(state.config.autoRotate) th.root.rotation.z+= state.config.lowPower ? .00025 : .00055;
    th.controls.update();
    if(state.config.bloomEnabled && th.composer) th.composer.render(); else th.renderer.render(th.scene,th.camera);
    th.labelRenderer.render(th.scene,th.camera);
  }
})();
