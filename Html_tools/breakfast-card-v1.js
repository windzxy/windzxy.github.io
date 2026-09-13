(()=>{
'use strict';
const VERSION='20260913-breakfast-card-v1.0';
if(window.__windzxyBreakfastCard===VERSION)return;
window.__windzxyBreakfastCard=VERSION;

function register(){
  if(typeof apps==='undefined'||!Array.isArray(apps))return false;
  if(!apps.some(x=>x&&x.id==='breakfast')){
    const weatherIndex=apps.findIndex(x=>x&&x.id==='weather');
    const item={id:'breakfast',kind:'widget',title:'早餐',desc:'記錄今天早餐、飲品與備註，快速規劃早晨。',icon:'☕',tone:'t-breakfast'};
    if(weatherIndex>=0)apps.splice(weatherIndex,0,item);else apps.push(item);
  }
  return true;
}

function breakfastHtml(card){
  const data=card?.data||{};
  const food=data.breakfastFood||'';
  const drink=data.breakfastDrink||'';
  const note=data.breakfastNote||'';
  return '<div class="breakfast-widget">'
    +'<div class="breakfast-hero"><span class="breakfast-emoji">☀️</span><div><strong data-i18n="早安">早安</strong><small data-i18n="今天早餐吃什麼？">今天早餐吃什麼？</small></div></div>'
    +'<label class="breakfast-field"><span data-i18n="早餐">早餐</span><input data-field="breakfastFood" value="'+escapeHtml(food)+'" placeholder="麵包、雞蛋、粥…"></label>'
    +'<label class="breakfast-field"><span data-i18n="飲品">飲品</span><input data-field="breakfastDrink" value="'+escapeHtml(drink)+'" placeholder="咖啡、牛奶、豆漿…"></label>'
    +'<label class="breakfast-field"><span data-i18n="備註">備註</span><textarea data-field="breakfastNote" placeholder="今天早上的提醒…">'+escapeHtml(note)+'</textarea></label>'
    +'</div>';
}

function installBody(){
  if(typeof bodyHtml!=='function'||bodyHtml.__breakfastWrapped)return;
  const base=bodyHtml;
  const wrapped=function(card,info){
    if(card?.appId==='breakfast')return breakfastHtml(card);
    return base(card,info);
  };
  wrapped.__breakfastWrapped=true;
  bodyHtml=wrapped;
}

function style(){
  if(document.getElementById('breakfastCardV1Css'))return;
  const s=document.createElement('style');s.id='breakfastCardV1Css';
  s.textContent=`
  .t-breakfast{--card-accent:#f6a84d}
  .breakfast-widget{display:grid;gap:9px;height:100%;box-sizing:border-box;padding:2px}
  .breakfast-hero{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:12px;background:linear-gradient(135deg,rgba(255,193,92,.20),rgba(255,255,255,.06))}
  .breakfast-emoji{font-size:26px}.breakfast-hero div{display:grid;gap:2px}.breakfast-hero strong{font-size:14px}.breakfast-hero small{font-size:10px;opacity:.66}
  .breakfast-field{display:grid;grid-template-columns:48px 1fr;align-items:center;gap:7px;font-size:10px}.breakfast-field span{opacity:.72;font-weight:700}
  .breakfast-field input,.breakfast-field textarea{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.13);border-radius:9px;background:rgba(255,255,255,.08);color:inherit;padding:8px 9px;font:inherit;outline:none}
  .breakfast-field textarea{min-height:48px;resize:none}.breakfast-field input:focus,.breakfast-field textarea:focus{border-color:rgba(246,168,77,.68);box-shadow:0 0 0 2px rgba(246,168,77,.12)}
  @media(max-width:620px){.breakfast-widget{gap:7px}.breakfast-hero{padding:7px 9px}.breakfast-field{grid-template-columns:42px 1fr}.breakfast-field textarea{min-height:40px}}
  `;
  document.head.appendChild(s);
}

function refresh(){
  const ok=register();
  installBody();style();
  if(ok&&typeof renderShelf==='function')renderShelf();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
setTimeout(refresh,0);
window.WebDeskBreakfastCard={version:VERSION,registered:true};
})();