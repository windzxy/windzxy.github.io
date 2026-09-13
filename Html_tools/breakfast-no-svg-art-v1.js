(()=>{
'use strict';
const VERSION='20260913-breakfast-manga-raster-v1.5-responsive-crisp';
const SPRITE='assets/breakfast/breakfast-manga-food-sprite.jpg?v=20260913e';
if(window.__windzxyBreakfastNoSvgArt===VERSION)return;
window.__windzxyBreakfastNoSvgArt=VERSION;
const POS={'🥣':0,'🥪':1,'🥚':2,'🌯':4,'🍠':6,'🥛':7,'🍲':0,'🌽':9,'🍜':4,'🥞':5,'🍙':1};
let spritePromise=null;
function preloadSprite(){
 if(spritePromise)return spritePromise;
 spritePromise=new Promise(resolve=>{
   const img=new Image();
   img.decoding='async';
   img.onload=()=>{const done=()=>{document.documentElement.classList.add('bf-sprite-ready');resolve(true)};if(img.decode){img.decode().then(done).catch(done)}else done()};
   img.onerror=()=>resolve(false);
   img.src=SPRITE;
 });
 return spritePromise;
}
function replaceSvg(html){let comicIndex=0;html=String(html||'').replace(/<svg class="bf-comic-svg"[\s\S]*?<\/svg>/g,()=>{comicIndex++;return comicIndex===1?'<div class="bf-rasterlike-comic bf-rasterlike-kid" aria-hidden="true"><span class="bf-face">🧒</span><span class="bf-prop">🥣</span><span class="bf-sun-art">☀️</span></div>':'<div class="bf-rasterlike-comic bf-rasterlike-dietitian" aria-hidden="true"><span class="bf-face">👩‍⚕️</span><span class="bf-prop">🍎</span><span class="bf-prop2">🥛</span></div>'});html=html.replace(/<svg class="bf-food-svg"[\s\S]*?<\/svg>/g,svg=>{const m=svg.match(/<text[^>]*>([\s\S]*?)<\/text>/),icon=m?m[1]:'🍽️',p=POS[icon]??9;return '<div class="bf-food-art bf-food-'+p+'" aria-hidden="true"></div>'});return html}
function install(){if(typeof bodyHtml!=='function'||bodyHtml.__breakfastNoSvgWrapped)return false;const base=bodyHtml;const wrapped=function(card,info){const out=base(card,info);return card&&card.appId==='breakfast'?replaceSvg(out):out};wrapped.__breakfastNoSvgWrapped=true;bodyHtml=wrapped;return true}
function style(){if(document.getElementById('breakfastNoSvgArtCss'))return;const s=document.createElement('style');s.id='breakfastNoSvgArtCss';s.textContent=`
.bf-comic-svg,.bf-food-svg{display:none!important}
.bf-rasterlike-comic{position:relative;width:100%;height:100%;min-height:86px;border-radius:18px;overflow:hidden;background:linear-gradient(145deg,#dff5ff,#fff2c9)}
.bf-rasterlike-comic .bf-face{position:absolute;right:24%;bottom:5%;font-size:58px}.bf-rasterlike-comic .bf-prop{position:absolute;right:3%;bottom:7%;font-size:33px}.bf-rasterlike-comic .bf-prop2{position:absolute;left:6%;bottom:8%;font-size:29px}.bf-rasterlike-comic .bf-sun-art{position:absolute;left:8%;top:10%;font-size:25px}
.bf-food-art{width:100%;aspect-ratio:45/28;height:auto!important;border-radius:12px;background-image:url('${SPRITE}');background-size:500% 200%;background-repeat:no-repeat;background-color:#f7fbfd;box-shadow:inset 0 0 0 1px rgba(92,141,168,.10);opacity:0;transition:opacity .16s ease;contain:paint;image-rendering:auto;background-clip:padding-box;overflow:hidden}
.bf-sprite-ready .bf-food-art{opacity:1}${Array.from({length:10},(_,i)=>`.bf-food-${i}{background-position:${(i%5)*25}% ${i<5?0:100}%}`).join('')}
.bf-meal{content-visibility:auto;contain-intrinsic-size:180px 220px}.bf-meal-main .bf-food-art{margin-bottom:7px}.bf-my-hero .bf-food-art{width:min(100%,220px);justify-self:center}
@media(min-width:1180px){.breakfast-widget{grid-template-columns:minmax(0,1fr) 220px!important}.bf-meal-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}.bf-week-grid{grid-template-columns:repeat(7,minmax(0,1fr))!important}.bf-food-art{max-height:132px}.bf-today{position:sticky;top:8px}}
@media(min-width:760px) and (max-width:1179px){.breakfast-widget{grid-template-columns:1fr!important}.bf-main,.bf-today{grid-column:1!important}.bf-meal-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.bf-week-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.bf-today{grid-template-columns:110px 1fr;align-items:center}.bf-today-art{height:92px!important}}
@media(min-width:560px) and (max-width:759px){.breakfast-widget{grid-template-columns:1fr!important;padding:7px!important}.bf-main,.bf-today{grid-column:1!important}.bf-meal-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.bf-week-grid{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;gap:8px!important;padding-bottom:6px}.bf-day{min-width:160px;scroll-snap-align:start}.bf-today-art{display:none!important}}
@media(max-width:559px){.breakfast-widget{grid-template-columns:1fr!important;padding:6px!important;gap:8px!important}.bf-main,.bf-today{grid-column:1!important}.bf-hero{min-height:76px!important;padding:8px 10px!important}.bf-hero-comic{width:82px!important;height:70px!important}.bf-rasterlike-comic .bf-face{font-size:42px}.bf-title strong{font-size:15px!important}.bf-title small{font-size:9px!important}.bf-tabs,.bf-filters{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;scrollbar-width:none;padding-bottom:3px}.bf-tabs::-webkit-scrollbar,.bf-filters::-webkit-scrollbar{display:none}.bf-tabs button,.bf-filters button{white-space:nowrap}.bf-meal-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}.bf-meal-main{padding:6px 7px 9px!important}.bf-meal-main strong{font-size:11px!important}.bf-meal-main small{font-size:9px!important}.bf-meal-main em{gap:2px!important}.bf-meal-main em i{font-size:7px!important;padding:2px 4px!important}.bf-food-art{border-radius:10px}.bf-week-grid{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;gap:8px!important;padding-bottom:6px}.bf-day{min-width:148px;scroll-snap-align:start}.bf-nutrition-bars{grid-template-columns:1fr!important}.bf-my-hero{grid-template-columns:1fr!important}.bf-today-art{display:none!important}.bf-today{padding:9px!important}.bf-calendar{gap:3px!important}.bf-cal-day{border-radius:7px!important}}
@media(max-width:359px){.bf-meal-grid{grid-template-columns:1fr!important}.bf-hero-comic{display:none!important}}
`;document.head.appendChild(s)}
function refresh(){preloadSprite();const ok=install();style();if(ok&&typeof renderDesktop==='function')renderDesktop()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();setTimeout(refresh,0);window.WebDeskBreakfastNoSvgArt={version:VERSION,noSvg:true,rasterFoodArt:true,preloadDecode:true,responsive:true,crispRendering:true};
})();