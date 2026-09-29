;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function get(id){return S.find(x=>x.id===id)}
function reset(s){if(s)s.replies={zh:{},en:{},yue:{}}}
function add(s,key,hant,hans,en,yue){s.replies.zh[key]={hant,hans};s.replies.en[key]=en;s.replies.yue[key]=yue}
function mark(s){if(s)window.CHAT_REVIEWED_SCENES[s.id]=true}

let s=get("w02");
if(s){
 reset(s);
 [
 ["r01","我理解這個方向的考量，不過我擔心 XX 會帶來 Y 風險。要不要先比較一下另一個方案？","我理解这个方向的考虑，不过我担心 XX 会带来 Y 风险。要不要先比较一下另一个方案？","I understand the reasoning, but I'm concerned XX could create Y risk. Could we compare one alternative first?","我明呢個方向嘅考慮，不過我擔心 XX 會帶嚟 Y 風險。不如先比較下另一個方案？"],
 ["r02","我有一個不同看法，主要是基於目前的數據和交期。","我有一个不同看法，主要是基于目前的数据和交期。","I have a different view, mainly based on the current data and timeline.","我有個唔同睇法，主要係基於而家數據同交期。"],
 ["r03","如果目標是 X，我覺得 A 方案可能比現在這個更直接。","如果目标是 X，我觉得 A 方案可能比现在这个更直接。","If the goal is X, I think option A may get us there more directly.","如果目標係 X，我覺得 A 方案可能比而家呢個直接。"],
 ["r04","我想先挑戰一下這個假設：我們確定 XX 一定成立嗎？","我想先挑战一下这个假设：我们确定 XX 一定成立吗？","I'd like to challenge one assumption: are we sure XX is actually true?","我想挑戰下呢個假設：我哋確定 XX 一定成立？"],
 ["r05","這個方案能做，但成本會比看起來高，主要多在 XX。","这个方案能做，但成本会比看起来高，主要多在 XX。","This can work, but the cost is higher than it looks, mainly because of XX.","呢個方案做得到，但成本會比表面高，主要多喺 XX。"],
 ["r06","我建議先做一個小範圍試點，再決定要不要全面推。","我建议先做一个小范围试点，再决定要不要全面推。","I'd suggest a small pilot first, then decide whether to roll it out fully.","我建議先做細範圍 pilot，再決定要唔要全面推。"],
 ["r07","如果一定走這個方向，我建議先把風險和 fallback 寫清楚。","如果一定走这个方向，我建议先把风险和 fallback 写清楚。","If we do go this way, I'd document the risks and fallback plan first.","如果一定行呢個方向，我建議先寫清楚風險同 fallback。"],
 ["r08","我不是反對目標，我是對目前這個做法有保留。","我不是反对目标，我是对目前这个做法有保留。","I'm not against the objective; I have reservations about this approach.","我唔係反對目標，我係對而家個做法有保留。"],
 ["r09","這裡我想提出異議，因為它會直接影響後面的 XX。","这里我想提出异议，因为它会直接影响后面的 XX。","I want to flag a concern here because it directly affects XX downstream.","呢度我想提出異議，因為會直接影響後面 XX。"],
 ["r10","如果今天要拍板，我會投 A，不會投目前這個方案。","如果今天要拍板，我会投 A，不会投目前这个方案。","If we have to decide today, I'd choose A over the current proposal.","如果今日要拍板，我會揀 A，唔會揀而家呢個方案。"],
 ["r11","我可以按這個方案執行，但想先把我看到的風險記錄下來。","我可以按这个方案执行，但想先把我看到的风险记录下来。","I can execute the decision, but I want the risks I've identified recorded first.","我可以跟呢個方案做，但想先記錄低我見到嘅風險。"],
 ["r12","如果這是最終決定，我會配合；但我的專業判斷仍然是不建議。","如果这是最终决定，我会配合；但我的专业判断仍然是不建议。","If this is the final decision, I'll support execution, but my professional recommendation remains against it.","如果呢個係 final decision，我會配合，但我專業判斷仍然唔建議。"],
 ["r13","我們能不能先定義一下成功標準？不然很難判斷這個方案到底值不值得。","我们能不能先定义一下成功标准？不然很难判断这个方案到底值不值得。","Can we define the success criteria first? Otherwise it's hard to judge whether this approach is worth it.","可唔可以先定義成功標準？唔係好難判斷方案值唔值得。"],
 ["r14","我想用數據反駁一下，不是單純憑感覺不同意。","我想用数据反驳一下，不是单纯凭感觉不同意。","I'd like to challenge this with data rather than simply say I disagree.","我想用數據反駁，唔係純粹憑感覺唔同意。"],
 ["r15","這個方向最大的問題不是能不能做，而是做了之後 XX 怎麼收。","这个方向最大的问题不是能不能做，而是做了之后 XX 怎么收。","The biggest issue isn't whether we can do it; it's how we handle XX afterward.","呢個方向最大問題唔係做唔做到，係做完之後 XX 點收。"],
 ["r16","我想站在反方把這個方案壓測一次，看它在哪裡會破。","我想站在反方把这个方案压测一次，看它在哪里会破。","I'd like to pressure-test the proposal from the opposing side and see where it breaks.","我想企反方壓測下個方案，睇下邊度會爆。"],
 ["r17","先別急著一致，我覺得這裡值得多問一句為什麼。","先别急着一致，我觉得这里值得多问一句为什么。","Before we rush to agreement, I think this deserves one more 'why'.","先唔好急住一致，我覺得呢度值得多問一句點解。"],
 ["r18","我有保留，而且不是小保留。","我有保留，而且不是小保留。","I have reservations, and they're not minor ones.","我有保留，而且唔係小保留。"],
 ["r19","我不太認同這個方向。理由有三個，我直接講。","我不太认同这个方向。理由有三个，我直接讲。","I don't really agree with this direction. I have three reasons, so I'll be direct.","我唔太認同呢個方向。理由有三個，我直接講。"],
 ["r20","這個方案現在看起來比較像把問題往後搬，不是解決。","这个方案现在看起来比较像把问题往后搬，不是解决。","Right now this looks more like moving the problem downstream than solving it.","呢個方案而家比較似將問題搬後，唔係解決。"],
 ["r21","如果換我是最後承擔結果的人，我不會選這個方案。","如果换我是最后承担结果的人，我不会选这个方案。","If I were the person ultimately accountable for the outcome, I wouldn't choose this.","如果換我最後孭結果，我唔會揀呢個方案。"],
 ["r22","這個方案很勇敢，我比較擔心現實沒有那麼配合。","这个方案很勇敢，我比较担心现实没有那么配合。","It's a brave proposal. I'm less sure reality will cooperate.","呢個方案幾勇敢，我比較擔心現實冇咁配合。"],
 ["r23","理想很完整，風險管理有點像還沒載入。","理想很完整，风险管理有点像还没加载。","The vision is complete; the risk management looks like it hasn't loaded yet.","理想好完整，風險管理好似仲未 load。"],
 ["r24","我怕我們現在是在對方案有信仰，不是在做判斷。","我怕我们现在是在对方案有信仰，不是在做判断。","I'm worried we're believing in the idea rather than evaluating it.","我驚我哋而家係信個方案，唔係判斷個方案。"],
 ["r25","我就直說，這個方案我覺得不穩。","我就直说，这个方案我觉得不稳。","I'll say it plainly: I don't think this plan is robust.","我直講，呢個方案我覺得唔穩。"],
 ["r26","如果要我簽名背書，我現在不會簽。","如果要我签名背书，我现在不会签。","If I had to put my name behind this right now, I wouldn't.","如果要我簽名背書，我而家唔會簽。"],
 ["r27","這不是我唱反調，是這坑真的看得見。","这不是我唱反调，是这个坑真的看得见。","I'm not being contrary; the pitfall is genuinely visible.","唔係我唱反調，係個坑真係睇得到。"],
 ["r28","你要我配合我會配合，但別說我沒提醒。","你要我配合我会配合，但别说我没提醒。","I'll execute if that's the decision, but don't say the risk wasn't raised.","要我配合我會配合，但唔好話我冇提醒。"],
 ["r29","這個方向要是翻車，我一點都不會意外。","这个方向要是翻车，我一点都不会意外。","If this goes wrong, I won't be surprised.","呢個方向如果翻車，我一啲都唔會意外。"],
 ["r30","我不是很客氣地不同意，我是真的不同意。","我不是很客气地不同意，我是真的不同意。","This isn't a polite little hesitation. I genuinely disagree.","我唔係客氣地保留，我係真係唔同意。"],
 ["r31","這方案我他媽真的不建議，風險已經寫在臉上了。","这方案我他妈真的不建议，风险已经写在脸上了。","I genuinely don't fucking recommend this. The risk is obvious.","呢個方案我屌真係唔建議，風險已經寫喺面。"],
 ["r32","如果只是需要有人點頭，那我不是那個人。","如果只是需要有人点头，那我不是那个人。","If the room only needs someone to nod, I'm not that person.","如果只係需要有人點頭，我唔係嗰個人。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("fr02");
if(s){
 reset(s);
 [
 ["r01","謝謝你約我，不過這次我不去了，下次再約。","谢谢你约我，不过这次我不去了，下次再约。","Thanks for inviting me, but I'll skip this one. Catch you next time.","多謝你約我，不過今次我唔去，下次再約。"],
 ["r02","今晚我已有安排，就不加入了。","今晚我已有安排，就不加入了。","I already have plans tonight, so I won't join.","今晚我已有安排，就唔加入喇。"],
 ["r03","這週有點累，我想把晚上留給自己休息。","这周有点累，我想把晚上留给自己休息。","I'm pretty tired this week and want to keep the evening for rest.","今個星期有啲攰，我想留個夜晚俾自己休息。"],
 ["r04","我這次不去，不用特意替我留位。","我这次不去，不用特意替我留位。","I'm not going this time, so no need to save me a spot.","今次我唔去，唔使特登留位俾我。"],
 ["r05","謝謝想到我，不過這個活動不是很適合我。","谢谢想到我，不过这个活动不是很适合我。","Thanks for thinking of me, but this event isn't really my thing.","多謝諗到我，不過呢個活動唔太啱我。"],
 ["r06","我今晚想安靜一點，就不出門了。","我今晚想安静一点，就不出门了。","I want a quiet night, so I'm staying in.","我今晚想靜啲，就唔出門。"],
 ["r07","這次先 pass，下一個輕鬆點的局再叫我。","这次先 pass，下一个轻松点的局再叫我。","I'll pass this time. Invite me to the next more relaxed one.","今次 pass，下個輕鬆啲嘅局再叫我。"],
 ["r08","我不能待到那麼晚，所以這次不去了。","我不能待到那么晚，所以这次不去了。","I can't stay out that late, so I'll skip it.","我唔可以留到咁夜，所以今次唔去。"],
 ["r09","我最近社交有點飽和，這次想休息。","我最近社交有点饱和，这次想休息。","My social calendar is a bit saturated, so I'm taking a break this time.","我最近社交有啲飽和，今次想休息。"],
 ["r10","我不喝酒，這個酒局我就不參加了。","我不喝酒，这个酒局我就不参加了。","I don't drink, so I'll sit this drinking night out.","我唔飲酒，呢個酒局我就唔參加。"],
 ["r11","我明天早上有事，今晚不去了。","我明天早上有事，今晚不去了。","I have something early tomorrow, so I won't make it tonight.","我聽朝有事，今晚唔去。"],
 ["r12","我這次想省點錢，所以先不參加。","我这次想省点钱，所以先不参加。","I'm trying to save a bit this time, so I'll skip it.","我今次想慳啲錢，所以唔參加。"],
 ["r13","你們去玩，不用因為我改安排。","你们去玩，不用因为我改安排。","You all go have fun; don't change plans because of me.","你哋去玩，唔使因為我改安排。"],
 ["r14","我這次不方便，但不用追問原因，真的沒事。","我这次不方便，但不用追问原因，真的没事。","I can't make it this time. No need to dig for a reason; everything's fine.","我今次唔方便，但唔使追問原因，真係冇事。"],
 ["r15","今天就想宅著，誰都不見。","今天就想宅着，谁都不见。","I just want to stay home today and see nobody.","今日就想宅住，邊個都唔見。"],
 ["r16","我不是不想見你，是今天真的不想社交。","我不是不想见你，是今天真的不想社交。","It's not about you. I genuinely don't feel like socialising today.","唔係唔想見你，係今日真係唔想社交。"],
 ["r17","邀請收到，出席就先不了。","邀请收到，出席就先不了。","Invite received. Attendance declined.","邀請收到，出席就唔喇。"],
 ["r18","這局我退出，祝你們玩得開心。","这局我退出，祝你们玩得开心。","I'm out for this one. Hope you all have fun.","呢局我退出，祝你哋玩得開心。"],
 ["r19","我個社交電池今天不營業。","我的社交电池今天不营业。","My social battery is closed for business today.","我個社交電池今日唔營業。"],
 ["r20","人可以去，靈魂已經先請假了，所以算了。","人可以去，灵魂已经先请假了，所以算了。","My body could go, but my soul has already called in sick.","人可以去，靈魂已經請假，所以算啦。"],
 ["r21","今天的我比較適合跟沙發約會。","今天的我比较适合跟沙发约会。","Tonight I'm better suited to a date with my sofa.","今日嘅我比較適合同張梳化約會。"],
 ["r22","這次不 FOMO，我選擇在家快樂。","这次不 FOMO，我选择在家快乐。","No FOMO this time. I'm choosing happiness at home.","今次唔 FOMO，我揀喺屋企快樂。"],
 ["r23","別再勸啦，我這次真的不去。","别再劝啦，我这次真的不去。","Stop persuading me. I'm genuinely not going this time.","唔好再勸啦，今次真係唔去。"],
 ["r24","我說不去，不是等你加碼說服。","我说不去，不是等你加码说服。","When I say I'm not going, I'm not asking for a stronger sales pitch.","我話唔去，唔係等你加碼說服。"],
 ["r25","我沒欠這個局一個出席率。","我没欠这个局一个出席率。","I don't owe this gathering an attendance percentage.","我冇欠呢個局一個出席率。"],
 ["r26","你們玩你們的，我不去也不會世界末日。","你们玩你们的，我不去也不会世界末日。","You can go have fun. The world won't end because I skip one night.","你哋玩你哋，我唔去都唔會世界末日。"],
 ["r27","我就不去了，真的不用把拒絕變成辯論題。","我就不去了，真的不用把拒绝变成辩论题。","I'm not going. This doesn't need to become a debate.","我唔去，真係唔使將拒絕變辯論題。"],
 ["r28","都說了不去，別他媽一直拉我。","都说了不去，别他妈一直拉我。","I said I'm not going. Stop fucking dragging me into it.","都話唔去，唔好屌一路拉我。"],
 ["r29","今晚不想見人，夠直接了吧。","今晚不想见人，够直接了吧。","I don't want to see people tonight. Direct enough?","今晚唔想見人，夠直接未？"],
 ["r30","這個邀請我拒絕，但友情不用一起取消。","这个邀请我拒绝，但友情不用一起取消。","I'm declining the invitation, not the friendship.","我拒絕呢個邀請，唔係取消友情。"],
 ["r31","下次白天咖啡局我比較有機會出現。","下次白天咖啡局我比较有机会出现。","I'm much more likely to show up for a daytime coffee next time.","下次日頭 coffee 局我比較大機會出現。"],
 ["r32","今天的最佳安排就是沒有安排。","今天的最佳安排就是没有安排。","My best plan today is no plan.","今日最佳安排就係冇安排。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("r02");
if(s){
 reset(s);
 [
 ["r01","我想確認一下，我們現在對這段關係的理解是一樣的嗎？","我想确认一下，我们现在对这段关系的理解是一样的吗？","I want to check whether we're seeing this relationship the same way.","我想確認下，我哋對呢段關係理解係咪一樣。"],
 ["r02","我對你有好感，所以不想一直靠猜。你怎麼看我們？","我对你有好感，所以不想一直靠猜。你怎么看我们？","I like you, and I don't want to keep guessing. How do you see us?","我對你有好感，所以唔想一路靠估。你點睇我哋？"],
 ["r03","你是把我們當朋友，還是有想往感情方向發展？","你是把我们当朋友，还是有想往感情方向发展？","Do you see us as friends, or do you want this to become romantic?","你係當我哋朋友，定想向感情方向發展？"],
 ["r04","我想知道你現在有沒有想認真發展這段關係。","我想知道你现在有没有想认真发展这段关系。","I want to know whether you're interested in seriously developing this relationship.","我想知你而家有冇想認真發展呢段關係。"],
 ["r05","我不是要你現在承諾很遠，只想知道方向。","我不是要你现在承诺很远，只想知道方向。","I'm not asking for a huge future promise. I just want to know the direction.","我唔係要你即刻承諾好遠，只係想知方向。"],
 ["r06","如果你只想輕鬆相處，也可以直接說，我會按那個邊界來。","如果你只想轻松相处，也可以直接说，我会按那个边界来。","If you only want something casual, say so and I'll treat it accordingly.","如果你只想輕鬆相處，可以直接講，我會按嗰個界線嚟。"],
 ["r07","如果你還沒準備好談感情，我也想知道，而不是一直模糊下去。","如果你还没准备好谈感情，我也想知道，而不是一直模糊下去。","If you're not ready for a relationship, I want to know rather than stay in ambiguity.","如果你未準備好談感情，我都想知，唔想一路模糊落去。"],
 ["r08","我想確認我們是不是排他的，還是彼此都可以繼續認識別人。","我想确认我们是不是排他的，还是彼此都可以继续认识别人。","I want to know whether we're exclusive or both still free to date other people.","我想確認我哋係咪 exclusive，定大家都可以繼續識其他人。"],
 ["r09","我不想用行為猜關係，想聽你直接說。","我不想用行为猜关系，想听你直接说。","I don't want to infer the relationship from behaviour. I'd rather hear it directly.","我唔想靠行為估關係，想聽你直接講。"],
 ["r10","最近的相處已經不像普通朋友，所以我想把話說清楚。","最近的相处已经不像普通朋友，所以我想把话说清楚。","The way we've been spending time together doesn't feel purely platonic, so I want to clarify it.","最近相處已經唔太似普通朋友，所以我想講清楚。"],
 ["r11","我喜歡現在的相處，但模糊太久我會不舒服。","我喜欢现在的相处，但模糊太久我会不舒服。","I like what we have, but staying undefined for too long makes me uncomfortable.","我鍾意而家相處，但模糊太耐我會唔舒服。"],
 ["r12","你不用給我漂亮答案，真實答案就好。","你不用给我漂亮答案，真实答案就好。","I don't need a pretty answer. I want an honest one.","你唔使俾靚答案，真實就得。"],
 ["r13","如果你對我沒有同樣的感覺，直接說也沒關係。","如果你对我没有同样的感觉，直接说也没关系。","If you don't feel the same way, it's okay to say it directly.","如果你對我冇同樣感覺，直接講都冇問題。"],
 ["r14","我寧願現在知道答案，也不想半年後才知道我們想的完全不同。","我宁愿现在知道答案，也不想半年后才知道我们想的完全不同。","I'd rather know now than find out six months later that we wanted completely different things.","我寧願而家知答案，都唔想半年後先知大家想法完全唔同。"],
 ["r15","我想把我們的期待對齊一下，免得其中一個人越走越深。","我想把我们的期待对齐一下，免得其中一个人越走越深。","I want to align expectations before one of us gets much more invested.","我想對齊下大家期待，免得其中一個越行越深。"],
 ["r16","如果只是曖昧，不會再往前，我需要知道。","如果只是暧昧，不会再往前，我需要知道。","If this is only going to stay ambiguous and never progress, I need to know.","如果只係曖昧，唔會再向前，我需要知。"],
 ["r17","我可以接受慢，但不能接受一直沒有方向。","我可以接受慢，但不能接受一直没有方向。","I can accept slow. I can't accept directionless forever.","我可以接受慢，但唔接受一路冇方向。"],
 ["r18","我們現在到底算什麼？我想聽你版本。","我们现在到底算什么？我想听你的版本。","What are we, in your words?","我哋而家究竟算咩？我想聽你版本。"],
 ["r19","我先坦白：我不是只把你當普通朋友。","我先坦白：我不是只把你当普通朋友。","I'll be honest first: I don't see you as just a friend.","我先坦白：我唔係淨係當你普通朋友。"],
 ["r20","如果我們方向不一樣，現在說清楚比拖著好。","如果我们方向不一样，现在说清楚比拖着好。","If we want different things, it's better to say it now than drag it out.","如果大家方向唔同，依家講清楚好過拖。"],
 ["r21","這段關係不能永遠停在『你猜我猜』模式。","这段关系不能永远停在“你猜我猜”模式。","This relationship can't stay in guessing mode forever.","呢段關係唔可以永遠停喺『你估我估』mode。"],
 ["r22","我們的關係名稱欄空太久了，我想填一下。","我们的关系名称栏空太久了，我想填一下。","The relationship label has been blank for a while. I'd like to fill it in.","我哋個關係名稱欄空咗太耐，我想填返。"],
 ["r23","目前體驗很好，但我想知道這是 trial 還是正式版。","目前体验很好，但我想知道这是 trial 还是正式版。","The experience is good; I just want to know whether this is trial mode or the real thing.","目前體驗幾好，但我想知係 trial 定正式版。"],
 ["r24","曖昧可以有氣氛，但不能只有氣氛。","暧昧可以有气氛，但不能只有气氛。","Ambiguity can have chemistry, but it can't be only chemistry forever.","曖昧可以有氣氛，但唔可以得氣氛。"],
 ["r25","我不想再靠朋友圈、回覆速度和語氣猜你的心。","我不想再靠朋友圈、回复速度和语气猜你的心。","I don't want to read your feelings through posts, reply times and tone anymore.","我唔想再靠朋友圈、回覆速度同語氣估你個心。"],
 ["r26","你如果只想享受曖昧、不想承擔關係，直接說。","你如果只想享受暧昧、不想承担关系，直接说。","If you only want the fun of ambiguity without the relationship, say it directly.","如果你只想享受曖昧、唔想承擔關係，直接講。"],
 ["r27","我不是逼你確定關係，我是在決定自己要不要繼續投入。","我不是逼你确定关系，我是在决定自己要不要继续投入。","I'm not forcing a label; I'm deciding whether I should keep investing emotionally.","我唔係逼你定關係，我係決定自己仲投唔投入。"],
 ["r28","別一邊做情侶的事，一邊說我們什麼都不是。","别一边做情侣的事，一边说我们什么都不是。","Don't do relationship things while insisting we're nothing.","唔好一邊做情侶嘅事，一邊話我哋乜都唔係。"],
 ["r29","我要的不是名分表演，是一致的期待。","我要的不是名分表演，是一致的期待。","I'm not asking for a performative label. I'm asking for aligned expectations.","我要嘅唔係名分表演，係一致期待。"],
 ["r30","如果答案是不想發展，現在說，我會退回自己的位置。","如果答案是不想发展，现在说，我会退回自己的位置。","If you don't want this to develop, say so now and I'll step back.","如果答案係唔想發展，依家講，我會退返自己位置。"],
 ["r31","別他媽一邊吊著我，一邊又說不清楚。","别他妈一边吊着我，一边又说不清楚。","Don't fucking keep me hanging while refusing to define anything.","唔好屌一邊吊住我，一邊又乜都唔講清楚。"],
 ["r32","我可以接受不在一起，但不接受無限期不明不白。","我可以接受不在一起，但不接受无限期不明不白。","I can accept us not being together. I can't accept indefinite ambiguity.","我可以接受唔一齊，但唔接受無限期唔清唔楚。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}
})();