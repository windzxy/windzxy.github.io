import {createCardSDK} from './card-sdk.js';

const mounted=new WeakMap();
const cssCache=new Map();

async function ensureStyle(path){
  if(!path||cssCache.has(path))return;
  const link=document.createElement('link');
  link.rel='stylesheet';link.href=new URL(path,location.href).href;link.dataset.webdeskCardStyle=path;
  const ready=new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=()=>reject(new Error(`style load failed: ${path}`))});
  document.head.appendChild(link);await ready;cssCache.set(path,link);
}

function errorSurface(host,manifest,error){
  host.innerHTML=`<div class="wd-card-error"><strong>${manifest?.name?.['zh-HK']||manifest?.id||'卡片'} 載入失敗</strong><small>${String(error?.message||error||'Unknown error')}</small><button class="wd-ios-button wd-ios-button-tinted" type="button" data-card-retry>重試</button></div>`;
}

export async function mountCard(host,manifest,platform){
  await unmountCard(host);
  const entry=manifest?.entry?.[platform];
  if(!entry?.card)throw new Error(`${manifest?.id||'card'} missing ${platform} card entry`);
  const sdk=createCardSDK({manifest,platform,host});
  const abort=new AbortController();
  mounted.set(host,{sdk,abort,cleanup:null,manifest,platform});
  host._manifest=manifest;
  host.dataset.cardId=manifest.id;host.dataset.platform=platform;host.setAttribute('aria-busy','true');
  try{
    if(entry.cardStyle)await ensureStyle(`./cards/${manifest.id}/${entry.cardStyle}`);
    const url=new URL(`./cards/${manifest.id}/${entry.card}`,location.href);
    url.searchParams.set('v',manifest.version);
    const mod=await Promise.race([
      import(url.href),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error('card load timeout')),8000))
    ]);
    if(abort.signal.aborted)return;
    host.innerHTML='';
    const cleanup=await mod.mount?.({host,sdk,manifest,platform,signal:abort.signal});
    const rec=mounted.get(host);if(rec)rec.cleanup=typeof cleanup==='function'?cleanup:null;
  }catch(error){
    if(!abort.signal.aborted){console.error('[WebDesk V2 card]',manifest.id,error);errorSurface(host,manifest,error)}
  }finally{host.removeAttribute('aria-busy')}
}

export async function unmountCard(host){
  const rec=mounted.get(host);if(!rec)return;
  rec.abort.abort();
  try{await rec.cleanup?.()}catch(error){console.warn('[WebDesk V2 cleanup]',error)}
  try{rec.sdk.destroy()}catch{}
  mounted.delete(host);host.replaceChildren();
}

export async function remountCard(host,manifest,platform){return mountCard(host,manifest,platform)}

export function bindCardRecovery(root,resolvePlatform){
  root.addEventListener('click',e=>{const button=e.target.closest('[data-card-retry]');if(!button)return;const host=button.closest('[data-card-mount]');const manifest=host?._manifest;if(host&&manifest)mountCard(host,manifest,resolvePlatform())});
}
