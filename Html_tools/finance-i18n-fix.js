(function(){
  if(window.__windzxyFinanceI18nFixLoaded)return;
  window.__windzxyFinanceI18nFixLoaded=1;

  const VER='20260819-finance-i18n1';
  const REGISTRY={
    metals:{
      title:{'zh-CN':'金价','zh-HK':'金價',en:'Metals'},
      desc:{'zh-CN':'贵金属行情与 TradingView 图表。','zh-HK':'貴金屬行情與 TradingView 圖表。',en:'Precious metals quotes and TradingView chart.'}
    },
    'fx-rates':{
      title:{'zh-CN':'汇率','zh-HK':'匯率',en:'FX rates'},
      desc:{'zh-CN':'中国银行外汇牌价与互换式换算。','zh-HK':'中國銀行外匯牌價與互換式換算。',en:'Bank of China FX rates and swap converter.'}
    }
  };
  const TERMS={
    '金價':REGISTRY.metals.title,'金价':REGISTRY.metals.title,'Metals':REGISTRY.metals.title,
    '匯率':REGISTRY['fx-rates'].title,'汇率':REGISTRY['fx-rates'].title,'FX rates':REGISTRY['fx-rates'].title,
    '貴金屬行情與 TradingView 圖表。':REGISTRY.metals.desc,
    '贵金属行情与 TradingView 图表。':REGISTRY.metals.desc,
    'Precious metals quotes and TradingView chart.':REGISTRY.metals.desc,
    '中國銀行外匯牌價與互換式換算。':REGISTRY['fx-rates'].desc,
    '中国银行外汇牌价与互换式换算。':REGISTRY['fx-rates'].desc,
    'Bank of China FX rates and swap converter.':REGISTRY['fx-rates'].desc
  };

  function lang(){
    const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
    if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';
    if(/^en/i.test(v))return 'en';
    return 'zh-HK';
  }
  function pick(map){return map?.[lang()]||map?.['zh-HK']||'';}
  function addI18n(){
    try{
      if(typeof I18N==='undefined')return;
      Object.entries(TERMS).forEach(([key,val])=>{I18N[key]=Object.assign({},I18N[key]||{},val);});
    }catch(e){}
  }
  function syncApps(){
    try{
      if(typeof apps==='undefined'||!Array.isArray(apps))return;
      apps.forEach(app=>{
        const meta=REGISTRY[app.id];
        if(!meta)return;
        app.title=pick(meta.title);
        app.desc=pick(meta.desc);
      });
    }catch(e){}
  }
  function replaceTextIn(root){
    const lc=lang();
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const s=node.nodeValue.trim();
      if(!s)return NodeFilter.FILTER_REJECT;
      return TERMS[s]?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const raw=n.nodeValue;const left=raw.match(/^\s*/)?.[0]||'';const right=raw.match(/\s*$/)?.[0]||'';const key=raw.trim();n.nodeValue=left+(TERMS[key][lc]||TERMS[key]['zh-HK']||key)+right;});
  }
  function syncDom(){
    syncApps();
    addI18n();
    const roots=[document.getElementById('toolShelf'),document.getElementById('desktopDrawer'),document.getElementById('desktopCanvas'),document.getElementById('windowLayer')].filter(Boolean);
    roots.forEach(replaceTextIn);
    document.querySelectorAll('.desktop-card,.dock-tool-list,.desktop-drawer').forEach(el=>{
      ['title','aria-label'].forEach(attr=>{
        const val=el.getAttribute(attr);
        if(val&&TERMS[val])el.setAttribute(attr,pick(TERMS[val]));
      });
    });
  }
  function patchRenderers(){
    try{
      if(typeof renderAll==='function'&&!window.__windzxyFinanceI18nRenderAllPatched){
        window.__windzxyFinanceI18nRenderAllPatched=1;
        const old=renderAll;
        renderAll=function(){syncApps();const out=old.apply(this,arguments);setTimeout(syncDom,0);return out;};
      }
      if(typeof renderDesktop==='function'&&!window.__windzxyFinanceI18nRenderDesktopPatched){
        window.__windzxyFinanceI18nRenderDesktopPatched=1;
        const old=renderDesktop;
        renderDesktop=function(){syncApps();const out=old.apply(this,arguments);setTimeout(syncDom,0);return out;};
      }
    }catch(e){}
  }
  function boot(){
    addI18n();syncApps();patchRenderers();syncDom();
    document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select'))setTimeout(syncDom,80);},true);
    const mo=new MutationObserver(()=>{clearTimeout(boot._t);boot._t=setTimeout(syncDom,40);});
    mo.observe(document.body,{childList:true,subtree:true,characterData:true});
    window.windzxyRegisterI18n=function(id,meta){REGISTRY[id]=meta;syncDom();};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();