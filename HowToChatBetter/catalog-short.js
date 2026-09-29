// Short, scene-specific lines for people who would actually send one quick message.
;(function(){
const lines=[
 ["w01","short","資料呢！！！","资料呢！！！","Where's the file?!","份資料呢？！"],
 ["w01","shorter","今天能發嗎？","今天能发吗？","Can you send it today?","今日發唔發到？"],
 ["w03","short","先說要我停哪件。","先说要我停哪件。","Which task should I pause?","先講我要停邊樣。"],
 ["w03","shorter","沒空檔，先排優先級。","没空档，先排优先级。","No spare capacity. Pick a priority.","冇位喇，先排優先次序。"],
 ["s02","short","你的部分呢？今晚要交。","你的部分呢？今晚要交。","Your part? It's due tonight.","你嗰部分呢？今晚要交喇。"],
 ["w10","short","先拉回議題，好嗎？","先拉回议题，好吗？","Can we get back to the agenda?","返返去個議題先，好嗎？"],
 ["j01","short","面試有更新嗎？","面试有更新吗？","Any interview update?","面試有冇新消息？"],
 ["b02","short","這筆款何時到？","这笔款什么时候到账？","When will the payment arrive?","呢筆數幾時到？"],
 ["fr01","short","這筆不借，抱歉。","这笔不借，抱歉。","I can't lend this, sorry.","呢筆唔借得，唔好意思。"],
 ["r01","short","我們先停十分鐘。","我们先停十分钟。","Let's pause for ten minutes.","我哋停十分鐘先。"],
 ["sv01","short","貨不符，請退款。","货不符，请退款。","It doesn't match the listing. Refund, please.","貨不對辦，麻煩退款。"],
 ["t02","short","房型不對，請核對訂單。","房型不对，请核对订单。","Wrong room type. Please check my booking.","房型唔啱，麻煩對返張單。"],
 ["m01","short","請慢一點，我想記下來。","请慢一点，我想记下来。","Could you slow down so I can note this?","可唔可以慢少少，我想記低。"],
 ["on02","short","不用了，請勿再私訊。","不用了，请别再私信。","No thanks. Please stop messaging.","唔使喇，唔好再私訊我。"],
 ["w17","short","今晚留不了，明早處理。","今晚留不了，明早处理。","I can't stay tonight. I'll handle it tomorrow.","今晚留唔到，聽朝處理。"],
 ["w21","short","這部分是我做的。","这部分是我做的。","That part was my work.","呢部分係我做嘅。"],
 ["st08","short","缺的內容可以發我嗎？","缺的内容可以发我吗？","Could you send what I missed?","漏咗嘅內容可唔可以發俾我？"],
 ["p07","short","先放下手機，我陪你歇一下。","先放下手机，我陪你休息一下。","Phone down for now. I'll sit with you.","先放低手機，我陪你抖下。"],
 ["fr07","short","我的東西何時還？","我的东西什么时候还？","When can you return my things?","我啲嘢幾時還？"],
 ["r06","short","想冷靜可以，但請說一聲。","想冷静可以，但请说一声。","It's okay to take space. Please tell me first.","想冷靜可以，但麻煩講聲。"],
 ["so04","short","不好意思，這裡在排隊。","不好意思，这里在排队。","Excuse me, there's a queue.","唔好意思，呢度排緊隊。"],
 ["sv04","short","請你們處理發貨錯誤。","请你们处理发货错误。","Please fix the shipping error on your side.","麻煩你哋處理返發貨錯誤。"],
 ["tr04","short","這個升級超預算了。","这个升级超预算了。","That upgrade is over my budget.","呢個升級超出我預算喇。"],
 ["wave6-001","short","A 還是 B 先？","A 还是 B 先？","A or B first?","A 定 B 先？"],
 ["wave6-025","short","這項不是我點的。","这项不是我点的。","I didn't order this.","呢樣唔係我叫嘅。"],
 ["wave6-034","short","行李呢？這是行李牌。","行李呢？这是行李牌。","Where's my bag? Here's the tag.","件行李呢？呢個係行李牌。"],
 ["wave6-038","short","我想單獨談幾分鐘。","我想单独谈几分钟。","I'd like a few minutes in private.","我想單獨傾幾分鐘。"]
];
const byId=new Map((window.CHAT_SCENARIOS||[]).map(s=>[s.id,s]));
for(const [id,key,hant,hans,en,yue] of lines){
 const scene=byId.get(id);if(!scene)throw Error('Missing short-reply scene '+id);
 scene.replies.zh[key]={hant,hans};scene.replies.en[key]=en;scene.replies.yue[key]=yue;
}
})();
