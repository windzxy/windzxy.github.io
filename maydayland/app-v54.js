(() => {
  'use strict';
  const VERSION='54.0.0';
  const DATA_URL='./data/media-registry-v54.json?v=54.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let registry=null, report=null, open=false, selected='';

  document.addEventListener('DOMContentLoaded',init);

  async function init(){
    registry=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!registry)return;
    report=runHealthChecks();
    decorateCards();
    render();
    window.addEventListener('hashchange',()=>{decorateCards();render();});
    new MutationObserver(()=>requestAnimationFrame(()=>{decorateCards();refreshMountState();renderBadge();})).observe(document.body,{subtree:true,childList:true});
  }

  function currentPage(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home';}
  function pageAssets(){return registry.assets.filter(a=>a.page===currentPage());}

  function runHealthChecks(){
    const rules=registry.policy.healthRules;
    const required=registry.policy.requiredFields;
    const assets=registry.assets.map(a=>{
      const issues=[];
      const missing=required.filter(k=>a[k]===undefined || a[k]===null || a[k]==='');
      missing.forEach(k=>issues.push({level:'error',code:'missing-field',message:`Missing ${k}`}));
      if(a.width<rules.minimumWidth || a.height<rules.minimumHeight) issues.push({level:'warn',code:'resolution',message:`Below ${rules.minimumWidth}×${rules.minimumHeight}`} );
      if(!rules.allowedAspectRatios.includes(a.aspectRatio)) issues.push({level:'warn',code:'aspect',message:`Unexpected ratio ${a.aspectRatio}`});
      if(rules.requireAlt && !String(a.alt||'').trim()) issues.push({level:'error',code:'alt',message:'Missing alt text'});
      if(rules.requireOwner && !String(a.owner||'').trim()) issues.push({level:'error',code:'owner',message:'Missing owner'});
      if(a.sourceType==='external' && rules.requireSourceUrlForExternal && !a.sourceUrl) issues.push({level:'error',code:'source-url',message:'External asset lacks source URL'});
      if(a.rights==='verified-local' && rules.requireLocalPathForVerifiedLocal && !a.localPath) issues.push({level:'error',code:'local-path',message:'Verified local asset lacks local path'});
      const fallbackOnly=!a.localPath && !!a.fallback;
      const state=issues.some(i=>i.level==='error')?'error':issues.length?'warning':fallbackOnly?'fallback-ready':'healthy';
      return {...a,issues,state,mounted:false};
    });
    return {assets, totals:countStates(assets)};
  }

  function countStates(items){
    return items.reduce((o,a)=>(o[a.state]=(o[a.state]||0)+1,o),{healthy:0,'fallback-ready':0,warning:0,error:0});
  }

  function decorateCards(){
    $$('.v52-media-card').forEach(card=>{
      const title=$('.v52-media-copy b',card)?.textContent?.trim();
      const asset=report.assets.find(a=>a.title===title);
      if(!asset)return;
      asset.mounted=true;
      card.dataset.v54='1';
      card.dataset.health=asset.state;
      let health=$('.v54-health',card);
      if(!health){
        health=document.createElement('button');
        health.type='button';
        health.className='v54-health';
        $('.v52-media-copy',card)?.appendChild(health);
      }
      health.textContent=label(asset.state);
      health.title=asset.issues.map(i=>i.message).join(' · ')||'Asset metadata passed v54 checks';
      health.onclick=e=>{e.stopPropagation();selected=asset.assetId;open=true;render();};
    });
  }

  function refreshMountState(){
    report.assets.forEach(a=>a.mounted=!!document.querySelector(`[data-asset-id="${CSS.escape(a.assetId)}"]`));
  }

  function label(s){return ({healthy:'HEALTHY','fallback-ready':'FALLBACK READY',warning:'WARNING',error:'ERROR'})[s]||s.toUpperCase();}

  function renderBadge(){
    const el=$('#v54HealthBadge'); if(!el)return;
    const page=pageAssets().map(a=>report.assets.find(x=>x.assetId===a.assetId)).filter(Boolean);
    const bad=page.filter(a=>a.state==='warning'||a.state==='error').length;
    $('b',el).textContent=bad?`${bad} issue${bad===1?'':'s'}`:`${page.length} checked`;
  }

  function render(){
    let root=$('#v54Health');
    if(!root){root=document.createElement('aside');root.id='v54Health';document.body.appendChild(root);}
    const page=pageAssets().map(a=>report.assets.find(x=>x.assetId===a.assetId)).filter(Boolean);
    const visible=page.length?page:report.assets;
    const asset=report.assets.find(a=>a.assetId===selected)||visible[0];
    const issueCount=visible.filter(a=>a.state==='warning'||a.state==='error').length;
    root.innerHTML=`
      <button id="v54HealthBadge" class="v54-health-badge" aria-expanded="${open}"><span>ASSET HEALTH · v${VERSION}</span><b>${issueCount?`${issueCount} issues`:`${visible.length} checked`}</b></button>
      <section class="v54-panel ${open?'is-open':''}" aria-hidden="${!open}">
        <div class="v54-head"><div><small>MEDIA PIPELINE</small><h3>Asset health check</h3></div><button id="v54Close" aria-label="Close">×</button></div>
        <div class="v54-score"><strong>${healthScore()}%</strong><div><b>Pipeline integrity</b><span>${report.totals.error} errors · ${report.totals.warning} warnings · ${report.totals['fallback-ready']} fallback-ready</span></div></div>
        <div class="v54-stats"><div><b>${registry.summary.assets}</b><span>registry</span></div><div><b>${report.assets.filter(a=>a.mounted).length}</b><span>mounted</span></div><div><b>${registry.summary.verifiedLocal}</b><span>verified local</span></div></div>
        <div class="v54-list">${visible.map(a=>`<button class="v54-row ${asset?.assetId===a.assetId?'is-active':''}" data-id="${esc(a.assetId)}"><i class="state-${esc(a.state)}"></i><span>${esc(a.title)}</span><em>${label(a.state)}</em></button>`).join('')}</div>
        ${asset?detail(asset):''}
      </section>`;
    $('#v54HealthBadge',root)?.addEventListener('click',()=>{open=!open;render();});
    $('#v54Close',root)?.addEventListener('click',()=>{open=false;render();});
    $$('.v54-row',root).forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.id;render();}));
  }

  function healthScore(){
    const n=report.assets.length||1;
    const deduction=report.totals.error*12+report.totals.warning*5+report.totals['fallback-ready']*1.2;
    return Math.max(0,Math.round(100-deduction/n));
  }

  function detail(a){
    const issues=a.issues.length?a.issues.map(i=>`<li class="${esc(i.level)}"><b>${esc(i.code)}</b>${esc(i.message)}</li>`).join(''):'<li class="ok"><b>schema</b>Metadata passes all v54 rules</li>';
    return `<div class="v54-detail"><small>ASSET INSPECTOR</small><h4>${esc(a.title)}</h4><div class="v54-tags"><span>${label(a.state)}</span><span>${a.width}×${a.height}</span><span>${esc(a.aspectRatio)}</span><span>${a.localPath?'LOCAL':'RUNTIME FALLBACK'}</span></div><ul>${issues}</ul><p><b>${esc(a.assetId)}</b><br>${esc(a.alt)}</p></div>`;
  }
})();