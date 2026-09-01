(function(){
'use strict';
var pages=[['home','A 巡演地圖'],['city','B 城市專題'],['album','C 專輯室'],['songs','D 歌曲宇宙'],['books','E 書籍出版'],['timeline','F 歷程檔案']];
var cities=[
{id:'taipei',name:'台北',x:78,y:42,visits:26,venue:'台北大巨蛋 / 台北小巨蛋',tag:'核心主場',summary:'主場記憶、台北大巨蛋、台北小巨蛋與 5525+2 的核心敘事。'},
{id:'taichung',name:'台中',x:72,y:50,visits:14,venue:'台中洲際棒球場',tag:'起跑 / 跨年',summary:'5525 起跑與跨年線，適合做成場館攻略與倒數頁。'},
{id:'kaohsiung',name:'高雄',x:69,y:62,visits:12,venue:'高雄世運主場館',tag:'戶外大場',summary:'港都戶外大場、世運主場館與大型合唱氛圍。'},
{id:'hongkong',name:'香港',x:56,y:64,visits:10,venue:'中環海濱 / 紅磡',tag:'海港海外線',summary:'維港海風、海外華語城市節點與海濱演唱會氣質。'},
{id:'shanghai',name:'上海',x:74,y:28,visits:9,venue:'上海體育場',tag:'連場都市',summary:'華東高密度都市連場路線。'},
{id:'beijing',name:'北京',x:60,y:14,visits:8,venue:'國家體育場 · 鳥巢',tag:'超大型場',summary:'鳥巢大型場記憶與北方巡演節點。'},
{id:'shenzhen',name:'深圳',x:55,y:60,visits:5,venue:'深圳大運中心',tag:'霓虹城市',summary:'大灣區霓虹節點與年輕城市線。'},
{id:'singapore',name:'新加坡',x:38,y:84,visits:3,venue:'國家體育場 / 室內館',tag:'東南亞節點',summary:'東南亞巡演節點。'},
{id:'tokyo',name:'東京',x:92,y:18,visits:2,venue:'日本武道館等',tag:'日本資料線',summary:'日文資料、海外作品與武道館記憶。'}
];
var tours=[
{id:'all',name:'全部巡演',years:'All routes',color:'#f4f8ff',route:['taichung','kaohsiung','hongkong','beijing','shanghai','taipei']},
{id:'t5525',name:'5525 回到那一天',years:'2023–2026',color:'#28d7ff',route:['taichung','kaohsiung','hongkong','beijing','shanghai','taipei']},
{id:'wantsee',name:'好好好想見到你',years:'2020–2024',color:'#f7c65b',route:['kaohsiung','taichung','taipei','hongkong','shenzhen','shanghai']},
{id:'life',name:'LIFE 人生無限公司',years:'2017–2019',color:'#9b84ff',route:['taipei','hongkong','shanghai','beijing','kaohsiung']},
{id:'ark',name:'諾亞方舟',years:'2011–2014',color:'#ff7ea9',route:['taipei','kaohsiung','hongkong','shanghai','beijing']},
{id:'dna',name:'DNA 創造',years:'2009–2010',color:'#72f5c6',route:['taipei','hongkong','shanghai','singapore','tokyo']}
];
var albums=[
['第一張創作專輯','1999'],['愛情萬歲','2000'],['人生海海','2001'],['時光機','2003'],['神的孩子都在跳舞','2004'],['為愛而生','2006'],['後青春期的詩','2008'],['第二人生','2011'],['自傳','2016']
];
var songs=['Live 現場心跳精選','巡演安可歌單','城市夜行歌單','親子出遊清新版','五月天入坑 30 首','深夜電台慢歌'];
var books=['演唱會場刊','專輯內頁','票根收藏','樂譜與文字作品','展覽小誌','官方新聞剪報'];
var moments=[['1997','成軍','建立故事起點與人物關係。'],['1999','首張創作專輯','作品索引起點。'],['2011','第二人生 / 諾亞方舟','大型巡演世界觀。'],['2017','LIFE 人生無限公司','大型場館與科技舞台階段。'],['2023','5525 起跑','目前巡演資料主線。'],['2026','5525+2','台北大巨蛋與城市專題。']];
var state={page:'home',tour:'all',city:'taipei'};
function q(s,r){return (r||document).querySelector(s);}
function qa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function findCity(id){for(var i=0;i<cities.length;i++){if(cities[i].id===id)return cities[i];}return cities[0];}
function readPage(){var h=(location.hash||'#home').replace(/^#/,'').split('/')[0];for(var i=0;i<pages.length;i++){if(pages[i][0]===h)return h;}return 'home';}
function mapSvg(){
 var regions='<path class="region" d="M695 82 L780 124 L760 220 L650 205 L612 130 Z"/><path class="region" d="M740 245 L815 268 L790 352 L704 338 Z"/><path class="region" d="M560 530 L635 560 L610 650 L505 626 Z"/><path class="region" d="M350 735 L444 730 L470 812 L356 832 Z"/><path class="region" d="M888 98 L970 135 L938 220 L855 188 Z"/>';
 var routeHtml='';
 for(var i=1;i<tours.length;i++){var t=tours[i],pts=[];for(var j=0;j<t.route.length;j++){var c=findCity(t.route[j]);pts.push((c.x*10)+','+(c.y*9));}routeHtml+='<polyline class="route" data-route="'+t.id+'" style="--c:'+t.color+'" points="'+pts.join(' ')+'"/>';}
 var nodes='';for(var k=0;k<cities.length;k++){var n=cities[k];nodes+='<g><circle class="city-node '+(n.visits>10?'hot':'')+'" cx="'+(n.x*10)+'" cy="'+(n.y*9)+'" r="7"/><text class="city-label" x="'+(n.x*10+10)+'" y="'+(n.y*9-8)+'">'+esc(n.name)+'</text></g>';}
 return '<svg class="map-svg" viewBox="0 0 1000 900" role="img" aria-label="Mayday tour route map"><defs><linearGradient id="sea" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0d2339"/><stop offset="1" stop-color="#06101d"/></linearGradient></defs><rect width="1000" height="900" fill="url(#sea)"/>'+regions+routeHtml+nodes+'</svg>';
}
function tourButtons(){var out='';for(var i=0;i<tours.length;i++){var t=tours[i];out+='<button class="tour" data-tour="'+t.id+'" style="--c:'+t.color+'"><i></i><span><b>'+esc(t.name)+'</b><small>'+esc(t.years)+'</small></span></button>';}return out;}
function cityButtons(){var out='';for(var i=0;i<cities.length;i++){var c=cities[i];out+='<button class="city-btn" style="left:'+c.x+'%;top:'+c.y+'%" data-city="'+c.id+'">'+esc(c.name)+'</button>';}return out;}
function legend(){var out='';for(var i=1;i<tours.length;i++){var t=tours[i];out+='<span style="--c:'+t.color+'"><i></i>'+esc(t.name)+'</span>';}return out;}
function home(){return '<main class="main"><aside class="panel"><h2>Tour Filters</h2><div class="tour-list">'+tourButtons()+'</div></aside><section class="panel map-card"><div class="map-head"><h2>巡演分色路線圖</h2><button class="chip" data-city="taipei">回到台北</button></div><div class="map-stage">'+mapSvg()+cityButtons()+'</div><div class="legend">'+legend()+'</div></section><aside class="panel city-panel"><div id="cityBox"></div></aside></main>';}
function cityBox(){var c=findCity(state.city),related=[];for(var i=1;i<tours.length;i++){if(tours[i].route.indexOf(c.id)>=0)related.push(tours[i]);}var rel='';for(var j=0;j<related.length;j++){rel+='<span style="--c:'+related[j].color+'"><i></i>'+esc(related[j].name)+'</span>';}return '<div class="city-hero"><small>'+esc(c.tag)+'</small><h2>'+esc(c.name)+'</h2><p>'+esc(c.summary)+'</p></div><div class="kv"><div><small>熱度</small><b>'+c.visits+'</b></div><div><small>場館</small><b>'+esc(c.venue)+'</b></div><div><small>關聯巡演</small><b>'+related.length+'</b></div><div><small>核心</small><b>Stable</b></div></div><h2>關聯路線</h2><div class="legend">'+rel+'</div>';}
function cityPage(){var out='<div class="grid">';for(var i=0;i<cities.length;i++){var c=cities[i];out+='<article class="card"><h3>'+esc(c.name)+' · '+esc(c.tag)+'</h3><p>'+esc(c.summary)+'</p><div class="legend"><span>'+c.visits+' heat</span><span>'+esc(c.venue)+'</span></div></article>';}return out+'</div>';}
function albumPage(){var out='<section class="record-room panel"><header class="record-head"><div><span class="kicker">MAYDAY TIME MACHINE · RECORD ROOM</span><h2>五月天時光唱片室</h2><p class="muted">先恢復穩定瀏覽，再逐步接回封面與曲目資料。核心頁面不再依賴外部 API 才能顯示。</p></div><span class="room-badge">1999—2016</span></header><div class="shelf-groups"><section class="shelf-row"><div class="cd-shelf">';for(var i=0;i<albums.length;i++){out+='<article class="card"><h3>'+esc(albums[i][0])+'</h3><p>'+albums[i][1]+'</p></article>';}return out+'</div></section></div></section>';}
function songsPage(){var out='<div class="playlist">';for(var i=0;i<songs.length;i++)out+='<article class="card"><h3>'+esc(songs[i])+'</h3><p>歌曲宇宙資料入口</p></article>';return out+'</div>';}
function booksPage(){var out='<div class="book-shelf">';for(var i=0;i<books.length;i++)out+='<article class="card"><h3>'+esc(books[i])+'</h3><p>出版、收藏與年份索引。</p></article>';return out+'</div>';}
function timelinePage(){var out='<div class="panel timeline"><h2>歷程檔案</h2>';for(var i=0;i<moments.length;i++){var m=moments[i];out+='<div class="moment"><time>'+m[0]+'</time><article><h3>'+esc(m[1])+'</h3><p>'+esc(m[2])+'</p></article></div>';}return out+'</div>';}
function navHtml(){var out='';for(var i=0;i<pages.length;i++)out+='<button data-page="'+pages[i][0]+'">'+pages[i][1]+'</button>';return out;}
function shell(){return '<div class="shell"><header class="top"><div class="wrap top-in"><a class="brand" href="#home"><span class="mark">M</span><span><b>MAYDAYLAND</b><small>Stable Core Audit</small></span></a><nav class="nav">'+navHtml()+'</nav><div class="perf"><i class="dot"></i><span>resilient core · no blank screen</span></div></div></header><div class="wrap"><section class="hero"><article class="hero-copy"><span class="kicker">MAYDAYLAND · RECOVERY CORE</span><h1>城市在路上，音樂在時間裡。</h1><p>先恢復 A–F 六個核心分頁與巡演地圖，再逐項接回歌曲、書籍、時間線與手機增強層。</p><div class="hero-actions"><button class="primary" data-page="home">巡演地圖</button><button class="ghost" data-page="album">專輯室</button><button class="ghost" data-page="timeline">歷程檔案</button></div></article><aside class="score"><div><small>核心狀態</small><b>Stable</b></div><div><small>分頁</small><b>A–F</b></div><div><small>外部依賴</small><b>0</b></div><div><small>首屏策略</small><b>HTML fallback</b></div></aside></section><section class="page active" id="page-home">'+home()+'</section><section class="page" id="page-city">'+cityPage()+'</section><section class="page" id="page-album">'+albumPage()+'</section><section class="page" id="page-songs">'+songsPage()+'</section><section class="page" id="page-books">'+booksPage()+'</section><section class="page" id="page-timeline">'+timelinePage()+'</section></div><footer class="footer"><div class="wrap">Maydayland · resilient recovery core</div></footer></div>';}
function render(){qa('.page').forEach(function(p){p.classList.toggle('active',p.id==='page-'+state.page);});qa('[data-page]').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-page')===state.page);});qa('.tour').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-tour')===state.tour);});qa('.route').forEach(function(r){r.classList.toggle('dim',!(state.tour==='all'||r.getAttribute('data-route')===state.tour));});qa('.city-btn').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-city')===state.city);});var box=q('#cityBox');if(box)box.innerHTML=cityBox();document.documentElement.setAttribute('data-maydayland-runtime','v119-repaired-ready');}
function bind(){document.addEventListener('click',function(e){var p=e.target.closest?e.target.closest('[data-page]'):null;if(p){state.page=p.getAttribute('data-page');location.hash=state.page;return;}var t=e.target.closest?e.target.closest('[data-tour]'):null;if(t){state.tour=t.getAttribute('data-tour');render();return;}var c=e.target.closest?e.target.closest('[data-city]'):null;if(c){state.city=c.getAttribute('data-city');state.page='home';if(location.hash!=='#home')location.hash='home';render();}});window.addEventListener('hashchange',function(){state.page=readPage();render();});}
function boot(){var app=q('#app');if(!app)throw new Error('missing #app');app.innerHTML=shell();state.page=readPage();bind();render();var badge=q('[data-safe-status]');if(badge)badge.textContent='CORE READY';window.MAYDAYLAND_CORE={version:'v119-repaired',state:state};}
function fail(err){console.error('[Maydayland core]',err);document.documentElement.setAttribute('data-maydayland-runtime','failed');var badge=q('[data-safe-status]');if(badge)badge.textContent='CORE ERROR · '+(err&&err.message?err.message:'unknown');}
function start(){try{boot();}catch(err){fail(err);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();