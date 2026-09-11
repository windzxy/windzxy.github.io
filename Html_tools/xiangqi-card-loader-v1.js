/* WebDesk Xiangqi resilient loader v1.0 — 2026-09-11 */
(function(){
  'use strict';
  var ID='xiangqi';
  var SRC='Html_tools/xiangqi-card-v1.js?v=20260910-xiangqi-v1.0-learn-play';
  function hasApp(){
    try{return Array.isArray(window.apps)&&window.apps.some(function(a){return a&&a.id===ID;});}catch(e){return false;}
  }
  function repaint(){
    try{if(typeof window.renderShelf==='function')window.renderShelf();}catch(e){}
    try{document.dispatchEvent(new CustomEvent('webdesk:apps-changed',{detail:{appId:ID}}));}catch(e){}
  }
  function ensureApp(){
    if(hasApp()){repaint();return;}
    if(!Array.isArray(window.apps)){setTimeout(ensureApp,80);return;}
    window.apps.push({id:ID,kind:'widget',title:'中國象棋',desc:'完整規則、教學、人機、雙人、殘局與棋譜。',icon:'象',tone:'t-xiangqi',category:'棋類'});
    repaint();
  }
  function loadModule(){
    var already=[].slice.call(document.scripts).some(function(s){return (s.src||'').indexOf('xiangqi-card-v1.js')>=0;});
    if(already){ensureApp();return;}
    var s=document.createElement('script');
    s.src=SRC;
    s.async=false;
    s.onload=function(){setTimeout(ensureApp,0);};
    s.onerror=function(){ensureApp();};
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadModule,{once:true});
  else loadModule();
  setTimeout(ensureApp,500);
  setTimeout(ensureApp,1800);
})();