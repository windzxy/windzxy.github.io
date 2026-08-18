(function(){
  if(window.__windzxyMetalsWidgetLoaded)return;
  window.__windzxyMetalsWidgetLoaded=true;

  const APP_ID="metals";
  const VERSION="20260818-gold-widget11-readable-quotes";
  const REFRESH_MS=5000;
  const DEFAULT_W=456;
  const DEFAULT_H=282;
  const PRODUCTS=[
    {id:"xau",name:"現貨黃金",short:"黃金",code:"hf_XAU",url:"https://www.gkoudai.com/quotesTrend/12.html",unit:"USD/oz"},
    {id:"xag",name:"現貨白銀",short:"白銀",code:"hf_XAG",url:"https://www.gkoudai.com/quotesTrend/13.html",unit:"USD/oz"},
    {id:"xpt",name:"現貨鉑金",short:"鉑金",code:"hf_XPT",url:"https://www.gkoudai.com/quotesTrend/74.html",unit:"USD/oz"},
    {id:"xpd",name:"現貨鈀金",short:"鈀金",code:"hf_XPD",url:"https://www.gkoudai.com/quotesTrend/75.html",unit:"USD/oz"}
  ];
  let activeProductId=localStorage.getItem("windzxy-metals-active")||"xau";
  let quotes=Object.fromEntries(PRODUCTS.map(p=>[p.id,emptyQuote(p)]));
  let loading=false;
  let pendingRefresh=false;
  let refreshTimer=null;

  function boot(){
    if(typeof apps==="undefined"||typeof renderAll==="undefined"||typeof bodyHtml==="undefined"||typeof save==="undefined"){
      setTimeout(boot,80);
      return;
    }
    installStyle();
    installApp();
    patchRenderers();
    ensureDefaultCard();
    normalizeExistingCards();
    renderAll();
    refreshQuotes({force:true});
    startRefresh();
    window.windzxyRefreshMetals=()=>refreshQuotes({force:true});
  }

  function installApp(){
    const info={id:APP_ID,kind:"widget",title:"金價",desc:"同步現貨黃金、白銀、鉑金、鈀金的行情讀數。",icon:"Au",tone:"t-metals"};
    const existed=apps.find(app=>app.id===APP_ID);
    if(existed)Object.assign(existed,info);else apps.push(info);
    if(typeof defaults!=="undefined"){
      defaults.forEach(ws=>{
        if(ws.id==="daily"&&!ws.cards.some(card=>card.appId===APP_ID)){
          ws.cards.push({id:"daily-metals-0",appId:APP_ID,x:350,y:520,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        }
      });
    }
  }

  function ensureDefaultCard(){
    try{
      const ws=activeWorkspace();
      if(ws&&!ws.cards.some(card=>card.appId===APP_ID)){
        ws.cards.push({id:"card-metals-"+Date.now(),appId:APP_ID,x:350,y:520,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();
      }
    }catch(error){console.warn("metals default card skipped",error)}
  }

  function normalizeExistingCards(){
    try{
      let changed=false;
      workspaces.forEach(ws=>{
        (ws.cards||[]).forEach(card=>{
          if(card.appId===APP_ID){
            if((card.w||0)<DEFAULT_W){card.w=DEFAULT_W;changed=true;}
            if((card.h||0)<DEFAULT_H){card.h=DEFAULT_H;changed=true;}
          }
        });
      });
      if(changed)save();
    }catch(error){console.warn("metals normalize skipped",error)}
  }

  function patchRenderers(){
    if(window.__windzxyMetalsWidgetPatched)return;
    window.__windzxyMetalsWidgetPatched=true;
    const oldBodyHtml=bodyHtml;
    bodyHtml=function(card,info){
      if(card&&card.appId===APP_ID)return metalsHtml(card);
      return oldBodyHtml(card,info);
    };
    if(typeof addCard==="function"){
      const oldAddCard=addCard;
      addCard=function(appId){
        if(appId!==APP_ID)return oldAddCard(appId);
        const i=activeWorkspace().cards.length;
        activeWorkspace().cards.push({id:"card-"+Date.now()+"-"+Math.random().toString(16).slice(2),appId:APP_ID,x:72+(i%4)*44,y:78+(i%5)*34,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();renderAll();refreshQuotes({force:true});
      };
    }
  }

  function metalsHtml(){
    const product=PRODUCTS.find(p=>p.id===activeProductId)||PRODUCTS[0];
    const q=quotes[product.id]||emptyQuote(product);
    const trend=trendClass(q.pct,q.change);
    const others=PRODUCTS.filter(p=>p.id!==product.id).map(p=>miniRow(quotes[p.id]||emptyQuote(p),p)).join("");
    return '<div class="metals-widget metals-readings" data-metals-version="'+esc(VERSION)+'">'
      +'<div class="metals-status"><span class="metals-dot '+(q.ok?'ok':'')+'"></span><span>'+esc(q.status||"等待行情讀數")+'</span><button type="button" title="刷新" data-metals-refresh>↻</button></div>'
      +'<div class="metals-tabs">'+PRODUCTS.map(tabHtml).join("")+'</div>'
      +'<section class="koudai-reading '+trend+'">'
        +'<div class="koudai-title"><h4>'+esc(q.name)+'的行情走勢</h4><strong>'+fmt(q.price,2)+'</strong><span>'+fmtSigned(q.change,2)+'</span><em>'+fmtSigned(q.pct,2,"%")+'</em></div>'
        +'<div class="koudai-metrics">'
          +metric("買入",q.buy)+metric("最高",q.high)+metric("昨收",q.prevClose)
          +metric("賣出",q.sell)+metric("最低",q.low)+metric("今開",q.open)
        +'</div>'
      +'</section>'
      +'<section class="metals-mini-list">'+others+'</section>'
      +'<div class="metals-foot"><span>更新 '+esc(q.time||"--")+'</span><span><button type="button" data-metals-open="'+esc(q.url)+'">源頁</button></span></div>'
      +'</div>';
  }

  function tabHtml(product){
    return '<button type="button" class="'+(product.id===activeProductId?'is-active':'')+'" data-metals-tab="'+esc(product.id)+'">'+esc(product.short)+'</button>';
  }

  function metric(label,value){return '<div><span>'+esc(label)+'：</span><b>'+fmt(value,2)+'</b></div>'}

  function miniRow(q,product){
    const trend=trendClass(q.pct,q.change);
    return '<button type="button" class="metal-mini '+trend+'" data-metals-tab="'+esc(product.id)+'">'
      +'<b>'+esc(product.name)+'</b><strong>'+fmt(q.price,2)+'</strong><span>'+fmtSigned(q.change,2)+'</span><em>'+fmtSigned(q.pct,2,"%")+'</em>'
      +'</button>';
  }

  function refreshQuotes(options={}){
    if(loading){pendingRefresh=!!options.force;return;}
    loading=true;
    pendingRefresh=false;
    if(!options.silent){
      Object.keys(quotes).forEach(id=>quotes[id].status="刷新中…");
      rerenderMetalsOnly();
    }
    loadTencentScript().then(next=>{
      if(next&&Object.keys(next).length){
        PRODUCTS.forEach(p=>{
          if(next[p.id])quotes[p.id]=next[p.id];
          else quotes[p.id]=Object.assign({},quotes[p.id]||emptyQuote(p),{ok:false,status:"行情未返回",time:timeText()});
        });
      }else{
        PRODUCTS.forEach(p=>quotes[p.id]=Object.assign({},quotes[p.id]||emptyQuote(p),{ok:false,status:"行情源暫不可用",time:timeText()}));
      }
    }).catch(error=>{
      console.warn("metals quote failed",error);
      PRODUCTS.forEach(p=>quotes[p.id]=Object.assign({},quotes[p.id]||emptyQuote(p),{ok:false,status:"行情源暫不可用",time:timeText()}));
    }).finally(()=>{
      loading=false;
      rerenderMetalsOnly();
      if(pendingRefresh)refreshQuotes({force:true});
    });
  }

  function loadTencentScript(){
    return new Promise(resolve=>{
      const id="windzxyTencentMetalsQuotes";
      document.getElementById(id)?.remove();
      PRODUCTS.forEach(p=>{try{delete window["v_"+p.code]}catch(error){}});
      const script=document.createElement("script");
      script.id=id;
      script.charset="gbk";
      script.src="https://qt.gtimg.cn/q="+PRODUCTS.map(p=>p.code).join(",")+"&_="+Date.now();
      let done=false;
      const finish=()=>{
        if(done)return;
        done=true;
        setTimeout(()=>resolve(parseTencentQuotes()),60);
      };
      script.onload=finish;
      script.onerror=()=>{if(!done){done=true;resolve(null)}};
      setTimeout(()=>{if(!done){done=true;resolve(parseTencentQuotes())}},3200);
      document.head.appendChild(script);
    });
  }

  function parseTencentQuotes(){
    const out={};
    PRODUCTS.forEach(product=>{
      const raw=window["v_"+product.code];
      const parsed=parseTencentQuote(raw,product);
      if(parsed)out[product.id]=parsed;
    });
    return out;
  }

  function parseTencentQuote(raw,product){
    if(!raw||String(raw).includes("none_match"))return null;
    const f=String(raw).replace(/^\"|\"$/g,"").split(",");
    const price=num(f[0]);
    const pct=num(f[1]);
    const buy=num(f[2]);
    const sell=num(f[3]);
    const high=num(f[4]);
    const low=num(f[5]);
    const prevClose=num(f[7]);
    const open=num(f[8]);
    if(!Number.isFinite(price))return null;
    const change=Number.isFinite(prevClose)?price-prevClose:null;
    const date=f[12]||"";
    const tick=f[6]||"";
    return {id:product.id,name:product.name,url:product.url,unit:product.unit,ok:true,status:"讀數已更新 · "+REFRESH_MS/1000+"秒",price,pct,change,buy,sell,high,low,prevClose,open,time:(date&&tick?date+" "+tick:timeText()),source:"qt.gtimg.cn "+product.code};
  }

  function emptyQuote(product){
    return {id:product.id,name:product.name,url:product.url,unit:product.unit,ok:false,status:"等待行情讀數",price:null,change:null,pct:null,buy:null,sell:null,high:null,low:null,prevClose:null,open:null,time:"--",source:""};
  }

  function startRefresh(){
    clearInterval(refreshTimer);
    refreshTimer=setInterval(()=>{if(!document.hidden)refreshQuotes({silent:true});},REFRESH_MS);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)refreshQuotes({force:true});});
    window.addEventListener("focus",()=>refreshQuotes({force:true}));
    window.addEventListener("online",()=>refreshQuotes({force:true}));
  }

  function rerenderMetalsOnly(){
    document.querySelectorAll("[data-card-id]").forEach(cardEl=>{
      const id=cardEl.dataset.cardId;
      const card=activeWorkspace().cards.find(x=>x.id===id);
      if(card?.appId===APP_ID){
        const body=cardEl.querySelector(".card-body");
        if(body)body.innerHTML=metalsHtml(card);
      }
    });
    bindButtons();
  }

  function bindButtons(){
    document.querySelectorAll("[data-metals-refresh]").forEach(btn=>{
      if(btn.dataset.ready)return;
      btn.dataset.ready="1";
      btn.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();refreshQuotes({force:true});});
      btn.addEventListener("pointerdown",event=>event.stopPropagation());
    });
    document.querySelectorAll("[data-metals-tab]").forEach(btn=>{
      if(btn.dataset.ready)return;
      btn.dataset.ready="1";
      btn.addEventListener("click",event=>{
        event.preventDefault();event.stopPropagation();
        activeProductId=btn.dataset.metalsTab||"xau";
        localStorage.setItem("windzxy-metals-active",activeProductId);
        rerenderMetalsOnly();
      });
      btn.addEventListener("pointerdown",event=>event.stopPropagation());
    });
    document.querySelectorAll("[data-metals-open]").forEach(btn=>{
      if(btn.dataset.ready)return;
      btn.dataset.ready="1";
      btn.addEventListener("click",event=>{
        event.preventDefault();event.stopPropagation();
        const opened=window.open(btn.dataset.metalsOpen,"_blank","noopener,noreferrer");
        if(opened)opened.opener=null;
      });
      btn.addEventListener("pointerdown",event=>event.stopPropagation());
    });
  }

  function installStyle(){
    if(document.getElementById("metalsWidgetStyle"))return;
    const css=document.createElement("style");
    css.id="metalsWidgetStyle";
    css.textContent=`
      .t-metals{--icon:linear-gradient(145deg,#f5b342,#21d4fd);--glow:linear-gradient(135deg,#f5b342,#21d4fd)}
      .metals-widget{height:100%;display:flex;flex-direction:column;gap:8px;min-height:0;font-variant-numeric:tabular-nums;color:var(--ink)}
      .metals-status{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;color:var(--muted);font-size:13px;min-height:28px}
      .metals-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.18);box-shadow:0 0 0 7px rgba(255,255,255,.06)}
      .metals-dot.ok{background:#20d27c;box-shadow:0 0 0 7px rgba(32,210,124,.14)}
      .metals-status button{width:38px;height:32px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:var(--ink);cursor:pointer;font-weight:900}
      .metals-tabs{display:flex;gap:8px;flex-wrap:wrap}
      .metals-tabs button{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.10);color:var(--ink);border-radius:999px;padding:6px 14px;font-weight:850;cursor:pointer}
      .metals-tabs button.is-active{background:rgba(22,163,112,.42);border-color:rgba(34,211,138,.55)}
      .koudai-reading{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.08);border-radius:20px;padding:14px 16px}
      .koudai-title{display:grid;grid-template-columns:minmax(150px,1fr) auto auto auto;align-items:baseline;gap:18px;margin-bottom:13px}
      .koudai-title h4{margin:0;font-size:20px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .koudai-title strong{font-size:24px;font-weight:900;color:#22d28a}
      .koudai-title span,.koudai-title em{font-size:18px;font-style:normal;font-weight:850;color:#22d28a;white-space:nowrap}
      .koudai-reading.up .koudai-title strong,.koudai-reading.up .koudai-title span,.koudai-reading.up .koudai-title em{color:#ff6b7d}
      .koudai-reading.down .koudai-title strong,.koudai-reading.down .koudai-title span,.koudai-reading.down .koudai-title em{color:#20d27c}
      .koudai-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 18px;color:var(--muted);font-size:15px}
      .koudai-metrics div{display:flex;gap:7px;align-items:center;min-width:0}.koudai-metrics b{color:var(--ink);font-size:16px;white-space:nowrap}.koudai-metrics span{white-space:nowrap}
      .metals-mini-list{display:grid;gap:0;min-height:0;overflow:hidden}
      .metal-mini{display:grid;grid-template-columns:minmax(86px,1fr) 92px 74px 68px;align-items:center;gap:10px;height:32px;border:0;border-bottom:1px solid rgba(255,255,255,.08);background:transparent;color:var(--muted);cursor:pointer;padding:0;text-align:left}
      .metal-mini b{color:var(--ink);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.metal-mini strong,.metal-mini span,.metal-mini em{font-style:normal;text-align:right;color:#22d28a;font-weight:850;white-space:nowrap}.metal-mini.up strong,.metal-mini.up span,.metal-mini.up em{color:#ff6b7d}.metal-mini.down strong,.metal-mini.down span,.metal-mini.down em{color:#20d27c}
      .metals-foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--muted);font-size:12px;min-height:24px}.metals-foot button{border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.10);color:var(--ink);padding:4px 10px;cursor:pointer}
      @media(max-width:640px){.koudai-title{grid-template-columns:1fr;gap:4px}.koudai-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.metal-mini{grid-template-columns:minmax(70px,1fr) 78px 60px 54px;gap:6px}}
    `;
    document.head.appendChild(css);
  }

  function trendClass(pct,change){const v=Number.isFinite(pct)?pct:change;return v>0?"up":v<0?"down":"flat"}
  function num(v){if(v===null||v===undefined)return null;const x=parseFloat(String(v).replace(/[,%+\s]/g,""));return Number.isFinite(x)?x:null}
  function fmt(v,d=2){return Number.isFinite(v)?v.toFixed(d):"--"}
  function fmtSigned(v,d=2,suffix=""){if(!Number.isFinite(v))return "--";return (v>0?"+":"")+v.toFixed(d)+suffix}
  function timeText(){return new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date())}
  function esc(s){return String(s??"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}

  boot();
})();
