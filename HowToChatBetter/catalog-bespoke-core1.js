;(function(){
const S=window.CHAT_SCENARIOS||[];
function scene(id){return S.find(x=>x.id===id)}
function clearQ(s){
 for(const lang of ["zh","en","yue"]){
  const box=s?.replies?.[lang]||{};
  for(const k of Object.keys(box)) if(/^qv2-/.test(k)) delete box[k];
 }
}
function add(s,key,hant,hans,en,yue){
 s.replies.zh[key]={hant,hans};
 s.replies.en[key]=en;
 s.replies.yue[key]=yue;
}
let s=scene("w01");
if(s){
 clearQ(s);
 const A=[
 ["spec01","說好今天交，我這邊現在還沒收到。能先把現有版本發我嗎？","说好今天交，我这边现在还没收到。能先把现有版本发我吗？","You said you'd send it today, but I still haven't received it. Can you send the current version now?","講好今日交，我呢邊仲未收到。可唔可以先俾而家版本我？"],
 ["spec02","我後面的整合已經在等這份資料了。今天幾點能到？","我后面的整合已经在等这份资料了。今天几点能到？","My next step is already waiting on this file. What time can I expect it today?","我後面整合已經等緊呢份資料。今日幾點到？"],
 ["spec03","如果最終版還沒好，先把半成品給我，我先往下做。","如果最终版还没好，先把半成品给我，我先往下做。","If the final version isn't ready, send the draft and I'll start from there.","如果 final 未好，先俾半成品我，我照住做先。"],
 ["spec04","你直接告訴我：今天發得到，還是發不到？","你直接告诉我：今天发得到，还是发不到？","Just tell me directly: can you send it today or not?","你直接話我知：今日發到，定發唔到？"],
 ["spec05","我需要重新排時間，所以請給我一個真的能做到的時間。","我需要重新排时间，所以请给我一个真的能做到的时间。","I need to reschedule my work, so give me a time you can actually meet.","我要重新排時間，所以俾個真係做到嘅時間我。"],
 ["spec06","你之前說今天交，我就按今天安排了。現在請更新一下。","你之前说今天交，我就按今天安排了。现在请更新一下。","You said today, so I planned around today. Please update me now.","你之前話今日交，我就按今日排咗。依家 update 下。"],
 ["spec07","我不是催你交最終版，我只需要一個能開始工作的版本。","我不是催你交最终版，我只需要一个能开始工作的版本。","I'm not asking for the final version. I just need something I can start working with.","我唔係催 final，我只要一個可以開工嘅版本。"],
 ["spec08","資料再不到，我這邊今天的整合就要往後順延了。","资料再不到，我这边今天的整合就要往后顺延了。","If the file doesn't arrive soon, today's consolidation will have to move.","份資料再唔到，我今日整合就要順延。"],
 ["spec09","我已經等到排期空出來了，別讓這個空檔白掉。","我已经等到排期空出来了，别让这个空档白掉。","I've already kept time open for this. Please don't let that slot go to waste.","我已經留咗時間俾呢份資料，唔好浪費咗個位。"],
 ["spec10","你先別跟我說『快了』，告訴我還差什麼、要多久。","你先别跟我说“快了”，告诉我还差什么、要多久。","Don't just tell me it's 'almost done'. Tell me what's left and how long it needs.","唔好淨係話『就快』，講仲差咩、要幾耐。"],
 ["spec11","我收件箱都快把你這份資料列成失蹤人口了。今天露面嗎？","我收件箱都快把你这份资料列成失踪人口了。今天露面吗？","My inbox is about to list your file as missing. Is it making an appearance today?","我個 inbox 都快將你份資料列失蹤人口。今日現身未？"],
 ["spec12","別他媽再跟我說等一下了。檔案現在能不能發？","别他妈再跟我说等一下了。文件现在能不能发？","Stop fucking telling me 'later'. Can you send the file now or not?","唔好再屌同我講等陣。個 file 依家發唔發到？"]
 ];
 A.forEach(x=>add(s,...x));
}
s=scene("s02");
if(s){
 clearQ(s);
 const A=[
 ["spec01","今晚要整合，麻煩你先把目前做到的部分丟上來。","今晚要整合，麻烦你先把目前做到的部分放上来。","We need to consolidate tonight. Please upload whatever you have so far.","今晚要整合，麻煩你先放而家做到嗰部分上嚟。"],
 ["spec02","如果你來不及做完，就直接說，我們現在還能重新分工。","如果你来不及做完，就直接说，我们现在还能重新分工。","If you can't finish in time, say so now. We can still redistribute the work.","如果你做唔切就直接講，依家仲可以重新分工。"],
 ["spec03","不要等到截止前一小時才說沒做完。現在給個進度。","不要等到截止前一小时才说没做完。现在给个进度。","Don't wait until an hour before the deadline to say it's unfinished. Give us the status now.","唔好等 deadline 前一個鐘先話未做完。依家講進度。"],
 ["spec04","你負責的是 XX。今晚 9 點前至少要有可整合版本。","你负责的是 XX。今晚 9 点前至少要有可整合版本。","You're responsible for XX. We need at least an integrable version by 9 tonight.","你負責 XX。今晚 9 點前最少要有可以整合嘅版本。"],
 ["spec05","大家都交了，就差你這一塊。你現在能發多少先發多少。","大家都交了，就差你这一块。你现在能发多少先发多少。","Everyone else has submitted. Yours is the missing piece. Send whatever is ready now.","大家都交咗，就差你呢部分。依家有幾多先發幾多。"],
 ["spec06","我不是要催你，我是要知道我們今晚到底能不能交。","我不是要催你，我是要知道我们今晚到底能不能交。","I'm not chasing for the sake of it. I need to know whether we can actually submit tonight.","我唔係為催而催，我係要知今晚究竟交唔交到。"],
 ["spec07","你如果卡住了就把問題講出來，別整段消失。","你如果卡住了就把问题讲出来，别整段消失。","If you're stuck, tell us what the issue is. Don't just disappear.","如果你卡住就講問題，唔好成段消失。"],
 ["spec08","先不用漂亮，先把能用的內容交上來。","先不用漂亮，先把能用的内容交上来。","It doesn't need to be polished yet. Upload the usable content first.","唔使靚住，先放可用內容上嚟。"],
 ["spec09","今天不交的話，後面的格式統一和檢查都會一起被拖。","今天不交的话，后面的格式统一和检查都会一起被拖。","If this doesn't come in today, formatting and final checks get delayed too.","今日唔交，後面統一格式同檢查都會一齊拖。"],
 ["spec10","我們需要的是你的內容，不是你的『快好了』。","我们需要的是你的内容，不是你的“快好了”。","We need your content, not another 'almost done'.","我哋要嘅係你份內容，唔係『就快好』。"],
 ["spec11","你現在給個明確時間，別讓整組人靠猜。","你现在给个明确时间，别让整组人靠猜。","Give us a clear time now. Don't make the whole group guess.","依家俾個明確時間，唔好成組人靠估。"],
 ["spec12","如果今晚做不到，我們現在就把剩下部分拆給其他人。","如果今晚做不到，我们现在就把剩下部分拆给其他人。","If you can't finish tonight, we'll redistribute the remainder now.","如果今晚做唔到，我哋依家就拆剩低部分俾其他人。"],
 ["spec13","deadline 不會因為你沒回群消息就一起消失。","deadline 不会因为你没回群消息就一起消失。","The deadline doesn't disappear just because you stop replying in the group.","deadline 唔會因為你唔覆 group 就一齊消失。"],
 ["spec14","你那部分是不是也在等靈感自己上傳？","你那部分是不是也在等灵感自己上传？","Is your section waiting for inspiration to upload itself?","你嗰部分係咪都等緊靈感自己 upload？"],
 ["spec15","共享文件裡大家都到了，就你那格還在休假。","共享文件里大家都到了，就你那格还在休假。","Everyone has arrived in the shared file except your section, which seems to be on leave.","shared file 入面大家都到咗，就你嗰格仲放緊假。"],
 ["spec16","我們不是在等奇蹟，是在等你把文件放上去。","我们不是在等奇迹，是在等你把文件放上去。","We're not waiting for a miracle. We're waiting for you to upload the file.","我哋唔係等奇蹟，係等你 upload 個 file。"],
 ["spec17","如果你真沒做，現在講比最後一刻裝死好。","如果你真没做，现在说比最后一刻装死好。","If you genuinely haven't done it, say it now instead of vanishing at the last minute.","如果真係未做，依家講好過最後一刻扮死。"],
 ["spec18","別讓全組替你補作業，這部分是你答應負責的。","别让全组替你补作业，这部分是你答应负责的。","Don't make the whole group finish your part. You agreed to own it.","唔好要全組幫你補功課，呢部分係你應承負責。"],
 ["spec19","你再不交，我們只能按沒有你這部分的方案往下走。","你再不交，我们只能按没有你这部分的方案往下走。","If you still don't submit, we'll have to proceed without your section.","你再唔交，我哋只能按冇你呢部分嘅方案繼續。"],
 ["spec20","這不是提醒第幾次的問題，是你現在到底交不交。","这不是提醒第几次的问题，是你现在到底交不交。","This isn't about how many reminders you've had. Are you submitting or not?","呢個唔係提醒第幾次嘅問題，係你依家究竟交唔交。"],
 ["spec21","你那份再不來，我們今晚就不是小組作業，是集體救火。","你那份再不来，我们今晚就不是小组作业，是集体救火。","If your part doesn't arrive, tonight stops being group work and becomes group firefighting.","你嗰份再唔嚟，今晚就唔係 group project，係集體救火。"],
 ["spec22","別他媽等最後五分鐘才把半成品扔過來。現在就發目前版本。","别他妈等最后五分钟才把半成品扔过来。现在就发当前版本。","Don't fucking wait until the final five minutes to dump a half-finished file on us. Send the current version now.","唔好屌等最後五分鐘先掟個半成品過嚟。依家就發而家版本。"]
 ];
 A.forEach(x=>add(s,...x));
}
})();