(()=>{
'use strict';
const VERSION='20260913-flight-chess-visual-v4.0-premium';
if(window.__webdeskFlightChessVisualV4===VERSION)return;
window.__webdeskFlightChessVisualV4=VERSION;

function installStyle(){
 if(document.getElementById('flightChessVisualV4Style'))return;
 const s=document.createElement('style');
 s.id='flightChessVisualV4Style';
 s.textContent=`
 .flight3-app{--f3-glass:rgba(255,255,255,.76);--f3-line:rgba(32,43,63,.12)}
 .flight3-app .flight3-board-wrap,.flight3-app .flight3-board,.flight3-app .flight3-stage{background:linear-gradient(145deg,rgba(255,255,255,.95),rgba(246,249,255,.86));border:1px solid rgba(255,255,255,.72);box-shadow:0 26px 70px rgba(36,52,84,.18),inset 0 1px 0 rgba(255,255,255,.9);border-radius:28px!important;padding:14px!important;position:relative;overflow:hidden}
 .flight3-app .flight3-board-wrap:before,.flight3-app .flight3-board:before,.flight3-app .flight3-stage:before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 25% 18%,rgba(255,255,255,.88),transparent 38%),linear-gradient(135deg,rgba(91,134,255,.04),rgba(255,121,121,.03));z-index:0}
 .flight3-svg{position:relative;z-index:1;filter:drop-shadow(0 8px 18px rgba(25,39,72,.10));overflow:visible}
 .flight3-svg .f3-cell{stroke:rgba(38,52,79,.16)!important;stroke-width:1.2!important;filter:drop-shadow(0 2px 2px rgba(28,42,69,.09));transition:transform .18s ease,filter .18s ease}
 .flight3-svg .f3-cell.safe{stroke-width:1.7!important;filter:drop-shadow(0 2px 3px rgba(28,42,69,.12))}
 .flight3-svg .f3-safe{font-size:11px!important;font-weight:800;fill:rgba(51,65,85,.7)!important}
 .flight3-svg .f3-base-title{font-weight:900!important;font-size:13px!important;letter-spacing:.08em}
 .flight3-svg .f3-runway-label{font-weight:900!important;font-size:11px!important;fill:rgba(18,31,52,.66)!important}
 .flight3-svg .flight3-plane{cursor:pointer;transform-box:fill-box;transform-origin:center;filter:drop-shadow(0 5px 5px rgba(24,35,56,.24));transition:filter .18s ease}
 .flight3-svg .flight3-plane.movable{filter:drop-shadow(0 0 8px rgba(255,255,255,.95)) drop-shadow(0 0 10px rgba(69,139,255,.6));animation:f3v4Ready 1s ease-in-out infinite alternate}
 @keyframes f3v4Ready{from{opacity:.9}to{opacity:1}}
 .flight3-app .flight3-console,.flight3-app .flight3-side,.flight3-app .flight3-panel{background:linear-gradient(160deg,rgba(255,255,255,.86),rgba(247,250,255,.76))!important;border:1px solid rgba(255,255,255,.74)!important;box-shadow:0 18px 44px rgba(33,48,77,.12)!important;border-radius:24px!important;backdrop-filter:blur(18px)}
 .flight3-app button{transition:transform .15s ease,box-shadow .15s ease,filter .15s ease}
 .flight3-app button:active{transform:scale(.97)}
 .flight3-app [data-flight3-roll],.flight3-app .flight3-dice{box-shadow:0 12px 26px rgba(47,94,196,.20)!important;border-radius:20px!important}
 @media(max-width:820px){.flight3-app .flight3-board-wrap,.flight3-app .flight3-board,.flight3-app .flight3-stage{padding:8px!important;border-radius:22px!important}.flight3-svg{width:100%!important;height:auto!important}.flight3-app .flight3-console,.flight3-app .flight3-side,.flight3-app .flight3-panel{border-radius:20px!important}}
 @media(prefers-reduced-motion:reduce){.flight3-svg .flight3-plane.movable{animation:none!important}.flight3-app *{scroll-behavior:auto!important}}
 `;
 document.head.appendChild(s);
}

function enhanceSvg(svg){
 if(!svg||svg.dataset.v4Premium==='1')return;
 svg.dataset.v4Premium='1';
 const ns='http://www.w3.org/2000/svg';
 let defs=svg.querySelector('defs');
 if(!defs){defs=document.createElementNS(ns,'defs');svg.prepend(defs)}
 if(!svg.querySelector('#f3v4PlaneGloss')){
   const grad=document.createElementNS(ns,'linearGradient');grad.id='f3v4PlaneGloss';grad.setAttribute('x1','0');grad.setAttribute('y1','0');grad.setAttribute('x2','0');grad.setAttribute('y2','1');
   const a=document.createElementNS(ns,'stop');a.setAttribute('offset','0');a.setAttribute('stop-color','#ffffff');a.setAttribute('stop-opacity','.95');
   const b=document.createElementNS(ns,'stop');b.setAttribute('offset','.55');b.setAttribute('stop-color','#ffffff');b.setAttribute('stop-opacity','.25');
   const c=document.createElementNS(ns,'stop');c.setAttribute('offset','1');c.setAttribute('stop-color','#ffffff');c.setAttribute('stop-opacity','0');
   grad.append(a,b,c);defs.appendChild(grad);
 }
 const board=document.createElementNS(ns,'g');board.setAttribute('class','f3v4-board-decor');board.setAttribute('pointer-events','none');
 board.innerHTML=`<circle cx="300" cy="300" r="48" fill="rgba(255,255,255,.94)" stroke="rgba(37,51,77,.12)" stroke-width="2"/><circle cx="300" cy="300" r="34" fill="none" stroke="rgba(37,51,77,.08)" stroke-width="10"/><path d="M278 300h44M300 278v44" stroke="rgba(37,51,77,.15)" stroke-width="2" stroke-linecap="round"/><text x="300" y="306" text-anchor="middle" font-size="12" font-weight="900" fill="rgba(32,43,63,.72)">FINISH</text>`;
 svg.appendChild(board);
 svg.querySelectorAll('.flight3-plane').forEach((g)=>{
   if(g.dataset.v4Plane==='1')return;g.dataset.v4Plane='1';
   const ring=document.createElementNS(ns,'ellipse');ring.setAttribute('cx','0');ring.setAttribute('cy','13');ring.setAttribute('rx','17');ring.setAttribute('ry','7');ring.setAttribute('fill','rgba(20,31,49,.15)');ring.setAttribute('filter','blur(1px)');g.insertBefore(ring,g.firstChild);
   const gloss=document.createElementNS(ns,'ellipse');gloss.setAttribute('cx','-4');gloss.setAttribute('cy','-6');gloss.setAttribute('rx','9');gloss.setAttribute('ry','5');gloss.setAttribute('fill','url(#f3v4PlaneGloss)');gloss.setAttribute('pointer-events','none');g.appendChild(gloss);
 });
}

function scan(root=document){
 root.querySelectorAll?.('.flight3-svg').forEach(enhanceSvg);
}
function boot(){installStyle();scan(document);const host=document.getElementById('desktopCanvas');if(host){let raf=0;new MutationObserver(ms=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)scan(n)})}).observe(host,{childList:true,subtree:true})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskFlightChessVisualV4={version:VERSION,premiumBoard:true,premiumPlanes:true,scopedObserver:true};
})();