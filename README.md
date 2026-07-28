# Windzxy BeeX Lab

這是 `windzxy.github.io` 的純靜態 GitHub Pages 版本，已移除第三方建站平台輸出的頁面結構、外部 CDN 字體/圖示/腳本依賴。

## 結構

- `index.html`：首頁與工具入口
- `styles/main.css`：站點共用 BeeX 風格樣式
- `scripts/theme.js`：淺色/深色模式切換
- `Html_tools/`：可直接在瀏覽器使用的日常工具
- `about/`、`archives/`、`tags/`：保留舊站內容的靜態頁

## 部署

GitHub Pages 可直接從 `master` 分支根目錄發布，或在 Settings → Pages 選擇 GitHub Actions，使用本 repo 的官方 Pages workflow。
