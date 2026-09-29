window.CHAT_SCENARIOS = (function(){
const D={
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
 travel:{hant:"旅行",hans:"旅行",en:"Travel"}
};
const A=[];
function add(id,domain,relation,goal,title,replies){
 A.push({id,domain,domainLabel:D[domain],relation,goal,title,replies});
}
add("w01","workplace",
 {hant:"同事",hans:"同事",en:"Colleague"},
 {hant:"催進度",hans:"催进度",en:"Follow up"},
 {hant:"同事答應今天交資料，但一直沒交",hans:"同事答应今天交资料，但一直没交",en:"A colleague promised to send the files today but still hasn't"},
 {zh:{
  formal:{hant:"想跟進一下 XX 資料目前的進度。我們今天需要開始整合，如最終版本仍在整理，也可以先提供目前版本，謝謝。",hans:"想跟进一下 XX 资料目前的进度。我们今天需要开始整合，如最终版本仍在整理，也可以先提供目前版本，谢谢。"},
  dark:{hant:"怕最後大家一起趕，所以先確認一下 XX 現在方便給到哪個版本。",hans:"怕最后大家一起赶，所以先确认一下 XX 现在方便给到哪个版本。"},
  roast:{hant:"我已經和這份資料建立感情了，就是還沒見過它本人。今天方便讓我們見一面嗎？",hans:"我已经和这份资料建立感情了，就是还没见过它本人。今天方便让我们见一面吗？"}},
 en:{formal:"Just following up on the XX files. If the final version is still being prepared, the current version would help us start consolidating.",dark:"Just checking which version is ready now, so we don't all discover the deadline together later.",roast:"I've heard so much about this file that I feel we already know each other. Any chance we can finally meet today?"},
 yue:{formal:"想跟一跟 XX 嗰份資料而家做到邊。如果仲執緊，可以俾住現有版本我先，我呢邊可以開始整合。",dark:"驚最後大家一齊趕，所以想先確認下 XX 而家方便俾到邊個版本。",roast:"我同呢份資料已經隔空培養咗感情，就係仲未見過本人。今日方便見下面未？"}});

add("w02","workplace",
 {hant:"上司",hans:"上司",en:"Manager"},
 {hant:"表達不同意見",hans:"表达不同意见",en:"Disagree"},
 {hant:"你不同意上司提出的方案",hans:"你不同意上司提出的方案",en:"You disagree with your manager's proposed approach"},
 {zh:{
  formal:{hant:"我理解這個方向。我想補充一個可能需要考慮的風險：如果 XX 發生，可能會影響 XX。是否可以同時保留一個備選方案？",hans:"我理解这个方向。我想补充一个可能需要考虑的风险：如果 XX 发生，可能会影响 XX。是否可以同时保留一个备选方案？"},
  dark:{hant:"方案可以推，我只想先把 XX 這個風險留在紀錄裡，免得之後它突然變成第一次聽說。",hans:"方案可以推，我只想先把 XX 这个风险留在记录里，免得之后它突然变成第一次听说。"},
  roast:{hant:"方向可以，出海前先把救生衣穿上會更完整。我主要擔心的是 XX。",hans:"方向可以，出海前先把救生衣穿上会更完整。我主要担心的是 XX。"}},
 en:{formal:"I understand the direction. One risk I'd like to flag is XX. Could we keep a fallback option in case it materialises?",dark:"I'm fine to proceed; I'd just like the XX risk recorded now so it doesn't become a brand-new surprise later.",roast:"The direction works. I'd just prefer we put the life jacket on before we sail. My main concern is XX."},
 yue:{formal:"個方向我明白，不過我想補充 XX 呢個風險。可唔可以同時留一個後備方案，會穩陣啲。",dark:"方案可以推，我只係想先將 XX 呢個風險留低紀錄，免得到時突然變成第一次聽講。",roast:"個方向可以，出海前著定救生衣會完整啲。我主要擔心係 XX。"}});

add("w03","workplace",
 {hant:"同事",hans:"同事",en:"Colleague"},
 {hant:"拒絕加塞",hans:"拒绝加塞",en:"Push back"},
 {hant:"同事臨時把額外工作丟給你",hans:"同事临时把额外工作丢给你",en:"A colleague suddenly adds extra work to your plate"},
 {zh:{
  formal:{hant:"我目前在處理 A 和 B，今天排期已滿。如果這項需要優先處理，我們可以先確認哪一項現有工作往後調整。",hans:"我目前在处理 A 和 B，今天排期已满。如果这项需要优先处理，我们可以先确认哪一项现有工作往后调整。"},
  dark:{hant:"沒問題，只要我們先決定今天哪件事正式不做，我就按新的優先級排。",hans:"没问题，只要我们先决定今天哪件事正式不做，我就按新的优先级排。"},
  roast:{hant:"我的工時目前還沒有長出第三隻手，所以可以加，但得先拿掉一件。",hans:"我的工时目前还没有长出第三只手，所以可以加，但得先拿掉一件。"}},
 en:{formal:"I can take this on, but my schedule is already full with A and B. If this takes priority, let's agree which existing item should move.",dark:"No problem. We just need to decide which existing task is officially not happening today.",roast:"My working day hasn't grown a third hand yet, so I can add this only if we remove something else."},
 yue:{formal:"可以幫，不過我今日 A 同 B 都排滿咗。如果呢件要插隊，我哋要先定邊一樣順延。",dark:"冇問題，只要我哋先決定今日邊樣正式唔做，我就跟新優先次序排。",roast:"我今日暫時未生到第三隻手，所以可以加，不過要先拎走一樣。"}});

add("w04","workplace",
 {hant:"上司",hans:"上司",en:"Manager"},
 {hant:"請假",hans:"请假",en:"Request leave"},
 {hant:"臨時需要請半天假",hans:"临时需要请半天假",en:"You need to request half a day off at short notice"},
 {zh:{
  formal:{hant:"因私人事項，我今天下午需要請半天假。A 已完成，B 已與 XX 交接，如有緊急情況我會保持電話可聯絡。",hans:"因私人事项，我今天下午需要请半天假。A 已完成，B 已与 XX 交接，如有紧急情况我会保持电话可联系。"},
  dark:{hant:"我下午需要處理私人事項，工作已經先安排好，所以這次就不額外做私人生活簡報了。",hans:"我下午需要处理私人事项，工作已经先安排好，所以这次就不额外做私人生活简报了。"},
  roast:{hant:"下午人生線有個臨時任務，工作線我已經存檔交接，想請半天假。",hans:"下午人生线有个临时任务，工作线我已经存档交接，想请半天假。"}},
 en:{formal:"I need to take half a day off this afternoon for a personal matter. A is completed and B has been handed over to XX.",dark:"I need to deal with a personal matter this afternoon. Work is covered, so I'll spare everyone the private-life presentation.",roast:"My life admin has scheduled an urgent task this afternoon. Work is saved and handed over, so I'd like to take half a day off."},
 yue:{formal:"我今日下晝有私人事要請半日假。A 已經做完，B 都同 XX 交接咗，有急事可以打俾我。",dark:"我下晝要處理私人事，工作已經安排好，所以私人生活嗰份簡報今次就唔開喇。",roast:"下晝人生線有個臨時任務，工作線我已經 save 同交接，想請半日假。"}});

add("w05","workplace",
 {hant:"同事",hans:"同事",en:"Colleague"},
 {hant:"指出錯誤",hans:"指出错误",en:"Point out an error"},
 {hant:"同事文件裡有明顯錯誤",hans:"同事文件里有明显错误",en:"There is a clear error in your colleague's document"},
 {zh:{
  formal:{hant:"我在 XX 頁看到一個可能需要再確認的地方：目前寫的是 A，但按最新資料應該是 B。方便再核對一下嗎？",hans:"我在 XX 页看到一个可能需要再确认的地方：目前写的是 A，但按最新资料应该是 B。方便再核对一下吗？"},
  dark:{hant:"先把這個地方標出來，免得錯誤最後在會議上突然獲得正式身份。",hans:"先把这个地方标出来，免得错误最后在会议上突然获得正式身份。"},
  roast:{hant:"XX 頁這個 A 看起來像偷偷混進來的舊版本，最新應該是 B。",hans:"XX 页这个 A 看起来像偷偷混进来的旧版本，最新应该是 B。"}},
 en:{formal:"There may be one item to recheck on page XX. It currently says A, while the latest information I have is B.",dark:"Flagging this now before the error gets promoted to official status in the meeting.",roast:"The A on page XX looks like an old version that snuck in. The latest should be B."},
 yue:{formal:"XX 頁呢度可能要再睇一睇，而家寫 A，但我手上最新資料係 B。你方便核對一下？",dark:"而家先標低，免得個錯誤去到會議先突然升級做正式版本。",roast:"XX 頁呢個 A 好似舊版本偷偷混咗入嚟，最新應該係 B。"}});

add("s01","study",
 {hant:"老師",hans:"老师",en:"Teacher"},
 {hant:"請教問題",hans:"请教问题",en:"Ask a question"},
 {hant:"上課後想問老師一個沒聽懂的問題",hans:"上课后想问老师一个没听懂的问题",en:"You want to ask your teacher about something you didn't understand"},
 {zh:{
  formal:{hant:"老師您好，我在 XX 這一步沒有理解清楚。我能理解 A，但不知道為什麼接下來可以推出 B，方便再說明一下嗎？",hans:"老师您好，我在 XX 这一步没有理解清楚。我能理解 A，但不知道为什么接下来可以推出 B，方便再说明一下吗？"},
  dark:{hant:"我目前和這一步還沒有達成共識，主要卡在 A 為什麼能推出 B。",hans:"我目前和这一步还没有达成共识，主要卡在 A 为什么能推出 B。"},
  roast:{hant:"我的腦子在 A 順利上車，到 B 的時候被落在月台了。老師可以補一下中間這一步嗎？",hans:"我的脑子在 A 顺利上车，到 B 的时候被落在站台了。老师可以补一下中间这一步吗？"}},
 en:{formal:"I understand A, but I'm not clear on how it leads to B. Could you walk me through that step again?",dark:"This step and I haven't reached an agreement yet. I'm stuck on why A leads to B.",roast:"My brain boarded at A and somehow got left on the platform before B. Could you fill in the missing step?"},
 yue:{formal:"老師，我卡咗喺 XX 呢一步。A 我明，但唔知點樣去到 B，可唔可以再講一次中間嗰步？",dark:"我同呢一步暫時未傾掂數，主要係唔明點解 A 可以去到 B。",roast:"我個腦喺 A 成功上車，但去 B 之前俾人留低咗喺月台。老師可唔可以補返中間嗰步？"}});

add("s02","study",
 {hant:"組員",hans:"组员",en:"Teammate"},
 {hant:"催小組作業",hans:"催小组作业",en:"Chase group work"},
 {hant:"小組作業快截止，組員還沒交自己的部分",hans:"小组作业快截止，组员还没交自己的部分",en:"A group assignment is due soon and a teammate hasn't submitted their part"},
 {zh:{
  formal:{hant:"提醒一下，我們明天需要提交作業。麻煩今晚 9 點前把你負責的部分放到共享文件，之後還需要時間統一格式和檢查。",hans:"提醒一下，我们明天需要提交作业。麻烦今晚 9 点前把你负责的部分放到共享文件，之后还需要时间统一格式和检查。"},
  dark:{hant:"先把 deadline 說清楚，免得最後共享文件裡只剩大家共享焦慮。",hans:"先把 deadline 说清楚，免得最后共享文件里只剩大家共享焦虑。"},
  roast:{hant:"截止日期已經在門口按門鈴了，你那部分今晚 9 點前能出現嗎？",hans:"截止日期已经在门口按门铃了，你那部分今晚 9 点前能出现吗？"}},
 en:{formal:"The assignment is due tomorrow. Could you upload your section by 9 pm tonight so we still have time to consolidate and review it?",dark:"Let's lock the deadline now, before the only thing we end up sharing is group anxiety.",roast:"The deadline is already ringing the doorbell. Any chance your section can arrive by 9 pm?"},
 yue:{formal:"提一提，聽日就要交。你嗰部分今晚 9 點前可唔可以放上 shared doc？之後我哋仲要執格式。",dark:"不如而家講清楚 deadline，免得到最後個 shared doc 入面得大家共同嘅焦慮。",roast:"個 deadline 已經喺門口撳鐘喇，你嗰部分今晚 9 點前出唔出現到？"}});

add("s03","study",
 {hant:"老師",hans:"老师",en:"Teacher"},
 {hant:"申請延期",hans:"申请延期",en:"Request extension"},
 {hant:"因合理原因無法按時交作業",hans:"因合理原因无法按时交作业",en:"You have a valid reason for missing an assignment deadline"},
 {zh:{
  formal:{hant:"老師您好，因 XX 原因，我可能無法在原截止時間前完成作業。目前已完成約 XX%，想申請延至 X 月 X 日提交。",hans:"老师您好，因 XX 原因，我可能无法在原截止时间前完成作业。目前已完成约 XX%，想申请延至 X 月 X 日提交。"},
  dark:{hant:"我不想拿一份明知道沒完成好的版本去測試截止日期的寬容度，所以先正式申請延期。",hans:"我不想拿一份明知道没完成好的版本去测试截止日期的宽容度，所以先正式申请延期。"},
  roast:{hant:"目前作業和 deadline 正在賽跑，deadline 明顯領先。想申請延到 X 月 X 日。",hans:"目前作业和 deadline 正在赛跑，deadline 明显领先。想申请延到 X 月 X 日。"}},
 en:{formal:"Due to XX, I may not be able to complete the assignment by the original deadline. I have completed about XX% and would like to request an extension until X.",dark:"I'd rather request an extension properly than test the deadline with a version I already know is incomplete.",roast:"The assignment and the deadline are currently racing, and the deadline is clearly winning. Could I extend to X?"},
 yue:{formal:"老師你好，因為 XX，我可能趕唔切原本 deadline，而家大概完成咗 XX%。想問可唔可以延到 X 月 X 日交？",dark:"我唔想攞份明知未做好嘅版本去測試 deadline 有幾寬容，所以想正式申請延期。",roast:"份功課同 deadline 而家賽緊跑，deadline 明顯領先。想申請延到 X 月 X 日。"}});

add("f01","family",
 {hant:"伴侶",hans:"伴侣",en:"Partner"},
 {hant:"談家務",hans:"谈家务",en:"Discuss chores"},
 {hant:"你覺得家務分配長期不平衡",hans:"你觉得家务分配长期不平衡",en:"You feel the household chores have been uneven for a long time"},
 {zh:{
  formal:{hant:"我想跟你重新分一下家務。最近做飯、洗衣和收拾大多集中在我這邊，我有點吃不消。我們能不能把固定項目重新分配一下？",hans:"我想跟你重新分一下家务。最近做饭、洗衣和收拾大多集中在我这边，我有点吃不消。我们能不能把固定项目重新分配一下？"},
  dark:{hant:"我想確認一下，我們目前是共同生活，還是我不小心升級成了免費後勤部。",hans:"我想确认一下，我们目前是共同生活，还是我不小心升级成了免费后勤部。"},
  roast:{hant:"家務這個專案目前只有一個活躍帳號，我想申請增加一名正式成員。",hans:"家务这个项目目前只有一个活跃账号，我想申请增加一名正式成员。"}},
 en:{formal:"I'd like us to rebalance the household chores. Cooking, laundry and tidying have mostly fallen on me lately.",dark:"I just want to confirm whether this is shared living or whether I accidentally became the unpaid operations department.",roast:"This household project currently has one active user. I'd like to request a second licensed member."},
 yue:{formal:"我想同你重新分一分家務。最近煮飯、洗衫同執嘢好多都落咗喺我度，我有啲頂唔順。",dark:"我想確認下，我哋而家係共同生活，定係我唔小心升級做咗免費後勤部。",roast:"家務呢個 project 而家得一個 active account，我想申請加多一個正式 member。"}});

add("f02","family",
 {hant:"父母",hans:"父母",en:"Parents"},
 {hant:"建立財務界線",hans:"建立财务界限",en:"Set a financial boundary"},
 {hant:"父母頻繁追問你的收入和存款",hans:"父母频繁追问你的收入和存款",en:"Your parents repeatedly ask about your income and savings"},
 {zh:{
  formal:{hant:"我知道你們是關心我，不過具體收入和存款我想自己管理。如果遇到需要家庭一起商量的重大財務事情，我一定會主動說。",hans:"我知道你们是关心我，不过具体收入和存款我想自己管理。如果遇到需要家庭一起商量的重大财务事情，我一定会主动说。"},
  dark:{hant:"我的財務目前運作正常，所以暫時不開家庭版財報發布會。",hans:"我的财务目前运作正常，所以暂时不开家庭版财报发布会。"},
  roast:{hant:"等我哪天上市了，一定第一時間給你們發年報。現在先讓我的存款保持一點神秘感。",hans:"等我哪天上市了，一定第一时间给你们发年报。现在先让我的存款保持一点神秘感。"}},
 en:{formal:"I know you're asking because you care, but I'd prefer to keep the exact details of my income and savings private.",dark:"My finances are operating normally, so I don't think we need a family earnings call just yet.",roast:"If I ever go public, you'll get the annual report first. Until then, let my savings keep a little mystery."},
 yue:{formal:"我知你哋係關心我，不過收入同存款嘅具體數字我想自己管理。有重要財務決定我一定會同你哋講。",dark:"我嘅財務目前運作正常，所以暫時唔開家庭版業績發布會。",roast:"等我第日上市，我一定第一時間俾年報你哋。依家先俾我啲存款保持少少神秘感。"}});

add("p01","parenting",
 {hant:"孩子",hans:"孩子",en:"Child"},
 {hant:"催作業",hans:"催作业",en:"Start homework"},
 {hant:"孩子一直拖著不開始寫作業",hans:"孩子一直拖着不开始写作业",en:"Your child keeps delaying the start of homework"},
 {zh:{
  formal:{hant:"我們先不要求一次做完。你選一科，先做 15 分鐘。15 分鐘後我們再看下一步。",hans:"我们先不要求一次做完。你选一科，先做 15 分钟。15 分钟后我们再看下一步。"},
  dark:{hant:"作業不會因為我們一起看著它就自己完成，所以先處理最小的一塊。",hans:"作业不会因为我们一起看着它就自己完成，所以先处理最小的一块。"},
  roast:{hant:"作業已經在桌上躺很久了，它看起來沒有自動完成功能。我們先救 15 分鐘。",hans:"作业已经在桌上躺很久了，它看起来没有自动完成功能。我们先救 15 分钟。"}},
 en:{formal:"You don't have to finish everything at once. Pick one subject and work on it for 15 minutes.",dark:"The homework doesn't seem to be completing itself while we stare at it, so let's handle the smallest piece first.",roast:"The homework has been lying there for a while and apparently didn't come with auto-complete. Let's rescue 15 minutes of it."},
 yue:{formal:"唔使諗住一次過做晒。你揀一科，先做 15 分鐘，做完呢段再睇下一步。",dark:"份功課望落唔似會因為我哋望住佢就自己完成，不如先處理最細嗰部分。",roast:"份功課喺張枱瞓咗咁耐，睇嚟都冇 auto-complete 功能。不如先救 15 分鐘。"}});

add("p02","parenting",
 {hant:"孩子",hans:"孩子",en:"Child"},
 {hant:"處理發脾氣",hans:"处理发脾气",en:"Handle a meltdown"},
 {hant:"孩子因為不能繼續玩手機而大哭",hans:"孩子因为不能继续玩手机而大哭",en:"Your child cries because screen time is over"},
 {zh:{
  formal:{hant:"我知道你現在很生氣，因為你還想繼續玩。生氣可以，但今天的手機時間已經結束。我會在這裡陪你。",hans:"我知道你现在很生气，因为你还想继续玩。生气可以，但今天的手机时间已经结束。我会在这里陪你。"},
  dark:{hant:"情緒可以加時，手機不能加時。",hans:"情绪可以加时，手机不能加时。"},
  roast:{hant:"手機今天已經下班了，你可以先對它表示不滿，但它不會復工。",hans:"手机今天已经下班了，你可以先对它表示不满，但它不会复工。"}},
 en:{formal:"I know you're upset because you want more screen time. It's okay to be upset, but today's screen time is still finished.",dark:"The feelings can run overtime. The phone can't.",roast:"The phone has clocked out for today. You can complain to management, but it's not coming back on shift."},
 yue:{formal:"我知你仲想玩，所以而家好嬲。你可以嬲，但今日手機時間已經完咗，我會陪住你。",dark:"情緒可以加時，手機唔可以。",roast:"部手機今日已經收工，你可以投訴，但佢唔會復工。"}});

add("e01","elder",
 {hant:"長輩",hans:"长辈",en:"Elder"},
 {hant:"拒絕催婚",hans:"拒绝催婚",en:"Handle marriage pressure"},
 {hant:"長輩反覆催你結婚",hans:"长辈反复催你结婚",en:"An elder repeatedly pressures you to get married"},
 {zh:{
  formal:{hant:"謝謝你關心我的人生安排。結婚這件事我會認真考慮，但希望由我自己決定時間。有好消息我一定會主動說。",hans:"谢谢你关心我的人生安排。结婚这件事我会认真考虑，但希望由我自己决定时间。有好消息我一定会主动说。"},
  dark:{hant:"放心，這件事如果真的有進度，應該不至於需要靠每次飯局人工刷新。",hans:"放心，这件事如果真的有进度，应该不至于需要靠每次饭局人工刷新。"},
  roast:{hant:"目前婚姻系統沒有更新，有版本發布我會主動推送，不用每天手動檢查。",hans:"目前婚姻系统没有更新，有版本发布我会主动推送，不用每天手动检查。"}},
 en:{formal:"I know you're asking because you care. I'll make the decision about marriage in my own time, and I'll tell you when there's news.",dark:"If there's real progress, I promise it won't require a manual refresh at every family dinner.",roast:"The marriage system has no update yet. I'll push a notification when a new version is released."},
 yue:{formal:"我知你係關心我，不過結婚呢件事我自己有安排。有好消息我一定第一時間話你知。",dark:"放心，真係有進度嘅話，應該唔使靠每次食飯人手 refresh。",roast:"婚姻系統暫時冇 update，有新版本我會主動 push notification，唔使日日手動檢查。"}});

add("e02","elder",
 {hant:"長輩",hans:"长辈",en:"Elder"},
 {hant:"糾正假消息",hans:"纠正假消息",en:"Correct misinformation"},
 {hant:"長輩在家族群轉發明顯假消息",hans:"长辈在家族群转发明显假消息",en:"An elder forwards obvious misinformation in the family group"},
 {zh:{
  formal:{hant:"這條資訊我查了一下，目前沒有看到官方來源支持，而且其中部分說法與官方資料不一致。先不要轉發比較穩妥。",hans:"这条信息我查了一下，目前没有看到官方来源支持，而且其中部分说法与官方资料不一致。先不要转发比较稳妥。"},
  dark:{hant:"這條消息最大的來源目前看起來就是「有人轉給我」，所以先不幫它擴大業務。",hans:"这条消息最大的来源目前看起来就是“有人转给我”，所以先不帮它扩大业务。"},
  roast:{hant:"這條消息跑得比官方快太多了，通常這不是它比較有能力。",hans:"这条消息跑得比官方快太多了，通常这不是它比较有能力。"}},
 en:{formal:"I checked this and couldn't find an official source supporting it. Some details also conflict with official information, so it's safer not to forward it.",dark:"Its strongest source currently seems to be 'someone forwarded it to me', so maybe we shouldn't help it scale.",roast:"This message is moving much faster than the official source. That's usually not a sign of superior research."},
 yue:{formal:"呢條我啱啱查過，官方暫時冇呢個講法，而且有啲內容對唔上。暫時唔好再轉會穩陣啲。",dark:"呢條消息最大嘅來源目前似係『有人轉俾我』，所以暫時唔幫佢擴大業務。",roast:"呢條消息跑得快過官方好多，通常唔代表佢資料搜集能力特別強。"}});

add("fr01","friends",
 {hant:"朋友",hans:"朋友",en:"Friend"},
 {hant:"拒絕借錢",hans:"拒绝借钱",en:"Decline a loan"},
 {hant:"朋友向你借一筆你不想借的錢",hans:"朋友向你借一笔你不想借的钱",en:"A friend asks to borrow money you don't want to lend"},
 {zh:{
  formal:{hant:"抱歉，這筆錢我這邊不方便借出。我不想因為金錢問題影響我們的關係，希望你理解。",hans:"抱歉，这笔钱我这边不方便借出。我不想因为金钱问题影响我们的关系，希望你理解。"},
  dark:{hant:"我希望我們的友情不要突然多出本金、利息和還款日三個新角色。",hans:"我希望我们的友情不要突然多出本金、利息和还款日三个新角色。"},
  roast:{hant:"我們的友情目前運作良好，我想繼續維持無金融產品版本。",hans:"我们的友情目前运作良好，我想继续维持无金融产品版本。"}},
 en:{formal:"I'm sorry, but I'm not comfortable lending this amount. I value our friendship and don't want money to complicate it.",dark:"I'd prefer our friendship not to suddenly acquire principal, interest and a repayment date.",roast:"Our friendship is working well. I'd like to keep it on the no-financial-products plan."},
 yue:{formal:"唔好意思，呢筆錢我唔方便借。我唔想因為金錢問題影響我哋關係，希望你明白。",dark:"我想我哋段友情繼續保持冇本金、利息同還款日呢三個新角色。",roast:"我哋段友情目前運作良好，我想繼續維持冇金融產品版本。"}});

add("fr02","friends",
 {hant:"朋友",hans:"朋友",en:"Friend"},
 {hant:"拒絕聚會",hans:"拒绝聚会",en:"Decline an invitation"},
 {hant:"朋友約你出去，但你真的想休息",hans:"朋友约你出去，但你真的想休息",en:"A friend invites you out but you really need rest"},
 {zh:{
  formal:{hant:"謝謝你約我，不過這次我就不去了。最近想留點時間休息，下次有合適的活動再一起。",hans:"谢谢你约我，不过这次我就不去了。最近想留点时间休息，下次有合适的活动再一起。"},
  dark:{hant:"這次我的社交電量已經進入省電模式，我先不出門了。",hans:"这次我的社交电量已经进入省电模式，我先不出门了。"},
  roast:{hant:"今天的人類互動額度已用完，這次先放過我，下次再續杯。",hans:"今天的人类互动额度已用完，这次先放过我，下次再续杯。"}},
 en:{formal:"Thanks for inviting me, but I'll sit this one out. I need a quiet night to recharge. Let's catch up next time.",dark:"My social battery is already in low-power mode, so I'm staying in this time.",roast:"Today's human-interaction quota has been used up. Please release me and try again next time."},
 yue:{formal:"多謝你約我，不過今次我唔去啦，最近真係想留喺屋企抖下。下次再約。",dark:"今次我嘅社交電量已經入咗慳電模式，我唔出門喇。",roast:"今日人類互動額度已經用晒，今次放過我，下次再續杯。"}});

add("r01","relationship",
 {hant:"伴侶",hans:"伴侣",en:"Partner"},
 {hant:"冷靜處理爭吵",hans:"冷静处理争吵",en:"De-escalate an argument"},
 {hant:"你們越吵越激烈，已經開始說重話",hans:"你们越吵越激烈，已经开始说重话",en:"An argument is escalating and both of you are starting to say hurtful things"},
 {zh:{
  formal:{hant:"我想把這件事說清楚，但我們現在都很生氣。先停 20 分鐘，等情緒降一點再繼續，我不會逃避這個問題。",hans:"我想把这件事说清楚，但我们现在都很生气。先停 20 分钟，等情绪降一点再继续，我不会逃避这个问题。"},
  dark:{hant:"我們現在繼續聊，產量最高的可能只剩後悔。先停一下。",hans:"我们现在继续聊，产量最高的可能只剩后悔。先停一下。"},
  roast:{hant:"目前這場會議的 KPI 已經從解決問題變成製造新問題，先休會 20 分鐘。",hans:"目前这场会议的 KPI 已经从解决问题变成制造新问题，先休会 20 分钟。"}},
 en:{formal:"I want to resolve this, but we're both too angry right now. Let's pause for 20 minutes and come back to it. I'm not avoiding the issue.",dark:"If we keep going right now, the main thing we'll produce is regret. Let's pause.",roast:"This meeting's KPI has shifted from solving one problem to creating new ones. Let's adjourn for 20 minutes."},
 yue:{formal:"我想講清楚呢件事，但我哋而家都太嬲。停 20 分鐘先，等情緒落返少少再傾，我唔會避呢個問題。",dark:"我哋而家繼續傾，產量最高嘅可能淨係得後悔。停一停先。",roast:"而家呢場會議嘅 KPI 已經由解決問題變咗製造新問題，休會 20 分鐘先。"}});

add("r02","relationship",
 {hant:"曖昧對象",hans:"暧昧对象",en:"Someone you're dating"},
 {hant:"確認關係",hans:"确认关系",en:"Clarify the relationship"},
 {hant:"你想知道對方怎麼看你們的關係",hans:"你想知道对方怎么看你们的关系",en:"You want to know how the other person sees your relationship"},
 {zh:{
  formal:{hant:"我很享受我們最近的相處，也想確認一下你怎麼看我們現在的關係。對我來說，知道彼此期待會比較安心。",hans:"我很享受我们最近的相处，也想确认一下你怎么看我们现在的关系。对我来说，知道彼此期待会比较安心。"},
  dark:{hant:"我想確認一下我們現在是在發展關係，還是在共同參與一個沒有說明書的測試版。",hans:"我想确认一下我们现在是在发展关系，还是在共同参与一个没有说明书的测试版。"},
  roast:{hant:"我們這個專案跑了一陣子了，我想問一下目前到底是 Beta 測試還是準備正式上線。",hans:"我们这个项目跑了一阵子了，我想问一下目前到底是 Beta 测试还是准备正式上线。"}},
 en:{formal:"I've really enjoyed spending time with you, and I'd like to understand how you see what we have. Knowing our expectations would help me.",dark:"I'd like to know whether we're building a relationship or jointly participating in an undocumented beta test.",roast:"This project has been running for a while. Are we still in beta, or are we planning an official launch?"},
 yue:{formal:"我幾享受我哋最近嘅相處，想確認下你點睇我哋而家嘅關係。知道大家期待會安心啲。",dark:"我想確認下我哋而家係發展緊關係，定係一齊參與緊一個冇說明書嘅測試版。",roast:"我哋呢個 project 跑咗一排，想問而家究竟仲係 Beta 定準備正式上線。"}});

add("so01","social",
 {hant:"陌生人",hans:"陌生人",en:"Stranger"},
 {hant:"拒絕搭話",hans:"拒绝搭话",en:"End a conversation"},
 {hant:"陌生人一直搭話，但你不想繼續聊",hans:"陌生人一直搭话，但你不想继续聊",en:"A stranger keeps talking to you and you want to end the conversation"},
 {zh:{
  formal:{hant:"不好意思，我現在想安靜一下，就先不聊了，謝謝理解。",hans:"不好意思，我现在想安静一下，就先不聊了，谢谢理解。"},
  dark:{hant:"我今天的陌生人聊天額度用完了，先到這裡。",hans:"我今天的陌生人聊天额度用完了，先到这里。"},
  roast:{hant:"我的社交系統剛剛彈出「今日額度已滿」，只能先結束對話了。",hans:"我的社交系统刚刚弹出“今日额度已满”，只能先结束对话了。"}},
 en:{formal:"Sorry, I'd like some quiet time now, so I'm going to end the conversation here. Thanks for understanding.",dark:"I've used up today's stranger-chat quota, so I'm going to stop here.",roast:"My social system just popped up 'daily limit reached', so this conversation has to close."},
 yue:{formal:"唔好意思，我而家想靜一靜，就先唔傾喇，多謝理解。",dark:"我今日同陌生人傾偈嘅額度用晒，先到呢度。",roast:"我個社交系統啱啱彈出『今日額度已滿』，今次要先完結對話喇。"}});

add("sv01","service",
 {hant:"客服",hans:"客服",en:"Customer service"},
 {hant:"要求退款",hans:"要求退款",en:"Request a refund"},
 {hant:"商品與描述不符，你想要求退款",hans:"商品与描述不符，你想要求退款",en:"The product doesn't match the description and you want a refund"},
 {zh:{
  formal:{hant:"我收到的商品與頁面描述存在明顯差異，具體是 XX。我已保留照片和訂單資料，希望按平台規則辦理退款。",hans:"我收到的商品与页面描述存在明显差异，具体是 XX。我已保留照片和订单资料，希望按平台规则办理退款。"},
  dark:{hant:"如果頁面寫的是 A、收到的是 B，那我想我們對「與描述相符」的理解可能需要重新對齊。我要申請退款。",hans:"如果页面写的是 A、收到的是 B，那我想我们对“与描述相符”的理解可能需要重新对齐。我要申请退款。"},
  roast:{hant:"我買的是頁面上的 A，不是開箱驚喜版 B。麻煩幫我辦理退款。",hans:"我买的是页面上的 A，不是开箱惊喜版 B。麻烦帮我办理退款。"}},
 en:{formal:"The item I received differs materially from the product description, specifically XX. I have photos and order records and would like to request a refund under the platform policy.",dark:"If the listing says A and the box contains B, I think our definition of 'as described' needs some alignment. I'd like a refund.",roast:"I ordered A from the listing, not the surprise-box edition B. Please process a refund."},
 yue:{formal:"我收到嘅貨同頁面描述有明顯差異，具體係 XX。我已經留低相同訂單資料，希望按平台規則辦理退款。",dark:"如果頁面寫 A、收到係 B，我諗大家對『貨品相符』嘅理解要重新對一對。我要申請退款。",roast:"我買嘅係頁面上嘅 A，唔係開箱驚喜版 B。麻煩幫我退款。"}});

add("j01","job",
 {hant:"招聘方",hans:"招聘方",en:"Recruiter"},
 {hant:"詢問面試進度",hans:"询问面试进度",en:"Follow up after interview"},
 {hant:"面試後多天沒有消息",hans:"面试后多天没有消息",en:"You haven't heard back several days after an interview"},
 {zh:{
  formal:{hant:"您好，想跟進一下 XX 職位的面試進度。我仍然對這個機會很感興趣，如有下一步安排或需要補充資料，請隨時告知，謝謝。",hans:"您好，想跟进一下 XX 职位的面试进度。我仍然对这个机会很感兴趣，如有下一步安排或需要补充资料，请随时告知，谢谢。"},
  dark:{hant:"想確認一下 XX 職位目前是否仍在流程中，避免我把「等待」誤讀成一種長期職位。",hans:"想确认一下 XX 职位目前是否仍在流程中，避免我把“等待”误读成一种长期职位。"},
  roast:{hant:"想跟進一下 XX 職位，不知道流程目前還在面試階段，還是已經進入靜默模式。",hans:"想跟进一下 XX 职位，不知道流程目前还在面试阶段，还是已经进入静默模式。"}},
 en:{formal:"I'm following up on the interview process for the XX role. I'm still very interested and would be happy to provide any additional information.",dark:"Just checking whether the XX role is still moving through the process, so I don't accidentally mistake 'waiting' for a long-term position.",roast:"Following up on the XX role — I'm not sure whether the process is still in interview mode or has entered silent mode."},
 yue:{formal:"你好，想跟一跟 XX 職位嘅面試進度。我仍然對呢個機會有興趣，如果有下一步安排或者要補資料，麻煩通知我。",dark:"想確認下 XX 職位仲係咪流程中，免得我將『等待』誤會成一份長期職位。",roast:"想跟一跟 XX 職位，唔知流程而家仲係面試模式，定已經入咗靜默模式。"}});

add("b01","business",
 {hant:"客戶",hans:"客户",en:"Client"},
 {hant:"範圍外需求",hans:"范围外需求",en:"Out-of-scope request"},
 {hant:"客戶要求免費增加原範圍外內容",hans:"客户要求免费增加原范围外内容",en:"A client asks for extra work outside scope at no additional cost"},
 {zh:{
  formal:{hant:"這項需求不在目前確認的工作範圍內。我們可以配合新增，建議先確認新增內容、時間影響及相應費用後再安排。",hans:"这项需求不在目前确认的工作范围内。我们可以配合新增，建议先确认新增内容、时间影响及相应费用后再安排。"},
  dark:{hant:"我們很樂意把它做好，只是如果新增內容仍算原 scope，原 scope 可能會變成一個會自動長大的東西。",hans:"我们很乐意把它做好，只是如果新增内容仍算原 scope，原 scope 可能会变成一个会自动长大的东西。"},
  roast:{hant:"可以加，scope 也可以長大，只是預算和時間最好不要被要求保持童年體型。",hans:"可以加，scope 也可以长大，只是预算和时间最好不要被要求保持童年体型。"}},
 en:{formal:"We can certainly add this. As it sits outside the agreed scope, let's first confirm the added deliverables, timeline impact and associated cost.",dark:"We're happy to add it; I just want to avoid the original scope becoming something that grows automatically.",roast:"The scope can grow. It would just be helpful if the budget and timeline didn't have to stay child-sized."},
 yue:{formal:"呢項可以加，不過已經超出原本 scope。我哋先確認新增內容、時間同費用影響，再安排會清楚啲。",dark:"我哋好樂意做好佢，只係如果新增內容都繼續當原 scope，個 scope 可能會變成自動生長。",roast:"可以加，scope 都可以長大，只係 budget 同 timeline 最好唔好被要求永遠保持童年體型。"}});

add("t01","travel",
 {hant:"同行朋友",hans:"同行朋友",en:"Travel companion"},
 {hant:"行程分歧",hans:"行程分歧",en:"Resolve itinerary conflict"},
 {hant:"旅行時大家想去的地方完全不同",hans:"旅行时大家想去的地方完全不同",en:"Your travel group wants completely different things"},
 {zh:{
  formal:{hant:"我們想去的地方不太一樣，不如各自選一個最想去的點，再把剩下時間留成自由活動，這樣大家都能有自己期待的部分。",hans:"我们想去的地方不太一样，不如各自选一个最想去的点，再把剩下时间留成自由活动，这样大家都能有自己期待的部分。"},
  dark:{hant:"如果每個景點都要全票通過，我們可能會把整趟旅行開成董事會。各選一個最想去的吧。",hans:"如果每个景点都要全票通过，我们可能会把整趟旅行开成董事会。各选一个最想去的吧。"},
  roast:{hant:"再投票下去，我們的第一個景點可能就是酒店大堂。各自選一個必去點吧。",hans:"再投票下去，我们的第一个景点可能就是酒店大堂。各自选一个必去点吧。"}},
 en:{formal:"We want different things from the trip. How about each person picks one must-do place, and we leave some time for separate plans?",dark:"If every stop needs unanimous approval, this trip may turn into a board meeting. Let's each pick one priority.",roast:"If we keep voting, our first attraction may end up being the hotel lobby. Let's each choose one must-do."},
 yue:{formal:"我哋想去嘅地方有啲唔同，不如每人揀一個最想去嘅點，剩低啲時間留自由活動，大家都有自己期待嘅部分。",dark:"如果每個景點都要全票通過，成趟旅行可能會變董事會。每人揀一個最想去啦。",roast:"再投票落去，我哋第一個景點可能就係酒店大堂。每人揀一個必去點啦。"}});

return A;
})();