export async function mount({host,sdk}){
  host.innerHTML=`<section class="weather-v2 weather-v2-mobile"><div class="weather-v2-mobile-top"><div><small>MOBILE WEATHER</small><strong>24°</strong></div><span>多雲</span></div><div class="weather-v2-mobile-meta"><span>27° / 21°</span><span>降雨 20%</span></div><button type="button" data-open-weather>查看天氣</button></section>`;
  const button=host.querySelector('[data-open-weather]');button?.addEventListener('click',sdk.openApp);
  return()=>button?.removeEventListener('click',sdk.openApp);
}
