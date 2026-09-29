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

add("wave10-001","workplace",["同事","同事","Colleague"],["拒絕會後改口","拒绝会后改口","Stop post-meeting revisionism"],
["會議上都同意了，會後同事卻說自己從沒答應","会上都同意了，会后同事却说自己从没答应","A colleague denies agreeing to something after the meeting"],
["我記錄的是會議上大家同意 X。若現在要改，請明確說是新變更，而不是說之前沒有共識。","我记录的是会上大家同意 X。若现在要改，请明确说是新变更，而不是说之前没有共识。","My notes show we agreed on X in the meeting. If we're changing it now, let's call it a new change rather than saying there was no agreement.","我記錄係 meeting 大家同意 X。如果而家改，請講清楚係新變更，唔係話之前冇共識。"],
["可以改口，但別改歷史。","可以改口，但别改历史。","You can change your mind. Don't rewrite history.","可以改口，但唔好改歷史。"],
["版本可以更新，會議紀錄唔好穿越。","版本可以更新，会议记录别穿越。","Versions can update. Meeting history doesn't need time travel.","版本可以 update，meeting record 唔好穿越。"]);

add("wave10-002","workplace",["上司","上司","Manager"],["要求給決策","要求给决策","Ask for a decision"],
["上司一直讓你準備很多方案，卻遲遲不拍板","上司一直让你准备很多方案，却迟迟不拍板","Your manager keeps asking for options but never makes a decision"],
["目前 A、B、C 都已整理好。為了不再擴散，麻煩今天確認一個方向，我們就按選定方案執行。","目前 A、B、C 都已整理好。为了不再扩散，麻烦今天确认一个方向，我们就按选定方案执行。","A, B and C are ready. To avoid more drift, please choose one direction today so we can execute it.","A、B、C 都準備好。為免再擴散，麻煩今日定一個方向，我哋就跟住做。"],
["方案夠了，現在缺的是決定。","方案够了，现在缺的是决定。","We have enough options. What's missing is a decision.","方案夠喇，而家缺嘅係決定。"],
["選項已經開成 buffet，麻煩而家落單。","选项已经开成 buffet，请现在下单。","The options are now a buffet. Time to place an order.","選項已經開成 buffet，麻煩而家落單。"]);

add("wave10-003","workplace",["同事","同事","Colleague"],["拒絕代開會","拒绝代开会","Decline covering meetings"],
["同事經常臨時叫你替他去開本來屬於他的會","同事经常临时叫你替他去开本来属于他的会","A colleague regularly asks you to cover their meetings at the last minute"],
["偶爾可以幫忙，但這類會議需要由你本人跟進，之後不要再默認由我代開。","偶尔可以帮忙，但这类会议需要由你本人跟进，之后不要再默认由我代开。","I can cover occasionally, but these meetings need your ownership. Please don't assume I'll keep covering them.","間中可以幫，但呢類 meeting 要你自己跟，之後唔好默認我代開。"],
["我可以幫一次，不是接手你的會議。","我可以帮一次，不是接手你的会议。","I can cover once. I'm not taking over your meetings.","我可以幫一次，唔係接手你啲 meeting。"],
["我個 Calendar 最近好似開始兼職養你個 Calendar。","我的日历最近好像开始兼职养你的日历。","My calendar seems to have taken a part-time job supporting yours.","我個 Calendar 最近好似開始兼職養你個 Calendar。"]);

add("wave10-004","study",["老師","老师","Teacher"],["要求重講一次","要求重讲一次","Ask for repetition"],
["你真的沒聽懂，但又怕被老師覺得很笨","你真的没听懂，但又怕被老师觉得很笨","You genuinely don't understand but worry the teacher will judge you"],
["老師，不好意思，我在 XX 這一步沒跟上。可以只把這一步再說一次嗎？","老师，不好意思，我在 XX 这一步没跟上。可以只把这一步再说一次吗？","Sorry, I lost the thread at XX. Could you explain just that step once more?","老師，唔好意思，我喺 XX 呢一步跟唔上。可唔可以淨係再講一次呢步？"],
["我沒懂這一步，麻煩再講一次。","我没懂这一步，麻烦再讲一次。","I didn't understand this step. Could you repeat it?","我唔明呢一步，麻煩再講一次。"],
["腦袋頭先 buffer 咗，XX 呢步可唔可以 replay？","脑袋刚才 buffer 了，XX 这一步能不能 replay？","My brain buffered at XX. Could we replay that step?","個腦頭先 buffer 咗，XX 呢步可唔可以 replay？"]);

add("wave10-005","study",["同學","同学","Classmate"],["拒絕作弊","拒绝作弊","Refuse cheating"],
["同學考試時一直想偷看你的答案","同学考试时一直想偷看你的答案","A classmate keeps trying to copy your answers during an exam"],
["這個我不能給你看，考完之後我可以跟你一起對題。","这个我不能给你看，考完之后我可以跟你一起对题。","I can't let you copy during the exam. We can compare answers afterward.","呢個我唔可以俾你睇，考完之後可以一齊對題。"],
["別看我的答案，自己做。","别看我的答案，自己做。","Don't copy mine. Do your own work.","唔好睇我答案，自己做。"],
["答案唔係 AirDrop，唔會考場即時分享。","答案不是 AirDrop，不会考场即时分享。","Answers aren't AirDrop; they won't be shared live in the exam.","答案唔係 AirDrop，唔會考場即時 share。"]);

add("wave10-006","study",["組員","组员","Teammate"],["拒絕最後才出現","拒绝最后才出现","Address last-minute reappearance"],
["組員整個項目都沒參與，交件前一天突然出現","组员整个项目都没参与，交件前一天突然出现","A teammate disappears for the project and reappears the day before submission"],
["你前面幾個階段都沒有參與。現在可以補上 XX，但已完成部分不會重新分配署名。","你前面几个阶段都没有参与。现在可以补上 XX，但已完成部分不会重新分配署名。","You weren't involved in the earlier stages. You can still complete XX, but the completed work won't be recredited.","你前面幾個階段都冇參與。依家可以補 XX，但已完成部分唔會重新分署名。"],
["最後一天出現，不等於前面的工作也算你做。","最后一天出现，不等于前面的工作也算你做。","Showing up on the last day doesn't make the previous work yours.","最後一日出現，唔等於前面啲工作都算你做。"],
["你終於 login 喇，但進度唔會自動同步到你帳號。","你终于 login 了，但进度不会自动同步到你账号。","Nice to see you log in. The completed progress doesn't auto-sync to your account.","你終於 login 喇，但進度唔會自動同步到你 account。"]);

add("wave10-007","family",["家人","家人","Family member"],["拒絕代收快遞常態化","拒绝代收快递常态化","Stop default parcel duty"],
["家人每天都叫你幫忙拿快遞，已經變成默認","家人每天都叫你帮忙拿快递，已经变成默认","Family members keep treating you as the default parcel collector"],
["偶爾幫忙可以，但不能每天都默認我負責拿。之後大家各自安排。","偶尔帮忙可以，但不能每天都默认我负责拿。之后大家各自安排。","I can help occasionally, but I can't be the default parcel collector every day. Please arrange your own pickups.","間中幫可以，但唔可以日日默認我負責攞。之後大家自己安排。"],
["我不是家裡固定快遞員。","我不是家里固定快递员。","I'm not the household's permanent courier.","我唔係屋企固定速遞員。"],
["件件都寫你個名，點解最後都派俾我？","件件都写你的名字，为什么最后都派给我？","Every parcel has your name on it. Why do they all get assigned to me?","件件都寫你個名，點解最後都派俾我？"]);

add("wave10-008","family",["家人","家人","Family member"],["拒絕借身份資料","拒绝借身份资料","Protect ID information"],
["家人沒說清楚用途就向你要身份證資料","家人没说清楚用途就向你要身份证资料","A family member asks for your ID details without explaining why"],
["身份資料我不會直接發。先告訴我用途、提交給誰，以及為什麼需要。","身份资料我不会直接发。先告诉我用途、提交给谁，以及为什么需要。","I won't send ID details without context. Tell me what they're for, who receives them, and why they're needed.","身份資料我唔會直接發。先講用途、交俾邊個，同點解要。"],
["用途不清楚，我不給身份資料。","用途不清楚，我不给身份资料。","No clear purpose, no ID details.","用途唔清楚，我唔俾身份資料。"],
["身份證唔係家庭群共享文件。","身份证不是家庭群共享文件。","My ID isn't a family-group shared document.","身份證唔係家庭 group 共享文件。"]);

add("wave10-009","parenting",["孩子","孩子","Child"],["處理賴床","处理赖床","Handle oversleeping"],
["孩子每天早上叫很多次都不起床","孩子每天早上叫很多次都不起床","Your child needs repeated wake-up calls every morning"],
["我會再提醒一次，之後你要自己起床準備。今天如果拖延，就要承擔遲到的後果。","我会再提醒一次，之后你要自己起床准备。今天如果拖延，就要承担迟到的后果。","I'll remind you once more, then you need to get up and get ready. If you delay, you'll face the consequence of being late.","我會再叫一次，之後你要自己起身準備。今日如果拖，就要承擔遲到後果。"],
["我不會叫十次，現在起床。","我不会叫十次，现在起床。","I'm not calling ten times. Get up now.","我唔會叫十次，而家起身。"],
["鬧鐘已經上班，你都要上班喇。","闹钟已经上班，你也该上班了。","The alarm clock has started work. Time for you to join it.","鬧鐘已經返工，你都要返工喇。"]);

add("wave10-010","parenting",["孩子","孩子","Child"],["處理亂發脾氣","处理乱发脾气","Handle angry outbursts"],
["孩子一不順心就摔東西","孩子一不顺心就摔东西","Your child throws things whenever frustrated"],
["你可以生氣，但不能摔東西。先把手上的東西放下，等情緒降一點再說。","你可以生气，但不能摔东西。先把手上的东西放下，等情绪降一点再说。","You can be angry, but you can't throw things. Put it down and we'll talk when you're calmer.","你可以嬲，但唔可以掟嘢。先放低手上件嘢，等情緒落少少再講。"],
["可以生氣，不可以砸東西。","可以生气，不可以砸东西。","Angry is allowed. Throwing things isn't.","可以嬲，唔可以掟嘢。"],
["情緒可以爆，屋企啲嘢唔使陪葬。","情绪可以爆，家里的东西不用陪葬。","Your feelings can explode. The furniture doesn't have to.","情緒可以爆，屋企啲嘢唔使陪葬。"]);

add("wave10-011","elder",["長輩","长辈","Elder"],["拒絕公開催生","拒绝公开催生","Stop public baby pressure"],
["長輩在很多人面前問你什麼時候生孩子","长辈在很多人面前问你什么时候生孩子","An elder asks in front of everyone when you're having a baby"],
["這是很私人的事，我們不在飯桌上討論。有消息自然會告訴大家。","这是很私人的事，我们不在饭桌上讨论。有消息自然会告诉大家。","That's very personal, so we won't discuss it at the table. We'll share if there's news.","呢個好私人，我哋唔喺飯枱講。有消息自然會話大家知。"],
["這個問題不用公開問。","这个问题不用公开问。","This isn't a public-question topic.","呢個問題唔使公開問。"],
["生仔唔係年度 KPI，唔使公開 review。","生孩子不是年度 KPI，不用公开 review。","Having a baby isn't an annual KPI that needs a public review.","生仔唔係年度 KPI，唔使公開 review。"]);

add("wave10-012","elder",["長輩","长辈","Elder"],["拒絕亂改育兒規則","拒绝乱改育儿规则","Keep parenting rules consistent"],
["長輩在你不在時故意推翻你訂的孩子規則","长辈在你不在时故意推翻你定的孩子规则","An elder deliberately overturns your parenting rules when you're away"],
["我們訂這些規則是希望孩子前後一致。你可以不同意，但不要在我們不在時反著做。","我们定这些规则是希望孩子前后一致。你可以不同意，但不要在我们不在时反着做。","We set these rules for consistency. You can disagree, but please don't deliberately reverse them when we're away.","我哋定規則係想前後一致。你可以唔同意，但唔好趁我哋唔喺度反住做。"],
["可以有意見，但不要背著我們改規則。","可以有意见，但不要背着我们改规则。","You can disagree, but don't rewrite the rules behind our backs.","可以有意見，但唔好背住我哋改規則。"],
["小朋友唔需要兩套作業系統輪住 boot。","小朋友不需要两套操作系统轮流 boot。","The child doesn't need two operating systems booting alternately.","小朋友唔需要兩套作業系統輪住 boot。"]);

add("wave10-013","friends",["朋友","朋友","Friend"],["拒絕一直蹭車","拒绝一直蹭车","Stop repeated free rides"],
["朋友每次見面都順口叫你載他一程","朋友每次见面都顺口叫你载他一程","A friend keeps casually expecting rides from you"],
["這次我不順路，你自己安排交通吧。之後也別默認我每次都能載。","这次我不顺路，你自己安排交通吧。之后也别默认我每次都能载。","I'm not going that way this time, so please arrange your own transport. Also don't assume I can drive every time.","今次我唔順路，你自己安排交通啦。之後都唔好默認我次次載到。"],
["我有車，不等於每次都順路。","我有车，不等于每次都顺路。","Having a car doesn't mean I'm always your route.","我有車唔等於次次都順路。"],
["我架車唔係友情附送服務。","我的车不是友情附送服务。","My car isn't a complimentary friendship add-on.","我架車唔係友情附送服務。"]);

add("wave10-014","friends",["朋友","朋友","Friend"],["拒絕借帳號","拒绝借账号","Refuse account sharing"],
["朋友向你借串流、遊戲或會員帳號","朋友向你借串流、游戏或会员账号","A friend asks to borrow your streaming, gaming or membership account"],
["這個帳號綁了我的個人資料，我不外借。你可以自己開一個。","这个账号绑了我的个人资料，我不外借。你可以自己开一个。","The account is tied to my personal data, so I don't share it. You'll need your own.","呢個 account 綁咗我私人資料，我唔外借。你自己開一個啦。"],
["帳號不借。","账号不借。","I don't share accounts.","Account 唔借。"],
["友情可以 share，password 唔 share。","友情可以 share，密码不 share。","Friendship can be shared. Passwords can't.","友情可以 share，password 唔 share。"]);

add("wave10-015","relationship",["伴侶","伴侣","Partner"],["拒絕逼你秒回","拒绝逼你秒回","Set reply-time expectations"],
["伴侶因你幾分鐘沒回訊息就一直追問","伴侣因你几分钟没回消息就一直追问","Your partner repeatedly checks in if you don't reply within minutes"],
["我忙的時候不一定能即時回，但看到後會回。幾分鐘沒回不代表我在忽略你。","我忙的时候不一定能即时回，但看到后会回。几分钟没回不代表我在忽略你。","I can't always reply instantly when I'm busy, but I will respond when I see it. A few minutes of silence doesn't mean I'm ignoring you.","我忙嗰陣未必即刻覆，但見到會覆。幾分鐘冇覆唔代表我忽略你。"],
["不要把秒回當成感情考核。","不要把秒回当成感情考核。","Don't use instant replies as a relationship test.","唔好將秒回當感情考核。"],
["WhatsApp 有已讀，冇心跳監測。","WhatsApp 有已读，没有心跳监测。","WhatsApp has read receipts, not a heartbeat monitor.","WhatsApp 有已讀，冇心跳監測。"]);

add("wave10-016","relationship",["伴侶","伴侣","Partner"],["拒絕拿前任比較","拒绝拿前任比较","Stop ex comparisons"],
["伴侶吵架時總拿你和前任比較","伴侣吵架时总拿你和前任比较","Your partner keeps comparing you to an ex during arguments"],
["如果你對我有不滿，可以直接說我哪裡需要改，不要拿前任來比較。","如果你对我有不满，可以直接说我哪里需要改，不要拿前任来比较。","If something about me bothers you, tell me directly. Don't use your ex as the comparison tool.","如果你對我有不滿，可以直接講我邊度要改，唔好攞前任比較。"],
["談我們的問題，不要拉前任進場。","谈我们的问题，不要拉前任进场。","Talk about us. Leave your ex out of it.","傾我哋問題，唔好拉前任入場。"],
["呢場係我哋兩個嘅對話，前任冇買飛入場。","这是我们两个人的对话，前任没买票进场。","This is a two-person conversation. Your ex didn't buy a ticket.","呢場係我哋兩個嘅對話，前任冇買飛入場。"]);

add("wave10-017","social",["陌生人","陌生人","Stranger"],["拒絕搭訕","拒绝搭讪","End unwanted flirting"],
["陌生人一直搭訕，你已明確沒興趣","陌生人一直搭讪，你已经明确没兴趣","A stranger keeps flirting after you've shown no interest"],
["謝謝，但我不想繼續聊。祝你今天順利。","谢谢，但我不想继续聊。祝你今天顺利。","Thanks, but I don't want to continue the conversation. Have a good day.","多謝，不過我唔想再傾。祝你今日順利。"],
["我沒興趣，請不要再跟。","我没兴趣，请不要再跟。","I'm not interested. Please stop following me.","我冇興趣，請唔好再跟。"],
["訊號已經紅燈，唔使再踩油。","信号已经红灯，不用再踩油。","The light is red. No need to keep accelerating.","訊號已經紅燈，唔使再踩油。"]);

add("wave10-018","social",["朋友的朋友","朋友的朋友","Acquaintance"],["拒絕追問感情狀況","拒绝追问感情状况","Stop relationship questions"],
["剛認識的人一直問你有沒有對象、為什麼單身","刚认识的人一直问你有没有对象、为什么单身","A new acquaintance keeps asking why you're single or whether you're dating"],
["感情狀況我比較少跟剛認識的人聊，我們換個話題吧。","感情状况我比较少跟刚认识的人聊，我们换个话题吧。","I don't usually discuss my relationship status with people I've just met. Let's change topic.","感情狀況我唔太會同啱識嘅人傾，轉個話題啦。"],
["這個有點私人，我不回答。","这个有点私人，我不回答。","That's personal. I'm not answering it.","呢個有啲私人，我唔答。"],
["人物介紹未解鎖到感情支線。","人物介绍还没解锁到感情支线。","The character intro hasn't unlocked the romance storyline yet.","人物介紹未解鎖到感情支線。"]);

add("wave10-019","service",["客服","客服","Customer service"],["要求人工客服","要求人工客服","Reach a human agent"],
["機器客服一直兜圈，完全解決不了問題","机器客服一直兜圈，完全解决不了问题","The chatbot keeps looping without solving your issue"],
["自助流程無法處理我的情況，請轉接人工客服。","自助流程无法处理我的情况，请转接人工客服。","The self-service flow can't handle my case. Please connect me to a human agent.","自助流程處理唔到我呢個情況，請轉人工客服。"],
["不要再給我同一套機器答案，轉人工。","不要再给我同一套机器答案，转人工。","Stop giving me the same automated answer. Human agent, please.","唔好再俾同一套機器答案，轉人工。"],
["我同 bot 已經相處得夠耐，想見下真人。","我和 bot 已经相处够久了，想见下真人。","I've spent enough quality time with the bot. I'd like a human now.","我同 bot 已經相處得夠耐，想見下真人。"]);

add("wave10-020","service",["維修方","维修方","Repair service"],["追究修完又壞","追究修完又坏","Challenge failed repair"],
["東西剛修完幾天又出現同一個問題","东西刚修完几天又出现同一个问题","The same fault returns days after a repair"],
["同一個故障在維修後 X 天再次出現。請按原維修項目重新檢查，不應再收同一項費用。","同一个故障在维修后 X 天再次出现。请按原维修项目重新检查，不应再收同一项费用。","The same fault returned X days after repair. Please recheck it under the original service without charging again for the same issue.","同一個故障維修後 X 日又出現。請按原維修項目再檢查，唔應該再收同一項費用。"],
["剛修完又壞，這次應該算返修，不是新問題。","刚修完又坏，这次应该算返修，不是新问题。","It failed right after repair. This should be a rework, not a new issue.","啱啱整完又壞，今次應該算返修，唔係新問題。"],
["修理唔應該有七日免費試用版。","维修不应该有七天免费试用版。","A repair shouldn't come with a seven-day trial period.","修理唔應該有七日免費試用版。"]);

add("wave10-021","job",["招聘方","招聘方","Recruiter"],["拒絕提供過多私隱","拒绝提供过多隐私","Protect personal data"],
["還沒入職，公司就要求大量與招聘無關的私人資料","还没入职，公司就要求大量与招聘无关的私人资料","A company requests excessive personal data before hiring is complete"],
["這些資料和目前招聘流程的必要性不明確。麻煩說明用途、保存方式和必須提供的項目。","这些资料和目前招聘流程的必要性不明确。麻烦说明用途、保存方式和必须提供的项目。","It's unclear why this information is necessary at this stage. Please explain its purpose, storage and which fields are mandatory.","呢啲資料同而家招聘流程嘅必要性唔清楚。麻煩講用途、點保存，同邊啲一定要俾。"],
["和招聘無關的私人資料，我不會先交。","和招聘无关的私人资料，我不会先交。","I won't provide unrelated personal data before it's necessary.","同招聘無關嘅私人資料，我唔會先交。"],
["未有 offer，資料收集已經似人口普查。","还没 offer，资料收集已经像人口普查。","No offer yet, but the data collection already feels like a census.","未有 offer，資料收集已經似人口普查。"]);

add("wave10-022","job",["面試官","面试官","Interviewer"],["反問模糊職責","反问模糊职责","Clarify vague role"],
["面試官說這個職位『什麼都要做一點』","面试官说这个职位“什么都要做一点”","An interviewer says the role 'does a bit of everything'"],
["可以具體說明主要責任、時間占比和成功標準嗎？我想確認這個職位的核心到底是什麼。","可以具体说明主要责任、时间占比和成功标准吗？我想确认这个职位的核心到底是什么。","Could you clarify the main responsibilities, time split and success criteria? I'd like to understand the role's actual core.","可唔可以講具體主要職責、時間比例同成功標準？我想確認份工核心係乜。"],
["『什麼都做』不是很清楚的職責描述。","“什么都做”不是很清楚的职责描述。","'A bit of everything' isn't a very clear job description.","『乜都做』唔係好清楚嘅 JD。"],
["萬能職位通常要配萬能薪資，我先確認一下。","万能职位通常要配万能薪资，我先确认一下。","All-purpose roles usually need all-purpose compensation too. Just checking.","萬能職位通常要配萬能人工，我先確認下。"]);

add("wave10-023","business",["客戶","客户","Client"],["拒絕超時會議","拒绝超时会议","End an overrun meeting"],
["客戶會議已超時很久，對方仍不停加話題","客户会议已经超时很久，对方仍不停加话题","A client meeting is far over time and keeps expanding"],
["我們已超過原定時間 X 分鐘。剩餘議題先記下來，另約時間繼續。","我们已经超过原定时间 X 分钟。剩余议题先记下来，另约时间继续。","We're X minutes over. Let's note the remaining topics and schedule another session.","我哋已經超時 X 分鐘。剩低議題先記低，另外再約時間。"],
["今天時間到了，剩下的下次談。","今天时间到了，剩下的下次谈。","We're out of time today. Let's continue next time.","今日時間到，剩低下次傾。"],
["Meeting 已經加鐘加到變長租。","Meeting 已经加钟加到变长租。","This meeting has extended so many times it's becoming a long-term lease.","Meeting 已經加鐘加到變長租。"]);

add("wave10-024","business",["供應商","供应商","Supplier"],["拒絕偷換規格","拒绝偷换规格","Stop silent spec substitution"],
["供應商沒通知就換了材料或規格","供应商没通知就换了材料或规格","A supplier changes materials or specifications without notice"],
["目前交付的規格和已確認版本不同。任何替代材料都需要事前書面批准，請先停止使用並提交差異。","目前交付的规格和已确认版本不同。任何替代材料都需要事前书面批准，请先停止使用并提交差异。","The delivered specification differs from the approved version. Any substitution requires prior written approval. Please stop and document the differences.","而家交付規格同確認版本唔同。任何替代材料都要事前書面批准，請先停用並提交差異。"],
["不能不通知就換規格。","不能不通知就换规格。","You cannot change the specification without notice.","唔可以唔通知就換規格。"],
["呢個唔叫替代，叫靜雞雞改版。","这不叫替代，叫悄悄改版。","That's not a substitution; that's a silent version change.","呢個唔叫替代，叫靜雞雞改版。"]);

add("wave10-025","travel",["同行朋友","同行朋友","Travel companion"],["拒絕每天早起","拒绝每天早起","Reject ultra-early starts"],
["同行朋友每天都安排清晨六點出發","同行朋友每天都安排清晨六点出发","Your travel companion schedules 6 a.m. starts every day"],
["有一兩天早起可以，但我不想整趟旅行每天六點出門。後面幾天要留正常休息時間。","有一两天早起可以，但我不想整趟旅行每天六点出门。后面几天要留正常休息时间。","I'm fine with one or two early starts, but not 6 a.m. every day. The rest of the trip needs normal rest.","一兩日早起可以，但我唔想成程旅行日日六點出門。後面要留正常休息。"],
["旅行不是軍訓，不會每天六點集合。","旅行不是军训，不会每天六点集合。","This is a holiday, not boot camp. I'm not assembling at six every day.","旅行唔係軍訓，唔會日日六點集合。"],
["我買咗機票，冇報晨操班。","我买了机票，没报晨操班。","I bought a plane ticket, not a dawn exercise class.","我買咗機票，冇報晨操班。"]);

add("wave10-026","travel",["同行朋友","同行朋友","Travel companion"],["拒絕每天吃同類餐廳","拒绝每天吃同类餐厅","Vary restaurant choices"],
["同行朋友每天都只想吃同一類食物","同行朋友每天都只想吃同一类食物","A travel companion wants the same kind of food every day"],
["你喜歡這類沒問題，但我也想試當地其他東西。下一餐我們換一種，或者分開吃再會合。","你喜欢这类没问题，但我也想试当地其他东西。下一餐我们换一种，或者分开吃再会合。","It's fine that you like it, but I want to try other local food too. Let's switch next meal or eat separately and meet after.","你鍾意呢類冇問題，但我都想試其他當地嘢。下一餐換一種，或者分開食再會合。"],
["我不想整趟旅行都吃同一種。","我不想整趟旅行都吃同一种。","I don't want the whole trip to taste the same.","我唔想成程旅行都食同一種。"],
["旅行地圖好大，餐單唔使得一格。","旅行地图很大，菜单不用只有一格。","The travel map is huge. The menu doesn't need to have one square.","旅行地圖咁大，餐單唔使得一格。"]);

add("wave10-027","medical",["醫護人員","医护人员","Clinician"],["要求記錄過敏","要求记录过敏","Confirm allergy record"],
["你已說過敏史，但擔心醫護沒有記下","你已经说过敏史，但担心医护没有记下","You've mentioned an allergy and want to ensure it was recorded"],
["我對 XX 過敏，想確認一下這項已經記錄在病歷和用藥資訊裡。","我对 XX 过敏，想确认一下这项已经记录在病历和用药信息里。","I'm allergic to XX. Could you confirm that it's recorded in my chart and medication information?","我對 XX 過敏，想確認呢項已經記錄喺病歷同用藥資料。"],
["請確認 XX 過敏已經記錄。","请确认 XX 过敏已经记录。","Please confirm my XX allergy is recorded.","請確認 XX 過敏已經記錄。"],
["呢個唔係小備註，麻煩幫我放喺會被睇到嘅位置。","这不是小备注，请放在会被看到的位置。","This isn't a tiny footnote. Please make sure it's somewhere visible.","呢個唔係小備註，麻煩放喺會被睇到嘅位置。"]);

add("wave10-028","online",["網友","网友","Online user"],["拒絕索要定位","拒绝索要定位","Refuse location sharing"],
["剛認識的網友一直問你住哪、要你發定位","刚认识的网友一直问你住哪、要你发定位","A new online contact keeps asking where you live and wants your location"],
["我不分享住址或即時定位，請不要再問。","我不分享住址或即时定位，请不要再问。","I don't share my home address or live location. Please stop asking.","我唔 share 住址或者即時定位，請唔好再問。"],
["住址和定位不發。","住址和定位不发。","No address, no live location.","住址同定位唔發。"],
["地圖權限未開，亦唔會對你開。","地图权限没开，也不会对你开。","Map permissions are off and staying off for you.","地圖權限未開，亦唔會對你開。"]);

window.CHAT_SCENARIOS=(window.CHAT_SCENARIOS||[]).concat(A);
})();