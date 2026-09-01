(function(){
'use strict';
const VER='20260901-class-schedule-active-v8';
if(window.__windzxyClassScheduleActiveV8===VER)return;
window.__windzxyClassScheduleActiveV8=VER;
function install(){
  if(document.getElementById('classScheduleActiveV8Style'))return;
  const s=document.createElement('style');
  s.id='classScheduleActiveV8Style';
  s.textContent=`
/* Current course must be identifiable at a glance in every adaptive mode. */
.cs4 .cs4-row.is-now{
  background:linear-gradient(90deg,
    color-mix(in srgb,var(--cs-green,#10b981) 25%,var(--panel)),
    color-mix(in srgb,var(--cs-cyan,#28c7f7) 13%,var(--panel2)))!important;
  border-color:color-mix(in srgb,var(--cs-green,#10b981) 46%,var(--line))!important;
  box-shadow:
    inset 4px 0 0 var(--cs-green,#10b981),
    0 0 0 1px color-mix(in srgb,var(--cs-green,#10b981) 10%,transparent),
    0 8px 22px color-mix(in srgb,var(--cs-green,#10b981) 12%,transparent)!important;
}
.cs4 .cs4-row.is-now:after{
  content:'';
  position:absolute;
  inset:1px;
  border-radius:9px;
  pointer-events:none;
  background:linear-gradient(105deg,rgba(255,255,255,.06),transparent 42%);
}
.cs4 .cs4-row.is-now .cs4-node{
  width:10px!important;
  height:10px!important;
  background:var(--cs-green,#10b981)!important;
  box-shadow:
    0 0 0 4px color-mix(in srgb,var(--cs-green,#10b981) 18%,var(--panel)),
    0 0 14px color-mix(in srgb,var(--cs-green,#10b981) 48%,transparent)!important;
}
.cs4 .cs4-row.is-now time{
  color:color-mix(in srgb,var(--ink) 92%,var(--cs-green,#10b981))!important;
  font-weight:790!important;
}
.cs4 .cs4-row.is-now>strong{
  color:var(--ink)!important;
  font-weight:840!important;
}
.cs4 .cs4-row.is-now .cs4-period{color:color-mix(in srgb,var(--ink) 76%,var(--cs-green,#10b981))!important}
.cs4 .cs4-row.is-now>em{
  display:inline-flex!important;
  align-items:center;
  justify-content:center;
  min-width:54px!important;
  max-width:none!important;
  padding:4px 9px!important;
  border-color:color-mix(in srgb,var(--cs-green,#10b981) 38%,var(--line))!important;
  background:color-mix(in srgb,var(--cs-green,#10b981) 16%,var(--panel))!important;
  color:color-mix(in srgb,var(--cs-green,#10b981) 74%,var(--ink))!important;
  font-size:0!important;
  font-weight:820!important;
  overflow:visible!important;
}
.cs4 .cs4-row.is-now>em:after{content:'進行中';font-size:9px;line-height:1}

/* Focus/narrow mode still keeps the active badge while other low-priority pills stay hidden. */
.cs4.cs6-narrow .cs4-row.is-now{grid-template-columns:10px 72px minmax(0,1fr) auto!important}
.cs4.cs6-narrow .cs4-row.is-now>em{display:inline-flex!important;min-width:48px!important;padding:3px 7px!important}
.cs4.cs6-narrow .cs4-row.is-now>em:after{font-size:8px}

:root[data-theme=dark] .cs4 .cs4-row.is-now{
  background:linear-gradient(90deg,
    color-mix(in srgb,var(--cs-green,#10b981) 30%,var(--panel)),
    color-mix(in srgb,var(--cs-cyan,#28c7f7) 16%,var(--panel2)))!important;
  border-color:color-mix(in srgb,var(--cs-green,#10b981) 55%,var(--line))!important;
  box-shadow:
    inset 4px 0 0 var(--cs-green,#10b981),
    0 0 0 1px color-mix(in srgb,var(--cs-green,#10b981) 14%,transparent),
    0 8px 22px rgba(0,0,0,.18)!important;
}
:root[data-theme=light] .cs4 .cs4-row.is-now{
  background:linear-gradient(90deg,
    color-mix(in srgb,var(--cs-green,#10b981) 17%,#fff),
    color-mix(in srgb,var(--cs-cyan,#28c7f7) 9%,#fff))!important;
}
`;
  document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.WebDeskClassScheduleActive={version:'v8',state:'current-course-emphasis'};
})();