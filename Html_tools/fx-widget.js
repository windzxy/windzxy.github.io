(function(){
  if(window.__windzxyFxWidgetLoaded)return;
  window.__windzxyFxWidgetLoaded=1;

  const APP='fx-rates';
  const VER='20260819-fx-widget2-boc-table';
  const DEFAULT_W=460,DEFAULT_H=318,MIN_W=300,MIN_H=220;
  const REFRESH_MS=30*1000;
  const BOC_URL='https://www.boc.cn/sourcedb/whpj/';
  const READ_URLS=[
    {name:'中國銀行外匯牌價',url:BOC_URL},
    {name:'中國銀行外匯牌價代理',url:'https://api.allorigins.win/raw?url='+encodeURIComponent(BOC_URL)}
  ];
  const WATCH=[
    {name:'港幣',code:'HKD',flag:'🇭🇰'},
    {name:'美元',code:'USD',flag:'🇺🇸'},
    {name:'日元',code:'JPY',flag:'🇯🇵'},
    {name:'韓國元',code:'KRW',flag:'🇰🇷'},
    {name:'土耳其里拉',code:'TRY',flag:'🇹🇷'}
  ];

  let state={rows:[],date:'--',time:'--',source:'中國銀行',status:'等待牌價',ok:false,ts:0,error:''};
  let timer=null,busy=false,patched=false;

  function boot(){
    if(typeof apps==='undefined'||typeof renderAll==='undefined'||typeof bodyHtml==='undefined'||typeof save==='undefined'){
      setTimeout(boot,80);return;
    }
    installStyle();installApp();patch();ensureCard();renderAll();afterRender();start();window.windzxyRefreshFx=()=>refresh(true);
  }

  function installApp(){
    const info={id:APP,kind:'widget',title:'匯率',desc:'中國銀行外匯牌價：三欄表格，30 秒自動刷新。',icon:'FX',tone:'t-fx'};
    const old=apps.find(a=>a.id===APP);old?Object.assign(old,info):apps.push(info);
    if(typeof defaults!=='undefined')defaults.forEach(ws=>{
      if(ws.id==='daily'&&!ws.cards.some(c=>c.appId===APP)){
        ws.cards.push({id:'daily-fx-0',appId:APP,x:60,y:420,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
      }
    });
  }

  function ensureCard(){
    try{
      const ws=activeWorkspace();
      if(ws&&!ws.cards.some(c=>c.appId===APP)){
        ws.cards.push({id:'card-fx-'+Date.now(),appId:APP,x:60,y:420,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();
      }
    }catch(e){}
  }

  function patch(){
    if(patched||window.__windzxyFxWidgetPatched)return;
    patched=window.__windzxyFxWidgetPatched=1;
    const oldBody=bodyHtml;
    bodyHtml=(card,info)=>card&&card.appId===APP?render(card):oldBody(card,info);
    if(typeof renderDesktop==='function'){
      const oldRender=renderDesktop;
      renderDesktop=function(){oldRender();afterRender();};
    }
    if(typeof addCard==='function'){
      const oldAdd=addCard;
      addCard=function(appId){
        if(appId!==APP)return oldAdd(appId);
        const n=activeWorkspace().cards.length;
        activeWorkspace().cards.push({id:'card-'+Date.now(),appId:APP,x:80+(n%4)*36,y:86+(n%5)*30,w:DEFAULT_W,h:DEFAULT_H,collapsed:false,data:{}});
        save();renderAll();start();
      };
    }
  }

  function render(card={}){
    const compact=(card.w||DEFAULT_W)<380||(card.h||DEFAULT_H)<260;
    return `<div class="fx-widget fxdesk ${compact?'compact':''}" data-fx-version="${E(VER)}">
      <header class="fx-head">
        <div class="fx-status"><i class="${state.ok?'on':''}"></i><b>BOC 牌價</b><span data-fx-status>${E(state.status)}</span></div>
        <button data-fx-refresh title="刷新">↻</button>
      </header>
      <section class="fx-title">
        <div><em>CNY</em><h3>人民幣兌主要貨幣</h3><p>中國銀行外匯牌價 · 單位：100 外幣兌人民幣</p></div>
        <div class="fx-clock"><span>發布</span><b data-fx-date>${E(pubLabel())}</b></div>
      </section>
      <section class="fx-table" role="table" aria-label="中國銀行外匯牌價">
        <div class="fx-tr fx-th" role="row"><span>貨幣</span><span>現匯買入</span><span>現匯賣出</span></div>
        ${WATCH.map(rowHtml).join('')}
      </section>
      <footer class="fx-foot"><span data-fx-time>${E(footText())}</span><button data-fx-open>源頁</button></footer>
    </div>`;
  }

  function rowHtml(c){
    const r=rowOf(c.name),prev=prevRowOf(c.name);
    const buy=num(r?.buy),sell=num(r?.sell),pbuy=num(prev?.buy),psell=num(prev?.sell);
    const mid=is(buy)&&is(sell)?(buy+sell)/2:null,pmid=is(pbuy)&&is(psell)?(pbuy+psell)/2:null;
    const chg=is(mid)&&is(pmid)?mid-pmid:null;
    const cls=is(chg)?(chg>0?'up':chg<0?'down':'flat'):'flat';
    return `<div class="fx-tr ${cls}" role="row" data-fx-row="${E(c.code)}">
      <span class="fx-currency"><b>${c.flag} ${E(c.name)}</b><small>${E(c.code)}</small></span>
      <span><b data-fx-buy="${E(c.code)}">${fmt(buy)}</b></span>
      <span><b data-fx-sell="${E(c.code)}">${fmt(sell)}</b></span>
    </div>`;
  }
  function pubLabel(){return state.date&&state.time&&state.date!=='--'?`${state.date} ${state.time}`:'--';}
  function footText(){return state.ok?`更新 ${clock(new Date(state.ts||Date.now()))} · 30s自動刷新 · 來源：${state.source}`:`${state.status}${state.error?' · '+state.error:''}`;}
  function rowOf(name){return state.rows.find(r=>r.name===name)||null;}
  function prevRowOf(name){return state.prevRows?.find(r=>r.name===name)||null;}

  function start(){clearInterval(timer);refresh(true);timer=setInterval(()=>refresh(false),REFRESH_MS);}
  async function refresh(force){
    if(busy)return;
    busy=true;
    if(force){state.status='讀取中國銀行牌價…';paint();}
    try{
      const result=await loadBoc();
      state={rows:result.rows,prevRows:state.rows||[],date:result.date,time:result.time,source:result.source,status:'已同步中國銀行外匯牌價',ok:true,ts:Date.now(),error:''};
    }catch(e){
      console.warn(e);
      state=Object.assign({},state,{status:'中國銀行牌價讀取失敗',ok:false,error:e.message||String(e),ts:Date.now()});
    }
    busy=false;paint();
  }

  async function loadBoc(){
    let lastErr=null;
    for(const src of READ_URLS){
      try{
        const html=await fetchText(src.url);
        const rows=parseBocRows(html);
        const filtered=WATCH.map(c=>rows.find(r=>r.name===c.name)).filter(Boolean);
        if(filtered.length>=3){
          const latest=filtered.find(r=>r.date||r.time)||filtered[0];
          return {rows:filtered,date:latest.date||'--',time:latest.time||'--',source:src.name};
        }
        lastErr=new Error('未解析到目標貨幣');
      }catch(e){lastErr=e;}
    }
    throw lastErr||new Error('無法讀取中國銀行牌價');
  }

  async function fetchText(url){
    const ac=new AbortController();const t=setTimeout(()=>ac.abort(),9000);
    try{
      const r=await fetch(url,{cache:'no-store',signal:ac.signal});
      if(!r.ok)throw new Error('HTTP '+r.status);
      return await r.text();
    }finally{clearTimeout(t);}
  }

  function parseBocRows(html){
    const rows=[];
    const trs=String(html||'').match(/<tr[\s\S]*?<\/tr>/gi)||[];
    trs.forEach(tr=>{
      const cells=(tr.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi)||[]).map(cleanCell);
      if(cells.length<8)return;
      const name=cells[0];
      if(!WATCH.some(c=>c.name===name))return;
      rows.push({name,buy:cells[1],cashBuy:cells[2],sell:cells[3],cashSell:cells[4],mid:cells[5],date:normalizeDate(cells[6]),time:normalizeTime(cells[7]||cells[6])});
    });
    if(rows.length)return rows;
    const text=cleanCell(String(html||'')).replace(/\s+/g,' ');
    const names=WATCH.map(c=>c.name);
    names.forEach(name=>{
      const idx=text.indexOf(name);
      if(idx<0)return;
      const part=text.slice(idx+name.length,idx+name.length+220);
      const nums=part.match(/\d+(?:\.\d+)?/g)||[];
      const dt=part.match(/\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/)?.[0]||'';
      const tm=part.match(/\d{1,2}:\d{2}:\d{2}/)?.[0]||'';
      if(nums.length>=5)rows.push({name,buy:nums[0],cashBuy:nums[1],sell:nums[2],cashSell:nums[3],mid:nums[4],date:normalizeDate(dt),time:normalizeTime(tm)});
    });
    return rows;
  }

  function cleanCell(s){return String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();}
  function normalizeDate(s){const m=String(s||'').match(/\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/);return m?m[0].replace(/-/g,'/'):'--';}
  function normalizeTime(s){const m=String(s||'').match(/\d{1,2}:\d{2}:\d{2}/);return m?m[0]:'--';}
  function afterRender(){bind();paint();}
  function bind(){
    document.querySelectorAll('[data-fx-refresh]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();refresh(true);};b.onpointerdown=e=>e.stopPropagation();});
    document.querySelectorAll('[data-fx-open]').forEach(b=>{if(b.dataset.ready)return;b.dataset.ready='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();window.open(BOC_URL,'_blank','noopener,noreferrer');};b.onpointerdown=e=>e.stopPropagation();});
  }
  function paint(){
    document.querySelectorAll('[data-fx-status]').forEach(e=>e.textContent=state.status);
    document.querySelectorAll('[data-fx-date]').forEach(e=>e.textContent=pubLabel());
    document.querySelectorAll('[data-fx-time]').forEach(e=>e.textContent=footText());
    document.querySelectorAll('.fx-status i').forEach(e=>e.classList.toggle('on',!!state.ok));
    WATCH.forEach(c=>{
      const r=rowOf(c.name);
      document.querySelectorAll(`[data-fx-buy="${c.code}"]`).forEach(e=>e.textContent=fmt(num(r?.buy)));
      document.querySelectorAll(`[data-fx-sell="${c.code}"]`).forEach(e=>e.textContent=fmt(num(r?.sell)));
    });
  }

  function installStyle(){
    if(document.getElementById('fxWidgetStyle'))return;
    const s=document.createElement('style');s.id='fxWidgetStyle';s.textContent=`
.t-fx{--icon:linear-gradient(145deg,#f6d365,#22d3ee);--glow:linear-gradient(135deg,#f6d365,#22c55e)}
.fxdesk{height:100%;display:flex;flex-direction:column;gap:9px;overflow:hidden;color:var(--ink);font-variant-numeric:tabular-nums}.fxdesk *{box-sizing:border-box;min-width:0}.fx-head{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.fx-status{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:12px;min-width:0}.fx-status i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.18);box-shadow:0 0 0 7px rgba(255,255,255,.05);flex:0 0 auto}.fx-status i.on{background:#22d47b;box-shadow:0 0 0 7px rgba(34,212,123,.13),0 0 16px rgba(34,212,123,.32)}.fx-status b{font-size:11px;color:var(--ink);padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.10);white-space:nowrap}.fx-status span,.fx-foot span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fx-head button,.fx-foot button{height:30px;border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(255,255,255,.09);color:var(--ink);font-weight:850;padding:0 12px;cursor:pointer}.fx-title{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end;border:1px solid rgba(255,255,255,.10);border-radius:17px;background:linear-gradient(135deg,rgba(246,211,101,.12),rgba(34,211,238,.08));padding:11px}.fx-title em{font-style:normal;color:#f6d365;font-size:12px;font-weight:950;letter-spacing:.13em}.fx-title h3{margin:2px 0 0;font-size:20px;line-height:1.1}.fx-title p{margin:5px 0 0;color:var(--muted);font-size:12px}.fx-clock{text-align:right}.fx-clock span{display:block;color:var(--muted);font-size:11px}.fx-clock b{display:block;margin-top:4px;font-size:13px;white-space:nowrap}.fx-table{flex:1 1 auto;min-height:0;display:grid;grid-auto-rows:minmax(32px,1fr);border:1px solid rgba(255,255,255,.10);border-radius:17px;overflow:hidden;background:rgba(255,255,255,.035)}.fx-tr{display:grid;grid-template-columns:1.15fr .9fr .9fr;gap:8px;align-items:center;padding:8px 11px;border-bottom:1px solid rgba(255,255,255,.07)}.fx-tr:last-child{border-bottom:0}.fx-th{background:rgba(255,255,255,.075);color:var(--muted);font-size:11px;font-weight:900;letter-spacing:.04em}.fx-currency{display:flex;align-items:center;gap:7px}.fx-currency b{font-size:14px;color:var(--ink);white-space:nowrap}.fx-currency small{font-size:10px;color:var(--muted);font-weight:900}.fx-tr span:not(.fx-currency) b{font-size:15px;color:var(--ink);font-weight:950}.fx-tr.up span:not(.fx-currency) b{color:#22d47b}.fx-tr.down span:not(.fx-currency) b{color:#ff667c}.fx-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--muted);font-size:12px}.fx-foot button{height:auto;padding:5px 12px}.fxdesk.compact{gap:7px}.fxdesk.compact .fx-title{grid-template-columns:1fr;padding:10px}.fxdesk.compact .fx-clock{text-align:left}.fxdesk.compact .fx-title h3{font-size:18px}.fxdesk.compact .fx-tr{grid-template-columns:1fr .82fr .82fr;padding:7px 9px}.fxdesk.compact .fx-currency{display:block}.fxdesk.compact .fx-currency b{font-size:13px}.fxdesk.compact .fx-tr span:not(.fx-currency) b{font-size:14px}@container (max-width:340px){.fx-tr{grid-template-columns:1fr .8fr .8fr;gap:5px}.fx-title p{display:none}.fx-foot{font-size:11px}}
    `;document.head.appendChild(s);
  }

  function num(v){const x=parseFloat(String(v??'').replace(/,/g,''));return Number.isFinite(x)?x:null;}
  function is(v){return Number.isFinite(v);}
  function fmt(v){return is(v)?v.toFixed(v<10?4:2):'--';}
  function clock(d){return new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(d);}
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  boot();
})();