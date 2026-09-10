(()=>{
'use strict';
const VER='20260910-typhoon-wind-city-weather-v1.0';
if(window.__windzxyTyphoonWindCityWeather===VER)return;
window.__windzxyTyphoonWindCityWeather=VER;

const API='https://api.open-meteo.com/v1/forecast';
const VALID_MODES=new Set(['radar','cloud','precip','wind','gust','temp','humidity','pressure']);
const CITY_FIELDS='temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,pressure_msl,weather_code';
const WIND_FIELDS='wind_speed_10m,wind_direction_10m,wind_gusts_10m';
const CITY_CACHE=new Map();
const ROOT_STATE=new WeakMap();

const CITIES=[
 ['beijing','北京','Beijing',39.9042,116.4074,1],['tianjin','天津','Tianjin',39.3434,117.3616,3],['shanghai','上海','Shanghai',31.2304,121.4737,1],
 ['nanjing','南京','Nanjing',32.0603,118.7969,2],['hangzhou','杭州','Hangzhou',30.2741,120.1551,2],['ningbo','寧波','Ningbo',29.8683,121.5440,4],
 ['qingdao','青島','Qingdao',36.0671,120.3826,3],['xiamen','廈門','Xiamen',24.4798,118.0894,3],['fuzhou','福州','Fuzhou',26.0745,119.2965,3],
 ['guangzhou','廣州','Guangzhou',23.1291,113.2644,1],['shenzhen','深圳','Shenzhen',22.5431,114.0579,1],['hongkong','香港','Hong Kong',22.3193,114.1694,1],
 ['macau','澳門','Macau',22.1987,113.5439,3],['haikou','海口','Haikou',20.0440,110.1999,3],['sanya','三亞','Sanya',18.2528,109.5119,4],
 ['taipei','台北','Taipei',25.0330,121.5654,1],['kaohsiung','高雄','Kaohsiung',22.6273,120.3014,2],['taichung','台中','Taichung',24.1477,120.6736,3],
 ['seoul','首爾','Seoul',37.5665,126.9780,1],['busan','釜山','Busan',35.1796,129.0756,2],['jeju','濟州','Jeju',33.4996,126.5312,4],
 ['tokyo','東京','Tokyo',35.6762,139.6503,1],['osaka','大阪','Osaka',34.6937,135.5023,1],['nagoya','名古屋','Nagoya',35.1815,136.9066,2],
 ['fukuoka','福岡','Fukuoka',33.5904,130.4017,2],['nagasaki','長崎','Nagasaki',32.7503,129.8779,4],['kagoshima','鹿兒島','Kagoshima',31.5966,130.5571,3],
 ['naha','那霸','Naha',26.2124,127.6809,2],['sapporo','札幌','Sapporo',43.0618,141.3545,2],['sendai','仙台','Sendai',38.2682,140.8694,3],
 ['manila','馬尼拉','Manila',14.5995,120.9842,1],['hanoi','河內','Hanoi',21.0278,105.8342,2],['hochiminh','胡志明市','Ho Chi Minh City',10.8231,106.6297,2]
];

function lang(){
  const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
  return /^en/i.test(v)?'en':/^zh-CN/i.test(v)?'zh-CN':'zh-HK';
}
function cityName(c){return lang()==='en'?c[2]:c[1]}
function weatherIcon(code){
  code=Number(code);
  if(code===0)return'☀️';
  if(code===1)return'🌤️';
  if(code===2)return'⛅';
  if(code===3)return'☁️';
  if(code===45||code===48)return'🌫️';
  if([51,53,55,56,57].includes(code))return'🌦️';
  if([61,63,65,66,67,80,81,82].includes(code))return'🌧️';
  if([71,73,75,77,85,86].includes(code))return'🌨️';
  if([95,96,99].includes(code))return'⛈️';
  return'🌡️';
}
function cardinal(deg){
  if(!Number.isFinite(+deg))return'--';
  const dirs=lang()==='en'?['N','NE','E','SE','S','SW','W','NW']:['北','東北','東','東南','南','西南','西','西北'];
  return dirs[Math.round((((+deg)%360)+360)%360/45)%8];
}
function esc(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function timeoutFetch(url,ms=5000){
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),ms);
  return fetch(url,{cache:'no-store',signal:ctl.signal}).finally(()=>clearTimeout(timer));
}
function visible(root){
  const r=root.getBoundingClientRect();
  return r.width>120&&r.height>120&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth;
}
function currentMode(root){return String(root.__v11Mode||'')}
function state(root){
  let s=ROOT_STATE.get(root);
  if(!s){s={cityTimer:0,windTimer:0,windReq:0,lastMode:'',bound:false,raf:0,canvas:null,ctx:null,windGrid:null,particles:[],resizeObserver:null};ROOT_STATE.set(root,s)}
  return s;
}
function ensureStyle(){
  if(document.getElementById('tpWindCityWeatherV1Css'))return;
  const style=document.createElement('style');
  style.id='tpWindCityWeatherV1Css';
  style.textContent=`
.tp-city-weather-icon{background:transparent!important;border:0!important}
.tp-city-weather-label{transform:translate(-50%,-50%);display:grid;gap:2px;min-width:max-content;padding:4px 6px;border-radius:9px;background:rgba(8,22,34,.86);border:1px solid rgba(255,255,255,.20);box-shadow:0 4px 14px rgba(0,0,0,.24);backdrop-filter:blur(9px);white-space:nowrap;color:#fff;font:700 9px/1.05 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;pointer-events:none}
.tp-city-weather-main{display:flex;align-items:center;gap:4px}.tp-city-weather-main b{font:850 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:#f8fafc}.tp-city-weather-main em{font-style:normal;color:#d8e7f2}
.tp-city-weather-detail{display:flex;align-items:center;gap:5px;color:#c9d9e7;font-size:8px;font-weight:750}.tp-city-weather-detail span{display:inline-flex;align-items:center;gap:2px}.tp-city-wind-arrow{display:inline-block;transform-origin:50% 50%;font-size:10px;color:#93c5fd}
.tp-city-weather-more{color:#9fb4c7;font-size:7px;font-weight:700}
.tp-wind-flow-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:425;pointer-events:none;mix-blend-mode:screen;opacity:.86}
@media(max-width:640px){.tp-city-weather-label{padding:3px 5px;border-radius:8px}.tp-city-weather-detail{gap:4px}.tp-city-weather-more{display:none}}
`;
  document.head.appendChild(style);
}
function cityPane(root){
  const map=root.__tpMap;if(!map)return null;
  let p=map.getPane('tpCityWeatherPane');
  if(!p){map.createPane('tpCityWeatherPane');p=map.getPane('tpCityWeatherPane')}
  p.style.zIndex='435';p.style.pointerEvents='none';return p;
}
function visibleCities(map){
  const b=map.getBounds(),c=map.getCenter(),z=map.getZoom(),cap=z<=4?8:z<=5?12:z<=6?16:20;
  return CITIES.filter(x=>b.contains([x[3],x[4]])).sort((a,b)=>a[5]-b[5]||Math.hypot(a[3]-c.lat,a[4]-c.lng)-Math.hypot(b[3]-c.lat,b[4]-c.lng)).slice(0,cap);
}
async function cityData(cs,force=false){
  const key=cs.map(c=>c[0]).join('|'),old=CITY_CACHE.get(key);
  if(!force&&old&&Date.now()-old.at<90000)return old;
  const url=API+'?latitude='+cs.map(c=>c[3].toFixed(4)).join(',')+'&longitude='+cs.map(c=>c[4].toFixed(4)).join(',')+'&current='+CITY_FIELDS+'&timezone=GMT&wind_speed_unit=kmh&precipitation_unit=mm';
  const json=await timeoutFetch(url,4800).then(r=>{if(!r.ok)throw new Error('city weather '+r.status);return r.json()});
  const data=Array.isArray(json)?json:[json];
  const out={cs,data,at:Date.now()};CITY_CACHE.set(key,out);
  while(CITY_CACHE.size>8)CITY_CACHE.delete(CITY_CACHE.keys().next().value);
  return out;
}
function clearLegacyCityTemps(root){
  const map=root.__tpMap;
  if(root.__fastCityTemps&&map){try{map.removeLayer(root.__fastCityTemps)}catch(_){ }root.__fastCityTemps=null}
}
function clearCityLayer(root){
  const map=root.__tpMap;if(root.__windzxyCityWeatherLayer&&map){try{map.removeLayer(root.__windzxyCityWeatherLayer)}catch(_){}}
  root.__windzxyCityWeatherLayer=null;
}
async function renderCityWeather(root,force=false){
  const map=root.__tpMap;if(!map||!window.L||!visible(root)||!VALID_MODES.has(currentMode(root)))return;
  const cs=visibleCities(map);if(!cs.length){clearCityLayer(root);return}
  try{
    const out=await cityData(cs,force);if(!root.__tpMap||!VALID_MODES.has(currentMode(root)))return;
    clearLegacyCityTemps(root);clearCityLayer(root);cityPane(root);
    const group=window.L.layerGroup(),z=map.getZoom();
    out.cs.forEach((c,i)=>{
      const d=out.data[i]?.current||{},t=+d.temperature_2m,rh=+d.relative_humidity_2m,ws=+d.wind_speed_10m,wd=+d.wind_direction_10m,p=+d.precipitation,pr=+d.pressure_msl,wc=+d.weather_code;
      if(!Number.isFinite(t))return;
      const arrow=Number.isFinite(wd)?((wd+180)%360):0;
      const detail=z>=5?'<div class="tp-city-weather-detail"><span><i class="tp-city-wind-arrow" style="transform:rotate('+arrow.toFixed(0)+'deg)">↑</i>'+esc(cardinal(wd))+' '+(Number.isFinite(ws)?Math.round(ws):'--')+'km/h</span><span>💧'+(Number.isFinite(rh)?Math.round(rh):'--')+'%</span>'+(z>=6?'<span>🌧'+(Number.isFinite(p)?p.toFixed(p<1?1:0):'--')+'mm</span>':'')+'</div>':'';
      const more=z>=7&&Number.isFinite(pr)?'<div class="tp-city-weather-more">'+Math.round(pr)+' hPa · Open-Meteo</div>':'';
      const html='<div class="tp-city-weather-label"><div class="tp-city-weather-main"><span>'+weatherIcon(wc)+'</span><b>'+Math.round(t)+'°</b><em>'+esc(cityName(c))+'</em></div>'+detail+more+'</div>';
      window.L.marker([c[3],c[4]],{pane:'tpCityWeatherPane',interactive:false,icon:window.L.divIcon({className:'tp-city-weather-icon',html,iconSize:[0,0],iconAnchor:[0,0]})}).addTo(group);
    });
    group.addTo(map);root.__windzxyCityWeatherLayer=group;
  }catch(_){/* keep map usable if weather service is temporarily unavailable */}
}
function scheduleCity(root,force=false){
  const s=state(root);clearTimeout(s.cityTimer);s.cityTimer=setTimeout(()=>renderCityWeather(root,force),force?40:260);
}

function windSamples(map,nx,ny){
  const size=map.getSize(),pts=[];
  for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
    const px=x/(nx-1)*Math.max(1,size.x-1),py=y/(ny-1)*Math.max(1,size.y-1),ll=map.containerPointToLatLng([px,py]);
    pts.push({lat:ll.lat,lon:ll.lng});
  }
  return{size,nx,ny,pts};
}
async function fetchWindGrid(root,force=false){
  const map=root.__tpMap,s=state(root);if(!map)return null;
  const mode=currentMode(root);if(mode!=='wind'&&mode!=='gust')return null;
  const spec=windSamples(map,8,6),center=map.getCenter(),key=mode+'|'+Math.round(map.getZoom())+'|'+Math.round(center.lat*2)/2+'|'+Math.round(center.lng*2)/2;
  if(!force&&s.windGrid?.key===key&&Date.now()-s.windGrid.at<90000)return s.windGrid;
  const req=++s.windReq;
  const url=API+'?latitude='+spec.pts.map(p=>p.lat.toFixed(3)).join(',')+'&longitude='+spec.pts.map(p=>p.lon.toFixed(3)).join(',')+'&current='+WIND_FIELDS+'&timezone=GMT&wind_speed_unit=kmh';
  const json=await timeoutFetch(url,5000).then(r=>{if(!r.ok)throw new Error('wind '+r.status);return r.json()});
  if(req!==s.windReq)return null;
  const data=Array.isArray(json)?json:[json];if(data.length!==spec.pts.length)return null;
  s.windGrid={...spec,data,key,at:Date.now(),mode};return s.windGrid;
}
function interpWind(g,x,y,mode){
  const w=Math.max(1,g.size.x),h=Math.max(1,g.size.y),fx=x/w*(g.nx-1),fy=y/h*(g.ny-1),x0=Math.max(0,Math.min(g.nx-1,Math.floor(fx))),y0=Math.max(0,Math.min(g.ny-1,Math.floor(fy))),x1=Math.min(g.nx-1,x0+1),y1=Math.min(g.ny-1,y0+1),tx=fx-x0,ty=fy-y0;
  const vec=(ix,iy)=>{const c=g.data[iy*g.nx+ix]?.current||{},speed=+(mode==='gust'?c.wind_gusts_10m:c.wind_speed_10m),deg=+c.wind_direction_10m;if(!Number.isFinite(speed)||!Number.isFinite(deg))return{u:0,v:0,s:0};const a=(deg+180)*Math.PI/180;return{u:Math.sin(a)*speed,v:-Math.cos(a)*speed,s:speed}};
  const a=vec(x0,y0),b=vec(x1,y0),c=vec(x0,y1),d=vec(x1,y1),mix=(q0,q1,q2,q3)=>(q0*(1-tx)+q1*tx)*(1-ty)+(q2*(1-tx)+q3*tx)*ty;
  return{u:mix(a.u,b.u,c.u,d.u),v:mix(a.v,b.v,c.v,d.v),s:mix(a.s,b.s,c.s,d.s)};
}
function ensureWindCanvas(root){
  const map=root.__tpMap,s=state(root);if(!map)return null;const container=map.getContainer();if(!container)return null;
  let canvas=s.canvas;if(!canvas||!container.contains(canvas)){
    canvas=document.createElement('canvas');canvas.className='tp-wind-flow-canvas';canvas.setAttribute('aria-hidden','true');container.appendChild(canvas);s.canvas=canvas;s.ctx=canvas.getContext('2d');
    if(window.ResizeObserver){s.resizeObserver?.disconnect?.();s.resizeObserver=new ResizeObserver(()=>resizeWindCanvas(root));s.resizeObserver.observe(container)}
  }
  resizeWindCanvas(root);return canvas;
}
function resizeWindCanvas(root){
  const s=state(root),canvas=s.canvas,map=root.__tpMap;if(!canvas||!map)return;const size=map.getSize(),dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(1,Math.round(size.x*dpr)),h=Math.max(1,Math.round(size.y*dpr));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;canvas.style.width=size.x+'px';canvas.style.height=size.y+'px';s.ctx?.setTransform(dpr,0,0,dpr,0,0);s.particles=[]}
}
function resetParticle(p,w,h,randomAge=true){p.x=Math.random()*w;p.y=Math.random()*h;p.age=randomAge?Math.floor(Math.random()*90):0;p.max=70+Math.random()*80;return p}
function seedParticles(root){
  const s=state(root),map=root.__tpMap;if(!map)return;const size=map.getSize(),count=innerWidth<700?110:210;s.particles=Array.from({length:count},()=>resetParticle({},size.x,size.y,true));
}
function stopWind(root){
  const s=state(root);if(s.raf){cancelAnimationFrame(s.raf);s.raf=0}if(s.canvas){s.canvas.style.display='none';s.ctx?.clearRect(0,0,s.canvas.width,s.canvas.height)}
}
function animateWind(root){
  const s=state(root),map=root.__tpMap,g=s.windGrid;if(!map||!g||!s.canvas||!s.ctx)return;
  const mode=currentMode(root);if(mode!=='wind'&&mode!=='gust'){stopWind(root);return}
  const size=map.getSize(),ctx=s.ctx,w=size.x,h=size.y;if(!s.particles.length)seedParticles(root);
  ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,.14)';ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';ctx.lineWidth=1.15;ctx.lineCap='round';ctx.strokeStyle=mode==='gust'?'rgba(255,235,160,.78)':'rgba(205,235,255,.76)';ctx.beginPath();
  for(const p of s.particles){
    const v=interpWind(g,p.x,p.y,mode),mag=Math.max(.01,Math.hypot(v.u,v.v)),step=.45+Math.min(2.6,v.s*.045),dx=v.u/mag*step,dy=v.v/mag*step,ox=p.x,oy=p.y;p.x+=dx;p.y+=dy;p.age++;
    if(p.x<0||p.y<0||p.x>w||p.y>h||p.age>p.max||v.s<.3){resetParticle(p,w,h,false);continue}
    ctx.moveTo(ox,oy);ctx.lineTo(p.x,p.y);
  }
  ctx.stroke();s.raf=requestAnimationFrame(()=>animateWind(root));
}
async function startWind(root,force=false){
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches){stopWind(root);return}
  const canvas=ensureWindCanvas(root),s=state(root);if(!canvas)return;canvas.style.display='block';
  try{const g=await fetchWindGrid(root,force);if(!g||!['wind','gust'].includes(currentMode(root)))return;resizeWindCanvas(root);seedParticles(root);if(s.raf)cancelAnimationFrame(s.raf);s.raf=requestAnimationFrame(()=>animateWind(root))}catch(_){stopWind(root)}
}
function scheduleWind(root,force=false){const s=state(root);clearTimeout(s.windTimer);s.windTimer=setTimeout(()=>startWind(root,force),force?60:320)}
function bindMap(root){
  const s=state(root),map=root.__tpMap;if(!map||s.bound)return;s.bound=true;
  const refresh=()=>{scheduleCity(root,false);const m=currentMode(root);if(m==='wind'||m==='gust')scheduleWind(root,false)};
  map.on('moveend zoomend resize',refresh);
}
function syncRoot(root){
  if(!root.__tpMap||!visible(root))return;bindMap(root);const s=state(root),mode=currentMode(root);if(!VALID_MODES.has(mode)){clearCityLayer(root);stopWind(root);s.lastMode=mode;return}
  clearLegacyCityTemps(root);if(mode!==s.lastMode){s.lastMode=mode;scheduleCity(root,true);if(mode==='wind'||mode==='gust')scheduleWind(root,true);else stopWind(root)}
  else{if(!root.__windzxyCityWeatherLayer)scheduleCity(root,false);if((mode==='wind'||mode==='gust')&&!s.raf)scheduleWind(root,false)}
}
function scan(){document.querySelectorAll('[data-typhoon-root]').forEach(syncRoot)}
function boot(){ensureStyle();scan();setInterval(scan,700);setInterval(()=>document.querySelectorAll('[data-typhoon-root]').forEach(root=>{if(VALID_MODES.has(currentMode(root))&&visible(root))scheduleCity(root,false);if(['wind','gust'].includes(currentMode(root))&&visible(root))scheduleWind(root,false)}),90000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonWindCityWeather={version:'v1.0',windParticles:true,cityWeatherLabels:true,cityFields:['temperature','weather','wind','humidity','precipitation','pressure'],windGrid:'8x6',cityCacheSeconds:90,windCacheSeconds:90};
})();