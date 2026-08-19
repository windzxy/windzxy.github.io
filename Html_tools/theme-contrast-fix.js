(function(){
  if(window.__windzxyThemeContrastFixLoaded)return;
  window.__windzxyThemeContrastFixLoaded=1;
  const VER='20260819-theme-contrast1-widget-aware';

  function installStyle(){
    if(document.getElementById('windzxyThemeContrastFixStyle'))return;
    const s=document.createElement('style');
    s.id='windzxyThemeContrastFixStyle';
    s.textContent=`
:root{
  --wd-widget-ink:var(--ink,#101217);
  --wd-widget-muted:rgba(16,18,23,.62);
  --wd-widget-line:rgba(16,18,23,.13);
  --wd-widget-line-soft:rgba(16,18,23,.075);
  --wd-widget-surface:rgba(255,255,255,.78);
  --wd-widget-surface-2:rgba(255,255,255,.60);
  --wd-widget-surface-3:rgba(255,255,255,.46);
  --wd-widget-control:rgba(255,255,255,.74);
  --wd-widget-control-2:rgba(255,255,255,.56);
  --wd-widget-menu:rgba(255,255,255,.97);
  --wd-widget-menu-2:rgba(246,248,252,.97);
  --wd-widget-shadow:0 18px 52px rgba(16,18,23,.15);
  --wd-widget-green:#059669;
  --wd-widget-red:#e11d48;
  --wd-widget-cyan:#0284c7;
  --wd-widget-gold:#b7791f;
  --wd-widget-work:#b45309;
}
:root[data-theme=dark]{
  --wd-widget-ink:var(--ink,#f5f5f7);
  --wd-widget-muted:rgba(235,241,249,.66);
  --wd-widget-line:rgba(255,255,255,.115);
  --wd-widget-line-soft:rgba(255,255,255,.065);
  --wd-widget-surface:rgba(38,43,54,.72);
  --wd-widget-surface-2:rgba(25,29,38,.64);
  --wd-widget-surface-3:rgba(255,255,255,.075);
  --wd-widget-control:rgba(255,255,255,.105);
  --wd-widget-control-2:rgba(255,255,255,.075);
  --wd-widget-menu:rgba(26,32,44,.98);
  --wd-widget-menu-2:rgba(15,20,30,.98);
  --wd-widget-shadow:0 18px 52px rgba(0,0,0,.34);
  --wd-widget-green:#22d47b;
  --wd-widget-red:#ff667c;
  --wd-widget-cyan:#7ad7ff;
  --wd-widget-gold:#ffd36a;
  --wd-widget-work:#ffcf70;
}
/* New widgets must use icons, not letter placeholders. */
.t-calendar .app-icon,.t-fx .app-icon,.t-metals .app-icon{font-size:0!important;position:relative;overflow:hidden}
.t-calendar .app-icon::before,.t-fx .app-icon::before,.t-metals .app-icon::before{font-size:22px;line-height:1;display:block;filter:drop-shadow(0 1px 0 rgba(255,255,255,.22))}
.t-calendar .app-icon::before{content:'📅'}
.t-fx .app-icon::before{content:'⇄';font-size:26px;font-weight:950}
.t-metals .app-icon::before{content:'◉';font-size:25px;color:#fff7d6;text-shadow:0 0 14px rgba(255,211,106,.55)}
/* Theme-aware surfaces for finance/calendar widgets. */
.fxdesk,.mdesk,.calendar-widget{color:var(--wd-widget-ink)!important}
.fxdesk .fx-status,.fxdesk .fx-foot,.fxdesk .fx-amount span,.fxdesk .fx-pick>span,.fxdesk .fx-result small,
.mdesk .md-feed,.mdesk .md-foot,.mdesk .md-title span,.mdesk .md-range,.mdesk .md-deals span,.mdesk .md-stats span,
.calendar-widget .cw-title p,.calendar-widget .cw-hero span,.calendar-widget .cw-week b,.calendar-widget .cw-day span,.calendar-widget .cw-events h4,.calendar-widget .cw-events em,.calendar-widget .cw-muted{color:var(--wd-widget-muted)!important}
.fxdesk .fx-status b,.mdesk .md-feed b,.fxdesk .fx-head button,.fxdesk .fx-foot button,.fxdesk .fx-swap,.mdesk .md-refresh,.mdesk .md-foot button,.calendar-widget .cw-head button{background:var(--wd-widget-control)!important;border-color:var(--wd-widget-line)!important;color:var(--wd-widget-ink)!important;box-shadow:none!important}
.fxdesk .fx-converter,.mdesk .md-chart,.mdesk .md-quote,.calendar-widget .cw-hero{background:linear-gradient(135deg,var(--wd-widget-surface),var(--wd-widget-surface-2))!important;border-color:var(--wd-widget-line)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)!important}
.fxdesk .fx-table,.calendar-widget .cw-month,.calendar-widget .cw-events{background:linear-gradient(180deg,var(--wd-widget-surface),var(--wd-widget-surface-3))!important;border-color:var(--wd-widget-line)!important;box-shadow:var(--wd-widget-shadow)!important}
.fxdesk .fx-tr,.calendar-widget .cw-events p,.calendar-widget .cw-day{border-color:var(--wd-widget-line-soft)!important}
.fxdesk .fx-th,.calendar-widget .cw-week{background:var(--wd-widget-control-2)!important;color:var(--wd-widget-muted)!important}
.fxdesk .fx-amount input,.fxdesk .fx-select,.mdesk .md-deals div,.mdesk .md-stats div{background:var(--wd-widget-control-2)!important;border-color:var(--wd-widget-line)!important;color:var(--wd-widget-ink)!important}
.fxdesk .fx-select em,.fxdesk .fx-select i{color:var(--wd-widget-muted)!important}
.fxdesk .fx-menu{background:linear-gradient(180deg,var(--wd-widget-menu),var(--wd-widget-menu-2))!important;border-color:var(--wd-widget-line)!important;box-shadow:var(--wd-widget-shadow)!important}
.fxdesk .fx-menu button,.fxdesk .fx-menu button span{color:var(--wd-widget-ink)!important}
.fxdesk .fx-menu button:hover,.fxdesk .fx-menu button.on{background:color-mix(in srgb,var(--wd-widget-cyan) 18%,transparent)!important}
.fxdesk .fx-result strong,.fxdesk .fx-menu button b,.fxdesk .fx-tr.up span:not(.fx-currency) b,.fxdesk .fx-status i.on,
.mdesk .md-tabs small,.mdesk .md-change b,.mdesk .md-price strong,.mdesk .md-feed i.on{color:var(--wd-widget-green)!important}
.fxdesk .fx-tr.down span:not(.fx-currency) b,.mdesk .up .md-change b,.mdesk .up .md-price strong{color:var(--wd-widget-red)!important}
.fxdesk .fx-currency b,.fxdesk .fx-tr span:not(.fx-currency) b,.mdesk .md-tabs strong,.mdesk .md-title b,.mdesk .md-deals b,.mdesk .md-stats b{color:var(--wd-widget-ink)!important}
.fxdesk .fx-currency small{color:var(--wd-widget-muted)!important}
.mdesk .md-tabs button{background:linear-gradient(180deg,var(--wd-widget-surface),var(--wd-widget-control-2))!important;border-color:var(--wd-widget-line)!important}
.mdesk .md-tabs .on{background:linear-gradient(135deg,color-mix(in srgb,var(--wd-widget-gold) 20%,transparent),color-mix(in srgb,var(--wd-widget-green) 10%,transparent))!important;border-color:color-mix(in srgb,var(--wd-widget-gold) 48%,transparent)!important}
.mdesk .md-title em,.mdesk .md-stats i{color:var(--wd-widget-gold)!important}.mdesk .md-stats i{background:color-mix(in srgb,var(--wd-widget-gold) 16%,transparent)!important}
.mdesk .md-range div{background:linear-gradient(90deg,color-mix(in srgb,var(--wd-widget-green) 30%,transparent),color-mix(in srgb,var(--wd-widget-gold) 30%,transparent),color-mix(in srgb,var(--wd-widget-red) 30%,transparent))!important}.mdesk .md-range i{background:var(--wd-widget-ink)!important}
.calendar-widget .cw-hero>strong{color:var(--wd-widget-cyan)!important}.calendar-widget .cw-day.selected{background:linear-gradient(135deg,color-mix(in srgb,var(--wd-widget-cyan) 20%,transparent),color-mix(in srgb,#8b5cf6 15%,transparent))!important;box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--wd-widget-cyan) 58%,transparent)!important}
.calendar-widget .cw-day.cn-rest:not(.selected){background:color-mix(in srgb,var(--wd-widget-green) 11%,transparent)!important}.calendar-widget .cw-day.cn-work:not(.selected){background:color-mix(in srgb,var(--wd-widget-work) 13%,transparent)!important}.calendar-widget .cw-day.hk-rest:not(.selected){background:color-mix(in srgb,var(--wd-widget-cyan) 12%,transparent)!important}
.calendar-widget .cn-rest{background:color-mix(in srgb,var(--wd-widget-green) 18%,transparent)!important;color:var(--wd-widget-green)!important}.calendar-widget .cn-work{background:color-mix(in srgb,var(--wd-widget-work) 18%,transparent)!important;color:var(--wd-widget-work)!important}.calendar-widget .hk-rest{background:color-mix(in srgb,var(--wd-widget-cyan) 18%,transparent)!important;color:var(--wd-widget-cyan)!important}
/* Calendar adaptive visibility by real card ratio, not only width. */
.calendar-widget.cal-ratio-wide .cw-body{grid-template-columns:minmax(0,1fr) 176px!important}.calendar-widget.cal-ratio-portrait .cw-body,.calendar-widget.cal-ratio-short .cw-body{grid-template-columns:1fr!important}.calendar-widget.cal-ratio-short .cw-events,.calendar-widget.cal-ratio-mini .cw-events{display:none!important}.calendar-widget.cal-ratio-short .cw-hero{min-height:58px!important;padding:7px 10px!important}.calendar-widget.cal-ratio-short .cw-hero>strong{font-size:30px!important}.calendar-widget.cal-ratio-mini .cw-hero{display:none!important}.calendar-widget.cal-ratio-mini .cw-title p{display:none!important}.calendar-widget.cal-ratio-mini .cw-grid{min-height:185px!important}.calendar-widget.cal-ratio-mini .cw-day{padding:3px!important}.calendar-widget.cal-ratio-mini .cw-day strong{font-size:12px!important}.calendar-widget.cal-ratio-mini .cw-day span{font-size:8.5px!important}
    `;
    document.head.appendChild(s);
  }

  function applyCalendarRatio(){
    document.querySelectorAll('.calendar-widget').forEach(el=>{
      const box=el.getBoundingClientRect();
      const w=box.width||el.clientWidth;
      const h=box.height||el.clientHeight;
      const ratio=w/Math.max(1,h);
      el.classList.toggle('cal-ratio-wide',w>=560&&h>=390&&ratio>=1.12);
      el.classList.toggle('cal-ratio-portrait',w<500||ratio<1.05);
      el.classList.toggle('cal-ratio-short',h<390||ratio>1.45);
      el.classList.toggle('cal-ratio-mini',w<360||h<315);
    });
  }
  function installObservers(){
    if(window.__windzxyThemeContrastResizeObserver)return;
    window.__windzxyThemeContrastResizeObserver=1;
    const run=()=>requestAnimationFrame(applyCalendarRatio);
    if(window.ResizeObserver){
      const ro=new ResizeObserver(run);
      const attach=()=>document.querySelectorAll('.calendar-widget').forEach(el=>{if(!el.dataset.themeObserved){el.dataset.themeObserved='1';ro.observe(el);}});
      attach();setInterval(attach,1500);
    }
    new MutationObserver(run).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    document.addEventListener('click',()=>setTimeout(run,80),true);
    window.addEventListener('resize',run,{passive:true});
    run();setTimeout(run,500);setTimeout(run,1500);
  }

  function boot(){installStyle();installObservers();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyThemeContrastFixVersion=VER;
})();
