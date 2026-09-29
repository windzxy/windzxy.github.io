// A finite, non-repeating shuffle bag for each card and reply language.
(function(root){
 function create(random){
  var states=Object.create(null);
  random=random||Math.random;
  function state(id,keys){
   if(!states[id]){
    var remaining=keys.slice(1);
    for(var i=remaining.length-1;i>0;i--){
     var j=Math.floor(random()*(i+1));
     var temp=remaining[i];remaining[i]=remaining[j];remaining[j]=temp;
    }
    states[id]={current:keys[0],remaining:remaining};
   }
   return states[id];
  }
  return {
   current:function(id,keys){return keys.length?(states[id]?states[id].current:keys[0]):null},
   advance:function(id,keys){
    if(!keys.length)return null;
    var s=state(id,keys);
    if(!s.remaining.length)return null;
    s.current=s.remaining.pop();
    return s.current;
   },
   exhausted:function(id,keys){return keys.length<2||!!(states[id]&&!states[id].remaining.length)}
  };
 }
 root.ChatReplyCycle=create;
 if(typeof module!=="undefined"&&module.exports)module.exports=create;
})(typeof window!=="undefined"?window:globalThis);
