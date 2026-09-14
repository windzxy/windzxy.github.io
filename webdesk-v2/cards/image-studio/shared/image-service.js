export async function loadImageFile(file){
  if(!file||!file.type?.startsWith('image/'))throw new Error('請選擇圖片檔案');
  const url=URL.createObjectURL(file);
  try{
    const img=new Image();img.decoding='async';img.src=url;await img.decode();
    return{file,name:file.name,width:img.naturalWidth,height:img.naturalHeight,type:file.type,image:img,url};
  }catch(e){URL.revokeObjectURL(url);throw e}
}
export function releaseImage(state){if(state?.url)URL.revokeObjectURL(state.url)}
export function fitSize(width,height,maxW,maxH){const r=Math.min(1,maxW/width,maxH/height);return{w:Math.max(1,Math.round(width*r)),h:Math.max(1,Math.round(height*r))}}
export function resizeDimensions(srcW,srcH,nextW,nextH,locked=true){
  let w=Math.max(1,Math.round(Number(nextW)||srcW)),h=Math.max(1,Math.round(Number(nextH)||srcH));
  if(locked){if(nextW&&!nextH)h=Math.round(w*srcH/srcW);else if(nextH&&!nextW)w=Math.round(h*srcW/srcH)}
  return{w,h};
}
export function cropRatioValue(value){
  if(value==='1:1')return 1;
  if(value==='4:3')return 4/3;
  if(value==='3:4')return 3/4;
  if(value==='16:9')return 16/9;
  return 0;
}
export function centerCropRect(srcW,srcH,ratio){
  const w=Math.max(1,Number(srcW)||1),h=Math.max(1,Number(srcH)||1),target=Number(ratio)||0;
  if(!target)return{x:0,y:0,w,h};
  const current=w/h;
  if(current>target){const cw=h*target;return{x:(w-cw)/2,y:0,w:cw,h}}
  const ch=w/target;return{x:0,y:(h-ch)/2,w,h:ch};
}
export function normalizeCropRect(srcW,srcH,rect,ratio=0){
  const sw=Math.max(1,Number(srcW)||1),sh=Math.max(1,Number(srcH)||1),target=Number(ratio)||0;
  if(!rect)return centerCropRect(sw,sh,target);
  let w=Math.max(1,Math.min(sw,Number(rect.w)||sw)),h=Math.max(1,Math.min(sh,Number(rect.h)||sh));
  if(target){
    if(w/h>target)w=h*target;else h=w/target;
    if(w>sw){w=sw;h=w/target}if(h>sh){h=sh;w=h*target}
  }
  let x=Number(rect.x)||0,y=Number(rect.y)||0;
  x=Math.max(0,Math.min(sw-w,x));y=Math.max(0,Math.min(sh-h,y));
  return{x,y,w,h};
}
export function renderPreview(canvas,image,w,h,{cropRatio=0,cropRect=null}={}){
  const outW=Math.max(1,Math.round(Number(w)||1)),outH=Math.max(1,Math.round(Number(h)||1));
  const ctx=canvas.getContext('2d',{alpha:true});canvas.width=outW;canvas.height=outH;ctx.clearRect(0,0,outW,outH);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  const src=normalizeCropRect(image.naturalWidth||image.width,image.naturalHeight||image.height,cropRect,cropRatio);
  ctx.drawImage(image,src.x,src.y,src.w,src.h,0,0,outW,outH);
  return src;
}
export async function exportCanvas(canvas,{format='image/png',quality=.9,filename='image'}={}){const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('匯出失敗')),format,quality));const ext=format==='image/jpeg'?'jpg':format==='image/webp'?'webp':'png';const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${filename.replace(/\.[^.]+$/,'')}-${canvas.width}x${canvas.height}.${ext}`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return blob}
export function bindDropZone(node,onFile){const over=e=>{e.preventDefault();node.classList.add('drag')},leave=()=>node.classList.remove('drag'),drop=e=>{e.preventDefault();leave();const f=e.dataTransfer?.files?.[0];if(f)onFile(f)};node.addEventListener('dragover',over);node.addEventListener('dragleave',leave);node.addEventListener('drop',drop);return()=>{node.removeEventListener('dragover',over);node.removeEventListener('dragleave',leave);node.removeEventListener('drop',drop)}}
