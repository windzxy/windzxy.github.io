(() => {
  'use strict';

  const API = 'https://music-api.gdstudio.xyz/api.php';
  const BAND_FALLBACK = 'https://www.mayday.jp/wp-content/uploads/ffb31aec0c0adb49e80f9fc7e18b284f-500x399.jpg';
  const finePointer = matchMedia('(pointer:fine)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;

  function installBubuCursor(){
    if(!finePointer) return;
    const cursor = document.createElement('div');
    cursor.className = 'bubu-cursor is-hidden';
    cursor.setAttribute('aria-hidden','true');
    cursor.innerHTML = '<i class="bubu-cursor__leaf"></i><i class="bubu-cursor__body"></i><i class="bubu-cursor__mouth"></i>';
    document.body.appendChild(cursor);
    let x=-100,y=-100,tx=-100,ty=-100;
    const draw=()=>{
      x += (tx-x)*.24; y += (ty-y)*.24;
      cursor.style.transform=`translate3d(${x-14}px,${y-8}px,0) rotate(-7deg)`;
      requestAnimationFrame(draw);
    };
    addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;cursor.classList.remove('is-hidden')},{passive:true});
    addEventListener('mouseleave',()=>cursor.classList.add('is-hidden'));
    addEventListener('mousedown',()=>cursor.classList.add('is-pressed'));
    addEventListener('mouseup',()=>cursor.classList.remove('is-pressed'));
    document.addEventListener('mouseover',e=>cursor.classList.toggle('is-active',Boolean(e.target.closest('button,a,[data-play-world],[data-play-album],input'))));
    draw();
  }

  function installParallax(){
    if(!finePointer || reducedMotion) return;
    const boot=document.getElementById('boot');
    const band=boot?.querySelector('.boot__band');
    const mojos=[...(boot?.querySelectorAll('.mojo')||[])];
    const hero=document.querySelector('.hero__feature');
    const heroPhoto=hero?.querySelector('.hero__photo');
    addEventListener('mousemove',e=>{
      const nx=e.clientX/innerWidth-.5, ny=e.clientY/innerHeight-.5;
      if(band) band.style.translate=`${nx*10}px ${ny*8}px`;
      mojos.forEach((m,i)=>m.style.margin=`${ny*(i%2?8:-9)}px 0 0 ${nx*(i%2?13:-12)}px`);
      if(heroPhoto) heroPhoto.style.transform=`scale(1.035) translate(${nx*-8}px,${ny*-5}px)`;
    },{passive:true});
  }

  function applyDeviceMode(){
    const set=()=>{
      const mobile=innerWidth<=720;
      document.documentElement.dataset.device=mobile?'mobile':innerWidth<=980?'tablet':'desktop';
      document.documentElement.classList.toggle('is-touch',!finePointer);
    };
    set();addEventListener('resize',set,{passive:true});
  }

  async function searchCover(query){
    const sources=['netease','kuwo'];
    for(const source of sources){
      try{
        const url=`${API}?types=search&source=${source}&name=${encodeURIComponent(query)}&count=10&pages=1&v=cover4`;
        const response=await fetch(url);
        if(!response.ok) continue;
        const rows=await response.json();
        if(!Array.isArray(rows)) continue;
        const item=rows.find(row=>/五月天|Mayday/i.test(`${row.artist||''} ${row.album||''}`) && (row.pic_id||row.picId));
        if(item){
          const pic=item.pic_id||item.picId;
          return `${API}?types=pic&id=${encodeURIComponent(pic)}&source=${encodeURIComponent(item.source||source)}&size=700`;
        }
      }catch(e){console.warn('cover lookup failed',query,e)}
    }
    return '';
  }

  function secureImage(img){
    if(img.dataset.secured) return;
    img.dataset.secured='1';
    img.loading='lazy';
    img.decoding='async';
    img.addEventListener('error',()=>{
      if(img.src!==BAND_FALLBACK){img.src=BAND_FALLBACK;img.classList.add('is-fallback')}
    },{once:true});
  }

  async function hydrateCardCovers(){
    const targets=[...document.querySelectorAll('.album-card,.rail-card,.world-card')];
    for(const card of targets){
      const img=card.querySelector('img');
      if(!img || img.dataset.hydrated) continue;
      secureImage(img);img.dataset.hydrated='1';
      const title=(card.querySelector('h3')?.textContent||'').trim();
      if(!title) continue;
      const isAlbum=card.classList.contains('album-card');
      const query=isAlbum?`五月天 ${title} 專輯`:`五月天 ${title} Live`;
      const cover=await searchCover(query);
      if(cover){img.src=cover;img.classList.remove('is-fallback')}
    }
  }

  function watchRenderedCards(){
    let timer;
    const schedule=()=>{clearTimeout(timer);timer=setTimeout(hydrateCardCovers,180)};
    const observer=new MutationObserver(schedule);
    ['featuredGrid','concertRail','albumGrid'].forEach(id=>{
      const node=document.getElementById(id);if(node)observer.observe(node,{childList:true,subtree:true});
    });
    schedule();setTimeout(schedule,1400);setTimeout(schedule,4000);
  }

  function improveMobileRails(){
    if(innerWidth>720) return;
    const rails=document.querySelectorAll('.world-grid,.card-rail,.album-grid');
    rails.forEach(rail=>{
      rail.addEventListener('scroll',()=>{
        const cards=[...rail.children];
        const center=rail.scrollLeft+rail.clientWidth/2;
        cards.forEach(card=>{
          const cardCenter=card.offsetLeft+card.offsetWidth/2;
          card.classList.toggle('is-centered',Math.abs(cardCenter-center)<card.offsetWidth*.42);
        });
      },{passive:true});
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    applyDeviceMode();
    installBubuCursor();
    installParallax();
    watchRenderedCards();
    improveMobileRails();
    document.querySelectorAll('img').forEach(secureImage);
  });
})();
