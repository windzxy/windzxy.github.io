(function(){
'use strict';
const VER='20260904-basic-tools-export-v1.5-table-parser';
if(window.__webdeskBasicToolsExport===VER)return;
window.__webdeskBasicToolsExport=VER;

function download(name,text,type){
  const blob=new Blob([text],{type:type||'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),500);
}
function stamp(){return new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}
function button(label,handler){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.basicExport='1';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();handler()});return b}
function textValue(root){const out=root.querySelector('#textOut')?.value||'';return out.trim()?out:(root.querySelector('#appText')?.value||'')}
function csvCell(v){v=String(v??'');return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
function parseDelimited(raw,separator){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<raw.length;i++){
    const ch=raw[i];
    if(ch==='"'){
      if(quoted&&raw[i+1]==='"'){cell+='"';i++;continue}
      if(quoted){quoted=false;continue}
      if(cell===''){quoted=true;continue}
      cell+=ch;continue;
    }
    if(!quoted&&ch===separator){row.push(cell);cell='';continue}
    if(!quoted&&(ch==='\n'||ch==='\r')){
      if(ch==='\r'&&raw[i+1]==='\n')i++;
      row.push(cell);rows.push(row);row=[];cell='';continue;
    }
    cell+=ch;
  }
  if(cell!==''||row.length||raw.length){row.push(cell);rows.push(row)}
  return rows;
}
function rowsToCsv(raw,separator){return parseDelimited(raw,separator).map(r=>r.map(csvCell).join(',')).join('\r\n')}
function detectDelimiter(raw){
  const counts={'\t':0,'|':0,',':0};let quoted=false,cellStart=true;
  const limit=Math.min(raw.length,8192);
  for(let i=0;i<limit;i++){
    const ch=raw[i];
    if(ch==='"'){
      if(quoted&&raw[i+1]==='"'){i++;continue}
      if(quoted){quoted=false;continue}
      if(cellStart){quoted=true;continue}
    }
    if(!quoted&&(ch==='\t'||ch==='|'||ch===',')){counts[ch]++;cellStart=true;continue}
    if(!quoted&&(ch==='\n'||ch==='\r')){cellStart=true;continue}
    cellStart=false;
  }
  const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  return ranked[0][1]?ranked[0][0]:',';
}
function selectedSeparator(root){
  const selected=root.querySelector('#tableDelim')?.value||'auto';
  if(selected==='\t'||selected==='|')return selected;
  if(selected===',')return ',';
  return detectDelimiter(root.querySelector('#appTableInput')?.value||'');
}
function parsedTableRows(root){
  const raw=root.querySelector('#appTableInput')?.value||'';
  const rows=parseDelimited(raw,selectedSeparator(root));
  const q=(root.querySelector('#tableSearch')?.value||'').trim().toLowerCase();
  return rows.filter((row,index)=>!q||index===0||row.join(' ').toLowerCase().includes(q));
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function renderParsedTable(root){
  const out=root.querySelector('#tableOutput');if(!out)return;
  const rows=parsedTableRows(root);
  out.innerHTML='<table>'+rows.map((row,i)=>'<tr>'+row.map(cell=>(i?'<td>':'<th>')+escapeHtml(cell)+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</table>';
}
function tableMarkdown(root){
  const rows=parsedTableRows(root);if(!rows.length)return '';
  const esc=v=>String(v??'').replace(/\|/g,'\\|').replace(/\r?\n/g,'<br>');
  return '| '+rows[0].map(esc).join(' | ')+' |\n| '+rows[0].map(()=>'---').join(' | ')+' |\n'+rows.slice(1).map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n');
}
function tableJoin(root,separator){return parsedTableRows(root).map(r=>r.map(v=>separator===','?csvCell(v):String(v??'').replace(/\r?\n/g,' ')).join(separator)).join('\n')}
function tableCsv(root){
  const table=root.querySelector('#tableOutput table');
  if(table){return [...table.querySelectorAll('tr')].map(tr=>[...tr.children].map(td=>csvCell(td.textContent.trim())).join(',')).join('\r\n')}
  const raw=root.querySelector('#appTableInput')?.value||'';
  return rowsToCsv(raw,selectedSeparator(root));
}
function jsonValue(root){
  const raw=root.querySelector('#jsonInput')?.value||'';
  try{return JSON.stringify(JSON.parse(raw),null,2)+'\n'}catch(err){
    const out=root.querySelector('#jsonOutput');if(out)out.textContent='JSON 錯誤：'+err.message;
    return null;
  }
}
function enhanceText(root){if(root.dataset.exportReady)return;root.dataset.exportReady=VER;const actions=root.querySelector('.text-actions');if(!actions)return;const run=()=>download('webdesk-text-'+stamp()+'.txt',textValue(root));actions.appendChild(button('下載 TXT',run));bindSave(root,run)}
function enhanceTable(root){
  if(root.dataset.exportReady===VER)return;
  root.dataset.exportReady=VER;
  const actions=root.querySelector('.app-actions');if(!actions)return;
  const out=root.querySelector('#tableOutput');
  const preview=root.querySelector('#tablePreview'),markdown=root.querySelector('#tableMarkdown'),csv=root.querySelector('#tableCsv'),tsv=root.querySelector('#tableTsv'),search=root.querySelector('#tableSearch');
  if(preview)preview.onclick=()=>renderParsedTable(root);
  if(markdown)markdown.onclick=()=>{if(out)out.innerHTML='<pre>'+escapeHtml(tableMarkdown(root))+'</pre>'};
  if(csv)csv.onclick=()=>{if(out)out.innerHTML='<pre>'+escapeHtml(tableJoin(root,','))+'</pre>'};
  if(tsv)tsv.onclick=()=>{if(out)out.innerHTML='<pre>'+escapeHtml(tableJoin(root,'\t'))+'</pre>'};
  if(search)search.oninput=()=>renderParsedTable(root);
  const run=()=>download('webdesk-table-'+stamp()+'.csv','\ufeff'+tableCsv(root),'text/csv;charset=utf-8');
  if(!actions.querySelector('[data-basic-export="1"]'))actions.appendChild(button('下載 CSV',run));
  bindSave(root,run);
}
function enhanceJson(root){if(root.dataset.exportReady)return;root.dataset.exportReady=VER;const actions=root.querySelector('.app-actions');if(!actions)return;const run=()=>{const value=jsonValue(root);if(value!==null)download('webdesk-data-'+stamp()+'.json',value,'application/json;charset=utf-8')};actions.appendChild(button('下載 JSON',run));bindSave(root,run)}
function bindSave(root,run){if(root.dataset.exportSaveBound===VER)return;root.dataset.exportSaveBound=VER;root.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();run()}})}
function run(){document.querySelectorAll('.text-app').forEach(enhanceText);document.querySelectorAll('.table-app').forEach(enhanceTable);document.querySelectorAll('.json-app').forEach(enhanceJson)}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
