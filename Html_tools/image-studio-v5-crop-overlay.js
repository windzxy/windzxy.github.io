(function(){
  'use strict';
  const VER='20260828-image-studio-v5-crop-overlay-handles';
  if(window.__windzxyImageStudioV5CropOverlay===VER)return;
  window.__windzxyImageStudioV5CropOverlay=VER;

  const MIN=32;
  let raf=0;

  function n(v,fb){const x=Number(v);return Number.isFinite(x)?x:fb;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function rootOf(el){return el?.closest?.('[data-is4-root]');}
  function isCrop(root){return !!root?.querySelector('[data-is4-tool="crop"].on');}
  function fields(root){return {
    x:root.querySelector('[data-is4-cx]'),
    y:root.querySelector('[data-is4-cy]'),
    w:root.querySelector('[data-is4-cw]'),
    h:root.querySelector('[data-is4-ch]')
  };}
  function imageInfo(root){
    const canvas=root.querySelector('[data-is4-original]');
    const img=canvas?.querySelector('img');
    if(!canvas||!img||!img.complete||!img.naturalWidth||!img.naturalHeight)return null;
    return {canvas,img,ow:img.naturalWidth,oh:img.naturalHeight};
  }
  function readCrop(root,info){
    const f=fields(root);
    let x=n(f.x?.value,0),y=n(f.y?.value,0),w=n(f.w?.value,info.ow),h=n(f.h?.value,info.oh);
    w=clamp(Math.round(w),Math.min(MIN,info.ow),info.ow);
    h=clamp(Math.round(h),Math.min(MIN,info.oh),info.oh);
    x=clamp(Math.round(x),0,info.ow-w);
    y=clamp(Math.round(y),0,info.oh-h);
    return {x,y,w,h};
  }
  function writeCrop(root,crop,commit){
    const info=imageInfo(root);if(!info)return;
    crop.w=clamp(Math.round(crop.w),Math.min(MIN,info.ow),info.ow);
    crop.h=clamp(Math.round(crop.h),Math.min(MIN,info.oh),info.oh);
    crop.x=clamp(Math.round(crop.x),0,info.ow-crop.w);
    crop.y=clamp(Math.round(crop.y),0,info.oh-crop.h);
    const f=fields(root);
    if(f.x)f.x.value=crop.x;
    if(f.y)f.y.value=crop.y;
    if(f.w)f.w.value=crop.w;
    if(f.h)f.h.value=crop.h;
    position(root,crop);
    if(commit){
      const ev=new Event('input',{bubbles:true});
      (f.w||f.x||root).dispatchEvent(ev);
    }
  }
  function ensureOverlay(root){
    const info=imageInfo(root);if(!info)return null;
    let box=info.canvas.querySelector('.is5-crop-box');
    if(!box){
      box=document.createElement('div');
      box.className='is5-crop-box';
      box.innerHTML='<i data-h="nw"></i><i data-h="n"></i><i data-h="ne"></i><i data-h="e"></i><i data-h="se"></i><i data-h="s"></i><i data-h="sw"></i><i data-h="w"></i><b></b><em></em>';
      info.canvas.appendChild(box);
    }
    return box;
  }
  function position(root,crop){
    const info=imageInfo(root);if(!info)return;
    const box=ensureOverlay(root);if(!box)return;
    if(!isCrop(root)){box.hidden=true;return;}
    const cr=info.canvas.getBoundingClientRect();
    const ir=info.img.getBoundingClientRect();
    const sx=ir.width/info.ow, sy=ir.height/info.oh;
    box.hidden=false;
    box.style.left=(ir.left-cr.left+crop.x*sx)+'px';
    box.style.top=(ir.top-cr.top+crop.y*sy)+'px';
    box.style.width=Math.max(8,crop.w*sx)+'px';
    box.style.height=Math.max(8,crop.h*sy)+'px';
    const label=box.querySelector('em');
    if(label)label.textContent=Math.round(crop.w)+'×'+Math.round(crop.h);
  }
  function syncOne(root){
    const info=imageInfo(root);
    if(!info)return;
    const box=ensureOverlay(root);
    if(!box)return;
    if(!isCrop(root)){box.hidden=true;return;}
    position(root,readCrop(root,info));
  }
  function syncAll(){
    raf=0;
    document.querySelectorAll('[data-is4-root]').forEach(syncOne);
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(syncAll);}

  function startDrag(e){
    const box=e.target.closest('.is5-crop-box');
    if(!box)return;
    const root=rootOf(box);const info=imageInfo(root);if(!root||!info||!isCrop(root))return;
    e.preventDefault();e.stopPropagation();
    const handle=e.target.dataset.h||'move';
    const start={x:e.clientX,y:e.clientY};
    const base=readCrop(root,info);
    const ir=info.img.getBoundingClientRect();
    const scaleX=info.ow/Math.max(1,ir.width), scaleY=info.oh/Math.max(1,ir.height);
    box.classList.add('dragging');
    function next(ev){
      const dx=(ev.clientX-start.x)*scaleX;
      const dy=(ev.clientY-start.y)*scaleY;
      let c=Object.assign({},base);
      if(handle==='move'||!handle){c.x=base.x+dx;c.y=base.y+dy;}
      else{
        if(handle.includes('w')){c.x=base.x+dx;c.w=base.w-dx;}
        if(handle.includes('e')){c.w=base.w+dx;}
        if(handle.includes('n')){c.y=base.y+dy;c.h=base.h-dy;}
        if(handle.includes('s')){c.h=base.h+dy;}
      }
      if(c.w<MIN){if(handle.includes('w'))c.x=base.x+base.w-MIN;c.w=MIN;}
      if(c.h<MIN){if(handle.includes('n'))c.y=base.y+base.h-MIN;c.h=MIN;}
      writeCrop(root,c,false);
    }
    function end(ev){
      next(ev);
      box.classList.remove('dragging');
      window.removeEventListener('pointermove',next,true);
      writeCrop(root,readCrop(root,info),true);
    }
    window.addEventListener('pointermove',next,true);
    window.addEventListener('pointerup',end,{once:true,capture:true});
  }

  function style(){
    if(document.getElementById('windzxyImageStudioV5CropStyle'))return;
    const s=document.createElement('style');
    s.id='windzxyImageStudioV5CropStyle';
    s.textContent=`
.is4-canvas{position:relative}.is5-crop-box{position:absolute;z-index:8;border:2px solid rgba(255,189,98,.98);border-radius:10px;background:rgba(255,189,98,.055);box-shadow:0 0 0 9999px rgba(0,0,0,.48),0 12px 30px rgba(0,0,0,.28);cursor:move;touch-action:none}.is5-crop-box:before,.is5-crop-box:after{content:"";position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(90deg,transparent 33.333%,rgba(255,255,255,.42) 33.333%,rgba(255,255,255,.42) 34%,transparent 34%,transparent 66.666%,rgba(255,255,255,.42) 66.666%,rgba(255,255,255,.42) 67.333%,transparent 67.333%),linear-gradient(0deg,transparent 33.333%,rgba(255,255,255,.42) 33.333%,rgba(255,255,255,.42) 34%,transparent 34%,transparent 66.666%,rgba(255,255,255,.42) 66.666%,rgba(255,255,255,.42) 67.333%,transparent 67.333%)}.is5-crop-box.dragging{border-color:#fff2bd;background:rgba(255,218,123,.10)}.is5-crop-box i{position:absolute;width:15px;height:15px;border-radius:50%;background:#fff2bd;border:2px solid #2a1705;box-shadow:0 3px 10px rgba(0,0,0,.35);z-index:2}.is5-crop-box i[data-h="nw"]{left:-8px;top:-8px;cursor:nwse-resize}.is5-crop-box i[data-h="n"]{left:50%;top:-8px;transform:translateX(-50%);cursor:ns-resize}.is5-crop-box i[data-h="ne"]{right:-8px;top:-8px;cursor:nesw-resize}.is5-crop-box i[data-h="e"]{right:-8px;top:50%;transform:translateY(-50%);cursor:ew-resize}.is5-crop-box i[data-h="se"]{right:-8px;bottom:-8px;cursor:nwse-resize}.is5-crop-box i[data-h="s"]{left:50%;bottom:-8px;transform:translateX(-50%);cursor:ns-resize}.is5-crop-box i[data-h="sw"]{left:-8px;bottom:-8px;cursor:nesw-resize}.is5-crop-box i[data-h="w"]{left:-8px;top:50%;transform:translateY(-50%);cursor:ew-resize}.is5-crop-box b{position:absolute;inset:0;pointer-events:none;border-radius:8px;outline:1px solid rgba(0,0,0,.38)}.is5-crop-box em{position:absolute;left:8px;bottom:8px;z-index:3;padding:4px 7px;border-radius:999px;background:rgba(0,0,0,.58);color:#fff;font-style:normal;font-size:11px;font-weight:850;backdrop-filter:blur(8px)}
    `;
    document.head.appendChild(s);
  }
  function boot(){style();schedule();document.addEventListener('pointerdown',startDrag,true);document.addEventListener('click',()=>setTimeout(schedule,40),true);document.addEventListener('input',e=>{if(e.target.closest('[data-is4-root]'))schedule();},true);window.addEventListener('resize',schedule,{passive:true});new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','src']});setInterval(schedule,1200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyImageStudioV5CropOverlayVersion=VER;
})();