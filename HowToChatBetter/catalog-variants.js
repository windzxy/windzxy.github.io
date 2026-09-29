;(function(){
var S=window.CHAT_SCENARIOS||[];
function find(id){return S.find(function(x){return x.id===id})}
function add(id,key,hant,hans,en,yue){
 var s=find(id); if(!s)return;
 s.replies.zh[key]={hant:hant,hans:hans};
 s.replies.en[key]=en;
 s.replies.yue[key]=yue;
}
add("w01","soft",
"想再跟進一下 XX 的進度，不急著要最終版，如果目前版本方便先給我，我這邊可以先開始。",
"想再跟进一下 XX 的进度，不急着要最终版，如果目前版本方便先给我，我这边可以先开始。",
"Just a gentle follow-up on XX. No need to wait for the final version — the current one would already help me get started.",
"想問一問 XX 進度，唔使等 final version，而家版本方便嘅話俾住我先都得。");
add("w01","cold",
"XX 現在方便提供到哪個版本？我這邊需要開始處理。",
"XX 现在方便提供到哪个版本？我这边需要开始处理。",
"Which version of XX is available now? I need to start working on it.",
"XX 而家方便俾到邊個版本？我呢邊要開始處理。");
add("w01","tea",
"可能是我太心急了，我怕耽誤後面整合，所以想問問 XX 現在是不是有版本可以先給我呀？",
"可能是我太心急了，我怕耽误后面整合，所以想问问 XX 现在是不是有版本可以先给我呀？",
"Maybe I'm being a little eager, but I'm worried about delaying the consolidation — is there a version of XX I could start with?",
"可能係我太心急啦，我驚後面整合會趕，想問下 XX 而家有冇版本可以俾我先呀？");
add("w01","yin",
"我以為今天會收到，所以特意把後面的時間空了出來。現在如果有版本的話，麻煩先發我一下。",
"我以为今天会收到，所以特意把后面的时间空了出来。现在如果有版本的话，麻烦先发我一下。",
"I'd kept time free today because I understood the file would arrive. If a version is available now, please send it over.",
"我以為今日會收到，所以特登留咗後面啲時間。如果而家有版本，麻煩先俾我。");

add("w03","soft",
"我可以幫忙，不過今天手上的安排已經比較滿了。不如我們先一起看看哪一件可以往後放？",
"我可以帮忙，不过今天手上的安排已经比较满了。不如我们先一起看看哪一件可以往后放？",
"I can help, but today's schedule is already quite full. Shall we decide together which item can move?",
"我可以幫，不過今日手上安排已經幾滿。不如一齊睇下邊樣可以向後放？");
add("w03","cold",
"可以接，但需要調整現有優先級。請先確認哪一項順延。",
"可以接，但需要调整现有优先级。请先确认哪一项顺延。",
"I can take it, but the current priorities need to change. Please confirm which item moves.",
"可以接，但要調整而家優先次序。請先確認邊一項順延。");
add("w03","tea",
"我當然想幫呀，只是我今天手上已經排滿了，怕硬塞進去反而哪邊都做不好。不如你幫我定一下優先級？",
"我当然想帮呀，只是我今天手上已经排满了，怕硬塞进去反而哪边都做不好。不如你帮我定一下优先级？",
"I'd love to help — I'm just worried squeezing it into a full day will make everything worse. Could you help me set the priority?",
"我梗係想幫啦，只係今日真係排滿咗，驚夾硬塞反而樣樣都做唔好。不如你幫我定下 priority？");
add("w03","yin",
"可以啊，只要今天原本的工作也允許自動消失一件就行。",
"可以啊，只要今天原本的工作也允许自动消失一件就行。",
"Sure — as long as one of today's existing tasks is also allowed to magically disappear.",
"可以呀，只要今日原本啲工作都可以自動消失一樣就得。");

add("w07","soft",
"我可以先幫你一起把問題處理掉，不過也想順手對一下原本分工，免得之後大家記憶不一致。",
"我可以先帮你一起把问题处理掉，不过也想顺手对一下原本分工，免得之后大家记忆不一致。",
"I can help sort this out first. I'd also like to confirm the original ownership so we don't remember it differently later.",
"我可以先幫手處理，不過都想順便對返原本分工，免得之後大家記法唔同。");
add("w07","cold",
"我可以協助，但這不是我原本負責的項目。原責任人仍需跟進。",
"我可以协助，但这不是我原本负责的项目。原责任人仍需跟进。",
"I can assist, but this was not originally my responsibility. The original owner still needs to follow through.",
"我可以協助，但呢樣唔係我原本負責。原 owner 都要繼續跟。");
add("w07","tea",
"沒事，我可以先幫忙呀，只是怕大家之後誤會原本就是我負責，所以把分工再對一下會比較好。",
"没事，我可以先帮忙呀，只是怕大家之后误会原本就是我负责，所以把分工再对一下会比较好。",
"No problem, I can help for now. I just don't want anyone to later think it was mine from the start, so let's confirm the ownership.",
"冇事，我可以先幫手呀，只係驚之後大家誤會原本就係我負責，所以對返分工會好啲。");
add("w07","yin",
"原來協助一次就會自動繼承責任，這個規則我今天才知道。",
"原来协助一次就会自动继承责任，这个规则我今天才知道。",
"I didn't realise helping once automatically transferred ownership. Good to know that's the new rule.",
"原來幫一次就會自動繼承責任，呢條規則我今日先知。");

add("w08","soft",
"我想找個時間聊聊目前的職責和薪酬是否還匹配。這段時間我的工作範圍增加了不少，我希望可以一起評估一下。",
"我想找个时间聊聊目前的职责和薪酬是否还匹配。这段时间我的工作范围增加了不少，我希望可以一起评估一下。",
"I'd like to find time to review whether my current responsibilities and compensation are still aligned. My scope has expanded quite a bit.",
"我想搵個時間傾下而家職責同人工係咪仲匹配。呢段時間工作範圍多咗唔少，希望可以一齊評估下。");
add("w08","cold",
"目前職責已明顯超出原範圍，我希望正式討論薪酬調整。",
"目前职责已明显超出原范围，我希望正式讨论薪酬调整。",
"My responsibilities now clearly exceed the original scope. I'd like to formally discuss a compensation adjustment.",
"而家職責已經明顯超出原本範圍，我想正式傾薪酬調整。");
add("w08","yin",
"工作內容已經很積極地成長了，我想確認薪酬是不是也有同樣的成長意願。",
"工作内容已经很积极地成长了，我想确认薪酬是不是也有同样的成长意愿。",
"The role has shown excellent growth. I'd like to check whether compensation shares the same ambition.",
"工作內容成長得非常積極，我想確認人工係咪都有同樣嘅成長意願。");
add("w08","tea",
"可能是我自己感受比較明顯，但最近承擔的內容確實多了不少，所以想問問是不是也有機會一起看看薪酬調整呀？",
"可能是我自己感受比较明显，但最近承担的内容确实多了不少，所以想问问是不是也有机会一起看看薪酬调整呀？",
"Maybe I'm noticing it more because I'm in the middle of it, but my scope has grown a lot lately. Could we also look at compensation?",
"可能係我自己感受比較明顯，不過最近真係多咗好多內容，所以想問下可唔可以都睇下薪酬調整呀？");

add("s02","soft",
"怕大家最後太趕，想先對一下時間。你那部分今晚方便先放目前版本上來嗎？",
"怕大家最后太赶，想先对一下时间。你那部分今晚方便先放目前版本上来吗？",
"Just trying to avoid a last-minute rush — could you upload the current version of your section tonight?",
"驚大家最後太趕，想先對下時間。你嗰部分今晚方便放住而家版本上嚟嗎？");
add("s02","cold",
"今晚 9 點前請上傳你負責的部分，之後我們需要統一整合。",
"今晚 9 点前请上传你负责的部分，之后我们需要统一整合。",
"Please upload your section by 9 pm tonight. We need time to consolidate afterward.",
"今晚 9 點前請上傳你負責嗰部分，之後我哋要統一整合。");
add("s02","tea",
"是不是你最近比較忙呀？我怕你那部分還沒放上來，最後大家一起趕會很辛苦，所以先提醒一下喔。",
"是不是你最近比较忙呀？我怕你那部分还没放上来，最后大家一起赶会很辛苦，所以先提醒一下哦。",
"Have you been extra busy lately? I'm just worried we'll all end up rushing if your section isn't up yet, so a quick reminder.",
"係咪最近比較忙呀？我驚你嗰部分未放上嚟，最後大家一齊趕會幾辛苦，所以提一提你呀。");
add("s02","yin",
"可能是我記錯 deadline 了，我一直以為我們明天就要交，所以今晚應該要看到大家的部分。",
"可能是我记错 deadline 了，我一直以为我们明天就要交，所以今晚应该要看到大家的部分。",
"Maybe I remembered the deadline wrong — I thought we were submitting tomorrow, which is why I expected everyone's part tonight.",
"可能係我記錯 deadline，我一直以為我哋聽日就要交，所以今晚應該要見到大家嗰部分。");

add("f01","soft",
"我最近有點累，可能需要我們重新分一下家務。不是要算誰做得多，只是希望兩個人都能比較舒服。",
"我最近有点累，可能需要我们重新分一下家务。不是要算谁做得多，只是希望两个人都能比较舒服。",
"I've been feeling a bit worn out lately. Could we rebalance the chores? I'm not trying to keep score — I just want it to feel sustainable for both of us.",
"我最近有啲攰，可能要重新分下家務。唔係想計邊個做得多，只係想大家都舒服啲。");
add("f01","cold",
"現在家務分配不平衡，我們需要重新分配固定項目。",
"现在家务分配不平衡，我们需要重新分配固定项目。",
"The current chore split is not balanced. We need to redistribute the recurring tasks.",
"而家家務分配唔平衡，我哋要重新分返啲固定項目。");
add("f01","tea",
"可能是我能力比較差吧，最近家務真的有點扛不住。要不我們重新分一下，不然我怕自己哪天直接罷工。",
"可能是我能力比较差吧，最近家务真的有点扛不住。要不我们重新分一下，不然我怕自己哪天直接罢工。",
"Maybe I'm just not as capable as I thought, but the chores are getting a bit much. Could we rebalance them before I accidentally go on strike?",
"可能係我能力差啲啦，最近家務真係有啲頂唔順。不如重新分下，唔係我驚自己有日直接罷工。");
add("f01","yin",
"我最近才發現，原來共同生活的「共同」主要是出現在名字裡。",
"我最近才发现，原来共同生活的“共同”主要是出现在名字里。",
"I'm starting to realise the 'shared' part of shared living may mostly be in the name.",
"我最近先發現，原來共同生活個『共同』主要係出現喺個名度。");

add("p01","soft",
"先不用想全部作業，我們只做第一小步。你選一科，先做 10 分鐘就好。",
"先不用想全部作业，我们只做第一小步。你选一科，先做 10 分钟就好。",
"Don't think about all the homework yet. Just pick one subject and do ten minutes to get started.",
"唔使諗晒全部功課，先做第一小步。你揀一科，做 10 分鐘先。");
add("p01","cold",
"現在開始做一科，10 分鐘後再休息。",
"现在开始做一科，10 分钟后再休息。",
"Start one subject now. You can take a break after ten minutes.",
"而家開始做一科，10 分鐘後再抖。");
add("p01","humor",
"我們先騙一下大腦，只做 10 分鐘。等它發現的時候，你可能已經做了一半。",
"我们先骗一下大脑，只做 10 分钟。等它发现的时候，你可能已经做了一半。",
"Let's trick your brain: only ten minutes. By the time it notices, you may already be halfway through.",
"我哋先呃下個腦，只做 10 分鐘。等佢發現嗰陣，你可能已經做咗一半。");
add("p01","rhetorical",
"如果現在只做 10 分鐘，你覺得哪一科最容易先開始？",
"如果现在只做 10 分钟，你觉得哪一科最容易先开始？",
"If you only had to do ten minutes right now, which subject would be easiest to start with?",
"如果而家只做 10 分鐘，你覺得邊科最易開始先？");

add("e01","soft",
"我知道你是關心我，也知道你希望我過得穩定。這件事讓我自己安排，好消息我一定會主動告訴你。",
"我知道你是关心我，也知道你希望我过得稳定。这件事让我自己安排，好消息我一定会主动告诉你。",
"I know you care and want me to be settled. Let me handle this in my own time, and I'll definitely tell you when there's good news.",
"我知你係關心我，亦希望我穩定。呢件事俾我自己安排，有好消息我一定會主動話你知。");
add("e01","cold",
"結婚時間我會自己決定，這個話題先不用再重複問。",
"结婚时间我会自己决定，这个话题先不用再重复问。",
"I'll decide the timing of marriage myself. There's no need to keep revisiting this topic.",
"結婚時間我會自己決定，呢個話題唔使再重複問。");
add("e01","tea",
"你們這麼替我著急，我都快不好意思了。只是這件事真的急也急不來，有消息我一定第一個報告。",
"你们这么替我着急，我都快不好意思了。只是这件事真的急也急不来，有消息我一定第一个报告。",
"You're all so worried on my behalf that I almost feel bad. Unfortunately this isn't something that moves faster with pressure — I'll report back first when there's news.",
"你哋咁替我心急，我都快唔好意思啦。不過呢件事真係催都催唔快，有消息我一定第一個報告。");
add("e01","yin",
"每次吃飯都有固定節目也挺有儀式感的，就是這個問題答案暫時還是沒有更新。",
"每次吃饭都有固定节目也挺有仪式感的，就是这个问题答案暂时还是没有更新。",
"It's nice that every family meal has a recurring segment. The answer to this one still hasn't received an update though.",
"每次食飯都有固定節目都幾有儀式感，不過呢條問題個答案暫時仲未更新。");

add("fr01","soft",
"我理解你可能真的有需要，但這筆金額我不方便借。希望你能理解，這是我自己對金錢往來的原則。",
"我理解你可能真的有需要，但这笔金额我不方便借。希望你能理解，这是我自己对金钱往来的原则。",
"I understand you may really need it, but I'm not comfortable lending this amount. I hope you understand it's a personal rule I keep around money.",
"我明白你可能真係有需要，不過呢筆金額我唔方便借。希望你明白，呢個係我自己對金錢往來嘅原則。");
add("fr01","cold",
"這筆錢我不借，希望你理解。",
"这笔钱我不借，希望你理解。",
"I'm not going to lend this money. I hope you understand.",
"呢筆錢我唔借，希望你明白。");
add("fr01","tea",
"我也很想幫你呀，可惜我自己在金錢往來上真的比較保守，這次就不借了，希望你別介意。",
"我也很想帮你呀，可惜我自己在金钱往来上真的比较保守，这次就不借了，希望你别介意。",
"I really wish I could help, but I'm quite conservative about lending money, so I won't be able to this time. I hope you don't mind.",
"我都好想幫你呀，可惜我自己對借錢真係比較保守，今次就唔借啦，希望你唔好介意。");
add("fr01","yin",
"我一直覺得友情保持沒有還款日的版本，對大家都比較健康。",
"我一直觉得友情保持没有还款日的版本，对大家都比较健康。",
"I've always felt friendships are healthier in the version without a repayment date.",
"我一直覺得友情保持冇還款日嗰個版本，對大家都健康啲。");

add("r01","soft",
"我知道我們都很在乎這件事，但現在情緒太高了。先停一下，等我們都能好好說話再繼續。",
"我知道我们都很在乎这件事，但现在情绪太高了。先停一下，等我们都能好好说话再继续。",
"I know this matters to both of us, but emotions are too high right now. Let's pause and come back when we can talk properly.",
"我知我哋都好在意呢件事，不過而家情緒太高。停一停，等大家都可以好好講嘢再繼續。");
add("r01","cold",
"先停止這個對話。20 分鐘後再談。",
"先停止这个对话。20 分钟后再谈。",
"Let's stop this conversation for now and continue in twenty minutes.",
"呢個對話停一停，20 分鐘後再傾。");
add("r01","tea",
"可能我們兩個現在都太有道理了，再聊下去大概只會更精彩。先休息一下好不好？",
"可能我们两个现在都太有道理了，再聊下去大概只会更精彩。先休息一下好不好？",
"Maybe we're both a little too convinced we're right right now. If we keep going it'll only get more exciting. Can we pause?",
"可能我哋兩個而家都太有道理，再傾落去只會更加精彩。停一停好唔好？");
add("r01","yin",
"現在繼續說下去，應該很適合替明天的後悔提前準備素材。",
"现在继续说下去，应该很适合替明天的后悔提前准备素材。",
"Continuing right now would be an excellent way to prepare material for tomorrow's regret.",
"而家繼續講落去，應該幾適合幫聽日嘅後悔預先準備素材。");

add("sv01","soft",
"不好意思，可能是我理解有差異，但收到的商品和頁面描述確實不太一致。方便幫我看看退款流程嗎？",
"不好意思，可能是我理解有差异，但收到的商品和页面描述确实不太一致。方便帮我看看退款流程吗？",
"Sorry, perhaps I'm missing something, but the item I received doesn't seem to match the listing. Could you help me with the refund process?",
"唔好意思，可能係我理解有差異，不過收到嘅貨同頁面描述真係唔太一致。方便幫我睇下退款流程嗎？");
add("sv01","cold",
"商品與描述不符，我要申請退款。",
"商品与描述不符，我要申请退款。",
"The item does not match the description. I want to request a refund.",
"貨品同描述唔符，我要申請退款。");
add("sv01","tea",
"可能是我期待太高了吧，我只是照著頁面描述下單，沒想到收到的是另一個版本。這邊麻煩幫我退款就好。",
"可能是我期待太高了吧，我只是照着页面描述下单，没想到收到的是另一个版本。这边麻烦帮我退款就好。",
"Maybe my expectations were too literal — I ordered based on the description and somehow received a different version. A refund would be great, thanks.",
"可能係我期待太高啦，我只係照頁面描述落單，點知收到另一個版本。麻煩幫我退款就好。");
add("sv01","yin",
"原來「圖片僅供參考」可以參考到這麼有創意，學到了。退款麻煩安排一下。",
"原来“图片仅供参考”可以参考到这么有创意，学到了。退款麻烦安排一下。",
"I didn't realise 'images for reference only' allowed quite this much creativity. Noted. Please arrange the refund.",
"原來『圖片只供參考』可以參考得咁有創意，學到嘢。退款麻煩安排一下。");

add("j01","soft",
"您好，想再跟進一下 XX 職位的進度。我仍然很期待這個機會，如果目前還在流程中，也麻煩讓我知道一下，謝謝。",
"您好，想再跟进一下 XX 职位的进度。我仍然很期待这个机会，如果目前还在流程中，也麻烦让我知道一下，谢谢。",
"Hi, I wanted to gently follow up on the XX role. I'm still very interested, and I'd appreciate any update if the process is ongoing.",
"你好，想再跟一跟 XX 職位嘅進度。我仍然好期待呢個機會，如果仲喺流程中都麻煩話我知，謝謝。");
add("j01","cold",
"想確認 XX 職位目前是否仍在招聘流程中，謝謝。",
"想确认 XX 职位目前是否仍在招聘流程中，谢谢。",
"Could you confirm whether the XX role is still active in the hiring process? Thank you.",
"想確認 XX 職位而家仲係咪招聘流程中，謝謝。");
add("j01","tea",
"可能招聘流程最近比較忙，我怕自己錯過了消息，所以想再確認一下 XX 職位目前的進度呀。",
"可能招聘流程最近比较忙，我怕自己错过了消息，所以想再确认一下 XX 职位目前的进度呀。",
"Perhaps things have been busy on the hiring side. I just wanted to make sure I haven't missed an update on the XX role.",
"可能最近招聘流程比較忙，我驚自己漏咗消息，所以想再確認下 XX 職位進度呀。");
add("j01","yin",
"想確認一下流程是不是仍在進行，畢竟目前的靜默感已經很有沉浸式體驗了。",
"想确认一下流程是不是仍在进行，毕竟目前的静默感已经很有沉浸式体验了。",
"Just checking whether the process is still active — the current level of silence has become impressively immersive.",
"想確認下流程係咪仲進行緊，畢竟而家個靜默感已經幾有沉浸式體驗。");

add("b01","soft",
"這部分我們可以配合，不過它已經超出原先範圍。要不我先整理一下新增內容和時間影響，再一起確認最合適的做法？",
"这部分我们可以配合，不过它已经超出原先范围。要不我先整理一下新增内容和时间影响，再一起确认最合适的做法？",
"We can support this, though it falls outside the original scope. Let me outline the added work and timeline impact so we can agree the best way forward.",
"呢部分我哋可以配合，不過已經超出原本範圍。不如我先整理新增內容同時間影響，再一齊確認最好做法？");
add("b01","cold",
"這項不在原 scope，需要按新增需求處理。",
"这项不在原 scope，需要按新增需求处理。",
"This is outside the original scope and needs to be handled as additional work.",
"呢項唔喺原 scope，需要按新增需求處理。");
add("b01","tea",
"當然可以幫你加呀，只是原本 scope 真的沒有這一項，我怕大家之後對範圍理解不一致，所以先把新增內容確認一下比較好。",
"当然可以帮你加呀，只是原本 scope 真的没有这一项，我怕大家之后对范围理解不一致，所以先把新增内容确认一下比较好。",
"Of course we can add it. It's just not in the original scope, and I don't want us to remember the scope differently later, so let's confirm the addition first.",
"梗係可以幫你加啦，只係原本 scope 真係冇呢項，我驚之後大家對範圍記法唔同，所以先確認新增內容會好啲。");
add("b01","yin",
"原來 scope 也有自我繁殖功能，這個項目確實很有生命力。",
"原来 scope 也有自我繁殖功能，这个项目确实很有生命力。",
"I didn't realise the scope had self-replication enabled. This project really is full of life.",
"原來 scope 都有自我繁殖功能，呢個 project 真係好有生命力。");

add("w01","rude",
"到底什麼時候能給？我這邊已經等到影響進度了，麻煩別再拖。",
"到底什么时候能给？我这边已经等到影响进度了，麻烦别再拖。",
"When exactly can you send it? This delay is already affecting my work, so please stop pushing it back.",
"究竟幾時俾到？我呢邊已經等到影響進度，麻煩唔好再拖。");

add("w03","rude",
"我手上已經滿了，這件別直接丟給我。要我接就先拿走一件原本的工作。",
"我手上已经满了，这件别直接丢给我。要我接就先拿走一件原本的工作。",
"My plate is already full. Don't just dump this on me. If I take it, remove one of my existing tasks.",
"我手上已經滿晒，呢件唔好直接掟俾我。要我接就先拎走一樣原本工作。");

add("w07","rude",
"這不是我的責任，別因為現在出了問題就往我這邊推。",
"这不是我的责任，别因为现在出了问题就往我这边推。",
"This isn't my responsibility. Don't shift it onto me just because there's now a problem.",
"呢樣唔係我責任，唔好而家出咗問題先推過嚟。");

add("w08","rude",
"工作量和責任都加了，薪酬卻完全沒動，這件事我覺得需要正式談清楚。",
"工作量和责任都加了，薪酬却完全没动，这件事我觉得需要正式谈清楚。",
"The workload and responsibility have increased while compensation hasn't moved at all. We need to address that properly.",
"工作量同責任都加咗，人工完全冇郁，呢件事我覺得要正式傾清楚。");

add("s02","rude",
"你那部分到底還交不交？明天就截止了，別讓其他人替你收尾。",
"你那部分到底还交不交？明天就截止了，别让其他人替你收尾。",
"Are you actually submitting your part? It's due tomorrow. Don't leave everyone else to finish it for you.",
"你嗰部分究竟交唔交？聽日就 deadline，唔好等其他人幫你執尾。");

add("f01","rude",
"家務不是我一個人的事，別再默認我會全部做掉。",
"家务不是我一个人的事，别再默认我会全部做掉。",
"Housework isn't solely my job. Stop assuming I'll just do all of it.",
"家務唔係我一個人嘅事，唔好再默認我會全部做晒。");

add("e01","rude",
"結不結婚是我的事，這個問題不用再問了。",
"结不结婚是我的事，这个问题不用再问了。",
"Whether I get married is my decision. You don't need to ask me about it again.",
"結唔結婚係我嘅事，呢個問題唔使再問。");

add("fr01","rude",
"不借，這件事不用再勸我。",
"不借，这件事不用再劝我。",
"No. I'm not lending it, and I don't want to be persuaded further.",
"唔借，呢件事唔使再勸我。");

add("r01","rude",
"現在先別說了，再說下去只會更難聽。等大家冷靜再談。",
"现在先别说了，再说下去只会更难听。等大家冷静再谈。",
"Stop for now. If we keep going, it's only going to get uglier. We'll talk when we're calmer.",
"而家唔好再講，講落去只會更難聽。等大家冷靜先再傾。");

add("sv01","rude",
"商品明顯跟描述不符，我不接受扯其他理由，直接退款。",
"商品明显跟描述不符，我不接受扯其他理由，直接退款。",
"The item clearly doesn't match the description. I don't need excuses — process the refund.",
"件貨明顯同描述唔符，我唔需要其他理由，直接退款。");

add("j01","rude",
"如果職位已經不考慮我，直接說就好，不需要一直沒有回覆。",
"如果职位已经不考虑我，直接说就好，不需要一直没有回复。",
"If I'm no longer being considered, just say so. There's no need to leave the process in silence.",
"如果個職位已經唔考慮我，直接講就得，唔需要一路冇回覆。");

add("b01","rude",
"這不是原 scope，免費加是不可能的。要做就按新增需求走。",
"这不是原 scope，免费加是不可能的。要做就按新增需求走。",
"This is outside the original scope. Adding it for free isn't happening. If you want it, treat it as additional work.",
"呢樣唔係原 scope，免費加冇可能。要做就按新增需求走。");

window.CHAT_SCENARIOS=S;
})();