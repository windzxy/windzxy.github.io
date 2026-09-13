const APPS=[
{id:'weather',title:'天氣',icon:'☁',group:'即時資訊',summary:'即時天氣與預報',live:'24°C · 多雲'},
{id:'typhoon',title:'全球氣象',icon:'🌦️',group:'即時資訊',summary:'風場 / 雷達 / 衛星 / 颱風',live:'風場 · 雷達 · 衛星'},
{id:'image',title:'圖片處理',icon:'◎',group:'生產力',summary:'裁切、去背景、壓縮、OCR'},
{id:'text',title:'文字整理',icon:'Aa',group:'生產力',summary:'清理、統計、簡繁轉換'},
{id:'table',title:'表格轉換',icon:'▦',group:'生產力',summary:'CSV / TSV / Markdown'},
{id:'json',title:'JSON 工具',icon:'{}',group:'生產力',summary:'格式化、驗證、Path'},
{id:'date',title:'日期計算',icon:'31',group:'實用工具',summary:'日期差與工作日'}
];
const state={cards:[
{id:'typhoon',x:32,y:32,w:360},
{id:'weather',x:420,y:32,w:330},
{id:'image',x:32,y:230,w:330}
]};
const $=s=>document.querySelector(s);
const desktop=$('#desktop'),drawer=$('#drawer'),library=$('#toolLibrary');
function app(id){return APPS.find(x=>x.id===id)}
function cardTemplate(item){const a=app(item.id);return `<article class="wd-card" data-id="${a.id}" style="left:${item.x||0}px;top:${item.y||0}px;width:${item.w||320}px"><header class="wd-card-head"><div class="wd-card-title"><span class="wd-card-icon">${a.icon}</span><span>${a.title}</span></div><button data-remove="${a.id}" aria-label="移除">×</button></header><div class="wd-card-body"><div class="wd-live"><strong>${a.live||a.summary}</strong><small>${a.summary}</small></div><button class="wd-card-cta" data-open="${a.id}">打開 ${a.title}</button></div></article>`}
function renderDesktop(){desktop.innerHTML=state.cards.map(cardTemplate).join('');bindCards()}
function renderLibrary(q=''){const text=q.trim().toLowerCase();library.innerHTML=APPS.filter(a=>!text||`${a.title} ${a.summary} ${a.group}`.toLowerCase().includes(text)).map(a=>`<div class="wd-tool"><span class="wd-card-icon">${a.icon}</span><div><strong>${a.title}</strong><small style="display:block;color:#667085">${a.group} · ${a.summary}</small></div><button data-add="${a.id}">加入</button></div>`).join('');library.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{if(!state.cards.some(c=>c.id===b.dataset.add)){state.cards.push({id:b.dataset.add,x:40+state.cards.length*22,y:80+state.cards.length*22,w:330});renderDesktop()}drawer.classList.remove('open')})}
function openWindow(id){const a=app(id);const layer=$('#windowLayer');layer.innerHTML=`<section class="wd-window" data-window="${id}"><header class="wd-window-head"><strong>${a.icon} ${a.title}</strong><button data-close-window>關閉</button></header><div class="wd-window-body"><h2>${a.title}</h2><p>${a.summary}</p><p>這裡是 V2 的 App 容器。後續會把現有功能逐一遷移進獨立模組，不再直接嵌在桌面卡片裡。</p></div></section>`;layer.querySelector('[data-close-window]').onclick=()=>layer.innerHTML=''}
function bindCards(){desktop.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openWindow(b.dataset.open));desktop.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.cards=state.cards.filter(c=>c.id!==b.dataset.remove);renderDesktop()});if(innerWidth>820)desktop.querySelectorAll('.wd-card-head').forEach(head=>{head.onpointerdown=e=>{if(e.target.closest('button'))return;const card=head.closest('.wd-card'),item=state.cards.find(x=>x.id===card.dataset.id);const sx=e.clientX,sy=e.clientY,ox=item.x||0,oy=item.y||0;head.setPointerCapture(e.pointerId);const move=ev=>{item.x=Math.max(0,ox+ev.clientX-sx);item.y=Math.max(0,oy+ev.clientY-sy);card.style.left=item.x+'px';card.style.top=item.y+'px';desktop.style.minHeight=Math.max(innerHeight,item.y+card.offsetHeight+160)+'px'};const up=()=>{head.removeEventListener('pointermove',move);head.removeEventListener('pointerup',up)};head.addEventListener('pointermove',move);head.addEventListener('pointerup',up,{once:true})}})}
document.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(action==='library')drawer.classList.add('open');if(action==='close-drawer')drawer.classList.remove('open');const id=e.target.closest('[data-app]')?.dataset.app;if(id)openWindow(id)});$('#toolSearch').addEventListener('input',e=>renderLibrary(e.target.value));addEventListener('resize',renderDesktop,{passive:true});renderLibrary();renderDesktop();