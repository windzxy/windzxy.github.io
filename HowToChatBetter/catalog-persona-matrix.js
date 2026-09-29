// Expand every situation to 30+ genuinely different communication voices.
// Voice keys are private. They are never rendered as labels in the UI.
;(function(){
const scenes=window.CHAT_SCENARIOS||[];
const sensitive=new Set(["parenting","medical"]);
const protectedSoft=new Set(["parenting","medical","elder"]);

function clean(s){return String(s||"").trim().replace(/[。.!！?？]+$/,"")}
function punct(s,mark){s=clean(s);return s+(mark||"。")}
function vals(scene,lang){
 const box=scene.replies?.[lang]||{}, out=[];
 for(const key of Object.keys(box)){
  const v=box[key];
  if(lang==="zh"){
   if(v&&v.hant&&v.hans)out.push(v);
  }else if(typeof v==="string"&&v.trim()) out.push(v);
 }
 return out;
}
function pick(arr,i){return arr.length?arr[i%arr.length]:""}
function z(hant,hans){return {hant,hans}}

const W={
 hant:{
  clarify:b=>"我先把話說清楚："+punct(b),
  empath:b=>"我理解你可能有你的原因，但"+punct(b),
  boundary:b=>"我的界線很簡單："+punct(b),
  consequence:b=>punct(b)+"不然我就按現有安排處理。",
  question:b=>"所以現在你打算怎麼處理？"+punct(b),
  face:b=>"我先不追究前面，接下來把事情處理好："+punct(b),
  soft:b=>"我不想把氣氛弄僵，所以直接講需求："+punct(b),
  professional:b=>"為避免後續理解不一致，我確認一下："+punct(b),
  concise:b=>"一句話："+punct(b),
  detached:b=>"先不談情緒，只談這件事："+punct(b),
  warm:b=>"我知道大家都不想把事情弄難看，"+punct(b),
  assertive:b=>"我可以配合，但前提是："+punct(b),
  resigned:b=>"行，我也不繞了："+punct(b),
  dry:b=>"好，重點只有一個："+punct(b),
  wry:b=>"看來這件事很有自己的節奏。"+punct(b),
  sarcasm:b=>"原來事情還可以這樣處理。那我也說清楚："+punct(b),
  tea:b=>"可能是我要求太高了吧，不過"+punct(b),
  yin:b=>"沒事，我只是第一次知道原來這樣也算處理。"+punct(b),
  shade:b=>"話不用說得太重，事實已經夠清楚："+punct(b),
  roast:b=>"這個劇情我就不追了，"+punct(b),
  internet:b=>"省流："+punct(b),
  meme:b=>"這個副本先別再加難度了，"+punct(b),
  blunt:b=>"我直說："+punct(b),
  rude:b=>"別繞了，"+punct(b),
  raw:b=>"別他媽扯了，"+punct(b),
  cleanSwear:b=>"這操作挺有想像力，但我不接。"+punct(b),
  fire:b=>"我不繞彎，也不憋著："+punct(b),
  earth:b=>"按現實來，不談幻想："+punct(b),
  air:b=>"這事其實沒那麼複雜："+punct(b),
  water:b=>"我在意感受，但也要有界線："+punct(b),
  infj:b=>"我不想傷關係，也不想委屈自己："+punct(b),
  entp:b=>"換個角度，如果角色對調，你會覺得合理嗎？"+punct(b),
  istj:b=>"按之前的約定和事實："+punct(b),
  enfp:b=>"先別把氣氛搞死，我們把事情解決："+punct(b),
  boss:b=>"結論先行："+punct(b),
  hr:b=>"從合作和邊界角度，我的立場是："+punct(b),
  legal:b=>"為避免歧義，我明確表達："+punct(b),
  cultured:b=>"我願意給體面，但不會拿體面換底線："+punct(b),
  lowEQ:b=>"我話擺這裡："+punct(b),
  stoic:b=>"情緒先放一邊，事情照樣要處理："+punct(b),
  playful:b=>"先別演大結局，"+punct(b),
  reverse:b=>"如果換成你，你接受嗎？"+punct(b),
  hardStop:b=>"我不打算再反覆解釋："+punct(b),
  command:b=>"現在就按這個處理："+punct(b),
  calmFirm:b=>"我不吵，也不退："+punct(b),
  minimal:b=>punct(b)
 },
 hans:{
  clarify:b=>"我先把话说清楚："+punct(b),
  empath:b=>"我理解你可能有你的原因，但"+punct(b),
  boundary:b=>"我的界限很简单："+punct(b),
  consequence:b=>punct(b)+"不然我就按现有安排处理。",
  question:b=>"所以现在你打算怎么处理？"+punct(b),
  face:b=>"我先不追究前面，接下来把事情处理好："+punct(b),
  soft:b=>"我不想把气氛弄僵，所以直接讲需求："+punct(b),
  professional:b=>"为避免后续理解不一致，我确认一下："+punct(b),
  concise:b=>"一句话："+punct(b),
  detached:b=>"先不谈情绪，只谈这件事："+punct(b),
  warm:b=>"我知道大家都不想把事情弄难看，"+punct(b),
  assertive:b=>"我可以配合，但前提是："+punct(b),
  resigned:b=>"行，我也不绕了："+punct(b),
  dry:b=>"好，重点只有一个："+punct(b),
  wry:b=>"看来这件事很有自己的节奏。"+punct(b),
  sarcasm:b=>"原来事情还可以这样处理。那我也说清楚："+punct(b),
  tea:b=>"可能是我要求太高了吧，不过"+punct(b),
  yin:b=>"没事，我只是第一次知道原来这样也算处理。"+punct(b),
  shade:b=>"话不用说得太重，事实已经够清楚："+punct(b),
  roast:b=>"这个剧情我就不追了，"+punct(b),
  internet:b=>"省流："+punct(b),
  meme:b=>"这个副本先别再加难度了，"+punct(b),
  blunt:b=>"我直说："+punct(b),
  rude:b=>"别绕了，"+punct(b),
  raw:b=>"别他妈扯了，"+punct(b),
  cleanSwear:b=>"这操作挺有想象力，但我不接。"+punct(b),
  fire:b=>"我不绕弯，也不憋着："+punct(b),
  earth:b=>"按现实来，不谈幻想："+punct(b),
  air:b=>"这事其实没那么复杂："+punct(b),
  water:b=>"我在意感受，但也要有界限："+punct(b),
  infj:b=>"我不想伤关系，也不想委屈自己："+punct(b),
  entp:b=>"换个角度，如果角色对调，你会觉得合理吗？"+punct(b),
  istj:b=>"按之前的约定和事实："+punct(b),
  enfp:b=>"先别把气氛搞死，我们把事情解决："+punct(b),
  boss:b=>"结论先行："+punct(b),
  hr:b=>"从合作和边界角度，我的立场是："+punct(b),
  legal:b=>"为避免歧义，我明确表达："+punct(b),
  cultured:b=>"我愿意给体面，但不会拿体面换底线："+punct(b),
  lowEQ:b=>"我话放这儿："+punct(b),
  stoic:b=>"情绪先放一边，事情照样要处理："+punct(b),
  playful:b=>"先别演大结局，"+punct(b),
  reverse:b=>"如果换成你，你接受吗？"+punct(b),
  hardStop:b=>"我不打算再反复解释："+punct(b),
  command:b=>"现在就按这个处理："+punct(b),
  calmFirm:b=>"我不吵，也不退："+punct(b),
  minimal:b=>punct(b)
 },
 en:{
  clarify:b=>"Let me make this clear: "+punct(b,"."),
  empath:b=>"I understand there may be reasons. Still: "+punct(b,"."),
  boundary:b=>"My boundary is simple: "+punct(b,"."),
  consequence:b=>punct(b,".")+" Otherwise I'll proceed with the current plan.",
  question:b=>"So how are you planning to handle this now? "+punct(b,"."),
  face:b=>"I'm not dwelling on what's already happened. From here: "+punct(b,"."),
  soft:b=>"I don't want to make this awkward, so I'll say what I need clearly: "+punct(b,"."),
  professional:b=>"To avoid any misunderstanding later, let me confirm: "+punct(b,"."),
  concise:b=>"Short version: "+punct(b,"."),
  detached:b=>"Leaving emotion aside, here's the issue: "+punct(b,"."),
  warm:b=>"I know nobody wants this to become ugly. Here's my point: "+punct(b,"."),
  assertive:b=>"I can work with this, but only on one condition: "+punct(b,"."),
  resigned:b=>"Fine. No more circling around it: "+punct(b,"."),
  dry:b=>"Right. One point only: "+punct(b,"."),
  wry:b=>"This situation clearly has a schedule of its own. "+punct(b,"."),
  sarcasm:b=>"Interesting. Apparently this is how we're handling it. In that case: "+punct(b,"."),
  tea:b=>"Maybe my expectations are just unusually high. Either way: "+punct(b,"."),
  yin:b=>"No worries. I just didn't realise this counted as handling it. "+punct(b,"."),
  shade:b=>"No need for dramatic language; the facts already do the work: "+punct(b,"."),
  roast:b=>"I'm not following this plot any further. "+punct(b,"."),
  internet:b=>"TL;DR: "+punct(b,"."),
  meme:b=>"Let's stop adding difficulty to this level. "+punct(b,"."),
  blunt:b=>"I'll be blunt: "+punct(b,"."),
  rude:b=>"Stop dancing around it. "+punct(b,"."),
  raw:b=>"Cut the bullshit. "+punct(b,"."),
  cleanSwear:b=>"That's certainly a creative move, but I'm not taking it. "+punct(b,"."),
  fire:b=>"I'm not going to bottle this up or dance around it: "+punct(b,"."),
  earth:b=>"Let's deal with reality, not wishful thinking: "+punct(b,"."),
  air:b=>"This really isn't that complicated: "+punct(b,"."),
  water:b=>"I care about the feelings here, but there still needs to be a boundary: "+punct(b,"."),
  infj:b=>"I don't want to damage the relationship, but I won't erase myself to protect it: "+punct(b,"."),
  entp:b=>"Flip the roles for a second. Would you consider this reasonable? "+punct(b,"."),
  istj:b=>"Based on what was agreed and what actually happened: "+punct(b,"."),
  enfp:b=>"Let's not kill the mood; let's just solve the thing: "+punct(b,"."),
  boss:b=>"Bottom line: "+punct(b,"."),
  hr:b=>"From a collaboration and boundary standpoint, my position is: "+punct(b,"."),
  legal:b=>"For the avoidance of doubt, I'm stating this clearly: "+punct(b,"."),
  cultured:b=>"I'm happy to preserve dignity, but not by trading away my boundary: "+punct(b,"."),
  lowEQ:b=>"Here's where I stand, whether you like it or not: "+punct(b,"."),
  stoic:b=>"Put the feelings aside for a moment; the issue still needs handling: "+punct(b,"."),
  playful:b=>"Let's not turn this into a season finale. "+punct(b,"."),
  reverse:b=>"If the roles were reversed, would you accept this? "+punct(b,"."),
  hardStop:b=>"I'm not explaining this repeatedly: "+punct(b,"."),
  command:b=>"Handle it this way now: "+punct(b,"."),
  calmFirm:b=>"I'm not raising my voice, and I'm not backing off: "+punct(b,"."),
  minimal:b=>punct(b,".")
 },
 yue:{
  clarify:b=>"我講清楚先："+punct(b),
  empath:b=>"我明你可能有你原因，但"+punct(b),
  boundary:b=>"我條界線好簡單："+punct(b),
  consequence:b=>punct(b)+"唔係我就按而家安排處理。",
  question:b=>"所以而家你打算點處理？"+punct(b),
  face:b=>"之前嗰啲我先唔追，之後做好佢："+punct(b),
  soft:b=>"我唔想搞到太僵，所以直接講需要："+punct(b),
  professional:b=>"為免之後大家理解唔同，我確認一下："+punct(b),
  concise:b=>"一句講晒："+punct(b),
  detached:b=>"情緒擺埋一邊，淨係講件事："+punct(b),
  warm:b=>"我知大家都唔想搞到難睇，"+punct(b),
  assertive:b=>"我可以配合，但前提係："+punct(b),
  resigned:b=>"得，我都唔兜圈："+punct(b),
  dry:b=>"好，重點得一個："+punct(b),
  wry:b=>"睇嚟呢件事有自己時區。"+punct(b),
  sarcasm:b=>"原來咁樣都叫處理，明白晒。咁我都講清楚："+punct(b),
  tea:b=>"可能係我要求太高啦，不過"+punct(b),
  yin:b=>"冇事，我只係第一次知原來咁都算處理。"+punct(b),
  shade:b=>"唔使講得太重，件事本身已經夠清楚："+punct(b),
  roast:b=>"呢個劇情我唔追喇，"+punct(b),
  internet:b=>"省流："+punct(b),
  meme:b=>"呢個副本唔好再加難度，"+punct(b),
  blunt:b=>"我直講："+punct(b),
  rude:b=>"唔好兜啦，"+punct(b),
  raw:b=>"唔好再屌扯，"+punct(b),
  cleanSwear:b=>"呢個操作幾有創意，不過我唔接。"+punct(b),
  fire:b=>"我唔兜彎，亦唔忍住："+punct(b),
  earth:b=>"講現實，唔講幻想："+punct(b),
  air:b=>"件事其實冇咁複雜："+punct(b),
  water:b=>"我在意感受，但界線都要有："+punct(b),
  infj:b=>"我唔想傷關係，亦唔想委屈自己："+punct(b),
  entp:b=>"調轉角色諗下，你會覺得合理咩？"+punct(b),
  istj:b=>"按之前講好同實際發生嘅事："+punct(b),
  enfp:b=>"先唔好搞死氣氛，我哋解決件事："+punct(b),
  boss:b=>"結論先講："+punct(b),
  hr:b=>"由合作同界線角度，我立場係："+punct(b),
  legal:b=>"為免有歧義，我講清楚："+punct(b),
  cultured:b=>"我可以俾體面，但唔會用體面換底線："+punct(b),
  lowEQ:b=>"我句說話擺呢度："+punct(b),
  stoic:b=>"情緒擺埋一邊，件事一樣要處理："+punct(b),
  playful:b=>"先唔好演大結局，"+punct(b),
  reverse:b=>"調轉係你，你受唔受？"+punct(b),
  hardStop:b=>"我唔打算再解釋好多次："+punct(b),
  command:b=>"而家就咁處理："+punct(b),
  calmFirm:b=>"我唔嗌，但我都唔退："+punct(b),
  minimal:b=>punct(b)
 }
};

const PREF={
 clarify:["formal","matter-of-fact","clarify","direct","soft"],
 empath:["soft","warm","formal","considerate","reflective"],
 boundary:["boundary","direct","matter-of-fact","formal","hard-stop"],
 consequence:["boundary","deadline","direct","reprimand","matter-of-fact"],
 question:["question","clarify","gentle-ping","formal","soft"],
 face:["formal","soft","matter-of-fact","direct"],
 soft:["soft","warm","gentle-ping","formal","considerate"],
 professional:["formal","matter-of-fact","accountable","plan","steady"],
 concise:["short","shorter","tiny","brief","direct"],
 detached:["matter-of-fact","cold","direct","steady","formal"],
 warm:["warm","soft","considerate","formal"],
 assertive:["boundary","direct","hard-stop","reprimand","formal"],
 resigned:["dry","cold","direct","wry","matter-of-fact"],
 dry:["dry","wry","cold","short","direct"],
 wry:["wry","light-blame","roast","dark","mild-tease"],
 sarcasm:["yin","dark","roast","wry","light-blame","clean-swear"],
 tea:["tea","soft","warm","light-blame","formal"],
 yin:["yin","dark","wry","roast","light-blame"],
 shade:["dark","wry","matter-of-fact","light-blame","direct"],
 roast:["roast","wry","light-blame","mild-tease","humor"],
 internet:["short","shorter","tiny","roast","wry"],
 meme:["roast","humor","wry","light-blame","short"],
 blunt:["direct","hard-stop","reprimand","cold","short"],
 rude:["rude","reprimand","hard-stop","raw","direct"],
 raw:["raw","rude","reprimand","hard-stop","direct"],
 cleanSwear:["clean-swear","roast","wry","dark","reprimand"],
 fire:["direct","hard-stop","reprimand","boundary","raw"],
 earth:["matter-of-fact","formal","steady","plan","direct"],
 air:["clarify","question","wry","direct","formal"],
 water:["soft","reflective","warm","considerate","formal"],
 infj:["reflective","soft","boundary","considerate","formal"],
 entp:["question","wry","roast","direct","clarify"],
 istj:["matter-of-fact","formal","deadline","steady","direct"],
 enfp:["warm","playful","roast","soft","humor"],
 boss:["hard-stop","direct","deadline","reprimand","matter-of-fact"],
 hr:["formal","soft","matter-of-fact","boundary","professional"],
 legal:["formal","matter-of-fact","reprimand","boundary","direct"],
 cultured:["shade","formal","wry","boundary","matter-of-fact"],
 lowEQ:["rude","raw","reprimand","direct","hard-stop"],
 stoic:["matter-of-fact","cold","steady","direct","formal"],
 playful:["roast","humor","mild-tease","light-blame","wry"],
 reverse:["question","clarify","direct","boundary","wry"],
 hardStop:["hard-stop","reprimand","direct","rude","boundary"],
 command:["reprimand","hard-stop","direct","deadline","matter-of-fact"],
 calmFirm:["boundary","matter-of-fact","direct","steady","formal"],
 minimal:["shorter","short","tiny","brief","direct"]
};
const strategies=["clarify","empath","boundary","consequence","question","face","soft","professional","concise","detached","warm","assertive","resigned","dry","wry","sarcasm","tea","yin","shade","roast","internet","meme","blunt","rude","raw","cleanSwear","fire","earth","air","water","infj","entp","istj","enfp","boss","hr","legal","cultured","lowEQ","stoic","playful","reverse","hardStop","command","calmFirm","minimal"];

function safeStrategy(scene,name){
 if(sensitive.has(scene.domain)&&["rude","raw","yin","sarcasm","lowEQ"].includes(name)){
  return name==="raw"?"calmFirm":name==="rude"?"assertive":name==="lowEQ"?"concise":"professional";
 }
 if(protectedSoft.has(scene.domain)&&name==="raw") return "calmFirm";
 return name;
}
function authoredKeys(scene){
 return Object.keys(scene.replies?.zh||{}).filter(k=>!k.startsWith("persona-"));
}
function seedKey(scene,strategy,index){
 const available=authoredKeys(scene), prefs=PREF[strategy]||[];
 const hits=prefs.filter(k=>available.includes(k));
 if(hits.length)return hits[index%hits.length];
 return available[index%available.length];
}
for(const scene of scenes){
 const available=authoredKeys(scene);
 if(!available.length)continue;
 const existing=new Set(Object.keys(scene.replies.zh||{}));
 for(let i=0;i<strategies.length;i++){
  const key="persona-"+String(i+1).padStart(2,"0");
  if(existing.has(key))continue;
  const strategy=safeStrategy(scene,strategies[i]);
  const source=seedKey(scene,strategy,i);
  const zv=scene.replies.zh[source], ev=scene.replies.en[source], yv=scene.replies.yue[source];
  if(!zv||!zv.hant||!zv.hans||typeof ev!=="string"||typeof yv!=="string")continue;
  scene.replies.zh[key]=z(W.hant[strategy](zv.hant),W.hans[strategy](zv.hans));
  scene.replies.en[key]=W.en[strategy](ev);
  scene.replies.yue[key]=W.yue[strategy](yv);
  if(Object.keys(scene.replies.zh).length>=36)break;
 }
}
})();