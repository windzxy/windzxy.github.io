;(function(){
const S=window.CHAT_SCENARIOS=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function add(id,domain,domainLabel,relation,goal,title,rows){
 if(S.some(s=>s.id===id))throw Error('Duplicate new scene '+id);
 const tri=a=>({hant:a[0],hans:a[1],en:a[2]});
 const s={id,domain,domainLabel:tri(domainLabel),relation:tri(relation),goal:tri(goal),title:tri(title),replies:{zh:{},en:{},yue:{}}};
 rows.forEach((r,i)=>{const k='r'+String(i+1).padStart(2,'0');s.replies.zh[k]={hant:r[0],hans:r[1]};s.replies.en[k]=r[2];s.replies.yue[k]=r[3]});
 S.push(s);window.CHAT_REVIEWED_SCENES[id]=true;
}
add('new13','workplace',['職場','职场','Work'],['同事','同事','Colleague'],['釐清帳號操作責任','厘清账号操作责任','Clarify account activity'],['同事未經同意用你的帳號修改系統，出錯後紀錄卻顯示是你操作','同事没经过同意就用你的账号改系统，出错后记录却显示是你操作','A coworker uses your account to change a system without asking, and the error is recorded under your name'],[
["先別再用我的帳號操作了。剛才改了哪些項目？","先别再用我的账号操作了。刚才改了哪些项目？","Please stop using my account. Which items did you change?","先唔好再用我個帳號操作。頭先改咗邊幾項？"],
["我看到這筆修改記在我名下，但不是我做的。請一起把紀錄釐清。","我看到这笔修改记在我名下，但不是我做的。请一起把记录弄清楚。","That change is logged under my name, but I didn't make it. Let's correct the record together.","我見到呢筆修改記咗喺我名下，但唔係我做。請一齊對清楚紀錄。"],
["這次先把錯誤修回來，之後請用自己的帳號登入。","这次先把错误修好，以后请用自己的账号登录。","Let's fix the error first. Please use your own account from now on.","今次先改返個錯，之後請用自己帳號登入。"],
["你借用我的登入狀態前，至少要先問我一聲。","你借用我的登录状态前，至少要先问我一声。","You need to ask before using my signed-in session.","你借用我登入緊個帳號之前，至少要問我聲。"],
["系統現在把操作算到我頭上，這件事麻煩你向主管說明。","系统现在把操作算到我头上，这件事麻烦你向主管说明。","The system attributes this to me. Please explain to our manager what happened.","系統依家當係我做，麻煩你向上司講清楚件事。"],
["你還記得修改的時間和欄位嗎？我需要把正確操作人補進紀錄。","你还记得修改的时间和字段吗？我需要把实际操作人补进记录。","Do you remember the time and fields you changed? I need to document the actual operator.","你記唔記得修改時間同欄位？我要將真正操作人補返落紀錄。"],
["我的帳號不是共用通行證。需要權限，我們一起申請。","我的账号不是公共通行证。需要权限的话，我们一起申请。","My login isn't a shared pass. If you need access, let's request it properly.","我個帳號唔係共用通行證。要權限，我哋一齊申請。"],
["先確認一下：你只改了這一筆，還是其他地方也動過？","先确认一下：你只改了这一笔，还是也动过别的地方？","Was this the only change, or did you edit anything else while signed in as me?","先確認下：你只改咗呢筆，定仲有其他地方郁過？"],
["我會先把這次操作標記為待核實，請你把實際步驟發給我。","我会先把这次操作标为待核实，请你把实际步骤发给我。","I'll mark this change for review. Please send me the steps you took.","我會先將呢次操作標成待核實，請你發實際步驟俾我。"],
["我知道你可能只是想快點處理，但用我的帳號會讓責任追不到人。","我知道你可能只是想快点处理，但用我的账号会让责任追不到人。","I know you may have been trying to move quickly, but using my login hides who did what.","我知你可能想快啲處理，但用我帳號會追唔返邊個做咗咩。"],
["現在先登出我的帳號，好嗎？其他事我們再談。","现在先退出我的账号，好吗？其他事情我们再谈。","Please sign out of my account now. We can discuss the rest after.","依家先登出我個帳號，好嗎？其他嘢再傾。"],
["這筆操作若要回滾，我需要你確認原本的數值。","如果要撤销这笔操作，我需要你确认原来的数值。","To roll this change back, I need you to confirm the previous value.","如果要撤銷呢筆操作，我要你確認原本個數值。"],
["別讓我靠猜來修你做的修改。請把變更清單列出來。","别让我靠猜去修你做的修改。请把改动清单列出来。","Don't leave me guessing at your edits. Please list every change you made.","唔好要我靠估去修你改過嘅嘢。請列晒改動清單。"],
["帳號是我的，操作不是我的；這兩件事請不要混為一談。","账号是我的，操作不是我做的；这两件事请别混为一谈。","It's my account, but it wasn't my action. Those aren't the same thing.","帳號係我嘅，操作唔係我做；兩件事唔好撈埋一齊。"],
["如果我不在座位，請不要直接拿我的電腦做系統修改。","如果我不在座位，请不要直接用我的电脑修改系统。","When I'm away from my desk, please don't make system changes from my computer.","如果我唔喺位，唔好直接用我部電腦改系統。"],
["這次改動影響到後面的報表。我們先找出受影響的資料範圍。","这次改动影响到后面的报表。我们先找出受影响的数据范围。","This change affects the report downstream. Let's identify which records were touched.","今次改動影響後面份報表。我哋先搵出受影響資料範圍。"],
["請在今天內發一封簡短說明，寫明操作是你做的和已採取的修正。","请今天发一封简短说明，写清操作是你做的和已经采取的修正。","Please send a short note today stating that you made the change and how it was corrected.","請今日發封簡短說明，寫清楚操作係你做，同埋點樣修正咗。"],
["下次要我幫忙登入可以直接說，但不能自己拿我的帳號用。","下次需要我帮忙登录可以直接说，但不能自己用我的账号。","Next time, ask me for help accessing the system instead of using my login yourself.","下次要我幫手登入可以直接講，但唔好自己用我個帳號。"],
["我剛才差點以為自己夢遊改了系統。原來是你用我的帳號。","我刚才差点以为自己梦游改了系统。原来是你用了我的账号。","For a moment I thought I'd edited the system in my sleep. Turns out it was my login, not me.","我頭先差啲以為自己夢遊改咗系統。原來係你用我帳號。"],
["先把事實講清楚，誰操作、改了甚麼、何時發現錯誤。","先把事实说清楚：谁操作、改了什么、什么时候发现错误。","Let's establish the facts: who made the change, what changed, and when the error was found.","先講清楚事實：邊個操作、改咗乜、幾時發現錯。"],
["我不接受把這次錯誤寫成我的操作失誤。請更正描述。","我不能接受把这次错误写成我的操作失误。请更正描述。","I can't accept this being described as my operating error. Please correct that description.","我唔接受將今次寫成我操作失誤。請更正個描述。"],
["權限問題可以請 IT 處理，不需要借我的帳號繞過去。","权限问题可以请 IT 处理，不用借我的账号绕过去。","IT can handle an access issue. Borrowing my account isn't a workaround.","權限問題可以搵 IT 處理，唔使借我帳號繞過去。"],
["我先改密碼，麻煩你再檢查是否有未完成的操作。","我先改密码，麻烦你再检查有没有没完成的操作。","I'm changing my password now. Please check whether you left any actions unfinished.","我會先改密碼，麻煩你再睇下有冇未完成嘅操作。"],
["現在最重要的是恢復正確資料；責任紀錄也要同步更正。","现在最重要的是恢复正确数据；责任记录也要一起改正。","Restoring the data comes first, and the ownership record needs correcting too.","依家最緊要係還原正確資料；責任紀錄都要同步更正。"],
["這件事我們私下先對清楚，再一起向相關人員交代。","这件事我们先私下核对清楚，再一起向相关人员说明。","Let's compare notes privately, then explain it together to the people affected.","呢件事我哋私下先對清楚，再一齊同相關人員交代。"],
["你用我的帳號，留下的卻是我的名字。這個風險我不能再承擔。","你用了我的账号，留下的却是我的名字。这个风险我不能再承担。","You used my login, but my name is on the log. I can't take that risk again.","你用我帳號，留低嘅係我個名。呢個風險我唔可以再孭。"],
["如果有急事需要改系統，請在群裡找有權限的人，不要代用我的身分。","如果急着改系统，请在群里找有权限的人，别代用我的身份。","If there's an urgent change, ask an authorized person in the team chat. Don't act as me.","如果急住改系統，喺群組搵有權限嘅人，唔好代用我身分。"],
["這次我會協助查錯，但你需要親自承認是你按下的修改。","这次我会帮忙查错，但你需要亲自说明修改是你提交的。","I'll help investigate the error, but you need to state that you made the edit.","今次我會幫手查錯，但你要親自講清楚係你提交個修改。"],
["先停一停。這不是借支筆，是借我的操作身分。","先停一下。这不是借支笔，是借我的操作身份。","Hold on. This isn't borrowing a pen; it's borrowing my identity in the system.","停一停。呢個唔係借支筆，係借我個操作身分。"],
["現在登出，列出改動，然後一起更正紀錄。","现在退出登录，列出改动，然后一起更正记录。","Log out, list the changes, then let's correct the record together.","依家登出，列晒改動，跟住一齊更正紀錄。"]
]);

add('new14','online',['網絡','网络','Online'],['網購客服','网购客服','Online support'],['拒絕提供驗證碼','拒绝提供验证码','Protect a verification code'],['網購客服聲稱要你提供手機收到的一次性驗證碼，才可以辦理退款','网购客服声称要你提供手机收到的一次性验证码，才能办理退款','Online support says you must give them a one-time code from your phone to process a refund'],[
["驗證碼我不會提供。退款請按平台正常流程辦理。","验证码我不会提供。退款请按平台正常流程办理。","I won't share a one-time code. Please process the refund through the platform.","驗證碼我唔會俾。退款請跟平台正常流程辦。"],
["這組碼只給我本人輸入，不會讀給客服。","这组码只由我本人输入，不会念给客服。","That code is for me to enter, not for me to read to support.","呢組碼係俾我自己輸入，唔會讀俾客服。"],
["請提供平台內的退款申請入口，我會自己操作。","请给我平台内的退款申请入口，我会自己操作。","Send me the refund option in the app and I'll submit it myself.","請俾平台入面嘅退款入口我，我自己做。"],
["在我確認這是官方流程前，不會提供任何驗證碼。","在我确认这是官方流程前，不会提供任何验证码。","I won't give out a code before verifying this through the official channel.","未確認係官方流程之前，我唔會提供任何驗證碼。"],
["麻煩直接用訂單號查退款，不需要我的手機驗證碼吧？","麻烦直接用订单号查退款，不需要我的手机验证码吧？","Can you check the refund by order number instead of asking for my phone code?","麻煩直接用訂單號查退款，唔使我手機驗證碼掛？"],
["請把「退款必須提供驗證碼」的規定發在平台客服對話裡。","请把“退款必须提供验证码”的规定发在平台客服对话里。","Please send the policy requiring that code through the platform's support chat.","請將『退款要提供驗證碼』嘅規定發喺平台客服對話度。"],
["我會先結束這段對話，再從官方 App 重新聯絡客服核實。","我会先结束这段对话，再从官方 App 重新联系客户服务核实。","I'll end this chat and contact support again through the official app.","我會先結束呢段對話，再由官方 App 重新搵客服核實。"],
["你若有退款進度，請用訂單內訊息通知我；驗證碼不會傳送。","如果有退款进度，请通过订单消息通知我；验证码我不会发。","Please send refund updates through the order page. I won't send the code.","如果有退款進度，請用訂單訊息通知我；驗證碼我唔會發。"],
["手機收到的通知寫明不要告訴任何人，我會照做。","手机收到的通知写着不要告诉任何人，我会照做。","The phone message says not to share the code, and I intend to follow that instruction.","手機訊息寫明唔好話任何人知，我會照做。"],
["退款如果要我登入確認，我可以自己在官方頁面完成。","如果退款需要我登录确认，我可以自己在官方页面完成。","If a sign-in is needed, I'll complete it myself on the official site.","如果退款要我登入確認，我可以自己喺官方頁面做。"],
["我只想退這筆訂單，沒有授權任何其他帳號操作。","我只是要退这笔订单，没有授权任何其他账号操作。","I'm requesting a refund for this order only. I haven't authorized any other account action.","我只係想退呢張單，冇授權任何其他帳號操作。"],
["這個要求和退款本身有甚麼關係？請先解釋，不要催我報碼。","这个要求和退款有什么关系？请先解释，别催我报验证码。","How is that code related to the refund? Please explain instead of pressuring me to read it out.","呢個要求同退款有咩關係？請先解釋，唔好催我報碼。"],
["不要再索取我的一次性驗證碼。請轉接主管處理退款。","请不要再索取我的一次性验证码。请转接主管处理退款。","Stop asking for the one-time code. Please escalate my refund case to a supervisor.","唔好再問我要一次性驗證碼。請轉主管處理退款。"],
["我可以提供訂單截圖，個人登入驗證碼不在其中。","我可以提供订单截图，但不会提供登录验证码。","I can provide the order receipt, but not a login code.","我可以提供訂單截圖，但唔會俾登入驗證碼。"],
["請給我退款案件編號，我會在平台內自行查詢。","请给我退款工单编号，我会在平台里自己查询。","Give me the refund case number and I'll track it within the platform.","請俾個退款案件編號我，我會喺平台自己查。"],
["如果沒有其他辦法辦退款，請明確寫下拒絕原因，我會向平台申訴。","如果没有别的退款方式，请写明拒绝原因，我会向平台申诉。","If you won't process it without the code, put that refusal in writing so I can raise it with the platform.","如果冇其他退款方法，請寫清楚拒絕原因，我會向平台申訴。"],
["這段對話我會保留紀錄。驗證碼的要求也請你們正式回覆。","这段对话我会留存记录。索要验证码的要求也请你们正式回复。","I'm keeping a record of this chat. Please put the code request in an official response.","呢段對話我會留紀錄。要求驗證碼都請你哋正式回覆。"],
["退款還沒到，倒先有人想拿我的驗證碼？這一步我不做。","退款还没到，倒先有人想拿我的验证码？这一步我不做。","I came for a refund, not to hand over my login code. That step is a no.","退款未到，反而有人想攞我驗證碼？呢一步我唔做。"],
["你可以退我錢，但不能拿走我登入帳號的鑰匙。","你可以给我退款，但不能拿走我登录账号的钥匙。","You can refund the order without taking the key to my account.","你可以退錢俾我，但唔可以攞走我登入帳號條鎖匙。"],
["驗證碼一旦交出去，風險由我承擔。這不是可接受的退款條件。","验证码一旦给出去，风险由我承担。这不是能接受的退款条件。","I'd bear the risk of sharing that code. I won't accept it as a condition of a refund.","驗證碼一俾出去，風險係我孭。呢個唔係我接受到嘅退款條件。"],
["我們先別談驗證碼。請確認退款金額和預計到帳日期。","先别谈验证码。请确认退款金额和预计到账日期。","Let's leave the code aside. Confirm the refund amount and expected date instead.","唔好再講驗證碼。請確認退款金額同預計到帳日。"],
["我現在會去訂單頁查看官方退款狀態，這裡暫不繼續。","我现在去订单页面查看官方退款状态，这里先不继续聊了。","I'm checking the refund status on the order page now. I'll pause this conversation.","我依家去訂單頁睇官方退款狀態，呢度暫時唔繼續。"],
["這是登入驗證碼，不是售後資料；請不要混在一起要求。","这是登录验证码，不是售后资料；请不要混在一起索要。","A sign-in code isn't a customer service detail. Please don't treat it as one.","呢個係登入驗證碼，唔係售後資料；請唔好撈埋一齊問。"],
["要我報驗證碼才退款？那先請主管直接在平台訊息裡確認。","要我报验证码才能退款？那请主管先在平台消息里确认。","You say the code is required? Have a supervisor confirm that in the platform chat first.","要我報驗證碼先退款？咁先請主管喺平台訊息度確認。"],
["我不會透過電話、私訊或外部連結提交這組碼。","我不会通过电话、私信或外部链接提交这组码。","I won't submit this code by phone, private message or outside link.","我唔會透過電話、私訊或者外部連結交呢組碼。"],
["如果你只是要確認本人，我可以用平台提供的正式驗證方式。","如果只是要确认是我本人，我可以使用平台提供的正式验证方式。","If identity verification is needed, I'll use the platform's official method.","如果只係要確認係我，我可以用平台提供嘅正式驗證方法。"],
["先等等，這個碼的用途是甚麼？我不會在沒看清通知前唸出來。","等一下，这个码是用来做什么的？我不会没看清通知就念出来。","Wait—what is this code for? I won't read it out before checking the message.","等陣，呢個碼係做咩用？我未睇清楚通知唔會讀出嚟。"],
["這筆退款我會直接在平台申請，不用你替我輸入任何碼。","这笔退款我会直接在平台申请，不用你替我输入任何码。","I'll request this refund in the app. You don't need to enter a code for me.","呢筆退款我會直接喺平台申請，唔使你代我輸入任何碼。"],
["驗證碼：不提供。退款方式：請用平台內流程。","验证码：不提供。退款方式：请走平台内流程。","Code: not shared. Refund: through the platform, please.","驗證碼：唔提供。退款：請跟平台流程。"],
["你繼續要求報碼，我就停止對話並向平台舉報這次聯絡。","如果你继续要验证码，我就结束对话并向平台举报这次联系。","If you keep asking for the code, I'll end the chat and report this interaction to the platform.","你繼續問我攞驗證碼，我就結束對話並向平台舉報今次聯絡。"]
]);
})();
