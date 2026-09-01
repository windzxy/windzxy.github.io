(()=>{'use strict';
const VER='20260901-typhoon-polish-v5.4-freshness';
if(window.__windzxyTyphoonPolishV54===VER)return;
window.__windzxyTyphoonPolishV54=VER;
const TXT={
  fresh:{'zh-CN':'刚刚更新','zh-HK':'剛剛更新',en:'Just updated'},
  min:{'zh-CN':'分钟前','zh-HK':'分鐘前',en:' min ago'},
  stale:{'zh-CN':'资料可能已过时','zh-HK':'資料可能已過時',en:'Data may be stale'},
  checked:{'zh-CN':'路径资料','zh-HK':'路徑資料',en:'Track data'},
  unavailable:{'zh-CN':'未提供','zh-HK':'未提供',en:'Not provided'}
};
const INTENSITY={
  'tropical depression':{'zh-CN':'热带低压','zh-HK':'熱帶低氣壓',en:'Tropical Depression'},
  'tropical storm':{'zh-CN':'热带风暴','zh-HK':'熱帶風暴',en:'Tropical Storm'},
  'severe tropical storm':{'zh-CN':'强烈热带风暴','zh-HK':'強烈熱帶風暴',en:'Severe Tropical Storm'},
  'typhoon':{'zh-CN':'台风','zh-HK':'颱風',en:'Typhoon'},
  'severe typhoon':{'zh-CN':'强台风','zh-HK':'強颱風',en:'Severe Typhoon'},
  'super typhoon':{'zh-CN':'超强台风','zh-HK':'超強颱風',en:'Super Typhoon'}
};
function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';if(/^zh-CN/i.test(v)||/Hans/i.test(v))return'zh-CN';if(/^en/i.test(v))return'en';return'zh-HK'}
function t(k){return TXT[k]?.[lang()]||TXT[k]?.['zh-HK']||k}
function translateIntensity(v){const raw=String(v||'').trim(),hit=INTENSITY[raw.toLowerCase()];return hit?.[lang()]||raw}
function ageText(root){const ts=root.__tpData?.sourceUpdatedAt||root.__tpData?.updatedAt;if(!ts)return{txt:t('checked')+' · --',stale:false};const mins=Math.max(0,Math.floor((Date.now()-new Date(ts).getTime())/60000));if(!Number.isFinite(mins))return{txt:t('checked')+' · --',stale:false};const rel=mins<1?t('fresh'):lang()==='en'?mins+t('min'):mins+t('min');return{txt:t('checked')+' · '+rel,stale:mins>=45}}
function ensure(root){let e=root.querySelector('.tpv54-fresh');if(e)return e;const panel=root.querySelector('.tpv52');if(!panel)return null;e=document.createElement('div');e.className='tpv54-fresh';e.innerHTML='<span data-tpv54-age></span><b data-tpv54-stale></b>';panel.appendChild(e);return e}
function polish(root){if(!root||!document.body.contains(root))return;const e=ensure(root),a=ageText(root);if(e){e.querySelector('[data-tpv54-age]').textContent=a.txt;const s=e.querySelector('[data-tpv54-stale]');s.textContent=a.stale?t('stale'):'';s.classList.toggle('show',a.stale)}
  const sub=root.querySelector('[data-v52-sub]');if(sub&&sub.textContent){const parts=sub.textContent.split(' · ');if(parts[0]){const tr=translateIntensity(parts[0]);if(tr!==parts[0]){parts[0]=tr;sub.textContent=parts.join(' · ')}}}
  root.querySelectorAll('.tpv52-box b').forEach(b=>{if((b.textContent||'').trim()==='--')b.textContent=t('unavailable')});
  root.classList.toggle('tpv54-stale',a.stale);
}
function visible(root){const r=root.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<(innerHeight||document.documentElement.clientHeight)&&r.left<(innerWidth||document.documentElement.clientWidth)}
function bind(root){if(root.dataset.tpv54Bound)return;root.dataset.tpv54Bound='1';polish(root);let lastFetch=Date.now();root.__tpV54Timer=setInterval(()=>{if(!document.body.contains(root)){clearInterval(root.__tpV54Timer);return}polish(root);if(visible(root)&&Date.now()-lastFetch>=300000){lastFetch=Date.now();root.querySelector('[data-tp-refresh]')?.click()}},60000)}
function scan(scope=document){if(scope.matches?.('[data-typhoon-root]'))bind(scope);scope.querySelectorAll?.('[data-typhoon-root]').forEach(bind)}
function style(){if(document.getElementById('typhoonPolishV54Style'))return;const s=document.createElement('style');s.id='typhoonPolishV54Style';s.textContent=`
.tpv54-fresh{display:flex;align-items:center;gap:6px;margin-top:8px;padding-top:7px;border-top:1px solid rgba(255,255,255,.08);font-size:8px;color:#91a6bc}.tpv54-fresh b{display:none;margin-left:auto;padding:3px 5px;border-radius:999px;background:rgba(249,115,22,.16);color:#fed7aa;font-size:7px}.tpv54-fresh b.show{display:inline-flex}.tpv54-stale .tpv4-source i{background:#f59e0b!important;box-shadow:0 0 10px rgba(245,158,11,.8)!important}
@container(min-width:760px){.tpv4-info>div{display:none!important}.tpv4-info{justify-content:flex-end!important}.tpv4-info>small{max-width:max-content!important}.tpv4-source span[data-tp-status]{font-size:0}.tpv4-source span[data-tp-status]:after{content:'LIVE';font-size:8px}}
@container(max-width:759px){.tpv54-fresh{margin-top:6px}.tpv53-collapsed .tpv54-fresh{display:none}}
`;document.head.appendChild(s)}
function boot(){style();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)scan(n)}).observe(host,{childList:true,subtree:true});document.addEventListener('change',e=>{if(e.target?.matches('.lang-select'))setTimeout(()=>document.querySelectorAll('[data-typhoon-root]').forEach(polish),0)},true);window.WebDeskTyphoonPolish={version:'v5.4',freshness:true,visibleAutoRefreshMinutes:5,localizedIntensity:true,declutter:true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();