(function(){
  if(window.__windzxyWorkspacePreloadCleanerLoaded)return;
  window.__windzxyWorkspacePreloadCleanerLoaded=1;

  const VER='20260828-workspace-preload-cleaner1-before-core';
  const STORE='windzxy-web-desktop-workspaces';
  const LEGACY=['windzxy-desktop-workspaces','windzxy-dashboard-workspaces'];
  const KEYS=new Set([STORE,...LEGACY]);
  const DEFAULT_IDS=new Set(['daily','office','imageDesk','data']);
  const SEED_ID_RE=/^(daily|office|imageDesk|data)-[^\s]+-\d+$/i;
  const EMPTY_DEFAULTS=[
    {id:'daily',name:'日常工作區',hint:'從右側功能中心選擇需要的卡片。',cards:[]},
    {id:'office',name:'辦公整理',hint:'文字、表格、日期與 JSON 放在一起。',cards:[]},
    {id:'imageDesk',name:'圖片工作台',hint:'圖片處理與 OCR 優先。',cards:[]},
    {id:'data',name:'資料處理',hint:'整理表格、JSON 和日期資料。',cards:[]}
  ];

  function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v;}}
  function safeParse(text){try{const v=JSON.parse(text||'null');return Array.isArray(v)?v:null;}catch(e){return null;}}
  function isSeedCard(card,ws){
    if(!card)return false;
    const id=String(card.id||'');
    if(SEED_ID_RE.test(id))return true;
    if(ws&&DEFAULT_IDS.has(ws.id)&&id.startsWith(ws.id+'-')&&!id.startsWith('card-')&&!id.startsWith('custom-'))return true;
    if(card.source==='system')return true;
    return false;
  }
  function ensureWorkspaces(list){
    const source=Array.isArray(list)&&list.length?list:clone(EMPTY_DEFAULTS);
    const byId=new Map(source.map(ws=>[ws.id,Object.assign({},ws)]));
    EMPTY_DEFAULTS.forEach(def=>{if(!byId.has(def.id))byId.set(def.id,Object.assign({},def));});
    return [...byId.values()].map(ws=>{
      const cards=Array.isArray(ws.cards)?ws.cards:[];
      const kept=cards.filter(card=>!isSeedCard(card,ws));
      return Object.assign({},ws,{cards:kept});
    });
  }
  function cleanText(text){
    const parsed=safeParse(text);
    if(!parsed)return text;
    const cleaned=ensureWorkspaces(parsed);
    return JSON.stringify(cleaned);
  }
  function forceCleanStorage(){
    for(const key of KEYS){
      const raw=rawGet.call(localStorage,key);
      if(!raw)continue;
      const cleaned=cleanText(raw);
      if(cleaned!==raw)rawSet.call(localStorage,key,cleaned);
    }
    if(!rawGet.call(localStorage,STORE))rawSet.call(localStorage,STORE,JSON.stringify(clone(EMPTY_DEFAULTS)));
  }

  const rawGet=Storage.prototype.getItem;
  const rawSet=Storage.prototype.setItem;
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
      if(Array.isArray(window.workspaces)){
        window.workspaces=ensureWorkspaces(window.workspaces);
        rawSet.call(localStorage,STORE,JSON.stringify(window.workspaces));
      }
    }catch(e){}
  };
  window.windzxyWorkspacePreloadCleanerVersion=VER;
})();
