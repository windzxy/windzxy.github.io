(()=>{
'use strict';
const V='20260913-flight-chess-v6.1-mobile-stable';
if(window.__webdeskFlightChessMobileStable===V)return;
window.__webdeskFlightChessMobileStable=V;
const MODES={solo:'單人挑戰',duo:'雙人對戰',local:'四人同樂'};
function css(){if(document.getElementById('flightChessMobileStableStyle'))return;const s=document.createElement('style');s.id='flightChessMobileStableStyle';s.textContent=`
.flight3-app{overflow-anchor:none}
.f6-compact-mode{display:none;align-items:center;gap:7px;height:38px;min-height:38px}
.f6-compact-mode span{font-size:10px;font-weight:800;opacity:.55;white-space:nowrap}
.f6-compact-mode select{height:36px;min-width:128px;max-width:180px;border:1px solid rgba(45,58,82,.12);border-radius:11px;background:rgba(255,255,255,.9);color:#263247;padding:0 30px 0 10px;font:800 11px system-ui}
@media(max-width:1180px){.f3-top{min-height:48px!important;align-items:center!important}.f3-top>div:first-child{min-width:0}.f3-top h2{margin-bottom:0!important}.f3-top .f3-modes{display:none!important}.f6-compact-mode{display:flex}.flight6-toolbar{min-height:38px;margin-bottom:6px!important}.flight3-app .f3-board-shell{width:100%;aspect-ratio:1/1;min-height:0;box-sizing:border-box;contain:layout paint}.flight3-app .f3-board{width:100%!important;max-width:min(640px,100%)!important;height:auto!important;margin:auto}.flight3-app .flight5-caption{position:relative!important;bottom:auto!important}}
@media(max-width:980px){.flight3-app .f3-console{display:none!important}.flight3-app .f3-layout{display:block!important;min-height:0!important}.flight3-app .f3-mobile-dock{display:flex!important;position:sticky!important;bottom:8px!important;min-height:58px;box-sizing:border-box}.desktop-card.t-flight-chess{min-width:300px!important;min-height:0!important}.flight3-app{gap:6px!important;padding:8px!important}.flight3-app .flight5-hud{margin:4px 0 6px!important}}
@media(max-width:620px){.f3-top{min-height:42px!important}.f3-eyebrow,.f3-top p{display:none!important}.f3-top h2{font-size:18px!important}.f6-compact-mode{height:36px;min-height:36px}.f6-compact-mode span{display:none}.f6-compact-mode select{min-width:116px;max-width:138px}.flight3-app .f3-board-shell{padding:0!important}.flight6-toolbar{position:absolute;right:8px;top:8px;z-index:20;margin:0!important}.flight6-toolbar button{padding:7px 9px!important}.f3-top{padding-right:82px}.flight3-app .f3-mobile-dock{margin-top:4px!important}}
`;document.head.appendChild(s)}
function modeOf(root){return root.querySelector('[data-flight3-mode].active')?.dataset.flight3Mode||'solo'}
function enhance(root){if(!root||root.querySelector('.f6-compact-mode'))return;const top=root.querySelector('.f3-top');if(!top)return;const wrap=document.createElement('label');wrap.className='f6-compact-mode';wrap.innerHTML='<span>玩法</span><select aria-label="飛行棋玩法">'+Object.entries(MODES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')+'</select>';const select=wrap.querySelector('select');select.value=modeOf(root);select.addEventListener('change',()=>{const btn=root.querySelector(`[data-flight3-mode="${select.value}"]`);if(btn)btn.click()});top.appendChild(wrap)}
function scan(node=document){if(node.matches?.('.flight3-app'))enhance(node);node.querySelectorAll?.('.flight3-app').forEach(enhance)}
function boot(){css();scan();const host=document.getElementById('desktopCanvas');if(!host)return;let raf=0;new MutationObserver(ms=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)scan(n)})}).observe(host,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskFlightChessMobileStable={version:V,compactMode:true,stableBoard:true,tablet:true};
})();
