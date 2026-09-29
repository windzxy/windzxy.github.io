;(function(){
var S=window.CHAT_SCENARIOS||[];
var D={
 "職場":"workplace","學習":"study","家庭":"family","育兒":"parenting","長輩":"elder","朋友":"friends"
};
var domains={
 workplace:{hant:"職場",hans:"职场",en:"Work"},
 study:{hant:"學習",hans:"学习",en:"Study"},
 family:{hant:"家庭",hans:"家庭",en:"Family"},
 parenting:{hant:"育兒",hans:"育儿",en:"Parenting"},
 elder:{hant:"長輩",hans:"长辈",en:"Elders"},
 friends:{hant:"朋友",hans:"朋友",en:"Friends"}
};
var rel={
 "同事":{hant:"同事",hans:"同事",en:"Colleague"},
 "上司":{hant:"上司",hans:"上司",en:"Manager"},
 "老師":{hant:"老師",hans:"老师",en:"Teacher"},
 "組員":{hant:"組員",hans:"组员",en:"Teammate"},
 "伴侶":{hant:"伴侶",hans:"伴侣",en:"Partner"},
 "父母":{hant:"父母",hans:"父母",en:"Parents"},
 "孩子":{hant:"孩子",hans:"孩子",en:"Child"},
 "長輩":{hant:"長輩",hans:"长辈",en:"Elder"},
 "朋友":{hant:"朋友",hans:"朋友",en:"Friend"}
};
var goal={
 "催進度":{hant:"催進度",hans:"催进度",en:"Follow up"},
 "表達不同意見":{hant:"表達不同意見",hans:"表达不同意见",en:"Disagree upward"},
 "拒絕加塞":{hant:"拒絕加塞",hans:"拒绝加塞",en:"Push back"},
 "請教問題":{hant:"請教問題",hans:"请教问题",en:"Ask a question"},
 "催小組作業":{hant:"催小組作業",hans:"催小组作业",en:"Chase group work"},
 "談家務":{hant:"談家務",hans:"谈家务",en:"Discuss chores"},
 "建立界線":{hant:"建立界線",hans:"建立界限",en:"Set a boundary"},
 "催作業":{hant:"催作業",hans:"催作业",en:"Start homework"},
 "處理發脾氣":{hant:"處理發脾氣",hans:"处理发脾气",en:"Handle a meltdown"},
 "拒絕催婚":{hant:"拒絕催婚",hans:"拒绝催婚",en:"Handle marriage pressure"},
 "糾正假消息":{hant:"糾正假消息",hans:"纠正假消息",en:"Correct misinformation"},
 "拒絕借錢":{hant:"拒絕借錢",hans:"拒绝借钱",en:"Decline a loan"}
};
var titles=[
 {hant:"同事答應今天交資料，但一直沒交",hans:"同事答应今天交资料，但一直没交",en:"A colleague promised to send the files today but still hasn't"},
 {hant:"你不同意上司提出的方案",hans:"你不同意上司提出的方案",en:"You disagree with your manager's proposed approach"},
 {hant:"同事臨時把額外工作丟給你",hans:"同事临时把额外工作丢给你",en:"A colleague suddenly adds extra work to your plate"},
 {hant:"上課後想問老師一個沒聽懂的問題",hans:"上课后想问老师一个没听懂的问题",en:"You want to ask your teacher about something you didn't understand"},
 {hant:"小組作業快截止，組員還沒交自己的部分",hans:"小组作业快截止，组员还没交自己的部分",en:"A group assignment is due soon and a teammate hasn't submitted their part"},
 {hant:"你覺得家務分配長期不平衡",hans:"你觉得家务分配长期不平衡",en:"You feel the household chores have been uneven for a long time"},
 {hant:"父母頻繁追問你的收入和存款",hans:"父母频繁追问你的收入和存款",en:"Your parents repeatedly ask about your income and savings"},
 {hant:"孩子一直拖著不開始寫作業",hans:"孩子一直拖着不开始写作业",en:"Your child keeps delaying the start of homework"},
 {hant:"孩子因為不能繼續玩手機而大哭",hans:"孩子因为不能继续玩手机而大哭",en:"Your child cries because screen time is over"},
 {hant:"長輩反覆催你結婚",hans:"长辈反复催你结婚",en:"An elder repeatedly pressures you to get married"},
 {hant:"長輩在家族群轉發明顯假消息",hans:"长辈在家族群转发明显假消息",en:"An elder forwards obvious misinformation in the family group"},
 {hant:"朋友向你借一筆你不想借的錢",hans:"朋友向你借一笔你不想借的钱",en:"A friend asks to borrow money you don't want to lend"}
];
var desc=[
 {hant:"希望對方盡快交付，又不想把氣氛弄僵",hans:"希望对方尽快交付，又不想把气氛弄僵",en:"Get the work moving without making things tense"},
 {hant:"指出風險，但避免直接否定",hans:"指出风险，但避免直接否定",en:"Raise the risk without turning it into a confrontation"},
 {hant:"不接無限責任，但保留合作空間",hans:"不接无限责任，但保留合作空间",en:"Protect your workload while staying cooperative"},
 {hant:"把問題問具體，避免只說「我不懂」",hans:"把问题问具体，避免只说“我不懂”",en:"Make the question specific"},
 {hant:"明確截止時間與下一步",hans:"明确截止时间与下一步",en:"Set a clear deadline and next action"},
 {hant:"談具體工作量，不把問題上升成人格",hans:"谈具体工作量，不把问题上升成人格",en:"Talk about workload, not character"},
 {hant:"不吵架，但明確私人財務邊界",hans:"不吵架，但明确私人财务边界",en:"Set a financial boundary without fighting"},
 {hant:"減少命令，把任務拆到能開始",hans:"减少命令，把任务拆到能开始",en:"Make the first step small enough to start"},
 {hant:"承認情緒，但不撤回已說好的界線",hans:"承认情绪，但不撤回已说好的界限",en:"Acknowledge feelings without moving the boundary"},
 {hant:"停止重複辯論，建立柔和界線",hans:"停止重复辩论，建立柔和界限",en:"Stop repeating the same debate and set a gentle boundary"},
 {hant:"避免直接嘲笑，提供核實方式",hans:"避免直接嘲笑，提供核实方式",en:"Correct it without humiliating the person"},
 {hant:"不虛構理由，不留模糊期待",hans:"不虚构理由，不留模糊期待",en:"Say no clearly without inventing excuses"}
];
var enDark=[
 "Just checking which version is ready now, so we don't all discover the deadline at the same time later.",
 "I'm fine to proceed; I'd just like the XX risk recorded now so it doesn't become a brand-new surprise later.",
 "No problem. We just need to decide which existing task is officially not happening today.",
 "A and I are getting along. B and I still haven't been properly introduced. Could you show me the missing step?",
 "Let's lock the deadline now, before the only thing we end up sharing is group anxiety.",
 "I just want to confirm whether this is shared living or whether I accidentally became the unpaid operations department.",
 "My finances are operating normally, so I don't think we need to schedule a family earnings call just yet.",
 "The homework doesn't seem to be completing itself while we stare at it, so let's handle the smallest piece first.",
 "The feelings can run overtime. The phone can't.",
 "If there's real progress, I promise it won't require manual refresh at every family dinner.",
 "Its strongest source currently seems to be 'someone forwarded it to me', so maybe we shouldn't help it scale.",
 "I'd prefer our friendship not to suddenly acquire principal, interest and a repayment date."
];
var enRoast=[
 "I've heard so much about this file that I feel we already know each other. Any chance we can finally meet today?",
 "The direction works. I'd just prefer we put the life jacket on before we sail. My main concern is XX.",
 "My working day hasn't grown a third hand yet, so I can add this only if we remove something else.",
 "My brain boarded the train at A and somehow got left on the platform before B. Could you fill in the missing step?",
 "The deadline is already ringing the doorbell. Any chance your section can arrive by 9 pm?",
 "This household project currently has one active user. I'd like to request a second licensed member.",
 "If I ever go public, you'll get the annual report first. Until then, let my savings keep a little mystery.",
 "The homework has been lying there for a while and apparently didn't come with auto-complete. Let's rescue 15 minutes of it.",
 "The phone has clocked out for today. You can complain to management, but it's not coming back on shift.",
 "The marriage system has no update yet. I'll push a notification when a new version is released.",
 "This message is moving faster than the official source. That's usually not a sign of superior research.",
 "Our friendship is working well. I'd like to keep it on the no-financial-products plan."
];
var yueDark=[
 "驚最後大家一齊趕，所以想先確認下 XX 而家方便俾到邊個版本。",
 "方案可以推，我只係想先將 XX 呢個風險留低紀錄，免得到時大家突然第一次聽講。",
 "冇問題，只要我哋先決定今日邊樣正式唔做，我就跟新優先次序排。",
 "我同 A 暫時相處良好，但去到 B 就未傾掂數。想問中間漏咗邊一步？",
 "不如而家講清楚 deadline，免得到最後個 shared doc 入面得大家共同嘅焦慮。",
 "我想確認下，我哋而家係共同生活，定係我唔小心升級做咗免費後勤部。",
 "我嘅財務目前運作正常，所以暫時唔開家庭版業績發布會。",
 "份功課望落唔似會因為我哋望住佢就自己完成，不如先處理最細嗰部分。",
 "情緒可以加時，手機唔可以。",
 "放心，真係有進度嘅話，應該唔使靠每次食飯人手 refresh。",
 "呢條消息最大嘅來源目前似係『有人轉俾我』，所以暫時唔幫佢擴大業務。",
 "我想我哋段友情繼續保持冇本金、利息同還款日呢三個新角色。"
];
var yueRoast=[
 "我同呢份資料已經隔空培養咗感情，就係仲未見過本人。今日方便俾我哋見下面未？",
 "個方向可以，出海前著定救生衣會完整啲。我主要擔心係 XX。",
 "我今日暫時未生到第三隻手，所以可以加，不過要先拎走一樣。",
 "我個腦喺 A 成功上車，但去 B 之前俾人留低咗喺月台。老師可唔可以補返中間嗰步？",
 "個 deadline 已經喺門口撳鐘喇，你嗰部分今晚 9 點前出唔出現到？",
 "家務呢個 project 而家得一個 active account，我想申請加多一個正式 member。",
 "等我第日上市，我一定第一時間俾年報你哋。依家先俾我啲存款保持少少神秘感。",
 "份功課喺張枱瞓咗咁耐，睇嚟都冇 auto-complete 功能。不如先救 15 分鐘。",
 "部手機今日已經收工，你可以投訴，但佢唔會復工。",
 "婚姻系統暫時冇 update，有新版本我會主動 push notification，唔使日日手動檢查。",
 "呢條消息跑得快過官方好多，通常唔代表佢資料搜集能力特別強。",
 "我哋段友情目前運作良好，我想繼續維持冇金融產品版本。"
];
function simp(s){return String(s||"").replace(/[進資料這邊點開現還裡後發與門為來過會讓們話覺務長線錢寫學組錯]/g,function(c){return {"進":"进","資":"资","料":"料","這":"这","邊":"边","點":"点","開":"开","現":"现","還":"还","裡":"里","後":"后","發":"发","與":"与","門":"门","為":"为","來":"来","過":"过","會":"会","讓":"让","們":"们","話":"话","覺":"觉","務":"务","長":"长","線":"线","錢":"钱","寫":"写","學":"学","組":"组","錯":"错"}[c]||c})}
window.CHAT_SCENARIOS=S.map(function(s,i){
 var dk=D[s.d]||"all";
 return {
  id:"scene-"+(i+1),
  domain:dk,
  domainLabel:domains[dk]||{hant:s.d,hans:simp(s.d),en:s.d},
  relation:rel[s.r]||{hant:s.r,hans:simp(s.r),en:s.r},
  goal:goal[s.g]||{hant:s.g,hans:simp(s.g),en:s.g},
  title:titles[i]||{hant:s.t,hans:simp(s.t),en:s.t},
  desc:desc[i]||{hant:s.x,hans:simp(s.x),en:s.x},
  replies:{
   zh:{
    formal:{hant:s.formal,hans:simp(s.formal)},
    dark:{hant:s.dark,hans:simp(s.dark)},
    roast:{hant:s.roast,hans:simp(s.roast)}
   },
   en:{formal:s.english,dark:enDark[i]||s.english,roast:enRoast[i]||s.english},
   yue:{formal:s.cantonese,dark:yueDark[i]||s.cantonese,roast:yueRoast[i]||s.cantonese}
  }
 };
});
})();