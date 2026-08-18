(function(){
  if(window.__windzxyMetalsWidgetLoaded)return;
  window.__windzxyMetalsWidgetLoaded=true;
  const APP_ID="metals";
  const VERSION="20260818-gold-widget2";
  const REFRESH_MS=15000;
  const OZ_TO_GRAM=31.1034768;
  const TENCENT_CODES=["hf_XAU","hf_XAG","hf_GC","hf_SI","fx_usr"];
  const JD_MINSHENG="https://api.jdjygold.com/gw/generic/hj/h5/m/latestPrice?reqData={}";
  const JD_ZHESHANG="https://api.jdjygold.com/gw2/generic/jrm/h5/m/stdLatestPrice?productSku=1961543816";
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
      apps.push({id:APP_ID,kind:"widget",title:"金價",desc:"國內金價、倫敦金、現貨白銀、紐約金價實時小看板。",icon:"Au",tone:"t-metals"});
    }
    if(typeof defaults!=="undefined"){
      defaults.forEach(ws=>{
        if(ws.id==="daily"&&!ws.cards.some(card=>card.appId===APP_ID)){
          ws.cards.push({id:"daily-metals-0",appId:APP_ID,x:360,y:536,w:292,h:120,collapsed:false,data:{}});
        }
      });
    }
  }

  function ensureDefaultCard(){
    try{
      const ws=activeWorkspace();
      if(ws&&!ws.cards.some(card=>card.appId===APP_ID)){
        ws.cards.push({id:"card-metals-"+Date.now(),appId:APP_ID,x:360,y:536,w:292,h:120,collapsed:false,data:{}});
        save();
      }
    }catch(error){console.warn("metals default card skipped",error)}
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
        activeWorkspace().cards.push({id:"card-"+Date.now()+"-"+Math.random().toString(16).slice(2),appId:APP_ID,x:72+(i%5)*38,y:78+(i%7)*32,w:292,h:120,collapsed:false,data:{}});
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
      +'<div class="metals-status"><span class="metals-dot '+(lastQuotes.ok?'ok':'')+'"></span><span>'+escape(status)+'</span><button type="button" title="刷新" data-metals-refresh>↻</button></div>'
      +'<div class="metals-rows">'+list.map(rowHtml).join("")+'</div>'
      +'<div class="metals-foot"><span>'+escape(time)+'</span><button type="button" data-open-url="metals.html" data-open-title="貴金屬看板">詳情</button></div>'
      +'</div>';
  }

  function visibleRows(card){
    const h=Number(card?.h)||120;
    const w=Number(card?.w)||292;
    if(h<150||w<330)return 2;
    if(h<195)return 3;
    return 5;
  }

  function buildRows(){
    const xau=lastQuotes.hf_XAU;
    const fx=lastQuotes.fx_usr;
    const domestic=lastQuotes.jdZheshang||lastQuotes.jdMinsheng||calcDomestic(xau,fx);
    return [
      domestic||emptyRow("國內金價","CNY/g"),
      xau||emptyRow("倫敦金","USD/oz"),
      lastQuotes.hf_XAG||emptyRow("現貨白銀","USD/oz"),
      lastQuotes.hf_GC||emptyRow("紐約金價","USD/oz"),
      lastQuotes.hf_SI||emptyRow("紐約白銀","USD/oz")
    ];
  }

  function emptyRow(label,unit){return {label,price:null,change:null,pct:null,unit,source:"--"}}

  function rowHtml(row){
    const trend=row.pct>0?"up":row.pct<0?"down":"flat";
    const ch=fmtSigned(row.change,2);
    const pct=fmtSigned(row.pct,2,"%");
    return '<div class="metal-row '+trend+'" title="'+escape(row.source||"")+'">'
      +'<b>'+escape(row.label)+'</b>'
      +'<strong>'+fmt(row.price,row.unit==="CNY/g"?2:2)+'</strong>'
      +'<span>'+ch+'</span>'
      +'<em>'+pct+'</em>'
      +'</div>';
  }

  async function loadMetals(options={}){
    if(loading&&!options.force)return;
    loading=true;
    if(!options.silent){lastQuotes.status="刷新中…";rerenderMetalsOnly();}
    try{
      const results=await Promise.allSettled([loadTencent(),loadJdZheshang(),loadJdMinsheng()]);
      const tencent=results[0].status==="fulfilled"?results[0].value:null;
      const jdZ=results[1].status==="fulfilled"?results[1].value:null;
      const jdM=results[2].status==="fulfilled"?results[2].value:null;
      if(tencent)Object.assign(lastQuotes,tencent);
      if(jdZ)lastQuotes.jdZheshang=jdZ;
      if(jdM)lastQuotes.jdMinsheng=jdM;
      const ok=!!(lastQuotes.hf_XAU||lastQuotes.hf_XAG||lastQuotes.hf_GC||lastQuotes.jdZheshang||lastQuotes.jdMinsheng);
      lastQuotes.ok=ok;
      lastQuotes.status=ok?(lastQuotes.jdZheshang?"京東/騰訊行情":"騰訊行情"):("行情源暫不可用");
      lastQuotes.time=new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date());
    }catch(error){
      console.warn("metals load failed",error);
      lastQuotes.ok=false;
      lastQuotes.status="行情源暫不可用";
      lastQuotes.time=new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"}).format(new Date());
    }finally{
      loading=false;
      rerenderMetalsOnly();
    }
  }

  function rerenderMetalsOnly(){
    document.querySelectorAll('[data-card-id]').forEach(cardEl=>{
      const id=cardEl.dataset.cardId;
      const card=activeWorkspace().cards.find(x=>x.id===id);
      if(card?.appId===APP_ID){
        const body=cardEl.querySelector('.card-body');
        if(body)body.innerHTML=metalsHtml(card);
      }
    });
    bindRefreshButtons();
  }

  function bindRefreshButtons(){
    document.querySelectorAll('[data-metals-refresh]').forEach(btn=>{
      if(btn.dataset.ready)return;
      btn.dataset.ready="1";
      btn.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();loadMetals({force:true});});
      btn.addEventListener('pointerdown',event=>event.stopPropagation());
    });
  }

  function loadTencent(){
    return new Promise(resolve=>{
      const id="tencentMetalsQuoteScript";
      document.getElementById(id)?.remove();
      TENCENT_CODES.forEach(code=>{try{delete window['v_'+code]}catch(e){}});
      const script=document.createElement('script');
      script.id=id;
      script.charset='gbk';
      script.src='https://qt.gtimg.cn/q='+encodeURIComponent(TENCENT_CODES.join(','))+'&_='+Date.now();
      let done=false;
      const finish=()=>{
        if(done)return;done=true;
        setTimeout(()=>resolve(parseTencent()),40);
      };
      script.onload=finish;
      script.onerror=()=>resolve(null);
      setTimeout(()=>resolve(null),6500);
      document.head.appendChild(script);
    });
  }

  function parseTencent(){
    const out={};
    ['hf_XAU','hf_XAG','hf_GC','hf_SI'].forEach(code=>{
      const raw=window['v_'+code];
      const parsed=parseTencentMetal(code,raw);
      if(parsed)out[code]=parsed;
    });
    const fx=parseTencentFx(window.v_fx_usr);
    if(fx)out.fx_usr=fx;
    return Object.keys(out).length?out:null;
  }

  function parseTencentMetal(code,raw){
    if(!raw||String(raw).includes('none_match'))return null;
    const f=String(raw).replace(/^\"|\"$/g,'').split(',');
    const price=num(f[0]);
    const pct=num(f[1]);
    const prev=num(f[7]);
    if(!Number.isFinite(price))return null;
    const labels={hf_XAU:'倫敦金',hf_XAG:'現貨白銀',hf_GC:'紐約金價',hf_SI:'紐約白銀'};
    const unit={hf_XAG:'USD/oz'}[code]||'USD/oz';
    return {
      label:labels[code]||code,
      price,
      change:Number.isFinite(prev)?price-prev:(Number.isFinite(pct)?price*pct/(100+pct):null),
      pct:Number.isFinite(pct)?pct:null,
      unit,
      source:'Tencent qt.gtimg.cn '+code,
      time:[f[12],f[6]].filter(Boolean).join(' ')
    };
  }

  function parseTencentFx(raw){
    if(!raw||String(raw).includes('none_match'))return null;
    const f=String(raw).split('~');
    const price=num(f[3])||num(f[1])||num(f[4]);
    const change=num(f[31]);
    const pct=num(f[32]);
    if(!Number.isFinite(price))return null;
    return {label:'USD/CNY',price,change,pct,unit:'CNY',source:'Tencent qt.gtimg.cn fx_usr'};
  }

  async function loadJdZheshang(){
    const json=await fetchJson(JD_ZHESHANG);
    return parseJd(json,'浙商金價');
  }

  async function loadJdMinsheng(){
    const json=await fetchJson(JD_MINSHENG);
    return parseJd(json,'民生金價');
  }

  async function fetchJson(url){
    const res=await fetch(url,{cache:'no-store',credentials:'omit',headers:{Accept:'application/json'}});
    if(!res.ok)throw new Error('HTTP '+res.status);
    return res.json();
  }

  function parseJd(json,label){
    const data=json?.resultData?.datas||json?.resultData?.data||json?.data||{};
    const price=num(data.price)||num(data.goldPrice)||num(data.latestPrice)||num(data.value);
    if(!Number.isFinite(price))return null;
    const rateText=String(data.rate||data.upDownRate||data.changeRate||data.priceChangeRate||'').replace('%','');
    const pct=num(rateText);
    const change=num(data.diff)||num(data.change)||num(data.upDown)||null;
    return {label,price,change:Number.isFinite(change)?change:null,pct:Number.isFinite(pct)?pct:null,unit:'CNY/g',source:'JD Gold '+label};
  }

  function calcDomestic(xau,fx){
    if(!xau?.price||!fx?.price)return null;
    const price=xau.price*fx.price/OZ_TO_GRAM;
    const prev=(xau.price-(xau.change||0))*fx.price/OZ_TO_GRAM;
    const change=price-prev;
    const pct=prev?change/prev*100:null;
    return {label:'國內金價',price,change,pct,unit:'CNY/g',source:'XAU × USD/CNY ÷ 31.1034768 折算參考'};
  }

  function installStyle(){
    if(document.getElementById('metalsWidgetStyle'))return;
    const css=document.createElement('style');
    css.id='metalsWidgetStyle';
    css.textContent=`
      .t-metals{--icon:linear-gradient(145deg,#f7c96b,#21d4fd);--glow:linear-gradient(135deg,#f7c96b,#21d4fd)}
      .metals-widget{height:100%;display:flex;flex-direction:column;gap:7px;min-height:0;font-variant-numeric:tabular-nums;color:var(--ink)}
      .metals-status{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;color:var(--muted);font-size:13px;min-height:28px}
      .metals-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.20);box-shadow:0 0 0 7px rgba(255,255,255,.06)}
      .metals-dot.ok{background:#21d47b;box-shadow:0 0 0 7px rgba(33,212,123,.14)}
      .metals-status button{width:36px;height:30px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:var(--ink);cursor:pointer;font-weight:800}
      .metals-rows{display:grid;gap:0;overflow:hidden;min-height:0}
      .metal-row{display:grid;grid-template-columns:minmax(76px,1fr) 86px 76px 72px;align-items:center;gap:10px;height:34px;border-bottom:1px solid rgba(255,255,255,.08);font-size:13px;color:var(--muted)}
      .metal-row b{color:var(--ink);font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .metal-row strong,.metal-row span,.metal-row em{font-style:normal;text-align:right;color:#22d28a;font-weight:850;white-space:nowrap}
      .metal-row.up strong,.metal-row.up span,.metal-row.up em{color:#ff697f}
      .metal-row.down strong,.metal-row.down span,.metal-row.down em{color:#20ce7a}
      .metal-row.flat strong,.metal-row.flat span,.metal-row.flat em{color:#18c98b}
      .metals-foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--muted);font-size:12px;min-height:24px}
      .metals-foot button{border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.10);color:var(--ink);padding:4px 10px;cursor:pointer}
      .desktop-card[data-card-id] .card-body .metals-widget{padding-top:2px}
      @media(max-width:640px){.metal-row{grid-template-columns:minmax(70px,1fr) 72px 62px 56px;gap:6px;font-size:12px}.metal-row b{font-size:14px}}
    `;
    document.head.appendChild(css);
  }

  function num(v){
    if(v===null||v===undefined)return null;
    const x=parseFloat(String(v).replace(/[,%+\s]/g,''));
    return Number.isFinite(x)?x:null;
  }
  function fmt(v,d=2){return Number.isFinite(v)?v.toFixed(d):'--'}
  function fmtSigned(v,d=2,suffix=''){
    if(!Number.isFinite(v))return '--';
    const sign=v>0?'+':'';
    return sign+v.toFixed(d)+suffix;
  }
  function escape(s){
    return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  document.addEventListener('click',event=>{
    if(event.target.closest('[data-metals-refresh]'))return;
  });
  boot();
})();
