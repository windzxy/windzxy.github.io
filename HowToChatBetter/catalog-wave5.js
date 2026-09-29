;(function(){
var D={
 workplace:{hant:"職場",hans:"职场",en:"Work"},
 study:{hant:"學習",hans:"学习",en:"Study"},
 family:{hant:"家庭",hans:"家庭",en:"Family"},
 parenting:{hant:"育兒",hans:"育儿",en:"Parenting"},
 elder:{hant:"長輩",hans:"长辈",en:"Elders"},
 friends:{hant:"朋友",hans:"朋友",en:"Friends"},
 relationship:{hant:"感情",hans:"感情",en:"Relationship"},
 social:{hant:"社交",hans:"社交",en:"Social"},
 service:{hant:"服務",hans:"服务",en:"Service"},
 job:{hant:"求職",hans:"求职",en:"Job Search"},
 business:{hant:"商務",hans:"商务",en:"Business"},
 travel:{hant:"旅行",hans:"旅行",en:"Travel"},
 medical:{hant:"醫療",hans:"医疗",en:"Medical"},
 online:{hant:"網絡",hans:"网络",en:"Online"}
};
var A=[];
function R(hf,sf,hd,sd,hr,sr,ef,ed,er,yf,yd,yr){return{
 zh:{formal:{hant:hf,hans:sf},dark:{hant:hd,hans:sd},roast:{hant:hr,hans:sr}},
 en:{formal:ef,dark:ed,roast:er},
 yue:{formal:yf,dark:yd,roast:yr}
}}
function add(id,d,rh,rs,re,gh,gs,ge,th,ts,te,replies){
 A.push({id:id,domain:d,domainLabel:D[d],relation:{hant:rh,hans:rs,en:re},goal:{hant:gh,hans:gs,en:ge},title:{hant:th,hans:ts,en:te},replies:replies});
}

add("w22","workplace","上司","上司","Manager","拒絕週末工作","拒绝周末工作","Decline weekend work",
"上司週五晚上臨時要求你週末工作","上司周五晚上临时要求你周末工作","Your manager asks you on Friday night to work over the weekend",
R("這個週末我已有安排，無法臨時投入。如果是緊急事項，麻煩先縮小到必要範圍。","这个周末我已有安排，无法临时投入。如果是紧急事项，麻烦先缩小到必要范围。","週末不是工作日的備用硬碟。","周末不是工作日的备用硬盘。","星期五晚上才出現的週末任務，多少有點像彩蛋。","星期五晚上才出现的周末任务，多少有点像彩蛋。","I already have plans this weekend and can't take on last-minute work. If it's urgent, please narrow it to the essential scope.","The weekend isn't a backup drive for the workweek.","A weekend task appearing on Friday night feels a little like a surprise Easter egg.","今個週末我已有安排，冇辦法臨時投入。如果真係 urgent，麻煩縮到必要範圍。","週末唔係工作日嘅備用硬碟。","星期五夜晚先出現嘅週末任務，有啲似彩蛋。"));

add("w23","workplace","同事","同事","Colleague","要求尊重會議時間","要求尊重会议时间","Respect meeting time",
"同事每次會議都遲到十幾分鐘","同事每次会议都迟到十几分钟","A colleague is late to meetings every time",
R("最近幾次會議都需要等你一段時間。之後如果會晚到，麻煩提前說，大家可以先開始。","最近几次会议都需要等你一段时间。之后如果会晚到，麻烦提前说，大家可以先开始。","會議時間是大家一起出的成本，不只是一個人的鬧鐘。","会议时间是大家一起出的成本，不只是一个人的闹钟。","我們的會議最近都有固定暖場：等人。希望下次省掉這個環節。","我们的会议最近都有固定暖场：等人。希望下次省掉这个环节。","We've had to wait at the start of several meetings. If you'll be late, please let us know so everyone else can begin.","Meeting time is a shared cost, not one person's alarm clock.","Our meetings have developed a regular opening act: waiting. It would be nice to skip that next time.","最近幾次 meeting 都要等你一陣。之後如果會遲，麻煩早啲講，大家可以先開始。","meeting 時間係大家一齊出嘅成本，唔係一個人嘅鬧鐘。","我哋啲 meeting 最近有固定暖場：等人。下次希望 skip 咗。"));

add("w24","workplace","上司","上司","Manager","拒絕模糊責任","拒绝模糊责任","Clarify ownership",
"上司說「大家一起負責」但出事時只找你","上司说“大家一起负责”但出事时只找你","Your manager says 'everyone owns it' but blames only you when it fails",
R("如果是共同負責，我建議把每個人的具體責任寫清楚，避免後面只剩一個人承擔。","如果是共同负责，我建议把每个人的具体责任写清楚，避免后面只剩一个人承担。","共同負責如果最後只共同到一句話，就不算共同。","共同负责如果最后只共同到一句话，就不算共同。","『大家一起負責』最好不是多人開會、單人背鍋。","“大家一起负责”最好不是多人开会、单人背锅。","If ownership is shared, let's define each person's responsibility clearly so it doesn't collapse onto one person later.","Shared ownership shouldn't be shared only in wording.","'Everyone owns it' shouldn't mean many people attend the meeting and one person carries the blame.","如果係共同負責，建議寫清楚每個人責任，免得最後得一個人孭。","共同負責如果最後共同得一句說話，就唔算共同。","『大家一齊負責』最好唔係多人開會、單人孭鑊。"));

add("w25","workplace","同事","同事","Colleague","拒絕私下甩鍋","拒绝私下甩锅","Stop private blame shift",
"同事私訊你說「你先幫我扛一下」","同事私信你说“你先帮我扛一下”","A colleague privately asks you to 'take the hit' for them",
R("這個我不能替你承擔。事情怎麼發生的就按實際情況說清楚比較好。","这个我不能替你承担。事情怎么发生的就按实际情况说清楚比较好。","人情可以幫，責任不能代簽。","人情可以帮，责任不能代签。","這張鍋的收件人不是我，麻煩退回原地址。","这张锅的收件人不是我，麻烦退回原地址。","I can't take responsibility for this on your behalf. We should explain what actually happened.","I can help as a colleague. I can't sign for someone else's responsibility.","This parcel of blame has the wrong recipient. Please return to sender.","呢個我唔可以代你承擔。事情點發生就按實際情況講清楚。","人情可以幫，責任唔可以代簽。","呢隻鑊個收件人唔係我，麻煩退返原地址。"));

add("st11","study","同學","同学","Classmate","拒絕共享答案","拒绝共享答案","Refuse sharing answers",
"考試前同學一直追著你要答案","考试前同学一直追着你要答案","A classmate keeps asking you for answers before an exam",
R("我可以跟你一起複習思路，但不直接給答案。","我可以跟你一起复习思路，但不直接给答案。","會做可以教，不代表答案要外借。","会做可以教，不代表答案要外借。","知識可以共享，選項 ABCD 先各自負責。","知识可以共享，选项 ABCD 先各自负责。","I can review the method with you, but I won't give you the answers directly.","Knowing the answer means I can explain it, not lend it out.","Knowledge can be shared. The A-B-C-D choices can remain individually owned.","我可以同你一齊溫思路，但唔直接俾答案。","識做可以教，唔代表答案要外借。","知識可以 share，ABCD 選項先各自負責。"));

add("st12","study","家長","家长","Parent","與老師溝通","与老师沟通","Talk to teacher",
"孩子回家說老師當眾批評他","孩子回家说老师当众批评他","Your child says the teacher criticised them publicly",
R("老師您好，我想了解一下今天課堂上 XX 的情況。孩子回來後比較難受，我想先聽聽您的角度，再一起看看怎麼處理。","老师您好，我想了解一下今天课堂上 XX 的情况。孩子回来后比较难受，我想先听听您的角度，再一起看看怎么处理。","先了解事實，再決定要不要生氣，通常比直接開戰划算。","先了解事实，再决定要不要生气，通常比直接开战划算。","我先不拿家長模式直接開 Boss 戰，先把雙方版本讀完。","我先不拿家长模式直接开 Boss 战，先把双方版本读完。","I'd like to understand what happened in class today. My child came home upset, so I'd like to hear your perspective first and work out next steps together.","Getting the facts before getting angry is usually cheaper than starting a war.","I'll avoid launching parent-boss mode before reading both versions of the story.","老師你好，我想了解下今日堂上 XX 情況。小朋友返嚟幾唔開心，我想先聽你角度，再一齊睇點處理。","先了解事實，再決定嬲唔嬲，通常平過直接開戰。","我先唔開家長 Boss mode，睇晒兩邊版本先。"));

add("fa06","family","父母","父母","Parents","拒絕催買房","拒绝催买房","Handle home-buying pressure",
"父母一直催你趕快買房","父母一直催你赶快买房","Your parents keep pressuring you to buy a home",
R("我知道你們覺得買房穩定，但我會按收入、負擔和自己的計畫決定，不會因為被催就提前做。","我知道你们觉得买房稳定，但我会按收入、负担和自己的计划决定，不会因为被催就提前做。","房子是幾十年的支出，不適合用幾分鐘的催促做決定。","房子是几十年的支出，不适合用几分钟的催促做决定。","買房不是外賣，不會因為一直催單就更快送到。","买房不是外卖，不会因为一直催单就更快送到。","I know you see home ownership as stability, but I'll decide based on affordability and my own plan, not pressure.","A decades-long expense shouldn't be decided by a few minutes of pressure.","Buying a home isn't food delivery. Repeatedly chasing the order won't make it arrive faster.","我知你哋覺得買樓穩定，但我會按收入、負擔同自己 plan 決定，唔會因為催就提早做。","買樓係幾十年支出，唔適合用幾分鐘催促決定。","買樓唔係外賣，催單唔會令佢快啲送到。"));

add("fa07","family","伴侶","伴侣","Partner","拒絕查手機","拒绝查手机","Set phone privacy boundary",
"伴侶要求隨時查看你的手機","伴侣要求随时查看你的手机","Your partner wants unrestricted access to your phone",
R("我願意讓你有安全感，但我不接受把隱私全部交出來當成信任證明。手機我會保留自己的空間。","我愿意让你有安全感，但我不接受把隐私全部交出来当成信任证明。手机我会保留自己的空间。","信任不是把密碼交出去之後才開始生效。","信任不是把密码交出去之后才开始生效。","手機不是關係的入場安檢機，我不想每次都過安檢。","手机不是关系的入场安检机，我不想每次都过安检。","I want you to feel secure, but I don't accept giving up all privacy as proof of trust. I'll keep some personal space on my phone.","Trust shouldn't only activate after passwords are surrendered.","My phone isn't the security checkpoint for the relationship. I don't want to be screened every time.","我願意俾你安全感，但唔接受交晒私隱當信任證明。手機我會保留自己空間。","信任唔係交咗密碼先開始生效。","手機唔係關係入場安檢，我唔想次次過機。"));

add("p10","parenting","孩子","孩子","Child","拒絕買玩具","拒绝买玩具","Say no to a toy",
"孩子在商店大哭要求立刻買玩具","孩子在商店大哭要求立刻买玩具","Your child cries in a store demanding a toy",
R("我知道你很想要，但今天不買。你可以把它拍下來放進願望清單，下次再考慮。","我知道你很想要，但今天不买。你可以把它拍下来放进愿望清单，下次再考虑。","哭可以繼續，購買決定不會因為音量改變。","哭可以继续，购买决定不会因为音量改变。","這個玩具目前沒有開啟『哭越大聲折扣越高』活動。","这个玩具目前没有开启“哭越大声折扣越高”活动。","I know you really want it, but we're not buying it today. You can add it to your wish list for later.","You can keep crying, but the purchase decision won't change with volume.","This toy isn't running a 'cry louder, get a bigger discount' promotion.","我知你好想要，但今日唔買。可以影低放 wish list，下次再考慮。","你可以繼續喊，但買唔買唔會跟音量改變。","呢個玩具今日冇『喊得越大聲折扣越高』活動。"));

add("p11","parenting","孩子","孩子","Child","收拾玩具","收拾玩具","Clean up toys",
"孩子玩完後完全不願收拾","孩子玩完后完全不愿收拾","Your child refuses to put toys away",
R("你可以選擇先收積木還是先收車，但玩具最後都要回到自己的位置。","你可以选择先收积木还是先收车，但玩具最后都要回到自己的位置。","玩具可以亂玩，結束後不能假裝它們沒有家。","玩具可以乱玩，结束后不能假装它们没有家。","玩具今晚也想回家，不打算集體在地板露營。","玩具今晚也想回家，不打算集体在地板露营。","You can choose whether to put away the blocks or cars first, but the toys all need to go back to their places.","Toys can be played with messily. They can't pretend they don't have homes afterward.","The toys want to go home tonight too. They're not planning a group campout on the floor.","你可以揀先收積木定車，但玩具最後都要返自己位置。","玩具可以亂玩，完咗唔可以扮冇屋企。","啲玩具今晚都想返屋企，唔打算集體喺地下露營。"));

add("e07","elder","長輩","长辈","Elder","拒絕問體重","拒绝问体重","Set body-comment boundary",
"長輩見面總評論你胖了瘦了","长辈见面总评论你胖了瘦了","An elder always comments on your weight",
R("我知道你是隨口關心，不過體重這個話題我不太想聊。我們換個話題吧。","我知道你是随口关心，不过体重这个话题我不太想聊。我们换个话题吧。","見面可以先看我這個人，不用先看體重數字。","见面可以先看我这个人，不用先看体重数字。","我的體重今天沒有開記者會，先聊別的。","我的体重今天没有开记者会，先聊别的。","I know you probably mean it casually, but I'd rather not discuss my weight. Let's talk about something else.","You can see me first without checking the number on the scale.","My weight isn't holding a press conference today. Let's change topics.","我知你可能隨口關心，不過體重我唔太想傾，轉個話題啦。","見面可以先睇我呢個人，唔使先睇體重數字。","我個體重今日冇開記者會，傾第二樣啦。"));

add("fr09","friends","朋友","朋友","Friend","拒絕臨時留宿","拒绝临时留宿","Decline overnight stay",
"朋友臨時說今晚要住你家","朋友临时说今晚要住你家","A friend suddenly asks to stay at your place tonight",
R("今晚不太方便留宿，我可以幫你找附近住宿或交通方案。","今晚不太方便留宿，我可以帮你找附近住宿或交通方案。","朋友可以臨時約，住宿不一定可以臨時開房。","朋友可以临时约，住宿不一定可以临时开房。","友情有床位限制，今晚滿房。","友情有床位限制，今晚满房。","I can't host overnight tonight, but I can help you find nearby accommodation or transport.","Friendship can be spontaneous. Accommodation isn't always instantly available.","Friendship has a room limit. Tonight we're fully booked.","今晚唔太方便留宿，我可以幫你搵附近住宿或者交通。","朋友可以臨時約，住宿唔一定可以臨時開房。","友情都有床位限制，今晚 full house。"));

add("fr10","friends","朋友","朋友","Friend","不想聊工作","不想聊工作","Avoid work talk",
"下班後朋友聚會一直聊工作","下班后朋友聚会一直聊工作","Your social gathering keeps turning into work talk",
R("今天難得休息，我想先把工作話題放下，聊點別的吧。","今天难得休息，我想先把工作话题放下，聊点别的吧。","下班後再開工作會議，感覺有點自費加班。","下班后再开工作会议，感觉有点自费加班。","我們今天聚餐不是 offsite meeting，先讓工作下班。","我们今天聚餐不是 offsite meeting，先让工作下班。","It's a rare chance to switch off, so I'd rather leave work talk for another time.","Turning dinner into another work meeting feels like unpaid overtime.","This dinner isn't an offsite meeting. Let's let work clock out too.","今日難得休息，我想放低工作話題，傾第二樣啦。","收工後再開工作會議，好似自費加班。","我哋今日食飯唔係 offsite meeting，俾工作收工先。"));

add("r09","relationship","伴侶","伴侣","Partner","拒絕翻舊帳","拒绝翻旧账","Stop reopening old issues",
"每次吵架對方都翻出很多年前的事","每次吵架对方都翻出很多年前的事","Every argument brings up old resolved issues",
R("我們可以談這次的問題，但已經處理過的舊事如果每次都重開，任何事情都很難真正結束。","我们可以谈这次的问题，但已经处理过的旧事如果每次都重开，任何事情都很难真正结束。","舊問題如果永遠不關單，就不是歷史，是常駐服務。","旧问题如果永远不关单，就不是历史，是常驻服务。","我們的爭吵資料庫不需要每次都全量恢復備份。","我们的争吵数据库不需要每次都全量恢复备份。","We can discuss the current issue, but if resolved old issues reopen every time, nothing ever truly gets closed.","If an old issue can never be closed, it's not history; it's a permanent service.","Our argument database doesn't need a full backup restore every time.","我哋可以傾今次問題，但處理過嘅舊事次次重開，任何事都好難真正完結。","舊問題永遠唔 close，就唔係歷史，係常駐服務。","我哋個爭拗 database 唔使次次 full restore。"));

add("r10","relationship","伴侶","伴侣","Partner","談金錢觀","谈金钱观","Discuss money values",
"你們花錢方式差異很大開始產生衝突","你们花钱方式差异很大开始产生冲突","Different spending habits are causing conflict",
R("我覺得我們不是誰對誰錯，而是對錢的安全感和優先級不同。可以先定共同底線，再保留各自自由花費。","我觉得我们不是谁对谁错，而是对钱的安全感和优先级不同。可以先定共同底线，再保留各自自由花费。","共同生活不代表共同一個消費人格。","共同生活不代表共同一个消费人格。","我們可以共用生活，不一定要共用同一個錢包腦袋。","我们可以共用生活，不一定要共用同一个钱包脑袋。","I don't think one of us is simply right. We have different priorities and feelings of security around money. Let's set shared rules and keep some personal freedom.","Living together doesn't require one shared spending personality.","We can share a life without sharing the exact same wallet brain.","我覺得唔係邊個啱邊個錯，係對錢嘅安全感同 priority 唔同。先定共同底線，再留各自自由使。","共同生活唔代表共同一個消費人格。","我哋可以共用生活，唔一定要共用同一個銀包腦袋。"));

add("so06","social","聚會","聚会","Social gathering","提早離場","提前离场","Leave early",
"聚會還沒結束但你已經很累想先走","聚会还没结束但你已经很累想先走","The gathering is still going but you're exhausted and want to leave",
R("我今天有點累，先走一步。大家繼續玩，下次再見。","我今天有点累，先走一步。大家继续玩，下次再见。","我不是對大家沒興趣，是我的電量真的先沒了。","我不是对大家没兴趣，是我的电量真的先没了。","人還在，社交電池已經 1%，我要先找充電器。","人还在，社交电池已经 1%，我要先找充电器。","I'm a bit tired, so I'm heading off early. Have fun and I'll see you next time.","It's not that I'm uninterested. My battery simply ran out first.","I'm still here, but my social battery is at 1%. Time to find a charger.","我今日有啲攰，先走一步。大家繼續玩，下次見。","唔係對大家冇興趣，係我電量真係先冇。","人仲喺度，社交電池得 1%，我要去搵叉電。"));

add("sv06","service","餐廳","餐厅","Restaurant staff","拒絕強制服務費","拒绝强制服务 fee","Question service charge",
"帳單多了你事前不知道的額外費用","账单多了你事前不知道的额外费用","Your bill includes a fee you weren't told about",
R("不好意思，我想確認一下這筆 XX 費用。點餐前我沒有看到相關說明，麻煩告訴我它的依據。","不好意思，我想确认一下这笔 XX 费用。点餐前我没有看到相关说明，麻烦告诉我它的依据。","費用可以收，前提是不能等到結帳才突然出生。","费用可以收，前提是不能等到结账才突然出生。","這筆費用在帳單上首次登場，能不能介紹一下它從哪裡來？","这笔费用在账单上首次登场，能不能介绍一下它从哪里来？","Could you clarify this XX charge? I didn't see it disclosed before ordering, so I'd like to understand the basis for it.","A fee can exist, but it shouldn't be born for the first time at checkout.","This fee is making its debut on the bill. Could you introduce where it came from?","唔好意思，我想確認呢筆 XX 費用。落單前我冇見到相關說明，麻煩講下依據。","費用可以收，但唔好到埋單先突然出生。","呢筆費用第一次喺張單登場，可唔可以介紹下佢邊度嚟？"));

add("j06","job","招聘方","招聘方","Recruiter","拒絕延長流程","拒绝延长流程","Push back on hiring rounds",
"面試已經很多輪又突然要求再加幾輪","面试已经很多轮又突然要求再加几轮","The hiring process keeps adding more interview rounds",
R("目前我已完成 X 輪面試。想確認新增輪次的目的和剩餘流程，方便我評估是否繼續安排時間。","目前我已完成 X 轮面试。想确认新增轮次的目的和剩余流程，方便我评估是否继续安排时间。","流程可以嚴謹，但不能無限長出新關卡。","流程可以严谨，但不能无限长出新关卡。","這個面試副本好像一直在解鎖隱藏關卡，我想先看一下總共有幾關。","这个面试副本好像一直在解锁隐藏关卡，我想先看一下总共有几关。","I've completed X interview rounds. Could you clarify the purpose of the added round and the remaining process so I can assess my availability?","A process can be thorough without growing endless new levels.","This interview game keeps unlocking hidden levels. I'd like to know how many levels exist in total.","我已經做咗 X 輪 interview。想確認新增輪次目的同剩低流程，方便我評估時間。","流程可以嚴謹，但唔可以無限長新關卡。","呢個 interview 副本一路解鎖隱藏關，我想先知總共有幾關。"));

add("b06","business","客戶","客户","Client","拒絕臨時改會議","拒绝临时改会议","Decline last-minute reschedule",
"客戶總在會議前幾分鐘臨時改時間","客户总在会议前几分钟临时改时间","A client repeatedly reschedules meetings at the last minute",
R("這次我可以調整，但之後若需要改時間，麻煩盡量提前通知，臨時變更會影響其他安排。","这次我可以调整，但之后若需要改时间，麻烦尽量提前通知，临时变更会影响其他安排。","日程可以移動，但不能每次到開場前才瞬移。","日程可以移动，但不能每次到开场前才瞬移。","我們的 meeting 最近很有漂移感，希望下次能固定在原座標。","我们的 meeting 最近很有漂移感，希望下次能固定在原坐标。","I can adjust this time, but for future changes please give more notice. Last-minute rescheduling affects other commitments.","Schedules can move, but they don't need to teleport right before the start.","Our meetings have developed a strong drifting habit. It would be nice to keep the next one at its original coordinates.","今次我可以調，但之後如果改時間麻煩早啲講，臨時變更會影響其他安排。","schedule 可以郁，但唔使次次開場前先瞬移。","我哋 meeting 最近好有漂移感，希望下次固定返原座標。"));

add("tr06","travel","同行朋友","同行朋友","Travel companion","拒絕拍照太久","拒绝拍照太久","Limit photo time",
"同行朋友每個景點都拍很久影響行程","同行朋友每个景点都拍很久影响行程","Your travel companion spends too long taking photos at every stop",
R("我們可以拍照，但每個點先控制在 X 分鐘，不然後面的行程會一直往後推。","我们可以拍照，但每个点先控制在 X 分钟，不然后面的行程会一直往后推。","旅行是去景點，不是每個景點都開一場棚拍。","旅行是去景点，不是每个景点都开一场棚拍。","我們可以留照片，也要留一點時間給真正的旅行。","我们可以留照片，也要留一点时间给真正的旅行。","We can take photos, but let's keep each stop to X minutes so the rest of the itinerary doesn't keep slipping.","We're visiting attractions, not opening a full studio shoot at each one.","Let's leave with photos, but also leave some time for the actual trip.","我哋可以影相，但每個點控制 X 分鐘，唔係後面行程一路推遲。","旅行係去景點，唔係每個景點都開一次 studio shoot。","可以留相，都要留啲時間俾真正旅行。"));

add("m05","medical","醫生","医生","Doctor","要求說人話","要求说人话","Ask for plain language",
"醫生用了很多專業術語你聽不懂","医生用了很多专业术语你听不懂","The doctor uses terminology you don't understand",
R("不好意思，這些術語我不太熟。可以用比較簡單的方式告訴我目前問題、風險和下一步嗎？","不好意思，这些术语我不太熟。可以用比较简单的方式告诉我目前问题、风险和下一步吗？","醫學可以專業，解釋最好讓病人也能參加。","医学可以专业，解释最好让病人也能参加。","我好像進了專業術語副本，可以幫我切成一般玩家模式嗎？","我好像进了专业术语副本，可以帮我切成一般玩家模式吗？","I'm not familiar with those terms. Could you explain the issue, risks and next step in simpler language?","Medicine can be technical. The explanation still needs to include the patient.","I seem to have entered the medical terminology level. Could we switch to normal-player mode?","唔好意思，啲術語我唔熟。可唔可以簡單講下而家問題、風險同下一步？","醫學可以專業，解釋最好俾病人都參加到。","我好似入咗專業術語副本，可唔可以切返普通玩家模式？"));

add("on07","online","群聊","群聊","Group chat","拒絕轉發未核實消息","拒绝转发未核实消息","Decline forwarding unverified info",
"別人催你把未核實的消息轉到更多群","别人催你把未核实的消息转到更多群","Someone urges you to forward an unverified message to more groups",
R("這個消息我還沒看到可靠來源，先不轉。等確認後再說。","这个消息我还没看到可靠来源，先不转。等确认后再说。","轉發按鈕很快，撤回誤導就沒那麼快。","转发按钮很快，撤回误导就没那么快。","我先不幫這條消息做免費市場推廣，等它拿出來源再說。","我先不帮这条消息做免费市场推广，等它拿出来源再说。","I haven't seen a reliable source for this yet, so I won't forward it until it's verified.","The forward button is fast. Undoing misinformation isn't.","I'll hold off on providing free marketing for this message until it brings a source.","呢條消息我未見到可靠來源，先唔轉，確認咗再講。","forward 好快，收返誤導就冇咁快。","我先唔幫呢條消息做免費 marketing，等佢拎來源出嚟先。"));

add("on08","online","網友","网友","Online contact","制止越界玩笑","制止越界玩笑","Stop inappropriate joking",
"網友一直拿你不舒服的事情開玩笑","网友一直拿你不舒服的事情开玩笑","Someone online keeps joking about something that makes you uncomfortable",
R("這個話題我不覺得好笑，也不想再被拿來開玩笑。請到這裡為止。","这个话题我不觉得好笑，也不想再被拿来开玩笑。请到这里为止。","玩笑的前提是兩邊都覺得好笑。","玩笑的前提是两边都觉得好笑。","如果只有一個人在笑，那比較像單口相聲，不是互動。","如果只有一个人在笑，那比较像单口相声，不是互动。","I don't find this topic funny and I don't want it used as a joke again. Please stop here.","A joke only works if both sides find it funny.","If only one person is laughing, that's closer to stand-up than interaction.","呢個話題我唔覺得好笑，亦唔想再俾人攞嚟開玩笑。到呢度為止。","玩笑前提係兩邊都覺得好笑。","如果得一個人笑，嗰個比較似單口相聲，唔係互動。"));

window.CHAT_SCENARIOS=(window.CHAT_SCENARIOS||[]).concat(A);
})();