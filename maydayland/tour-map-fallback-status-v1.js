(()=>{
'use strict';
const VER='20260910-mayday-tour-map-fallback-status-v1.1';
if(window.__maydayTourMapFallbackStatus===VER)return;
window.__maydayTourMapFallbackStatus=VER;
let degradedMode='';
let observer=null;
function labelFromText(text){
  if(text.includes('地形主底圖暫時不可用'))return '地形';
  if(text.includes('衛星主底圖暫時不可用'))return '衛星';
  const vector=text.match(/OpenFreeMap\s*(街道|明亮|深色)\s*暫時不可用/);
  if(vector)return vector[1];
  return '';
}
function degradedText(label){
  if(label==='地形'||label==='衛星')return label+'主底圖暫時不可用，目前使用備援底圖';
  return 'OpenFreeMap '+label+'暫時不可用，目前使用備援底圖';
}
function bind(){
  const el=document.querySelector('.mayday-map-status');
  if(!el){setTimeout(bind,180);return;}
  if(observer)observer.disconnect();
  observer=new MutationObserver(()=>{
    const text=(el.textContent||'').trim();
    const hit=labelFromText(text);
    if(hit){degradedMode=hit;return;}
    if(degradedMode&&text===degradedMode+'底圖已載入'){
      el.textContent=degradedText(degradedMode);
      el.classList.add('show');
      el.classList.add('fail');
      clearTimeout(el.__fallbackStatusTimer);
      el.__fallbackStatusTimer=setTimeout(()=>{
        el.classList.remove('show');
        el.classList.remove('fail');
      },3600);
      degradedMode='';
      return;
    }
    if(/正在載入「(街道|明亮|地形|深色|衛星)」底圖/.test(text))degradedMode='';
  });
  observer.observe(el,{childList:true,characterData:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
