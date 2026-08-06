(() => {
  'use strict';
  if(document.body.dataset.page!=='home')return;
  const packs=window.WIND_CONTENT_PACKS_V10;
  if(!packs)return;
  const mount=()=>{
    if(document.querySelector('#v10-home-library'))return true;
    const anchor=document.querySelector('#v9-home-mission')||document.querySelector('.dashboard-head');
    if(!anchor)return false;
    let completed=0;
    try{completed=Object.keys(JSON.parse(localStorage.getItem('wind-content-library-v10')||'{}').completed||{}).length}catch{}
    const root=document.createElement('section');
    root.id='v10-home-library';
    root.innerHTML=`<div><span>海量课程库</span><h2>${packs.total.toLocaleString('zh-CN')} 个结构化学习单元</h2><p>覆盖15个学科、5个阶段，并连接持续更新的开放学习资源。课程按需加载，不会一次把全部内容塞进页面。</p></div><div><strong>${completed}</strong><span>已完成单元</span><a href="library.html">进入资料库</a></div>`;
    anchor.after(root);
    return true;
  };
  if(mount())return;
  const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),18000);
})();
