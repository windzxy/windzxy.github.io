(function(){
  if(window.__windzxyThemeContrastFixLoaded)return;
  window.__windzxyThemeContrastFixLoaded=1;
  const VER='20260819-theme-contrast2-calendar-density';

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
.t-calendar .app-icon,.t-fx .app-icon,.t-metals .app-icon{font-size:0!important;position:relative;overflow:hidden}
.t-calendar .app-icon::before,.t-fx .app-icon::before,.t-metals .app-icon::before{line-height:1;display:block;filter:drop-shadow(0 1px 0 rgba(255,255,255,.22))}
.t-calendar .app-icon::before{content:'📅';font-size:22px!important}
.t-fx .app-icon::before{content:'⇄';font-size:26px!important;font-weight:950}
.t-metals .app-icon::before{content:'◉';font-size:25px!important;color:#fff7d6;text-shadow:0 0 14px rgba(255,211,106,.55)}
.fxdesk,.mdesk,.calendar-widget{color:var(--wd-widget-ink)!important}
.fxdesk .fx-status,.fxdesk .fx-foot,.fxdesk .fx-amount span,.fxdesk .fx-pick>span,.fxdesk .fx-result small,
.mdesk .md-feed,.mdesk .md-foot,.mdesk .md-title span,.mdesk .md-range,.mdesk .md-deals span,.mdesk .md-stats span,
.calendar-widget .cw-title p,.calendar-widget .cw-hero span,.calendar-widget .cw-week b,.calendar-widget .cw-day span,.calendar-widget .cw-events h4,.calendar-widget .cw-events em,.calendar-widget .cw-muted,
.calendar-widget .calp-title p,.calendar-widget .calp-hero span,.calendar-widget .calp-week b,.calendar-widget .calp-day span,.calendar-widget .calp-events h4,.calendar-widget .calp-events em,.calendar-widget .calp-muted,.calendar-widget .calp-year h4{color:var(--wd-widget-muted)!important}
.fxdesk .fx-status b,.mdesk .md-feed b,.fxdesk .fx-head button,.fxdesk .fx-foot button,.fxdesk .fx-swap,.mdesk .md-refresh,.mdesk .md-foot button,.calendar-widget .cw-head button,.calendar-widget .calp-head button,.calendar-widget .calp-jump button{background:var(--wd-widget-control)!important;border-color:var(--wd-widget-line)!important;color:var(--wd-widget-ink)!important;box-shadow:none!important}
.fxdesk .fx-converter,.mdesk .md-chart,.mdesk .md-quote,.calendar-widget .cw-hero,.calendar-widget .calp-hero{background:linear-gradient(135deg,var(--wd-widget-surface),var(--wd-widget-surface-2))!important;border-color:var(--wd-widget-line)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)!important}
.fxdesk .fx-table,.calendar-widget .cw-month,.calendar-widget .cw-events,.calendar-widget .calp-month,.calendar-widget .calp-side>div{background:linear-gradient(180deg,var(--wd-widget-surface),var(--wd-widget-surface-3))!important;border-color:var(--wd-widget-line)!important;box-shadow:var(--wd-widget-shadow)!important}
.fxdesk .fx-tr,.calendar-widget .cw-events p,.calendar-widget .cw-day,.calendar-widget .calp-day,.calendar-widget .calp-events p{border-color:var(--wd-widget-line-soft)!important}
.fxdesk .fx-th,.calendar-widget .cw-week,.calendar-widget .calp-week{background:var(--wd-widget-control-2)!important;color:var(--wd-widget-muted)!important}
.fxdesk .fx-amount input,.fxdesk .fx-select,.fxdesk .fx-menu,.calendar-widget .calp-jump input,.calendar-widget .calp-jump select,.mdesk .md-deals div,.mdesk .md-stats div,.calendar-widget .calp-year button{background:var(--wd-widget-control-2)!important;border-color:var(--wd-widget-line)!important;color:var(--wd-widget-ink)!important}
.fxdesk .fx-select em,.fxdesk .fx-select i{color:var(--wd-widget-muted)!important}
.fxdesk .fx-menu{background:linear-gradient(180deg,var(--wd-widget-menu),var(--wd-widget-menu-2))!important;box-shadow:var(--wd-widget-shadow)!important}
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
.calendar-widget .cw-hero>strong,.calendar-widget .calp-hero>strong{color:var(--wd-widget-cyan)!important}.calendar-widget .cw-day.selected,.calendar-widget .calp-day.selected{background:linear-gradient(135deg,color-mix(in srgb,var(--wd-widget-cyan) 20%,transparent),color-mix(in srgb,#8b5cf6 15%,transparent))!important;box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--wd-widget-cyan) 58%,transparent)!important}
.calendar-widget .cw-day.cn-rest:not(.selected),.calendar-widget .calp-day.cn-rest:not(.selected){background:color-mix(in srgb,var(--wd-widget-green) 11%,transparent)!important}.calendar-widget .cw-day.cn-work:not(.selected),.calendar-widget .calp-day.cn-work:not(.selected){background:color-mix(in srgb,var(--wd-widget-work) 13%,transparent)!important}.calendar-widget .cw-day.hk-rest:not(.selected),.calendar-widget .calp-day.hk-rest:not(.selected){background:color-mix(in srgb,var(--wd-widget-cyan) 12%,transparent)!important}
.calendar-widget .cn-rest{background:color-mix(in srgb,var(--wd-widget-green) 18%,transparent)!important;color:var(--wd-widget-green)!important}.calendar-widget .cn-work{background:color-mix(in srgb,var(--wd-widget-work) 18%,transparent)!important;color:var(--wd-widget-work)!important}.calendar-widget .hk-rest{background:color-mix(in srgb,var(--wd-widget-cyan) 18%,transparent)!important;color:var(--wd-widget-cyan)!important}
/* Calendar density and equal-cell polish. */
.calendar-widget.cal-perp{gap:7px!important;min-height:0!important}
.calendar-widget.cal-perp .calp-jump{grid-template-columns:minmax(60px,.58fr) minmax(74px,.72fr) minmax(132px,1fr) 52px!important;gap:6px!important;align-items:center!important}
.calendar-widget.cal-perp .calp-jump button{grid-column:auto!important;width:52px!important;min-width:52px!important;max-width:52px!important;justify-self:end!important;padding:0!important;border-radius:10px!important;font-size:13px!important}
.calendar-widget.cal-perp .calp-jump input,.calendar-widget.cal-perp .calp-jump select{width:100%!important;min-width:0!important}
.calendar-widget.cal-perp .calp-body{min-height:0!important}
.calendar-widget.cal-perp .calp-month{display:grid!important;grid-template-rows:25px minmax(0,1fr)!important;min-height:0!important}
.calendar-widget.cal-perp .calp-grid{height:100%!important;min-height:252px!important;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-template-rows:repeat(6,minmax(42px,1fr))!important}
.calendar-widget.cal-perp .calp-day{height:100%!important;min-height:0!important;padding:5px!important;display:grid!important;grid-template-rows:auto auto minmax(14px,1fr)!important;align-content:stretch!important;gap:1px!important}
.calendar-widget.cal-perp .calp-day strong{font-size:14px!important;line-height:1.05!important}.calendar-widget.cal-perp .calp-day span{font-size:10px!important;line-height:1.15!important}.calendar-widget.cal-perp .calp-day div{min-height:14px!important;align-self:end!important;margin-top:0!important;overflow:hidden!important}
.calendar-widget.cal-perp .calp-day i{font-size:8.5px!important;padding:1px 4px!important;line-height:1.25!important}
.calendar-widget.cal-fit-wide .calp-body{grid-template-columns:minmax(0,1fr) 176px!important}.calendar-widget.cal-fit-portrait .calp-body,.calendar-widget.cal-fit-short .calp-body{grid-template-columns:1fr!important}.calendar-widget.cal-fit-portrait .calp-year{display:none!important}.calendar-widget.cal-fit-short .calp-side,.calendar-widget.cal-fit-mini .calp-side{display:none!important}.calendar-widget.cal-fit-short .calp-hero{min-height:54px!important;padding:6px 9px!important}.calendar-widget.cal-fit-short .calp-hero>strong{font-size:29px!important}.calendar-widget.cal-fit-short .calp-jump{display:none!important}.calendar-widget.cal-fit-mini .calp-hero{display:none!important}.calendar-widget.cal-fit-mini .calp-title p{display:none!important}.calendar-widget.cal-fit-mini .calp-grid{min-height:210px!important;grid-template-rows:repeat(6,minmax(35px,1fr))!important}.calendar-widget.cal-fit-mini .calp-day{padding:3px!important}.calendar-widget.cal-fit-mini .calp-day strong{font-size:12px!important}.calendar-widget.cal-fit-mini .calp-day span{font-size:8.5px!important}.calendar-widget.cal-fit-narrow .calp-jump{grid-template-columns:54px 68px minmax(100px,1fr) 40px!important}.calendar-widget.cal-fit-narrow .calp-jump button{width:40px!important;min-width:40px!important;max-width:40px!important;font-size:0!important}.calendar-widget.cal-fit-narrow .calp-jump button::before{content:'↵';font-size:14px!important}
@container (max-width:430px){.calendar-widget.cal-perp .calp-jump{grid-template-columns:54px 68px minmax(100px,1fr) 40px!important}.calendar-widget.cal-perp .calp-jump button{grid-column:auto!important;width:40px!important;min-width:40px!important;max-width:40px!important;font-size:0!important}.calendar-widget.cal-perp .calp-jump button::before{content:'↵';font-size:14px!important}.calendar-widget.cal-perp .calp-grid{min-height:220px!important;grid-template-rows:repeat(6,minmax(36px,1fr))!important}}
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
      el.classList.toggle('cal-fit-wide',w>=560&&h>=440&&ratio>=1.08);
      el.classList.toggle('cal-fit-portrait',w<510||ratio<1.02);
      el.classList.toggle('cal-fit-short',h<430||ratio>1.48);
      el.classList.toggle('cal-fit-mini',w<360||h<330);
      el.classList.toggle('cal-fit-narrow',w<430);
    });
  }
  function installObservers(){
    if(window.__windzxyThemeContrastResizeObserver)return;
    window.__windzxyThemeContrastResizeObserver=1;
    const run=()=>requestAnimationFrame(applyCalendarRatio);
    if(window.ResizeObserver){
      const ro=new ResizeObserver(run);
      const attach=()=>document.querySelectorAll('.calendar-widget').forEach(el=>{if(!el.dataset.themeObserved){el.dataset.themeObserved='1';ro.observe(el);}});
      attach();setInterval(attach,1200);
    }
    new MutationObserver(run).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    document.addEventListener('click',()=>setTimeout(run,80),true);
    window.addEventListener('resize',run,{passive:true});
    run();setTimeout(run,300);setTimeout(run,1200);
  }

  function boot(){installStyle();installObservers();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyThemeContrastFixVersion=VER;
})();
