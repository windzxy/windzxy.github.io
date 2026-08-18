(function(){
  if(window.__windzxyMetalsWidgetLoaded)return;
  window.__windzxyMetalsWidgetLoaded=true;

  const APP_ID="metals";
  const VERSION="20260818-gold-widget9-koudai-panel";
  const REFRESH_MS=10000;
  const DEFAULT_W=470;
  const DEFAULT_H=420;
  const PRODUCTS=[
    {id:"xau",name:"現貨黃金",unit:"USD/oz",url:"https://www.gkoudai.com/quotesTrend/12.html",aliases:["現貨黃金","现货黄金","倫敦金","伦敦金","XAU","GOLD"]},
    {id:"xag",name:"現貨白銀",unit:"USD/oz",url:"https://www.gkoudai.com/quotesTrend/13.html",aliases:["現貨白銀","现货白银","倫敦銀","伦敦银","XAG","SILVER"]},
    {id:"xpt",name:"現貨鉑金",unit:"USD/oz",url:"https://www.gkoudai.com/quotesTrend/74.html",aliases:["現貨鉑金","现货铂金","鉑金","铂金","XPT","PLATINUM"]},
    {id:"xpd",name:"現貨鈀金",unit:"USD/oz",url:"https://www.gkoudai.com/quotesTrend/75.html",aliases:["現貨鈀金","现货钯金","鈀金","钯金","XPD","PALLADIUM"]}
  ];

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
    const existed=apps.find(app=>app.id===APP_ID);
    const info={id:APP_ID,kind:"widget",title:"金價",desc:"按口袋貴金屬行情頁格式顯示現貨黃金與其他貴金屬。",icon:"Au",tone:"t-metals"};
    if(existed)Object.assign(existed,info);else apps.push(info);
    if(typeof defaults!=="undefined"){
      defaults.forEach(ws=>{
        if(ws.id==="daily"&&!ws.cards.some(card=>card.appId===APP_ID)){
          ws.cards.push({id:"daily-metals-0",appId:APP_ID,x:340,y:520,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        }
      });
    }
  }

  function ensureDefaultCard(){
    try{
      const ws=activeWorkspace();
      if(ws&&!ws.cards.some(card=>card.appId===APP_ID)){
        ws.cards.push({id:"card-metals-"+Date.now(),appId:APP_ID,x:340,y:520,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
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
    const main=quotes.xau||emptyQuote(PRODUCTS[0]);
    const trend=trendClass(main.pct,main.change);
    const updated=main.time||"--";
    const others=PRODUCTS.filter(p=>p.id!=="xau").map(p=>quotes[p.id]||emptyQuote(p));
    return '<div class="metals-widget metals-panel" data-metals-version="'+esc(VERSION)+'">'
      +'<div class="metals-status"><span class="metals-dot '+(main.ok?'ok':'')+'"></span><span>'+esc(main.status||"跟隨口袋頁更新")+'</span><button type="button" title="立即刷新" data-metals-refresh>↻</button></div>'
      +'<section class="koudai-panel '+trend+'">'
        +'<div class="koudai-head"><h4>'+esc(main.name)+'的行情走勢</h4><strong>'+fmt(main.price,2)+'</strong><span>'+fmtSigned(main.change,2)+'</span><em>'+fmtSigned(main.pct,2,"%")+'</em></div>'
        +'<div class="koudai-grid">'
          +metricHtml("買入",main.buy)+metricHtml("最高",main.high)+metricHtml("昨收",main.prevClose)
          +metricHtml("賣出",main.sell)+metricHtml("最低",main.low)+metricHtml("今開",main.open)
        +'</div>'
      +'</section>'
      +'<section class="metals-more"><div class="metals-more-title"><b>其他貴金屬</b><span>口袋行情頁</span></div>'+others.map(otherRowHtml).join("")+'</section>'
      +'<div class="metals-foot"><span>刷新 '+esc(updated)+' · 源頁更新未必是 3 秒</span><span><button type="button" data-metals-open="'+esc(PRODUCTS[0].url)+'">打開口袋</button></span></div>'
      +'</div>';
  }

  function metricHtml(label,value){return '<div><span>'+label+'：</span><b>'+fmt(value,2)+'</b></div>'}

  function otherRowHtml(q){
    const trend=trendClass(q.pct,q.change);
    return '<button type="button" class="metal-mini '+trend+'" data-metals-open="'+esc(q.url)+'" title="打開 '+esc(q.name)+'">'
      +'<b>'+esc(q.name)+'</b><strong>'+fmt(q.price,2)+'</strong><span>'+fmtSigned(q.change,2)+'</span><em>'+fmtSigned(q.pct,2,"%")+'</em>'
      +'</button>';
  }

  async function refreshQuotes(options={}){
    if(loading){pendingRefresh=!!options.force;return;}
    loading=true;
    pendingRefresh=false;
    if(!options.silent){
      Object.values(quotes).forEach(q=>q.status="刷新中…");
      rerenderMetalsOnly();
    }
    try{
      const settled=await Promise.allSettled(PRODUCTS.map(fetchProduct));
      settled.forEach((result,index)=>{
        const product=PRODUCTS[index];
        if(result.status==="fulfilled"&&result.value){
          quotes[product.id]=result.value;
        }else{
          quotes[product.id]=Object.assign({},quotes[product.id]||emptyQuote(product),{
            ok:false,
            status:"口袋頁可打開，跨域讀數受限",
            time:timeText()
          });
        }
      });
    }finally{
      loading=false;
      rerenderMetalsOnly();
      if(pendingRefresh)refreshQuotes({force:true});
    }
  }

  async function fetchProduct(product){
    const html=await fetchText(product.url+(product.url.includes("?")?"&":"?")+"t="+Date.now());
    const parsed=parseQuote(html,product);
    if(!parsed)return Object.assign(emptyQuote(product),{status:"已打開口袋頁，未解析到數字",time:timeText()});
    return Object.assign(emptyQuote(product),parsed,{ok:true,status:"跟隨口袋頁更新",time:timeText()});
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
    const aliases=product.aliases.map(escapeReg).join("|");
    const num="([+\\-]?\\d{1,5}(?:\\.\\d{1,4})?)";
    const pct="([+\\-]?\\d{1,5}(?:\\.\\d{1,4})?%?)";
    const headPatterns=[
      new RegExp("(?:"+aliases+")(?:的行情走勢|的行情走势)?[^0-9+\\-]{0,80}"+num+"[^0-9+\\-]{1,30}"+num+"[^0-9+\\-]{1,30}"+pct,"i"),
      new RegExp("(?:last|price|close|最新|現價|现价)[\\\"'\\s:=：,]{0,18}"+num,"i")
    ];
    let price=null,change=null,pctValue=null;
    for(const pattern of headPatterns){
      const m=haystack.match(pattern);
      if(m){
        price=numValue(m[1]);
        change=numValue(m[2]);
        pctValue=numValue(String(m[3]||"").replace("%", ""));
        if(validPrice(price,product))break;
      }
    }
    const buy=fieldValue(text,["買入","买入"]);
    const sell=fieldValue(text,["賣出","卖出"]);
    const high=fieldValue(text,["最高"]);
    const low=fieldValue(text,["最低"]);
    const prevClose=fieldValue(text,["昨收","昨結","昨结"]);
    const open=fieldValue(text,["今開","今开"]);
    if(!validPrice(price,product))price=validPrice(buy,product)?buy:null;
    if(!validPrice(price,product)){
      const all=[...haystack.matchAll(/\d{1,5}\.\d{1,4}/g)].map(m=>numValue(m[0])).filter(v=>validPrice(v,product));
      price=all[0]||null;
    }
    if(!validPrice(price,product))return null;
    if(!Number.isFinite(change)&&Number.isFinite(price)&&Number.isFinite(prevClose))change=price-prevClose;
    if(!Number.isFinite(pctValue)&&Number.isFinite(change)&&Number.isFinite(prevClose)&&prevClose)pctValue=change/prevClose*100;
    return {name:product.name,url:product.url,unit:product.unit,price,change,pct:pctValue,buy,sell,high,low,prevClose,open,source:product.url};
  }

  function fieldValue(text,labels){
    for(const label of labels){
      const re=new RegExp(escapeReg(label)+"\\s*[:：]?\\s*(\\d{1,5}(?:\\.\\d{1,4})?)","i");
      const m=String(text||"").match(re);
      const v=m?numValue(m[1]):null;
      if(Number.isFinite(v))return v;
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
    const style=document.createElement("style");
    style.id="metalsWidgetStyle";
    style.textContent=`
      .t-metals{--icon:linear-gradient(145deg,#f7c96b,#21d4fd);--glow:linear-gradient(135deg,#f7c96b,#21d4fd)}
      .metals-widget{height:100%;display:flex;flex-direction:column;gap:10px;min-height:0;font-variant-numeric:tabular-nums;color:var(--ink)}
      .metals-status{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;color:var(--muted);font-size:13px;min-height:28px}
      .metals-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.20);box-shadow:0 0 0 7px rgba(255,255,255,.06)}
      .metals-dot.ok{background:#21d47b;box-shadow:0 0 0 7px rgba(33,212,123,.14)}
      .metals-status button{width:36px;height:30px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:var(--ink);cursor:pointer;font-weight:900}
      .koudai-panel{border-radius:18px;background:rgba(255,255,255,.96);color:#344055;padding:16px 18px 14px;box-shadow:inset 0 0 0 1px rgba(15,23,42,.06)}
      .koudai-head{display:grid;grid-template-columns:minmax(150px,1fr) auto auto auto;gap:24px;align-items:baseline;margin-bottom:15px}
      .koudai-head h4{margin:0;color:#020817;font-size:24px;line-height:1.15;font-weight:950;letter-spacing:-.04em;white-space:nowrap}
      .koudai-head strong,.koudai-head span,.koudai-head em{font-size:25px;font-style:normal;font-weight:700;color:#25b85b;white-space:nowrap}
      .koudai-head em{font-size:24px}
      .koudai-panel.up .koudai-head strong,.koudai-panel.up .koudai-head span,.koudai-panel.up .koudai-head em{color:#e84d61}
      .koudai-panel.down .koudai-head strong,.koudai-panel.down .koudai-head span,.koudai-panel.down .koudai-head em{color:#25b85b}
      .koudai-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 26px;font-size:19px}
      .koudai-grid div{display:flex;align-items:center;gap:10px;min-width:0}
      .koudai-grid span{color:#9aa2ae;white-space:nowrap}
      .koudai-grid b{color:#4b5563;font-weight:650;white-space:nowrap}
      .metals-more{border-radius:16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);overflow:hidden;min-height:0}
      .metals-more-title{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;color:var(--muted);font-size:12px;border-bottom:1px solid rgba(255,255,255,.08)}
      .metals-more-title b{color:var(--ink);font-size:14px}
      .metal-mini{width:100%;height:38px;display:grid;grid-template-columns:minmax(86px,1fr) 84px 70px 68px;gap:8px;align-items:center;border:0;border-bottom:1px solid rgba(255,255,255,.07);background:transparent;color:var(--muted);font-size:13px;text-align:right;padding:0 12px;cursor:pointer}
      .metal-mini:last-child{border-bottom:0}
      .metal-mini b{text-align:left;color:var(--ink);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .metal-mini strong,.metal-mini span,.metal-mini em{font-style:normal;font-weight:850;color:#20ce7a;white-space:nowrap}
      .metal-mini.up strong,.metal-mini.up span,.metal-mini.up em{color:#ff697f}
      .metal-mini.down strong,.metal-mini.down span,.metal-mini.down em{color:#20ce7a}
      .metals-foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--muted);font-size:12px;min-height:24px}
      .metals-foot button{border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.10);color:var(--ink);padding:4px 10px;cursor:pointer}
      @media(max-width:640px){.koudai-head{grid-template-columns:1fr;gap:4px}.koudai-head h4{font-size:20px}.koudai-head strong,.koudai-head span,.koudai-head em{font-size:22px}.koudai-grid{grid-template-columns:1fr 1fr;font-size:15px}.metal-mini{grid-template-columns:minmax(72px,1fr) 72px 58px 54px;gap:5px;padding:0 8px}}
    `;
    document.head.appendChild(style);
  }

  function trendClass(pct,change){return pct>0||(!Number.isFinite(pct)&&change>0)?"up":pct<0||(!Number.isFinite(pct)&&change<0)?"down":"flat"}
  function validPrice(v,product){
    if(!Number.isFinite(v))return false;
    if(product.id==="xag")return v>1&&v<300;
    return v>100&&v<10000;
  }
  function cleanText(html){return String(html||"").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ")}
  function numValue(v){if(v===null||v===undefined||v==="")return null;const x=parseFloat(String(v).replace(/[,%+\s]/g,""));return Number.isFinite(x)?x:null}
  function fmt(v,d=2){return Number.isFinite(v)?v.toFixed(d):"--"}
  function fmtSigned(v,d=2,suffix=""){if(!Number.isFinite(v))return "--";return (v>0?"+":"")+v.toFixed(d)+suffix}
  function timeText(){return new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date())}
  function escapeReg(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}
  function esc(s){return String(s??"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));}
  boot();
})();
