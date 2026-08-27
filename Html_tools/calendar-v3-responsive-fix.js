(function(){
  if(window.__windzxyCalendarV3ResponsiveFixLoaded)return;
  window.__windzxyCalendarV3ResponsiveFixLoaded=1;
  const VER='20260827-calendar-v3-responsive-fix1-narrow-card';
  const STYLE_ID='windzxyCalendarV3ResponsiveFixStyle';
  const OBSERVED=new WeakSet();

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
/* Calendar V3 responsive patch: prevent right panel and controls from overlapping in narrow cards. */
.calendar-v3{box-sizing:border-box;max-width:100%;min-width:0}.calendar-v3 *{box-sizing:border-box}.calendar-v3 input,.calendar-v3 select,.calendar-v3 button{min-width:0;max-width:100%}
.calendar-v3.cv3-r-compact{overflow:auto!important;scrollbar-gutter:stable both-edges;padding-right:2px}.calendar-v3.cv3-r-compact .cv3-body,.calendar-v3.cv3-r-compact .cv3-year-view{display:flex!important;flex-direction:column!important;grid-template-columns:none!important;gap:10px!important;min-height:auto!important;overflow:visible!important;flex:0 0 auto!important}.calendar-v3.cv3-r-compact .cv3-month{min-height:auto!important;overflow:visible!important}.calendar-v3.cv3-r-compact .cv3-grid{min-height:auto!important;overflow:visible!important}.calendar-v3.cv3-r-compact .cv3-events{position:static!important;inset:auto!important;display:block!important;width:auto!important;min-width:0!important;max-width:none!important;max-height:136px!important;overflow:auto!important;margin-top:0!important;grid-column:auto!important;grid-row:auto!important;transform:none!important}.calendar-v3.cv3-r-compact .cv3-year-grid{grid-template-columns:repeat(2,minmax(132px,1fr))!important;max-height:none!important;overflow:visible!important}.calendar-v3.cv3-r-compact .cv3-foot{flex-direction:column;gap:2px}.calendar-v3.cv3-r-compact .cv3-foot em{text-align:left}
.calendar-v3.cv3-r-narrow .cv3-head{align-items:flex-start!important;flex-direction:column!important;gap:8px!important}.calendar-v3.cv3-r-narrow .cv3-title{width:100%}.calendar-v3.cv3-r-narrow .cv3-title strong{font-size:18px!important}.calendar-v3.cv3-r-narrow .cv3-title em{max-width:100%}.calendar-v3.cv3-r-narrow .cv3-nav{width:100%;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.calendar-v3.cv3-r-narrow .cv3-nav button{width:100%;height:34px;padding:0 6px!important;text-align:center}.calendar-v3.cv3-r-narrow .cv3-controls{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:8px!important;align-items:end!important}.calendar-v3.cv3-r-narrow .cv3-controls label{min-width:0!important}.calendar-v3.cv3-r-narrow .cv3-controls label:nth-child(3){grid-column:1/-1}.calendar-v3.cv3-r-narrow .cv3-controls>button{grid-column:1/span 1}.calendar-v3.cv3-r-narrow .cv3-controls .cv3-seg{grid-column:2/span 1;min-width:0}.calendar-v3.cv3-r-narrow .cv3-controls input,.calendar-v3.cv3-r-narrow .cv3-controls select,.calendar-v3.cv3-r-narrow .cv3-controls button{height:34px!important;font-size:14px!important;padding-left:10px!important;padding-right:10px!important;overflow:hidden;text-overflow:ellipsis}.calendar-v3.cv3-r-narrow .cv3-hero{grid-template-columns:auto minmax(0,1fr)!important;gap:10px!important}.calendar-v3.cv3-r-narrow .cv3-hero nav{grid-column:1/-1;justify-content:flex-start}.calendar-v3.cv3-r-narrow .cv3-week,.calendar-v3.cv3-r-narrow .cv3-grid{gap:6px!important}.calendar-v3.cv3-r-narrow .cv3-day{min-height:58px!important;padding:6px!important;border-radius:14px!important}.calendar-v3.cv3-r-narrow .cv3-day strong{font-size:15px!important}.calendar-v3.cv3-r-narrow .cv3-day span{font-size:11px!important}.calendar-v3.cv3-r-narrow .cv3-day div i{font-size:9px!important;padding:1px 5px!important}
.calendar-v3.cv3-r-phone .cv3-title span{display:none}.calendar-v3.cv3-r-phone .cv3-title strong{font-size:17px!important}.calendar-v3.cv3-r-phone .cv3-controls{display:grid!important;grid-template-columns:1fr!important}.calendar-v3.cv3-r-phone .cv3-controls label:nth-child(3),.calendar-v3.cv3-r-phone .cv3-controls>button,.calendar-v3.cv3-r-phone .cv3-controls .cv3-seg{grid-column:1/-1!important}.calendar-v3.cv3-r-phone .cv3-events{display:none!important}.calendar-v3.cv3-r-phone .cv3-foot{display:none!important}.calendar-v3.cv3-r-phone .cv3-hero{padding:8px!important}.calendar-v3.cv3-r-phone .cv3-hero>strong{font-size:30px!important}.calendar-v3.cv3-r-phone .cv3-week,.calendar-v3.cv3-r-phone .cv3-grid{gap:4px!important}.calendar-v3.cv3-r-phone .cv3-day{min-height:48px!important;padding:5px!important}.calendar-v3.cv3-r-phone .cv3-day div{display:none!important}
.calendar-v3.cv3-r-short .cv3-foot{display:none!important}.calendar-v3.cv3-r-short .cv3-events{max-height:96px!important}.calendar-v3.cv3-r-short .cv3-hero{padding:8px 10px!important}.calendar-v3.cv3-r-short .cv3-day{min-height:44px!important}.calendar-v3.cv3-r-short .cv3-day div{display:none!important}
`;
    document.head.appendChild(s);
  }

  function measure(root){
    if(!root||!root.isConnected)return;
    const rect=root.getBoundingClientRect();
    const w=Math.max(0,rect.width||root.clientWidth||0);
    const h=Math.max(0,rect.height||root.clientHeight||0);
    root.classList.toggle('cv3-r-compact',w<680);
    root.classList.toggle('cv3-r-narrow',w<560);
    root.classList.toggle('cv3-r-phone',w<430);
    root.classList.toggle('cv3-r-short',h<560);
    const body=root.closest('.card-body');
    if(body&&w<680)body.style.overflow='hidden';
  }

  const ro=window.ResizeObserver?new ResizeObserver(entries=>entries.forEach(entry=>measure(entry.target))):null;
  function observe(root){
    if(!root||OBSERVED.has(root))return;
    OBSERVED.add(root);
    measure(root);
    if(ro)ro.observe(root);
  }
  function scan(){document.querySelectorAll('.calendar-v3').forEach(observe);}
  function boot(){installStyle();scan();setTimeout(scan,80);setTimeout(scan,400);setTimeout(scan,1200);}
  const mo=new MutationObserver(scan);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{boot();mo.observe(document.documentElement,{childList:true,subtree:true});},{once:true});
  else{boot();mo.observe(document.documentElement,{childList:true,subtree:true});}
  window.windzxyCalendarV3ResponsiveFixVersion=VER;
})();
