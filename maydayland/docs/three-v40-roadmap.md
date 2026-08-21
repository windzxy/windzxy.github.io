# Maydayland v40 Three Tour Atlas

本輪不是複製外部文章代碼，而是把純原生 Three.js 地理可視化的工程方法轉成 Maydayland 的巡演視覺路線。

## 已落地

- 純靜態交付：`index.html` + `app-v40.css` + `app-v40.js` + `data/three-tour-v40.json`
- Three.js r128 CDN 直引，無 npm、無框架、無構建
- IIFE 封裝，資料與渲染分離
- 內部 Z-up 地圖空間，外層 root group 旋轉到 Three.js Y-up 世界
- 城市熱度光柱：visits 越高，光柱越高
- TubeGeometry 巡演飛線：避免 WebGL Line `lineWidth` 不生效問題
- CanvasTexture 光暈：避免先引入過多後期依賴
- CSS2DRenderer 城市標籤：HTML 標籤不阻擋 WebGL 鼠標操作
- 三套主題：teal / gold / red
- 降級策略：Three.js 或 WebGL 載入失敗時保留資料面板，不白屏

## v41

接入真實 GeoJSON，將城市/區域輪廓轉 `THREE.Shape`，用 `ExtrudeGeometry` 做 3D 拉伸地圖。此階段需要先決定地理範圍：

- 方案 A：中國大陸 + 港澳台 + 新加坡/日本節點的概念地圖
- 方案 B：東亞巡演節點抽象地圖
- 方案 C：台灣主場優先，再擴展海外節點

## v42

處理全局 UV：先掃描所有 polygon 坐標得到全局 bounds，再重寫頂面 UV，避免每個地圖塊各自 0-1 貼圖導致碎裂。

## v43

接入 UnrealBloomPass、Shader 流光、rebuild/dispose 性能面板。Bloom 必須有開關，移動端默認低強度。

## 風險控制

- 不使用未授權地圖貼圖或官方照片。
- 逐站歌單仍保持 `needs-verification`，不冒充官方完整曲序。
- 後續所有素材先進 `assets/original` 或帶授權標記再展示。
