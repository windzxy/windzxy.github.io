(function(){
  if(window.__windzxyImageStudioV3Loaded)return;
  window.__windzxyImageStudioV3Loaded=1;
  window.__windzxyImageStudioV2Loaded=1;

  const APP='image';
  const VER='20260827-image-studio-v3-studio-shell';
  const DEFAULT_W=900,DEFAULT_H=650,MIN_W=520,MIN_H=470;
  const sessions=new Map();
  const TEXT={
    title:{'zh-CN':'图片工作室','zh-HK':'圖片工作室',en:'Image Studio'},
    desc:{'zh-CN':'图片导入、对比预览、裁切、调色、尺寸与导出。','zh-HK':'圖片導入、對比預覽、裁切、調色、尺寸與導出。',en:'Import, compare, crop, tune, resize and export.'},
    import:{'zh-CN':'导入','zh-HK':'導入',en:'Import'},
    resize:{'zh-CN':'尺寸','zh-HK':'尺寸',en:'Resize'},
    crop:{'zh-CN':'裁切','zh-HK':'裁切',en:'Crop'},
    adjust:{'zh-CN':'调色','zh-HK':'調色',en:'Adjust'},
    export:{'zh-CN':'导出','zh-HK':'導出',en:'Export'},
    ocr:{'zh-CN':'OCR','zh-HK':'OCR',en:'OCR'},
    open:{'zh-CN':'打开图片','zh-HK':'打開圖片',en:'Open'},
    drop:{'zh-CN':'拖放图片到这里','zh-HK':'拖放圖片到這裡',en:'Drop image here'},
    paste:{'zh-CN':'也可以 Ctrl+V 粘贴截图','zh-HK':'也可以 Ctrl+V 貼上截圖',en:'or paste screenshot with Ctrl+V'},
    original:{'zh-CN':'原图','zh-HK':'原圖',en:'Original'},
    preview:{'zh-CN':'编辑预览','zh-HK':'編輯預覽',en:'Edited preview'},
    waiting:{'zh-CN':'等待图片导入','zh-HK':'等待圖片導入',en:'Waiting for image'},
    ready:{'zh-CN':'已载入，可开始编辑','zh-HK':'已載入，可開始編輯',en:'Ready to edit'},
    width:{'zh-CN':'宽度','zh-HK':'寬度',en:'Width'},
    height:{'zh-CN':'高度','zh-HK':'高度',en:'Height'},
    lock:{'zh-CN':'锁定比例','zh-HK':'鎖定比例',en:'Lock ratio'},
    reset:{'zh-CN':'重置','zh-HK':'重置',en:'Reset'},
    download:{'zh-CN':'下载图片','zh-HK':'下載圖片',en:'Download'},
    copy:{'zh-CN':'复制图片','zh-HK':'複製圖片',en:'Copy image'},
    aiSoon:{'zh-CN':'AI 去背景 / 修复将在下一轮接入；当前先保证本地编辑闭环稳定。','zh-HK':'AI 去背景 / 修復將在下一輪接入；目前先保證本地編輯閉環穩定。',en:'AI background removal/restoration will be connected next; local editing is stabilized first.'},
    ocrSoon:{'zh-CN':'OCR 区域已预留；识别服务下一轮接入。','zh-HK':'OCR 區域已預留；識別服務下一輪接入。',en:'OCR area reserved; recognition service will be connected next.'}
  };

  function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';if(/^en/i.test(v))return 'en';return 'zh-HK';}
  function t(k){const l=lang();return TEXT[k]?.[l]||TEXT[k]?.['zh-HK']||k;}
  function E(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function appMeta(){return {title:t('title'),desc:t('desc'),icon:'◎',tone:'t-image'};}
  function rootId(root){return root.closest('[data-card-id]')?.dataset.cardId||'floating';}
  function cardById(id){try{return activeWorkspace().cards.find(c=>String(c.id)===String(id));}catch(e){return null;}}
  function session(id){
    if(!sessions.has(id))sessions.set(id,{tool:'import',fileName:'',img:null,src:'',out:'',ow:0,oh:0,w:0,h:0,lock:true,format:'image/png',quality:.92,brightness:100,contrast:100,saturation:100,crop:{x:0,y:0,w:1,h:1}});
    return sessions.get(id);
  }

  function style(){
    if(document.getElementById('windzxyImageStudioV3Style'))return;
    const s=document.createElement('style');s.id='windzxyImageStudioV3Style';s.textContent=`
.image-studio-v3{height:100%;min-height:430px;display:grid;grid-template-columns:76px minmax(0,1fr) 286px;grid-template-rows:58px minmax(0,1fr) 28px;gap:12px;overflow:hidden;color:var(--ink)}
.is3-top{grid-column:1/4;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 8px;border-radius:20px;background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.07));border:1px solid rgba(255,255,255,.16)}
.is3-brand{display:flex;align-items:center;gap:12px;min-width:0}.is3-logo{width:42px;height:42px;border-radius:17px;display:grid;place-items:center;font-size:22px;background:radial-gradient(circle at 30% 18%,#fff3 0 22%,transparent 24%),linear-gradient(135deg,#ffbd68,#ff6a3c 55%,#7a5cff);box-shadow:0 14px 28px rgba(0,0,0,.24);color:#21130a}.is3-brand strong{display:block;font-size:17px;letter-spacing:.2px}.is3-brand span{display:block;font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:380px}
.is3-top-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.is3-top-actions input{display:none}.is3-btn,.is3-top-actions button{border:0;border-radius:13px;padding:9px 12px;background:rgba(255,255,255,.15);color:var(--ink);font-weight:850;cursor:pointer}.is3-btn.primary,.is3-top-actions .primary{background:linear-gradient(135deg,#ffbf5c,#ff7b3d);color:#231107;box-shadow:0 10px 22px rgba(255,123,61,.25)}.is3-btn:disabled,.is3-top-actions button:disabled{opacity:.45;cursor:not-allowed}
.is3-rail{grid-row:2/3;display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:22px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.14);overflow:auto}.is3-rail button{border:0;border-radius:16px;min-height:56px;padding:7px 4px;background:rgba(255,255,255,.10);color:var(--ink);font-size:10px;font-weight:850;cursor:pointer;display:grid;place-items:center;gap:3px}.is3-rail button b{font-size:18px}.is3-rail button.on{background:linear-gradient(135deg,rgba(255,191,92,.95),rgba(255,123,61,.86));color:#201005}
.is3-stage{grid-row:2/3;min-width:0;min-height:0;display:grid;grid-template-rows:minmax(0,1fr) 36px;gap:10px}.is3-compare{min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:12px}.is3-pane{min-width:0;min-height:0;display:grid;grid-template-rows:38px minmax(0,1fr);border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,.16);background:rgba(5,9,20,.34);box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}.is3-pane h4{margin:0;padding:11px 14px;font-size:12px;color:var(--muted);display:flex;justify-content:space-between;align-items:center}.is3-canvas{position:relative;min-height:0;display:grid;place-items:center;padding:14px;background-image:linear-gradient(45deg,rgba(255,255,255,.045) 25%,transparent 25%),linear-gradient(-45deg,rgba(255,255,255,.045) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,rgba(255,255,255,.045) 75%),linear-gradient(-45deg,transparent 75%,rgba(255,255,255,.045) 75%);background-size:24px 24px;background-position:0 0,0 12px,12px -12px,-12px 0}.is3-canvas img{max-width:100%;max-height:100%;object-fit:contain;border-radius:14px;box-shadow:0 16px 32px rgba(0,0,0,.32)}
.is3-empty{width:min(92%,460px);min-height:220px;border-radius:26px;border:1.5px dashed rgba(255,255,255,.28);background:linear-gradient(135deg,rgba(255,255,255,.10),rgba(255,255,255,.035));display:grid;place-items:center;text-align:center;padding:26px}.is3-empty i{display:block;font-size:46px;font-style:normal;margin-bottom:8px}.is3-empty strong{display:block;font-size:18px}.is3-empty span{display:block;margin-top:6px;color:var(--muted);font-size:12px}.is3-drop{outline:3px solid rgba(255,191,92,.85);outline-offset:-10px}.is3-flow{display:flex;align-items:center;justify-content:center;gap:8px;color:var(--muted);font-size:11px}.is3-flow b{color:var(--ink)}
.is3-inspector{grid-row:2/3;min-width:0;min-height:0;border-radius:24px;padding:14px;background:rgba(255,255,255,.105);border:1px solid rgba(255,255,255,.16);overflow:auto}.is3-inspector h3{margin:0 0 4px;font-size:15px}.is3-inspector p{margin:0 0 12px;color:var(--muted);font-size:12px;line-height:1.45}.is3-field{display:grid;gap:6px;margin:10px 0;font-size:11px;color:var(--muted)}.is3-field input,.is3-field select{box-sizing:border-box;width:100%;border:1px solid rgba(255,255,255,.18);border-radius:13px;background:rgba(0,0,0,.22);color:var(--ink);padding:9px}.is3-row{display:grid;grid-template-columns:1fr 1fr;gap:9px}.is3-check{display:flex;align-items:center;gap:8px;margin:8px 0 12px;font-size:12px}.is3-chips{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}.is3-chips button{border:0;border-radius:999px;background:rgba(255,255,255,.13);color:var(--ink);padding:8px 10px;font-size:12px;font-weight:750;cursor:pointer}.is3-chips button:hover{background:rgba(255,255,255,.22)}.is3-panel-note{border-radius:18px;padding:12px;background:rgba(255,255,255,.09);color:var(--muted);font-size:12px;line-height:1.55}
.is3-footer{grid-column:1/4;color:var(--muted);font-size:11px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 4px}.image-studio-v3.is-compact{grid-template-columns:64px minmax(0,1fr);grid-template-rows:58px minmax(0,1fr) auto 28px}.image-studio-v3.is-compact .is3-top{grid-column:1/3}.image-studio-v3.is-compact .is3-inspector{grid-column:1/3;grid-row:3/4;max-height:220px}.image-studio-v3.is-compact .is3-footer{grid-column:1/3}.image-studio-v3.is-tiny{grid-template-columns:1fr;grid-template-rows:auto auto minmax(0,1fr) auto auto}.image-studio-v3.is-tiny .is3-top,.image-studio-v3.is-tiny .is3-footer,.image-studio-v3.is-tiny .is3-inspector{grid-column:1}.image-studio-v3.is-tiny .is3-rail{grid-row:2;flex-direction:row;min-height:58px}.image-studio-v3.is-tiny .is3-stage{grid-row:3}.image-studio-v3.is-tiny .is3-compare{grid-template-columns:1fr}.image-studio-v3.is-tiny .is3-brand span{display:none}
@media(max-width:820px){.image-studio-v3{grid-template-columns:1fr;grid-template-rows:auto auto minmax(0,1fr) auto auto}.image-studio-v3 .is3-top,.image-studio-v3 .is3-footer,.image-studio-v3 .is3-inspector{grid-column:1}.image-studio-v3 .is3-rail{grid-row:2;flex-direction:row;min-height:58px}.image-studio-v3 .is3-stage{grid-row:3}.image-studio-v3 .is3-compare{grid-template-columns:1fr}}
`;document.head.appendChild(s);
  }

  function render(card={}){
    const id=card.id||'floating';const s=session(id);const has=!!s.img;const w=card.w||DEFAULT_W,h=card.h||DEFAULT_H;
    const compact=w<760;const tiny=w<590||h<520;
    return `<div class="image-studio-v3 ${compact?'is-compact':''} ${tiny?'is-tiny':''}" data-is3-root data-version="${VER}">
      <header class="is3-top">
        <div class="is3-brand"><div class="is3-logo">◎</div><div><strong>${t('title')}</strong><span>${has?E(s.fileName)+' · '+s.ow+'×'+s.oh:t('desc')}</span></div></div>
        <div class="is3-top-actions"><input data-is3-file type="file" accept="image/*"><button class="primary" data-is3-open>${t('open')}</button><button data-is3-reset ${has?'':'disabled'}>${t('reset')}</button></div>
      </header>
      <nav class="is3-rail">${toolBtn('import','⬆',s)}${toolBtn('resize','↕',s)}${toolBtn('crop','⌗',s)}${toolBtn('adjust','◐',s)}${toolBtn('export','⇩',s)}${toolBtn('ocr','T',s)}</nav>
      <main class="is3-stage">
        <section class="is3-compare">
          ${pane('original',has?s.src:'',has?s.ow+'×'+s.oh:'—')}
          ${pane('preview',has?(s.out||s.src):'',has?s.w+'×'+s.h:'—',true)}
        </section>
        <div class="is3-flow"><span>${t('import')}</span> → <span>${t('resize')}</span> → <span>${t('crop')}</span> → <b>${t('preview')}</b> → <span>${t('export')}</span></div>
      </main>
      <aside class="is3-inspector">${panel(s)}</aside>
      <footer class="is3-footer"><span>${has?t('ready'):t('waiting')}</span><span>Image Studio V3 · ${VER}</span></footer>
    </div>`;
  }
  function toolBtn(k,icon,s){return `<button data-is3-tool="${k}" class="${s.tool===k?'on':''}"><b>${icon}</b><span>${t(k)}</span></button>`;}
  function pane(label,src,size,preview=false){return `<div class="is3-pane"><h4><span>${t(label)}</span><em>${E(size)}</em></h4><div class="is3-canvas" ${preview?'data-is3-preview-box':''} data-is3-drop>${src?`<img src="${E(src)}" alt="${t(label)}">`:`<div class="is3-empty"><div><i>🖼</i><strong>${t('drop')}</strong><span>${t('paste')}</span></div></div>`}</div></div>`;}
  function panel(s){
    const dis=s.img?'':'disabled';
    if(s.tool==='import')return `<h3>${t('import')}</h3><p>${t('desc')}</p><div class="is3-panel-note">${t('drop')}<br>${t('paste')}</div>`;
    if(s.tool==='resize')return `<h3>${t('resize')}</h3><p>Quick presets / custom output size.</p><div class="is3-chips"><button data-is3-preset="1x" ${dis}>1×</button><button data-is3-preset="2x" ${dis}>2×</button><button data-is3-preset="1920x1080" ${dis}>1080p</button><button data-is3-preset="2560x1440" ${dis}>2K</button><button data-is3-preset="3840x2160" ${dis}>4K</button><button data-is3-preset="7680x4320" ${dis}>8K</button></div><div class="is3-row"><label class="is3-field">${t('width')}<input data-is3-w type="number" min="1" value="${s.w||''}" ${dis}></label><label class="is3-field">${t('height')}<input data-is3-h type="number" min="1" value="${s.h||''}" ${dis}></label></div><label class="is3-check"><input data-is3-lock type="checkbox" ${s.lock?'checked':''}>${t('lock')}</label>`;
    if(s.tool==='crop')return `<h3>${t('crop')}</h3><p>Drag on preview or use ratios.</p><div class="is3-chips"><button data-is3-crop="reset" ${dis}>Full</button><button data-is3-crop="1:1" ${dis}>1:1</button><button data-is3-crop="4:3" ${dis}>4:3</button><button data-is3-crop="16:9" ${dis}>16:9</button><button data-is3-crop="9:16" ${dis}>9:16</button></div><div class="is3-row"><label class="is3-field">X %<input data-is3-cx type="number" min="0" max="100" value="${Math.round(s.crop.x*100)}" ${dis}></label><label class="is3-field">Y %<input data-is3-cy type="number" min="0" max="100" value="${Math.round(s.crop.y*100)}" ${dis}></label></div><div class="is3-row"><label class="is3-field">W %<input data-is3-cw type="number" min="1" max="100" value="${Math.round(s.crop.w*100)}" ${dis}></label><label class="is3-field">H %<input data-is3-ch type="number" min="1" max="100" value="${Math.round(s.crop.h*100)}" ${dis}></label></div>`;
    if(s.tool==='adjust')return `<h3>${t('adjust')}</h3>${range('brightness','Brightness',s.brightness,0,200,dis)}${range('contrast','Contrast',s.contrast,0,200,dis)}${range('saturation','Saturation',s.saturation,0,200,dis)}<div class="is3-panel-note">${t('aiSoon')}</div>`;
    if(s.tool==='export')return `<h3>${t('export')}</h3><div class="is3-row"><label class="is3-field">Format<select data-is3-format ${dis}><option value="image/png" ${s.format==='image/png'?'selected':''}>PNG</option><option value="image/jpeg" ${s.format==='image/jpeg'?'selected':''}>JPG</option><option value="image/webp" ${s.format==='image/webp'?'selected':''}>WEBP</option></select></label><label class="is3-field">Quality<input data-is3-quality type="range" min="40" max="100" value="${Math.round(s.quality*100)}" ${dis}></label></div><div class="is3-chips"><button class="is3-btn primary" data-is3-download ${dis}>${t('download')}</button><button data-is3-copy ${dis}>${t('copy')}</button></div>`;
    return `<h3>${t('ocr')}</h3><div class="is3-panel-note">${t('ocrSoon')}</div>`;
  }
  function range(k,label,v,min,max,dis){return `<label class="is3-field">${label}<input data-is3-${k} type="range" min="${min}" max="${max}" value="${v}" ${dis}></label>`;}

  function install(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'){setTimeout(install,80);return;}
    style();
    const m=appMeta();let a=apps.find(x=>x.id===APP);if(a)Object.assign(a,m,{kind:'tool'});else apps.unshift({id:APP,kind:'tool',...m});
    if(!window.__windzxyImageStudioBodyPatched){window.__windzxyImageStudioBodyPatched=1;const old=bodyHtml;bodyHtml=function(card,info){return card&&card.appId===APP?render(card):old.apply(this,arguments);};}
    if(typeof appContent==='function'&&!window.__windzxyImageStudioAppContentPatched){window.__windzxyImageStudioAppContentPatched=1;const old=appContent;appContent=function(appId){return appId===APP?render({id:'inline-image',w:DEFAULT_W,h:DEFAULT_H}):old.apply(this,arguments);};}
    if(typeof preferredCardSize==='function'&&!window.__windzxyImageStudioSizePatched){window.__windzxyImageStudioSizePatched=1;const old=preferredCardSize;preferredCardSize=function(appId,w,h){if(appId===APP)return {w:Math.max(w||0,DEFAULT_W),h:Math.max(h||0,DEFAULT_H)};return old.apply(this,arguments);};}
    try{workspaces.forEach(ws=>(ws.cards||[]).forEach(c=>{if(c.appId===APP){c.w=Math.max(c.w||0,DEFAULT_W);c.h=Math.max(c.h||0,DEFAULT_H);}}));save();}catch(e){}
    bind();try{renderAll();}catch(e){}
  }
  function bind(){if(window.__windzxyImageStudioV3EventsBound)return;window.__windzxyImageStudioV3EventsBound=1;document.addEventListener('click',click,true);document.addEventListener('change',change,true);document.addEventListener('input',input,true);document.addEventListener('dragover',dragOver,true);document.addEventListener('dragleave',dragLeave,true);document.addEventListener('drop',drop,true);document.addEventListener('paste',paste,true);document.addEventListener('pointerdown',cropStart,true);document.addEventListener('change',e=>{if(e.target?.matches('.lang-select'))setTimeout(()=>{try{renderAll();}catch(_){}},40);},true);}
  function rerender(root){const c=cardById(rootId(root))||{id:rootId(root),w:DEFAULT_W,h:DEFAULT_H};root.outerHTML=render(c);}
  async function refresh(root){const s=session(rootId(root));await draw(s);rerender(root);}
  function click(e){const root=e.target.closest('[data-is3-root]');if(!root)return;const s=session(rootId(root));const q=sel=>e.target.closest(sel);if(q('[data-is3-open]')){e.stopPropagation();root.querySelector('[data-is3-file]')?.click();return;}const tool=q('[data-is3-tool]');if(tool){e.stopPropagation();s.tool=tool.dataset.is3Tool;rerender(root);return;}const preset=q('[data-is3-preset]');if(preset&&s.img){e.stopPropagation();presetSize(s,preset.dataset.is3Preset);refresh(root);return;}const crop=q('[data-is3-crop]');if(crop&&s.img){e.stopPropagation();cropRatio(s,crop.dataset.is3Crop);refresh(root);return;}if(q('[data-is3-reset]')&&s.img){e.stopPropagation();reset(s);refresh(root);return;}if(q('[data-is3-download]')&&s.img){e.stopPropagation();download(s);return;}if(q('[data-is3-copy]')&&s.img){e.stopPropagation();copy(s);return;}}
  function change(e){const root=e.target.closest('[data-is3-root]');if(!root)return;if(e.target.matches('[data-is3-file]')&&e.target.files?.[0])load(root,e.target.files[0]);}
  function input(e){const root=e.target.closest('[data-is3-root]');if(!root)return;const s=session(rootId(root));if(!s.img)return;if(e.target.matches('[data-is3-w]')){s.w=Math.max(1,+e.target.value||s.w);if(s.lock)s.h=Math.max(1,Math.round(s.w*(s.oh*s.crop.h)/(s.ow*s.crop.w)));refresh(root);}if(e.target.matches('[data-is3-h]')){s.h=Math.max(1,+e.target.value||s.h);if(s.lock)s.w=Math.max(1,Math.round(s.h*(s.ow*s.crop.w)/(s.oh*s.crop.h)));refresh(root);}if(e.target.matches('[data-is3-lock]'))s.lock=e.target.checked;['brightness','contrast','saturation'].forEach(k=>{if(e.target.matches('[data-is3-'+k+']')){s[k]=+e.target.value||100;refresh(root);}});if(e.target.matches('[data-is3-format]')){s.format=e.target.value;refresh(root);}if(e.target.matches('[data-is3-quality]')){s.quality=(+e.target.value||92)/100;refresh(root);}if(e.target.matches('[data-is3-cx],[data-is3-cy],[data-is3-cw],[data-is3-ch]')){s.crop.x=(+root.querySelector('[data-is3-cx]')?.value||0)/100;s.crop.y=(+root.querySelector('[data-is3-cy]')?.value||0)/100;s.crop.w=(+root.querySelector('[data-is3-cw]')?.value||100)/100;s.crop.h=(+root.querySelector('[data-is3-ch]')?.value||100)/100;clamp(s);syncSize(s);refresh(root);}}
  function dragOver(e){const z=e.target.closest('[data-is3-drop]');if(z){e.preventDefault();z.classList.add('is3-drop');}}
  function dragLeave(e){const z=e.target.closest('[data-is3-drop]');if(z)z.classList.remove('is3-drop');}
  function drop(e){const z=e.target.closest('[data-is3-drop]');if(!z)return;e.preventDefault();z.classList.remove('is3-drop');const f=[...(e.dataTransfer?.files||[])].find(x=>/^image\//.test(x.type));if(f)load(z.closest('[data-is3-root]'),f);}
  function paste(e){const root=document.querySelector('[data-is3-root]');if(!root)return;const f=[...(e.clipboardData?.files||[])].find(x=>/^image\//.test(x.type));if(f)load(root,f);}
  function cropStart(e){const root=e.target.closest('[data-is3-root]');if(!root)return;const s=session(rootId(root));if(!s.img||s.tool!=='crop')return;const box=e.target.closest('[data-is3-preview-box]');if(!box)return;const img=box.querySelector('img');if(!img)return;e.preventDefault();e.stopPropagation();const r=img.getBoundingClientRect();const a={x:e.clientX,y:e.clientY};const move=ev=>{s.crop={x:(Math.min(a.x,ev.clientX)-r.left)/r.width,y:(Math.min(a.y,ev.clientY)-r.top)/r.height,w:Math.abs(ev.clientX-a.x)/r.width,h:Math.abs(ev.clientY-a.y)/r.height};clamp(s);syncSize(s);};const up=ev=>{move(ev);window.removeEventListener('pointermove',move,true);refresh(root);};window.addEventListener('pointermove',move,true);window.addEventListener('pointerup',up,{once:true,capture:true});}

  function load(root,file){const id=rootId(root),s=session(id),reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=async()=>{Object.assign(s,{img,src:reader.result,out:reader.result,fileName:file.name||'image',ow:img.naturalWidth,oh:img.naturalHeight,w:img.naturalWidth,h:img.naturalHeight,tool:'resize',crop:{x:0,y:0,w:1,h:1},brightness:100,contrast:100,saturation:100});await draw(s);const c=cardById(id);if(c){c.w=Math.max(c.w||0,DEFAULT_W);c.h=Math.max(c.h||0,DEFAULT_H);try{save();renderAll();return;}catch(e){}}rerender(root);};img.src=reader.result;};reader.readAsDataURL(file);}
  function reset(s){Object.assign(s,{w:s.ow,h:s.oh,crop:{x:0,y:0,w:1,h:1},brightness:100,contrast:100,saturation:100,format:'image/png',quality:.92});}
  function presetSize(s,p){if(p==='1x'){s.w=Math.round(s.ow*s.crop.w);s.h=Math.round(s.oh*s.crop.h);}else if(p==='2x'){s.w=Math.round(s.ow*s.crop.w*2);s.h=Math.round(s.oh*s.crop.h*2);}else{const [w,h]=p.split('x').map(Number);s.w=w;s.h=h;}}
  function cropRatio(s,p){if(p==='reset'){s.crop={x:0,y:0,w:1,h:1};syncSize(s);return;}const [a,b]=p.split(':').map(Number);const target=a/b,src=s.ow/s.oh;if(src>target){const w=target/src;s.crop={x:(1-w)/2,y:0,w,h:1};}else{const h=src/target;s.crop={x:0,y:(1-h)/2,w:1,h};}syncSize(s);}
  function clamp(s){s.crop.x=Math.max(0,Math.min(.99,s.crop.x));s.crop.y=Math.max(0,Math.min(.99,s.crop.y));s.crop.w=Math.max(.01,Math.min(1-s.crop.x,s.crop.w));s.crop.h=Math.max(.01,Math.min(1-s.crop.y,s.crop.h));}
  function syncSize(s){s.w=Math.max(1,Math.round(s.ow*s.crop.w));s.h=Math.max(1,Math.round(s.oh*s.crop.h));}
  async function draw(s){if(!s.img)return;const c=document.createElement('canvas');c.width=Math.max(1,Math.round(s.w));c.height=Math.max(1,Math.round(s.h));const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.filter=`brightness(${s.brightness}%) contrast(${s.contrast}%) saturate(${s.saturation}%)`;ctx.drawImage(s.img,s.ow*s.crop.x,s.oh*s.crop.y,s.ow*s.crop.w,s.oh*s.crop.h,0,0,c.width,c.height);s.canvas=c;s.out=c.toDataURL(s.format,s.quality);}
  function download(s){if(!s.canvas)return;const ext=s.format==='image/jpeg'?'jpg':s.format==='image/webp'?'webp':'png';s.canvas.toBlob(blob=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(s.fileName||'image').replace(/\.[^.]+$/,'')+'-edited.'+ext;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200);},s.format,s.quality);}
  function copy(s){if(!s.canvas||!navigator.clipboard||!window.ClipboardItem){download(s);return;}s.canvas.toBlob(async blob=>{try{await navigator.clipboard.write([new ClipboardItem({[blob.type]:blob})]);}catch(e){download(s);}},'image/png');}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.windzxyImageStudioV3Version=VER;
})();
