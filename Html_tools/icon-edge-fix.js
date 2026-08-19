(function(){
  if(window.__windzxyIconEdgeFixV2Loaded)return;
  window.__windzxyIconEdgeFixV2Loaded=1;
  const VER='20260819-icon-edge2-calendar-header-stable';

  function install(){
    const old=document.getElementById('windzxyIconEdgeFixStyle');
    if(old)old.remove();
    const s=document.createElement('style');
    s.id='windzxyIconEdgeFixStyle';
    s.textContent=`
/* Icon optical alignment: do not duplicate pseudo icons. */
.dock-tool .app-icon,
.desktop-card .card-bar .app-icon{
  flex:0 0 32px!important;
  width:32px!important;
  height:32px!important;
  min-width:32px!important;
  min-height:32px!important;
  max-width:32px!important;
  max-height:32px!important;
  display:inline-grid!important;
  place-items:center!important;
  line-height:1!important;
  padding:0!important;
  overflow:visible!important;
  box-sizing:border-box!important;
  font-size:15px!important;
}
/* Finance/calendar icons are supplied by ::before in theme-contrast-fix; hide original text. */
.t-calendar .app-icon,
.t-fx .app-icon,
.t-metals .app-icon{font-size:0!important;color:transparent!important;text-indent:0!important}
.t-calendar .app-icon::before,
.t-fx .app-icon::before,
.t-metals .app-icon::before{
  display:grid!important;
  place-items:center!important;
  line-height:1!important;
  max-width:26px!important;
  max-height:26px!important;
  transform:none!important;
  color:#fff!important;
  text-indent:0!important;
}
.t-calendar .app-icon::before{font-size:20px!important;line-height:1!important}
.t-fx .app-icon::before{font-size:22px!important;line-height:1!important}
.t-metals .app-icon::before{font-size:22px!important;line-height:1!important;color:#fff7d6!important}
.dock-tool{overflow:visible!important}.dock-tool span{min-width:0!important}.card-bar{overflow:visible!important}.card-bar h3{min-width:0!important}

/* Calendar header: keep month navigation in one clean row. */
.calendar-widget.calx{overflow:hidden!important;padding-right:1px!important}
.calendar-widget.calx .calx-top{
  overflow:visible!important;
  display:grid!important;
  grid-template-columns:26px 26px minmax(0,1fr) 26px 26px!important;
  gap:6px!important;
  align-items:center!important;
}
.calendar-widget.calx .calx-title{min-width:0!important;overflow:hidden!important}
.calendar-widget.calx .calx-title h3,
.calendar-widget.calx .calx-title p{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.calendar-widget.calx .calx-top button{
  width:26px!important;
  min-width:26px!important;
  max-width:26px!important;
  height:26px!important;
  min-height:26px!important;
  max-height:26px!important;
  padding:0!important;
  display:grid!important;
  place-items:center!important;
  line-height:1!important;
  overflow:visible!important;
  border-radius:999px!important;
}
/* Today was causing a second-row layout break; date input already provides fast positioning. */
.calendar-widget.calx .calx-today{display:none!important}
@container (max-width:360px){
  .calendar-widget.calx .calx-top{grid-template-columns:24px minmax(0,1fr) 24px!important;gap:6px!important}
  .calendar-widget.calx .calx-top [data-calx-shift="-12"],
  .calendar-widget.calx .calx-top [data-calx-shift="12"]{display:none!important}
  .calendar-widget.calx .calx-top button{width:24px!important;min-width:24px!important;max-width:24px!important;height:24px!important}
}
@container (max-width:300px){
  .calendar-widget.calx .calx-top{grid-template-columns:22px minmax(0,1fr) 22px!important;gap:5px!important}
  .calendar-widget.calx .calx-top button{width:22px!important;min-width:22px!important;max-width:22px!important;height:22px!important}
}
    `;
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.windzxyIconEdgeFixVersion=VER;
})();
