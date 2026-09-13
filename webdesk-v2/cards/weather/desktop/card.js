export async function mount({host,sdk}){
  host.innerHTML=`<section class="weather-v2 weather-v2-desktop"><div><small>DESKTOP WEATHER</small><h3>24°</h3><p>多雲 · 體感 25°</p></div><div class="weather-v2-grid"><span>最高 27°</span><span>最低 21°</span><span>降雨 20%</span><span>風速 12 km/h</span></div><button type="button" data-open-weather>查看完整天氣</button></section>`;
  const button=host.querySelector('[data-open-weather]');button?.addEventListener('click',sdk.openApp);
  return()=>button?.removeEventListener('click',sdk.openApp);
}
