(function(){
  if(window.__windzxyImageStudioV2Loaded)return;
  window.__windzxyImageStudioV2Loaded=1;

  const APP='image';
  const VER='20260827-image-studio-v2-product-workflow';
  const sessions=new Map();
  const DEFAULT_W=760,DEFAULT_H=560,MIN_W=430,MIN_H=390;
  const I18N={
    title:{'zh-CN':'图片工作室','zh-HK':'圖片工作室',en:'Image Studio'},
    desc:{'zh-CN':'导入、裁切、调色、尺寸、压缩与导出。','zh-HK':'導入、裁切、調色、尺寸、壓縮與導出。',en:'Import, crop, tune, resize, compress and export.'},
    open:{'zh-CN':'打开图片','zh-HK':'打開圖片',en:'Open image'},
    paste:{'zh-CN':'支持拖放 / Ctrl+V 粘贴','zh-HK':'支援拖放 / Ctrl+V 貼上',en:'Drop or paste with Ctrl+V'},
    empty:{'zh-CN':'拖入图片，或点击打开','zh-HK':'拖入圖片，或點擊打開',en:'Drop an image, or click Open'},
    original:{'zh-CN':'原图','zh-HK':'原圖',en:'Original'},
    preview:{'zh-CN':'预览','zh-HK':'預覽',en:'Preview'},
    source:{'zh-CN':'导入','zh-HK':'導入',en:'Source'},
    resize:{'zh-CN':'尺寸','zh-HK':'尺寸',en:'Resize'},
    crop:{'zh-CN':'裁切','zh-HK':'裁切',en:'Crop'},
    adjust:{'zh-CN':'调色','zh-HK':'調色',en:'Adjust'},
    export:{'zh-CN':'导出','zh-HK':'導出',en:'Export'},
    ocr:{'zh-CN':'OCR','zh-HK':'OCR',en:'OCR'},
    width:{'zh-CN':'宽度','zh-HK':'寬度',en:'Width'},
    height:{'zh-CN':'高度','zh-HK':'高度',en:'Height'},
    lock:{'zh-CN':'锁定比例','zh-HK':'鎖定比例',en:'Lock ratio'},
    reset:{'zh-CN':'重置','zh-HK':'重置',en:'Reset'},
    fit:{'zh-CN':'适合预览','zh-HK':'適合預覽',en:'Fit preview'},
    download:{'zh-CN':'下载','zh-HK':'下載',en:'Download'},
    copy:{'zh-CN':'复制图片','zh-HK':'複製圖片',en:'Copy image'},
    statusReady:{'zh-CN':'已载入图片。选择工具并实时预览。','zh-HK':'已載入圖片。選擇工具並即時預覽。',en:'Image loaded. Choose a tool and preview live.'},
    statusEmpty:{'zh-CN':'等待图片导入。','zh-HK':'等待圖片導入。',en:'Waiting for image.'},
    ocrNote:{'zh-CN':'OCR 入口已整理，文字识别服务稍后接入。','zh-HK':'OCR 入口已整理，文字識別服務稍後接入。',en:'OCR panel is ready; recognition service will be connected later.'}
  };

  function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';if(/^en/i.test(v))return 'en';return 'zh-HK';}
  function t(k){const lc=lang();return I18N[k]?.[lc]||I18N[k]?.['zh-HK']||k;}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function appInfo(){return {title:t('title'),desc:t('desc'),icon:'◎',tone:'t-image'};}
  function cardId(el){return el.closest('[data-card-id]')?.dataset.cardId||'floating';}
  function getSession(id){
    if(!sessions.has(id))sessions.set(id,{tab:'source',img:null,fileName:'',sourceUrl:'',outUrl:'',ow:0,oh:0,w:0,h:0,lock:true,format:'image/png',quality:.92,brightness:100,contrast:100,saturation:100,crop:{x:0,y:0,w:1,h:1}});
    return sessions.get(id);
  }
  function cardFromId(id){try{return activeWorkspace().cards.find(c=>String(c.id)===String(id));}catch(e){return null;}}

  function installStyle(){
    if(document.getElementById('windzxyImageStudioV2Style'))return;
    const s=document.createElement('style');s.id='windzxyImageStudioV2Style';s.textContent=`
.image-studio-v2{height:100%;min-height:320px;display:grid;grid-template-rows:auto 1fr auto;gap:12px;color:var(--ink);overflow:hidden}
.isv-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 2px 0}
.isv-brand{display:flex;gap:10px;align-items:center;min-width:0}.isv-brand i{width:36px;height:36px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(255,255,255,.38),rgba(255,255,255,.08));box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);font-style:normal}.isv-brand strong{display:block;font-size:15px}.isv-brand span{display:block;font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px}
.isv-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.isv-actions button,.isv-btn{border:0;border-radius:12px;padding:8px 11px;background:rgba(255,255,255,.18);color:var(--ink);font-weight:800;cursor:pointer}.isv-actions button.primary,.isv-btn.primary{background:linear-gradient(135deg,#ffb347,#ff7a45);color:#23120b}.isv-actions button:disabled{opacity:.45;cursor:not-allowed}
.isv-body{min-height:0;display:grid;grid-template-columns:1fr 250px;gap:12px}.isv-stage{min-width:0;min-height:0;display:grid;grid-template-rows:1fr auto;gap:10px}.isv-compare{min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}.isv-pane{position:relative;min-height:0;border-radius:20px;border:1px solid rgba(255,255,255,.16);background:rgba(8,12,24,.26);overflow:hidden;display:grid;grid-template-rows:auto 1fr}.isv-pane h4{margin:0;padding:10px 12px;font-size:12px;color:var(--muted);display:flex;justify-content:space-between}.isv-canvas-box{position:relative;min-height:0;display:grid;place-items:center;padding:12px}.isv-canvas-box img{max-width:100%;max-height:100%;object-fit:contain;border-radius:12px;box-shadow:0 12px 28px rgba(0,0,0,.26)}
.isv-empty{height:100%;min-height:180px;display:grid;place-items:center;text-align:center;padding:22px;border-radius:16px;border:1px dashed rgba(255,255,255,.28);background:rgba(255,255,255,.06)}.isv-empty b{display:block;font-size:15px;margin-bottom:6px}.isv-empty span{font-size:12px;color:var(--muted)}
.isv-drop{outline:2px solid rgba(255,179,71,.85);outline-offset:-6px}.isv-tabs{display:flex;gap:7px;overflow:auto;padding-bottom:1px}.isv-tabs button{white-space:nowrap;border:0;border-radius:999px;padding:8px 11px;background:rgba(255,255,255,.13);color:var(--ink);cursor:pointer;font-weight:800}.isv-tabs button.on{background:rgba(255,179,71,.9);color:#211407}
.isv-panel{border-radius:20px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.10);padding:12px;overflow:auto;min-height:0}.isv-panel h4{margin:0 0 10px;font-size:13px}.isv-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:9px}.isv-row.one{grid-template-columns:1fr}.isv-field{display:grid;gap:5px;font-size:11px;color:var(--muted)}.isv-field input,.isv-field select{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.18);border-radius:11px;background:rgba(0,0,0,.22);color:var(--ink);padding:8px 9px}.isv-field input[type=range]{padding:0}.isv-check{display:flex;align-items:center;gap:8px;margin:6px 0 10px;font-size:12px}.isv-chipset{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px}.isv-chipset button{border:0;border-radius:999px;background:rgba(255,255,255,.14);color:var(--ink);padding:7px 10px;cursor:pointer;font-weight:700}.isv-chipset button:hover{background:rgba(255,255,255,.22)}
.isv-status{font-size:12px;color:var(--muted);display:flex;justify-content:space-between;gap:8px}.isv-crop-help{font-size:12px;color:var(--muted);line-height:1.5}.isv-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;color:var(--muted);min-height:16px}.isv-hidden{display:none!important}
.image-studio-v2.compact .isv-body{grid-template-columns:1fr}.image-studio-v2.compact .isv-compare{min-height:260px}.image-studio-v2.tiny .isv-compare{grid-template-columns:1fr}.image-studio-v2.tiny .isv-brand span{display:none}
@media(max-width:760px){.image-studio-v2 .isv-body{grid-template-columns:1fr}.image-studio-v2 .isv-compare{grid-template-columns:1fr}.image-studio-v2 .isv-top{align-items:flex-start;flex-direction:column}}
`;document.head.appendChild(s);
  }

  function render(card={}){
    const s=getSession(card.id||'floating');
    const compact=(card.w||DEFAULT_W)<650;
    const tiny=(card.w||DEFAULT_W)<520||(card.h||DEFAULT_H)<450;
    const has=!!s.img;
    return `<div class="image-studio-v2 ${compact?'compact':''} ${tiny?'tiny':''}" data-isv-root data-version="${E(VER)}">
      <header class="isv-top">
        <div class="isv-brand"><i>◎</i><div><strong>${t('title')}</strong><span>${has?E(s.fileName)+' · '+s.ow+'×'+s.oh:t('paste')}</span></div></div>
        <div class="isv-actions"><input class="isv-hidden" type="file" accept="image/*" data-isv-file><button class="primary" data-isv-open>${t('open')}</button><button data-isv-reset ${has?'':'disabled'}>${t('reset')}</button></div>
      </header>
      <section class="isv-body">
        <main class="isv-stage">
          <section class="isv-compare">
            <div class="isv-pane"><h4><span>${t('original')}</span><em>${has?s.ow+'×'+s.oh:'—'}</em></h4><div class="isv-canvas-box" data-isv-drop>${has?`<img src="${E(s.sourceUrl)}" alt="${t('original')}">`:`<div class="isv-empty"><div><b>${t('empty')}</b><span>${t('paste')}</span></div></div>`}</div></div>
            <div class="isv-pane"><h4><span>${t('preview')}</span><em data-isv-size>${has?s.w+'×'+s.h:'—'}</em></h4><div class="isv-canvas-box" data-isv-preview-box>${has?`<img data-isv-preview src="${E(s.outUrl||s.sourceUrl)}" alt="${t('preview')}">`:`<div class="isv-empty"><div><b>${t('preview')}</b><span>${t('statusEmpty')}</span></div></div>`}</div></div>
          </section>
          <nav class="isv-tabs">${['source','resize','crop','adjust','export','ocr'].map(k=>`<button data-isv-tab="${k}" class="${s.tab===k?'on':''}">${t(k)}</button>`).join('')}</nav>
        </main>
        <aside class="isv-panel" data-isv-panel>${panelHtml(s)}</aside>
      </section>
      <footer class="isv-footer"><span data-isv-status>${has?t('statusReady'):t('statusEmpty')}</span><span>Image Studio V2</span></footer>
    </div>`;
  }
  function panelHtml(s){
    const disabled=s.img?'':'disabled';
    if(s.tab==='source')return `<h4>${t('source')}</h4><div class="isv-empty"><div><b>${t('empty')}</b><span>${t('paste')}</span></div></div>`;
    if(s.tab==='resize')return `<h4>${t('resize')}</h4><div class="isv-chipset"><button data-isv-preset="1x" ${disabled}>1×</button><button data-isv-preset="2x" ${disabled}>2×</button><button data-isv-preset="1920x1080" ${disabled}>1080p</button><button data-isv-preset="2560x1440" ${disabled}>2K</button><button data-isv-preset="3840x2160" ${disabled}>4K</button><button data-isv-preset="7680x4320" ${disabled}>8K</button></div><div class="isv-row"><label class="isv-field">${t('width')}<input data-isv-width type="number" min="1" value="${s.w||''}" ${disabled}></label><label class="isv-field">${t('height')}<input data-isv-height type="number" min="1" value="${s.h||''}" ${disabled}></label></div><label class="isv-check"><input data-isv-lock type="checkbox" ${s.lock?'checked':''}>${t('lock')}</label>`;
    if(s.tab==='crop')return `<h4>${t('crop')}</h4><div class="isv-chipset"><button data-isv-crop="free" ${disabled}>Free</button><button data-isv-crop="1:1" ${disabled}>1:1</button><button data-isv-crop="4:3" ${disabled}>4:3</button><button data-isv-crop="16:9" ${disabled}>16:9</button><button data-isv-crop="reset" ${disabled}>${t('reset')}</button></div><p class="isv-crop-help">在右側預覽區拖曳即可框選裁切範圍。裁切後會即時更新輸出尺寸。</p><div class="isv-row"><label class="isv-field">X %<input data-isv-crop-x type="number" min="0" max="100" value="${Math.round(s.crop.x*100)}" ${disabled}></label><label class="isv-field">Y %<input data-isv-crop-y type="number" min="0" max="100" value="${Math.round(s.crop.y*100)}" ${disabled}></label></div><div class="isv-row"><label class="isv-field">W %<input data-isv-crop-w type="number" min="1" max="100" value="${Math.round(s.crop.w*100)}" ${disabled}></label><label class="isv-field">H %<input data-isv-crop-h type="number" min="1" max="100" value="${Math.round(s.crop.h*100)}" ${disabled}></label></div>`;
    if(s.tab==='adjust')return `<h4>${t('adjust')}</h4>${slider('brightness','Brightness',s.brightness,0,200,disabled)}${slider('contrast','Contrast',s.contrast,0,200,disabled)}${slider('saturation','Saturation',s.saturation,0,200,disabled)}`;
    if(s.tab==='export')return `<h4>${t('export')}</h4><div class="isv-row"><label class="isv-field">Format<select data-isv-format ${disabled}><option value="image/png" ${s.format==='image/png'?'selected':''}>PNG</option><option value="image/jpeg" ${s.format==='image/jpeg'?'selected':''}>JPG</option><option value="image/webp" ${s.format==='image/webp'?'selected':''}>WEBP</option></select></label><label class="isv-field">Quality<input data-isv-quality type="range" min="40" max="100" value="${Math.round(s.quality*100)}" ${disabled}></label></div><div class="isv-chipset"><button class="isv-btn primary" data-isv-download ${disabled}>${t('download')}</button><button data-isv-copy ${disabled}>${t('copy')}</button></div>`;
    return `<h4>${t('ocr')}</h4><p class="isv-crop-help">${t('ocrNote')}</p><div class="isv-empty"><div><b>OCR</b><span>${t('ocrNote')}</span></div></div>`;
  }
  function slider(key,label,val,min,max,disabled){return `<label class="isv-field">${label}<input data-isv-${key} type="range" min="${min}" max="${max}" value="${val}" ${disabled}></label>`;}

  function patch(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'||typeof bodyHtml==='undefined'){setTimeout(patch,80);return;}
    installStyle();
    const meta=appInfo();
    const app=apps.find(a=>a.id===APP); if(app)Object.assign(app,meta); else apps.unshift({id:APP,kind:'tool',...meta});
    if(!window.__windzxyImageStudioBodyPatched){
      window.__windzxyImageStudioBodyPatched=1;
      const oldBody=bodyHtml;
      bodyHtml=function(card,info){return card&&card.appId===APP?render(card):oldBody.apply(this,arguments);};
    }
    if(typeof preferredCardSize==='function'&&!window.__windzxyImageStudioSizePatched){
      window.__windzxyImageStudioSizePatched=1;
      const oldSize=preferredCardSize;
      preferredCardSize=function(appId,w,h){if(appId===APP)return {w:Math.max(w||0,DEFAULT_W),h:Math.max(h||0,DEFAULT_H)};return oldSize.apply(this,arguments);};
    }
    try{workspaces.forEach(ws=>(ws.cards||[]).forEach(c=>{if(c.appId===APP){c.w=Math.max(c.w||0,MIN_W);c.h=Math.max(c.h||0,MIN_H);}}));}catch(e){}
    try{renderAll();}catch(e){bindAll();}
    bindAll();
  }

  function bindAll(){
    if(window.__windzxyImageStudioEventsBound)return;
    window.__windzxyImageStudioEventsBound=1;
    document.addEventListener('click',onClick,true);
    document.addEventListener('change',onChange,true);
    document.addEventListener('input',onInput,true);
    document.addEventListener('dragover',e=>{const z=e.target.closest('[data-isv-drop]');if(z){e.preventDefault();z.classList.add('isv-drop');}},true);
    document.addEventListener('dragleave',e=>{const z=e.target.closest('[data-isv-drop]');if(z)z.classList.remove('isv-drop');},true);
    document.addEventListener('drop',e=>{const z=e.target.closest('[data-isv-drop]');if(!z)return;e.preventDefault();z.classList.remove('isv-drop');const file=[...(e.dataTransfer?.files||[])].find(f=>/^image\//.test(f.type));if(file)loadFile(z.closest('[data-isv-root]'),file);},true);
    document.addEventListener('paste',e=>{const root=document.querySelector('[data-isv-root]');if(!root)return;const file=[...(e.clipboardData?.files||[])].find(f=>/^image\//.test(f.type));if(file)loadFile(root,file);},true);
    document.addEventListener('pointerdown',onPointerDown,true);
  }
  function rerender(root){const id=cardId(root);const card=cardFromId(id)||{id,w:DEFAULT_W,h:DEFAULT_H};root.outerHTML=render(card);}
  function refresh(root){const id=cardId(root),s=getSession(id);renderOutput(s).then(()=>{const card=cardFromId(id)||{id,w:DEFAULT_W,h:DEFAULT_H};root.outerHTML=render(card);}).catch(err=>{console.warn(err);});}
  function onClick(e){
    const root=e.target.closest('[data-isv-root]'); if(!root)return;
    const id=cardId(root),s=getSession(id);
    const open=e.target.closest('[data-isv-open]'); if(open){e.stopPropagation();root.querySelector('[data-isv-file]')?.click();return;}
    const tab=e.target.closest('[data-isv-tab]'); if(tab){e.stopPropagation();s.tab=tab.dataset.isvTab;rerender(root);return;}
    const preset=e.target.closest('[data-isv-preset]'); if(preset&&s.img){e.stopPropagation();applyPreset(s,preset.dataset.isvPreset);refresh(root);return;}
    const crop=e.target.closest('[data-isv-crop]'); if(crop&&s.img){e.stopPropagation();applyCropPreset(s,crop.dataset.isvCrop);refresh(root);return;}
    const reset=e.target.closest('[data-isv-reset]'); if(reset){e.stopPropagation();resetSession(s);refresh(root);return;}
    const dl=e.target.closest('[data-isv-download]'); if(dl&&s.img){e.stopPropagation();download(s);return;}
    const cp=e.target.closest('[data-isv-copy]'); if(cp&&s.img){e.stopPropagation();copyImage(s);return;}
  }
  function onChange(e){const root=e.target.closest('[data-isv-root]');if(!root)return;const f=e.target.matches('[data-isv-file]')&&e.target.files&&e.target.files[0];if(f)loadFile(root,f);}
  function onInput(e){
    const root=e.target.closest('[data-isv-root]'); if(!root)return;const s=getSession(cardId(root)); if(!s.img)return;
    if(e.target.matches('[data-isv-width]')){const w=Math.max(1,+e.target.value||s.w);s.w=w;if(s.lock)s.h=Math.max(1,Math.round(w*(s.oh*s.crop.h)/(s.ow*s.crop.w)));refresh(root);}
    if(e.target.matches('[data-isv-height]')){const h=Math.max(1,+e.target.value||s.h);s.h=h;if(s.lock)s.w=Math.max(1,Math.round(h*(s.ow*s.crop.w)/(s.oh*s.crop.h)));refresh(root);}
    if(e.target.matches('[data-isv-lock]'))s.lock=e.target.checked;
    ['brightness','contrast','saturation'].forEach(k=>{if(e.target.matches('[data-isv-'+k+']')){s[k]=+e.target.value||100;refresh(root);}});
    if(e.target.matches('[data-isv-format]')){s.format=e.target.value;refresh(root);} if(e.target.matches('[data-isv-quality]')){s.quality=(+e.target.value||92)/100;refresh(root);}
    if(e.target.matches('[data-isv-crop-x],[data-isv-crop-y],[data-isv-crop-w],[data-isv-crop-h]')){s.crop.x=(+root.querySelector('[data-isv-crop-x]')?.value||0)/100;s.crop.y=(+root.querySelector('[data-isv-crop-y]')?.value||0)/100;s.crop.w=(+root.querySelector('[data-isv-crop-w]')?.value||100)/100;s.crop.h=(+root.querySelector('[data-isv-crop-h]')?.value||100)/100;clampCrop(s);syncOutputSize(s);refresh(root);}
  }
  function onPointerDown(e){
    const root=e.target.closest('[data-isv-root]'); if(!root)return;const s=getSession(cardId(root)); if(!s.img||s.tab!=='crop')return;
    const box=e.target.closest('[data-isv-preview-box]'); if(!box)return; const img=box.querySelector('img'); if(!img)return;
    e.preventDefault(); e.stopPropagation();
    const rect=img.getBoundingClientRect(); const start={x:e.clientX,y:e.clientY};
    const move=ev=>{const x1=(start.x-rect.left)/rect.width,y1=(start.y-rect.top)/rect.height,x2=(ev.clientX-rect.left)/rect.width,y2=(ev.clientY-rect.top)/rect.height;s.crop={x:Math.min(x1,x2),y:Math.min(y1,y2),w:Math.abs(x2-x1),h:Math.abs(y2-y1)};clampCrop(s);syncOutputSize(s);};
    const up=ev=>{move(ev);window.removeEventListener('pointermove',move,true);refresh(root);};
    window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,{once:true,capture:true});
  }

  function loadFile(root,file){
    if(!root||!file)return;const id=cardId(root),s=getSession(id);const reader=new FileReader();
    reader.onload=()=>{const img=new Image();img.onload=()=>{Object.assign(s,{img,fileName:file.name||'image',sourceUrl:reader.result,ow:img.naturalWidth,oh:img.naturalHeight,w:img.naturalWidth,h:img.naturalHeight,crop:{x:0,y:0,w:1,h:1},brightness:100,contrast:100,saturation:100,tab:'resize'});renderOutput(s).then(()=>{const card=cardFromId(id);if(card){card.w=Math.max(card.w||0,DEFAULT_W);card.h=Math.max(card.h||0,DEFAULT_H);try{save();renderAll();}catch(e){rerender(root);}}else rerender(root);});};img.src=reader.result;};reader.readAsDataURL(file);
  }
  function resetSession(s){if(!s.img)return;Object.assign(s,{w:s.ow,h:s.oh,crop:{x:0,y:0,w:1,h:1},brightness:100,contrast:100,saturation:100,format:'image/png',quality:.92});}
  function applyPreset(s,p){if(p==='1x'){s.w=s.ow;s.h=s.oh;}else if(p==='2x'){s.w=s.ow*2;s.h=s.oh*2;}else{const [w,h]=p.split('x').map(Number);s.w=w;s.h=h;}}
  function applyCropPreset(s,p){if(p==='reset'||p==='free'){s.crop={x:0,y:0,w:1,h:1};syncOutputSize(s);return;}const [a,b]=p.split(':').map(Number);const target=a/b,src=(s.ow/s.oh);if(src>target){const nw=target/src;s.crop={x:(1-nw)/2,y:0,w:nw,h:1};}else{const nh=src/target;s.crop={x:0,y:(1-nh)/2,w:1,h:nh};}syncOutputSize(s);}
  function clampCrop(s){s.crop.x=Math.max(0,Math.min(.99,s.crop.x));s.crop.y=Math.max(0,Math.min(.99,s.crop.y));s.crop.w=Math.max(.01,Math.min(1-s.crop.x,s.crop.w));s.crop.h=Math.max(.01,Math.min(1-s.crop.y,s.crop.h));}
  function syncOutputSize(s){s.w=Math.max(1,Math.round(s.ow*s.crop.w));s.h=Math.max(1,Math.round(s.oh*s.crop.h));}
  async function renderOutput(s){if(!s.img)return;const c=document.createElement('canvas');c.width=Math.max(1,Math.round(s.w));c.height=Math.max(1,Math.round(s.h));const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.filter=`brightness(${s.brightness}%) contrast(${s.contrast}%) saturate(${s.saturation}%)`;const sx=s.ow*s.crop.x,sy=s.oh*s.crop.y,sw=s.ow*s.crop.w,sh=s.oh*s.crop.h;ctx.drawImage(s.img,sx,sy,sw,sh,0,0,c.width,c.height);s.canvas=c;s.outUrl=c.toDataURL(s.format,s.quality);}
  function download(s){if(!s.canvas)return;const ext=s.format==='image/jpeg'?'jpg':s.format==='image/webp'?'webp':'png';s.canvas.toBlob(blob=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(s.fileName||'image').replace(/\.[^.]+$/,'')+'-edited.'+ext;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200);},s.format,s.quality);}
  async function copyImage(s){if(!s.canvas||!navigator.clipboard||!window.ClipboardItem){download(s);return;}s.canvas.toBlob(async blob=>{try{await navigator.clipboard.write([new ClipboardItem({[blob.type]:blob})]);}catch(e){download(s);}},'image/png');}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch,{once:true});else patch();
  window.windzxyImageStudioV2Version=VER;
})();
