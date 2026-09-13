(()=>{
'use strict';
const VERSION='20260913-breakfast-no-svg-art-v1.0';
if(window.__windzxyBreakfastNoSvgArt===VERSION)return;
window.__windzxyBreakfastNoSvgArt=VERSION;
function replaceSvg(html){
 let comicIndex=0;
 html=String(html||'').replace(/<svg class="bf-comic-svg"[\s\S]*?<\/svg>/g,()=>{
   comicIndex++;
   return comicIndex===1
     ?'<div class="bf-rasterlike-comic bf-rasterlike-kid" aria-hidden="true"><span class="bf-face">🧒</span><span class="bf-prop">🥣</span><span class="bf-sun-art">☀️</span></div>'
     :'<div class="bf-rasterlike-comic bf-rasterlike-dietitian" aria-hidden="true"><span class="bf-face">👩‍⚕️</span><span class="bf-prop">🍎</span><span class="bf-prop2">🥛</span></div>';
 });
 html=html.replace(/<svg class="bf-food-svg"[\s\S]*?<\/svg>/g,svg=>{
   const m=svg.match(/<text[^>]*>([\s\S]*?)<\/text>/);
   const icon=m?m[1]:'🍽️';
   return '<div class="bf-food-art" aria-hidden="true"><span>'+icon+'</span><i></i><b></b></div>';
 });
 return html;
}
function install(){
 if(typeof bodyHtml!=='function'||bodyHtml.__breakfastNoSvgWrapped)return false;
 const base=bodyHtml;
 const wrapped=function(card,info){
   const out=base(card,info);
   return card&&card.appId==='breakfast'?replaceSvg(out):out;
 };
 wrapped.__breakfastNoSvgWrapped=true;
 bodyHtml=wrapped;
 return true;
}
function style(){
 if(document.getElementById('breakfastNoSvgArtCss'))return;
 const s=document.createElement('style');s.id='breakfastNoSvgArtCss';
 s.textContent=`
 .bf-comic-svg,.bf-food-svg{display:none!important}
 .bf-rasterlike-comic{position:relative;width:100%;height:100%;min-height:86px;border-radius:18px;overflow:hidden;background:radial-gradient(circle at 72% 18%,#fff7b8 0 13%,transparent 14%),linear-gradient(145deg,#dff5ff 0%,#f8fbff 52%,#fff2c9 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.72)}
 .bf-rasterlike-comic .bf-face{position:absolute;right:24%;bottom:5%;font-size:58px;filter:drop-shadow(0 8px 7px rgba(52,94,123,.15))}
 .bf-rasterlike-comic .bf-prop{position:absolute;right:3%;bottom:7%;font-size:33px;transform:rotate(-7deg)}
 .bf-rasterlike-comic .bf-prop2{position:absolute;left:6%;bottom:8%;font-size:29px}
 .bf-rasterlike-comic .bf-sun-art{position:absolute;left:8%;top:10%;font-size:25px}
 .bf-rasterlike-dietitian{background:linear-gradient(160deg,#eef9ff,#fff6dc)}
 .bf-rasterlike-dietitian .bf-face{right:26%;font-size:62px}
 .bf-food-art{height:92px;position:relative;display:grid;place-items:center;border-radius:12px;overflow:hidden;background:linear-gradient(155deg,#fff8dd 0%,#f4fbff 58%,#ecf8ee 100%);box-shadow:inset 0 0 0 1px rgba(92,141,168,.10)}
 .bf-food-art:before{content:'';position:absolute;width:72%;height:24%;bottom:10px;border-radius:50%;background:rgba(58,93,111,.09);filter:blur(1px)}
 .bf-food-art span{position:relative;z-index:2;font-size:50px;filter:drop-shadow(0 8px 5px rgba(64,82,92,.16));transform:translateY(-2px)}
 .bf-food-art i,.bf-food-art b{position:absolute;border-radius:50%;opacity:.75}
 .bf-food-art i{width:17px;height:17px;background:#ffca59;left:14px;top:12px}.bf-food-art b{width:12px;height:12px;background:#8fd5a6;right:13px;bottom:15px}
 .bf-meal-main .bf-food-art{margin-bottom:5px}.bf-my-hero .bf-food-art{height:120px}
 @media(max-width:560px){.bf-rasterlike-comic .bf-face{font-size:46px}.bf-food-art{height:100px}}
 `;
 document.head.appendChild(s);
}
function refresh(){const ok=install();style();if(ok&&typeof renderDesktop==='function')renderDesktop()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();setTimeout(refresh,0);
window.WebDeskBreakfastNoSvgArt={version:VERSION,noSvg:true};
})();