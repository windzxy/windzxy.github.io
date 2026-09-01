(()=>{
  'use strict';
  const VERSION='20260901-maydayland-production-polish-v124.1';
  function syncMobileNav(){
    const active=document.querySelector('.nav [data-page].active,.nav [data-page][aria-current="page"]');
    if(active&&window.matchMedia('(max-width:760px)').matches){
      active.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
    }
  }
  function apply(){
    const shell=document.querySelector('.shell');
    if(!shell||shell.dataset.productionPolish===VERSION)return !!shell;
    shell.dataset.productionPolish=VERSION;
    document.documentElement.dataset.maydaylandRelease='v124';
    document.documentElement.dataset.maydaylandProduct='v124-stable';
    document.title='Maydayland · 五月天巡演與作品資料館';
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content='Maydayland：五月天巡演城市、專輯、歌曲、出版與歷程檔案的互動資料館。';
    if(window.MAYDAYLAND_BUILD){
      window.MAYDAYLAND_BUILD.version='v124';
      window.MAYDAYLAND_BUILD.release='stable-recovery-core';
    }
    const brandSmall=document.querySelector('.brand small');
    if(brandSmall)brandSmall.textContent='Tour · Music · Time Archive';
    const perf=document.querySelector('.perf span');
    if(perf)perf.textContent='巡演 · 唱片 · 城市 · 時間';
    const kicker=document.querySelector('.hero .kicker');
    if(kicker)kicker.textContent='MAYDAYLAND · TOUR & MUSIC ARCHIVE';
    const heroTitle=document.querySelector('.hero-copy h1');
    if(heroTitle)heroTitle.textContent='城市在路上，音樂在時間裡。';
    const heroText=document.querySelector('.hero-copy p');
    if(heroText)heroText.textContent='從巡演城市、專輯與歌曲出發，把五月天的作品、場館與時間線整理成可探索的音樂地圖。';
    const score=[
      ['巡演路線','5 條'],
      ['錄音室專輯','9 張'],
      ['城市節點','9 城'],
      ['歷程跨度','1997—2026']
    ];
    document.querySelectorAll('.score>div').forEach((card,i)=>{
      const row=score[i]; if(!row)return;
      const s=card.querySelector('small'),b=card.querySelector('b');
      if(s)s.textContent=row[0]; if(b)b.textContent=row[1];
    });
    document.querySelectorAll('.city-panel .kv div').forEach(card=>{
      const s=card.querySelector('small'),b=card.querySelector('b');
      if(s?.textContent.trim()==='核心'&&b?.textContent.trim()==='Stable'){
        s.textContent='資料狀態'; b.textContent='已整理';
      }
    });
    const footer=document.querySelector('.footer .wrap');
    if(footer)footer.textContent='Maydayland · 五月天巡演與作品資料館';
    setTimeout(syncMobileNav,0);
    return true;
  }
  const style=document.createElement('style');
  style.id='maydaylandProductionPolishV124';
  style.textContent=`
    .shell[data-production-polish] .hero{align-items:stretch;gap:18px}
    .shell[data-production-polish] .hero-copy{padding:30px 32px}
    .shell[data-production-polish] .hero-copy h1{font-size:clamp(44px,5.4vw,76px);max-width:780px}
    .shell[data-production-polish] .hero-copy p{max-width:720px;font-size:14px;line-height:1.75}
    .shell[data-production-polish] .score{align-content:stretch}
    .shell[data-production-polish] .score>div{min-height:96px;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.025));border-color:rgba(255,255,255,.085)}
    .shell[data-production-polish] .score small{letter-spacing:.05em;text-transform:none}
    .shell[data-production-polish] .perf span{color:#a8d9ca}
    @media(max-width:760px){
      .shell[data-production-polish] .top{padding-top:env(safe-area-inset-top)}
      .shell[data-production-polish] .top-in{align-items:center;gap:10px;overflow:hidden}
      .shell[data-production-polish] .brand{flex:0 0 auto}
      .shell[data-production-polish] .perf{display:none}
      .shell[data-production-polish] .nav{display:flex;flex:1 1 auto;min-width:0;gap:6px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:4px 2px}
      .shell[data-production-polish] .nav::-webkit-scrollbar{display:none}
      .shell[data-production-polish] .nav [data-page]{flex:0 0 auto;scroll-snap-align:center;white-space:nowrap}
      .shell[data-production-polish] .hero-copy{padding:24px 20px}
      .shell[data-production-polish] .hero-copy h1{font-size:clamp(40px,12vw,58px)}
      .shell[data-production-polish] .score{grid-template-columns:1fr 1fr}
      .shell[data-production-polish] .score>div{min-height:78px}
    }
    @media(prefers-reduced-motion:reduce){.shell[data-production-polish] *{scroll-behavior:auto!important}}
  `;
  document.head.appendChild(style);
  addEventListener('hashchange',()=>setTimeout(syncMobileNav,0));
  addEventListener('resize',()=>setTimeout(syncMobileNav,60),{passive:true});
  document.addEventListener('click',e=>{if(e.target.closest('.nav [data-page]'))setTimeout(syncMobileNav,80)},true);
  if(!apply()){
    let tries=0;
    const timer=setInterval(()=>{tries++; if(apply()||tries>=24)clearInterval(timer)},80);
  }
})();
