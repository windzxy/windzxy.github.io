const CITY_SOURCE='gw-city-labels';
const CITY_LAYERS=['gw-city-labels-major','gw-city-labels-regional','gw-city-labels-local'];
const WEATHER_SOURCE='gw-weather-field';
const WEATHER_HEAT={temp:'gw-weather-heat-temp',rain:'gw-weather-heat-rain',pressure:'gw-weather-heat-pressure'};

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

const PALETTES={
  temp:['interpolate',['linear'],['heatmap-density'],0,'rgba(44,55,110,0)',0.12,'rgba(70,101,196,.30)',0.28,'rgba(65,167,214,.48)',0.46,'rgba(79,193,153,.60)',0.64,'rgba(238,211,91,.72)',0.82,'rgba(239,137,63,.82)',1,'rgba(211,67,78,.92)'],
  rain:['interpolate',['linear'],['heatmap-density'],0,'rgba(19,48,80,0)',0.10,'rgba(61,155,210,.26)',0.28,'rgba(52,184,198,.50)',0.48,'rgba(74,111,215,.66)',0.68,'rgba(111,73,190,.76)',0.84,'rgba(185,70,176,.84)',1,'rgba(236,80,120,.92)'],
  pressure:['interpolate',['linear'],['heatmap-density'],0,'rgba(48,56,86,0)',0.12,'rgba(74,105,166,.30)',0.30,'rgba(82,164,188,.48)',0.50,'rgba(107,191,147,.60)',0.70,'rgba(221,199,92,.72)',0.86,'rgba(213,139,78,.82)',1,'rgba(183,85,92,.90)']
};

function heatWeight(layer){
  if(layer==='rain')return['interpolate',['linear'],['get','value'],0,0,.2,.15,2,.38,8,.68,20,.88,50,1];
  if(layer==='pressure')return['interpolate',['linear'],['get','value'],970,.20,990,.38,1010,.58,1025,.76,1045,1];
  return['interpolate',['linear'],['get','value'],-25,.18,-5,.34,10,.50,22,.68,32,.84,42,1];
}

function cityLayer(id,rank,minzoom){return{
  id,type:'symbol',source:CITY_SOURCE,minzoom,
  filter:['==',['get','rank'],rank],
  layout:{
    'text-field':['get','name'],
    'text-size':['interpolate',['linear'],['zoom'],2,11,4.5,12.5,7,14,10,15],
    'text-font':['Noto Sans Regular'],
    'text-allow-overlap':false,
    'text-ignore-placement':false,
    'text-padding':['interpolate',['linear'],['zoom'],2,8,8,4],
    'symbol-sort-key':['get','rank']
  },
  paint:{'text-color':'#ffffff','text-halo-color':'rgba(14,20,30,.92)','text-halo-width':2,'text-halo-blur':0.6}
}}

function heatLayer(layer,id){return{
  id,type:'heatmap',source:WEATHER_SOURCE,maxzoom:9,filter:['==',['get','layer'],layer],
  paint:{
    'heatmap-weight':heatWeight(layer),
    'heatmap-intensity':['interpolate',['linear'],['zoom'],1.5,1.0,5,1.45,8,1.9],
    'heatmap-radius':['interpolate',['linear'],['zoom'],2,46,5,78,8,118],
    'heatmap-opacity':['interpolate',['linear'],['zoom'],1.5,0.86,6,0.68,9,0.30],
    'heatmap-color':PALETTES[layer]
  }
}}

export function attachMapVisualEnhancements(mapApi){
  const map=mapApi?.map;
  if(!map||mapApi?.isFallback)return{destroy(){}};
  let destroyed=false;

  const ensureCityLabels=()=>{
    if(destroyed||!map.isStyleLoaded?.())return;
    try{
      if(!map.getSource(CITY_SOURCE))map.addSource(CITY_SOURCE,{type:'geojson',data:cityGeoJSON});
      const specs=[cityLayer(CITY_LAYERS[0],1,1.7),cityLayer(CITY_LAYERS[1],2,3),cityLayer(CITY_LAYERS[2],3,5)];
      specs.forEach(spec=>{if(!map.getLayer(spec.id))map.addLayer(spec)});
    }catch(e){console.warn('[Global Weather city labels]',e)}
  };

  const ensureWeatherHeat=()=>{
    if(destroyed||!map.isStyleLoaded?.()||!map.getSource(WEATHER_SOURCE))return;
    try{
      const before=map.getLayer('gw-weather-field-circles')?'gw-weather-field-circles':undefined;
      Object.entries(WEATHER_HEAT).forEach(([layer,id])=>{if(!map.getLayer(id))map.addLayer(heatLayer(layer,id),before)});
      ensureCityLabels();
      CITY_LAYERS.forEach(id=>{if(map.getLayer(id))map.moveLayer(id)});
    }catch(e){console.warn('[Global Weather heat layer]',e)}
  };

  const refresh=()=>{ensureCityLabels();ensureWeatherHeat()};
  const onSource=e=>{if(e?.sourceId===WEATHER_SOURCE)ensureWeatherHeat()};
  map.on('style.load',refresh);
  map.on('idle',refresh);
  map.on('sourcedata',onSource);
  refresh();
  return{refresh,destroy(){destroyed=true;try{map.off('style.load',refresh);map.off('idle',refresh);map.off('sourcedata',onSource)}catch{}}};
}
