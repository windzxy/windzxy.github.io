(() => {
  'use strict';
  const nativeFetch=window.fetch.bind(window);
  window.fetch=(input,init)=>{
    const raw=typeof input==='string'?input:(input&&input.url)||'';
    if(raw.includes('route-chronology-v64.json')){
      const next=raw.replace(/route-chronology-v64\.json(?:\?[^#]*)?/,'route-chronology-v69.json?v=69.0.0');
      return nativeFetch(next,init);
    }
    return nativeFetch(input,init);
  };
})();