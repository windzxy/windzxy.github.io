// Distinct human cadences; identifiers remain private and never appear on cards.
;(function(){
const voices=[
 ["w06","brief","XX 目前卡在 A。","XX 目前卡在 A。","XX is blocked by A.","XX 而家卡喺 A。"],
 ["w06","brief-time","XX 卡在 A，明天下午更新。","XX 卡在 A，明天下午更新。","XX is blocked by A. I'll update you tomorrow afternoon.","XX 卡喺 A，聽日下午 update。"],
 ["w06","accountable","延誤是我這邊的責任；XX 卡在 A，我今晚給你新時間。","延误是我这边的责任；XX 卡在 A，我今晚给你新的完成时间。","The delay is on me. XX is blocked by A; I'll send a revised time tonight.","延誤係我呢邊責任；XX 卡喺 A，今晚俾你新時間。"],
 ["w06","considerate","知道你在等，所以先講重點：XX 卡在 A。","知道你在等，所以先说重点：XX 卡在 A。","I know you're waiting, so here's the key point: XX is blocked by A.","知你等緊，所以先講重點：XX 卡喺 A。"],
 ["w06","plan","XX 卡在 A。我先交能完成的 B，剩下的明天跟上。","XX 卡在 A。我先交能完成的 B，剩下的明天补上。","XX is blocked by A. I'll deliver B now and follow with the rest tomorrow.","XX 卡喺 A。我先交做到嘅 B，其他聽日補返。"],
 ["w06","question","XX 卡在 A。你希望先收到 B，還是等完整版本？","XX 卡在 A。你想先收到 B，还是等完整版本？","XX is blocked by A. Would you prefer B now or the complete version later?","XX 卡喺 A。你想先收 B，定等完整版本？"],
 ["w06","steady","時間要調整。XX 現在卡在 A，我會在今天下班前確認新節點。","时间要调整。XX 现在卡在 A，我会在今天下班前确认新节点。","The timeline needs adjusting. XX is blocked by A; I'll confirm a new milestone before close of day.","時間要調整。XX 而家卡喺 A，我放工前確認新節點。"],
 ["w06","dry","先報個不太浪漫的實況：XX 卡在 A。","先报个不太浪漫的实况：XX 卡在 A。","Here's the less glamorous status update: XX is blocked by A.","先報個唔係幾浪漫嘅實況：XX 卡喺 A。"],
 ["w06","cosmic","今天 XX 有點水逆，但實際卡點是 A；我會把時間補清楚。","今天 XX 有点水逆，但实际卡点是 A；我会把时间说清楚。","XX has a bit of a Mercury-retrograde day, but the real blocker is A. I'll confirm the timing.","今日 XX 有啲水逆，不過實際係卡喺 A；時間我會講清楚。"],
 ["w06","hard-stop","XX 做不完。卡在 A，現在需要改交付時間。","XX 做不完。卡在 A，现在需要改交付时间。","XX won't be done on time. A is the blocker; we need to change the delivery date.","XX 趕唔切。卡喺 A，依家要改交付時間。"],
 ["w01","tiny","資料到哪了？","资料到哪儿了？","Any sign of the file?","份資料去到邊？"],
 ["w01","warm","我這邊準備好了，就等你那份資料啦。","我这边准备好了，就等你那份资料啦。","I'm ready on my side; just waiting for your file.","我呢邊準備好，就等你嗰份資料喇。"],
 ["w01","deadline","四點要整合，資料先發我。","四点要整合，资料先发我。","We consolidate at four. Please send the file first.","四點要整合，份資料先發俾我。"],
 ["w01","clarify","還差你那份。現在有哪個版本能發？","还差你那份。现在有哪个版本能发？","Yours is the missing piece. Which version can you send now?","仲差你嗰份。而家邊個版本發到？"],
 ["w01","mild-tease","我已經打開收件箱等它登場了。","我已经打开收件箱等它登场了。","My inbox is ready for its grand entrance.","我開定 inbox 等佢出場喇。"],
 ["w01","boundary","今天收不到，就要一起調整整合時間。","今天收不到，就得一起调整整合时间。","If it can't arrive today, we'll need to move the consolidation time.","今日收唔到，就要一齊調整整合時間。"],
 ["w01","wry","資料是還在路上，還是根本沒出門？","资料是在路上，还是还没出门？","Is the file on its way, or hasn't it left yet?","份資料係喺路上，定係仲未出門？"],
 ["w01","gentle-ping","想跟進一下：資料現在方便發嗎？","想跟进一下：资料现在方便发吗？","A quick nudge: could you send the file now?","想問下：份資料而家發唔發到？"],
 ["r02","reflective","我想確認我們是不是在往同一個方向走。","我想确认我们是不是在往同一个方向走。","I want to know whether we're moving in the same direction.","我想知我哋係咪行緊同一個方向。"],
 ["r02","simple","你怎麼看我們現在的關係？","你怎么看我们现在的关系？","How do you see us right now?","你點睇我哋而家嘅關係？"],
 ["r02","space","不用立刻回答，但我希望我們找時間談清楚。","不用马上回答，但我希望我们找时间聊清楚。","You don't have to answer now, but I'd like us to talk clearly soon.","唔使即刻答，但我想我哋搵時間講清楚。"],
 ["r02","playful","我們是同一本故事，還是剛好翻到同一頁？","我们是在同一个故事里，还是刚好翻到同一页？","Are we in the same story, or did we just land on the same page?","我哋係同一本故事，定係啱啱好揭到同一頁？"],
 ["r02","starry","先不問星星怎麼說，我更想知道你怎麼想。","先不问星星怎么说，我更想知道你怎么想。","I could ask the stars, but I'd rather ask you what you feel.","唔問星星點講住，我更想知你點諗。"]
];
const scenes=new Map((window.CHAT_SCENARIOS||[]).map(s=>[s.id,s]));
for(const [id,key,hant,hans,en,yue] of voices){
 const scene=scenes.get(id);if(!scene)throw Error('Missing voice scene '+id);
 scene.replies.zh[key]={hant,hans};scene.replies.en[key]=en;scene.replies.yue[key]=yue;
}
})();
