(function(){
  if(window.__windzxyWorkspacePreloadCleanerLoaded)return;
  window.__windzxyWorkspacePreloadCleanerLoaded=1;

  const VER='20260828-workspace-preload-cleaner3-block-widget-autocards';
  const STORE='windzxy-web-desktop-workspaces';
  const LEGACY=['windzxy-desktop-workspaces','windzxy-dashboard-workspaces'];
  const GEO='windzxy-web-desktop-card-geometry-v4';
  const KEYS=new Set([STORE,...LEGACY]);
  const DEFAULT_IDS=new Set(['daily','office','imageDesk','data']);
  const SEED_ID_RE=/^(daily|office|imageDesk|data)-[^\s]+-\d+$/i;
  const AUTO_ID_RE=/^(card-(metals|fx)-|daily-(metals|fx-rates)-\d+$|imageDesk-(image|color|note)-\d+$)/i;
  const IMAGE_DESK_AUTO=new Set(['image','color','note']);
  const EMPTY_DEFAULTS=[
    {id:'daily',name:'日常工作區',hint:'從右側功能中心選擇需要的卡片。',cards:[]},
    {id:'office',name:'辦公整理',hint:'文字、表格、日期與 JSON 放在一起。',cards:[]},
    {id:'imageDesk',name:'圖片工作台',hint:'圖片處理與 OCR 優先。',cards:[]},
    {id:'data',name:'資料處理',hint:'整理表格、JSON 和日期資料。',cards:[]}
  ];

  function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v;}}
  function safeParse(text){try{const v=JSON.parse(text||'null');return Array.isArray(v)?v:null;}catch(e){return null;}}
  function isManual(card){return !!card&&(card.source==='manual'||card.manual===true||String(card.id||'').startsWith('custom-'));}
  function appOf(card){return String(card?.appId||card?.toolId||'');}
  function isAutoCard(card,ws){
    if(!card)return false;
    const id=String(card.id||'');
    const appId=appOf(card);
    if(SEED_ID_RE.test(id))return true;
    if(AUTO_ID_RE.test(id))return true;
    if(card.source==='system')return true;
    if(ws&&DEFAULT_IDS.has(ws.id)&&id.startsWith(ws.id+'-')&&!id.startsWith('card-')&&!id.startsWith('custom-'))return true;
    if(ws&&ws.id==='imageDesk'&&IMAGE_DESK_AUTO.has(appId)&&!isManual(card))return true;
    return false;
  }
  function normalizeCard(card,i){
    const next=Object.assign({},card);
    next.id=next.id||('card-'+Date.now()+'-'+i);
    next.appId=next.appId||next.toolId||'note';
    return next;
  }
  function ensureWorkspaces(list){
    const source=Array.isArray(list)&&list.length?list:clone(EMPTY_DEFAULTS);
    const byId=new Map(source.map(ws=>[ws.id,Object.assign({},ws)]));
    EMPTY_DEFAULTS.forEach(def=>{if(!byId.has(def.id))byId.set(def.id,Object.assign({},def));});
    return [...byId.values()].map(ws=>{
      const cards=(Array.isArray(ws.cards)?ws.cards:[]).map(normalizeCard);
      const kept=cards.filter(card=>!isAutoCard(card,ws));
      return Object.assign({},ws,{cards:kept});
    });
  }
  function cleanText(text){
    const parsed=safeParse(text);
    if(!parsed)return text;
    return JSON.stringify(ensureWorkspaces(parsed));
  }
  function cleanGeo(){
    try{
      const raw=rawGet.call(localStorage,GEO);
      if(!raw)return;
      const geo=JSON.parse(raw);
      if(!geo||typeof geo!=='object')return;
      let changed=false;
      Object.keys(geo).forEach(key=>{
        if(/::app::(metals|fx-rates|image|color|note)$/.test(key)||/::id::(card-(metals|fx)-|daily-(metals|fx-rates)-|imageDesk-(image|color|note)-)/.test(key)){
          delete geo[key];
          changed=true;
        }
      });
      if(changed)rawSet.call(localStorage,GEO,JSON.stringify(geo));
    }catch(e){}
  }
  function forceCleanStorage(){
    for(const key of KEYS){
      const raw=rawGet.call(localStorage,key);
      if(!raw)continue;
      const cleaned=cleanText(raw);
      if(cleaned!==raw)rawSet.call(localStorage,key,cleaned);
    }
    if(!rawGet.call(localStorage,STORE))rawSet.call(localStorage,STORE,JSON.stringify(clone(EMPTY_DEFAULTS)));
    cleanGeo();
  }

  const rawGet=Storage.prototype.getItem;
  const rawSet=Storage.prototype.setItem;
  const rawPush=Array.prototype.push;

  function shouldBlockPush(item){
    if(!item||typeof item!=='object'||Array.isArray(item))return false;
    const id=String(item.id||'');
    const appId=appOf(item);
    if(AUTO_ID_RE.test(id))return true;
    if(SEED_ID_RE.test(id)&&!isManual(item))return true;
    if((id==='daily-metals-0'||id==='daily-fx-0'||id==='daily-fx-rates-0')&&!isManual(item))return true;
    if((appId==='metals'||appId==='fx-rates')&&/^card-(metals|fx)-/i.test(id)&&!isManual(item))return true;
    return false;
  }
  Array.prototype.push=function(){
    const args=[...arguments].filter(item=>!shouldBlockPush(item));
    if(!args.length)return this.length;
    return rawPush.apply(this,args);
  };

  Storage.prototype.getItem=function(key){
    const value=rawGet.call(this,key);
    if(this===localStorage&&KEYS.has(String(key))&&value){
      const cleaned=cleanText(value);
      if(cleaned!==value)rawSet.call(this,key,cleaned);
      return cleaned;
    }
    return value;
  };
  Storage.prototype.setItem=function(key,value){
    if(this===localStorage&&KEYS.has(String(key))){
      return rawSet.call(this,key,cleanText(String(value)));
    }
    return rawSet.call(this,key,value);
  };

  forceCleanStorage();
  window.__windzxyCleanDefaultWorkspaces=function(){
    try{
      forceCleanStorage();
      if(typeof workspaces!=='undefined'&&Array.isArray(workspaces)){
        workspaces=ensureWorkspaces(workspaces);
        rawSet.call(localStorage,STORE,JSON.stringify(workspaces));
      }
      if(Array.isArray(window.workspaces)){
        window.workspaces=ensureWorkspaces(window.workspaces);
        rawSet.call(localStorage,STORE,JSON.stringify(window.workspaces));
      }
    }catch(e){}
  };
  window.windzxyWorkspacePreloadCleanerVersion=VER;
})();