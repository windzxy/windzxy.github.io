(function(){
  if(window.__windzxyCalendarLunarUiFixLoaded)return;
  window.__windzxyCalendarLunarUiFixLoaded=1;
  const VER='20260819-calendar-lunar-ui1';
  const MONTH_CN={1:'正月',2:'二月',3:'三月',4:'四月',5:'五月',6:'六月',7:'七月',8:'八月',9:'九月',10:'十月',11:'冬月',12:'臘月'};
  const DAY_CN=['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  const DOW={
    'zh-CN':['周日','周一','周二','周三','周四','周五','周六'],
    'zh-HK':['週日','週一','週二','週三','週四','週五','週六'],
    en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  };
  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    if(/^en/i.test(v))return 'en';
    return 'zh-HK';
  }
  function parseYmd(s){const m=String(s||'').match(/(\d{4})-(\d{2})-(\d{2})/);return m?new Date(+m[1],+m[2]-1,+m[3]):null;}
  function pad(n){return String(n).padStart(2,'0');}
  function ymd(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}
  function dow(d){return (DOW[lang()]||DOW['zh-HK'])[d.getDay()];}
  function rawLunarParts(d){
    try{
      const s=new Intl.DateTimeFormat('zh-Hant-u-ca-chinese',{month:'long',day:'numeric'}).format(d).replace(/\s/g,'');
      const m=s.match(/(閏|闰)?([正一二三四五六七八九十冬腊臘]+)月(\d{1,2})日/);
      if(!m)return null;
      const map={正:1,一:1,二:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9,十:10,冬:11,腊:12,臘:12};
      return {leap:!!m[1],month:map[m[2]],day:+m[3],raw:s};
    }catch(e){return null;}
  }
  function lunarFull(d){
    const p=rawLunarParts(d);if(!p)return '—';
    if(lang()==='en')return `Lunar ${p.month}/${p.day}`;
    return `${p.leap?'閏':''}${MONTH_CN[p.month]||''}${DAY_CN[p.day]||p.day}`;
  }
  function lunarCell(d){
    const p=rawLunarParts(d);if(!p)return '—';
    if(lang()==='en')return p.day===1?`L${p.month}`:`${p.day}`;
    return p.day===1?`${p.leap?'閏':''}${MONTH_CN[p.month]||''}`:(DAY_CN[p.day]||String(p.day));
  }
  function fixBadges(root){
    const isCN=/^zh/.test(lang());
    root.querySelectorAll('.cw-day i,.cw-hero i').forEach(i=>{
      const txt=(i.textContent||'').trim();
      if(!isCN)return;
      if(txt==='Off')i.textContent='休';
      if(txt==='Work')i.textContent='班';
      if(txt==='CN Off')i.textContent='內地 休';
      if(txt==='CN Work')i.textContent='內地 班';
      if(txt==='HK National Day')i.textContent='香港 國慶日';
    });
  }
  function polish(root){
    const selected=root.querySelector('.cw-day.selected[data-cal-date]')||root.querySelector('.cw-day[data-cal-date]');
    const sd=parseYmd(selected?.dataset.calDate);
    if(sd){
      const full=lunarFull(sd);
      const short=`${pad(sd.getMonth()+1)}/${pad(sd.getDate())} ${dow(sd)}`;
      const heroTitle=root.querySelector('.cw-hero b');
      const heroLunar=root.querySelector('.cw-hero span');
      const titleSub=root.querySelector('.cw-title p');
      if(heroTitle)heroTitle.textContent=`${ymd(sd)} ${dow(sd)}`;
      if(heroLunar)heroLunar.textContent=(lang()==='en'?full:`農曆 ${full}`);
      if(titleSub)titleSub.textContent=`${short} · ${full}`;
    }
    root.querySelectorAll('.cw-day[data-cal-date]').forEach(btn=>{
      const d=parseYmd(btn.dataset.calDate);if(!d)return;
      const span=btn.querySelector('span');if(span)span.textContent=lunarCell(d);
    });
    fixBadges(root);
  }
  function polishAll(){document.querySelectorAll('.calendar-widget').forEach(polish);}
  function installStyle(){
    if(document.getElementById('calendarLunarUiFixStyle'))return;
    const s=document.createElement('style');s.id='calendarLunarUiFixStyle';s.textContent=`
.calendar-widget{--cal-rest:rgba(38,210,128,.16);--cal-rest-bd:rgba(38,210,128,.28);--cal-hk:rgba(102,190,255,.16);--cal-hk-bd:rgba(102,190,255,.26);--cal-work:rgba(255,182,72,.17);--cal-work-bd:rgba(255,182,72,.28)}
.calendar-widget .cw-head{padding:1px 0 3px}.calendar-widget .cw-title h3{letter-spacing:-.02em}.calendar-widget .cw-title p{font-size:12px!important;color:rgba(235,241,249,.64)!important}.calendar-widget .cw-hero{background:linear-gradient(135deg,rgba(82,118,158,.24),rgba(89,76,137,.16),rgba(255,255,255,.035))!important;border-color:rgba(255,255,255,.12)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
.calendar-widget .cw-hero>strong{color:#7edcff!important;text-shadow:0 0 18px rgba(126,220,255,.13)}.calendar-widget .cw-hero span{letter-spacing:.01em}.calendar-widget .cw-week{background:rgba(255,255,255,.035)!important}.calendar-widget .cw-week b{font-size:11px!important;letter-spacing:.06em}.calendar-widget .cw-day{background:rgba(255,255,255,.018)!important}.calendar-widget .cw-day:not(.out):hover{background:rgba(255,255,255,.055)!important}.calendar-widget .cw-day.cn-rest:not(.out){background:linear-gradient(145deg,var(--cal-rest),rgba(255,255,255,.018))!important}.calendar-widget .cw-day.hk-rest:not(.out){background:linear-gradient(145deg,var(--cal-hk),rgba(255,255,255,.018))!important}.calendar-widget .cw-day.cn-work:not(.out){background:linear-gradient(145deg,var(--cal-work),rgba(255,255,255,.018))!important}.calendar-widget .cw-day.selected{background:linear-gradient(145deg,rgba(126,220,255,.25),rgba(132,92,255,.18))!important;border-color:rgba(126,220,255,.35)!important;box-shadow:inset 0 0 0 2px rgba(126,220,255,.56),0 0 0 1px rgba(126,220,255,.15)!important}.calendar-widget .cw-day strong{font-weight:900}.calendar-widget .cw-day span{font-weight:750;opacity:.76;color:rgba(235,241,249,.72)!important}.calendar-widget .cw-day.out span{opacity:.42!important}.calendar-widget .cw-day div{gap:3px}.calendar-widget .cw-day i{border-radius:999px;padding:1px 5px!important;font-size:9px!important}.calendar-widget .cw-day.out i{display:none!important}.calendar-widget .cn-rest{background:rgba(36,214,135,.17)!important;border-color:rgba(36,214,135,.25)!important;color:#33f2a0!important}.calendar-widget .hk-rest{background:rgba(103,195,255,.16)!important;border-color:rgba(103,195,255,.24)!important;color:#8bddff!important}.calendar-widget .cn-work{background:rgba(255,184,76,.16)!important;border-color:rgba(255,184,76,.25)!important;color:#ffd277!important}.calendar-widget .cw-events{background:linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.028))!important}.calendar-widget .cw-events h4{font-size:11px!important}.calendar-widget .cw-events p{grid-template-columns:22px 1fr auto!important}.calendar-widget .cw-events b{width:20px!important;height:20px!important}.calendar-widget .cw-events span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@container (max-width:390px){.calendar-widget .cw-title p{font-size:11px!important}.calendar-widget .cw-hero{padding:8px 9px!important}.calendar-widget .cw-day span{font-size:9px!important}.calendar-widget .cw-day i{font-size:8px!important;padding:1px 4px!important}}
`;
    document.head.appendChild(s);
  }
  function boot(){installStyle();polishAll();document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select'))setTimeout(polishAll,80);},true);const mo=new MutationObserver(()=>{clearTimeout(boot.t);boot.t=setTimeout(polishAll,35);});mo.observe(document.body,{childList:true,subtree:true,characterData:true});window.windzxyCalendarLunarPolish=polishAll;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();