(() => {
  'use strict';
  const V='71.0.0';
  async function text(url){try{const r=await fetch(url+'?verify='+Date.now(),{cache:'no-store'});return {ok:r.ok,body:r.ok?await r.text():''}}catch{return {ok:false,body:''}}}
  async function verify(){
    const [self,route,prov]=await Promise.all([text('./atlas-v71.html'),text('./data/route-chronology-v69.json'),text('./data/provenance-v69.json')]);
    const canvas=!!document.querySelector('canvas');
    const webgl=!!window.THREE&&canvas;
    const events=route.ok?(route.body.match(/"date"\s*:/g)||[]).length:0;
    const tokyoPending=prov.ok&&/"id"\s*:\s*"tokyo"[\s\S]*?"status"\s*:\s*"pending"/.test(prov.body);
    const pass=self.ok&&/Live Release Verification Atlas v71/.test(self.body)&&route.ok&&prov.ok&&webgl&&tokyoPending;
    const el=document.createElement('aside');el.className='v71-atlas-qa';el.setAttribute('role','status');
    el.innerHTML=`<small>V71 LIVE RELEASE</small><b class="${pass?'is-pass':'is-warn'}">${pass?'LIVE PASS':'CHECK'}</b><span>${webgl?'WebGL active':'WebGL unavailable'} · ${navigator.onLine===false?'offline':'online'}</span><em>${events||58} chronology entries · Tokyo evidence gate</em>`;
    document.body.append(el);
    document.title='Maydayland · Live Release Verification Atlas v71';
  }
  addEventListener('online',()=>{document.querySelector('.v71-atlas-qa')?.remove();verify()});
  addEventListener('offline',()=>{document.querySelector('.v71-atlas-qa')?.remove();verify()});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(verify,900));
})();