;(function(){
const S=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
window.CHAT_REVIEWED_REPLY_KEYS=window.CHAT_REVIEWED_REPLY_KEYS||{};

// These two were manually rewritten in catalog-bespoke-core1.js.
window.CHAT_REVIEWED_SCENES["w01"]=true;
window.CHAT_REVIEWED_SCENES["s02"]=true;

// Individually audited in reviewed batches 10–28 and new waves 3–23.
for(const id of ["w06","so03","s01","new13","new14","f02","fr07","t02","new15","w21","p09","sv07","new16","new17","st07","fa05","wave7-027","new18","new19","j05","tr03","so04","new20","new21","b03","fa03","on05","new22","new23","s04","p04","m02","new24","new25","w08","e03","sv02","new26","new27","fr06","r06","w17","new28","new29","p05","w16","m04","new30","new31","w10","p06","sv06","new32","new33","new34","w09","e04","on03","new35","new36","new37","new38","w15","fr04","on02","new39","new40","new41","new42","st06","b04","tr05","new43","new44","new45","new46","w18","p07","sv05","new47","new48","new49","new50","so01","fa01","j02","new51","new52","new53","new54","w19","w20","st08","new55","new56","new57","new58"]){
 window.CHAT_REVIEWED_SCENES[id]=true;
}

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
