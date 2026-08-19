(function(){
  if(window.__windzxyIconEdgeFixLoaded)return;
  window.__windzxyIconEdgeFixLoaded=1;
  const VER='20260819-icon-edge1-no-crop';

  function install(){
    if(document.getElementById('windzxyIconEdgeFixStyle'))return;
    const s=document.createElement('style');
    s.id='windzxyIconEdgeFixStyle';
    s.textContent=`
/* Keep all tool/card icons optically centered instead of cropped. */
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
.dock-tool .app-icon::before,
.desktop-card .card-bar .app-icon::before{
  display:grid!important;
  place-items:center!important;
  line-height:1!important;
  max-width:26px!important;
  max-height:26px!important;
  transform:none!important;
}
.t-calendar .app-icon::before{font-size:20px!important;line-height:1!important}
.t-fx .app-icon::before{font-size:22px!important;line-height:1!important}
.t-metals .app-icon::before{font-size:22px!important;line-height:1!important}
.dock-tool{overflow:visible!important}.dock-tool span{min-width:0!important}.card-bar{overflow:visible!important}.card-bar h3{min-width:0!important}
/* Calendar month/year controls: stop the right-side buttons from being clipped in narrow cards. */
.calendar-widget.calx{overflow:hidden!important;padding-right:1px!important}
.calendar-widget.calx .calx-top{
  overflow:visible!important;
  grid-template-columns:24px 24px minmax(0,1fr) 24px 24px auto!important;
  gap:5px!important;
  align-items:center!important;
}
.calendar-widget.calx .calx-top button{
  width:24px!important;
  min-width:24px!important;
  max-width:24px!important;
  height:24px!important;
  min-height:24px!important;
  padding:0!important;
  display:grid!important;
  place-items:center!important;
  line-height:1!important;
  overflow:visible!important;
}
.calendar-widget.calx .calx-today{
  width:auto!important;
  min-width:0!important;
  max-width:none!important;
  height:24px!important;
  padding:0 8px!important;
}
@container (max-width:340px){
  .calendar-widget.calx .calx-top{grid-template-columns:24px minmax(0,1fr) 24px auto!important;gap:5px!important}
  .calendar-widget.calx .calx-top [data-calx-shift="-12"],
  .calendar-widget.calx .calx-top [data-calx-shift="12"]{display:none!important}
}
@container (max-width:300px){
  .calendar-widget.calx .calx-top{grid-template-columns:22px minmax(0,1fr) 22px!important}
  .calendar-widget.calx .calx-today{display:none!important}
  .calendar-widget.calx .calx-top button{width:22px!important;min-width:22px!important;height:22px!important}
}
    `;
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.windzxyIconEdgeFixVersion=VER;
})();