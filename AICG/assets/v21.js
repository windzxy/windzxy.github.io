(() => {
  i18n.ja = {
    navFeatured:"注目作品",navGallery:"ギャラリー",backDesk:"WebDeskへ戻る",metaDate:"公開日",viewWork:"作品を見る",favorite:"お気に入り",unfavorite:"お気に入り解除",scrollExplore:"下へスクロール",galleryTitle:"ビジュアルギャラリー",emptyFavorites:"お気に入りの作品はまだありません。",all:"すべて",favorites:"お気に入り",nature:"自然",landscape:"風景",dark:"ダーク",city:"都市",fantasy:"幻想",space:"宇宙",abstract:"抽象",architecture:"建築",minimal:"ミニマル",portrait:"人物",anime:"アニメ",photoreal:"写実",ratingAll:"全年齢",rating12:"軽度の成熟表現",rating16:"成熟した内容",rating18:"成人限定",safeMode:"青少年モード",matureMode:"成熟コンテンツ表示中",maturePreview:"成熟コンテンツは非表示です",confirmView:"確認して見る",ageGateTitle:"閲覧前の確認",ageGateText:"この区域には成熟した雰囲気、性的な示唆、ホラーなど、子どもに適さない表現が含まれる場合があります。お住まいの地域の年齢条件を満たしていることを確認してください。",goBack:"戻る",ageConfirm:"理解して続ける",restricted:"コンテンツ非表示"
  };

  const oldSwitch = document.querySelector("#languageSwitch");
  if (oldSwitch) {
    const next = oldSwitch.cloneNode(false);
    next.id = "languageSwitch";
    next.className = "language-switch";
    next.setAttribute("role", "group");
    next.setAttribute("aria-label", "Language");
    next.innerHTML = '<button type="button" data-lang="zh">中</button><i>/</i><button type="button" data-lang="en">EN</button><i>/</i><button type="button" data-lang="ja">日</button>';
    oldSwitch.replaceWith(next);
  }

  applyLanguage = function(){
    const langMap={zh:"zh-Hant",en:"en",ja:"ja"};
    document.documentElement.lang=langMap[state.language]||"zh-Hant";
    document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=text(node.dataset.i18n));
    document.querySelectorAll('#languageSwitch [data-lang]').forEach(button=>button.classList.toggle('is-active',button.dataset.lang===state.language));
  };

  formatDate = function(value){
    if(!value)return"—";
    const date=new Date(`${value}T00:00:00`);
    if(Number.isNaN(date.valueOf()))return value;
    const locales={zh:"zh-Hant",en:"en",ja:"ja-JP"};
    return new Intl.DateTimeFormat(locales[state.language]||"zh-Hant",{year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
  };

  document.querySelectorAll('#languageSwitch [data-lang]').forEach(button=>button.addEventListener('click',()=>{
    state.language=button.dataset.lang;
    localStorage.setItem("astra-gallery-language",state.language);
    renderAll();
    if(state.activeLightbox)openLightbox(state.activeLightbox);
  }));

  if(!["zh","en","ja"].includes(state.language))state.language="zh";
  renderAll();
})();
