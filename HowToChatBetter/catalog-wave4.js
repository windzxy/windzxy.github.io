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

add("w17","workplace","上司","上司","Manager","被臨時加班","被临时加班","Last-minute overtime",
"下班前突然被要求今晚留下加班","下班前突然被要求今晚留下加班","You're asked to stay late at the end of the day",
R(
"今晚我已有安排，臨時留下會比較困難。如果這件事必須今晚完成，我們先確認哪些內容是最優先的。",
"今晚我已有安排，临时留下会比较困难。如果这件事必须今晚完成，我们先确认哪些内容是最优先的。",
"我可以救急，但不能把臨時加班變成默認排班。",
"我可以救急，但不能把临时加班变成默认排班。",
"我的下班時間剛剛差點被系統自動取消，先確認一下到底哪部分真的今晚非做不可。",
"我的下班时间刚刚差点被系统自动取消，先确认一下到底哪部分真的今晚非做不可。",
"I already have plans tonight, so staying late at short notice is difficult. If this truly must be done tonight, let's confirm the critical scope.",
"I can help in an emergency, but I don't want last-minute overtime to become the default schedule.",
"My end-of-day setting almost got auto-disabled. Let's confirm what genuinely has to be done tonight.",
"今晚我已有安排，臨時留低比較難。如果真係今晚一定要做，先確認邊部分最優先。",
"我可以救急，但唔想臨時加班變成默認排班。",
"我個收工時間啱啱差啲俾系統自動取消，先確認下究竟邊部分今晚真係非做不可。"));

add("w18","workplace","同事","同事","Colleague","要求寫清楚","要求写清楚","Ask for clarity",
"同事只丟一句「幫我處理一下」但沒有任何背景","同事只丢一句“帮我处理一下”但没有任何背景","A colleague says 'please handle this' with no context",
R(
"可以，麻煩先補一下背景、期望輸出和截止時間，我確認後就能安排。",
"可以，麻烦先补一下背景、期望输出和截止时间，我确认后就能安排。",
"「幫我處理」範圍有點大，我需要知道要處理到哪裡。",
"“帮我处理”范围有点大，我需要知道要处理到哪里。",
"我目前只收到一個任務標題，還缺任務內容。",
"我目前只收到一个任务标题，还缺任务内容。",
"Sure. Please send the context, expected output and deadline so I can schedule it properly.",
"'Please handle this' is a fairly large scope. I need to know where 'handled' ends.",
"I've received the task title. The task body appears to be missing.",
"可以，麻煩補返背景、預期輸出同 deadline，我確認後就安排。",
"『幫我處理』範圍幾大，我要知處理到邊先。",
"我而家收到咗任務標題，但任務內容好似未載入。"));

add("w19","workplace","上司","上司","Manager","拒絕不合理期限","拒绝不合理期限","Push back on deadline",
"上司給了明顯不可能完成的截止時間","上司给了明显不可能完成的截止时间","Your manager gives an unrealistic deadline",
R(
"按目前範圍，X 點前完整交付風險很高。可以選擇縮小範圍先交 A，或把完整版本延到 Y。",
"按目前范围，X 点前完整交付风险很高。可以选择缩小范围先交 A，或把完整版本延到 Y。",
"時間不變、範圍不變、品質不變，三個同時成立的可能性不高。",
"时间不变、范围不变、质量不变，三个同时成立的可能性不高。",
"這個 deadline 很有理想，我們需要幫它補一點現實。",
"这个 deadline 很有理想，我们需要帮它补一点现实。",
"With the current scope, a complete delivery by X is high risk. We can reduce scope for X or move the full delivery to Y.",
"Keeping time, scope and quality all unchanged is unlikely to work.",
"This deadline has excellent ambition. It just needs a little reality added.",
"按而家 scope，X 點前完整交付風險好高。可以縮 scope 先交 A，或者完整版延到 Y。",
"時間、scope、quality 三樣全部唔變，成功率唔高。",
"呢個 deadline 好有理想，我哋要幫佢補返少少現實。"));

add("w20","workplace","同事","同事","Colleague","拒絕代做","拒绝代做","Refuse doing someone's work",
"同事總讓你幫他完成本來屬於他的工作","同事总让你帮他完成本来属于他的工作","A colleague repeatedly asks you to do work that belongs to them",
R(
"這部分應該由你負責，我可以提供意見或幫你看一下，但不適合直接替你完成。",
"这部分应该由你负责，我可以提供意见或帮你看一下，但不适合直接替你完成。",
"幫忙可以，接管不行。",
"帮忙可以，接管不行。",
"我可以做隊友，但不太適合長期兼任你的分身。",
"我可以做队友，但不太适合长期兼任你的分身。",
"This part belongs to you. I can review or advise, but I shouldn't complete it on your behalf.",
"I can help. I can't take over.",
"I can be your teammate, but I probably shouldn't become your permanent clone.",
"呢部分應該係你負責，我可以俾意見或者幫你睇，但唔適合直接代你做。",
"幫手可以，接管唔得。",
"我可以做隊友，但唔太適合長期兼任你個分身。"));

add("w21","workplace","同事","同事","Colleague","制止搶功","制止抢功","Address credit-taking",
"同事在會議上把你的成果說成自己的","同事在会议上把你的成果说成自己的","A colleague presents your work as their own",
R(
"補充一下，這部分的分析和初版是我完成的，XX 後續協助了整合。我把分工說清楚，方便大家了解。",
"补充一下，这部分的分析和初版是我完成的，XX 后续协助了整合。我把分工说清楚，方便大家了解。",
"合作成果可以共享，作者資訊最好不要共享到消失。",
"合作成果可以共享，作者信息最好不要共享到消失。",
"這份成果剛剛好像換了作者，我幫它把署名切回來。",
"这份成果刚刚好像换了作者，我帮它把署名切回来。",
"Just to clarify, I completed the analysis and first draft, and XX later supported consolidation. I want the contribution split to be clear.",
"Shared work is fine. Shared authorship shouldn't mean the author disappears.",
"This piece of work seems to have changed authors mid-meeting, so I'll switch the credit back.",
"補充返，呢部分分析同初版係我做，XX 後面幫手整合。我講清楚分工方便大家了解。",
"合作成果可以 share，作者資料就唔好 share 到消失。",
"呢份成果頭先好似換咗作者，我幫佢切返正確署名。"));

add("st08","study","老師","老师","Teacher","缺席補課","缺席补课","Catch up after absence",
"你因故缺課，想知道需要補什麼","你因故缺课，想知道需要补什么","You missed class and need to catch up",
R(
"老師您好，我因 XX 缺席了這節課。想請問需要補看哪些內容或完成哪些作業？",
"老师您好，我因 XX 缺席了这节课。想请问需要补看哪些内容或完成哪些作业？",
"我不想把缺席自動轉換成落後，所以想盡快把缺的補上。",
"我不想把缺席自动转换成落后，所以想尽快把缺的补上。",
"人缺席了一節，進度不想跟著缺席。",
"人缺席了一节，进度不想跟着缺席。",
"I missed the class due to XX. Could you let me know what material or assignments I should catch up on?",
"I don't want one absence to automatically become falling behind, so I'd like to catch up quickly.",
"I missed one class. I'd rather the progress didn't miss one too.",
"老師你好，我因為 XX 缺席咗呢堂。想問要補睇咩內容或者做咩功課？",
"我唔想缺席自動變成落後，所以想快啲補返。",
"人缺席一堂，進度唔想跟住缺席。"));

add("st09","study","同學","同学","Classmate","拒絕代簽到","拒绝代签到","Refuse proxy attendance",
"同學讓你幫忙代簽到","同学让你帮忙代签到","A classmate asks you to sign attendance for them",
R(
"這個我不方便幫你代簽，涉及出席紀錄，還是你自己跟老師說比較好。",
"这个我不方便帮你代签，涉及出席记录，还是你自己跟老师说比较好。",
"筆可以借，出席紀錄不借。",
"笔可以借，出席记录不借。",
"我的名字可以簽一次，分身今天不出勤。",
"我的名字可以签一次，分身今天不出勤。",
"I can't sign attendance for you. It's an official record, so it's better to explain your absence directly.",
"I can lend you a pen, not an attendance record.",
"My signature can represent one person. My clone isn't attending today.",
"呢個我唔方便代簽，涉及出席紀錄，你自己同老師講會好啲。",
"筆可以借，出席紀錄唔借。",
"我個名可以簽一次，分身今日唔返工。"));

add("st10","study","老師","老师","Teacher","要求推薦信","要求推荐信","Ask for recommendation",
"你想請老師幫忙寫推薦信","你想请老师帮忙写推荐信","You want to ask a teacher for a recommendation letter",
R(
"老師您好，我正在申請 XX，想請問您是否方便為我寫一封推薦信？截止日期是 X，我可以整理履歷和申請資料給您參考。",
"老师您好，我正在申请 XX，想请问您是否方便为我写一封推荐信？截止日期是 X，我可以整理简历和申请资料给您参考。",
"我先把資料和 deadline 都準備好，再請您決定是否方便，不想只丟一句『幫我寫推薦信』。",
"我先把资料和 deadline 都准备好，再请您决定是否方便，不想只丢一句“帮我写推荐信”。",
"推薦信不能靠意念生成，我把素材和 deadline 都打包好了。",
"推荐信不能靠意念生成，我把素材和 deadline 都打包好了。",
"I'm applying for XX and wanted to ask whether you'd be comfortable writing a recommendation letter. The deadline is X, and I can provide my CV and application materials.",
"I've prepared the materials and deadline first so I'm not just dropping a vague 'please write me a recommendation'.",
"Recommendation letters don't generate themselves, so I've bundled the materials and deadline for you.",
"老師你好，我申請緊 XX，想問你方唔方便幫我寫推薦信？deadline 係 X，我可以整理 CV 同申請資料俾你。",
"我先準備好資料同 deadline，再請你決定方唔方便，唔想只係掉一句『幫我寫推薦信』。",
"推薦信唔會靠意念生成，我已經打包好素材同 deadline。"));

add("fa04","family","父母","父母","Parents","拒絕干涉工作","拒绝干涉工作","Set career boundary",
"父母一直要求你換工作","父母一直要求你换工作","Your parents keep pressuring you to change jobs",
R(
"我知道你們是擔心我，但工作選擇我會自己評估。你們可以給意見，最後決定還是讓我自己做。",
"我知道你们是担心我，但工作选择我会自己评估。你们可以给意见，最后决定还是让我自己做。",
"建議我會聽，但人生職缺最後不是由家庭 HR 發 offer。",
"建议我会听，但人生职缺最后不是由家庭 HR 发 offer。",
"家裡可以開職涯諮詢，但不要直接替我發離職通知。",
"家里可以开职业咨询，但不要直接替我发离职通知。",
"I know you're concerned, but I'll evaluate my career choices myself. I welcome advice, but the final decision needs to be mine.",
"I'll listen to advice, but my career offer isn't issued by the family HR department.",
"Family career consulting is fine. Please don't submit my resignation for me.",
"我知你哋係擔心我，但工作選擇我會自己評估。意見我會聽，最後決定俾我自己做。",
"建議我會聽，但人生份工唔係由家庭 HR 出 offer。",
"屋企可以開 career consultation，但唔好直接幫我交 resignation。"));

add("fa05","family","兄弟姐妹","兄弟姐妹","Sibling","談照顧父母","谈照顾父母","Share care duties",
"照顧父母的事情幾乎都落在你身上","照顾父母的事情几乎都落在你身上","Most care for your parents has fallen on you",
R(
"最近看醫生、買藥和日常安排大多是我在處理，我需要大家重新分一下責任，不能長期只靠一個人。",
"最近看医生、买药和日常安排大多是我在处理，我需要大家重新分一下责任，不能长期只靠一个人。",
"孝順可以一起表達，工作量也應該一起分。",
"孝顺可以一起表达，工作量也应该一起分。",
"我們都是同一家的孩子，不應該只有一個人登入照顧帳號。",
"我们都是同一家的孩子，不应该只有一个人登录照顾账号。",
"Appointments, medication and daily arrangements have mostly fallen on me. We need to redistribute the responsibility.",
"Care can be shared emotionally; the workload should be shared practically too.",
"We're all children of the same family. One person shouldn't be the only account logged into caregiving.",
"最近睇醫生、買藥同日常安排大多都係我處理，我需要大家重新分責任，唔可以長期靠一個人。",
"孝順可以一齊表達，工作量都應該一齊分。",
"我哋都係同一屋企嘅仔女，唔應該得一個人 login 照顧 account。"));

add("p07","parenting","孩子","孩子","Child","沉迷短視頻","沉迷短视频","Too much short-form video",
"孩子停不下來一直刷短視頻","孩子停不下来一直刷短视频","Your child can't stop scrolling short-form video",
R(
"我們先把今天的時間定好，再選一個停下來的節點。時間到了我會提醒，你自己把最後一個看完就關。",
"我们先把今天的时间定好，再选一个停下来的节点。时间到了我会提醒，你自己把最后一个看完就关。",
"短視頻沒有最後一條，所以我們要自己決定哪一條是最後一條。",
"短视频没有最后一条，所以我们要自己决定哪一条是最后一条。",
"這個 App 最大的魔法就是永遠還有下一條，我們今天先破解它一次。",
"这个 App 最大的魔法就是永远还有下一条，我们今天先破解它一次。",
"Let's decide today's screen limit and a clear stopping point. When time is up, finish the current clip and close it.",
"Short-form video has no final clip, so we have to decide which one is the last.",
"The app's greatest magic is that there's always another video. Let's break the spell once today.",
"我哋先定今日睇幾耐，再揀一個停嘅位。時間到我提醒，你睇完而家呢條就熄。",
"短片冇最後一條，所以要我哋自己決定邊條係最後。",
"呢個 App 最大魔法係永遠都有下一條，今日破解佢一次。"));

add("p08","parenting","孩子","孩子","Child","考試失利","考试失利","Poor exam result",
"孩子考差了，很害怕被你罵","孩子考差了，很害怕被你骂","Your child did poorly on an exam and fears your reaction",
R(
"分數我看到了，我們先看哪裡沒掌握，不先討論你『怎麼這麼差』。這次考試是資訊，不是判決。",
"分数我看到了，我们先看哪里没掌握，不先讨论你“怎么这么差”。这次考试是信息，不是判决。",
"卷子已經負責指出問題，我就不再負責重複打擊你。",
"卷子已经负责指出问题，我就不再负责重复打击你。",
"考卷今天已經批評過你一輪，我們回家就改做修復模式。",
"考卷今天已经批评过你一轮，我们回家就改做修复模式。",
"I saw the score. Let's first identify what wasn't understood. This exam is information, not a verdict on you.",
"The paper has already pointed out the problems. I don't need to add another layer of criticism.",
"The exam has already done its round of judging. At home we're switching to repair mode.",
"分數我睇到，我哋先睇邊度未掌握，唔先講你『點解咁差』。考試係資訊，唔係判決。",
"份卷已經負責指出問題，我唔使再負責重複打擊你。",
"份卷今日已經批評咗你一輪，返屋企我哋轉修復模式。"));

add("p09","parenting","孩子","孩子","Child","被同學欺負","被同学欺负","Bullying disclosure",
"孩子告訴你在學校被同學欺負","孩子告诉你在学校被同学欺负","Your child tells you they're being bullied at school",
R(
"謝謝你告訴我。先跟我說發生了什麼、多久了、有哪些人知道。我們一起想辦法，你不需要自己扛。",
"谢谢你告诉我。先跟我说发生了什么、多久了、有哪些人知道。我们一起想办法，你不需要自己扛。",
"這件事不是靠你再忍耐一點就能解決，我們會正式處理。",
"这件事不是靠你再忍耐一点就能解决，我们会正式处理。",
"你負責把事情告訴我，後面的成人副本交給我一起打。",
"你负责把事情告诉我，后面的成人副本交给我一起打。",
"Thank you for telling me. Tell me what happened, how long it's been going on and who knows. We'll handle this together.",
"This isn't something you solve by tolerating a little more. We'll address it properly.",
"Your job was to tell me. The adult-level boss fight is something we'll handle together.",
"多謝你話我知。先同我講發生咩事、幾耐、邊啲人知。我哋一齊處理，你唔使自己頂。",
"呢件事唔係靠你再忍多啲就解決，我哋會正式處理。",
"你負責話我知，後面成人副本我陪你一齊打。"));

add("e05","elder","長輩","长辈","Elder","拒絕亂餵孩子","拒绝乱喂孩子","Set food boundary",
"長輩總偷偷給孩子吃你禁止的食物","长辈总偷偷给孩子吃你禁止的食物","An elder keeps secretly giving your child food you've restricted",
R(
"我知道你是疼孩子，但這個食物我們目前不給他吃。麻煩按我們的規則來，不要偷偷給。",
"我知道你是疼孩子，但这个食物我们目前不给他吃。麻烦按我们的规则来，不要偷偷给。",
"疼孩子和繞過父母規則是兩件事。",
"疼孩子和绕过父母规则是两件事。",
"愛可以偷偷加倍，零食先不要偷偷加量。",
"爱可以偷偷加倍，零食先不要偷偷加量。",
"I know you're doing it out of love, but we're not giving the child this food right now. Please follow our rule and don't give it secretly.",
"Loving the child and bypassing the parents' rules are two different things.",
"Love can be secretly doubled. Snacks don't need secret upgrades.",
"我知你係錫佢，但呢樣嘢我哋而家唔俾佢食。麻煩跟返我哋規則，唔好偷偷俾。",
"錫小朋友同繞過父母規則係兩回事。",
"愛可以偷偷加倍，零食唔使偷偷加量。"));

add("e06","elder","長輩","长辈","Elder","拒絕迷信干涉","拒绝迷信干涉","Set boundary on superstition",
"長輩用迷信理由干涉你的重要決定","长辈用迷信理由干涉你的重要决定","An elder uses superstition to interfere with your decision",
R(
"我尊重你相信這套方式，但這個決定我會按實際情況和自己的判斷來做。",
"我尊重你相信这套方式，但这个决定我会按实际情况和自己的判断来做。",
"信仰可以保留，決策權我也會保留。",
"信仰可以保留，决策权我也会保留。",
"日子可以看黃曆，我的人生先看現實。",
"日子可以看黄历，我的人生先看现实。",
"I respect that you believe in that approach, but I'll make this decision based on the actual situation and my own judgment.",
"You can keep the belief. I'll keep the decision-making authority.",
"The calendar can check auspicious dates. My life still has to check reality.",
"我尊重你信呢套，但呢個決定我會按實際情況同自己判斷做。",
"信仰可以保留，決策權我都會保留。",
"日子可以睇通勝，我人生先睇現實。"));

add("fr06","friends","朋友","朋友","Friend","朋友總遲到","朋友总迟到","Chronic lateness",
"朋友每次見面都遲到很久","朋友每次见面都迟到很久","Your friend is late almost every time",
R(
"最近幾次你都遲了比較久，我希望下次如果會晚到可以提前說，不然我的安排很難抓。",
"最近几次你都迟了比较久，我希望下次如果会晚到可以提前说，不然我的安排很难抓。",
"遲到一次是意外，每次都遲就比較像固定時區。",
"迟到一次是意外，每次都迟就比较像固定时区。",
"我們下次是不是直接把約定時間理解成『你出門提醒時間』比較準。",
"我们下次是不是直接把约定时间理解成“你出门提醒时间”比较准。",
"You've been quite late the last few times. If you're running late, please let me know earlier so I can plan around it.",
"Being late once is an accident. Every time starts to look like a personal time zone.",
"Next time should I treat our meeting time as your 'time to leave home' reminder?",
"最近幾次你都遲幾耐，下次如果會遲麻煩早啲講，唔係我好難安排。",
"遲一次係意外，次次都遲就似固定時區。",
"下次係咪直接將約定時間理解成『你出門提示』會準啲。"));

add("fr07","friends","朋友","朋友","Friend","朋友借東西不還","朋友借东西不还","Ask for borrowed item back",
"朋友借了你的東西很久一直沒還","朋友借了你的东西很久一直没还","A friend has kept something they borrowed for a long time",
R(
"提醒一下，上次借你的 XX 我這幾天要用，麻煩 X 日前還我一下。",
"提醒一下，上次借你的 XX 我这几天要用，麻烦 X 日前还我一下。",
"它是借出去的，不是完成了戶籍遷移。",
"它是借出去的，不是完成了户籍迁移。",
"XX 在你家住得有點久了，我準備接它回原生家庭。",
"XX 在你家住得有点久了，我准备接它回原生家庭。",
"Just a reminder: I need the XX I lent you. Please return it by X.",
"It was lent out, not permanently relocated.",
"XX has stayed at your place for quite a while. I'm ready to bring it back to its original family.",
"提一提，上次借你嗰個 XX 我呢幾日要用，麻煩 X 日前還返俾我。",
"佢係借出去，唔係完成咗戶籍遷移。",
"XX 喺你屋企住咗幾耐，我準備接佢返原生家庭。"));

add("fr08","friends","朋友","朋友","Friend","拒絕當情緒垃圾桶","拒绝当情绪垃圾桶","Set emotional boundary",
"朋友每天都向你傾倒負面情緒但從不關心你","朋友每天都向你倾倒负面情绪但从不关心你","A friend constantly dumps negative emotions on you",
R(
"我在乎你，也願意聽，但最近這種頻率讓我有點承受不住。我也需要一些空間，不是每次都能接住。",
"我在乎你，也愿意听，但最近这种频率让我有点承受不住。我也需要一些空间，不是每次都能接住。",
"我是朋友，不是 24 小時情緒客服。",
"我是朋友，不是 24 小时情绪客服。",
"我的情緒回收桶最近也滿了，需要先清一下容量。",
"我的情绪回收桶最近也满了，需要先清一下容量。",
"I care about you and I do want to listen, but the frequency has become too much for me. I need some space too.",
"I'm your friend, not a 24-hour emotional support desk.",
"My emotional recycle bin is full too. I need to clear some capacity first.",
"我在乎你亦願意聽，但最近個頻率我有啲頂唔住。我都需要空間，唔係次次都接得到。",
"我係朋友，唔係 24 小時情緒客服。",
"我個情緒回收桶最近都滿咗，要清一清容量先。"));

add("r06","relationship","伴侶","伴侣","Partner","回應冷暴力","回应冷暴力","Address silent treatment",
"伴侶生氣後幾天不回你話","伴侣生气后几天不回你话","Your partner stops communicating for days after conflict",
R(
"你可以需要冷靜時間，但幾天完全不溝通會讓問題更難處理。下次至少告訴我你需要多久，之後再談。",
"你可以需要冷静时间，但几天完全不沟通会让问题更难处理。下次至少告诉我你需要多久，之后再谈。",
"需要空間和讓對方一直猜，是兩件不同的事。",
"需要空间和让对方一直猜，是两件不同的事。",
"冷靜可以暫停聊天，不需要順便把關係切成飛行模式。",
"冷静可以暂停聊天，不需要顺便把关系切成飞行模式。",
"You can need space, but disappearing for days makes the issue harder. Next time, tell me how long you need and when we'll talk.",
"Needing space and making the other person guess indefinitely are different things.",
"Cooling down can pause the conversation. The relationship doesn't need airplane mode.",
"你可以要空間，但幾日完全唔溝通會令問題更難。下次至少話我知要幾耐，之後再傾。",
"要空間同叫對方一路估係兩回事。",
"冷靜可以 pause 對話，唔使順便將段關係切飛行模式。"));

add("r07","relationship","伴侶","伴侣","Partner","處理吃醋","处理吃醋","Handle jealousy",
"伴侶因你和異性朋友聊天而吃醋","伴侣因你和异性朋友聊天而吃醋","Your partner is jealous about you talking to another person",
R(
"我理解你會不舒服，我可以跟你說清楚我們的關係和界線，但我也希望信任不是靠限制正常社交建立。",
"我理解你会不舒服，我可以跟你说清楚我们的关系和界限，但我也希望信任不是靠限制正常社交建立。",
"安全感可以談，但不能靠刪掉所有異性聯絡人來解決。",
"安全感可以谈，但不能靠删掉所有异性联系人来解决。",
"如果解決吃醋的方法是清空通訊錄，那成本有點高。",
"如果解决吃醋的方法是清空通讯录，那成本有点高。",
"I understand why you feel uncomfortable. I can clarify the relationship and boundaries, but trust shouldn't require removing normal social contact.",
"We can talk about reassurance, but deleting every opposite-sex contact isn't the solution.",
"If the cure for jealousy is deleting the entire contact list, the treatment cost is a little high.",
"我明白你會唔舒服，我可以講清楚關係同界線，但信任唔應該靠限制正常社交建立。",
"安全感可以傾，但唔可以靠刪晒所有異性 contact 解決。",
"如果解決呷醋方法係清空通訊錄，成本有啲高。"));

add("r08","relationship","前任","前任","Ex-partner","拒絕復合","拒绝复合","Decline reconciliation",
"前任突然聯絡你希望復合","前任突然联系你希望复合","An ex contacts you asking to get back together",
R(
"謝謝你願意再說，但我不打算重新開始這段關係。我希望我們都繼續往前走。",
"谢谢你愿意再说，但我不打算重新开始这段关系。我希望我们都继续往前走。",
"結束的原因沒有因為時間過去就自動卸載。",
"结束的原因没有因为时间过去就自动卸载。",
"舊版本我已經卸載了，這次不準備重新安裝。",
"旧版本我已经卸载了，这次不准备重新安装。",
"Thank you for reaching out, but I don't want to restart the relationship. I hope we can both keep moving forward.",
"The reasons it ended didn't automatically uninstall just because time passed.",
"I've already uninstalled the old version and I'm not planning to reinstall it.",
"多謝你再搵我，不過我唔打算重新開始呢段關係。希望大家都繼續向前。",
"結束嘅原因唔會因為時間過咗就自動 uninstall。",
"舊版本我已經 uninstall，今次唔打算重新安裝。"));

add("so04","social","陌生人","陌生人","Stranger","拒絕插隊","拒绝插队","Call out queue-cutting",
"有人在你前面明顯插隊","有人在你前面明显插队","Someone clearly cuts in front of you in a queue",
R(
"不好意思，這邊是排隊的，隊尾在後面。",
"不好意思，这边是排队的，队尾在后面。",
"大家都在排，麻煩不要直接插進來。",
"大家都在排，麻烦不要直接插进来。",
"這條隊伍目前沒有 VIP 瞬移功能，隊尾在後面。",
"这条队伍目前没有 VIP 瞬移功能，队尾在后面。",
"Excuse me, this is a queue. The end is back there.",
"Everyone is waiting, so please don't cut in.",
"This queue doesn't currently have a VIP teleport function. The end is back there.",
"唔好意思，呢度排緊隊，隊尾喺後面。",
"大家都排緊，麻煩唔好直接插入嚟。",
"呢條隊暫時冇 VIP 瞬移功能，隊尾喺後面。"));

add("so05","social","鄰居","邻居","Neighbour","拒絕借東西","拒绝借东西","Decline lending",
"鄰居頻繁來借各種東西","邻居频繁来借各种东西","A neighbour frequently asks to borrow things",
R(
"這次不方便借，最近這些東西我們自己也常用。",
"这次不方便借，最近这些东西我们自己也常用。",
"偶爾借可以，長期共享就不是借了。",
"偶尔借可以，长期共享就不是借了。",
"我們家暫時還沒有升級成社區共享倉庫。",
"我们家暂时还没有升级成社区共享仓库。",
"Sorry, I can't lend it this time. We use these things regularly ourselves.",
"Occasional borrowing is fine. Long-term sharing isn't really borrowing anymore.",
"Our home hasn't been upgraded into the neighbourhood sharing warehouse yet.",
"今次唔方便借，最近呢啲嘢我哋自己都成日用。",
"偶爾借可以，長期共享就唔係借。",
"我哋屋企暫時未升級做社區共享倉。"));

add("sv04","service","商家","商家","Merchant","拒絕推卸責任","拒绝推卸责任","Reject blame-shifting",
"商家讓你自己找物流解決他們的發貨錯誤","商家让你自己找物流解决他们的发货错误","A seller tells you to resolve their shipping mistake with the courier",
R(
"這是發貨內容錯誤，不是單純物流問題。訂單是向你們購買的，麻煩由你們協調處理。",
"这是发货内容错误，不是单纯物流问题。订单是向你们购买的，麻烦由你们协调处理。",
"我跟你們下單，不是跟物流公司下單。",
"我跟你们下单，不是跟物流公司下单。",
"如果售後需要我自己找完整供應鏈，這個購物體驗有點太沉浸式。",
"如果售后需要我自己找完整供应链，这个购物体验有点太沉浸式。",
"This is a fulfilment error, not merely a courier issue. I purchased from you, so please coordinate the resolution.",
"I placed the order with you, not with the courier.",
"If after-sales support requires me to manage the whole supply chain, the shopping experience is a little too immersive.",
"呢個係發貨內容錯誤，唔係單純物流問題。我係同你哋落單，麻煩由你哋協調。",
"我同你哋買，唔係同物流公司買。",
"如果售後要我自己管理成條 supply chain，個購物體驗有啲太沉浸式。"));

add("sv05","service","酒店","酒店","Hotel staff","要求換房","要求换房","Request room change",
"房間噪音或衛生問題嚴重","房间噪音或卫生问题严重","Your hotel room has serious noise or cleanliness issues",
R(
"這個房間有 XX 問題，已經影響正常休息。麻煩幫我安排其他同等或更合適的房間。",
"这个房间有 XX 问题，已经影响正常休息。麻烦帮我安排其他同等或更合适的房间。",
"我訂的是住宿，不是環境耐受測試。",
"我订的是住宿，不是环境耐受测试。",
"這間房很有個性，但我今晚比較想睡覺，麻煩換一間。",
"这间房很有个性，但我今晚比较想睡觉，麻烦换一间。",
"This room has XX and it's affecting normal rest. Please arrange another equivalent or suitable room.",
"I booked accommodation, not an environmental endurance test.",
"This room has plenty of character, but tonight I'd rather sleep. Could you move me?",
"呢間房有 XX 問題，已經影響休息。麻煩安排另一間同等或者合適房。",
"我訂嘅係住宿，唔係環境耐受測試。",
"呢間房幾有個性，不過今晚我比較想瞓覺，麻煩換一間。"));

add("j04","job","招聘方","招聘方","Recruiter","拒絕過低薪資","拒绝过低薪资","Decline low offer",
"收到的薪資 offer 明顯低於你的底線","收到的薪资 offer 明显低于你的底线","The salary offer is well below your minimum",
R(
"謝謝 offer。不過這個薪資和職責範圍與我的預期差距較大。如果預算能調整到 X–Y，我願意繼續討論。",
"谢谢 offer。不过这个薪资和职责范围与我的预期差距较大。如果预算能调整到 X–Y，我愿意继续讨论。",
"這個數字和職責不是很匹配，我不打算用降價的方式接受升級版工作。",
"这个数字和职责不是很匹配，我不打算用降价的方式接受升级版工作。",
"職責是 Pro，薪資看起來還在 Lite，我們版本需要對一下。",
"职责是 Pro，薪资看起来还在 Lite，我们版本需要对一下。",
"Thank you for the offer. The compensation is significantly below my expectation for the scope. If the budget can move to X–Y, I'm happy to continue.",
"The number doesn't match the responsibilities. I'm not looking to discount myself for an upgraded role.",
"The responsibilities are Pro, while the salary still looks Lite. We may need to align versions.",
"多謝 offer。不過呢個人工同職責範圍差距幾大。如果 budget 可以去到 X–Y，我願意繼續傾。",
"呢個數字同職責唔太匹配，我唔打算用減價方式接升級版工作。",
"職責係 Pro，人工睇落仲係 Lite，要對一對版本。"));

add("j05","job","招聘方","招聘方","Recruiter","拒絕無薪試工","拒绝无薪试工","Refuse unpaid trial work",
"公司要求你先免費做一大段真實工作","公司要求你先免费做一大段真实工作","A company asks you to do substantial real work for free as a test",
R(
"我可以接受合理範圍的能力測試，但這個內容已接近實際交付。若需要完整完成，希望按付費試做處理。",
"我可以接受合理范围的能力测试，但这个内容已接近实际交付。若需要完整完成，希望按付费试做处理。",
"測試能力可以，免費完成正式工作不行。",
"测试能力可以，免费完成正式工作不行。",
"面試作業可以是 sample，不太適合直接變成免費 production。",
"面试作业可以是 sample，不太适合直接变成免费 production。",
"I'm fine with a reasonable skills test, but this is close to real deliverable work. If full completion is required, it should be paid.",
"Testing ability is fine. Completing actual work for free is not.",
"An interview task can be a sample. It shouldn't quietly become free production work.",
"合理能力測試我可以做，但呢個已經接近真實交付。如果要完整做，希望按付費試做。",
"測試能力可以，免費做正式工作唔得。",
"面試作業可以係 sample，唔太適合直接變免費 production。"));

add("b04","business","客戶","客户","Client","拒絕無限修改","拒绝无限修改","Limit revisions",
"客戶不停要求小改且沒有結束","客户不停要求小改且没有结束","A client keeps requesting endless small revisions",
R(
"目前已完成 X 輪修改。為了避免持續發散，建議把剩餘意見集中一次確認，之後按最終版收口。",
"目前已完成 X 轮修改。为了避免持续发散，建议把剩余意见集中一次确认，之后按最终版收口。",
"每次只改一點，累積起來仍然是很多輪。",
"每次只改一点，累积起来仍然是很多轮。",
"「最後一個小改」已經出現很多個兄弟姐妹了，我們這次一起收口。",
"“最后一个小改”已经出现很多个兄弟姐妹了，我们这次一起收口。",
"We've completed X revision rounds. To avoid endless drift, please consolidate the remaining comments into one final review.",
"Each change may be small. The number of revision rounds is not.",
"'One last tiny change' has developed a large family. Let's close them out together this round.",
"而家已經改咗 X 輪。為免一路發散，剩低意見集中一次確認，之後按 final 收口。",
"每次改少少，加埋都係好多輪。",
"『最後一個小改』已經有好多兄弟姐妹，今次一齊收口啦。"));

add("b05","business","合作方","合作方","Partner company","拒絕口頭承諾","拒绝口头承诺","Ask for written confirmation",
"合作方只口頭答應重要條件但不願書面確認","合作方只口头答应重要条件但不愿书面确认","A partner verbally agrees to important terms but avoids written confirmation",
R(
"這個條件比較重要，麻煩我們在郵件或文件裡確認一下，避免後面理解不一致。",
"这个条件比较重要，麻烦我们在邮件或文件里确认一下，避免后面理解不一致。",
"口頭可以建立氣氛，條款還是需要建立紀錄。",
"口头可以建立气氛，条款还是需要建立记录。",
"記憶很珍貴，所以重要條件我想交給文字幫忙保管。",
"记忆很珍贵，所以重要条件我想交给文字帮忙保管。",
"This term is important, so let's confirm it in writing to avoid different interpretations later.",
"Verbal agreements are good for atmosphere. Important terms still need a record.",
"Memory is precious, so I'd rather let text store the important terms for us.",
"呢個條件比較重要，麻煩用 email 或文件確認一下，免得之後理解唔同。",
"口頭可以建立氣氛，條款都係要建立紀錄。",
"記憶好珍貴，所以重要條件我想交俾文字保管。"));

add("tr04","travel","同行朋友","同行朋友","Travel companion","拒絕超預算","拒绝超预算","Protect travel budget",
"同行朋友一直想升級酒店和餐廳導致超預算","同行朋友一直想升级酒店和餐厅导致超预算","Your travel companion keeps upgrading plans beyond your budget",
R(
"我這次旅行預算有上限，超過的升級我就不參與了。我們可以部分行程分開安排。",
"我这次旅行预算有上限，超过的升级我就不参与了。我们可以部分行程分开安排。",
"旅行可以一起，預算不一定要一起失控。",
"旅行可以一起，预算不一定要一起失控。",
"我的錢包這次報的是經濟艙，不準備偷偷升商務艙。",
"我的钱包这次报的是经济舱，不准备偷偷升商务舱。",
"I have a fixed budget for this trip. I won't join upgrades beyond it, and we can split some plans if needed.",
"We can travel together without our budgets losing control together.",
"My wallet booked economy for this trip. It's not secretly upgrading to business class.",
"我今次旅行有 budget 上限，超出嘅 upgrade 我唔參與。部分行程可以分開。",
"旅行可以一齊，budget 唔一定要一齊失控。",
"我個銀包今次報經濟艙，唔準備偷偷升 business。"));

add("tr05","travel","同行朋友","同行朋友","Travel companion","想休息不跑景點","想休息不跑景点","Ask for a rest day",
"同行朋友每天排滿行程，你想休息半天","同行朋友每天排满行程，你想休息半天","Your travel companion packs every day and you need rest",
R(
"我明天想留半天休息，不跑景點。你們可以照原計畫，我晚一點再會合。",
"我明天想留半天休息，不跑景点。你们可以照原计划，我晚一点再会合。",
"旅行不是考勤，我不想每天都打滿出席率。",
"旅行不是考勤，我不想每天都打满出席率。",
"我來旅行，不是參加景點全勤獎競賽。",
"我来旅行，不是参加景点全勤奖竞赛。",
"I want to keep half of tomorrow free to rest. You can follow the original plan and I'll rejoin later.",
"Travel isn't attendance tracking. I don't need 100% attraction attendance.",
"I'm on holiday, not competing for a perfect attraction attendance award.",
"我聽日想留半日休息，唔跑景點。你哋照原 plan，我遲啲再會合。",
"旅行唔係考勤，我唔想每日都打滿出席率。",
"我嚟旅行，唔係參加景點全勤獎比賽。"));

add("m03","medical","醫生","医生","Doctor","詢問第二意見","询问第二意见","Seek second opinion",
"你想再找另一位醫生確認重大治療方案","你想再找另一位医生确认重大治疗方案","You want a second opinion on a major treatment decision",
R(
"這個決定比較重大，我想再找另一位專科醫生確認一下再做決定。這不是不信任，而是希望把資訊了解完整。",
"这个决定比较重大，我想再找另一位专科医生确认一下再做决定。这不是不信任，而是希望把信息了解完整。",
"重大決定多聽一個專業意見，成本通常比後悔低。",
"重大决定多听一个专业意见，成本通常比后悔低。",
"不是我要開醫生評審會，只是這題分值太高，想多看一份答案。",
"不是我要开医生评审会，只是这题分值太高，想多看一份答案。",
"This is a major decision, so I'd like a second specialist opinion before deciding. It's not about distrust; I want complete information.",
"For a major decision, one more professional opinion usually costs less than regret.",
"I'm not forming a doctor review panel. This question just carries enough weight to check another answer.",
"呢個決定比較重大，我想再搵另一位專科醫生確認再決定。唔係唔信任，只係想了解完整。",
"重大決定多聽一個專業意見，成本通常低過後悔。",
"唔係我要開醫生評審會，只係呢題分值太高，想多睇一份答案。"));

add("m04","medical","醫生","医生","Doctor","詢問藥物副作用","询问药物副作用","Ask about side effects",
"醫生開了新藥，你想問清楚副作用和注意事項","医生开了新药，你想问清楚副作用和注意事项","You were prescribed a new medication and want to understand side effects",
R(
"這個藥常見的副作用有哪些？如果出現哪些情況需要停藥或盡快就醫？",
"这个药常见的副作用有哪些？如果出现哪些情况需要停药或尽快就医？",
"藥我會按指示吃，但也想知道什麼情況不應該硬撐。",
"药我会按指示吃，但也想知道什么情况不应该硬撑。",
"使用說明我想看完整版，不只看『每日兩次』那一行。",
"使用说明我想看完整版，不只看“每日两次”那一行。",
"What are the common side effects of this medication, and which symptoms would mean I should stop it or seek care promptly?",
"I'll take it as directed, but I also want to know which symptoms I shouldn't just push through.",
"I'd like the full user manual, not only the 'twice daily' line.",
"呢隻藥常見副作用有咩？出現咩情況要停藥或者盡快求醫？",
"藥我會照食，但都想知咩情況唔應該硬頂。",
"使用說明我想睇完整版，唔只係『每日兩次』嗰行。"));

add("on04","online","工作群","工作群","Work chat","下班後消息","下班后消息","After-hours message",
"同事晚上不停發非緊急工作消息","同事晚上不停发非紧急工作消息","A colleague sends non-urgent work messages all evening",
R(
"我今晚已下線，這些我明早上班後統一處理。如果有真正緊急事項可以電話聯絡。",
"我今晚已下线，这些我明早上班后统一处理。如果有真正紧急事项可以电话联系。",
"消息可以晚上發，回覆不代表也要晚上出貨。",
"消息可以晚上发，回复不代表也要晚上出货。",
"Teams 可以 24 小時營業，我暫時不跟它一起輪班。",
"Teams 可以 24 小时营业，我暂时不跟它一起轮班。",
"I'm offline for tonight and will handle these tomorrow morning. If something is genuinely urgent, call me.",
"Messages can be sent at night. Replies don't have to ship at night too.",
"Teams can stay open 24/7. I'm not joining its shift schedule.",
"我今晚已經 offline，呢啲聽朝返工統一處理。真係 urgent 可以打電話。",
"message 可以夜晚發，reply 唔代表都要夜晚出貨。",
"Teams 可以 24 小時營業，我暫時唔同佢一齊輪班。"));

add("on05","online","群聊","群聊","Group chat","制止刷屏","制止刷屏","Ask to stop spamming",
"群裡有人連續發大量無關內容","群里有人连续发大量无关内容","Someone floods a group chat with unrelated messages",
R(
"麻煩無關內容稍微收一下，群裡還有重要訊息需要大家能看到。",
"麻烦无关内容稍微收一下，群里还有重要信息需要大家能看到。",
"群聊可以熱鬧，但不要把重要消息沖到海底。",
"群聊可以热闹，但不要把重要消息冲到海底。",
"再刷下去，重要通知可能要穿潛水服才能找到。",
"再刷下去，重要通知可能要穿潜水服才能找到。",
"Please keep unrelated messages down a little. There are important updates in the group that people need to see.",
"The group can be lively without sending important messages to the ocean floor.",
"At this rate, important notices will need scuba gear to be found.",
"麻煩無關內容收少少，群入面仲有重要消息要大家睇到。",
"群可以熱鬧，但唔好將重要消息沖落海底。",
"再刷落去，重要通知可能要著潛水衣先搵到。"));

add("on06","online","網友","网友","Online contact","拒絕語音電話","拒绝语音电话","Decline voice call",
"對方總突然打語音或視頻給你","对方总突然打语音或视频给你","Someone repeatedly calls you without asking",
R(
"我不太習慣突然接語音或視頻。先發消息問一下，有空我會回覆是否方便。",
"我不太习惯突然接语音或视频。先发消息问一下，有空我会回复是否方便。",
"電話不是門鈴，響了不代表我一定要開門。",
"电话不是门铃，响了不代表我一定要开门。",
"我的手機有接聽鍵，也有不接聽的完整功能。",
"我的手机有接听键，也有不接听的完整功能。",
"I'm not comfortable with unexpected voice or video calls. Message first and I'll let you know when I'm available.",
"A call isn't a doorbell. Ringing doesn't mean I have to open it.",
"My phone includes both an answer button and a fully functional decline button.",
"我唔太習慣突然語音或者 video call。先 message 問下，有空我會覆方唔方便。",
"電話唔係門鐘，響咗唔代表我一定要開門。",
"我部手機有接聽掣，亦有完整嘅唔接功能。"));

window.CHAT_SCENARIOS=(window.CHAT_SCENARIOS||[]).concat(A);
})();