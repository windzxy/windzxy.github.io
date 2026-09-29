;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function get(id){return S.find(x=>x.id===id)}
function reset(s){if(s)s.replies={zh:{},en:{},yue:{}}}
function add(s,key,hant,hans,en,yue){s.replies.zh[key]={hant,hans};s.replies.en[key]=en;s.replies.yue[key]=yue}
function mark(s){if(s)window.CHAT_REVIEWED_SCENES[s.id]=true}

let s=get("w05");
if(s){
 reset(s);
 [
 ["r01","我剛看了一下，XX 這裡的數字好像和前一頁對不上，你再幫我確認一下？","我刚看了一下，XX 这里的数字好像和前一页对不上，你再帮我确认一下？","I noticed the figure at XX doesn't seem to match the previous page. Could you double-check it?","我啱啱睇咗下，XX 呢度個數好似同前一頁對唔上，你幫手再確認下？"],
 ["r02","這裡可能有個小錯，先別急著發出去，我們一起看一下。","这里可能有个小错，先别急着发出去，我们一起看一下。","There may be a small error here. Let's check it before sending it out.","呢度可能有個小錯，先唔好急住發，我哋一齊睇下。"],
 ["r03","XX 這段邏輯我有點疑問，跟前面的結論好像不完全一致。","XX 这段逻辑我有点疑问，跟前面的结论好像不完全一致。","I have a question about the logic in XX; it doesn't seem fully consistent with the earlier conclusion.","XX 呢段邏輯我有少少疑問，好似同前面結論唔完全一致。"],
 ["r04","我標了三個地方，你有空時幫我一起核對一下。","我标了三个地方，你有空时帮我一起核对一下。","I marked three places. Could we verify them together when you have a moment?","我 mark 咗三個位，你得閒幫我一齊對下。"],
 ["r05","這個日期應該是 18 號，不是 28 號吧？","这个日期应该是 18 号，不是 28 号吧？","Should this date be the 18th rather than the 28th?","呢個日期應該係 18 號，唔係 28 號掛？"],
 ["r06","這裡的單位是不是漏改了？現在看起來像是 mm 和 m 混在一起。","这里的单位是不是漏改了？现在看起来像是 mm 和 m 混在一起。","Was the unit missed here? It looks like mm and m may have been mixed.","呢度單位係咪漏改？而家睇落似 mm 同 m 撈埋咗。"],
 ["r07","我覺得這句容易讓人誤解，要不要改得更明確一點？","我觉得这句容易让人误解，要不要改得更明确一点？","I think this sentence could be misread. Should we make it more explicit?","我覺得呢句幾容易令人誤解，不如改清楚少少？"],
 ["r08","這頁的版本號跟封面不一致，發出前最好統一一下。","这页的版本号跟封面不一致，发出前最好统一一下。","The version number on this page doesn't match the cover. We should align them before issue.","呢頁 version number 同封面唔一致，發之前最好統一返。"],
 ["r09","我先提醒一下，這個名字好像拼錯了。","我先提醒一下，这个名字好像拼错了。","Just flagging this: I think the name may be misspelled.","提你一下，呢個名好似串錯咗。"],
 ["r10","這個表格加總後不是 100%，你再看一下是不是少了一項。","这个表格加总后不是 100%，你再看一下是不是少了一项。","The table doesn't add up to 100%. Could something be missing?","呢個表加埋唔係 100%，你睇下係咪漏咗一項。"],
 ["r11","我不確定是不是我看錯，但這裡和原始資料不一致。","我不确定是不是我看错，但这里和原始资料不一致。","I may be missing something, but this doesn't match the source data.","我唔肯定係咪我睇錯，但呢度同原始資料唔一致。"],
 ["r12","這裡先不要直接改，我想先確認原始來源是哪一版。","这里先不要直接改，我想先确认原始来源是哪一版。","Let's not change this yet; I want to confirm which source version we're using.","呢度先唔好直接改，我想先確認原始來源係邊版。"],
 ["r13","我建議我們把錯誤位置和正確值一起標出來，避免後面再改錯。","我建议我们把错误位置和正确值一起标出来，避免后面再改错。","Let's mark both the error and the correct value so it doesn't get changed incorrectly again.","我建議將錯位同正確值一齊 mark，免得後面再改錯。"],
 ["r14","這個不是風格問題，是內容本身有矛盾，要先修正。","这个不是风格问题，是内容本身有矛盾，要先修正。","This isn't a style preference; the content itself conflicts and needs correction.","呢個唔係 style 問題，係內容本身有矛盾，要先改。"],
 ["r15","這份文件差不多可以出了，但這兩個錯一定要先處理。","这份文件差不多可以出了，但这两个错一定要先处理。","The document is nearly ready, but these two errors need fixing before issue.","份文件差唔多可以出，但呢兩個錯一定要先處理。"],
 ["r16","先別急著覺得我在挑毛病，這個錯如果出去會比較麻煩。","先别急着觉得我在挑毛病，这个错如果发出去会比较麻烦。","I'm not nitpicking—this particular error could cause trouble if it goes out.","先唔好覺得我挑骨頭，呢個錯如果出咗去會比較麻煩。"],
 ["r17","我寧願現在多看一分鐘，也不想發出去再收回。","我宁愿现在多看一分钟，也不想发出去再收回。","I'd rather spend one more minute checking now than recall the document later.","我寧願依家多睇一分鐘，都唔想發咗先再收返。"],
 ["r18","這裡如果是你有特別考量，你跟我說一下，我怕我理解錯。","这里如果是你有特别考虑，你跟我说一下，我怕我理解错。","If there's a specific reason for this, let me know; I may be misunderstanding it.","如果呢度你有特別考量，講我知，我驚係我理解錯。"],
 ["r19","這個錯不大，但很顯眼，最好順手修掉。","这个错不大，但很显眼，最好顺手修掉。","It's a small error, but quite visible. Better to fix it now.","呢個錯唔大，但幾顯眼，最好順手改咗。"],
 ["r20","我看到這裡停了一下，感覺讀者也可能會卡住。","我看到这里停了一下，感觉读者也可能会卡住。","I paused when I read this, and I think readers may stumble here too.","我睇到呢度停咗一下，感覺讀者都可能卡住。"],
 ["r21","這頁好像偷偷混進了一個舊版本資料。","这页好像偷偷混进了一个旧版本数据。","Looks like an old-version value quietly slipped into this page.","呢頁好似偷偷混入咗個舊版數據。"],
 ["r22","這個數字很努力地融入整份文件，可惜它是錯的。","这个数字很努力地融入整份文件，可惜它是错的。","This number is doing its best to fit in, but unfortunately it's wrong.","呢個數好努力融入份文件，可惜佢係錯嘅。"],
 ["r23","這個 typo 很低調，但還是被我抓到了。","这个 typo 很低调，但还是被我抓到了。","That typo was subtle, but it still got caught.","呢個 typo 幾低調，不過都俾我捉到。"],
 ["r24","這裡如果不改，發出去很容易被人第一眼就看到。","这里如果不改，发出去很容易被人第一眼就看到。","If we leave this, it's the kind of thing people will notice immediately.","呢度唔改，發出去好容易俾人第一眼見到。"],
 ["r25","這份文件不是不能發，是現在發有點太勇敢。","这份文件不是不能发，是现在发有点太勇敢。","It's not that we can't send it; sending it as-is would just be a little brave.","份文件唔係唔出得，係而家出有啲太勇敢。"],
 ["r26","你先別發，這裡真有錯。","你先别发，这里真有错。","Hold the send—there's a real error here.","先唔好發，呢度真係有錯。"],
 ["r27","這個不是我吹毛求疵，是真的會被問。","这个不是我吹毛求疵，是真的会被问。","This isn't me being fussy; someone will genuinely question this.","呢個唔係我吹毛求疵，係真係會俾人問。"],
 ["r28","發出去前把這幾個坑填掉，省得之後一起掉下去。","发出去前把这几个坑填掉，省得之后一起掉下去。","Let's fill these holes before issue so we don't all fall into them later.","發出去前填咗呢幾個坑，免得之後一齊跌落去。"],
 ["r29","這裡錯得不嚴重，但別他媽明知道還照發。","这里错得不严重，但别他妈明知道还照发。","It's not a huge error, but don't fucking send it when we know it's wrong.","呢度錯得唔算嚴重，但唔好屌明知錯仲照發。"],
 ["r30","我先把問題指出來，怎麼改你來定。","我先把问题指出来，怎么改你来定。","I'm flagging the issue; you can decide the best fix.","我先指出問題，點改你決定。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("m01");
if(s){
 reset(s);
 [
 ["r01","醫生，我想再確認一下，這個治療主要是在解決什麼問題？","医生，我想再确认一下，这个治疗主要是在解决什么问题？","Doctor, could you clarify what this treatment is mainly intended to address?","醫生，我想再確認下，呢個治療主要係處理咩問題？"],
 ["r02","可以用比較簡單的方式跟我說這個方案的原理嗎？","可以用比较简单的方式跟我说这个方案的原理吗？","Could you explain how this treatment works in simpler terms?","可唔可以用簡單啲方式講下呢個方案原理？"],
 ["r03","我想知道為什麼您會優先建議這個方案。","我想知道为什么您会优先建议这个方案。","I'd like to understand why you recommend this option first.","我想知點解你會優先建議呢個方案。"],
 ["r04","除了這個方案，還有其他可行選擇嗎？","除了这个方案，还有其他可行选择吗？","Are there other reasonable options besides this one?","除咗呢個方案，仲有冇其他可行選擇？"],
 ["r05","這幾個方案最大的差別是什麼？","这几个方案最大的差别是什么？","What are the main differences between these options?","呢幾個方案最大分別係咩？"],
 ["r06","這個治療預期能帶來什麼改善？","这个治疗预期能带来什么改善？","What improvement should I realistically expect from this treatment?","呢個治療預期可以有咩改善？"],
 ["r07","通常多久能看出效果？","通常多久能看出效果？","How long does it usually take before we know whether it's working?","通常要幾耐先睇到有冇效果？"],
 ["r08","如果效果不理想，下一步通常會怎麼調整？","如果效果不理想，下一步通常会怎么调整？","If it doesn't work as hoped, what would the next step usually be?","如果效果唔理想，下一步通常會點調整？"],
 ["r09","這個方案有哪些常見風險或副作用需要我留意？","这个方案有哪些常见风险或副作用需要我留意？","What common risks or side effects should I watch for?","呢個方案有咩常見風險或者副作用要留意？"],
 ["r10","哪些情況算正常反應，哪些情況需要盡快聯絡你們？","哪些情况算正常反应，哪些情况需要尽快联系你们？","Which reactions are expected, and which ones should prompt me to contact you?","邊啲算正常反應，邊啲情況要盡快聯絡你哋？"],
 ["r11","我現在最需要記住的三件事是什麼？","我现在最需要记住的三件事是什么？","What are the three most important things I should remember right now?","我而家最需要記住三樣嘢係咩？"],
 ["r12","可以把用藥／治療時間和注意事項再說一次嗎？我想記下來。","可以把用药／治疗时间和注意事项再说一次吗？我想记下来。","Could you go over the timing and key instructions once more? I'd like to write them down.","可唔可以再講一次用藥／治療時間同注意事項？我想記低。"],
 ["r13","這個治療會不會影響我現在正在用的其他藥？","这个治疗会不会影响我现在正在用的其他药？","Could this treatment interact with the other medicines I'm currently taking?","呢個治療會唔會同我而家其他藥有影響？"],
 ["r14","我需要做什麼檢查或追蹤來判斷治療是否有效？","我需要做什么检查或追踪来判断治疗是否有效？","What tests or follow-up will show whether the treatment is working?","我要做咩檢查或者 follow-up 先知治療有效？"],
 ["r15","這個方案是一定要現在開始，還是有時間讓我考慮一下？","这个方案是一定要现在开始，还是有时间让我考虑一下？","Do I need to start this immediately, or do I have time to consider it?","呢個方案一定要依家開始，定我有時間諗下？"],
 ["r16","如果我想先聽第二個意見，會不會影響治療時機？","如果我想先听第二个意见，会不会影响治疗时机？","If I want a second opinion first, would that meaningfully affect timing?","如果我想先聽 second opinion，會唔會影響治療時機？"],
 ["r17","這個方案對我這種情況的主要好處是什麼？","这个方案对我这种情况的主要好处是什么？","What is the main benefit of this option for someone in my situation?","呢個方案對我呢種情況主要好處係咩？"],
 ["r18","有沒有什麼情況會讓你改變原本的治療建議？","有没有什么情况会让你改变原来的治疗建议？","What findings would make you change your current recommendation?","有咩情況會令你改變原本治療建議？"],
 ["r19","我剛剛資訊有點多，能不能先幫我整理成『現在要做什麼』？","我刚刚信息有点多，能不能先帮我整理成“现在要做什么”？","That's a lot of information. Could you summarise what I need to do next?","頭先資訊有啲多，可唔可以先幫我整理成『依家要做咩』？"],
 ["r20","我怕自己回去會忘，可以把重點寫在紙上或病歷裡嗎？","我怕自己回去会忘，可以把重点写在纸上或病历里吗？","I'm worried I'll forget. Could the key instructions be written down for me?","我驚返去會唔記得，可唔可以將重點寫低俾我？"],
 ["r21","我想確認我理解對不對：你的意思是先做 A，再看 B 的結果，對嗎？","我想确认我理解对不对：你的意思是先做 A，再看 B 的结果，对吗？","Let me check I understood: first we do A, then review B before deciding the next step, right?","我想確認我理解啱唔啱：先做 A，再睇 B 結果，係咪？"],
 ["r22","你可以把專業術語換成比較生活化的說法嗎？","你可以把专业术语换成比较生活化的说法吗？","Could you put the medical terms into more everyday language?","可唔可以將啲醫學術語講得生活化啲？"],
 ["r23","我不是想挑戰你的判斷，我只是想真的理解自己在做什麼。","我不是想挑战你的判断，我只是想真的理解自己在做什么。","I'm not challenging your judgment; I just want to genuinely understand what I'm agreeing to.","我唔係挑戰你判斷，我只係想真係明自己做緊咩。"],
 ["r24","這個部分我沒聽懂，你可以停一下再說一次嗎？","这个部分我没听懂，你可以停一下再说一次吗？","I didn't understand that part. Could you pause and explain it once more?","呢部分我未聽明，可唔可以停一停再講一次？"],
 ["r25","我知道門診很忙，但這個決定對我很重要，我想把關鍵點問清楚。","我知道门诊很忙，但这个决定对我很重要，我想把关键点问清楚。","I know the clinic is busy, but this decision matters to me and I want to understand the key points clearly.","我知門診好忙，但呢個決定對我好重要，我想問清楚關鍵位。"],
 ["r26","如果只能先回答一個問題，我最想知道這個方案為什麼適合我。","如果只能先回答一个问题，我最想知道这个方案为什么适合我。","If we only have time for one question, I most want to understand why this option fits my case.","如果只可以先答一個問題，我最想知點解呢個方案適合我。"],
 ["r27","先別一次講太多，我想一點一點確認。","先别一次讲太多，我想一点一点确认。","Could we go one point at a time? I want to make sure I follow.","可唔可以一點一點講？我想逐樣確認。"],
 ["r28","我需要的是能讓我做決定的資訊，不只是『一般都這樣做』。","我需要的是能让我做决定的信息，不只是“一般都这样做”。","I need enough information to make a decision, not only 'this is what we usually do'.","我要嘅係足夠做決定嘅資訊，唔係淨係『一般都係咁做』。"],
 ["r29","麻煩直接告訴我這個方案最重要的好處和最需要留意的風險。","麻烦直接告诉我这个方案最重要的好处和最需要留意的风险。","Please tell me the biggest benefit and the main risk I should pay attention to.","麻煩直接講呢個方案最大好處，同最要留意嘅風險。"],
 ["r30","我不是醫生，這段我真的聽不明白，麻煩用人話再講一次。","我不是医生，这段我真的听不明白，麻烦用更直白的话再讲一次。","I'm not a doctor and I genuinely didn't understand that part. Could you explain it in plain language?","我唔係醫生，呢段真係聽唔明，麻煩用人話再講一次。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}
})();