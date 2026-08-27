(function(){
  if(window.__windzxyCalendarV3ProductPolishLoaded)return;
  window.__windzxyCalendarV3ProductPolishLoaded=1;
  const VER='20260827-calendar-v3-product-polish1';

  function installStyle(){
    if(document.getElementById('windzxyCalendarV3ProductPolishStyle'))return;
    const s=document.createElement('style');
    s.id='windzxyCalendarV3ProductPolishStyle';
    s.textContent=`
.calendar-v3.cv3-polish{gap:9px!important;min-height:0!important;overflow:hidden!important}.calendar-v3.cv3-polish .cv3-foot{display:none!important}.calendar-v3.cv3-polish .cv3-title span{letter-spacing:.18em!important}.calendar-v3.cv3-polish .cv3-title strong{font-size:clamp(18px,3vw,24px)!important}.calendar-v3.cv3-polish .cv3-title em{max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.calendar-v3.cv3-polish .cv3-nav button{flex:0 0 auto}.calendar-v3.cv3-polish .cv3-controls label span{line-height:1}.calendar-v3.cv3-polish .cv3-events{z-index:0!important;box-sizing:border-box!important}.calendar-v3.cv3-polish .cv3-events p{min-width:0}.calendar-v3.cv3-polish .cv3-events .cv3-empty{display:block!important;margin:0!important;padding:0!important;background:transparent!important;line-height:1.45!important}.calendar-v3.cv3-polish .cv3-day{box-sizing:border-box!important;min-width:0!important}.calendar-v3.cv3-polish .cv3-day strong,.calendar-v3.cv3-polish .cv3-day span{pointer-events:none}.calendar-v3.cv3-polish .cv3-body,.calendar-v3.cv3-polish .cv3-year-view{min-height:0!important}.calendar-v3.cv3-polish .cv3-month{min-width:0!important}.calendar-v3.cv3-polish .cv3-grid{min-height:0!important}
.calendar-v3.cv3-w-small{font-size:12px!important}.calendar-v3.cv3-w-small .cv3-head{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:start!important;gap:8px!important}.calendar-v3.cv3-w-small .cv3-nav{gap:4px!important}.calendar-v3.cv3-w-small .cv3-nav button{width:36px!important;height:32px!important;padding:0!important;border-radius:12px!important}.calendar-v3.cv3-w-small .cv3-nav button[data-cv3-act="today"]{width:auto!important;min-width:62px!important;padding:0 10px!important}.calendar-v3.cv3-w-small .cv3-nav button[data-cv3-act="prev-year"],.calendar-v3.cv3-w-small .cv3-nav button[data-cv3-act="next-year"]{display:none!important}.calendar-v3.cv3-w-small .cv3-controls{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:6px!important}.calendar-v3.cv3-w-small .cv3-controls label:nth-child(3){grid-column:1/-1!important}.calendar-v3.cv3-w-small .cv3-controls>[data-cv3-act="jump"]{grid-column:1/2!important;width:100%!important}.calendar-v3.cv3-w-small .cv3-seg{grid-column:2/3!important;width:100%!important}.calendar-v3.cv3-w-small .cv3-seg button{flex:1!important}.calendar-v3.cv3-w-small .cv3-hero{grid-template-columns:auto minmax(0,1fr)!important;gap:8px!important;padding:8px 10px!important}.calendar-v3.cv3-w-small .cv3-hero>strong{font-size:32px!important}.calendar-v3.cv3-w-small .cv3-hero nav{grid-column:1/-1!important;justify-content:flex-start!important}.calendar-v3.cv3-w-small .cv3-body{display:flex!important;flex-direction:column!important;gap:8px!important;overflow:auto!important}.calendar-v3.cv3-w-small .cv3-events{position:static!important;inset:auto!important;transform:none!important;width:100%!important;max-width:none!important;min-height:0!important;max-height:104px!important;overflow:auto!important;order:2!important;padding:8px 10px!important;border-radius:14px!important}.calendar-v3.cv3-w-small.cv3-no-events .cv3-events{max-height:42px!important;padding:8px 10px!important}.calendar-v3.cv3-w-small .cv3-events h4{margin:0 0 5px!important;font-size:12px!important}.calendar-v3.cv3-w-small.cv3-no-events .cv3-events h4{display:none!important}.calendar-v3.cv3-w-small .cv3-week,.calendar-v3.cv3-w-small .cv3-grid{gap:4px!important}.calendar-v3.cv3-w-small .cv3-day{min-height:44px!important;padding:5px!important;border-radius:12px!important}.calendar-v3.cv3-w-small .cv3-day strong{font-size:14px!important}.calendar-v3.cv3-w-small .cv3-day span{font-size:10px!important}.calendar-v3.cv3-w-small .cv3-day div{display:none!important}.calendar-v3.cv3-w-small .cv3-year-view{display:flex!important;flex-direction:column!important;overflow:auto!important}.calendar-v3.cv3-w-small .cv3-year-grid{grid-template-columns:1fr 1fr!important;overflow:visible!important}.calendar-v3.cv3-w-small .cv3-year-view .cv3-events{display:none!important}
.calendar-v3.cv3-w-phone{gap:7px!important}.calendar-v3.cv3-w-phone .cv3-title span{font-size:9px!important}.calendar-v3.cv3-w-phone .cv3-title strong{font-size:19px!important}.calendar-v3.cv3-w-phone .cv3-title em{display:none!important}.calendar-v3.cv3-w-phone .cv3-head{grid-template-columns:1fr!important}.calendar-v3.cv3-w-phone .cv3-nav{display:grid!important;grid-template-columns:34px 34px 1fr 34px 34px!important;width:100%!important}.calendar-v3.cv3-w-phone .cv3-nav button[data-cv3-act="prev-year"],.calendar-v3.cv3-w-phone .cv3-nav button[data-cv3-act="next-year"]{display:block!important}.calendar-v3.cv3-w-phone .cv3-nav button{width:auto!important;min-width:0!important}.calendar-v3.cv3-w-phone .cv3-controls{grid-template-columns:1fr 1fr!important}.calendar-v3.cv3-w-phone .cv3-controls label span{display:none!important}.calendar-v3.cv3-w-phone .cv3-controls input,.calendar-v3.cv3-w-phone .cv3-controls select,.calendar-v3.cv3-w-phone .cv3-controls button{height:30px!important;border-radius:10px!important}.calendar-v3.cv3-w-phone .cv3-controls label:nth-child(3){grid-column:1/-1!important}.calendar-v3.cv3-w-phone .cv3-controls>[data-cv3-act="jump"]{display:none!important}.calendar-v3.cv3-w-phone .cv3-seg{grid-column:1/-1!important}.calendar-v3.cv3-w-phone .cv3-hero{display:none!important}.calendar-v3.cv3-w-phone .cv3-events{display:none!important}.calendar-v3.cv3-w-phone .cv3-body{overflow:hidden!important}.calendar-v3.cv3-w-phone .cv3-month{height:100%!important}.calendar-v3.cv3-w-phone .cv3-week,.calendar-v3.cv3-w-phone .cv3-grid{gap:4px!important}.calendar-v3.cv3-w-phone .cv3-day{min-height:42px!important;padding:5px 4px!important;text-align:center!important;align-items:center!important}.calendar-v3.cv3-w-phone .cv3-day span{font-size:10px!important}.calendar-v3.cv3-w-phone .cv3-day div{display:none!important}.calendar-v3.cv3-w-phone .cv3-year-grid{grid-template-columns:1fr!important}.calendar-v3.cv3-w-phone .cv3-mini{padding:7px!important}
.calendar-v3.cv3-w-micro .cv3-controls{display:none!important}.calendar-v3.cv3-w-micro .cv3-nav{grid-template-columns:32px 1fr 32px!important}.calendar-v3.cv3-w-micro .cv3-nav button[data-cv3-act="prev-year"],.calendar-v3.cv3-w-micro .cv3-nav button[data-cv3-act="next-year"]{display:none!important}.calendar-v3.cv3-w-micro .cv3-day{min-height:38px!important}.calendar-v3.cv3-w-micro .cv3-week,.calendar-v3.cv3-w-micro .cv3-grid{gap:3px!important}.calendar-v3.cv3-w-micro .cv3-day strong{font-size:13px!important}.calendar-v3.cv3-w-micro .cv3-day span{font-size:9px!important}
.calendar-v3.cv3-h-short .cv3-hero{display:none!important}.calendar-v3.cv3-h-short .cv3-events{display:none!important}.calendar-v3.cv3-h-short .cv3-body{overflow:hidden!important}.calendar-v3.cv3-h-short .cv3-day{min-height:36px!important}.calendar-v3.cv3-h-short .cv3-controls{margin-bottom:0!important}.calendar-v3.cv3-h-short .cv3-title em{display:none!important}
.calendar-v3.cv3-h-tiny .cv3-controls{display:none!important}.calendar-v3.cv3-h-tiny .cv3-nav button[data-cv3-act="prev-year"],.calendar-v3.cv3-h-tiny .cv3-nav button[data-cv3-act="next-year"]{display:none!important}.calendar-v3.cv3-h-tiny .cv3-day span{display:none!important}
`;
    document.head.appendChild(s);
  }

  function classify(root){
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
  function scan(){document.querySelectorAll('.calendar-v3').forEach(classify);}
  function observe(){
    installStyle();scan();
    if(window.ResizeObserver&&!window.__windzxyCalendarV3ResizeObserver){
      const ro=new ResizeObserver(entries=>entries.forEach(entry=>classify(entry.target)));
      window.__windzxyCalendarV3ResizeObserver=ro;
      document.querySelectorAll('.calendar-v3').forEach(el=>ro.observe(el));
    }
  }
  const mo=new MutationObserver(()=>observe());
  function boot(){observe();mo.observe(document.documentElement,{childList:true,subtree:true});setTimeout(observe,120);setTimeout(observe,600);setInterval(scan,1200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyCalendarV3ProductPolishVersion=VER;
})();
