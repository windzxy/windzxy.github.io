(function(){
  if(window.__windzxyMetalsWidgetLoaded)return;
  window.__windzxyMetalsWidgetLoaded=true;
  const APP_ID="metals";
  const VERSION="20260818-gold-widget1";
  const REFRESH_MS=15000;
  const QUOTES=[
    {code:"hf_AUTD",label:"國內金價",alt:"浙商金價參考",unit:"元/克"},
    {code:"hf_XAU",label:"倫敦金",alt:"現貨黃金",unit:"USD/oz"},
    {code:"hf_XAG",label:"現貨白銀",alt:"倫敦銀",unit:"USD/oz"},
    {code:"hf_GC",label:"紐約金價",alt:"COMEX Gold",unit:"USD/oz"}
  ];
  let lastQuotes={};
  let loading=false;
  let timer=null;

  function boot(){
    if(typeof apps==="undefined"||typeof renderAll==="undefined"||typeof bodyHtml==="undefined"||typeof save==="undefined"){
      setTimeout(boot,80);
      return;
    }
    installStyle();
    installApp();
    patchRenderers();
    ensureDefaultCard();
    renderAll();
    loadMetals({force:true});
    timer=setInterval(()=>loadMetals({silent:true}),REFRESH_MS);
    window.windzxyRefreshMetals=()=>loadMetals({force:true});
  }

  function installApp(){
    if(!apps.some(app=>app.id===APP_ID)){
      apps.push({id:APP_ID,kind:"widget",title:"金價",desc:"像行情軟件一樣顯示黃金、倫敦金、白銀實時價格。",icon:"Au",tone:"t-metals"});
    }
    if(typeof defaults!=="undefined"){
      defaults.forEach(ws=>{
        if(ws.id==="daily"&&!ws.cards.some(card=>card.appId===APP_ID)){
          ws.cards.push({id:"daily-metals-0",appId:APP_ID,x:360,y:536,w:292,h:120,collapsed:false,data:{}});
        }
      });
    }
  }

  function patchRenderers(){
    if(window.__windzxyMetalsPatched)return;
    window.__windzxyMetalsPatched=true;
    const oldPreferred=preferredCardSize;
    preferredCardSize=function(appId,w,h){
      if(appId===APP_ID)return {w:Math.max(w||0,292),h:Math.max(h||0,120)};
      return oldPreferred(appId,w,h);
    };
    const oldBodyHtml=bodyHtml;
    bodyHtml=function(card,info){
      if(card.appId===APP_ID)return metalsHtml(card);
      return oldBodyHtml(card,info);
    };
    const oldAddCard=addCard;
    addCard=function(appId){
      if(appId!==APP_ID)return oldAddCard(appId);
      const ws=activeWorkspace();
      const i=ws.cards.length;
      ws.cards.push({id:"metals-"+Date.now()+"-"+Math.random().toString(16).slice(2),appId:APP_ID,x:72+(i%5)*38,y:78+(i%7)*32,w:292,h:120,collapsed:false,data:{}});
      save();
      renderAll();
      loadMetals({force:true});
    };
    const oldBindCard=bindCard;
    bindCard=function(el){
      oldBindCard(el);
      const card=activeWorkspace().cards.find(x=>x.id===el.dataset.cardId);
      if(card?.appId===APP_ID)bindMetalsCard(el);
    };
    const oldRenderDesktop=renderDesktop;
    renderDesktop=function(){
      oldRenderDesktop();
      paintAllMetals();
    };
  }

  function ensureDefaultCard(){
    const exists=workspaces.some(ws=>Array.isArray(ws.cards)&&ws.cards.some(card=>card.appId===APP_ID));
    if(exists)return;
    const ws=workspaces.find(x=>x.id==="daily")||workspaces[0];
    if(!ws)return;
    ws.cards.push({id:"daily-metals-0",appId:APP_ID,x:360,y:536,w:292,h:120,collapsed:false,data:{}});
    save();
  }

  function metalsHtml(){
    return '<div class="metals-mini" data-metals-mini data-version="'+VERSION+'">'
      +'<div class="metals-mini-toolbar"><span class="metals-live-dot"></span><span class="metals-status" data-metals-status>載入行情…</span><button type="button" data-metals-refresh title="刷新">↻</button></div>'
      +'<div class="metals-mini-rows" data-metals-rows>'+skeletonRows()+'</div>'
      +'<div class="metals-mini-foot"><span data-metals-time>--</span><a href="metals.html" target="_blank" rel="noopener noreferrer">詳情</a></div>'
      +'</div>';
  }

  function skeletonRows(){
    return QUOTES.slice(0,2).map(q=>rowHtml({label:q.label,price:null,change:null,percent:null,unit:q.unit})).join("");
  }

  function bindMetalsCard(el){
    const btn=el.querySelector("[data-metals-refresh]");
    if(btn)btn.onclick=e=>{e.preventDefault();e.stopPropagation();loadMetals({force:true});};
  }

  function n(value){
    if(value===undefined||value===null)return null;
    const num=parseFloat(String(value).replace(/[%,$\s]/g,""));
    return Number.isFinite(num)?num:null;
  }

  function format(num,digits){
    if(!Number.isFinite(num))return "--";
    return num.toLocaleString(undefined,{minimumFractionDigits:digits,maximumFractionDigits:digits});
  }

  function parseSina(code,meta){
    const raw=window["hq_str_"+code]||"";
    const fields=String(raw).split(",").map(v=>v.trim());
    let price=n(fields[1]);
    if(price===null){
      const firstNum=fields.map(n).find(v=>v!==null&&Math.abs(v)>0.000001);
      price=firstNum??null;
    }
    const change=n(fields[2]);
    let percent=n(fields[3]);
    if(percent===null&&price!==null&&change!==null&&price-change!==0){
      percent=change/(price-change)*100;
    }
    const time=fields.find(v=>/^\d{1,2}:\d{2}:\d{2}$/.test(v))||fields.find(v=>/^\d{1,2}:\d{2}$/.test(v))||"";
    const date=fields.find(v=>/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(v))||"";
    return {code,label:meta.label,alt:meta.alt,unit:meta.unit,price,change,percent,time,date,raw};
  }

  function rowHtml(q){
    const priceDigits=q.code==="hf_XAG"?3:2;
    const direction=(q.change??q.percent??0)>0?"up":(q.change??q.percent??0)<0?"down":"flat";
    const sign=q.change>0?"+":"";
    const pctSign=q.percent>0?"+":"";
    return '<div class="metals-row '+direction+'" title="'+escapeAttr((q.alt||q.label)+" · "+(q.unit||""))+'">'
      +'<span class="metals-name">'+escapeHtml(q.label||"--")+'</span>'
      +'<strong class="metals-price">'+format(q.price,priceDigits)+'</strong>'
      +'<span class="metals-change">'+(Number.isFinite(q.change)?sign+format(q.change,2):"--")+'</span>'
      +'<span class="metals-pct">'+(Number.isFinite(q.percent)?pctSign+format(q.percent,2)+"%":"--")+'</span>'
      +'</div>';
  }

  function paintAllMetals(){
    document.querySelectorAll("[data-metals-mini]").forEach(root=>{
      const rows=root.querySelector("[data-metals-rows]");
      const status=root.querySelector("[data-metals-status]");
      const time=root.querySelector("[data-metals-time]");
      if(rows){
        const quoteList=QUOTES.map(q=>lastQuotes[q.code]).filter(Boolean);
        rows.innerHTML=quoteList.length?quoteList.map(rowHtml).join(""):skeletonRows();
      }
      if(status)status.textContent=loading?"刷新中…":Object.keys(lastQuotes).length?"實時金價":"等待行情";
      if(time)time.textContent=lastQuotes.__updated||"--";
    });
  }

  async function loadMetals(options={}){
    if(loading&&!options.force)return;
    loading=true;
    paintAllMetals();
    try{
      await loadSinaScript();
      const next={};
      QUOTES.forEach(q=>next[q.code]=parseSina(q.code,q));
      next.__updated=new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date());
      lastQuotes=next;
    }catch(error){
      console.warn("metals quote failed",error);
    }finally{
      loading=false;
      paintAllMetals();
    }
  }

  function loadSinaScript(){
    return new Promise((resolve,reject)=>{
      const old=document.getElementById("windzxy-metals-sina");
      if(old)old.remove();
      const script=document.createElement("script");
      script.id="windzxy-metals-sina";
      script.charset="gb2312";
      script.src="https://hq.sinajs.cn/rn="+Date.now()+"&list="+QUOTES.map(q=>q.code).join(",");
      script.onload=()=>resolve();
      script.onerror=()=>reject(new Error("Sina quote script failed"));
      document.head.appendChild(script);
      setTimeout(()=>resolve(),6000);
    });
  }

  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
  }
  function escapeAttr(value){return escapeHtml(value).replace(/\n/g," ");}

  function installStyle(){
    if(document.getElementById("windzxy-metals-style"))return;
    const style=document.createElement("style");
    style.id="windzxy-metals-style";
    style.textContent=`
      .t-metals{--icon:linear-gradient(145deg,#ffe6a7,#d49b36);--glow:linear-gradient(135deg,#f7c96b,#fff3c4)}
      .metals-mini{height:100%;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:6px;font-size:12px;color:var(--ink)}
      .metals-mini-toolbar,.metals-mini-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--muted);min-height:20px}
      .metals-live-dot{width:7px;height:7px;border-radius:50%;background:#25d366;box-shadow:0 0 0 5px rgba(37,211,102,.12);flex:0 0 auto}
      .metals-status{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-right:auto}
      .metals-mini button{border:0;border-radius:999px;background:rgba(255,255,255,.34);color:var(--ink);width:24px;height:22px;cursor:pointer;font-weight:800;line-height:1}
      :root[data-theme=dark] .metals-mini button{background:rgba(255,255,255,.10)}
      .metals-mini-rows{display:grid;gap:2px;align-content:start;overflow:hidden}
      .metals-row{display:grid;grid-template-columns:minmax(64px,1fr) minmax(70px,auto) minmax(54px,auto) minmax(56px,auto);gap:8px;align-items:center;min-height:26px;padding:2px 0;border-bottom:1px solid rgba(255,255,255,.08)}
      .metals-row:last-child{border-bottom:0}
      .metals-name{font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .metals-price,.metals-change,.metals-pct{font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
      .metals-price{font-weight:850;color:#11b978}.metals-change,.metals-pct{font-weight:800;color:#11b978}
      .metals-row.down .metals-price,.metals-row.down .metals-change,.metals-row.down .metals-pct{color:#00a86b}
      .metals-row.up .metals-price,.metals-row.up .metals-change,.metals-row.up .metals-pct{color:#d93b4a}
      .metals-mini-foot a{color:inherit;text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:1px 7px;background:rgba(255,255,255,.08)}
      .desktop-card[data-card-id] .metals-mini .metals-mini-foot{font-size:11px}
    `;
    document.head.appendChild(style);
  }

  boot();
})();
