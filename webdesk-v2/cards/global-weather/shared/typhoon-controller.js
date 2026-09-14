const LIST_URL='https://www.weather.gov.hk/wxinfo/currwx/tc_list.xml';
const WARN_URL='https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=tc';
const TIPS_URL='https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=swt&lang=tc';
const SOURCE='gw-typhoon-track';
const PAST_LINE='gw-typhoon-past-line';
const FCST_LINE='gw-typhoon-forecast-line';
const POINTS='gw-typhoon-points';
const LABELS='gw-typhoon-labels';

function txt(node,tag){return node?.querySelector?.(tag)?.textContent?.trim?.()||''}
function coord(v,positive,negative){const s=String(v||'').trim().toUpperCase(),n=parseFloat(s);if(!Number.isFinite(n))return NaN;return s.endsWith(negative)?-Math.abs(n):Math.abs(n)}
function pointFrom(node,phase,name){
  const lat=coord(txt(node,'Latitude'),'N','S'),lon=coord(txt(node,'Longitude'),'E','W');
  if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;
  return{lat,lon,phase,name,time:txt(node,'Time'),intensity:txt(node,'Intensity'),wind:txt(node,'MaximumWind')};
}
function parseTrack(xml,id,fallbackName=''){
  const doc=new DOMParser().parseFromString(xml,'application/xml');
  if(doc.querySelector('parsererror'))throw new Error('HKO track XML parse failed');
  const name=txt(doc,'TropicalCycloneName')||fallbackName||`TC ${id}`;
  const bulletinTime=txt(doc,'BulletinTime');
  const past=[...doc.querySelectorAll('PastInformation')].map(n=>pointFrom(n,'past',name)).filter(Boolean);
  const analysis=[...doc.querySelectorAll('AnalysisInformation')].map(n=>pointFrom(n,'analysis',name)).filter(Boolean);
  const forecast=[...doc.querySelectorAll('ForecastInformation')].map(n=>pointFrom(n,'forecast',name)).filter(Boolean);
  return{id,name,bulletinTime,past,analysis,forecast};
}
function lineFeature(points,phase,id,name){const coords=points.map(p=>[p.lon,p.lat]);return coords.length>1?{type:'Feature',geometry:{type:'LineString',coordinates:coords},properties:{kind:'line',phase,id,name}}:null}
function pointFeature(p,id){return{type:'Feature',geometry:{type:'Point',coordinates:[p.lon,p.lat]},properties:{kind:'point',phase:p.phase,id,name:p.name,time:p.time,intensity:p.intensity||'',wind:p.wind||'',label:p.phase==='analysis'?`${p.name}${p.wind?` · ${p.wind}`:''}`:''}}}
function toGeoJSON(storms){
  const features=[];
  for(const s of storms){
    const observed=[...s.past,...s.analysis];
    const pastLine=lineFeature(observed,'past',s.id,s.name);if(pastLine)features.push(pastLine);
    const current=s.analysis.at(-1)||s.past.at(-1);
    const forecastPath=current?[current,...s.forecast]:s.forecast;
    const fc=lineFeature(forecastPath,'forecast',s.id,s.name);if(fc)features.push(fc);
    for(const p of s.past)features.push(pointFeature(p,s.id));
    for(const p of s.analysis)features.push(pointFeature(p,s.id));
    for(const p of s.forecast)features.push(pointFeature(p,s.id));
  }
  return{type:'FeatureCollection',features};
}
async function fetchText(url,signal){const r=await fetch(url,{signal,cache:'no-store'});if(!r.ok)throw new Error(`HKO ${r.status}`);return r.text()}
async function fetchJSON(url,signal){const r=await fetch(url,{signal,cache:'no-store'});if(!r.ok)throw new Error(`HKO ${r.status}`);return r.json()}
async function fetchStorms(signal){
  const xml=await fetchText(LIST_URL,signal),doc=new DOMParser().parseFromString(xml,'application/xml');
  if(doc.querySelector('parsererror'))throw new Error('HKO cyclone list XML parse failed');
  const entries=[...doc.querySelectorAll('TropicalCyclone')].map(n=>({id:txt(n,'TropicalCycloneID'),name:txt(n,'TropicalCycloneChineseName')||txt(n,'TropicalCycloneEnglishName'),url:txt(n,'TropicalCycloneURL')})).filter(x=>x.id&&x.url);
  return Promise.all(entries.map(async x=>parseTrack(await fetchText(x.url,signal),x.id,x.name)));
}
async function fetchWarnings(signal){
  const [warn,tips]=await Promise.allSettled([fetchJSON(WARN_URL,signal),fetchJSON(TIPS_URL,signal)]);
  const summary=warn.status==='fulfilled'?warn.value?.WTCSGNL:null;
  const tipRows=tips.status==='fulfilled'?(Array.isArray(tips.value)?tips.value:tips.value?.swt||[]):[];
  const tcTips=tipRows.filter(x=>/(熱帶氣旋|颱風|風暴|tropical cyclone|typhoon)/i.test(String(x?.desc||''))).slice(0,3).map(x=>({text:x.desc,updateTime:x.updateTime||''}));
  return{signal:summary?{name:summary.name||'熱帶氣旋警告信號',type:summary.type||summary.code||'',code:summary.code||'',issueTime:summary.issueTime||'',updateTime:summary.updateTime||''}:null,tips:tcTips};
}
function intensityColor(){return['match',['get','intensity'],'Super Typhoon','#9c4dcc','Severe Typhoon','#d34676','Typhoon','#e85d3f','Severe Tropical Storm','#ef9b36','Tropical Storm','#e2c84b','Tropical Depression','#54b9d5','#d6dde6']}

export function createTyphoonController(mapApi,{signal,onChange}={}){
  const map=mapApi?.map;let visible=false,destroyed=false,abort=null,loaded=false,state={state:'idle',visible:false,source:'香港天文台 HKO',storms:[],warning:null,tips:[],updatedAt:''};
  const emit=patch=>{state={...state,...patch};onChange?.(state)};
  const clearLayers=()=>{if(!map)return;try{[LABELS,POINTS,FCST_LINE,PAST_LINE].forEach(id=>{if(map.getLayer(id))map.removeLayer(id)});if(map.getSource(SOURCE))map.removeSource(SOURCE)}catch{}};
  const apply=()=>{
    if(!map||mapApi?.isFallback||!visible||!map.isStyleLoaded?.())return false;
    const geojson=toGeoJSON(state.storms);try{
      const existing=map.getSource(SOURCE);if(existing?.setData)existing.setData(geojson);else map.addSource(SOURCE,{type:'geojson',data:geojson});
      if(!map.getLayer(PAST_LINE))map.addLayer({id:PAST_LINE,type:'line',source:SOURCE,filter:['all',['==',['get','kind'],'line'],['==',['get','phase'],'past']],paint:{'line-color':'rgba(255,255,255,.82)','line-width':2.3}});
      if(!map.getLayer(FCST_LINE))map.addLayer({id:FCST_LINE,type:'line',source:SOURCE,filter:['all',['==',['get','kind'],'line'],['==',['get','phase'],'forecast']],paint:{'line-color':'rgba(255,235,150,.92)','line-width':2.2,'line-dasharray':[2,2]}});
      if(!map.getLayer(POINTS))map.addLayer({id:POINTS,type:'circle',source:SOURCE,filter:['==',['get','kind'],'point'],paint:{'circle-radius':['match',['get','phase'],'analysis',8,'forecast',6,4.5],'circle-color':intensityColor(),'circle-stroke-color':'rgba(255,255,255,.95)','circle-stroke-width':['match',['get','phase'],'analysis',2.5,1.4]}});
      if(!map.getLayer(LABELS))map.addLayer({id:LABELS,type:'symbol',source:SOURCE,filter:['all',['==',['get','kind'],'point'],['==',['get','phase'],'analysis']],layout:{'text-field':['get','label'],'text-size':12,'text-offset':[0,1.25],'text-anchor':'top','text-allow-overlap':true},paint:{'text-color':'#fff','text-halo-color':'rgba(20,25,35,.9)','text-halo-width':1.8}});
      [PAST_LINE,FCST_LINE,POINTS,LABELS].forEach(id=>{if(map.getLayer(id))map.moveLayer(id)});return true;
    }catch(e){console.warn('[Global Weather typhoon layer]',e);return false}
  };
  const refresh=async()=>{
    if(!visible||destroyed)return state;
    abort?.abort();abort=new AbortController();const onAbort=()=>abort?.abort();signal?.addEventListener?.('abort',onAbort,{once:true});emit({state:'loading',visible:true});
    try{
      const [storms,warnings]=await Promise.all([fetchStorms(abort.signal),fetchWarnings(abort.signal)]);if(destroyed||signal?.aborted||!visible)return state;
      const updatedAt=storms.map(s=>s.bulletinTime).filter(Boolean).sort().at(-1)||warnings.signal?.updateTime||warnings.tips?.[0]?.updateTime||'';
      loaded=true;emit({state:'ready',visible:true,storms,warning:warnings.signal,tips:warnings.tips,updatedAt});apply();return state;
    }catch(e){if(e?.name==='AbortError'||destroyed)return state;console.warn('[Global Weather HKO typhoon]',e);emit({state:'error',visible:true,error:String(e?.message||e),storms:[]});clearLayers();return state}
    finally{signal?.removeEventListener?.('abort',onAbort)}
  };
  const onStyle=()=>{if(visible)apply()};map?.on?.('style.load',onStyle);
  return{get state(){return state},refresh,setVisible(v){visible=!!v;if(visible){emit({visible:true});if(loaded)apply();else refresh()}else{abort?.abort();clearLayers();emit({state:'idle',visible:false})}return visible},destroy(){destroyed=true;abort?.abort();map?.off?.('style.load',onStyle);clearLayers()}};
}
