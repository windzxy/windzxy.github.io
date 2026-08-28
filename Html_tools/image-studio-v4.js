(function(){
  if(window.__windzxyImageStudioV4Loaded)return;
  window.__windzxyImageStudioV4Loaded=1;
  window.__windzxyImageStudioV3Loaded=1;
  window.__windzxyImageStudioV2Loaded=1;

  const VER='20260828-image-studio-v4-safe-crop-output';
  const APP='image';
  const DEFAULT_W=980,DEFAULT_H=680;
  const MIN_CROP=32;
  const SESS=new Map();
  const TEXT={
    title:{'zh-CN':'图片工作室','zh-HK':'圖片工作室',en:'Image Studio'},
    desc:{'zh-CN':'导入、对比预览、裁切、调色、尺寸与导出。','zh-HK':'導入、對比預覽、裁切、調色、尺寸與導出。',en:'Import, compare, crop, adjust, resize and export.'},
    import:{'zh-CN':'导入','zh-HK':'導入',en:'Import'},resize:{'zh-CN':'尺寸','zh-HK':'尺寸',en:'Resize'},crop:{'zh-CN':'裁切','zh-HK':'裁切',en:'Crop'},adjust:{'zh-CN':'调色','zh-HK':'調色',en:'Adjust'},export:{'zh-CN':'导出','zh-HK':'導出',en:'Export'},ocr:{'zh-CN':'OCR','zh-HK':'OCR',en:'OCR'},
    open:{'zh-CN':'打开图片','zh-HK':'打開圖片',en:'Open image'},reset:{'zh-CN':'重置','zh-HK':'重置',en:'Reset'},original:{'zh-CN':'原图','zh-HK':'原圖',en:'Original'},preview:{'zh-CN':'预览','zh-HK':'預覽',en:'Preview'},waiting:{'zh-CN':'等待图片导入','zh-HK':'等待圖片導入',en:'Waiting for image'},ready:{'zh-CN':'已载入','zh-HK':'已載入',en:'Loaded'},
    width:{'zh-CN':'宽度','zh-HK':'寬度',en:'Width'},height:{'zh-CN':'高度','zh-HK':'高度',en:'Height'},download:{'zh-CN':'下载','zh-HK':'下載',en:'Download'},copy:{'zh-CN':'复制','zh-HK':'複製',en:'Copy'},full:{'zh-CN':'整张','zh-HK':'整張',en:'Full'},match:{'zh-CN':'导出尺寸跟随裁切','zh-HK':'導出尺寸跟隨裁切',en:'Match output to crop'},
    note:{'zh-CN':'裁切范围与导出尺寸已经分离，避免预览被压成细线。','zh-HK':'裁切範圍與導出尺寸已經分離，避免預覽被壓成細線。',en:'Crop area and output size are separated to avoid broken thin previews.'},
    drop:{'zh-CN':'拖放图片到这里，或 Ctrl+V 粘贴截图','zh-HK':'拖放圖片到這裡，或 Ctrl+V 貼上截圖',en:'Drop image here, or paste with Ctrl+V'}
  };
  function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';if(/^en/i.test(v))return 'en';return 'zh-HK';}
  function t(k){const l=lang();return TEXT[k]?.[l]||TEXT[k]?.['zh-HK']||k;}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function idOf(root){return root.closest('[data-card-id]')?.dataset.cardId||root.dataset.is4Id||'window-image';}
  function cardById(id){try{return activeWorkspace().cards.find(c=>String(c.id)===String(id));}catch(e){return null;}}
  function state(id){
    if(!SESS.has(id))SESS.set(id,{tool:'import',fileName:'',img:null,src:'',out:'',ow:0,oh:0,crop:{x:0,y:0,w:0,h:0},outW:0,outH:0,lock:true,format:'image/png',quality:.92,brightness:100,contrast:100,saturation:100,canvas:null});
    return SESS.get(id);
  }
  function style(){
    if(document.getElementById('windzxyImageStudioV4Style'))return;
    const s=document.createElement('style');s.id='windzxyImageStudioV4Style';s.textContent=`
.image-studio-v4{height:100%;min-height:520px;display:grid;grid-template-columns:76px minmax(0,1fr) 300px;grid-template-rows:64px minmax(0,1fr) 30px;gap:12px;padding:0;color:var(--ink);overflow:hidden}.is4-top{grid-column:1/4;border-radius:20px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:linear-gradient(135deg,rgba(255,255,255,.17),rgba(255,255,255,.07));border:1px solid rgba(255,255,255,.15)}.is4-brand{display:flex;align-items:center;gap:12px;min-width:0}.is4-logo{width:44px;height:44px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(135deg,#ffba62,#ff6d3d 55%,#7d65ff);box-shadow:0 12px 28px rgba(0,0,0,.25);font-weight:950;color:#221005}.is4-brand strong{display:block;font-size:18px}.is4-brand span{display:block;max-width:520px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted);font-size:12px}.is4-actions{display:flex;gap:8px}.is4-actions input{display:none}.is4-btn,.is4-actions button,.is4-panel button{border:0;border-radius:13px;background:rgba(255,255,255,.14);color:var(--ink);padding:9px 12px;font-weight:850;cursor:pointer}.is4-btn.primary,.is4-actions .primary,.is4-panel .primary{background:linear-gradient(135deg,#ffbd62,#ff7b3d);color:#201005}.is4-btn:disabled,.is4-actions button:disabled,.is4-panel button:disabled{opacity:.45;cursor:not-allowed}.is4-rail{display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:22px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);overflow:auto}.is4-rail button{min-height:58px;border-radius:16px;border:0;background:rgba(255,255,255,.10);color:var(--ink);font-size:10px;font-weight:850;cursor:pointer}.is4-rail button b{display:block;font-size:19px}.is4-rail button.on{background:linear-gradient(135deg,rgba(255,189,98,.95),rgba(255,123,61,.82));color:#201005}.is4-stage{min-width:0;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:12px}.is4-pane{min-width:0;min-height:0;border-radius:24px;overflow:hidden;display:grid;grid-template-rows:38px minmax(0,1fr);background:rgba(5,9,20,.34);border:1px solid rgba(255,255,255,.15)}.is4-pane h4{margin:0;padding:10px 14px;display:flex;justify-content:space-between;color:var(--muted);font-size:12px}.is4-canvas{position:relative;min-height:0;display:grid;place-items:center;padding:14px;background-color:#151a24;background-image:linear-gradient(45deg,rgba(255,255,255,.05) 25%,transparent 25%),linear-gradient(-45deg,rgba(255,255,255,.05) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,rgba(255,255,255,.05) 75%),linear-gradient(-45deg,transparent 75%,rgba(255,255,255,.05) 75%);background-size:22px 22px;background-position:0 0,0 11px,11px -11px,-11px 0}.is4-canvas img{max-width:100%;max-height:100%;object-fit:contain;border-radius:14px;box-shadow:0 14px 32px rgba(0,0,0,.34)}.is4-empty{width:min(94%,440px);min-height:220px;border-radius:24px;border:1.5px dashed rgba(255,255,255,.28);display:grid;place-items:center;text-align:center;padding:22px;color:var(--muted);background:rgba(255,255,255,.06)}.is4-empty b{display:block;color:var(--ink);font-size:17px;margin-bottom:6px}.is4-panel{min-width:0;min-height:0;border-radius:24px;padding:14px;background:rgba(255,255,255,.105);border:1px solid rgba(255,255,255,.15);overflow:auto}.is4-panel h3{margin:0 0 5px;font-size:16px}.is4-panel p{margin:0 0 12px;color:var(--muted);font-size:12px;line-height:1.5}.is4-field{display:grid;gap:6px;margin:9px 0;color:var(--muted);font-size:11px}.is4-field input,.is4-field select{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.18);border-radius:13px;background:rgba(0,0,0,.22);color:var(--ink);padding:9px}.is4-row{display:grid;grid-template-columns:1fr 1fr;gap:9px}.is4-check{display:flex;align-items:center;gap:8px;margin:8px 0 12px;font-size:12px}.is4-chips{display:flex;flex-wrap:wrap;gap:7px;margin:9px 0}.is4-chips button{padding:8px 10px;border-radius:999px}.is4-footer{grid-column:1/4;color:var(--muted);font-size:11px;display:flex;justify-content:space-between;gap:12px;padding:0 4px}.image-studio-v4.is-compact{grid-template-columns:62px minmax(0,1fr);grid-template-rows:64px minmax(0,1fr) auto 28px}.image-studio-v4.is-compact .is4-top{grid-column:1/3}.image-studio-v4.is-compact .is4-panel{grid-column:1/3;grid-row:3;max-height:240px}.image-studio-v4.is-compact .is4-footer{grid-column:1/3}.image-studio-v4.is-tiny{grid-template-columns:1fr;grid-template-rows:auto auto minmax(0,1fr) auto auto}.image-studio-v4.is-tiny .is4-top,.image-studio-v4.is-tiny .is4-panel,.image-studio-v4.is-tiny .is4-footer{grid-column:1}.image-studio-v4.is-tiny .is4-rail{grid-row:2;flex-direction:row;min-height:58px}.image-studio-v4.is-tiny .is4-stage{grid-row:3;grid-template-columns:1fr}.image-studio-v4.is-tiny .is4-brand span{display:none}@media(max-width:850px){.image-studio-v4{grid-template-columns:1fr;grid-template-rows:auto auto minmax(0,1fr) auto auto}.image-studio-v4 .is4-top,.image-studio-v4 .is4-panel,.image-studio-v4 .is4-footer{grid-column:1}.image-studio-v4 .is4-rail{grid-row:2;flex-direction:row;min-height:58px}.image-studio-v4 .is4-stage{grid-row:3;grid-template-columns:1fr}}
`;document.head.appendChild(s);
  }
  function render(card={}){
    const id=String(card.id||'window-image');const s=state(id);const has=!!s.img;const compact=(card.w||DEFAULT_W)<820;const tiny=(card.w||DEFAULT_W)<620||(card.h||DEFAULT_H)<560;
    return `<div class="image-studio-v4 ${compact?'is-compact':''} ${tiny?'is-tiny':''}" data-is4-root data-is4-id="${esc(id)}" data-version="${VER}">
      <header class="is4-top"><div class="is4-brand"><div class="is4-logo">◎</div><div><strong>${t('title')}</strong><span>${has?esc(s.fileName)+' · '+s.ow+'×'+s.oh:t('desc')}</span></div></div><div class="is4-actions"><input data-is4-file type="file" accept="image/*"><button class="primary" data-is4-open>${t('open')}</button><button data-is4-reset ${has?'':'disabled'}>${t('reset')}</button></div></header>
      <nav class="is4-rail">${tool('import','⬆',s)}${tool('resize','↕',s)}${tool('crop','⌗',s)}${tool('adjust','◐',s)}${tool('export','⇩',s)}${tool('ocr','T',s)}</nav>
      <main class="is4-stage"><section class="is4-pane"><h4><span>${t('original')}</span><em>${has?s.ow+'×'+s.oh:'—'}</em></h4><div class="is4-canvas" data-is4-drop data-is4-original>${has?`<img src="${esc(s.src)}" alt="${t('original')}">`:`<div class="is4-empty"><div><b>${t('waiting')}</b><span>${t('drop')}</span></div></div>`}</div></section><section class="is4-pane"><h4><span>${t('preview')}</span><em>${has?s.outW+'×'+s.outH:'—'}</em></h4><div class="is4-canvas" data-is4-drop>${has?`<img src="${esc(s.out||s.src)}" alt="${t('preview')}">`:`<div class="is4-empty"><div><b>${t('waiting')}</b><span>${t('drop')}</span></div></div>`}</div></section></main>
      <aside class="is4-panel">${panel(s)}</aside><footer class="is4-footer"><span>${has?t('ready'):t('waiting')}</span><span>Image Studio V4 · ${VER}</span></footer>
    </div>`;
  }
  function tool(k,icon,s){return `<button type="button" data-is4-tool="${k}" class="${s.tool===k?'on':''}"><b>${icon}</b><span>${t(k)}</span></button>`;}
  function panel(s){const dis=s.img?'':'disabled';
    if(s.tool==='import')return `<h3>${t('import')}</h3><p>${t('drop')}</p><p>${t('note')}</p>`;
    if(s.tool==='resize')return `<h3>${t('resize')}</h3><p>${t('note')}</p><div class="is4-row"><label class="is4-field">${t('width')}<input data-is4-out-w type="number" min="1" value="${s.outW||''}" ${dis}></label><label class="is4-field">${t('height')}<input data-is4-out-h type="number" min="1" value="${s.outH||''}" ${dis}></label></div><label class="is4-check"><input data-is4-lock type="checkbox" ${s.lock?'checked':''}>Lock ratio</label><div class="is4-chips"><button data-is4-size="crop" ${dis}>Crop size</button><button data-is4-size="1x" ${dis}>1×</button><button data-is4-size="2x" ${dis}>2×</button><button data-is4-size="1920x1080" ${dis}>1080p</button><button data-is4-size="2560x1440" ${dis}>2K</button><button data-is4-size="3840x2160" ${dis}>4K</button></div>`;
    if(s.tool==='crop')return `<h3>${t('crop')}</h3><p>${t('note')}</p><div class="is4-chips"><button data-is4-ratio="full" ${dis}>${t('full')}</button><button data-is4-ratio="1:1" ${dis}>1:1</button><button data-is4-ratio="4:3" ${dis}>4:3</button><button data-is4-ratio="16:9" ${dis}>16:9</button><button data-is4-ratio="9:16" ${dis}>9:16</button></div><div class="is4-row"><label class="is4-field">X<input data-is4-cx type="number" min="0" value="${Math.round(s.crop.x||0)}" ${dis}></label><label class="is4-field">Y<input data-is4-cy type="number" min="0" value="${Math.round(s.crop.y||0)}" ${dis}></label></div><div class="is4-row"><label class="is4-field">W<input data-is4-cw type="number" min="${MIN_CROP}" value="${Math.round(s.crop.w||0)}" ${dis}></label><label class="is4-field">H<input data-is4-ch type="number" min="${MIN_CROP}" value="${Math.round(s.crop.h||0)}" ${dis}></label></div><div class="is4-chips"><button data-is4-match ${dis}>${t('match')}</button></div>`;
    if(s.tool==='adjust')return `<h3>${t('adjust')}</h3>${range('brightness','Brightness',s.brightness,0,200,dis)}${range('contrast','Contrast',s.contrast,0,200,dis)}${range('saturation','Saturation',s.saturation,0,200,dis)}`;
    if(s.tool==='export')return `<h3>${t('export')}</h3><label class="is4-field">Format<select data-is4-format ${dis}><option value="image/png" ${s.format==='image/png'?'selected':''}>PNG</option><option value="image/jpeg" ${s.format==='image/jpeg'?'selected':''}>JPG</option><option value="image/webp" ${s.format==='image/webp'?'selected':''}>WebP</option></select></label><label class="is4-field">Quality<input data-is4-quality type="range" min="40" max="100" value="${Math.round(s.quality*100)}" ${dis}></label><div class="is4-chips"><button class="primary" data-is4-download ${dis}>${t('download')}</button><button data-is4-copy ${dis}>${t('copy')}</button></div>`;
    return `<h3>OCR</h3><p>OCR 入口保留；本輪先修穩定性、裁切和輸出。</p>`;
  }
  function range(k,label,v,min,max,dis){return `<label class="is4-field">${label}<input data-is4-${k} type="range" min="${min}" max="${max}" value="${v}" ${dis}></label>`;}
  function ensureCrop(s){
    if(!s.img)return;
    const minW=Math.min(MIN_CROP,s.ow),minH=Math.min(MIN_CROP,s.oh);
    if(!s.crop||!isFinite(s.crop.w)||!isFinite(s.crop.h)||s.crop.w<minW||s.crop.h<minH)s.crop={x:0,y:0,w:s.ow,h:s.oh};
    s.crop.w=Math.max(minW,Math.min(s.ow,Math.round(s.crop.w)));
    s.crop.h=Math.max(minH,Math.min(s.oh,Math.round(s.crop.h)));
    s.crop.x=Math.max(0,Math.min(s.ow-s.crop.w,Math.round(s.crop.x||0)));
    s.crop.y=Math.max(0,Math.min(s.oh-s.crop.h,Math.round(s.crop.y||0)));
    s.outW=Math.max(1,Math.round(s.outW||s.crop.w));
    s.outH=Math.max(1,Math.round(s.outH||s.crop.h));
  }
  async function draw(s){
    if(!s.img)return;ensureCrop(s);
    const c=document.createElement('canvas');c.width=Math.max(1,s.outW);c.height=Math.max(1,s.outH);
    const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.filter=`brightness(${s.brightness}%) contrast(${s.contrast}%) saturate(${s.saturation}%)`;
    ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(s.img,s.crop.x,s.crop.y,s.crop.w,s.crop.h,0,0,c.width,c.height);
    s.canvas=c;s.out=c.toDataURL(s.format,s.quality);
  }
  function setRatio(s,ratio){
    if(!s.img)return;
    if(ratio==='full'){s.crop={x:0,y:0,w:s.ow,h:s.oh};return;}
    const [a,b]=String(ratio).split(':').map(Number);if(!a||!b)return;
    const target=a/b;let w=s.ow,h=s.oh;
    if(s.ow/s.oh>target){h=s.oh;w=Math.round(h*target);}else{w=s.ow;h=Math.round(w/target);}
    s.crop={x:Math.round((s.ow-w)/2),y:Math.round((s.oh-h)/2),w,h};ensureCrop(s);
  }
  function setPreset(s,p){
    if(p==='crop'){s.outW=s.crop.w;s.outH=s.crop.h;return;}
    if(p==='1x'){s.outW=s.crop.w;s.outH=s.crop.h;return;}
    if(p==='2x'){s.outW=s.crop.w*2;s.outH=s.crop.h*2;return;}
    const [w,h]=String(p).split('x').map(Number);if(w&&h){s.outW=w;s.outH=h;}
  }
  function rerender(root){const c=cardById(idOf(root))||{id:idOf(root),w:DEFAULT_W,h:DEFAULT_H};root.outerHTML=render(c);}
  async function refresh(root){const s=state(idOf(root));await draw(s);rerender(root);}
  function loadFile(root,file){if(!file||!/^image\//.test(file.type||''))return;const id=idOf(root),s=state(id),r=new FileReader();r.onload=()=>{const img=new Image();img.onload=async()=>{Object.assign(s,{img,src:r.result,fileName:file.name||'image',ow:img.naturalWidth,oh:img.naturalHeight,crop:{x:0,y:0,w:img.naturalWidth,h:img.naturalHeight},outW:img.naturalWidth,outH:img.naturalHeight,tool:'resize',brightness:100,contrast:100,saturation:100,format:'image/png',quality:.92});await draw(s);const card=cardById(id);if(card){card.w=Math.max(card.w||0,DEFAULT_W);card.h=Math.max(card.h||0,DEFAULT_H);try{save();renderAll();return;}catch(e){}}rerender(root);};img.src=r.result;};r.readAsDataURL(file);}
  function reset(s){if(!s.img)return;Object.assign(s,{crop:{x:0,y:0,w:s.ow,h:s.oh},outW:s.ow,outH:s.oh,brightness:100,contrast:100,saturation:100,format:'image/png',quality:.92});}
  function download(s){if(!s.canvas)return;const ext=s.format==='image/jpeg'?'jpg':s.format.split('/')[1]||'png';s.canvas.toBlob(blob=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(s.fileName||'image').replace(/\.[^.]+$/,'')+'-edited.'+ext;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);},s.format,s.quality);}
  function copy(s){if(!s.canvas||!navigator.clipboard||!window.ClipboardItem){download(s);return;}s.canvas.toBlob(async b=>{try{await navigator.clipboard.write([new ClipboardItem({[b.type]:b})]);}catch(e){download(s);}},'image/png');}
  function bind(){if(window.__windzxyImageStudioV4Events)return;window.__windzxyImageStudioV4Events=1;
    document.addEventListener('click',e=>{const root=e.target.closest('[data-is4-root]');if(!root)return;const s=state(idOf(root));const q=sel=>e.target.closest(sel);if(q('[data-is4-open]')){e.stopPropagation();root.querySelector('[data-is4-file]')?.click();return;}const tool=q('[data-is4-tool]');if(tool){e.stopPropagation();s.tool=tool.dataset.is4Tool;rerender(root);return;}if(q('[data-is4-reset]')){e.stopPropagation();reset(s);refresh(root);return;}const ratio=q('[data-is4-ratio]');if(ratio){e.stopPropagation();setRatio(s,ratio.dataset.is4Ratio);refresh(root);return;}const size=q('[data-is4-size]');if(size){e.stopPropagation();setPreset(s,size.dataset.is4Size);refresh(root);return;}if(q('[data-is4-match]')){e.stopPropagation();s.outW=s.crop.w;s.outH=s.crop.h;refresh(root);return;}if(q('[data-is4-download]')){e.stopPropagation();download(s);return;}if(q('[data-is4-copy]')){e.stopPropagation();copy(s);return;}},true);
    document.addEventListener('change',e=>{const root=e.target.closest('[data-is4-root]');if(!root)return;const s=state(idOf(root));if(e.target.matches('[data-is4-file]'))loadFile(root,e.target.files?.[0]);if(e.target.matches('[data-is4-format]')){s.format=e.target.value;refresh(root);}},true);
    document.addEventListener('input',e=>{const root=e.target.closest('[data-is4-root]');if(!root)return;const s=state(idOf(root));if(!s.img)return;let changed=false;if(e.target.matches('[data-is4-out-w]')){s.outW=Math.max(1,+e.target.value||s.outW);if(s.lock)s.outH=Math.max(1,Math.round(s.outW*s.crop.h/s.crop.w));changed=true;}if(e.target.matches('[data-is4-out-h]')){s.outH=Math.max(1,+e.target.value||s.outH);if(s.lock)s.outW=Math.max(1,Math.round(s.outH*s.crop.w/s.crop.h));changed=true;}if(e.target.matches('[data-is4-lock]'))s.lock=e.target.checked;['brightness','contrast','saturation'].forEach(k=>{if(e.target.matches('[data-is4-'+k+']')){s[k]=+e.target.value||100;changed=true;}});if(e.target.matches('[data-is4-quality]')){s.quality=(+e.target.value||92)/100;changed=true;}if(e.target.matches('[data-is4-cx],[data-is4-cy],[data-is4-cw],[data-is4-ch]')){s.crop.x=+root.querySelector('[data-is4-cx]')?.value||0;s.crop.y=+root.querySelector('[data-is4-cy]')?.value||0;s.crop.w=+root.querySelector('[data-is4-cw]')?.value||s.crop.w;s.crop.h=+root.querySelector('[data-is4-ch]')?.value||s.crop.h;ensureCrop(s);changed=true;}if(changed)refresh(root);},true);
    document.addEventListener('dragover',e=>{if(e.target.closest('[data-is4-drop]'))e.preventDefault();},true);
    document.addEventListener('drop',e=>{const box=e.target.closest('[data-is4-drop]');if(!box)return;e.preventDefault();const root=box.closest('[data-is4-root]');const file=[...(e.dataTransfer?.files||[])].find(f=>/^image\//.test(f.type));if(file)loadFile(root,file);},true);
    document.addEventListener('paste',e=>{const root=document.querySelector('[data-is4-root]');if(!root)return;const file=[...(e.clipboardData?.files||[])].find(f=>/^image\//.test(f.type));if(file)loadFile(root,file);},true);
    document.addEventListener('pointerdown',e=>{const root=e.target.closest('[data-is4-root]');if(!root)return;const s=state(idOf(root));if(!s.img||s.tool!=='crop')return;const pane=e.target.closest('[data-is4-original]');const imgEl=pane?.querySelector('img');if(!imgEl)return;e.preventDefault();e.stopPropagation();const r=imgEl.getBoundingClientRect();const p0={x:e.clientX,y:e.clientY};const toImg=p=>({x:Math.max(0,Math.min(s.ow,Math.round((p.x-r.left)*s.ow/r.width))),y:Math.max(0,Math.min(s.oh,Math.round((p.y-r.top)*s.oh/r.height)))});const start=toImg(p0);const move=ev=>{const now=toImg({x:ev.clientX,y:ev.clientY});s.crop={x:Math.min(start.x,now.x),y:Math.min(start.y,now.y),w:Math.abs(now.x-start.x),h:Math.abs(now.y-start.y)};ensureCrop(s);};const up=ev=>{move(ev);window.removeEventListener('pointermove',move,true);refresh(root);};window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,{once:true,capture:true});},true);
  }
  function install(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'||typeof bodyHtml==='undefined'){setTimeout(install,80);return;}
    style();bind();
    const meta={title:t('title'),desc:t('desc'),icon:'◎',tone:'t-image'};const a=apps.find(x=>x.id===APP);if(a)Object.assign(a,meta,{kind:'tool'});else apps.unshift({id:APP,kind:'tool',...meta});
    if(!window.__windzxyImageStudioV4BodyPatched){window.__windzxyImageStudioV4BodyPatched=1;const old=bodyHtml;bodyHtml=function(card,info){return card&&card.appId===APP?render(card):old.apply(this,arguments);};}
    if(typeof appContent==='function'&&!window.__windzxyImageStudioV4AppPatched){window.__windzxyImageStudioV4AppPatched=1;const old=appContent;appContent=function(appId){return appId===APP?render({id:'window-image',w:DEFAULT_W,h:DEFAULT_H}):old.apply(this,arguments);};}
    if(typeof preferredCardSize==='function'&&!window.__windzxyImageStudioV4SizePatched){window.__windzxyImageStudioV4SizePatched=1;const old=preferredCardSize;preferredCardSize=function(appId,w,h){if(appId===APP)return {w:Math.max(w||0,DEFAULT_W),h:Math.max(h||0,DEFAULT_H)};return old.apply(this,arguments);};}
    try{workspaces.forEach(ws=>(ws.cards||[]).forEach(c=>{if(c.appId===APP){c.w=Math.max(c.w||0,DEFAULT_W);c.h=Math.max(c.h||0,DEFAULT_H);}}));save();}catch(e){}
    try{renderAll();}catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.windzxyImageStudioV4Version=VER;
})();