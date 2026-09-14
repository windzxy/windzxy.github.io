const CITY_SOURCE='gw-city-labels';
const CITY_LAYERS=['gw-city-labels-major','gw-city-labels-regional','gw-city-labels-local'];
const TYPHOON_FIRST='gw-typhoon-past-line';
const CITIES=[
  ['深圳',114.0579,22.5431,1],['香港',114.1694,22.3193,1],['廣州',113.2644,23.1291,1],['澳門',113.5439,22.1987,2],
  ['台北',121.5654,25.0330,1],['上海',121.4737,31.2304,1],['北京',116.4074,39.9042,1],['成都',104.0665,30.5728,2],
  ['武漢',114.3054,30.5931,2],['杭州',120.1551,30.2741,2],['南京',118.7969,32.0603,2],['重慶',106.5516,29.5630,2],
  ['東京',139.6917,35.6895,1],['大阪',135.5023,34.6937,2],['首爾',126.9780,37.5665,1],['新加坡',103.8198,1.3521,1],
  ['曼谷',100.5018,13.7563,2],['河內',105.8342,21.0278,3],['胡志明市',106.6297,10.8231,3],['馬尼拉',120.9842,14.5995,2],
  ['雅加達',106.8456,-6.2088,2],['吉隆坡',101.6869,3.1390,2],['悉尼',151.2093,-33.8688,1],['墨爾本',144.9631,-37.8136,2],
  ['倫敦',-0.1276,51.5072,1],['巴黎',2.3522,48.8566,1],['柏林',13.4050,52.5200,2],['紐約',-74.0060,40.7128,1],
  ['洛杉磯',-118.2437,34.0522,2],['舊金山',-122.4194,37.7749,3],['溫哥華',-123.1207,49.2827,3],['多倫多',-79.3832,43.6532,2]
];
const cityGeoJSON={type:'FeatureCollection',features:CITIES.map(([name,lon,lat,rank])=>({type:'Feature',geometry:{type:'Point',coordinates:[lon,lat]},properties:{name,rank}}))};
function cityLayer(id,rank,minzoom){return{id,type:'symbol',source:CITY_SOURCE,minzoom,filter:['==',['get','rank'],rank],layout:{'text-field':['get','name'],'text-size':['interpolate',['linear'],['zoom'],2,11,4.5,12.5,7,14,10,15],'text-font':['Noto Sans Regular'],'text-allow-overlap':false,'text-ignore-placement':false,'text-padding':['interpolate',['linear'],['zoom'],2,8,8,4],'symbol-sort-key':['get','rank']},paint:{'text-color':'#ffffff','text-halo-color':'rgba(14,20,30,.92)','text-halo-width':2,'text-halo-blur':0.6}}}
function isBaseCityLayer(layer){
  if(!layer||layer.type!=='symbol'||CITY_LAYERS.includes(layer.id)||String(layer.id).startsWith('gw-'))return false;
  const id=String(layer.id||'').toLowerCase();
  const text=JSON.stringify(layer.layout?.['text-field']??'').toLowerCase();
  if(!text)return false;
  return /(^|[-_])(city|town)([-_]|$)/.test(id)||/place[-_](city|town)/.test(id)||/settlement[-_](city|town)/.test(id);
}
export function attachMapVisualEnhancements(mapApi){
  const map=mapApi?.map;if(!map||mapApi?.isFallback)return{destroy(){}};let destroyed=false;
  const suppressBaseCityLabels=()=>{for(const layer of map.getStyle?.()?.layers||[]){if(!isBaseCityLayer(layer))continue;try{map.setLayoutProperty(layer.id,'visibility','none')}catch{}}};
  const orderCityLabels=()=>{const before=map.getLayer(TYPHOON_FIRST)?TYPHOON_FIRST:undefined;for(const id of CITY_LAYERS){if(!map.getLayer(id))continue;try{before?map.moveLayer(id,before):map.moveLayer(id)}catch{}}};
  const refresh=()=>{if(destroyed||!map.isStyleLoaded?.())return;try{
    suppressBaseCityLabels();
    if(!map.getSource(CITY_SOURCE))map.addSource(CITY_SOURCE,{type:'geojson',data:cityGeoJSON});
    const specs=[cityLayer(CITY_LAYERS[0],1,1.7),cityLayer(CITY_LAYERS[1],2,3),cityLayer(CITY_LAYERS[2],3,5)];
    specs.forEach(spec=>{if(!map.getLayer(spec.id))map.addLayer(spec)});
    orderCityLabels();
  }catch(e){console.warn('[Global Weather city labels]',e)}};
  map.on('style.load',refresh);refresh();
  return{refresh,destroy(){destroyed=true;try{map.off('style.load',refresh)}catch{}}};
}
