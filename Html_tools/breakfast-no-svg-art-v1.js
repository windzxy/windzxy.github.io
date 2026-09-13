(()=>{
'use strict';
const VERSION='20260913-breakfast-manga-raster-v1.7-independent-img';
if(window.__windzxyBreakfastNoSvgArt===VERSION)return;
window.__windzxyBreakfastNoSvgArt=VERSION;
const IMG_BY_ICON={
 '🥣':'assets/breakfast/individual/oats.jpg?v=20260913f',
 '🥪':'assets/breakfast/individual/sandwich.jpg?v=20260913f',
 '🥚':'assets/breakfast/individual/eggfruit.jpg?v=20260913f',
 '🌯':'assets/breakfast/individual/vegwrap.jpg?v=20260913f',
 '🥞':'assets/breakfast/individual/pancake.jpg?v=20260913f'
};
function replaceSvg(html){
 let comicIndex=0;
 html=String(html||'').replace(/<svg class="bf-comic-svg"[\s\S]*?<\/svg>/g,()=>{
   comicIndex++;
   return comicIndex===1
     ?'<div class="bf-rasterlike-comic bf-rasterlike-kid" aria-hidden="true"><span class="bf-face">🧒</span><span class="bf-prop">🥣</span><span class="bf-sun-art">☀️</span></div>'
     :'<div class="bf-rasterlike-comic bf-rasterlike-dietitian" aria-hidden="true"><span class="bf-face">👩‍⚕️</span><span class="bf-prop">🍎</span><span class="bf-prop2">🥛</span></div>';
 });
 html=html.replace(/<svg class="bf-food-svg"[\s\S]*?<\/svg>/g,svg=>{
   const m=svg.match(/<text[^>]*>([\s\S]*?)<\/text>/),icon=m?m[1]:'🍽️',src=IMG_BY_ICON[icon];
   return src
     ?'<img class="bf-food-img" src="'+src+'" alt="" loading="lazy" decoding="async" draggable="false">'
     :'<div class="bf-food-placeholder" aria-hidden="true"><span>'+icon+'</span></div>';
 });
 return html;
}
function install(){
 if(typeof bodyHtml!=='function'||bodyHtml.__breakfastNoSvgWrapped)return false;
 const base=bodyHtml;
 const wrapped=function(card,info){const out=base(card,info);return card&&card.appId==='breakfast'?replaceSvg(out):out};
 wrapped.__breakfastNoSvgWrapped=true;bodyHtml=wrapped;return true;
}
function style(){
 if(document.getElementById('breakfastNoSvgArtCss'))return;
 const s=document.createElement('style');s.id='breakfastNoSvgArtCss';
 s.textContent=`
 .bf-comic-svg,.bf-food-svg{display:none!important}
 .bf-rasterlike-comic{position:relative;width:100%;height:100%;min-height:86px;border-radius:18px;overflow:hidden;background:linear-gradient(145deg,#dff5ff,#fff2c9)}
 .bf-rasterlike-comic .bf-face{position:absolute;right:24%;bottom:5%;font-size:58px}.bf-rasterlike-comic .bf-prop{position:absolute;right:3%;bottom:7%;font-size:33px}.bf-rasterlike-comic .bf-prop2{position:absolute;left:6%;bottom:8%;font-size:29px}.bf-rasterlike-comic .bf-sun-art{position:absolute;left:8%;top:10%;font-size:25px}
 .bf-food-img,.bf-food-placeholder{width:100%;aspect-ratio:480/298;border-radius:12px;display:block;object-fit:cover;background:#f7fbfd;box-shadow:inset 0 0 0 1px rgba(92,141,168,.10)}
 .bf-food-img{image-rendering:auto;transform:translateZ(0)}
 .bf-food-placeholder{display:grid;place-items:center;font-size:42px;background:linear-gradient(145deg,#fff8df,#eef8ff)}
 .bf-meal{content-visibility:auto;contain-intrinsic-size:180px 220px}.bf-meal-main .bf-food-img,.bf-meal-main .bf-food-placeholder{margin-bottom:7px}.bf-my-hero .bf-food-img,.bf-my-hero .bf-food-placeholder{width:min(100%,220px);justify-self:center}
 @media(min-width:1180px){.breakfast-widget{grid-template-columns:minmax(0,1fr) 220px!important}.bf-meal-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}.bf-week-grid{grid-template-columns:repeat(7,minmax(0,1fr))!important}.bf-food-img,.bf-food-placeholder{max-height:132px}.bf-today{position:sticky;top:8px}}
 @media(min-width:760px) and (max-width:1179px){.breakfast-widget{grid-template-columns:1fr!important}.bf-main,.bf-today{grid-column:1!important}.bf-meal-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.bf-week-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.bf-today{grid-template-columns:110px 1fr;align-items:center}.bf-today-art{height:92px!important}}
 @media(min-width:560px) and (max-width:759px){.breakfast-widget{grid-template-columns:1fr!important;padding:7px!important}.bf-main,.bf-today{grid-column:1!important}.bf-meal-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.bf-week-grid{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;gap:8px!important;padding-bottom:6px}.bf-day{min-width:160px;scroll-snap-align:start}.bf-today-art{display:none!important}}
 @media(max-width:559px){
  .breakfast-widget{grid-template-columns:1fr!important;padding:8px!important;gap:8px!important;overflow-x:hidden!important}
  .bf-main,.bf-today{grid-column:1!important}.bf-hero{display:none!important}
  .bf-tabs,.bf-filters{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;scrollbar-width:none;padding:2px 0 6px!important;gap:6px!important}
  .bf-tabs::-webkit-scrollbar,.bf-filters::-webkit-scrollbar{display:none}.bf-tabs button,.bf-filters button{white-space:nowrap;min-height:36px;padding:7px 12px!important;font-size:12px!important}
  .bf-section-head{position:relative!important;display:flex!important;align-items:center!important;gap:8px!important;margin-top:0!important;padding-top:2px!important}
  .bf-section-head>div{min-width:0}.bf-section-head small{display:none!important}.bf-week-template{flex:0 0 auto!important;min-height:36px!important;font-size:11px!important;padding:7px 10px!important}
  .bf-meal-grid{grid-template-columns:1fr!important;gap:8px!important}
  .bf-meal{border-radius:14px!important;overflow:hidden!important}
  .bf-meal-main{display:grid!important;grid-template-columns:112px minmax(0,1fr)!important;grid-template-rows:auto auto 1fr!important;column-gap:10px!important;align-items:start!important;padding:7px 42px 7px 7px!important;min-height:90px!important}
  .bf-meal-main .bf-food-img,.bf-meal-main .bf-food-placeholder{grid-row:1/4!important;width:112px!important;aspect-ratio:1.45/1!important;height:77px!important;object-fit:cover!important;margin:0!important;border-radius:10px!important}
  .bf-food-placeholder{font-size:32px!important}
  .bf-meal-main strong{grid-column:2!important;font-size:13px!important;line-height:1.3!important;margin-top:2px!important}.bf-meal-main small{grid-column:2!important;font-size:10px!important;line-height:1.35!important}.bf-meal-main em{grid-column:2!important;display:flex!important;flex-wrap:wrap!important;gap:3px!important}.bf-meal-main em i{font-size:8px!important;padding:2px 5px!important}
  .bf-fav{width:32px!important;height:32px!important;right:8px!important;top:8px!important;font-size:15px!important}
  .bf-week-grid{display:flex!important;overflow-x:auto!important;scroll-snap-type:x mandatory;gap:8px!important;padding-bottom:6px}.bf-day{min-width:148px;scroll-snap-align:start}.bf-nutrition-bars{grid-template-columns:1fr!important}.bf-my-hero{grid-template-columns:1fr!important}.bf-today-art{display:none!important}.bf-today{padding:9px!important}.bf-calendar{gap:3px!important}.bf-cal-day{border-radius:7px!important}
 }
 @media(max-width:359px){.bf-meal-main{grid-template-columns:96px minmax(0,1fr)!important}.bf-meal-main .bf-food-img,.bf-meal-main .bf-food-placeholder{width:96px!important;height:70px!important}}
 `;
 document.head.appendChild(s);
}
function resetBreakfastScroll(){requestAnimationFrame(()=>document.querySelectorAll('.breakfast-widget,.card-body,.window-body').forEach(el=>{if(el.closest&&el.closest('[data-app-id="breakfast"],.breakfast-widget'))el.scrollTop=0}))}
function refresh(){const ok=install();style();if(ok&&typeof renderDesktop==='function'){renderDesktop();resetBreakfastScroll()}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();setTimeout(refresh,0);
window.WebDeskBreakfastNoSvgArt={version:VERSION,noSvg:true,independentImages:true,responsive:true};
})();