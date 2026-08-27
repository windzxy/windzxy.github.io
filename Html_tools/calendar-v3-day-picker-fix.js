(function(){
  'use strict';
  const VER='20260827-calendar-v3-day-picker4-mobile-nav-clean';
  if(window.__windzxyCalendarV3DayPickerFixVersion===VER)return;
  window.__windzxyCalendarV3DayPickerFixVersion=VER;

  function getLang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^en/i.test(v))return 'en';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    return 'zh-HK';
  }
  function isZh(){return getLang()!=='en';}
  function tDay(){return isZh()?'日':'Day';}
  function tYear(){return isZh()?'年':'Year';}
  function tMonth(){return isZh()?'月':'Month';}
  function pad(n){return String(n).padStart(2,'0');}
  function daysInMonth(y,m){return new Date(Number(y)||new Date().getFullYear(),Number(m)+1,0).getDate();}
  function parseDateValue(v){
    const s=String(v||'').trim();
    let m=s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if(!m)return null;
    return {y:Number(m[1]),m:Number(m[2])-1,d:Number(m[3])};
  }
  function closeMenus(){
    document.querySelectorAll('.cv3-day-menu').forEach(menu=>menu.hidden=true);
    document.querySelectorAll('.cv3-day-display.is-open').forEach(btn=>btn.classList.remove('is-open'));
  }
  function readParts(root){
    const today=new Date();
    const yearEl=root.querySelector('[data-cv3-year]');
    const monthEl=root.querySelector('select[data-cv3-month]');
    const input=root.querySelector('[data-cv3-date]');
    const fromInput=parseDateValue(input?.value);
    const y=Number(yearEl?.value)||fromInput?.y||today.getFullYear();
    const m=Number.isFinite(Number(monthEl?.value))?Number(monthEl.value):(fromInput?.m??today.getMonth());
    const d=fromInput?.d||today.getDate();
    return {y,m,d,input,yearEl,monthEl};
  }
  function setCalendarDate(root,day,opts={}){
    const p=readParts(root);
    if(!p.input)return;
    const max=daysInMonth(p.y,p.m);
    const d=Math.max(1,Math.min(max,Number(day)||p.d||1));
    const val=`${String(p.y).padStart(4,'0')}-${pad(p.m+1)}-${pad(d)}`;
    if(p.input.value!==val)p.input.value=val;
    if(!opts.silent)p.input.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function syncFromYearMonth(root){
    const p=readParts(root);
    setCalendarDate(root,Math.min(p.d,daysInMonth(p.y,p.m)));
  }
  function updateMenu(shell,root){
    const p=readParts(root);
    if(!p.input)return;
    const max=daysInMonth(p.y,p.m);
    const current=Math.max(1,Math.min(max,p.d||1));
    const btn=shell.querySelector('.cv3-day-display');
    const menu=shell.querySelector('.cv3-day-menu');
    if(btn){
      btn.textContent=String(current);
      btn.setAttribute('aria-label',`${tDay()} ${current}`);
      btn.title=`${tDay()} ${current}`;
    }
    if(menu){
      const title=isZh()?'選擇日期':'Select day';
      const unit=isZh()?' 日':' days';
      const buttons=Array.from({length:max},(_,i)=>{
        const d=i+1;
        return `<button type="button" data-cv3-day="${d}" class="${d===current?'on':''}" aria-label="${tDay()} ${d}">${d}</button>`;
      }).join('');
      menu.innerHTML=`<div class="cv3-day-menu-head"><b>${title}</b><span>${max}${unit}</span></div><div class="cv3-day-grid">${buttons}</div>`;
    }
  }
  function relabel(root){
    root.setAttribute('lang',isZh()?'zh':'en');
    const yearSpan=root.querySelector('[data-cv3-year]')?.closest('label')?.querySelector('span');
    const monthSpan=root.querySelector('select[data-cv3-month]')?.closest('label')?.querySelector('span');
    const daySpan=root.querySelector('[data-cv3-date]')?.closest('label')?.querySelector('span');
    if(yearSpan){yearSpan.textContent=tYear();yearSpan.dataset.i18n=tYear();}
    if(monthSpan){monthSpan.textContent=tMonth();monthSpan.dataset.i18n=tMonth();}
    if(daySpan){daySpan.textContent=tDay();daySpan.dataset.i18n=tDay();}
    root.querySelectorAll('[data-cv3-mode]').forEach(btn=>{
      const txt=btn.textContent.trim();
      if(txt==='Month'||txt==='月')btn.textContent=isZh()?'月':'Month';
      if(txt==='Year'||txt==='年')btn.textContent=isZh()?'年':'Year';
    });
  }
  function enhance(root){
    if(!root||!root.isConnected)return;
    root.classList.add('cv3-day-picker-auto','cv3-day-picker-clean','cv3-nav-clean');
    root.dataset.cv3DayPicker=VER;
    relabel(root);
    const input=root.querySelector('input[data-cv3-date],[data-cv3-date]');
    if(!input)return;
    const label=input.closest('label');
    if(!label)return;
    input.type='hidden';
    input.tabIndex=-1;
    input.setAttribute('aria-hidden','true');
    input.style.cssText+=';display:none!important;position:absolute!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important;';
    let shell=label.querySelector('.cv3-day-select-shell');
    if(!shell){
      shell=document.createElement('div');
      shell.className='cv3-day-select-shell';
      shell.innerHTML='<button class="cv3-day-display" type="button"></button><div class="cv3-day-menu" hidden></div>';
      label.appendChild(shell);
      const display=shell.querySelector('.cv3-day-display');
      const menu=shell.querySelector('.cv3-day-menu');
      display.addEventListener('click',event=>{
        event.preventDefault();event.stopPropagation();
        const shouldOpen=menu.hidden;
        closeMenus();
        updateMenu(shell,root);
        menu.hidden=!shouldOpen;
        display.classList.toggle('is-open',shouldOpen);
      },true);
      menu.addEventListener('click',event=>{
        const item=event.target.closest('[data-cv3-day]');
        if(!item)return;
        event.preventDefault();event.stopPropagation();
        menu.hidden=true;
        display.classList.remove('is-open');
        setCalendarDate(root,item.dataset.cv3Day);
      },true);
    }
    updateMenu(shell,root);
    const jump=root.querySelector('[data-cv3-act="jump"]');
    if(jump){jump.style.display='none';jump.setAttribute('aria-hidden','true');jump.tabIndex=-1;}
  }
  function installStyle(){
    ['windzxyCalendarV3DayPickerStyle','windzxyCalendarV3DayPickerStyleV2','windzxyCalendarV3DayPickerStyleV3','windzxyCalendarV3DayPickerStyleV4'].forEach(id=>document.getElementById(id)?.remove());
    const style=document.createElement('style');
    style.id='windzxyCalendarV3DayPickerStyleV4';
    style.textContent=`
.calendar-v3.cv3-nav-clean .cv3-head{grid-template-columns:minmax(0,1fr) auto!important;align-items:start!important}.calendar-v3.cv3-nav-clean .cv3-nav{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;width:auto!important;min-width:0!important;white-space:nowrap!important}.calendar-v3.cv3-nav-clean .cv3-nav button{flex:0 0 auto!important;width:46px!important;min-width:46px!important;height:42px!important;border-radius:16px!important;padding:0!important}.calendar-v3.cv3-nav-clean .cv3-nav button[data-cv3-act="today"]{width:auto!important;min-width:92px!important;max-width:132px!important;padding:0 18px!important}.calendar-v3.cv3-nav-clean.cv3-w-small .cv3-head{grid-template-columns:1fr!important}.calendar-v3.cv3-nav-clean.cv3-w-small .cv3-nav{justify-content:start!important}.calendar-v3.cv3-nav-clean.cv3-w-phone .cv3-nav{display:flex!important;width:auto!important;grid-template-columns:none!important}.calendar-v3.cv3-nav-clean.cv3-w-phone .cv3-nav button{width:42px!important;min-width:42px!important}.calendar-v3.cv3-nav-clean.cv3-w-phone .cv3-nav button[data-cv3-act="today"]{min-width:86px!important;width:auto!important;flex:0 0 auto!important}
.calendar-v3.cv3-day-picker-clean .cv3-controls{grid-template-columns:minmax(120px,.85fr) minmax(180px,1.05fr) minmax(116px,.48fr) minmax(145px,.9fr)!important;gap:10px!important;align-items:end!important}.calendar-v3.cv3-day-picker-clean .cv3-controls>[data-cv3-act="jump"]{display:none!important}.calendar-v3.cv3-day-picker-clean .cv3-controls label:nth-child(3){grid-column:auto!important}.calendar-v3.cv3-day-picker-clean .cv3-controls input[data-cv3-date]{display:none!important}.calendar-v3.cv3-day-picker-clean .cv3-day-select-shell{position:relative!important;width:100%!important;min-width:0!important}.calendar-v3.cv3-day-picker-clean .cv3-day-display{width:100%!important;height:42px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;padding:0 14px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:16px!important;background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.075))!important;color:#f4f7fb!important;font:inherit!important;font-size:16px!important;font-weight:850!important;text-align:left!important;box-sizing:border-box!important}.calendar-v3.cv3-day-picker-clean .cv3-day-display span{display:none!important}.calendar-v3.cv3-day-picker-clean .cv3-day-display:after{content:'⌄';opacity:.62;font-size:12px;margin-left:auto}.calendar-v3.cv3-day-picker-clean .cv3-day-display.is-open:after{content:'⌃'}
.calendar-v3.cv3-day-picker-clean .cv3-day-menu{position:absolute!important;z-index:999999!important;top:calc(100% + 8px)!important;left:50%!important;right:auto!important;width:286px!important;max-width:min(286px,calc(100vw - 32px))!important;transform:translateX(-50%)!important;overflow:hidden!important;padding:12px!important;border:1px solid rgba(255,255,255,.20)!important;border-radius:18px!important;background:rgba(43,47,56,.985)!important;box-shadow:0 20px 46px rgba(0,0,0,.44),inset 0 1px rgba(255,255,255,.08)!important;backdrop-filter:blur(18px)!important}.calendar-v3.cv3-day-picker-clean .cv3-day-menu[hidden]{display:none!important}.calendar-v3.cv3-day-picker-clean .cv3-day-menu-head{display:flex!important;align-items:center!important;justify-content:space-between!important;margin:0 0 10px!important;color:#f4f7fb!important}.calendar-v3.cv3-day-picker-clean .cv3-day-menu-head b{font-size:13px!important;font-weight:850!important}.calendar-v3.cv3-day-picker-clean .cv3-day-menu-head span{font-size:11px!important;opacity:.62!important}.calendar-v3.cv3-day-picker-clean .cv3-day-grid{display:grid!important;grid-template-columns:repeat(7,32px)!important;gap:7px!important;justify-content:center!important}.calendar-v3.cv3-day-picker-clean .cv3-day-grid button{width:32px!important;height:32px!important;min-width:0!important;padding:0!important;border:0!important;border-radius:10px!important;background:rgba(255,255,255,.06)!important;color:#f4f7fb!important;font-size:13px!important;font-weight:800!important;text-align:center!important}.calendar-v3.cv3-day-picker-clean .cv3-day-grid button:hover{background:rgba(255,255,255,.15)!important}.calendar-v3.cv3-day-picker-clean .cv3-day-grid button.on{background:linear-gradient(135deg,rgba(255,122,60,.62),rgba(255,202,88,.28))!important;color:#fff!important;box-shadow:0 0 0 1px rgba(255,255,255,.18) inset!important}
.calendar-v3.cv3-day-picker-clean.cv3-w-small .cv3-controls{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}.calendar-v3.cv3-day-picker-clean.cv3-w-small .cv3-controls label:nth-child(3){grid-column:1/2!important}.calendar-v3.cv3-day-picker-clean.cv3-w-small .cv3-seg{grid-column:2/3!important}.calendar-v3.cv3-day-picker-clean.cv3-w-phone .cv3-controls{grid-template-columns:1fr 1fr!important}.calendar-v3.cv3-day-picker-clean.cv3-w-phone .cv3-controls label:nth-child(3){grid-column:1/2!important}.calendar-v3.cv3-day-picker-clean.cv3-w-phone .cv3-seg{grid-column:2/3!important}.calendar-v3.cv3-day-picker-clean.cv3-w-micro .cv3-controls{grid-template-columns:1fr 1fr!important;display:grid!important}[data-theme="light"] .calendar-v3.cv3-day-picker-clean .cv3-day-display{background:rgba(255,255,255,.84)!important;color:#1f2937!important;border-color:rgba(15,23,42,.14)!important}[data-theme="light"] .calendar-v3.cv3-day-picker-clean .cv3-day-menu{background:rgba(248,250,252,.98)!important;border-color:rgba(15,23,42,.14)!important}[data-theme="light"] .calendar-v3.cv3-day-picker-clean .cv3-day-menu-head,[data-theme="light"] .calendar-v3.cv3-day-picker-clean .cv3-day-grid button{color:#1f2937!important}[data-theme="light"] .calendar-v3.cv3-day-picker-clean .cv3-day-grid button{background:rgba(15,23,42,.055)!important}
`;
    document.head.appendChild(style);
  }
  let timer=0;
  function scan(){installStyle();document.querySelectorAll('.calendar-v3').forEach(enhance);}
  function schedule(delay=80){clearTimeout(timer);timer=setTimeout(scan,delay);}
  function boot(){
    scan();
    new MutationObserver(()=>schedule(80)).observe(document.getElementById('desktopCanvas')||document.body,{childList:true,subtree:true});
    document.addEventListener('click',event=>{if(!event.target.closest('.cv3-day-select-shell'))closeMenus();},true);
    document.addEventListener('change',event=>{
      const root=event.target.closest('.calendar-v3');
      if(!root)return;
      if(event.target.matches('[data-cv3-year],select[data-cv3-month]'))syncFromYearMonth(root);
      schedule(60);
    },true);
    window.addEventListener('resize',()=>schedule(120),{passive:true});
    setTimeout(scan,120);
    setTimeout(scan,520);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
