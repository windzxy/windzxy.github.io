;(function(){
const S=window.CHAT_SCENARIOS=window.CHAT_SCENARIOS||[];window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function add(meta,rows){if(S.some(x=>x.id===meta.id))throw Error('Duplicate scene '+meta.id);const replies={zh:{},en:{},yue:{}};rows.forEach((r,i)=>{const k='r'+String(i+1).padStart(2,'0');replies.zh[k]={hant:r[0],hans:r[1]};replies.en[k]=r[2];replies.yue[k]=r[3]});S.push({...meta,replies});window.CHAT_REVIEWED_SCENES[meta.id]=true}

add({id:'new83',domain:'relationship',domainLabel:{hant:'感情',hans:'感情',en:'Relationship'},relation:{hant:'伴侶或配偶',hans:'伴侣或配偶',en:'Partner or spouse'},goal:{hant:'釐清支出、修復信任並建立共同決策規則',hans:'厘清支出、修复信任并建立共同决策规则',en:'Clarify the purchase, repair trust, and set shared spending rules'},title:{hant:'伴侶未先商量，便用共同帳戶或共同儲蓄作一筆大額消費',hans:'伴侣没有提前商量，就使用共同账户或共同储蓄进行一笔大额消费',en:'Your partner makes a large purchase using shared funds without discussing it first'}},[
["我剛看到這筆支出，請先告訴我金額、用途和付款日期。","我刚看到这笔支出，请先告诉我金额、用途以及付款日期。","I've just seen this transaction. Tell me the amount, purpose, and payment date.","我啱啱見到呢筆支出，請先話我知金額、用途同付款日期。"],
["這是共同資金，不是任何一方可以單獨決定的私人預算。","这是共同资金，不是任何一方可以单独决定的私人预算。","This is shared money, not either person's private budget to control alone.","呢筆係共同資金，唔係任何一方可以自己決定嘅私人預算。"],
["這筆消費會影響房租和下月帳單，我們要今天重新算一次現金流。","这笔消费会影响房租以及下个月的账单，我们今天需要重新计算现金流。","This purchase affects rent and next month's bills; we need to redo the cash-flow plan today.","呢筆消費會影響租金同下個月啲單，我哋今日要重新計一次現金流。"],
["先看看能否取消訂單或退貨，再談後續怎樣處理。","先确认能否取消订单或退货，再讨论后续如何处理。","First check whether the order can be cancelled or returned; then we can decide what comes next.","先睇下可唔可以取消訂單或者退貨，再傾後續點處理。"],
["請現在確認退貨期限，別讓可補救的事情拖到不能退。","请现在确认退货期限，不要把原本可以补救的事拖到无法退货。","Check the return deadline now so a fixable problem doesn't become irreversible.","請而家確認退貨期限，唔好將可以補救嘅事拖到退唔到。"],
["我很不高興，但我想先聽你當時為甚麼覺得可以直接付款。","我很不高兴，但我想先听你说明当时为什么觉得可以直接付款。","I'm upset, but I want to understand why you felt able to pay without checking first.","我好唔開心，但我想先聽你當時點解覺得可以直接付款。"],
["就算這是送給我的驚喜，也不能用共同儲蓄繞過共同決定。","即使这是送给我的惊喜，也不能用共同储蓄绕过共同决定。","Even if it was a surprise for me, shared savings cannot be used to bypass a shared decision.","就算呢份係送俾我嘅驚喜，都唔可以用共同儲蓄繞過共同決定。"],
["以後單筆超過兩千元，付款前必須先得到雙方同意。","以后单笔支出超过两千元，付款前必须先取得双方同意。","From now on, any single purchase over two thousand needs both people's agreement first.","以後單筆超過兩千蚊，付款之前一定要雙方同意。"],
["共同帳戶的大額支出要『兩個人都同意』，一個人沉默不算同意。","共同账户的大额支出需要“两个人都同意”，一方沉默不代表同意。","Large purchases from the joint account require two yeses; silence is not consent.","共同戶口大額支出要『兩個人都同意』，一個人冇出聲唔算同意。"],
["我們每月一起看一次共同預算，別等到扣款通知才發現。","我们每月一起查看一次共同预算，不要等到扣款通知出现才发现问题。","Let's review the shared budget monthly instead of discovering purchases through debit alerts.","我哋每個月一齊睇一次共同預算，唔好等到扣款通知先發現。"],
["各自可以保留一筆不用交代的零用預算，但共同儲蓄不在其中。","我们可以各自保留一笔无需说明用途的零用预算，但共同储蓄不在其中。","We can each have a no-questions-asked allowance, but shared savings are not part of it.","大家可以各自留一筆唔使交代嘅零用預算，但共同儲蓄唔包括喺入面。"],
["我會把共同帳戶的交易通知打開，這是透明，不是監控。","我会开启共同账户的交易提醒，这是为了保持透明，并不是监控。","I'll enable transaction alerts on the joint account for transparency, not surveillance.","我會開共同戶口嘅交易通知，呢個係透明，唔係監控。"],
["如果你決定保留這件物品，請提出怎樣從個人預算補回共同帳戶。","如果你决定保留这件物品，请提出如何使用个人预算补回共同账户。","If you choose to keep it, propose how your personal budget will reimburse the joint account.","如果你決定留低件嘢，請提出點樣由個人預算補返共同戶口。"],
["被動用的應急儲備要先補回，其他非必要開支暫緩。","被动用的应急储备需要优先补回，其他非必要支出暂缓。","The emergency fund must be restored before other non-essential spending resumes.","郁過嘅應急儲備要先補返，其他非必要開支暫緩。"],
["若這筆是分期付款，請把總成本、利息和每期金額全部列出。","如果这笔消费采用分期付款，请把总成本、利息以及每期金额全部列出。","If this was financed, list the full cost, interest, and every instalment.","如果呢筆係分期，請將總成本、利息同每期金額全部列出。"],
["請把相關信用卡或貸款也一併說清楚，我不想之後再發現第二筆債務。","请把相关信用卡或贷款情况一并说明，我不想之后再发现第二笔债务。","Disclose any related card balance or loan; I don't want a second debt appearing later.","請將相關信用卡或者貸款都一併講清楚，我唔想之後再發現第二筆債。"],
["帳單不能刪掉或藏起來，現在請一起把完整紀錄核對清楚。","账单不能删除或隐瞒，现在请和我一起核对完整记录。","Statements must not be deleted or hidden. Let's review the complete record now.","帳單唔可以刪或者收埋，而家請一齊核對完整紀錄。"],
["我們把補款日期、金額和之後的審批規則寫下來，避免只靠口頭保證。","我们把补款日期、金额以及今后的审批规则写下来，避免只依靠口头保证。","Let's write down the repayment date, amount, and future approval rule instead of relying on a promise.","我哋將補款日期、金額同之後審批規則寫低，唔好淨係靠口頭保證。"],
["真正緊急的家庭支出可以先處理，但安全後要第一時間告知並提供明細。","真正紧急的家庭支出可以先处理，但情况稳定后必须立即告知并提供明细。","A genuine household emergency may require immediate action, but it must be disclosed with details as soon as things are safe.","真正緊急嘅家庭支出可以先處理，但安全之後要第一時間講同提供明細。"],
["醫療或安全事故是例外，想買很久的東西不是突發狀況。","医疗或安全事故可以例外，但想买了很久的东西不属于突发状况。","Medical or safety emergencies are exceptions; a long-wanted purchase is not an emergency.","醫療或者安全事故可以例外，但想買咗好耐嘅嘢唔係突發狀況。"],
["如果我們自己談不攏，可以找中立的財務顧問一起整理方案。","如果我们无法自行达成一致，可以请中立的财务顾问协助整理方案。","If we cannot agree ourselves, we can ask a neutral financial counsellor to help structure a plan.","如果我哋自己傾唔掂，可以搵中立財務顧問一齊整理方案。"],
["我在意的不只是金額，而是你替我們兩個人作了決定。","我介意的不只是金额，而是你替我们两个人作出了决定。","The issue isn't only the amount; you made a decision for both of us.","我介意嘅唔單止係金額，而係你代我哋兩個人作咗決定。"],
["在事情釐清前，這張共同卡先不再用於非必要消費，我們一起保管和檢視。","在事情厘清之前，这张共同卡暂不用于非必要消费，我们共同保管并核对。","Until this is resolved, the joint card will not be used for non-essential purchases, and we will review it together.","喺件事釐清之前，呢張共同卡先唔用嚟做非必要消費，我哋一齊保管同檢視。"],
["我不會用報復性消費扯平；我們要解決規則，不是再製造一筆損失。","我不会通过报复性消费来扯平；我们需要解决规则问题，而不是再制造一笔损失。","I won't retaliate with another purchase. We need to fix the rule, not create another loss.","我唔會用報復性消費扯平；我哋要解決規則，唔係再整多筆損失。"],
["這是我們兩人的財務問題，先不要拉父母或朋友來替任何一方施壓。","这是我们两个人的财务问题，请先不要让父母或朋友替任何一方施压。","This is our financial issue; don't recruit parents or friends to pressure either side.","呢個係我哋兩個人嘅財務問題，先唔好拉父母或者朋友嚟幫任何一方施壓。"],
["共同帳戶不是單人購物車的自動付款選項。","共同账户不是个人购物车的自动付款选项。","The joint account is not the default checkout option for one person's shopping cart.","共同戶口唔係一個人購物車嘅自動付款選項。"],
["先退掉。","先办理退货。","Return it first.","先退咗佢。"],
["共同的錢，不是你的私人錢包。","共同的钱不是你的私人钱包。","Shared money is not your personal wallet.","共同嘅錢唔係你私人銀包。"],
["如果再出現未經同意的大額支出，我會把收入和儲蓄改為分開管理。","如果再次出现未经同意的大额支出，我会改为分别管理收入以及储蓄。","If another large purchase is made without consent, I will separate how our income and savings are managed.","如果再出現未經同意嘅大額支出，我會將收入同儲蓄改為分開管理。"],
["我願意重建信任，但需要退款或補款落實，並按新規則走一段時間。","我愿意重建信任，但需要先落实退款或补款，并按照新规则执行一段时间。","I'm willing to rebuild trust, but the refund or repayment must happen and the new rules must be followed consistently.","我願意重建信任，但要先落實退款或者補款，同埋按新規則行一段時間。"]
]);
})();
