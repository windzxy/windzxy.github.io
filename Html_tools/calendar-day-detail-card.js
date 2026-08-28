(function(){
  'use strict';
  const VER='20260828-calendar-day-detail-card1-lunar-holiday-solar';
  if(window.__windzxyCalendarDayDetailCard===VER)return;
  window.__windzxyCalendarDayDetailCard=VER;

  const HOLIDAYS={
    '2026-01-01':{name:'元旦',short:'元旦',type:'holiday'},
    '2026-02-17':{name:'春節',short:'春節',type:'holiday'},'2026-02-18':{name:'春節',short:'春節',type:'holiday'},'2026-02-19':{name:'春節',short:'春節',type:'holiday'},
    '2026-04-04':{name:'清明節',short:'清明',type:'holiday'},
    '2026-05-01':{name:'勞動節',short:'勞動',type:'holiday'},
    '2026-06-19':{name:'端午節',short:'端午',type:'holiday'},
    '2026-07-01':{name:'香港特別行政區成立紀念日',short:'七一',type:'holiday'},
    '2026-09-25':{name:'中秋節翌日',short:'中秋',type:'holiday'},'2026-09-26':{name:'中秋節假期',short:'中秋',type:'holiday'},'2026-09-27':{name:'中秋節假期',short:'中秋',type:'holiday'},
    '2026-10-01':{name:'國慶假期',short:'國慶',type:'holiday'},'2026-10-02':{name:'國慶假期',short:'國慶',type:'holiday'},'2026-10-03':{name:'國慶假期',short:'國慶',type:'holiday'},'2026-10-04':{name:'國慶假期',short:'國慶',type:'holiday'},'2026-10-05':{name:'國慶假期',short:'國慶',type:'holiday'},'2026-10-06':{name:'國慶假期',short:'國慶',type:'holiday'},'2026-10-07':{name:'國慶假期',short:'國慶',type:'holiday'},
    '2026-10-10':{name:'國慶調休補班',short:'補班',type:'work'},
    '2026-10-18':{name:'重陽節',short:'重陽',type:'holiday'},'2026-10-19':{name:'重陽節翌日',short:'重陽',type:'holiday'},
    '2026-12-25':{name:'聖誕節',short:'聖誕',type:'holiday'},'2026-12-26':{name:'聖誕節翌日',short:'聖誕',type:'holiday'}
  };
  const TERM_NAMES=['小寒','大寒','立春','雨水','驚蟄','春分','清明','穀雨','立夏','小滿','芒種','夏至','小暑','大暑','立秋','處暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'];
  const TERM_INFO=[0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
  const D_ZH=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const D_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const M_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const CN=['零','一','二','三','四','五','六','七','八','九','十'];

  function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||localStorage.getItem('webdesk-lang')||document.documentElement.lang||navigator.language||'zh-HK';if(/^en/i.test(v))return 'en';return /^zh-CN/i.test(v)||/Hans/i.test(v)?'zh-CN':'zh-HK';}
  function zh(){return lang()!=='en';}
  function t(en,tc){return zh()?tc:en;}
  function pad(n){return String(n).padStart(2,'0');}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function iso(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}
  function parseIso(v){const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?new Date(+m[1],+m[2]-1,+m[3]):new Date();}
  function lunarDay(n){n=Number(n)||1;if(n<=10)return ['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十'][n];if(n<20)return '十'+CN[n-10];if(n===20)return '二十';if(n<30)return '廿'+CN[n-20];return '三十';}
  function lunarInfo(d){try{const parts=new Intl.DateTimeFormat('zh-Hant-u-ca-chinese',{month:'long',day:'numeric'}).formatToParts(d);let m=parts.find(p=>p.type==='month')?.value||'';let day=parts.find(p=>p.type==='day')?.value||'';const hit=String(day).match(/\d+/);if(hit)day=lunarDay(hit[0]);day=String(day).replace(/日$/,'');if(/^\d+$/.test(day))day=lunarDay(day);if(m&&!/月$/.test(m))m+='月';return `${m}${day}`||'—';}catch(e){return '—';}}
  function solarTerm(d){
    const y=d.getFullYear();
    if(y<1901||y>2100)return '';
    const base=Date.UTC(1900,0,6,2,5);
    for(let n=0;n<24;n++){
      const day=new Date(base+31556925974.7*(y-1900)+TERM_INFO[n]*60000).getUTCDate();
      if(Math.floor(n/2)===d.getMonth()&&day===d.getDate())return TERM_NAMES[n];
    }
    return '';
  }
  function dateLabel(d){return zh()?`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`:`${M_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;}
  function weekday(d){return zh()?D_ZH[d.getDay()]:D_EN[d.getDay()];}
  function findCell(start){
    let el=start&&start.nodeType===1?start:start?.parentElement;
    while(el&&el!==document.documentElement){
      if(el.dataset){
        for(const [k,v] of Object.entries(el.dataset)){
          if(/^cal\d+Cell$/.test(k)&&/^\d{4}-\d{2}-\d{2}$/.test(v))return {el,iso:v};
        }
      }
      el=el.parentElement;
    }
    return null;
  }
  function rootOf(el){return el?.closest?.('.calendar-v11,.calendar-v10,.calendar-v9,.calendar-v8,.calendar-v7,.calendar-v6,[data-cal11-ver],[data-cal10-ver],[data-cal9-ver]');}
  function closeAll(root){(root||document).querySelectorAll('.cal-day-detail-pop').forEach(x=>x.remove());}
  function cardHtml(d){
    const key=iso(d), h=HOLIDAYS[key], term=solarTerm(d), lunar=lunarInfo(d);
    const holidayText=h?`${h.name}${h.type==='work'?` · ${t('Adjusted workday','調休補班')}`:''}`:t('No official holiday record','無官方假期記錄');
    const holidayClass=h?(h.type==='work'?'work':'holiday'):'';
    return `<div class="cal-day-detail-card" role="dialog" aria-label="${esc(t('Date details','日期詳情'))}">
      <button class="cal-day-detail-close" data-cal-detail-close type="button" aria-label="${esc(t('Close','關閉'))}">×</button>
      <div class="cal-detail-top"><span>${esc(t('Date details','日期詳情'))}</span><h3>${d.getDate()}</h3><p>${esc(dateLabel(d))} · ${esc(weekday(d))}</p></div>
      <div class="cal-detail-rows">
        <div><b>${esc(t('Lunar','農曆'))}</b><span>${esc(lunar)}</span></div>
        <div><b>${esc(t('Holiday','節假日'))}</b><span class="${holidayClass}">${esc(holidayText)}</span></div>
        <div><b>${esc(t('Solar term','節氣'))}</b><span>${esc(term||t('None','無'))}</span></div>
      </div>
    </div>`;
  }
  function show(root, pos, key){
    if(!root)return;
    root.style.position=root.style.position||'relative';
    closeAll(root);
    const d=parseIso(key);
    const pop=document.createElement('div');
    pop.className='cal-day-detail-pop';
    pop.innerHTML=cardHtml(d);
    root.appendChild(pop);
    requestAnimationFrame(()=>{
      const w=pop.offsetWidth||248, h=pop.offsetHeight||190, padEdge=8;
      let left=Math.max(padEdge,Math.min(pos.left,root.clientWidth-w-padEdge));
      let top=Math.max(padEdge,Math.min(pos.top,root.clientHeight-h-padEdge));
      pop.style.left=left+'px';
      pop.style.top=top+'px';
    });
  }
  function ensureStyle(){
    if(document.getElementById('windzxyCalendarDayDetailStyle'))return;
    const st=document.createElement('style');
    st.id='windzxyCalendarDayDetailStyle';
    st.textContent=`
.calendar-v11 [data-cal11-cell],.calendar-v10 [data-cal10-cell],.calendar-v9 [data-cal9-cell],.calendar-v8 [data-cal8-cell],.calendar-v7 [data-cal7-cell],.calendar-v6 [data-cal6-cell]{cursor:pointer!important;position:relative}.calendar-v11 [data-cal11-cell]:hover,.calendar-v10 [data-cal10-cell]:hover,.calendar-v9 [data-cal9-cell]:hover{transform:translateY(-1px);filter:brightness(1.08)}
.cal-day-detail-pop{position:absolute;z-index:9999;width:min(268px,calc(100% - 16px));pointer-events:auto;animation:calDetailIn .16s ease-out}.cal-day-detail-card{position:relative;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:linear-gradient(145deg,rgba(35,40,51,.96),rgba(25,29,38,.94));box-shadow:0 22px 60px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(18px);color:#f7f9ff;padding:14px}.cal-day-detail-close{position:absolute;right:10px;top:10px;width:28px;height:28px;border:0;border-radius:50%;background:rgba(255,255,255,.10);color:#fff;font-size:18px;font-weight:900;cursor:pointer}.cal-detail-top span{display:block;font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.58}.cal-detail-top h3{margin:4px 0 0;font-size:44px;line-height:.95;font-weight:950;letter-spacing:-.06em}.cal-detail-top p{margin:6px 34px 10px 0;font-size:13px;line-height:1.35;opacity:.75}.cal-detail-rows{display:grid;gap:7px}.cal-detail-rows div{display:grid;grid-template-columns:58px minmax(0,1fr);gap:8px;align-items:start;border-radius:12px;background:rgba(255,255,255,.06);padding:8px 10px}.cal-detail-rows b{font-size:12px;opacity:.62}.cal-detail-rows span{font-size:13px;font-weight:820;line-height:1.35}.cal-detail-rows .holiday{color:#ffca7a}.cal-detail-rows .work{color:#80b7ff}@keyframes calDetailIn{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}
@media(max-width:520px){.cal-day-detail-card{padding:12px}.cal-detail-top h3{font-size:38px}.cal-detail-rows div{grid-template-columns:52px minmax(0,1fr);padding:7px 9px}.cal-detail-rows span{font-size:12px}}
`;
    document.head.appendChild(st);
  }
  function bind(){
    ensureStyle();
    document.addEventListener('click',function(e){
      const close=e.target.closest?.('[data-cal-detail-close]');
      if(close){e.preventDefault();e.stopPropagation();closeAll(close.closest('.calendar-v11,.calendar-v10,.calendar-v9,.calendar-v8,.calendar-v7,.calendar-v6')||document);return;}
      const hit=findCell(e.target);
      if(hit){
        const root=rootOf(hit.el);
        if(root){
          const rr=root.getBoundingClientRect(), cr=hit.el.getBoundingClientRect();
          const pos={left:cr.left-rr.left+Math.min(36,cr.width*.72),top:cr.top-rr.top+Math.min(36,cr.height*.72)};
          setTimeout(()=>show(root,pos,hit.iso),0);
          return;
        }
      }
      if(!e.target.closest?.('.cal-day-detail-pop'))closeAll(document);
    },true);
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll(document);});
  }
  bind();
})();
