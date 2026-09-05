(function(){
'use strict';
var DATA_URL='./data/5525-verified-stops.json?v=20260905-verified-stops-v1';
var STYLE_ID='maydayland-verified-tour-data-style-v1';
var ROOT_ID='verified5525Panel';
var NODE_LAYER_ID='verified5525MapNodes';
var CITY_COORDS={
  '北京':{x:60,y:14},
  '成都':{x:48,y:42},
  '上海':{x:74,y:28},
  '桃園':{x:75,y:45},
  '杭州':{x:70,y:31},
  '台中':{x:80,y:78},
  '高雄':{x:79,y:86}
};
function slugCity(name){return String(name||'').replace(/\s+/g,'-').replace(/[^\w\u3400-\u9fff-]/g,'').toLowerCase();}
function addStyle(){
  if(document.getElementById(STYLE_ID))return;
  var style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent='.verified-tour-data{margin-top:16px;padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(5,12,24,.72)}.verified-tour-data h3{margin:0 0 6px;font-size:16px}.verified-tour-data .verified-kicker{display:block;margin-bottom:12px;font-size:11px;letter-spacing:.08em;opacity:.68}.verified-tour-data .verified-route{margin:0 0 12px;font-size:12px;line-height:1.6;opacity:.82}.verified-stop-list{display:grid;gap:8px}.verified-stop{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.055);transition:outline-color .16s ease,background .16s ease}.verified-stop.is-target{outline:2px solid rgba(40,215,255,.72);background:rgba(40,215,255,.1)}.verified-stop b{display:block;font-size:14px}.verified-stop small{display:block;margin-top:3px;line-height:1.45;opacity:.75}.verified-stop a{display:inline-block;margin-top:5px;font-size:11px;color:inherit;opacity:.72}.verified-data-note{margin:10px 0 0;font-size:11px;line-height:1.5;opacity:.58}.verified-map-node-layer{position:absolute;inset:0;pointer-events:none;z-index:6}.verified-map-node{position:absolute;transform:translate(-50%,-50%);pointer-events:auto;min-width:38px;padding:5px 8px;border:1px solid rgba(40,215,255,.7);border-radius:999px;background:rgba(5,14,27,.9);color:inherit;font:inherit;font-size:11px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.28);cursor:pointer}.verified-map-node::before{content:"";display:inline-block;width:6px;height:6px;margin-right:5px;border-radius:50%;background:#28d7ff;box-shadow:0 0 0 3px rgba(40,215,255,.15)}.verified-map-node:hover,.verified-map-node:focus-visible{outline:2px solid #28d7ff;outline-offset:2px}.verified-map-node[data-existing="true"]{opacity:.72}@media(max-width:760px){.verified-tour-data{padding:13px;border-radius:14px}.verified-stop{padding:9px 10px}.verified-map-node{padding:4px 7px;font-size:10px}}';
  document.head.appendChild(style);
}
function dateText(stop){
  if(Array.isArray(stop.dates)&&stop.dates.length)return stop.dates.join(' · ');
  if(stop.start_date&&stop.end_date)return stop.start_date+' — '+stop.end_date;
  return stop.start_date||stop.end_date||'日期待官方資料補齊';
}
function build(data){
  var root=document.createElement('section');
  root.id=ROOT_ID;
  root.className='verified-tour-data';
  root.setAttribute('aria-label','5525 官方驗證巡演資料');
  var title=document.createElement('h3');title.textContent='5525 · 官方驗證場次';root.appendChild(title);
  var kicker=document.createElement('span');kicker.className='verified-kicker';kicker.textContent='VERIFIED TOUR DATA · B\'IN MUSIC';root.appendChild(kicker);
  if(data.route_context&&Array.isArray(data.route_context.official_2024_sequence)){
    var route=document.createElement('p');route.className='verified-route';route.textContent='2024 官方路線：'+data.route_context.official_2024_sequence.join(' → ');root.appendChild(route);
  }
  var list=document.createElement('div');list.className='verified-stop-list';
  (data.stops||[]).forEach(function(stop){
    var item=document.createElement('article');item.className='verified-stop';item.id='verified-stop-'+slugCity(stop.city);item.setAttribute('data-verified-city',stop.city||'');
    var name=document.createElement('b');name.textContent=(stop.city||'未命名城市')+(stop.shows?' · '+stop.shows+' 場':'');item.appendChild(name);
    var venue=document.createElement('small');venue.textContent=stop.venue||'場館資料待補';item.appendChild(venue);
    var dates=document.createElement('small');dates.textContent=dateText(stop);item.appendChild(dates);
    if(stop.source){var link=document.createElement('a');link.href=stop.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='官方來源 ↗';item.appendChild(link);}
    list.appendChild(item);
  });
  root.appendChild(list);
  var note=document.createElement('p');note.className='verified-data-note';note.textContent='僅展示已由官方新聞頁明確支持的資料；地圖上的青色節點可直接定位到對應官方場次。';root.appendChild(note);
  return root;
}
function focusStop(city){
  var target=document.getElementById('verified-stop-'+slugCity(city));
  if(!target)return;
  document.querySelectorAll('.verified-stop.is-target').forEach(function(el){el.classList.remove('is-target');});
  target.classList.add('is-target');
  target.scrollIntoView({behavior:'smooth',block:'nearest'});
  setTimeout(function(){target.classList.remove('is-target');},2200);
}
function findCoreCityButton(city){
  var buttons=document.querySelectorAll('#page-home .city-btn[data-city]');
  for(var i=0;i<buttons.length;i++){
    var label=(buttons[i].textContent||'').trim();
    if(label===city||label.indexOf(city)>=0)return buttons[i];
  }
  return null;
}
function selectVerifiedCity(city){
  var core=findCoreCityButton(city);
  if(core&&!core.classList.contains('active'))core.click();
  focusStop(city);
}
function mountPanel(data){
  if(document.getElementById(ROOT_ID))return true;
  var target=document.querySelector('#page-home .city-panel');
  if(!target)return false;
  target.appendChild(build(data));
  return true;
}
function mountMapNodes(data){
  if(document.getElementById(NODE_LAYER_ID))return true;
  var stage=document.querySelector('#page-home .map-stage');
  if(!stage)return false;
  if(getComputedStyle(stage).position==='static')stage.style.position='relative';
  var layer=document.createElement('div');layer.id=NODE_LAYER_ID;layer.className='verified-map-node-layer';layer.setAttribute('aria-label','5525 官方驗證城市節點');
  (data.stops||[]).forEach(function(stop){
    var p=CITY_COORDS[stop.city];if(!p)return;
    var core=findCoreCityButton(stop.city);
    var btn=document.createElement('button');btn.type='button';btn.className='verified-map-node';btn.style.left=p.x+'%';btn.style.top=p.y+'%';btn.textContent=stop.city;btn.setAttribute('aria-label','查看 '+stop.city+' 5525 官方驗證場次');
    btn.setAttribute('data-existing',core?'true':'false');
    btn.addEventListener('click',function(){selectVerifiedCity(stop.city);});
    layer.appendChild(btn);
  });
  stage.appendChild(layer);
  return true;
}
function mountAll(data){return mountPanel(data)&&mountMapNodes(data);}
function boot(){
  addStyle();
  fetch(DATA_URL,{cache:'no-store'}).then(function(res){if(!res.ok)throw new Error('HTTP '+res.status);return res.json();}).then(function(data){
    if(mountAll(data))return;
    var observer=new MutationObserver(function(){if(mountAll(data))observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(function(){observer.disconnect();},10000);
  }).catch(function(err){if(window.console&&console.warn)console.warn('[Maydayland] verified tour data unavailable',err);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();