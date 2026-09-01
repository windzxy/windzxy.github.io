(function(){
  if(window.__windzxyWorkspacePreloadCleanerLoadedV6)return;
  window.__windzxyWorkspacePreloadCleanerLoadedV6=1;
  window.__windzxyWorkspacePreloadCleanerLoaded=1;

  const VER='20260901-workspace-preload-cleaner6-preserve-deletions';
  const STORE='windzxy-web-desktop-workspaces';
  const LEGACY=['windzxy-desktop-workspaces','windzxy-dashboard-workspaces'];
  const GEO='windzxy-web-desktop-card-geometry-v4';
  const KEYS=new Set([STORE,...LEGACY]);
  const SEED_ID_RE=/^(daily|office|imageDesk|data)-[^\s]+-\d+$/i;
  const AUTO_WIDGET_ID_RE=/^(card-(metals|fx)-|daily-(metals|fx-rates)-\d+$)/i;
  const OLD_IMAGE_SEED_RE=/^imageDesk-(image|color|note)-\d+$/i;
  const EMPTY_DEFAULTS=[
    {id:'daily',name:'日常工作區',hint:'從右側功能中心選擇需要的卡片。',cards:[]},
    {id:'office',name:'辦公整理',hint:'文字、表格、日期與 JSON 放在一起。',cards:[]},
    {id:'imageDesk',name:'圖片工作台',hint:'圖片處理與 OCR 優先。',cards:[]},
    {id:'data',name:'資料處理',hint:'整理表格、JSON 和日期資料。',cards:[]}
  ];

  function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v;}}
  function safeParse(text){try{const v=JSON.parse(text||'null');return Array.isArray(v)?v:null;}catch(e){return null;}}
  function idOf(card){return String(card?.id||'');}
  function isManual(card){return !!card&&(card.source==='manual'||card.manual===true||card.userCreated===true||idOf(card).startsWith('custom-'));}
  function isLegacyAutoCard(card,ws){
    if(!card)return false;
    const id=idOf(card);
    if(isManual(card))return false;
    if(AUTO_WIDGET_ID_RE.test(id))return true;
    if(OLD_IMAGE_SEED_RE.test(id))return true;
    if(SEED_ID_RE.test(id))return true;
    if(card.source==='system')return true;
    if(ws&&/^(daily|office|imageDesk|data)$/i.test(String(ws.id||''))&&id.startsWith(ws.id+'-')&&!id.startsWith('card-')&&!id.startsWith('custom-'))return true;
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
    return source.filter(Boolean).map(ws=>{
      const cards=(Array.isArray(ws.cards)?ws.cards:[]).map(normalizeCard);
      const kept=cards.filter(card=>!isLegacyAutoCard(card,ws));
      return Object.assign({},ws,{cards:kept});
    });
  }
  function cleanText(text){
    const parsed=safeParse(text);
    if(!parsed)return text;
    return JSON.stringify(ensureWorkspaces(parsed));
  }

  const rawGet=Storage.prototype.getItem;
  const rawSet=Storage.prototype.setItem;

  function cleanGeo(){
    try{
      const raw=rawGet.call(localStorage,GEO);
      if(!raw)return;
      const geo=JSON.parse(raw);
      if(!geo||typeof geo!=='object')return;
      let changed=false;
      Object.keys(geo).forEach(key=>{
        if(/::id::(card-(metals|fx)-|daily-(metals|fx-rates)-|imageDesk-(image|color|note)-)/.test(key)){
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
