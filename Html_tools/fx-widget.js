(function(){
  if(window.__windzxyFxWidgetLoaded)return;
  window.__windzxyFxWidgetLoaded=1;

  const APP='fx-rates';
  const VER='20260819-fx-widget4-boc-compact-converter';
  const DEFAULT_W=460,DEFAULT_H=300,MIN_W=300,MIN_H=210;
  const REFRESH_MS=30*1000;
  const BOC_URL='https://www.boc.cn/sourcedb/whpj/';
  const JSON_URL='data/boc-fx.json';
  const AMOUNT_KEY='windzxy-fx-cny-amount';
  const WATCH=[
    {name:'港币',display:'港幣',code:'HKD',flag:'HK'},
    {name:'美元',display:'美元',code:'USD',flag:'US'},
    {name:'日元',display:'日元',code:'JPY',flag:'JP'},
    {name:'韩国元',display:'韓國元',code:'KRW',flag:'KR'},
    {name:'土耳其里拉',display:'土耳其里拉',code:'TRY',flag:'TR'}
  ];

  let state={rows:[],prevRows:[],date:'--',time:'--',source:'中國銀行',status:'等待牌價快照',ok:false,ts:0,error:'',fetchedAt:''};
  let amount=readAmount();
  let timer=null,busy=false,patched=false;

  function boot(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'||typeof bodyHtml==='undefined'||typeof save==='undefined'){
      setTimeout(boot,80);return;
    }
    installStyle();installApp();patch();ensureCard();renderAll();afterRender();start();window.windzxyRefreshFx=()=>refresh(true);
  }

  function installApp(){
    const info={id:APP,kind:'widget',title:'匯率',desc:'中國銀行外匯牌價：緊湊三欄表格 + 人民幣換算。',icon:'FX',tone:'t-fx'};
    const old=apps.find(a=>a.id===APP);old?Object.assign(old,info):apps.push(info);
    if(typeof defaults!=='undefined')defaults.forEach(ws=>{
      if(ws.id==='daily'&&!ws.cards.some(c=>c.appId===APP))ws.cards.push({id:'daily-fx-0',appId:APP,x:60,y:420,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
    });
  }
  function ensureCard(){try{const ws=activeWorkspace();if(ws&&!ws.cards.some(c=>c.appId===APP)){ws.cards.push({id:'card-fx-'+Date.now(),appId:APP,x:60,y:420,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});save();}}catch(e){}}
  function patch(){
    if(patched||window.__windzxyFxWidgetPatched)return;patched=window.__windzxyFxWidgetPatched=1;
    const oldBody=bodyHtml;bodyHtml=(card,info)=>card&&card.appId===APP?render(card):oldBody(card,info);
    if(typeof renderDesktop==='function'){const oldRender=renderDesktop;renderDesktop=function(){oldRender();afterRender();};}
    if(typeof addCard==='function'){
      const oldAdd=addCard;addCard=function(appId){
        if(appId!==APP)return oldAdd(appId);
        const n=activeWorkspace().cards.length;
        activeWorkspace().cards.push({id:'card-'+Date.now(),appId:APP,x:80+(n%4)*36,y:86+(n%5)*30,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();renderAll();start();
      };
    }
  }

  function render(card={}){
    const compact=(card.w||DEFAULT_W)<380||(card.h||DEFAULT_H)<250;
    return `<div class="fx-widget fxdesk ${compact?'compact':''}" data-fx-version="${E(VER)}">
      <header class="fx-head">
        <div class="fx-status"><i class="${state.ok?'on':''}"></i><b>BOC</b><span data-fx-status>${E(statusLine())}</span></div>
        <button data-fx-refresh title="刷新">↻</button>
      </header>
      <section class="fx-converter" aria-label="人民幣換算">
        <label class="fx-amount"><span>CNY</span><input data-fx-amount type="number" min="0" step="1" value="${E(amount)}"><small>按現匯賣出換算</small></label>
        <div class="fx-chips">${WATCH.map(chipHtml).join('')}</div>
      </section>
      <section class="fx-table" role="table" aria-label="中國銀行外匯牌價">
        <div class="fx-tr fx-th" role="row"><span>貨幣</span><span>現匯買入</span><span>現匯賣出</span></div>
        ${WATCH.map(rowHtml).join('')}
      </section>
      <footer class="fx-foot"><span data-fx-time>${E(footText())}</span><button data-fx-open>源頁</button></footer>
    </div>`;
  }

  function chipHtml(c){
    const v=convertToForeign(rowOf(c.name));
    return `<div class="fx-chip"><span>${E(c.code)}</span><b data-fx-conv="${E(c.code)}">${fmtForeign(v,c)}</b></div>`;
  }
  function rowHtml(c){
    const r=rowOf(c.name),prev=prevRowOf(c.name);
    const buy=num(r?.buy),sell=num(r?.sell),pbuy=num(prev?.buy),psell=num(prev?.sell);
    const mid=is(buy)&&is(sell)?(buy+sell)/2:null,pmid=is(pbuy)&&is(psell)?(pbuy+psell)/2:null;
    const chg=is(mid)&&is(pmid)?mid-pmid:null;
    const cls=is(chg)?(chg>0?'up':chg<0?'down':'flat'):'flat';
    return `<div class="fx-tr ${cls}" role="row" data-fx-row="${E(c.code)}">
      <span class="fx-currency"><b>${E(c.flag)} ${E(c.display)}</b><small>${E(c.code)}</small></span>
      <span><b data-fx-buy="${E(c.code)}">${fmt(buy)}</b></span>
      <span><b data-fx-sell="${E(c.code)}">${fmt(sell)}</b></span>
    </div>`;
  }
  function statusLine(){return state.ok?`已同步 · ${pubLabel()}`:state.status;}
  function pubLabel(){return state.date&&state.time&&state.date!=='--'?`${state.date} ${state.time}`:'--';}
  function footText(){
    if(state.ok)return `BOC · ${pubLabel()} · 30s檢查`;
    return `${state.status}${state.error?' · '+state.error:''}`;
  }
  function rowOf(name){return state.rows.find(r=>r.name===name)||null;}
  function prevRowOf(name){return state.prevRows?.find(r=>r.name===name)||null;}
  function convertToForeign(row){const sell=num(row?.sell),a=num(amount);return is(sell)&&sell>0&&is(a)?a*100/sell:null;}

  function start(){clearInterval(timer);refresh(true);timer=setInterval(()=>refresh(false),REFRESH_MS);}
  async function refresh(force){
    if(busy)return;busy=true;
    if(force){state.status='讀取 BOC 快照…';paint();}
    try{
      const result=await loadSnapshot();
      state={rows:result.rows,prevRows:state.rows||[],date:result.date||'--',time:result.time||'--',source:result.source||'中國銀行外匯牌價',status:'已同步中國銀行快照',ok:true,ts:Date.now(),error:'',fetchedAt:result.fetchedAt||''};
    }catch(e){
      console.warn(e);state=Object.assign({},state,{status:'本地牌價快照讀取失敗',ok:false,error:e.message||String(e),ts:Date.now()});
    }
    busy=false;paint();
  }
  async function loadSnapshot(){
    const r=await fetch(JSON_URL+'?v='+Date.now(),{cache:'no-store'});
    if(!r.ok)throw new Error('JSON HTTP '+r.status);
    const data=await r.json();
    const rows=Array.isArray(data.rows)?data.rows.filter(r=>WATCH.some(c=>c.name===r.name)):[];
    if(rows.length<3)throw new Error('JSON 未包含目標貨幣');
    rows.sort((a,b)=>WATCH.findIndex(c=>c.name===a.name)-WATCH.findIndex(c=>c.name===b.name));
    return Object.assign({},data,{rows});
  }

  function afterRender(){bind();paint();}
  function bind(){
    document.querySelectorAll('[data-fx-refresh]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();refresh(true);};b.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-fx-open]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();window.open(BOC_URL,'_blank','noopener,noreferrer');};b.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-fx-amount]').forEach(input=>{if(input.dataset.ready)return;input.dataset.ready='1';input.oninput=e=>{amount=String(e.target.value||'0');localStorage.setItem(AMOUNT_KEY,amount);paint();};input.onpointerdown=e=>e.stopPropagation();});
  }
  function paint(){
    document.querySelectorAll('[data-fx-status]').forEach(e=>e.textContent=statusLine());
    document.querySelectorAll('[data-fx-time]').forEach(e=>e.textContent=footText());
    document.querySelectorAll('.fx-status i').forEach(e=>e.classList.toggle('on',!!state.ok));
    WATCH.forEach(c=>{
      const r=rowOf(c.name);
      document.querySelectorAll(`[data-fx-buy="${c.code}"]`).forEach(e=>e.textContent=fmt(num(r?.buy)));
      document.querySelectorAll(`[data-fx-sell="${c.code}"]`).forEach(e=>e.textContent=fmt(num(r?.sell)));
      document.querySelectorAll(`[data-fx-conv="${c.code}"]`).forEach(e=>e.textContent=fmtForeign(convertToForeign(r),c));
    });
  }

  function installStyle(){
    if(document.getElementById('fxWidgetStyle'))return;
    const s=document.createElement('style');s.id='fxWidgetStyle';s.textContent=`
.t-fx{--icon:linear-gradient(145deg,#f6d365,#22d3ee);--glow:linear-gradient(135deg,#f6d365,#22c55e)}
.fxdesk{height:100%;display:flex;flex-direction:column;gap:7px;overflow:hidden;color:var(--ink);font-variant-numeric:tabular-nums}.fxdesk *{box-sizing:border-box;min-width:0}.fx-head{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.fx-status{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:12px;min-width:0}.fx-status i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.18);box-shadow:0 0 0 7px rgba(255,255,255,.05);flex:0 0 auto}.fx-status i.on{background:#22d47b;box-shadow:0 0 0 7px rgba(34,212,123,.13),0 0 16px rgba(34,212,123,.32)}.fx-status b{font-size:11px;color:var(--ink);padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.10);white-space:nowrap}.fx-status span,.fx-foot span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fx-head button,.fx-foot button{height:30px;border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.09);color:var(--ink);font-weight:850;padding:0 12px;cursor:pointer}.fx-converter{border:1px solid rgba(255,255,255,.10);border-radius:15px;background:linear-gradient(135deg,rgba(246,211,101,.12),rgba(34,211,238,.07));padding:8px;display:grid;grid-template-columns:128px 1fr;gap:8px;align-items:stretch}.fx-amount{display:grid;grid-template-columns:auto 1fr;gap:4px 6px;align-items:center;background:rgba(0,0,0,.12);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:7px 8px}.fx-amount span{font-size:11px;color:#f6d365;font-weight:950;letter-spacing:.12em}.fx-amount input{width:100%;border:0;outline:0;background:transparent;color:var(--ink);font-size:18px;font-weight:950;text-align:right}.fx-amount small{grid-column:1/3;color:var(--muted);font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fx-chips{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.fx-chip{border:1px solid rgba(255,255,255,.08);border-radius:11px;background:rgba(255,255,255,.045);padding:6px 7px;overflow:hidden}.fx-chip span{display:block;color:var(--muted);font-size:10px;font-weight:900}.fx-chip b{display:block;margin-top:2px;color:#22d47b;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fx-table{flex:1 1 auto;min-height:0;display:grid;grid-template-rows:30px repeat(5,minmax(29px,1fr));border:1px solid rgba(255,255,255,.10);border-radius:15px;overflow:hidden;background:rgba(255,255,255,.035)}.fx-tr{display:grid;grid-template-columns:1.15fr .9fr .9fr;gap:7px;align-items:center;padding:6px 10px;border-bottom:1px solid rgba(255,255,255,.065)}.fx-tr:last-child{border-bottom:0}.fx-th{background:rgba(255,255,255,.075);color:var(--muted);font-size:11px;font-weight:900;letter-spacing:.04em}.fx-currency{display:flex;align-items:center;gap:7px}.fx-currency b{font-size:13px;color:var(--ink);white-space:nowrap}.fx-currency small{font-size:10px;color:var(--muted);font-weight:900}.fx-tr span:not(.fx-currency) b{font-size:14px;color:var(--ink);font-weight:950}.fx-tr.up span:not(.fx-currency) b{color:#22d47b}.fx-tr.down span:not(.fx-currency) b{color:#ff667c}.fx-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--muted);font-size:11px}.fx-foot button{height:auto;padding:5px 12px}.fxdesk.compact{gap:6px}.fxdesk.compact .fx-converter{grid-template-columns:1fr;padding:7px}.fxdesk.compact .fx-chips{grid-template-columns:repeat(3,1fr)}.fxdesk.compact .fx-table{grid-template-rows:28px repeat(5,minmax(27px,1fr))}.fxdesk.compact .fx-tr{grid-template-columns:1fr .82fr .82fr;padding:5px 8px}.fxdesk.compact .fx-currency{display:block}.fxdesk.compact .fx-currency b{font-size:12px}.fxdesk.compact .fx-tr span:not(.fx-currency) b{font-size:13px}@container (max-width:340px){.fx-chips{grid-template-columns:repeat(2,1fr)}.fx-tr{grid-template-columns:1fr .8fr .8fr;gap:5px}.fx-foot{font-size:10px}}
    `;document.head.appendChild(s);
  }

  function readAmount(){const v=localStorage.getItem(AMOUNT_KEY);return String(num(v)||100);}
  function num(v){const x=parseFloat(String(v??'').replace(/,/g,''));return Number.isFinite(x)?x:null;}
  function is(v){return Number.isFinite(v);}
  function fmt(v){return is(v)?v.toFixed(v<10?4:2):'--';}
  function fmtForeign(v,c){if(!is(v))return '--';if(c.code==='JPY'||c.code==='KRW')return v.toFixed(0);if(c.code==='TRY')return v.toFixed(2);return v.toFixed(4);}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  boot();
})();