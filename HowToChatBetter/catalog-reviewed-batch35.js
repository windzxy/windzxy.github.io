;(function(){
const S=window.CHAT_SCENARIOS||[];window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function review(id,rows){const s=S.find(x=>x.id===id);if(!s)throw Error('Missing scene '+id);s.replies={zh:{},en:{},yue:{}};rows.forEach((r,i)=>{const k='r'+String(i+1).padStart(2,'0');s.replies.zh[k]={hant:r[0],hans:r[1]};s.replies.en[k]=r[2];s.replies.yue[k]=r[3]});window.CHAT_REVIEWED_SCENES[id]=true}

review('on06',[
["下次打來前先傳個訊息，讓我知道你想談甚麼。","下次打来前请先发条消息，让我知道你想谈什么。","Please message before calling so I know what you want to discuss.","下次打嚟之前先傳個訊息，等我知你想傾咩。"],
["我現在不方便接，你可以先把事情打出來。","我现在不方便接，你可以先把事情发过来。","I can't take a call right now. Send me the details first.","我而家唔方便接，你可以先將件事打出嚟。"],
["如果真的緊急，連打兩次並傳『緊急』，我看到會回覆。","如果确实紧急，请连续拨打两次并发送“紧急”，我看到后会回复。","If it is genuinely urgent, call twice and text 'urgent'; I will respond when I see it.","如果真係緊急，連打兩次再傳『緊急』，我見到會覆。"],
["我上班時不接私人電話，午休再聯絡。","我上班时不接私人电话，午休时再联系。","I don't take personal calls while working. Contact me at lunch.","我返工嗰陣唔接私人電話，午飯時間再聯絡。"],
["我正在開會，下午三點後可以通話十分鐘。","我正在开会，下午三点以后可以通话十分钟。","I'm in a meeting. I can speak for ten minutes after three.","我開緊會，下晝三點後可以傾十分鐘。"],
["視訊請先徵得我同意，我不會毫無準備地開鏡頭。","视频通话请先征得我的同意，我不会毫无准备地打开摄像头。","Ask before starting a video call; I won't turn on my camera without warning.","打視像之前請先問我，我唔會毫無準備就開鏡頭。"],
["可以語音，但今天不方便視訊。","可以语音通话，但今天不方便视频。","Audio is fine, but video does not work for me today.","語音可以，但我今日唔方便視像。"],
["不急的話留語音訊息，我有空會完整聽。","如果不着急，请留一条语音消息，我有空会完整听完。","If it can wait, leave a voice note and I'll listen properly when free.","唔急嘅話留段語音，我得閒會完整聽。"],
["我們固定星期日晚上通話，平日就先用文字聯絡。","我们固定在周日晚上通话，平时先通过文字联系。","Let's keep our call for Sunday evening and use messages during the week.","我哋固定星期日晚通話，平日就先用文字聯絡。"],
["先約一個大家都有空的時間，不要靠突然打來碰運氣。","请先约一个双方都有空的时间，不要靠突然来电碰运气。","Let's arrange a time that suits us both instead of gambling on a surprise call.","先約一個大家都得閒嘅時間，唔好靠突然打嚟碰運氣。"],
["我們有時差，你下午打來時我可能已經睡了。","我们之间有时差，你下午来电时我可能已经睡了。","We are in different time zones; your afternoon may be my bedtime.","我哋有時差，你下晝打嚟嗰陣我可能已經瞓咗。"],
["晚上十點後是我的休息時間，除非有急事，請不要來電。","晚上十点以后是我的休息时间，除非有急事，请不要来电。","After ten is my quiet time. Please don't call unless it is urgent.","夜晚十點後係我休息時間，除非有急事，請唔好打嚟。"],
["我會開勿擾模式，未接到不代表我在生氣。","我会开启免打扰模式，没接到并不代表我在生气。","I use Do Not Disturb; a missed call does not mean I'm upset.","我會開勿擾模式，接唔到唔代表我嬲。"],
["孩子剛睡著，我只能回文字，不能接電話。","孩子刚睡着，我只能回复文字，不能接电话。","The child has just fallen asleep, so I can text but not talk.","小朋友啱啱瞓著，我只可以覆文字，唔可以接電話。"],
["我正在開車，不會接電話；停好車後再回你。","我正在开车，不会接电话；停车后再回复你。","I'm driving and won't answer. I'll get back to you once I have parked.","我揸緊車，唔會接電話；泊好車先覆你。"],
["通話對我比較吃力，請優先用文字，重要內容也方便我重看。","通话对我比较费力，请优先使用文字，重要内容也方便我回看。","Calls are difficult for me, so please use text when possible; it also lets me review important details.","通話對我比較吃力，請優先用文字，重要內容我都方便重睇。"],
["一次沒接就先留言，不要在幾分鐘內連打五次。","一次没接请先留言，不要在几分钟内连续拨打五次。","If I miss one call, leave a message instead of calling five times in a few minutes.","一次冇接就先留言，唔好幾分鐘內連打五次。"],
["我沒接通常只是手上有事，不是故意躲你。","我没有接听通常只是因为正在忙，并不是故意躲你。","When I don't answer, it usually means I'm occupied, not avoiding you.","我冇接通常只係手上有事，唔係特登避你。"],
["連續來電會讓我以為出了大事，普通事情請不要這樣催。","连续来电会让我以为发生了严重的事，普通事情请不要这样催促。","Repeated calls make me think something serious has happened; don't use them for ordinary matters.","連續來電會令我以為出咗大事，普通事情請唔好咁催。"],
["接視訊不等於必須開鏡頭，我會自己決定是否出鏡。","接听视频通话不代表必须打开摄像头，我会自行决定是否出镜。","Answering a video call does not oblige me to turn on the camera.","接視像唔等於一定要開鏡頭，我會自己決定出唔出鏡。"],
["工作事項請走公司的通訊工具，不要突然打我的私人號碼。","工作事项请使用公司的沟通工具，不要突然拨打我的私人号码。","For work matters, use the company channel rather than unexpectedly calling my personal number.","工作嘢請用公司通訊工具，唔好突然打我私人號碼。"],
["陌生號碼我不會接，請先傳訊息說明身分。","陌生号码我不会接，请先发消息说明身份。","I don't answer unknown numbers. Text first and identify yourself.","陌生號碼我唔會接，請先傳訊息講明身分。"],
["你只要告訴我『需要今天決定』，我就能判斷何時回電。","你只要告诉我“需要今天决定”，我就能判断何时回电。","Tell me if a decision is needed today, and I can judge when to call back.","你只要話我知『今日要決定』，我就可以判斷幾時回電。"],
["不要用『在乎我就接電話』逼我即時回應。","请不要用“在乎我就接电话”来逼迫我立即回应。","Don't pressure me to answer by saying I would pick up if I cared.","唔好用『在乎我就接電話』逼我即時回應。"],
["我的電話不是按下去就會召喚本人的服務鈴。","我的电话不是一按就能召唤本人的服务铃。","My phone is not a service bell that summons me on demand.","我部電話唔係一撳就召喚到本人嘅服務鐘。"],
["先傳訊息。","请先发消息。","Text first.","先傳訊息。"],
["別再突然打來。","不要再突然打过来。","Stop calling without warning.","唔好再突然打嚟。"],
["再連環打，我會先把來電靜音。","如果再连续拨打，我会先把来电设为静音。","If the repeated calls continue, I will mute them.","再連環打，我會先將來電靜音。"],
["我已經說過聯絡方式；若你繼續無視，我會限制來電。","我已经说明了联系规则；如果你继续无视，我会限制来电。","I've explained how to contact me. If you keep ignoring it, I will restrict calls.","我已經講過聯絡方式；如果你繼續無視，我會限制來電。"],
["我想和你保持聯絡，也需要你尊重我不能隨時接聽。","我希望和你保持联系，也需要你尊重我无法随时接听。","I want to stay connected, and I need you to respect that I cannot always answer.","我想同你保持聯絡，亦需要你尊重我唔可以隨時接聽。"]
]);
})();
