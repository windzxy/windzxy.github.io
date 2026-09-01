(()=>{'use strict';
const VER='20260901-maydayland-mobile-ux-v123.4-perf';
if(window.__maydaylandMobileUx===VER)return;window.__maydaylandMobileUx=VER;
function install(){if(document.getElementById('maydaylandMobileUx1234'))return;const s=document.createElement('style');s.id='maydaylandMobileUx1234';s.textContent=`
@media(max-width:760px){
 html{scroll-padding-top:108px}body{padding-bottom:max(0px,env(safe-area-inset-bottom))}
 .top{position:sticky;top:0;z-index:50;background:rgba(5,9,18,.94);border-bottom:1px solid rgba(255,255,255,.055)}
 @supports(backdrop-filter:blur(1px)){.top{backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}}
 .top .wrap.top-in{width:100%;padding:8px 12px;display:grid;grid-template-areas:'brand' 'nav';gap:7px}.top .brand{grid-area:brand;min-width:0}.top .brand small{font-size:10px}.top .perf{display:none!important}
 .top .nav{grid-area:nav;display:flex!important;gap:6px;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;scrollbar-width:none;padding:2px 8px 4px;-webkit-overflow-scrolling:touch;touch-action:pan-x}
 .top .nav::-webkit-scrollbar{display:none}.top .nav button{flex:0 0 auto;min-height:40px;padding:0 13px;border-radius:999px;scroll-snap-align:center;white-space:nowrap;font-size:12px}
 .top .nav button.active,.top .nav button[aria-current='page']{background:linear-gradient(135deg,rgba(255,211,106,.18),rgba(65,141,255,.14));border-color:rgba(255,211,106,.3);color:#fff}
 .hero{padding-top:16px!important;gap:12px!important}.hero-copy h1{font-size:clamp(34px,10vw,50px)!important}.hero-copy p{font-size:14px;line-height:1.62}.hero-actions{gap:8px}.hero-actions button{min-height:42px}
 .score{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.main{grid-template-columns:1fr!important;gap:12px!important}.main>.panel{min-width:0}.city-panel{order:3}
 .map-card{overflow:hidden}.map-stage{min-height:390px}.legend{overflow-x:auto;flex-wrap:nowrap!important;scrollbar-width:none;-webkit-overflow-scrolling:touch}.legend::-webkit-scrollbar{display:none}.legend span{flex:0 0 auto}
 .page{scroll-margin-top:108px}.page:not(.active){content-visibility:hidden;contain-intrinsic-size:1px}.page.active{content-visibility:auto}.grid{grid-template-columns:1fr!important}
 .record-head{align-items:start}.record-head h2{font-size:clamp(32px,9vw,46px)!important}.room-badge{justify-self:start}.track-list li{min-height:44px;align-items:center}
}
@media(max-width:620px){
 .top .wrap.top-in{padding-left:max(10px,env(safe-area-inset-left));padding-right:max(10px,env(safe-area-inset-right))}.top .brand .mark{width:34px;height:34px}.top .brand b{font-size:13px}
 .hero-actions{display:grid!important;grid-template-columns:1fr 1fr}.hero-actions .primary{grid-column:1/-1}.map-stage{min-height:360px}.city-btn{font-size:10px!important;padding:5px 7px!important}
 .album-drawer{display:flex!important;align-items:flex-end;overflow:hidden;background:rgba(1,4,9,.84)}.drawer-card{width:100%;min-height:0!important;height:min(92dvh,820px);margin:0!important;padding:8px 18px max(28px,calc(env(safe-area-inset-bottom) + 18px))!important;display:block;border-radius:24px 24px 0 0!important;border-top:1px solid rgba(255,255,255,.12);box-shadow:0 -18px 48px rgba(0,0,0,.36);transform:translateY(28px)!important;transition:transform .18s ease!important}.album-drawer.open .drawer-card{transform:none!important}
 .drawer-card:before{content:'';display:block;width:42px;height:4px;margin:2px auto 8px;border-radius:999px;background:rgba(255,255,255,.2)}.drawer-close{position:sticky!important;top:8px!important;right:auto!important;margin-left:auto!important;display:grid!important;place-items:center!important;z-index:8!important;width:44px!important;height:44px!important;background:rgba(8,16,28,.94)!important;box-shadow:0 6px 18px rgba(0,0,0,.24)}
 .disc-stage{width:min(58vw,240px)!important;margin:-28px auto 12px!important}.drawer-copy h2{font-size:clamp(31px,9vw,40px)!important;margin-top:6px!important}.drawer-copy>p{font-size:13px;line-height:1.6}.album-meta{margin:12px 0!important}.track-head{margin-top:18px!important}.track-list li{padding:11px 4px!important;font-size:13px!important}
}
@media(orientation:landscape) and (max-height:520px){.top .wrap.top-in{grid-template-areas:'brand nav';grid-template-columns:auto minmax(0,1fr);align-items:center}.hero{padding-top:10px!important}.page{scroll-margin-top:68px}.drawer-card{height:94dvh!important}.disc-stage{width:min(30vw,190px)!important;float:left;margin:0 18px 12px 0!important}}
@media(prefers-reduced-motion:reduce){.top .nav{scroll-behavior:auto!important}.top .nav button,.cd-case,.drawer-card{transition:none!important}}
`;document.head.appendChild(s)}
function active(){return document.querySelector('.top .nav [data-page].active')}
function sync(center=false){document.querySelectorAll('.top .nav [data-page]').forEach(btn=>{if(btn.classList.contains('active'))btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current')});const el=active();if(center&&el)try{el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'center'})}catch(e){}}
let raf=0;function queue(center=false){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>sync(center))}
function boot(){install();queue(false);window.addEventListener('hashchange',()=>queue(true));window.addEventListener('pageshow',()=>queue(false),{once:true});let rt=0;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>queue(false),120)},{passive:true});document.addEventListener('click',e=>{if(e.target.closest?.('[data-page]'))setTimeout(()=>queue(true),0)},true);document.documentElement.dataset.maydaylandMobileUx='v123.4';window.MAYDAYLAND_MOBILE_UX={version:'v123.4',observer:false,performanceMode:true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();