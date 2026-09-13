const PLATFORM = Object.freeze({ DESKTOP: 'desktop', TABLET: 'tablet', MOBILE: 'mobile' });

function media(query){
  try{return window.matchMedia(query).matches}catch{return false}
}

export function resolvePlatform(){
  const width=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);
  const height=Math.max(document.documentElement.clientHeight||0,window.innerHeight||0);
  const coarse=media('(pointer: coarse)');
  const hover=media('(hover: hover)');
  const portrait=height>=width;

  if(width<=680)return {name:PLATFORM.MOBILE,width,height,portrait,coarse,hover};
  if(width<=1180 || (coarse && width<=1366))return {name:PLATFORM.TABLET,width,height,portrait,coarse,hover};
  return {name:PLATFORM.DESKTOP,width,height,portrait,coarse,hover};
}

export function createPlatformResolver(){
  let current=resolvePlatform();
  const listeners=new Set();
  let raf=0;

  const emit=()=>{
    raf=0;
    const next=resolvePlatform();
    const changed=next.name!==current.name || next.portrait!==current.portrait || next.coarse!==current.coarse;
    current=next;
    document.documentElement.dataset.webdeskPlatform=next.name;
    document.documentElement.dataset.webdeskOrientation=next.portrait?'portrait':'landscape';
    if(changed)listeners.forEach(fn=>{try{fn(next)}catch(error){console.error('[WebDesk V2 platform subscriber]',error)}});
  };

  const schedule=()=>{if(!raf)raf=requestAnimationFrame(emit)};
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',schedule,{passive:true});
  try{matchMedia('(pointer: coarse)').addEventListener('change',schedule)}catch{}
  emit();

  return {
    get(){return current},
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
    destroy(){removeEventListener('resize',schedule);removeEventListener('orientationchange',schedule);listeners.clear()}
  };
}

export { PLATFORM };
