const PREFIX='webdesk:v2';
const SHELL_KEY=`${PREFIX}:shell:v1`;

function safeParse(raw,fallback){
  if(raw==null)return fallback;
  try{return JSON.parse(raw)}catch{return fallback}
}

function normalizeCard(item){
  if(!item||typeof item.id!=='string'||!item.id)return null;
  const n={id:item.id};
  for(const key of ['x','y','w','h'])if(Number.isFinite(item[key]))n[key]=Math.round(item[key]);
  if(item.userSized===true)n.userSized=true;
  return n;
}

export function loadShellState(){
  const raw=safeParse(localStorage.getItem(SHELL_KEY),null);
  if(!raw||raw.version!==1||!Array.isArray(raw.cards))return {version:1,cards:[]};
  const cards=raw.cards.map(normalizeCard).filter(Boolean);
  return {version:1,cards};
}

export function saveShellState(input){
  const cards=Array.isArray(input?.cards)?input.cards.map(normalizeCard).filter(Boolean):[];
  const payload={version:1,cards,updatedAt:new Date().toISOString()};
  try{localStorage.setItem(SHELL_KEY,JSON.stringify(payload))}catch(error){console.warn('[WebDesk V2 storage]',error)}
  return payload;
}

export function pruneMissingCards(state,registryIndex){
  const cards=(state?.cards||[]).filter(item=>registryIndex.has(item.id));
  return {...state,cards};
}

export function clearShellState(){
  try{localStorage.removeItem(SHELL_KEY)}catch{}
}
