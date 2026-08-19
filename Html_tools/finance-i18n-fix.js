(function(){
  if(window.__windzxyFinanceI18nFixLoaded)return;
  window.__windzxyFinanceI18nFixLoaded=1;

  const VER='20260819-finance-i18n3-final-calendar-header';
  const REGISTRY={
    metals:{
      title:{'zh-CN':'金价','zh-HK':'金價',en:'Metals'},
      desc:{'zh-CN':'贵金属行情与 TradingView 图表。','zh-HK':'貴金屬行情與 TradingView 圖表。',en:'Precious metals quotes and TradingView chart.'}
    },
    'fx-rates':{
      title:{'zh-CN':'汇率','zh-HK':'匯率',en:'FX rates'},
      desc:{'zh-CN':'中国银行外汇牌价与互换式换算。','zh-HK':'中國銀行外匯牌價與互換式換算。',en:'Bank of China FX rates and swap converter.'}
    },
    calendar:{
      title:{'zh-CN':'万年历','zh-HK':'萬年曆',en:'Calendar'},
      desc:{'zh-CN':'农历、公历、中国内地节假日调休与香港公众假期。','zh-HK':'農曆、公曆、中國內地節假日調休與香港公眾假期。',en:'Lunar calendar, Gregorian dates, Mainland China holiday transfers and Hong Kong public holidays.'}
    }
  };
  const TERMS={
    '金價':REGISTRY.metals.title,'金价':REGISTRY.metals.title,'Metals':REGISTRY.metals.title,
    '匯率':REGISTRY['fx-rates'].title,'汇率':REGISTRY['fx-rates'].title,'FX rates':REGISTRY['fx-rates'].title,
    '萬年曆':REGISTRY.calendar.title,'万年历':REGISTRY.calendar.title,'Calendar':REGISTRY.calendar.title,
    '貴金屬行情與 TradingView 圖表。':REGISTRY.metals.desc,
    '贵金属行情与 TradingView 图表。':REGISTRY.metals.desc,
    'Precious metals quotes and TradingView chart.':REGISTRY.metals.desc,
    '中國銀行外匯牌價與互換式換算。':REGISTRY['fx-rates'].desc,
    '中国银行外汇牌价与互换式换算。':REGISTRY['fx-rates'].desc,
    'Bank of China FX rates and swap converter.':REGISTRY['fx-rates'].desc,
    '農曆、公曆、中國內地節假日調休與香港公眾假期。':REGISTRY.calendar.desc,
    '农历、公历、中国内地节假日调休与香港公众假期。':REGISTRY.calendar.desc,
    'Lunar calendar, Gregorian dates, Mainland China holiday transfers and Hong Kong public holidays.':REGISTRY.calendar.desc
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
  function installFinalCalendarHeaderStyle(){
    const old=document.getElementById('windzxyFinalCalendarHeaderFix');
    if(old)old.remove();
    const s=document.createElement('style');
    s.id='windzxyFinalCalendarHeaderFix';
    s.textContent=`
/* Final override: Calendar header left / center / right alignment. Loaded last. */
.calendar-widget.calx .calx-today{display:none!important;visibility:hidden!important;pointer-events:none!important}
.calendar-widget.calx .calx-top{
  display:grid!important;
  grid-template-columns:38px 38px minmax(0,1fr) 38px 38px!important;
  grid-template-areas:"cy cm title nm ny"!important;
  align-items:center!important;
  justify-items:center!important;
  column-gap:8px!important;
  padding:0 18px 0 0!important;
  margin:0!important;
  overflow:visible!important;
  box-sizing:border-box!important;
}
.calendar-widget.calx .calx-top [data-calx-shift="-12"]{grid-area:cy!important;transform:none!important;position:static!important}
.calendar-widget.calx .calx-top [data-calx-shift="-1"]{grid-area:cm!important;transform:none!important;position:static!important}
.calendar-widget.calx .calx-title{
  grid-area:title!important;
  justify-self:start!important;
  align-self:center!important;
  min-width:0!important;
  width:100%!important;
  overflow:hidden!important;
  padding:0!important;
  margin:0!important;
}
.calendar-widget.calx .calx-top [data-calx-shift="1"]{grid-area:nm!important;transform:none!important;position:static!important}
.calendar-widget.calx .calx-top [data-calx-shift="12"]{grid-area:ny!important;transform:none!important;position:static!important}
.calendar-widget.calx .calx-top button{
  width:34px!important;
  min-width:34px!important;
  max-width:34px!important;
  height:34px!important;
  min-height:34px!important;
  max-height:34px!important;
  padding:0!important;
  margin:0!important;
  display:grid!important;
  place-items:center!important;
  line-height:1!important;
  border-radius:999px!important;
  align-self:center!important;
  justify-self:center!important;
  overflow:visible!important;
  box-sizing:border-box!important;
}
.calendar-widget.calx .calx-title h3,
.calendar-widget.calx .calx-title p{
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
@container (max-width:360px){
  .calendar-widget.calx .calx-top{
    grid-template-columns:34px 34px minmax(0,1fr) 34px 34px!important;
    column-gap:6px!important;
    padding-right:14px!important;
  }
  .calendar-widget.calx .calx-top button{width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important}
}
@container (max-width:300px){
  .calendar-widget.calx .calx-top{
    grid-template-columns:32px minmax(0,1fr) 32px!important;
    grid-template-areas:"cm title nm"!important;
    column-gap:6px!important;
    padding-right:12px!important;
  }
  .calendar-widget.calx .calx-top [data-calx-shift="-12"],
  .calendar-widget.calx .calx-top [data-calx-shift="12"]{display:none!important}
}
    `;
    document.head.appendChild(s);
  }
  function syncDom(){
    syncApps();
    addI18n();
    installFinalCalendarHeaderStyle();
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
        renderAll=function(){syncApps();const out=old.apply(this,arguments);setTimeout(syncDom,0);setTimeout(installFinalCalendarHeaderStyle,80);return out;};
      }
      if(typeof renderDesktop==='function'&&!window.__windzxyFinanceI18nRenderDesktopPatched){
        window.__windzxyFinanceI18nRenderDesktopPatched=1;
        const old=renderDesktop;
        renderDesktop=function(){syncApps();const out=old.apply(this,arguments);setTimeout(syncDom,0);setTimeout(installFinalCalendarHeaderStyle,80);return out;};
      }
    }catch(e){}
  }
  function boot(){
    addI18n();syncApps();patchRenderers();syncDom();
    setTimeout(installFinalCalendarHeaderStyle,0);
    setTimeout(installFinalCalendarHeaderStyle,250);
    setTimeout(installFinalCalendarHeaderStyle,1000);
    document.addEventListener('change',e=>{if(e.target&&e.target.matches('.lang-select'))setTimeout(syncDom,80);},true);
    const mo=new MutationObserver(()=>{clearTimeout(boot._t);boot._t=setTimeout(syncDom,40);});
    mo.observe(document.body,{childList:true,subtree:true,characterData:true});
    window.windzxyRegisterI18n=function(id,meta){REGISTRY[id]=meta;Object.keys(meta||{}).forEach(k=>{});syncDom();};
    window.windzxyFinalCalendarHeaderFixVersion=VER;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();