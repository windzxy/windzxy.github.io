(function(){
  if(window.__windzxyFxWidgetLoaded)return;
  window.__windzxyFxWidgetLoaded=1;

  const APP='fx-rates';
  const VER='20260819-fx-widget1-pboc-safe';
  const DEFAULT_W=430,DEFAULT_H=318,MIN_W=300,MIN_H=220;
  const REFRESH_MS=10*60*1000;
  const OFFICIAL_URL='https://www.safe.gov.cn/AppStructured/hlw/RMBQuery.do';
  const READ_URLS=[
    {name:'外管局官方頁',url:OFFICIAL_URL},
    {name:'官方頁代理讀取',url:'https://api.allorigins.win/raw?url='+encodeURIComponent(OFFICIAL_URL)}
  ];
  const FIELDS=['usd','eur','jpy','hkd','gbp','aud','nzd','sgd','chf','cad','mop','myr','rub','zar','krw','aed','sar','huf','pln','dkk','sek','nok','try','mxn','thb'];
  const WATCH=[
    {id:'hkd',name:'港幣',code:'HKD',flag:'🇭🇰',mode:'direct',unit:'100港幣'},
    {id:'usd',name:'美元',code:'USD',flag:'🇺🇸',mode:'direct',unit:'100美元'},
    {id:'jpy',name:'日元',code:'JPY',flag:'🇯🇵',mode:'direct',unit:'100日元'},
    {id:'krw',name:'韓元',code:'KRW',flag:'🇰🇷',mode:'indirect',unit:'100人民幣'},
    {id:'try',name:'土耳其里拉',code:'TRY',flag:'🇹🇷',mode:'indirect',unit:'100人民幣'}
  ];

  let state={rows:[],date:'--',prevDate:'--',source:'等待讀取',status:'等待官方中間價',ts:0,ok:false,error:''};
  let timer=null,busy=false,patched=false;

  function boot(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'||typeof bodyHtml==='undefined'||typeof save==='undefined'){
      setTimeout(boot,80);return;
    }
    installStyle();installApp();patch();ensureCard();fitCards();renderAll();afterRender();start();window.windzxyRefreshFx=()=>refresh(true);
  }

  function installApp(){
    const info={id:APP,kind:'widget',title:'匯率',desc:'中國人民銀行授權中間價：人民幣兌港幣、美元、日元、韓元、土耳其里拉。',icon:'¥',tone:'t-fx'};
    const old=apps.find(a=>a.id===APP);old?Object.assign(old,info):apps.push(info);
    if(typeof defaults!=='undefined')defaults.forEach(ws=>{
      if(ws.id==='daily'&&!ws.cards.some(c=>c.appId===APP))ws.cards.push({id:'daily-fx-0',appId:APP,x:60,y:420,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
    });
  }
  function ensureCard(){try{const ws=activeWorkspace();if(ws&&!ws.cards.some(c=>c.appId===APP)){ws.cards.push({id:'card-fx-'+Date.now(),appId:APP,x:60,y:420,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});save();}}catch(e){}}
  function fitCards(){try{let changed=false;workspaces.forEach(ws=>(ws.cards||[]).forEach(c=>{if(c.appId===APP){if((c.w||0)<MIN_W){c.w=MIN_W;changed=true;}if((c.h||0)<MIN_H){c.h=MIN_H;changed=true;}}}));if(changed)save();}catch(e){}}
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
    const compact=(card.w||DEFAULT_W)<360||(card.h||DEFAULT_H)<260;
    return `<div class="fx-widget fxdesk ${compact?'compact':''}" data-fx-version="${E(VER)}">
      <header class="fx-head">
        <div class="fx-status"><i class="${state.ok?'on':''}"></i><b>官方中間價</b><span data-fx-status>${E(state.status)}</span></div>
        <button data-fx-refresh title="刷新">↻</button>
      </header>
      <section class="fx-hero">
        <div><em>CNY</em><h3>人民幣匯率看板</h3><p>中國人民銀行授權 · 外匯交易中心中間價</p></div>
        <div class="fx-date"><span>最新日期</span><b data-fx-date>${E(state.date)}</b></div>
      </section>
      <section class="fx-grid">${WATCH.map(cardRate).join('')}</section>
      <footer class="fx-foot"><span data-fx-time>${E(footText())}</span><button data-fx-open>源頁</button></footer>
    </div>`;
  }
  function cardRate(c){
    const latest=state.rows[0],prev=state.rows[1];
    const v=rateOf(latest,c),pv=rateOf(prev,c),chg=is(v)&&is(pv)?(v-pv):null,pct=is(chg)&&pv?chg/pv*100:null;
    const trend=is(pct)?(pct>0?'up':pct<0?'down':'flat'):'flat';
    const src=rawOf(latest,c);
    return `<article class="fx-rate ${trend}">
      <div class="r-top"><strong>${c.flag} ${E(c.name)}</strong><em>${E(c.code)}</em></div>
      <div class="r-main"><small>1 CNY =</small><b data-fx-${c.id}>${fmtRate(v,c)}</b></div>
      <div class="r-sub"><span>${E(sourceUnit(c,src))}</span><b>${signed(pct,'%')}</b></div>
    </article>`;
  }
  function footText(){return state.ok?`更新 ${clock(new Date(state.ts||Date.now()))} · ${state.source} · 非逐tick行情`:`${state.status}${state.error?' · '+state.error:''}`;}
  function sourceUnit(c,src){if(!is(src))return '官方欄位 --';return c.mode==='direct'?`${c.unit}=${src} CNY`:`${c.unit}=${src} ${c.code}`;}

  function start(){clearInterval(timer);refresh(true);timer=setInterval(()=>refresh(false),REFRESH_MS);}
  async function refresh(force){
    if(busy)return;busy=true;
    if(force){state.status='讀取官方中間價…';paint();}
    try{
      const result=await loadOfficial();
      state={rows:result.rows,date:result.rows[0]?.date||'--',prevDate:result.rows[1]?.date||'--',source:result.source,status:'已讀取最新官方中間價',ts:Date.now(),ok:true,error:''};
    }catch(e){
      console.warn(e);state=Object.assign({},state,{status:'官方中間價讀取失敗',ok:false,error:e.message||String(e),ts:Date.now()});
    }
    busy=false;paint();
  }
  async function loadOfficial(){
    let lastErr=null;
    for(const src of READ_URLS){
      try{
        const text=await fetchText(src.url);
        const rows=parseRows(text);
        if(rows.length)return {rows,source:src.name};
        lastErr=new Error('未解析到匯率表');
      }catch(e){lastErr=e;}
    }
    throw lastErr||new Error('無法讀取官方頁');
  }
  async function fetchText(url){
    const ac=new AbortController();const t=setTimeout(()=>ac.abort(),8000);
    try{const r=await fetch(url,{cache:'no-store',signal:ac.signal});if(!r.ok)throw new Error('HTTP '+r.status);return await r.text();}
    finally{clearTimeout(t);}
  }
  function parseRows(html){
    const text=String(html||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();
    const tokens=text.split(' '),rows=[];
    for(let i=0;i<tokens.length;i++){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(tokens[i]))continue;
      const nums=tokens.slice(i+1,i+1+FIELDS.length).map(n=>num(n));
      if(nums.length===FIELDS.length&&nums.every(is)){
        const r={date:tokens[i]};FIELDS.forEach((f,idx)=>r[f]=nums[idx]);rows.push(r);i+=FIELDS.length;
      }
    }
    return rows;
  }
  function rateOf(row,c){if(!row)return null;const raw=row[c.id];if(!is(raw))return null;return c.mode==='direct'?100/raw:raw/100;}
  function rawOf(row,c){return row&&is(row[c.id])?row[c.id]:null;}

  function afterRender(){bind();paint();}
  function bind(){
    document.querySelectorAll('[data-fx-refresh]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();refresh(true);};b.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-fx-open]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();window.open(OFFICIAL_URL,'_blank','noopener,noreferrer');};b.onpointerdown=e=>e.stopPropagation();});
  }
  function paint(){
    document.querySelectorAll('[data-fx-status]').forEach(e=>e.textContent=state.status);
    document.querySelectorAll('[data-fx-date]').forEach(e=>e.textContent=state.date||'--');
    document.querySelectorAll('[data-fx-time]').forEach(e=>e.textContent=footText());
    document.querySelectorAll('.fx-status i').forEach(e=>e.classList.toggle('on',!!state.ok));
    WATCH.forEach(c=>document.querySelectorAll(`[data-fx-${c.id}]`).forEach(e=>e.textContent=fmtRate(rateOf(state.rows[0],c),c)));
  }
  function installStyle(){
    if(document.getElementById('fxWidgetStyle'))return;
    const s=document.createElement('style');s.id='fxWidgetStyle';s.textContent=`
.t-fx{--icon:linear-gradient(145deg,#f6d365,#22d3ee);--glow:linear-gradient(135deg,#f6d365,#22c55e)}
.fxdesk{height:100%;display:flex;flex-direction:column;gap:10px;overflow:hidden;color:var(--ink);font-variant-numeric:tabular-nums}.fxdesk *{box-sizing:border-box;min-width:0}.fx-head{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.fx-status{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:12px}.fx-status i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.18);box-shadow:0 0 0 7px rgba(255,255,255,.05);flex:0 0 auto}.fx-status i.on{background:#22d47b;box-shadow:0 0 0 7px rgba(34,212,123,.13),0 0 16px rgba(34,212,123,.32)}.fx-status b{font-size:11px;color:var(--ink);padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.10);white-space:nowrap}.fx-status span,.fx-foot span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fx-head button,.fx-foot button{height:30px;border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.09);color:var(--ink);font-weight:850;padding:0 12px;cursor:pointer}.fx-hero{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;border:1px solid rgba(255,255,255,.10);border-radius:18px;background:linear-gradient(135deg,rgba(246,211,101,.12),rgba(34,211,238,.08));padding:12px}.fx-hero em{font-style:normal;color:#f6d365;font-size:12px;font-weight:950;letter-spacing:.13em}.fx-hero h3{margin:2px 0 0;font-size:21px;line-height:1.1}.fx-hero p{margin:5px 0 0;color:var(--muted);font-size:12px}.fx-date{text-align:right}.fx-date span{display:block;color:var(--muted);font-size:11px}.fx-date b{display:block;margin-top:4px;font-size:15px}.fx-grid{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;overflow:hidden}.fx-rate{border:1px solid rgba(255,255,255,.09);border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.045));padding:10px;display:flex;flex-direction:column;justify-content:space-between;gap:7px}.fx-rate:first-child{grid-column:span 2;background:linear-gradient(135deg,rgba(246,211,101,.16),rgba(34,212,123,.08));border-color:rgba(246,211,101,.30)}.r-top{display:flex;justify-content:space-between;align-items:center;gap:8px}.r-top strong{font-size:14px}.r-top em{font-style:normal;color:var(--muted);font-size:11px;font-weight:900}.r-main small{display:block;color:var(--muted);font-size:10px;letter-spacing:.08em}.r-main b{display:block;margin-top:2px;font-size:clamp(20px,7cqw,30px);line-height:1;font-weight:950;color:#22d47b}.r-sub{display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:11px}.r-sub span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.r-sub b{font-size:11px;color:#22d47b;white-space:nowrap}.fx-rate.down .r-sub b{color:#ff667c}.fx-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--muted);font-size:12px}.fx-foot button{height:auto;padding:5px 12px}.fxdesk.compact{gap:8px}.fxdesk.compact .fx-hero{padding:10px}.fxdesk.compact .fx-hero h3{font-size:18px}.fxdesk.compact .fx-grid{grid-template-columns:1fr}.fxdesk.compact .fx-rate:first-child{grid-column:auto}.fxdesk.compact .r-main b{font-size:24px}@container (max-width:350px){.fx-hero{grid-template-columns:1fr}.fx-date{text-align:left}.fx-grid{grid-template-columns:1fr}.fx-rate:first-child{grid-column:auto}.fx-foot{font-size:11px}}
    `;document.head.appendChild(s);
  }

  function num(v){const x=parseFloat(String(v??'').replace(/,/g,''));return Number.isFinite(x)?x:null;}
  function is(v){return Number.isFinite(v);}
  function fmtRate(v,c){if(!is(v))return '--';if(c.id==='usd')return v.toFixed(4);if(c.id==='hkd'||c.id==='try')return v.toFixed(4);if(c.id==='jpy')return v.toFixed(2);if(c.id==='krw')return v.toFixed(2);return v.toFixed(4);}
  function signed(v,s=''){return is(v)?(v>0?'+':'')+v.toFixed(2)+s:'--';}
  function clock(d){return new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(d);}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  boot();
})();