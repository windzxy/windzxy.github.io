;(function(){
const scene=(window.CHAT_SCENARIOS||[]).find(s=>s.id==='so03');
if(!scene)throw Error('Missing scene so03');
const rows=[
// Traditional, Simplified, English, Cantonese
["不了，今晚我喝茶。你們盡興。","不了，今晚我喝茶。你们尽兴。","No alcohol for me tonight. I'll have tea; enjoy yours.","唔喇，今晚我飲茶。你哋飲得開心啲。"],
["謝謝你倒酒，但這杯請留給想喝的人。","谢谢你倒酒，但这杯请留给想喝的人。","Thanks for offering, but save that drink for someone who wants it.","多謝你斟酒，不過呢杯留俾想飲嘅人啦。"],
["我用這杯水跟大家乾杯，一樣有誠意。","我用这杯水跟大家干杯，心意一样到。","I'll toast everyone with water. The good wishes are the same.","我用呢杯水同大家乾杯，一樣有心。"],
["我已經說不喝了，這個決定不用再投票。","我已经说了不喝，这个决定不用再投票。","I've said no. My drink choice isn't up for a vote.","我已經講咗唔飲，呢個決定唔使再投票。"],
["你喝你的，我喝我的，這樣大家都開心。","你喝你的，我喝我的，大家都开心。","You enjoy your drink, I'll enjoy mine. Everybody wins.","你飲你嘅，我飲我嘅，大家都開心。"],
["別再幫我把杯子倒滿，我沒有要喝酒。","别再替我把杯子倒满了，我没打算喝酒。","Please stop refilling my glass. I don't want alcohol.","唔好再幫我斟滿隻杯，我冇打算飲酒。"],
["不用替我找理由，我只是今晚不想喝。","不用替我找理由，我只是今晚不想喝。","You don't need to find a reason for me. I simply don't want to drink tonight.","唔使幫我搵理由，我只係今晚唔想飲。"],
["你們的遊戲繼續，我這輪不參加拼酒。","你们继续玩，我这轮不参加拼酒。","Keep the game going; I'm sitting out this drinking round.","你哋繼續玩，我呢輪唔參加鬥酒。"],
["我願意留下來聊天，但不會為了合群喝酒。","我愿意留下来聊天，但不会为了合群喝酒。","I'm happy to stay and talk, but I won't drink to fit in.","我願意留低傾偈，但唔會為咗合群而飲酒。"],
["這杯我不接，你別再往我手裡塞啦。","这杯我不接，你别再往我手里塞啦。","I'm not taking that glass. Please stop putting it in my hand.","呢杯我唔接，你唔好再塞落我手度啦。"],
["我知道你是想熱鬧，但我說不喝時，麻煩尊重一下。","我知道你是想活跃气氛，但我说不喝时，麻烦尊重一下。","I know you're keeping things lively, but please respect me when I say no.","我知你想熱鬧，不過我話唔飲，麻煩尊重下。"],
["敬你的心意我收到了，酒就不用代我決定。","你的心意我收到了，酒就不用替我决定了。","I appreciate the toast. You don't need to choose my drink for me.","你份心意我收到，飲唔飲酒唔使代我決定。"],
["別拿交情換酒量；我們的交情不用靠這杯證明。","别拿交情换酒量；我们的关系不用靠这杯证明。","Our friendship doesn't need a drink as proof.","唔好用交情換酒量；我哋嘅交情唔使靠呢杯證明。"],
["酒我不喝，這道菜我很願意一起搶。","酒我不喝，这道菜我倒很愿意一起抢。","I'll pass on the drink, but I'll gladly fight you for the last dumpling.","酒我唔飲，呢碟餸我就好願意同你一齊搶。"],
["我們聊別的吧。一直問我喝不喝，菜都快涼了。","咱们聊点别的吧。老问我喝不喝，菜都快凉了。","Let's talk about something else; the food's getting cold while we debate my glass.","我哋傾第二樣啦。成日問我飲唔飲，啲餸都就快凍。"],
["一口也不用幫我倒，謝謝。我今晚不碰酒。","一口也不用给我倒，谢谢。我今晚不碰酒。","Not even a splash, thanks. I'm not drinking tonight.","一啖都唔使幫我斟，多謝。我今晚唔飲酒。"],
["我知道你說只喝一杯，但我的答案還是不喝。","我知道你说只喝一杯，但我的回答还是不喝。","I heard you say it's just one glass. My answer is still no.","我知你話淨係一杯，但我個答案都係唔飲。"],
["如果你想碰杯，我拿無酒精飲品陪你。","如果你想碰杯，我拿无酒精饮料陪你。","If you want to clink glasses, I'll join you with something alcohol-free.","如果你想碰杯，我攞無酒精飲品陪你。"],
["我不是在等更好的勸酒詞，是真的不喝。","我不是在等更好的劝酒词，是真的不喝。","I'm not waiting for a better pitch. I really don't want a drink.","我唔係等你諗個更好嘅勸酒詞，我真係唔飲。"],
["先不要替我點酒；要喝甚麼，我自己會跟服務員說。","先别替我点酒；喝什么我会自己跟服务员说。","Please don't order alcohol for me. I'll tell the server what I want.","唔好代我叫酒；飲咩我自己會同服務員講。"],
["讓我坐在這裡好好吃飯就行，別把拒酒弄成節目。","让我在这儿好好吃饭就行，别把不喝酒弄成节目。","Just let me enjoy dinner. My refusal doesn't need to become the entertainment.","俾我喺度好好食飯就得，唔好將我唔飲酒變成節目。"],
["這杯不是我點的，麻煩拿走，我自己點飲料。","这杯不是我点的，麻烦拿走，我自己点饮料。","I didn't order this glass. Please take it back; I'll choose my own drink.","呢杯唔係我叫嘅，麻煩攞走，我自己叫飲品。"],
["我的酒量今天休假，嘴巴還在，咱們照樣聊天。","我的酒量今天放假，嘴巴还在，咱们照样聊天。","My drinking capacity is off duty, but I'm still here to chat.","我個酒量今日放假，把口仲喺度，照樣傾偈。"],
["你再勸也不會把我的「不喝」變成「好吧」。","你再劝也不会把我的“不喝”变成“好吧”。","Another round of pressure won't turn my no into a yes.","你再勸都唔會將我嘅『唔飲』變成『好啦』。"],
["這個話題我已經回過了；我們換個話題。","这个问题我已经回答过了；我们换个话题。","I've answered this already. Let's move on.","呢個問題我已經答咗；我哋轉個話題。"],
["你先別把我架在全桌人面前勸，我私下也會說不。","别当着全桌人劝我了，私下我也会说不。","Please don't put me on the spot in front of everyone. My answer would be no in private too.","唔好當住全枱人勸我，私下我都會話唔飲。"],
["我現在想喝點清爽的，誰知道哪款無酒精的好喝？","我现在想喝点清爽的，谁知道哪款无酒精的好喝？","I want something refreshing. Any good alcohol-free options here?","我依家想飲啲清爽嘅，有冇邊款無酒精好飲？"],
["如果一直要我喝，這頓飯我就先走了。","如果一直要我喝酒，这顿饭我就先走了。","If the pressure continues, I'll leave dinner early.","如果一直要我飲，呢餐飯我就行先。"],
["今天的主角是大家見面，不是我杯子裡有甚麼。","今天重点是大家见面，不是我杯子里装着什么。","We're here to see each other, not to inspect what's in my glass.","今日重點係大家見面，唔係睇我隻杯裝咩。"],
["不要再勸酒了。說不喝，就是不喝。","别再劝酒了。我说不喝，就是不喝。","Stop pressuring me. No drink means no drink.","唔好再勸酒。我話唔飲，就係唔飲。"]
];
scene.replies={zh:{},en:{},yue:{}};
rows.forEach((r,i)=>{const k='r'+String(i+1).padStart(2,'0');scene.replies.zh[k]={hant:r[0],hans:r[1]};scene.replies.en[k]=r[2];scene.replies.yue[k]=r[3]});
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
window.CHAT_REVIEWED_SCENES.so03=true;
})();
