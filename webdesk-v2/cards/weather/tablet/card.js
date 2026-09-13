export async function mount({host,sdk}){
  host.innerHTML=`<section class="weather-v2 weather-v2-tablet"><div class="weather-v2-tablet-main"><small>TABLET WEATHER</small><strong>24°</strong><span>多雲 · 體感 25°</span></div><div class="weather-v2-tablet-strip"><span>27° / 21°</span><span>降雨 20%</span><span>風 12 km/h</span></div><button type="button" data-open-weather>展開天氣</button></section>`;
  const button=host.querySelector('[data-open-weather]');button?.addEventListener('click',sdk.openApp);
  return()=>button?.removeEventListener('click',sdk.openApp);
}
