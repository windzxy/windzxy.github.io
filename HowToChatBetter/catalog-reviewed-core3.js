;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function get(id){return S.find(x=>x.id===id)}
function add(s,key,hant,hans,en,yue){s.replies.zh[key]={hant,hans};s.replies.en[key]=en;s.replies.yue[key]=yue}
function clearQ(s){if(!s)return;for(const lang of ["zh","en","yue"]){for(const k of Object.keys(s.replies?.[lang]||{}))if(/^qv2-/.test(k))delete s.replies[lang][k]}}
function mark(s){if(s)window.CHAT_REVIEWED_SCENES[s.id]=true}

let s=get("fr01");
if(s){
 clearQ(s);
 [
 ["rv01","這筆錢我不借，但如果你需要，我可以陪你一起看看其他解決方式。","这笔钱我不借，但如果你需要，我可以陪你一起看看其他解决方式。","I won't lend the money, but I can help you think through other options.","呢筆錢我唔借，但如果你需要，我可以陪你諗其他方法。"],
 ["rv02","我有自己的原則，不和朋友做金錢借貸。","我有自己的原则，不和朋友做金钱借贷。","I have a rule not to lend money within friendships.","我有自己原則，唔同朋友做金錢借貸。"],
 ["rv03","這筆金額超出我願意承擔的範圍，所以答案是不借。","这笔金额超出我愿意承担的范围，所以答案是不借。","That amount is beyond what I'm willing to risk, so my answer is no.","呢個金額超出我願意承擔範圍，所以答案係唔借。"],
 ["rv04","我不想因為還款問題把朋友關係變質。","我不想因为还款问题把朋友关系变质。","I don't want repayment issues changing our friendship.","我唔想因為還錢問題搞到朋友關係變質。"],
 ["rv05","我的預算沒有這筆可借出的錢。","我的预算没有这笔可借出的钱。","I don't have this amount available to lend.","我個 budget 冇呢筆可以借出去嘅錢。"],
 ["rv06","我可以幫你找資訊，但不會用借錢的方式幫。","我可以帮你找信息，但不会用借钱的方式帮。","I can help with information, but not by lending money.","我可以幫你搵資料，但唔會用借錢方式幫。"],
 ["rv07","這件事不用再說服我，我已經決定不借。","这件事不用再说服我，我已经决定不借。","There's no need to persuade me further. I've decided not to lend it.","呢件事唔使再說服我，我已經決定唔借。"],
 ["rv08","不是針對你，我對誰都用同一個借錢原則。","不是针对你，我对谁都用同一个借钱原则。","It's not personal. I use the same lending rule with everyone.","唔係針對你，我對邊個都用同一個借錢原則。"],
 ["rv09","我寧願這次讓你不高興，也不想之後因為錢傷感情。","我宁愿这次让你不高兴，也不想之后因为钱伤感情。","I'd rather disappoint you now than damage the friendship over money later.","我寧願今次令你唔開心，都唔想之後因為錢傷感情。"],
 ["rv10","如果你只是需要人陪你梳理現金流，我可以幫。借款就不行。","如果你只是需要人陪你梳理现金流，我可以帮。借款就不行。","If you want help working through your cash flow, I can help. Lending money is off the table.","如果你要人陪你整理 cash flow，我可以幫。借錢就唔得。"],
 ["rv11","我不會問你拿什麼做抵押，因為我根本不打算借。","我不会问你拿什么做抵押，因为我根本不打算借。","I'm not asking for collateral because I'm simply not lending it.","我唔會問你攞咩做抵押，因為我根本唔打算借。"],
 ["rv12","這不是利息多少的問題，是我不做這種借貸。","这不是利息多少的问题，是我不做这种借贷。","This isn't about interest. I don't do this kind of lending.","呢個唔係利息問題，係我唔做呢種借貸。"],
 ["rv13","就算你說很快還，我的答案也一樣。","就算你说很快还，我的答案也一样。","Even if you say you'll repay quickly, my answer is still no.","就算你話好快還，我答案都一樣。"],
 ["rv14","我可以請你吃一頓飯，但不會借你這筆錢。","我可以请你吃一顿饭，但不会借你这笔钱。","I can buy you a meal, but I won't lend this amount.","我可以請你食餐飯，但唔會借呢筆錢。"],
 ["rv15","我不需要你證明自己一定會還，因為我不想把關係放到那個位置。","我不需要你证明自己一定会还，因为我不想把关系放到那个位置。","You don't need to prove you'll repay me. I don't want our friendship put in that position.","你唔使證明一定會還，因為我唔想段友情去到嗰個位置。"],
 ["rv16","借錢這件事，我的答案是固定的：不借。","借钱这件事，我的答案是固定的：不借。","On lending money, my answer is fixed: no.","借錢呢件事，我答案固定：唔借。"],
 ["rv17","別把『朋友』拿來當我必須借錢的理由。","别把“朋友”拿来当我必须借钱的理由。","Don't use 'we're friends' as a reason I have to lend you money.","唔好攞『朋友』當我一定要借錢嘅理由。"],
 ["rv18","如果不借錢就不算朋友，那我們對友情的理解不一樣。","如果不借钱就不算朋友，那我们对友情的理解不一样。","If refusing a loan means I'm not a friend, then we define friendship differently.","如果唔借錢就唔算朋友，咁我哋對友情理解唔同。"],
 ["rv19","我不是銀行，也不想把友情做成授信額度。","我不是银行，也不想把友情做成授信额度。","I'm not a bank, and I don't want friendship turned into a credit line.","我唔係銀行，亦唔想將友情變授信額度。"],
 ["rv20","我們的友情先保持純聊天版，不升級金融版。","我们的友情先保持纯聊天版，不升级金融版。","Let's keep our friendship on the non-financial plan.","我哋友情保持純聊天版，唔升級金融版。"],
 ["rv21","本金、還款日、催款，這三個角色我一個都不想加進友情裡。","本金、还款日、催款，这三个角色我一个都不想加进友情里。","Principal, due dates and collection are three characters I don't want in this friendship.","本金、還款日、催款，三個角色我都唔想加落友情。"],
 ["rv22","我連自己花錢都要算，真的沒有友情貸款業務。","我连自己花钱都要算，真的没有友情贷款业务。","I budget my own spending carefully. I genuinely don't run a friendship loan service.","我連自己使錢都要計，真係冇友情貸款服務。"],
 ["rv23","這題沒有友情價，答案還是不借。","这题没有友情价，答案还是不借。","There isn't a friendship discount on this answer. It's still no.","呢題冇友情價，答案都係唔借。"],
 ["rv24","再磨也不會磨出一筆錢來。","再磨也不会磨出一笔钱来。","Pushing harder isn't going to produce a loan.","再磨都唔會磨出一筆錢。"],
 ["rv25","不借。別再把我當提款機。","不借。别再把我当提款机。","No. Stop treating me like an ATM.","唔借。唔好再當我提款機。"],
 ["rv26","都說了不借，別他媽一直磨。","都说了不借，别他妈一直磨。","I said no. Stop fucking pushing it.","都話唔借，唔好屌一路磨。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("r01");
if(s){
 clearQ(s);
 [
 ["rv01","我們先停十分鐘，十分鐘後再回來只談這一件事。","我们先停十分钟，十分钟后回来只谈这一件事。","Let's pause for ten minutes, then come back and discuss only this issue.","我哋停十分鐘，十分鐘後返嚟淨係傾呢一件事。"],
 ["rv02","我現在情緒太高，繼續說一定會傷人。先停。","我现在情绪太高，继续说一定会伤人。先停。","I'm too worked up right now. If I keep talking, I'll hurt you. Let's pause.","我而家情緒太高，再講一定傷人。停一停先。"],
 ["rv03","我不是逃避，我是想等自己能正常說話再談。","我不是逃避，我是想等自己能正常说话再谈。","I'm not avoiding this. I want to talk when I can actually speak properly.","我唔係逃避，我係等自己可以正常講嘢再傾。"],
 ["rv04","先別翻舊帳，我們只處理今天這件事。","先别翻旧账，我们只处理今天这件事。","Let's stop reopening old issues and deal with today's issue only.","先唔好翻舊帳，我哋淨係處理今日呢件事。"],
 ["rv05","可以生氣，但不要罵人。再有人身攻擊我就先結束對話。","可以生气，但不要骂人。再有人身攻击我就先结束对话。","We can be angry without insulting each other. If the personal attacks continue, I'm ending the conversation for now.","可以嬲，但唔好鬧人。再人身攻擊我就先結束對話。"],
 ["rv06","我們都在搶著反駁，已經沒人在聽。先停一下。","我们都在抢着反驳，已经没人听了。先停一下。","We're both busy rebutting and neither of us is listening. Let's stop for a bit.","我哋都搶住反駁，已經冇人聽。停一停。"],
 ["rv07","你先說完，我不插話；然後換我說。","你先说完，我不插话；然后换我说。","You finish first without interruption, then I get my turn.","你先講完，我唔插嘴；之後到我講。"],
 ["rv08","如果今晚談不好，我們明天再談，不需要今晚硬贏。","如果今晚谈不好，我们明天再谈，不需要今晚硬赢。","If we can't handle this well tonight, we can talk tomorrow. Nobody has to win tonight.","如果今晚傾唔好，聽日再傾，唔需要今晚夾硬贏。"],
 ["rv09","我想解決問題，不想比誰說得更狠。","我想解决问题，不想比谁说得更狠。","I want to solve the problem, not compete over who can say the crueler thing.","我想解決問題，唔想比邊個講得更狠。"],
 ["rv10","剛才那句我說重了，我收回，但問題本身還是要談。","刚才那句我说重了，我收回，但问题本身还是要谈。","What I just said was too harsh and I take it back. The issue itself still needs discussion.","頭先嗰句我講重咗，我收返，但問題本身仲要傾。"],
 ["rv11","先把聲音降下來，不然這場對話沒有意義。","先把声音降下来，不然这场对话没有意义。","Lower the volume first, otherwise this conversation isn't useful.","先將聲音放低，唔係呢場對話冇意思。"],
 ["rv12","我們先各自說一件最在意的事，不要一次丟十件。","我们先各自说一件最在意的事，不要一次丢十件。","Let's each name one thing that matters most instead of throwing ten issues at once.","我哋各自講一樣最在意嘅，唔好一次掟十樣。"],
 ["rv13","先別說分手，也別說永遠、從來這種話。先講眼前發生了什麼。","先别说分手，也别说永远、从来这种话。先讲眼前发生了什么。","No breakup threats, no 'always' or 'never'. Let's talk about what actually happened.","先唔好講分手，亦唔好講永遠、從來。先講眼前發生咩。"],
 ["rv14","我需要五分鐘冷靜，不要追著我繼續吵。","我需要五分钟冷静，不要追着我继续吵。","I need five minutes to cool down. Don't follow me and keep the argument going.","我要五分鐘冷靜，唔好追住我繼續嘈。"],
 ["rv15","我會回來談，但不是現在這個狀態。","我会回来谈，但不是现在这个状态。","I will come back to this, just not in this state.","我會返嚟傾，但唔係而家呢個狀態。"],
 ["rv16","現在繼續，只會把原本一個問題吵成五個。","现在继续，只会把原本一个问题吵成五个。","If we keep going now, one problem will turn into five.","而家繼續，只會將一個問題嘈成五個。"],
 ["rv17","先休戰，不代表這件事算了。","先休战，不代表这件事算了。","A pause doesn't mean the issue is dropped.","停戰先，唔代表件事算數。"],
 ["rv18","今天先把傷人的話停掉，明天再處理對錯。","今天先把伤人的话停掉，明天再处理对错。","Let's stop the hurtful words tonight and deal with right and wrong tomorrow.","今晚先停啲傷人說話，聽日再處理對錯。"],
 ["rv19","我們現在像兩個客服同時把對方轉接出去。先停機一下。","我们现在像两个客服同时把对方转接出去。先停机一下。","We're like two support agents transferring each other in circles. Time for a pause.","我哋而家似兩個客服互相轉接，停機一陣先。"],
 ["rv20","這場架已經從解決問題升級成製造素材了。先散會。","这场架已经从解决问题升级成制造素材了。先散会。","This argument has moved from solving problems to creating new ones. Meeting adjourned.","呢場交已經由解決問題升級做製造素材。散會先。"],
 ["rv21","再講下去，明天兩個人都要忙著道歉。","再讲下去，明天两个人都要忙着道歉。","If we keep going, tomorrow we'll both be busy apologising.","再講落去，聽日兩個都要忙住道歉。"],
 ["rv22","現在誰都別證明自己最有道理，先證明我們還想把事處理好。","现在谁都别证明自己最有道理，先证明我们还想把事处理好。","Let's stop proving who's right and prove we still want to handle this well.","而家唔好證明邊個最有道理，先證明我哋仲想處理好。"],
 ["rv23","你再罵我，我就先離開這個對話。","你再骂我，我就先离开这个对话。","If you keep insulting me, I'm stepping out of this conversation.","你再鬧我，我就先離開呢個對話。"],
 ["rv24","別他媽再互相捅刀了。先閉嘴十分鐘。","别他妈再互相捅刀了。先闭嘴十分钟。","Stop fucking stabbing at each other. Ten minutes of silence.","唔好屌再互相插刀。收聲十分鐘先。"],
 ["rv25","現在不是談不談的問題，是我們根本已經不會好好談了。","现在不是谈不谈的问题，是我们根本已经不会好好谈了。","The issue isn't whether to talk; right now we're not capable of talking well.","而家唔係傾唔傾嘅問題，係我哋根本已經唔識好好傾。"],
 ["rv26","停。這句再下去就真的過界了。","停。这句再下去就真的过界了。","Stop. One more step in that direction crosses the line.","停。再講落去就真係過界。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("sv01");
if(s){
 clearQ(s);
 [
 ["rv01","頁面寫的是 A，我收到的是 B。這屬於描述不符，請直接辦理退款。","页面写的是 A，我收到的是 B。这属于描述不符，请直接办理退款。","The listing says A; I received B. That's not as described. Please process the refund.","頁面寫 A，我收到 B。呢個係描述不符，請直接退款。"],
 ["rv02","我已經拍了照片，也保留了商品頁截圖，可以直接按描述不符處理。","我已经拍了照片，也保留了商品页截图，可以直接按描述不符处理。","I have photos and screenshots of the listing. This can be handled as 'not as described'.","我已經影相同留咗商品頁截圖，可以直接按描述不符處理。"],
 ["rv03","我不需要換貨，這次直接退款就可以。","我不需要换货，这次直接退款就可以。","I don't want a replacement. A refund is enough.","我唔需要換貨，今次直接退款就得。"],
 ["rv04","如果需要退回商品，請提供退貨方式和運費安排。","如果需要退回商品，请提供退货方式和运费安排。","If you need the item returned, please provide the return method and shipping arrangement.","如果要退返件貨，請提供退貨方法同運費安排。"],
 ["rv05","這不是色差或個人喜好，規格本身就和描述不同。","这不是色差或个人喜好，规格本身就和描述不同。","This isn't a colour preference issue; the specification itself differs from the listing.","呢個唔係色差或者個人喜好，規格本身就同描述唔同。"],
 ["rv06","請不要把『與描述不符』改成『不喜歡』，兩者不是一回事。","请不要把“与描述不符”改成“不喜欢”，两者不是一回事。","Please don't reframe 'not as described' as 'changed my mind'. They're different issues.","唔好將『描述不符』改成『唔鍾意』，兩樣唔同。"],
 ["rv07","商品頁面的資訊是我下單依據，收到不同版本我有理由退款。","商品页面的信息是我下单依据，收到不同版本我有理由退款。","I ordered based on the listing. Receiving a different version is grounds for a refund.","商品頁資訊係我落單依據，收到唔同版本有理由退款。"],
 ["rv08","這個問題不是補幾塊錢優惠券能解決，我要退貨退款。","这个问题不是补几块钱优惠券能解决，我要退货退款。","A small coupon doesn't resolve this. I want to return it for a refund.","呢個問題唔係補幾蚊 coupon 就解決，我要退貨退款。"],
 ["rv09","我不接受只退差價，因為我買的不是這個商品。","我不接受只退差价，因为我买的不是这个商品。","I don't accept only a price adjustment because this isn't the product I ordered.","我唔接受只退差價，因為我買嘅唔係呢件貨。"],
 ["rv10","麻煩給我退款流程，不需要再解釋產品其實『差不多』。","麻烦给我退款流程，不需要再解释产品其实“差不多”。","Please give me the refund process. I don't need more explanations about how it's 'close enough'.","麻煩俾退款流程我，唔使再解釋其實『差唔多』。"],
 ["rv11","我會把照片和訂單號一次發齊，請直接處理。","我会把照片和订单号一次发齐，请直接处理。","I'll send the photos and order number together. Please process it directly.","我會一次過發晒相同訂單號，請直接處理。"],
 ["rv12","如果店鋪不能處理，我會按平台的描述不符渠道申訴。","如果店铺不能处理，我会按平台的描述不符渠道申诉。","If the store can't resolve it, I'll escalate through the platform's 'not as described' process.","如果店舖處理唔到，我會按平台描述不符渠道申訴。"],
 ["rv13","退貨運費不應由我承擔，問題來自商品與描述不符。","退货运费不应由我承担，问题来自商品与描述不符。","I shouldn't bear the return shipping because the issue is the item not matching the listing.","退貨運費唔應該我承擔，問題係商品同描述不符。"],
 ["rv14","你們可以先核對自己頁面，差異很明顯。","你们可以先核对自己页面，差异很明显。","Please check your own listing first. The difference is obvious.","你哋可以先對返自己頁面，差異好明顯。"],
 ["rv15","我不是來討論審美，我是在處理錯貨。","我不是来讨论审美，我是在处理错货。","I'm not discussing taste. I'm dealing with the wrong item.","我唔係嚟傾審美，我係處理錯貨。"],
 ["rv16","如果圖片只是參考，那文字規格也不是參考吧？","如果图片只是参考，那文字规格也不是参考吧？","If the image is 'for reference', surely the written specification still means something.","如果圖片只係參考，文字規格唔會都只係參考掛？"],
 ["rv17","商品不是我想像錯了，是你們發的東西跟頁面不一樣。","商品不是我想象错了，是你们发的东西跟页面不一样。","This isn't me imagining the product differently. What you sent differs from the listing.","唔係我想像錯，係你哋發嘅貨同頁面唔同。"],
 ["rv18","我只接受兩個結果：正確商品，或者退款。","我只接受两个结果：正确商品，或者退款。","I accept two outcomes: the correct item or a refund.","我只接受兩個結果：正確商品，或者退款。"],
 ["rv19","別一直叫我理解，先把貨發對。","别一直叫我理解，先把货发对。","Stop asking for my understanding and start by sending the correct product.","唔好一路叫我理解，先將貨發啱。"],
 ["rv20","我買 A，你發 B，這題其實沒有那麼複雜。","我买 A，你发 B，这题其实没有那么复杂。","I bought A; you sent B. This isn't complicated.","我買 A，你發 B，呢題其實冇咁複雜。"],
 ["rv21","這個開箱驚喜我不要，退款就好。","这个开箱惊喜我不要，退款就好。","I don't want this unboxing surprise. A refund will do.","呢個開箱驚喜我唔要，退款就得。"],
 ["rv22","『圖片僅供參考』不是萬能免責符。","“图片仅供参考”不是万能免责符。","'Images for reference only' isn't a universal exemption.","『圖片只供參考』唔係萬能免責符。"],
 ["rv23","你們這個『差不多』差得有點多。","你们这个“差不多”差得有点多。","Your version of 'close enough' is doing a lot of work.","你哋呢個『差唔多』差得幾多。"],
 ["rv24","我不是來抽盲盒的，麻煩按訂單發貨。","我不是来抽盲盒的，麻烦按订单发货。","I didn't order a mystery box. Please fulfil the actual order.","我唔係嚟抽盲盒，麻煩按訂單發貨。"],
 ["rv25","貨不對板就退款，別再跟我繞客服話術。","货不对板就退款，别再跟我绕客服话术。","It's not as described. Refund it and stop looping through support scripts.","貨不對辦就退款，唔好再同我兜客服話術。"],
 ["rv26","貨都發錯了，別他媽還跟我扯『使用體驗』。直接退款。","货都发错了，别他妈还跟我扯“使用体验”。直接退款。","You sent the wrong damn product. Stop talking about 'user experience' and refund it.","貨都發錯，唔好屌仲同我講『使用體驗』。直接退款。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}
})();