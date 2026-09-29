;(function(){
const scene=(window.CHAT_SCENARIOS||[]).find(s=>s.id==='s01');
if(!scene)throw Error('Missing scene s01');
const rows=[
// Traditional, Simplified, English, Cantonese
["老師，剛才講到 XX 那一步，我沒跟上，能再說一次嗎？","老师，刚才讲到 XX 那一步，我没跟上，能再说一次吗？","I lost the thread at step XX. Could you go over that part again?","老師，頭先講到 XX 嗰步我跟唔上，可唔可以再講一次？"],
["我記下結論了，但不明白中間怎麼推到這裡。","我记下结论了，但不明白中间是怎么推出来的。","I have the conclusion, but I don't understand how we got there.","我記低咗結論，但唔明中間點推到呢度。"],
["可以用一個簡單例子示範 XX 嗎？","能用一个简单例子演示 XX 吗？","Could you show XX with a simple example?","可唔可以用個簡單例子示範 XX？"],
["我以為這題要用 A，剛才您用了 B；差別在哪裡？","我以为这题该用 A，刚才您用了 B；差别在哪里？","I expected to use A, but you used B. How do I tell which applies?","我以為呢題用 A，頭先你用咗 B；點分兩者？"],
["我想確認我聽對了：先做 A，再做 B，對嗎？","我想确认我听对了：先做 A，再做 B，对吗？","Let me check I heard correctly: A comes before B, right?","我想確認我聽啱：先做 A，再做 B，係咪？"],
["剛才那個術語能換成日常一點的說法嗎？","刚才那个术语能换成更日常的说法吗？","Could you put that term into everyday language?","頭先嗰個術語可唔可以講得生活化啲？"],
["如果只有兩分鐘，您會怎麼解釋這節課最重要的概念？","如果只有两分钟，您会怎么解释这节课最重要的概念？","If you had two minutes, how would you explain the main idea from today?","如果得兩分鐘，你會點講今日堂最重要個概念？"],
["我卡在第一個假設，後面的計算就看不懂了。那個假設為甚麼成立？","我卡在第一个假设，后面的计算就看不懂了。那个假设为什么成立？","I'm stuck on the first assumption, so the calculation loses me. Why is that assumption valid?","我卡喺第一個假設，後面計算就睇唔明。點解嗰個假設成立？"],
["這個方法適用於所有情況，還是只有剛才那一類題目？","这个方法适用于所有情况，还是只适用于刚才那类题？","Does this method work generally, or only for problems like the one we just did?","呢個方法所有情況都用得，定只係頭先嗰類題？"],
["您可以指一下我該先補哪個基礎概念嗎？","您能指出我应该先补哪个基础概念吗？","Which earlier concept should I review before trying this again?","可唔可以指下我應該先補返邊個基礎概念？"],
["我的筆記寫成 XX，現在覺得可能抄錯了。您能幫我核對嗎？","我的笔记写的是 XX，现在觉得可能记错了。您能帮我核对一下吗？","I wrote down XX, but I may have copied it incorrectly. Could you check it?","我筆記寫咗 XX，依家覺得可能抄錯。可唔可以幫我對下？"],
["這道例題的第二步和課本寫法不一樣，是另一種解法嗎？","这道例题的第二步和课本写法不同，是另一种解法吗？","Step two differs from the textbook. Is it an alternative method?","呢題第二步同課本寫法唔同，係另一種解法？"],
["今天還有時間看一眼我的解題過程嗎？我想知道卡在哪裡。","今天还有时间看一眼我的解题过程吗？我想知道自己卡在哪里。","Do you have a moment to look at my working? I want to see where I went wrong.","今日仲有時間睇一眼我解題過程嗎？我想知卡喺邊。"],
["我不想耽誤大家下課，這個問題適合課後再問您嗎？","我不想耽误大家下课，这个问题适合课后再问您吗？","I don't want to hold the class up. May I ask you about this afterwards?","我唔想阻住大家落堂，呢個問題可唔可以課後問你？"],
["如果現在不方便解答，您能推薦一頁我先讀嗎？","如果现在不方便解答，您能推荐我先看哪一页吗？","If now isn't a good time, which page should I read first?","如果依家唔方便答，可唔可以推介我先睇邊一頁？"],
["我明白怎麼算，卻不明白為甚麼要這樣算。","我知道怎么算，却不明白为什么要这样算。","I can follow the arithmetic, but not the reason we use it.","我識點計，但唔明點解要咁計。"],
["能給我一題讓我自己試，再看看理解對不對嗎？","能给我一道题让我自己试试，再看看我理解得对不对吗？","Could I try one problem and check whether I've understood the method?","可唔可以俾一題我自己試，再睇下我理解啱唔啱？"],
["剛才的圖裡，這條線代表甚麼？我從這裡開始看不懂。","刚才的图里，这条线代表什么？我从这里开始看不懂。","What does this line in the diagram represent? That's where I lost track.","頭先張圖入面，呢條線代表乜？我由呢度開始睇唔明。"],
["這個答案看起來合理，但我不會判斷自己的答案是否合理。","这个答案看起来合理，但我不会判断自己的答案是否合理。","The answer looks plausible, but how can I tell whether my own answer makes sense?","呢個答案睇落合理，但我唔識判斷自己個答案合唔合理。"],
["您剛才說有一個例外，能再講一下甚麼時候會遇到嗎？","您刚才说有一个例外，能再讲讲什么时候会遇到吗？","You mentioned an exception. When would we actually encounter it?","你頭先講有個例外，可唔可以再講下幾時會遇到？"],
["我跟到前半段，最後一步突然跳太快了。可以只補那一步嗎？","我能跟上前半段，最后一步跳得太快。能只补讲那一步吗？","I followed the first half, but the last step was too fast. Could we revisit just that step?","我跟到前半段，最後一步跳得太快。可唔可以淨係補講嗰步？"],
["我想把這題用在作業上，但不確定題目的條件有沒有變。","我想把这个方法用在作业上，但不确定题目的条件是否一样。","I want to apply this to the homework, but I'm unsure whether the conditions are the same.","我想將呢個方法用喺功課度，但唔肯定題目條件係咪一樣。"],
["您能指出常見的錯法嗎？我想避開自己最可能犯的錯。","您能指出常见的错误解法吗？我想避开自己最可能犯的错。","What is the most common wrong approach here? I'd like to avoid it.","可唔可以指出常見錯法？我想避開自己最可能犯嘅錯。"],
["我有一個可能很基本的問題：XX 到底指甚麼？","我有个可能很基础的问题：XX 到底指什么？","I have a basic question: what exactly does XX mean here?","我有個可能好基本嘅問題：XX 喺呢度究竟指乜？"],
["這裡我好像懂了一半。能不能先問您一個具體步驟？","这里我好像只懂了一半。能先问您一个具体步骤吗？","I think I've got half of it. Could I ask about one specific step?","呢度我好似明咗一半。可唔可以先問一個具體步驟？"],
["同樣的概念換成文字題，我就認不出來了。怎麼抓關鍵字？","同一个概念换成文字题，我就认不出来了。怎么抓关键条件？","I recognize this in equations but not in word problems. What clues should I look for?","同一個概念變咗文字題，我就認唔出。點捉關鍵條件？"],
["如果我把剛才的解法重述一次，您能告訴我哪裡理解錯了嗎？","如果我把刚才的解法复述一遍，您能告诉我哪里理解错了吗？","Could I explain the method back to you and have you tell me where I've misunderstood it?","如果我講返一次頭先解法，你可唔可以話我知邊度理解錯？"],
["我怕現在講不清楚，能否把問題寫在郵件裡再請教您？","我怕现在说不清楚，能不能写封邮件再向您请教？","I may explain this better in writing. Could I email you the question?","我驚依家講唔清楚，可唔可以寫封 email 再請教你？"],
["課件裡的 XX 和您口頭說的 YY，我應該以哪一個為準？","课件里的 XX 和您刚才说的 YY，我该以哪个为准？","The slides say XX, but I heard YY in class. Which one should I use?","課件寫 XX，但頭先你講 YY，我應該跟邊個？"],
["老師，我只差這個點沒弄懂。能幫我把 XX 說清楚嗎？","老师，我就差这一点没弄懂。能帮我把 XX 讲清楚吗？","I'm stuck on just one point. Could you clarify XX for me?","老師，我淨係差呢個位唔明。可唔可以幫我講清楚 XX？"]
];
scene.replies={zh:{},en:{},yue:{}};
rows.forEach((r,i)=>{const k='r'+String(i+1).padStart(2,'0');scene.replies.zh[k]={hant:r[0],hans:r[1]};scene.replies.en[k]=r[2];scene.replies.yue[k]=r[3]});
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
window.CHAT_REVIEWED_SCENES.s01=true;
})();
