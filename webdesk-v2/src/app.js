import {loadRegistry,registryIndex} from '../core/registry.js';
import {createPlatformResolver} from '../core/platform.js';
import {mountCard,unmountCard,bindCardRecovery} from '../core/card-host.js';

const $=s=>document.querySelector(s);
const desktop=$('#desktop'),drawer=$('#drawer'),library=$('#toolLibrary'),dock=$('#quickDock');
const state={cards:[],registry:null,index:new Map(),platform:null};
const platformResolver=createPlatformResolver();
state.platform=platformResolver.get();

function title(card){return card?.name?.['zh-HK']||card?.name?.['zh-CN']||card?.id||'Card'}
function description(card){return card?.description?.['zh-HK']||card?.description?.['zh-CN']||''}
function sizeFor(card){return card?.defaultSize?.[state.platform.name]||{width:320,height:180}}
function placed(id){return state.cards.some(x=>x.id===id)}

function createHost(item,card){
  const host=document.createElement('article');
  const size=sizeFor(card);
  host.className='wd-card';host.dataset.cardHost='1';host.dataset.id=card.id;host._manifest=card;
  if(state.platform.name==='desktop'){
    host.style.left=`${item.x||24}px`;host.style.top=`${item.y||24}px`;host.style.width=`${item.w||size.width}px`;host.style.minHeight=`${size.height}px`;
  }
  host.innerHTML=`<header class="wd-card-head"><div class="wd-card-title"><span class="wd-card-icon">${card.icon||'•'}</span><span>${title(card)}</span></div><button data-remove="${card.id}" aria-label="移除">×</button></header><div class="wd-card-mount" data-card-mount></div>`;
  return host;
}

async function renderDesktop(){
  const old=[...desktop.querySelectorAll('[data-card-host]')];
  await Promise.all(old.map(unmountCard));
  desktop.replaceChildren();
  for(const item of state.cards){
    const card=state.index.get(item.id);if(!card)continue;
    const shell=createHost(item,card);desktop.appendChild(shell);
    await mountCard(shell.querySelector('[data-card-mount]'),card,state.platform.name);
  }
  bindCards();
}

function renderLibrary(q=''){
  const text=q.trim().toLowerCase();
  const cards=(state.registry?.cards||[]).filter(card=>!text||`${title(card)} ${description(card)} ${card.category}`.toLowerCase().includes(text));
  library.innerHTML=cards.length?cards.map(card=>`<div class="wd-tool"><span class="wd-card-icon">${card.icon||'•'}</span><div><strong>${title(card)}</strong><small>${card.category} · ${description(card)}</small></div><button data-add="${card.id}" ${placed(card.id)?'disabled':''}>${placed(card.id)?'已加入':'加入'}</button></div>`).join(''):'<p class="wd-empty">目前沒有可用卡片</p>';
  library.querySelectorAll('[data-add]:not([disabled])').forEach(button=>button.onclick=()=>{const card=state.index.get(button.dataset.add);const size=sizeFor(card);state.cards.push({id:card.id,x:28+state.cards.length*26,y:34+state.cards.length*26,w:size.width});renderDesktop();renderLibrary($('#toolSearch').value);drawer.classList.remove('open')});
}

function renderDock(){
  const cards=(state.registry?.cards||[]).slice(0,3);
  dock.innerHTML=cards.map(card=>`<button data-quick-add="${card.id}" title="${title(card)}">${card.icon||'•'}</button>`).join('')+'<button data-action="library" title="功能中心">＋</button>';
}

function bindCards(){
  desktop.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>{state.cards=state.cards.filter(card=>card.id!==button.dataset.remove);renderDesktop();renderLibrary($('#toolSearch').value)});
  if(state.platform.name!=='desktop')return;
  desktop.querySelectorAll('.wd-card-head').forEach(head=>{head.onpointerdown=e=>{if(e.target.closest('button'))return;const shell=head.closest('.wd-card'),item=state.cards.find(x=>x.id===shell.dataset.id);const sx=e.clientX,sy=e.clientY,ox=item.x||0,oy=item.y||0;head.setPointerCapture(e.pointerId);const move=ev=>{item.x=Math.max(0,ox+ev.clientX-sx);item.y=Math.max(0,oy+ev.clientY-sy);shell.style.left=item.x+'px';shell.style.top=item.y+'px';desktop.style.minHeight=Math.max(innerHeight,item.y+shell.offsetHeight+160)+'px'};const up=()=>{head.removeEventListener('pointermove',move);head.removeEventListener('pointerup',up)};head.addEventListener('pointermove',move);head.addEventListener('pointerup',up,{once:true})}});
}

function openApp(id){const card=state.index.get(id);if(!card)return;$('#windowLayer').innerHTML=`<section class="wd-window"><header class="wd-window-head"><strong>${card.icon||'•'} ${title(card)}</strong><button data-close-window>關閉</button></header><div class="wd-window-body"><h2>${title(card)}</h2><p>${description(card)}</p><p>V2 App Host 尚在遷移中；Card 已使用獨立三端模組。</p></div></section>`;$('#windowLayer [data-close-window]').onclick=()=>$('#windowLayer').replaceChildren()}

document.addEventListener('webdesk:open-app',e=>openApp(e.detail?.id));
document.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(action==='library')drawer.classList.add('open');if(action==='close-drawer')drawer.classList.remove('open');const quick=e.target.closest('[data-quick-add]')?.dataset.quickAdd;if(quick&&!placed(quick)){const card=state.index.get(quick),size=sizeFor(card);state.cards.push({id:quick,x:32,y:32,w:size.width});renderDesktop();renderLibrary($('#toolSearch').value)}});
$('#toolSearch').addEventListener('input',e=>renderLibrary(e.target.value));
bindCardRecovery(document,()=>state.platform.name);
platformResolver.subscribe(next=>{state.platform=next;renderDesktop();renderLibrary($('#toolSearch').value)});

async function boot(){
  try{
    state.registry=await loadRegistry();state.index=registryIndex(state.registry);
    const first=state.registry.cards[0];if(first)state.cards=[{id:first.id,x:32,y:32,w:sizeFor(first).width}];
    renderDock();renderLibrary();await renderDesktop();
  }catch(error){console.error(error);library.innerHTML='<p class="wd-empty">Card Registry 載入失敗</p>';}
}
boot();
