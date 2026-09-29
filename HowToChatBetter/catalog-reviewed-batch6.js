;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function get(id){return S.find(x=>x.id===id)}
function reset(s){if(s)s.replies={zh:{},en:{},yue:{}}}
function add(s,key,hant,hans,en,yue){s.replies.zh[key]={hant,hans};s.replies.en[key]=en;s.replies.yue[key]=yue}
function mark(s){if(s)window.CHAT_REVIEWED_SCENES[s.id]=true}

let s=get("p01");
if(s){
 reset(s);
 [
 ["r01","先不用想全部作業，選一科，做十分鐘就好。","先不用想全部作业，选一科，做十分钟就好。","Don't think about all of it yet. Pick one subject and do ten minutes.","唔使諗晒全部功課，揀一科，做十分鐘先。"],
 ["r02","你想先做數學還是中文？你選，但今天都要開始。","你想先做数学还是语文？你选，但今天都要开始。","Do you want to start with maths or language? You choose, but we start today.","你想先做數學定中文？你揀，但今日都要開始。"],
 ["r03","先把最容易的一題做掉，讓大腦進入狀態。","先把最容易的一题做掉，让大脑进入状态。","Start with the easiest question and get your brain moving.","先做最容易嗰題，俾個腦入狀態。"],
 ["r04","我們設個十分鐘計時，時間到可以休息兩分鐘。","我们设个十分钟计时，时间到可以休息两分钟。","Let's set a ten-minute timer, then take a two-minute break.","我哋 set 十分鐘 timer，時間到可以休息兩分鐘。"],
 ["r05","你不用一次做完，先完成第一頁。","你不用一次做完，先完成第一页。","You don't have to finish everything now. Start with the first page.","唔使一次做晒，先完成第一頁。"],
 ["r06","如果有不會的題先圈起來，不要卡在那裡一直拖。","如果有不会的题先圈起来，不要卡在那里一直拖。","Circle the questions you don't know and keep moving instead of getting stuck.","唔識嘅題先圈住，唔好卡喺度一路拖。"],
 ["r07","作業做完前先不開遊戲，做完你就有自己的時間。","作业做完前先不开游戏，做完你就有自己的时间。","No games before homework. Once it's done, the rest of the time is yours.","功課做完前唔開 game，做完就係你自己時間。"],
 ["r08","你可以說累，但不能因為累就完全不開始。","你可以说累，但不能因为累就完全不开始。","You can be tired, but tired doesn't mean we don't start at all.","你可以話攰，但唔可以因為攰就完全唔開始。"],
 ["r09","我們先看看今天到底有多少，不要靠想像把它變得很可怕。","我们先看看今天到底有多少，不要靠想象把它变得很可怕。","Let's see how much there actually is before your brain turns it into something huge.","先睇下今日究竟有幾多，唔好靠想像將佢變到好恐怖。"],
 ["r10","先把書包裡所有作業拿出來，我們排一下順序。","先把书包里所有作业拿出来，我们排一下顺序。","Take all the homework out first and let's put it in order.","先將書包入面啲功課拎晒出嚟，我哋排下次序。"],
 ["r11","今天你自己定開始時間，但不能晚過七點。","今天你自己定开始时间，但不能晚过七点。","You can choose when to start today, but not later than seven.","今日你自己定幾點開始，但唔可以遲過七點。"],
 ["r12","我不催你每一題，我只提醒一次開始時間。","我不催你每一题，我只提醒一次开始时间。","I'm not going to nag every question. I'll remind you once when it's time to start.","我唔會題題催，只提醒一次開始時間。"],
 ["r13","你如果想我陪你坐十分鐘，我可以陪，但筆要你自己動。","你如果想我陪你坐十分钟，我可以陪，但笔要你自己动。","I can sit with you for ten minutes if that helps, but you do the writing.","你想我陪你坐十分鐘可以，但支筆要你自己郁。"],
 ["r14","我可以幫你理解題目，不會替你寫答案。","我可以帮你理解题目，不会替你写答案。","I can help you understand the question, not do the answer for you.","我可以幫你明題目，唔會代你寫答案。"],
 ["r15","拖到很晚只會讓你更累，早點做完反而比較自由。","拖到很晚只会让你更累，早点做完反而比较自由。","Dragging it late only makes you more tired. Finishing earlier gives you more freedom.","拖到好夜只會更攰，早啲做完反而自由。"],
 ["r16","今天先不追求漂亮字，先把內容完成。","今天先不追求漂亮字，先把内容完成。","Don't worry about perfect handwriting today. Finish the work first.","今日先唔追求靚字，先完成內容。"],
 ["r17","你現在不是不會，是還沒開始。先開始再說。","你现在不是不会，是还没开始。先开始再说。","Right now the problem isn't that you can't do it; you haven't started. Start first.","你而家唔係唔識，係未開始。開始咗先講。"],
 ["r18","我知道你不想做，但不想做和不用做是兩件事。","我知道你不想做，但不想做和不用做是两件事。","I know you don't want to do it. Not wanting to and not having to are different things.","我知你唔想做，但唔想做同唔使做係兩回事。"],
 ["r19","先做五分鐘，你五分鐘後還很難受，我們再調整。","先做五分钟，你五分钟后还很难受，我们再调整。","Do five minutes first. If it still feels awful after that, we'll adjust.","先做五分鐘，五分鐘後仲好辛苦我哋再調。"],
 ["r20","今天你負責開始，我負責不一直在旁邊碎念。","今天你负责开始，我负责不一直在旁边碎念。","Your job is to start; my job is not to keep nagging beside you.","今日你負責開始，我負責唔一路喺旁邊碎念。"],
 ["r21","功課不是怪獸，你不看它，它也不會自己消失。","功课不是怪兽，你不看它，它也不会自己消失。","Homework isn't a monster, and ignoring it won't make it disappear.","功課唔係怪獸，你唔望佢，佢都唔會自己消失。"],
 ["r22","我們先騙一下大腦：只做十分鐘。","我们先骗一下大脑：只做十分钟。","Let's trick your brain: only ten minutes.","我哋先呃下個腦：只做十分鐘。"],
 ["r23","作業最大的問題通常不是難，是第一分鐘最難。","作业最大的问题通常不是难，是第一分钟最难。","The hardest part is often not the homework; it's the first minute.","功課最大問題通常唔係難，係第一分鐘最難。"],
 ["r24","先開機，不用一開機就跑滿速。","先开机，不用一开机就跑满速。","Just boot up first. You don't have to run at full speed immediately.","先開機，唔使一開機就跑滿速。"],
 ["r25","今天我們不演『等等再做』第二十集。","今天我们不演“等等再做”第二十集。","We're not filming episode twenty of 'I'll do it later' today.","今日唔拍『等陣先做』第二十集。"],
 ["r26","鉛筆都準備好了，就差你本人登入。","铅笔都准备好了，就差你本人登录。","The pencil is ready. We're just waiting for you to log in.","支筆都準備好，就差你本人 login。"],
 ["r27","休息可以有，無限延期不可以。","休息可以有，无限延期不可以。","Breaks are allowed. Infinite postponement isn't.","休息可以有，無限延期唔可以。"],
 ["r28","我不會因為你拖就替你做，最後還是你自己完成。","我不会因为你拖就替你做，最后还是你自己完成。","I'm not going to do it for you because you delay. It still has to be yours.","我唔會因為你拖就代你做，最後都係你自己完成。"],
 ["r29","現在開始。你可以不開心，但先把第一題打開。","现在开始。你可以不开心，但先把第一题打开。","Start now. You can be unhappy about it, but open the first question.","而家開始。你可以唔開心，但先打開第一題。"],
 ["r30","今天的選項是先做哪科，不是做不做。","今天的选项是先做哪科，不是做不做。","Today's choice is which subject first, not whether homework happens.","今日選項係先做邊科，唔係做唔做。"],
 ["r31","你再拖十分鐘，功課只會陪你多十分鐘。","你再拖十分钟，功课只会陪你多十分钟。","Delay ten more minutes and the homework simply stays with you ten minutes longer.","你再拖十分鐘，功課只會陪你多十分鐘。"],
 ["r32","我不罵你，但今天功課一定要動起來。","我不骂你，但今天功课一定要动起来。","I'm not going to yell at you, but homework is definitely starting today.","我唔鬧你，但今日功課一定要郁起身。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("e02");
if(s){
 reset(s);
 [
 ["r01","這個消息我先幫你查一下來源，確認後再決定要不要轉。","这个消息我先帮你查一下来源，确认后再决定要不要转。","Let me check the source first, then we can decide whether it's worth forwarding.","呢條消息我先幫你查來源，確認咗再決定轉唔轉。"],
 ["r02","我看到的官方資訊和這張圖說的不一樣，我發給你看看。","我看到的官方信息和这张图说的不一样，我发给你看看。","The official information I found says something different. I'll send it to you.","我見到官方資訊同張圖講嘅唔同，我發俾你睇。"],
 ["r03","這條沒有來源，先不要轉出去比較安全。","这条没有来源，先不要转出去比较安全。","There's no source on this, so it's safer not to forward it yet.","呢條冇來源，先唔好轉出去會安全啲。"],
 ["r04","轉發前先看日期，這個其實是幾年前的舊消息。","转发前先看日期，这个其实是几年前的旧消息。","Check the date before forwarding; this is actually an old message from years ago.","轉之前先睇日期，呢個其實係幾年前舊消息。"],
 ["r05","這個標題很嚇人，但內文和標題不是同一回事。","这个标题很吓人，但正文和标题不是一回事。","The headline is alarming, but the actual content says something different.","個標題好嚇人，但內文同標題唔係同一回事。"],
 ["r06","如果是真的，通常能找到官方或主流來源，我們先找一下。","如果是真的，通常能找到官方或主流来源，我们先找一下。","If it's real, we should usually be able to find an official or established source. Let's check.","如果係真，通常搵到官方或者主流來源，我哋先查下。"],
 ["r07","我不是說你亂傳，我只是想先把真假確認清楚。","我不是说你乱传，我只是想先把真假确认清楚。","I'm not accusing you of spreading nonsense. I just want to verify it first.","我唔係話你亂傳，我只係想先確認真假。"],
 ["r08","這類健康消息最好不要只看群裡截圖，先查專業來源。","这类健康消息最好不要只看群里截图，先查专业来源。","For health claims like this, it's better to check professional sources rather than a group-chat screenshot.","呢類健康消息最好唔好淨係睇 group 截圖，先查專業來源。"],
 ["r09","這條如果錯了，轉出去反而會嚇到更多人。","这条如果错了，转出去反而会吓到更多人。","If this is wrong, forwarding it may only scare more people.","呢條如果錯，轉出去反而嚇多啲人。"],
 ["r10","你先別急著刪，我們一起看看到底哪裡有問題。","你先别急着删，我们一起看看到底哪里有问题。","No need to delete it immediately. Let's look at what's inaccurate together.","唔使急住刪，我哋一齊睇下邊度有問題。"],
 ["r11","這個說法目前沒有可靠證據支持。","这个说法目前没有可靠证据支持。","There doesn't seem to be reliable evidence supporting this claim.","呢個講法目前冇可靠證據支持。"],
 ["r12","這個帳號不是官方來源，不能只因為做成圖片就當真的。","这个账号不是官方来源，不能只因为做成图片就当真的。","That account isn't an official source, and an image format doesn't make the claim true.","呢個 account 唔係官方來源，整成圖都唔代表係真。"],
 ["r13","群裡很多人轉不代表內容是真的。","群里很多人转不代表内容是真的。","Lots of forwards don't make a claim true.","group 好多人轉唔代表內容係真。"],
 ["r14","先查來源，再查日期，再看有沒有其他可靠報導。","先查来源，再查日期，再看有没有其他可靠报道。","Let's check the source, the date, and whether reliable outlets confirm it.","先查來源，再查日期，再睇有冇其他可靠報導。"],
 ["r15","這個數字看起來很精確，但我找不到它是怎麼來的。","这个数字看起来很精确，但我找不到它是怎么来的。","That number looks precise, but I can't find where it came from.","呢個數字睇落好精確，但搵唔到佢點嚟。"],
 ["r16","如果只是『聽朋友說』，先不要當成新聞轉。","如果只是“听朋友说”，先不要当成新闻转。","If the source is only 'a friend said', let's not forward it as news.","如果來源只係『聽朋友講』，先唔好當新聞轉。"],
 ["r17","我知道你是怕大家錯過重要資訊，所以更值得先確認。","我知道你是怕大家错过重要信息，所以更值得先确认。","I know you're sharing because you don't want people to miss something important, which is exactly why it's worth checking first.","我知你係驚大家錯過重要資訊，所以更加值得先確認。"],
 ["r18","這張圖少了最重要的一樣：來源。","这张图少了最重要的一样：来源。","This graphic is missing the most important thing: a source.","呢張圖少咗最重要一樣：來源。"],
 ["r19","有來源我就看，沒有來源我先當未證實。","有来源我就看，没有来源我先当未证实。","If there's a source, I'll look. Without one, I treat it as unverified.","有來源我就睇，冇來源我先當未證實。"],
 ["r20","我們先別替這條消息做免費宣傳。","我们先别替这条消息做免费宣传。","Let's not give this message free publicity before it's verified.","我哋先唔好替呢條消息做免費宣傳。"],
 ["r21","轉發鍵很快，收回錯誤資訊就沒那麼快。","转发键很快，收回错误信息就没那么快。","Forwarding is instant; undoing misinformation isn't.","forward 好快，收返錯誤資訊就冇咁快。"],
 ["r22","這條消息的證據目前主要是它字很大。","这条消息的证据目前主要是它字很大。","So far, the main evidence seems to be that the text is very large.","呢條消息目前主要證據就係啲字好大。"],
 ["r23","做成紅底白字不會自動升級成官方通知。","做成红底白字不会自动升级成官方通知。","Red background and white text don't automatically make something an official notice.","整成紅底白字唔會自動升級做官方通知。"],
 ["r24","『快轉給家人』通常不是證據的一部分。","“快转给家人”通常不是证据的一部分。","'Forward this to your family now' is usually not part of the evidence.","『快轉俾屋企人』通常唔係證據一部分。"],
 ["r25","這條我不轉，因為我查不到可靠來源。","这条我不转，因为我查不到可靠来源。","I'm not forwarding this because I can't verify it with a reliable source.","呢條我唔轉，因為我查唔到可靠來源。"],
 ["r26","如果後面證實是真的，再轉也不遲。","如果后面证实是真的，再转也不迟。","If it's verified later, we can always share it then.","如果後面證實係真，再轉都唔遲。"],
 ["r27","不要因為它讓人害怕，就覺得它比較可能是真的。","不要因为它让人害怕，就觉得它更可能是真的。","A message being scary doesn't make it more likely to be true.","唔好因為佢令人驚，就覺得佢更加可能係真。"],
 ["r28","這條先停在我們這裡，不要再往群裡擴。","这条先停在我们这里，不要再往群里扩。","Let's stop this one here and not spread it further.","呢條先停喺我哋度，唔好再向 group 擴。"],
 ["r29","不是所有『提醒』都值得幫忙擴散。","不是所有“提醒”都值得帮忙扩散。","Not every 'warning' deserves amplification.","唔係所有『提醒』都值得幫手擴散。"],
 ["r30","我寧願少轉一條真的，也不要多傳一條假的。","我宁愿少转一条真的，也不要多传一条假的。","I'd rather miss forwarding one true message than spread one false one.","我寧願少轉一條真，都唔好多傳一條假。"],
 ["r31","這消息先別當真，更別他媽到處轉。","这消息先别当真，更别他妈到处转。","Don't treat this as true yet, and definitely don't fucking spread it everywhere.","呢條消息先唔好當真，更加唔好屌周圍轉。"],
 ["r32","你發給我可以，我幫你查；查完再決定轉不轉。","你发给我可以，我帮你查；查完再决定转不转。","Send it to me if you want. I'll check it, then we can decide whether to share.","你發俾我可以，我幫你查；查完再決定轉唔轉。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("b02");
if(s){
 reset(s);
 [
 ["r01","您好，發票 XX 已於 X 日到期，目前仍未收到款項。麻煩確認付款安排。","您好，发票 XX 已于 X 日到期，目前仍未收到款项。麻烦确认付款安排。","Invoice XX was due on X and remains unpaid. Please confirm the payment arrangement.","你好，invoice XX 已經 X 日到期，而家仲未收到款。麻煩確認付款安排。"],
 ["r02","想跟進一下發票 XX，請告知預計付款日期。","想跟进一下发票 XX，请告知预计付款日期。","Following up on invoice XX. Please let me know the expected payment date.","想跟下 invoice XX，請話我知預計付款日期。"],
 ["r03","如果款項已經安排，麻煩提供付款水單或交易參考。","如果款项已经安排，麻烦提供付款水单或交易参考。","If payment has been arranged, please send the remittance advice or transaction reference.","如果已經安排付款，麻煩俾付款水單或者 transaction reference。"],
 ["r04","我們這邊還沒對到這筆款，麻煩請財務再確認一次。","我们这边还没对到这笔款，麻烦请财务再确认一次。","We still can't match this payment on our side. Please ask finance to check again.","我哋呢邊仲對唔到呢筆款，麻煩叫 finance 再確認一次。"],
 ["r05","這筆款已逾期 X 天，請在今天內給一個明確付款日期。","这笔款已逾期 X 天，请在今天内给一个明确付款日期。","This payment is X days overdue. Please provide a firm payment date today.","呢筆款已經 overdue X 日，請今日內俾一個明確付款日期。"],
 ["r06","如果發票資料有任何問題，請一次列出，我們今天處理。","如果发票资料有任何问题，请一次列出，我们今天处理。","If there's any issue with the invoice details, list everything now and we'll resolve it today.","如果 invoice 資料有問題，請一次列晒，我哋今日處理。"],
 ["r07","目前交付已完成，付款也應按約定節點完成。","目前交付已完成，付款也应按约定节点完成。","Delivery is complete, so payment should now follow the agreed milestone.","交付已完成，付款都應該按約定節點完成。"],
 ["r08","麻煩不要只回覆『已轉財務』，我需要財務的預計付款日。","麻烦不要只回复“已转财务”，我需要财务的预计付款日。","Please don't only tell me it's 'with finance'. I need finance's expected payment date.","唔好淨係覆『已轉 finance』，我要 finance 預計付款日。"],
 ["r09","如果本週無法付款，請明確說明原因和新的日期。","如果本周无法付款，请明确说明原因和新的日期。","If payment can't be made this week, please state the reason and the new date clearly.","如果今個星期付唔到，請講清楚原因同新日期。"],
 ["r10","為了安排現金流，我需要你們給一個可執行的付款時間。","为了安排现金流，我需要你们给一个可执行的付款时间。","I need a realistic payment date so we can manage cash flow.","為咗安排 cash flow，我需要你哋俾一個做得到嘅付款時間。"],
 ["r11","請確認這筆款目前卡在審批、付款，還是對帳。","请确认这笔款目前卡在审批、付款，还是对账。","Please confirm whether this is stuck in approval, payment processing, or reconciliation.","請確認呢筆款而家卡喺審批、付款，定對帳。"],
 ["r12","如果需要我重新發票或補 PO 資料，請今天告訴我。","如果需要我重新开发票或补 PO 资料，请今天告诉我。","If you need a revised invoice or PO information, tell me today.","如果要我重新開 invoice 或補 PO 資料，今日講。"],
 ["r13","按照合約，這筆款的付款期限已經過了。","按照合同，这笔款的付款期限已经过了。","Under the contract, the payment term for this invoice has already passed.","按合約，呢筆款付款期限已經過咗。"],
 ["r14","若款項繼續逾期，我們需要按合約處理後續服務安排。","若款项继续逾期，我们需要按合同处理后续服务安排。","If payment remains overdue, we'll need to handle future services according to the contract.","如果款項繼續 overdue，我哋要按合約處理後續服務安排。"],
 ["r15","在逾期款項結清前，新工作先不繼續往下開。","在逾期款项结清前，新工作先不继续往下开。","We won't start further work until the overdue amount is settled.","逾期款未清之前，新工作先唔繼續開。"],
 ["r16","如果你們有付款困難，可以直接提出，我們談安排，不要一直沒有日期。","如果你们有付款困难，可以直接提出，我们谈安排，不要一直没有日期。","If there's a payment difficulty, say so and we can discuss a plan. We can't keep operating without a date.","如果你哋有付款困難，可以直接講，我哋傾安排，唔好一路冇日期。"],
 ["r17","可以分期談，但不能無限期拖。","可以分期谈，但不能无限期拖。","We can discuss instalments, but not indefinite delay.","可以傾分期，但唔可以無限期拖。"],
 ["r18","請不要把已到期發票當成新的待辦事項。","请不要把已到期发票当成新的待办事项。","Please don't treat an overdue invoice as a brand-new to-do item.","唔好將已到期 invoice 當新待辦。"],
 ["r19","交付有 deadline，付款也有。","交付有 deadline，付款也有。","Deliverables have deadlines. Payments do too.","交付有 deadline，付款都有。"],
 ["r20","我們的工作已經準時交了，現在輪到款項準時到。","我们的工作已经准时交了，现在轮到款项准时到。","Our work arrived on time. Now it's the payment's turn.","我哋工作準時交咗，而家輪到款項準時到。"],
 ["r21","這張 invoice 已經在收件箱住得比我想像久。","这张 invoice 已经在收件箱住得比我想象久。","This invoice has been living in the inbox much longer than expected.","呢張 invoice 已經喺 inbox 住得比我想像耐。"],
 ["r22","款項是不是迷路了？我可以再發一次銀行資料。","款项是不是迷路了？我可以再发一次银行资料。","Has the payment got lost? I can resend the bank details.","筆款係咪迷路？我可以再發一次銀行資料。"],
 ["r23","『盡快』我已經收到了，現在想要一個日期。","“尽快”我已经收到了，现在想要一个日期。","I've received 'as soon as possible'. Now I'd like a date.","『盡快』我收過喇，而家想要個日期。"],
 ["r24","這筆款不是在等靈感，麻煩安排付款。","这笔款不是在等灵感，麻烦安排付款。","This payment doesn't need inspiration. Please schedule it.","呢筆款唔係等靈感，麻煩安排付款。"],
 ["r25","我不想每天催，但你們也別讓我只能靠催。","我不想每天催，但你们也别让我只能靠催。","I don't want to chase every day, but don't leave chasing as my only option.","我唔想日日催，但唔好令我淨係可以靠催。"],
 ["r26","請給日期，不要再給形容詞。","请给日期，不要再给形容词。","Give me a date, not another adjective.","俾日期，唔好再俾形容詞。"],
 ["r27","如果今天還沒有付款時間，我會正式升級到你們財務負責人。","如果今天还没有付款时间，我会正式升级到你们财务负责人。","If there's still no payment date today, I'll formally escalate this to your finance lead.","如果今日仲冇付款時間，我會正式 escalate 去你哋 finance lead。"],
 ["r28","逾期就是逾期，別再拿內部流程當無限延期理由。","逾期就是逾期，别再拿内部流程当无限延期理由。","Overdue is overdue. Internal process can't justify endless delay.","overdue 就係 overdue，唔好再攞內部流程做無限延期理由。"],
 ["r29","錢沒到，後續工作就先停。很簡單。","钱没到，后续工作就先停。很简单。","No payment, no further work. Simple.","錢未到，後續工作就先停。好簡單。"],
 ["r30","你們要我準時交付，也請準時付款。","你们要我准时交付，也请准时付款。","You expect on-time delivery. I expect on-time payment.","你哋要我準時交付，我都要準時收款。"],
 ["r31","這筆錢到底他媽什麼時候付？請給日期。","这笔钱到底他妈什么时候付？请给日期。","When the fuck is this invoice getting paid? Give me a date.","呢筆錢究竟屌幾時付？請俾日期。"],
 ["r32","再沒有付款安排，我不會繼續拿自己的現金流陪你們等。","再没有付款安排，我不会继续拿自己的现金流陪你们等。","Without a payment plan, I'm not using my cash flow to wait indefinitely.","再冇付款安排，我唔會繼續用自己 cash flow 陪你哋等。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}
})();