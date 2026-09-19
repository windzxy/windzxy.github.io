export function enableMapInteractions(mapApi,container){
  const map=mapApi?.map;
  if(!map||mapApi?.isFallback)return{destroy(){}};
  const target=container||map.getContainer?.();
  const canvasContainer=map.getCanvasContainer?.();
  const canvas=map.getCanvas?.();
  const normalizeSurface=el=>{if(!el)return;el.style.pointerEvents='auto';el.style.touchAction='none';el.style.userSelect='none';el.style.webkitUserSelect='none'};
  const keepEnabled=()=>{try{
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
  // MapLibre rebuilds handlers/canvas state while a basemap style is being replaced.
  // Restore pan/zoom on both style lifecycle events so weather-layer or basemap
  // switches cannot leave desktop, tablet, or one-finger mobile panning inert.
  const restoreAfterStyle=()=>requestAnimationFrame(keepEnabled);
  map.on?.('style.load',restoreAfterStyle);
  map.on?.('styledata',restoreAfterStyle);
  map.on?.('resize',keepEnabled);
  return{destroy(){try{map.off?.('style.load',restoreAfterStyle);map.off?.('styledata',restoreAfterStyle);map.off?.('resize',keepEnabled)}catch{}}};
}
