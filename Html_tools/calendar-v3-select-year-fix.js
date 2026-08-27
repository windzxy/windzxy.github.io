(function(){
  if(window.__windzxyCalendarV3SelectYearFixLoaded)return;
  window.__windzxyCalendarV3SelectYearFixLoaded=1;
  const VER='20260827-calendar-v3-select-year-fix1';
  const MONTHS={
    'zh-CN':['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    'zh-HK':['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    en:['January','February','March','April','May','June','July','August','September','October','November','December']
  };
  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    if(/^en/i.test(v))return 'en';
    return 'zh-HK';
  }
  function months(){return MONTHS[lang()]||MONTHS['zh-HK'];}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function installStyle(){
    if(document.getElementById('windzxyCalendarV3SelectYearFixStyle'))return;
    const s=document.createElement('style');
    s.id='windzxyCalendarV3SelectYearFixStyle';
    s.textContent=`
.calendar-v3 select[data-cv3-month],.calendar-v3 select[data-cv3-month] option{background:#343943!important;color:#f4f7fb!important}.calendar-v3 select[data-cv3-month] option:checked{background:#8b614f!important;color:#fff!important}.calendar-v3 select[data-cv3-month]:focus{box-shadow:0 0 0 2px rgba(102,224,255,.20)!important}
.calendar-v3 .cv3-month-select-shell{position:relative;width:100%;min-width:0}.calendar-v3 .cv3-native-month-hidden{position:absolute!important;inset:0!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important;min-width:0!important;min-height:0!important}
.calendar-v3 .cv3-month-display{width:100%!important;height:32px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;padding:0 12px!important;border:1px solid var(--cv3-line,rgba(255,255,255,.18))!important;border-radius:12px!important;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.07))!important;color:inherit!important;font:inherit!important;text-align:left!important;box-sizing:border-box!important}.calendar-v3 .cv3-month-display:after{content:'⌄';opacity:.72;font-size:13px}.calendar-v3 .cv3-month-display.is-open:after{content:'⌃'}
.calendar-v3 .cv3-month-menu{position:absolute;z-index:999999;left:0;right:0;top:calc(100% + 6px);max-height:280px;overflow:auto;padding:6px;border:1px solid rgba(255,255,255,.22);border-radius:16px;background:rgba(43,47,56,.98);box-shadow:0 18px 44px rgba(0,0,0,.42),inset 0 1px rgba(255,255,255,.08);backdrop-filter:blur(18px)}.calendar-v3 .cv3-month-menu[hidden]{display:none!important}.calendar-v3 .cv3-month-menu button{width:100%!important;height:34px!important;border:0!important;border-radius:11px!important;background:transparent!important;color:#f4f7fb!important;text-align:left!important;padding:0 12px!important;font-weight:650!important}.calendar-v3 .cv3-month-menu button:hover{background:rgba(255,255,255,.12)!important}.calendar-v3 .cv3-month-menu button.on{background:linear-gradient(135deg,rgba(255,122,60,.42),rgba(255,202,88,.22))!important;color:#fff!important}
[data-theme="light"] .calendar-v3 .cv3-month-menu{background:rgba(248,250,252,.98);border-color:rgba(15,23,42,.14);box-shadow:0 16px 36px rgba(15,23,42,.18)}[data-theme="light"] .calendar-v3 .cv3-month-menu button{color:#1f2937!important}[data-theme="light"] .calendar-v3 select[data-cv3-month] option{background:#f8fafc!important;color:#1f2937!important}
.calendar-v3 .cv3-year-view .cv3-year-grid[data-start-month]{scroll-padding-top:8px}.calendar-v3 .cv3-year-view .cv3-mini.is-start-month{outline:1px solid rgba(102,224,255,.45);box-shadow:0 0 0 1px rgba(102,224,255,.10) inset}.calendar-v3 .cv3-year-view .cv3-mini.is-start-month h5:after{content:' · Current';font-size:10px;opacity:.55;font-weight:500}.calendar-v3:not([lang="en"]) .cv3-year-view .cv3-mini.is-start-month h5:after{content:' · 當月'}
`;
    document.head.appendChild(s);
  }

  function enhanceSelect(select){
    if(!select||select.dataset.cv3CustomMonth==='1')return;
    const parent=select.parentElement;
    if(!parent)return;
    select.dataset.cv3CustomMonth='1';
    const shell=document.createElement('div');
    shell.className='cv3-month-select-shell';
    parent.insertBefore(shell,select);
    shell.appendChild(select);
    select.classList.add('cv3-native-month-hidden');
    const button=document.createElement('button');
    button.type='button';
    button.className='cv3-month-display';
    const menu=document.createElement('div');
    menu.className='cv3-month-menu';
    menu.hidden=true;
    shell.appendChild(button);
    shell.appendChild(menu);
    function paint(){
      const list=months();
      const value=Number(select.value||0);
      button.textContent=list[value]||select.options[select.selectedIndex]?.textContent||'';
      menu.innerHTML=list.map((name,i)=>`<button type="button" data-cv3-custom-month="${i}" class="${i===value?'on':''}">${E(name)}</button>`).join('');
    }
    paint();
    button.addEventListener('pointerdown',e=>e.stopPropagation(),true);
    menu.addEventListener('pointerdown',e=>e.stopPropagation(),true);
    button.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const opened=!menu.hidden;
      closeAllMenus();
      menu.hidden=opened;
      button.classList.toggle('is-open',!opened);
      paint();
    },true);
    menu.addEventListener('click',e=>{
      const item=e.target.closest('[data-cv3-custom-month]');
      if(!item)return;
      e.preventDefault();e.stopPropagation();
      select.value=item.dataset.cv3CustomMonth;
      select.dispatchEvent(new Event('change',{bubbles:true}));
      menu.hidden=true;button.classList.remove('is-open');
      setTimeout(scan,40);
    },true);
    select.addEventListener('change',()=>{paint();setTimeout(scan,30);},true);
  }
  function closeAllMenus(){
    document.querySelectorAll('.cv3-month-menu').forEach(m=>m.hidden=true);
    document.querySelectorAll('.cv3-month-display.is-open').forEach(b=>b.classList.remove('is-open'));
  }

  function reorderYear(root){
    const grid=root.querySelector('.cv3-year-view .cv3-year-grid');
    if(!grid)return;
    const select=root.querySelector('select[data-cv3-month]');
    let start=Number(select?.value);
    if(!Number.isFinite(start)){
      const selected=root.querySelector('.cv3-mini .selected')?.closest('.cv3-mini')?.querySelector('[data-cv3-month-pick]');
      start=Number(selected?.dataset.cv3MonthPick||0);
    }
    if(!Number.isFinite(start))start=0;
    const cards=Array.from(grid.querySelectorAll(':scope > .cv3-mini'));
    if(!cards.length)return;
    cards.sort((a,b)=>rank(a,start)-rank(b,start));
    cards.forEach(card=>{
      const m=monthOf(card);
      card.classList.toggle('is-start-month',m===start);
      grid.appendChild(card);
    });
    grid.dataset.startMonth=String(start);
  }
  function monthOf(card){return Number(card.querySelector('[data-cv3-month-pick]')?.dataset.cv3MonthPick??999);}
  function rank(card,start){const m=monthOf(card);return Number.isFinite(m)?(m-start+12)%12:99;}

  function scan(){
    installStyle();
    document.querySelectorAll('.calendar-v3').forEach(root=>{
      root.setAttribute('lang',lang()==='en'?'en':'zh');
      root.querySelectorAll('select[data-cv3-month]').forEach(enhanceSelect);
      reorderYear(root);
    });
  }
  const mo=new MutationObserver(()=>scan());
  function boot(){scan();mo.observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('click',e=>{if(!e.target.closest('.cv3-month-select-shell'))closeAllMenus();},true);setTimeout(scan,120);setTimeout(scan,600);setInterval(scan,1200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyCalendarV3SelectYearFixVersion=VER;
})();
