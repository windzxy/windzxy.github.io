(function(){
  if(window.__windzxyMetalsWidgetLoaded)return;
  window.__windzxyMetalsWidgetLoaded=true;

  const APP_ID='metals';
  const VERSION='20260819-gold-widget17-terminal-responsive';
  const FALLBACK_MS=500;
  const DEFAULT_W=520;
  const DEFAULT_H=360;
  const MIN_W=300;
  const MIN_H=238;
  const PRODUCTS=[
    {id:'xau',name:'現貨黃金',short:'黃金',symbol:'XAU',code:'hf_XAU',url:'https://www.gkoudai.com/quotesTrend/12.html',unit:'USD/oz'},
    {id:'xag',name:'現貨白銀',short:'白銀',symbol:'XAG',code:'hf_XAG',url:'https://www.gkoudai.com/quotesTrend/13.html',unit:'USD/oz'},
    {id:'xpt',name:'現貨鉑金',short:'鉑金',symbol:'XPT',code:'hf_XPT',url:'https://www.gkoudai.com/quotesTrend/74.html',unit:'USD/oz'},
    {id:'xpd',name:'現貨鈀金',short:'鈀金',symbol:'XPD',code:'hf_XPD',url:'https://www.gkoudai.com/quotesTrend/75.html',unit:'USD/oz'}
  ];

  let active=localStorage.getItem('windzxy-metals-active')||'xau';
  let viewMode=localStorage.getItem('windzxy-metals-view')||'quote';
  let quotes=Object.fromEntries(PRODUCTS.map(p=>[p.id,blank(p)]));
  let ticks=Object.fromEntries(PRODUCTS.map(p=>[p.id,[]]));
  let feedMode='backup';
  let timer=null;
  let busy=false;
  let pending=false;
  let bound=false;

  function boot(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'||typeof bodyHtml==='undefined'||typeof save==='undefined'){
      setTimeout(boot,80);return;
    }
    installStyle();installApp();patchRenderers();ensureCard();fitCards();renderAll();startFeed();
    window.windzxyRefreshMetals=()=>refreshQuotes(true);
  }

  function installApp(){
    const info={id:APP_ID,kind:'widget',title:'金價',desc:'交易主管級貴金屬行情終端，自適應行情與K線。',icon:'Au',tone:'t-metals'};
    const old=apps.find(a=>a.id===APP_ID);old?Object.assign(old,info):apps.push(info);
    if(typeof defaults!=='undefined')defaults.forEach(ws=>{
      if(ws.id==='daily'&&!ws.cards.some(c=>c.appId===APP_ID)){
        ws.cards.push({id:'daily-metals-0',appId:APP_ID,x:320,y:500,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
      }
    });
  }

  function ensureCard(){
    try{
      const ws=activeWorkspace();
      if(ws&&!ws.cards.some(c=>c.appId===APP_ID)){
        ws.cards.push({id:'card-metals-'+Date.now(),appId:APP_ID,x:320,y:500,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});save();
      }
    }catch(e){}
  }

  function fitCards(){
    try{
      let changed=false;
      workspaces.forEach(ws=>(ws.cards||[]).forEach(c=>{
        if(c.appId===APP_ID){
          if((c.w||0)<MIN_W){c.w=MIN_W;changed=true;}
          if((c.h||0)<MIN_H){c.h=MIN_H;changed=true;}
        }
      }));
      if(changed)save();
    }catch(e){}
  }

  function patchRenderers(){
    if(window.__windzxyMetalsWidgetPatched)return;
    window.__windzxyMetalsWidgetPatched=true;
    const oldBody=bodyHtml;
    bodyHtml=(card,info)=>card&&card.appId===APP_ID?renderWidget(card):oldBody(card,info);
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

  function renderWidget(card={}){
    const p=PRODUCTS.find(x=>x.id===active)||PRODUCTS[0];
    const q=quotes[p.id]||blank(p);
    const stale=q.ts&&Date.now()-q.ts>45000;
    const cls=[(card.w||DEFAULT_W)<420?'is-compact':'',(card.w||DEFAULT_W)<350?'is-tiny':'',(card.h||DEFAULT_H)<302?'is-short':'',viewMode==='chart'?'mode-chart':'mode-quote',trend(q)].join(' ');
    const feed=feedMode==='api'?'API PUSH':'0.5s BACKUP';
    return `<div class="metals-widget terminal-metals ${cls}" data-metals-version="${esc(VERSION)}">
      <header class="tm-head">
        <div class="tm-feed"><i class="${q.ok&&!stale?'on':''}"></i><b>${feed}</b><span>${esc(q.status||'等待行情')}</span></div>
        <div class="tm-tools"><button class="${viewMode==='quote'?'on':''}" data-metals-view="quote">行情</button><button class="${viewMode==='chart'?'on':''}" data-metals-view="chart">K線</button><button data-metals-refresh title="刷新">↻</button></div>
      </header>
      <nav class="tm-tabs">${PRODUCTS.map(tabHtml).join('')}</nav>
      ${viewMode==='chart'?chartView(p,q):quoteView(p,q)}
      <section class="tm-stats">${stat('H','最高',q.high)}${stat('L','最低',q.low)}${stat('YC','昨收',q.prev)}${stat('O','今開',q.open)}</section>
      <footer class="tm-foot"><span>${stale?'行情可能已過期':'更新'} ${esc(q.t||'--')}</span><button data-metals-open="${esc(q.url)}">源頁</button></footer>
    </div>`;
  }

  function tabHtml(p){
    const q=quotes[p.id]||blank(p);
    return `<button class="${p.id===active?'on':''} ${trend(q)}" data-metals-tab="${esc(p.id)}"><strong>${esc(p.short)}</strong><small>${fmt(q.price)}</small></button>`;
  }

  function quoteView(p,q){
    const spread=is(q.buy)&&is(q.sell)?Math.abs(q.sell-q.buy):null;
    return `<section class="tm-panel quote ${trend(q)}">
      <div class="tm-primary">
        <div class="tm-symbol"><em>${esc(p.symbol)}</em><b>${esc(p.name)}</b><span>${esc(p.unit)}</span></div>
        <div class="tm-price"><strong>${fmt(q.price)}</strong><p><b>${signed(q.change)}</b><b>${signed(q.pct,'%')}</b></p></div>
        ${rangeBar(q)}
      </div>
      <div class="tm-deal">${deal('BID 買入',q.buy)}${deal('ASK 賣出',q.sell)}${deal('SPREAD',spread)}</div>
    </section>`;
  }

  function chartView(p,q){
    return `<section class="tm-panel chart ${trend(q)}">
      <div class="tm-chart-main">
        <div class="tm-symbol"><em>${esc(p.symbol)}</em><b>${esc(p.name)} K線</b><span>${esc(p.unit)}</span></div>
        ${chartSvg(p,q)}
      </div>
      <div class="tm-deal slim">${deal('最新',q.price)}${deal('漲跌',q.change,true)}${deal('漲幅',q.pct,true,'%')}</div>
    </section>`;
  }

  function deal(label,value,sgn=false,suffix=''){return `<div><span>${esc(label)}</span><b>${sgn?signed(value,suffix):fmt(value)}</b></div>`;}
  function stat(k,label,value){return `<div><i>${esc(k)}</i><span>${esc(label)}</span><b>${fmt(value)}</b></div>`;}
  function rangeBar(q){
    const ok=is(q.price)&&is(q.low)&&is(q.high)&&q.high>q.low;
    const pc=ok?Math.max(0,Math.min(100,(q.price-q.low)/(q.high-q.low)*100)):50;
    return `<div class="tm-range"><span>${fmt(q.low)}</span><div><i style="left:${pc}%"></i></div><span>${fmt(q.high)}</span></div>`;
  }

  function chartSvg(p,q){
    const data=buildCandles(p,q);
    if(data.length<2)return '<div class="tm-chart-empty">等待更多行情點</div>';
    let vals=[];data.forEach(c=>vals.push(c.o,c.h,c.l,c.c));
    let lo=Math.min(...vals),hi=Math.max(...vals);if(hi<=lo){hi+=1;lo-=1;}
    const w=520,h=142,pad=12,step=(w-pad*2)/Math.max(1,data.length-1);
    const y=v=>pad+(hi-v)/(hi-lo)*(h-pad*2);
    const bodies=data.map((c,i)=>{
      const x=pad+i*step,up=c.c>=c.o,top=Math.min(y(c.o),y(c.c)),bot=Math.max(y(c.o),y(c.c));
      const cw=Math.max(3,Math.min(9,step*.52)),bh=Math.max(2,bot-top);
      return `<g class="c ${up?'up':'down'}"><line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${y(c.h).toFixed(1)}" y2="${y(c.l).toFixed(1)}"/><rect x="${(x-cw/2).toFixed(1)}" y="${top.toFixed(1)}" width="${cw.toFixed(1)}" height="${bh.toFixed(1)}" rx="1.5"/></g>`;
    }).join('');
    return `<svg class="tm-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path class="grid" d="M0 ${pad}H${w}M0 ${h/2}H${w}M0 ${h-pad}H${w}"/>${bodies}</svg>`;
  }

  function buildCandles(p,q){
    const arr=ticks[p.id]||[];
    if(is(q.price)&&(!arr.length||arr[arr.length-1].v!==q.price))pushTick(p,q.price);
    const src=(ticks[p.id]||[]).slice(-54);
    if(src.length<2)return [];
    const size=Math.max(1,Math.ceil(src.length/28));
    const out=[];
    for(let i=0;i<src.length;i+=size){
      const part=src.slice(i,i+size),vals=part.map(x=>x.v);
      out.push({o:vals[0],c:vals[vals.length-1],h:Math.max(...vals),l:Math.min(...vals)});
    }
    return out.slice(-32);
  }

  function pushTick(p,price){
    if(!is(price))return;
    const arr=ticks[p.id]||[];
    const last=arr[arr.length-1];
    if(last&&last.v===price)return;
    arr.push({v:price,t:Date.now()});
    ticks[p.id]=arr.slice(-160);
  }

  function startFeed(){
    clearInterval(timer);
    if(initApiPush())return;
    feedMode='backup';
    refreshQuotes(true);
    timer=setInterval(()=>{if(!document.hidden)refreshQuotes(false);},FALLBACK_MS);
    if(!bound){
      bound=true;
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshQuotes(true);},{passive:true});
      window.addEventListener('focus',()=>refreshQuotes(true));
      window.addEventListener('online',()=>refreshQuotes(true));
    }
  }

  function initApiPush(){
    const sdk=window.socketSdk||window.koudaiSocketSdk||window.koudaiQuoteSdk;
    const fn=sdk&&(sdk.quote||sdk.subscribeQuote);
    if(typeof fn!=='function')return false;
    feedMode='api';
    try{
      PRODUCTS.forEach(p=>fn.call(sdk,{quoteParam:p.symbol},d=>{const x=parseApi(d,p);if(x)putQuote(p,x,'口袋 API 推送');}));
      Object.values(quotes).forEach(q=>q.status='等待 API 推送…');draw();return true;
    }catch(e){console.warn('koudai api unavailable',e);feedMode='backup';return false;}
  }

  async function refreshQuotes(force){
    if(feedMode==='api'&&!force)return;
    if(busy){pending=!!force;return;}
    busy=true;
    if(force){Object.values(quotes).forEach(q=>q.status='讀取行情中…');draw();}
    try{
      const data=await loadTencent();
      PRODUCTS.forEach(p=>data[p.code]?putQuote(p,data[p.code],'公開行情備援'):Object.assign(quotes[p.id],{ok:false,status:'行情暫未返回',t:now(),ts:Date.now()}));
    }catch(e){console.warn(e);PRODUCTS.forEach(p=>Object.assign(quotes[p.id],{ok:false,status:'行情源暫不可用',t:now(),ts:Date.now()}));}
    busy=false;draw();if(pending){pending=false;refreshQuotes(true);}
  }

  function putQuote(p,x,source){
    const old=quotes[p.id]||blank(p);
    const m=sanitize(Object.assign({},old,x),p,old);
    if(!m)return;
    pushTick(p,m.price);
    quotes[p.id]=Object.assign(blank(p),old,m,{ok:is(m.price),status:source,t:now(),ts:Date.now()});
  }

  function loadTencent(){
    return new Promise(resolve=>{
      const id='metalsTencentQuoteScript';document.getElementById(id)?.remove();
      PRODUCTS.forEach(p=>{try{delete window['v_'+p.code];}catch(e){}});
      const s=document.createElement('script');s.id=id;s.charset='gbk';s.src='https://qt.gtimg.cn/q='+encodeURIComponent(PRODUCTS.map(p=>p.code).join(','))+'&_='+Date.now();
      let done=false;const finish=()=>{if(done)return;done=true;setTimeout(()=>{const out={};PRODUCTS.forEach(p=>{const x=parseText(window['v_'+p.code],p);if(x)out[p.code]=x;});resolve(out);},40);};
      s.onload=finish;s.onerror=()=>resolve({});setTimeout(()=>resolve({}),4800);document.head.appendChild(s);
    });
  }

  function parseApi(d,p){
    let o=d;if(typeof d==='string'){try{o=JSON.parse(d);}catch(e){return parseText(d,p);}}
    if(Array.isArray(o))o=o[0]||{};o=o.data||o.quote||o.result||o.payload||o;return normalize(o,p);
  }
  function parseText(raw,p){
    const t=String(raw||'').replace(/^.*?="|";?$/g,'');if(!t)return null;
    if(t.includes('~')){const f=t.split('~');return normalize({price:f[3],prev:f[4],open:f[5],buy:f[9],sell:f[19],change:f[31],pct:f[32],high:f[33],low:f[34]},p);}
    if(t.includes(',')){
      const parts=t.split(','),v=parts.map(strictNum),seed=firstGood(v,p,null);
      const price=good(v[0],p,seed)?v[0]:good(v[3],p,seed)?v[3]:seed;if(!good(price,p,null))return null;
      const pool=v.filter(x=>good(x,p,price));
      const high=firstGood([v[33],v[41],v[6]],p,price),low=firstGood([v[34],v[42],v[5]],p,price);
      return sanitize({price,buy:good(v[2],p,price)?v[2]:price,sell:good(v[3],p,price)?v[3]:price,open:good(v[4],p,price)?v[4]:null,prev:good(v[7],p,price)?v[7]:null,high:good(high,p,price)?high:(pool.length?Math.max(...pool):null),low:good(low,p,price)?low:(pool.length?Math.min(...pool):null),pct:Math.abs(num(parts[1]))<50?num(parts[1]):Math.abs(num(parts[32]))<50?num(parts[32]):null,change:Math.abs(num(parts[2]))<Math.max(price*.2,10)?num(parts[2]):Math.abs(num(parts[31]))<Math.max(price*.2,10)?num(parts[31]):null},p,null);
    }
    return null;
  }
  function normalize(o,p){return sanitize({price:pick(o,['price','last','lastPrice','latest','latestPrice','now','close','current','newPrice']),buy:pick(o,['buy','bid','buyPrice','bidPrice','buyOne','bid1']),sell:pick(o,['sell','ask','sellPrice','askPrice','sellOne','ask1']),high:pick(o,['high','highest','highPrice','max','maxPrice']),low:pick(o,['low','lowest','lowPrice','min','minPrice']),open:pick(o,['open','openPrice','todayOpen','opening']),prev:pick(o,['prev','prevClose','preClose','yesterdayClose','lastClose','yesClose']),change:pick(o,['change','chg','upDown','priceChange','riseFall','diff']),pct:pick(o,['pct','changePct','changeRate','upDownRate','percent','rate'])},p,null);}
  function sanitize(x,p,old){
    x=Object.assign({},x);x.price=first(x.price,old&&old.price);if(!good(x.price,p,null))return null;
    ['buy','sell','high','low','open','prev'].forEach(k=>{x[k]=first(x[k],old&&old[k]);if(!good(x[k],p,x.price))x[k]=null;});
    if(!good(x.buy,p,x.price))x.buy=x.price;if(!good(x.sell,p,x.price))x.sell=x.price;
    x.change=first(x.change,old&&old.change);x.pct=first(x.pct,old&&old.pct);
    const core=[x.price,x.buy,x.sell,x.open,x.prev].filter(v=>good(v,p,x.price));
    const mx=core.length?Math.max(...core):x.price,mn=core.length?Math.min(...core):x.price;
    if(!good(x.high,p,x.price)||x.high<mx)x.high=mx;if(!good(x.low,p,x.price)||x.low>mn)x.low=mn;
    if(is(x.high)&&is(x.low)&&x.high<x.low){const z=x.high;x.high=x.low;x.low=z;}
    if(is(x.price)&&is(x.high)&&x.price>x.high)x.high=x.price;if(is(x.price)&&is(x.low)&&x.price<x.low)x.low=x.price;
    if(!is(x.change)&&is(x.price)&&is(x.prev))x.change=x.price-x.prev;if(!is(x.pct)&&is(x.change)&&is(x.prev)&&x.prev)x.pct=x.change/x.prev*100;
    return x;
  }

  function draw(){document.querySelectorAll('[data-card-id]').forEach(el=>{const c=activeWorkspace().cards.find(x=>x.id===el.dataset.cardId);if(c?.appId===APP_ID){const b=el.querySelector('.card-body');if(b)b.innerHTML=renderWidget(c);}});bind();}
  function bind(){
    document.querySelectorAll('[data-metals-refresh]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();refreshQuotes(true);};b.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-metals-tab]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();active=b.dataset.metalsTab;localStorage.setItem('windzxy-metals-active',active);draw();};b.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-metals-view]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();viewMode=b.dataset.metalsView;localStorage.setItem('windzxy-metals-view',viewMode);draw();};b.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-metals-open]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();window.open(b.dataset.metalsOpen,'_blank','noopener,noreferrer');};b.onpointerdown=e=>e.stopPropagation();});
  }

  function installStyle(){
    if(document.getElementById('metalsWidgetStyle'))return;
    const s=document.createElement('style');s.id='metalsWidgetStyle';
    s.textContent=`
      .t-metals{--icon:linear-gradient(145deg,#ffd56f,#20d6ff);--glow:linear-gradient(135deg,#f7b733,#18d39c)}
      .terminal-metals{height:100%;min-width:0;min-height:0;box-sizing:border-box;container-type:inline-size;display:flex;flex-direction:column;gap:9px;overflow:hidden;color:var(--ink);font-variant-numeric:tabular-nums}
      .terminal-metals *{box-sizing:border-box;min-width:0}.tm-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}.tm-feed{display:flex;align-items:center;gap:7px;min-width:0;color:var(--muted);font-size:12px}.tm-feed i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.18);box-shadow:0 0 0 7px rgba(255,255,255,.05);flex:0 0 auto}.tm-feed i.on{background:#22d47b;box-shadow:0 0 0 7px rgba(34,212,123,.14),0 0 16px rgba(34,212,123,.35)}.tm-feed b{flex:0 0 auto;color:var(--ink);font-size:11px;letter-spacing:.06em;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.09)}.tm-feed span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tm-tools{display:flex;gap:5px}.tm-tools button,.tm-foot button{border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.09);color:var(--ink);font-weight:850;cursor:pointer}.tm-tools button{height:30px;padding:0 10px}.tm-tools button.on{background:rgba(255,255,255,.19)}
      .tm-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.tm-tabs button{border:1px solid rgba(255,255,255,.10);border-radius:16px;background:rgba(255,255,255,.065);color:var(--muted);padding:8px 10px;display:grid;grid-template-columns:auto 1fr;gap:7px;align-items:center;cursor:pointer}.tm-tabs strong{font-size:14px;color:var(--ink);white-space:nowrap}.tm-tabs small{font-size:12px;color:#25d889;text-align:right;overflow:hidden;text-overflow:ellipsis}.tm-tabs .up small{color:#ff667c}.tm-tabs .on{border-color:rgba(255,211,106,.42);background:linear-gradient(135deg,rgba(255,211,106,.18),rgba(34,212,123,.10))}
      .tm-panel{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(108px,132px);gap:12px;border:1px solid rgba(255,255,255,.10);border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.105),rgba(255,255,255,.055));padding:13px;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 14px 34px rgba(0,0,0,.12);overflow:hidden}.tm-primary,.tm-chart-main{display:flex;flex-direction:column;min-height:0}.tm-symbol{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.tm-symbol em{font-style:normal;font-size:12px;font-weight:950;letter-spacing:.12em;color:#ffd36a}.tm-symbol b{font-size:clamp(18px,4.4cqw,24px);line-height:1.1}.tm-symbol span{font-size:12px;color:var(--muted);font-weight:850}.tm-price{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end;margin-top:8px}.tm-price strong{font-size:clamp(30px,10.5cqw,46px);line-height:.95;font-weight:950;letter-spacing:-.04em;color:#22d47b}.tm-price p{margin:0;display:flex;flex-direction:column;align-items:flex-end;gap:3px}.tm-price b{font-size:clamp(13px,3.2cqw,17px);color:#22d47b}.tm-panel.up .tm-price strong,.tm-panel.up .tm-price b{color:#ff667c}.tm-range{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;margin-top:auto;padding-top:12px;color:var(--muted);font-size:11px}.tm-range div{height:5px;border-radius:999px;position:relative;background:linear-gradient(90deg,rgba(34,212,123,.28),rgba(255,211,106,.32),rgba(255,102,124,.28))}.tm-range i{position:absolute;top:50%;width:11px;height:11px;border-radius:50%;background:var(--ink);transform:translate(-50%,-50%);box-shadow:0 0 0 4px rgba(255,255,255,.12)}.tm-deal{display:grid;gap:7px}.tm-deal div{border:1px solid rgba(255,255,255,.08);border-radius:13px;background:rgba(0,0,0,.10);padding:8px 10px;overflow:hidden}.tm-deal span{display:block;color:var(--muted);font-size:10px;letter-spacing:.09em;white-space:nowrap}.tm-deal b{display:block;margin-top:3px;font-size:clamp(15px,4.2cqw,18px);color:var(--ink);overflow:hidden;text-overflow:ellipsis}.tm-chart{width:100%;height:100%;min-height:110px;display:block;margin-top:8px}.tm-chart .grid{stroke:rgba(255,255,255,.08);stroke-width:1}.tm-chart .c line{stroke-width:1.4}.tm-chart .c rect{stroke-width:0}.tm-chart .c.up line,.tm-chart .c.up rect{stroke:#22d47b;fill:#22d47b}.tm-chart .c.down line,.tm-chart .c.down rect{stroke:#ff667c;fill:#ff667c}.tm-chart-empty{display:grid;place-items:center;min-height:110px;color:var(--muted);font-size:13px;border:1px dashed rgba(255,255,255,.13);border-radius:14px;margin-top:8px}
      .tm-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.tm-stats div{display:grid;grid-template-columns:auto 1fr;gap:1px 7px;align-items:center;border:1px solid rgba(255,255,255,.075);border-radius:14px;background:rgba(255,255,255,.045);padding:8px 9px;overflow:hidden}.tm-stats i{grid-row:span 2;width:24px;height:24px;border-radius:8px;display:grid;place-items:center;background:rgba(255,211,106,.12);color:#ffd36a;font-style:normal;font-size:10px;font-weight:900}.tm-stats span{color:var(--muted);font-size:11px}.tm-stats b{font-size:14px;color:var(--ink);overflow:hidden;text-overflow:ellipsis}.tm-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--muted);font-size:12px}.tm-foot span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tm-foot button{padding:5px 12px;flex:0 0 auto}
      .terminal-metals.is-compact .tm-panel{grid-template-columns:1fr}.terminal-metals.is-compact .tm-deal{grid-template-columns:repeat(3,minmax(0,1fr))}.terminal-metals.is-compact .tm-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.terminal-metals.is-compact .tm-tabs{grid-template-columns:repeat(2,minmax(0,1fr))}.terminal-metals.is-tiny .tm-head{grid-template-columns:1fr}.terminal-metals.is-tiny .tm-tools{justify-content:flex-start}.terminal-metals.is-tiny .tm-tabs button{padding:7px 8px}.terminal-metals.is-tiny .tm-price{grid-template-columns:1fr}.terminal-metals.is-tiny .tm-price p{align-items:flex-start;flex-direction:row}.terminal-metals.is-short .tm-stats{display:none}.terminal-metals.is-short .tm-panel{padding:11px}.terminal-metals.is-short .tm-range{padding-top:8px}.terminal-metals.mode-chart .tm-stats{grid-template-columns:repeat(4,minmax(0,1fr))}
      @container (max-width:420px){.tm-panel{grid-template-columns:1fr}.tm-deal{grid-template-columns:repeat(3,minmax(0,1fr))}.tm-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.tm-tabs{grid-template-columns:repeat(2,minmax(0,1fr))}.tm-price strong{font-size:34px}.tm-symbol b{font-size:19px}}
      @container (max-width:340px){.tm-head{grid-template-columns:1fr}.tm-tools{justify-content:flex-start}.tm-price{grid-template-columns:1fr}.tm-price p{align-items:flex-start;flex-direction:row}.tm-deal{grid-template-columns:1fr}.tm-tabs small{font-size:11px}.tm-stats div{padding:7px}.tm-foot{font-size:11px}}
    `;document.head.appendChild(s);
  }

  function blank(p){return {id:p.id,name:p.name,short:p.short,url:p.url,unit:p.unit,ok:false,status:'等待行情讀數',price:null,change:null,pct:null,buy:null,sell:null,high:null,low:null,prev:null,open:null,t:'--',ts:0};}
  function num(v){const x=parseFloat(String(v??'').replace(/[,%+\s]/g,''));return Number.isFinite(x)?x:null;}
  function strictNum(v){const s=String(v??'').trim();return /^[+-]?\d{1,5}(?:\.\d{1,4})?$/.test(s)?num(s):null;}
  function pick(o,keys){for(const k of keys){const x=num(o&&o[k]);if(is(x))return x;}return null;}
  function first(){for(const v of arguments)if(is(v))return v;return null;}
  function firstGood(arr,p,anchor){for(const v of arr)if(good(v,p,anchor))return v;return null;}
  function good(v,p,anchor){if(!is(v))return false;const base=p.id==='xag'?v>5&&v<200:v>100&&v<10000;if(!base)return false;if(is(anchor)&&anchor>0){const band=p.id==='xag'?.5:.25;if(Math.abs(v-anchor)/anchor>band)return false;}return true;}
  function is(v){return Number.isFinite(v);}
  function trend(q){const v=is(q.pct)?q.pct:q.change;return v>0?'up':v<0?'down':'flat';}
  function fmt(v){return is(v)?v.toFixed(2):'--';}
  function signed(v,suffix=''){return is(v)?(v>0?'+':'')+v.toFixed(2)+suffix:'--';}
  function now(){return new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  boot();
})();