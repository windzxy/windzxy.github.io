# How To Chat Better

> 不是教你油嘴滑舌，而是幫你在對的場合，把話說得更合適。

How To Chat Better 是一個「情境式溝通資料庫 + 多風格回話引擎」。

## v0.1

目前首批涵蓋：

- 職場
- 學習
- 家庭
- 育兒
- 長輩
- 朋友

每個情境同時保留：

- 正式
- 自然
- 高情商
- 直接
- 腹黑
- 吐槽
- 粵語
- English

## 核心資料結構

後續每個情境至少保留：

```text
scenario
domain
relationship
goal
emotion
channel
region
dialect
tone
reply
follow_up
avoid
explanation
source
license
confidence
last_verified
```

## 資料原則

目前首頁條目均標記為 **Seed**，表示人工整理的首批高頻情境，不假裝成「大數據統計結論」。

後續收集公開語料、方言語料、公共領域書籍、研究資料及其他合法來源時，必須記錄 source、license、language / dialect、region、confidence 與 last_verified。

受版權保護的現代書籍以「提取溝通方法 + 改寫示例」為主，不大段重製原文。

## Roadmap

1. 擴展到 150 個高頻情境
2. 增加情境二級分類與關係標籤
3. 增加「第一句 → 第二次提醒 → 最後一次」升級階梯
4. 增加簡體 / 繁體 / 粵語 / 港式職場英文
5. 建立 sources/ 與 license ledger
6. 將情境資料進一步拆分為可維護資料集
7. 加入 AI Skill：先檢索情境庫，再按使用者輸入生成
8. 支援社群提交與審核
