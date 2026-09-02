(function(){
  'use strict';
  const VER='20260902-workspace-manager-v1.2-clean-card-geometry';
  if(window.__windzxyWorkspaceManagerV1===VER)return;
  window.__windzxyWorkspaceManagerV1=VER;

  const ACTIVE_KEY='windzxy-active-workspace';
  const GEO_KEY='windzxy-web-desktop-card-geometry-v4';

  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function list(){try{return Array.isArray(workspaces)?workspaces:[];}catch(e){return [];}}
  function persist(){try{if(typeof save==='function')save();else localStorage.setItem('windzxy-web-desktop-workspaces',JSON.stringify(list()));}catch(e){}}
  function paint(){try{if(typeof renderAll==='function')renderAll();else if(typeof renderWorkspaces==='function')renderWorkspaces();}catch(e){}}
  function setActive(id){
    try{activeId=id;localStorage.setItem(ACTIVE_KEY,id);}catch(e){localStorage.setItem(ACTIVE_KEY,id);}
  }
  function cleanGeometryForCards(cardIds){
    try{
      const ids=new Set((Array.isArray(cardIds)?cardIds:[]).map(id=>String(id||'')).filter(Boolean));
      if(!ids.size)return 0;
      const raw=localStorage.getItem(GEO_KEY);
      if(!raw)return 0;
      const geo=JSON.parse(raw);
      if(!geo||typeof geo!=='object'||Array.isArray(geo))return 0;
      let removed=0;
      Object.keys(geo).forEach(key=>{
        for(const id of ids){
          if(key.includes('::id::'+id)){
            delete geo[key];
            removed++;
            break;
          }
        }
      });
      if(removed)localStorage.setItem(GEO_KEY,JSON.stringify(geo));
      return removed;
    }catch(e){return 0;}
  }
  function cleanGeometryForWorkspace(ws){
    return cleanGeometryForCards((Array.isArray(ws?.cards)?ws.cards:[]).map(card=>card?.id));
  }

  function ensureStyle(){
    if(document.getElementById('workspaceManagerV1Style'))return;
    const s=document.createElement('style');
    s.id='workspaceManagerV1Style';
    s.textContent=`
      .workspace-item.wm1-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px 8px 7px 11px}
      .wm1-main{min-width:0;border:0;background:transparent;color:inherit;text-align:left;padding:3px 0;cursor:pointer;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px}
      .wm1-main>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}.wm1-main>small{opacity:.5;font-size:11px}
      .wm1-actions{display:flex;gap:4px}.wm1-actions button{width:30px;height:30px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--muted);cursor:pointer;font-size:13px;display:grid;place-items:center}
      .wm1-actions button:hover{color:var(--ink);background:var(--panel)}.wm1-actions .wm1-delete:hover{color:#ef4444;border-color:color-mix(in srgb,#ef4444 38%,var(--line))}
      .wm1-edit{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:6px}.wm1-edit input{min-width:0;height:34px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);padding:0 10px;font:inherit;outline:none}.wm1-edit input:focus{border-color:color-mix(in srgb,var(--blue1) 65%,var(--line));box-shadow:0 0 0 3px color-mix(in srgb,var(--blue1) 14%,transparent)}.wm1-edit button{height:34px;min-width:34px;border:1px solid var(--line);border-radius:10px;background:var(--panel2);color:var(--ink);cursor:pointer}
      .wm1-note{margin:8px 2px 0;color:var(--muted);font-size:11px;line-height:1.45}
    `;
    document.head.appendChild(s);
  }

  function workspaceHtml(w){
    const active=String(w.id)===String(typeof activeId!=='undefined'?activeId:'');
    return `<div class="workspace-item wm1-item ${active?'is-active':''}" data-wm1-id="${esc(w.id)}">
      <button class="wm1-main" type="button" data-wm1-open="${esc(w.id)}"><span>${esc(w.name||'工作區')}</span><small>${Array.isArray(w.cards)?w.cards.length:0}</small></button>
      <span class="wm1-actions"><button type="button" data-wm1-rename="${esc(w.id)}" title="重命名" aria-label="重命名">✎</button><button class="wm1-delete" type="button" data-wm1-delete="${esc(w.id)}" title="刪除工作區" aria-label="刪除工作區">×</button></span>
    </div>`;
  }

  function enhancedRenderWorkspaces(){
    const root=document.getElementById('workspaceList');
    if(!root)return;
    ensureStyle();
    const rows=list();
    root.innerHTML=rows.map(workspaceHtml).join('')+(rows.length?'<p class="wm1-note">每個工作區獨立保存卡片、位置與尺寸。</p>':'');
    root.querySelectorAll('[data-wm1-open]').forEach(btn=>btn.onclick=()=>{setActive(btn.dataset.wm1Open);paint();});
    root.querySelectorAll('[data-wm1-rename]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();beginRename(btn.dataset.wm1Rename);});
    root.querySelectorAll('[data-wm1-delete]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();removeWorkspace(btn.dataset.wm1Delete);});
  }

  function beginRename(id){
    const root=document.querySelector(`[data-wm1-id="${CSS.escape(String(id))}"]`);
    const ws=list().find(x=>String(x.id)===String(id));
    if(!root||!ws)return;
    const original=String(ws.name||'工作區');
    root.innerHTML=`<div class="wm1-edit"><input type="text" maxlength="40" value="${esc(original)}" aria-label="工作區名稱"><button type="button" data-wm1-save>✓</button><button type="button" data-wm1-cancel>×</button></div>`;
    const input=root.querySelector('input');
    const commit=()=>{
      const name=input.value.trim();
      if(!name){input.focus();return;}
      ws.name=name;
      persist();
      enhancedRenderWorkspaces();
      try{if(typeof renderDesktop==='function')renderDesktop();}catch(e){}
    };
    root.querySelector('[data-wm1-save]').onclick=commit;
    root.querySelector('[data-wm1-cancel]').onclick=enhancedRenderWorkspaces;
    input.addEventListener('keydown',e=>{if(e.key==='Enter')commit();if(e.key==='Escape')enhancedRenderWorkspaces();});
    input.focus();input.select();
  }

  function removeWorkspace(id){
    const rows=list();
    const ws=rows.find(x=>String(x.id)===String(id));
    if(!ws)return;
    if(rows.length<=1){alert('至少需要保留一個工作區。');return;}
    const count=Array.isArray(ws.cards)?ws.cards.length:0;
    if(!confirm(`刪除「${ws.name||'工作區'}」？${count?`\n其中 ${count} 張卡片也會一起刪除。`:''}`))return;
    cleanGeometryForWorkspace(ws);
    const idx=rows.findIndex(x=>String(x.id)===String(id));
    rows.splice(idx,1);
    if(String(typeof activeId!=='undefined'?activeId:'')===String(id)){
      const next=rows[Math.min(idx,rows.length-1)]||rows[0];
      if(next)setActive(next.id);
    }
    persist();
    paint();
  }

  function patchCardRemoval(){
    if(!window.__windzxyWorkspaceManagerCardRemovalPatched&&typeof removeCard==='function'){
      window.__windzxyWorkspaceManagerCardRemovalPatched=1;
      const coreRemove=removeCard;
      removeCard=function(id){cleanGeometryForCards([id]);return coreRemove.apply(this,arguments);};
    }
    if(!window.__windzxyWorkspaceManagerResetPatched&&typeof resetLayout==='function'){
      window.__windzxyWorkspaceManagerResetPatched=1;
      const coreReset=resetLayout;
      resetLayout=function(){
        try{cleanGeometryForWorkspace(typeof activeWorkspace==='function'?activeWorkspace():null);}catch(e){}
        return coreReset.apply(this,arguments);
      };
    }
  }

  function patch(){
    ensureStyle();
    try{renderWorkspaces=enhancedRenderWorkspaces;}catch(e){}
    patchCardRemoval();
    enhancedRenderWorkspaces();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch,{once:true});else patch();
  window.WebDeskWorkspaceManager={version:VER,render:enhancedRenderWorkspaces,rename:beginRename,remove:removeWorkspace,cleanGeometry:cleanGeometryForWorkspace,cleanCardGeometry:cleanGeometryForCards};
})();