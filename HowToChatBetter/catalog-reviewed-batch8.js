;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function get(id){return S.find(x=>x.id===id)}
function reset(s){if(s)s.replies={zh:{},en:{},yue:{}}}
function add(s,key,hant,hans,en,yue){s.replies.zh[key]={hant,hans};s.replies.en[key]=en;s.replies.yue[key]=yue}
function mark(s){if(s)window.CHAT_REVIEWED_SCENES[s.id]=true}

let s=get("w04");
if(s){
 reset(s);
 [
 ["r01","因私人事項，我今天下午需要請半天假。手上的 A 已完成，B 我會在離開前交接好。","因私人事项，我今天下午需要请半天假。手上的 A 已完成，B 我会在离开前交接好。","I need to take this afternoon off for a personal matter. A is done, and I'll hand over B before I leave.","因私人事，我今日下晝要請半日假。A 已完成，B 我離開前會交接好。"],
 ["r02","今天下午我需要臨時請半天假。我會先把緊急事項處理完再走。","今天下午我需要临时请半天假。我会先把紧急事项处理完再走。","I need to take half a day off this afternoon at short notice. I'll finish the urgent items before I leave.","今日下晝我需要臨時請半日假。我會先處理完緊急嘢再走。"],
 ["r03","下午有一件私人事情需要我本人處理，所以想請半天假。","下午有一件私人事情需要我本人处理，所以想请半天假。","I have a personal matter this afternoon that I need to handle myself, so I'd like to take half a day off.","下晝有件私人事要我本人處理，所以想請半日假。"],
 ["r04","我今天下午需要離開半天，工作我已經先排好，不會影響今天的重點交付。","我今天下午需要离开半天，工作我已经先排好，不会影响今天的重点交付。","I need to be away for half a day this afternoon. I've arranged the work so today's key delivery won't be affected.","我今日下晝要離開半日，工作已經排好，唔會影響今日重點交付。"],
 ["r05","想跟你報備一下，我下午需要請半天假，晚一點我會把交接內容發到群裡。","想跟你报备一下，我下午需要请半天假，晚一点我会把交接内容发到群里。","Just letting you know that I need a half day off this afternoon. I'll post the handover notes in the group before I go.","同你報備下，我下晝要請半日假，陣間會將交接內容放去 group。"],
 ["r06","我下午臨時有事，需要請半天假。A 我先收尾，B 交給 XX 跟。","我下午临时有事，需要请半天假。A 我先收尾，B 交给 XX 跟。","Something has come up this afternoon, so I need a half day off. I'll wrap up A and hand B to XX.","我下晝臨時有事，要請半日假。A 我先收尾，B 交俾 XX 跟。"],
 ["r07","我今天下午不在，若有急事可以電話找我，其他事項我明早接回。","我今天下午不在，若有急事可以电话找我，其他事项我明早接回。","I won't be available this afternoon. For anything urgent, call me; I'll pick up everything else tomorrow morning.","我今日下晝唔喺度，有急事可以打俾我，其他我聽朝接返。"],
 ["r08","這次比較臨時，不好意思。我會先把需要別人接手的部分說清楚再走。","这次比较临时，不好意思。我会先把需要别人接手的部分说清楚再走。","Sorry for the short notice. I'll make sure anything that needs coverage is clearly handed over before I leave.","今次比較臨時，唔好意思。我會先講清楚邊啲要人接手再走。"],
 ["r09","下午我需要處理私人安排，想請半天假。具體私事我就不展開了，但工作已經安排好。","下午我需要处理私人安排，想请半天假。具体私事我就不展开了，但工作已经安排好。","I need half a day off this afternoon for a personal matter. I'd rather keep the details private, but the work is covered.","下晝我要處理私人安排，想請半日假。私事細節我唔展開，但工作已經安排好。"],
 ["r10","我需要請半天假處理個人事務。請假本身我會按流程補齊。","我需要请半天假处理个人事务。请假本身我会按流程补齐。","I need a half day off for a personal matter. I'll complete the leave request through the normal process.","我要請半日假處理私人事務，請假程序我會照流程補返。"],
 ["r11","下午我需要請假。如果今天有必須由我處理的事，麻煩中午前告訴我，我先處理。","下午我需要请假。如果今天有必须由我处理的事，麻烦中午前告诉我，我先处理。","I need the afternoon off. If there's anything that must be handled by me today, let me know before noon and I'll do it first.","下晝我要請假。如果今日有一定要我做嘅嘢，中午前話我知，我先處理。"],
 ["r12","今天下午我請半天假，明天正常回來。需要我補的事情我明早第一時間處理。","今天下午我请半天假，明天正常回来。需要我补的事情我明早第一时间处理。","I'm taking this afternoon off and will be back as normal tomorrow. I'll pick up anything outstanding first thing in the morning.","今日下晝我請半日假，聽日正常返。要補嘅我聽朝第一時間做。"],
 ["r13","下午我有一件不能延後的私人事項，所以需要請半天假。","下午我有一件不能延后的私人事项，所以需要请半天假。","I have a personal matter this afternoon that can't be postponed, so I need half a day off.","下晝有件唔可以延期嘅私人事，所以要請半日假。"],
 ["r14","我不是臨時消失，下午需要請假，現在先把交接和聯絡方式說清楚。","我不是临时消失，下午需要请假，现在先把交接和联系方式说清楚。","I won't just disappear this afternoon; I need leave, so I'm setting out the handover and contact details now.","我唔係臨時失蹤，下晝要請假，依家先講清楚交接同聯絡方法。"],
 ["r15","我下午要請半天假。手上沒有會卡住團隊的事項，可以放心安排。","我下午要请半天假。手上没有会卡住团队的事项，可以放心安排。","I need a half day off this afternoon. Nothing I'm holding should block the team.","我下晝要請半日假，手上冇會卡住 team 嘅嘢。"],
 ["r16","我今天下午有私人安排，需要請假。這次不方便改期。","我今天下午有私人安排，需要请假。这次不方便改期。","I have a personal commitment this afternoon and need leave. This one can't be rescheduled.","我今日下晝有私人安排，要請假。今次唔方便改期。"],
 ["r17","下午我不在辦公室，但今天的 deadline 我已經先處理好。","下午我不在办公室，但今天的 deadline 我已经先处理好。","I won't be in the office this afternoon, but today's deadline has already been handled.","下晝我唔喺 office，但今日 deadline 已經先處理好。"],
 ["r18","這次請假比較突然，我會把影響降到最低，但下午我確實需要離開。","这次请假比较突然，我会把影响降到最低，但下午我确实需要离开。","This is short notice and I'll minimise the impact, but I do need to be away this afternoon.","今次請假比較突然，我會將影響降到最低，但下晝我確實要走。"],
 ["r19","我下午需要處理生活裡的急件，工作這邊我先交接完再走。","我下午需要处理生活里的急事，工作这边我先交接完再走。","I have an urgent life matter this afternoon. I'll hand work over properly before leaving.","我下晝有生活急件，工作呢邊交接好先走。"],
 ["r20","今天下午的人生排程臨時插了一件事，我需要請半天假。","今天下午的人生排程临时插了一件事，我需要请半天假。","My personal schedule has thrown in an urgent item this afternoon, so I need half a day off.","今日下晝人生 schedule 臨時插咗件事，我要請半日假。"],
 ["r21","下午要暫時離開工作頻道半天，該交接的我會先交接。","下午要暂时离开工作频道半天，该交接的我会先交接。","I'll be off the work channel for half a day this afternoon, with the necessary handover done first.","下晝要暫時離開工作頻道半日，該交接嘅我會先交接。"],
 ["r22","我今天下午需要請假，原因屬於私人事項，就不在公司裡展開了。","我今天下午需要请假，原因属于私人事项，就不在公司里展开了。","I need leave this afternoon. The reason is personal, so I'd prefer not to discuss the details at work.","我今日下晝要請假，原因係私人事，就唔喺公司展開。"],
 ["r23","下午我請半天假。工作安排我可以交代，私人細節就先保留。","下午我请半天假。工作安排我可以交代，私人细节就先保留。","I'm taking half a day off this afternoon. I'm happy to explain the work coverage, but I'll keep the personal details private.","下晝我請半日假。工作安排可以交代，私人細節我先保留。"],
 ["r24","我需要的是半天假，不是私人生活說明會。工作交接我會做好。","我需要的是半天假，不是私人生活说明会。工作交接我会做好。","I need half a day off, not a presentation on my private life. The work handover will be covered.","我要嘅係半日假，唔係私人生活簡報。工作交接我會做好。"],
 ["r25","私事我不方便說太細，但今天下午確實需要請假。","私事我不方便说太细，但今天下午确实需要请假。","I can't go into detail on the personal matter, but I genuinely need the afternoon off.","私事我唔方便講太細，但今日下晝真係要請假。"],
 ["r26","我下午請假，這是通知和安排，不是想把私事拿出來討論。","我下午请假，这是通知和安排，不是想把私事拿出来讨论。","I'm notifying you and arranging coverage for leave; I'm not looking to discuss the private matter itself.","我下晝請假，係通知同安排，唔係想拎私事出嚟討論。"],
 ["r27","今天下午我必須離開。若流程上需要補什麼，我回來後補齊。","今天下午我必须离开。若流程上需要补什么，我回来后补齐。","I have to leave this afternoon. If any paperwork is needed, I'll complete it afterward.","今日下晝我一定要走。如果流程上要補啲咩，我返嚟再補齊。"],
 ["r28","這次我沒辦法改時間，所以只能請半天假。","这次我没办法改时间，所以只能请半天假。","I can't move this appointment, so I need to take half a day off.","今次我改唔到時間，所以只能請半日假。"],
 ["r29","下午我需要請假，手上的事情我已經安排好了。","下午我需要请假，手上的事情我已经安排好了。","I need the afternoon off. My current work is already arranged.","下晝我要請假，手上啲嘢已經安排好。"],
 ["r30","我今天下午不在，先跟你說一聲，避免臨時找不到我。","我今天下午不在，先跟你说一声，避免临时找不到我。","I won't be around this afternoon, so I'm letting you know now in case anyone needs me.","我今日下晝唔喺度，先同你講聲，免得臨時搵唔到我。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("p03");
if(s){
 reset(s);
 [
 ["r01","我現在最想知道的是真實情況。你做錯了我們可以處理，但先把事實說清楚。","我现在最想知道的是真实情况。你做错了我们可以处理，但先把事实说清楚。","What matters most now is the truth. We can deal with the mistake, but first tell me what really happened.","我而家最想知真實情況。做錯咗可以處理，但先講清楚事實。"],
 ["r02","如果你現在願意說實話，我會先聽完，不急著罵你。","如果你现在愿意说实话，我会先听完，不急着骂你。","If you're ready to tell me the truth now, I'll listen first without jumping in to scold you.","如果你而家肯講真話，我會先聽完，唔急住鬧你。"],
 ["r03","你可以重新說一次，這次只說真的。","你可以重新说一次，这次只说真的。","You can tell the story again. This time, just tell me what really happened.","你可以重新講一次，今次淨係講真嘅。"],
 ["r04","我知道你可能是怕被罵才說謊，但說謊會讓事情更難處理。","我知道你可能是怕被骂才说谎，但说谎会让事情更难处理。","I know you may have lied because you were afraid of getting in trouble, but lying makes the problem harder to fix.","我知你可能係驚俾人鬧先講大話，但講大話會令件事更難處理。"],
 ["r05","做錯一件事和說謊是兩件事，我們要分開處理。","做错一件事和说谎是两件事，我们要分开处理。","Making a mistake and lying about it are two different issues. We'll deal with both separately.","做錯一件事同講大話係兩回事，我哋要分開處理。"],
 ["r06","你現在承認，我會比較在意你願意誠實，而不是只盯著原本的錯。","你现在承认，我会更在意你愿意诚实，而不是只盯着原来的错。","If you admit it now, I'll pay attention to the fact that you're choosing honesty, not only the original mistake.","你而家承認，我會更在意你肯誠實，唔係淨係望住原本個錯。"],
 ["r07","我不需要一個好聽版本，我只需要真實版本。","我不需要一个好听版本，我只需要真实版本。","I don't need the nicer version. I need the true version.","我唔需要好聽版本，我只要真實版本。"],
 ["r08","如果你不確定怎麼說，就從『我做了什麼』開始。","如果你不确定怎么说，就从“我做了什么”开始。","If you don't know how to say it, start with 'what I did was…'.","如果你唔知點講，就由『我做咗咩』開始。"],
 ["r09","我可以接受你犯錯，但不能接受你一直改故事。","我可以接受你犯错，但不能接受你一直改故事。","I can accept a mistake. I can't accept the story changing every time.","我可以接受你犯錯，但唔接受你一路改故事。"],
 ["r10","現在先不討論處罰，先確認到底發生了什麼。","现在先不讨论处罚，先确认到底发生了什么。","We're not discussing consequences yet. First we need to know what actually happened.","依家先唔講處罰，先確認究竟發生咗咩。"],
 ["r11","我問你不是為了抓你，是因為我要知道怎麼幫你收拾。","我问你不是为了抓你，是因为我要知道怎么帮你处理。","I'm not asking to catch you out. I need the truth so I know how to help fix it.","我問你唔係為咗捉你，係要知點幫你處理。"],
 ["r12","你說實話不代表不用承擔後果，但會讓我們更容易解決。","你说实话不代表不用承担后果，但会让我们更容易解决。","Telling the truth doesn't erase consequences, but it makes the problem much easier to solve.","講真話唔代表冇後果，但會令我哋容易處理好多。"],
 ["r13","如果你現在還是不想說，我可以等一下，但不能一直用假的版本。","如果你现在还是不想说，我可以等一下，但不能一直用假的版本。","If you're not ready to talk yet, I can give you a little time, but we can't keep using a false version.","如果你而家仲唔想講，我可以等一陣，但唔可以一路用假版本。"],
 ["r14","我希望你知道，犯錯不等於你是壞孩子。說實話才是我們現在要練習的。","我希望你知道，犯错不等于你是坏孩子。说实话才是我们现在要练习的。","Making a mistake doesn't make you a bad kid. Telling the truth is what we're practising now.","犯錯唔等於你係壞小朋友。講真話先係我哋而家要練習嘅。"],
 ["r15","你怕我失望，我明白。但用謊話遮住，只會讓我更難相信你。","你怕我失望，我明白。但用谎话遮住，只会让我更难相信你。","I understand you were afraid I'd be disappointed, but covering it with a lie makes trust harder.","你驚我失望，我明。但用大話遮住，只會令我更難信你。"],
 ["r16","這次我們把事情處理完，之後再一起想下次怎麼更容易說真話。","这次我们把事情处理完，之后再一起想下次怎么更容易说真话。","Let's fix this situation first, then figure out how to make telling the truth easier next time.","今次先處理好件事，之後再一齊諗下次點樣更容易講真話。"],
 ["r17","如果你一開始就說真話，我可能會生氣，但不會因為真話更生氣。","如果你一开始就说真话，我可能会生气，但不会因为真话更生气。","I might be upset by what happened, but I won't be more upset because you told the truth.","如果你一開始講真，我可能會嬲，但唔會因為真話更加嬲。"],
 ["r18","你現在有一次重新開始的機會。把真的版本告訴我。","你现在有一次重新开始的机会。把真的版本告诉我。","You have a chance to start this conversation again. Tell me the real version.","你而家有一次重新開始機會。講返真版本俾我。"],
 ["r19","我們先把『會不會被罵』放一邊，只看事實。","我们先把“会不会被骂”放一边，只看事实。","Put 'will I get in trouble' aside for a moment. Let's just look at the facts.","先將『會唔會俾鬧』放埋一邊，只睇事實。"],
 ["r20","故事越補越多，最後你自己都會記不住。現在停在真話就好。","故事越补越多，最后你自己都会记不住。现在停在真话就好。","The more pieces you add to a false story, the harder it is to keep straight. Stop here and tell the truth.","個故事越補越多，最後你自己都記唔住。依家停喺真話就好。"],
 ["r21","我們先退出編故事模式，切回真實版本。","我们先退出编故事模式，切回真实版本。","Let's exit story-making mode and switch back to the real version.","我哋先退出編故事 mode，切返真實版本。"],
 ["r22","這件事不是偵探遊戲，我不想靠線索猜你做了什麼。","这件事不是侦探游戏，我不想靠线索猜你做了什么。","This isn't a detective game. I don't want to piece together what happened from clues.","呢件事唔係偵探遊戲，我唔想靠線索估你做咗咩。"],
 ["r23","版本更新太多了，我們回到第一手資料：你本人。","版本更新太多了，我们回到第一手资料：你本人。","There have been too many versions. Let's go back to the primary source: you.","版本 update 太多，我哋返返第一手資料：你本人。"],
 ["r24","我不是要贏這場對話，我要知道真相。","我不是要赢这场对话，我要知道真相。","I'm not trying to win this conversation. I need the truth.","我唔係要贏呢場對話，我要知道真相。"],
 ["r25","你如果現在說真話，我們就從這裡往前走，不再玩猜謎。","你如果现在说真话，我们就从这里往前走，不再玩猜谜。","If you tell the truth now, we'll move forward from here and stop guessing.","你而家講真，我哋就由呢度向前，唔再估謎。"],
 ["r26","我會查清楚，所以你最好直接告訴我，不要讓事情變得更難看。","我会查清楚，所以你最好直接告诉我，不要让事情变得更难看。","I'm going to find out what happened, so it's better to tell me directly rather than make this messier.","我會查清楚，所以你最好直接講，唔好令件事更難睇。"],
 ["r27","我已經知道有些地方對不上。現在是你自己把真話說出來的時候。","我已经知道有些地方对不上。现在是你自己把真话说出来的时候。","I already know parts of the story don't match. This is your chance to tell me the truth yourself.","我已經知有啲位對唔上。依家係你自己講真話嘅時候。"],
 ["r28","不說實話，原本一個問題會變成兩個。","不说实话，原来一个问题会变成两个。","If you don't tell the truth, one problem becomes two.","唔講真話，原本一個問題會變兩個。"],
 ["r29","我可以接受錯，但不能接受你拿謊話當逃生門。","我可以接受错，但不能接受你拿谎话当逃生门。","I can handle a mistake. I can't let lying become the escape route.","我可以接受錯，但唔接受你用大話做逃生門。"],
 ["r30","今天先把真話說出來，其他後果我們再談。","今天先把真话说出来，其他后果我们再谈。","Tell the truth first. We'll discuss the consequences afterward.","今日先講真話，其他後果之後再傾。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("sv03");
if(s){
 reset(s);
 [
 ["r01","想跟進一下案件 XX，目前已經 X 天沒有更新。麻煩告知現在的處理狀態。","想跟进一下案件 XX，目前已经 X 天没有更新。麻烦告知现在的处理状态。","I'm following up on case XX. There has been no update for X days. Please confirm the current status.","想跟下 case XX，而家已經 X 日冇 update。麻煩講下目前狀態。"],
 ["r02","請確認案件 XX 現在由哪個部門或哪位同事負責。","请确认案件 XX 现在由哪个部门或哪位同事负责。","Please confirm which team or person currently owns case XX.","請確認 case XX 而家邊個部門或者邊位同事負責。"],
 ["r03","這個案件下一個處理節點是什麼？預計什麼時候有結果？","这个案件下一个处理节点是什么？预计什么时候有结果？","What is the next step for this case, and when should I expect an outcome?","呢個 case 下一步係咩？預計幾時有結果？"],
 ["r04","如果目前仍在等待內部回覆，麻煩給我一個預計更新日期。","如果目前仍在等待内部回复，麻烦给我一个预计更新日期。","If you're still waiting internally, please give me an expected update date.","如果仲等緊內部回覆，麻煩俾個預計 update 日期。"],
 ["r05","我不需要每天收到『處理中』，但需要知道什麼時候會有實質進展。","我不需要每天收到“处理中”，但需要知道什么时候会有实质进展。","I don't need a daily 'in progress'. I do need to know when there will be substantive movement.","我唔需要日日收『處理中』，但要知幾時有實質進展。"],
 ["r06","案件 XX 已經超過原本告知的處理時間，請協助升級跟進。","案件 XX 已经超过原本告知的处理时间，请协助升级跟进。","Case XX has exceeded the stated handling time. Please escalate it for follow-up.","case XX 已經超過原本講嘅處理時間，請幫手 escalate 跟進。"],
 ["r07","如果這個層級處理不了，麻煩轉給可以決定的人。","如果这个层级处理不了，麻烦转给可以决定的人。","If this level can't resolve it, please transfer it to someone who can make the decision.","如果呢個層級處理唔到，麻煩轉俾可以決定嘅人。"],
 ["r08","我已經提供過需要的資料，請確認現在是否還缺任何東西。","我已经提供过需要的资料，请确认现在是否还缺任何东西。","I've already provided the requested information. Please confirm whether anything else is missing.","我已經俾過需要資料，請確認而家仲差唔差任何嘢。"],
 ["r09","麻煩不要讓我重複提交同一套資料，先查看案件紀錄。","麻烦不要让我重复提交同一套资料，先查看案件记录。","Please check the case history before asking me to submit the same information again.","麻煩先睇 case record，唔好要我重複交同一套資料。"],
 ["r10","案件已經拖了 X 天，我今天需要一個明確的下一步。","案件已经拖了 X 天，我今天需要一个明确的下一步。","This case has been open for X days. I need a clear next step today.","case 已經拖咗 X 日，我今日需要一個明確下一步。"],
 ["r11","請告訴我目前卡在哪裡：審核、技術、退款，還是其他部門？","请告诉我目前卡在哪里：审核、技术、退款，还是其他部门？","Please tell me where it's blocked: review, technical, refund, or another department?","請話我知而家卡喺邊：審核、技術、退款，定其他部門？"],
 ["r12","如果沒有新的進展，也請直接說目前仍沒有結果，不要只貼模板回覆。","如果没有新的进展，也请直接说目前仍没有结果，不要只贴模板回复。","If there is no new progress, say that directly rather than sending another template response.","如果冇新進展，都直接講仲未有結果，唔好淨係貼 template。"],
 ["r13","我想確認這個案件是否有 SLA，以及目前是否已經超時。","我想确认这个案件是否有 SLA，以及目前是否已经超时。","Could you confirm whether this case has an SLA and whether it is already overdue?","想確認呢個 case 有冇 SLA，同埋而家係咪已經超時。"],
 ["r14","請給我一個可以追蹤的案件編號和目前負責窗口。","请给我一个可以追踪的案件编号和目前负责窗口。","Please provide a trackable case number and the current point of contact.","請俾一個可以追蹤嘅 case number 同目前負責窗口。"],
 ["r15","如果今天無法解決，請至少確認下一次更新時間。","如果今天无法解决，请至少确认下一次更新时间。","If this can't be resolved today, please at least confirm the next update time.","如果今日解決唔到，至少確認下一次 update 時間。"],
 ["r16","我需要的是時間表，不是『請耐心等待』。","我需要的是时间表，不是“请耐心等待”。","I need a timeline, not another 'please wait patiently'.","我要嘅係 timeline，唔係『請耐心等候』。"],
 ["r17","這個案件已經多次承諾回覆但沒有回覆，請直接升級。","这个案件已经多次承诺回复但没有回复，请直接升级。","This case has missed multiple promised callbacks. Please escalate it now.","呢個 case 已經幾次應承覆但冇覆，請直接 escalate。"],
 ["r18","如果需要主管介入，現在就請主管接手。","如果需要主管介入，现在就请主管接手。","If a supervisor needs to step in, please have them take over now.","如果要 supervisor 介入，依家就請佢接手。"],
 ["r19","我理解處理需要時間，但完全沒有狀態更新不是正常跟進。","我理解处理需要时间，但完全没有状态更新不是正常跟进。","I understand resolution takes time, but no status updates at all isn't reasonable follow-up.","我明處理要時間，但完全冇狀態 update 唔算正常跟進。"],
 ["r20","這個案件目前最大的進展，好像只是日期一直往後走。","这个案件目前最大的进展，好像只是日期一直往后走。","So far the biggest movement in this case seems to be the calendar moving forward.","呢個 case 目前最大進展，好似淨係日期一路向後行。"],
 ["r21","『正在處理』我已經看懂了，我想知道處理到哪一步。","“正在处理”我已经看懂了，我想知道处理到哪一步。","I understand 'in progress'. I want to know what stage it's actually at.","『處理中』我識睇，我想知處理到邊一步。"],
 ["r22","案件 XX 在等待室住得有點久了，麻煩看看什麼時候輪到它。","案件 XX 在等待室住得有点久了，麻烦看看什么时候轮到它。","Case XX has been in the waiting room for quite a while. Could someone check when its turn is?","case XX 喺 waiting room 住咗幾耐，麻煩睇下幾時輪到佢。"],
 ["r23","這張工單好像已經和『處理中』三個字建立長期關係了。","这张工单好像已经和“处理中”三个字建立长期关系了。","This ticket seems to have entered a long-term relationship with the words 'in progress'.","呢張 ticket 好似同『處理中』三個字建立咗長期關係。"],
 ["r24","我不是來收藏客服模板的，我想要案件進度。","我不是来收藏客服模板的，我想要案件进度。","I'm not collecting support templates. I'm trying to get the status of my case.","我唔係嚟收藏客服 template，我想要 case 進度。"],
 ["r25","如果案件沒人接，請直接說，我好要求重新分配。","如果案件没人接，请直接说，我好要求重新分配。","If nobody owns the case, tell me directly so I can ask for reassignment.","如果 case 冇人接，直接講，我好要求重新分配。"],
 ["r26","不要再把我轉回原部門，原部門已經讓我來找你們。","不要再把我转回原部门，原部门已经让我来找你们。","Please don't send me back to the original team; they already sent me to you.","唔好再轉我返原部門，原部門就係叫我嚟搵你哋。"],
 ["r27","這件事如果今天還沒有負責人，我會要求正式升級處理。","这件事如果今天还没有负责人，我会要求正式升级处理。","If this still has no owner today, I'll request a formal escalation.","如果今日仲冇負責人，我會要求正式 escalate。"],
 ["r28","我已經等了 X 天，現在請給結果、時間，或者升級路徑，三選一。","我已经等了 X 天，现在请给结果、时间，或者升级路径，三选一。","I've waited X days. I now need one of three things: a result, a timeline, or an escalation path.","我已經等咗 X 日，依家請俾結果、時間，或者 escalation path，三揀一。"],
 ["r29","別再跟我兜『處理中』了，直接告訴我現在誰負責、什麼時候回。","别再跟我绕“处理中”了，直接告诉我现在谁负责、什么时候回复。","Stop circling around 'in progress'. Tell me who owns it and when I'll hear back.","唔好再同我兜『處理中』，直接講邊個負責、幾時覆。"],
 ["r30","這工單到底還要他媽拖多久？請給一個實際日期。","这工单到底还要他妈拖多久？请给一个实际日期。","How much fucking longer is this ticket going to sit there? Give me an actual date.","呢張 ticket 究竟仲要屌拖幾耐？請俾個實際日期。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}
})();