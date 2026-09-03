(function(){
'use strict';
const VER='20260903-basic-tools-export-v1';
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
function tableCsv(root){
  const table=root.querySelector('#tableOutput table');
  if(table){return [...table.querySelectorAll('tr')].map(tr=>[...tr.children].map(td=>csvCell(td.textContent.trim())).join(',')).join('\n')}
  const raw=root.querySelector('#appTableInput')?.value||'';
  const delim=root.querySelector('#tableDelim')?.value||'auto';
  if(delim==='\t')return raw.split(/\r?\n/).map(r=>r.split('\t').map(csvCell).join(',')).join('\n');
  if(delim==='|')return raw.split(/\r?\n/).map(r=>r.split('|').map(csvCell).join(',')).join('\n');
  return raw;
}
function jsonValue(root){
  const raw=root.querySelector('#jsonInput')?.value||'';
  try{return JSON.stringify(JSON.parse(raw),null,2)}catch(err){
    const out=root.querySelector('#jsonOutput');if(out)out.textContent='JSON 錯誤：'+err.message;
    return null;
  }
}
function enhanceText(root){if(root.dataset.exportReady)return;root.dataset.exportReady=VER;const actions=root.querySelector('.text-actions');if(!actions)return;const run=()=>download('webdesk-text-'+stamp()+'.txt',textValue(root));actions.appendChild(button('下載 TXT',run));bindSave(root,run)}
function enhanceTable(root){if(root.dataset.exportReady)return;root.dataset.exportReady=VER;const actions=root.querySelector('.app-actions');if(!actions)return;const run=()=>download('webdesk-table-'+stamp()+'.csv','\ufeff'+tableCsv(root),'text/csv;charset=utf-8');actions.appendChild(button('下載 CSV',run));bindSave(root,run)}
function enhanceJson(root){if(root.dataset.exportReady)return;root.dataset.exportReady=VER;const actions=root.querySelector('.app-actions');if(!actions)return;const run=()=>{const value=jsonValue(root);if(value!==null)download('webdesk-data-'+stamp()+'.json',value,'application/json;charset=utf-8')};actions.appendChild(button('下載 JSON',run));bindSave(root,run)}
function bindSave(root,run){root.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();run()}})}
function run(){document.querySelectorAll('.text-app').forEach(enhanceText);document.querySelectorAll('.table-app').forEach(enhanceTable);document.querySelectorAll('.json-app').forEach(enhanceJson)}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
