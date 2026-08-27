(function(){
  if(window.__windzxyCalendarV3ProductPolishLoadedV2)return;
  window.__windzxyCalendarV3ProductPolishLoadedV2=1;
  const VER='20260827-calendar-v3-product-polish2-perf';

  function installStyle(){
    if(document.getElementById('windzxyCalendarV3ProductPolishStyle'))return;
    const s=document.createElement('style');
    s.id='windzxyCalendarV3ProductPolishStyle';
    s.textContent=`
.calendar-v3.cv3-polish{gap:9px!important;min-height:0!important;overflow:hidden!important}.calendar-v3.cv3-polish .cv3-foot{display:none!important}.calendar-v3.cv3-polish .cv3-title strong{font-size:clamp(18px,3vw,24px)!important}.calendar-v3.cv3-polish .cv3-title em{max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.calendar-v3.cv3-polish .cv3-events{z-index:0!important;box-sizing:border-box!important}.calendar-v3.cv3-polish .cv3-day{box-sizing:border-box!important;min-width:0!important}.calendar-v3.cv3-polish .cv3-body,.calendar-v3.cv3-polish .cv3-year-view,.calendar-v3.cv3-polish .cv3-month{min-height:0!important;min-width:0!important}
.calendar-v3.cv3-w-small{font-size:12px!important}.calendar-v3.cv3-w-small .cv3-head{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:start!important;gap:8px!important}.calendar-v3.cv3-w-small .cv3-nav{gap:4px!important}.calendar-v3.cv3-w-small .cv3-nav button{width:36px!important;height:32px!important;padding:0!important;border-radius:12px!important}.calendar-v3.cv3-w-small .cv3-nav button[data-cv3-act="today"]{width:auto!important;min-width:62px!important;padding:0 10px!important}.calendar-v3.cv3-w-small .cv3-nav button[data-cv3-act="prev-year"],.calendar-v3.cv3-w-small .cv3-nav button[data-cv3-act="next-year"]{display:none!important}.calendar-v3.cv3-w-small .cv3-controls{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:6px!important}.calendar-v3.cv3-w-small .cv3-controls label:nth-child(3){grid-column:1/-1!important}.calendar-v3.cv3-w-small .cv3-controls>[data-cv3-act="jump"]{grid-column:1/2!important;width:100%!important}.calendar-v3.cv3-w-small .cv3-seg{grid-column:2/3!important;width:100%!important}.calendar-v3.cv3-w-small .cv3-seg button{flex:1!important}.calendar-v3.cv3-w-small .cv3-hero{grid-template-columns:auto minmax(0,1fr)!important;gap:8px!important;padding:8px 10px!important}.calendar-v3.cv3-w-small .cv3-hero>strong{font-size:32px!important}.calendar-v3.cv3-w-small .cv3-hero nav{grid-column:1/-1!important;justify-content:flex-start!important}.calendar-v3.cv3-w-small .cv3-body{display:flex!important;flex-direction:column!important;gap:8px!important;overflow:auto!important}.calendar-v3.cv3-w-small .cv3-events{position:static!important;width:100%!important;max-width:none!important;max-height:104px!important;overflow:auto!important;order:2!important;padding:8px 10px!important;border-radius:14px!important}.calendar-v3.cv3-w-small.cv3-no-events .cv3-events{max-height:42px!important}.calendar-v3.cv3-w-small .cv3-week,.calendar-v3.cv3-w-small .cv3-grid{gap:4px!important}.calendar-v3.cv3-w-small .cv3-day{min-height:44px!important;padding:5px!important;border-radius:12px!important}.calendar-v3.cv3-w-small .cv3-day div{display:none!important}.calendar-v3.cv3-w-small .cv3-year-view{display:flex!important;flex-direction:column!important;overflow:auto!important}.calendar-v3.cv3-w-small .cv3-year-grid{grid-template-columns:1fr 1fr!important;overflow:visible!important}.calendar-v3.cv3-w-small .cv3-year-view .cv3-events{display:none!important}
.calendar-v3.cv3-w-phone{gap:7px!important}.calendar-v3.cv3-w-phone .cv3-title strong{font-size:19px!important}.calendar-v3.cv3-w-phone .cv3-title em{display:none!important}.calendar-v3.cv3-w-phone .cv3-head{grid-template-columns:1fr!important}.calendar-v3.cv3-w-phone .cv3-nav{display:grid!important;grid-template-columns:34px 34px 1fr 34px 34px!important;width:100%!important}.calendar-v3.cv3-w-phone .cv3-controls{grid-template-columns:1fr 1fr!important}.calendar-v3.cv3-w-phone .cv3-controls label span{display:none!important}.calendar-v3.cv3-w-phone .cv3-controls label:nth-child(3),.calendar-v3.cv3-w-phone .cv3-seg{grid-column:1/-1!important}.calendar-v3.cv3-w-phone .cv3-controls>[data-cv3-act="jump"],.calendar-v3.cv3-w-phone .cv3-hero,.calendar-v3.cv3-w-phone .cv3-events{display:none!important}.calendar-v3.cv3-w-phone .cv3-body{overflow:hidden!important}.calendar-v3.cv3-w-phone .cv3-day{min-height:42px!important;padding:5px 4px!important;text-align:center!important;align-items:center!important}.calendar-v3.cv3-w-phone .cv3-day div{display:none!important}.calendar-v3.cv3-w-phone .cv3-year-grid{grid-template-columns:1fr!important}
.calendar-v3.cv3-w-micro .cv3-controls{display:none!important}.calendar-v3.cv3-w-micro .cv3-nav{grid-template-columns:32px 1fr 32px!important}.calendar-v3.cv3-w-micro .cv3-nav button[data-cv3-act="prev-year"],.calendar-v3.cv3-w-micro .cv3-nav button[data-cv3-act="next-year"]{display:none!important}.calendar-v3.cv3-w-micro .cv3-day{min-height:38px!important}.calendar-v3.cv3-w-micro .cv3-week,.calendar-v3.cv3-w-micro .cv3-grid{gap:3px!important}.calendar-v3.cv3-h-short .cv3-hero,.calendar-v3.cv3-h-short .cv3-events{display:none!important}.calendar-v3.cv3-h-short .cv3-body{overflow:hidden!important}.calendar-v3.cv3-h-tiny .cv3-controls{display:none!important}.calendar-v3.cv3-h-tiny .cv3-day span{display:none!important}
`;
    document.head.appendChild(s);
  }

  function classify(root){
    if(!root||!root.isConnected)return;
    const box=root.getBoundingClientRect();
    const w=box.width||root.clientWidth||0;
    const h=box.height||root.clientHeight||0;
    root.classList.add('cv3-polish');
    root.classList.toggle('cv3-w-small',w<690);
    root.classList.toggle('cv3-w-phone',w<540);
    root.classList.toggle('cv3-w-micro',w<430);
    root.classList.toggle('cv3-h-short',h<520);
    root.classList.toggle('cv3-h-tiny',h<430);
    root.classList.toggle('cv3-no-events',!!root.querySelector('.cv3-events .cv3-empty'));
  }
  const seen=new WeakSet();
  let ro=null;
  function register(root){
    if(!root||seen.has(root))return;
    seen.add(root);classify(root);
    if(window.ResizeObserver){
      if(!ro)ro=new ResizeObserver(entries=>entries.forEach(e=>classify(e.target)));
      ro.observe(root);
    }
  }
  function scan(){installStyle();document.querySelectorAll('.calendar-v3').forEach(register);}
  let pending=false;
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;scan();});}
  function boot(){scan();const layer=document.getElementById('windowLayer')||document.getElementById('desktopCanvas')||document.body;if(window.MutationObserver){new MutationObserver(schedule).observe(layer,{childList:true,subtree:true});}setTimeout(scan,160);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyCalendarV3ProductPolishVersion=VER;
})();