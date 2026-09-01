(()=>{'use strict';
const VER='20260901-maydayland-mobile-ux-v123.1';
if(window.__maydaylandMobileUx===VER)return;window.__maydaylandMobileUx=VER;
function installStyle(){if(document.getElementById('maydaylandMobileUx1231'))return;const s=document.createElement('style');s.id='maydaylandMobileUx1231';s.textContent=`
@media(max-width:760px){
  .top{position:sticky;top:0;z-index:50;background:rgba(5,9,18,.9);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
  .top .wrap.top-in{width:100%;padding:8px 12px;display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-areas:'brand brand' 'nav nav';gap:8px}
  .top .brand{grid-area:brand;min-width:0}.top .brand small{font-size:10px}.top .perf{display:none!important}
  .top .nav{grid-area:nav;display:flex!important;gap:6px;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;scrollbar-width:none;padding:2px 0 4px;-webkit-overflow-scrolling:touch}
  .top .nav::-webkit-scrollbar{display:none}.top .nav button{flex:0 0 auto;min-height:36px;padding:0 12px;border-radius:999px;scroll-snap-align:center;white-space:nowrap;font-size:12px}
  .hero{padding-top:18px!important;gap:14px!important}.hero-copy h1{font-size:clamp(34px,10vw,50px)!important}.hero-copy p{font-size:14px;line-height:1.65}.hero-actions{gap:8px}.hero-actions button{min-height:40px}
  .score{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.score>div{min-width:0}
  .main{grid-template-columns:1fr!important;gap:12px!important}.main>.panel{min-width:0}.city-panel{order:3}
  .map-card{overflow:hidden}.map-stage{min-height:430px}.legend{overflow-x:auto;flex-wrap:nowrap!important;scrollbar-width:none;-webkit-overflow-scrolling:touch}.legend::-webkit-scrollbar{display:none}.legend span{flex:0 0 auto}
  .page{scroll-margin-top:118px}.grid{grid-template-columns:1fr!important}
  .record-head{align-items:start}.record-head h2{font-size:clamp(32px,9vw,46px)!important}.room-badge{justify-self:start}
}
@media(max-width:480px){
  .top .wrap.top-in{padding-left:max(10px,env(safe-area-inset-left));padding-right:max(10px,env(safe-area-inset-right))}
  .top .brand .mark{width:34px;height:34px}.top .brand b{font-size:13px}
  .hero-actions{display:grid!important;grid-template-columns:1fr 1fr}.hero-actions .primary{grid-column:1/-1}
  .map-stage{min-height:380px}.city-btn{font-size:10px!important;padding:5px 7px!important}
}
@media(prefers-reduced-motion:reduce){.top .nav{scroll-behavior:auto!important}.cd-case,.drawer-card{transition:none!important}}
`;document.head.appendChild(s)}
function activeNav(){return document.querySelector('.top .nav [data-page].active')||document.querySelector('.top .nav [data-page][aria-current="page"]')}
function centerNav(){const el=activeNav();if(!el)return;try{el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'center'})}catch(e){}}
function syncA11y(){document.querySelectorAll('.top .nav [data-page]').forEach(btn=>{if(btn.classList.contains('active'))btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current')});centerNav()}
function boot(){installStyle();syncA11y();window.addEventListener('hashchange',()=>requestAnimationFrame(syncA11y));document.addEventListener('click',e=>{if(e.target.closest('[data-page]'))setTimeout(syncA11y,0)},true);const app=document.getElementById('app');if(app)new MutationObserver(m=>{if(m.some(x=>x.type==='attributes'&&x.attributeName==='class'))requestAnimationFrame(syncA11y)}).observe(app,{subtree:true,attributes:true,attributeFilter:['class']});document.documentElement.dataset.maydaylandMobileUx='v123.1'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();