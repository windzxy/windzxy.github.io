(()=>{'use strict';
const PHASE={
  '出版與巡迴紀錄期':'年份／階段',
  'DNA 創造巡演':'巡演階段',
  'LIFE 人生無限公司':'巡演階段',
  '好好好想見到你':'巡演階段',
  '5525+2 / 持續中的城市檔案':'產品階段'
};
const style=document.createElement('style');
style.textContent='.tl-date[data-date-precision="phase"]{color:#9fb2c4}.tl-date-precision{display:block;margin-top:3px;font:800 8px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#6f8295;letter-spacing:.04em}@media(max-width:760px){.tl-date-precision{display:inline;margin-left:7px}}';
document.head.appendChild(style);
function patch(){
  document.querySelectorAll('#tlGrid .tl-row').forEach(row=>{
    const title=row.querySelector('h3')?.textContent?.trim();
    const time=row.querySelector('.tl-date');
    const label=PHASE[title];
    if(!time||!label||time.dataset.datePrecision==='phase')return;
    const raw=time.textContent.trim();
    const year=/^(\d{4})-01-01$/.exec(raw)?.[1];
    if(!year)return;
    time.dataset.datePrecision='phase';
    time.dataset.sourceDate=raw;
    time.setAttribute('aria-label',`${year}，${label}；非精確月日`);
    time.innerHTML=`${year}<span class="tl-date-precision">${label}</span>`;
  });
}
function boot(){patch();const grid=document.getElementById('tlGrid');if(grid)new MutationObserver(patch).observe(grid,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.MAYDAYLAND_TIMELINE_DATE_PRECISION='v1';
})();
