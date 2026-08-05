(async()=>{
  const V='7.0.0';
  const load=async(prefix,count)=>{
    const parts=await Promise.all(Array.from({length:count},(_,i)=>fetch(`./${prefix}-${i}.txt?v=${V}`,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(`${prefix}-${i}:${r.status}`);return r.text()})));
    const raw=Uint8Array.from(atob(parts.join('')),c=>c.charCodeAt(0));
    if(!('DecompressionStream'in window))throw Error('此瀏覽器不支援網站解包功能，請更新瀏覽器。');
    return new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  };
  try{
    const [css,js]=await Promise.all([load('css',2),load('app',3)]);
    const style=document.createElement('style');style.dataset.bundle='maydayland-7';style.textContent=css;document.head.append(style);
    const url=URL.createObjectURL(new Blob([js],{type:'text/javascript'}));
    await import(url);URL.revokeObjectURL(url);
    document.documentElement.classList.add('bundle-ready');
  }catch(error){
    console.error(error);document.documentElement.classList.add('bundle-error');
    const box=document.createElement('div');box.className='bundle-error-box';box.innerHTML=`<b>Maydayland 載入失敗</b><span>${String(error.message||error)}</span><button onclick="location.reload()">重新載入</button>`;document.body.append(box);
  }
})();