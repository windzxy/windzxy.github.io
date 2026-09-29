;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
window.CHAT_REVIEWED_REPLY_KEYS=window.CHAT_REVIEWED_REPLY_KEYS||{};

// These two were manually rewritten in catalog-bespoke-core1.js.
window.CHAT_REVIEWED_SCENES["w01"]=true;
window.CHAT_REVIEWED_SCENES["s02"]=true;

for(const s of S){
 if(!window.CHAT_REVIEWED_SCENES[s.id])continue;
 const zh=Object.keys(s.replies?.zh||{});
 const en=Object.keys(s.replies?.en||{});
 const yue=Object.keys(s.replies?.yue||{});
 const same=zh.length>=30 &&
   JSON.stringify([...zh].sort())===JSON.stringify([...en].sort()) &&
   JSON.stringify([...zh].sort())===JSON.stringify([...yue].sort());
 if(!same){
   delete window.CHAT_REVIEWED_SCENES[s.id];
   continue;
 }
 window.CHAT_REVIEWED_REPLY_KEYS[s.id]=zh.slice();
}
})();