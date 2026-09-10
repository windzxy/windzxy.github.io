(()=>{
'use strict';
const VER='20260910-global-weather-brand-v1.0';
if(window.__windzxyGlobalWeatherBrand===VER)return;
window.__windzxyGlobalWeatherBrand=VER;

function lang(){
  const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
  return /^en/i.test(v)?'en':/^zh-CN/i.test(v)?'zh-CN':'zh-HK';
}
const COPY={
  'zh-HK':{
    title:'全球氣象',
    desc:'實時雷達、衛星、降水、真實風場、溫濕度、氣壓與熱帶氣旋路徑。'
  },
  'zh-CN':{
    title:'全球气象',
    desc:'实时雷达、卫星、降水、真实风场、温湿度、气压与热带气旋路径。'
  },
  en:{
    title:'Global Weather',
    desc:'Live radar, satellite, precipitation, real wind fields, temperature, humidity, pressure and tropical-cyclone tracks.'
  }
};
function copy(){return COPY[lang()]||COPY['zh-HK']}
function applyMeta(){
  const list=typeof apps!=='undefined'?apps:window.apps;
  if(!Array.isArray(list))return false;
  const app=list.find(x=>x&&x.id==='typhoon');
  if(!app)return false;
  const c=copy();
  app.title=c.title;
  app.desc=c.desc;
  app.icon='🌦️';
  app.category='即時資訊';
  return true;
}
function refreshOpenCards(){
  document.querySelectorAll('.desktop-card[data-card-id]').forEach(el=>{
    try{
      if(typeof activeWorkspace!=='function')return;
      const card=activeWorkspace().cards.find(c=>c.id===el.dataset.cardId);
      if(!card||card.appId!=='typhoon')return;
      const c=copy();
      const title=el.querySelector('.card-title,[data-card-title],.desktop-card-title,.window-title');
      if(title)title.textContent=c.title;
    }catch(_){ }
  });
}
function refresh(){
  const changed=applyMeta();
  if(changed){
    try{if(typeof renderShelf==='function')renderShelf()}catch(_){ }
    refreshOpenCards();
  }
}
function boot(){
  refresh();
  setTimeout(refresh,120);
  setTimeout(refresh,800);
  document.addEventListener('change',e=>{if(e.target?.matches?.('.lang-select'))setTimeout(refresh,0)},true);
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-id="typhoon"]'))setTimeout(refreshOpenCards,80)},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskGlobalWeatherBrand={version:VER,title:()=>copy().title,legacyAppId:'typhoon'};
})();