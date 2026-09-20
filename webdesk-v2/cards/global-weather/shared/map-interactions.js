export function enableMapInteractions(mapApi,container){
  const map=mapApi?.map;
  if(!map||mapApi?.isFallback)return{destroy(){}};
  const target=container||map.getContainer?.();
  const canvasContainer=map.getCanvasContainer?.();
  const canvas=map.getCanvas?.();
  let restoreRaf=0,destroyed=false;
  const normalizeSurface=el=>{if(!el)return;el.style.pointerEvents='auto';el.style.touchAction='none';el.style.userSelect='none';el.style.webkitUserSelect='none'};
  const keepEnabled=()=>{if(destroyed)return;try{
    map.dragPan?.enable?.();
    map.scrollZoom?.enable?.();
    map.boxZoom?.enable?.();
    map.doubleClickZoom?.enable?.();
    map.keyboard?.enable?.();
    map.touchZoomRotate?.enable?.();
    map.touchZoomRotate?.disableRotation?.();
    map.dragRotate?.disable?.();
    map.touchPitch?.disable?.();
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
