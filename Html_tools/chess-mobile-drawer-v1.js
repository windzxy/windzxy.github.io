(()=>{
'use strict';
const VERSION='20260912-chess-mobile-drawer-v1.0';
if(window.__webdeskChessMobileDrawer===VERSION)return;
window.__webdeskChessMobileDrawer=VERSION;

function installStyle(){
  if(document.getElementById('chess-mobile-drawer-v1-style')) return;
  const s=document.createElement('style');
  s.id='chess-mobile-drawer-v1-style';
  s.textContent=`
  .chess-mobile-menu-btn,.chess-mobile-drawer-backdrop{display:none}
  @media (max-width: 820px){
    .chess-app,.xq-app{position:relative!important;overflow:visible!important}
    .chess-app .boardgame-main,.xq-app .xq-main{display:block!important;grid-template-columns:1fr!important}
    .chess-app .boardgame-side,.xq-app .xq-side{
      position:fixed!important;
      top:max(70px,env(safe-area-inset-top))!important;
      right:10px!important;
      bottom:max(12px,env(safe-area-inset-bottom))!important;
      width:min(86vw,360px)!important;
      max-width:360px!important;
      height:auto!important;
      max-height:calc(100dvh - 92px - env(safe-area-inset-bottom))!important;
      overflow:auto!important;
      overscroll-behavior:contain!important;
      z-index:10021!important;
      transform:translateX(calc(100% + 24px))!important;
      opacity:0!important;
      visibility:hidden!important;
      pointer-events:none!important;
      transition:transform .24s cubic-bezier(.2,.8,.2,1),opacity .2s ease,visibility .2s!important;
      border-radius:18px!important;
      box-shadow:0 18px 50px rgba(0,0,0,.42)!important;
      backdrop-filter:blur(18px) saturate(1.25)!important;
      -webkit-backdrop-filter:blur(18px) saturate(1.25)!important;
    }
    .chess-app.mobile-menu-open .boardgame-side,.xq-app.mobile-menu-open .xq-side{
      transform:translateX(0)!important;
      opacity:1!important;
      visibility:visible!important;
      pointer-events:auto!important;
    }
    .chess-mobile-menu-btn{
      display:flex!important;
      position:fixed!important;
      right:max(14px,env(safe-area-inset-right))!important;
      bottom:max(18px,calc(env(safe-area-inset-bottom) + 12px))!important;
      width:54px!important;height:54px!important;
      border:1px solid rgba(255,255,255,.2)!important;
      border-radius:18px!important;
      align-items:center!important;justify-content:center!important;
      z-index:10023!important;
      background:linear-gradient(145deg,rgba(28,48,84,.96),rgba(14,24,42,.97))!important;
      color:#fff!important;
      font-size:24px!important;
      box-shadow:0 10px 30px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.15)!important;
      cursor:pointer!important;
      touch-action:manipulation!important;
    }
    .xq-app .chess-mobile-menu-btn{background:linear-gradient(145deg,rgba(115,41,28,.96),rgba(48,19,16,.98))!important}
    .chess-mobile-menu-btn:active{transform:scale(.94)!important}
    .chess-mobile-drawer-backdrop{
      position:fixed!important;inset:0!important;z-index:10020!important;
      background:rgba(3,8,15,.48)!important;
      backdrop-filter:blur(2px)!important;-webkit-backdrop-filter:blur(2px)!important;
    }
    .chess-app.mobile-menu-open .chess-mobile-drawer-backdrop,.xq-app.mobile-menu-open .chess-mobile-drawer-backdrop{display:block!important}
    .chess-app .boardgame-board-wrap,.xq-app .xq-board{max-width:100%!important}
    body.chess-mobile-drawer-lock{overflow:hidden!important}
  }
  `;
  document.head.appendChild(s);
}

function close(app){
  if(!app)return;
  app.classList.remove('mobile-menu-open');
  const btn=app.querySelector('.chess-mobile-menu-btn');
  if(btn){btn.setAttribute('aria-expanded','false');btn.textContent='☰'}
  if(!document.querySelector('.chess-app.mobile-menu-open,.xq-app.mobile-menu-open'))document.body.classList.remove('chess-mobile-drawer-lock');
}
function toggle(app){
  if(!app)return;
  const open=!app.classList.contains('mobile-menu-open');
  document.querySelectorAll('.chess-app.mobile-menu-open,.xq-app.mobile-menu-open').forEach(x=>{if(x!==app)close(x)});
  app.classList.toggle('mobile-menu-open',open);
  const btn=app.querySelector('.chess-mobile-menu-btn');
  if(btn){btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'×':'☰'}
  document.body.classList.toggle('chess-mobile-drawer-lock',open);
}
function enhance(app){
  if(!app||app.dataset.mobileDrawerReady==='1')return;
  const side=app.querySelector('.boardgame-side,.xq-side');
  if(!side)return;
  app.dataset.mobileDrawerReady='1';
  side.id=side.id||('chess-mobile-side-'+Math.random().toString(36).slice(2,8));
  const backdrop=document.createElement('button');
  backdrop.type='button';backdrop.className='chess-mobile-drawer-backdrop';backdrop.setAttribute('aria-label','關閉選單');
  const btn=document.createElement('button');
  btn.type='button';btn.className='chess-mobile-menu-btn';btn.textContent='☰';
  btn.setAttribute('aria-label','開啟棋類功能選單');btn.setAttribute('aria-controls',side.id);btn.setAttribute('aria-expanded','false');
  app.appendChild(backdrop);app.appendChild(btn);
  btn.addEventListener('click',e=>{e.stopPropagation();toggle(app)});
  backdrop.addEventListener('click',()=>close(app));
  side.addEventListener('click',e=>{if(matchMedia('(max-width:820px)').matches&&e.target.closest('button,[data-xq-mode],[data-chess-mode]'))setTimeout(()=>close(app),80)});
}
function scan(){document.querySelectorAll('.chess-app,.xq-app').forEach(enhance)}
function boot(){installStyle();scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});window.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.chess-app.mobile-menu-open,.xq-app.mobile-menu-open').forEach(close)});window.addEventListener('resize',()=>{if(innerWidth>820)document.querySelectorAll('.chess-app,.xq-app').forEach(close)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskChessMobileDrawer={version:VERSION};
})();