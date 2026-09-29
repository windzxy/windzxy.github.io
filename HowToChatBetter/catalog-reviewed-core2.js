;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function get(id){return S.find(x=>x.id===id)}
function add(s,key,hant,hans,en,yue){
  if(!s)return;
  s.replies.zh[key]={hant,hans};
  s.replies.en[key]=en;
  s.replies.yue[key]=yue;
}
function clearQ(s){
  if(!s)return;
  for(const lang of ["zh","en","yue"]){
    const box=s.replies?.[lang]||{};
    for(const k of Object.keys(box)) if(/^qv2-/.test(k)) delete box[k];
  }
}
function mark(s){if(s)window.CHAT_REVIEWED_SCENES[s.id]=true;}

let s=get("w03");
if(s){
 clearQ(s);
 [
 ["rv01","我可以接，但請先告訴我哪一件現有工作要往後移。","我可以接，但请先告诉我哪一件现有工作要往后移。","I can take it, but tell me which existing task should move back.","我可以接，但先話我知邊樣現有工作要向後移。"],
 ["rv02","如果這件比 A、B 更急，麻煩你幫我確認新的優先順序。","如果这件比 A、B 更急，麻烦你帮我确认新的优先顺序。","If this is more urgent than A and B, please confirm the new priority order.","如果呢件比 A、B 更急，麻煩你確認新 priority。"],
 ["rv03","今天排期已滿，我最快明天開始。","今天排期已满，我最快明天开始。","My schedule is full today. Earliest start is tomorrow.","今日排期已滿，我最快聽日開始。"],
 ["rv04","這個需求來得太晚，今天只能先處理最必要的一部分。","这个需求来得太晚，今天只能先处理最必要的一部分。","This came in too late for a full turnaround today. I can only handle the essential part.","呢個需求太遲先嚟，今日只可以先做最必要嗰部分。"],
 ["rv05","你先把 deadline 和期望輸出寫清楚，我再判斷能不能插單。","你先把 deadline 和期望输出写清楚，我再判断能不能插单。","Send the deadline and expected output first, then I'll see whether I can fit it in.","你先寫清楚 deadline 同預期輸出，我再睇可唔可以插單。"],
 ["rv06","這件如果不是今天非做不可，就排到明天。","这件如果不是今天非做不可，就排到明天。","If this isn't truly needed today, it goes to tomorrow.","如果呢件唔係今日非做不可，就排聽日。"],
 ["rv07","我可以幫你看重點，但完整處理今天做不到。","我可以帮你看重点，但完整处理今天做不到。","I can help with the critical part, but I can't fully handle it today.","我可以幫你睇重點，但今日做唔到完整處理。"],
 ["rv08","這項本來不在我今天的計畫裡，臨時加入會影響原本交付。","这项本来不在我今天的计划里，临时加入会影响原本交付。","This wasn't in today's plan. Adding it now will affect existing delivery.","呢項本來唔喺今日 plan，依家加會影響原本交付。"],
 ["rv09","可以做，但請你同步跟相關人說明其他工作會順延。","可以做，但请你同步跟相关人说明其他工作会顺延。","I can do it, but please tell the relevant people that other work will be delayed.","可以做，但請你同步同相關人講其他工作會順延。"],
 ["rv10","如果你希望我今天完成，請把範圍縮到 X。","如果你希望我今天完成，请把范围缩到 X。","If you need it today, reduce the scope to X.","如果要我今日完成，請將 scope 縮到 X。"],
 ["rv11","我現在手上沒有空位，不要默認我能直接接。","我现在手上没有空位，不要默认我能直接接。","I don't have spare capacity right now. Don't assume I can just take it.","我而家冇空位，唔好默認我可以直接接。"],
 ["rv12","先別說『很快的』，把實際工作量說清楚。","先别说“很快的”，把实际工作量说清楚。","Don't call it 'quick' yet. Tell me the actual workload.","先唔好話『好快』，講清楚實際工作量。"],
 ["rv13","這件如果要插隊，需要有人明確拍板。","这件如果要插队，需要有人明确拍板。","If this needs to jump the queue, someone needs to explicitly approve that priority change.","呢件要插隊，就要有人明確拍板。"],
 ["rv14","我不是拒絕幫忙，我是在避免三件事一起做壞。","我不是拒绝帮忙，我是在避免三件事一起做坏。","I'm not refusing to help. I'm avoiding doing three things badly at once.","我唔係拒絕幫，我係避免三樣嘢一齊做衰。"],
 ["rv15","你可以把需求給我，但不要把『今天做完』一起默認打包。","你可以把需求给我，但不要把“今天做完”一起默认打包。","You can give me the task, but don't automatically bundle in 'finish today'.","你可以俾需求我，但唔好連『今日做完』一齊默認打包。"],
 ["rv16","今天只能二選一：原工作按時，或這件先做。","今天只能二选一：原工作按时，或这件先做。","Today it's one or the other: keep the original work on time, or prioritise this.","今日只可以二揀一：原工作準時，或者呢件先做。"],
 ["rv17","臨時需求不是不能接，但不能沒有代價。","临时需求不是不能接，但不能没有代价。","Last-minute work isn't impossible, but it isn't cost-free.","臨時需求唔係唔接得，但唔可以冇代價。"],
 ["rv18","我的時間表不是 Tetris，什麼都能硬塞進去。","我的时间表不是俄罗斯方块，不是什么都能硬塞进去。","My calendar isn't Tetris. Not everything can be squeezed in.","我個 schedule 唔係 Tetris，唔係乜都塞得入。"],
 ["rv19","你這個『順便』的體積有點大。","你这个“顺便”的体积有点大。","That 'quick favour' is carrying quite a lot of volume.","你呢個『順便』體積有啲大。"],
 ["rv20","我的待辦已經滿座，這位臨時乘客要先等候。","我的待办已经满座，这位临时乘客要先等候。","My task list is fully booked. This last-minute passenger needs to wait.","我個 to-do list 已經 full house，呢位臨時乘客要等。"],
 ["rv21","不要每次到了你那邊很急，就自動變成我這邊的 emergency。","不要每次到了你那边很急，就自动变成我这边的 emergency。","Your urgency doesn't automatically become my emergency.","唔好次次你嗰邊急，就自動變我呢邊 emergency。"],
 ["rv22","這不是幫個小忙，這是多一個完整任務。","这不是帮个小忙，这是多一个完整任务。","This isn't a small favour. It's another full task.","呢個唔係幫個小忙，係多一個完整 task。"],
 ["rv23","別他媽每次最後一刻才塞工作過來。","别他妈每次最后一刻才塞工作过来。","Stop fucking dropping work on me at the last minute.","唔好屌次次最後一刻先塞工作過嚟。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("w07");
if(s){
 clearQ(s);
 [
 ["rv01","先對一下原分工，這一項原本不在我名下。","先对一下原分工，这一项原本不在我名下。","Let's check the original ownership. This item wasn't assigned to me.","先對返原分工，呢項原本唔係我名下。"],
 ["rv02","如果責任真的有變更，請給我當時的確認紀錄。","如果责任真的有变更，请给我当时的确认记录。","If ownership really changed, show me the record where that was agreed.","如果責任真係改過，請俾返當時確認紀錄。"],
 ["rv03","我可以協助收尾，但責任人還是原本那位。","我可以协助收尾，但责任人还是原本那位。","I can help close it out, but ownership stays with the original owner.","我可以幫手收尾，但責任人仍然係原本嗰位。"],
 ["rv04","幫過一次，不代表這件事就自動變成我的。","帮过一次，不代表这件事就自动变成我的。","Helping once doesn't automatically make it mine.","幫過一次，唔代表件事自動變我嘅。"],
 ["rv05","請不要把『我有參與』改寫成『我負責』。","请不要把“我有参与”改写成“我负责”。","Please don't rewrite 'I was involved' into 'I owned it'.","唔好將『我有參與』改寫成『我負責』。"],
 ["rv06","這部分我沒有決策權，也不應該承擔最終責任。","这部分我没有决策权，也不应该承担最终责任。","I didn't have decision authority here, so I shouldn't carry final responsibility.","呢部分我冇決策權，亦唔應該孭最終責任。"],
 ["rv07","如果要我接手，請從現在開始明確轉交，不要倒推到之前。","如果要我接手，请从现在开始明确转交，不要倒推到之前。","If you want me to take over, transfer it clearly from now—not retroactively.","如果要我接手，請由依家開始清楚轉交，唔好倒推返之前。"],
 ["rv08","我願意解決問題，但不接受把歷史責任一起打包給我。","我愿意解决问题，但不接受把历史责任一起打包给我。","I'm willing to solve the problem, not inherit its entire history.","我願意解決問題，但唔接受連歷史責任一齊打包俾我。"],
 ["rv09","先別談誰背鍋，先把誰做了什麼列出來。","先别谈谁背锅，先把谁做了什么列出来。","Before assigning blame, let's list who actually did what.","先唔好講邊個孭鑊，先列清楚邊個做咗咩。"],
 ["rv10","我這邊有紀錄，當時 B 是由 XX 跟進。","我这边有记录，当时 B 是由 XX 跟进。","I have the record here: B was assigned to XX at the time.","我呢邊有紀錄，當時 B 係 XX 跟。"],
 ["rv11","可以補救，但不要用補救的人替代原責任人。","可以补救，但不要用补救的人替代原责任人。","We can fix it, but don't replace the original owner with whoever helps fix it.","可以補救，但唔好用補救嗰個代替原責任人。"],
 ["rv12","這件事我沒有承諾過，也沒有收到正式轉交。","这件事我没有承诺过，也没有收到正式转交。","I never committed to this, and it was never formally handed over to me.","呢件事我冇應承過，亦冇正式交過俾我。"],
 ["rv13","責任不能在出問題後才臨時重新分配。","责任不能在出问题后才临时重新分配。","Responsibility can't be reassigned only after something goes wrong.","責任唔可以出事之後先臨時重分。"],
 ["rv14","我可以一起處理，但請在會議紀錄裡保留原本分工。","我可以一起处理，但请在会议记录里保留原本分工。","I can help handle it, but keep the original ownership in the meeting record.","我可以一齊處理，但 meeting record 請保留原本分工。"],
 ["rv15","先把事實講清楚，再談誰負責後續。","先把事实讲清楚，再谈谁负责后续。","Let's establish the facts before deciding who owns the follow-up.","先講清楚事實，再講邊個負責後續。"],
 ["rv16","你要我幫忙可以，別把幫忙說成我本來就該做。","你要我帮忙可以，别把帮忙说成我本来就该做。","Ask me to help if needed, but don't pretend it was always my job.","要我幫可以，但唔好講到好似本來就係我做。"],
 ["rv17","這個責任轉移得太有創意，我先不簽收。","这个责任转移得太有创意，我先不签收。","That's a very creative transfer of responsibility. I'm not signing for it.","呢個責任轉移幾有創意，我唔簽收。"],
 ["rv18","這鍋有原收件人，麻煩按地址退回。","这锅有原收件人，麻烦按地址退回。","This blame parcel has an original recipient. Return to sender.","呢隻鑊有原收件人，麻煩退返原地址。"],
 ["rv19","原來出事之後 owner 會自動刷新，我今天才知道。","原来出事之后 owner 会自动刷新，我今天才知道。","Didn't realise ownership auto-refreshes after a problem. Learned something new today.","原來出事之後 owner 會自動 refresh，我今日先知。"],
 ["rv20","幫忙滅火的人，不等於放火的人。","帮忙灭火的人，不等于放火的人。","The person helping put out the fire isn't the person who started it.","幫手滅火嗰個，唔等於放火嗰個。"],
 ["rv21","不要把你的漏項變成我的遺漏。","不要把你的漏项变成我的遗漏。","Don't turn your missed item into my omission.","唔好將你漏咗嘅嘢變成我遺漏。"],
 ["rv22","我不接受事後改寫分工。","我不接受事后改写分工。","I don't accept retroactive rewriting of ownership.","我唔接受事後改寫分工。"],
 ["rv23","這件不是我負責，別他媽硬扣給我。","这件不是我负责，别他妈硬扣给我。","This wasn't my responsibility. Stop fucking pinning it on me.","呢件唔係我負責，唔好屌硬扣俾我。"],
 ["rv24","誰做錯誰說清楚，別拿我當緩衝墊。","谁做错谁说清楚，别拿我当缓冲垫。","Whoever made the mistake can own it. Don't use me as the shock absorber.","邊個做錯邊個講清楚，唔好攞我做緩衝墊。"],
 ["rv25","我可以給台階，但不替別人背歷史。","我可以给台阶，但不替别人背历史。","I can give people room to recover. I won't carry their history for them.","我可以俾台階，但唔會代人孭歷史。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("f01");
if(s){
 clearQ(s);
 [
 ["rv01","我們把做飯、洗碗、洗衣、清潔直接列出來重新分。","我们把做饭、洗碗、洗衣、清洁直接列出来重新分。","Let's list cooking, dishes, laundry and cleaning and divide them again.","我哋將煮飯、洗碗、洗衫、清潔直接列出嚟重分。"],
 ["rv02","我不想再靠『誰看到誰做』，因為最後通常都是我看到。","我不想再靠“谁看到谁做”，因为最后通常都是我看到。","I don't want the rule to be 'whoever notices does it' because I keep being the one who notices.","我唔想再靠『邊個見到邊個做』，因為最後通常都係我見到。"],
 ["rv03","我們一人固定負責幾項，比每天臨時等人做更公平。","我们一人固定负责几项，比每天临时等人做更公平。","Let's each own a few fixed chores instead of waiting for someone to pick them up each day.","一人固定負責幾樣，比日日等人臨時做公平。"],
 ["rv04","做家務不只是在做，還包括記得要做。這部分也要分。","做家务不只是在做，还包括记得要做。这部分也要分。","Housework includes remembering what needs doing, not just doing it. That mental load needs sharing too.","家務唔只係做，仲包括記得要做。呢部分都要分。"],
 ["rv05","如果你不想做飯，那你可以固定洗碗和收拾。","如果你不想做饭，那你可以固定洗碗和收拾。","If you don't want to cook, take dishes and cleanup as your regular jobs.","如果你唔想煮飯，可以固定洗碗同執嘢。"],
 ["rv06","週末我們一起花十分鐘對一下下週家務。","周末我们一起花十分钟对一下下周家务。","Let's spend ten minutes each weekend planning the next week's chores.","週末我哋用十分鐘對下下星期家務。"],
 ["rv07","最近我已經連續幾週做了大部分，我需要你補回來。","最近我已经连续几周做了大部分，我需要你补回来。","I've carried most of it for several weeks. I need you to take more back.","最近我已經連續幾星期做咗大部分，我需要你補返。"],
 ["rv08","我不是計較一兩次，我說的是長期失衡。","我不是计较一两次，我说的是长期失衡。","I'm not counting one or two incidents. I'm talking about a long-term imbalance.","我唔係計較一兩次，我講緊長期失衡。"],
 ["rv09","如果今天我做飯，你就把廚房和碗收掉。","如果今天我做饭，你就把厨房和碗收掉。","If I cook today, you handle the kitchen and dishes.","如果今日我煮飯，你就執廚房同洗碗。"],
 ["rv10","家務不能一直靠我提醒你才開始。","家务不能一直靠我提醒你才开始。","Housework can't depend on me reminding you every time.","家務唔可以一路靠我提醒你先開始。"],
 ["rv11","我也想回到家能休息，不是回來接第二班。","我也想回到家能休息，不是回来接第二班。","I want to come home and rest too, not start a second shift.","我都想返屋企可以休息，唔係返嚟接第二更。"],
 ["rv12","我們可以按時間分，不一定每件都五五開。","我们可以按时间分，不一定每件都五五开。","We can balance by time, not necessarily split every task fifty-fifty.","我哋可以按時間分，唔一定樣樣五五開。"],
 ["rv13","你忙的週我可以多做，但不能變成永久安排。","你忙的周我可以多做，但不能变成永久安排。","I can carry more on your busy weeks, but that can't become permanent.","你忙嗰星期我可以做多啲，但唔可以變永久。"],
 ["rv14","先別談誰比較累，把實際做了什麼列出來。","先别谈谁比较累，把实际做了什么列出来。","Before debating who's more tired, let's list what each of us actually does.","先唔好講邊個比較攰，列返實際做咗咩。"],
 ["rv15","家務分配需要重做，不然我會越來越不爽。","家务分配需要重做，不然我会越来越不爽。","We need to rebalance chores or I'm going to get more resentful.","家務分配要重做，唔係我會越嚟越唔爽。"],
 ["rv16","我不是你媽，也不想每天追著你收拾。","我不是你妈，也不想每天追着你收拾。","I'm not your mother, and I don't want to chase you to clean up every day.","我唔係你阿媽，亦唔想日日追住你執。"],
 ["rv17","共同生活不能只有一個人維護。","共同生活不能只有一个人维护。","Shared living can't be maintained by one person.","共同生活唔可以得一個人維護。"],
 ["rv18","這個家不是自動清潔模式。","这个家不是自动清洁模式。","This home doesn't have auto-clean mode.","呢個屋企冇自動清潔 mode。"],
 ["rv19","看來地板只對我一個人可見。","看来地板只对我一个人可见。","Apparently the floor is visible only to me.","睇嚟個地板只係我一個人睇到。"],
 ["rv20","垃圾桶好像也只會對我發通知。","垃圾桶好像也只会对我发通知。","The bin seems to send notifications only to me.","個垃圾桶好似都只會通知我。"],
 ["rv21","我已經把免費後勤部開太久了，現在要關門。","我已经把免费后勤部开太久了，现在要关门。","The free household support department has been open long enough. It's closing.","免費後勤部開咗太耐，而家要關門。"],
 ["rv22","別把『你比較會做』當成我應該全做。","别把“你比较会做”当成我应该全做。","Don't use 'you're better at it' as a reason for me to do all of it.","唔好用『你做得好啲』當我應該做晒。"],
 ["rv23","家務不是性格測試，是工作量。","家务不是性格测试，是工作量。","Chores aren't a personality trait. They're workload.","家務唔係性格測試，係工作量。"],
 ["rv24","這不是幫我做家務，是你在做你那份。","这不是帮我做家务，是你在做你那份。","You're not 'helping me' with chores. You're doing your share.","呢個唔係幫我做家務，係你做你嗰份。"],
 ["rv25","家務不是我他媽一個人的 KPI。","家务不是我他妈一个人的 KPI。","Housework is not my fucking solo KPI.","家務唔係我屌一個人嘅 KPI。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("e01");
if(s){
 clearQ(s);
 [
 ["rv01","這件事我有自己的節奏，有進展我會主動說。","这件事我有自己的节奏，有进展我会主动说。","I have my own timeline for this. I'll share when there's something to share.","呢件事我有自己節奏，有進展我會主動講。"],
 ["rv02","你關心我我知道，但每次見面都問會讓我有壓力。","你关心我我知道，但每次见面都问会让我有压力。","I know you care, but asking every time we meet puts pressure on me.","我知你關心，但次次見面都問會令我有壓力。"],
 ["rv03","結婚不是我現在最優先的安排。","结婚不是我现在最优先的安排。","Marriage isn't my top priority right now.","結婚唔係我而家最優先安排。"],
 ["rv04","有沒有對象、什麼時候結婚，我想保留一點私人空間。","有没有对象、什么时候结婚，我想保留一点私人空间。","I'd like to keep my dating and marriage timeline somewhat private.","有冇對象、幾時結婚，我想保留少少私人空間。"],
 ["rv05","這個問題不用每次飯桌都重播。","这个问题不用每次饭桌都重播。","We don't need to replay this question at every meal.","呢個問題唔使次次飯枱都重播。"],
 ["rv06","我不會因為被催就找一個人結婚。","我不会因为被催就找一个人结婚。","I'm not going to marry someone just because I'm being pressured.","我唔會因為俾人催就搵個人結婚。"],
 ["rv07","如果我覺得遇到合適的人，自然會往前走。","如果我觉得遇到合适的人，自然会往前走。","If I meet the right person, I'll move forward naturally.","如果我覺得遇到合適嘅人，自然會向前。"],
 ["rv08","婚姻是我要過的生活，所以時間由我定。","婚姻是我要过的生活，所以时间由我定。","I'm the one who has to live the marriage, so I decide the timing.","婚姻係我要過嘅生活，所以時間我定。"],
 ["rv09","可以關心，但不要替我安排相親或做決定。","可以关心，但不要替我安排相亲或做决定。","You can care, but don't arrange dates or make decisions for me without asking.","可以關心，但唔好代我安排相睇或者做決定。"],
 ["rv10","如果你想知道我過得好不好，可以問別的，不一定每次問結婚。","如果你想知道我过得好不好，可以问别的，不一定每次问结婚。","If you want to know how I'm doing, ask me something other than marriage every time.","如果你想知我過得好唔好，可以問第二樣，唔一定次次問結婚。"],
 ["rv11","這個話題今天到這裡，我們聊點別的。","这个话题今天到这里，我们聊点别的。","That's enough on this topic for today. Let's talk about something else.","呢個話題今日到呢度，傾第二樣啦。"],
 ["rv12","我不想把人生進度做成親戚群週報。","我不想把人生进度做成亲戚群周报。","I don't want my life timeline turned into a family-group weekly report.","我唔想將人生進度做成親戚群週報。"],
 ["rv13","婚姻系統目前沒有更新，有更新我會推送。","婚姻系统目前没有更新，有更新我会推送。","No update in the marriage system. I'll push a notification if that changes.","婚姻系統暫時冇 update，有 update 我會推送。"],
 ["rv14","這個問題的答案跟上次一樣。","这个问题的答案跟上次一样。","The answer is the same as last time.","呢個問題答案同上次一樣。"],
 ["rv15","催婚不會提高匹配成功率。","催婚不会提高匹配成功率。","Pressure doesn't increase compatibility.","催婚唔會提高匹配成功率。"],
 ["rv16","婚姻不是外賣，催單不會快一點。","婚姻不是外卖，催单不会快一点。","Marriage isn't delivery. Chasing the order won't make it arrive faster.","婚姻唔係外賣，催單唔會快啲。"],
 ["rv17","你們比我還急，搞得像名額快搶完了。","你们比我还急，搞得像名额快抢完了。","You're more anxious than I am, like marriage slots are about to sell out.","你哋比我仲急，搞到好似名額就快搶晒。"],
 ["rv18","我不是不結，我是不按你們的時間表結。","我不是不结，我是不按你们的时间表结。","I'm not saying never. I'm saying not on someone else's timetable.","我唔係唔結，我係唔跟你哋時間表結。"],
 ["rv19","我這個人還在，不用先替我的婚禮焦慮。","我这个人还在，不用先替我的婚礼焦虑。","I'm still here. No need to worry about my wedding before I do.","我個人仲喺度，唔使先替我婚禮焦慮。"],
 ["rv20","你問得再勤，答案也不會自動更新。","你问得再勤，答案也不会自动更新。","Asking more often won't auto-refresh the answer.","你問得再密，答案都唔會自動 update。"],
 ["rv21","這題已經進入免答區。","这题已经进入免答区。","This question is now in the no-answer zone.","呢題已經進入免答區。"],
 ["rv22","別拿別人家孩子的進度來排我的人生。","别拿别人家孩子的进度来排我的人生。","Don't use someone else's timeline to schedule my life.","唔好用人哋屋企仔女嘅進度排我人生。"],
 ["rv23","誰先結婚不是排行榜。","谁先结婚不是排行榜。","Marriage timing isn't a leaderboard.","邊個先結婚唔係排行榜。"],
 ["rv24","再問還是這個答案：我自己決定。","再问还是这个答案：我自己决定。","Ask again and the answer is still the same: I decide.","再問都係呢個答案：我自己決定。"],
 ["rv25","我給你們面子，但這題別再追。","我给你们面子，但这题别再追。","I'm being polite, but stop pushing this question.","我俾面你哋，但呢題唔好再追。"],
 ["rv26","結不結婚是我的事，別他媽拿它當飯桌固定節目。","结不结婚是我的事，别他妈拿它当饭桌固定节目。","Whether I marry is my business. Stop making it the fucking regular dinner topic.","結唔結婚係我嘅事，唔好屌攞嚟做飯枱固定節目。"],
 ["rv27","要是真有消息，不用你問，我自己會講。","要是真有消息，不用你问，我自己会讲。","If there's actual news, you won't need to ask. I'll tell you.","真係有消息，唔使你問，我自己會講。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}
})();