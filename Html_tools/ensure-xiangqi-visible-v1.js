/* WebDesk ensure Xiangqi visible v1.0 — 2026-09-11 */
(function(){
  'use strict';
  var ID='xiangqi';
  function app(){return Array.isArray(window.apps)&&window.apps.find(function(a){return a&&a.id===ID;});}
  function install(){
    if(!Array.isArray(window.apps))return false;
    if(!app())window.apps.push({id:ID,kind:'widget',title:'中國象棋',desc:'完整規則、教學、人機、雙人、殘局與棋譜。',icon:'象',tone:'t-xiangqi',category:'棋類'});
    try{if(typeof window.renderShelf==='function')window.renderShelf();}catch(e){}
    return true;
  }
  function run(){if(!install())setTimeout(run,100);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  [300,900,1800,3500].forEach(function(ms){setTimeout(install,ms);});
})();