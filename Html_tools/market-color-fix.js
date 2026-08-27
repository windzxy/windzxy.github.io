(function(){
  if(window.__windzxyMarketColorFixLoaded)return;
  window.__windzxyMarketColorFixLoaded=1;
  const VER='20260827-market-color13-loader-perf';

  function loadScriptOnce(src,attr){
    if(document.querySelector('script['+attr+']'))return;
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.setAttribute(attr,'1');
    document.body.appendChild(s);
  }
  function ensureCalendarV3(){if(!window.__windzxyCalendarWidgetV3Loaded)loadScriptOnce('Html_tools/calendar-widget-v3.js?v=20260826-calendar-widget-v3-unified-product','data-windzxy-calendar-v3-loader');}
  function ensureCalendarResponsiveFix(){if(!window.__windzxyCalendarV3ResponsiveFixLoaded)loadScriptOnce('Html_tools/calendar-v3-responsive-fix.js?v=20260827-calendar-v3-responsive-fix1-narrow-card','data-windzxy-calendar-v3-responsive-loader');}
  function ensureCalendarProductPolish(){if(!window.__windzxyCalendarV3ProductPolishLoadedV2)loadScriptOnce('Html_tools/calendar-v3-product-polish.js?v=20260827-calendar-v3-product-polish2-perf','data-windzxy-calendar-v3-product-polish-loader');}
  function ensureCalendarSelectYearFix(){if(!window.__windzxyCalendarV3SelectYearFixLoadedV2)loadScriptOnce('Html_tools/calendar-v3-select-year-fix.js?v=20260827-calendar-v3-select-year-fix2-perf','data-windzxy-calendar-v3-select-year-fix-loader');}
  function ensureImageStudioV3(){if(!window.__windzxyImageStudioV3Loaded)loadScriptOnce('Html_tools/image-studio-v2.js?v=20260827-image-studio-v3-studio-shell','data-windzxy-image-studio-v3-loader');}
  function ensureWorkspaceGuard(){if(!window.__windzxyWorkspaceCoreGuardLoaded)loadScriptOnce('Html_tools/workspace-core-guard.js?v=20260826-workspace-core-guard2-no-unapproved-cards','data-windzxy-workspace-guard-loader');}
  function ensureTyphoonLoader(){if(!window.__windzxyTyphoonWidgetLoaded)loadScriptOnce('Html_tools/typhoon-widget.js?v=20260821-typhoon-widget3-map-first-pm','data-windzxy-typhoon-loader');}
  function num(text){const v=parseFloat(String(text||'').replace(/[,%+\s]/g,''));return Number.isFinite(v)?v:null;}
  function setTrend(el,trend){if(!el)return;el.classList.toggle('market-up',trend==='up');el.classList.toggle('market-down',trend==='down');el.classList.toggle('market-flat',trend==='flat');}
  function scanOne(widget){const pct=num(widget.querySelector('[data-active-pct]')?.textContent);const chg=num(widget.querySelector('[data-active-change]')?.textContent);const v=Number.isFinite(pct)?pct:chg;const trend=v>0?'up':v<0?'down':'flat';setTrend(widget,trend);widget.classList.toggle('up',trend==='up');widget.classList.toggle('down',trend==='down');widget.classList.toggle('flat',trend==='flat');const active=widget.querySelector('.md-tabs button.on');setTrend(active,trend);widget.querySelectorAll('[data-active-price],[data-active-change],[data-active-pct]').forEach(el=>setTrend(el,trend));}
  function scan(){document.querySelectorAll('.metals-widget.mdesk').forEach(scanOne);}
  let scanTimer=null;function scheduleScan(delay=240){clearTimeout(scanTimer);scanTimer=setTimeout(scan,delay);}
  function install(){
    ensureCalendarV3();ensureCalendarResponsiveFix();ensureCalendarProductPolish();ensureCalendarSelectYearFix();ensureImageStudioV3();ensureWorkspaceGuard();
    if(!document.getElementById('windzxyMarketColorFixStyle')){
      const s=document.createElement('style');s.id='windzxyMarketColorFixStyle';s.textContent=`
/* CN/HK market convention: red = up, green = down. */
.metals-widget.mdesk{--market-up:#ff4d5e;--market-down:#20d47a;--market-flat:var(--ink)}
.metals-widget.mdesk .md-tabs button small{color:var(--market-flat)!important}
.metals-widget.mdesk .md-tabs button.up small,.metals-widget.mdesk .md-tabs button.market-up small,.metals-widget.mdesk.market-up .md-tabs button.on small{color:var(--market-up)!important}
.metals-widget.mdesk .md-tabs button.down small,.metals-widget.mdesk .md-tabs button.market-down small,.metals-widget.mdesk.market-down .md-tabs button.on small{color:var(--market-down)!important}
.metals-widget.mdesk .md-change b,.metals-widget.mdesk .md-price strong{color:var(--market-flat)!important}
.metals-widget.mdesk.up .md-change b,.metals-widget.mdesk.market-up .md-change b,.metals-widget.mdesk.up .md-price strong,.metals-widget.mdesk.market-up .md-price strong,.metals-widget.mdesk [data-active-price].market-up,.metals-widget.mdesk [data-active-change].market-up,.metals-widget.mdesk [data-active-pct].market-up{color:var(--market-up)!important}
.metals-widget.mdesk.down .md-change b,.metals-widget.mdesk.market-down .md-change b,.metals-widget.mdesk.down .md-price strong,.metals-widget.mdesk.market-down .md-price strong,.metals-widget.mdesk [data-active-price].market-down,.metals-widget.mdesk [data-active-change].market-down,.metals-widget.mdesk [data-active-pct].market-down{color:var(--market-down)!important}
.metals-widget.mdesk .md-range div{background:linear-gradient(90deg,rgba(32,212,122,.28),rgba(255,211,106,.32),rgba(255,77,94,.30))!important}`;document.head.appendChild(s);
    }
    ensureTyphoonLoader();scheduleScan(400);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  setTimeout(()=>{ensureCalendarV3();ensureCalendarResponsiveFix();ensureCalendarProductPolish();ensureCalendarSelectYearFix();ensureImageStudioV3();ensureWorkspaceGuard();},700);
  window.addEventListener('focus',()=>scheduleScan(120),{passive:true});
  document.addEventListener('click',e=>{if(e.target.closest('.metals-widget'))scheduleScan(60);},true);
  window.windzxyMarketColorFixVersion=VER;
})();