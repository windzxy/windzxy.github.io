(function(){
  'use strict';
  function card(){
    var box=document.createElement('section');
    box.className='knowledge-entry';
    box.setAttribute('aria-label','智能知识图谱与诊断');
    box.innerHTML='<div class="knowledge-entry__grid"><div><div class="knowledge-entry__eyebrow">智能诊断 · NEW</div><h2>先找到真正没学会的那一步</h2><p>从目标知识点开始自适应出题。答错后先用同级题确认，再沿先修关系逐层回溯，定位薄弱根因，并生成按学习顺序排列的补学路径。</p><div class="knowledge-entry__actions"><a class="knowledge-entry__btn knowledge-entry__btn--primary" href="math-path/diagnose/">开始诊断</a><a class="knowledge-entry__btn" href="math-path/explore/">浏览知识图谱</a></div></div><div class="knowledge-entry__stats"><div class="knowledge-entry__stat"><strong>827</strong><span>数学知识点</span></div><div class="knowledge-entry__stat"><strong>1,364</strong><span>先修关系</span></div><div class="knowledge-entry__stat"><strong>3,455</strong><span>诊断题目</span></div><div class="knowledge-entry__stat"><strong>1–14</strong><span>小学至选必三</span></div></div><p class="knowledge-entry__note">诊断数据为 AI 生成初稿，适合辅助学习与发现线索，仍需结合教材和教师判断。</p></div>';
    return box;
  }
  function mount(){
    var app=document.getElementById('app');
    if(!app||!app.firstElementChild)return;
    if(!app.querySelector('.knowledge-entry'))app.insertBefore(card(),app.firstChild);
    var nav=document.querySelector('.side-nav');
    if(nav&&!nav.querySelector('.math-path-nav')){
      var link=document.createElement('a');
      link.className='math-path-nav';
      link.href='math-path/';
      link.innerHTML='<b>⌘</b><span>知识图谱</span>';
      var courses=nav.querySelector('[data-nav="courses"]');
      if(courses&&courses.nextSibling)nav.insertBefore(link,courses.nextSibling);else nav.appendChild(link);
    }
  }
  var tries=0,timer=setInterval(function(){mount();if(++tries>80)clearInterval(timer);},125);
  var observer=new MutationObserver(function(){requestAnimationFrame(mount);});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(function(){observer.disconnect();mount();},15000);
  document.addEventListener('DOMContentLoaded',mount);
})();
