(() => {
  i18n.zh.rating16="成熟時裝與曖昧氛圍";
  i18n.zh.rating18="較強非露骨成人內容";
  i18n.zh.ageGateText="本區可能包含低胸或裸背時裝、內衣造型、浴缸場景、成熟曖昧、驚悚或暴力氛圍。所有作品仍遵守圖片生成安全規則，不含露骨裸露或明確性行為。請確認你已達所在地要求的年齡。";

  i18n.en.rating16="Mature fashion & sensual themes";
  i18n.en.rating18="Stronger non-explicit adult content";
  i18n.en.ageGateText="This section may include low-cut or backless fashion, lingerie styling, bath scenes, mature sensuality, horror, or violent atmosphere. All works still follow image-generation safety rules and contain no explicit nudity or sexual acts. Confirm that you meet the age requirement in your location.";

  i18n.ja = {
    navFeatured:"注目作品",navGallery:"ギャラリー",backDesk:"WebDeskへ戻る",metaDate:"公開日",viewWork:"作品を見る",favorite:"お気に入り",unfavorite:"お気に入り解除",scrollExplore:"下へスクロール",galleryTitle:"ビジュアルギャラリー",emptyFavorites:"お気に入りの作品はまだありません。",all:"すべて",favorites:"お気に入り",nature:"自然",landscape:"風景",dark:"ダーク",city:"都市",fantasy:"幻想",space:"宇宙",abstract:"抽象",architecture:"建築",minimal:"ミニマル",portrait:"人物",anime:"アニメ",photoreal:"写実",ratingAll:"全年齢",rating12:"軽度の成熟表現",rating16:"成熟したファッションと官能的な雰囲気",rating18:"より強い非露骨の成人向け内容",safeMode:"青少年モード",matureMode:"成熟コンテンツ表示中",maturePreview:"成熟コンテンツは非表示です",confirmView:"確認して見る",ageGateTitle:"閲覧前の確認",ageGateText:"この区域には胸元や背中の開いた衣装、ランジェリー、浴槽の場面、成熟した官能表現、ホラーや暴力的な雰囲気が含まれる場合があります。すべての作品は画像生成の安全基準に従い、露骨な裸体や明確な性行為は含みません。お住まいの地域の年齢条件を満たしていることを確認してください。",goBack:"戻る",ageConfirm:"理解して続ける",restricted:"コンテンツ非表示"
  };

  const oldSwitch = document.querySelector("#languageSwitch");
  if (oldSwitch) {
    const next = document.createElement("div");
    next.id = "languageSwitch";
    next.className = "language-switch";
    next.setAttribute("role", "group");
    next.setAttribute("aria-label", "Language");
    next.innerHTML = '<button type="button" data-lang="zh" aria-label="中文">中</button><i>/</i><button type="button" data-lang="en" aria-label="English">EN</button><i>/</i><button type="button" data-lang="ja" aria-label="日本語">日</button>';
    oldSwitch.replaceWith(next);
  }

  applyLanguage = function(){
    const langMap={zh:"zh-Hant",en:"en",ja:"ja"};
    document.documentElement.lang=langMap[state.language]||"zh-Hant";
    document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=text(node.dataset.i18n));
    document.querySelectorAll('#languageSwitch [data-lang]').forEach(button=>{
      const active=button.dataset.lang===state.language;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',active?'true':'false');
    });
  };

  formatDate = function(value){
    if(!value)return"—";
    const date=new Date(`${value}T00:00:00`);
    if(Number.isNaN(date.valueOf()))return value;
    const locales={zh:"zh-Hant",en:"en",ja:"ja-JP"};
    return new Intl.DateTimeFormat(locales[state.language]||"zh-Hant",{year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
  };

  document.querySelectorAll('#languageSwitch [data-lang]').forEach(button=>button.addEventListener('click',event=>{
    event.stopPropagation();
    state.language=button.dataset.lang;
    localStorage.setItem("astra-gallery-language",state.language);
    renderAll();
    if(state.activeLightbox)openLightbox(state.activeLightbox);
  }));

  if(!["zh","en","ja"].includes(state.language))state.language="zh";
  renderAll();
})();
