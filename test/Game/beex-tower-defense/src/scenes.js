(() => {
  const fallback = {
    ancient: [
      "assets/scenes/ancient-01.webp",
      "assets/scenes/ancient-02.webp",
      "assets/scenes/ancient-03.webp",
      "assets/scenes/ancient-04.webp"
    ],
    glacier: [
      "assets/scenes/glacier-01.webp",
      "assets/scenes/glacier-02.webp",
      "assets/scenes/glacier-03.webp",
      "assets/scenes/glacier-04.webp"
    ],
    volcano: [
      "assets/scenes/volcano-01.webp",
      "assets/scenes/volcano-02.webp",
      "assets/scenes/volcano-03.webp",
      "assets/scenes/volcano-04.webp"
    ]
  };

  window.BeexSceneFiles = window.BeexSceneFiles || { ancient: [], glacier: [], volcano: [] };
  Object.entries(fallback).forEach(([theme, files]) => {
    if (!Array.isArray(window.BeexSceneFiles[theme]) || window.BeexSceneFiles[theme].length === 0) {
      window.BeexSceneFiles[theme] = files;
    }
  });
})();
