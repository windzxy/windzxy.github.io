(function(){
  'use strict';
  if(window.__windzxyCalendarV3LunarLabelFixLoadedV2)return;
  window.__windzxyCalendarV3LunarLabelFixLoadedV2=1;
  const VER='20260827-calendar-v3-lunar-label-fix2-force-dom';

  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^en/i.test(v))return 'en';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    return 'zh-HK';
  }
  function isZh(){return lang()!=='en';}
  const lunarDays=['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  const cnNum={'0':'零','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六','7':'七','8':'八','9':'九','10':'十','11':'十一','12':'十二'};
  function dayCn(n){n=parseInt(n,10);return lunarDays[n]||String(n||'');}
  function monthCn(n){n=parseInt(n,10);if(!n)return '';if(n===1)return '正月';if(n===11)return '冬月';if(n===12)return '臘月';return (cnNum[String(n)]||String(n))+'月';}
  function normalizeMonth(s){
    s=String(s||'').trim();
    const arab=s.match(/(^|[^0-9])([1-9]|1[0-2])月/);
    if(arab)return monthCn(arab[2]);
    return s.replace('腊月','臘月');
  }
  function normalizeLunar(raw,full){
    let text=String(raw||'').trim();
    text=text.replace(/^(Lunar|農曆|农历)\s*[·:：-]?\s*/i,'').trim();
    text=text.replace(/\s+/g,'');
    text=text.replace(/([0-9]{1,2})日/g,(_,n)=>dayCn(n));
    text=text.replace(/(^|[月\s])([0-9]{1,2})(?![0-9])/g,(m,p,n)=>p+dayCn(n));
    text=text.replace(/([1-9]|1[0-2])月/g,(_,n)=>monthCn(n));
    text=text.replace('腊月','臘月');
    const month=(text.match(/(閏)?(正月|[一二三四五六七八九十冬臘腊]+月)/)||[]).slice(1).join('').replace('腊','臘');
    const day=(text.match(/(初[一二三四五六七八九十]|十[一二三四五六七八九]?|二十|廿[一二三四五六七八九十]?|三十)$/)||[])[1];
    if(full&&month&&day)return month+day;
    if(full&&month)return month;
    if(day)return day;
    return text;
  }
  function labelFor(type){
    const l=lang();
    if(type==='year')return l==='en'?'Year':'年';
    if(type==='month')return l==='en'?'Month':'月';
    if(type==='date')return l==='en'?'Date':'日';
    if(type==='go')return l==='en'?'Go':'定位';
    if(type==='monthMode')return l==='en'?'Month':'月';
    if(type==='yearMode')return l==='en'?'Year':'年';
    return type;
  }
  function fixLabels(root){
    const y=root.querySelector('[data-cv3-year]')?.closest('label')?.querySelector('span');
    const m=root.querySelector('select[data-cv3-month]')?.closest('label')?.querySelector('span');
    const d=root.querySelector('[data-cv3-date]')?.closest('label')?.querySelector('span');
    if(y)y.textContent=labelFor('year');
    if(m)m.textContent=labelFor('month');
    if(d)d.textContent=labelFor('date');
    const go=root.querySelector('[data-cv3-act="jump"]');if(go)go.textContent=labelFor('go');
    const mb=root.querySelector('[data-cv3-mode="month"]');if(mb)mb.textContent=labelFor('monthMode');
    const yb=root.querySelector('[data-cv3-mode="year"]');if(yb)yb.textContent=labelFor('yearMode');
  }
  function fixLunar(root){
    root.querySelectorAll('.cv3-title em,.cv3-hero span').forEach(el=>{
      const old=el.textContent||'';
      const parts=old.split('·');
      if(parts.length>=2){
        const prefix=parts.slice(0,-1).join('·').trim();
        const lunar=normalizeLunar(parts[parts.length-1],true);
        if(/lunar|農曆|农历/i.test(prefix))el.textContent=(isZh()?'農曆':'Lunar')+' · '+lunar;
        else el.textContent=prefix+' · '+lunar;
      }else if(/lunar|農曆|农历/i.test(old)){
        el.textContent=(isZh()?'農曆':'Lunar')+' · '+normalizeLunar(old,true);
      }
    });
    root.querySelectorAll('.cv3-day span').forEach(span=>{
      const next=normalizeLunar(span.textContent,false);
      if(next)span.textContent=next;
    });
  }
  function fixOne(root){
    if(!root||!root.isConnected)return;
    root.dataset.calendarLunarFix='2';
    fixLabels(root);
    fixLunar(root);
  }
  let timer=0;
  function scan(){document.querySelectorAll('.calendar-v3').forEach(fixOne);}
  function schedule(delay=80){clearTimeout(timer);timer=setTimeout(scan,delay);}
  function boot(){
    scan();
    const target=document.getElementById('desktopCanvas')||document.body;
    new MutationObserver(()=>schedule(40)).observe(target,{childList:true,subtree:true,characterData:true});
    document.addEventListener('click',e=>{if(e.target.closest('.calendar-v3'))schedule(60);},true);
    document.addEventListener('change',e=>{if(e.target.closest('.calendar-v3')||e.target.matches('.lang-select'))schedule(80);},true);
    setTimeout(scan,250);setTimeout(scan,900);setTimeout(scan,1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyCalendarV3LunarLabelFixVersion=VER;
})();
