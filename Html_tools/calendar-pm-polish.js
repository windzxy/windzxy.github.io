(function(){
  if(window.__windzxyCalendarPmPolishLoaded)return;
  window.__windzxyCalendarPmPolishLoaded=1;
  const VER='20260819-calendar-pm-polish1';

  function installStyle(){
    if(document.getElementById('calendarPmPolishStyle'))return;
    const s=document.createElement('style');
    s.id='calendarPmPolishStyle';
    s.textContent=`
/* Calendar PM polish: compact controls without hiding the perpetual-calendar capability. */
.calendar-widget.calx{gap:6px!important}
.calendar-widget.calx .calx-top{grid-template-columns:26px 26px minmax(0,1fr) 26px 26px auto!important;gap:6px!important}
.calendar-widget.calx .calx-top button{height:28px!important;min-width:28px!important;border-radius:999px!important}
.calendar-widget.calx .calx-title h3{font-size:18px!important;letter-spacing:-.03em!important}
.calendar-widget.calx .calx-title p{font-size:10.5px!important;opacity:.82!important}
.calendar-widget.calx .calx-today{height:28px!important;padding:0 10px!important;font-size:12px!important}
.calendar-widget.calx .calx-tools,
.calendar-widget.calx.compact .calx-tools,
.calendar-widget.calx.short .calx-tools{
  display:grid!important;
  grid-template-columns:minmax(66px,.68fr) minmax(82px,.78fr) minmax(128px,1fr) 42px!important;
  gap:5px!important;
  align-items:center!important;
  margin-top:-1px!important;
}
.calendar-widget.calx .calx-tools label,
.calendar-widget.calx.compact .calx-tools label,
.calendar-widget.calx.short .calx-tools label{display:block!important;gap:0!important}
.calendar-widget.calx .calx-tools span,
.calendar-widget.calx.compact .calx-tools span,
.calendar-widget.calx.short .calx-tools span{display:none!important}
.calendar-widget.calx .calx-tools .date,
.calendar-widget.calx.compact .calx-tools .date,
.calendar-widget.calx.short .calx-tools .date{grid-column:auto!important;grid-row:auto!important}
.calendar-widget.calx .calx-tools input,
.calendar-widget.calx .calx-tools select,
.calendar-widget.calx.compact .calx-tools input,
.calendar-widget.calx.compact .calx-tools select,
.calendar-widget.calx.short .calx-tools input,
.calendar-widget.calx.short .calx-tools select{
  height:30px!important;
  min-height:30px!important;
  width:100%!important;
  border-radius:10px!important;
  padding:0 9px!important;
  font-size:14px!important;
  line-height:30px!important;
}
.calendar-widget.calx .calx-tools button,
.calendar-widget.calx.compact .calx-tools button,
.calendar-widget.calx.short .calx-tools button{
  grid-column:auto!important;
  grid-row:auto!important;
  width:42px!important;
  min-width:42px!important;
  max-width:42px!important;
  height:30px!important;
  min-height:30px!important;
  border-radius:10px!important;
  padding:0!important;
  font-size:0!important;
  align-self:center!important;
  justify-self:end!important;
}
.calendar-widget.calx .calx-tools button::before{content:'↵';font-size:15px!important;line-height:1!important}
.calendar-widget.calx .calx-hero,
.calendar-widget.calx.compact .calx-hero{
  min-height:60px!important;
  padding:7px 10px!important;
  grid-template-columns:auto minmax(0,1fr) auto!important;
  gap:8px!important;
  border-radius:14px!important;
}
.calendar-widget.calx .calx-hero>strong{font-size:31px!important;line-height:.95!important}
.calendar-widget.calx .calx-hero b{font-size:13px!important;line-height:1.15!important}
.calendar-widget.calx .calx-hero span{font-size:10.5px!important;margin-top:1px!important}
.calendar-widget.calx .calx-hero .empty{display:none!important}
.calendar-widget.calx .calx-hero nav:empty{display:none!important}
.calendar-widget.calx .calx-week{height:24px!important}
.calendar-widget.calx .calx-grid{height:calc(100% - 24px)!important;grid-template-rows:repeat(6,minmax(0,1fr))!important}
.calendar-widget.calx .calx-day{padding:4px 5px!important;gap:1px!important}
.calendar-widget.calx .calx-day strong{font-size:13px!important;line-height:1.05!important}
.calendar-widget.calx .calx-day span{font-size:9.5px!important;line-height:1.1!important}
.calendar-widget.calx .calx-day i{font-size:8px!important;padding:1px 4px!important}
@container (max-width:430px){
  .calendar-widget.calx .calx-top{grid-template-columns:25px 25px minmax(0,1fr) 25px 25px!important}
  .calendar-widget.calx .calx-today{display:none!important}
  .calendar-widget.calx .calx-tools,
  .calendar-widget.calx.compact .calx-tools,
  .calendar-widget.calx.short .calx-tools{grid-template-columns:minmax(58px,.64fr) minmax(70px,.75fr) minmax(98px,1fr) 36px!important;gap:4px!important}
  .calendar-widget.calx .calx-tools input,
  .calendar-widget.calx .calx-tools select{height:28px!important;min-height:28px!important;font-size:12px!important;padding:0 7px!important}
  .calendar-widget.calx .calx-tools button{width:36px!important;min-width:36px!important;max-width:36px!important;height:28px!important;min-height:28px!important}
  .calendar-widget.calx .calx-hero{min-height:54px!important;padding:6px 8px!important}
  .calendar-widget.calx .calx-hero>strong{font-size:27px!important}
  .calendar-widget.calx .calx-day{padding:3px!important}
  .calendar-widget.calx .calx-day strong{font-size:12px!important}
  .calendar-widget.calx .calx-day span{font-size:8.6px!important}
}
@container (max-width:330px){
  .calendar-widget.calx .calx-tools{grid-template-columns:1fr 1fr 34px!important}
  .calendar-widget.calx .calx-tools .date{grid-column:1 / 3!important}
  .calendar-widget.calx .calx-tools button{grid-column:3!important;grid-row:2!important;width:34px!important;min-width:34px!important;max-width:34px!important}
  .calendar-widget.calx .calx-title p{display:none!important}
}
`;
    document.head.appendChild(s);
  }

  function boot(){installStyle();window.windzxyCalendarPmPolishVersion=VER;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
