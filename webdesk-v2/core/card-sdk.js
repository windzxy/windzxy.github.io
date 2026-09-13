const stores=new Map();

export function createCardSDK({manifest,platform,host}){
  const id=manifest.id;
  const prefix=`webdesk:v2:card:${id}:v${manifest.schemaVersion}`;
  const listeners=[];
  const controller=new AbortController();
  const storage={
    get(key,fallback=null){try{const raw=localStorage.getItem(`${prefix}:${key}`);return raw===null?fallback:JSON.parse(raw)}catch{return fallback}},
    set(key,value){localStorage.setItem(`${prefix}:${key}`,JSON.stringify(value));return value},
    remove(key){localStorage.removeItem(`${prefix}:${key}`)}
  };
  const sdk={
    id,manifest,platform,host,storage,signal:controller.signal,
    getPlatform:()=>platform,
    openApp:()=>host?.dispatchEvent(new CustomEvent('webdesk:open-app',{bubbles:true,detail:{id}})),
    notify:(message)=>host?.dispatchEvent(new CustomEvent('webdesk:notify',{bubbles:true,detail:{id,message}})),
    onCleanup(fn){if(typeof fn==='function')listeners.push(fn)},
    destroy(){controller.abort();while(listeners.length){try{listeners.pop()()}catch{}}stores.delete(id)}
  };
  stores.set(id,sdk);
  return sdk;
}
