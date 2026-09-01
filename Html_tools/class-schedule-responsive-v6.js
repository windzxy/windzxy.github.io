(function(){
'use strict';
const VER='20260901-class-schedule-responsive-v6';
if(window.__windzxyClassScheduleResponsiveV6===VER)return;
window.__windzxyClassScheduleResponsiveV6=VER;
function installStyle(){
  if(document.getElementById('classScheduleResponsiveV6Style'))return;
  const s=document.createElement('style');
  s.id='classScheduleResponsiveV6Style';
  s.textContent=`
/* Responsive modes are driven by actual rendered card size, not viewport width. */
.cs4.cs6-wide .cs4-hero{grid-template-columns:repeat(4,minmax(0,1fr))}
.cs4.cs6-wide .cs4-stat{min-height:86px;padding:10px 12px;border-radius:15px}
.cs4.cs6-wide .cs4-stat>span{margin-bottom:5px}
.cs4.cs6-wide .cs4-stat>strong{font-size:17px}
.cs4.cs6-wide .cs4-stat>b{margin-top:4px}
.cs4.cs6-wide .cs4-stat>small{margin-top:4px}
.cs4.cs6-wide .cs4-days{padding:2px 6px}
.cs4.cs6-wide .cs4-days button{height:40px}
.cs4.cs6-wide .cs4-row{grid-template-columns:14px 88px 62px minmax(105px,1fr) auto;min-height:40px;padding:4px 8px}
.cs4.cs6-wide .cs4-section{height:32px;margin:5px 0 3px}

.cs4.cs6-compact .cs4-hero{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
.cs4.cs6-compact .cs4-stat{min-height:76px;padding:9px 11px;border-radius:14px}
.cs4.cs6-compact .cs4-stat>strong{font-size:15px}
.cs4.cs6-compact .cs4-stat>small{margin-top:3px}
.cs4.cs6-compact .cs4-days{padding:2px 4px;gap:4px}
.cs4.cs6-compact .cs4-days button{height:36px}
.cs4.cs6-compact .cs4-row{grid-template-columns:12px 76px minmax(0,1fr) auto;gap:7px;min-height:37px;padding:3px 6px}
.cs4.cs6-compact .cs4-period{display:none}
.cs4.cs6-compact .cs4-row:before{left:12px}
.cs4.cs6-compact .cs4-row>em{min-width:48px;max-width:62px;overflow:hidden;text-overflow:ellipsis;padding:3px 7px;font-size:8px}

/* Short cards prioritise the timetable itself over duplicated chrome. */
.cs4.cs6-short{gap:7px;padding:9px 11px 8px}
.cs4.cs6-short .cs4-title{display:none}
.cs4.cs6-short .cs4-head{justify-content:flex-end;min-height:28px}
.cs4.cs6-short .cs4-view button{height:26px;padding:0 9px}
.cs4.cs6-short .cs4-stat{min-height:68px;padding-top:8px;padding-bottom:8px}
.cs4.cs6-short .cs4-stat>span{margin-bottom:3px}
.cs4.cs6-short .cs4-stat>strong{font-size:15px}
.cs4.cs6-short .cs4-stat>b{margin-top:3px;font-size:10px}
.cs4.cs6-short .cs4-stat>small{display:none}
.cs4.cs6-short .cs4-bar{height:5px;margin-top:6px}
.cs4.cs6-short .cs4-days{border-radius:12px}
.cs4.cs6-short .cs4-days button{height:32px}
.cs4.cs6-short .cs4-days button b{font-size:11px}
.cs4.cs6-short .cs4-days button small{font-size:8px}
.cs4.cs6-short .cs4-section{height:27px;margin:3px 0 2px;padding:0 8px;border-radius:9px}
.cs4.cs6-short .cs4-section span{font-size:11px}
.cs4.cs6-short .cs4-row{min-height:33px;padding-top:2px;padding-bottom:2px}
.cs4.cs6-short .cs4-row time{font-size:9px}
.cs4.cs6-short .cs4-row>strong{font-size:11px}
.cs4.cs6-short .cs4-row>em{padding-top:2px;padding-bottom:2px}

/* Very short cards shed lowest-priority week metadata before timetable rows. */
.cs4.cs6-tiny .cs4-weekmeta{display:none}
.cs4.cs6-tiny.cs6-wide .cs4-hero{grid-template-columns:repeat(3,minmax(0,1fr))}
.cs4.cs6-tiny.cs6-compact:not(.cs6-narrow) .cs4-hero{grid-template-columns:repeat(3,minmax(0,1fr))}
.cs4.cs6-tiny .cs4-stat{min-height:58px}
.cs4.cs6-tiny .cs4-progress>small{display:none}
.cs4.cs6-tiny .cs4-days button{height:29px}
.cs4.cs6-tiny .cs4-section{height:25px}
.cs4.cs6-tiny .cs4-row{min-height:31px}

/* Phone/narrow-card mode: subject + time win; decorative metadata yields. */
.cs4.cs6-narrow{padding-left:8px;padding-right:8px}
.cs4.cs6-narrow .cs4-hero{grid-template-columns:repeat(2,minmax(0,1fr))}
.cs4.cs6-narrow .cs4-stat{min-height:66px;padding:8px 9px}
.cs4.cs6-narrow .cs4-stat>strong{font-size:14px}
.cs4.cs6-narrow .cs4-weekmeta>b,.cs4.cs6-narrow .cs4-progress small{display:none}
.cs4.cs6-narrow .cs4-days{gap:2px;padding:2px}
.cs4.cs6-narrow .cs4-days button{height:31px;border-radius:8px}
.cs4.cs6-narrow .cs4-row{grid-template-columns:10px 67px minmax(0,1fr);gap:6px}
.cs4.cs6-narrow .cs4-row>em{display:none}
.cs4.cs6-narrow .cs4-row:before{left:10px}
.cs4.cs6-narrow .cs4-node{width:7px;height:7px}

.cs4.cs6-narrow.cs6-tiny .cs4-progress{grid-column:1/-1;min-height:48px;display:grid;grid-template-columns:auto 1fr;column-gap:9px;align-items:center}
.cs4.cs6-narrow.cs6-tiny .cs4-progress>span{grid-column:1}.cs4.cs6-narrow.cs6-tiny .cs4-progress>strong{grid-column:2;grid-row:1;text-align:right}.cs4.cs6-narrow.cs6-tiny .cs4-progress .cs4-bar{grid-column:1/-1;width:100%;margin:0}

/* Stop nested scrollbars looking like a second app. */
.cs4 .cs4-content{overscroll-behavior:contain;scrollbar-gutter:stable}
.cs4.cs6-short .cs4-content{scrollbar-width:none}
.cs4.cs6-short .cs4-content::-webkit-scrollbar{width:0;height:0}
`;
  document.head.appendChild(s);
}
const ro=new ResizeObserver(entries=>{
  for(const entry of entries){
    const el=entry.target;
    const r=entry.contentRect;
    el.classList.toggle('cs6-wide',r.width>=700);
    el.classList.toggle('cs6-compact',r.width<700);
    el.classList.toggle('cs6-narrow',r.width<500);
    el.classList.toggle('cs6-short',r.height<700);
    el.classList.toggle('cs6-tiny',r.height<540);
  }
});
function bind(root){if(root.dataset.cs6Bound)return;root.dataset.cs6Bound='1';ro.observe(root)}
function scan(){document.querySelectorAll('.class-schedule-v1.cs4').forEach(bind)}
function boot(){installStyle();scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskClassScheduleResponsive={version:'v6',modes:['wide','compact','narrow','short','tiny']};
})();