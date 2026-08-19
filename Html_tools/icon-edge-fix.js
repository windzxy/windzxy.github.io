(function(){
  if(window.__windzxyIconEdgeFixV4Loaded)return;
  window.__windzxyIconEdgeFixV4Loaded=1;
  const VER='20260819-icon-edge4-left-center-right';

  function install(){
    const old=document.getElementById('windzxyIconEdgeFixStyle');
    if(old)old.remove();
    const s=document.createElement('style');
    s.id='windzxyIconEdgeFixStyle';
    s.textContent=`
/* Icon optical alignment: use the real icon only, no duplicate pseudo icons. */
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

/* Calendar header: left / center / right alignment, no vertical drift, no clipping. */
.calendar-widget.calx .calx-top{
  display:grid!important;
  grid-template-columns:34px 34px minmax(0,1fr) 34px 34px!important;
  grid-template-areas:"prevYear prevMonth title nextMonth nextYear"!important;
  align-items:center!important;
  column-gap:8px!important;
  padding:0 18px 0 0!important;
  box-sizing:border-box!important;
  overflow:visible!important;
}
.calendar-widget.calx .calx-top [data-calx-shift="-12"]{grid-area:prevYear!important;transform:none!important}
.calendar-widget.calx .calx-top [data-calx-shift="-1"]{grid-area:prevMonth!important;transform:none!important}
.calendar-widget.calx .calx-title{
  grid-area:title!important;
  align-self:center!important;
  min-width:0!important;
  overflow:hidden!important;
  padding-left:0!important;
}
.calendar-widget.calx .calx-top [data-calx-shift="1"]{grid-area:nextMonth!important;transform:none!important}
.calendar-widget.calx .calx-top [data-calx-shift="12"]{grid-area:nextYear!important;transform:none!important}
.calendar-widget.calx .calx-top button{
  width:34px!important;
  min-width:34px!important;
  max-width:34px!important;
  height:34px!important;
  min-height:34px!important;
  max-height:34px!important;
  padding:0!important;
  display:grid!important;
  place-items:center!important;
  line-height:1!important;
  border-radius:999px!important;
  overflow:visible!important;
  align-self:center!important;
  justify-self:center!important;
  flex-shrink:0!important;
}
.calendar-widget.calx .calx-title h3,
.calendar-widget.calx .calx-title p{
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
.calendar-widget.calx .calx-today{display:none!important}
@container (max-width:360px){
  .calendar-widget.calx .calx-top{
    grid-template-columns:32px 32px minmax(0,1fr) 32px 32px!important;
    column-gap:6px!important;
    padding-right:14px!important;
  }
  .calendar-widget.calx .calx-top button{
    width:32px!important;min-width:32px!important;max-width:32px!important;
    height:32px!important;min-height:32px!important;max-height:32px!important;
  }
}
@container (max-width:300px){
  .calendar-widget.calx .calx-top{
    grid-template-columns:30px minmax(0,1fr) 30px!important;
    grid-template-areas:"prevMonth title nextMonth"!important;
    column-gap:6px!important;
    padding-right:12px!important;
  }
  .calendar-widget.calx .calx-top [data-calx-shift="-12"],
  .calendar-widget.calx .calx-top [data-calx-shift="12"]{display:none!important}
  .calendar-widget.calx .calx-top button{
    width:30px!important;min-width:30px!important;max-width:30px!important;
    height:30px!important;min-height:30px!important;max-height:30px!important;
  }
}
    `;
    document.head.appendChild(s);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.windzxyIconEdgeFixVersion=VER;
})();