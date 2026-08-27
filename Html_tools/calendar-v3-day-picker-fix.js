(function(){
  'use strict';
  if(window.__windzxyCalendarV3DayPickerFixLoaded)return;
  window.__windzxyCalendarV3DayPickerFixLoaded=1;
  const VER='20260827-calendar-v3-day-picker1-auto-jump';

  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^en/i.test(v))return 'en';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    return 'zh-HK';
  }
  function isZh(){return lang()!=='en';}
  function pad(n){return String(n).padStart(2,'0');}
  function daysInMonth(y,m){return new Date(Number(y)||new Date().getFullYear(),Number(m)+1,0).getDate();}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
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
    if(btn)btn.textContent=String(current);
    if(menu){
      menu.innerHTML=Array.from({length:max},(_,i)=>{
        const d=i+1;
        return `<button type="button" data-cv3-day="${d}" class="${d===current?'on':''}">${d}</button>`;
      }).join('');
    }
  }
  function enhance(root){
    if(!root||!root.isConnected)return;
    root.classList.add('cv3-day-picker-auto');
    root.dataset.cv3DayPicker=VER;
    const input=root.querySelector('input[data-cv3-date]');
    if(!input)return;
    const label=input.closest('label');
    if(!label)return;
    const span=label.querySelector('span');
    if(span){
      span.textContent=isZh()?'日':'Day';
      span.dataset.i18n=isZh()?'日':'Day';
    }
    input.type='hidden';
    input.tabIndex=-1;
    input.setAttribute('aria-hidden','true');
    input.style.display='none';
    let shell=label.querySelector('.cv3-day-select-shell');
    if(!shell){
      shell=document.createElement('div');
      shell.className='cv3-day-select-shell';
      shell.innerHTML='<button class="cv3-day-display" type="button" aria-label="Day"></button><div class="cv3-day-menu" hidden></div>';
      label.appendChild(shell);
      const display=shell.querySelector('.cv3-day-display');
      const menu=shell.querySelector('.cv3-day-menu');
      display.addEventListener('click',event=>{
        event.preventDefault();event.stopPropagation();
        const open=menu.hidden;
        closeMenus();
        updateMenu(shell,root);
        menu.hidden=!open;
        display.classList.toggle('is-open',open);
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
    root.querySelectorAll('[data-cv3-mode]').forEach(btn=>{
      if(btn.textContent.trim()==='Month')btn.textContent=isZh()?'月':'Month';
      if(btn.textContent.trim()==='Year')btn.textContent=isZh()?'年':'Year';
    });
  }
  function installStyle(){
    if(document.getElementById('windzxyCalendarV3DayPickerStyle'))return;
    const style=document.createElement('style');
    style.id='windzxyCalendarV3DayPickerStyle';
    style.textContent=`
.calendar-v3.cv3-day-picker-auto .cv3-controls{grid-template-columns:minmax(110px,.9fr) minmax(155px,1fr) minmax(92px,.48fr) minmax(130px,.9fr)!important;gap:8px!important}.calendar-v3.cv3-day-picker-auto .cv3-controls>[data-cv3-act="jump"]{display:none!important}.calendar-v3.cv3-day-picker-auto .cv3-controls label:nth-child(3){grid-column:auto!important}.calendar-v3.cv3-day-picker-auto .cv3-day-select-shell{position:relative!important;width:100%!important}.calendar-v3.cv3-day-picker-auto .cv3-day-display{width:100%!important;height:40px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;padding:0 14px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:15px!important;background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.075))!important;color:#f4f7fb!important;font:inherit!important;font-weight:800!important;text-align:left!important;box-sizing:border-box!important}.calendar-v3.cv3-day-picker-auto .cv3-day-display:after{content:'日';font-size:11px;opacity:.65;font-weight:700}.calendar-v3.cv3-day-picker-auto[lang="en"] .cv3-day-display:after{content:'day'}.calendar-v3.cv3-day-picker-auto .cv3-day-display.is-open:after{content:'⌃'}.calendar-v3.cv3-day-picker-auto .cv3-day-menu{position:absolute!important;z-index:999999!important;left:0!important;right:0!important;top:calc(100% + 6px)!important;display:grid!important;grid-template-columns:repeat(7,1fr)!important;gap:4px!important;max-height:min(260px,42vh)!important;overflow:auto!important;padding:8px!important;border:1px solid rgba(255,255,255,.22)!important;border-radius:16px!important;background:rgba(43,47,56,.98)!important;box-shadow:0 18px 44px rgba(0,0,0,.42),inset 0 1px rgba(255,255,255,.08)!important;backdrop-filter:blur(18px)!important}.calendar-v3.cv3-day-picker-auto .cv3-day-menu[hidden]{display:none!important}.calendar-v3.cv3-day-picker-auto .cv3-day-menu button{height:30px!important;min-width:0!important;width:100%!important;padding:0!important;border:0!important;border-radius:9px!important;background:transparent!important;color:#f4f7fb!important;font-weight:750!important;text-align:center!important}.calendar-v3.cv3-day-picker-auto .cv3-day-menu button:hover{background:rgba(255,255,255,.12)!important}.calendar-v3.cv3-day-picker-auto .cv3-day-menu button.on{background:linear-gradient(135deg,rgba(255,122,60,.48),rgba(255,202,88,.22))!important;color:#fff!important}.calendar-v3.cv3-day-picker-auto.cv3-w-small .cv3-controls{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}.calendar-v3.cv3-day-picker-auto.cv3-w-small .cv3-controls label:nth-child(3){grid-column:1/2!important}.calendar-v3.cv3-day-picker-auto.cv3-w-small .cv3-seg{grid-column:2/3!important}.calendar-v3.cv3-day-picker-auto.cv3-w-phone .cv3-controls{grid-template-columns:1fr 1fr!important}.calendar-v3.cv3-day-picker-auto.cv3-w-phone .cv3-controls label:nth-child(3){grid-column:1/2!important}.calendar-v3.cv3-day-picker-auto.cv3-w-phone .cv3-seg{grid-column:2/3!important}[data-theme="light"] .calendar-v3.cv3-day-picker-auto .cv3-day-display{background:rgba(255,255,255,.82)!important;color:#1f2937!important;border-color:rgba(15,23,42,.14)!important}[data-theme="light"] .calendar-v3.cv3-day-picker-auto .cv3-day-menu{background:rgba(248,250,252,.98)!important;border-color:rgba(15,23,42,.14)!important}[data-theme="light"] .calendar-v3.cv3-day-picker-auto .cv3-day-menu button{color:#1f2937!important}
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
    setTimeout(scan,250);
    setTimeout(scan,900);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyCalendarV3DayPickerFixVersion=VER;
})();
