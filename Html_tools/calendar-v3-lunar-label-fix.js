(function(){
  'use strict';
  if(window.__windzxyCalendarV3LunarLabelFixLoaded)return;
  window.__windzxyCalendarV3LunarLabelFixLoaded=1;
  const VER='20260827-calendar-v3-lunar-label-fix1';
  const CN_NUM=['零','一','二','三','四','五','六','七','八','九','十'];
  const MONTHS=['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','臘月'];
  function toCnDay(n){
    n=Number(n)||1;
    if(n<=10)return '初'+CN_NUM[n];
    if(n<20)return '十'+(n===10?'':CN_NUM[n-10]);
    if(n===20)return '二十';
    if(n<30)return '廿'+CN_NUM[n-20];
    return '三十';
  }
  function normalize(text){
    let s=String(text||'').trim().replace(/\s+/g,'');
    if(!s)return s;
    s=s.replace(/^農曆|^农历|^Lunar\s*·?\s*/i,'');
    s=s.replace(/(闰|閏)/g,'閏');
    s=s.replace(/腊月/g,'臘月');
    s=s.replace(/十一月/g,'冬月').replace(/十二月/g,'臘月');
    s=s.replace(/(正月|[一二三四五六七八九十冬臘]+月)(\d{1,2})日?/,(_,m,d)=>m+toCnDay(d));
    s=s.replace(/(\d{1,2})月(\d{1,2})日?/,(_,m,d)=>{const mi=Math.max(1,Math.min(12,Number(m)));return MONTHS[mi-1]+toCnDay(d);});
    s=s.replace(/(正月|[一二三四五六七八九十冬臘]+月)(初?\d{1,2}|\d{1,2}日?)/,(_,m,d)=>m+toCnDay(String(d).replace(/\D/g,'')));
    return s;
  }
  function shortDay(text){
    const s=normalize(text);
    const day=s.match(/(初[一二三四五六七八九十]|十[一二三四五六七八九]?|二十|廿[一二三四五六七八九十]?|三十)$/);
    return day?day[1]:s.replace(/^.*月/,'');
  }
  function fixRoot(root){
    if(!root||!root.isConnected)return;
    root.querySelectorAll('.cv3-title em,.cv3-hero span').forEach(el=>{
      const raw=el.textContent||'';
      if(!/(Lunar|農曆|农历|月\d{1,2}日|\d{1,2}月\d{1,2})/i.test(raw))return;
      const parts=raw.split('·');
      if(parts.length>1){
        const last=normalize(parts.pop());
        el.textContent=parts.join('·').replace(/\s+$/,'')+' · '+last;
      }else{
        el.textContent=raw.replace(/(Lunar|農曆|农历)\s*·?\s*(.+)$/i,(m,p,v)=>p+' · '+normalize(v));
      }
    });
    root.querySelectorAll('.cv3-day span').forEach(el=>{
      const raw=el.textContent||'';
      if(/\d/.test(raw)||/月/.test(raw))el.textContent=shortDay(raw);
    });
  }
  let timer=0;
  function scan(delay=0){clearTimeout(timer);timer=setTimeout(()=>document.querySelectorAll('.calendar-v3').forEach(fixRoot),delay);}
  document.addEventListener('click',e=>{if(e.target.closest('.calendar-v3'))scan(80);},true);
  document.addEventListener('change',e=>{if(e.target.closest('.calendar-v3'))scan(80);},true);
  new MutationObserver(()=>scan(120)).observe(document.getElementById('desktopCanvas')||document.body,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>scan(0),{once:true});else scan(0);
  setTimeout(()=>scan(0),300);setTimeout(()=>scan(0),1000);
  window.windzxyCalendarV3LunarLabelFixVersion=VER;
})();
