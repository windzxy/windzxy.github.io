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
function add(id,d,r,g,t,f,x,p){
 A.push({id,domain:d,domainLabel:D[d],
  relation:{hant:r[0],hans:r[1],en:r[2]},goal:{hant:g[0],hans:g[1],en:g[2]},
  title:{hant:t[0],hans:t[1],en:t[2]},
  replies:{
   zh:{formal:{hant:f[0],hans:f[1]},direct:{hant:x[0],hans:x[1]},roast:{hant:p[0],hans:p[1]}},
   en:{formal:f[2],direct:x[2],roast:p[2]},
   yue:{formal:f[3],direct:x[3],roast:p[3]}
  }});
}

add("wave9-001","workplace",["同事","同事","Colleague"],["拒絕最後一刻急件","拒绝最后一刻急件","Reject last-minute urgent work"],
["同事臨下班才丟一份急件叫你今天完成","同事临下班才丢一份急件叫你今天完成","A colleague drops an urgent task on you just before you leave"],
["我今天無法完整處理，先確認最急的一部分，其餘明天排。","我今天无法完整处理，先确认最急的一部分，其余明天排。","I can't complete the whole thing today. Let's identify the urgent part and schedule the rest tomorrow.","我今日做唔晒，先確認最急嗰部分，其餘聽日排。"],
["臨下班才丟過來，不代表今天一定做得完。","临下班才丢过来，不代表今天一定做得完。","Dropping it at the end of the day doesn't make same-day completion possible.","臨收工先掉過嚟，唔代表今日一定做得完。"],
["文件會瞬移，時間唔會。","文件会瞬移，时间不会。","The file can teleport. Time can't.","文件會瞬移，時間唔會。"]);

add("wave9-002","workplace",["上司","上司","Manager"],["反對頻繁改方向","反对频繁改方向","Push back on constant pivots"],
["上司每天改一次方向，前一天的工作全部推翻","上司每天改一次方向，前一天的工作全部推翻","Your manager changes direction daily and invalidates prior work"],
["方向可以調整，但目前變更頻率已影響交付。建議先鎖定一個版本到 X 日再評估。","方向可以调整，但目前变更频率已影响交付。建议先锁定一个版本到 X 日再评估。","We can adjust direction, but the current frequency is disrupting delivery. I suggest locking one version until X and reviewing then.","方向可以調，但而家改得太密已經影響交付。建議先鎖一版到 X 日再評估。"],
["一直改方向，就不可能同時要求進度不受影響。","一直改方向，就不可能同时要求进度不受影响。","Constantly changing direction means progress will be affected.","一路改方向，就唔可能同時要求進度冇影響。"],
["我哋而家唔係做 project，係每日重開新周目。","我们现在不是做项目，是每天重开新周目。","At this point we're not running a project; we're starting a new playthrough every day.","我哋而家唔係做 project，係每日重開新周目。"]);

add("wave9-003","study",["老師","老师","Teacher"],["要求私下談成績","要求私下谈成绩","Ask for private grade feedback"],
["老師在全班面前直接念出你的低分","老师在全班面前直接念出你的低分","A teacher announces your low grade in front of the class"],
["老師，我願意討論成績和改進，但希望之後可以私下談，不要公開念分數。","老师，我愿意讨论成绩和改进，但希望之后可以私下谈，不要公开念分数。","I'm happy to discuss my grade and how to improve, but I'd prefer future feedback privately.","老師，我願意傾成績同點改善，但希望之後私下講，唔好公開讀分數。"],
["成績可以談，沒必要公開處刑。","成绩可以谈，没必要公开处刑。","We can discuss the grade without turning it into a public execution.","成績可以傾，冇必要公開處刑。"],
["分數已經夠難睇，唔需要再配廣播功能。","分数已经够难看，不需要再配广播功能。","The score was rough enough without adding a broadcast feature.","個分已經夠難睇，唔需要再加廣播功能。"]);

add("wave9-004","study",["同學","同学","Classmate"],["拒絕考前伸手","拒绝考前伸手","Stop last-minute freeloading"],
["同學平時不來上課，考前才找你要整套筆記","同学平时不上课，考前才找你要整套笔记","A classmate skips class and asks for all your notes before the exam"],
["我可以分享重點，但完整筆記不方便每次直接給。你先看課件，有問題再問。","我可以分享重点，但完整笔记不方便每次直接给。你先看课件，有问题再问。","I can share key points, but I won't keep handing over my full notes. Check the materials first.","我可以 share 重點，但完整筆記唔方便次次直接俾。你先睇課件，有問題再問。"],
["平時不上課，考前也不能把我的筆記當下載包。","平时不上课，考前也不能把我的笔记当下载包。","Skipping class doesn't turn my notes into a download pack before the exam.","平時唔上堂，考前都唔可以當我筆記係 download pack。"],
["我本筆記唔係期末限定免費 DLC。","我的笔记不是期末限定免费 DLC。","My notes are not a free end-of-term DLC.","我本筆記唔係期末限定免費 DLC。"]);

add("wave9-005","family",["家人","家人","Family member"],["拒絕擅自借物","拒绝擅自借物","Stop lending belongings out"],
["家人沒問你就把你的東西借給別人","家人没问你就把你的东西借给别人","A family member lends your belongings to someone without asking"],
["我的東西之後請先問我再借給別人，這次也麻煩幫我拿回來。","我的东西之后请先问我再借给别人，这次也麻烦帮我拿回来。","Please ask me before lending my belongings to anyone. Also, please help get this one back.","我啲嘢之後借俾人之前請先問我，今次都麻煩幫我拎返。"],
["我的東西不是家庭公共財產。","我的东西不是家庭公共财产。","My belongings aren't automatic family property.","我啲嘢唔係家庭公共財產。"],
["你借得幾順手，但物主仲未收到通知。","你借得挺顺手，但物主还没收到通知。","That loan was impressively smooth considering the owner wasn't informed.","你借得幾順手，但物主仲未收到通知。"]);

add("wave9-006","family",["家人","家人","Family member"],["保護房間隱私","保护房间隐私","Set room privacy"],
["家人總不敲門直接進你的房間","家人总不敲门直接进你的房间","A family member keeps entering your room without knocking"],
["進我房間前麻煩先敲門，等我回應再進。這是我需要的基本私人空間。","进我房间前麻烦先敲门，等我回应再进。这是我需要的基本私人空间。","Please knock and wait for a response before entering my room. I need that basic privacy.","入我房前麻煩先敲門，等我應咗再入。呢個係基本私人空間。"],
["門不是裝飾，請敲。","门不是装饰，请敲。","The door isn't decoration. Knock.","道門唔係裝飾，請敲。"],
["房門有敲門功能，免費嘅。","房门有敲门功能，免费的。","The door comes with a free knocking feature.","房門有敲門功能，免費嘅。"]);

add("wave9-007","parenting",["孩子","孩子","Child"],["處理拖延出門","处理拖延出门","Get ready on time"],
["孩子每次出門前才慢吞吞找東西","孩子每次出门前才慢吞吞找东西","Your child always starts looking for things when it's time to leave"],
["還有十分鐘出門。現在先拿鞋、外套和水瓶，其他東西不急。","还有十分钟出门。现在先拿鞋、外套和水瓶，其他东西不急。","We leave in ten minutes. Get your shoes, coat and water bottle first.","仲有十分鐘出門。依家先攞鞋、外套同水樽，其他唔急。"],
["出門時間到了，就不再加新任務。","出门时间到了，就不再加新任务。","Once it's time to leave, we stop adding new tasks.","到出門時間就唔再加新任務。"],
["門口唔會自己走過嚟接你。","门口不会自己走过来接你。","The front door isn't coming over to collect you.","門口唔會自己行過嚟接你。"]);

add("wave9-008","parenting",["孩子","孩子","Child"],["處理插嘴","处理插嘴","Handle interrupting"],
["大人說話時孩子一直搶話打斷","大人说话时孩子一直抢话打断","Your child keeps interrupting adults who are speaking"],
["我知道你很想說。先讓對方講完，等一下我會給你完整時間說。","我知道你很想说。先让对方讲完，等一下我会给你完整时间说。","I know you want to speak. Let them finish, then you'll get your full turn.","我知你好想講。先俾對方講完，等陣輪到你完整講。"],
["想說可以，先等別人把句子講完。","想说可以，先等别人把句子讲完。","You can speak. First let the other person finish their sentence.","想講可以，先等人講完句說話。"],
["咪高峰唔使搶，等陣輪到你。","麦克风不用抢，等会儿轮到你。","No need to grab the microphone. Your turn is coming.","咪高峰唔使搶，等陣輪到你。"]);

add("wave9-009","elder",["長輩","长辈","Elder"],["拒絕代你決定","拒绝替你决定","Keep decision authority"],
["長輩沒問你就替你答應了一件重要事情","长辈没问你就替你答应了一件重要事情","An elder commits you to something important without asking"],
["我知道你是好意，但涉及我的安排，之後請先問我，不要直接替我答應。","我知道你是好意，但涉及我的安排，之后请先问我，不要直接替我答应。","I know you meant well, but if it affects my schedule, please ask before committing me.","我知你係好意，但涉及我安排，之後請先問我，唔好直接代我應承。"],
["我的時間和決定，還是要我本人確認。","我的时间和决定，还是要我本人确认。","My time and decisions still need my approval.","我嘅時間同決定，都要我本人確認。"],
["我本人仲在生，唔使代簽人生行程。","我本人还在，不用代签人生行程。","I'm still here; no need to sign my life schedule for me.","我本人仲喺度，唔使代簽人生行程。"]);

add("wave9-010","elder",["長輩","长辈","Elder"],["拒絕追問薪資","拒绝追问薪资","Stop salary questions"],
["親戚飯桌上一直追問你現在月薪多少","亲戚饭桌上一直追问你现在月薪多少","A relative keeps asking your salary at dinner"],
["工作近況可以聊，具體薪資我就不分享了。","工作近况可以聊，具体薪资我就不分享了。","I'm happy to talk about work, but I keep the exact salary private.","工作近況可以傾，具體人工我就唔分享。"],
["薪資是私人資訊，我不打算報數。","薪资是私人信息，我不打算报数。","My salary is private. I'm not giving a number.","人工係私人資料，我唔打算報數。"],
["今日食飯，唔係開年度財報。","今天吃饭，不是开年度财报。","This is dinner, not an annual earnings call.","今日食飯，唔係開年度財報。"]);

add("wave9-011","friends",["朋友","朋友","Friend"],["拒絕臨時叫你買單","拒绝临时叫你买单","Reject surprise bill"],
["朋友吃完才說自己沒帶錢要你先全部付","朋友吃完才说自己没带钱要你先全部付","A friend says after the meal that they have no money and wants you to cover everything"],
["我可以先墊，但請你今天把自己的部分轉回來。","我可以先垫，但请你今天把自己的部分转回来。","I can cover it now, but please send me your share today.","我可以先墊，但今日請轉返你嗰份。"],
["可以墊，不等於我請客。","可以垫，不等于我请客。","I can front the money. That doesn't mean I'm treating.","可以墊，唔等於我請。"],
["我個銀包今日係橋樑，唔係慈善基金。","我的钱包今天是桥梁，不是慈善基金。","My wallet is a bridge today, not a charity fund.","我個銀包今日係橋樑，唔係慈善基金。"]);

add("wave9-012","friends",["朋友","朋友","Friend"],["拒絕當司機","拒绝当司机","Stop being the default driver"],
["朋友每次聚會都默認你負責接送所有人","朋友每次聚会都默认你负责接送所有人","Friends always assume you'll drive everyone"],
["我這次不負責接送，大家各自安排交通。","我这次不负责接送，大家各自安排交通。","I'm not doing pickup and drop-off this time. Everyone should arrange their own transport.","今次我唔負責接送，大家自己安排交通。"],
["我有車，不代表我是固定司機。","我有车，不代表我是固定司机。","Owning a car doesn't make me the permanent driver.","我有車唔代表我係固定司機。"],
["友情包唔包車，今次答案係唔包。","友情包不包车，这次答案是不包。","Does friendship include chauffeur service? Not this time.","友情包唔包車，今次答案係唔包。"]);

add("wave9-013","relationship",["伴侶","伴侣","Partner"],["拒絕拿分手試探","拒绝拿分手试探","Stop breakup tests"],
["伴侶故意說分手來看你會不會挽留","伴侣故意说分手来看你会不会挽留","Your partner says 'let's break up' just to see if you'll chase"],
["分手這種話我會當真，不適合拿來測試感情。你有不安可以直接說。","分手这种话我会当真，不适合拿来测试感情。你有不安可以直接说。","I take breakup talk seriously. Don't use it as a test; tell me directly if you're insecure.","分手呢啲說話我會當真，唔適合攞嚟測試感情。有不安可以直接講。"],
["不要用分手測試我會不會追。","不要用分手测试我会不会追。","Don't use breakup threats to test whether I'll chase.","唔好用分手測試我會唔會追。"],
["感情唔係 A/B test，唔使成日測轉化率。","感情不是 A/B test，不用总测转化率。","A relationship isn't an A/B test. Stop measuring conversion.","感情唔係 A/B test，唔使成日測轉化率。"]);

add("wave9-014","relationship",["伴侶","伴侣","Partner"],["拒絕公開吵架","拒绝公开吵架","Move argument private"],
["伴侶在朋友面前開始跟你吵私人問題","伴侣在朋友面前开始跟你吵私人问题","Your partner starts arguing about a private issue in front of friends"],
["這件事我們回去私下談，我不想在別人面前處理。","这件事我们回去私下谈，我不想在别人面前处理。","Let's discuss this privately later. I don't want to handle it in front of other people.","呢件事返去私下傾，我唔想喺人面前處理。"],
["私人問題，私下說。","私人问题，私下说。","Private issue, private conversation.","私人問題，私下講。"],
["呢場唔係公開直播，返去先傾。","这不是公开直播，回去再聊。","This isn't a public livestream. We'll talk later.","呢場唔係公開直播，返去先傾。"]);

add("wave9-015","social",["陌生人","陌生人","Stranger"],["拒絕碰你物品","拒绝碰你物品","Stop touching belongings"],
["陌生人未問就拿你的東西看","陌生人没问就拿你的东西看","A stranger picks up your belongings without asking"],
["不好意思，請先放回去。要看可以先問我。","不好意思，请先放回去。要看可以先问我。","Please put that back. If you want to look at it, ask me first.","唔好意思，請放返低。想睇可以先問我。"],
["別碰我的東西。","别碰我的东西。","Don't touch my things.","唔好掂我啲嘢。"],
["手速幾快，權限未開。","手速挺快，权限没开。","Quick hands. Permission wasn't granted.","手速幾快，權限未開。"]);

add("wave9-016","social",["聚會朋友","聚会朋友","Social group"],["拒絕逼你表演","拒绝逼你表演","Decline being put on the spot"],
["聚會上大家一直起鬨要你唱歌或表演","聚会上大家一直起哄要你唱歌或表演","People at a gathering keep pressuring you to perform"],
["謝謝，但我今天不想表演，大家繼續玩就好。","谢谢，但我今天不想表演，大家继续玩就好。","Thanks, but I don't want to perform tonight. Please carry on without me.","多謝，不過我今日唔想表演，大家繼續玩就得。"],
["我說不唱，就不用再起鬨。","我说不唱，就不用再起哄。","I said I'm not singing. No need to keep pushing.","我話唔唱，就唔使再起鬨。"],
["KTV 有點歌系統，冇強制徵兵系統。","KTV 有点歌系统，没有强制征兵系统。","Karaoke has a song queue, not conscription.","KTV 有點歌系統，冇強制徵兵系統。"]);

add("wave9-017","service",["商家","商家","Merchant"],["拒絕只退優惠券","拒绝只退优惠券","Reject coupon-only compensation"],
["商家明顯出錯卻只願意給下次使用的優惠券","商家明显出错却只愿意给下次使用的优惠券","A merchant makes a clear mistake but offers only a future-use coupon"],
["這次問題已經造成實際損失，我希望按本次訂單處理退款或補償，不接受只給下次優惠券。","这次问题已经造成实际损失，我希望按本次订单处理退款或补偿，不接受只给下次优惠券。","This caused an actual loss on this order. I'd like a refund or compensation now, not only a future-use coupon.","今次已經有實際損失，我希望按今張單退款或補償，唔接受淨係下次 coupon。"],
["你們這次出錯，不應該叫我下次再來才能拿補償。","你们这次出错，不应该叫我下次再来才能拿补偿。","Your mistake now shouldn't require me to come back later to receive compensation.","你哋今次出錯，唔應該要我下次再嚟先有補償。"],
["做錯一次，補償仲要綁定二次消費，幾識做生意。","做错一次，补偿还绑定二次消费，挺会做生意。","Make a mistake once, then tie compensation to another purchase. Impressive business model.","做錯一次，補償仲綁二次消費，幾識做生意。"]);

add("wave9-018","service",["司機","司机","Driver"],["拒絕繞路","拒绝绕路","Challenge an unnecessary detour"],
["網約車司機明顯繞遠路增加費用","网约车司机明显绕远路增加费用","A ride-hailing driver takes an obvious detour that raises the fare"],
["導航顯示有更直接的路線，麻煩按導航走。這段繞路我也會在平台備註。","导航显示有更直接的路线，麻烦按导航走。这段绕路我也会在平台备注。","The navigation shows a more direct route. Please follow it; I'll also note this detour in the app.","導航顯示有更直接路線，麻煩跟導航。呢段繞路我都會喺平台備註。"],
["不要繞路，按導航走。","不要绕路，按导航走。","Don't take a detour. Follow the navigation.","唔好繞路，跟導航行。"],
["我坐車，唔係參加城市觀光團。","我坐车，不是参加城市观光团。","I booked a ride, not a city sightseeing tour.","我坐車，唔係參加城市觀光團。"]);

add("wave9-019","job",["招聘方","招聘方","Recruiter"],["拒絕隱瞞工作內容","拒绝隐瞒工作内容","Clarify hidden responsibilities"],
["面試到最後才發現工作內容比招聘廣告多很多","面试到最后才发现工作内容比招聘广告多很多","Late in the process you discover the role is much broader than advertised"],
["目前說明的職責和招聘頁面差異很大，我需要重新確認職級、薪資和實際範圍再決定。","目前说明的职责和招聘页面差异很大，我需要重新确认职级、薪资和实际范围再决定。","The described responsibilities differ significantly from the listing. I need to reassess scope, level and compensation before deciding.","而家講嘅職責同招聘頁差好遠，我要重新確認職級、人工同實際 scope 再決定。"],
["工作變大了，條件也要重新談。","工作变大了，条件也要重新谈。","The role got bigger, so the terms need reopening too.","份工變大咗，條件都要重新傾。"],
["JD 係 Lite，面試講緊 Pro，價錢都要跟版本。","JD 是 Lite，面试说的是 Pro，价格也要跟版本。","The listing was Lite; the interview describes Pro. The price needs to match the version.","JD 係 Lite，面試講緊 Pro，價錢都要跟版本。"]);

add("wave9-020","job",["招聘方","招聘方","Recruiter"],["拒絕催即時答覆","拒绝催即时答复","Ask for offer review time"],
["收到 offer 後招聘方要求你幾小時內立刻決定","收到 offer 后招聘方要求你几小时内立刻决定","A recruiter demands an answer within hours of sending an offer"],
["謝謝 offer。我需要合理時間閱讀條款並評估，會在 X 日前正式回覆。","谢谢 offer。我需要合理时间阅读条款并评估，会在 X 日前正式回复。","Thank you for the offer. I need reasonable time to review the terms and will respond formally by X.","多謝 offer。我需要合理時間睇條款同評估，會喺 X 日前正式覆。"],
["重大決定不會因為你催就幾小時內完成。","重大决定不会因为你催就几小时内完成。","A major decision doesn't become an hours-long decision because you're rushing it.","重大決定唔會因為你催就幾個鐘內做完。"],
["Offer 唔係限時秒殺，我會睇完先答。","Offer 不是限时秒杀，我会看完再答。","An offer isn't a flash sale. I'll review it before answering.","Offer 唔係限時秒殺，我睇完先答。"]);

add("wave9-021","business",["客戶","客户","Client"],["拒絕口頭加需求","拒绝口头加需求","Document added scope"],
["客戶在電話裡臨時加很多需求又不願寫進文件","客户在电话里临时加很多需求又不愿写进文件","A client adds many requirements by phone but won't document them"],
["剛才新增的 A、B、C 我會整理成文字，請確認後我們再按新增範圍執行。","刚才新增的 A、B、C 我会整理成文字，请确认后我们再按新增范围执行。","I'll document the added A, B and C. Please confirm them before we proceed under the revised scope.","頭先新增嘅 A、B、C 我會整理成文字，確認後先按新增 scope 做。"],
["口頭新增也算新增，請書面確認。","口头新增也算新增，请书面确认。","Verbal additions are still additions. Please confirm them in writing.","口頭新增都係新增，請書面確認。"],
["電話講完就當冇改 scope，呢個魔法我學唔識。","电话说完就当没改 scope，这个魔法我学不会。","I haven't learned the magic where phone requests don't count as scope changes.","電話講完就當冇改 scope，呢個魔法我學唔識。"]);

add("wave9-022","business",["供應商","供应商","Supplier"],["追究反覆失約","追究反复失约","Address repeated missed commitments"],
["供應商連續幾次承諾交期都沒做到","供应商连续几次承诺交期都没做到","A supplier repeatedly misses promised delivery dates"],
["目前已連續 X 次未按承諾交付。請給一個可落實的日期，以及這次如何確保不再延誤。","目前已连续 X 次未按承诺交付。请给一个可落实的日期，以及这次如何确保不再延误。","You've missed X committed dates. Please give a realistic date and explain how this delay will be prevented again.","而家已經連續 X 次未按承諾交付。請俾一個落實到嘅日期，同埋點確保今次唔再 delay。"],
["我需要的是能做到的日期，不是下一個承諾。","我需要的是能做到的日期，不是下一个承诺。","I need a date you can meet, not another promise.","我要嘅係做到嘅日期，唔係下一個承諾。"],
["你哋個 deadline 最近比較像許願池。","你们的 deadline 最近比较像许愿池。","Your deadlines are starting to look like a wishing well.","你哋個 deadline 最近比較似許願池。"]);

add("wave9-023","travel",["同行朋友","同行朋友","Travel companion"],["拒絕臨時換住宿","拒绝临时换住宿","Reject last-minute hotel switch"],
["同行朋友到出發前才突然想換已訂好的酒店","同行朋友到出发前才突然想换已经订好的酒店","A travel companion wants to change the booked hotel right before departure"],
["酒店已經確認且臨近出發，現在更換會增加成本和風險。我傾向按原訂單走。","酒店已经确认且临近出发，现在更换会增加成本和风险。我倾向按原订单走。","The hotel is confirmed and departure is close. Changing now adds cost and risk, so I prefer keeping the booking.","酒店已確認又就嚟出發，而家換會加成本同風險，我傾向跟原訂單。"],
["現在才換酒店，我不同意。","现在才换酒店，我不同意。","I don't agree to changing hotels this late.","而家先換酒店，我唔同意。"],
["旅行未開始，住宿版本已經想 hotfix。","旅行还没开始，住宿版本已经想 hotfix。","The trip hasn't started and the hotel already wants a hotfix.","旅行未開始，住宿版本已經想 hotfix。"]);

add("wave9-024","travel",["同行朋友","同行朋友","Travel companion"],["拒絕行程全聽一人","拒绝行程全听一个人","Share itinerary decisions"],
["同行朋友把整趟旅行都按自己喜好安排","同行朋友把整趟旅行都按自己喜好安排","A travel companion plans the entire trip around their own preferences"],
["這趟是一起旅行，每個人都應該有想去的地方。剩下行程我們輪流選。","这趟是一起旅行，每个人都应该有想去的地方。剩下行程我们轮流选。","We're travelling together, so everyone should get some choices. Let's take turns for the remaining itinerary.","呢趟係一齊旅行，每個人都應該有想去嘅地方。剩低行程輪流揀。"],
["不是你一個人的旅行，行程要一起決定。","不是你一个人的旅行，行程要一起决定。","It's not your solo trip. The itinerary needs shared decisions.","唔係你一個人旅行，行程要一齊決定。"],
["你可以做領隊，唔等於可以做獨裁者。","你可以做领队，不等于可以做独裁者。","You can be the organiser without becoming the dictator.","你可以做領隊，唔等於可以做獨裁者。"]);

add("wave9-025","medical",["醫護人員","医护人员","Clinician"],["詢問替代方案","询问替代方案","Ask about alternatives"],
["醫生建議一個方案，但你想知道是否還有其他選擇","医生建议一个方案，但你想知道是否还有其他选择","A clinician recommends one option and you want to know alternatives"],
["除了這個方案，還有其他可行選擇嗎？各自的好處、風險和等待時間有什麼不同？","除了这个方案，还有其他可行选择吗？各自的好处、风险和等待时间有什么不同？","Are there other reasonable options? How do they differ in benefits, risks and timing?","除咗呢個方案，仲有冇其他可行選擇？好處、風險同時間有咩唔同？"],
["我想知道選項，不想只知道一個答案。","我想知道选项，不想只知道一个答案。","I'd like to understand the options, not only one answer.","我想知有咩選項，唔想淨係知一個答案。"],
["治療唔係單選題，我想先睇晒選項。","治疗不是单选题，我想先看全选项。","Treatment isn't necessarily a single-choice question. I'd like to see the options.","治療唔係單選題，我想先睇晒選項。"]);

add("wave9-026","medical",["家人","家人","Family member"],["拒絕亂停藥","拒绝乱停药","Discourage stopping medication"],
["家人覺得好一點就想自己停掉醫生開的藥","家人觉得好一点就想自己停掉医生开的药","A family member wants to stop prescribed medication because they feel better"],
["先不要自己停藥。可以先問開藥的醫生或藥師，確認怎麼調整比較安全。","先不要自己停药。可以先问开药的医生或药师，确认怎么调整比较安全。","Don't stop it on your own. Check with the prescriber or pharmacist first about a safe adjustment.","先唔好自己停藥。問返醫生或者藥劑師，確認點調整先安全。"],
["覺得好一點，不等於可以自己改藥。","觉得好一点，不等于可以自己改药。","Feeling better doesn't automatically mean changing the medication yourself.","覺得好啲，唔等於可以自己改藥。"],
["身體有好轉係好消息，但藥物唔好自己改劇本。","身体有好转是好消息，但药物别自己改剧本。","Feeling better is good news, but don't rewrite the medication plan yourself.","身體好返啲係好消息，但藥物唔好自己改劇本。"]);

add("wave9-027","online",["網友","网友","Online user"],["拒絕索要私照","拒绝索要私照","Refuse requests for private photos"],
["剛認識的網友一直向你要私人照片","刚认识的网友一直向你要私人照片","A new online contact keeps asking you for private photos"],
["我不會發私人照片，請不要再問。","我不会发私人照片，请不要再问。","I don't send private photos. Please stop asking.","我唔會發私人相，請唔好再問。"],
["不發，這個話題結束。","不发，这个话题结束。","No. I'm not sending any. End of topic.","唔發，呢個話題完。"],
["相簿權限未開，而且唔打算開。","相册权限没开，而且不打算开。","Photo access is disabled and staying that way.","相簿權限未開，而且唔打算開。"]);

add("wave9-028","online",["群友","群友","Group member"],["制止洗版吵架","制止刷屏吵架","Stop group-chat fighting"],
["兩個人在群裡連續吵架把所有訊息都洗掉","两个人在群里连续吵架把所有信息都刷掉","Two people keep fighting in a group chat and flood everything else"],
["你們的分歧可以私聊處理，群裡還有其他資訊需要大家看到。","你们的分歧可以私聊处理，群里还有其他信息需要大家看到。","Please take the disagreement to DMs. The group still needs space for other information.","你哋分歧可以私聊處理，group 仲有其他資訊要大家睇。"],
["別在群裡刷屏吵，私聊。","别在群里刷屏吵，私聊。","Stop flooding the group with the argument. Take it private.","唔好喺 group 洗版嘈，私聊。"],
["兩位辯手麻煩轉場，呢度唔係直播擂台。","两位辩手请转场，这里不是直播擂台。","Contestants, please move venues. This isn't a live debate arena.","兩位辯手麻煩轉場，呢度唔係直播擂台。"]);

window.CHAT_SCENARIOS=(window.CHAT_SCENARIOS||[]).concat(A);
})();