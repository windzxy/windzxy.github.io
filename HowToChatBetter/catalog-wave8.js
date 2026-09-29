;(function(){
const D={
 workplace:{hant:"職場",hans:"职场",en:"Work"},study:{hant:"學習",hans:"学习",en:"Study"},
 family:{hant:"家庭",hans:"家庭",en:"Family"},parenting:{hant:"育兒",hans:"育儿",en:"Parenting"},
 elder:{hant:"長輩",hans:"长辈",en:"Elders"},friends:{hant:"朋友",hans:"朋友",en:"Friends"},
 relationship:{hant:"感情",hans:"感情",en:"Relationship"},social:{hant:"社交",hans:"社交",en:"Social"},
 service:{hant:"服務",hans:"服务",en:"Service"},job:{hant:"求職",hans:"求职",en:"Job Search"},
 business:{hant:"商務",hans:"商务",en:"Business"},travel:{hant:"旅行",hans:"旅行",en:"Travel"},
 medical:{hant:"醫療",hans:"医疗",en:"Medical"},online:{hant:"網絡",hans:"网络",en:"Online"}
};
const A=[];
function add(id,d,relation,goal,title,formal,direct,play){
 A.push({id,domain:d,domainLabel:D[d],relation:{hant:relation[0],hans:relation[1],en:relation[2]},
 goal:{hant:goal[0],hans:goal[1],en:goal[2]},title:{hant:title[0],hans:title[1],en:title[2]},
 replies:{
  zh:{formal:{hant:formal[0],hans:formal[1]},direct:{hant:direct[0],hans:direct[1]},roast:{hant:play[0],hans:play[1]}},
  en:{formal:formal[2],direct:direct[2],roast:play[2]},
  yue:{formal:formal[3],direct:direct[3],roast:play[3]}
 }});
}
add("w26","workplace",["同事","同事","Colleague"],["拒絕搶時間","拒绝抢时间","Protect focus time"],
["同事總說「就五分鐘」結果聊半小時","同事总说“就五分钟”结果聊半小时","A colleague says 'five minutes' but takes half an hour"],
["可以聊，但我現在只有五分鐘，時間到我需要回去做手上的事。","可以聊，但我现在只有五分钟，时间到我需要回去做手上的事。","We can talk, but I genuinely only have five minutes before I need to get back to my work.","可以傾，但我而家真係得五分鐘，時間到我要返去做手上啲嘢。"],
["如果是半小時的事，就不要叫它五分鐘。","如果是半小时的事，就不要叫它五分钟。","If it takes half an hour, let's stop calling it five minutes.","如果要半個鐘，就唔好再叫五分鐘。"],
["你個「五分鐘」好似有自己時區。","你个“五分钟”好像有自己的时区。","Your 'five minutes' appears to operate in its own time zone.","你個『五分鐘』好似有自己時區。"]);
add("w27","workplace",["同事","同事","Colleague"],["拒絕代回郵件","拒绝代回邮件","Refuse replying for someone"],
["同事總讓你替他回覆本該他處理的郵件","同事总让你替他回复本该他处理的邮件","A colleague keeps asking you to answer emails they should handle"],
["這封需要由你回比較合適，我可以幫你看措辭，但不替你發。","这封需要由你回比较合适，我可以帮你看措辞，但不替你发。","This one should come from you. I can review the wording, but I won't send it for you.","呢封由你覆比較合適，我可以幫你睇措辭，但唔代你發。"],
["你的郵件你自己回。","你的邮件你自己回。","Your email, your reply.","你封 email 你自己覆。"],
["我可以校稿，唔係代練帳號。","我可以校稿，不是代练账号。","I can proofread. I'm not your account pilot.","我可以校稿，唔係代練 account。"]);
add("w28","workplace",["上司","上司","Manager"],["反對公開羞辱","反对公开羞辱","Address public humiliation"],
["上司在多人面前公開責備你","上司在多人面前公开责备你","Your manager criticises you publicly in front of others"],
["如果有需要改進的地方，我願意處理，但希望具體問題可以私下談，這樣更有效。","如果有需要改进的地方，我愿意处理，但希望具体问题可以私下谈，这样更有效。","I'm happy to address what needs improvement, but I'd prefer specific feedback privately so we can deal with it properly.","有要改善嘅我會處理，不過具體問題希望私下傾，會有效啲。"],
["有問題可以說，沒必要公開羞辱。","有问题可以说，没必要公开羞辱。","You can raise the issue without humiliating me publicly.","有問題可以講，冇必要公開羞辱。"],
["開會可以解決問題，唔使順便開批鬥大會。","开会可以解决问题，不用顺便开批斗大会。","A meeting can solve problems without becoming a public trial.","meeting 可以解決問題，唔使順便開批鬥大會。"]);
add("w29","workplace",["同事","同事","Colleague"],["拒絕無限語音","拒绝无限语音","Stop endless voice notes"],
["同事總發很長的語音訊息談工作","同事总发很长的语音消息谈工作","A colleague keeps sending very long voice notes about work"],
["工作內容麻煩盡量打字，尤其是任務和時間點，方便我之後查找。","工作内容麻烦尽量打字，尤其是任务和时间点，方便我之后查找。","Please use text for work items, especially tasks and deadlines, so I can refer back to them.","工作內容麻煩盡量打字，尤其 task 同 deadline，方便之後搵返。"],
["十幾分鐘語音我不會逐條聽，重點請打字。","十几分钟语音我不会逐条听，重点请打字。","I won't go through ten-minute voice notes one by one. Please type the key points.","十幾分鐘 voice 我唔會逐條聽，重點打字。"],
["語音不是 podcast，我真係冇訂閱。","语音不是 podcast，我真的没订阅。","These voice notes aren't a podcast. I didn't subscribe.","啲 voice 唔係 podcast，我真係冇 subscribe。"]);
add("st13","study",["組員","组员","Teammate"],["拒絕臨時改題","拒绝临时改题","Reject last-minute topic change"],
["小組作業快完成時有人突然想全部換題","小组作业快完成时有人突然想全部换题","Someone wants to change the entire project topic near completion"],
["現在改題會讓已完成內容幾乎重做。如果要改，需要先確認大家都同意並重新排時間。","现在改题会让已完成内容几乎重做。如果要改，需要先确认大家都同意并重新排时间。","Changing topic now would mean redoing most of the work. If we do it, everyone needs to agree and reset the timeline.","而家改題等於大部分重做，要改就先確認大家同意同重新排時間。"],
["現在改，等於大家之前白做。先別衝動。","现在改，等于大家之前白做。先别冲动。","Changing now means most of the previous work is wasted. Let's not rush this.","而家改即係之前大部分白做，唔好衝動。"],
["臨尾先換題，呢個唔叫創新，叫重開新 save。","临尾才换题，这不叫创新，叫重开新存档。","Changing topic at the end isn't innovation; it's starting a new save file.","臨尾先換題，呢個唔叫創新，叫重開新 save。"]);
add("fa08","family",["家人","家人","Family member"],["拒絕公開私事","拒绝公开私事","Keep private matters private"],
["家人把你的私事拿去跟親戚到處說","家人把你的私事拿去跟亲戚到处说","A family member shares your private matters with relatives"],
["這件事我只跟你說，不代表可以轉告其他人。之後我的私事請先徵得我同意再分享。","这件事我只跟你说，不代表可以转告其他人。之后我的私事请先征得我同意再分享。","I told you this privately. That doesn't mean it can be shared. Please ask me before discussing my personal matters with others.","呢件事我只同你講，唔代表可以轉告其他人。之後我私事麻煩先問我。"],
["我的事不要拿去當親戚群聊天素材。","我的事不要拿去当亲戚群聊天素材。","Don't turn my private life into family-group content.","我啲事唔好拎去做親戚群聊天素材。"],
["我啲私事唔係家庭版新聞聯播。","我的私事不是家庭版新闻联播。","My private life is not the family news bulletin.","我啲私事唔係家庭版新聞聯播。"]);
add("fa09","family",["伴侶","伴侣","Partner"],["拒絕查帳式追問","拒绝查账式追问","Stop interrogation"],
["伴侶對你的每個行程細節都反覆追問","伴侣对你的每个行程细节都反复追问","Your partner repeatedly interrogates every detail of your plans"],
["我可以分享重要安排，但不希望每次都像被審問一樣逐項交代。","我可以分享重要安排，但不希望每次都像被审问一样逐项交代。","I can share important plans, but I don't want every conversation to feel like an interrogation.","我可以講重要安排，但唔想次次都好似俾人審問咁逐樣交代。"],
["關心和盤問不是同一件事。","关心和盘问不是同一件事。","Concern and interrogation are not the same thing.","關心同盤問唔係同一樣嘢。"],
["我係伴侶，唔係過海關。","我是伴侣，不是在过海关。","I'm your partner, not someone going through border control.","我係伴侶，唔係過海關。"]);
add("p12","parenting",["孩子","孩子","Child"],["不願刷牙","不愿刷牙","Refuses brushing teeth"],
["孩子每天晚上都拖著不肯刷牙","孩子每天晚上都拖着不肯刷牙","Your child delays brushing teeth every night"],
["你可以選自己刷還是我幫你，但刷牙這件事今晚要完成。","你可以选自己刷还是我帮你，但刷牙这件事今晚要完成。","You can choose to brush yourself or let me help, but brushing still needs to happen tonight.","你可以揀自己刷定我幫，但今晚一定要刷。"],
["選擇方式，不選擇刷不刷。","选择方式，不选择刷不刷。","You can choose how, not whether.","你可以揀點刷，唔可以揀刷唔刷。"],
["牙齒今晚冇請假。","牙齿今晚没请假。","Your teeth didn't take the night off.","牙齒今晚冇請假。"]);
add("p13","parenting",["孩子","孩子","Child"],["不願道歉","不愿道歉","Refuses to apologise"],
["孩子做錯事後死活不肯道歉","孩子做错事后死活不肯道歉","Your child refuses to apologise after hurting someone"],
["我不會逼你立刻說對不起，但你需要先理解對方為什麼難受，再想一個修補的方法。","我不会逼你立刻说对不起，但你需要先理解对方为什么难受，再想一个修补的方法。","I won't force an instant apology, but you do need to understand why they were hurt and think of a way to repair it.","我唔逼你即刻講對唔住，但你要先明白對方點解難受，再諗點補救。"],
["一句對不起沒意義，知道自己做錯什麼才有用。","一句对不起没意义，知道自己做错什么才有用。","A forced sorry means little. Understanding what went wrong matters more.","逼出嚟一句對唔住冇意思，知自己錯邊先有用。"],
["道歉唔係密碼，唔係講咗三個字就自動過關。","道歉不是密码，不是说三个字就自动过关。","An apology isn't a password that unlocks the level automatically.","道歉唔係 password，唔係講三個字就自動過關。"]);
add("e08","elder",["長輩","长辈","Elder"],["拒絕催減肥","拒绝催减肥","Stop weight-loss pressure"],
["長輩一直叫你少吃點趕快減肥","长辈一直叫你少吃点赶快减肥","An elder keeps telling you to eat less and lose weight"],
["我的飲食和健康我會自己安排，這個話題不用一直提醒。","我的饮食和健康我会自己安排，这个话题不用一直提醒。","I'll manage my own diet and health. I don't need repeated reminders about this.","飲食同健康我會自己安排，呢個話題唔使一路提。"],
["我吃多少，不需要每餐都有旁白。","我吃多少，不需要每餐都有旁白。","My plate doesn't need live commentary at every meal.","我食幾多，唔需要餐餐都有旁白。"],
["我食飯，唔係參加身材評審。","我吃饭，不是在参加身材评审。","I'm eating dinner, not entering a body judging contest.","我食飯，唔係參加身材評審。"]);
add("fr11","friends",["朋友","朋友","Friend"],["拒絕臨時爽約","拒绝临时爽约","Call out repeated cancellations"],
["朋友總在你出門後才說不來了","朋友总在你出门后才说不来了","A friend cancels only after you've already left home"],
["如果你不確定能不能來，下次請早點說。我已經出門後才取消，真的很影響安排。","如果你不确定能不能来，下次请早点说。我已经出门后才取消，真的很影响安排。","If you're unsure, please tell me earlier next time. Cancelling after I've left home really disrupts my plans.","如果你唔肯定嚟唔嚟，下次早啲講。我出咗門先取消真係好影響安排。"],
["我出門了你才取消，這不是臨時，是太遲。","我出门了你才取消，这不是临时，是太迟。","Cancelling after I've left isn't last-minute. It's too late.","我出咗門你先 cancel，呢個唔係臨時，係太遲。"],
["下次約你，我可能要等你本人現身先出門。","下次约你，我可能要等你本人现身才出门。","Next time I may wait for proof of your physical existence before leaving home.","下次約你，我可能要見到你本人先出門。"]);
add("fr12","friends",["朋友","朋友","Friend"],["拒絕炫耀式比較","拒绝炫耀式比较","Stop competitive comparison"],
["朋友每次聊天都把話題變成比誰更有錢更成功","朋友每次聊天都把话题变成比谁更有钱更成功","A friend turns every conversation into a competition about success"],
["我比較想聊天，不太想每次都比收入、房子和職位。","我比较想聊天，不太想每次都比收入、房子和职位。","I'd rather have a conversation than compare income, houses and titles every time.","我比較想傾偈，唔太想次次都比收入、樓同職位。"],
["朋友聊天不需要排行榜。","朋友聊天不需要排行榜。","Friendship doesn't need a leaderboard.","朋友傾偈唔需要排行榜。"],
["你想聊天定開財富榜？我先確認玩法。","你想聊天还是开财富榜？我先确认玩法。","Are we talking, or launching a wealth ranking? I just want to know the game mode.","你想傾偈定開財富榜？我先確認玩法。"]);
add("r11","relationship",["伴侶","伴侣","Partner"],["拒絕威脅分手","拒绝威胁分手","Stop breakup threats"],
["伴侶每次吵架都拿分手來威脅","伴侣每次吵架都拿分手来威胁","Your partner threatens breakup during every argument"],
["如果分手只是拿來逼我讓步，我不接受。真的想結束可以認真談，不要每次都拿它當武器。","如果分手只是拿来逼我让步，我不接受。真的想结束可以认真谈，不要每次都拿它当武器。","I won't accept breakup threats as leverage. If you truly want to end this, we can discuss it seriously, but don't use it as a weapon.","如果分手只係攞嚟逼我讓步，我唔接受。真係想完可以認真傾，唔好次次當武器。"],
["分手不是吵架的標點符號。","分手不是吵架的标点符号。","Breaking up is not punctuation for every argument.","分手唔係每次嗌交嘅標點符號。"],
["次次都出分手牌，呢副牌遲早會打完。","每次都出分手牌，这副牌迟早会打完。","If breakup is the card you play every time, eventually the deck runs out.","次次都出分手牌，呢副牌遲早打完。"]);
add("r12","relationship",["伴侶","伴侣","Partner"],["拒絕翻手機","拒绝翻手机","Stop phone snooping"],
["你發現伴侶偷偷翻你的手機","你发现伴侣偷偷翻你的手机","You discover your partner secretly checking your phone"],
["你如果有不安可以直接問，但偷偷看我手機越過了我的界線。這件事需要說清楚。","你如果有不安可以直接问，但偷偷看我手机越过了我的界限。这件事需要说清楚。","If you're insecure, ask me directly. Secretly checking my phone crossed a boundary and we need to address it.","你有不安可以直接問，但偷偷睇我手機已經過咗界，呢件事要講清楚。"],
["不信任可以談，偷看不能合理化。","不信任可以谈，偷看不能合理化。","We can discuss distrust. Snooping doesn't become okay because of it.","唔信任可以傾，偷睇唔可以合理化。"],
["密碼解鎖咗手機，唔代表解鎖咗你嘅權限。","密码解锁了手机，不代表解锁了你的权限。","Knowing the password unlocks the phone, not your permission.","密碼解鎖咗手機，唔代表解鎖咗你權限。"]);
add("so07","social",["陌生人","陌生人","Stranger"],["制止拍攝","制止拍摄","Stop filming"],
["陌生人一直拿手機對著你拍","陌生人一直拿手机对着你拍","A stranger keeps filming you with their phone"],
["請不要拍我，也請把包含我的畫面刪掉。","请不要拍我，也请把包含我的画面删掉。","Please stop filming me and delete footage that includes me.","請唔好影我，亦請刪咗有我嘅畫面。"],
["不要拍我。現在停。","不要拍我。现在停。","Don't film me. Stop now.","唔好影我，而家停。"],
["鏡頭轉開，謝謝，我唔係你素材庫。","镜头转开，谢谢，我不是你的素材库。","Point the camera elsewhere. I'm not your content library.","鏡頭轉開，多謝，我唔係你素材庫。"]);
add("so08","social",["陌生人","陌生人","Stranger"],["拒絕評論外貌","拒绝评论外貌","Stop appearance comments"],
["陌生人突然評論你的身材或外貌","陌生人突然评论你的身材或外貌","A stranger comments on your body or appearance"],
["我不需要陌生人評論我的外貌，謝謝。","我不需要陌生人评论我的外貌，谢谢。","I don't need comments from strangers about my appearance, thanks.","我唔需要陌生人評論我外貌，多謝。"],
["我的外貌不需要你的評審。","我的外貌不需要你的评审。","My appearance doesn't require your review.","我外貌唔需要你評審。"],
["你個意見我冇訂閱。","你的意见我没有订阅。","I didn't subscribe to your opinion.","你個意見我冇 subscribe。"]);
add("sv07","service",["商家","商家","Merchant"],["拒絕踢皮球","拒绝踢皮球","Stop support ping-pong"],
["客服一直讓你去找不同部門互相推責","客服一直让你去找不同部门互相推责","Support keeps sending you between departments"],
["我已經聯絡過 X 和 Y 部門。請你們內部協調，不要再讓我重複轉述同一件事。","我已经联系过 X 和 Y 部门。请你们内部协调，不要再让我重复转述同一件事。","I've already contacted X and Y. Please coordinate internally instead of making me repeat the same issue again.","我已經搵過 X 同 Y 部門，麻煩你哋內部協調，唔好再叫我重複講同一件事。"],
["我不是你們部門之間的傳聲筒。","我不是你们部门之间的传声筒。","I'm not the messenger between your departments.","我唔係你哋部門之間嘅傳聲筒。"],
["個波踢夠未？而家麻煩有人接實佢。","这个球踢够了吗？现在麻烦有人接稳它。","Enough support ping-pong. Someone needs to own this now.","個波踢夠未？而家麻煩有人接實佢。"]);
add("sv08","service",["外賣平台","外卖平台","Delivery platform"],["投訴漏餐","投诉漏餐","Report missing item"],
["外賣少了一份餐但平台只給很小補償","外卖少了一份餐但平台只给很小补偿","A delivery is missing an item but the platform offers only a tiny credit"],
["訂單少了 XX，這不是體驗問題，而是未完整履約。請按缺少商品金額處理退款。","订单少了 XX，这不是体验问题，而是未完整履约。请按缺少商品金额处理退款。","XX is missing from the order. This is not a minor experience issue; the order wasn't fulfilled. Please refund the missing item.","訂單少咗 XX，呢個唔係體驗問題，係未完整履約。麻煩按缺少商品退款。"],
["少了整份餐，不是少了一點心情。請按實際缺失退款。","少了整份餐，不是少了一点心情。请按实际缺失退款。","An entire item is missing, not a bit of my mood. Refund the actual missing item.","少咗成份餐，唔係少咗少少心情。按實際缺失退款。"],
["我唔係嚟抽外賣盲盒。","我不是来抽外卖盲盒的。","I didn't order a delivery mystery box.","我唔係嚟抽外賣盲盒。"]);
add("j07","job",["招聘方","招聘方","Recruiter"],["拒絕壓薪","拒绝压薪","Push back on salary pressure"],
["招聘方一直用「市場不好」要求你降很多薪資","招聘方一直用“市场不好”要求你降很多薪资","A recruiter keeps using the market to pressure your salary lower"],
["我理解市場變化，但這個職位的責任和我的經驗並沒有因此減少。我的合理區間仍是 X–Y。","我理解市场变化，但这个职位的责任和我的经验并没有因此减少。我的合理区间仍是 X–Y。","I understand the market has changed, but the responsibility and my experience haven't disappeared. My reasonable range remains X–Y.","我明白市場有變，但職責同我經驗冇因此減少。合理區間仍然係 X–Y。"],
["市場不好不是免費折價券。","市场不好不是免费折价券。","A weak market isn't a free discount coupon.","市場差唔係免費折價券。"],
["市場凍，唔代表我人工要打骨折。","市场冷，不代表我工资要骨折价。","A cold market doesn't mean my salary needs a clearance-sale price.","市場凍，唔代表我人工要打骨折。"]);
add("b07","business",["客戶","客户","Client"],["拒絕越級指揮","拒绝越级指挥","Stop bypassing process"],
["客戶繞過你直接指揮你的同事改東西","客户绕过你直接指挥你的同事改东西","A client bypasses you and directly instructs your team"],
["為避免版本混亂，後續需求請統一由我這邊確認，再安排給團隊。","为避免版本混乱，后续需求请统一由我这边确认，再安排给团队。","To avoid version confusion, please route requests through me before the team acts on them.","為免版本亂，之後需求請統一經我確認，再安排俾 team。"],
["不要繞過窗口直接改團隊工作。","不要绕过窗口直接改团队工作。","Please don't bypass the agreed contact and redirect the team's work.","唔好繞過窗口直接改 team 工作。"],
["一個 project 唔需要同時有十個導演。","一个项目不需要同时有十个导演。","One project doesn't need ten directors at once.","一個 project 唔需要同時有十個導演。"]);
add("tr07","travel",["同行朋友","同行朋友","Travel companion"],["拒絕強迫購物","拒绝强迫购物","Decline shopping pressure"],
["同行朋友一直拉你去買你完全不想買的東西","同行朋友一直拉你去买你完全不想买的东西","Your travel companion keeps pressuring you to shop for things you don't want"],
["你想買可以慢慢看，我這邊不需要。我先去附近逛，等下再會合。","你想买可以慢慢看，我这边不需要。我先去附近逛，等下再会合。","Take your time shopping if you want. I don't need anything, so I'll look around nearby and meet you later.","你想買可以慢慢睇，我冇需要。我去附近行下，等陣再會合。"],
["你想買不代表我要一起買。","你想买不代表我要一起买。","You wanting to buy it doesn't mean I need to join.","你想買唔代表我要一齊買。"],
["旅遊可以同行，銀包唔使同步。","旅游可以同行，钱包不用同步。","We can travel together without synchronising wallets.","旅行可以同行，銀包唔使同步。"]);
add("tr08","travel",["同行朋友","同行朋友","Travel companion"],["拒絕拖行程","拒绝拖行程","Stop chronic delays"],
["同行朋友每天都準備很久讓全團等","同行朋友每天都准备很久让全团等","A travel companion takes ages to get ready and delays everyone"],
["明天我們 X 點準時出發。如果你還沒準備好，可以自己之後過來會合。","明天我们 X 点准时出发。如果你还没准备好，可以自己之后过来会合。","We're leaving at X tomorrow. If you're not ready, you can join us later.","聽日 X 點準時出發。如果你未準備好，可以之後自己嚟會合。"],
["大家不能每天都等你一個人。","大家不能每天都等你一个人。","The whole group can't wait for one person every day.","大家唔可以日日等你一個。"],
["旅行團唔係你私人候機室。","旅行团不是你的私人候机室。","The travel group isn't your private waiting lounge.","旅行團唔係你私人候機室。"]);
add("m06","medical",["醫護人員","医护人员","Clinician"],["追問檢查必要性","追问检查必要性","Ask why a test is needed"],
["你不明白為什麼需要做一項昂貴檢查","你不明白为什么需要做一项昂贵检查","You don't understand why an expensive test is needed"],
["我想先了解這項檢查主要要排除什麼、結果會怎麼影響後續治療，以及是否有其他選項。","我想先了解这项检查主要要排除什么、结果会怎么影响后续治疗，以及是否有其他选项。","I'd like to understand what this test is looking for, how the result would change treatment, and whether there are alternatives.","我想先了解呢個檢查主要排除咩、結果點影響後續治療，同埋有冇其他選擇。"],
["我可以做，但要先知道為什麼做。","我可以做，但要先知道为什么做。","I'm open to doing it, but I need to know why first.","我可以做，但要先知點解做。"],
["收費單我睇到，醫學理由都想一齊睇到。","收费单我看到了，医学理由也想一起看到。","I've seen the price tag. I'd also like to see the medical rationale.","收費單我睇到，醫學理由都想一齊睇到。"]);
add("on09","online",["網友","网友","Online user"],["制止人身攻擊","制止人身攻击","Stop personal attacks"],
["討論不同意見時對方開始攻擊你本人","讨论不同意见时对方开始攻击你本人","Someone starts attacking you personally during a disagreement"],
["可以不同意我的觀點，但不要把討論變成人身攻擊。","可以不同意我的观点，但不要把讨论变成人身攻击。","You can disagree with my point without turning the discussion into personal attacks.","你可以唔同意我觀點，但唔好將討論變成人身攻擊。"],
["講觀點，別講我本人。","讲观点，别讲我本人。","Address the argument, not me.","講觀點，唔好講我本人。"],
["論點打唔贏就打人設，幾方便喎。","论点打不赢就打人设，挺方便啊。","Can't beat the argument, so switch to attacking the person. Convenient.","論點打唔贏就打人設，幾方便喎。"]);
add("on10","online",["群友","群友","Group member"],["拒絕道德綁架","拒绝道德绑架","Reject guilt-tripping"],
["群裡有人用「不轉發就是沒愛心」逼大家轉消息","群里有人用“不转发就是没爱心”逼大家转消息","Someone says people who don't forward a message are heartless"],
["是否轉發我會看資訊是否可靠，不會用愛不愛心來判斷。","是否转发我会看信息是否可靠，不会用有没有爱心来判断。","I'll decide whether to forward based on reliability, not whether someone labels me caring or uncaring.","轉唔轉我會睇資訊可靠唔可靠，唔會用有冇愛心嚟判斷。"],
["別用道德標籤替消息做背書。","别用道德标签替消息做背书。","Don't use moral labels as evidence for a message.","唔好用道德標籤幫消息背書。"],
["資訊冇來源，就算加十個愛心都唔會變真。","信息没来源，就算加十个爱心也不会变真。","A message without a source doesn't become true because you add ten heart emojis.","資訊冇來源，加十個愛心都唔會變真。"]);
window.CHAT_SCENARIOS=(window.CHAT_SCENARIOS||[]).concat(A);
})();