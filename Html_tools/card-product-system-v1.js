(()=>{
  "use strict";
  const VERSION="20260913-card-product-system-v1.2-live-summary";
  const meta={
    typhoon:{tier:"P0",type:"live",group:"即時資訊",label:"Live",hint:"全球氣象 · 雷達 / 衛星 / 風場"},
    weather:{tier:"P0",type:"live",group:"即時資訊",label:"Live",hint:"即時天氣 · 預報"},
    image:{tier:"P1",type:"tool",group:"生產力",label:"Studio",hint:"圖片工作台"},
    text:{tier:"P1",type:"tool",group:"生產力",label:"Tool",hint:"文字快速整理"},
    table:{tier:"P1",type:"tool",group:"生產力",label:"Tool",hint:"表格 / CSV 快速整理"},
    json:{tier:"P1",type:"tool",group:"生產力",label:"Dev",hint:"JSON 格式化與驗證"},
    date:{tier:"P2",type:"utility",group:"實用工具",label:"Utility",hint:"日期與工作日計算"},
    calendar:{tier:"P2",type:"utility",group:"實用工具",label:"Utility",hint:"日曆 / 農曆 / 節假日"},
    calc:{tier:"P2",type:"utility",group:"實用工具",label:"Utility",hint:"快速計算"},
    color:{tier:"P2",type:"utility",group:"實用工具",label:"Utility",hint:"色彩選取"},
    link:{tier:"P2",type:"utility",group:"實用工具",label:"Utility",hint:"常用網址"},
    memo:{tier:"P2",type:"utility",group:"實用工具",label:"Utility",hint:"常用片段"},
    note:{tier:"P2",type:"widget",group:"桌面小組件",label:"Widget",hint:"快速記錄"},
    todo:{tier:"P2",type:"widget",group:"桌面小組件",label:"Widget",hint:"今日待辦"},
    clock:{tier:"P2",type:"widget",group:"桌面小組件",label:"Widget",hint:"日期與時間"},
    metals:{tier:"P2",type:"live",group:"即時資訊",label:"Live",hint:"貴金屬行情"},
    "fx-rates":{tier:"P2",type:"live",group:"即時資訊",label:"Live",hint:"外匯牌價"},
    "class-schedule":{tier:"P2",type:"widget",group:"桌面小組件",label:"Widget",hint:"今日課程"}
  };
  const order=["即時資訊","生產力","實用工具","桌面小組件"];
  let activeGroup="全部";
  function css(){
    if(document.getElementById("cardProductSystemStyle"))return;
    const s=document.createElement("style");s.id="cardProductSystemStyle";
    s.textContent=`
      .product-filter-row{display:flex;gap:7px;overflow:auto;padding:2px 0 10px;margin:-2px 0 4px;scrollbar-width:none}.product-filter-row::-webkit-scrollbar{display:none}
      .product-filter{flex:0 0 auto;border:1px solid var(--line);background:var(--panel2);color:var(--muted);border-radius:999px;padding:7px 11px;font:inherit;font-size:11px;font-weight:750;cursor:pointer}
      .product-filter.is-active{background:var(--ink);color:var(--panel);border-color:transparent}
      .dock-tool-list{display:flex!important;flex-direction:column;gap:8px!important}
      .product-group-title{display:flex;align-items:center;justify-content:space-between;margin:14px 4px 4px;padding-top:10px;border-top:1px solid var(--line);font-size:12px;font-weight:750;color:var(--muted);letter-spacing:.04em}
      .product-group-title:first-child{margin-top:0;border-top:0;padding-top:0}.product-group-title small{font-size:11px;opacity:.72}
      .dock-tool[data-card-type]{position:relative;min-height:58px;padding-right:72px!important}.dock-tool .product-card-meta{display:flex;align-items:center;gap:6px;margin-top:2px;font-size:10px;color:var(--muted)}
      .product-card-badge{display:inline-flex;align-items:center;height:18px;padding:0 6px;border:1px solid var(--line);border-radius:999px;background:var(--panel2);font-size:9px;font-weight:800;letter-spacing:.03em}
      .dock-tool[data-card-tier="P0"]{min-height:68px;background:linear-gradient(135deg,color-mix(in srgb,var(--blue1) 13%,var(--panel)),color-mix(in srgb,var(--panel) 92%,transparent));border-color:color-mix(in srgb,var(--blue1) 22%,var(--line));box-shadow:0 10px 26px rgba(16,18,23,.07)}
      .dock-tool[data-card-tier="P0"] .app-icon{transform:scale(1.05)}
      .dock-tool[data-card-tier="P0"] .product-card-badge{background:color-mix(in srgb,var(--blue1) 13%,var(--panel));color:color-mix(in srgb,var(--blue1) 72%,var(--ink))}
      .dock-tool[data-card-type="live"] .product-card-badge{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--blue1) 22%,transparent)}
      .desktop-card[data-card-product-type]::before{content:attr(data-card-product-label);position:absolute;right:74px;top:13px;z-index:3;height:18px;line-height:18px;padding:0 7px;border-radius:999px;background:var(--panel2);border:1px solid var(--line);color:var(--muted);font-size:9px;font-weight:800;pointer-events:none}
      .desktop-card[data-card-product-tier="P0"]{box-shadow:0 20px 50px rgba(16,18,23,.14),inset 0 0 0 1px color-mix(in srgb,var(--blue1) 12%,transparent)}
      .desktop-card[data-card-product-type="live"]::before{background:color-mix(in srgb,var(--blue1) 12%,var(--panel));color:color-mix(in srgb,var(--blue1) 70%,var(--ink))}
      .product-live-summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;margin:0 0 10px;padding:9px 11px;border:1px solid color-mix(in srgb,var(--blue1) 16%,var(--line));border-radius:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--blue1) 8%,var(--panel)),color-mix(in srgb,var(--panel2) 88%,transparent));font-size:11px;color:var(--muted)}
      .product-live-summary strong{display:block;color:var(--ink);font-size:12px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.product-live-summary span{white-space:nowrap}.product-live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;background:var(--blue1);box-shadow:0 0 0 4px color-mix(in srgb,var(--blue1) 12%,transparent)}
      @media(max-width:700px){.desktop-card[data-card-product-type]::before{display:none}.product-group-title{position:sticky;top:0;z-index:2;background:color-mix(in srgb,var(--panel) 92%,transparent);backdrop-filter:blur(16px)}.product-live-summary{grid-template-columns:1fr}.product-live-summary span{white-space:normal}}
    `;
    document.head.appendChild(s);
  }
  function ensureFilters(){
    const shelf=document.getElementById("toolShelf");if(!shelf)return;
    const panel=shelf.closest(".drawer-panel");if(!panel)return;
    let row=panel.querySelector(".product-filter-row");
    if(!row){
      row=document.createElement("div");row.className="product-filter-row";row.setAttribute("aria-label","功能分類");
      ["全部",...order].forEach(group=>{const b=document.createElement("button");b.type="button";b.className="product-filter";b.dataset.group=group;b.textContent=group;b.addEventListener("click",()=>{activeGroup=group;row.querySelectorAll(".product-filter").forEach(x=>x.classList.toggle("is-active",x.dataset.group===group));decorateShelf()});row.appendChild(b)});
      const search=panel.querySelector(".drawer-search");search?.insertAdjacentElement("afterend",row);
    }
    row.querySelectorAll(".product-filter").forEach(x=>x.classList.toggle("is-active",x.dataset.group===activeGroup));
  }
  function decorateShelf(){
    const shelf=document.getElementById("toolShelf");if(!shelf)return;
    let buttons=[...shelf.querySelectorAll(".dock-tool[data-id]")];if(!buttons.length)return;
    const q=(document.getElementById("deskSearch")?.value||"").trim();
    buttons.forEach(btn=>{const m=meta[btn.dataset.id]||{tier:"P3",type:"utility",group:"實用工具",label:"Utility",hint:""};btn.dataset.cardType=m.type;btn.dataset.cardTier=m.tier;btn.dataset.cardGroup=m.group;const text=btn.querySelector("span:nth-child(2)");if(text&&!btn.querySelector(".product-card-meta")){const row=document.createElement("span");row.className="product-card-meta";row.innerHTML=`<b class="product-card-badge">${m.label}</b><span>${m.hint}</span>`;text.appendChild(row)}});
    if(activeGroup!=="全部"&&!q)buttons=buttons.filter(btn=>(meta[btn.dataset.id]?.group||"實用工具")===activeGroup);
    const buckets=new Map(order.map(x=>[x,[]]));
    buttons.forEach(btn=>(buckets.get(meta[btn.dataset.id]?.group||"實用工具")||buckets.get("實用工具")).push(btn));
    const frag=document.createDocumentFragment();order.forEach(group=>{const list=buckets.get(group);if(!list?.length)return;const head=document.createElement("div");head.className="product-group-title";head.innerHTML=`<span>${group}</span><small>${list.length}</small>`;frag.appendChild(head);list.sort((a,b)=>{const ta=meta[a.dataset.id]?.tier||"P9",tb=meta[b.dataset.id]?.tier||"P9";return ta.localeCompare(tb)});list.forEach(x=>frag.appendChild(x))});shelf.replaceChildren(frag);shelf.dataset.productSystem=q?"search":activeGroup==="全部"?"grouped":"filtered";
  }
  function resolveApp(el){
    const inline=el.querySelector("[data-inline-app]")?.dataset.inlineApp;if(inline)return inline;
    if(el.querySelector("[data-weather-refresh]"))return "weather";
    const cardId=el.dataset.cardId;try{const all=JSON.parse(localStorage.getItem("windzxy-web-desktop-workspaces")||"[]");for(const ws of all){const c=(ws.cards||[]).find(x=>x.id===cardId);if(c)return c.appId}}catch(e){}
    return null;
  }
  function compactText(v,max=42){const s=String(v||"").replace(/\s+/g," ").trim();return s.length>max?s.slice(0,max-1)+"…":s}
  function liveSummary(el,app){
    if(app!=="weather"&&app!=="typhoon")return;
    const body=el.querySelector(".card-body");if(!body)return;
    let box=body.querySelector(":scope > .product-live-summary");if(!box){box=document.createElement("div");box.className="product-live-summary";body.prepend(box)}
    const now=new Date();const stamp=now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    if(app==="weather"){
      const temp=compactText(el.querySelector(".weather-current strong,.weather-current [data-temp],.weather-current")?.textContent,24);
      const place=compactText(el.querySelector(".weather-place,.weather-current h4,.weather-search input")?.textContent||el.querySelector(".weather-search input")?.value,22);
      const state=compactText(el.querySelector(".weather-status,.weather-current span,.weather-current small")?.textContent,28);
      const headline=[place,temp].filter(Boolean).join(" · ")||"即時天氣";
      box.innerHTML=`<strong><i class="product-live-dot"></i>${headline}</strong><span>${state||"預報已連線"} · ${stamp}</span>`;
    }else{
      const source=el.querySelector("[data-typhoon-status],.typhoon-status,.typhoon-summary,.global-weather-summary,.typhoon-layer-status");
      const txt=compactText(source?.textContent,52);
      box.innerHTML=`<strong><i class="product-live-dot"></i>全球氣象即時圖層</strong><span>${txt||"風場 / 雷達 / 衛星"} · ${stamp}</span>`;
    }
  }
  function decorateCards(){document.querySelectorAll(".desktop-card[data-card-id]").forEach(el=>{const app=resolveApp(el);const m=meta[app];if(m){el.dataset.cardProductType=m.type;el.dataset.cardProductLabel=m.label;el.dataset.cardProductTier=m.tier}liveSummary(el,app)})}
  function apply(){css();ensureFilters();decorateShelf();decorateCards();document.documentElement.dataset.cardProductSystem=VERSION}
  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  const obs=new MutationObserver(schedule);
  function start(){apply();const shelf=document.getElementById("toolShelf"),desk=document.getElementById("desktopCanvas");if(shelf)obs.observe(shelf,{childList:true});if(desk)obs.observe(desk,{childList:true,subtree:true});document.getElementById("deskSearch")?.addEventListener("input",schedule)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();