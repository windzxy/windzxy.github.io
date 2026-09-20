export function enableMapInteractions(mapApi,container){
  const map=mapApi?.map;
  if(!map||mapApi?.isFallback)return{destroy(){}};
  const target=container||map.getContainer?.();
  const canvasContainer=map.getCanvasContainer?.();
  const canvas=map.getCanvas?.();
  let restoreRaf=0,destroyed=false;
  const normalizeSurface=el=>{if(!el)return;const s=el.style;if(s.pointerEvents!=='auto')s.pointerEvents='auto';if(s.touchAction!=='none')s.touchAction='none';if(s.userSelect!=='none')s.userSelect='none';if(s.webkitUserSelect!=='none')s.webkitUserSelect='none'};
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
    normalizeSurface(target);normalizeSurface(canvasContainer);normalizeSurface(canvas);
  }catch(e){console.warn('[Global Weather map interactions]',e)}};
  keepEnabled();
  // Style replacement can emit several styledata events in one paint cycle.
  // Coalesce them so restoring gestures never adds redundant work to map redraws.
  const restoreAfterStyle=()=>{if(destroyed||restoreRaf)return;restoreRaf=requestAnimationFrame(()=>{restoreRaf=0;keepEnabled()})};
  map.on?.('style.load',restoreAfterStyle);
  map.on?.('styledata',restoreAfterStyle);
  map.on?.('resize',keepEnabled);
  return{destroy(){destroyed=true;if(restoreRaf)cancelAnimationFrame(restoreRaf);restoreRaf=0;try{map.off?.('style.load',restoreAfterStyle);map.off?.('styledata',restoreAfterStyle);map.off?.('resize',keepEnabled)}catch{}}};
}
