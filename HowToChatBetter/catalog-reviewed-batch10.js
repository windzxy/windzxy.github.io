;(function(){
const scene=(window.CHAT_SCENARIOS||[]).find(s=>s.id==='w06');
if(!scene)throw Error('Missing scene w06');
const rows=[
// Traditional, Simplified, English, Cantonese
["XX 目前卡在 A，原訂時間可能趕不上。","XX 目前卡在 A，原定时间可能赶不上。","XX is blocked by A and may miss the original deadline.","XX 而家卡喺 A，原定時間可能趕唔切。"],
["先提前報告：XX 有延誤風險，我會在今天四點前確認新時間。","先提前汇报：XX 有延期风险，我会在今天四点前确认新时间。","An early heads-up: XX is at risk of delay. I'll confirm a revised time by four today.","提早講聲：XX 有延誤風險，我今日四點前會確認新時間。"],
["這次是我估時不足。我會重排工序，今晚給你一個可靠的交付日期。","这次是我估时不足。我会重新安排步骤，今晚给你一个可靠的交付日期。","I underestimated the work. I'll replan it and send a dependable delivery date tonight.","今次係我估時不足。我會重排步驟，今晚俾你個可靠交期。"],
["A 還沒到位。要保住今天的期限，我需要你幫我先確認這項輸入。","A 还没到位。要保住今天的期限，我需要你帮我先确认这项输入。","A hasn't arrived. To keep today's deadline, I need your help confirming that input first.","A 仲未到位。要保住今日限期，我需要你幫手先確認呢項輸入。"],
["完整版本今天做不完，但 B 已經可以先交。你想先看 B 嗎？","完整版今天做不完，但 B 已经可以先交。你想先看 B 吗？","The full version won't be ready today, but B is. Would you like B first?","完整版今日做唔完，但 B 可以先交。你想先睇 B 嗎？"],
["我預計需要多半天；若沒有新的阻礙，明天中午可以交。","我预计还需要半天；如果没有新的阻碍，明天中午可以交。","I need about half a day more. If nothing else blocks it, I can deliver by noon tomorrow.","我預計仲要半日；冇新阻礙嘅話，聽日中午交到。"],
["目前在等 A 的確認，收到後我需要兩小時完成剩下的部分。","目前在等 A 的确认，收到后我还需要两小时完成剩下的部分。","I'm waiting for approval of A. Once it arrives, I need two hours to finish the rest.","依家等緊 A 確認，收到之後我仲要兩個鐘完成剩低部分。"],
["現在說會延期，是想讓你有時間調整後面的安排。","现在告知可能延期，是想让你有时间调整后面的安排。","I'm flagging the delay now so you have time to adjust the downstream plan.","依家講可能延期，係想你有時間調整後面安排。"],
["我有兩個選擇：今天交較簡的版本，或週五交完整版本。你偏好哪個？","我有两个选择：今天交简版，或周五交完整版。你更想要哪个？","I can deliver a lighter version today or the full version Friday. Which helps more?","我有兩個選擇：今日交簡版，或者星期五交完整版。你想要邊個？"],
["能否把截止時間延到明天下午？我想把 A 的核對做完再交。","能否把截止时间延到明天下午？我想核对完 A 再交。","Could we move the deadline to tomorrow afternoon? I want to finish checking A before delivery.","可唔可以將限期延到聽日下午？我想核對完 A 先交。"],
["如果今天硬交，關鍵數字還沒有驗證。我建議先確認，再發出去。","如果今天硬交，关键数字还没验证。我建议先确认，再发出去。","If I force delivery today, the key figures will be unverified. I recommend checking them first.","如果今日夾硬交，關鍵數字仲未核實。我建議對好先發。"],
["要按原時間完成，需要有人協助處理 B；我可以專注收尾 XX。","要按原时间完成，需要有人协助处理 B；我可以专心收尾 XX。","To meet the original deadline, I need help with B so I can finish XX.","要按原定時間完成，需要有人幫手處理 B；我可以專心收尾 XX。"],
["期限和範圍目前無法同時維持。請選擇優先保留哪一個。","期限和范围目前没法同时维持。请决定先保哪一个。","We can't preserve both the scope and deadline now. Which should take priority?","限期同範圍依家保唔到晒。請揀一樣行先。"],
["我今天會先完成檢查清單，明早處理最後的修正。","我今天先完成检查清单，明早处理最后的修改。","I'll finish the checklist today and handle the final corrections tomorrow morning.","我今日會先做完檢查清單，聽朝處理最後修改。"],
["XX 會晚一點。新的時間我今晚確認。","XX 会晚一点。新的时间我今晚确认。","XX will be late. I'll confirm the new time tonight.","XX 會遲少少。新時間我今晚確認。"],
["目前已完成八成，剩下的是 A 的覆核；我不想把未核對的部分當成完成。","目前完成了八成，剩下的是 A 的复核；我不想把没核对的部分当作完成。","It's about eighty percent done. A still needs review, and I don't want to call that finished.","依家做咗八成，仲差 A 覆核；我唔想將未對好嗰部分當完成。"],
["知道這會影響你的安排，抱歉。我先把可用內容發你，其他部分再補。","我知道这会影响你的安排，抱歉。我先把能用的内容发你，其他部分再补。","I know this affects your plan, and I'm sorry. I'll send the usable material now and follow with the rest.","我知會影響你安排，唔好意思。我先發用到嘅內容俾你，其他再補。"],
["我不想先答應一個做不到的時間。A 確認後，我會給你準確交期。","我不想先答应一个做不到的时间。A 确认后，我会给你准确的交付时间。","I don't want to promise an unreliable time. Once A is confirmed, I'll give you a firm date.","我唔想先應承個做唔到嘅時間。A 確認後，我會俾個準確交期。"],
["我明天十點向你更新 A 的進度；到時若仍卡住，就啟用備用方案。","我明天十点向你更新 A 的进度；如果还卡着，就启动备用方案。","I'll update you on A at ten tomorrow. If it's still blocked, we'll use the fallback plan.","我聽日十點更新 A 進度；如果仲卡住，就用後備方案。"],
["最急的 B 我會照常完成；不急的 XX 需要順延一天。","最急的 B 我会照常完成；不急的 XX 需要顺延一天。","I'll deliver the urgent B on time; the less urgent XX needs to move by a day.","最急嘅 B 我照做完；冇咁急嘅 XX 要順延一日。"],
["如果 A 今天仍無法取得，我會改用現有資料完成初稿，並標明待確認處。","如果今天还是拿不到 A，我会用现有资料完成初稿，并标明待确认部分。","If A doesn't arrive today, I'll draft from what we have and clearly mark the gaps.","如果今日仲攞唔到 A，我會用現有資料出初稿，標清楚待確認位。"],
["我需要先得到你對 B 的批准；否則繼續修改會拖慢整體交付。","我需要先得到你对 B 的批准；否则继续修改会拖慢整体交付。","I need your approval on B before continuing; otherwise further revisions will delay the whole delivery.","我需要先攞到你對 B 嘅批准；唔係繼續改會拖慢整體交付。"],
["現在加做 C，就要把 XX 延到週五；兩件事我無法同時在週四完成。","现在加做 C，就得把 XX 延到周五；两件事没法都在周四完成。","Adding C now moves XX to Friday. I can't finish both by Thursday.","依家加做 C，XX 就要延到星期五；兩樣做唔到星期四都完成。"],
["開會前先說一聲：XX 還在處理，今天的簡報請不要寫成已完成。","开会前先说一声：XX 还在处理，今天的汇报请别写成已经完成。","Before the meeting, one correction: XX is still in progress, so please don't report it as complete.","開會前講聲：XX 仲處理緊，今日匯報唔好寫成已完成。"],
["我不想等到最後一分鐘才說做不完，所以現在先把風險攤開。","我不想等到最后一分钟才说做不完，所以现在先把风险说清楚。","I don't want the first warning to come at the deadline, so I'm raising the risk now.","我唔想最後一分鐘先話做唔切，所以依家先講清楚風險。"],
["你那邊若已安排後續交付，我可以先通知相關同事時間可能要調。","你那边如果已安排后续交付，我可以先通知相关同事时间可能要调整。","If downstream work is already booked, I can alert the team that its timing may need to shift.","你嗰邊如果已安排後續交付，我可以先通知相關同事時間可能要改。"],
["原訂日期需要改，但目標不變。我會先完成核心功能，把附加內容放到下一版。","原定日期需要调整，但目标不变。我会先完成核心功能，把附加内容放到下一版。","The date needs to move, but the goal is unchanged. I'll ship the core first and move extras to the next version.","原定日子要改，但目標唔變。我先完成核心功能，附加內容放下一版。"],
["這次進度沒有跟上，是我這邊要處理的問題。我會每天簡短更新，直到交付。","这次进度没跟上，是我这边需要解决的问题。我会每天简短更新，直到交付。","The missed pace is mine to fix. I'll send a brief daily update until delivery.","今次進度冇跟上，係我呢邊要處理。我會每日簡短更新，直到交付。"],
["我寧願現在說晚一天，也不想明天交一份讓大家重做的東西。","我宁愿现在说晚一天，也不想明天交一份让大家重新做的东西。","I'd rather say a day late now than hand over something everyone has to redo tomorrow.","我寧願依家講遲一日，都唔想聽日交份要大家重做嘅嘢。"],
["XX 卡在 A。要保原期，現在得有人拍板。","XX 卡在 A。要保住原定时间，现在得有人拍板。","XX is blocked by A. To keep the date, someone needs to decide now.","XX 卡喺 A。要保原定時間，依家要有人拍板。"]
];
scene.replies={zh:{},en:{},yue:{}};
rows.forEach((r,i)=>{const k='r'+String(i+1).padStart(2,'0');scene.replies.zh[k]={hant:r[0],hans:r[1]};scene.replies.en[k]=r[2];scene.replies.yue[k]=r[3]});
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
window.CHAT_REVIEWED_SCENES.w06=true;
})();
