(function(){
'use strict';
var DATA_URL='./data/5525-verified-stops.json?v=20260905-verified-stops-v1';
var STYLE_ID='maydayland-verified-tour-data-style-v1';
var ROOT_ID='verified5525Panel';
function addStyle(){
  if(document.getElementById(STYLE_ID))return;
  var style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent='.verified-tour-data{margin-top:16px;padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(5,12,24,.72)}.verified-tour-data h3{margin:0 0 6px;font-size:16px}.verified-tour-data .verified-kicker{display:block;margin-bottom:12px;font-size:11px;letter-spacing:.08em;opacity:.68}.verified-tour-data .verified-route{margin:0 0 12px;font-size:12px;line-height:1.6;opacity:.82}.verified-stop-list{display:grid;gap:8px}.verified-stop{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.055)}.verified-stop b{display:block;font-size:14px}.verified-stop small{display:block;margin-top:3px;line-height:1.45;opacity:.75}.verified-stop a{display:inline-block;margin-top:5px;font-size:11px;color:inherit;opacity:.72}.verified-data-note{margin:10px 0 0;font-size:11px;line-height:1.5;opacity:.58}@media(max-width:760px){.verified-tour-data{padding:13px;border-radius:14px}.verified-stop{padding:9px 10px}}';
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
    var item=document.createElement('article');item.className='verified-stop';
    var name=document.createElement('b');name.textContent=(stop.city||'未命名城市')+(stop.shows?' · '+stop.shows+' 場':'');item.appendChild(name);
    var venue=document.createElement('small');venue.textContent=stop.venue||'場館資料待補';item.appendChild(venue);
    var dates=document.createElement('small');dates.textContent=dateText(stop);item.appendChild(dates);
    if(stop.source){var link=document.createElement('a');link.href=stop.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='官方來源 ↗';item.appendChild(link);}
    list.appendChild(item);
  });
  root.appendChild(list);
  var note=document.createElement('p');note.className='verified-data-note';note.textContent='僅展示已由官方新聞頁明確支持的資料；未確認欄位不推測填寫。';root.appendChild(note);
  return root;
}
function mount(data){
  if(document.getElementById(ROOT_ID))return true;
  var target=document.querySelector('#page-home .city-panel');
  if(!target)return false;
  target.appendChild(build(data));
  return true;
}
function boot(){
  addStyle();
  fetch(DATA_URL,{cache:'no-store'}).then(function(res){if(!res.ok)throw new Error('HTTP '+res.status);return res.json();}).then(function(data){
    if(mount(data))return;
    var observer=new MutationObserver(function(){if(mount(data))observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(function(){observer.disconnect();},10000);
  }).catch(function(err){if(window.console&&console.warn)console.warn('[Maydayland] verified tour data unavailable',err);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
