(function(){
  if(window.__windzxyMetalsWidgetLoaded)return;
  window.__windzxyMetalsWidgetLoaded=true;

  const APP_ID="metals";
  const VERSION="20260818-gold-widget8-koudai-live";
  const REFRESH_MS=3000;
  const IFRAME_RELOAD_MS=60000;
  const KOUDAI_SPOT_PAGE="https://www.gkoudai.com/quotesTrend/12.html";
  const DEFAULT_W=390;
  const DEFAULT_H=330;

  let lastQuote={
    ok:false,
    status:"等待口袋行情",
    price:null,
    change:null,
    pct:null,
    time:"--",
    source:"口袋貴金屬 12.html"
  };
  let loading=false;
  let pendingRefresh=false;
  let refreshTimer=null;
  let iframeReloadTimer=null;

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
    loadKoudaiQuote({force:true});
    startRealtimeRefresh();
    window.windzxyRefreshMetals=()=>loadKoudaiQuote({force:true});
  }

  function installApp(){
    const existed=apps.find(app=>app.id===APP_ID);
    if(existed){
      existed.title="金價";
      existed.desc="跟隨口袋貴金屬現貨黃金頁實時更新。";
      existed.icon="Au";
      existed.tone="t-metals";
    }else{
      apps.push({id:APP_ID,kind:"widget",title:"金價",desc:"跟隨口袋貴金屬現貨黃金頁實時更新。",icon:"Au",tone:"t-metals"});
    }
    if(typeof defaults!=="undefined"){
      defaults.forEach(ws=>{
        if(ws.id==="daily"&&!ws.cards.some(card=>card.appId===APP_ID)){
          ws.cards.push({id:"daily-metals-0",appId:APP_ID,x:360,y:536,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        }
      });
    }
  }

  function ensureDefaultCard(){
    try{
      const ws=activeWorkspace();
      if(ws&&!ws.cards.some(card=>card.appId===APP_ID)){
        ws.cards.push({id:"card-metals-"+Date.now(),appId:APP_ID,x:360,y:536,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();
      }
    }catch(error){
      console.warn("metals default card skipped",error);
    }
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
    }catch(error){
      console.warn("metals card normalize skipped",error);
    }
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
        activeWorkspace().cards.push({
          id:"card-"+Date.now()+"-"+Math.random().toString(16).slice(2),
          appId:APP_ID,
          x:72+(i%5)*38,
          y:78+(i%7)*32,
          w:DEFAULT_W,
          h:DEFAULT_H,
          collapsed:false,
          data:{}
        });
        save();
        renderAll();
        loadKoudaiQuote({force:true});
      };
    }
  }

  function metalsHtml(card){
    const h=Number(card?.h)||DEFAULT_H;
    const showFrame=h>=260;
    const frameSrc=KOUDAI_SPOT_PAGE+(KOUDAI_SPOT_PAGE.includes("?")?"&":"?")+"embed="+VERSION;
    const trend=lastQuote.pct>0?"up":lastQuote.pct<0?"down":"flat";
    return '<div class="metals-widget metals-koudai-live" data-metals-version="'+esc(VERSION)+'">'
      +'<div class="metals-status"><span class="metals-dot '+(lastQuote.ok?'ok':'')+'"></span><span>'+esc(lastQuote.status)+'</span><button type="button" title="立即刷新" data-metals-refresh>↻</button></div>'
      +'<section class="metals-hero '+trend+'">'
        +'<div><small>口袋貴金屬</small><b>現貨黃金</b></div>'
        +'<strong>'+fmt(lastQuote.price,2)+'</strong>'
        +'<em>USD/oz</em>'
      +'</section>'
      +'<div class="metals-metrics">'
        +'<div><span>漲跌</span><b class="'+trend+'">'+fmtSigned(lastQuote.change,2)+'</b></div>'
        +'<div><span>漲幅</span><b class="'+trend+'">'+fmtSigned(lastQuote.pct,2,"%")+'</b></div>'
        +'<div><span>刷新</span><b>'+esc(lastQuote.time||"--")+'</b></div>'
      +'</div>'
      +(showFrame?'<div class="metals-live-frame"><iframe title="口袋貴金屬現貨黃金" src="'+esc(frameSrc)+'" loading="lazy" referrerpolicy="no-referrer"></iframe></div>':'')
      +'<div class="metals-foot"><span>'+esc(lastQuote.source||"口袋貴金屬 12.html")+'</span><span><button type="button" data-metals-open="'+esc(KOUDAI_SPOT_PAGE)+'">打開口袋</button></span></div>'
      +'</div>';
  }

  async function loadKoudaiQuote(options={}){
    if(loading){
      pendingRefresh=!!options.force;
      return;
    }
    loading=true;
    pendingRefresh=false;
    if(!options.silent){
      lastQuote.status="刷新中…";
      rerenderMetalsOnly();
    }
    try{
      const html=await fetchText(KOUDAI_SPOT_PAGE+"?t="+Date.now());
      const parsed=parseKoudaiSpotText(html);
      if(parsed){
        lastQuote=Object.assign(lastQuote,parsed,{ok:true,status:"口袋實時 · "+REFRESH_MS/1000+"秒"});
      }else{
        lastQuote.ok=false;
        lastQuote.status="口袋頁已嵌入，數字未能跨域讀取";
      }
      lastQuote.time=new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date());
    }catch(error){
      console.warn("koudai quote load failed",error);
      lastQuote.ok=false;
      lastQuote.status="口袋頁已嵌入，跨域讀數受限";
      lastQuote.time=new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date());
    }finally{
      loading=false;
      rerenderMetalsOnly();
      if(pendingRefresh)loadKoudaiQuote({force:true});
    }
  }

  async function fetchText(url){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),2400);
    try{
      const res=await fetch(url,{cache:"no-store",credentials:"omit",signal:controller.signal});
      if(!res.ok)throw new Error("HTTP "+res.status);
      return await res.text();
    }finally{
      clearTimeout(timer);
    }
  }

  function parseKoudaiSpotText(html){
    const raw=String(html||"");
    const text=cleanText(raw);
    const candidates=[];
    const keyPatterns=[
      /(?:現貨黃金|现货黄金|倫敦金|伦敦金|XAU|GOLD)[^0-9+\-]{0,80}(\d{3,5}(?:\.\d{1,4})?)(?:[^+\-0-9]{0,20}([+\-]?\d+(?:\.\d{1,4})?))?(?:[^+\-0-9]{0,20}([+\-]?\d+(?:\.\d{1,4})%))?/gi,
      /(?:last|price|close|最新|現價|现价)["'\s:=：,]{0,16}(\d{3,5}(?:\.\d{1,4})?)/gi
    ];
    keyPatterns.forEach(pattern=>{
      [...raw.matchAll(pattern),...text.matchAll(pattern)].forEach(m=>{
        const price=num(m[1]);
        if(Number.isFinite(price)&&price>1000&&price<10000){
          candidates.push({price,change:num(m[2]),pct:num(String(m[3]||"").replace("%",""))});
        }
      });
    });
    if(!candidates.length){
      const nums=[...raw.matchAll(/\d{3,5}\.\d{1,4}/g)].map(m=>num(m[0])).filter(v=>Number.isFinite(v)&&v>1000&&v<10000);
      if(nums.length)candidates.push({price:nums[0],change:null,pct:null});
    }
    const picked=candidates[0];
    if(!picked||!Number.isFinite(picked.price))return null;
    return {
      price:picked.price,
      change:Number.isFinite(picked.change)?picked.change:null,
      pct:Number.isFinite(picked.pct)?picked.pct:null,
      source:"口袋貴金屬 12.html"
    };
  }

  function startRealtimeRefresh(){
    clearInterval(refreshTimer);
    clearInterval(iframeReloadTimer);
    refreshTimer=setInterval(()=>{
      if(!document.hidden)loadKoudaiQuote({silent:true});
    },REFRESH_MS);
    iframeReloadTimer=setInterval(()=>{
      if(document.hidden)return;
      document.querySelectorAll('.metals-live-frame iframe').forEach(frame=>{
        try{
          const base=KOUDAI_SPOT_PAGE+(KOUDAI_SPOT_PAGE.includes('?')?'&':'?');
          frame.src=base+'embed='+VERSION+'&r='+Date.now();
        }catch(error){}
      });
    },IFRAME_RELOAD_MS);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)loadKoudaiQuote({force:true});});
    window.addEventListener("focus",()=>loadKoudaiQuote({force:true}));
    window.addEventListener("online",()=>loadKoudaiQuote({force:true}));
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
    bindMetalsButtons();
  }

  function bindMetalsButtons(){
    document.querySelectorAll("[data-metals-refresh]").forEach(btn=>{
      if(btn.dataset.ready)return;
      btn.dataset.ready="1";
      btn.addEventListener("click",event=>{
        event.preventDefault();
        event.stopPropagation();
        loadKoudaiQuote({force:true});
        document.querySelectorAll('.metals-live-frame iframe').forEach(frame=>{
          frame.src=KOUDAI_SPOT_PAGE+(KOUDAI_SPOT_PAGE.includes('?')?'&':'?')+'embed='+VERSION+'&r='+Date.now();
        });
      });
      btn.addEventListener("pointerdown",event=>event.stopPropagation());
    });
    document.querySelectorAll("[data-metals-open]").forEach(btn=>{
      if(btn.dataset.ready)return;
      btn.dataset.ready="1";
      btn.addEventListener("click",event=>{
        event.preventDefault();
        event.stopPropagation();
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
      .metals-status{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;color:var(--muted);font-size:13px;min-height:28px}
      .metals-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.20);box-shadow:0 0 0 7px rgba(255,255,255,.06)}
      .metals-dot.ok{background:#21d47b;box-shadow:0 0 0 7px rgba(33,212,123,.14)}
      .metals-status button{width:36px;height:30px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:var(--ink);cursor:pointer;font-weight:800}
      .metals-hero{display:grid;grid-template-columns:minmax(105px,1fr) auto auto;align-items:end;gap:10px;padding:10px 12px;border-radius:20px;background:linear-gradient(135deg,rgba(247,201,107,.18),rgba(33,212,253,.10));border:1px solid rgba(255,255,255,.10)}
      .metals-hero small{display:block;color:var(--muted);font-size:12px;margin-bottom:2px}
      .metals-hero b{display:block;font-size:16px;color:var(--ink)}
      .metals-hero strong{font-size:30px;line-height:1;color:#18c98b;font-weight:950;letter-spacing:-.03em}
      .metals-hero.up strong{color:#ff697f}.metals-hero.down strong{color:#20ce7a}
      .metals-hero em{font-style:normal;color:var(--muted);font-size:12px;padding-bottom:2px}
      .metals-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
      .metals-metrics div{border-radius:16px;background:rgba(255,255,255,.08);padding:8px 10px;min-width:0}
      .metals-metrics span{display:block;color:var(--muted);font-size:12px;margin-bottom:3px}
      .metals-metrics b{display:block;color:var(--ink);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .metals-metrics b.up{color:#ff697f}.metals-metrics b.down{color:#20ce7a}.metals-metrics b.flat{color:#18c98b}
      .metals-live-frame{flex:1;min-height:120px;overflow:hidden;border-radius:18px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.06)}
      .metals-live-frame iframe{width:100%;height:100%;border:0;background:#fff;display:block}
      .metals-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--muted);font-size:12px;min-height:24px}
      .metals-foot span:last-child{display:flex;gap:6px}
      .metals-foot button{border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.10);color:var(--ink);padding:4px 10px;cursor:pointer}
      .desktop-card[data-card-id] .card-body .metals-widget{padding-top:2px}
      @media(max-width:640px){.metals-hero{grid-template-columns:1fr auto}.metals-hero em{display:none}.metals-hero strong{font-size:24px}.metals-metrics{grid-template-columns:1fr 1fr}.metals-metrics div:last-child{grid-column:1/-1}}
    `;
    document.head.appendChild(css);
  }

  function cleanText(html){
    return String(html||"")
      .replace(/<script[\s\S]*?<\/script>/gi," ")
      .replace(/<style[\s\S]*?<\/style>/gi," ")
      .replace(/<[^>]+>/g," ")
      .replace(/&nbsp;/g," ")
      .replace(/\s+/g," ");
  }
  function num(v){
    if(v===null||v===undefined||v==="")return null;
    const x=parseFloat(String(v).replace(/[,%+\s]/g,""));
    return Number.isFinite(x)?x:null;
  }
  function fmt(v,d=2){return Number.isFinite(v)?v.toFixed(d):"--";}
  function fmtSigned(v,d=2,suffix=""){
    if(!Number.isFinite(v))return "--";
    const sign=v>0?"+":"";
    return sign+v.toFixed(d)+suffix;
  }
  function esc(s){
    return String(s??"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
  }

  boot();
})();
