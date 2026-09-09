(()=>{
  'use strict';
  const APP_ID='spend-wheel';
  const VERSION='20260909-decision-wheel-v1.1';
  const DEFAULT_VALUES=[5,10,20,30,50,80,100];

  function safeNumber(value,fallback){
    const n=Number(value);
    return Number.isFinite(n)&&n>=0?n:fallback;
  }
  function normalizeValues(value){
    const source=Array.isArray(value)?value:String(value||'').split(/[，,\s]+/);
    const out=[];
    source.forEach(item=>{
      const n=Number(String(item).replace(/[^0-9.\-]/g,''));
      if(Number.isFinite(n)&&n>=0&&!out.includes(n))out.push(n);
    });
    return (out.length>=2?out:DEFAULT_VALUES).slice(0,16);
  }
  function getCardFromNode(node){
    const el=node&&node.closest?node.closest('.desktop-card[data-card-id]'):null;
    if(!el||typeof activeWorkspace!=='function')return null;
    return activeWorkspace().cards.find(card=>card.id===el.dataset.cardId)||null;
  }
  function ensureData(card){
    card.data=card.data||{};
    card.data.wheelValues=normalizeValues(card.data.wheelValues);
    card.data.wheelBudget=safeNumber(card.data.wheelBudget,100);
    card.data.wheelRotation=safeNumber(card.data.wheelRotation,0);
    return card.data;
  }
  function money(value){
    const n=Number(value);
    return '¥'+(Number.isInteger(n)?n:n.toFixed(1));
  }
  function wheelLabels(values){
    const step=360/values.length;
    return values.map((value,index)=>{
      const angle=index*step+step/2;
      return '<span class="spend-wheel-label" style="--wheel-label-angle:'+angle+'deg">'+money(value)+'</span>';
    }).join('');
  }
  function wheelHtml(card){
    const data=ensureData(card);
    const values=data.wheelValues;
    const segments=values.map((_,i)=>i%2===0?'rgba(170,218,105,.98) '+(i*360/values.length)+'deg '+((i+1)*360/values.length)+'deg':'rgba(209,238,164,.98) '+(i*360/values.length)+'deg '+((i+1)*360/values.length)+'deg').join(',');
    const result=data.wheelLast==null?'今天可以花多少？':'今天可以花 '+money(data.wheelLast);
    const date=data.wheelDate||'';
    return '<div class="spend-wheel-widget" data-wheel-version="'+VERSION+'">'
      +'<div class="spend-wheel-question">今天可以花多少？</div>'
      +'<div class="spend-wheel-stage">'
      +'<span class="spend-wheel-pointer" aria-hidden="true">▼</span>'
      +'<div class="spend-wheel-disk" data-wheel-disk style="--wheel-segments:'+segments+';--wheel-rotation:'+data.wheelRotation+'deg">'
      +wheelLabels(values)
      +'<div class="spend-wheel-hub"><span>今日</span><strong data-wheel-hub-result>'+(data.wheelLast==null?'?':money(data.wheelLast))+'</strong></div>'
      +'</div></div>'
      +'<div class="spend-wheel-result"><strong data-wheel-result>'+result+'</strong><small data-wheel-date>'+(date?'上次：'+date:'點擊轉盤，交給運氣決定')+'</small></div>'
      +'<button class="spend-wheel-spin" type="button" data-wheel-spin>🎯 開始旋轉</button>'
      +'<details class="spend-wheel-settings"><summary>設定轉盤</summary>'
      +'<label>金額（逗號分隔）<input type="text" data-wheel-values value="'+values.join(', ')+'"></label>'
      +'<label>每日預算<input type="number" min="0" step="1" data-wheel-budget value="'+data.wheelBudget+'"></label>'
      +'<div class="spend-wheel-budget">預算 <b>'+money(data.wheelBudget)+'</b> · 本次結果 <b>'+(data.wheelLast==null?'—':money(data.wheelLast))+'</b></div>'
      +'</details></div>';
  }

  function installStyles(){
    if(document.getElementById('spend-wheel-v1-style'))return;
    const style=document.createElement('style');
    style.id='spend-wheel-v1-style';
    style.textContent=`
      .desktop-card.t-spend-wheel{--wheel-accent:#9bd05f;min-width:320px;min-height:400px}
      .spend-wheel-widget{height:100%;display:flex;flex-direction:column;align-items:center;gap:10px;padding:6px 10px 12px;box-sizing:border-box;overflow:auto}
      .spend-wheel-question{font-size:18px;font-weight:800;letter-spacing:.02em;text-align:center}
      .spend-wheel-stage{position:relative;width:min(280px,78vw);aspect-ratio:1;display:grid;place-items:center;flex:0 0 auto}
      .spend-wheel-pointer{position:absolute;z-index:4;top:-8px;left:50%;transform:translateX(-50%);font-size:24px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.32))}
      .spend-wheel-disk{position:relative;width:100%;height:100%;border-radius:50%;background:conic-gradient(var(--wheel-segments));border:7px solid rgba(255,255,255,.84);box-shadow:0 12px 34px rgba(0,0,0,.22),inset 0 0 0 1px rgba(0,0,0,.07);transform:rotate(var(--wheel-rotation));transition:transform 3.2s cubic-bezier(.12,.7,.08,1);will-change:transform}
      .spend-wheel-disk::after{content:'';position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.72) 0 1deg,transparent 1deg calc(360deg / 32));opacity:.45;pointer-events:none}
      .spend-wheel-label{--wheel-radius:39%;position:absolute;z-index:2;left:50%;top:50%;font-size:11px;font-weight:800;color:#294110;transform:translate(-50%,-50%) rotate(var(--wheel-label-angle)) translateY(calc(-1 * var(--wheel-radius))) rotate(calc(-1 * var(--wheel-label-angle)));transform-origin:center;white-space:nowrap;text-shadow:0 1px rgba(255,255,255,.55)}
      .spend-wheel-hub{position:absolute;z-index:3;left:50%;top:50%;transform:translate(-50%,-50%);width:31%;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;align-content:center;background:rgba(255,255,255,.94);box-shadow:0 4px 14px rgba(0,0,0,.16);color:#1f2d18}
      .spend-wheel-hub span{font-size:10px;opacity:.62}.spend-wheel-hub strong{font-size:20px;line-height:1.1}
      .spend-wheel-result{text-align:center;display:grid;gap:2px}.spend-wheel-result strong{font-size:18px}.spend-wheel-result small{opacity:.65}
      .spend-wheel-spin{width:min(280px,100%);min-height:42px;border:0;border-radius:13px;font-weight:800;font-size:15px;background:linear-gradient(135deg,#b9e781,#86c84c);color:#18300d;box-shadow:0 8px 18px rgba(95,150,45,.2);cursor:pointer}
      .spend-wheel-spin:disabled{opacity:.6;cursor:wait}.spend-wheel-spin:active{transform:translateY(1px)}
      .spend-wheel-settings{width:min(320px,100%);font-size:12px}.spend-wheel-settings summary{cursor:pointer;text-align:center;opacity:.72;padding:4px}.spend-wheel-settings label{display:grid;grid-template-columns:1fr;gap:4px;margin:7px 0}.spend-wheel-settings input{width:100%;box-sizing:border-box;border-radius:9px;border:1px solid rgba(127,127,127,.25);padding:8px 10px;background:rgba(255,255,255,.12);color:inherit}.spend-wheel-budget{text-align:center;opacity:.74;padding:4px}
      @media(max-width:520px){.spend-wheel-stage{width:min(250px,76vw)}.spend-wheel-label{font-size:10px}.desktop-card.t-spend-wheel{min-width:290px}}
      @media(prefers-reduced-motion:reduce){.spend-wheel-disk{transition-duration:.01ms}}
    `;
    document.head.appendChild(style);
  }

  function installApp(){
    if(!Array.isArray(window.apps)&&typeof apps==='undefined')return false;
    const list=typeof apps!=='undefined'?apps:window.apps;
    if(!list.some(app=>app.id===APP_ID)){
      list.push({id:APP_ID,kind:'widget',title:'今日花費轉盤',desc:'轉一下，決定今天可以花多少錢。',icon:'🎡',tone:'t-spend-wheel',category:'生活'});
    }
    return true;
  }

  function installBodyRenderer(){
    if(typeof bodyHtml!=='function'||bodyHtml.__spendWheelV1)return;
    const previous=bodyHtml;
    const wrapped=function(card,info){
      if(card&&card.appId===APP_ID)return wheelHtml(card);
      return previous(card,info);
    };
    wrapped.__spendWheelV1=true;
    bodyHtml=wrapped;
  }

  function installAddCard(){
    if(typeof addCard!=='function'||addCard.__spendWheelV1)return;
    const previous=addCard;
    const wrapped=function(appId){
      if(appId!==APP_ID)return previous(appId);
      const ws=activeWorkspace();
      const i=ws.cards.length;
      ws.cards.push({id:'card-'+Date.now()+'-'+Math.random().toString(16).slice(2),appId:APP_ID,x:72+(i%5)*38,y:78+(i%7)*32,w:380,h:470,collapsed:false,data:{wheelValues:DEFAULT_VALUES.slice(),wheelBudget:100,wheelRotation:0}});
      save();
      renderAll();
    };
    wrapped.__spendWheelV1=true;
    addCard=wrapped;
  }

  function spin(button){
    const card=getCardFromNode(button);
    if(!card||button.disabled)return;
    const data=ensureData(card),values=data.wheelValues;
    const disk=button.closest('.spend-wheel-widget')?.querySelector('[data-wheel-disk]');
    if(!disk)return;
    const index=Math.floor(Math.random()*values.length);
    const step=360/values.length;
    const current=safeNumber(data.wheelRotation,0);
    const turns=5+Math.floor(Math.random()*3);
    const currentMod=((current%360)+360)%360;
    const targetMod=(360-(index*step+step/2))%360;
    const delta=((targetMod-currentMod)+360)%360;
    const target=current+turns*360+delta;
    data.wheelRotation=target;
    button.disabled=true;
    button.textContent='旋轉中…';
    disk.style.setProperty('--wheel-rotation',target+'deg');
    const finish=()=>{
      const chosen=values[index];
      const now=new Date();
      data.wheelLast=chosen;
      data.wheelDate=now.toLocaleDateString(undefined,{month:'numeric',day:'numeric'});
      try{save();}catch(_){ }
      const root=button.closest('.spend-wheel-widget');
      const result=root?.querySelector('[data-wheel-result]');
      const hub=root?.querySelector('[data-wheel-hub-result]');
      const date=root?.querySelector('[data-wheel-date]');
      if(result)result.textContent='今天可以花 '+money(chosen);
      if(hub)hub.textContent=money(chosen);
      if(date)date.textContent='上次：'+data.wheelDate;
      button.disabled=false;
      button.textContent='🎯 再轉一次';
    };
    const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(finish,reduced?80:3250);
  }

  function bindDelegation(){
    if(document.documentElement.dataset.spendWheelBound==='1')return;
    document.documentElement.dataset.spendWheelBound='1';
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-wheel-spin]');
      if(button){event.preventDefault();event.stopPropagation();spin(button);}
    });
    document.addEventListener('change',event=>{
      const valuesInput=event.target.closest?.('[data-wheel-values]');
      const budgetInput=event.target.closest?.('[data-wheel-budget]');
      if(!valuesInput&&!budgetInput)return;
      const card=getCardFromNode(event.target);
      if(!card)return;
      const data=ensureData(card);
      if(valuesInput)data.wheelValues=normalizeValues(valuesInput.value);
      if(budgetInput)data.wheelBudget=safeNumber(budgetInput.value,100);
      try{save();renderDesktop();}catch(_){ }
    });
  }

  function boot(){
    installStyles();
    if(!installApp())return;
    installBodyRenderer();
    installAddCard();
    bindDelegation();
    try{if(typeof renderShelf==='function')renderShelf();}catch(_){ }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
