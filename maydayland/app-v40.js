(() => {
  'use strict';

  const VERSION = '40.0.0';
  const DATA_URL = './data/three-tour-v40.json?v=40.0.0';
  const $ = (sel, root=document) => root.querySelector(sel);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fallback = {
    version: VERSION,
    center:{lng:112.5,lat:28.5},
    scale:1.18,
    hubCityId:'taipei',
    themes:{teal:{bg:'#050912',land:'#112b3a',top:'#63e7ff',side:'#0a5268',line:'#ffc040',label:'#dffaff'}},
    cities:[
      {id:'taipei',name:'台北',lng:121.565,lat:25.037,visits:26,level:'核心主場',venue:'台北大巨蛋 / 台北小巨蛋',score:84,tone:'#ff70b7',summary:'主場敘事核心。'},
      {id:'taichung',name:'台中',lng:120.646,lat:24.179,visits:14,level:'起跑 / 跨年',venue:'台中洲際棒球場',score:78,tone:'#ffd36a',summary:'5525 起跑與跨年線。'},
      {id:'hongkong',name:'香港',lng:114.158,lat:22.282,visits:10,level:'海港海外線',venue:'中環海濱 / 紅磡',score:70,tone:'#8f7dff',summary:'維港海外線。'}
    ],
    milestones:['v40 Three.js 原型','v41 GeoJSON 拉伸','v42 全局 UV','v43 Bloom 性能面板']
  };

  const state = {data:fallback, theme:'teal', selected:'taipei', three:null, timer:0, raf:0, autoRotate:true};

  document.addEventListener('DOMContentLoaded', init);

  async function init(){
    try{
      const res = await fetch(DATA_URL, {cache:'no-store'});
      if(res.ok) state.data = await res.json();
    }catch(err){ console.warn('Maydayland v40 data fallback', err); }
    state.selected = state.data.hubCityId || (state.data.cities[0] && state.data.cities[0].id) || 'taipei';
    renderShell();
    initThree();
    bindUI();
  }

  function theme(){ return (state.data.themes && state.data.themes[state.theme]) || state.data.themes.teal || fallback.themes.teal; }
  function cityById(id){ return state.data.cities.find(c => c.id === id) || state.data.cities[0]; }
  function hub(){ return cityById(state.data.hubCityId) || state.data.cities[0]; }
  function project(city){
    const c = state.data.center || fallback.center;
    const s = Number(state.data.scale || 1);
    return {
      x:(Number(city.lng) - c.lng) * s,
      y:(Number(city.lat) - c.lat) * s,
      z:0
    };
  }

  function renderShell(){
    const root = $('#app');
    if(!root) return;
    root.innerHTML = `<div class="v40-shell"><div class="v40-wrap">
      <header class="v40-top">
        <a class="v40-brand" href="#"><img src="./mayday-logo.svg?v=${VERSION}" alt="Mayday"><span><b>MAYDAYLAND</b><small>THREE TOUR ATLAS · v${VERSION}</small></span></a>
        <nav class="v40-nav"><button class="active" data-action="view3d">3D 巡演星圖</button><button data-action="doc">技術拆解</button><button data-action="next">後續 v41</button></nav>
        <div class="v40-actions"><button class="v40-chip active" data-theme="teal">Teal</button><button class="v40-chip" data-theme="gold">Gold</button><button class="v40-chip" data-theme="red">Red</button></div>
      </header>
      <section class="v40-hero">
        <article class="v40-copy v40-card"><span class="v40-kicker">Native Three.js · no build</span><h1>把巡演地圖改成 3D 光柱飛線引擎。</h1><p>參考 LockScope 的思路，但不複製文章代碼：保持純原生 HTML/JS、Three.js r128 CDN、IIFE、資料分離、Z-up 內部構建、Y-up 渲染、TubeGeometry 飛線、Canvas 光暈與可降級策略。</p></article>
        <aside class="v40-stack v40-card">${metric('引擎','Three.js r128','CDN 直引')} ${metric('資料','three-tour-v40.json','本地 JSON')} ${metric('效果','光柱 + 飛線','原型完成')} ${metric('下一步','GeoJSON Extrude','v41')}</aside>
      </section>
      <main class="v40-board">
        <aside class="v40-side v40-card"><h2>巡演城市</h2><p class="copy">點城市會同步 3D 高亮與右側資料。熱度越高，光柱越高。</p><div class="v40-city-list">${state.data.cities.map(cityBtn).join('')}</div></aside>
        <section class="v40-stage v40-card"><div id="threeStage" class="v40-canvas"></div><div id="stageFallback" class="v40-stage-fallback" hidden><div><b>Three.js 未能載入</b><p>頁面會保留資料與列表，不會白屏。請檢查 CDN 或瀏覽器 WebGL。</p></div></div><div class="v40-overlay"><div class="v40-legend"><span class="v40-pill">Z-up 內部構建</span><span class="v40-pill">root.rotation.x = -π/2</span><span class="v40-pill">TubeGeometry 飛線</span><span class="v40-pill">Canvas 光暈</span></div><div class="v40-controls"><button data-control="reset">重置視角</button><button data-control="auto">自動旋轉</button></div></div></section>
        <aside class="v40-info v40-card"><div id="cityInfo"></div><h2>v40 技術落地</h2><div class="v40-list">${row('坐標系','城市點和飛線在 Z-up 地圖空間構建，再用 root group 旋轉到 Three.js Y-up 世界。')}${row('飛線','不用 WebGL Line 加粗，改用 TubeGeometry 管線，為下一步 Shader 流光留接口。')}${row('性能','pixelRatio 限制到 1.5；材質與 CanvasTexture 盡量復用；後續 rebuild 要遞歸 dispose。')}</div></aside>
      </main>
      <section id="techDoc" class="v40-doc v40-card"><h2>參考方法如何轉成 Maydayland 路線</h2><div class="v40-doc-grid">${docCards()}</div></section>
    </div></div>`;
    renderCityInfo();
  }

  function cityBtn(c){return `<button class="v40-city ${c.id===state.selected?'active':''}" data-city="${esc(c.id)}"><b>${esc(c.name)}</b><span>${esc(c.visits)}</span><small>${esc(c.level)} · ${esc(c.venue)}</small></button>`;}
  function metric(a,b,c){return `<div class="v40-metric"><small>${esc(a)}</small><b>${esc(b)}</b><small>${esc(c)}</small></div>`;}
  function row(a,b){return `<div class="v40-row"><b>${esc(a)}</b><span>${esc(b)}</span></div>`;}
  function docCards(){
    const cards = [
      ['v40 現狀','先做城市光柱、飛線、主題切換、點選資料，不碰舊 widget。'],
      ['v41 地圖拉伸','接入 GeoJSON，將區域輪廓轉 Shape + ExtrudeGeometry。'],
      ['v42 貼圖與 UV','做全局包圍盒掃描，重寫頂面 UV，避免每塊貼圖碎裂。'],
      ['v43 Bloom / Shader','接 UnrealBloomPass 與 aProgress Shader 流光，並補 dispose 性能面板。']
    ];
    return cards.map(c => `<div class="v40-doc-card"><b>${esc(c[0])}</b><span>${esc(c[1])}</span></div>`).join('');
  }
  function renderCityInfo(){
    const c = cityById(state.selected);
    const box = $('#cityInfo');
    if(!box || !c) return;
    box.innerHTML = `<div class="v40-current" style="--city:${esc(c.tone || '#63e7ff')}"><span class="v40-kicker">${esc(c.level)}</span><h2>${esc(c.name)}</h2><p>${esc(c.summary || '')}</p></div><div class="v40-list">${row('場館', c.venue || '待補')}${row('巡演熱度', `${c.visits || 0} / score ${c.score || '-'}`)}${row('資料狀態', 'v40 用本地 JSON 驅動，後續可接 v36/v37 的城市、場館、歌單資料。')}</div>`;
  }

  function bindUI(){
    document.addEventListener('click', e => {
      const cityEl = e.target.closest('[data-city]');
      if(cityEl){ selectCity(cityEl.getAttribute('data-city')); return; }
      const themeEl = e.target.closest('[data-theme]');
      if(themeEl){ switchTheme(themeEl.getAttribute('data-theme')); return; }
      const ctrl = e.target.closest('[data-control]');
      if(ctrl){ handleControl(ctrl.getAttribute('data-control')); return; }
      const action = e.target.closest('[data-action]');
      if(action && action.getAttribute('data-action') === 'doc') $('#techDoc')?.scrollIntoView({behavior:'smooth'});
    });
    window.addEventListener('resize', resizeThree);
  }

  function switchTheme(name){
    if(!state.data.themes || !state.data.themes[name]) return;
    state.theme = name;
    document.querySelectorAll('[data-theme]').forEach(b => b.classList.toggle('active', b.getAttribute('data-theme') === name));
    rebuildScene();
  }
  function selectCity(id){
    state.selected = id;
    document.querySelectorAll('[data-city]').forEach(b => b.classList.toggle('active', b.getAttribute('data-city') === id));
    renderCityInfo();
    focusCity(id);
  }
  function handleControl(type){
    if(type === 'reset' && state.three){ state.three.camera.position.set(0, 38, 42); state.three.controls && state.three.controls.target.set(0,0,0); state.three.controls && state.three.controls.update(); }
    if(type === 'auto') state.autoRotate = !state.autoRotate;
  }

  function initThree(){
    const stage = $('#threeStage');
    const fallbackEl = $('#stageFallback');
    if(!stage || !window.THREE){ if(fallbackEl) fallbackEl.hidden = false; return; }
    const t = theme();
    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(stage.clientWidth || 900, stage.clientHeight || 650);
    stage.appendChild(renderer.domElement);

    const labelRenderer = window.THREE.CSS2DRenderer ? new THREE.CSS2DRenderer() : null;
    if(labelRenderer){ labelRenderer.setSize(stage.clientWidth || 900, stage.clientHeight || 650); labelRenderer.domElement.style.position='absolute'; labelRenderer.domElement.style.inset='0'; labelRenderer.domElement.style.pointerEvents='none'; stage.appendChild(labelRenderer.domElement); }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(t.bg || '#050912', 42, 110);
    const camera = new THREE.PerspectiveCamera(45, Math.max(1, stage.clientWidth / Math.max(stage.clientHeight,1)), 0.1, 240);
    camera.position.set(0, 38, 42);
    const controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if(controls){ controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 18; controls.maxDistance = 86; controls.maxPolarAngle = Math.PI * 0.48; }

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(18, 34, 28); scene.add(key);

    const root = new THREE.Group();
    root.rotation.x = -Math.PI / 2;
    scene.add(root);

    state.three = {stage,renderer,labelRenderer,scene,camera,controls,root,objects:[],labels:[],lines:[],particles:[],cityObjects:{},clock:new THREE.Clock()};
    rebuildScene();
    animate();
  }

  function disposeObject(obj){
    obj.traverse(o => {
      if(o.geometry) o.geometry.dispose();
      if(o.material){
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(m => { if(m.map) m.map.dispose(); m.dispose(); });
      }
    });
  }
  function clearRoot(){
    const ctx = state.three;
    if(!ctx) return;
    ctx.objects.forEach(disposeObject);
    ctx.objects.length = 0;
    ctx.lines.length = 0;
    ctx.particles.length = 0;
    ctx.cityObjects = {};
    while(ctx.root.children.length) ctx.root.remove(ctx.root.children[0]);
  }
  function rebuildScene(){
    const ctx = state.three;
    if(!ctx) return;
    clearRoot();
    const t = theme();
    ctx.scene.fog.color = new THREE.Color(t.bg || '#050912');
    buildBase(ctx,t);
    buildCities(ctx,t);
    buildFlyLines(ctx,t);
  }
  function buildBase(ctx,t){
    const grid = new THREE.Group();
    const planeGeo = new THREE.PlaneGeometry(58, 42, 1, 1);
    const planeMat = new THREE.MeshPhongMaterial({color:new THREE.Color(t.land || '#112b3a'), transparent:true, opacity:0.72, side:THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeo, planeMat);
    grid.add(plane);
    const ringMat = new THREE.LineBasicMaterial({color:new THREE.Color(t.top || '#63e7ff'), transparent:true, opacity:0.3});
    for(let i=0;i<9;i++){
      const geo = new THREE.BufferGeometry();
      const y = -20 + i*5;
      geo.setFromPoints([new THREE.Vector3(-29,y,0.02), new THREE.Vector3(29,y,0.02)]);
      grid.add(new THREE.Line(geo, ringMat));
    }
    for(let i=0;i<12;i++){
      const geo = new THREE.BufferGeometry();
      const x = -28 + i*5;
      geo.setFromPoints([new THREE.Vector3(x,-21,0.021), new THREE.Vector3(x,21,0.021)]);
      grid.add(new THREE.Line(geo, ringMat));
    }
    ctx.root.add(grid); ctx.objects.push(grid);
  }
  function makeGlowTexture(color){
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64,64,0,64,64,64);
    grd.addColorStop(0,'rgba(255,255,255,0.95)');
    grd.addColorStop(0.18,color || 'rgba(99,231,255,0.8)');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(0,0,128,128);
    return new THREE.CanvasTexture(c);
  }
  function buildCities(ctx,t){
    const maxVisits = Math.max(...state.data.cities.map(c => Number(c.visits || 1)));
    state.data.cities.forEach(c => {
      const p = project(c);
      const height = 2.8 + (Number(c.visits || 1) / maxVisits) * 7.5;
      const group = new THREE.Group(); group.position.set(p.x,p.y,0.08); group.userData.cityId = c.id;
      const tone = new THREE.Color(c.tone || t.top || '#63e7ff');
      const baseGeo = new THREE.CylinderGeometry(0.9,1.15,0.35,32,1,false);
      baseGeo.rotateX(Math.PI / 2); baseGeo.translate(0,0,0.18);
      const baseMat = new THREE.MeshPhongMaterial({color:t.side || '#0a5268', emissive:tone, emissiveIntensity:0.15, transparent:true, opacity:0.92});
      group.add(new THREE.Mesh(baseGeo,baseMat));
      const coneGeo = new THREE.CylinderGeometry(0.06,0.78,height,32,1,true);
      coneGeo.rotateX(Math.PI / 2); coneGeo.translate(0,0,height/2+0.35);
      const coneMat = new THREE.MeshBasicMaterial({color:tone, transparent:true, opacity:0.38, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide});
      group.add(new THREE.Mesh(coneGeo,coneMat));
      const coreGeo = new THREE.CylinderGeometry(0.025,0.16,height*0.82,18,1,true);
      coreGeo.rotateX(Math.PI / 2); coreGeo.translate(0,0,height*0.41+0.45);
      const coreMat = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.62, blending:THREE.AdditiveBlending, depthWrite:false});
      group.add(new THREE.Mesh(coreGeo,coreMat));
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map:makeGlowTexture('rgba(255,192,64,.72)'), transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.9}));
      sprite.position.set(0,0,height+0.6); sprite.scale.set(3.2,3.2,1); group.add(sprite);
      const ringGeo = new THREE.RingGeometry(0.7,0.74,48);
      const ringMat = new THREE.MeshBasicMaterial({color:tone, transparent:true, opacity:0.56, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide});
      const ring = new THREE.Mesh(ringGeo, ringMat); ring.position.z = 0.12; group.add(ring);
      if(ctx.labelRenderer && THREE.CSS2DObject){
        const el = document.createElement('div'); el.className = 'v40-label'; el.textContent = `${c.name} · ${c.visits}`;
        const label = new THREE.CSS2DObject(el); label.position.set(p.x,p.y,height+1.2); ctx.root.add(label); ctx.objects.push(label);
      }
      ctx.root.add(group); ctx.objects.push(group); ctx.cityObjects[c.id] = {group, ring, sprite, height, city:c};
    });
  }
  function buildFlyLines(ctx,t){
    const h = hub(); const hp = project(h);
    state.data.cities.filter(c => c.id !== h.id).forEach((c,idx) => {
      const p = project(c); const dist = Math.hypot(hp.x-p.x,hp.y-p.y);
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(hp.x,hp.y,1.2),
        new THREE.Vector3((hp.x+p.x)/2,(hp.y+p.y)/2,Math.max(5.5,dist*0.28)+4),
        new THREE.Vector3(p.x,p.y,1.2)
      );
      const segs = 96, radialSeg = 6;
      const geo = new THREE.TubeGeometry(curve,segs,0.035,radialSeg,false);
      const count = geo.attributes.position.count;
      const arr = new Float32Array(count);
      const vertsPerRing = radialSeg + 1;
      for(let i=0;i<=segs;i++) for(let j=0;j<vertsPerRing;j++){ const k=i*vertsPerRing+j; if(k<count) arr[k]=i/segs; }
      geo.setAttribute('aProgress', new THREE.BufferAttribute(arr,1));
      const mat = new THREE.ShaderMaterial({
        transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
        uniforms:{uTime:{value:0},uDraw:{value:1},uColor:{value:new THREE.Color(t.line || '#ffc040')},uGlow:{value:new THREE.Color('#ffffff')}},
        vertexShader:'attribute float aProgress; varying float vProgress; void main(){ vProgress=aProgress; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader:'uniform float uTime; uniform float uDraw; uniform vec3 uColor; uniform vec3 uGlow; varying float vProgress; void main(){ if(vProgress>uDraw) discard; float wave1=sin(vProgress*28.0-uTime*3.2); float wave2=sin(vProgress*18.0-uTime*2.1+1.5); float pulse=(wave1*0.5+wave2*0.3+0.75); float head=smoothstep(uDraw-0.035,uDraw,vProgress)*1.2; float alpha=0.18+head+smoothstep(0.0,0.08,vProgress)*0.15; gl_FragColor=vec4(uColor*pulse+uGlow*head, alpha); }'
      });
      const mesh = new THREE.Mesh(geo,mat); mesh.userData.curve = curve; mesh.userData.phase = idx*0.13; ctx.root.add(mesh); ctx.objects.push(mesh); ctx.lines.push(mesh);
      for(let k=0;k<3;k++){
        const particle = new THREE.Sprite(new THREE.SpriteMaterial({map:makeGlowTexture('rgba(255,255,255,.9)'), color:t.line || '#ffc040', transparent:true, opacity:0.85, blending:THREE.AdditiveBlending, depthWrite:false}));
        particle.scale.set(0.7,0.7,1); particle.userData = {curve,phase:(idx*0.17+k*0.28)%1,speed:0.08+idx*0.006}; ctx.root.add(particle); ctx.objects.push(particle); ctx.particles.push(particle);
      }
    });
  }
  function focusCity(id){
    const ctx = state.three; if(!ctx) return;
    Object.entries(ctx.cityObjects).forEach(([cid,obj]) => {
      const active = cid === id;
      obj.group.scale.setScalar(active ? 1.22 : 1);
      obj.sprite.material.opacity = active ? 1 : 0.72;
      obj.ring.material.opacity = active ? 0.9 : 0.42;
    });
    const obj = ctx.cityObjects[id];
    if(obj && ctx.controls){
      const pos = obj.group.position;
      ctx.controls.target.set(pos.x,0,pos.y);
      ctx.controls.update();
    }
  }
  function resizeThree(){
    const ctx = state.three; if(!ctx || !ctx.stage) return;
    const w = ctx.stage.clientWidth || 900, h = ctx.stage.clientHeight || 650;
    ctx.camera.aspect = w / Math.max(h,1); ctx.camera.updateProjectionMatrix(); ctx.renderer.setSize(w,h); ctx.labelRenderer && ctx.labelRenderer.setSize(w,h);
  }
  function animate(){
    const ctx = state.three; if(!ctx) return;
    const elapsed = ctx.clock.getElapsedTime();
    ctx.lines.forEach((line,i) => { line.material.uniforms.uTime.value = elapsed; line.material.uniforms.uDraw.value = 0.45 + ((elapsed*0.18 + line.userData.phase) % 1) * 0.65; });
    ctx.particles.forEach(p => { const t = (elapsed*p.userData.speed + p.userData.phase) % 1; p.position.copy(p.userData.curve.getPoint(t)); p.material.opacity = Math.sin(t*Math.PI); });
    Object.values(ctx.cityObjects).forEach((o,i) => { const s = 1 + Math.sin(elapsed*1.8+i)*0.08; o.sprite.scale.set(3.0*s,3.0*s,1); o.ring.scale.setScalar(1+((elapsed*0.45+i*0.17)%1)*2.8); o.ring.material.opacity = Math.max(0.08,0.55*(1-((elapsed*0.45+i*0.17)%1))); });
    if(state.autoRotate) ctx.root.rotation.z += 0.0009;
    ctx.controls && ctx.controls.update();
    ctx.renderer.render(ctx.scene,ctx.camera);
    ctx.labelRenderer && ctx.labelRenderer.render(ctx.scene,ctx.camera);
    state.raf = requestAnimationFrame(animate);
  }
})();
