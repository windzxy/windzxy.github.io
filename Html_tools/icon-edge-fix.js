(function(){
  if(window.__windzxyIconEdgeFixV3Loaded)return;
  window.__windzxyIconEdgeFixV3Loaded=1;
  const VER='20260819-icon-edge3-minimal-arrow-shift';

  function install(){
    const old=document.getElementById('windzxyIconEdgeFixStyle');
    if(old)old.remove();
    const s=document.createElement('style');
    s.id='windzxyIconEdgeFixStyle';
    s.textContent=`
/* Minimal icon fix: center the real icon text; do not add duplicate pseudo icons. */
.dock-tool .app-icon,
.desktop-card .card-bar .app-icon{
  flex:0 0 32px!important;
  width:32px!important;
  height:32px!important;
  min-width:32px!important;
  min-height:32px!important;
  display:inline-grid!important;
  place-items:center!important;
  line-height:1!important;
  padding:0!important;
  overflow:visible!important;
  box-sizing:border-box!important;
  font-size:18px!important;
  text-indent:0!important;
  color:inherit!important;
}
.dock-tool .app-icon::before,
.desktop-card .card-bar .app-icon::before{
  content:none!important;
  display:none!important;
}
.t-calendar .app-icon{font-size:20px!important}
.t-fx .app-icon{font-size:20px!important}
.t-metals .app-icon{font-size:20px!important}
.dock-tool{overflow:visible!important}
.dock-tool span{min-width:0!important}
.card-bar{overflow:visible!important}
.card-bar h3{min-width:0!important}

/* Calendar header: do NOT rebuild layout. Only move the right arrows left to avoid clipping. */
.calendar-widget.calx .calx-top{
  padding-right:14px!important;
  box-sizing:border-box!important;
  overflow:visible!important;
}
.calendar-widget.calx .calx-title{min-width:0!important}
.calendar-widget.calx .calx-top button{
  overflow:visible!important;
  flex-shrink:0!important;
}
.calendar-widget.calx .calx-top [data-calx-shift="1"],
.calendar-widget.calx .calx-top [data-calx-shift="12"]{
  transform:translateX(-10px)!important;
}
@container (max-width:330px){
  .calendar-widget.calx .calx-top{padding-right:18px!important}
  .calendar-widget.calx .calx-top [data-calx-shift="1"],
  .calendar-widget.calx .calx-top [data-calx-shift="12"]{transform:translateX(-14px)!important}
}
    `;
    document.head.appendChild(s);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.windzxyIconEdgeFixVersion=VER;
})();