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
export function renderPreview(canvas,image,w,h){const ctx=canvas.getContext('2d',{alpha:true});canvas.width=w;canvas.height=h;ctx.clearRect(0,0,w,h);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(image,0,0,w,h)}
export async function exportCanvas(canvas,{format='image/png',quality=.9,filename='image'}={}){const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('匯出失敗')),format,quality));const ext=format==='image/jpeg'?'jpg':format==='image/webp'?'webp':'png';const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${filename.replace(/\.[^.]+$/,'')}-${canvas.width}x${canvas.height}.${ext}`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return blob}
export function bindDropZone(node,onFile){const over=e=>{e.preventDefault();node.classList.add('drag')},leave=()=>node.classList.remove('drag'),drop=e=>{e.preventDefault();leave();const f=e.dataTransfer?.files?.[0];if(f)onFile(f)};node.addEventListener('dragover',over);node.addEventListener('dragleave',leave);node.addEventListener('drop',drop);return()=>{node.removeEventListener('dragover',over);node.removeEventListener('dragleave',leave);node.removeEventListener('drop',drop)}}
