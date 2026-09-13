const KEY='webdesk:v2:workspaces:v1';
const DEFAULT_ID='default';

function clone(v){return JSON.parse(JSON.stringify(v))}
function safeParse(raw,fallback){try{return raw?JSON.parse(raw):fallback}catch{return fallback}}
function normalizeCards(cards){return Array.isArray(cards)?cards.filter(x=>x&&typeof x.id==='string').map(x=>({id:x.id,...['x','y','w','h'].reduce((o,k)=>(Number.isFinite(x[k])&&(o[k]=Math.round(x[k])),o),{})})):[]}
function fresh(){return {version:1,activeId:DEFAULT_ID,items:[{id:DEFAULT_ID,name:'工作區 1',cards:[],background:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}]}}
function normalize(data){
  if(!data||data.version!==1||!Array.isArray(data.items)||!data.items.length)return fresh();
  const seen=new Set(),items=[];
  for(const item of data.items){if(!item||typeof item.id!=='string'||seen.has(item.id))continue;seen.add(item.id);items.push({id:item.id,name:String(item.name||'工作區'),cards:normalizeCards(item.cards),background:item.background||null,createdAt:item.createdAt||new Date().toISOString(),updatedAt:item.updatedAt||new Date().toISOString()})}
  if(!items.length)return fresh();
  const activeId=items.some(x=>x.id===data.activeId)?data.activeId:items[0].id;
  return {version:1,activeId,items};
}
function save(state){const normalized=normalize(state);try{localStorage.setItem(KEY,JSON.stringify(normalized))}catch(error){console.warn('[WebDesk V2 workspace]',error)}return normalized}
export function loadWorkspaces(){return normalize(safeParse(localStorage.getItem(KEY),null))}
export function getActiveWorkspace(state){return state.items.find(x=>x.id===state.activeId)||state.items[0]}
export function updateActiveWorkspace(state,patch){const next=clone(state),item=getActiveWorkspace(next);Object.assign(item,patch,{updatedAt:new Date().toISOString()});return save(next)}
export function createWorkspace(state,name){const next=clone(state),id=`ws-${Date.now().toString(36)}`;next.items.push({id,name:String(name||`工作區 ${next.items.length+1}`),cards:[],background:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});next.activeId=id;return save(next)}
export function renameWorkspace(state,id,name){const next=clone(state),item=next.items.find(x=>x.id===id);if(item)item.name=String(name||item.name).trim()||item.name;return save(next)}
export function duplicateWorkspace(state,id){const next=clone(state),source=next.items.find(x=>x.id===id);if(!source)return save(next);const copy=clone(source);copy.id=`ws-${Date.now().toString(36)}`;copy.name=`${source.name} 副本`;copy.createdAt=copy.updatedAt=new Date().toISOString();next.items.push(copy);next.activeId=copy.id;return save(next)}
export function deleteWorkspace(state,id){const next=clone(state);if(next.items.length===1){next.items[0].cards=[];next.items[0].background=null;return save(next)}next.items=next.items.filter(x=>x.id!==id);if(next.activeId===id)next.activeId=next.items[0].id;return save(next)}
export function switchWorkspace(state,id){const next=clone(state);if(next.items.some(x=>x.id===id))next.activeId=id;return save(next)}
export function pruneWorkspaceCards(state,index){const next=clone(state);for(const ws of next.items)ws.cards=ws.cards.filter(x=>index.has(x.id));return save(next)}
