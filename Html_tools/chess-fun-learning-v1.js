(()=>{
'use strict';
const VERSION='20260910-chess-fun-learning-v1.0-missions-stars-hints';
if(window.__windzxyChessFunLearning===VERSION)return;
window.__windzxyChessFunLearning=VERSION;

const MISSIONS={
 chess:[
  {icon:'🏰',title:'找到你的國王',goal:'點一下棋盤上的白方國王。',hint:['國王通常站在第一排中央附近。','找有十字王冠的白色棋子。'],piece:'K'},
  {icon:'🐴',title:'騎士跳跳樂',goal:'找出白馬，看看它可以跳到哪些格子。',hint:['馬走 L 形，而且可以跳過棋子。','白馬開局在 b1 與 g1。'],piece:'N'},
  {icon:'🎯',title:'一步將軍',goal:'在教學棋盤中找一手能形成將軍的走法。',hint:['先看對方國王在哪裡。','直線棋子與后通常最容易製造將軍。']},
  {icon:'👑',title:'守護國王',goal:'被將軍時，只走能解除將軍的棋步。',hint:['可以逃王、吃掉攻擊子或阻擋攻擊線。','先點國王，看安全格。']}
 ],
 xiangqi:[
  {icon:'🎖️',title:'找到主帥',goal:'點一下紅方的帥。',hint:['帥只能在九宮內活動。','紅帥位於己方底線中央。'],piece:'K'},
  {icon:'🐎',title:'破解蹩馬腿',goal:'點一匹馬，觀察哪些位置被棋子卡住。',hint:['中國象棋的馬不能跳過「馬腿」。','先看馬旁邊正交方向是否有棋子。'],piece:'N'},
  {icon:'💥',title:'炮架挑戰',goal:'找出一個「隔一子吃子」的炮擊機會。',hint:['炮平時像車一樣走。','吃子時中間必須剛好隔一枚棋子。'],piece:'C'},
  {icon:'🌊',title:'過河小兵',goal:'讓兵卒過河，看看它多了哪個方向。',hint:['未過河前只能向前。','過河後可以左右走，但仍不能後退。'],piece:'P'}
 ]
};
function cardOf(n){const el=n?.closest?.('.desktop-card[data-card-id]');if(!el||typeof activeWorkspace!=='function')return null;return activeWorkspace().cards.find(c=>c.id===el.dataset.cardId)||null}
function data(card,kind){card.data=card.data||{};card.data.funLearning=card.data.funLearning||{};return card.data.funLearning[kind]||(card.data.funLearning[kind]={mission:0,stars:0,streak:0,hints:0,completed:{}})}
function saveNow(){try{save()}catch(_){}}
function speak(text){if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=document.querySelector('.lang-select')?.value==='zh-CN'?'zh-CN':'zh-HK';u.rate=.94;u.pitch=1.05;window.speechSynthesis.speak(u)}
function isVoice(card,kind){if(kind==='chess')return card.data?.chessAcademy?.voice!==false;return card.data?.xiangqi?.voice!==false}
function installStyle(){if(document.getElementById('chess-fun-learning-v1-style'))return;const s=document.createElement('style');s.id='chess-fun-learning-v1-style';s.textContent=`
.fun-learn{display:grid;gap:8px;padding:10px;border-radius:14px;background:linear-gradient(145deg,rgba(56,189,248,.12),rgba(168,85,247,.08));border:1px solid rgba(56,189,248,.2)}
.fun-learn-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.fun-learn-title{display:flex;align-items:center;gap:7px}.fun-learn-title i{font-style:normal;font-size:22px}.fun-learn-title b{display:block;font-size:12px}.fun-learn-title small{display:block;font-size:8px;opacity:.6;margin-top:2px}.fun-score{font-size:10px;font-weight:800;white-space:nowrap}.fun-goal{font-size:10px;line-height:1.55;padding:8px;border-radius:10px;background:rgba(127,127,127,.08)}
.fun-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px}.fun-actions button{border:0;border-radius:9px;padding:8px;background:rgba(127,127,127,.12);color:inherit;font-weight:800;cursor:pointer}.fun-actions button.primary{background:rgba(56,189,248,.18)}.fun-feedback{min-height:16px;font-size:9px;line-height:1.45}.fun-feedback.good{color:#22c55e}.fun-feedback.try{color:#f59e0b}.fun-progress{height:5px;border-radius:999px;background:rgba(127,127,127,.12);overflow:hidden}.fun-progress>span{display:block;height:100%;background:currentColor;opacity:.55;transition:width .25s ease}.fun-celebrate{animation:funPop .45s ease}@keyframes funPop{0%{transform:scale(.96)}55%{transform:scale(1.03)}100%{transform:scale(1)}}
@media(max-width:760px){.fun-learn{padding:8px}.fun-actions button{padding:9px 6px}}
`;document.head.appendChild(s)}
function missionPanel(card,kind){const st=data(card,kind),arr=MISSIONS[kind],m=arr[st.mission%arr.length],done=Object.keys(st.completed).length;return `<section class="fun-learn" data-fun-kind="${kind}"><div class="fun-learn-head"><div class="fun-learn-title"><i>${m.icon}</i><span><b>趣味任務 · ${m.title}</b><small>玩中學 · 第 ${st.mission%arr.length+1}/${arr.length} 關</small></span></div><span class="fun-score">⭐ ${st.stars} · 🔥 ${st.streak}</span></div><div class="fun-goal">${m.goal}</div><div class="fun-progress"><span style="width:${Math.round(done/arr.length*100)}%"></span></div><div class="fun-feedback" data-fun-feedback>完成任務可獲得 ⭐，不用背規則。</div><div class="fun-actions"><button data-fun-hint>💡 提示</button><button class="primary" data-fun-next>換一關 ↻</button></div></section>`}
function enhance(){document.querySelectorAll('.chess-app,.xiangqi-app').forEach(app=>{const kind=app.classList.contains('xiangqi-app')?'xiangqi':'chess';if(app.querySelector('.fun-learn'))return;const card=cardOf(app);if(!card)return;const side=app.querySelector('.boardgame-side');if(side)side.insertAdjacentHTML('afterbegin',missionPanel(card,kind))})}
function rerenderPanel(panel,card,kind){const box=document.createElement('div');box.innerHTML=missionPanel(card,kind);panel.replaceWith(box.firstElementChild)}
function feedback(panel,text,cls){const f=panel?.querySelector('[data-fun-feedback]');if(!f)return;f.textContent=text;f.className='fun-feedback '+(cls||'')}
function complete(panel,card,kind){const st=data(card,kind),idx=st.mission%MISSIONS[kind].length,key=String(idx);if(!st.completed[key]){st.completed[key]=1;st.stars+=Math.max(1,3-Math.min(2,st.hints));st.streak++;}st.hints=0;saveNow();panel.classList.add('fun-celebrate');feedback(panel,'🎉 任務完成！獲得星星，連勝繼續！','good');if(isVoice(card,kind))speak('太棒了，任務完成！你已經掌握這個重點。')}
function bind(){if(document.documentElement.dataset.chessFunLearningBound==='1')return;document.documentElement.dataset.chessFunLearningBound='1';document.addEventListener('click',e=>{
 const hint=e.target.closest?.('[data-fun-hint]');if(hint){const panel=hint.closest('.fun-learn'),kind=panel.dataset.funKind,card=cardOf(hint);if(!card)return;const st=data(card,kind),m=MISSIONS[kind][st.mission%MISSIONS[kind].length],h=m.hint[Math.min(st.hints,m.hint.length-1)];st.hints++;saveNow();feedback(panel,'💡 '+h,'try');if(isVoice(card,kind))speak(h);return}
 const next=e.target.closest?.('[data-fun-next]');if(next){const panel=next.closest('.fun-learn'),kind=panel.dataset.funKind,card=cardOf(next);if(!card)return;const st=data(card,kind);st.mission=(st.mission+1)%MISSIONS[kind].length;st.hints=0;saveNow();rerenderPanel(panel,card,kind);const m=MISSIONS[kind][st.mission];if(isVoice(card,kind))speak(m.title+'。'+m.goal);return}
 const sq=e.target.closest?.('.chess-square,.xiangqi-point,.xiangqi-cell,[data-xiangqi-square],[data-xiangqi-cell]');if(sq){const app=sq.closest('.chess-app,.xiangqi-app');if(!app)return;const kind=app.classList.contains('xiangqi-app')?'xiangqi':'chess',panel=app.querySelector('.fun-learn'),card=cardOf(sq);if(!panel||!card)return;const st=data(card,kind),m=MISSIONS[kind][st.mission%MISSIONS[kind].length];let code='';if(kind==='chess'){const label=sq.getAttribute('aria-label')||'';code=(label.match(/\s([KQRBNPkqrbnp])$/)||[])[1]||''}else{code=sq.dataset.piece||sq.querySelector('[data-piece]')?.dataset.piece||''}
   if(m.piece&&code&&code.toUpperCase()===m.piece)complete(panel,card,kind);else if(m.piece&&code){st.streak=0;saveNow();feedback(panel,'再試一次～這枚棋子不是本關目標。先觀察它的名字或使用提示。','try');if(isVoice(card,kind))speak('差一點，再試一次。先觀察棋子的名字和位置。')}
 }
},true)}
function boot(){installStyle();bind();enhance();new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskChessFunLearning={version:VERSION,features:['missions','stars','streak','progressive-hints','voice-feedback'],games:['chess','xiangqi']};
})();