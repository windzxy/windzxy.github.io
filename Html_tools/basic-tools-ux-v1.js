(()=>{
'use strict';
if(window.__basicToolsUxV1)return;window.__basicToolsUxV1=1;
const css='.basic-tool-status{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:10px;padding:8px 10px;border-radius:12px;background:rgba(127,127,127,.08);font-size:12px}.basic-tool-status.ok strong{color:#2d9b63}.basic-tool-status.bad strong{color:#d75a5a}.table-app #appTableInput,.json-app #jsonInput{min-height:180px;resize:vertical}.table-app #tableOutput,.json-app #jsonOutput{min-height:150px;max-height:40vh;overflow:auto}';
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
function enhance(root){
 if(root.matches?.('.table-app')&&!root.dataset.ux1){
  const input=root.querySelector('#appTableInput'),preview=root.querySelector('#tablePreview');if(!input||!preview)return;root.dataset.ux1='1';
  const s=document.createElement('div');s.className='basic-tool-status';s.innerHTML='<strong>等待資料</strong><small>Ctrl/⌘ + Enter 預覽</small>';input.closest('.app-panel')?.appendChild(s);
  const refresh=()=>{const lines=input.value.trim()?input.value.trim().split(/\r?\n/):[];s.querySelector('strong').textContent=lines.length?`${Math.max(0,lines.length-1)} rows`:'等待資料'};input.addEventListener('input',refresh);input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();preview.click();refresh()}});refresh();
 }
 if(root.matches?.('.json-app')&&!root.dataset.ux1){
  const input=root.querySelector('#jsonInput'),format=root.querySelector('#jsonFormat');if(!input||!format)return;root.dataset.ux1='1';
  const s=document.createElement('div');s.className='basic-tool-status';s.innerHTML='<strong>等待 JSON</strong><small>Ctrl/⌘ + Enter 格式化</small>';input.closest('.app-panel')?.appendChild(s);
  const refresh=()=>{s.classList.remove('ok','bad');if(!input.value.trim()){s.querySelector('strong').textContent='等待 JSON';return}try{JSON.parse(input.value);s.querySelector('strong').textContent='JSON 有效';s.classList.add('ok')}catch(e){s.querySelector('strong').textContent='JSON 有錯誤';s.classList.add('bad')}};input.addEventListener('input',refresh);input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();format.click();refresh()}});refresh();
 }
}
function scan(n=document){n.querySelectorAll?.('.table-app,.json-app').forEach(enhance)}scan();new MutationObserver(rs=>rs.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1){enhance(n);scan(n)}}))).observe(document.body,{childList:true,subtree:true});
})();
