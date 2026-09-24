export function enableMapInteractions(mapApi,container){
  const map=mapApi?.map;
  if(!map||mapApi?.isFallback)return{destroy(){}};
  const target=container||map.getContainer?.();
  const canvasContainer=map.getCanvasContainer?.();
  const canvas=map.getCanvas?.();
  let restoreRaf=0,destroyed=false,resizeObserver=null,lastWidth=0,lastHeight=0;
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
  // A WebDesk host can change gesture state after mount (workspace drag/resize, card resume, etc.).
  // Re-normalize immediately before the user's next gesture so the first drag is not swallowed.
  const restoreBeforeGesture=()=>{if(destroyed)return;keepEnabled()};
  target?.addEventListener?.('pointerdown',restoreBeforeGesture,{capture:true,passive:true});
  // WebDesk can suspend a card while another workspace/card is active. On resume the map may have
  // missed its responsive resize and gesture normalization, leaving a visible map that no longer
  // drags until another resize occurs. Restore both once when the document becomes visible again.
  const restoreAfterResume=()=>{if(document.hidden||destroyed)return;try{map.resize?.()}catch{}restoreAfterStyle()};
  map.on?.('style.load',restoreAfterStyle);
  map.on?.('resize',restoreAfterStyle);
  document.addEventListener('visibilitychange',restoreAfterResume);
  // Browser back/forward cache can restore the whole WebDesk without a visibilitychange event.
  // pageshow covers that resume path so MapLibre recalculates its canvas before the next drag.
  window.addEventListener('pageshow',restoreAfterResume);
  // WebDesk card/workspace switches can hide and reveal this surface while the document itself
  // remains visible, so visibilitychange/pageshow never fire. Observe the actual map box and resize
  // MapLibre only when it becomes non-zero or its dimensions really change.
  if(target&&typeof ResizeObserver!=='undefined'){
    resizeObserver=new ResizeObserver(entries=>{if(destroyed)return;const rect=entries[0]?.contentRect,w=Math.round(rect?.width||0),h=Math.round(rect?.height||0);if(w<2||h<2||(w===lastWidth&&h===lastHeight))return;lastWidth=w;lastHeight=h;restoreAfterResume()});
    resizeObserver.observe(target);
  }
  return{destroy(){destroyed=true;if(restoreRaf)cancelAnimationFrame(restoreRaf);restoreRaf=0;resizeObserver?.disconnect();resizeObserver=null;target?.removeEventListener?.('pointerdown',restoreBeforeGesture,true);document.removeEventListener('visibilitychange',restoreAfterResume);window.removeEventListener('pageshow',restoreAfterResume);try{map.off?.('style.load',restoreAfterStyle);map.off?.('resize',restoreAfterStyle)}catch{}}};
}
