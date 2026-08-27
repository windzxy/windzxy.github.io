(function(){
  'use strict';
  if(window.__windzxyCalendarV3LitePolishLoadedV2)return;
  window.__windzxyCalendarV3LitePolishLoadedV2=1;
  const VER='20260827-calendar-v3-lite-polish2-grid-nav';
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
  function names(){return MONTHS[lang()]||MONTHS['zh-HK'];}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function installStyle(){
    if(document.getElementById('windzxyCalendarV3LitePolishStyleV2'))return;
    document.getElementById('windzxyCalendarV3LitePolishStyle')?.remove();
    const s=document.createElement('style');
    s.id='windzxyCalendarV3LitePolishStyleV2';
    s.textContent=`
.calendar-v3.cv3-lite-polish{height:100%!important;min-height:0!important;overflow:hidden!important;gap:9px!important;color:var(--ink)!important}.calendar-v3.cv3-lite-polish .cv3-foot{display:none!important}.calendar-v3.cv3-lite-polish .cv3-title strong{font-size:clamp(21px,2.2vw,28px)!important;line-height:1.08!important}.calendar-v3.cv3-lite-polish .cv3-title em{max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.calendar-v3.cv3-lite-polish .cv3-day div{display:none!important}
.calendar-v3.cv3-lite-polish .cv3-head{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:start!important;gap:12px!important}.calendar-v3.cv3-lite-polish .cv3-nav{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;white-space:nowrap!important;min-width:max-content!important}.calendar-v3.cv3-lite-polish .cv3-nav button{flex:0 0 auto!important;width:42px!important;min-width:42px!important;height:40px!important;padding:0!important;border-radius:16px!important}.calendar-v3.cv3-lite-polish .cv3-nav button[data-cv3-act="today"]{width:auto!important;min-width:82px!important;padding:0 16px!important;font-weight:800!important}
.calendar-v3.cv3-lite-polish .cv3-controls{display:grid!important;grid-template-columns:minmax(110px,.9fr) minmax(155px,1fr) minmax(180px,1.15fr) 70px minmax(130px,.9fr)!important;gap:8px!important;align-items:end!important}.calendar-v3.cv3-lite-polish .cv3-controls label{min-width:0!important}.calendar-v3.cv3-lite-polish .cv3-controls input,.calendar-v3.cv3-lite-polish .cv3-controls select,.calendar-v3.cv3-lite-polish .cv3-controls button,.calendar-v3.cv3-lite-polish .cv3-month-display{height:40px!important;border-radius:15px!important;box-sizing:border-box!important}.calendar-v3.cv3-lite-polish .cv3-seg{display:grid!important;grid-template-columns:1fr 1fr!important;width:100%!important;height:40px!important;border-radius:16px!important;overflow:hidden!important}.calendar-v3.cv3-lite-polish .cv3-seg button{height:40px!important;border-radius:0!important;font-weight:800!important}
.calendar-v3.cv3-lite-polish select[data-cv3-month]{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}.calendar-v3.cv3-lite-polish .cv3-month-select-shell{position:relative!important;width:100%!important;min-width:0!important}.calendar-v3.cv3-lite-polish .cv3-month-display{width:100%!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;padding:0 14px!important;border:1px solid rgba(255,255,255,.16)!important;background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.075))!important;color:#f4f7fb!important;font:inherit!important;font-weight:800!important;text-align:left!important}.calendar-v3.cv3-lite-polish .cv3-month-display:after{content:'⌄';opacity:.72}.calendar-v3.cv3-lite-polish .cv3-month-display.is-open:after{content:'⌃'}
.calendar-v3.cv3-lite-polish .cv3-month-menu{position:absolute!important;z-index:999999!important;left:0!important;right:0!important;top:calc(100% + 6px)!important;max-height:min(310px,42vh)!important;overflow:auto!important;padding:6px!important;border:1px solid rgba(255,255,255,.22)!important;border-radius:16px!important;background:rgba(43,47,56,.98)!important;box-shadow:0 18px 44px rgba(0,0,0,.42),inset 0 1px rgba(255,255,255,.08)!important;backdrop-filter:blur(18px)!important}.calendar-v3.cv3-lite-polish .cv3-month-menu[hidden]{display:none!important}.calendar-v3.cv3-lite-polish .cv3-month-menu button{width:100%!important;height:34px!important;border:0!important;border-radius:11px!important;background:transparent!important;color:#f4f7fb!important;text-align:left!important;padding:0 12px!important;font-weight:700!important}.calendar-v3.cv3-lite-polish .cv3-month-menu button:hover{background:rgba(255,255,255,.12)!important}.calendar-v3.cv3-lite-polish .cv3-month-menu button.on{background:linear-gradient(135deg,rgba(255,122,60,.42),rgba(255,202,88,.22))!important;color:#fff!important}
.calendar-v3.cv3-lite-polish .cv3-body{min-height:0!important;overflow:hidden!important}.calendar-v3.cv3-lite-polish .cv3-year-view{flex:1 1 auto!important;min-height:0!important;width:100%!important;display:flex!important;flex-direction:column!important;overflow:auto!important}.calendar-v3.cv3-lite-polish .cv3-year-view>.cv3-events{display:none!important}.calendar-v3.cv3-lite-polish .cv3-year-grid{width:100%!important;max-width:none!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(auto-fit,minmax(210px,1fr))!important;gap:12px!important;align-content:start!important;overflow:visible!important}.calendar-v3.cv3-lite-polish .cv3-mini{width:auto!important;min-width:0!important;box-sizing:border-box!important;border-radius:18px!important;padding:12px!important;background:rgba(255,255,255,.105)!important;border:1px solid rgba(255,255,255,.14)!important}.calendar-v3.cv3-lite-polish .cv3-mini.is-start-month{outline:1px solid rgba(102,224,255,.55)!important;box-shadow:0 0 0 1px rgba(102,224,255,.14) inset!important}.calendar-v3.cv3-lite-polish .cv3-mini.is-start-month h5:after{content:' · Current';font-size:11px;opacity:.62;font-weight:600}.calendar-v3.cv3-lite-polish[lang="zh"] .cv3-mini.is-start-month h5:after{content:' · 當月'}
.calendar-v3.cv3-w-small .cv3-head{grid-template-columns:1fr!important}.calendar-v3.cv3-w-small .cv3-nav{justify-content:start!important;min-width:0!important}.calendar-v3.cv3-w-small .cv3-controls{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}.calendar-v3.cv3-w-small .cv3-controls label:nth-child(3){grid-column:1/-1!important}.calendar-v3.cv3-w-small .cv3-controls>[data-cv3-act="jump"]{grid-column:1/2!important;width:100%!important}.calendar-v3.cv3-w-small .cv3-seg{grid-column:2/3!important}.calendar-v3.cv3-w-small .cv3-hero{grid-template-columns:auto minmax(0,1fr)!important}.calendar-v3.cv3-w-small .cv3-hero>strong{font-size:34px!important}.calendar-v3.cv3-w-small .cv3-body{display:flex!important;flex-direction:column!important;gap:8px!important;overflow:auto!important}.calendar-v3.cv3-w-small .cv3-events{position:static!important;width:100%!important;max-width:none!important;max-height:90px!important;overflow:auto!important;order:2!important;padding:8px 10px!important;border-radius:14px!important}.calendar-v3.cv3-w-small .cv3-week,.calendar-v3.cv3-w-small .cv3-grid{gap:4px!important}.calendar-v3.cv3-w-small .cv3-day{min-height:44px!important;padding:5px!important;border-radius:12px!important}.calendar-v3.cv3-w-small .cv3-year-view .cv3-events{display:none!important}.calendar-v3.cv3-w-small .cv3-year-grid{grid-template-columns:repeat(auto-fit,minmax(190px,1fr))!important}
.calendar-v3.cv3-w-phone .cv3-title em{display:none!important}.calendar-v3.cv3-w-phone .cv3-nav{display:grid!important;grid-template-columns:38px 38px 1fr 38px 38px!important;width:100%!important}.calendar-v3.cv3-w-phone .cv3-nav button{width:auto!important;min-width:0!important}.calendar-v3.cv3-w-phone .cv3-controls{grid-template-columns:1fr 1fr!important}.calendar-v3.cv3-w-phone .cv3-controls label span{display:none!important}.calendar-v3.cv3-w-phone .cv3-controls label:nth-child(3),.calendar-v3.cv3-w-phone .cv3-seg{grid-column:1/-1!important}.calendar-v3.cv3-w-phone .cv3-controls>[data-cv3-act="jump"],.calendar-v3.cv3-w-phone .cv3-hero,.calendar-v3.cv3-w-phone .cv3-events{display:none!important}.calendar-v3.cv3-w-phone .cv3-day{min-height:42px!important;text-align:center!important}.calendar-v3.cv3-w-phone .cv3-year-grid{grid-template-columns:1fr!important}
.calendar-v3.cv3-w-micro .cv3-controls{display:none!important}.calendar-v3.cv3-w-micro .cv3-nav{grid-template-columns:36px 1fr 36px!important}.calendar-v3.cv3-w-micro .cv3-nav button[data-cv3-act="prev-year"],.calendar-v3.cv3-w-micro .cv3-nav button[data-cv3-act="next-year"]{display:none!important}.calendar-v3.cv3-h-short .cv3-hero,.calendar-v3.cv3-h-short .cv3-events{display:none!important}.calendar-v3.cv3-h-short .cv3-body{overflow:hidden!important}
[data-theme="light"] .calendar-v3.cv3-lite-polish .cv3-month-display{background:rgba(255,255,255,.82)!important;color:#1f2937!important;border-color:rgba(15,23,42,.14)!important}[data-theme="light"] .calendar-v3.cv3-lite-polish .cv3-month-menu{background:rgba(248,250,252,.98)!important;border-color:rgba(15,23,42,.14)!important}[data-theme="light"] .calendar-v3.cv3-lite-polish .cv3-month-menu button{color:#1f2937!important}
`;
    document.head.appendChild(s);
  }

  function closeMenus(){document.querySelectorAll('.cv3-month-menu').forEach(m=>m.hidden=true);document.querySelectorAll('.cv3-month-display.is-open').forEach(b=>b.classList.remove('is-open'));}
  function enhanceSelect(select){
    if(!select||select.dataset.cv3LiteSelectV2==='1')return;
    const parent=select.parentElement;if(!parent)return;
    select.dataset.cv3LiteSelectV2='1';
    const shell=document.createElement('div');shell.className='cv3-month-select-shell';
    parent.insertBefore(shell,select);shell.appendChild(select);
    const btn=document.createElement('button');btn.type='button';btn.className='cv3-month-display';
    const menu=document.createElement('div');menu.className='cv3-month-menu';menu.hidden=true;
    shell.appendChild(btn);shell.appendChild(menu);
    function paint(){
      const list=names();const val=Number(select.value||0);
      btn.textContent=list[val]||select.options[select.selectedIndex]?.textContent||'';
      menu.innerHTML=list.map((name,i)=>`<button type="button" data-cv3-lite-month="${i}" class="${i===val?'on':''}">${esc(name)}</button>`).join('');
    }
    paint();
    btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const opened=!menu.hidden;closeMenus();menu.hidden=opened;btn.classList.toggle('is-open',!opened);paint();},true);
    menu.addEventListener('click',e=>{const item=e.target.closest('[data-cv3-lite-month]');if(!item)return;e.preventDefault();e.stopPropagation();select.value=item.dataset.cv3LiteMonth;select.dispatchEvent(new Event('change',{bubbles:true}));menu.hidden=true;btn.classList.remove('is-open');scheduleScan(80);},true);
    select.addEventListener('change',()=>{paint();scheduleScan(80);},true);
  }
  function monthOf(card){return Number(card.querySelector('[data-cv3-month-pick]')?.dataset.cv3MonthPick??999);}
  function reorderYear(root){
    const grid=root.querySelector('.cv3-year-view .cv3-year-grid');if(!grid)return;
    let start=Number(root.querySelector('select[data-cv3-month]')?.value);
    if(!Number.isFinite(start))start=0;
    if(grid.dataset.cv3LiteStart===String(start))return;
    const cards=Array.from(grid.querySelectorAll(':scope > .cv3-mini'));
    if(cards.length<2)return;
    cards.sort((a,b)=>((monthOf(a)-start+12)%12)-((monthOf(b)-start+12)%12));
    cards.forEach(card=>{card.classList.toggle('is-start-month',monthOf(card)===start);grid.appendChild(card);});
    grid.dataset.cv3LiteStart=String(start);
  }
  function classify(root){
    if(!root||!root.isConnected)return;
    const box=root.getBoundingClientRect();const w=box.width||root.clientWidth||0;const h=box.height||root.clientHeight||0;
    root.classList.add('cv3-lite-polish');root.setAttribute('lang',lang()==='en'?'en':'zh');
    root.classList.toggle('cv3-w-small',w<640);root.classList.toggle('cv3-w-phone',w<520);root.classList.toggle('cv3-w-micro',w<420);root.classList.toggle('cv3-h-short',h<500);root.classList.toggle('cv3-h-tiny',h<420);
    root.querySelectorAll('select[data-cv3-month]').forEach(enhanceSelect);
    reorderYear(root);
  }
  let scanTimer=0;
  function scan(){installStyle();document.querySelectorAll('.calendar-v3').forEach(classify);}
  function scheduleScan(delay=100){clearTimeout(scanTimer);scanTimer=setTimeout(scan,delay);}
  function boot(){
    installStyle();scan();
    const observeCalendars=()=>document.querySelectorAll('.calendar-v3').forEach(classify);
    if(window.ResizeObserver&&!window.__windzxyCalendarV3LiteResizeObserverV2){
      const seen=new WeakSet();const ro=new ResizeObserver(entries=>entries.forEach(e=>classify(e.target)));
      window.__windzxyCalendarV3LiteResizeObserverV2=ro;
      const add=()=>document.querySelectorAll('.calendar-v3').forEach(el=>{if(!seen.has(el)){seen.add(el);ro.observe(el);}});
      add();new MutationObserver(()=>{add();scheduleScan(90);}).observe(document.getElementById('desktopCanvas')||document.body,{childList:true,subtree:true});
    }else new MutationObserver(()=>scheduleScan(140)).observe(document.getElementById('desktopCanvas')||document.body,{childList:true,subtree:true});
    document.addEventListener('click',e=>{if(!e.target.closest('.cv3-month-select-shell'))closeMenus();if(e.target.closest('.calendar-v3'))scheduleScan(90);},true);
    document.addEventListener('change',e=>{if(e.target.closest('.calendar-v3'))scheduleScan(90);},true);
    window.addEventListener('resize',()=>scheduleScan(140),{passive:true});
    setTimeout(observeCalendars,260);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyCalendarV3LitePolishVersion=VER;
})();
