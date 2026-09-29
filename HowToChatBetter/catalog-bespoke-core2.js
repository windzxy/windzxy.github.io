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
function batch(id,rows){
 const s=scene(id); if(!s)return;
 clearQ(s); rows.forEach(r=>add(s,...r));
}

batch("w03",[
["spec01","我现在手上 A、B 都没做完，这件要插进来，就先告诉我哪件往后放。","我现在手上 A、B 都没做完，这件要插进来，就先告诉我哪件往后放。","I'm still working on A and B. If this needs to jump the queue, tell me which one moves back.","我而家 A、B 都未做完，呢件要插隊，就先話我知邊件向後放。"],
["spec02","可以接，但不是凭空多出时间。优先级要一起改。","可以接，但不是凭空多出时间。优先级要一起改。","I can take it, but time doesn't appear from nowhere. The priorities need to change too.","可以接，但時間唔會憑空多出嚟。priority 要一齊改。"],
["spec03","你先给我 deadline，我再判断今天能不能塞进去。","你先给我 deadline，我再判断今天能不能塞进去。","Give me the deadline first, then I'll tell you whether it can fit today.","你先俾 deadline，我再睇今日塞唔塞得到。"],
["spec04","如果这是今天必须完成的，那我需要你明确说哪项原任务不做。","如果这是今天必须完成的，那我需要你明确说哪项原任务不做。","If this must be done today, I need you to explicitly say which existing task is being dropped.","如果呢件今日一定要完成，就要講清楚原本邊件唔做。"],
["spec05","我可以帮，不代表我今天还有空档。","我可以帮，不代表我今天还有空档。","I can help. That doesn't mean I have free capacity today.","我可以幫，唔代表今日有空位。"],
["spec06","先别把『顺手帮一下』说得像五分钟，这个量我看得到。","先别把“顺手帮一下”说得像五分钟，这个量我看得到。","Let's not call this a 'quick favour'. I can see how much work it is.","唔好將『順手幫下』講到似五分鐘，我睇到個工作量。"],
["spec07","这件我可以明天做，今天不行。","这件我可以明天做，今天不行。","I can do this tomorrow. Not today.","呢件我聽日可以做，今日唔得。"],
["spec08","如果只是想找个人接手，那你得先确认这是不是我的职责。","如果只是想找个人接手，那你得先确认这是不是我的职责。","If you're looking for someone to take this over, first confirm whether it actually belongs to me.","如果只係想搵人接手，先確認下係咪真係我職責。"],
["spec09","你现在丢过来，我最多只能先看，不承诺今天出结果。","你现在丢过来，我最多只能先看，不承诺今天出结果。","If you send it now, I can review it, but I can't promise a result today.","你而家掟過嚟，我最多先睇，唔承諾今日有結果。"],
["spec10","我今天的排期已经满了，临时加进来会影响原本承诺的东西。","我今天的排期已经满了，临时加进来会影响原本承诺的东西。","Today's schedule is already full. Adding this now will affect commitments I've already made.","我今日 schedule 已滿，臨時加會影響原本承諾咗嘅嘢。"],
["spec11","你要我救火可以，先告诉我火从哪来、要救到什么程度。","你要我救火可以，先告诉我火从哪来、要救到什么程度。","I can help put out the fire, but tell me where it started and what 'done' looks like.","要我救火可以，先講個火邊度嚟、要救到咩程度。"],
["spec12","这不是『多做一点』，这是新增一项工作。","这不是“多做一点”，这是新增一项工作。","This isn't 'a little extra'. It's an additional task.","呢個唔係『多做少少』，係新增一項工作。"],
["spec13","我可以接一部分，不会整件全吞。","我可以接一部分，不会整件全吞。","I can take part of it. I'm not absorbing the whole task.","我可以接一部分，唔會成件吞晒。"],
["spec14","你先把最急的 20% 挑出来，剩下的别硬塞今天。","你先把最急的 20% 挑出来，剩下的别硬塞今天。","Pick the urgent 20% first. Don't force the rest into today.","先揀最急嗰 20%，剩低唔好硬塞今日。"],
["spec15","我不是拒绝帮忙，我是在拒绝没有优先级的乱加任务。","我不是拒绝帮忙，我是在拒绝没有优先级的乱加任务。","I'm not refusing to help. I'm refusing unscheduled work with no priority decision.","我唔係拒絕幫，我係拒絕冇 priority 咁亂加 task。"],
["spec16","如果这件比我手上的更重要，请你来做取舍。","如果这件比我手上的更重要，请你来做取舍。","If this matters more than what I'm already doing, you need to make the trade-off.","如果呢件比我手上嘅重要，就由你做取捨。"],
["spec17","别默认我『应该有空』，你先问我有没有容量。","别默认我“应该有空”，你先问我有没有容量。","Don't assume I 'should have time'. Ask whether I actually have capacity.","唔好默認我『應該有空』，先問我有冇 capacity。"],
["spec18","我今天不是任务垃圾桶，什么都别往这边倒。","我今天不是任务垃圾桶，什么都别往这边倒。","I'm not today's task bin. Don't dump everything here.","我今日唔係 task 垃圾桶，唔好乜都倒過嚟。"],
["spec19","这球你传得很突然，我手里已经抱满了。","这球你传得很突然，我手里已经抱满了。","That pass came out of nowhere. My hands are already full.","你呢球傳得好突然，我手上已經抱滿。"],
["spec20","你说是急件，我说我也有急件。现在排队。","你说是急件，我说我也有急件。现在排队。","You say it's urgent. I already have urgent work too. It joins the queue.","你話急，我手上都有急件。排隊先。"],
["spec21","临时任务不是开口就自动获得最高优先级。","临时任务不是开口就自动获得最高优先级。","A last-minute task doesn't automatically become top priority just because it was asked for.","臨時 task 唔係一開口就自動最高 priority。"],
["spec22","你要加工作，可以；加时间了吗？","你要加工作，可以；加时间了吗？","You want to add work? Fine. Did you add time too?","要加工作可以，加咗時間未？"],
["spec23","别他妈什么都一句『帮忙』就往我这塞。先排优先级。","别他妈什么都一句“帮忙”就往我这塞。先排优先级。","Stop fucking calling everything a 'favour' and dumping it on me. Set the priority first.","唔好屌乜都一句『幫手』就塞過嚟。先排 priority。"]
]);

batch("w07",[
["spec01","先对一下分工：A 是我的，B 一直是你负责。现在别混在一起。","先对一下分工：A 是我的，B 一直是你负责。现在别混在一起。","Let's reset the ownership: A is mine, B has always been yours. Don't merge them now.","先對返分工：A 係我，B 一直你負責。依家唔好混埋。"],
["spec02","我可以协助收尾，但责任人不会因为我帮了一次就变成我。","我可以协助收尾，但责任人不会因为我帮了一次就变成我。","I can help close it out, but helping once doesn't make me the owner.","我可以幫收尾，但幫一次唔代表責任人變咗我。"],
["spec03","这件事我没接过，也没承诺过，请别写成我没完成。","这件事我没接过，也没承诺过，请别写成我没完成。","I never took or committed to this task. Don't frame it as something I failed to complete.","呢件我冇接過、冇應承過，唔好寫成我冇做。"],
["spec04","你要我补位可以，但先把原责任人写清楚。","你要我补位可以，但先把原责任人写清楚。","I can cover the gap, but first make the original owner clear.","要我補位可以，先寫清楚原責任人。"],
["spec05","帮忙解决问题和承认这是我的问题，是两回事。","帮忙解决问题和承认这是我的问题，是两回事。","Helping solve the problem and accepting ownership are two different things.","幫手解決同承認係我問題，係兩回事。"],
["spec06","如果要改分工，请提前改，不要出事后才改。","如果要改分工，请提前改，不要出事后才改。","If ownership needs to change, change it beforehand, not after something goes wrong.","要改分工就提早改，唔好出事先改。"],
["spec07","我愿意处理眼前问题，但复盘时请按真实分工写。","我愿意处理眼前问题，但复盘时请按真实分工写。","I'll help with the immediate issue, but the review needs to reflect the actual ownership.","眼前問題我可以處理，但復盤要按真實分工寫。"],
["spec08","别把『你也参与过』偷换成『这是你负责』。","别把“你也参与过”偷换成“这是你负责”。","Don't turn 'you were involved' into 'you owned it'.","唔好將『你有參與』偷換成『你負責』。"],
["spec09","我只负责我确认过的部分。","我只负责我确认过的部分。","I'm responsible for the part I agreed to own.","我只負責我確認過嗰部分。"],
["spec10","这项什么时候正式转给我了？把记录拿出来看。","这项什么时候正式转给我了？把记录拿出来看。","When was this formally transferred to me? Let's look at the record.","呢項幾時正式轉俾我？拎 record 出嚟睇。"],
["spec11","如果没有明确转交，就别事后默认是我的。","如果没有明确转交，就别事后默认是我的。","If it was never explicitly transferred, don't assign it to me after the fact.","如果冇明確轉交，就唔好事後默認係我。"],
["spec12","我可以接下来，但请明确这是从现在开始，不是追溯到之前。","我可以接下来，但请明确这是从现在开始，不是追溯到之前。","I can take it from now on, but make it clear that ownership starts now, not retroactively.","我可以由依家接，但要講清楚係由依家開始，唔係追溯之前。"],
["spec13","责任不能因为谁比较好说话就往谁身上放。","责任不能因为谁比较好说话就往谁身上放。","Responsibility can't just land on whoever is easier to pressure.","責任唔可以因為邊個好講就推俾邊個。"],
["spec14","我不是不帮，我是不替别人背记录。","我不是不帮，我是不替别人背记录。","I'm not refusing to help. I'm refusing to carry someone else's record.","我唔係唔幫，我係唔替人孭 record。"],
["spec15","先把 ownership 讲清楚，再谈怎么补救。","先把 ownership 讲清楚，再谈怎么补救。","Clarify ownership first, then we can talk about recovery.","先講清 ownership，再傾點補救。"],
["spec16","谁做错不重要到要吵，但重要到不能写错。","谁做错不重要到要吵，但重要到不能写错。","It may not be worth fighting over who made the mistake, but it is worth recording it correctly.","邊個做錯未必值得嘈，但一定唔可以寫錯。"],
["spec17","这锅你端过来之前，麻烦看看锅底写的是谁名字。","这锅你端过来之前，麻烦看看锅底写的是谁名字。","Before handing me the blame, check whose name is on the bottom of the pan.","呢隻鑊端過嚟之前，麻煩睇下鑊底寫邊個名。"],
["spec18","我帮你救火，不代表火是我点的。","我帮你救火，不代表火是我点的。","Helping you put out the fire doesn't mean I lit it.","我幫你救火，唔代表個火係我點。"],
["spec19","这件事别用『大家都有责任』一句抹平，分工是有记录的。","这件事别用“大家都有责任”一句抹平，分工是有记录的。","Don't erase the ownership with 'we're all responsible'. The split is documented.","唔好用『大家都有責任』一句抹平，分工有 record。"],
["spec20","你可以说我哪里没配合，别直接说成这是我的任务。","你可以说我哪里没配合，别直接说成这是我的任务。","Tell me where I failed to support, but don't turn it into my task.","你可以講我邊度冇配合，唔好直接講成我任務。"],
["spec21","我会对自己的失误负责，也只对自己的失误负责。","我会对自己的失误负责，也只对自己的失误负责。","I'll own my mistakes, and only my mistakes.","我會對自己錯誤負責，亦只對自己錯誤負責。"],
["spec22","甩锅前先看看聊天记录，挺有帮助。","甩锅前先看看聊天记录，挺有帮助。","Before shifting blame, the chat history is surprisingly useful.","甩鑊之前睇下 chat record，幾有幫助。"],
["spec23","原来帮一次就自动继承终身责任？这规则谁定的。","原来帮一次就自动继承终身责任？这规则谁定的。","So helping once means lifetime ownership now? Who made that rule?","原來幫一次就自動繼承終身責任？邊個定？"],
["spec24","别他妈一出问题就找个最好推的人。记录都在。","别他妈一出问题就找个最好推的人。记录都在。","Don't fucking pick the easiest person to blame when something breaks. The record is there.","唔好屌一出事就搵最好推嗰個。record 喺度。"],
["spec25","这责任我不背，问题我可以帮你解决。两句话，别混。","这责任我不背，问题我可以帮你解决。两句话，别混。","I won't take the blame. I can help solve the problem. Those are two separate statements.","責任我唔孭，問題我可以幫你解決。兩句說話，唔好混。"]
]);

batch("f01",[
["spec01","做饭、洗衣、收拾最近基本都在我这边，我们重新分。","做饭、洗衣、收拾最近基本都在我这边，我们重新分。","Cooking, laundry and cleaning have mostly fallen on me. We need to rebalance them.","煮飯、洗衫、執屋最近基本都係我做，要重新分。"],
["spec02","我不是要算账，我是已经累到撑不住了。","我不是要算账，我是已经累到撑不住了。","I'm not keeping score. I'm telling you I'm exhausted.","我唔係計數，我係已經攰到頂唔順。"],
["spec03","固定家务一人一半不一定最公平，我们按时间和能力重分。","固定家务一人一半不一定最公平，我们按时间和能力重分。","A perfect 50/50 split isn't always fair. Let's divide things by time and capacity.","固定家務未必一人一半最公平，按時間同能力重分。"],
["spec04","我负责做饭的话，你固定负责洗碗和垃圾，可以吗？","我负责做饭的话，你固定负责洗碗和垃圾，可以吗？","If I cook, can you permanently take dishes and rubbish?","如果我煮飯，你固定洗碗同倒垃圾，得唔得？"],
["spec05","我不想再靠谁看不下去谁就做，直接定责任。","我不想再靠谁看不下去谁就做，直接定责任。","I don't want chores to be done by whoever gives in first. Let's assign them.","我唔想再靠邊個睇唔過眼就邊個做，直接定責任。"],
["spec06","隐形家务也算家务：买日用品、记账、预约、整理都要分。","隐形家务也算家务：买日用品、记账、预约、整理都要分。","Invisible work counts too: supplies, bills, appointments and organising all need sharing.","隱形家務都算：買日用品、記帳、預約、整理都要分。"],
["spec07","我不想每次都提醒你做，提醒本身也是一份工作。","我不想每次都提醒你做，提醒本身也是一份工作。","I don't want to manage reminders every time. Reminding is work too.","我唔想次次提醒你做，提醒本身都係一份工。"],
["spec08","我们定一个每周固定分工，别每天临时决定。","我们定一个每周固定分工，别每天临时决定。","Let's set a weekly split instead of renegotiating every day.","定個每星期固定分工，唔好日日臨時決定。"],
["spec09","你不是『帮我做家务』，这是我们的家务。","你不是“帮我做家务”，这是我们的家务。","You're not 'helping me with chores'. They're our chores.","你唔係『幫我做家務』，呢啲係我哋家務。"],
["spec10","我今天不收了，剩下这部分你处理。","我今天不收了，剩下这部分你处理。","I'm done cleaning for today. You handle the rest.","我今日唔收喇，剩低你處理。"],
["spec11","如果你觉得现在很公平，那我们把过去一周做过的事列出来看。","如果你觉得现在很公平，那我们把过去一周做过的事列出来看。","If you think the split is fair, let's list what each of us did last week.","如果你覺得而家公平，就列下上星期大家做過乜。"],
["spec12","我不要求你做得跟我一样，只要求你真的负责一部分。","我不要求你做得跟我一样，只要求你真的负责一部分。","I don't need you to do it my way. I need you to actually own part of it.","我唔要求你做法同我一樣，只要你真係負責一部分。"],
["spec13","家里不是酒店，我也不是 housekeeping。","家里不是酒店，我也不是 housekeeping。","This isn't a hotel, and I'm not housekeeping.","屋企唔係酒店，我都唔係 housekeeping。"],
["spec14","你每次说『等下做』，最后那个『等下』都会变成我做。","你每次说“等下做”，最后那个“等下”都会变成我做。","Every 'I'll do it later' somehow ends with me doing it.","你次次話『等陣做』，最後個『等陣』都變咗我做。"],
["spec15","别等我开口才动，看到就处理。","别等我开口才动，看到就处理。","Don't wait for me to ask. If you see it, handle it.","唔好等我開口先郁，見到就處理。"],
["spec16","共同生活不是一个人住、另一个人维护。","共同生活不是一个人住、另一个人维护。","Living together isn't one person living and the other person maintaining.","共同生活唔係一個人住，另一個人維護。"],
["spec17","我不是在争谁辛苦，我是在说这个安排不可持续。","我不是在争谁辛苦，我是在说这个安排不可持续。","I'm not competing over who works harder. I'm saying this setup isn't sustainable.","我唔係爭邊個辛苦，我係話呢個安排唔可持續。"],
["spec18","今天开始，各自负责自己的衣物和个人杂物。","今天开始，各自负责自己的衣物和个人杂物。","Starting today, we each handle our own clothes and personal clutter.","今日開始，各自負責自己衫同私人雜物。"],
["spec19","你要是觉得家务很少，那分一半给你应该也不难。","你要是觉得家务很少，那分一半给你应该也不难。","If you think there's hardly any housework, taking half shouldn't be difficult.","如果你覺得家務好少，分一半俾你應該都唔難。"],
["spec20","家务不会因为没人认领就自动消失，只会落到我头上。","家务不会因为没人认领就自动消失，只会落到我头上。","Chores don't disappear when nobody claims them. They just land on me.","家務唔會因為冇人認領就消失，只會落我頭。"],
["spec21","我们这家现在有住户两名，后勤人员一名，不太合理。","我们家现在有住户两名，后勤人员一名，不太合理。","This household currently has two residents and one support staff member. That's not ideal.","我哋屋企而家兩個住戶，一個後勤，唔太合理。"],
["spec22","原来『一起生活』的意思是我负责生活，你负责一起。","原来“一起生活”的意思是我负责生活，你负责一起。","Apparently 'living together' means I handle the living and you handle the together.","原來『一齊生活』係我負責生活，你負責一齊。"],
["spec23","我不想再当这个家的默认管理员。","我不想再当这个家的默认管理员。","I don't want to be the default household administrator anymore.","我唔想再做呢個屋企默認 administrator。"],
["spec24","再这样下去我真的会罢工，不是开玩笑。","再这样下去我真的会罢工，不是开玩笑。","If this continues, I'm genuinely going on strike. I'm not joking.","再係咁我真係會罷工，唔係講笑。"],
["spec25","家务不是我他妈天生附带的技能包，自己那份自己做。","家务不是我他妈天生附带的技能包，自己那份自己做。","Housework isn't some fucking skill pack I was born with. Do your share.","家務唔係我屌天生附帶技能包，自己嗰份自己做。"]
]);

batch("e01",[
["spec01","有对象我会说，没消息就是没消息，别每顿饭刷新。","有对象我会说，没消息就是没消息，别每顿饭刷新。","If there's someone, I'll tell you. No news means no news. Stop refreshing at every meal.","有對象我會講，冇消息就係冇消息，唔好餐餐 refresh。"],
["spec02","我会结婚，但不按亲戚饭桌排期。","我会结婚，但不按亲戚饭桌排期。","I may get married, but not on a schedule set at the family dinner table.","我可能會結婚，但唔按親戚飯枱排期。"],
["spec03","你关心我我知道，但这个问题每次问只会让我更烦。","你关心我我知道，但这个问题每次问只会让我更烦。","I know you care, but asking every time only makes me more frustrated.","我知你關心，但次次問只會令我更煩。"],
["spec04","我不是不考虑，只是不需要被催。","我不是不考虑，只是不需要被催。","It's not that I haven't thought about it. I just don't need pressure.","唔係我冇諗，只係唔需要催。"],
["spec05","婚姻是我要过的日子，不是你们要交的作业。","婚姻是我要过的日子，不是你们要交的作业。","Marriage is a life I have to live, not homework you need to submit.","婚姻係我要過嘅日子，唔係你哋要交嘅功課。"],
["spec06","我不想为了让大家放心，随便找个人交差。","我不想为了让大家放心，随便找个人交差。","I'm not going to pick someone just to make everyone else feel reassured.","我唔會為咗令大家放心，隨便搵個人交差。"],
["spec07","你们要的是一个日期，我要的是一个适合的人。","你们要的是一个日期，我要的是一个适合的人。","You want a date on the calendar. I need the right person.","你哋要一個日期，我要一個啱嘅人。"],
["spec08","催得再勤，缘分也不会走快一点。","催得再勤，缘分也不会走快一点。","More reminders won't make the right relationship arrive faster.","催得再勤，緣分都唔會行快啲。"],
["spec09","如果婚姻能靠催解决，民政局应该开催单窗口。","如果婚姻能靠催解决，民政局应该开催单窗口。","If pressure solved marriage, the registry office would have a 'chase order' counter.","如果婚姻靠催就得，民政局應該開催單窗口。"],
["spec10","我今天来吃饭，不是来做婚恋进度汇报。","我今天来吃饭，不是来做婚恋进度汇报。","I came for dinner, not to present a relationship progress report.","我今日嚟食飯，唔係做婚戀進度匯報。"],
["spec11","这个问题你上次问过，答案没有更新。","这个问题你上次问过，答案没有更新。","You asked last time. The answer hasn't changed.","呢個問題上次問過，答案未更新。"],
["spec12","等真的有消息，我保证不会把你们漏出通知名单。","等真的有消息，我保证不会把你们漏出通知名单。","When there's real news, I promise you won't be left off the notification list.","真係有消息，我保證唔會漏咗你哋。"],
["spec13","别拿别人家孩子结婚来给我做倒计时。","别拿别人家孩子结婚来给我做倒计时。","Don't use someone else's marriage as a countdown clock for mine.","唔好攞人哋結婚嚟幫我倒數。"],
["spec14","XX 结婚很好，跟我什么时候结没有关系。","XX 结婚很好，跟我什么时候结没有关系。","Good for XX. Their marriage has nothing to do with my timeline.","XX 結婚好好，但同我幾時結冇關係。"],
["spec15","比较不会让我更想结婚，只会让我更不想聊。","比较不会让我更想结婚，只会让我更不想聊。","Comparisons won't make me want marriage more. They'll just make me want this conversation less.","比較唔會令我更想結，只會令我更唔想傾。"],
["spec16","我不接受『年纪到了』作为结婚理由。","我不接受“年纪到了”作为结婚理由。","I don't accept 'you're old enough' as a reason to marry.","我唔接受『年紀到咗』做結婚理由。"],
["spec17","年龄会增加，判断力也应该一起增加。","年龄会增加，判断力也应该一起增加。","Age increases. Hopefully judgment does too.","年齡會加，判斷力都應該一齊加。"],
["spec18","你们担心我以后后悔，我更怕现在乱选以后后悔。","你们担心我以后后悔，我更怕现在乱选以后后悔。","You're worried I'll regret waiting. I'm more worried about regretting the wrong choice.","你哋驚我遲啲後悔，我更驚而家亂揀先後悔。"],
["spec19","结婚不是抢票，晚一分钟不会自动售罄。","结婚不是抢票，晚一分钟不会自动售罄。","Marriage isn't ticket sales. Waiting a minute doesn't make it sell out.","結婚唔係搶飛，遲一分鐘唔會自動售罄。"],
["spec20","我知道你们急，但急的是你们，不是我。","我知道你们急，但急的是你们，不是我。","I know you're in a hurry. The thing is, you're the ones in a hurry, not me.","我知你哋急，但急嘅係你哋，唔係我。"],
["spec21","这个话题今天到这里，再问答案也不会变。","这个话题今天到这里，再问答案也不会变。","We're done with this topic today. Asking again won't change the answer.","呢個話題今日到呢度，再問答案都唔會變。"],
["spec22","你再问一次，我还是会说：我自己决定。","你再问一次，我还是会说：我自己决定。","Ask again and you'll get the same answer: I decide.","你再問一次，我都係答：我自己決定。"],
["spec23","可以关心，不要催命。","可以关心，不要催命。","You can care without hounding me.","可以關心，唔好催命。"],
["spec24","婚姻进度目前为零，催单次数已经破百。","婚姻进度目前为零，催单次数已经破百。","Marriage progress: zero. Reminder count: over a hundred.","婚姻進度而家係零，催單次數已經破百。"],
["spec25","系统提示：重复查询不会生成对象。","系统提示：重复查询不会生成对象。","System notice: repeated searches do not generate a partner.","系統提示：重複查詢唔會生成對象。"],
["spec26","别他妈每顿饭都问一次，我没藏着一个对象不告诉你。","别他妈每顿饭都问一次，我没藏着一个对象不告诉你。","Stop fucking asking at every meal. I'm not hiding a partner from you.","唔好屌餐餐都問，我冇收埋個對象唔話你知。"],
["spec27","我的人生不是家庭群里的待办事项。","我的人生不是家庭群里的待办事项。","My life isn't a task item in the family group chat.","我人生唔係家庭 group 嘅待辦事項。"]
]);

batch("fr01",[
["spec01","这笔钱我不借，但如果你需要，我可以帮你一起想别的办法。","这笔钱我不借，但如果你需要，我可以帮你一起想别的办法。","I won't lend the money, but I can help you think through other options.","呢筆錢我唔借，但如果你需要，我可以幫你一齊諗其他方法。"],
["spec02","我和朋友之间不做借贷，这是我一直的原则。","我和朋友之间不做借贷，这是我一直的原则。","I don't do loans between friends. That's a rule I keep consistently.","我同朋友之間唔做借貸，呢個係我一直原則。"],
["spec03","不是针对你，我对谁都一样：钱不外借。","不是针对你，我对谁都一样：钱不外借。","It's not personal. I have the same rule with everyone: I don't lend money.","唔係針對你，我對邊個都一樣：錢唔外借。"],
["spec04","这金额我承受不了拿不回来，所以我不借。","这金额我承受不了拿不回来，所以我不借。","I can't afford for this amount not to come back, so I won't lend it.","呢個金額我承受唔到收唔返，所以唔借。"],
["spec05","如果是小额我可能会直接请你，但这种金额我不会借。","如果是小额我可能会直接请你，但这种金额我不会借。","For a small amount I might simply help, but I won't lend at this level.","小額我可能直接請你，但呢個金額我唔會借。"],
["spec06","我不想以后聊天都夹着还钱这件事。","我不想以后聊天都夹着还钱这件事。","I don't want every future conversation to carry a repayment issue.","我唔想之後每次傾偈都夾住還錢件事。"],
["spec07","友情我想留着，债务关系我不想加。","友情我想留着，债务关系我不想加。","I'd like to keep the friendship without adding a debtor-creditor relationship.","友情我想留住，債務關係我唔想加。"],
["spec08","我理解你急，但我不能因为你急就承担这个风险。","我理解你急，但我不能因为你急就承担这个风险。","I understand you're under pressure, but I can't take on that risk because of it.","我明你急，但唔可以因為你急就要我承擔個風險。"],
["spec09","别问我什么时候方便借，我的答案不是时间问题。","别问我什么时候方便借，我的答案不是时间问题。","Don't ask when I'd be comfortable lending. This isn't a timing issue.","唔好問我幾時方便借，呢個唔係時間問題。"],
["spec10","你不用再解释用途，我不是因为用途不够合理才拒绝。","你不用再解释用途，我不是因为用途不够合理才拒绝。","You don't need to justify the purpose. That's not why I'm saying no.","你唔使再解釋用途，我唔係因為用途唔合理先拒絕。"],
["spec11","我不借钱，也不做担保。两样都不要问我。","我不借钱，也不做担保。两样都不要问我。","I don't lend money and I don't guarantee loans. Please don't ask me for either.","我唔借錢，亦唔做擔保。兩樣都唔好問我。"],
["spec12","我可以请你吃顿饭，不能借你这笔钱。","我可以请你吃顿饭，不能借你这笔钱。","I can buy you a meal. I can't lend you this amount.","我可以請你食餐飯，但唔可以借呢筆錢。"],
["spec13","如果你需要周转，我可以帮你整理支出，但不出借现金。","如果你需要周转，我可以帮你整理支出，但不出借现金。","If you need help with cash flow, I can help you plan expenses, but I won't lend cash.","如果你要周轉，我可以幫你睇支出，但唔借現金。"],
["spec14","你可以失望，但别把拒绝借钱等同于不把你当朋友。","你可以失望，但别把拒绝借钱等同于不把你当朋友。","You can be disappointed, but don't equate refusing a loan with not valuing the friendship.","你可以失望，但唔好將唔借錢等同唔當你朋友。"],
["spec15","关系再好，钱这件事我也分开。","关系再好，钱这件事我也分开。","No matter how close we are, I keep money separate.","關係再好，錢呢件事我都分開。"],
["spec16","我不想以后因为催你还钱，把两个人都搞得难看。","我不想以后因为催你还钱，把两个人都搞得难看。","I don't want us both resenting each other later over repayment reminders.","我唔想之後因為催還錢，搞到大家都難睇。"],
["spec17","你借的是钱，我承担的是关系风险，所以我不借。","你借的是钱，我承担的是关系风险，所以我不借。","You'd be borrowing money; I'd be taking on relationship risk. So no.","你借嘅係錢，我承擔嘅係關係風險，所以唔借。"],
["spec18","我账户有钱，不代表这笔钱可以借。","我账户有钱，不代表这笔钱可以借。","Having money in my account doesn't mean it's available to lend.","我 account 有錢，唔代表嗰筆錢可以借。"],
["spec19","别拿『你又不是没钱』来劝我，这不是理由。","别拿“你又不是没钱”来劝我，这不是理由。","'It's not like you're broke' isn't a reason for me to lend.","唔好用『你又唔係冇錢』嚟勸我，呢個唔係理由。"],
["spec20","你问一次可以，继续磨我就不舒服了。","你问一次可以，继续磨我就不舒服了。","Asking once is fine. Repeatedly pushing me isn't.","你問一次可以，繼續磨我就唔舒服。"],
["spec21","答案是不借，不是『再说说看』。","答案是不借，不是“再说说看”。","The answer is no, not 'keep trying'.","答案係唔借，唔係『再講下』。"],
["spec22","我不是银行，也不想经营友情贷款业务。","我不是银行，也不想经营友情贷款业务。","I'm not a bank, and I don't want to run a friendship loan service.","我唔係銀行，亦唔想做友情貸款業務。"],
["spec23","我们的友情版本挺好，先别更新成带欠条版。","我们的友情版本挺好，先别更新成带欠条版。","Our current friendship version is fine. No need to update it with an IOU.","我哋而家友情版本幾好，唔使 update 成欠條版。"],
["spec24","利息可以不要，麻烦通常不会不要。","利息可以不要，麻烦通常不会不要。","You can remove the interest. The complications usually stay.","利息可以唔要，麻煩通常唔會唔要。"],
["spec25","你再磨下去，我就从『不借』升级成『不想聊』了。","你再磨下去，我就从“不借”升级成“不想聊”了。","Keep pushing and this goes from 'no loan' to 'I don't want this conversation'.","你再磨落去，我會由『唔借』升級成『唔想傾』。"],
["spec26","不借。别他妈把友情拿来当提款密码。","不借。别他妈把友情拿来当提款密码。","No. Don't fucking use friendship as an ATM PIN.","唔借。唔好屌攞友情當提款密碼。"]
]);

})();