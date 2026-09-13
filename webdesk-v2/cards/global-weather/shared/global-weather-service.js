export const layers=[{id:'wind',label:'風',unit:'km/h'},{id:'gust',label:'陣風',unit:'km/h'},{id:'rain',label:'降雨',unit:'%'},{id:'temp',label:'溫度',unit:'°C'}];
export function initialGlobalWeather(){return{place:'深圳',updatedAt:new Date().toISOString(),activeLayer:'wind',summary:{wind:18,gust:31,rain:42,temp:28},alerts:[]}}
export function layerById(id){return layers.find(x=>x.id===id)||layers[0]}
