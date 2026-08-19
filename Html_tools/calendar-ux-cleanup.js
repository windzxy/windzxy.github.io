(function(){
  if(window.__windzxyCalendarUxCleanupLoaded)return;
  window.__windzxyCalendarUxCleanupLoaded=1;
  const VER='20260819-calendar-ux3-header-summary';

  function installStyle(){
    if(document.getElementById('calendarUxCleanupStyle'))return;
    const s=document.createElement('style');
    s.id='calendarUxCleanupStyle';
    s.textContent=`
/* Product cleanup: selected-day details belong in the top information area, not as a bottom block. */
.calendar-widget.calx{gap:9px!important}
.calendar-widget.calx .calx-top{display:grid!important;grid-template-columns:minmax(230px,auto) minmax(210px,1fr) minmax(245px,auto)!important;gap:9px!important;align-items:stretch!important}
.calendar-widget.calx .calx-top-summary{min-height:56px;border:1px solid var(--wd-widget-line,var(--line));border-radius:16px;background:linear-gradient(135deg,var(--wd-widget-surface,rgba(255,255,255,.10)),var(--wd-widget-surface-2,rgba(255,255,255,.05)));padding:8px 10px;display:grid;grid-template-columns:auto 1fr;gap:4px 10px;align-items:center;overflow:hidden}
.calendar-widget.calx .calx-top-summary>strong{font-size:30px;line-height:.9;color:var(--wd-widget-cyan,#7ad7ff);font-weight:950;grid-row:span 2}
.calendar-widget.calx .calx-top-summary b{display:block;font-size:12px;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--wd-widget-ink,var(--ink))}
.calendar-widget.calx .calx-top-summary span{display:block;margin-top:1px;font-size:11px;line-height:1.15;color:var(--wd-widget-muted,var(--muted));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.calendar-widget.calx .calx-top-summary nav{grid-column:1/-1;display:flex;gap:4px;flex-wrap:wrap;align-items:center;min-height:17px;overflow:hidden}
.calendar-widget.calx .calx-top-summary i{font-style:normal;border-radius:999px;padding:1px 5px;font-size:9px;font-weight:900;border:1px solid var(--wd-widget-line,var(--line));white-space:nowrap}
.calendar-widget.calx .calx-top-summary .cn-rest{background:color-mix(in srgb,var(--wd-widget-green,#22d47b) 18%,transparent);color:var(--wd-widget-green,#22d47b)}
.calendar-widget.calx .calx-top-summary .cn-work{background:color-mix(in srgb,var(--wd-widget-work,#ffcf70) 18%,transparent);color:var(--wd-widget-work,#ffcf70)}
.calendar-widget.calx .calx-top-summary .hk-rest{background:color-mix(in srgb,var(--wd-widget-cyan,#7ad7ff) 18%,transparent);color:var(--wd-widget-cyan,#7ad7ff)}
/* Hide report-like bottom sections unless the card is genuinely wide enough for a right panel. */
.calendar-widget.calx:not(.wide) .calx-panel{display:none!important}
.calendar-widget.calx:not(.wide) .calx-main{grid-template-columns:1fr!important}
.calendar-widget.calx.wide .calx-detail{display:none!important}
.calendar-widget.calx.wide .calx-events{max-height:180px!important}
.calendar-widget.calx .calx-events p:nth-of-type(n+7){display:none!important}
.calendar-widget.calx .calx-month{height:min(100%,560px)!important;max-height:560px!important;min-height:min(360px,100%)!important}
.calendar-widget.calx .calx-grid{grid-template-rows:repeat(6,minmax(54px,1fr))!important}
.calendar-widget.calx .calx-day{min-height:54px!important}
.calendar-widget.calx .calx-day div{min-height:16px!important}
@container (max-width:760px){
  .calendar-widget.calx .calx-top{grid-template-columns:1fr!important}
  .calendar-widget.calx .calx-top-summary{order:2;grid-template-columns:auto 1fr;min-height:52px}
  .calendar-widget.calx .calx-jump{order:3}
}
@container (max-width:520px){
  .calendar-widget.calx .calx-top-summary{display:none!important}
  .calendar-widget.calx .calx-month{min-height:300px!important}
}
@container (max-height:560px){
  .calendar-widget.calx .calx-top-summary{display:none!important}
  .calendar-widget.calx .calx-jump{display:none!important}
  .calendar-widget.calx .calx-month{min-height:240px!important;max-height:100%!important}
}
`;
    document.head.appendChild(s);
  }

  function syncSummary(){
    document.querySelectorAll('.calendar-widget.calx').forEach(root=>{
      const top=root.querySelector('.calx-top');
      const detail=root.querySelector('.calx-detail');
      if(!top||!detail)return;
      let summary=top.querySelector('.calx-top-summary');
      if(!summary){
        summary=document.createElement('section');
        summary.className='calx-top-summary';
        const jump=top.querySelector('.calx-jump');
        top.insertBefore(summary,jump||null);
      }
      const day=detail.querySelector(':scope > strong')?.textContent||'';
      const date=detail.querySelector('div b')?.textContent||'';
      const lunar=detail.querySelector('div span')?.textContent||'';
      const badges=detail.querySelector('nav')?.innerHTML||'';
      summary.innerHTML=`<strong>${escapeHtml(day)}</strong><div><b>${escapeHtml(date)}</b><span>${escapeHtml(lunar)}</span></div><nav>${badges}</nav>`;
    });
  }
  function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function boot(){installStyle();syncSummary();setTimeout(syncSummary,80);setTimeout(syncSummary,500);setTimeout(syncSummary,1500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  const mo=new MutationObserver(()=>requestAnimationFrame(syncSummary));
  mo.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',()=>setTimeout(syncSummary,80),true);
  document.addEventListener('change',()=>setTimeout(syncSummary,80),true);
  window.windzxyCalendarUxCleanupVersion=VER;
})();
