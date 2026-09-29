// Strong, vulgar, sarcastic and clean-swear variants. Internal keys only; never shown in UI.
;(function(){
const S=window.CHAT_SCENARIOS||[];
const byId=new Map(S.map(s=>[s.id,s]));
function add(id,key,hant,hans,en,yue){
 const s=byId.get(id); if(!s) return;
 s.replies.zh[key]={hant,hans};
 s.replies.en[key]=en;
 s.replies.yue[key]=yue;
}
add("w01","raw","資料到底他媽的什麼時候給？我這邊已經被你拖到卡住了。","资料到底他妈的什么时候给？我这边已经被你拖到卡住了。","When the fuck is the file actually coming? You're already blocking my work.","份資料究竟幾時俾？屌，我呢邊已經俾你拖到卡住。");
add("w01","clean-swear","這份資料是打算等世界末日一起發嗎？現在給個準話。","这份资料是打算等世界末日一起发吗？现在给个准话。","Is this file waiting for the end of the world before it gets sent? Give me a real time.","份資料係咪打算世界末日先發？而家俾個準話。");
add("w03","raw","別他媽什麼都往我這裡塞。要我做，就先拿走一件。","别他妈什么都往我这里塞。要我做，就先拿走一件。","Stop fucking dumping everything on me. If I take this, remove something else.","唔好屌你乜都掟俾我。要我做，就先拎走一樣。");
add("w07","raw","這鍋不是我的，別他媽一出事就往我頭上扣。","这锅不是我的，别他妈一出事就往我头上扣。","This isn't my fuck-up. Stop pinning it on me the second something goes wrong.","呢隻鑊唔係我嘅，唔好一出事就屌住咁扣落我頭。");
add("w08","raw","工作加到飛起，人工一毛不動，這他媽不合理。要談就正式談。","工作加到飞起，工资一毛不动，这他妈不合理。要谈就正式谈。","The workload keeps exploding while the pay doesn't move a damn inch. That's bullshit. We need to talk.","工作加到飛起，人工一毫子都唔郁，屌，呢個唔合理。要傾就正式傾。");
add("w17","raw","星期五收工前才叫我週末做？這他媽叫臨時甩鍋，不叫安排。","星期五下班前才叫我周末做？这他妈叫临时甩锅，不叫安排。","Friday night and now you want weekend work? That's not planning, that's dumping shit at the last minute.","星期五收工先叫我週末做？屌，呢個叫臨時掟鑊，唔叫安排。");
add("w20","raw","你自己的活自己做，別他媽每次都拿我當免費代工。","你自己的活自己做，别他妈每次都拿我当免费代工。","Do your own damn work. Stop treating me like free labour every time.","你自己啲嘢自己做，唔好屌次次當我免費代工。");
add("w21","raw","這部分是我做的，別他媽順手把功勞也拿走。","这部分是我做的，别他妈顺手把功劳也拿走。","I did that part. Don't fucking take the credit too.","呢部分係我做，唔好屌順手連功勞都拎埋。");
add("s02","raw","你的部分到底交不交？別他媽等到最後讓全組替你擦屁股。","你的部分到底交不交？别他妈等到最后让全组替你擦屁股。","Are you submitting your part or not? Don't fucking leave the whole group to clean up after you.","你嗰部分究竟交唔交？唔好屌等到最後成組幫你執屎。");
add("f01","raw","家務不是我他媽一個人的全職工作，別再裝看不見。","家务不是我他妈一个人的全职工作，别再装看不见。","Housework is not my fucking full-time job. Stop pretending you don't see it.","家務唔係我屌一個人嘅全職工，唔好再扮睇唔到。");
add("e01","raw","結不結婚關我自己事，別他媽每次見面都問。","结不结婚关我自己事，别他妈每次见面都问。","Whether I marry is my damn business. Stop asking every time you see me.","結唔結婚係我自己事，唔好屌次次見面都問。");
add("fr01","raw","不借。別他媽再磨了，答案就是不借。","不借。别他妈再磨了，答案就是不借。","No. I'm not lending it. Stop fucking pushing; the answer is no.","唔借。唔好再屌磨，答案就係唔借。");
add("fr06","clean-swear","你不是遲到，你是在活在自己的時區。下次我按你的時區約。","你不是迟到，你是在活在自己的时区。下次我按你的时区约。","You're not late; you're apparently living in your own time zone. I'll schedule by that next time.","你唔係遲到，你係活喺自己時區。下次我按你時區約。");
add("r01","raw","現在都給我閉嘴一下，再吵下去只會他媽越來越難看。","现在都给我闭嘴一下，再吵下去只会他妈越来越难看。","We both need to shut the fuck up for a minute. This is only getting uglier.","而家大家收聲一陣，再嘈落去只會屌越嚟越難睇。");
add("r06","raw","你要冷靜可以，別他媽玩消失讓我猜你死哪去了。","你要冷静可以，别他妈玩消失让我猜你死哪去了。","Take space if you need it, but don't fucking disappear and make me guess where you went.","你要冷靜可以，唔好屌玩失蹤要我估你去咗邊。");
add("r09","clean-swear","每次吵架都把十年前的墳挖一遍，這架永遠吵不完。","每次吵架都把十年前的坟挖一遍，这架永远吵不完。","If every fight digs up every grave from ten years ago, this argument never ends.","次次嗌交都掘返十年前啲墳，呢場交永遠嗌唔完。");
add("so04","raw","大家都他媽在排隊，你憑什麼直接插進來？後面排。","大家都他妈在排队，你凭什么直接插进来？后面排。","Everyone is fucking queueing. What makes you think you can cut in? Get to the back.","大家都屌排緊隊，你憑咩直接插？後面排。");
add("sv01","raw","貨不對板就是不對板，別他媽扯一堆廢話，退款。","货不对板就是不对板，别他妈扯一堆废话，退款。","It doesn't match the listing. Stop the fucking excuses and refund it.","貨不對辦就係不對辦，唔好屌講一堆廢話，退款。");
add("sv03","clean-swear","「處理中」三個字我已經看懂了，我現在問的是到底處理了什麼。","“处理中”三个字我已经看懂了，我现在问的是到底处理了什么。","I understand the words 'in progress'. I'm asking what the hell has actually progressed.","『處理中』三個字我識睇，我而家問究竟處理咗乜。");
add("j01","raw","要不要我直接說，別他媽一直吊著人不回。","要不要我直接说，别他妈一直吊着人不回。","If it's a no, just fucking say no. Stop leaving people hanging in silence.","要唔要直接講，唔好屌一路吊住人又唔覆。");
add("b01","raw","這他媽根本不在原 scope，免費加？想都別想。","这他妈根本不在原 scope，免费加？想都别想。","This is fucking outside scope. Free addition? Not happening.","呢樣屌根本唔喺原 scope，免費加？諗都唔好諗。");
add("b04","clean-swear","「最後一個小改」已經他媽第五個了，這輪之後就收口。","“最后一个小改”已经他妈第五个了，这轮之后就收口。","Your 'one last tiny change' is on its fifth sequel. We're closing after this round.","『最後一個小改』已經屌第五個，今輪之後收口。");
add("on01","raw","同一句廢話翻來覆去講有意思嗎？我他媽不陪你繞了。","同一句废话翻来覆去讲有意思吗？我他妈不陪你绕了。","Is repeating the same bullshit actually going anywhere? I'm fucking done circling this.","同一句廢話翻嚟覆去講有咩意思？我屌唔陪你兜圈。");
add("on03","clean-swear","有話直說，別在評論區打啞謎。大家都沒空陪你解題。","有话直说，别在评论区打哑谜。大家都没空陪你解题。","Say what you mean. Stop turning the comments into a riddle nobody asked to solve.","有嘢直講，唔好喺留言區打啞謎，冇人得閒幫你解題。");
})();