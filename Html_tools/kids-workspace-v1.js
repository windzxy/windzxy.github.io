(function(){
'use strict';
const VER='20260901-kids-workspace-v1';
if(window.__windzxyKidsWorkspaceV1===VER)return;
window.__windzxyKidsWorkspaceV1=VER;
const STORE_KEY='windzxy-web-desktop-workspaces';
const MIGRATE_KEY='windzxy-kids-workspace-v1-migrated';
const KIDS_ID='kids';
function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v}}
function buildKids(){return {id:KIDS_ID,name:'Kids',hint:'課程表優先，快速查看現在、下一節與今天剩餘安排。',cards:[{id:'kids-class-schedule-main',appId:'class-schedule',x:32,y:32,w:760,h:700,collapsed:false,data:{scheduleView:'day'}}]};}
function read(){try{const v=localStorage.getItem(STORE_KEY);return v?JSON.parse(v):null}catch(e){return null}}
function write(list){try{localStorage.setItem(STORE_KEY,JSON.stringify(list))}catch(e){}}
function install(){
  let list=[];
  try{if(Array.isArray(workspaces))list=workspaces}catch(e){}
  if(!list.length){const saved=read();if(Array.isArray(saved))list=saved}
  const migrated=localStorage.getItem(MIGRATE_KEY)==='1';
  const exists=list.some(ws=>ws&&ws.id===KIDS_ID);
  if(!exists&&!migrated){
    const kids=buildKids();
    list=[...clone(list),kids];
    try{workspaces=list}catch(e){}
    write(list);
    try{if(typeof save==='function')save()}catch(e){}
    localStorage.setItem(MIGRATE_KEY,'1');
    try{if(typeof renderAll==='function')renderAll();else{renderWorkspaces?.();renderDesktop?.();}}catch(e){}
  }else{
    localStorage.setItem(MIGRATE_KEY,'1');
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});else setTimeout(install,0);
window.WebDeskKidsWorkspace={version:'v1',workspaceId:KIDS_ID,defaultApp:'class-schedule'};
})();