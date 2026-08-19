(function(){
  if(window.__windzxyMetalsWidgetLoaded)return;
  window.__windzxyMetalsWidgetLoaded=true;

  const APP_ID='metals';
  const VERSION='20260819-gold-widget14-trading-pm';
  const FALLBACK_MS=500;
  const DEFAULT_W=520;
  const DEFAULT_H=360;
  const PRODUCTS=[
    {id:'xau',name:'現貨黃金',short:'黃金',symbol:'XAU',code:'hf_XAU',url:'https://www.gkoudai.com/quotesTrend/12.html',unit:'USD/oz'},
    {id:'xag',name:'現貨白銀',short:'白銀',symbol:'XAG',code:'hf_XAG',url:'https://www.gkoudai.com/quotesTrend/13.html',unit:'USD/oz'},
    {id:'xpt',name:'現貨鉑金',short:'鉑金',symbol:'XPT',code:'hf_XPT',url:'https://www.gkoudai.com/quotesTrend/74.html',unit:'USD/oz'},
    {id:'xpd',name:'現貨鈀金',short:'鈀金',symbol:'XPD',code:'hf_XPD',url:'https://www.gkoudai.com/quotesTrend/75.html',unit:'USD/oz'}
  ];

  let active=localStorage.getItem('windzxy-metals-active')||'xau';
  let quotes=Object.fromEntries(PRODUCTS.map(p=>[p.id,emptyQuote(p)]));
  let feedMode='fallback';
  let timer=null;
  let loading=false;
  let pending=false;

  function boot(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'||typeof bodyHtml==='undefined'||typeof save==='undefined'){
      setTimeout(boot,80);return;
    }
    installStyle();
    installApp();
    patchRenderers();
    ensureCard();
    normalizeCards();
    renderAll();
    startFeed();
    window.windzxyRefreshMetals=()=>refreshQuotes(true);
  }

  function installApp(){
    const info={id:APP_ID,kind:'widget',title:'金價',desc:'交易主管視角的貴金屬即時行情看板。',icon:'Au',tone:'t-metals'};
    const old=apps.find(a=>a.id===APP_ID);
    old?Object.assign(old,info):apps.push(info);
    if(typeof defaults!=='undefined'){
      defaults.forEach(ws=>{
        if(ws.id==='daily'&&!ws.cards.some(c=>c.appId===APP_ID)){
          ws.cards.push({id:'daily-metals-0',appId:APP_ID,x:320,y:500,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        }
      });
    }
  }

  function ensureCard(){
    try{
      const ws=activeWorkspace();
      if(ws&&!ws.cards.some(c=>c.appId===APP_ID)){
        ws.cards.push({id:'card-metals-'+Date.now(),appId:APP_ID,x:320,y:500,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();
      }
    }catch(e){}
  }

  function normalizeCards(){
    try{
      let changed=false;
      workspaces.forEach(ws=>(ws.cards||[]).forEach(c=>{
        if(c.appId===APP_ID){
          if((c.w||0)<DEFAULT_W){c.w=DEFAULT_W;changed=true;}
          if((c.h||0)<DEFAULT_H){c.h=DEFAULT_H;changed=true;}
        }
      }));
      if(changed)save();
    }catch(e){}
  }

  function patchRenderers(){
    if(window.__windzxyMetalsWidgetPatched)return;
    window.__windzxyMetalsWidgetPatched=true;
    const oldBody=bodyHtml;
    bodyHtml=(card,info)=>card&&card.appId===APP_ID?renderWidget():oldBody(card,info);
    if(typeof addCard==='function'){
      const oldAdd=addCard;
      addCard=function(appId){
        if(appId!==APP_ID)return oldAdd(appId);
        const i=activeWorkspace().cards.length;
        activeWorkspace().cards.push({id:'card-'+Date.now(),appId:APP_ID,x:70+(i%4)*44,y:76+(i%5)*34,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();renderAll();startFeed();
      };
    }
  }

  function renderWidget(){
    const product=PRODUCTS.find(p=>p.id===active)||PRODUCTS[0];
    const q=quotes[product.id]||emptyQuote(product);
    const cls=trendClass(q);
    const spread=Number.isFinite(q.buy)&&Number.isFinite(q.sell)?Math.abs(q.sell-q.buy):null;
    const stale=q.ts&&Date.now()-q.ts>45000;
    const modeText=feedMode==='api'?'API PUSH':'0.5s BACKUP';
    return `<div class="metals-widget pro-metals" data-metals-version="${esc(VERSION)}">
      <div class="pm-topbar">
        <div class="pm-feed"><span class="pm-live-dot ${q.ok&&!stale?'ok':''}"></span><strong>${esc(modeText)}</strong><em>${esc(q.status||'等待行情')}</em></div>
        <button type="button" class="pm-refresh" data-metals-refresh title="刷新">↻</button>
      </div>
      <div class="pm-tabs">${PRODUCTS.map(tabHtml).join('')}</div>
      <section class="pm-hero ${cls}">
        <div class="pm-main-quote">
          <div class="pm-symbol"><span>${esc(product.symbol)}</span><b>${esc(q.name)}</b><small>${esc(q.unit)}</small></div>
          <div class="pm-price-line"><strong>${fmt(q.price)}</strong><div><b>${signed(q.change)}</b><em>${signed(q.pct,'%')}</em></div></div>
          ${rangeBar(q)}
        </div>
        <aside class="pm-dealing">
          <div><span>BID 買入</span><b>${fmt(q.buy)}</b></div>
          <div><span>ASK 賣出</span><b>${fmt(q.sell)}</b></div>
          <div><span>SPREAD</span><b>${fmt(spread)}</b></div>
        </aside>
      </section>
      <section class="pm-stats">
        ${stat('最高',q.high,'H')}${stat('最低',q.low,'L')}${stat('昨收',q.prev,'YC')}${stat('今開',q.open,'O')}
      </section>
      <section class="pm-strip">${PRODUCTS.filter(p=>p.id!==product.id).map(p=>miniHtml(quotes[p.id]||emptyQuote(p),p)).join('')}</section>
      <div class="pm-foot"><span>${stale?'行情可能已過期':'最後更新'} ${esc(q.t||'--')}</span><button type="button" data-metals-open="${esc(q.url)}">源頁</button></div>
    </div>`;
  }

  function tabHtml(p){
    const q=quotes[p.id]||emptyQuote(p);
    return `<button type="button" class="${p.id===active?'is-active':''} ${trendClass(q)}" data-metals-tab="${esc(p.id)}"><span>${esc(p.short)}</span><b>${fmt(q.price)}</b></button>`;
  }
  function miniHtml(q,p){
    return `<button type="button" class="pm-mini ${trendClass(q)}" data-metals-tab="${esc(p.id)}"><span>${esc(p.short)}</span><strong>${fmt(q.price)}</strong><em>${signed(q.pct,'%')}</em></button>`;
  }
  function stat(label,value,k){return `<div><i>${esc(k)}</i><span>${esc(label)}</span><b>${fmt(value)}</b></div>`;}
  function rangeBar(q){
    const ok=Number.isFinite(q.price)&&Number.isFinite(q.low)&&Number.isFinite(q.high)&&q.high>q.low;
    const pct=ok?Math.max(0,Math.min(100,(q.price-q.low)/(q.high-q.low)*100)):50;
    return `<div class="pm-range"><span>${fmt(q.low)}</span><div><i style="left:${pct}%"></i></div><span>${fmt(q.high)}</span></div>`;
  }

  function startFeed(){
    clearInterval(timer);
    if(initApiPush())return;
    feedMode='fallback';
    refreshQuotes(true);
    timer=setInterval(()=>{if(!document.hidden)refreshQuotes(false);},FALLBACK_MS);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshQuotes(true);},{passive:true});
    window.addEventListener('focus',()=>refreshQuotes(true));
    window.addEventListener('online',()=>refreshQuotes(true));
  }

  function initApiPush(){
    const sdk=window.socketSdk||window.koudaiSocketSdk||window.koudaiQuoteSdk;
    const fn=sdk&&(sdk.quote||sdk.subscribeQuote);
    if(typeof fn!=='function')return false;
    feedMode='api';
    try{
      PRODUCTS.forEach(p=>fn.call(sdk,{quoteParam:p.symbol},data=>{
        const parsed=parseApi(data,p);
        if(parsed)updateQuote(p,parsed,'口袋 API 推送');
      }));
      Object.values(quotes).forEach(q=>q.status='等待 API 推送…');
      draw();
      return true;
    }catch(err){
      console.warn('koudai api unavailable',err);
      feedMode='fallback';
      return false;
    }
  }

  async function refreshQuotes(force){
    if(feedMode==='api'&&!force)return;
    if(loading){pending=!!force;return;}
    loading=true;
    if(force){Object.values(quotes).forEach(q=>q.status='讀取行情中…');draw();}
    try{
      const data=await loadTencent();
      PRODUCTS.forEach(p=>{
        if(data[p.code])updateQuote(p,data[p.code],'公開行情備援');
        else Object.assign(quotes[p.id],{ok:false,status:'行情暫未返回',t:now(),ts:Date.now()});
      });
    }catch(err){
      console.warn(err);
      PRODUCTS.forEach(p=>Object.assign(quotes[p.id],{ok:false,status:'行情源暫不可用',t:now(),ts:Date.now()}));
    }
    loading=false;draw();
    if(pending){pending=false;refreshQuotes(true);}
  }

  function updateQuote(p,x,source){
    const old=quotes[p.id]||emptyQuote(p);
    let price=firstNum(x.price,old.price),prev=firstNum(x.prev,old.prev),change=firstNum(x.change,old.change),pct=firstNum(x.pct,old.pct);
    if(!Number.isFinite(change)&&Number.isFinite(price)&&Number.isFinite(prev))change=price-prev;
    if(!Number.isFinite(pct)&&Number.isFinite(change)&&Number.isFinite(prev)&&prev)pct=change/prev*100;
    quotes[p.id]=Object.assign(emptyQuote(p),old,x,{price,prev,change,pct,ok:Number.isFinite(price),status:source,t:now(),ts:Date.now()});
  }

  function loadTencent(){
    return new Promise(resolve=>{
      const id='metalsTencentQuoteScript';
      document.getElementById(id)?.remove();
      PRODUCTS.forEach(p=>{try{delete window['v_'+p.code];}catch(e){}});
      const s=document.createElement('script');
      s.id=id;s.charset='gbk';
      s.src='https://qt.gtimg.cn/q='+encodeURIComponent(PRODUCTS.map(p=>p.code).join(','))+'&_='+Date.now();
      let done=false;
      const finish=()=>{if(done)return;done=true;setTimeout(()=>{const out={};PRODUCTS.forEach(p=>{const parsed=parseText(window['v_'+p.code],p);if(parsed)out[p.code]=parsed;});resolve(out);},50);};
      s.onload=finish;s.onerror=()=>resolve({});
      setTimeout(()=>resolve({}),4800);
      document.head.appendChild(s);
    });
  }

  function parseApi(data,p){
    let o=data;
    if(typeof data==='string'){
      try{o=JSON.parse(data);}catch(e){return parseText(data,p);}
    }
    if(Array.isArray(o))o=o[0]||{};
    o=o.data||o.quote||o.result||o.payload||o;
    return normalize(o,p);
  }

  function parseText(raw,p){
    const t=String(raw||'').replace(/^.*?="|";?$/g,'');
    if(!t)return null;
    if(t.includes('~')){
      const f=t.split('~');
      return normalize({price:f[3],prev:f[4],open:f[5],buy:f[9],sell:f[19],change:f[31],pct:f[32],high:f[33],low:f[34]},p);
    }
    if(t.includes(',')){
      const f=t.split(',').map(num);
      const price=valid(f[0],p)?f[0]:f[3];
      const near=f.filter(v=>valid(v,p));
      return normalize({
        price,
        buy:valid(f[2],p)?f[2]:price,
        sell:valid(f[3],p)?f[3]:price,
        high:valid(f[5],p)?f[5]:(near.length?Math.max(...near):null),
        low:valid(f[6],p)?f[6]:(near.length?Math.min(...near):null),
        prev:valid(f[7],p)?f[7]:f[4],
        open:valid(f[4],p)?f[4]:f[5],
        pct:Math.abs(f[1])<50?f[1]:f[32],
        change:Math.abs(f[2])<1000?f[2]:f[31]
      },p);
    }
    return null;
  }

  function normalize(o,p){
    const x={
      price:pick(o,['price','last','lastPrice','latest','latestPrice','now','close','current','newPrice']),
      buy:pick(o,['buy','bid','buyPrice','bidPrice','buyOne','bid1']),
      sell:pick(o,['sell','ask','sellPrice','askPrice','sellOne','ask1']),
      high:pick(o,['high','highest','highPrice','max','maxPrice']),
      low:pick(o,['low','lowest','lowPrice','min','minPrice']),
      open:pick(o,['open','openPrice','todayOpen','opening']),
      prev:pick(o,['prev','prevClose','preClose','yesterdayClose','lastClose','yesClose']),
      change:pick(o,['change','chg','upDown','priceChange','riseFall','diff']),
      pct:pick(o,['pct','changePct','changeRate','upDownRate','percent','rate'])
    };
    if(!valid(x.price,p)&&valid(x.buy,p))x.price=x.buy;
    if(!valid(x.price,p))return null;
    if(!valid(x.buy,p))x.buy=x.price;
    if(!valid(x.sell,p))x.sell=x.price;
    return x;
  }

  function draw(){
    document.querySelectorAll('[data-card-id]').forEach(el=>{
      const card=activeWorkspace().cards.find(c=>c.id===el.dataset.cardId);
      if(card?.appId===APP_ID){const body=el.querySelector('.card-body');if(body)body.innerHTML=renderWidget();}
    });
    bind();
  }

  function bind(){
    document.querySelectorAll('[data-metals-refresh]').forEach(btn=>{
      if(btn.dataset.ready)return;btn.dataset.ready='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();refreshQuotes(true);});
      btn.addEventListener('pointerdown',e=>e.stopPropagation());
    });
    document.querySelectorAll('[data-metals-tab]').forEach(btn=>{
      if(btn.dataset.ready)return;btn.dataset.ready='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();active=btn.dataset.metalsTab;localStorage.setItem('windzxy-metals-active',active);draw();});
      btn.addEventListener('pointerdown',e=>e.stopPropagation());
    });
    document.querySelectorAll('[data-metals-open]').forEach(btn=>{
      if(btn.dataset.ready)return;btn.dataset.ready='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.open(btn.dataset.metalsOpen,'_blank','noopener,noreferrer');});
      btn.addEventListener('pointerdown',e=>e.stopPropagation());
    });
  }

  function installStyle(){
    if(document.getElementById('metalsWidgetStyle'))return;
    const s=document.createElement('style');
    s.id='metalsWidgetStyle';
    s.textContent=`
      .t-metals{--icon:linear-gradient(145deg,#ffd56f,#20d6ff);--glow:linear-gradient(135deg,#f7b733,#18d39c)}
      .pro-metals{height:100%;display:flex;flex-direction:column;gap:10px;min-height:0;color:var(--ink);font-variant-numeric:tabular-nums}
      .pm-topbar{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;min-height:30px}.pm-feed{display:flex;align-items:center;gap:8px;min-width:0;color:var(--muted);font-size:12px}.pm-feed strong{letter-spacing:.08em;font-size:11px;color:var(--ink);padding:4px 8px;border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.07)}.pm-feed em{font-style:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pm-live-dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.18);box-shadow:0 0 0 7px rgba(255,255,255,.05)}.pm-live-dot.ok{background:#22d47b;box-shadow:0 0 0 7px rgba(34,212,123,.15),0 0 18px rgba(34,212,123,.35)}.pm-refresh{width:38px;height:31px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:var(--ink);font-weight:900;cursor:pointer}
      .pm-tabs{display:flex;gap:8px;flex-wrap:wrap}.pm-tabs button{display:grid;grid-template-columns:auto auto;gap:8px;align-items:center;border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.065);color:var(--muted);padding:7px 12px;cursor:pointer}.pm-tabs button span{font-weight:850}.pm-tabs button b{font-size:12px;color:#25d889}.pm-tabs button.up b{color:#ff667c}.pm-tabs button.is-active{color:var(--ink);background:linear-gradient(135deg,rgba(255,211,106,.18),rgba(34,212,123,.12));border-color:rgba(255,211,106,.42);box-shadow:0 8px 26px rgba(247,183,51,.13)}
      .pm-hero{display:grid;grid-template-columns:minmax(0,1fr) 132px;gap:12px;border:1px solid rgba(255,255,255,.10);border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.105),rgba(255,255,255,.055));padding:14px;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 14px 36px rgba(0,0,0,.12)}.pm-main-quote{min-width:0}.pm-symbol{display:flex;align-items:baseline;gap:8px}.pm-symbol span{font-size:12px;font-weight:900;letter-spacing:.12em;color:#ffd36a}.pm-symbol b{font-size:21px}.pm-symbol small{color:var(--muted);font-weight:800}.pm-price-line{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:end;margin-top:8px}.pm-price-line strong{font-size:38px;line-height:.95;font-weight:950;letter-spacing:-.04em;color:#22d47b}.pm-price-line div{display:flex;flex-direction:column;align-items:flex-end;gap:4px}.pm-price-line b,.pm-price-line em{font-style:normal;font-size:15px;font-weight:900;color:#22d47b}.pm-hero.up .pm-price-line strong,.pm-hero.up .pm-price-line b,.pm-hero.up .pm-price-line em{color:#ff667c}.pm-range{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;margin-top:13px;color:var(--muted);font-size:11px}.pm-range div{position:relative;height:5px;border-radius:999px;background:linear-gradient(90deg,rgba(34,212,123,.28),rgba(255,211,106,.32),rgba(255,102,124,.28));overflow:visible}.pm-range i{position:absolute;top:50%;width:11px;height:11px;border-radius:50%;background:var(--ink);transform:translate(-50%,-50%);box-shadow:0 0 0 4px rgba(255,255,255,.12)}
      .pm-dealing{display:grid;gap:7px}.pm-dealing div{border:1px solid rgba(255,255,255,.08);border-radius:13px;background:rgba(0,0,0,.10);padding:8px 10px}.pm-dealing span{display:block;color:var(--muted);font-size:10px;letter-spacing:.1em}.pm-dealing b{display:block;margin-top:3px;font-size:16px;color:var(--ink)}.pm-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.pm-stats div{display:grid;grid-template-columns:auto 1fr;gap:1px 7px;align-items:center;border:1px solid rgba(255,255,255,.075);border-radius:14px;background:rgba(255,255,255,.045);padding:8px 9px}.pm-stats i{grid-row:span 2;width:25px;height:25px;border-radius:9px;display:grid;place-items:center;background:rgba(255,211,106,.12);color:#ffd36a;font-style:normal;font-size:10px;font-weight:900}.pm-stats span{color:var(--muted);font-size:11px}.pm-stats b{font-size:15px;color:var(--ink)}
      .pm-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;min-height:0}.pm-mini{display:grid;grid-template-columns:1fr;gap:2px;border:1px solid rgba(255,255,255,.075);border-radius:14px;background:rgba(255,255,255,.04);color:var(--ink);padding:8px 10px;text-align:left;cursor:pointer}.pm-mini span{font-size:12px;font-weight:900}.pm-mini strong{font-size:16px;color:#22d47b}.pm-mini em{font-style:normal;color:#22d47b;font-weight:850;font-size:12px}.pm-mini.up strong,.pm-mini.up em{color:#ff667c}.pm-foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:10px;color:var(--muted);font-size:12px}.pm-foot button{border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.10);color:var(--ink);padding:5px 12px;cursor:pointer}
      @media(max-width:640px){.pm-hero{grid-template-columns:1fr}.pm-dealing{grid-template-columns:repeat(3,1fr)}.pm-stats{grid-template-columns:repeat(2,1fr)}.pm-strip{grid-template-columns:1fr}.pm-price-line strong{font-size:32px}}
    `;
    document.head.appendChild(s);
  }

  function emptyQuote(p){return {id:p.id,name:p.name,short:p.short,url:p.url,unit:p.unit,ok:false,status:'等待行情讀數',price:null,change:null,pct:null,buy:null,sell:null,high:null,low:null,prev:null,open:null,t:'--',ts:0};}
  function num(v){const x=parseFloat(String(v??'').replace(/[,%+\s]/g,''));return Number.isFinite(x)?x:null;}
  function pick(o,keys){for(const k of keys){const x=num(o&&o[k]);if(Number.isFinite(x))return x;}return null;}
  function firstNum(){for(const v of arguments)if(Number.isFinite(v))return v;return null;}
  function valid(v,p){return Number.isFinite(v)&&(p.id==='xag'?v>5&&v<200:v>100&&v<10000);}
  function trendClass(q){const v=Number.isFinite(q.pct)?q.pct:q.change;return v>0?'up':v<0?'down':'flat';}
  function fmt(v){return Number.isFinite(v)?v.toFixed(2):'--';}
  function signed(v,suffix=''){return Number.isFinite(v)?(v>0?'+':'')+v.toFixed(2)+suffix:'--';}
  function now(){return new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  boot();
})();
