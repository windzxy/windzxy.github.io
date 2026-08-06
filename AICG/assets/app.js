const state = {
  works: [],
  featured: [],
  index: 0,
  filter: "all",
  language: localStorage.getItem("wind-aicg-language") || "zh",
  favorites: new Set(JSON.parse(localStorage.getItem("wind-aicg-favorites") || "[]")),
  activeLightbox: null,
  timer: null
};

const fallbackWorks = [
  {id:"coast-after-tide",title:{zh:"潮汐之後",en:"After the Tide"},description:{zh:"在日落最後一束光消失前，海岸線像一段仍未完成的電影。",en:"Before the final light disappears, the coastline feels like an unfinished film."},category:"nature",categoryLabel:{zh:"電影感自然",en:"Cinematic Nature"},direction:{zh:"低角度廣角、暖冷對比、大片留白",en:"Low-angle wide frame, warm-cool contrast, generous negative space"},date:"2026-07-28",image:"../backgrounds/2026-07-28-01-web.webp",thumb:"../backgrounds/2026-07-28-01-web.webp",score:94,featured:true,status:"curated"},
  {id:"aurora-valley",title:{zh:"極光谷地",en:"Aurora Valley"},description:{zh:"山脈沉入夜色，天空留下柔和而不真實的光。",en:"Mountains sink into night while the sky holds an unreal, gentle light."},category:"landscape",categoryLabel:{zh:"奇景風景",en:"Dream Landscape"},direction:{zh:"遠景分層、冷色夜空、中央引導線",en:"Layered distance, cool night sky, central leading line"},date:"2026-07-28",image:"../backgrounds/2026-07-28-02-web.webp",thumb:"../backgrounds/2026-07-28-02-web.webp",score:92,featured:true,status:"curated"},
  {id:"moon-stream",title:{zh:"月下溪流",en:"Moonlit Stream"},description:{zh:"森林不是黑色，而是由月光切開的無數深藍層次。",en:"The forest is not black, but many layers of blue cut open by moonlight."},category:"dark",categoryLabel:{zh:"暗色氛圍",en:"Dark Atmosphere"},direction:{zh:"垂直樹群、低照度、銀藍反射",en:"Vertical tree rhythm, low-key light, silver-blue reflections"},date:"2026-07-28",image:"../backgrounds/2026-07-28-03-web.webp",thumb:"../backgrounds/2026-07-28-03-web.webp",score:91,featured:true,status:"curated"},
  {id:"neon-rain",title:{zh:"霓虹雨幕",en:"Neon Rain"},description:{zh:"雨水把城市的燈光重新混色，屋頂成為安靜的觀景台。",en:"Rain remixes the city lights, turning the rooftop into a silent observatory."},category:"city",categoryLabel:{zh:"城市夜景",en:"City Night"},direction:{zh:"深景深、濕地反光、非對稱構圖",en:"Deep perspective, wet reflections, asymmetrical composition"},date:"2026-07-28",image:"../backgrounds/2026-07-28-04-web.webp",thumb:"../backgrounds/2026-07-28-04-web.webp",score:93,featured:true,status:"curated"},
  {id:"floating-garden",title:{zh:"浮島花園",en:"Floating Garden"},description:{zh:"失重的島嶼在雲層之上生長，像一座沒有入口的花園。",en:"Weightless islands grow above the clouds like a garden with no entrance."},category:"fantasy",categoryLabel:{zh:"幻想世界",en:"Fantasy World"},direction:{zh:"多層空間、柔霧、視線向上",en:"Layered space, soft mist, upward visual movement"},date:"2026-07-28",image:"../backgrounds/2026-07-28-05-web.webp",thumb:"../backgrounds/2026-07-28-05-web.webp",score:95,featured:true,status:"curated"}
];

const i18n = {
  zh:{
    navFeatured:"焦點作品",navGallery:"作品集",navProcess:"生成流程",navNotebook:"提示詞筆記",navAbout:"關於",backDesk:"返回 WebDesk",
    metaDate:"發佈",metaDirection:"視覺方向",metaStatus:"策展狀態",curated:"已審核",viewWork:"查看作品",favorite:"收藏",unfavorite:"取消收藏",scrollExplore:"向下探索",
    galleryTitle:"作品不是堆疊，而是策展",galleryIntro:"每張作品都保留視覺方向、生成批次與審核狀態。網站只展示通過技術、安全與美學評估的版本。",
    emptyFavorites:"目前還沒有收藏作品。",processTitle:"把 AICG 當成完整的視覺製作流程",processIntro:"不是「輸入一句話、輸出一張圖」。真正穩定的品質來自藝術方向、變體比較、機器審核與人工策展標準。",
    step1Title:"藝術方向",step1Text:"先定義情緒、鏡頭、色彩、光線、主體與負面限制，避免隨機抽卡式生成。",
    step2Title:"批次生成",step2Text:"同一方向生成多個候選，控制題材重複率，並維持每批視覺差異。",
    step3Title:"雙重審核",step3Text:"先做尺寸、解碼與安全檢查，再由視覺模型評估構圖、細節、原創性風險與桌布適用性。",
    step4Title:"策展發佈",step4Text:"只發布達標作品，輸出 WebP、縮略圖、描述與完整批次紀錄，交由 GitHub Pages 靜態展示。",
    pipelineName:"自動策展管線",pipelineSchedule:"每週二、週五定時執行 · GitHub Actions",publishedWorks:"已發佈作品",reviewGates:"審核關卡",staticSite:"靜態網站",
    notebookTitle:"公開思考方法，不公開複製公式",notebookIntro:"筆記展示的是可遷移的視覺決策框架：如何描述鏡頭、節奏、材質與光線，而不是模仿特定畫師或現有作品。",
    aboutTitle:"AI 是製作能力，審美才是作者性",aboutText:"Wind AICG Visual Lab 是一個只依賴 GitHub Pages 的原創視覺檔案館。生成在後台定時完成，前台不暴露任何 API 金鑰；每一批作品都要經過品質、安全與原創風險檢查。",
    principle1:"不複製受保護 IP",principle2:"不模仿特定在世藝術家",principle3:"保留生成與審核紀錄",principle4:"優先作品品質而非數量",
    reviewScore:"審核評分",all:"全部",favorites:"我的收藏",nature:"自然",landscape:"景觀",dark:"暗色",city:"城市",fantasy:"幻想",space:"太空",abstract:"抽象",architecture:"建築",minimal:"極簡",
    note1Title:"先寫鏡頭，再寫題材",note1Text:"把焦距、機位、景深和畫面比例放在題材之前，模型更容易理解你要的是一張「作品」，而不是物件清單。",
    note2Title:"用光線建立時間",note2Text:"不要只寫「漂亮光線」。指定光源方向、色溫、空氣散射與陰影密度，時間感才會成立。",
    note3Title:"負面限制要可觀察",note3Text:"避免抽象地要求「不要難看」。改成排除過度銳化、塑膠質感、重複物件、錯誤文字與不合理肢體。",
    note4Title:"每批必須換視覺骨架",note4Text:"題材不同不代表構圖不同。定期輪換近景、遠景、俯視、對稱、留白與多層景深。",
    note5Title:"評分不是只看細節",note5Text:"審核要同時檢查第一眼吸引力、視線路徑、縮略圖識別度、桌面圖示可讀性與原創風險。",
    note6Title:"保留失敗樣本的原因",note6Text:"不必發布失敗圖，但應記錄被淘汰原因。長期累積後，這些資料比單一提示詞更有價值。"
  },
  en:{
    navFeatured:"Featured",navGallery:"Gallery",navProcess:"Process",navNotebook:"Notebook",navAbout:"About",backDesk:"Back to WebDesk",
    metaDate:"Published",metaDirection:"Direction",metaStatus:"Curation",curated:"Reviewed",viewWork:"View work",favorite:"Favorite",unfavorite:"Remove favorite",scrollExplore:"Scroll to explore",
    galleryTitle:"A collection should be curated, not accumulated",galleryIntro:"Every work keeps its art direction, generation batch and review status. Only technically valid, safe and aesthetically approved images are published.",
    emptyFavorites:"No favorite works yet.",processTitle:"Treat AICG as a complete visual-production pipeline",processIntro:"It is not one sentence in and one image out. Stable quality comes from direction, variant comparison, machine review and editorial standards.",
    step1Title:"Art direction",step1Text:"Define mood, lens, color, light, subject and observable exclusions before generation.",
    step2Title:"Batch generation",step2Text:"Generate multiple candidates per direction while controlling repetition across subjects, framing and palettes.",
    step3Title:"Dual review",step3Text:"Validate decoding, dimensions and safety, then score composition, detail, originality risk and wallpaper usability.",
    step4Title:"Curated publishing",step4Text:"Publish only passing works with WebP assets, thumbnails, descriptions and a complete run record on GitHub Pages.",
    pipelineName:"Automated curation pipeline",pipelineSchedule:"Runs every Tuesday and Friday · GitHub Actions",publishedWorks:"Published works",reviewGates:"Review gates",staticSite:"Static site",
    notebookTitle:"Share the thinking, not a copying formula",notebookIntro:"The notebook shows transferable decisions about lenses, rhythm, material and light—never imitation of a named artist or existing work.",
    aboutTitle:"AI is production capacity; taste is authorship",aboutText:"Wind AICG Visual Lab is an original visual archive hosted entirely on GitHub Pages. Generation runs in scheduled back-office jobs, API keys never reach the browser, and every batch is checked for quality, safety and originality risk.",
    principle1:"No protected IP copying",principle2:"No imitation of living artists",principle3:"Keep generation and review records",principle4:"Quality before volume",
    reviewScore:"Review score",all:"All",favorites:"Favorites",nature:"Nature",landscape:"Landscape",dark:"Dark",city:"City",fantasy:"Fantasy",space:"Space",abstract:"Abstract",architecture:"Architecture",minimal:"Minimal",
    note1Title:"Describe the lens before the subject",note1Text:"Put focal length, camera position, depth of field and aspect ratio before the subject so the model sees a composition, not an object list.",
    note2Title:"Use light to establish time",note2Text:"Replace 'beautiful lighting' with direction, color temperature, atmospheric scatter and shadow density.",
    note3Title:"Make exclusions observable",note3Text:"Do not ask for 'not ugly'. Exclude oversharpening, plastic texture, duplicated objects, malformed text and impossible anatomy.",
    note4Title:"Change the visual skeleton",note4Text:"Different subjects can still repeat the same framing. Rotate close-up, wide, aerial, symmetry, negative space and layered depth.",
    note5Title:"Review more than detail",note5Text:"Score first-glance impact, eye path, thumbnail recognition, desktop-icon readability and originality risk together.",
    note6Title:"Record why candidates fail",note6Text:"Rejected images need not be published, but rejection reasons become more valuable than any single prompt over time."
  }
};

const notes = [
  ["01","note1Title","note1Text",["Lens","Framing","Depth"]],
  ["02","note2Title","note2Text",["Light","Time","Atmosphere"]],
  ["03","note3Title","note3Text",["Negative prompt","Artifacts","Quality"]],
  ["04","note4Title","note4Text",["Diversity","Composition","Batch"]],
  ["05","note5Title","note5Text",["Review","Thumbnail","Usability"]],
  ["06","note6Title","note6Text",["Dataset","Iteration","Learning"]]
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const text = key => i18n[state.language]?.[key] ?? key;
const localized = value => typeof value === "string" ? value : (value?.[state.language] || value?.zh || value?.en || "");

async function loadWorks(){
  try{
    const response = await fetch("./data/gallery.json?v="+Date.now(), {cache:"no-store"});
    if(!response.ok) throw new Error("gallery unavailable");
    const payload = await response.json();
    state.works = Array.isArray(payload) ? payload : payload.works;
  }catch(error){
    state.works = fallbackWorks;
  }
  if(!Array.isArray(state.works) || !state.works.length) state.works = fallbackWorks;
  state.featured = state.works.filter(work => work.featured).slice(0,5);
  if(!state.featured.length) state.featured = state.works.slice(0,5);
  renderAll();
  startAutoPlay();
}

function renderAll(){
  applyLanguage();
  renderRail();
  renderHero(false);
  renderFilters();
  renderGallery();
  renderNotebook();
  updateFavoriteCount();
  $("#publishedMetric").textContent = state.works.length;
}

function applyLanguage(){
  document.documentElement.lang = state.language === "zh" ? "zh-Hant" : "en";
  $$('[data-i18n]').forEach(node => node.textContent = text(node.dataset.i18n));
  $("#languageLabel").textContent = state.language === "zh" ? "中文" : "EN";
}

function renderRail(){
  $("#seriesRail").innerHTML = state.featured.map((work,index)=>`
    <button class="series-button ${index===state.index?"active":""}" type="button" data-index="${index}" aria-label="${escapeHtml(localized(work.title))}">
      ${escapeHtml(localized(work.title))}
    </button>`).join("");
  $$(".series-button").forEach(button => button.addEventListener("click",()=>selectHero(Number(button.dataset.index))));
}

function renderHero(animate=true){
  const work = state.featured[state.index];
  if(!work) return;
  const hero = $(".hero");
  if(animate) hero.classList.add("is-changing");
  const update = ()=>{
    $("#heroImage").src = work.image;
    $("#heroImage").alt = localized(work.title);
    $("#heroIndex").textContent = String(state.index+1).padStart(2,"0");
    $("#heroCategory").textContent = localized(work.categoryLabel).toUpperCase();
    $("#heroTitle").textContent = localized(work.title);
    $("#heroDescription").textContent = localized(work.description);
    $("#heroDate").textContent = formatDate(work.date);
    $("#heroDirection").textContent = localized(work.direction);
    $("#heroCounter").textContent = `${String(state.index+1).padStart(2,"0")} / ${String(state.featured.length).padStart(2,"0")}`;
    $("#heroProgress").style.width = `${((state.index+1)/state.featured.length)*100}%`;
    $("#favoriteHero").classList.toggle("is-favorite",state.favorites.has(work.id));
    $("#favoriteHero").querySelector(".heart").textContent = state.favorites.has(work.id) ? "♥" : "♡";
    renderRail();
    hero.classList.remove("is-changing");
  };
  animate ? setTimeout(update,220) : update();
}

function selectHero(index){
  state.index = (index + state.featured.length) % state.featured.length;
  renderHero(true);
  restartAutoPlay();
}

function renderFilters(){
  const categories = [...new Set(state.works.map(work=>work.category))];
  const filters = ["all",...categories,"favorites"];
  $("#filterRow").innerHTML = filters.map(filter=>`
    <button class="filter-button ${state.filter===filter?"active":""}" type="button" data-filter="${filter}">
      ${escapeHtml(text(filter))}
    </button>`).join("");
  $$(".filter-button").forEach(button=>button.addEventListener("click",()=>{
    state.filter=button.dataset.filter;
    renderFilters();
    renderGallery();
  }));
}

function renderGallery(){
  const works = state.works.filter(work=>{
    if(state.filter==="all") return true;
    if(state.filter==="favorites") return state.favorites.has(work.id);
    return work.category===state.filter;
  });
  $("#emptyState").hidden = works.length>0;
  $("#galleryGrid").innerHTML = works.map(work=>`
    <article class="work-card" data-id="${escapeHtml(work.id)}" tabindex="0" aria-label="${escapeHtml(localized(work.title))}">
      <img src="${escapeHtml(work.thumb||work.image)}" alt="${escapeHtml(localized(work.title))}" loading="lazy">
      <button class="favorite-card ${state.favorites.has(work.id)?"is-favorite":""}" type="button" data-favorite="${escapeHtml(work.id)}" aria-label="${escapeHtml(text(state.favorites.has(work.id)?"unfavorite":"favorite"))}">
        ${state.favorites.has(work.id)?"♥":"♡"}
      </button>
      <div class="work-info">
        <div><span>${escapeHtml(localized(work.categoryLabel))}</span><h3>${escapeHtml(localized(work.title))}</h3></div>
        <div class="work-score"><small>REVIEW</small><b>${Number(work.score||0)}</b></div>
      </div>
    </article>`).join("");
  $$(".work-card").forEach(card=>{
    card.addEventListener("click",event=>{
      if(event.target.closest("[data-favorite]")) return;
      openLightbox(card.dataset.id);
    });
    card.addEventListener("keydown",event=>{
      if(event.key==="Enter"||event.key===" "){event.preventDefault();openLightbox(card.dataset.id)}
    });
  });
  $$('[data-favorite]').forEach(button=>button.addEventListener("click",event=>{
    event.stopPropagation();
    toggleFavorite(button.dataset.favorite);
  }));
}

function renderNotebook(){
  $("#notebookGrid").innerHTML = notes.map(note=>`
    <article class="note-card">
      <span>NOTE / ${note[0]}</span>
      <h3>${escapeHtml(text(note[1]))}</h3>
      <p>${escapeHtml(text(note[2]))}</p>
      <div class="note-tags">${note[3].map(tag=>`<b>${escapeHtml(tag)}</b>`).join("")}</div>
    </article>`).join("");
}

function toggleFavorite(id){
  if(!id)return;
  state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
  localStorage.setItem("wind-aicg-favorites",JSON.stringify([...state.favorites]));
  updateFavoriteCount();
  renderGallery();
  renderHero(false);
  if(state.activeLightbox===id) updateLightboxFavorite();
}

function updateFavoriteCount(){
  $("#favoriteCount").textContent=state.favorites.size;
}

function openLightbox(id){
  const work=state.works.find(item=>item.id===id);
  if(!work)return;
  state.activeLightbox=id;
  $("#lightboxImage").src=work.image;
  $("#lightboxImage").alt=localized(work.title);
  $("#lightboxCategory").textContent=localized(work.categoryLabel).toUpperCase();
  $("#lightboxTitle").textContent=localized(work.title);
  $("#lightboxDescription").textContent=localized(work.description);
  $("#lightboxDirection").textContent=localized(work.direction);
  $("#lightboxDate").textContent=formatDate(work.date);
  $("#lightboxScore").textContent=`${Number(work.score||0)} / 100`;
  updateLightboxFavorite();
  if(!$("#lightbox").open) $("#lightbox").showModal();
}

function updateLightboxFavorite(){
  const button=$("#lightboxFavorite");
  const favorite=state.favorites.has(state.activeLightbox);
  button.classList.toggle("is-favorite",favorite);
  button.querySelector(".heart").textContent=favorite?"♥":"♡";
  button.querySelector("[data-i18n]").textContent=text(favorite?"unfavorite":"favorite");
}

function closeLightbox(){
  $("#lightbox").close();
  state.activeLightbox=null;
}

function startAutoPlay(){
  clearInterval(state.timer);
  state.timer=setInterval(()=>selectHero(state.index+1),8000);
}
function restartAutoPlay(){startAutoPlay()}

function formatDate(value){
  if(!value)return"—";
  const date=new Date(`${value}T00:00:00`);
  return Number.isNaN(date.valueOf())?value:new Intl.DateTimeFormat(state.language==="zh"?"zh-Hant":"en",{year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
}
function escapeHtml(value){
  return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

$("#heroPrev").addEventListener("click",()=>selectHero(state.index-1));
$("#heroNext").addEventListener("click",()=>selectHero(state.index+1));
$("#openHero").addEventListener("click",()=>openLightbox(state.featured[state.index]?.id));
$("#favoriteHero").addEventListener("click",()=>toggleFavorite(state.featured[state.index]?.id));
$("#lightboxFavorite").addEventListener("click",()=>toggleFavorite(state.activeLightbox));
$("#lightboxClose").addEventListener("click",closeLightbox);
$("#lightbox").addEventListener("click",event=>{if(event.target===$("#lightbox"))closeLightbox()});
$("#languageSwitch").addEventListener("click",()=>{
  state.language=state.language==="zh"?"en":"zh";
  localStorage.setItem("wind-aicg-language",state.language);
  renderAll();
  if(state.activeLightbox)openLightbox(state.activeLightbox);
});
$("#favoriteJump").addEventListener("click",()=>{
  state.filter="favorites";
  renderFilters();
  renderGallery();
  $("#gallery").scrollIntoView({behavior:"smooth"});
});
document.addEventListener("keydown",event=>{
  if($("#lightbox").open)return;
  if(event.key==="ArrowLeft")selectHero(state.index-1);
  if(event.key==="ArrowRight")selectHero(state.index+1);
});
document.addEventListener("visibilitychange",()=>document.hidden?clearInterval(state.timer):startAutoPlay());
$("#currentYear").textContent=new Date().getFullYear();
loadWorks();
