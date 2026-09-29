;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function get(id){return S.find(x=>x.id===id)}
function reset(s){if(s)s.replies={zh:{},en:{},yue:{}}}
function add(s,key,hant,hans,en,yue){s.replies.zh[key]={hant,hans};s.replies.en[key]=en;s.replies.yue[key]=yue}
function mark(s){if(s)window.CHAT_REVIEWED_SCENES[s.id]=true}

let s=get("p02");
if(s){
 reset(s);
 [
 ["r01","時間到了，今天的螢幕時間結束。你可以難過，但不會再加時間。","时间到了，今天的屏幕时间结束。你可以难过，但不会再加时间。","Time's up. Screen time is over for today. You can be upset, but we aren't adding more time.","時間到，今日 screen time 完。你可以唔開心，但唔會再加時間。"],
 ["r02","我知道你還想看。先把這集停在這裡，明天可以從這裡繼續。","我知道你还想看。先把这集停在这里，明天可以从这里继续。","I know you want to keep watching. Stop here and you can continue from this point tomorrow.","我知你仲想睇。先停喺呢度，聽日可以由呢度繼續。"],
 ["r03","你可以選擇自己關，還是我幫你關。","你可以选择自己关，还是我帮你关。","You can turn it off yourself, or I can help you turn it off.","你可以揀自己關，定我幫你關。"],
 ["r04","先深呼吸一下，哭也沒關係，但規則不會因為哭改變。","先深呼吸一下，哭也没关系，但规则不会因为哭改变。","Take a breath. It's okay to cry, but the rule doesn't change because you're crying.","深呼吸先。喊都冇問題，但規則唔會因為喊而改。"],
 ["r05","今天看完了，現在換下一件事：洗澡還是刷牙，你選。","今天看完了，现在换下一件事：洗澡还是刷牙，你选。","Screen time is done. Next choice: bath or teeth first? You choose.","今日睇完，依家下一樣：沖涼定刷牙先？你揀。"],
 ["r06","我會陪你不開心一會兒，但不會重新打開。","我会陪你不开心一会儿，但不会重新打开。","I'll stay with you while you're upset, but I'm not turning it back on.","我會陪你唔開心一陣，但唔會再開返。"],
 ["r07","明天開始前我們可以先說好什麼時候停，這樣比較不突然。","明天开始前我们可以先说好什么时候停，这样比较不突然。","Tomorrow we'll agree on the stop time before you start so it doesn't feel sudden.","聽日開始前我哋先講好幾時停，咁就冇咁突然。"],
 ["r08","還有最後兩分鐘，我先提醒你一次。兩分鐘後就關。","还有最后两分钟，我先提醒你一次。两分钟后就关。","You have two minutes left. I'm giving you a warning now, then it goes off.","仲有兩分鐘，我而家提你。兩分鐘後就關。"],
 ["r09","你想自己按停止鍵嗎？","你想自己按停止键吗？","Do you want to press stop yourself?","你想唔想自己撳 stop？"],
 ["r10","今天不是因為你表現不好才停，是時間本來就到了。","今天不是因为你表现不好才停，是时间本来就到了。","We're not stopping because you were bad. We're stopping because the agreed time is over.","今日唔係因為你唔乖先停，係本身時間到。"],
 ["r11","規則是先約好、到點就停，不是到點再重新談判。","规则是先约好、到点就停，不是到点再重新谈判。","The rule is agree first, stop when time is up—not renegotiate at the end.","規則係事前講好、到點就停，唔係到點再重新講價。"],
 ["r12","我知道停下來很難，所以我們先離開螢幕，去喝點水。","我知道停下来很难，所以我们先离开屏幕，去喝点水。","I know stopping is hard. Let's move away from the screen and get some water.","我知停低好難，所以我哋先離開個 screen，去飲啖水。"],
 ["r13","你現在很生氣，我先不說很多。今天就到這裡。","你现在很生气，我先不说很多。今天就到这里。","You're very angry right now, so I won't talk too much. We're done for today.","你而家好嬲，我唔講太多。今日到呢度。"],
 ["r14","可以跺腳，可以哭，但不能摔平板。","可以跺脚，可以哭，但不能摔平板。","You can stomp and cry. You can't throw the tablet.","可以跺腳，可以喊，但唔可以掟平板。"],
 ["r15","如果你摔東西，我會先把設備收起來，等大家冷靜再說。","如果你摔东西，我会先把设备收起来，等大家冷静再说。","If things get thrown, I'll put the device away and we'll talk when everyone is calm.","如果你掟嘢，我會先收起部機，等大家冷靜再講。"],
 ["r16","明天還會有螢幕時間，今天不是永遠沒有了。","明天还会有屏幕时间，今天不是永远没有了。","You'll have screen time again tomorrow. This isn't forever.","聽日仲有 screen time，今日唔係永遠冇。"],
 ["r17","你可以告訴我你最不想停的是哪一部分。","你可以告诉我你最不想停的是哪一部分。","Tell me which part makes stopping hardest for you.","你可以話我知最唔想停係邊部分。"],
 ["r18","如果是遊戲正在一局中，下次我們會留結束一局的緩衝時間。","如果是游戏正在一局中，下次我们会留结束一局的缓冲时间。","If you're in the middle of a game, next time we'll build in time to finish a round.","如果係 game 打緊一局，下次我哋留返完一局嘅緩衝。"],
 ["r19","我不會因為你叫得更大聲就加時間。","我不会因为你叫得更大声就加时间。","Louder yelling won't add more time.","你叫大聲啲都唔會加時間。"],
 ["r20","你現在想多五分鐘，我明白；答案還是今天到這裡。","你现在想多五分钟，我明白；答案还是今天到这里。","I know you want five more minutes. The answer is still that we're done for today.","你想多五分鐘，我明；答案都係今日到呢度。"],
 ["r21","今天規則如果哭一哭就改，明天只會更難停。","今天规则如果哭一哭就改，明天只会更难停。","If crying changes the rule today, stopping will be even harder tomorrow.","今日如果喊一喊就改規則，聽日只會更難停。"],
 ["r22","螢幕時間結束，不代表好玩的時間結束。你可以選別的活動。","屏幕时间结束，不代表好玩的时间结束。你可以选别的活动。","Screen time ending doesn't mean fun is over. You can choose another activity.","screen time 完唔代表好玩嘅時間完，你可以揀第二樣。"],
 ["r23","我們先讓眼睛和腦袋休息一下。","我们先让眼睛和脑袋休息一下。","Let's give your eyes and brain a break now.","俾對眼同個腦休息下先。"],
 ["r24","平板今天收工了，你都可以換個節目。","平板今天收工了，你也可以换个节目。","The tablet has clocked out for today. Time for a different activity.","平板今日收工，你都可以轉節目。"],
 ["r25","它沒有消失，只是今天的營業時間到了。","它没有消失，只是今天的营业时间到了。","It hasn't disappeared. Today's opening hours are simply over.","佢冇消失，只係今日營業時間到。"],
 ["r26","今天的最後一集已經播完，明天續集見。","今天的最后一集已经播完，明天续集见。","Today's final episode is over. Sequel tomorrow.","今日最後一集播完，聽日續集見。"],
 ["r27","哭可以，談判暫停。","哭可以，谈判暂停。","Crying is okay. Negotiation is closed.","喊可以，講價暫停。"],
 ["r28","我們不會因為鬧脾氣把規則改掉。","我们不会因为闹脾气把规则改掉。","A meltdown doesn't rewrite the rule.","發脾氣唔會改寫規則。"],
 ["r29","今天就到這裡。你不用喜歡這個答案。","今天就到这里。你不用喜欢这个答案。","We're done for today. You don't have to like the answer.","今日到呢度。你唔使鍾意呢個答案。"],
 ["r30","我知道你很不爽，但今天不再開。","我知道你很不爽，但今天不再开。","I know you're really upset, but it's not going back on today.","我知你好唔爽，但今日唔會再開。"],
 ["r31","再吵也不會多出時間，我們先冷靜。","再吵也不会多出时间，我们先冷静。","Arguing won't create extra time. Let's calm down first.","再嘈都唔會多出時間，我哋冷靜先。"],
 ["r32","規則可以明天再討論，今天不在情緒最高的時候改。","规则可以明天再讨论，今天不在情绪最高的时候改。","We can review the rule tomorrow, but we won't change it at the peak of a meltdown.","規則可以聽日再傾，今日唔喺情緒最高嗰陣改。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("fr03");
if(s){
 reset(s);
 [
 ["r01","最近幾次都是臨時取消，我想說一下，這真的會影響我的安排。","最近几次都是临时取消，我想说一下，这真的会影响我的安排。","You've cancelled at the last minute several times, and it genuinely disrupts my plans.","最近幾次都係臨時 cancel，真係好影響我安排。"],
 ["r02","如果你不確定能不能來，下次先不要約死時間。","如果你不确定能不能来，下次先不要约死时间。","If you're not sure you can make it, let's not lock in a fixed time next time.","如果你唔肯定嚟唔嚟，下次先唔好約死時間。"],
 ["r03","下次你先確認自己真的能來，我再出門。","下次你先确认自己真的能来，我再出门。","Next time, confirm you're actually coming before I leave home.","下次你先確認真係嚟，我先出門。"],
 ["r04","我可以接受偶爾有事，但現在已經不是偶爾了。","我可以接受偶尔有事，但现在已经不是偶尔了。","I understand things happen, but this isn't occasional anymore.","我可以接受偶爾有事，但而家已經唔係偶爾。"],
 ["r05","如果你今天不想出門，直接說沒關係，不用拖到最後一刻。","如果你今天不想出门，直接说没关系，不用拖到最后一刻。","If you don't feel like going out, just say so. You don't need to wait until the last minute.","如果你今日唔想出門，直接講冇問題，唔使拖到最後一刻。"],
 ["r06","我已經為見面空出時間，所以臨時取消對我不是零成本。","我已经为见面空出时间，所以临时取消对我不是零成本。","I make time for these plans, so a last-minute cancellation isn't cost-free for me.","我為見面留咗時間，所以臨時 cancel 對我唔係零成本。"],
 ["r07","有變動可以，早一點告訴我就好。","有变动可以，早一点告诉我就好。","Plans can change. Just tell me earlier.","有變動可以，早啲話我知就得。"],
 ["r08","如果你總是不能確定，那我們以後改成當天再約。","如果你总是不能确定，那我们以后改成当天再约。","If your schedule stays uncertain, let's make same-day plans instead.","如果你成日唔肯定，以後改當日先約。"],
 ["r09","我不想因為這件事生氣，所以想先把規則說清楚。","我不想因为这件事生气，所以想先把规则说清楚。","I don't want to build resentment, so I'd rather set expectations clearly now.","我唔想因為呢件事一路嬲，所以先講清楚規則。"],
 ["r10","下一次如果又臨時取消，我可能就不再提前排時間了。","下一次如果又临时取消，我可能就不再提前排时间了。","If it happens again, I probably won't block out time in advance anymore.","下次再臨時 cancel，我可能唔再預先留時間。"],
 ["r11","有票或訂位的活動，下次你自己先付自己的部分。","有票或订位的活动，下次你自己先付自己的部分。","For tickets or reservations, next time you'll need to pay your share upfront.","有飛或者訂位，下次你先俾自己嗰份。"],
 ["r12","你取消沒問題，但如果有不可退費用，那部分要你負責。","你取消没问题，但如果有不可退费用，那部分要你负责。","Cancelling is fine, but any non-refundable cost needs to be yours.","你 cancel 冇問題，但有不可退費用就要你負責。"],
 ["r13","我不是要你每次都來，我只是希望你不要讓我白等。","我不是要你每次都来，我只是希望你不要让我白等。","I'm not asking you to show up every time. I just don't want to be left waiting.","我唔係要你次次都嚟，只係唔想白等。"],
 ["r14","你有事我能理解，但至少在我出門前說。","你有事我能理解，但至少在我出门前说。","I understand things come up, but tell me before I leave home.","你有事我明，但至少喺我出門前講。"],
 ["r15","最近我已經有點不敢把你的約當確定行程了。","最近我已经有点不敢把你的约当确定行程了。","Lately I don't really treat our plans as confirmed anymore.","最近我都有啲唔敢當你啲約係確定行程。"],
 ["r16","我們如果還想繼續約，就需要讓彼此的時間有點保障。","我们如果还想继续约，就需要让彼此的时间有点保障。","If we want to keep making plans, we need to respect each other's time.","如果仲想繼續約，就要保障下大家時間。"],
 ["r17","這次我不生氣，但我要提醒你：已經很多次了。","这次我不生气，但我要提醒你：已经很多次了。","I'm not angry this time, but I do need to say it: this has happened a lot.","今次我唔嬲，但要提你：已經好多次。"],
 ["r18","你這個『臨時有事』最近出鏡率有點高。","你这个“临时有事”最近出镜率有点高。","Your 'something came up' has been making a lot of appearances lately.","你個『臨時有事』最近出鏡率有啲高。"],
 ["r19","我們的約最近比較像候補行程，不像正式行程。","我们的约最近比较像候补行程，不像正式行程。","Our plans are starting to feel more like backup plans than real plans.","我哋啲約最近比較似候補行程，唔似正式行程。"],
 ["r20","下次我可能要見到你本人打卡，先相信今天真的見面。","下次我可能要见到你本人打卡，才相信今天真的见面。","Next time I may need visual proof before I believe we're actually meeting.","下次我可能要見到你本人打卡，先信今日真係見面。"],
 ["r21","你每次都 cancel，我都快以為我們的友情主要在線上運作。","你每次都 cancel，我都快以为我们的友情主要在线上运作。","You cancel so often I'm starting to think this friendship is online-only.","你次次 cancel，我都快以為我哋友情主要 online 運作。"],
 ["r22","我的行程不是你有空才啟用的候補位。","我的行程不是你有空才启用的候补位。","My schedule isn't a backup slot you activate when convenient.","我個 schedule 唔係你得閒先啟用嘅候補位。"],
 ["r23","我不是在計較一次，是在說一個模式。","我不是在计较一次，是在说一个模式。","I'm not complaining about one incident. I'm talking about a pattern.","我唔係計較一次，我講緊一個 pattern。"],
 ["r24","你不想見可以直說，別讓我一直替你保留時間。","你不想见可以直说，别让我一直替你保留时间。","If you don't want to meet, say so. Don't keep asking me to hold time for you.","你唔想見可以直接講，唔好一路要我留時間。"],
 ["r25","再這樣下去，我就不提前跟你約了。","再这样下去，我就不提前跟你约了。","If this continues, I'm not making advance plans with you anymore.","再係咁，我就唔提前同你約。"],
 ["r26","你可以爽約，我也可以選擇不再配合。","你可以爽约，我也可以选择不再配合。","You can cancel. I can also choose to stop accommodating it.","你可以爽約，我都可以選擇唔再配合。"],
 ["r27","別把我的時間當成免費可退改。","别把我的时间当成免费可退改。","Don't treat my time like a free flexible booking.","唔好當我時間係免費可退改。"],
 ["r28","如果你每次都不確定，就別先把我約住。","如果你每次都不确定，就别先把我约住。","If you're never sure, don't reserve my time first.","如果你次次都唔肯定，就唔好先約住我。"],
 ["r29","我很重視你，但也重視我自己的時間。","我很重视你，但也重视我自己的时间。","I value you, and I also value my own time.","我重視你，但都重視自己時間。"],
 ["r30","這件事再來一次，我就真的不排你進固定行程了。","这件事再来一次，我就真的不排你进固定行程了。","If this happens again, I genuinely won't put our plans into my fixed schedule.","呢件事再嚟一次，我真係唔會再排你入固定行程。"],
 ["r31","別他媽等我出門了才說不來。","别他妈等我出门了才说不来。","Stop fucking waiting until I've left home to cancel.","唔好屌等我出咗門先話唔嚟。"],
 ["r32","要來就來，不來早點說，別讓我猜。","要来就来，不来早点说，别让我猜。","Come if you're coming; if not, say so early. Don't make me guess.","嚟就嚟，唔嚟早啲講，唔好要我估。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("r03");
if(s){
 reset(s);
 [
 ["r01","我想過一段時間了，我決定結束這段關係。","我想过一段时间了，我决定结束这段关系。","I've thought about this for a while, and I've decided to end the relationship.","我諗咗一段時間，我決定結束呢段關係。"],
 ["r02","這不是一時生氣，我是真的覺得我們不適合再繼續。","这不是一时生气，我是真的觉得我们不适合再继续。","This isn't a reaction in anger. I genuinely don't think we should continue.","呢個唔係一時嬲，我真係覺得我哋唔適合再繼續。"],
 ["r03","我很珍惜我們有過的時間，但我不想再以伴侶的方式走下去。","我很珍惜我们有过的时间，但我不想再以伴侣的方式走下去。","I value what we've shared, but I don't want to continue as partners.","我珍惜我哋有過嘅時間，但唔想再以伴侶方式行落去。"],
 ["r04","我知道這會讓你難受，但我不想用拖延給你假的希望。","我知道这会让你难受，但我不想用拖延给你假的希望。","I know this will hurt, but I don't want delay to give you false hope.","我知會令你難受，但我唔想用拖延俾你假希望。"],
 ["r05","我的決定已經做了，不是想用分手逼你改變。","我的决定已经做了，不是想用分手逼你改变。","I've made my decision. I'm not using a breakup to force you to change.","我已經決定咗，唔係用分手逼你改。"],
 ["r06","我們有很多問題談過很多次，我不想再把關係維持在同一個循環裡。","我们有很多问题谈过很多次，我不想再把关系维持在同一个循环里。","We've discussed the same issues many times, and I don't want the relationship to stay in the same cycle.","我哋好多問題傾過好多次，我唔想段關係再停喺同一個循環。"],
 ["r07","我不是覺得你不好，是我不想再繼續這段關係。","我不是觉得你不好，是我不想再继续这段关系。","This isn't about you being a bad person. I don't want to continue the relationship.","唔係覺得你唔好，係我唔想再繼續呢段關係。"],
 ["r08","我不想把責任全部推給你，這是我自己的決定。","我不想把责任全部推给你，这是我自己的决定。","I don't want to dump all the blame on you. This is my decision.","我唔想將責任全部推俾你，呢個係我自己決定。"],
 ["r09","我不會說『以後可能』，因為我不想讓你等。","我不会说“以后可能”，因为我不想让你等。","I'm not going to say 'maybe someday' because I don't want you waiting.","我唔會講『以後可能』，因為我唔想你等。"],
 ["r10","分開後我希望我們先不要聯絡一段時間。","分开后我希望我们先不要联系一段时间。","After we separate, I'd like us to have a period of no contact.","分開之後，我希望我哋先唔聯絡一段時間。"],
 ["r11","你的東西我會整理好，之後約一個時間交換。","你的东西我会整理好，之后约一个时间交换。","I'll pack your things and we can arrange a time to exchange belongings.","你啲嘢我會整理好，之後約時間交換。"],
 ["r12","如果有共同帳務，我們把實際事情處理清楚，其他先停。","如果有共同账务，我们把实际事情处理清楚，其他先停。","If we have shared finances, let's settle the practical matters and pause everything else.","如果有共同帳務，我哋先處理清楚實際嘢，其他停一停。"],
 ["r13","我不想在吵架中分手，所以我現在平靜地跟你說。","我不想在吵架中分手，所以我现在平静地跟你说。","I don't want to break up in the middle of a fight, so I'm telling you calmly now.","我唔想喺嗌交中分手，所以而家平靜同你講。"],
 ["r14","這個決定不是邀請你說服我留下。","这个决定不是邀请你说服我留下。","This decision isn't an invitation to persuade me to stay.","呢個決定唔係邀請你說服我留低。"],
 ["r15","我聽得到你不接受，但我的決定不會因為你不接受就取消。","我听得到你不接受，但我的决定不会因为你不接受就取消。","I hear that you don't accept it, but that doesn't cancel my decision.","我聽到你唔接受，但唔代表我決定會取消。"],
 ["r16","我不想再試一次了，因為我已經試過很多次。","我不想再试一次了，因为我已经试过很多次。","I don't want to try one more time because I've already tried many times.","我唔想再試一次，因為已經試過好多次。"],
 ["r17","謝謝你曾經對我好，但這不是我繼續留下的理由。","谢谢你曾经对我好，但这不是我继续留下的理由。","I'm grateful for the good things you've done, but they aren't a reason for me to stay.","多謝你以前對我好，但唔係我繼續留低嘅理由。"],
 ["r18","我不想把這段關係拖到彼此更討厭才結束。","我不想把这段关系拖到彼此更讨厌才结束。","I don't want to drag this out until we resent each other more.","我唔想拖到大家更加討厭先完。"],
 ["r19","我想停在還能尊重彼此的位置。","我想停在还能尊重彼此的位置。","I want to stop while we can still respect each other.","我想停喺仲可以尊重彼此嘅位置。"],
 ["r20","我們不是沒有愛過，只是我不想再繼續。","我们不是没有爱过，只是我不想再继续。","It's not that there was never love. I just don't want to continue.","唔係冇愛過，只係我唔想再繼續。"],
 ["r21","有些關係不是修不好，是修完也不是我想要的生活。","有些关系不是修不好，是修完也不是我想要的生活。","Some relationships can be repaired and still not be the life I want.","有啲關係唔係修唔好，係修完都唔係我想要嘅生活。"],
 ["r22","我知道你想要原因，我可以說，但原因不是辯論題。","我知道你想要原因，我可以说，但原因不是辩论题。","I know you want reasons. I can explain them, but they aren't debate points.","我知你想要原因，我可以講，但原因唔係辯論題。"],
 ["r23","我不想再用『再看看』拖半年。","我不想再用“再看看”拖半年。","I don't want to use 'let's see' to drag this out another six months.","我唔想再用『再睇下』拖半年。"],
 ["r24","這個版本我們已經跑不下去了，我想停止。","这个版本我们已经跑不下去了，我想停止。","This version of us isn't working anymore. I want to stop.","呢個版本我哋已經跑唔落去，我想停。"],
 ["r25","不是冷戰，也不是測試，我是在正式跟你分手。","不是冷战，也不是测试，我是在正式跟你分手。","This isn't silent treatment or a test. I'm formally ending the relationship.","唔係冷戰，唔係測試，我係正式同你分手。"],
 ["r26","我不想再給模糊信號：我們到這裡。","我不想再给模糊信号：我们到这里。","I don't want to send mixed signals: this ends here.","我唔想再俾模糊訊號：我哋到呢度。"],
 ["r27","不要再把『你會改』當成我要留下的前提。","不要再把“你会改”当成我要留下的前提。","Please don't make 'I'll change' the condition for me to stay.","唔好再攞『你會改』當我要留低嘅前提。"],
 ["r28","我已經做完決定，現在要做的是把分開處理好。","我已经做完决定，现在要做的是把分开处理好。","I've made the decision. Now we need to handle the separation properly.","我已經決定咗，而家要做係處理好分開。"],
 ["r29","我不欠一段關係無限次機會。","我不欠一段关系无限次机会。","I don't owe a relationship infinite chances.","我唔欠一段關係無限次機會。"],
 ["r30","我不想再做你伴侶，這句已經很清楚。","我不想再做你伴侣，这句已经很清楚。","I don't want to be your partner anymore. That's clear enough.","我唔想再做你伴侶，呢句已經好清楚。"],
 ["r31","別他媽再逼我說第十次，我要分手。","别他妈再逼我说第十次，我要分手。","Stop fucking making me say it ten times. I'm ending this relationship.","唔好屌逼我講第十次，我要分手。"],
 ["r32","我們分開吧。不是建議，是決定。","我们分开吧。不是建议，是决定。","We're breaking up. That's a decision, not a suggestion.","我哋分開。唔係建議，係決定。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}
})();