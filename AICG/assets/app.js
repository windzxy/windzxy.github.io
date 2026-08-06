const state={
  works:[],featured:[],index:0,filter:"all",
  language:localStorage.getItem("astra-gallery-language")||"zh",
  favorites:new Set(JSON.parse(localStorage.getItem("astra-gallery-favorites")||"[]")),
  matureUnlocked:localStorage.getItem("astra-gallery-mature")==="1",
  activeLightbox:null,pendingAccess:null,timer:null
};

const fallbackWorks=[
  {id:"coast-after-tide",title:{zh:"潮汐之後",en:"After the Tide"},description:{zh:"在日落最後一束光消失前，海岸線像一段仍未完成的電影。",en:"Before the final light disappears, the coastline feels like an unfinished film."},category:"nature",categoryLabel:{zh:"電影感自然",en:"Cinematic Nature"},style:"cinematic",styleLabel:{zh:"電影感",en:"Cinematic"},rating:"all",warningTags:[],date:"2026-07-28",image:"../backgrounds/2026-07-28-01-web.webp",thumb:"../backgrounds/2026-07-28-01-web.webp",featured:true},
  {id:"aurora-valley",title:{zh:"極光谷地",en:"Aurora Valley"},description:{zh:"山脈沉入夜色，天空留下柔和而不真實的光。",en:"Mountains sink into night while the sky holds an unreal, gentle light."},category:"landscape",categoryLabel:{zh:"奇景風景",en:"Dream Landscape"},style:"illustration",styleLabel:{zh:"幻想插畫",en:"Fantasy Illustration"},rating:"all",warningTags:[],date:"2026-07-28",image:"../backgrounds/2026-07-28-02-web.webp",thumb:"../backgrounds/2026-07-28-02-web.webp",featured:true},
  {id:"moon-stream",title:{zh:"月下溪流",en:"Moonlit Stream"},description:{zh:"森林不是黑色，而是由月光切開的無數深藍層次。",en:"The forest is not black, but many layers of blue cut open by moonlight."},category:"dark",categoryLabel:{zh:"暗色氛圍",en:"Dark Atmosphere"},style:"cinematic",styleLabel:{zh:"暗黑電影感",en:"Dark Cinematic"},rating:"12+",warningTags:["dark-tone"],date:"2026-07-28",image:"../backgrounds/2026-07-28-03-web.webp",thumb:"../backgrounds/2026-07-28-03-web.webp",featured:true},
  {id:"neon-rain",title:{zh:"霓虹雨幕",en:"Neon Rain"},description:{zh:"雨水把城市的燈光重新混色，屋頂成為安靜的觀景台。",en:"Rain remixes the city lights, turning the rooftop into a silent observatory."},category:"city",categoryLabel:{zh:"城市夜景",en:"City Night"},style:"photoreal",styleLabel:{zh:"寫實攝影感",en:"Photoreal"},rating:"all",warningTags:[],date:"2026-07-28",image:"../backgrounds/2026-07-28-04-web.webp",thumb:"../backgrounds/2026-07-28-04-web.webp",featured:true},
  {id:"floating-garden",title:{zh:"浮島花園",en:"Floating Garden"},description:{zh:"失重的島嶼在雲層之上生長，像一座沒有入口的花園。",en:"Weightless islands grow above the clouds like a garden with no entrance."},category:"fantasy",categoryLabel:{zh:"幻想世界",en:"Fantasy World"},style:"anime",styleLabel:{zh:"動漫插畫",en:"Anime Illustration"},rating:"all",warningTags:[],date:"2026-07-28",image:"../backgrounds/2026-07-28-05-web.webp",thumb:"../backgrounds/2026-07-28-05-web.webp",featured:true}
];

const i18n={
  zh:{navFeatured:"焦點作品",navGallery:"作品集",backDesk:"返回 WebDesk",metaDate:"發佈",viewWork:"查看作品",favorite:"收藏",unfavorite:"取消收藏",scrollExplore:"向下探索",galleryTitle:"視覺作品集",galleryIntro:"動漫、真人感、風景與幻想等多方向原創作品。",emptyFavorites:"目前還沒有收藏作品。",all:"全部",favorites:"我的收藏",nature:"自然",landscape:"景觀",dark:"暗色",city:"城市",fantasy:"幻想",space:"太空",abstract:"抽象",architecture:"建築",minimal:"極簡",portrait:"人物",anime:"動漫",photoreal:"真人感",ratingAll:"全年齡",rating12:"輕度成熟題材",rating16:"成熟向內容",rating18:"僅限成人",safeMode:"青少年模式",matureMode:"成熟內容已開啟",maturePreview:"成熟向內容已隱藏",confirmView:"確認後查看",ageGateTitle:"觀看前確認",ageGateText:"本區可能包含成熟氛圍、性感暗示、驚悚或其他不適合兒童的視覺內容。請確認你已達所在地要求的年齡。",goBack:"返回",ageConfirm:"我已知悉，繼續查看",restricted:"內容已隱藏"},
  en:{navFeatured:"Featured",navGallery:"Gallery",backDesk:"Back to WebDesk",metaDate:"Published",viewWork:"View work",favorite:"Favorite",unfavorite:"Remove favorite",scrollExplore:"Scroll to explore",galleryTitle:"Visual Gallery",galleryIntro:"Original works across anime, photoreal, landscape and fantasy directions.",emptyFavorites:"No favorite works yet.",all:"All",favorites:"Favorites",nature:"Nature",landscape:"Landscape",dark:"Dark",city:"City",fantasy:"Fantasy",space:"Space",abstract:"Abstract",architecture:"Architecture",minimal:"Minimal",portrait:"Portrait",anime:"Anime",photoreal:"Photoreal",ratingAll:"All ages",rating12:"Mild mature themes",rating16:"Mature content",rating18:"Adults only",safeMode:"Youth mode",matureMode:"Mature content on",maturePreview:"Mature content is hidden",confirmView:"Confirm to view",ageGateTitle:"Before you continue",ageGateText:"This section may contain mature atmosphere, sensual implication, horror or other visuals unsuitable for children. Confirm that you meet the age requirement in your location.",goBack:"Go back",ageConfirm:"I understand, continue",restricted:"Content hidden"}
};

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const text=key=>i18n[state.language]?.[key]??key;
const localized=value=>typeof value==="string"?value:(value?.[state.language]||value?.zh||value?.en||"");
const matureRatings=new Set(["16+","18+"]);

function normalizeWork(work){
  const style=work.style||inferStyle(work.category);
  return {...work,style,rating:normalizeRating(work.rating),warningTags:Array.isArray(work.warningTags)?work.warningTags:[],styleLabel:work.styleLabel||styleLabel(style)};
}
function normalizeRating(value){return ["all","12+","16+","18+"].includes(String(value).toLowerCase())?String(value).toLowerCase():"all"}
function inferStyle(category){return ({city:"photoreal",nature:"cinematic",landscape:"cinematic",fantasy:"illustration",space:"sci-fi",architecture:"architectural",abstract:"abstract",dark:"cinematic",portrait:"photoreal"})[category]||"illustration"}
function styleLabel(style){
  const labels={anime:{zh:"動漫插畫",en:"Anime Illustration"},photoreal:{zh:"真人寫實",en:"Photoreal"},cinematic:{zh:"電影感",en:"Cinematic"},illustration:{zh:"藝術插畫",en:"Illustration"},"sci-fi":{zh:"未來科幻",en:"Sci-fi"},architectural:{zh:"建築視覺",en:"Architecture"},abstract:{zh:"抽象藝術",en:"Abstract"},fantasy:{zh:"幻想藝術",en:"Fantasy"}};
  return labels[style]||{zh:style,en:style};
}
function ratingLabel(work){return work.rating==="all"?"ALL":work.rating.toUpperCase()}
function ratingClass(work){return `rating-${work.rating.replace("+","plus")}`}
function isRestricted(work){return matureRatings.has(work.rating)&&!state.matureUnlocked}

async function loadWorks(){
  try{
    const response=await fetch("./data/gallery.json?v="+Date.now(),{cache:"no-store"});
    if(!response.ok)throw new Error("gallery unavailable");
    const payload=await response.json();
    state.works=(Array.isArray(payload)?payload:payload.works).map(normalizeWork);
  }catch(error){state.works=fallbackWorks.map(normalizeWork)}
  if(!Array.isArray(state.works)||!state.works.length)state.works=fallbackWorks.map(normalizeWork);
  state.featured=state.works.filter(work=>work.featured).slice(0,5);
  if(!state.featured.length)state.featured=state.works.slice(0,5);
  state.index=Math.max(0,Math.min(state.index,state.featured.length-1));
  renderAll();startAutoPlay();
}

function renderAll(){applyLanguage();renderProtection();renderRail();renderHero(false);renderFilters();renderGallery();updateFavoriteCount()}
function applyLanguage(){
  document.documentElement.lang=state.language==="zh"?"zh-Hant":"en";
  $$('[data-i18n]').forEach(node=>node.textContent=text(node.dataset.i18n));
  $("#languageLabel").textContent=state.language==="zh"?"中文":"EN";
}
function renderProtection(){
  $("#protectionToggle").classList.toggle("is-unlocked",state.matureUnlocked);
  $("#protectionLabel").textContent=text(state.matureUnlocked?"matureMode":"safeMode");
}
function renderRail(){
  $("#seriesRail").innerHTML=state.featured.map((work,index)=>`<button class="series-button ${index===state.index?"active":""}" type="button" data-index="${index}" aria-label="${escapeHtml(localized(work.title))}">${escapeHtml(localized(work.title))}<small>${ratingLabel(work)}</small></button>`).join("");
  $$(".series-button").forEach(button=>button.addEventListener("click",()=>selectHero(Number(button.dataset.index))));
}
function renderHero(animate=true){
  const work=state.featured[state.index];if(!work)return;
  const hero=$(".hero");if(animate)hero.classList.add("is-changing");
  const update=()=>{
    $("#heroImage").src=work.image;$("#heroImage").alt=localized(work.title);
    $("#heroIndex").textContent=String(state.index+1).padStart(2,"0");
    $("#heroCategory").textContent=localized(work.categoryLabel).toUpperCase();
    $("#heroTitle").textContent=localized(work.title);$("#heroDescription").textContent=localized(work.description);$("#heroDate").textContent=formatDate(work.date);
    $("#heroRating").textContent=ratingLabel(work);$("#heroRating").className=`rating-badge ${ratingClass(work)}`;
    $("#heroStyle").textContent=localized(work.styleLabel);
    $("#heroCounter").textContent=`${String(state.index+1).padStart(2,"0")} / ${String(state.featured.length).padStart(2,"0")}`;
    $("#heroProgress").style.width=`${((state.index+1)/state.featured.length)*100}%`;
    const favorite=state.favorites.has(work.id);
    $("#favoriteHero").classList.toggle("is-favorite",favorite);$("#favoriteHero .heart").textContent=favorite?"♥":"♡";$("#favoriteHero [data-i18n]").textContent=text(favorite?"unfavorite":"favorite");
    const restricted=isRestricted(work);hero.classList.toggle("is-restricted",restricted);$("#heroLock").hidden=!restricted;$("#heroLockRating").textContent=ratingLabel(work);$("#openHero").querySelector("[data-i18n]").textContent=text(restricted?"confirmView":"viewWork");
    renderRail();hero.classList.remove("is-changing");
  };
  animate?setTimeout(update,220):update();
}
function selectHero(index){if(!state.featured.length)return;state.index=(index+state.featured.length)%state.featured.length;renderHero(true);startAutoPlay()}
function renderFilters(){
  const categories=[...new Set(state.works.map(work=>work.category))];const filters=["all",...categories,"favorites"];
  $("#filterRow").innerHTML=filters.map(filter=>`<button class="filter-button ${state.filter===filter?"active":""}" type="button" data-filter="${escapeHtml(filter)}">${escapeHtml(text(filter))}</button>`).join("");
  $$(".filter-button").forEach(button=>button.addEventListener("click",()=>{state.filter=button.dataset.filter;renderFilters();renderGallery()}));
}
function renderGallery(){
  const works=state.works.filter(work=>state.filter==="all"||state.filter==="favorites"&&state.favorites.has(work.id)||work.category===state.filter);
  $("#emptyState").hidden=works.length>0;
  $("#galleryGrid").innerHTML=works.map(work=>{
    const restricted=isRestricted(work);const favorite=state.favorites.has(work.id);
    return `<article class="work-card ${restricted?"is-restricted":""}" data-id="${escapeHtml(work.id)}" tabindex="0" aria-label="${escapeHtml(localized(work.title))}">
      <img src="${escapeHtml(work.thumb||work.image)}" alt="${escapeHtml(localized(work.title))}" loading="lazy">
      <div class="card-badges"><span class="rating-badge ${ratingClass(work)}">${ratingLabel(work)}</span><span class="style-badge">${escapeHtml(localized(work.styleLabel))}</span></div>
      <button class="favorite-card ${favorite?"is-favorite":""}" type="button" data-favorite="${escapeHtml(work.id)}" aria-label="${escapeHtml(text(favorite?"unfavorite":"favorite"))}">${favorite?"♥":"♡"}</button>
      ${restricted?`<div class="restricted-cover"><b>${ratingLabel(work)}</b><span>${escapeHtml(text("restricted"))}</span></div>`:""}
      <div class="work-info"><div><span>${escapeHtml(localized(work.categoryLabel))}</span><h3>${escapeHtml(localized(work.title))}</h3></div></div>
    </article>`;
  }).join("");
  $$(".work-card").forEach(card=>{
    card.addEventListener("click",event=>{if(!event.target.closest("[data-favorite]"))openLightbox(card.dataset.id)});
    card.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();openLightbox(card.dataset.id)}});
  });
  $$('[data-favorite]').forEach(button=>button.addEventListener("click",event=>{event.stopPropagation();toggleFavorite(button.dataset.favorite)}));
}
function toggleFavorite(id){
  if(!id)return;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);
  localStorage.setItem("astra-gallery-favorites",JSON.stringify([...state.favorites]));updateFavoriteCount();renderGallery();renderHero(false);if(state.activeLightbox===id)updateLightboxFavorite();
}
function updateFavoriteCount(){$("#favoriteCount").textContent=state.favorites.size}
function openLightbox(id){
  const work=state.works.find(item=>item.id===id);if(!work)return;
  if(isRestricted(work)){openAgeGate(id,work.rating);return}
  state.activeLightbox=id;$("#lightboxImage").src=work.image;$("#lightboxImage").alt=localized(work.title);$("#lightboxCategory").textContent=localized(work.categoryLabel).toUpperCase();$("#lightboxTitle").textContent=localized(work.title);$("#lightboxDescription").textContent=localized(work.description);$("#lightboxDate").textContent=formatDate(work.date);$("#lightboxRating").textContent=ratingLabel(work);$("#lightboxRating").className=`rating-badge ${ratingClass(work)}`;$("#lightboxStyle").textContent=localized(work.styleLabel);updateLightboxFavorite();if(!$("#lightbox").open)$("#lightbox").showModal();
}
function updateLightboxFavorite(){
  const button=$("#lightboxFavorite"),favorite=state.favorites.has(state.activeLightbox);button.classList.toggle("is-favorite",favorite);button.querySelector(".heart").textContent=favorite?"♥":"♡";button.querySelector("[data-i18n]").textContent=text(favorite?"unfavorite":"favorite");
}
function closeLightbox(){$("#lightbox").close();state.activeLightbox=null}
function openAgeGate(id=null,rating="16+"){state.pendingAccess=id;$("#ageGateRating").textContent=rating==="all"?"16+":rating.toUpperCase();if(!$("#ageGate").open)$("#ageGate").showModal()}
function confirmMatureAccess(){
  const pending=state.pendingAccess;state.matureUnlocked=true;localStorage.setItem("astra-gallery-mature","1");state.pendingAccess=null;$("#ageGate").close();renderAll();if(pending)openLightbox(pending);
}
function lockMatureContent(){state.matureUnlocked=false;localStorage.removeItem("astra-gallery-mature");if(state.activeLightbox){const work=state.works.find(item=>item.id===state.activeLightbox);if(work&&matureRatings.has(work.rating))closeLightbox()}renderAll()}
function startAutoPlay(){clearInterval(state.timer);state.timer=setInterval(()=>selectHero(state.index+1),8000)}
function formatDate(value){if(!value)return"—";const date=new Date(`${value}T00:00:00`);return Number.isNaN(date.valueOf())?value:new Intl.DateTimeFormat(state.language==="zh"?"zh-Hant":"en",{year:"numeric",month:"2-digit",day:"2-digit"}).format(date)}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}

$("#heroPrev").addEventListener("click",()=>selectHero(state.index-1));
$("#heroNext").addEventListener("click",()=>selectHero(state.index+1));
$("#openHero").addEventListener("click",()=>openLightbox(state.featured[state.index]?.id));
$("#unlockHero").addEventListener("click",()=>openLightbox(state.featured[state.index]?.id));
$("#favoriteHero").addEventListener("click",()=>toggleFavorite(state.featured[state.index]?.id));
$("#lightboxFavorite").addEventListener("click",()=>toggleFavorite(state.activeLightbox));
$("#lightboxClose").addEventListener("click",closeLightbox);
$("#lightbox").addEventListener("click",event=>{if(event.target===$("#lightbox"))closeLightbox()});
$("#ageConfirm").addEventListener("click",confirmMatureAccess);
$("#ageGate").addEventListener("close",()=>{if(!state.matureUnlocked)state.pendingAccess=null});
$("#protectionToggle").addEventListener("click",()=>state.matureUnlocked?lockMatureContent():openAgeGate());
$("#languageSwitch").addEventListener("click",()=>{state.language=state.language==="zh"?"en":"zh";localStorage.setItem("astra-gallery-language",state.language);renderAll();if(state.activeLightbox)openLightbox(state.activeLightbox)});
$("#favoriteJump").addEventListener("click",()=>{state.filter="favorites";renderFilters();renderGallery();$("#gallery").scrollIntoView({behavior:"smooth"})});
document.addEventListener("keydown",event=>{if($("#lightbox").open||$("#ageGate").open)return;if(event.key==="ArrowLeft")selectHero(state.index-1);if(event.key==="ArrowRight")selectHero(state.index+1)});
document.addEventListener("visibilitychange",()=>document.hidden?clearInterval(state.timer):startAutoPlay());
$("#currentYear").textContent=new Date().getFullYear();
loadWorks();
