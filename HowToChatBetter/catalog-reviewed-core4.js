;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
function get(id){return S.find(x=>x.id===id)}
function add(s,key,hant,hans,en,yue){s.replies.zh[key]={hant,hans};s.replies.en[key]=en;s.replies.yue[key]=yue}
function clearQ(s){if(!s)return;for(const lang of ["zh","en","yue"]){for(const k of Object.keys(s.replies?.[lang]||{}))if(/^qv2-/.test(k))delete s.replies[lang][k]}}
function mark(s){if(s)window.CHAT_REVIEWED_SCENES[s.id]=true}

let s=get("j01");
if(s){
 clearQ(s);
 [
 ["rv01","想確認一下 XX 職位目前還在流程中嗎？","想确认一下 XX 职位目前还在流程中吗？","Could you confirm whether the XX role is still active in the process?","想確認下 XX 職位而家仲喺唔喺流程中？"],
 ["rv02","如果目前還在內部評估，我可以等，只想知道大概時間。","如果目前还在内部评估，我可以等，只想知道大概时间。","If it's still under internal review, I can wait. I'd just like a rough timeline.","如果仲喺內部評估，我可以等，只想知大概時間。"],
 ["rv03","如果已經有其他人選，也麻煩直接告訴我，我好安排後續。","如果已经有其他人选，也麻烦直接告诉我，我好安排后续。","If you've moved forward with another candidate, please let me know so I can plan accordingly.","如果已經有其他人選，都麻煩直接話我知，我好安排後面。"],
 ["rv04","我仍然對這個職位有興趣，所以想再確認一次進度。","我仍然对这个职位有兴趣，所以想再确认一次进度。","I'm still interested in the role, so I wanted to check the status once more.","我仲對呢個職位有興趣，所以想再確認一次進度。"],
 ["rv05","面試後已經 X 天，想問一下下一步是否有更新。","面试后已经 X 天，想问一下下一步是否有更新。","It's been X days since the interview. Is there any update on next steps?","面試後已經 X 日，想問下一步有冇 update。"],
 ["rv06","如果需要我補充資料或案例，我可以隨時提供。","如果需要我补充资料或案例，我可以随时提供。","If you need any additional information or work samples, I'm happy to provide them.","如果要我補資料或者 case，我可以隨時提供。"],
 ["rv07","我目前也在安排其他機會，所以想確認你們這邊的時間表。","我目前也在安排其他机会，所以想确认你们这边的时间表。","I'm also managing other opportunities, so I'd like to understand your timeline.","我而家都安排緊其他機會，所以想確認你哋 timeline。"],
 ["rv08","不用給我很完整的結果，只要告訴我流程是否仍在進行即可。","不用给我很完整的结果，只要告诉我流程是否仍在进行即可。","I don't need a full decision yet; I just want to know whether the process is still active.","唔使俾完整結果，只要話我知流程仲進行緊就得。"],
 ["rv09","如果決策時間延後了，告訴我新的預計日期就可以。","如果决策时间延后了，告诉我新的预计日期就可以。","If the decision has been delayed, just let me know the new expected date.","如果決策延後，話我知新預計日期就得。"],
 ["rv10","想確認一下我是不是漏掉了你們之前的通知。","想确认一下我是不是漏掉了你们之前的通知。","I wanted to check whether I may have missed an update from your side.","想確認下我係咪漏咗你哋之前嘅通知。"],
 ["rv11","如果目前沒有進一步安排，也可以直接跟我說。","如果目前没有进一步安排，也可以直接跟我说。","If there are no further steps at this point, you can tell me directly.","如果而家冇進一步安排，都可以直接同我講。"],
 ["rv12","我想要一個明確狀態：仍在考慮、暫停，還是已結束？","我想要一个明确状态：仍在考虑、暂停，还是已结束？","I'd appreciate a clear status: still under consideration, paused, or closed?","我想要個清楚狀態：仲考慮緊、暫停，定已經完？"],
 ["rv13","如果職位已經關閉，麻煩直接告知，我就不再打擾。","如果职位已经关闭，麻烦直接告知，我就不再打扰。","If the role has closed, please let me know directly and I won't follow up again.","如果職位已經 close，麻煩直接講，我就唔再 follow up。"],
 ["rv14","我尊重招聘節奏，但長時間沒有任何更新會比較難安排。","我尊重招聘节奏，但长时间没有任何更新会比较难安排。","I respect the hiring timeline, but long periods without any update make planning difficult.","我尊重招聘節奏，但長時間完全冇 update 會比較難安排。"],
 ["rv15","我不是催結果，只是希望知道流程還有沒有下一步。","我不是催结果，只是希望知道流程还有没有下一步。","I'm not pushing for a decision; I just want to know whether there is still a next step.","我唔係催結果，只係想知流程仲有冇下一步。"],
 ["rv16","如果你們還需要時間，可以告訴我，不回覆反而最難判斷。","如果你们还需要时间，可以告诉我，不回复反而最难判断。","If you need more time, that's fine. Silence is simply the hardest status to interpret.","如果你哋仲要時間，可以講。完全唔覆反而最難判斷。"],
 ["rv17","我可以接受結果不好，但希望有結果。","我可以接受结果不好，但希望有结果。","I can accept a negative outcome. I just want an outcome.","我可以接受結果唔好，但希望有結果。"],
 ["rv18","如果是 no，直接說 no 比一直沒有消息更尊重雙方時間。","如果是 no，直接说 no 比一直没有消息更尊重双方时间。","If it's a no, saying no directly respects everyone's time more than prolonged silence.","如果係 no，直接講 no 比一路冇消息更尊重大家時間。"],
 ["rv19","這個流程目前最明確的部分，就是它很安靜。","这个流程目前最明确的部分，就是它很安静。","The clearest thing about the process so far is how quiet it is.","呢個流程目前最清楚嘅部分，就係佢好安靜。"],
 ["rv20","想問一下，XX 職位是不是進入隱身模式了？","想问一下，XX 职位是不是进入隐身模式了？","Quick check: has the XX role entered stealth mode?","想問下，XX 職位係咪進入隱身 mode？"],
 ["rv21","我的 inbox 已經替這個職位值班很多天了。","我的 inbox 已经替这个职位值班很多天了。","My inbox has been on duty for this role for quite a few days.","我個 inbox 已經替呢個職位值班好多日。"],
 ["rv22","招聘流程可以慢，但最好不要完全失聯。","招聘流程可以慢，但最好不要完全失联。","Hiring can be slow; it doesn't need to go completely silent.","招聘流程可以慢，但最好唔好完全失聯。"],
 ["rv23","如果已經不考慮我，直接說就行，我不會玻璃心。","如果已经不考虑我，直接说就行，我不会玻璃心。","If I'm no longer under consideration, just tell me. I can handle it.","如果已經唔考慮我，直接講就得，我受得住。"],
 ["rv24","別讓候選人靠沉默自己猜結果。","别让候选人靠沉默自己猜结果。","Don't make candidates infer the outcome from silence.","唔好要 candidate 靠沉默自己估結果。"],
 ["rv25","要拒就拒，別他媽把人一直吊著。","要拒就拒，别他妈把人一直吊着。","If it's a rejection, reject me. Don't fucking leave me hanging.","要拒就拒，唔好屌一路吊住人。"],
 ["rv26","我只想知道這個職位還有沒有我的戲份。","我只想知道这个职位还有没有我的戏份。","I just want to know whether I'm still in the story for this role.","我只想知呢個職位仲有冇我戲份。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("b01");
if(s){
 clearQ(s);
 [
 ["rv01","這項可以做，但需要先作為新增 scope 確認。","这项可以做，但需要先作为新增 scope 确认。","We can do this, but it needs to be confirmed as additional scope first.","呢項可以做，但要先當新增 scope 確認。"],
 ["rv02","原報價沒有包含這部分，所以需要另計時間和費用。","原报价没有包含这部分，所以需要另计时间和费用。","This wasn't included in the original quote, so time and cost need to be added.","原報價冇包呢部分，所以要另計時間同費用。"],
 ["rv03","如果要加這項，我會把新增工時和交期影響整理給你。","如果要加这项，我会把新增工时和交期影响整理给你。","If you want this added, I'll outline the extra hours and schedule impact.","如果要加呢項，我會整理新增工時同交期影響俾你。"],
 ["rv04","可以新增，但不能一邊加內容一邊要求原預算和原 deadline 不變。","可以新增，但不能一边加内容一边要求原预算和原 deadline 不变。","We can add it, but not while keeping the original budget and deadline unchanged.","可以新增，但唔可以一邊加內容一邊要求原 budget 同 deadline 唔變。"],
 ["rv05","這不是微調，是新的交付內容。","这不是微调，是新的交付内容。","This isn't a minor tweak; it's a new deliverable.","呢個唔係微調，係新交付內容。"],
 ["rv06","如果預算不能增加，那就要從原 scope 裡拿掉等量內容。","如果预算不能增加，那就要从原 scope 里拿掉等量内容。","If the budget can't increase, we need to remove equivalent work from the original scope.","如果 budget 唔加，就要由原 scope 拎走等量內容。"],
 ["rv07","我可以先做估時，確認後再開始，不會直接免費開工。","我可以先做估时，确认后再开始，不会直接免费开工。","I can estimate it first. Work starts after approval, not for free by default.","我可以先估時，確認後先開始，唔會直接免費開工。"],
 ["rv08","請把新增需求集中一次，我們一起做 change request。","请把新增需求集中一次，我们一起做 change request。","Please consolidate the added requests so we can process one change request.","請將新增需求集中一次，一齊做 change request。"],
 ["rv09","這項如果現在插入，原本交付日期會往後移。","这项如果现在插入，原本交付日期会往后移。","If this is inserted now, the original delivery date will move.","呢項依家插入，原本交付日期會向後。"],
 ["rv10","新增內容沒問題，但需要正式記錄，避免後面對 scope 理解不同。","新增内容没问题，但需要正式记录，避免后面对 scope 理解不同。","The addition is fine, but it needs to be documented so scope isn't remembered differently later.","新增內容冇問題，但要正式記錄，免得之後對 scope 理解唔同。"],
 ["rv11","這部分不在合約範圍內，我先不安排資源。","这部分不在合同范围内，我先不安排资源。","This is outside the contract scope, so I won't allocate resources until it's approved.","呢部分唔喺合約 scope，我暫時唔安排資源。"],
 ["rv12","你可以選：加預算、延時間，或者縮其他內容。","你可以选：加预算、延时间，或者缩其他内容。","You can choose: add budget, extend time, or reduce other scope.","你可以揀：加 budget、延時間，或者縮其他內容。"],
 ["rv13","新增需求本身可以談，免費這件事不談。","新增需求本身可以谈，免费这件事不谈。","The new requirement is negotiable. Free isn't.","新增需求可以傾，免費就唔傾。"],
 ["rv14","我不想後面變成『順便再加一點』無限延伸，所以現在先把邊界定住。","我不想后面变成“顺便再加一点”无限延伸，所以现在先把边界定住。","I don't want 'just one more thing' to expand forever, so let's set the boundary now.","我唔想後面一路『順便加少少』無限延伸，所以依家先定界線。"],
 ["rv15","如果你要的是完整新增功能，那就按完整新增功能報價。","如果你要的是完整新增功能，那就按完整新增功能报价。","If you want a full new feature, it needs to be priced as a full new feature.","如果你要完整新功能，就按完整新功能報價。"],
 ["rv16","別把『看起來不大』等同於『不用時間』。","别把“看起来不大”等同于“不用时间”。","Don't confuse 'looks small' with 'takes no time'.","唔好將『睇落唔大』等於『唔使時間』。"],
 ["rv17","scope 不是橡皮筋，拉長了成本還能完全不變。","scope 不是橡皮筋，拉长了成本还能完全不变。","Scope isn't an elastic band that stretches while cost stays fixed.","scope 唔係橡筋，拉長咗成本仲可以完全唔變。"],
 ["rv18","需求可以長大，預算也得一起成年。","需求可以长大，预算也得一起成年。","If the requirements grow up, the budget has to grow up too.","需求可以長大，budget 都要一齊成年。"],
 ["rv19","你這個『小改』已經有自己的完整功能列表了。","你这个“小改”已经有自己的完整功能列表了。","That 'small change' now has its own full feature list.","你呢個『小改』已經有自己完整 feature list。"],
 ["rv20","原 scope 看著你這些新增需求，已經快認不出自己了。","原 scope 看着这些新增需求，已经快认不出自己了。","The original scope is looking at these additions and barely recognises itself.","原 scope 睇住呢堆新增需求，已經快認唔出自己。"],
 ["rv21","免費加一點、再免費加一點，最後就不是原項目了。","免费加一点、再免费加一点，最后就不是原项目了。","Add a little for free, then another little, and eventually it's a different project.","免費加少少、再免費加少少，最後就唔係原 project。"],
 ["rv22","可以，我先開一張新增需求單，不是直接開工單。","可以，我先开一张新增需求单，不是直接开工单。","Sure. I'll open a change request first, not start work immediately.","可以，我先開 change request，唔係直接開工。"],
 ["rv23","合作可以靈活，scope 不能失憶。","合作可以灵活，scope 不能失忆。","Collaboration can be flexible. Scope can't lose its memory.","合作可以靈活，scope 唔可以失憶。"],
 ["rv24","這不是我不配合，是原報價真的沒買到這一項。","这不是我不配合，是原报价真的没买到这一项。","This isn't me being uncooperative; the original quote genuinely didn't include this.","唔係我唔配合，係原報價真係冇買到呢項。"],
 ["rv25","免費加是不可能的，要做就按新增需求走。","免费加是不可能的，要做就按新增需求走。","Free addition isn't happening. If you want it, it goes through change scope.","免費加冇可能，要做就按新增需求走。"],
 ["rv26","這他媽已經不是原 scope 了，別再叫它『順便』。","这他妈已经不是原 scope 了，别再叫它“顺便”。","This is fucking outside the original scope. Stop calling it 'just a quick extra'.","呢個屌已經唔係原 scope，唔好再叫『順便』。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}

s=get("on01");
if(s){
 clearQ(s);
 [
 ["rv01","我們觀點不同就到這裡，我不打算把同一件事重複十遍。","我们观点不同就到这里，我不打算把同一件事重复十遍。","We disagree. I'm not repeating the same point ten times.","我哋觀點唔同就到呢度，我唔打算同一樣嘢講十次。"],
 ["rv02","我的立場已經說完，你可以不同意，不需要繼續抬槓。","我的立场已经说完，你可以不同意，不需要继续抬杠。","I've stated my position. You can disagree without dragging this out.","我立場已經講完，你可以唔同意，唔使再抬槓。"],
 ["rv03","如果你有新觀點我會看，重複同一句我就不回了。","如果你有新观点我会看，重复同一句我就不回了。","If you have a new point, I'll read it. If it's the same point again, I'm done replying.","如果你有新觀點我會睇，重複同一句我就唔覆。"],
 ["rv04","我們沒有要互相說服，停在不同意也可以。","我们没有要互相说服，停在不同意也可以。","We don't have to persuade each other. We can stop at disagreement.","我哋唔一定要說服對方，停喺唔同意都得。"],
 ["rv05","你一直改說法，但核心還是同一個點，我已經回過了。","你一直改说法，但核心还是同一个点，我已经回过了。","You're rephrasing the same core point. I've already answered it.","你一路換講法，但核心都係同一點，我已經覆過。"],
 ["rv06","這裡我不再展開，避免整個群都被我們洗版。","这里我不再展开，避免整个群都被我们刷屏。","I'm not expanding this further here; there's no need to flood the group.","呢度我唔再展開，免得成個 group 俾我哋洗版。"],
 ["rv07","如果你只是想贏最後一句，那你拿去。","如果你只是想赢最后一句，那你拿去。","If all you want is the last word, you can have it.","如果你只係想贏最後一句，俾你。"],
 ["rv08","我沒有義務陪你把同一場辯論無限續杯。","我没有义务陪你把同一场辩论无限续杯。","I don't owe this debate unlimited refills.","我冇義務陪你同一場辯論無限續杯。"],
 ["rv09","不同意就不同意，不用每句都接一個『但是』。","不同意就不同意，不用每句都接一个“但是”。","It's fine to disagree. Every sentence doesn't need another 'but'.","唔同意就唔同意，唔使句句都接個『但係』。"],
 ["rv10","你說你的，我說我的，到這裡已經足夠。","你说你的，我说我的，到这里已经足够。","You've said your part and I've said mine. That's enough.","你講你嘅，我講我嘅，到呢度夠。"],
 ["rv11","這不是辯論賽，我也不是你的固定對手。","这不是辩论赛，我也不是你的固定对手。","This isn't a debate tournament and I'm not your assigned opponent.","呢個唔係辯論賽，我都唔係你固定對手。"],
 ["rv12","別每次看到不同意見就自動開戰。","别每次看到不同意见就自动开战。","Don't treat every disagreement as a cue to start a fight.","唔好次次見到唔同意見就自動開戰。"],
 ["rv13","如果你想討論，就回內容；如果只想挑刺，我不陪。","如果你想讨论，就回内容；如果只想挑刺，我不陪。","If you want discussion, address the content. If you're only nitpicking, I'm out.","如果你想討論，就回內容；淨係想挑刺，我唔陪。"],
 ["rv14","你現在不是在問問題，是在等我給你下一個反駁點。","你现在不是在问问题，是在等我给你下一个反驳点。","You're not asking a question; you're waiting for the next thing to argue with.","你而家唔係問問題，係等我俾下一個反駁點你。"],
 ["rv15","不用每條都 quote 我，我沒有開 AMA。","不用每条都 quote 我，我没有开 AMA。","You don't need to quote every line. I'm not running an AMA.","唔使條條 quote 我，我冇開 AMA。"],
 ["rv16","這個話題我退出，你繼續跟空氣辯也可以。","这个话题我退出，你继续跟空气辩也可以。","I'm leaving this topic. You're welcome to keep debating the air.","呢個話題我退出，你繼續同空氣辯都得。"],
 ["rv17","我們已經從討論變成循環播放了。","我们已经从讨论变成循环播放了。","We've stopped discussing and started looping.","我哋已經由討論變循環播放。"],
 ["rv18","這場對話唯一穩定的輸出，就是同一句話。","这场对话唯一稳定的输出，就是同一句话。","The only consistent output from this conversation is the same point again.","呢場對話唯一穩定輸出，就係同一句。"],
 ["rv19","你個槓抬得幾穩，我先落車。","你的杠抬得挺稳，我先下车。","You're holding that argument pole very steadily. I'm getting off here.","你個槓抬得幾穩，我落車先。"],
 ["rv20","這個副本沒掉裝備，我不刷了。","这个副本没掉装备，我不刷了。","This level drops no loot. I'm done grinding it.","呢個副本冇掉裝備，我唔刷喇。"],
 ["rv21","你想抬我就讓你抬，反正我不接。","你想抬我就让你抬，反正我不接。","If you want to keep arguing, go ahead. I'm not catching it.","你想抬就抬，我唔接。"],
 ["rv22","最後一句送你，恭喜。","最后一句送你，恭喜。","You can have the last word. Congratulations.","最後一句送你，恭喜。"],
 ["rv23","如果你的目標是讓人不想回你，你成功了。","如果你的目标是让人不想回你，你成功了。","If your goal was to make people stop replying, you've succeeded.","如果你目標係令人唔想覆你，你成功咗。"],
 ["rv24","不是每句話都需要你來槓一下。","不是每句话都需要你来杠一下。","Not every sentence needs your counterpoint.","唔係句句都需要你嚟槓一下。"],
 ["rv25","同一句廢話翻來覆去講，真的沒意思。","同一句废话翻来覆去讲，真的没意思。","Repeating the same nonsense over and over is pointless.","同一句廢話翻嚟覆去講，真係冇意思。"],
 ["rv26","我他媽不陪你無限抬槓了，愛怎麼想怎麼想。","我他妈不陪你无限抬杠了，爱怎么想怎么想。","I'm fucking done with this endless arguing. Think whatever you want.","我屌唔陪你無限抬槓，你鍾意點諗就點諗。"]
 ].forEach(x=>add(s,...x));
 mark(s);
}
})();