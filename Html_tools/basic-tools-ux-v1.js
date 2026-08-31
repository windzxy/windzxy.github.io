(()=>{
'use strict';
if(window.__basicToolsUxV2)return;window.__basicToolsUxV2=1;
const css='.basic-tool-status{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:10px;padding:8px 10px;border-radius:12px;background:rgba(127,127,127,.08);font-size:12px}.basic-tool-status strong{font-weight:700}.basic-tool-status small{opacity:.72}.basic-tool-status.ok strong{color:#2d9b63}.basic-tool-status.bad strong{color:#d75a5a}.table-app #appTableInput,.json-app #jsonInput{min-height:180px;resize:vertical}.table-app #tableOutput,.json-app #jsonOutput{min-height:150px;max-height:40vh;overflow:auto}';
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
function byteSize(v){try{return new Blob([v]).size}catch{return String(v||'').length}}
function detectTable(value){const lines=String(value||'').trim()?String(value).trim().split(/\r?\n/):[];if(!lines.length)return {rows:0,cols:0,sep:''};const head=lines[0];const options=[['TAB','\t'],['CSV',','],['PIPE','|'],['SEMICOLON',';']];let best=['', ''],score=0;for(const x of options){const n=head.split(x[1]).length;if(n>score&&n>1){best=x;score=n}}return {rows:Math.max(0,lines.length-1),cols:score||1,sep:best[0]||'PLAIN'}}
function jsonMeta(value){const text=String(value||'');if(!text.trim())return {empty:true};try{const data=JSON.parse(text);const type=Array.isArray(data)?'Array':data===null?'Null':typeof data==='object'?'Object':typeof data;const count=Array.isArray(data)?data.length:data&&typeof data==='object'?Object.keys(data).length:1;return {ok:true,type,count,bytes:byteSize(text)}}catch(err){const m=String(err?.message||'').match(/position\s+(\d+)/i);let line='',col='';if(m){const pos=Number(m[1]),before=text.slice(0,pos),parts=before.split(/\r?\n/);line=parts.length;col=parts[parts.length-1].length+1}return {ok:false,line,col,message:String(err?.message||'JSON parse error')}}}
function enhance(root){
 if(root.matches?.('.table-app')&&!root.dataset.ux2){
  const input=root.querySelector('#appTableInput'),preview=root.querySelector('#tablePreview');if(!input||!preview)return;root.dataset.ux2='1';
  const s=document.createElement('div');s.className='basic-tool-status';s.innerHTML='<strong>等待資料</strong><small>Ctrl/⌘ + Enter 預覽</small>';input.closest('.app-panel')?.appendChild(s);
  const refresh=()=>{const m=detectTable(input.value);s.querySelector('strong').textContent=m.rows||input.value.trim()?`${m.rows} rows × ${m.cols} cols · ${m.sep}`:'等待資料';s.querySelector('small').textContent=input.value.trim()?`${byteSize(input.value)} bytes · Ctrl/⌘ + Enter 預覽`:'Ctrl/⌘ + Enter 預覽'};input.addEventListener('input',refresh);input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();preview.click();refresh()}});refresh();
 }
 if(root.matches?.('.json-app')&&!root.dataset.ux2){
  const input=root.querySelector('#jsonInput'),format=root.querySelector('#jsonFormat');if(!input||!format)return;root.dataset.ux2='1';
  const s=document.createElement('div');s.className='basic-tool-status';s.innerHTML='<strong>等待 JSON</strong><small>Ctrl/⌘ + Enter 格式化</small>';input.closest('.app-panel')?.appendChild(s);
  const refresh=()=>{const m=jsonMeta(input.value);s.classList.remove('ok','bad');if(m.empty){s.querySelector('strong').textContent='等待 JSON';s.querySelector('small').textContent='Ctrl/⌘ + Enter 格式化';return}if(m.ok){s.querySelector('strong').textContent=`JSON 有效 · ${m.type} · ${m.count} item${m.count===1?'':'s'}`;s.querySelector('small').textContent=`${m.bytes} bytes · Ctrl/⌘ + Enter 格式化`;s.classList.add('ok')}else{s.querySelector('strong').textContent=m.line?`JSON 錯誤 · L${m.line}:C${m.col}`:'JSON 有錯誤';s.querySelector('small').textContent=m.message;s.classList.add('bad')}};input.addEventListener('input',refresh);input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();format.click();setTimeout(refresh,0)}});refresh();
 }
}
function scan(n=document){n.querySelectorAll?.('.table-app,.json-app').forEach(enhance)}scan();new MutationObserver(rs=>rs.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1){enhance(n);scan(n)}}))).observe(document.body,{childList:true,subtree:true});
})();
