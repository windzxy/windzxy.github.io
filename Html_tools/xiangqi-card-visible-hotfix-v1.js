/* Xiangqi Function Center visibility hotfix v1.0 */
(function(){
  'use strict';
  var id='xiangqi';
  function ensure(){
    if(!Array.isArray(window.apps))return;
    var exists=window.apps.some(function(a){return a&&a.id===id;});
    if(!exists)window.apps.push({id:id,kind:'widget',title:'中國象棋',desc:'完整規則、教學、人機、雙人、殘局與棋譜。',icon:'象',tone:'t-xiangqi',category:'棋類'});
    if(typeof window.renderShelf==='function'){
      try{window.renderShelf();}catch(e){}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
  setTimeout(ensure,250);setTimeout(ensure,1000);setTimeout(ensure,2500);
})();