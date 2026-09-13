import {createCardSDK} from './card-sdk.js';

const active=new WeakMap();
const cssCache=new Map();

async function ensureStyle(path){if(!path||cssCache.has(path))return;const link=document.createElement('link');link.rel='stylesheet';link.href=new URL(path,location.href).href;const ready=new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=()=>reject(new Error(`style load failed: ${path}`))});document.head.appendChild(link);await ready;cssCache.set(path,link)}

export async function closeApp(target){
  if(!target)return;
  const rec=active.get(target);
  if(rec){
    rec.abort.abort();
    try{await rec.cleanup?.()}catch(error){console.warn('[WebDesk V2 app cleanup]',error)}
    try{rec.sdk.destroy()}catch{}
    active.delete(target);
    const onClose=rec.onClose;
    if(onClose){await onClose();return}
  }
  target.replaceChildren();
  document.body.classList.remove('wd-app-open');
}

export async function openApp(target,manifest,platform,{inline=false,onClose=null}={}){
  if(!target)throw new Error('missing app host');
  await closeApp(target);
  const entry=manifest?.entry?.[platform];
  if(!entry?.app)throw new Error(`${manifest?.id||'card'} missing ${platform} app entry`);
  const abort=new AbortController();
  const shell=inline?target:document.createElement('section');
  if(!inline){shell.className=`wd-window wd-window-${platform}`;target.replaceChildren(shell)}
  else{shell.classList.add('wd-card-detail');shell.dataset.detailOpen='1'}
  const compactMobile=inline&&platform==='mobile';
  shell.classList.toggle('wd-card-detail-mobile',compactMobile);
  shell.innerHTML=compactMobile
    ? `<button class="wd-detail-close" type="button" data-close-window aria-label="關閉詳細內容">×</button><div class="wd-window-body" data-app-mount aria-busy="true"></div>`
    : `<header class="wd-window-head"><strong>${manifest.icon||'•'} ${manifest.name?.['zh-HK']||manifest.id}</strong><button type="button" data-close-window>關閉</button></header><div class="wd-window-body" data-app-mount aria-busy="true"></div>`;
  document.body.classList.add('wd-app-open');
  shell.querySelector('[data-close-window]').onclick=()=>closeApp(target);
  const mount=shell.querySelector('[data-app-mount]');
  const sdk=createCardSDK({manifest,platform,host:mount});
  active.set(target,{abort,sdk,cleanup:null,onClose,inline});
  try{
    if(entry.appStyle)await ensureStyle(`./cards/${manifest.id}/${entry.appStyle}`);
    const url=new URL(`./cards/${manifest.id}/${entry.app}`,location.href);url.searchParams.set('v',manifest.version);
    let timeoutId;const timeout=new Promise((_,reject)=>{timeoutId=setTimeout(()=>reject(new Error('app load timeout')),10000)});
    const mod=await Promise.race([import(url.href),timeout]);clearTimeout(timeoutId);
    if(abort.signal.aborted)return;
    mount.replaceChildren();
    const cleanup=await mod.mount?.({host:mount,sdk,manifest,platform,signal:abort.signal});
    const rec=active.get(target);if(rec)rec.cleanup=typeof cleanup==='function'?cleanup:null;
  }catch(error){
    if(!abort.signal.aborted)mount.innerHTML=`<div class="wd-card-error"><strong>App 載入失敗</strong><small>${String(error?.message||error)}</small></div>`;
  }finally{mount.removeAttribute('aria-busy')}
}
