(function(){
  'use strict';
  const VER='20260901-class-schedule-theme-v2-webdesk-native';
  if(window.__windzxyClassScheduleThemeV2===VER)return;
  window.__windzxyClassScheduleThemeV2=VER;

  function install(){
    if(document.getElementById('classScheduleThemeV2Style'))return;
    const s=document.createElement('style');
    s.id='classScheduleThemeV2Style';
    s.textContent=`
      .t-schedule{--icon:linear-gradient(145deg,var(--blue1),var(--purple1));--glow:linear-gradient(135deg,var(--blue1),var(--purple2))}
      .class-schedule-v1{
        --cs-bg:color-mix(in srgb,var(--panel) 94%,transparent);
        --cs-bg-soft:color-mix(in srgb,var(--panel2) 92%,transparent);
        --cs-ink:var(--ink);
        --cs-muted:var(--muted);
        --cs-line:color-mix(in srgb,var(--line) 90%,transparent);
        --cs-accent:color-mix(in srgb,var(--blue1) 62%,var(--purple1));
        --cs-accent-2:color-mix(in srgb,var(--blue2) 52%,var(--purple2));
        --cs-accent-soft:color-mix(in srgb,var(--cs-accent) 13%,transparent);
        --cs-next-soft:color-mix(in srgb,var(--blue1) 9%,transparent);
        height:100%;min-height:0;padding:12px;gap:10px;
        background:linear-gradient(145deg,var(--cs-bg),var(--cs-bg-soft));
        color:var(--cs-ink);border:1px solid var(--cs-line);
        border-radius:18px;box-shadow:inset 0 1px 0 color-mix(in srgb,var(--panel) 70%,transparent);
      }
      .class-schedule-v1,.class-schedule-v1 button,.class-schedule-v1 time,.class-schedule-v1 small,.class-schedule-v1 span,.class-schedule-v1 strong,.class-schedule-v1 b,.class-schedule-v1 footer{color:var(--cs-ink)}
      .csv1-head>div:first-child span,.csv1-summary span,.csv1-days button small,.csv1-row time,.csv1-lesson span,.csv1-section,.class-schedule-v1 footer{color:var(--cs-muted);opacity:1}
      .csv1-head strong{font-size:18px;font-weight:720;letter-spacing:-.02em}
      .csv1-head>div:first-child span{font-size:9px;font-weight:700;letter-spacing:.14em}
      .csv1-view{background:color-mix(in srgb,var(--panel2) 86%,transparent);border:1px solid var(--cs-line)}
      .csv1-view button{color:var(--cs-muted);font-weight:650}
      .csv1-view button.on{background:color-mix(in srgb,var(--panel) 96%,transparent);color:var(--cs-ink);box-shadow:0 5px 16px color-mix(in srgb,var(--ink) 8%,transparent)}
      .csv1-summary{background:linear-gradient(135deg,color-mix(in srgb,var(--cs-accent) 14%,var(--panel)),color-mix(in srgb,var(--cs-accent-2) 10%,var(--panel2)));border:1px solid color-mix(in srgb,var(--cs-accent) 16%,var(--line));min-height:48px}
      .csv1-summary b{font-size:13px;font-weight:720;color:var(--cs-ink)}
      .csv1-days button{background:color-mix(in srgb,var(--panel2) 90%,transparent);border:1px solid var(--cs-line);color:var(--cs-ink)}
      .csv1-days button:hover{background:color-mix(in srgb,var(--panel) 94%,transparent)}
      .csv1-days button.on{background:linear-gradient(135deg,var(--cs-accent),var(--cs-accent-2));color:#07111f;border-color:transparent;box-shadow:0 8px 20px color-mix(in srgb,var(--cs-accent) 24%,transparent)}
      .csv1-days button.on small,.csv1-days button.on b{color:#07111f;opacity:1}
      :root[data-theme=dark] .csv1-days button.on,:root[data-theme=dark] .csv1-days button.on small,:root[data-theme=dark] .csv1-days button.on b{color:#07111f}
      .csv1-body{scrollbar-color:color-mix(in srgb,var(--cs-muted) 38%,transparent) transparent}
      .csv1-section{background:color-mix(in srgb,var(--panel) 94%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--cs-line);font-weight:700}
      .csv1-row{border:1px solid transparent}
      .csv1-row:hover{background:color-mix(in srgb,var(--panel2) 88%,transparent);border-color:var(--cs-line)}
      .csv1-row.is-now{background:var(--cs-accent-soft);border-color:color-mix(in srgb,var(--cs-accent) 28%,var(--line));box-shadow:inset 3px 0 var(--cs-accent)}
      .csv1-row.is-next{background:var(--cs-next-soft);border-color:color-mix(in srgb,var(--blue1) 16%,var(--line))}
      .csv1-row time{font-weight:620;font-variant-numeric:tabular-nums}
      .csv1-lesson strong{color:var(--cs-ink);font-weight:700}
      .csv1-dot{width:7px;height:7px;background:var(--sub,#94a3b8);box-shadow:0 0 0 3px color-mix(in srgb,var(--sub,#94a3b8) 14%,transparent)}
      .csv1-week{color:var(--cs-ink)}
      .csv1-week-corner,.csv1-week-time,.csv1-week-cell{border-color:var(--cs-line)!important;background:color-mix(in srgb,var(--panel2) 82%,transparent)!important;color:var(--cs-ink)!important}
      .csv1-week button{background:color-mix(in srgb,var(--panel2) 90%,transparent)!important;color:var(--cs-ink)!important;border-color:var(--cs-line)!important}
      .csv1-week button.on{background:linear-gradient(135deg,var(--cs-accent),var(--cs-accent-2))!important;color:#07111f!important}
      .class-schedule-v1 footer{border-top:1px solid var(--cs-line);padding-top:7px;font-size:10px}
      :root[data-theme=dark] .class-schedule-v1{
        --cs-bg:color-mix(in srgb,var(--panel) 96%,#111827 4%);
        --cs-bg-soft:color-mix(in srgb,var(--panel2) 90%,#0f172a 10%);
        --cs-accent-soft:color-mix(in srgb,var(--cs-accent) 18%,transparent);
        --cs-next-soft:color-mix(in srgb,var(--blue1) 13%,transparent);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.045);
      }
      :root[data-theme=dark] .csv1-view button.on{background:color-mix(in srgb,var(--panel) 92%,#111827 8%)}
      :root[data-theme=dark] .csv1-summary{background:linear-gradient(135deg,color-mix(in srgb,var(--cs-accent) 20%,var(--panel)),color-mix(in srgb,var(--cs-accent-2) 12%,var(--panel2)))}
      :root[data-theme=dark] .csv1-section{background:color-mix(in srgb,var(--panel) 96%,transparent)}
      @container (max-width:430px){
        .class-schedule-v1{padding:9px;gap:8px}.csv1-head strong{font-size:16px}.csv1-head>div:first-child span{display:none}.csv1-view button{padding:5px 8px}.csv1-summary{min-height:42px;padding:7px 9px}.csv1-days{gap:4px}.csv1-days button{padding:5px 2px}.csv1-row{grid-template-columns:76px minmax(0,1fr) 8px;gap:7px;min-height:44px;padding:5px 6px}.csv1-lesson strong{font-size:12px}.csv1-row time{font-size:9px}.class-schedule-v1 footer span:first-child{display:none}
      }
      @container (max-height:470px){.class-schedule-v1{gap:7px}.csv1-summary{min-height:40px}.csv1-days button{padding:4px}.csv1-row{min-height:41px}.class-schedule-v1 footer{display:none}}
    `;
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.windzxyClassScheduleThemeV2=VER;
})();
