const REGISTRY_URL='./generated/cards.registry.json';

function freezeCard(card){
  return Object.freeze({...card,entry:Object.freeze({...card.entry}),defaultSize:Object.freeze({...card.defaultSize})});
}

export async function loadRegistry({signal,timeout=5000}={}){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(new DOMException('Registry load timeout','TimeoutError')),timeout);
  const abort=()=>controller.abort(signal?.reason);
  signal?.addEventListener('abort',abort,{once:true});
  try{
    const response=await fetch(REGISTRY_URL,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error(`Registry HTTP ${response.status}`);
    const data=await response.json();
    if(data?.schemaVersion!==1||!Array.isArray(data.cards))throw new Error('Invalid WebDesk V2 registry');
    const ids=new Set();
    const cards=[];
    for(const raw of data.cards){
      if(!raw?.id||ids.has(raw.id))continue;
      ids.add(raw.id);
      cards.push(freezeCard(raw));
    }
    return Object.freeze({schemaVersion:1,cards:Object.freeze(cards),errors:Object.freeze(data.errors||[])});
  }finally{
    clearTimeout(timer);
    signal?.removeEventListener('abort',abort);
  }
}

export function selectPlatformEntry(card,platform){
  const entry=card?.entry?.[platform];
  if(!entry?.card)throw new Error(`${card?.id||'unknown'} has no ${platform} card entry`);
  return entry;
}

export function registryIndex(registry){
  return new Map((registry?.cards||[]).map(card=>[card.id,card]));
}
