export function enableMapInteractions(mapApi,container){
  const map=mapApi?.map;
  if(!map||mapApi?.isFallback)return{destroy(){}};
  try{map.dragPan?.enable?.();map.scrollZoom?.enable?.();map.boxZoom?.enable?.();map.doubleClickZoom?.enable?.();map.keyboard?.enable?.();map.touchZoomRotate?.enable?.();map.touchZoomRotate?.disableRotation?.();map.dragRotate?.disable?.();map.touchPitch?.disable?.()}catch(e){console.warn('[Global Weather map interactions]',e)}
  const target=container||map.getContainer?.();
  const canvasContainer=map.getCanvasContainer?.();
  if(target){target.style.pointerEvents='auto';target.style.touchAction='none';target.style.userSelect='none'}
  if(canvasContainer){canvasContainer.style.pointerEvents='auto';canvasContainer.style.touchAction='none';canvasContainer.style.userSelect='none'}
  const canvas=map.getCanvas?.();if(canvas){canvas.style.pointerEvents='auto';canvas.style.touchAction='none';canvas.style.userSelect='none'}
  const keepEnabled=()=>{try{if(!map.dragPan?.isEnabled?.())map.dragPan?.enable?.();if(!map.touchZoomRotate?.isEnabled?.())map.touchZoomRotate?.enable?.();map.touchZoomRotate?.disableRotation?.();map.dragRotate?.disable?.();map.touchPitch?.disable?.()}catch{}};
  map.on?.('style.load',keepEnabled);map.on?.('resize',keepEnabled);keepEnabled();
  return{destroy(){try{map.off?.('style.load',keepEnabled);map.off?.('resize',keepEnabled)}catch{}}};
}
