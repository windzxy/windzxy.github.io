(()=>{
'use strict';
const VERSION='20260910-chess-academy-v1.0-zero-to-competition';
if(window.__windzxyChessAcademy===VERSION)return;
window.__windzxyChessAcademy=VERSION;
const LEVELS=[
 ['starter','啟蒙','認識棋盤、棋子、勝負目標與基本走法'],
 ['beginner','入門','吃子、將軍、解將、將死與特殊規則'],
 ['grade3','初級考級','一步殺、基本戰術、開局三原則'],
 ['grade2','中級考級','雙攻、牽制、串擊、二步殺與兵殘局'],
 ['grade1','高級考級','戰術組合、車兵殘局、局面評估與計算'],
 ['tournament','競賽','計時對局、棋譜閱讀、復盤與實戰決策'],
 ['master','大師挑戰','多步計算、經典名局與高難度殘局']
];
const LIBRARY=[
 ['零基礎','棋盤方向與 64 格','先確認右下角是淺色格，再學 a–h 檔與 1–8 橫線。'],
 ['零基礎','六種棋子','逐一學習王、后、車、象、馬、兵，並在棋盤點擊查看合法落點。'],
 ['規則','將軍與將死','分辨將軍、解將與將死；被將軍時不能走無關棋步。'],
 ['規則','王車易位','理解未移動、路徑無子、王不被將且不能穿越受攻擊格。'],
 ['規則','吃過路兵與升變','掌握兵的兩項特殊規則。'],
 ['戰術','一步殺','先找王的逃生格，再找受保護的將軍手段。'],
 ['戰術','雙攻與牽制','用一次走子同時製造兩個威脅，理解絕對牽制。'],
 ['殘局','王兵對王','學會對王、關鍵格與升變路線。'],
 ['殘局','車王殺單王','用車切割活動空間，國王逐步靠近完成將死。'],
 ['棋譜','棋譜與復盤入門','認識代數記譜，學會逐手回看並標記關鍵轉折。']
];
function getCard(node){const el=node?.closest?.('.desktop-card[data-card-id]');if(!el||typeof activeWorkspace!=='function')return null;return activeWorkspace().cards.find(c=>c.id===el.dataset.cardId)||null}
function state(card){card.data=card.data||{};card.data.chessAcademy=card.data.chessAcademy||{level:'starter',voice:true};return card.data.chessAcademy}
function persist(){try{save()}catch(_){}}
function speak(text){if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=(document.querySelector('.lang-select')?.value==='zh-CN')?'zh-CN':'zh-HK';u.rate=.92;u.pitch=1;window.speechSynthesis.speak(u)}
function installStyle(){if(document.getElementById('chess-academy-v1-style'))return;const s=document.createElement('style');s.id='chess-academy-v1-style';s.textContent=`
.chess-academy{display:grid;gap:8px}.chess-academy-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.chess-academy-head strong{font-size:12px}.chess-academy-voice{border:1px solid rgba(127,127,127,.22);border-radius:9px;padding:7px 9px;background:rgba(127,127,127,.08);color:inherit;font-weight:750;cursor:pointer}.chess-levels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.chess-level{border:1px solid rgba(127,127,127,.18);border-radius:10px;padding:8px;text-align:left;background:rgba(127,127,127,.06);color:inherit;cursor:pointer}.chess-level.active{border-color:rgba(56,189,248,.55);background:rgba(56,189,248,.14)}.chess-level b{display:block;font-size:11px}.chess-level small{display:block;margin-top:3px;font-size:8px;line-height:1.35;opacity:.6}.chess-library{display:grid;gap:5px;max-height:190px;overflow:auto}.chess-library button{display:grid;grid-template-columns:42px 1fr;gap:7px;border:0;border-radius:9px;padding:7px;background:rgba(127,127,127,.07);color:inherit;text-align:left;cursor:pointer}.chess-library em{font-style:normal;font-size:8px;opacity:.55}.chess-library b{font-size:10px}.chess-academy-note{font-size:9px;line-height:1.5;opacity:.65}.chess-academy-badges{display:flex;gap:4px;flex-wrap:wrap}.chess-academy-badges span{font-size:8px;padding:4px 6px;border-radius:999px;background:rgba(127,127,127,.09)}
@media(max-width:760px){.chess-levels{grid-template-columns:1fr}.chess-library{max-height:150px}}
`;document.head.appendChild(s)}
function panel(card){const st=state(card);return `<section class="chess-academy"><div class="chess-academy-head"><strong>棋類學院 · 從零到競賽</strong><button class="chess-academy-voice" data-chess-voice>${st.voice?'🔊 配音開':'🔇 配音關'}</button></div><div class="chess-levels">${LEVELS.map(x=>`<button class="chess-level ${st.level===x[0]?'active':''}" data-chess-level="${x[0]}"><b>${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div><div class="chess-academy-badges"><span>從零教學</span><span>殘局</span><span>棋譜</span><span>考級</span><span>比賽</span><span>復盤</span></div><div class="chess-library">${LIBRARY.map((x,i)=>`<button data-chess-library="${i}"><em>${x[0]}</em><span><b>${x[1]}</b><small>${x[2]}</small></span></button>`).join('')}</div><div class="chess-academy-note">第一階段先建立完整學習路徑與配音入口；後續逐項接入互動題、PGN 棋譜、殘局評分與競賽級 AI。</div></section>`}
function enhance(root=document){root.querySelectorAll?.('.chess-app').forEach(app=>{if(app.querySelector('.chess-academy'))return;const card=getCard(app);if(!card)return;const side=app.querySelector('.boardgame-side');if(!side)return;side.insertAdjacentHTML('afterbegin',panel(card))})}
function bind(){if(document.documentElement.dataset.chessAcademyBound==='1')return;document.documentElement.dataset.chessAcademyBound='1';document.addEventListener('click',e=>{const v=e.target.closest?.('[data-chess-voice]');if(v){const c=getCard(v);if(!c)return;const st=state(c);st.voice=!st.voice;persist();v.textContent=st.voice?'🔊 配音開':'🔇 配音關';if(st.voice)speak('配音教學已開啟。歡迎來到棋類學院，我們會從棋盤和棋子的最基本規則開始。');return}const l=e.target.closest?.('[data-chess-level]');if(l){const c=getCard(l);if(!c)return;const st=state(c);st.level=l.dataset.chessLevel;persist();l.closest('.chess-levels')?.querySelectorAll('.chess-level').forEach(x=>x.classList.toggle('active',x===l));const info=LEVELS.find(x=>x[0]===st.level);if(st.voice&&info)speak(info[1]+'。'+info[2]);return}const item=e.target.closest?.('[data-chess-library]');if(item){const c=getCard(item),info=LIBRARY[+item.dataset.chessLibrary];if(c&&info&&state(c).voice)speak(info[1]+'。'+info[2])}},true)}
function boot(){installStyle();bind();enhance();new MutationObserver(()=>enhance()).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskChessAcademy={version:VERSION,levels:LEVELS.map(x=>x[0]),voice:'Web Speech API',modules:['lessons','puzzles','notation','endgames','grades','tournament','review']};
})();