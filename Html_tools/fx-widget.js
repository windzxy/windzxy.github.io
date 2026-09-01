(function(){
  if(window.__windzxyFxWidgetLoaded)return;
  window.__windzxyFxWidgetLoaded=1;

  const APP='fx-rates';
  const VER='20260819-fx-widget6-custom-dropdown';
  const BOC_URL='https://www.boc.cn/sourcedb/whpj/';
  const JSON_URL='data/boc-fx.json';
  const REFRESH_MS=30*1000;
  const DEFAULT_W=380, DEFAULT_H=286;
  const MIN_W=270, MIN_H=190;
  const CNY={name:'人民币',display:'人民幣',code:'CNY',flag:'CN'};
  const FX=[
    {name:'港币',display:'港幣',code:'HKD',flag:'HK'},
    {name:'美元',display:'美元',code:'USD',flag:'US'},
    {name:'日元',display:'日元',code:'JPY',flag:'JP'},
    {name:'韩国元',display:'韓國元',code:'KRW',flag:'KR'},
    {name:'土耳其里拉',display:'土耳其里拉',code:'TRY',flag:'TR'}
  ];
  const ALL=[CNY,...FX];
  const KEY={amount:'windzxy-fx-amount',from:'windzxy-fx-from',to:'windzxy-fx-to'};
  let state={rows:[],prev:[],date:'--',time:'--',ok:false,status:'等待牌價',error:'',fetchedAt:''};
  let busy=false,timer=null,patched=false;

  function boot(){
    if(typeof apps==='undefined'||typeof bodyHtml==='undefined'||typeof renderAll==='undefined'||typeof save==='undefined'){
      setTimeout(boot,80);return;
    }
    installStyle();installApp();patchRenderers();renderAll();afterRender();start();window.windzxyRefreshFx=()=>load(true);
  }

  function installApp(){
    const info={id:APP,kind:'widget',title:'匯率',desc:'中國銀行外匯牌價，自定義下拉與雙向換算。',icon:'FX',tone:'t-fx'};
    const old=apps.find(x=>x.id===APP);old?Object.assign(old,info):apps.push(info);
  }

  function patchRenderers(){
    if(patched||window.__windzxyFxWidgetPatched)return;
    patched=window.__windzxyFxWidgetPatched=1;
    const oldBody=bodyHtml;
    bodyHtml=(card,info)=>card&&card.appId===APP?render(card):oldBody(card,info);
    if(typeof renderDesktop==='function'){
      const oldRender=renderDesktop;
      renderDesktop=function(){oldRender();afterRender();};
    }
    if(typeof addCard==='function'){
      const oldAdd=addCard;
      addCard=function(appId){
        if(appId!==APP)return oldAdd(appId);
        const n=activeWorkspace().cards.length;
        activeWorkspace().cards.push({id:'card-'+Date.now(),appId:APP,x:80+(n%4)*34,y:86+(n%5)*28,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();renderAll();start();
      };
    }
  }

  function render(card={}){
    const tiny=(card.w||DEFAULT_W)<340;
    const amount=getAmount(), from=getCur(getStored(KEY.from,'CNY')), to=getCur(getStored(KEY.to,'USD'));
    const result=convert(amount,from.code,to.code);
    return `<div class="fx-widget fxdesk fx-v6 ${tiny?'tiny':''}" data-fx-version="${E(VER)}">
      <header class="fx-head">
        <div class="fx-status"><i class="${state.ok?'on':''}"></i><b>BOC</b><span data-fx-status>${E(statusText())}</span></div>
        <button data-fx-refresh title="刷新">↻</button>
      </header>
      <section class="fx-converter">
        <label class="fx-amount"><span>金額</span><input data-fx-amount inputmode="decimal" value="${E(amount)}"></label>
        ${selector('from',from)}
        <button class="fx-swap" data-fx-swap title="互換">⇄</button>
        ${selector('to',to)}
        <div class="fx-result"><small data-fx-pair>${E(from.code+' → '+to.code)}</small><strong data-fx-result>${fmtResult(result,to.code)}</strong></div>
      </section>
      <section class="fx-table" role="table" aria-label="中國銀行外匯牌價">
        <div class="fx-tr fx-th" role="row"><span>貨幣</span><span>現匯買入</span><span>現匯賣出</span></div>
        ${FX.map(rowHtml).join('')}
      </section>
      <footer class="fx-foot"><span data-fx-time>${E(footText())}</span><button data-fx-open>源頁</button></footer>
    </div>`;
  }

  function selector(kind,cur){
    return `<div class="fx-pick" data-fx-pick="${kind}">
      <span>${kind==='from'?'From':'To'}</span>
      <button class="fx-select" data-fx-open-menu="${kind}" aria-haspopup="listbox" aria-expanded="false">
        <strong>${E(cur.code)}</strong><em>${E(cur.display)}</em><i>⌄</i>
      </button>
      <div class="fx-menu" data-fx-menu="${kind}" role="listbox">
        ${ALL.map(c=>`<button type="button" role="option" class="${c.code===cur.code?'on':''}" data-fx-option="${kind}" data-code="${E(c.code)}"><b>${E(c.code)}</b><span>${E(c.display)}</span></button>`).join('')}
      </div>
    </div>`;
  }

  function rowHtml(c){
    const r=rowOf(c.name), prev=prevRowOf(c.name);
    const buy=num(r?.buy), sell=num(r?.sell), pbuy=num(prev?.buy), psell=num(prev?.sell);
    const mid=is(buy)&&is(sell)?(buy+sell)/2:null, old=is(pbuy)&&is(psell)?(pbuy+psell)/2:null;
    const d=is(mid)&&is(old)?mid-old:null, cls=is(d)?d>0?'up':d<0?'down':'flat':'flat';
    return `<div class="fx-tr ${cls}" role="row" data-fx-row="${E(c.code)}">
      <span class="fx-currency"><b><i>${E(c.flag)}</i><em>${E(c.display)}</em></b><small>${E(c.code)}</small></span>
      <span><b data-fx-buy="${E(c.code)}">${fmtRate(buy)}</b></span>
      <span><b data-fx-sell="${E(c.code)}">${fmtRate(sell)}</b></span>
    </div>`;
  }

  function start(){clearInterval(timer);load(true);timer=setInterval(()=>load(false),REFRESH_MS);}
  async function load(force){
    if(busy)return;busy=true;
    if(force){state.status='讀取牌價…';paint();}
    try{
      const r=await fetch(JSON_URL+'?v='+Date.now(),{cache:'no-store'});
      if(!r.ok)throw new Error('JSON '+r.status);
      const data=await r.json();
      const rows=(Array.isArray(data.rows)?data.rows:[]).filter(x=>FX.some(c=>c.name===x.name));
      if(rows.length<3)throw new Error('未包含目標貨幣');
      rows.sort((a,b)=>FX.findIndex(c=>c.name===a.name)-FX.findIndex(c=>c.name===b.name));
      state={rows,prev:state.rows||[],date:data.date||'--',time:data.time||'--',ok:true,status:'已同步',error:'',fetchedAt:data.fetchedAt||''};
    }catch(e){
      console.warn(e);state=Object.assign({},state,{ok:false,status:'讀取失敗',error:e.message||String(e)});
    }
    busy=false;paint();
  }

  function afterRender(){bind();paint();}
  function bind(){
    document.querySelectorAll('[data-fx-refresh]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();load(true);};b.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-fx-open]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();window.open(BOC_URL,'_blank','noopener,noreferrer');};b.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-fx-amount]').forEach(input=>{if(input.dataset.ready)return;input.dataset.ready='1';input.oninput=()=>{localStorage.setItem(KEY.amount,String(input.value||'0'));paint();};input.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-fx-open-menu]').forEach(btn=>{if(btn.dataset.ready)return;btn.dataset.ready='1';btn.onclick=e=>{e.preventDefault();e.stopPropagation();toggleMenu(btn.dataset.fxOpenMenu,btn);};btn.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-fx-option]').forEach(btn=>{if(btn.dataset.ready)return;btn.dataset.ready='1';btn.onclick=e=>{e.preventDefault();e.stopPropagation();const k=btn.dataset.fxOption==='from'?KEY.from:KEY.to;localStorage.setItem(k,btn.dataset.code);closeMenus();rerenderFx();};btn.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-fx-swap]').forEach(btn=>{if(btn.dataset.ready)return;btn.dataset.ready='1';btn.onclick=e=>{e.preventDefault();e.stopPropagation();const f=getStored(KEY.from,'CNY'),t=getStored(KEY.to,'USD');localStorage.setItem(KEY.from,t);localStorage.setItem(KEY.to,f);closeMenus();rerenderFx();};btn.onpointerdown=e=>e.stopPropagation();});
    if(!window.__windzxyFxCloseMenus){window.__windzxyFxCloseMenus=1;document.addEventListener('click',closeMenus,true);}
  }
  function toggleMenu(kind,btn){
    const root=btn.closest('.fxdesk');
    const menu=root?.querySelector(`[data-fx-menu="${kind}"]`);
    const open=menu?.classList.contains('open');
    closeMenus();
    if(menu&&!open){menu.classList.add('open');btn.setAttribute('aria-expanded','true');}
  }
  function closeMenus(){document.querySelectorAll('.fx-menu.open').forEach(m=>m.classList.remove('open'));document.querySelectorAll('.fx-select[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'));}
  function rerenderFx(){
    document.querySelectorAll('[data-card-id]').forEach(el=>{try{const c=activeWorkspace().cards.find(x=>x.id===el.dataset.cardId);if(c?.appId===APP){const b=el.querySelector('.card-body');if(b)b.innerHTML=render(c);}}catch(e){}});
    afterRender();
  }
  function paint(){
    const amount=getAmount(), from=getCur(getStored(KEY.from,'CNY')), to=getCur(getStored(KEY.to,'USD')), result=convert(amount,from.code,to.code);
    document.querySelectorAll('[data-fx-status]').forEach(e=>e.textContent=statusText());
    document.querySelectorAll('[data-fx-time]').forEach(e=>e.textContent=footText());
    document.querySelectorAll('.fx-status i').forEach(e=>e.classList.toggle('on',!!state.ok));
    document.querySelectorAll('[data-fx-result]').forEach(e=>e.textContent=fmtResult(result,to.code));
    document.querySelectorAll('[data-fx-pair]').forEach(e=>e.textContent=from.code+' → '+to.code);
    FX.forEach(c=>{const r=rowOf(c.name);document.querySelectorAll(`[data-fx-buy="${c.code}"]`).forEach(e=>e.textContent=fmtRate(num(r?.buy)));document.querySelectorAll(`[data-fx-sell="${c.code}"]`).forEach(e=>e.textContent=fmtRate(num(r?.sell)));});
  }

  function convert(amount,from,to){
    amount=num(amount);if(!is(amount))return null;
    if(from===to)return amount;
    const cny=from==='CNY'?amount:amount*fxBuy(from)/100;
    if(!is(cny))return null;
    return to==='CNY'?cny:cny/fxSell(to)*100;
  }
  function fxBuy(code){const c=FX.find(x=>x.code===code);return num(rowOf(c?.name)?.buy);}
  function fxSell(code){const c=FX.find(x=>x.code===code);return num(rowOf(c?.name)?.sell);}
  function rowOf(name){return state.rows.find(r=>r.name===name)||null;}
  function prevRowOf(name){return state.prev?.find(r=>r.name===name)||null;}
  function getCur(code){return ALL.find(c=>c.code===code)||CNY;}
  function getStored(k,d){try{return localStorage.getItem(k)||d}catch(e){return d}}
  function getAmount(){const v=getStored(KEY.amount,'100');return String(v||'100');}
  function statusText(){return state.ok?`已同步 · ${state.date||''} ${state.time||''}`.trim():`${state.status}${state.error?' · '+state.error:''}`;}
  function footText(){return state.ok?`BOC · ${state.time||'--'} · 30s檢查`:`${state.status}${state.error?' · '+state.error:''}`;}

  function installStyle(){
    if(document.getElementById('fxWidgetStyle'))return;
    const s=document.createElement('style');s.id='fxWidgetStyle';s.textContent=`
.t-fx{--icon:linear-gradient(145deg,#f6d365,#22d3ee);--glow:linear-gradient(135deg,#f6d365,#22c55e)}
.fxdesk{height:100%;container-type:inline-size;display:flex;flex-direction:column;gap:8px;overflow:hidden;color:var(--ink);font-variant-numeric:tabular-nums}.fxdesk *{box-sizing:border-box;min-width:0}.fx-head{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.fx-status{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:12px;min-width:0}.fx-status i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.18);box-shadow:0 0 0 7px rgba(255,255,255,.05);flex:0 0 auto}.fx-status i.on{background:#22d47b;box-shadow:0 0 0 7px rgba(34,212,123,.13),0 0 16px rgba(34,212,123,.32)}.fx-status b{font-size:11px;color:var(--ink);padding:4px 9px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.10);white-space:nowrap}.fx-status span,.fx-foot span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fx-head button,.fx-foot button,.fx-swap{height:30px;border:1px solid rgba(255,255,255,.11);border-radius:999px;background:rgba(255,255,255,.09);color:var(--ink);font-weight:900;padding:0 12px;cursor:pointer}.fx-converter{position:relative;display:grid;grid-template-columns:.78fr 1fr 34px 1fr 1.15fr;gap:7px;align-items:end;border:1px solid rgba(255,255,255,.10);border-radius:17px;background:linear-gradient(135deg,rgba(246,211,101,.12),rgba(34,211,238,.08));padding:9px}.fx-amount,.fx-pick,.fx-result{display:flex;flex-direction:column;gap:4px}.fx-amount span,.fx-pick>span,.fx-result small{font-size:10px;line-height:1;color:var(--muted);font-weight:850;letter-spacing:.04em}.fx-amount input,.fx-select{height:34px;border:1px solid rgba(255,255,255,.08);border-radius:11px;background:linear-gradient(180deg,rgba(0,0,0,.18),rgba(255,255,255,.04));color:var(--ink);font-weight:950;padding:0 10px;outline:0}.fx-amount input{width:100%;font-size:16px}.fx-select{width:100%;display:grid;grid-template-columns:auto 1fr auto;gap:6px;align-items:center;cursor:pointer;text-align:left}.fx-select strong{font-size:15px}.fx-select em{font-style:normal;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fx-select i{font-style:normal;color:var(--muted)}.fx-swap{height:34px;border-radius:12px;padding:0;align-self:end;font-size:17px}.fx-result{align-items:flex-end;justify-content:flex-end;min-height:44px}.fx-result strong{font-size:clamp(19px,6cqw,25px);line-height:1;color:#22d47b;font-weight:950;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}.fx-table{flex:1 1 auto;min-height:0;display:grid;grid-auto-rows:minmax(30px,1fr);border:1px solid rgba(255,255,255,.10);border-radius:17px;overflow:hidden;background:rgba(255,255,255,.035)}.fx-tr{display:grid;grid-template-columns:1.08fr .86fr .86fr;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid rgba(255,255,255,.065)}.fx-tr:last-child{border-bottom:0}.fx-th{background:rgba(255,255,255,.075);color:var(--muted);font-size:11px;font-weight:900;letter-spacing:.04em}.fx-currency b{display:inline-flex;align-items:center;gap:6px;color:var(--ink);font-size:14px;white-space:nowrap}.fx-currency b i,.fx-currency b em{font-style:normal}.fx-currency small{margin-left:6px;color:var(--muted);font-size:10px;font-weight:900}.fx-tr span:not(.fx-currency) b{font-size:14px;color:var(--ink);font-weight:950}.fx-tr.up span:not(.fx-currency) b{color:#22d47b}.fx-tr.down span:not(.fx-currency) b{color:#ff667c}.fx-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--muted);font-size:11px}.fx-foot button{height:auto;padding:5px 11px}.fx-menu{position:absolute;z-index:30;top:calc(100% + 6px);width:min(220px,calc(100vw - 32px));padding:6px;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:linear-gradient(180deg,rgba(30,38,52,.98),rgba(18,24,35,.98));box-shadow:0 18px 44px rgba(0,0,0,.38);display:none}.fx-menu.open{display:grid;gap:4px}.fx-pick:nth-of-type(2) .fx-menu{left:calc(9px + .78*(100% - 62px)/5)}.fx-pick:nth-of-type(3) .fx-menu{right:calc(9px + 1.15*(100% - 62px)/5)}.fx-menu button{display:grid;grid-template-columns:48px 1fr;gap:8px;align-items:center;border:0;border-radius:10px;background:transparent;color:var(--ink);padding:8px 9px;text-align:left;cursor:pointer}.fx-menu button:hover,.fx-menu button.on{background:rgba(34,211,238,.16)}.fx-menu button b{color:#22d47b}.fx-menu button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink)}
@container (max-width:460px){.fx-converter{grid-template-columns:.75fr 1fr 34px 1fr;align-items:end}.fx-result{grid-column:1 / -1;display:grid;grid-template-columns:auto 1fr;align-items:center}.fx-result strong{text-align:right}.fx-select em{display:none}.fx-select{grid-template-columns:auto auto;justify-content:space-between}.fx-tr{padding:6px 9px;grid-template-columns:1fr .76fr .76fr}.fx-currency b em{font-size:13px}.fx-currency small{margin-left:4px}.fx-menu{top:calc(100% + 4px);left:8px!important;right:8px!important;width:auto}.fx-menu button{grid-template-columns:44px 1fr}}
@container (max-width:340px){.fxdesk{gap:6px}.fx-converter{padding:8px;grid-template-columns:1fr 32px 1fr}.fx-amount{grid-column:1 / -1}.fx-result{grid-column:1 / -1}.fx-pick>span{display:none}.fx-status span{display:none}.fx-currency b em{display:none}.fx-currency small{display:block;margin-left:0;margin-top:2px}.fx-tr{gap:5px;padding:6px 8px}.fx-tr span:not(.fx-currency) b{font-size:13px}.fx-th{font-size:10px}.fx-foot{font-size:10px}.fx-head button{height:28px}}
    `;document.head.appendChild(s);
  }

  function num(v){const x=parseFloat(String(v??'').replace(/,/g,''));return Number.isFinite(x)?x:null;}
  function is(v){return Number.isFinite(v);}
  function fmtRate(v){return is(v)?v.toFixed(v<10?4:2):'--';}
  function fmtResult(v,code){if(!is(v))return '--';return v.toLocaleString(undefined,{maximumFractionDigits:code==='JPY'||code==='KRW'?0:4,minimumFractionDigits:code==='JPY'||code==='KRW'?0:2});}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  boot();
})();