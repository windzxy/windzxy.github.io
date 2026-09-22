export function enableMapInteractions(mapApi,container){
  const map=mapApi?.map;
  if(!map||mapApi?.isFallback)return{destroy(){}};
  const target=container||map.getContainer?.();
  const canvasContainer=map.getCanvasContainer?.();
  const canvas=map.getCanvas?.();
  let restoreRaf=0,destroyed=false;
  const normalizeSurface=el=>{if(!el)return;const s=el.style;if(s.pointerEvents!=='auto')s.pointerEvents='auto';if(s.touchAction!=='none')s.touchAction='none';if(s.overscrollBehavior!=='contain')s.overscrollBehavior='contain';if(s.userSelect!=='none')s.userSelect='none';if(s.webkitUserSelect!=='none')s.webkitUserSelect='none'};
  const setHandler=(handler,enabled)=>{if(!handler)return;const current=handler.isEnabled?.();if(current===enabled)return;(enabled?handler.enable:handler.disable)?.call(handler)};
  const keepEnabled=()=>{if(destroyed)return;try{
    setHandler(map.dragPan,true);
    setHandler(map.scrollZoom,true);
    setHandler(map.boxZoom,true);
    setHandler(map.doubleClickZoom,true);
    setHandler(map.keyboard,true);
    setHandler(map.touchZoomRotate,true);
    map.touchZoomRotate?.disableRotation?.();
    setHandler(map.dragRotate,false);
    setHandler(map.touchPitch,false);
    // Global Weather must remain directly draggable inside WebDesk on desktop, tablet and phone.
    // If a host/style enables MapLibre cooperative gestures, one-finger drag can be intercepted
    // (or require modifier/two-finger input) even though dragPan itself is enabled.
    setHandler(map.cooperativeGestures,false);
    normalizeSurface(target);normalizeSurface(canvasContainer);normalizeSurface(canvas);
  }catch(e){console.warn('[Global Weather map interactions]',e)}};
  keepEnabled();
  // Style replacements and responsive resize bursts only need one gesture restoration per frame.
  // Avoid styledata: it fires repeatedly while sources/layers update and can compete with drag redraws.
  const restoreAfterStyle=()=>{if(destroyed||restoreRaf)return;restoreRaf=requestAnimationFrame(()=>{restoreRaf=0;keepEnabled()})};
  // WebDesk can suspend a card while another workspace/card is active. On resume the map may have
  // missed its responsive resize and gesture normalization, leaving a visible map that no longer
  // drags until another resize occurs. Restore both once when the document becomes visible again.
  const restoreAfterResume=()=>{if(document.hidden||destroyed)return;try{map.resize?.()}catch{}restoreAfterStyle()};
  map.on?.('style.load',restoreAfterStyle);
  map.on?.('resize',restoreAfterStyle);
  document.addEventListener('visibilitychange',restoreAfterResume);
  return{destroy(){destroyed=true;if(restoreRaf)cancelAnimationFrame(restoreRaf);restoreRaf=0;document.removeEventListener('visibilitychange',restoreAfterResume);try{map.off?.('style.load',restoreAfterStyle);map.off?.('resize',restoreAfterStyle)}catch{}}};
}
