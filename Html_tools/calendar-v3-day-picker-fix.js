(function(){
  'use strict';
  const VER='20260827-calendar-v3-day-picker2-polished-grid';
  if(window.__windzxyCalendarV3DayPickerFixVersion===VER)return;
  window.__windzxyCalendarV3DayPickerFixVersion=VER;

  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^en/i.test(v))return 'en';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    return 'zh-HK';
  }
  function isZh(){return lang()!=='en';}
  function pad(n){return String(n).padStart(2,'0');}
  function daysInMonth(y,m){return new Date(Number(y)||new Date().getFullYear(),Number(m)+1,0).getDate();}
  function closeMenus(){
    document.querySelectorAll('.cv3-day-menu').forEach(menu=>menu.hidden=true);
    document.querySelectorAll('.cv3-day-display.is-open').forEach(btn=>btn.classList.remove('is-open'));
  }
  function readParts(root){
    const y=Number(root.querySelector('[data-cv3-year]')?.value)||new Date().getFullYear();
    const m=Number(root.querySelector('select[data-cv3-month]')?.value);
    const input=root.querySelector('[data-cv3-date]');
    const raw=input?.value||`${y}-${pad((Number.isFinite(m)?m:0)+1)}-01`;
    const hit=String(raw).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const month=Number.isFinite(m)?m:(hit?Number(hit[2])-1:new Date().getMonth());
    const day=hit?Number(hit[3]):1;
    return {y, m:month, d:day, input};
  }
  function setInputDate(root,day){
    const p=readParts(root);
    if(!p.input)return;
    const max=daysInMonth(p.y,p.m);
    const d=Math.max(1,Math.min(max,Number(day)||p.d||1));
    p.input.value=`${String(p.y).padStart(4,'0')}-${pad(p.m+1)}-${pad(d)}`;
    p.input.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function updateMenu(shell,root){
    const p=readParts(root);
    if(!p.input)return;
    const max=daysInMonth(p.y,p.m);
    const current=Math.max(1,Math.min(max,p.d||1));
    const btn=shell.querySelector('.cv3-day-display');
    const menu=shell.querySelector('.cv3-day-menu');
    const label=isZh()?'日':'Day';
    if(btn){
      btn.innerHTML=`<strong>${current}</strong><span>${label}</span>`;
      btn.setAttribute('aria-label',`${label} ${current}`);
    }
    if(menu){
      menu.innerHTML=`<div class="cv3-day-menu-head"><b>${isZh()?'選擇日期':'Select day'}</b><span>${max}${isZh()?'日':' days'}</span></div><div class="cv3-day-grid">${Array.from({length:max},(_,i)=>{
        const d=i+1;
        return `<button type="button" data-cv3-day="${d}" class="${d===current?'on':''}">${d}</button>`;
      }).join('')}</div>`;
    }
  }
  function relabel(root){
    const y=root.querySelector('[data-cv3-year]')?.closest('label')?.querySelector('span');
    const m=root.querySelector('select[data-cv3-month]')?.closest('label')?.querySelector('span');
    const d=root.querySelector('input[data-cv3-date]')?.closest('label')?.querySelector('span');
    if(y){y.textContent=isZh()?'年':'Year';y.dataset.i18n=y.textContent;}
    if(m){m.textContent=isZh()?'月':'Month';m.dataset.i18n=m.textContent;}
    if(d){d.textContent=isZh()?'日':'Day';d.dataset.i18n=d.textContent;}
    root.querySelectorAll('[data-cv3-mode]').forEach(btn=>{
      const txt=btn.textContent.trim();
      if(txt==='Month'||txt==='月')btn.textContent=isZh()?'月':'Month';
      if(txt==='Year'||txt==='年')btn.textContent=isZh()?'年':'Year';
    });
  }
  function enhance(root){
    if(!root||!root.isConnected)return;
    root.classList.add('cv3-day-picker-auto','cv3-day-picker-polished');
    root.dataset.cv3DayPicker=VER;
    root.setAttribute('lang',isZh()?'zh':'en');
    relabel(root);
    const input=root.querySelector('input[data-cv3-date]');
    if(!input)return;
    const label=input.closest('label');
    if(!label)return;
    input.type='hidden';
    input.tabIndex=-1;
    input.setAttribute('aria-hidden','true');
    input.style.display='none';
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
        setInputDate(root,item.dataset.cv3Day);
      },true);
    }
    updateMenu(shell,root);
    const jump=root.querySelector('[data-cv3-act="jump"]');
    if(jump){
      jump.style.display='none';
      jump.setAttribute('aria-hidden','true');
      jump.tabIndex=-1;
    }
  }
  function installStyle(){
    document.getElementById('windzxyCalendarV3DayPickerStyle')?.remove();
    if(document.getElementById('windzxyCalendarV3DayPickerStyleV2'))return;
    const style=document.createElement('style');
    style.id='windzxyCalendarV3DayPickerStyleV2';
    style.textContent=`
.calendar-v3.cv3-day-picker-polished .cv3-controls{grid-template-columns:minmax(120px,.85fr) minmax(180px,1.05fr) minmax(116px,.52fr) minmax(145px,.9fr)!important;gap:10px!important;align-items:end!important}.calendar-v3.cv3-day-picker-polished .cv3-controls>[data-cv3-act="jump"]{display:none!important}.calendar-v3.cv3-day-picker-polished .cv3-controls label:nth-child(3){grid-column:auto!important}.calendar-v3.cv3-day-picker-polished .cv3-day-select-shell{position:relative!important;width:100%!important;min-width:0!important}.calendar-v3.cv3-day-picker-polished .cv3-day-display{width:100%!important;height:42px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;padding:0 14px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:16px!important;background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.075))!important;color:#f4f7fb!important;font:inherit!important;text-align:left!important;box-sizing:border-box!important}.calendar-v3.cv3-day-picker-polished .cv3-day-display strong{font-size:16px!important;line-height:1!important;font-weight:850!important}.calendar-v3.cv3-day-picker-polished .cv3-day-display span{font-size:11px!important;opacity:.66!important;font-weight:750!important}.calendar-v3.cv3-day-picker-polished .cv3-day-display:after{content:'⌄';opacity:.62;font-size:12px;margin-left:auto}.calendar-v3.cv3-day-picker-polished .cv3-day-display.is-open:after{content:'⌃'}
.calendar-v3.cv3-day-picker-polished .cv3-day-menu{position:absolute!important;z-index:999999!important;top:calc(100% + 8px)!important;left:50%!important;right:auto!important;width:286px!important;max-width:min(286px,calc(100vw - 32px))!important;transform:translateX(-50%)!important;overflow:hidden!important;padding:12px!important;border:1px solid rgba(255,255,255,.20)!important;border-radius:18px!important;background:rgba(43,47,56,.985)!important;box-shadow:0 20px 46px rgba(0,0,0,.44),inset 0 1px rgba(255,255,255,.08)!important;backdrop-filter:blur(18px)!important}.calendar-v3.cv3-day-picker-polished .cv3-day-menu[hidden]{display:none!important}.calendar-v3.cv3-day-picker-polished .cv3-day-menu-head{display:flex!important;align-items:center!important;justify-content:space-between!important;margin:0 0 10px!important;color:#f4f7fb!important}.calendar-v3.cv3-day-picker-polished .cv3-day-menu-head b{font-size:13px!important;font-weight:850!important}.calendar-v3.cv3-day-picker-polished .cv3-day-menu-head span{font-size:11px!important;opacity:.62!important}.calendar-v3.cv3-day-picker-polished .cv3-day-grid{display:grid!important;grid-template-columns:repeat(7,32px)!important;gap:7px!important;justify-content:center!important}.calendar-v3.cv3-day-picker-polished .cv3-day-grid button{width:32px!important;height:32px!important;min-width:0!important;padding:0!important;border:0!important;border-radius:10px!important;background:rgba(255,255,255,.06)!important;color:#f4f7fb!important;font-size:13px!important;font-weight:800!important;text-align:center!important}.calendar-v3.cv3-day-picker-polished .cv3-day-grid button:hover{background:rgba(255,255,255,.15)!important}.calendar-v3.cv3-day-picker-polished .cv3-day-grid button.on{background:linear-gradient(135deg,rgba(255,122,60,.62),rgba(255,202,88,.28))!important;color:#fff!important;box-shadow:0 0 0 1px rgba(255,255,255,.18) inset!important}
.calendar-v3.cv3-day-picker-polished.cv3-w-small .cv3-controls{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}.calendar-v3.cv3-day-picker-polished.cv3-w-small .cv3-controls label:nth-child(3){grid-column:1/2!important}.calendar-v3.cv3-day-picker-polished.cv3-w-small .cv3-seg{grid-column:2/3!important}.calendar-v3.cv3-day-picker-polished.cv3-w-phone .cv3-controls{grid-template-columns:1fr 1fr!important}.calendar-v3.cv3-day-picker-polished.cv3-w-phone .cv3-controls label:nth-child(3){grid-column:1/2!important}.calendar-v3.cv3-day-picker-polished.cv3-w-phone .cv3-seg{grid-column:2/3!important}[data-theme="light"] .calendar-v3.cv3-day-picker-polished .cv3-day-display{background:rgba(255,255,255,.84)!important;color:#1f2937!important;border-color:rgba(15,23,42,.14)!important}[data-theme="light"] .calendar-v3.cv3-day-picker-polished .cv3-day-menu{background:rgba(248,250,252,.98)!important;border-color:rgba(15,23,42,.14)!important}[data-theme="light"] .calendar-v3.cv3-day-picker-polished .cv3-day-menu-head,[data-theme="light"] .calendar-v3.cv3-day-picker-polished .cv3-day-grid button{color:#1f2937!important}[data-theme="light"] .calendar-v3.cv3-day-picker-polished .cv3-day-grid button{background:rgba(15,23,42,.055)!important}
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
    document.addEventListener('change',event=>{if(event.target.closest('.calendar-v3'))schedule(60);},true);
    window.addEventListener('resize',()=>schedule(120),{passive:true});
    setTimeout(scan,180);
    setTimeout(scan,700);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
