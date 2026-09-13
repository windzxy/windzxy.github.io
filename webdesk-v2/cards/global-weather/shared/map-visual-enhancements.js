const CITY_SOURCE='gw-city-labels';
const CITY_LAYER='gw-city-labels-symbol';
const WEATHER_SOURCE='gw-weather-field';
const WEATHER_HEAT='gw-weather-field-heat';

const CITIES=[
  ['深圳',114.0579,22.5431],['香港',114.1694,22.3193],['廣州',113.2644,23.1291],['澳門',113.5439,22.1987],
  ['台北',121.5654,25.0330],['上海',121.4737,31.2304],['北京',116.4074,39.9042],['成都',104.0665,30.5728],
  ['武漢',114.3054,30.5931],['杭州',120.1551,30.2741],['南京',118.7969,32.0603],['重慶',106.5516,29.5630],
  ['東京',139.6917,35.6895],['大阪',135.5023,34.6937],['首爾',126.9780,37.5665],['新加坡',103.8198,1.3521],
  ['曼谷',100.5018,13.7563],['河內',105.8342,21.0278],['胡志明市',106.6297,10.8231],['馬尼拉',120.9842,14.5995],
  ['雅加達',106.8456,-6.2088],['吉隆坡',101.6869,3.1390],['悉尼',151.2093,-33.8688],['墨爾本',144.9631,-37.8136],
  ['倫敦',-0.1276,51.5072],['巴黎',2.3522,48.8566],['柏林',13.4050,52.5200],['紐約',-74.0060,40.7128],
  ['洛杉磯',-118.2437,34.0522],['舊金山',-122.4194,37.7749],['溫哥華',-123.1207,49.2827],['多倫多',-79.3832,43.6532]
];

const cityGeoJSON={type:'FeatureCollection',features:CITIES.map(([name,lon,lat])=>({type:'Feature',geometry:{type:'Point',coordinates:[lon,lat]},properties:{name}}))};

function heatWeight(){return['interpolate',['linear'],['get','value'],0,0.05,1,0.18,10,0.45,30,0.78,60,1]}

export function attachMapVisualEnhancements(mapApi){
  const map=mapApi?.map;
  if(!map||mapApi?.isFallback)return{destroy(){}};
  let destroyed=false;

  const ensureCityLabels=()=>{
    if(destroyed||!map.isStyleLoaded?.())return;
    try{
      if(!map.getSource(CITY_SOURCE))map.addSource(CITY_SOURCE,{type:'geojson',data:cityGeoJSON});
      if(!map.getLayer(CITY_LAYER))map.addLayer({
        id:CITY_LAYER,type:'symbol',source:CITY_SOURCE,minzoom:1.7,
        layout:{'text-field':['get','name'],'text-size':['interpolate',['linear'],['zoom'],2,11,5,13,8,14],'text-font':['Noto Sans Regular'],'text-allow-overlap':false,'text-padding':5},
        paint:{'text-color':'#ffffff','text-halo-color':'rgba(14,20,30,.92)','text-halo-width':2,'text-halo-blur':0.6}
      });
    }catch(e){console.warn('[Global Weather city labels]',e)}
  };

  const ensureWeatherHeat=()=>{
    if(destroyed||!map.isStyleLoaded?.()||!map.getSource(WEATHER_SOURCE))return;
    try{
      if(!map.getLayer(WEATHER_HEAT)){
        const before=map.getLayer('gw-weather-field-circles')?'gw-weather-field-circles':undefined;
        map.addLayer({
          id:WEATHER_HEAT,type:'heatmap',source:WEATHER_SOURCE,maxzoom:9,
          paint:{
            'heatmap-weight':heatWeight(),
            'heatmap-intensity':['interpolate',['linear'],['zoom'],1.5,0.9,5,1.35,8,1.7],
            'heatmap-radius':['interpolate',['linear'],['zoom'],2,42,5,72,8,110],
            'heatmap-opacity':['interpolate',['linear'],['zoom'],1.5,0.78,7,0.58,9,0.25],
            'heatmap-color':['interpolate',['linear'],['heatmap-density'],0,'rgba(18,40,70,0)',0.12,'rgba(46,130,195,.28)',0.32,'rgba(60,180,175,.50)',0.52,'rgba(120,194,92,.62)',0.72,'rgba(245,194,66,.72)',0.88,'rgba(232,105,58,.80)',1,'rgba(198,52,72,.88)']
          }
        },before);
      }
      ensureCityLabels();
      if(map.getLayer(CITY_LAYER))map.moveLayer(CITY_LAYER);
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
