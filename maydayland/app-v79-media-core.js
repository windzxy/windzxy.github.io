(() => {
  'use strict';
  const VERSION='79.0.0';
  const DATA_URL='./data/media-registry-v54.json?v=79.0.0';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let registry=null, report=null, registryOpen=false, healthOpen=false, registrySelected='', healthSelected='';

  document.addEventListener('DOMContentLoaded',init,{once:true});
  async function init(){
    registry=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!registry)return;
    report=runHealthChecks();
    const sync=()=>requestAnimationFrame(()=>{decorateCards();refreshMountState();renderRegistryBadge();renderHealthBadge();});
    decorateCards();renderRegistry();renderHealth();
    addEventListener('hashchange',()=>{decorateCards();renderRegistry();renderHealth();});
    new MutationObserver(sync).observe(document.body,{subtree:true,childList:true});
    document.body.dataset.v79MediaCore='ready';
    dispatchEvent(new CustomEvent('maydayland:media-core-ready',{detail:{version:VERSION,assets:registry.assets.length}}));
  }

  function currentPage(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home';}
  function pageAssets(){return registry.assets.filter(a=>a.page===currentPage());}
  function runHealthChecks(){
    const rules=registry.policy.healthRules, required=registry.policy.requiredFields;
    const assets=registry.assets.map(a=>{
      const issues=[];
      required.filter(k=>a[k]===undefined||a[k]===null||a[k]==='').forEach(k=>issues.push({level:'error',code:'missing-field',message:`Missing ${k}`}));
      if(a.width<rules.minimumWidth||a.height<rules.minimumHeight)issues.push({level:'warn',code:'resolution',message:`Below ${rules.minimumWidth}×${rules.minimumHeight}`});
      if(!rules.allowedAspectRatios.includes(a.aspectRatio))issues.push({level:'warn',code:'aspect',message:`Unexpected ratio ${a.aspectRatio}`});
      if(rules.requireAlt&&!String(a.alt||'').trim())issues.push({level:'error',code:'alt',message:'Missing alt text'});
      if(rules.requireOwner&&!String(a.owner||'').trim())issues.push({level:'error',code:'owner',message:'Missing owner'});
      if(a.sourceType==='external'&&rules.requireSourceUrlForExternal&&!a.sourceUrl)issues.push({level:'error',code:'source-url',message:'External asset lacks source URL'});
      if(a.rights==='verified-local'&&rules.requireLocalPathForVerifiedLocal&&!a.localPath)issues.push({level:'error',code:'local-path',message:'Verified local asset lacks local path'});
      const fallbackOnly=!a.localPath&&!!a.fallback;
      const state=issues.some(i=>i.level==='error')?'error':issues.length?'warning':fallbackOnly?'fallback-ready':'healthy';
      return {...a,issues,state,mounted:false};
    });
    return {assets,totals:assets.reduce((o,a)=>(o[a.state]=(o[a.state]||0)+1,o),{healthy:0,'fallback-ready':0,warning:0,error:0})};
  }
  function decorateCards(){
    $$('.v52-media-card').forEach(card=>{
      const title=$('.v52-media-copy b',card)?.textContent?.trim();
      const asset=report.assets.find(a=>a.title===title); if(!asset)return;
      card.dataset.assetId=asset.assetId;card.dataset.health=asset.state;asset.mounted=true;
      const rights=$('.v52-rights',card);if(rights){rights.textContent='REGISTRY · '+asset.rights.toUpperCase();rights.title=`${asset.width}×${asset.height} · ${asset.sourceType}`;}
      const thumb=$('.v52-media-thumb',card);if(thumb){thumb.setAttribute('role','img');thumb.setAttribute('aria-label',asset.alt||asset.title);}
      if(!$('.v79-meta-btn',card)){
        const meta=document.createElement('button');meta.type='button';meta.className='v79-meta-btn';meta.textContent=`${asset.width}×${asset.height} · ${asset.aspectRatio}`;
        meta.onclick=e=>{e.stopPropagation();registrySelected=asset.assetId;registryOpen=true;renderRegistry();};$('.v52-media-copy',card)?.append(meta);
      }
      if(!$('.v79-health',card)){
        const health=document.createElement('button');health.type='button';health.className='v79-health';health.textContent=label(asset.state);health.title=asset.issues.map(i=>i.message).join(' · ')||'Asset metadata passed v79 checks';
        health.onclick=e=>{e.stopPropagation();healthSelected=asset.assetId;healthOpen=true;renderHealth();};$('.v52-media-copy',card)?.append(health);
      }
    });
  }
  function refreshMountState(){report.assets.forEach(a=>a.mounted=!!document.querySelector(`[data-asset-id="${CSS.escape(a.assetId)}"]`));}
  function label(s){return ({healthy:'HEALTHY','fallback-ready':'FALLBACK READY',warning:'WARNING',error:'ERROR'})[s]||String(s).toUpperCase();}

  function renderRegistryBadge(){const el=$('#v79RegistryBadge');if(el)$('b',el).textContent=`${pageAssets().length} media assets`;}
  function renderRegistry(){
    let root=$('#v79Registry');if(!root){root=document.createElement('aside');root.id='v79Registry';root.className='v79-dock v79-dock-registry';document.body.append(root);}
    const p=pageAssets(), asset=registry.assets.find(a=>a.assetId===registrySelected)||p[0]||registry.assets[0];
    root.innerHTML=`<button id="v79RegistryBadge" class="v79-badge" aria-expanded="${registryOpen}"><span>MEDIA REGISTRY · v79</span><b>${p.length} media assets</b></button><section class="v79-panel ${registryOpen?'is-open':''}" aria-hidden="${!registryOpen}"><div class="v79-head"><div><small>MEDIA SOURCE REGISTRY</small><h3>Rights & provenance</h3></div><button id="v79RegistryClose" aria-label="Close">×</button></div><div class="v79-stats"><div><b>${registry.summary.assets}</b><span>assets</span></div><div><b>${registry.summary.generatedSafe}</b><span>generated-safe</span></div><div><b>${registry.summary.verifiedLocal}</b><span>verified-local</span></div></div><div class="v79-list">${(p.length?p:registry.assets.slice(0,4)).map(a=>`<button class="v79-row ${asset?.assetId===a.assetId?'is-active':''}" data-registry-id="${esc(a.assetId)}"><span>${esc(a.kind)}</span><b>${esc(a.title)}</b><em>${esc(a.rights)}</em></button>`).join('')}</div>${asset?registryDetail(asset):''}</section>`;
    $('#v79RegistryBadge',root)?.addEventListener('click',()=>{registryOpen=!registryOpen;renderRegistry();});$('#v79RegistryClose',root)?.addEventListener('click',()=>{registryOpen=false;renderRegistry();});$$('[data-registry-id]',root).forEach(btn=>btn.onclick=()=>{registrySelected=btn.dataset.registryId;renderRegistry();});
  }
  function registryDetail(a){const source=a.sourceUrl?`<a href="${esc(a.sourceUrl)}" target="_blank" rel="noopener">source</a>`:'<span>no external source</span>';return `<div class="v79-detail"><small>SELECTED ASSET</small><h4>${esc(a.title)}</h4><dl><div><dt>ID</dt><dd>${esc(a.assetId)}</dd></div><div><dt>Entity</dt><dd>${esc(a.entity)}</dd></div><div><dt>Rights</dt><dd>${esc(a.rights)}</dd></div><div><dt>Source</dt><dd>${esc(a.sourceType)}</dd></div><div><dt>Resolution</dt><dd>${a.width} × ${a.height}</dd></div><div><dt>Reference</dt><dd>${source}</dd></div></dl><p>${esc(a.alt)}</p></div>`;}

  function renderHealthBadge(){const el=$('#v79HealthBadge');if(!el)return;const page=pageAssets().map(a=>report.assets.find(x=>x.assetId===a.assetId)).filter(Boolean),bad=page.filter(a=>['warning','error'].includes(a.state)).length;$('b',el).textContent=bad?`${bad} issue${bad===1?'':'s'}`:`${page.length} checked`;}
  function renderHealth(){
    let root=$('#v79Health');if(!root){root=document.createElement('aside');root.id='v79Health';root.className='v79-dock v79-dock-health';document.body.append(root);}
    const page=pageAssets().map(a=>report.assets.find(x=>x.assetId===a.assetId)).filter(Boolean),visible=page.length?page:report.assets,asset=report.assets.find(a=>a.assetId===healthSelected)||visible[0],issueCount=visible.filter(a=>['warning','error'].includes(a.state)).length;
    root.innerHTML=`<button id="v79HealthBadge" class="v79-badge" aria-expanded="${healthOpen}"><span>ASSET HEALTH · v79</span><b>${issueCount?`${issueCount} issues`:`${visible.length} checked`}</b></button><section class="v79-panel ${healthOpen?'is-open':''}" aria-hidden="${!healthOpen}"><div class="v79-head"><div><small>MEDIA PIPELINE</small><h3>Asset health check</h3></div><button id="v79HealthClose" aria-label="Close">×</button></div><div class="v79-score"><strong>${healthScore()}%</strong><div><b>Pipeline integrity</b><span>${report.totals.error} errors · ${report.totals.warning} warnings · ${report.totals['fallback-ready']} fallback-ready</span></div></div><div class="v79-list">${visible.map(a=>`<button class="v79-row ${asset?.assetId===a.assetId?'is-active':''}" data-health-id="${esc(a.assetId)}"><i class="state-${esc(a.state)}"></i><b>${esc(a.title)}</b><em>${label(a.state)}</em></button>`).join('')}</div>${asset?healthDetail(asset):''}</section>`;
    $('#v79HealthBadge',root)?.addEventListener('click',()=>{healthOpen=!healthOpen;renderHealth();});$('#v79HealthClose',root)?.addEventListener('click',()=>{healthOpen=false;renderHealth();});$$('[data-health-id]',root).forEach(btn=>btn.onclick=()=>{healthSelected=btn.dataset.healthId;renderHealth();});
  }
  function healthScore(){const n=report.assets.length||1,d=report.totals.error*12+report.totals.warning*5+report.totals['fallback-ready']*1.2;return Math.max(0,Math.round(100-d/n));}
  function healthDetail(a){const issues=a.issues.length?a.issues.map(i=>`<li class="${esc(i.level)}"><b>${esc(i.code)}</b>${esc(i.message)}</li>`).join(''):'<li class="ok"><b>schema</b>Metadata passes all v79 rules</li>';return `<div class="v79-detail"><small>ASSET INSPECTOR</small><h4>${esc(a.title)}</h4><div class="v79-tags"><span>${label(a.state)}</span><span>${a.width}×${a.height}</span><span>${esc(a.aspectRatio)}</span></div><ul>${issues}</ul><p><b>${esc(a.assetId)}</b><br>${esc(a.alt)}</p></div>`;}
})();