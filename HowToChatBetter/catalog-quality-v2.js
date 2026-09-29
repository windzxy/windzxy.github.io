// Quality-first replacement for template-heavy persona variants.
// Removes persona-* generated wrappers, classifies each scene by communicative intent,
// and backfills with structurally different multilingual utterances.
;(function(){
const scenes=window.CHAT_SCENARIOS||[];

function q(hant,hans,en,yue){return {hant,hans,en,yue}}
const BANKS={
assertive:[
q("不，這個我不接。","不，这个我不接。","No. I'm not taking this on.","唔，呢個我唔接。"),
q("答案已經很清楚，不需要第二輪說服。","答案已经很清楚，不需要第二轮说服。","The answer is already clear. This doesn't need another round of persuasion.","答案已經好清楚，唔需要第二輪說服。"),
q("你可以不高興，但我的答案不變。","你可以不高兴，但我的答案不变。","You can dislike the answer. It still doesn't change.","你可以唔高興，但我答案唔變。"),
q("我是在告知界線，不是在徵求批准。","我是在告知界限，不是在征求批准。","I'm stating a boundary, not asking for permission.","我係講界線，唔係問你批唔批准。"),
q("這件事到我這裡為止。","这件事到我这里为止。","This stops here with me.","呢件事到我呢度為止。"),
q("別再往我這邊推。","别再往我这边推。","Stop pushing this onto me.","唔好再推過嚟我呢邊。"),
q("我可以理解，不代表我會接受。","我可以理解，不代表我会接受。","I can understand it without accepting it.","我可以理解，唔代表我要接受。"),
q("配合不是沒有底線。","配合不是没有底线。","Being cooperative doesn't mean having no limits.","配合唔係冇底線。"),
q("這個要求超出我能接受的範圍。","这个要求超出我能接受的范围。","This goes beyond what I'm willing to accept.","呢個要求超出我接受範圍。"),
q("我已經說過一次，這次不再繞。","我已经说过一次，这次不再绕。","I've said it once. I'm not circling it again.","我已經講過一次，今次唔再兜。"),
q("這不是商量題，我的決定已經做了。","这不是商量题，我的决定已经做了。","This isn't an open negotiation. I've made my decision.","呢個唔係商量題，我已經決定咗。"),
q("不用替我決定，我自己來。","不用替我决定，我自己来。","Don't decide for me. I'll decide for myself.","唔使代我決定，我自己嚟。"),
q("先停，這個做法我不接受。","先停，这个做法我不接受。","Stop there. I don't accept this approach.","停一停，呢個做法我唔接受。"),
q("你有你的立場，我也有我的底線。","你有你的立场，我也有我的底线。","You have your position. I have my boundary.","你有你立場，我都有我底線。"),
q("要談可以，先別把責任往我身上放。","要谈可以，先别把责任往我身上放。","We can talk, but don't put the responsibility on me first.","要傾可以，先唔好將責任擺落我度。"),
q("我不欠這個配合。","我不欠这个配合。","I don't owe this accommodation.","我唔欠呢個配合。"),
q("別把我的客氣當默認。","别把我的客气当默认。","Don't mistake my politeness for consent.","唔好當我客氣就係默認。"),
q("我不吵，但也不退。","我不吵，但也不退。","I'm not shouting, and I'm not backing down.","我唔嘈，但我都唔退。"),
q("你可以繼續講，我還是不同意。","你可以继续讲，我还是不同意。","You can keep talking. I still disagree.","你可以繼續講，我都係唔同意。"),
q("這條線不要再越。","这条线不要再越。","Don't cross this line again.","呢條線唔好再過。"),
q("別把問題包裝一下就當它沒問題。","别把问题包装一下就当它没问题。","Repackaging the problem doesn't make it acceptable.","唔好包裝下個問題就當佢冇問題。"),
q("我不吃這一套。","我不吃这一套。","I'm not buying this.","我唔食呢套。"),
q("省省吧，這招對我沒用。","省省吧，这招对我没用。","Save it. That doesn't work on me.","慳啲啦，呢招對我冇用。"),
q("你這操作挺有想法，可惜我不接。","你这操作挺有想法，可惜我不接。","Creative move. Still not my problem.","你呢個操作幾有想法，可惜我唔接。"),
q("說得再漂亮，結果還是一樣。","说得再漂亮，结果还是一样。","Dress it up however you like. The answer stays the same.","講得再靚，結果都係一樣。"),
q("原來這也能算合理，長見識了。","原来这也能算合理，长见识了。","Apparently this counts as reasonable now. Good to know.","原來咁都算合理，長見識。"),
q("你這邏輯挺完整，就是跟我沒關係。","你这逻辑挺完整，就是跟我没关系。","Your logic is very complete. It still doesn't make it my responsibility.","你個邏輯幾完整，就係同我冇關係。"),
q("別他媽再往我這裡塞。","别他妈再往我这里塞。","Stop fucking dumping this on me.","唔好屌再塞過嚟我度。"),
q("我已經夠給面子了，別逼我把話說更難聽。","我已经够给面子了，别逼我把话说更难听。","I've been polite enough. Don't make me say it less nicely.","我已經夠俾面，唔好逼我講得再難聽。"),
q("你要真想解決，就別再玩這些有的沒的。","你要真想解决，就别再玩这些有的没的。","If you actually want to solve it, drop the games.","你真係想解決，就唔好再玩呢啲有冇嘅。"),
q("這鍋誰的誰拿回去。","这锅谁的谁拿回去。","Whoever owns this mess can take it back.","呢隻鑊邊個嘅邊個拎返。"),
q("我不是垃圾桶，別什麼都往這裡倒。","我不是垃圾桶，别什么都往这里倒。","I'm not a bin. Stop dumping everything here.","我唔係垃圾桶，唔好乜都倒過嚟。"),
q("到此為止，下一個話題。","到此为止，下一个话题。","That's enough. Next topic.","到此為止，下一個話題。"),
q("我給的是答案，不是邀請你繼續討價還價。","我给的是答案，不是邀请你继续讨价还价。","I gave you an answer, not an invitation to bargain.","我俾嘅係答案，唔係邀請你繼續講價。"),
q("不接受，沒別的版本。","不接受，没别的版本。","Not accepted. There isn't another version.","唔接受，冇第二個版本。"),
q("如果角色對調，你自己會接受嗎？","如果角色对调，你自己会接受吗？","If the roles were reversed, would you accept this?","調轉角色，你自己受唔受？")
],
inquiry:[
q("我只需要一個明確答案。","我只需要一个明确答案。","I only need a clear answer.","我只要一個清楚答案。"),
q("請直接告訴我現在的狀態。","请直接告诉我现在的状态。","Tell me the current status directly.","直接話我知而家咩狀態。"),
q("能做就說能做，不能做也請直說。","能做就说能做，不能做也请直说。","If it can be done, say so. If not, say that clearly too.","做到就講做到，做唔到都直接講。"),
q("我不需要模糊回覆，我需要下一步。","我不需要模糊回复，我需要下一步。","I don't need a vague reply. I need the next step.","我唔要模糊回覆，我要下一步。"),
q("先給我重點，細節後面再補。","先给我重点，细节后面再补。","Give me the key point first. Details can follow.","先俾重點，細節後面再補。"),
q("我想確認，我理解得對不對？","我想确认，我理解得对不对？","I want to check whether I've understood correctly.","我想確認下，我理解啱唔啱？"),
q("這裡我有一個疑問，麻煩說清楚。","这里我有一个疑问，麻烦说清楚。","I have one question here. Please clarify it.","呢度我有一個問題，麻煩講清楚。"),
q("別給我結論，先告訴我原因。","别给我结论，先告诉我原因。","Don't just give me the conclusion. Tell me why.","唔好淨係俾結論，先講原因。"),
q("如果今天不能完成，請給我一個實際時間。","如果今天不能完成，请给我一个实际时间。","If it can't be done today, give me a realistic time.","如果今日做唔到，俾個實際時間我。"),
q("現在卡在哪一步？","现在卡在哪一步？","What exactly is blocking it right now?","而家卡喺邊一步？"),
q("誰在處理？什麼時候有結果？","谁在处理？什么时候有结果？","Who's handling it, and when should I expect an answer?","邊個處理緊？幾時有結果？"),
q("先別兜圈，我問的是具體時間。","先别兜圈，我问的是具体时间。","Let's skip the circles. I'm asking for a specific time.","唔好兜圈，我問緊具體時間。"),
q("我需要的是可執行資訊，不是安慰。","我需要的是可执行信息，不是安慰。","I need actionable information, not reassurance.","我要嘅係做到嘅資訊，唔係安慰。"),
q("可以用一句話說最重要的部分嗎？","可以用一句话说最重要的部分吗？","Can you give me the most important point in one sentence?","可唔可以一句講最重要嗰部分？"),
q("換個簡單點的說法，我想確定自己真的懂。","换个简单点的说法，我想确定自己真的懂。","Could you put that more simply? I want to make sure I truly understand.","換個簡單啲講法，我想確定自己真係明。"),
q("如果有兩個選項，差別在哪？","如果有两个选项，差别在哪？","If there are two options, what's the practical difference?","如果有兩個選項，實際差別係邊？"),
q("最壞情況是什麼？","最坏情况是什么？","What's the worst-case scenario?","最壞情況係咩？"),
q("這件事如果不做，會發生什麼？","这件事如果不做，会发生什么？","What happens if this isn't done?","呢件事如果唔做，會點？"),
q("我想知道標準，不想靠猜。","我想知道标准，不想靠猜。","I'd like the criteria instead of guessing.","我想知標準，唔想靠估。"),
q("先把範圍說清楚，我再決定。","先把范围说清楚，我再决定。","Clarify the scope first, then I'll decide.","先講清楚 scope，我再決定。"),
q("有沒有書面版本可以確認？","有没有书面版本可以确认？","Is there a written version I can check?","有冇書面版本可以確認？"),
q("麻煩給一個可以落地的說法。","麻烦给一个可以落地的说法。","Please give me something concrete enough to act on.","麻煩俾一個落地嘅講法。"),
q("我不怕答案不好聽，我怕沒有答案。","我不怕答案不好听，我怕没有答案。","I don't mind an unpleasant answer. I mind having no answer.","我唔怕答案難聽，我怕冇答案。"),
q("現在到底是能、不能，還是還不知道？","现在到底是能、不能，还是还不知道？","Is it yes, no, or still unknown?","而家究竟係得、唔得，定仲未知？"),
q("你先告訴我事實，我自己判斷。","你先告诉我事实，我自己判断。","Give me the facts first. I'll make my own judgment.","你先俾事實我，我自己判斷。"),
q("不要只說『處理中』，處理到哪裡？","不要只说“处理中”，处理到哪里？","Don't just say 'in progress'. Progressed to where?","唔好淨係講『處理中』，處理到邊？"),
q("我問得很簡單：現在有沒有？","我问得很简单：现在有没有？","Simple question: is it available now or not?","我問得好簡單：而家有冇？"),
q("能不能直接給我一個 yes 或 no？","能不能直接给我一个 yes 或 no？","Can I get a straight yes or no?","可唔可以直接俾個 yes or no？"),
q("我不是來猜謎的。","我不是来猜谜的。","I'm not here to solve a riddle.","我唔係嚟估謎。"),
q("這回答資訊量約等於沒回答。","这回答的信息量约等于没回答。","That answer contained roughly the same information as no answer.","呢個回答資訊量差唔多等於冇答。"),
q("可以，現在請把人話版本也給我。","可以，现在请把人话版本也给我。","Great. Now give me the human-language version.","得，而家麻煩俾埋人話版本。"),
q("我腦袋不是 API 文件，麻煩說直白一點。","我脑袋不是 API 文档，麻烦说直白一点。","My brain isn't API documentation. Make it plain.","我個腦唔係 API 文件，講直白啲。"),
q("省流：到底怎麼辦？","省流：到底怎么办？","TL;DR: what do I actually do?","省流：究竟點做？"),
q("你可以慢慢解釋，但先回答我的問題。","你可以慢慢解释，但先回答我的问题。","You can explain afterward. Answer my question first.","你可以慢慢解釋，但先答我問題。"),
q("我只想確認一件事，別把題目做大。","我只想确认一件事，别把题目做大。","I'm checking one thing. Let's not expand the question.","我只係想確認一樣，唔好將題目放大。"),
q("如果你也不確定，直接說不確定就好。","如果你也不确定，直接说不确定就好。","If you're unsure too, just say you're unsure.","如果你都唔確定，直接講唔確定就得。")
],
care:[
q("我先聽你說，不急著下結論。","我先听你说，不急着下结论。","I'll listen first. We don't need a conclusion yet.","我先聽你講，唔急住落結論。"),
q("你先不用把自己罵一遍。","你先不用把自己骂一遍。","You don't need to attack yourself first.","你先唔使鬧自己一輪。"),
q("先把眼前這一步做好就夠了。","先把眼前这一步做好就够了。","Let's handle the next step first. That's enough for now.","先做好眼前呢一步就夠。"),
q("你可以難受，不用立刻振作。","你可以难受，不用立刻振作。","You're allowed to feel bad. You don't have to bounce back immediately.","你可以難受，唔使即刻振作。"),
q("先告訴我最讓你不舒服的是哪一部分。","先告诉我最让你不舒服的是哪一部分。","Tell me which part is bothering you most.","先話我知最令你唔舒服係邊部分。"),
q("我不是來責怪你的，我們一起處理。","我不是来责怪你的，我们一起处理。","I'm not here to blame you. We'll deal with it together.","我唔係嚟怪你，我哋一齊處理。"),
q("先確認安全，再談對錯。","先确认安全，再谈对错。","Safety first. Right and wrong can wait.","先確認安全，再講對錯。"),
q("這件事不需要你一個人扛。","这件事不需要你一个人扛。","You don't have to carry this alone.","呢件事唔需要你一個人頂。"),
q("我們慢一點，把事情拆小。","我们慢一点，把事情拆小。","Let's slow down and make the problem smaller.","我哋慢啲，將件事拆細。"),
q("你現在最需要的是什麼？","你现在最需要的是什么？","What do you need most right now?","你而家最需要咩？"),
q("我可以陪你，但不替你做決定。","我可以陪你，但不替你做决定。","I can stay with you without deciding for you.","我可以陪你，但唔代你決定。"),
q("先把感受說出來，辦法等一下再找。","先把感受说出来，办法等一下再找。","Say how you feel first. We can look for solutions afterward.","先講感受，辦法等陣再搵。"),
q("這不是你整個人的問題，只是眼前的一件事。","这不是你整个人的问题，只是眼前的一件事。","This is one problem, not a verdict on who you are.","呢個只係眼前一件事，唔係對你成個人嘅判決。"),
q("我們看事實，不用先把自己判死刑。","我们看事实，不用先把自己判死刑。","Let's look at the facts before you condemn yourself.","先睇事實，唔使急住判自己死刑。"),
q("現在先不用做到完美。","现在先不用做到完美。","You don't need to do this perfectly right now.","而家唔使做到完美。"),
q("如果你不知道怎麼說，我可以等。","如果你不知道怎么说，我可以等。","If you don't know how to say it yet, I can wait.","如果你唔知點講，我可以等。"),
q("先休息一下，不代表逃避。","先休息一下，不代表逃避。","Taking a short break isn't the same as avoiding it.","休息一陣唔代表逃避。"),
q("我們先做能控制的部分。","我们先做能控制的部分。","Let's start with what we can control.","我哋先做控制到嗰部分。"),
q("你不需要用害怕來證明你在乎。","你不需要用害怕来证明你在乎。","You don't need fear to prove that you care.","你唔需要用驚嚟證明你在乎。"),
q("我知道你不喜歡，但這條界線還是要有。","我知道你不喜欢，但这条界限还是要有。","I know you don't like it, but this boundary still matters.","我知你唔鍾意，但呢條界線都要有。"),
q("可以哭，可以生氣，但不能傷害自己或別人。","可以哭，可以生气，但不能伤害自己或别人。","You can cry and be angry. You can't hurt yourself or someone else.","可以喊，可以嬲，但唔可以傷害自己或者人。"),
q("我會認真聽，不笑你。","我会认真听，不笑你。","I'll listen seriously. I'm not going to laugh at you.","我會認真聽，唔會笑你。"),
q("我們先確認你有沒有理解錯，再決定怎麼辦。","我们先确认你有没有理解错，再决定怎么办。","Let's check what happened before deciding what to do.","我哋先確認有冇理解錯，再決定點做。"),
q("不用怕說錯，先說你知道的。","不用怕说错，先说你知道的。","Don't worry about saying it perfectly. Start with what you know.","唔使驚講錯，先講你知道嘅。"),
q("我不會因為你犯錯就不愛你。","我不会因为你犯错就不爱你。","A mistake doesn't make me stop caring about you.","你犯錯唔會令我唔愛你。"),
q("先別急著道歉，先弄清楚發生了什麼。","先别急着道歉，先弄清楚发生了什么。","Don't rush into apologising. First understand what happened.","先唔好急住道歉，先搞清楚發生咩事。"),
q("這次做不好，不代表下次也做不好。","这次做不好，不代表下次也做不好。","Doing badly this time doesn't mean next time will be the same.","今次做唔好，唔代表下次都做唔好。"),
q("如果身體不舒服，我們不靠猜。","如果身体不舒服，我们不靠猜。","If something feels wrong physically, we don't rely on guessing.","身體唔舒服，我哋唔靠估。"),
q("不確定就問專業的人，這不是小題大做。","不确定就问专业的人，这不是小题大做。","When we're unsure, asking a professional isn't overreacting.","唔確定就問專業人士，唔係小題大做。"),
q("今天的目標不是贏，是處理好。","今天的目标不是赢，是处理好。","The goal today isn't to win. It's to handle this well.","今日目標唔係贏，係處理好。"),
q("先把聲音放低，我會聽你完整講。","先把声音放低，我会听你完整讲。","Lower the volume and I'll hear you all the way through.","先細聲啲，我會聽你完整講。"),
q("你可以選方法，但不能跳過這件事。","你可以选方法，但不能跳过这件事。","You can choose how to do it, but not whether to do it.","你可以揀方法，但唔可以跳過件事。"),
q("我們不是敵人。","我们不是敌人。","We're not enemies here.","我哋唔係敵人。"),
q("我會站在你這邊，但也會把該說的說清楚。","我会站在你这边，但也会把该说的说清楚。","I'm on your side, and I'll still be honest with you.","我會企你呢邊，但該講嘅都會講清楚。"),
q("這件事可以慢慢來，不需要今天一次解決完。","这件事可以慢慢来，不需要今天一次解决完。","This can take time. We don't have to solve everything today.","呢件事可以慢慢嚟，唔使今日一次過解決晒。"),
q("先照顧好自己，再處理後面的事。","先照顾好自己，再处理后面的事。","Take care of yourself first. The rest can come after.","先照顧好自己，再處理後面。")
],
negotiate:[
q("我們先把各自最在意的點說清楚。","我们先把各自最在意的点说清楚。","Let's state what matters most to each of us first.","我哋先講清楚各自最在意咩。"),
q("這件事不是只有一個做法。","这件事不是只有一个做法。","There isn't only one way to handle this.","呢件事唔係得一個做法。"),
q("你退一步，我也可以退一步。","你退一步，我也可以退一步。","If you move a little, I can move a little too.","你退一步，我都可以退一步。"),
q("先找共同點，再談分歧。","先找共同点，再谈分歧。","Let's start with what we agree on, then handle the differences.","先搵共同點，再講分歧。"),
q("我不是要贏，我要一個能長期用的做法。","我不是要赢，我要一个能长期用的做法。","I'm not trying to win. I want something sustainable.","我唔係要贏，我要一個長期用到嘅做法。"),
q("可以各走一半，不必誰全贏。","可以各走一半，不必谁全赢。","We can meet halfway. Nobody has to win everything.","可以各行一半，唔使邊個全贏。"),
q("先把不能退的部分標出來。","先把不能退的部分标出来。","Let's identify the non-negotiables first.","先標出邊啲係唔可以退。"),
q("剩下的部分我們可以交換。","剩下的部分我们可以交换。","We can trade on the parts that remain flexible.","剩低部分可以交換。"),
q("我願意談條件，不接受模糊。","我愿意谈条件，不接受模糊。","I'm willing to negotiate terms, not ambiguity.","我願意傾條件，但唔接受模糊。"),
q("如果範圍變，時間或成本也要跟著變。","如果范围变，时间或成本也要跟着变。","If the scope changes, time or cost has to change too.","如果 scope 變，時間或者成本都要跟住變。"),
q("我們可以換方案，不要假裝條件沒變。","我们可以换方案，不要假装条件没变。","We can change the plan. Let's not pretend the conditions stayed the same.","可以換方案，但唔好扮條件冇變。"),
q("我可以接受 A，但 B 不行。","我可以接受 A，但 B 不行。","I can accept A. B doesn't work for me.","A 我可以接受，B 唔得。"),
q("這不是全有或全無，可以拆開談。","这不是全有或全无，可以拆开谈。","This doesn't have to be all or nothing. We can split it up.","呢個唔係全有或全無，可以拆開傾。"),
q("先別急著說不行，看看哪一部分能改。","先别急着说不行，看看哪一部分能改。","Before saying no to everything, let's see what can move.","先唔好急住話唔得，睇下邊部分可以改。"),
q("我需要的是公平，不是完全一樣。","我需要的是公平，不是完全一样。","I need fairness, not perfect equality.","我要嘅係公平，唔係完全一樣。"),
q("如果今天定不下來，就先不要硬定。","如果今天定不下来，就先不要硬定。","If we can't decide well today, we don't need to force it.","如果今日定唔到，就唔好夾硬定。"),
q("我們先把假設拿掉，只看實際情況。","我们先把假设拿掉，只看实际情况。","Let's remove the assumptions and look at the actual situation.","先拎走假設，淨係睇實際情況。"),
q("不要拿情緒代替條件。","不要拿情绪代替条件。","Let's not replace terms with emotion.","唔好用情緒代替條件。"),
q("我聽到了你的要求，現在也請聽我的。","我听到了你的要求，现在也请听我的。","I've heard your request. Now hear mine.","我聽到你要求，而家都請聽我。"),
q("你可以選擇不同意，但不能當我沒說。","你可以选择不同意，但不能当我没说。","You can disagree. You can't pretend I didn't say it.","你可以唔同意，但唔可以當我冇講。"),
q("這個價格可以談，前提是內容也一起談。","这个价格可以谈，前提是内容也一起谈。","The price can move if the scope moves with it.","價錢可以傾，前提係內容都一齊傾。"),
q("要快、要好、要便宜，至少選兩個。","要快、要好、要便宜，至少选两个。","Fast, good, cheap: pick two.","要快、要好、要平，至少揀兩個。"),
q("你要的不是不行，只是不能全部同時要。","你要的不是不行，只是不能全部同时要。","What you want isn't impossible. You just can't have all of it at once.","你要嘅唔係唔得，只係唔可以全部同時要。"),
q("我不是拒絕合作，我是在要求合作有規則。","我不是拒绝合作，我是在要求合作有规则。","I'm not refusing to cooperate. I'm asking for rules around cooperation.","我唔係拒絕合作，我係要求合作有規矩。"),
q("先把口頭共識寫下來。","先把口头共识写下来。","Let's put the verbal agreement in writing.","先將口頭共識寫低。"),
q("今天講清楚，後面大家都省事。","今天讲清楚，后面大家都省事。","Clarity today saves everyone trouble later.","今日講清楚，後面大家都省事。"),
q("如果你的方案是唯一答案，那這就不是討論。","如果你的方案是唯一答案，那这就不是讨论。","If your option is the only acceptable answer, this isn't a discussion.","如果你方案係唯一答案，呢個就唔係討論。"),
q("別急著把妥協理解成我認輸。","别急着把妥协理解成我认输。","Don't mistake compromise for surrender.","唔好當我妥協就係認輸。"),
q("我可以給台階，但不是給無限額度。","我可以给台阶，但不是给无限额度。","I can give some room, not unlimited room.","我可以俾台階，但唔係無限額度。"),
q("我們談的是合作，不是誰壓過誰。","我们谈的是合作，不是谁压过谁。","We're discussing cooperation, not dominance.","我哋傾緊合作，唔係邊個壓過邊個。"),
q("別拿『大家都這樣』當理由。","别拿“大家都这样”当理由。","'Everyone does it' isn't a reason.","唔好攞『大家都係咁』當理由。"),
q("這個方案很方便你，但不代表對我公平。","这个方案很方便你，但不代表对我公平。","This may be convenient for you. That doesn't make it fair to me.","呢個方案方便你，唔代表對我公平。"),
q("可以，我們把代價也一起算進去。","可以，我们把代价也一起算进去。","Sure. Let's include the cost of that choice too.","可以，我哋將代價都一齊計。"),
q("別只談你得到什麼，也談我承擔什麼。","别只谈你得到什么，也谈我承担什么。","Don't only discuss what you gain. Include what I carry.","唔好淨係講你得到咩，都講下我承擔咩。"),
q("如果沒有雙方都能接受的版本，就先不定。","如果没有双方都能接受的版本，就先不定。","If neither side can accept it, we don't need to force a deal yet.","如果冇雙方都接受到嘅版本，就先唔定。"),
q("我願意繼續談，但不是無限談。","我愿意继续谈，但不是无限谈。","I'm willing to keep talking, not forever.","我願意繼續傾，但唔係無限傾。")
]
};

function intent(scene){
 const g=(scene.goal?.hant||"")+(scene.goal?.hans||"");
 if(scene.domain==="parenting") return "care";
 if(scene.domain==="medical"&&!/(問|询|詢|確認|确认|要求|追問|追问)/.test(g)) return "care";
 if(/拒|制止|停止|保護|保护|界線|边界|反對|反对|追究|投訴|投诉|不再|阻止/.test(g)) return "assertive";
 if(/問|询|詢|確認|确认|要求|催|追|跟進|跟进|進度|进度|澄清|解釋|解释|說明|说明|了解/.test(g)) return "inquiry";
 if(/安慰|鼓勵|鼓励|陪|照顧|照顾|道歉|修復|修复/.test(g)) return "care";
 return "negotiate";
}
function stripGenerated(scene){
 for(const lang of ["zh","en","yue"]){
  const box=scene.replies?.[lang]||{};
  for(const k of Object.keys(box)) if(/^persona-/.test(k)||/^qv2-/.test(k)) delete box[k];
 }
}
function textFor(scene,key,lang,script){
 const v=scene.replies?.[lang]?.[key];
 return lang==="zh"?(v?.[script]||""):(typeof v==="string"?v:"");
}
function norm(s){
 return String(s).toLowerCase()
  .replace(/[，。！？；：、,.!?;:'"“”‘’（）()【】\[\]—\-…]/g,"")
  .replace(/\s+/g,"");
}
function grams(s){
 const a=new Set(); for(let i=0;i<s.length-1;i++)a.add(s.slice(i,i+2)); return a;
}
function similarity(a,b){
 a=norm(a);b=norm(b); if(!a||!b)return 0;
 const A=grams(a),B=grams(b);let hit=0;for(const x of A)if(B.has(x))hit++;
 return hit/(A.size+B.size-hit||1);
}
function tooClose(line,chosen){
 return chosen.some(x=>similarity(line,x)>=0.52||norm(line)===norm(x));
}
for(const scene of scenes){
 stripGenerated(scene);
 const type=intent(scene), bank=BANKS[type];
 const existing=Object.keys(scene.replies.zh||{});
 const chosenH=existing.map(k=>textFor(scene,k,"zh","hant")).filter(Boolean);
 let n=1;
 for(const item of bank){
  if(Object.keys(scene.replies.zh).length>=36)break;
  if(tooClose(item.hant,chosenH))continue;
  const key="qv2-"+String(n++).padStart(2,"0");
  scene.replies.zh[key]={hant:item.hant,hans:item.hans};
  scene.replies.en[key]=item.en;
  scene.replies.yue[key]=item.yue;
  chosenH.push(item.hant);
 }
 // Rare fallback: keep the 30+ invariant even if a bank was heavily filtered.
 let bi=0;
 while(Object.keys(scene.replies.zh).length<31&&bi<bank.length){
  const item=bank[bi++], key="qv2-f"+String(bi).padStart(2,"0");
  if(scene.replies.zh[key])continue;
  scene.replies.zh[key]={hant:item.hant,hans:item.hans};
  scene.replies.en[key]=item.en; scene.replies.yue[key]=item.yue;
 }
}
})();