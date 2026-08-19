(function(){
  if(window.__windzxyMarketColorFixLoaded)return;
  window.__windzxyMarketColorFixLoaded=1;
  const VER='20260819-market-color1-red-up-green-down';

  function num(text){
    const v=parseFloat(String(text||'').replace(/[,%+\s]/g,''));
    return Number.isFinite(v)?v:null;
  }
  function setTrend(el,trend){
    if(!el)return;
    el.classList.toggle('market-up',trend==='up');
    el.classList.toggle('market-down',trend==='down');
    el.classList.toggle('market-flat',trend==='flat');
  }
  function scanOne(widget){
    const pct=num(widget.querySelector('[data-active-pct]')?.textContent);
    const chg=num(widget.querySelector('[data-active-change]')?.textContent);
    const v=Number.isFinite(pct)?pct:chg;
    const trend=v>0?'up':v<0?'down':'flat';
    setTrend(widget,trend);
    widget.classList.toggle('up',trend==='up');
    widget.classList.toggle('down',trend==='down');
    widget.classList.toggle('flat',trend==='flat');
    const active=widget.querySelector('.md-tabs button.on');
    setTrend(active,trend);
    widget.querySelectorAll('[data-active-price],[data-active-change],[data-active-pct]').forEach(el=>setTrend(el,trend));
  }
  function scan(){
    document.querySelectorAll('.metals-widget.mdesk').forEach(scanOne);
  }
  function install(){
    if(!document.getElementById('windzxyMarketColorFixStyle')){
      const s=document.createElement('style');
      s.id='windzxyMarketColorFixStyle';
      s.textContent=`
/* CN/HK market convention: red = up, green = down. */
.metals-widget.mdesk{--market-up:#ff4d5e;--market-down:#20d47a;--market-flat:var(--ink)}
.metals-widget.mdesk .md-tabs button small{color:var(--market-flat)!important}
.metals-widget.mdesk .md-tabs button.up small,
.metals-widget.mdesk .md-tabs button.market-up small,
.metals-widget.mdesk.market-up .md-tabs button.on small{color:var(--market-up)!important}
.metals-widget.mdesk .md-tabs button.down small,
.metals-widget.mdesk .md-tabs button.market-down small,
.metals-widget.mdesk.market-down .md-tabs button.on small{color:var(--market-down)!important}
.metals-widget.mdesk .md-change b,
.metals-widget.mdesk .md-price strong{color:var(--market-flat)!important}
.metals-widget.mdesk.up .md-change b,
.metals-widget.mdesk.market-up .md-change b,
.metals-widget.mdesk.up .md-price strong,
.metals-widget.mdesk.market-up .md-price strong,
.metals-widget.mdesk [data-active-price].market-up,
.metals-widget.mdesk [data-active-change].market-up,
.metals-widget.mdesk [data-active-pct].market-up{color:var(--market-up)!important}
.metals-widget.mdesk.down .md-change b,
.metals-widget.mdesk.market-down .md-change b,
.metals-widget.mdesk.down .md-price strong,
.metals-widget.mdesk.market-down .md-price strong,
.metals-widget.mdesk [data-active-price].market-down,
.metals-widget.mdesk [data-active-change].market-down,
.metals-widget.mdesk [data-active-pct].market-down{color:var(--market-down)!important}
.metals-widget.mdesk .md-range div{background:linear-gradient(90deg,rgba(32,212,122,.28),rgba(255,211,106,.32),rgba(255,77,94,.30))!important}
      `;
      document.head.appendChild(s);
    }
    scan();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  setInterval(scan,350);
  window.addEventListener('focus',scan,{passive:true});
  document.addEventListener('click',e=>{if(e.target.closest('.metals-widget'))setTimeout(scan,40);},true);
  window.windzxyMarketColorFixVersion=VER;
})();