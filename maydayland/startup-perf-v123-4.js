(()=>{'use strict';
const VER='20260901-maydayland-startup-perf-v123.4';
if(window.__maydaylandStartupPerf===VER)return;
window.__maydaylandStartupPerf=VER;
const originalFetch=window.fetch.bind(window);
const queues={songs:[],books:[]};
function page(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home'}
function classify(input){const u=typeof input==='string'?input:(input&&input.url)||'';if(/itunes\.apple\.com\/search/i.test(u))return'songs';if(/googleapis\.com\/books\/v1\/volumes/i.test(u))return'books';return''}
function flush(kind){const q=queues[kind];if(!q?.length)return;const pending=q.splice(0);for(const job of pending)originalFetch(job.input,job.init).then(job.resolve,job.reject)}
function flushCurrent(){const p=page();if(p==='songs')flush('songs');if(p==='books')flush('books')}
window.fetch=function(input,init){const kind=classify(input);if(!kind)return originalFetch(input,init);if(page()===kind)return originalFetch(input,init);return new Promise((resolve,reject)=>queues[kind].push({input,init,resolve,reject}))};
window.addEventListener('hashchange',()=>setTimeout(flushCurrent,0));
window.addEventListener('pageshow',flushCurrent,{once:true});
document.addEventListener('click',e=>{const p=e.target.closest?.('[data-page]')?.dataset?.page;if(p==='songs'||p==='books')setTimeout(()=>flush(p),0)},true);
document.documentElement.dataset.maydaylandStartupPerf='v123.4';
window.MAYDAYLAND_STARTUP_PERF={version:'v123.4',deferred:['itunes-song-search','google-books-covers'],flush:flushCurrent};
})();