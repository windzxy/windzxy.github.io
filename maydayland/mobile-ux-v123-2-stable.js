(()=>{'use strict';
const VER='20260901-maydayland-mobile-ux-v123.2-stable';
if(window.__maydaylandMobileUx===VER)return;window.__maydaylandMobileUx=VER;
function installStyle(){if(document.getElementById('maydaylandMobileUx1232'))return;const s=document.createElement('style');s.id='maydaylandMobileUx1232';s.textContent=`
@media(max-width:760px){
  html{scroll-padding-top:116px}body{padding-bottom:max(0px,env(safe-area-inset-bottom))}
  .top{position:sticky;top:0;z-index:50;background:rgba(5,9,18,.9);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.055)}
  .top .wrap.top-in{width:100%;padding:8px 12px;display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-areas:'brand brand' 'nav nav';gap:8px}
  .top .brand{grid-area:brand;min-width:0}.top .brand small{font-size:10px}.top .perf{display:none!important}
  .top .nav{grid-area:nav;display:flex!important;gap:6px;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;scrollbar-width:none;padding:2px 0 5px;-webkit-overflow-scrolling:touch;touch-action:pan-x}
  .top .nav::-webkit-scrollbar{display:none}.top .nav button{flex:0 0 auto;min-height:40px;padding:0 13px;border-radius:999px;scroll-snap-align:center;white-space:nowrap;font-size:12px;transition:background .16s ease,border-color .16s ease,box-shadow .16s ease,transform .16s ease}
  .top .nav button.active,.top .nav button[aria-current='page']{background:linear-gradient(135deg,rgba(255,211,106,.2),rgba(65,141,255,.16));border-color:rgba(255,211,106,.32);box-shadow:0 6px 18px rgba(0,0,0,.18),inset 0 0 0 1px rgba(255,255,255,.04);color:#fff}
  .top .nav button:active{transform:scale(.97)}
  .hero{padding-top:18px!important;gap:14px!important}.hero-copy h1{font-size:clamp(34px,10vw,50px)!important}.hero-copy p{font-size:14px;line-height:1.65}.hero-actions{gap:8px}.hero-actions button{min-height:42px}
  .score{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.score>div{min-width:0}
  .main{grid-template-columns:1fr!important;gap:12px!important}.main>.panel{min-width:0}.city-panel{order:3}
  .map-card{overflow:hidden}.map-stage{min-height:430px}.legend{overflow-x:auto;flex-wrap:nowrap!important;scrollbar-width:none;-webkit-overflow-scrolling:touch}.legend::-webkit-scrollbar{display:none}.legend span{flex:0 0 auto}
  .page{scroll-margin-top:116px}.grid{grid-template-columns:1fr!important}
  .record-head{align-items:start}.record-head h2{font-size:clamp(32px,9vw,46px)!important}.room-badge{justify-self:start}
}
@media(max-width:480px){
  .top .wrap.top-in{padding-left:max(10px,env(safe-area-inset-left));padding-right:max(10px,env(safe-area-inset-right))}
  .top .brand .mark{width:34px;height:34px}.top .brand b{font-size:13px}
  .hero-actions{display:grid!important;grid-template-columns:1fr 1fr}.hero-actions .primary{grid-column:1/-1}
  .map-stage{min-height:380px}.city-btn{font-size:10px!important;padding:5px 7px!important}
}
@media(orientation:landscape) and (max-height:520px){.top .wrap.top-in{grid-template-areas:'brand nav';grid-template-columns:auto minmax(0,1fr);align-items:center}.top .brand{grid-area:brand}.top .nav{grid-area:nav}.hero{padding-top:10px!important}.page{scroll-margin-top:72px}}
@media(prefers-reduced-motion:reduce){.top .nav{scroll-behavior:auto!important}.top .nav button,.cd-case,.drawer-card{transition:none!important}}
`;document.head.appendChild(s)}
function activeNav(){return document.querySelector('.top .nav [data-page].active')||document.querySelector('.top .nav [data-page][aria-current="page"]')}
function centerNav(behavior){const el=activeNav();if(!el)return;try{el.scrollIntoView({behavior:behavior||'auto',block:'nearest',inline:'center'})}catch(e){}}
function syncA11y(behavior){document.querySelectorAll('.top .nav [data-page]').forEach(btn=>{if(btn.classList.contains('active'))btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current')});centerNav(behavior)}
let syncQueued=false;function scheduleSync(smooth=false){if(syncQueued)return;syncQueued=true;requestAnimationFrame(()=>{syncQueued=false;syncA11y(smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto')})}
function boot(){installStyle();scheduleSync(false);window.addEventListener('hashchange',()=>scheduleSync(true));window.addEventListener('pageshow',()=>scheduleSync(false));window.addEventListener('resize',()=>scheduleSync(false),{passive:true});document.addEventListener('click',e=>{if(e.target.closest('[data-page]'))setTimeout(()=>scheduleSync(true),0)},true);const app=document.getElementById('app');if(app)new MutationObserver(m=>{if(m.some(x=>x.type==='attributes'&&x.attributeName==='class'))scheduleSync(false)}).observe(app,{subtree:true,attributes:true,attributeFilter:['class']});document.documentElement.dataset.maydaylandMobileUx='v123.2'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();