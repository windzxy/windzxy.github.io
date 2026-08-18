(function(){
  if(window.__windzxyMetalsWidgetLoaded)return;
  window.__windzxyMetalsWidgetLoaded=true;

  const APP_ID="metals";
  const VERSION="20260818-gold-widget10-koudai-readings";
  const REFRESH_MS=5000;
  const DEFAULT_W=438;
  const DEFAULT_H=286;
  const PRODUCTS=[
    {id:"xau",name:"現貨黃金",url:"https://www.gkoudai.com/quotesTrend/12.html",unit:"USD/oz",aliases:["現貨黃金","现货黄金","倫敦金","伦敦金","XAU","GOLD"]},
    {id:"xag",name:"現貨白銀",url:"https://www.gkoudai.com/quotesTrend/13.html",unit:"USD/oz",aliases:["現貨白銀","现货白银","倫敦銀","伦敦银","XAG","SILVER"]},
    {id:"xpt",name:"現貨鉑金",url:"https://www.gkoudai.com/quotesTrend/74.html",unit:"USD/oz",aliases:["現貨鉑金","现货铂金","鉑金","铂金","XPT","PLATINUM"]},
    {id:"xpd",name:"現貨鈀金",url:"https://www.gkoudai.com/quotesTrend/75.html",unit:"USD/oz",aliases:["現貨鈀金","现货钯金","鈀金","钯金","XPD","PALLADIUM"]}
  ];
  let activeProductId="xau";
  let quotes=Object.fromEntries(PRODUCTS.map(p=>[p.id,emptyQuote(p)]));
  let loading=false;
  let pendingRefresh=false;
  let refreshTimer=null;

  function boot(){
    if(typeof apps==="undefined"||typeof renderAll==="undefined"||typeof bodyHtml==="undefined"||typeof save==="undefined"){
      setTimeout(boot,80);
      return;
    }
    activeProductId=localStorage.getItem("windzxy-metals-active")||"xau";
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
    const info={id:APP_ID,kind:"widget",title:"金價",desc:"只讀取口袋貴金屬頁面的行情數字。",icon:"Au",tone:"t-metals"};
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

  function metalsHtml(card){
    const product=PRODUCTS.find(p=>p.id===activeProductId)||PRODUCTS[0];
    const q=quotes[product.id]||emptyQuote(product);
    const trend=trendClass(q.pct,q.change);
    const otherRows=PRODUCTS.filter(p=>p.id!==product.id).map(p=>miniRow(quotes[p.id]||emptyQuote(p),p));
    return '<div class="metals-widget metals-readings" data-metals-version="'+esc(VERSION)+'">'
      +'<div class="metals-status"><span class="metals-dot '+(q.ok?'ok':'')+'"></span><span>'+esc(q.status||"等待口袋行情")+'</span><button type="button" title="刷新" data-metals-refresh>↻</button></div>'
      +'<div class="metals-tabs">'+PRODUCTS.map(tabHtml).join("")+'</div>'
      +'<section class="koudai-reading '+trend+'">'
        +'<div class="koudai-title"><h4>'+esc(q.name)+'的行情走勢</h4><strong>'+fmt(q.price,2)+'</strong><span>'+fmtSigned(q.change,2)+'</span><em>'+fmtSigned(q.pct,2,"%")+'</em></div>'
        +'<div class="koudai-metrics">'
          +metric("買入",q.buy)+metric("最高",q.high)+metric("昨收",q.prevClose)
          +metric("賣出",q.sell)+metric("最低",q.low)+metric("今開",q.open)
        +'</div>'
      +'</section>'
      +'<section class="metals-mini-list">'+otherRows.join("")+'</section>'
      +'<div class="metals-foot"><span>更新 '+esc(q.time||"--")+'</span><span><button type="button" data-metals-open="'+esc(q.url)+'">源頁</button></span></div>'
      +'</div>';
  }

  function tabHtml(product){
    return '<button type="button" class="'+(product.id===activeProductId?'is-active':'')+'" data-metals-tab="'+esc(product.id)+'">'+esc(product.name.replace("現貨", ""))+'</button>';
  }
  function metric(label,value){return '<div><span>'+label+'：</span><b>'+fmt(value,2)+'</b></div>'}
  function miniRow(q,product){
    const trend=trendClass(q.pct,q.change);
    return '<button type="button" class="metal-mini '+trend+'" data-metals-tab="'+esc(product.id)+'">'
      +'<b>'+esc(product.name)+'</b><strong>'+fmt(q.price,2)+'</strong><span>'+fmtSigned(q.change,2)+'</span><em>'+fmtSigned(q.pct,2,"%")+'</em>'
      +'</button>';
  }

  async function refreshQuotes(options={}){
    if(loading){pendingRefresh=!!options.force;return;}
    loading=true;
    pendingRefresh=false;
    if(!options.silent){setAllStatus("刷新中…");rerenderMetalsOnly();}
    try{
      const settled=await Promise.allSettled(PRODUCTS.map(fetchProduct));
      settled.forEach((result,index)=>{
        const p=PRODUCTS[index];
        if(result.status==="fulfilled"&&result.value){
          quotes[p.id]=result.value;
        }else{
          quotes[p.id]=Object.assign({},quotes[p.id]||emptyQuote(p),{ok:false,status:"口袋頁未返回可讀數字",time:timeText()});
        }
      });
    }finally{
      loading=false;
      rerenderMetalsOnly();
      if(pendingRefresh)refreshQuotes({force:true});
    }
  }

  function setAllStatus(status){Object.keys(quotes).forEach(id=>{quotes[id].status=status})}

  async function fetchProduct(product){
    const html=await fetchText(product.url+(product.url.includes("?")?"&":"?")+"t="+Date.now());
    const parsed=parseQuote(html,product);
    const base=emptyQuote(product);
    if(!parsed)return Object.assign(base,{status:"口袋頁未返回可讀數字",time:timeText()});
    return Object.assign(base,parsed,{ok:true,status:"跟隨口袋讀數",time:timeText()});
  }

  async function fetchText(url){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),5500);
    try{
      const res=await fetch(url,{cache:"no-store",credentials:"omit",signal:controller.signal});
      if(!res.ok)throw new Error("HTTP "+res.status);
      return await res.text();
    }finally{clearTimeout(timer)}
  }

  function parseQuote(html,product){
    const raw=String(html||"");
    const text=cleanText(raw);
    const haystack=raw+" "+text;
    const alias=product.aliases.map(escapeReg).join("|");
    const n="([+\\-]?\\d{1,5}(?:\\.\\d{1,4})?)";
    const p="([+\\-]?\\d{1,5}(?:\\.\\d{1,4})?%?)";
    let price=null,change=null,pct=null;
    const head=[
      new RegExp("(?:"+alias+")(?:的行情走勢|的行情走势)?[^0-9+\\-]{0,80}"+n+"[^0-9+\\-]{1,30}"+n+"[^0-9+\\-]{1,30}"+p,"i"),
      new RegExp("(?:last|price|close|最新|現價|现价)[\\\"'\\s:=：,]{0,18}"+n,"i")
    ];
    for(const re of head){
      const m=haystack.match(re);
      if(m){
        price=num(m[1]);change=num(m[2]);pct=num(String(m[3]||"").replace("%",""));
        if(validPrice(price,product))break;
      }
    }
    const buy=fieldValue(text,["買入","买入"]);
    const sell=fieldValue(text,["賣出","卖出"]);
    const high=fieldValue(text,["最高"]);
    const low=fieldValue(text,["最低"]);
    const prevClose=fieldValue(text,["昨收","昨結","昨结"]);
    const open=fieldValue(text,["今開","今开"]);
    if(!validPrice(price,product)&&validPrice(buy,product))price=buy;
    if(!validPrice(price,product)){
      const all=[...haystack.matchAll(/\d{1,5}\.\d{1,4}/g)].map(m=>num(m[0])).filter(v=>validPrice(v,product));
      price=all[0]||null;
    }
    if(!validPrice(price,product))return null;
    if(!Number.isFinite(change)&&Number.isFinite(prevClose))change=price-prevClose;
    if(!Number.isFinite(pct)&&Number.isFinite(change)&&Number.isFinite(prevClose)&&prevClose)pct=change/prevClose*100;
    return {name:product.name,url:product.url,unit:product.unit,price,change,pct,buy,sell,high,low,prevClose,open,source:product.url};
  }

  function fieldValue(text,labels){
    for(const label of labels){
      const m=String(text||"").match(new RegExp(escapeReg(label)+"\\s*[:：]?\\s*(\\d{1,5}(?:\\.\\d{1,4})?)","i"));
      const value=m?num(m[1]):null;
      if(Number.isFinite(value))return value;
    }
    return null;
  }

  function emptyQuote(product){
    return {id:product.id,name:product.name,url:product.url,unit:product.unit,ok:false,status:"等待口袋行情",price:null,change:null,pct:null,buy:null,sell:null,high:null,low:null,prevClose:null,open:null,time:"--",source:product.url};
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
      .t-metals{--icon:linear-gradient(145deg,#f7c96b,#21d4fd);--glow:linear-gradient(135deg,#f7c96b,#21d4fd)}
      .metals-widget{height:100%;display:flex;flex-direction:column;gap:8px;min-height:0;font-variant-numeric:tabular-nums;color:var(--ink)}
      .metals-status{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;color:var(--muted);font-size:13px;min-height:26px}
      .metals-dot{width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.20);box-shadow:0 0 0 7px rgba(255,255,255,.06)}
      .metals-dot.ok{background:#21d47b;box-shadow:0 0 0 7px rgba(33,212,123,.14)}
      .metals-status button{width:34px;height:28px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:var(--ink);cursor:pointer;font-weight:800}
      .metals-tabs{display:flex;gap:6px;overflow:auto;min-height:26px}
      .metals-tabs button{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.08);color:var(--muted);border-radius:999px;padding:3px 9px;white-space:nowrap;cursor:pointer}
      .metals-tabs button.is-active{background:rgba(33,212,123,.18);color:var(--ink);border-color:rgba(33,212,123,.32)}
      .koudai-reading{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.10);border-radius:16px;padding:12px;display:grid;gap:12px}
      .koudai-title{display:grid;grid-template-columns:1fr auto auto auto;align-items:baseline;gap:16px}
      .koudai-title h4{margin:0;font-size:18px;color:var(--ink);white-space:nowrap}
      .koudai-title strong{font-size:24px;color:#22c96e;font-weight:850;white-space:nowrap}
      .koudai-title span,.koudai-title em{font-size:18px;color:#22c96e;font-style:normal;white-space:nowrap}
      .koudai-reading.up .koudai-title strong,.koudai-reading.up .koudai-title span,.koudai-reading.up .koudai-title em{color:#ff697f}
      .koudai-reading.down .koudai-title strong,.koudai-reading.down .koudai-title span,.koudai-reading.down .koudai-title em{color:#22c96e}
      .koudai-metrics{display:grid;grid-template-columns:repeat(3,1fr);row-gap:10px;column-gap:14px;color:var(--muted);font-size:14px}
      .koudai-metrics div{display:flex;align-items:center;gap:6px;min-width:0}
      .koudai-metrics span{white-space:nowrap}
      .koudai-metrics b{color:var(--ink);font-weight:700;white-space:nowrap}
      .metals-mini-list{display:grid;gap:5px;min-height:0;overflow:hidden}
      .metal-mini{display:grid;grid-template-columns:minmax(84px,1fr) 88px 70px 62px;gap:8px;align-items:center;border:0;border-bottom:1px solid rgba(255,255,255,.07);background:transparent;color:var(--muted);height:26px;cursor:pointer;text-align:left;padding:0}
      .metal-mini b{color:var(--ink);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .metal-mini strong,.metal-mini span,.metal-mini em{text-align:right;font-style:normal;font-weight:800;color:#22c96e;white-space:nowrap}
      .metal-mini.up strong,.metal-mini.up span,.metal-mini.up em{color:#ff697f}
      .metal-mini.down strong,.metal-mini.down span,.metal-mini.down em{color:#22c96e}
      .metals-foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--muted);font-size:12px;min-height:22px}
      .metals-foot button{border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.10);color:var(--ink);padding:3px 9px;cursor:pointer}
      @media(max-width:640px){.koudai-title{grid-template-columns:1fr;gap:4px}.koudai-metrics{grid-template-columns:repeat(2,1fr)}.metal-mini{grid-template-columns:minmax(70px,1fr) 72px 58px 54px}.koudai-title h4{font-size:16px}.koudai-title strong{font-size:22px}}
    `;
    document.head.appendChild(css);
  }

  function cleanText(html){return String(html||"").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ")}
  function num(v){if(v===null||v===undefined)return null;const x=parseFloat(String(v).replace(/[,%+\s]/g,""));return Number.isFinite(x)?x:null}
  function validPrice(v,product){if(!Number.isFinite(v))return false;return product.id==="xag"?v>1&&v<1000:v>100&&v<10000}
  function trendClass(pct,change){return pct>0||(!Number.isFinite(pct)&&change>0)?"up":pct<0||(!Number.isFinite(pct)&&change<0)?"down":"flat"}
  function fmt(v,d=2){return Number.isFinite(v)?v.toFixed(d):"--"}
  function fmtSigned(v,d=2,suffix=""){if(!Number.isFinite(v))return "--";return (v>0?"+":"")+v.toFixed(d)+suffix}
  function timeText(){return new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date())}
  function escapeReg(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}
  function esc(s){return String(s??"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
  boot();
})();
