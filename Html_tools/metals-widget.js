(function(){
  if(window.__windzxyMetalsWidgetLoaded)return;
  window.__windzxyMetalsWidgetLoaded=true;
  const APP_ID="metals";
  const VERSION="20260818-gold-widget7-koudai12";
  const REFRESH_MS=3000;
  const TENCENT_CODES=["hf_XAU","hf_XAG","hf_GC","hf_SI"];
  const KOUDAI_SPOT_PAGE="https://www.gkoudai.com/quotesTrend/12.html";
  const KOUDAI_PHYSICAL_PAGE="https://www.gkoudai.com/quotesTrend/gold.html";
  const JD_PRO_PAGE="https://gold-price-pro.pf.jd.com/";
  const JD_MINSHENG="https://api.jdjygold.com/gw/generic/hj/h5/m/latestPrice?reqData={}";
  const JD_ZHESHANG="https://api.jdjygold.com/gw2/generic/jrm/h5/m/stdLatestPrice?productSku=1961543816";
  const CMB_PAGES=["https://m.cmbchina.com/goldrate.html","https://gold.cmbchina.com/rate/"];
  const DEFAULT_W=378;
  const DEFAULT_H=312;
  let lastQuotes={};
  let loading=false;
  let refreshTimer=null;
  let pendingRefresh=false;

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
    loadMetals({force:true});
    startRealtimeRefresh();
    window.windzxyRefreshMetals=()=>loadMetals({force:true});
  }

  function installApp(){
    if(!apps.some(app=>app.id===APP_ID)){
      apps.push({id:APP_ID,kind:"widget",title:"金價",desc:"口袋現貨黃金、口袋招行金、平台金價、招行買賣、白銀與紐約金價。",icon:"Au",tone:"t-metals"});
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
    }catch(error){console.warn("metals card normalize skipped",error)}
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
        activeWorkspace().cards.push({id:"card-"+Date.now()+"-"+Math.random().toString(16).slice(2),appId:APP_ID,x:72+(i%5)*38,y:78+(i%7)*32,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();renderAll();loadMetals({force:true});
      };
    }
  }

  function metalsHtml(card){
    const status=lastQuotes.status||"等待行情";
    const time=lastQuotes.time||"--";
    const rows=visibleRows(card);
    const list=buildRows().slice(0,rows);
    return '<div class="metals-widget" data-metals-version="'+VERSION+'">'
      +'<div class="metals-status"><span class="metals-dot '+(lastQuotes.ok?'ok':'')+'"></span><span>'+esc(status)+'</span><button type="button" title="立即刷新" data-metals-refresh>↻</button></div>'
      +'<div class="metals-rows">'+list.map(rowHtml).join("")+'</div>'
      +'<div class="metals-foot"><span>'+esc(time)+'</span><span><button type="button" data-metals-open="'+esc(KOUDAI_SPOT_PAGE)+'">口袋現貨</button><button type="button" data-metals-open="'+esc(KOUDAI_PHYSICAL_PAGE)+'">口袋實物</button></span></div>'
      +'</div>';
  }

  function visibleRows(card){
    const h=Number(card?.h)||DEFAULT_H;
    const w=Number(card?.w)||DEFAULT_W;
    if(h<150||w<305)return 3;
    if(h<190)return 4;
    if(h<230)return 5;
    if(h<270)return 6;
    return 7;
  }

  function buildRows(){
    const cmb=lastQuotes.cmbGold;
    const spotGold=lastQuotes.koudaiSpot||lastQuotes.hf_XAU||emptyRow("現貨黃金","USD/oz","口袋 12.html / 騰訊行情未返回");
    const platformGold=lastQuotes.jdPro||lastQuotes.jdZheshang||lastQuotes.jdMinsheng||emptyRow("平台金價","元/克","京東金價頁/京東金岳公開行情未返回");
    return [
      spotGold,
      lastQuotes.koudaiCmb||emptyRow("口袋招行金","元/克","口袋實物黃金頁未返回可解析招商/招行條目，請點口袋實物核對"),
      platformGold,
      cmb?.buyRow||emptyRow("招行買入","元/克","招商銀行公開頁未返回可讀買入價"),
      cmb?.sellRow||emptyRow("招行賣出","元/克","招商銀行公開頁未返回可讀賣出價"),
      lastQuotes.hf_XAG||emptyRow("現貨白銀","USD/oz","騰訊行情未返回"),
      lastQuotes.hf_GC||emptyRow("紐約金價","USD/oz","騰訊行情未返回")
    ];
  }

  function emptyRow(label,unit,source){return {label,price:null,change:null,pct:null,unit,source:source||"--"}}

  function rowHtml(row){
    const trend=row.pct>0?"up":row.pct<0?"down":"flat";
    return '<div class="metal-row '+trend+'" title="'+esc((row.source||"")+" · "+(row.unit||""))+'">'
      +'<b>'+esc(row.label)+'</b>'
      +'<strong>'+fmt(row.price,2)+'</strong>'
      +'<span>'+fmtSigned(row.change,2)+'</span>'
      +'<em>'+fmtSigned(row.pct,2,"%")+'</em>'
      +'</div>';
  }

  async function loadMetals(options={}){
    if(loading){pendingRefresh=!!options.force;return;}
    loading=true;
    pendingRefresh=false;
    if(!options.silent){lastQuotes.status="刷新中…";rerenderMetalsOnly();}
    try{
      const results=await Promise.allSettled([loadKoudaiSpot(),loadKoudaiCmb(),loadTencent(),loadJdPro(),loadJdZheshang(),loadJdMinsheng(),loadCmbPublic()]);
      const koudaiSpot=okValue(results[0]);
      const koudaiCmb=okValue(results[1]);
      const tencent=okValue(results[2]);
      const jdPro=okValue(results[3]);
      const jdZ=okValue(results[4]);
      const jdM=okValue(results[5]);
      const cmb=okValue(results[6]);
      if(koudaiSpot)lastQuotes.koudaiSpot=koudaiSpot;
      if(koudaiCmb)lastQuotes.koudaiCmb=koudaiCmb;
      if(tencent)Object.assign(lastQuotes,tencent);
      if(jdPro)lastQuotes.jdPro=jdPro;
      if(jdZ)lastQuotes.jdZheshang=jdZ;
      if(jdM)lastQuotes.jdMinsheng=jdM;
      if(cmb)lastQuotes.cmbGold=cmb;
      const ok=!!(lastQuotes.koudaiSpot||lastQuotes.koudaiCmb||lastQuotes.cmbGold||lastQuotes.hf_XAU||lastQuotes.hf_XAG||lastQuotes.hf_GC||lastQuotes.jdPro||lastQuotes.jdZheshang||lastQuotes.jdMinsheng);
      lastQuotes.ok=ok;
      lastQuotes.status=ok?("實時刷新 · "+REFRESH_MS/1000+"秒"):("行情源暫不可用");
      lastQuotes.time=new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date());
    }catch(error){
      console.warn("metals load failed",error);
      lastQuotes.ok=false;
      lastQuotes.status="行情源暫不可用";
      lastQuotes.time=new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"}).format(new Date());
    }finally{
      loading=false;
      rerenderMetalsOnly();
      if(pendingRefresh)loadMetals({force:true});
    }
  }

  function okValue(result){return result&&result.status==="fulfilled"?result.value:null}

  function startRealtimeRefresh(){
    clearInterval(refreshTimer);
    refreshTimer=setInterval(()=>{if(!document.hidden)loadMetals({silent:true});},REFRESH_MS);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)loadMetals({force:true});});
    window.addEventListener("focus",()=>loadMetals({force:true}));
    window.addEventListener("online",()=>loadMetals({force:true}));
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
      btn.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();loadMetals({force:true});});
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

  function loadTencent(){
    return new Promise(resolve=>{
      const id="tencentMetalsQuoteScript";
      document.getElementById(id)?.remove();
      TENCENT_CODES.forEach(code=>{try{delete window["v_"+code]}catch(e){}});
      const script=document.createElement("script");
      script.id=id;
      script.charset="gbk";
      script.src="https://qt.gtimg.cn/q="+encodeURIComponent(TENCENT_CODES.join(","))+"&_="+Date.now();
      let done=false;
      const finish=()=>{if(done)return;done=true;setTimeout(()=>resolve(parseTencent()),40);};
      script.onload=finish;
      script.onerror=()=>resolve(null);
      setTimeout(()=>resolve(null),2300);
      document.head.appendChild(script);
    });
  }

  function parseTencent(){
    const out={};
    ["hf_XAU","hf_XAG","hf_GC","hf_SI"].forEach(code=>{
      const parsed=parseTencentMetal(code,window["v_"+code]);
      if(parsed)out[code]=parsed;
    });
    return Object.keys(out).length?out:null;
  }

  function parseTencentMetal(code,raw){
    if(!raw||String(raw).includes("none_match"))return null;
    const f=String(raw).replace(/^\"|\"$/g,"").split(",");
    const price=num(f[0]);
    const pct=num(f[1]);
    const prev=num(f[7]);
    if(!Number.isFinite(price))return null;
    const labels={hf_XAU:"現貨黃金",hf_XAG:"現貨白銀",hf_GC:"紐約金價",hf_SI:"紐約白銀"};
    return {label:labels[code]||code,price,change:Number.isFinite(prev)?price-prev:(Number.isFinite(pct)?price*pct/(100+pct):null),pct:Number.isFinite(pct)?pct:null,unit:"USD/oz",source:"Tencent qt.gtimg.cn "+code};
  }

  async function loadKoudaiSpot(){
    const html=await fetchText(KOUDAI_SPOT_PAGE+"?t="+Date.now());
    return parseKoudaiSpotText(html);
  }

  async function loadKoudaiCmb(){
    const html=await fetchText(KOUDAI_PHYSICAL_PAGE+"?t="+Date.now());
    return parseKoudaiPhysicalText(html);
  }

  async function loadJdPro(){
    const html=await fetchText(JD_PRO_PAGE+"?t="+Date.now());
    return parseJdText(html,"京東金價");
  }

  async function loadJdZheshang(){
    const json=await fetchJson(JD_ZHESHANG);
    return parseJd(json,"浙商金價");
  }

  async function loadJdMinsheng(){
    const json=await fetchJson(JD_MINSHENG);
    return parseJd(json,"民生金價");
  }

  async function fetchText(url){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),2400);
    try{
      const res=await fetch(url,{cache:"no-store",credentials:"omit",signal:controller.signal});
      if(!res.ok)throw new Error("HTTP "+res.status);
      return await res.text();
    }finally{clearTimeout(timer)}
  }

  async function fetchJson(url){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),2400);
    try{
      const res=await fetch(url,{cache:"no-store",credentials:"omit",headers:{Accept:"application/json"},signal:controller.signal});
      if(!res.ok)throw new Error("HTTP "+res.status);
      return await res.json();
    }finally{clearTimeout(timer)}
  }

  function parseKoudaiSpotText(html){
    const raw=String(html||"");
    const text=cleanText(raw);
    const direct=[...text.matchAll(/(?:現貨黃金|现货黄金|XAU|gold)[^0-9+\-]{0,50}(\d{3,5}(?:\.\d{1,4})?)(?:\s*([+\-]?\d+(?:\.\d{1,4})?))?(?:\s*([+\-]?\d+(?:\.\d{1,4})%))?/gi)];
    const nums=direct.map(m=>({price:num(m[1]),change:num(m[2]),pct:num(String(m[3]||"").replace("%",""))})).filter(x=>Number.isFinite(x.price)&&x.price>1000&&x.price<10000);
    const fallback=[...raw.matchAll(/\d{3,5}\.\d{1,4}/g)].map(m=>num(m[0])).filter(v=>Number.isFinite(v)&&v>1000&&v<10000);
    const picked=nums[0]||{price:fallback[0],change:null,pct:null};
    if(!Number.isFinite(picked.price))return null;
    return {label:"現貨黃金",price:picked.price,change:Number.isFinite(picked.change)?picked.change:null,pct:Number.isFinite(picked.pct)?picked.pct:null,unit:"USD/oz",source:"口袋貴金屬 12.html"};
  }

  function parseKoudaiPhysicalText(html){
    const raw=String(html||"");
    const text=cleanText(raw);
    const patterns=[
      /(?:招商銀行|招商银行|招商|招行)[^0-9]{0,90}(\d{2,5}(?:\.\d{1,4})?)/gi,
      /(?:barand|brand|品牌)[^\n]{0,160}(?:招商銀行|招商银行|招商|招行)[^0-9]{0,160}(?:price|價格|价格)[^0-9]{0,30}(\d{2,5}(?:\.\d{1,4})?)/gi,
      /(?:price|價格|价格)[^0-9]{0,30}(\d{2,5}(?:\.\d{1,4})?)[^\n]{0,160}(?:招商銀行|招商银行|招商|招行)/gi
    ];
    for(const pattern of patterns){
      const matches=[...raw.matchAll(pattern),...text.matchAll(pattern)];
      const price=matches.map(m=>num(m[1])).find(v=>Number.isFinite(v)&&v>100&&v<3000);
      if(Number.isFinite(price))return {label:"口袋招行金",price,change:null,pct:null,unit:"元/克",source:"口袋貴金屬實物黃金"};
    }
    return null;
  }

  function parseJd(json,label){
    const data=json?.resultData?.datas||json?.resultData?.data||json?.data||json?.datas||json||{};
    const price=num(data.price)||num(data.goldPrice)||num(data.latestPrice)||num(data.goldValue)||num(data.value)||num(data.buyPrice)||num(data.salePrice);
    if(!Number.isFinite(price))return null;
    const pct=num(String(data.rate||data.upDownRate||data.changeRate||data.priceChangeRate||"").replace("%",""));
    const change=num(data.diff)||num(data.change)||num(data.upDown)||null;
    return {label,price,change:Number.isFinite(change)?change:null,pct:Number.isFinite(pct)?pct:null,unit:"元/克",source:"JD Gold "+label};
  }

  function parseJdText(html,label){
    const text=cleanText(html);
    const byKey=[...text.matchAll(/(?:goldValue|金價|金价|最新价|最新價|浙商|民生)[^0-9]{0,28}(\d{2,5}(?:\.\d{1,4})?)/gi)].map(m=>num(m[1])).filter(v=>Number.isFinite(v)&&v>100&&v<3000);
    const all=[...String(html||"").matchAll(/\d{2,5}\.\d{1,4}/g)].map(m=>num(m[0])).filter(v=>Number.isFinite(v)&&v>100&&v<3000);
    const price=byKey[0]||all[0];
    if(!Number.isFinite(price))return null;
    return {label,price,change:null,pct:null,unit:"元/克",source:"JD gold-price-pro.pf.jd.com"};
  }

  async function loadCmbPublic(){
    for(const url of CMB_PAGES){
      try{
        const html=await fetchText(url);
        const parsed=parseCmbHtml(html,url);
        if(parsed)return parsed;
      }catch(error){console.warn("cmb public quote failed",url,error)}
    }
    return null;
  }

  function parseCmbHtml(html,url){
    const text=cleanText(html);
    if(!/黃金|黄金|gold/i.test(text))return null;
    const nums=[...text.matchAll(/(?:買入|买入|客戶買入|客户买入|賣出|卖出|客戶賣出|客户卖出|最新)[^0-9]{0,18}(\d{2,5}(?:\.\d{1,4})?)/gi)].map(m=>num(m[1])).filter(Number.isFinite);
    const all=[...text.matchAll(/\d{2,5}\.\d{1,4}/g)].map(m=>num(m[0])).filter(v=>Number.isFinite(v)&&v>100&&v<3000);
    const buy=nums[0]||all[0];
    const sell=nums[1]||all[1];
    if(!Number.isFinite(buy)&&!Number.isFinite(sell))return null;
    return {buyRow:{label:"招行買入",price:buy||null,change:null,pct:null,unit:"元/克",source:"招商銀行公開頁 "+url},sellRow:{label:"招行賣出",price:sell||null,change:null,pct:null,unit:"元/克",source:"招商銀行公開頁 "+url},source:url};
  }

  function installStyle(){
    if(document.getElementById("metalsWidgetStyle"))return;
    const css=document.createElement("style");
    css.id="metalsWidgetStyle";
    css.textContent=`
      .t-metals{--icon:linear-gradient(145deg,#f7c96b,#21d4fd);--glow:linear-gradient(135deg,#f7c96b,#21d4fd)}
      .metals-widget{height:100%;display:flex;flex-direction:column;gap:7px;min-height:0;font-variant-numeric:tabular-nums;color:var(--ink)}
      .metals-status{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;color:var(--muted);font-size:13px;min-height:28px}
      .metals-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.20);box-shadow:0 0 0 7px rgba(255,255,255,.06)}
      .metals-dot.ok{background:#21d47b;box-shadow:0 0 0 7px rgba(33,212,123,.14)}
      .metals-status button{width:36px;height:30px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:var(--ink);cursor:pointer;font-weight:800}
      .metals-rows{display:grid;gap:0;overflow:hidden;min-height:0}
      .metal-row{display:grid;grid-template-columns:minmax(82px,1fr) 90px 72px 66px;align-items:center;gap:10px;height:32px;border-bottom:1px solid rgba(255,255,255,.08);font-size:13px;color:var(--muted)}
      .metal-row b{color:var(--ink);font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .metal-row strong,.metal-row span,.metal-row em{font-style:normal;text-align:right;color:#22d28a;font-weight:850;white-space:nowrap}
      .metal-row.up strong,.metal-row.up span,.metal-row.up em{color:#ff697f}
      .metal-row.down strong,.metal-row.down span,.metal-row.down em{color:#20ce7a}
      .metal-row.flat strong,.metal-row.flat span,.metal-row.flat em{color:#18c98b}
      .metals-foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--muted);font-size:12px;min-height:24px}
      .metals-foot span:last-child{display:flex;gap:6px}
      .metals-foot button{border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.10);color:var(--ink);padding:4px 10px;cursor:pointer}
      .desktop-card[data-card-id] .card-body .metals-widget{padding-top:2px}
      @media(max-width:640px){.metal-row{grid-template-columns:minmax(70px,1fr) 72px 62px 56px;gap:6px;font-size:12px}.metal-row b{font-size:14px}}
    `;
    document.head.appendChild(css);
  }

  function cleanText(html){return String(html||"").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ")}
  function num(v){
    if(v===null||v===undefined)return null;
    const x=parseFloat(String(v).replace(/[,%+\s]/g,""));
    return Number.isFinite(x)?x:null;
  }
  function fmt(v,d=2){return Number.isFinite(v)?v.toFixed(d):"--"}
  function fmtSigned(v,d=2,suffix=""){
    if(!Number.isFinite(v))return "--";
    const sign=v>0?"+":"";
    return sign+v.toFixed(d)+suffix;
  }
  function esc(s){return String(s??"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));}
  boot();
})();
