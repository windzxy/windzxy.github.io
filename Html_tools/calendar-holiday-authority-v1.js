(function(){
'use strict';
const VER='20261109-calendar-holiday-authority-v3-official-2027-regional';
if(window.__windzxyCalendarHolidayAuthority===VER)return;
window.__windzxyCalendarHolidayAuthority=VER;

/* Mainland China 2027: State Council General Office notice Guo Ban Fa Ming Dian [2026] No. 10, issued 2026-11-05 (China Government Network). */
const CN={
'2026-01-01':{n:'元旦假期',s:'元旦',t:'holiday',g:'cn-newyear'},
'2026-01-02':{n:'元旦假期',s:'元旦',t:'holiday',g:'cn-newyear'},
'2026-01-03':{n:'元旦假期',s:'元旦',t:'holiday',g:'cn-newyear'},
'2026-01-04':{n:'元旦調休補班',s:'元旦補班',t:'work',g:'cn-newyear-work'},
'2026-02-14':{n:'春節調休補班',s:'春節補班',t:'work',g:'cn-spring-work-a'},
'2026-02-15':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-16':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-17':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-18':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-19':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-20':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-21':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-22':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-23':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring'},
'2026-02-28':{n:'春節調休補班',s:'春節補班',t:'work',g:'cn-spring-work-b'},
'2026-04-04':{n:'清明節假期',s:'清明',t:'holiday',g:'cn-qingming'},
'2026-04-05':{n:'清明節假期',s:'清明',t:'holiday',g:'cn-qingming'},
'2026-04-06':{n:'清明節假期',s:'清明',t:'holiday',g:'cn-qingming'},
'2026-05-01':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-02':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-03':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-04':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-05':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour'},
'2026-05-09':{n:'勞動節調休補班',s:'勞動節補班',t:'work',g:'cn-labour-work'},
'2026-06-19':{n:'端午節假期',s:'端午',t:'holiday',g:'cn-dragonboat'},
'2026-06-20':{n:'端午節假期',s:'端午',t:'holiday',g:'cn-dragonboat'},
'2026-06-21':{n:'端午節假期',s:'端午',t:'holiday',g:'cn-dragonboat'},
'2026-09-20':{n:'國慶調休補班',s:'國慶補班',t:'work',g:'cn-national-work-a'},
'2026-09-25':{n:'中秋節假期',s:'中秋',t:'holiday',g:'cn-midautumn'},
'2026-09-26':{n:'中秋節假期',s:'中秋',t:'holiday',g:'cn-midautumn'},
'2026-09-27':{n:'中秋節假期',s:'中秋',t:'holiday',g:'cn-midautumn'},
'2026-10-01':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-02':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-03':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-04':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-05':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-06':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-07':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national'},
'2026-10-10':{n:'國慶調休補班',s:'國慶補班',t:'work',g:'cn-national-work-b'},

'2027-01-01':{n:'元旦假期',s:'元旦',t:'holiday',g:'cn-newyear-2027'},'2027-01-02':{n:'元旦假期',s:'元旦',t:'holiday',g:'cn-newyear-2027'},'2027-01-03':{n:'元旦假期',s:'元旦',t:'holiday',g:'cn-newyear-2027'},
'2027-01-31':{n:'春節調休補班',s:'春節補班',t:'work',g:'cn-spring-work-2027-a'},
'2027-02-05':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring-2027'},'2027-02-06':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring-2027'},'2027-02-07':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring-2027'},'2027-02-08':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring-2027'},'2027-02-09':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring-2027'},'2027-02-10':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring-2027'},'2027-02-11':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring-2027'},'2027-02-12':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring-2027'},'2027-02-13':{n:'春節假期',s:'春節',t:'holiday',g:'cn-spring-2027'},
'2027-02-14':{n:'春節調休補班',s:'春節補班',t:'work',g:'cn-spring-work-2027-b'},
'2027-04-03':{n:'清明節假期',s:'清明',t:'holiday',g:'cn-qingming-2027'},'2027-04-04':{n:'清明節假期',s:'清明',t:'holiday',g:'cn-qingming-2027'},'2027-04-05':{n:'清明節假期',s:'清明',t:'holiday',g:'cn-qingming-2027'},
'2027-05-01':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour-2027'},'2027-05-02':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour-2027'},'2027-05-03':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour-2027'},'2027-05-04':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour-2027'},'2027-05-05':{n:'勞動節假期',s:'勞動節',t:'holiday',g:'cn-labour-2027'},
'2027-05-08':{n:'勞動節調休補班',s:'勞動節補班',t:'work',g:'cn-labour-work-2027'},
'2027-06-09':{n:'端午節假期',s:'端午',t:'holiday',g:'cn-dragonboat-2027'},'2027-09-15':{n:'中秋節假期',s:'中秋',t:'holiday',g:'cn-midautumn-2027'},
'2027-09-26':{n:'國慶調休補班',s:'國慶補班',t:'work',g:'cn-national-work-2027-a'},
'2027-10-01':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national-2027'},'2027-10-02':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national-2027'},'2027-10-03':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national-2027'},'2027-10-04':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national-2027'},'2027-10-05':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national-2027'},'2027-10-06':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national-2027'},'2027-10-07':{n:'國慶節假期',s:'國慶',t:'holiday',g:'cn-national-2027'},'2027-10-09':{n:'國慶調休補班',s:'國慶補班',t:'work',g:'cn-national-work-2027-b'}
};

/* Hong Kong 2027 general holidays: HKSAR Government Gazette announcement, 2026-05-15. */
const HK={
'2026-01-01':{n:'一月一日',s:'港·元旦',t:'holiday',g:'hk-newyear'},
'2026-02-17':{n:'農曆年初一',s:'港·年初一',t:'holiday',g:'hk-lny1'},
'2026-02-18':{n:'農曆年初二',s:'港·年初二',t:'holiday',g:'hk-lny2'},
'2026-02-19':{n:'農曆年初三',s:'港·年初三',t:'holiday',g:'hk-lny3'},
'2026-04-03':{n:'耶穌受難節',s:'港·受難節',t:'holiday',g:'hk-goodfriday'},
'2026-04-04':{n:'耶穌受難節翌日',s:'港·受難節翌日',t:'holiday',g:'hk-goodfriday-next'},
'2026-04-06':{n:'清明節翌日',s:'港·清明翌日',t:'holiday',g:'hk-qingming-next'},
'2026-04-07':{n:'復活節翌日補假',s:'港·復活節',t:'holiday',g:'hk-easter'},
'2026-05-01':{n:'勞動節',s:'港·勞動節',t:'holiday',g:'hk-labour'},
'2026-05-25':{n:'佛誕翌日',s:'港·佛誕',t:'holiday',g:'hk-buddha'},
'2026-06-19':{n:'端午節',s:'港·端午',t:'holiday',g:'hk-dragonboat'},
'2026-07-01':{n:'香港特別行政區成立紀念日',s:'港·七一',t:'holiday',g:'hk-hksar'},
'2026-09-26':{n:'中秋節翌日',s:'港·中秋翌日',t:'holiday',g:'hk-midautumn-next'},
'2026-10-01':{n:'國慶日',s:'港·國慶',t:'holiday',g:'hk-national'},
'2026-10-19':{n:'重陽節翌日',s:'港·重陽',t:'holiday',g:'hk-chungyeung'},
'2026-12-25':{n:'聖誕節',s:'港·聖誕',t:'holiday',g:'hk-christmas'},
'2026-12-26':{n:'聖誕節後第一個周日',s:'港·聖誕翌日',t:'holiday',g:'hk-christmas-next'},

'2027-01-01':{n:'一月一日',s:'港·元旦',t:'holiday',g:'hk-newyear-2027'},
'2027-02-06':{n:'農曆年初一',s:'港·年初一',t:'holiday',g:'hk-lny1-2027'},'2027-02-08':{n:'農曆年初三',s:'港·年初三',t:'holiday',g:'hk-lny3-2027'},'2027-02-09':{n:'農曆年初四',s:'港·年初四',t:'holiday',g:'hk-lny4-2027'},
'2027-03-26':{n:'耶穌受難節',s:'港·受難節',t:'holiday',g:'hk-goodfriday-2027'},'2027-03-27':{n:'耶穌受難節翌日',s:'港·受難節翌日',t:'holiday',g:'hk-goodfriday-next-2027'},'2027-03-29':{n:'復活節星期一',s:'港·復活節',t:'holiday',g:'hk-easter-monday-2027'},
'2027-04-05':{n:'清明節',s:'港·清明',t:'holiday',g:'hk-qingming-2027'},'2027-05-01':{n:'勞動節',s:'港·勞動節',t:'holiday',g:'hk-labour-2027'},'2027-05-13':{n:'佛誕',s:'港·佛誕',t:'holiday',g:'hk-buddha-2027'},
'2027-06-09':{n:'端午節',s:'港·端午',t:'holiday',g:'hk-dragonboat-2027'},'2027-07-01':{n:'香港特別行政區成立紀念日',s:'港·七一',t:'holiday',g:'hk-hksar-2027'},
'2027-09-16':{n:'中秋節翌日',s:'港·中秋翌日',t:'holiday',g:'hk-midautumn-next-2027'},'2027-10-01':{n:'國慶日',s:'港·國慶',t:'holiday',g:'hk-national-2027'},'2027-10-08':{n:'重陽節',s:'港·重陽',t:'holiday',g:'hk-chungyeung-2027'},
'2027-12-25':{n:'聖誕節',s:'港·聖誕',t:'holiday',g:'hk-christmas-2027'},'2027-12-27':{n:'聖誕節後第一個周日',s:'港·聖誕翌日',t:'holiday',g:'hk-christmas-next-2027'}
};

/* Hong Kong 2027 statutory holidays: Labour Department official list, 15 days; 22 or 25 Dec is employer-selected. */
const HK_STATUTORY={
'2027-01-01':{n:'一月一日',s:'港法·元旦',t:'holiday',g:'hks-2027-newyear'},
'2027-02-06':{n:'農曆年初一',s:'港法·年初一',t:'holiday',g:'hks-2027-lny1'},
'2027-02-08':{n:'農曆年初三',s:'港法·年初三',t:'holiday',g:'hks-2027-lny3'},
'2027-02-09':{n:'農曆年初四（年初二適逢星期日的替代假日）',s:'港法·年初四',t:'holiday',g:'hks-2027-lny4'},
'2027-03-29':{n:'復活節星期一',s:'港法·復活節',t:'holiday',g:'hks-2027-easter'},
'2027-04-05':{n:'清明節',s:'港法·清明',t:'holiday',g:'hks-2027-qingming'},
'2027-05-01':{n:'勞動節',s:'港法·勞動節',t:'holiday',g:'hks-2027-labour'},
'2027-05-13':{n:'佛誕',s:'港法·佛誕',t:'holiday',g:'hks-2027-buddha'},
'2027-06-09':{n:'端午節',s:'港法·端午',t:'holiday',g:'hks-2027-dragonboat'},
'2027-07-01':{n:'香港特別行政區成立紀念日',s:'港法·七一',t:'holiday',g:'hks-2027-hksar'},
'2027-09-16':{n:'中秋節翌日',s:'港法·中秋翌日',t:'holiday',g:'hks-2027-midautumn'},
'2027-10-01':{n:'國慶日',s:'港法·國慶',t:'holiday',g:'hks-2027-national'},
'2027-10-08':{n:'重陽節',s:'港法·重陽',t:'holiday',g:'hks-2027-chungyeung'},
'2027-12-22':{n:'冬節或聖誕節（由僱主選擇其一）',s:'港法·冬節／聖誕',t:'holiday',g:'hks-2027-winter-christmas-choice'},
'2027-12-25':{n:'冬節或聖誕節（由僱主選擇其一）',s:'港法·冬節／聖誕',t:'holiday',g:'hks-2027-winter-christmas-choice'},
'2027-12-27':{n:'聖誕節後第一個周日',s:'港法·聖誕翌日',t:'holiday',g:'hks-2027-christmas-next'}
};

let lastClicked='';
let queued=false;
function pad(n){return String(n).padStart(2,'0')}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||localStorage.getItem('webdesk-lang')||document.documentElement.lang||navigator.language||'zh-HK';if(/^en/i.test(v))return 'en';if(/^zh-CN/i.test(v)||/Hans/i.test(v))return 'zh-CN';return 'zh-HK'}
function t(en,tc,sc){const l=lang();return l==='en'?en:l==='zh-CN'?(sc||tc):tc}
const EN_NAMES={'元旦假期':'New Year holiday','元旦調休補班':'Adjusted workday for New Year','元旦補班':'New Year make-up workday','春節調休補班':'Adjusted workday for Lunar New Year','春節補班':'Lunar New Year make-up workday','春節假期':'Lunar New Year holiday','春節':'Lunar New Year','清明節假期':'Qingming Festival holiday','清明節':'Qingming Festival','清明':'Qingming Festival','勞動節假期':'Labour Day holiday','勞動節':'Labour Day','勞動節調休補班':'Labour Day make-up workday','勞動節補班':'Labour Day make-up workday','端午節假期':'Dragon Boat Festival holiday','端午節':'Dragon Boat Festival','端午':'Dragon Boat Festival','國慶調休補班':'Adjusted workday for National Day','國慶補班':'National Day make-up workday','中秋節假期':'Mid-Autumn Festival holiday','中秋節翌日':'Day after Mid-Autumn Festival','中秋':'Mid-Autumn Festival','國慶節假期':'National Day holiday','國慶日':'National Day','國慶':'National Day','一月一日':"New Year's Day",'農曆年初一':'Lunar New Year Day 1','農曆年初二':'Lunar New Year Day 2','農曆年初三':'Lunar New Year Day 3','農曆年初四':'Lunar New Year Day 4','耶穌受難節':'Good Friday','耶穌受難節翌日':'Day after Good Friday','復活節星期一':'Easter Monday','復活節翌日補假':'Easter Monday substitute holiday','佛誕翌日':"Day after Buddha's Birthday",'佛誕':'The Birthday of the Buddha','香港特別行政區成立紀念日':'HKSAR Establishment Day','重陽節翌日':'Day after Chung Yeung Festival','重陽節':'Chung Yeung Festival','聖誕節':'Christmas Day','聖誕節後第一個周日':'First weekday after Christmas Day','冬節或聖誕節（由僱主選擇其一）':'Winter Solstice or Christmas Day (employer chooses one)','港·元旦':'HK · New Year','港·年初一':'HK · Lunar New Year 1','港·年初二':'HK · Lunar New Year 2','港·年初三':'HK · Lunar New Year 3','港·年初四':'HK · Lunar New Year 4','港·受難節':'HK · Good Friday','港·受難節翌日':'HK · Day after Good Friday','港·清明翌日':'HK · Day after Ching Ming','港·清明':'HK · Ching Ming','港·復活節':'HK · Easter Monday','港·勞動節':'HK · Labour Day','港·佛誕':'HK · Buddha holiday','港·端午':'HK · Dragon Boat','港·七一':'HK · HKSAR Day','港·中秋翌日':'HK · Day after Mid-Autumn','港·國慶':'HK · National Day','港·重陽':'HK · Chung Yeung','港·聖誕':'HK · Christmas','港·聖誕翌日':'HK · Christmas holiday','港法·元旦':'HK statutory · New Year','港法·年初一':'HK statutory · Lunar New Year 1','港法·年初三':'HK statutory · Lunar New Year 3','港法·年初四':'HK statutory · Lunar New Year 4','港法·復活節':'HK statutory · Easter Monday','港法·清明':'HK statutory · Ching Ming','港法·勞動節':'HK statutory · Labour Day','港法·佛誕':'HK statutory · Buddha holiday','港法·端午':'HK statutory · Dragon Boat','港法·七一':'HK statutory · HKSAR Day','港法·中秋翌日':'HK statutory · Mid-Autumn','港法·國慶':'HK statutory · National Day','港法·重陽':'HK statutory · Chung Yeung','港法·冬節／聖誕':'HK statutory · Winter Solstice / Christmas','港法·聖誕翌日':'HK statutory · Day after Christmas'};
const SC_NAMES={'元旦調休補班':'元旦调休补班','春節調休補班':'春节调休补班','春節補班':'春节补班','春節假期':'春节假期','春節':'春节','清明節假期':'清明节假期','清明節':'清明节','勞動節假期':'劳动节假期','勞動節':'劳动节','勞動節調休補班':'劳动节调休补班','勞動節補班':'劳动节补班','端午節假期':'端午节假期','端午節':'端午节','國慶調休補班':'国庆调休补班','國慶補班':'国庆补班','中秋節假期':'中秋节假期','中秋節翌日':'中秋节翌日','國慶節假期':'国庆节假期','國慶日':'国庆日','國慶':'国庆','農曆年初一':'农历年初一','農曆年初二':'农历年初二','農曆年初三':'农历年初三','農曆年初四':'农历年初四','耶穌受難節':'耶稣受难节','耶穌受難節翌日':'耶稣受难节翌日','復活節星期一':'复活节星期一','佛誕':'佛诞','香港特別行政區成立紀念日':'香港特别行政区成立纪念日','重陽節':'重阳节','聖誕節':'圣诞节','聖誕節後第一個周日':'圣诞节后第一个周日','冬節或聖誕節（由僱主選擇其一）':'冬节或圣诞节（由雇主选择其一）','港·年初一':'港·年初一','港·年初三':'港·年初三','港·年初四':'港·年初四','港·受難節':'港·受难节','港·受難節翌日':'港·受难节翌日','港·清明':'港·清明','港·復活節':'港·复活节','港·勞動節':'港·劳动节','港·佛誕':'港·佛诞','港·端午':'港·端午','港·中秋翌日':'港·中秋翌日','港·重陽':'港·重阳','港·聖誕':'港·圣诞','港·聖誕翌日':'港·圣诞翌日','一月一日':'一月一日','港法·元旦':'港法·元旦','港法·年初一':'港法·年初一','港法·年初三':'港法·年初三','港法·年初四':'港法·年初四','港法·復活節':'港法·复活节','港法·清明':'港法·清明','港法·勞動節':'港法·劳动节','港法·佛誕':'港法·佛诞','港法·端午':'港法·端午','港法·七一':'港法·七一','港法·中秋翌日':'港法·中秋翌日','港法·國慶':'港法·国庆','港法·重陽':'港法·重阳','港法·冬節／聖誕':'港法·冬节／圣诞','港法·聖誕翌日':'港法·圣诞翌日'};
function localName(value){const name=String(value||'');if(lang()==='en')return EN_NAMES[name]||name;if(lang()==='zh-CN')return SC_NAMES[name]||name;return name}
function selected(root){const m=(root.dataset.cal11Date||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?new Date(+m[1],+m[2]-1,+m[3]):new Date()}
function monthItems(data,y,m){return Object.entries(data).map(([date,v])=>({date,...v,d:new Date(date+'T00:00:00')})).filter(x=>x.d.getFullYear()===y&&x.d.getMonth()===m).sort((a,b)=>a.date.localeCompare(b.date))}
function groups(data,y,m){const out=[];for(const it of monthItems(data,y,m)){const day=it.d.getDate(),last=out[out.length-1];if(last&&last.g===it.g&&last.t===it.t&&day===last.end+1)last.end=day;else out.push({...it,start:day,end:day})}return out}
function rangeText(g){return g.start===g.end?pad(g.start):pad(g.start)+'-'+pad(g.end)}
function installStyle(){
  if(document.getElementById('calendarHolidayAuthorityV3Style'))return;
  const st=document.createElement('style');st.id='calendarHolidayAuthorityV3Style';st.textContent=`
  .calendar-v11 .cal11-hbar .cal-auth-work{color:#9bc8ff!important;background:rgba(74,132,222,.22)!important;border-color:rgba(118,170,255,.34)!important}
  .calendar-v11 .cal11-hbar .cal-auth-cn{color:#ffd39a!important}
  .calendar-v11 .cal11-hbar .cal-auth-hk{color:#90e6b2!important;background:rgba(67,163,104,.18)!important;border-color:rgba(104,214,143,.28)!important}
  .calendar-v11 .cal11-hbar .cal-auth-hks{color:#d0b5ff!important;background:rgba(133,94,202,.20)!important;border-color:rgba(175,143,242,.32)!important}
  .calendar-v11 .cal11-events .cal-auth-section{margin:0 0 12px;padding:0;border:0;background:transparent}
  .calendar-v11 .cal11-events .cal-auth-section:last-child{margin-bottom:0}
  .calendar-v11 .cal11-events .cal-auth-note{margin:-3px 0 8px;font-size:11px;line-height:1.4;color:#d0b5ff;opacity:.82}
  .calendar-v11 .cal11-events .cal-auth-source{margin:8px 0 2px;font-size:10px;line-height:1.6;opacity:.72}.calendar-v11 .cal11-events .cal-auth-source a{color:inherit;text-decoration:underline;text-underline-offset:2px}
  .calendar-v11 .cal11-events .cal-auth-title{display:flex;align-items:center;justify-content:space-between;margin:0 0 8px;font-size:13px;font-weight:950;letter-spacing:.02em}
  .calendar-v11 .cal11-events .cal-auth-title.cn{color:#ffd39a}
  .calendar-v11 .cal11-events .cal-auth-title.hk{color:#90e6b2}
  .calendar-v11 .cal11-events .cal-auth-title.hks{color:#d0b5ff}
  .calendar-v11 .cal11-events .cal-auth-row{cursor:default}
  .calendar-v11 .cal11-events .cal-auth-row.work b,.calendar-v11 .cal11-events .cal-auth-row.work em{color:#9bc8ff!important}
  .calendar-v11 .cal11-events .cal-auth-row.cn-holiday b,.calendar-v11 .cal11-events .cal-auth-row.cn-holiday em{color:#ffc176!important}
  .calendar-v11 .cal11-events .cal-auth-row.hk-holiday b,.calendar-v11 .cal11-events .cal-auth-row.hk-holiday em{color:#86e2aa!important}
  .calendar-v11 .cal11-events .cal-auth-row.hk-statutory b,.calendar-v11 .cal11-events .cal-auth-row.hk-statutory em{color:#d0b5ff!important}
  .calendar-v11 .cal11-day[data-cal-auth-work='1'] i{background:#76a9ff!important}
  .calendar-v11 .cal11-day[data-cal-auth-hk='1']{box-shadow:inset 0 -2px 0 rgba(92,202,133,.45)}
  `;document.head.appendChild(st)
}
function patchCells(root){root.querySelectorAll('[data-cal11-cell]').forEach(cell=>{const key=cell.dataset.cal11Cell,cn=CN[key],hk=HK[key],hks=HK_STATUTORY[key];cell.classList.toggle('holiday',!!(cn||hk||hks));cell.classList.toggle('workday',cn?.t==='work');cell.dataset.calAuthWork=cn?.t==='work'?'1':'0';cell.dataset.calAuthCnHoliday=cn&&cn.t==='holiday'?'1':'0';cell.dataset.calAuthHk=hk?'1':'0';cell.dataset.calAuthHkStatutory=hks?'1':'0';cell.title=[cn?t('Mainland China','中國內地','中国内地')+': '+localName(cn.n):'',hk?t('Hong Kong general holiday','香港公眾假期','香港公众假期')+': '+localName(hk.n):'',hks?t('Hong Kong statutory holiday','香港法定假日','香港法定假日')+': '+localName(hks.n):''].filter(Boolean).join(' · ');cell.querySelectorAll(':scope > i').forEach(i=>i.remove());if(cn||hk||hks){const i=document.createElement('i');if(cn?.t==='work')i.className='work';i.dataset.holidayAuthority='3';cell.appendChild(i)}})}
function patchMiniCells(root){root.querySelectorAll('[data-cal11-mini-cell]').forEach(cell=>{const key=cell.dataset.cal11MiniCell,cn=CN[key],hk=HK[key],hks=HK_STATUTORY[key];cell.classList.toggle('holiday',!!(cn&&cn.t==='holiday'||hk||hks));cell.classList.toggle('workday',cn?.t==='work');});}
function patchBar(root,d){const y=d.getFullYear(),m=d.getMonth(),cng=groups(CN,y,m),hkg=groups(HK,y,m),hksg=y===2027?groups(HK_STATUTORY,y,m):[],all=[...cng.map(g=>({...g,r:'cn'})),...hkg.map(g=>({...g,r:'hk'})),...hksg.map(g=>({...g,r:'hks'}))].sort((a,b)=>a.start-b.start);let bar=root.querySelector('.cal11-hbar');if(!bar&&all.length){bar=document.createElement('section');bar.className='cal11-hbar';root.querySelector('.cal11-body')?.before(bar)}if(!bar)return;if(!all.length){bar.remove();return}const shown=all.slice(0,4);bar.innerHTML=shown.map(g=>`<span class="${g.t==='work'?'cal-auth-work':g.r==='hk'?'cal-auth-hk':g.r==='hks'?'cal-auth-hks':'cal-auth-cn'}">${esc(rangeText(g))} ${esc(localName(g.s))}</span>`).join('')+(all.length>shown.length?`<em>+${all.length-shown.length}</em>`:'')}
function rows(gs,region){if(!gs.length)return '<p>'+t('No records this month','本月無記錄','本月无记录')+'</p>';return gs.map(g=>`<button type="button" class="cal-auth-row ${g.t==='work'?'work':region==='hk'?'hk-holiday':region==='hks'?'hk-statutory':'cn-holiday'}"><b>${rangeText(g)}</b><span>${esc(localName(g.n))}</span><em>${g.t==='work'?t('Adjusted workday','補班','补班'):region==='hk'?t('Public holiday','公眾假期','公众假期'):region==='hks'?t('Statutory holiday','法定假日','法定假日'):t('Holiday','假期','假期')}</em></button>`).join('')}
function patchSide(root,d){const box=root.querySelector('.cal11-events');if(!box)return;const y=d.getFullYear(),m=d.getMonth(),cng=groups(CN,y,m),hkg=groups(HK,y,m),hksg=y===2027?groups(HK_STATUTORY,y,m):[];box.innerHTML=`<section class="cal-auth-section"><h3 class="cal-auth-title cn"><span>${t('Mainland China · official holiday arrangement','中國內地 · 官方放假調休','中国内地 · 官方放假调休')}</span></h3>${rows(cng,'cn')}</section><section class="cal-auth-section"><h3 class="cal-auth-title hk"><span>${t('Hong Kong · general holidays','香港 · 公眾假期','香港 · 公众假期')}</span></h3>${rows(hkg,'hk')}</section>`+(y===2027?`<section class="cal-auth-section"><h3 class="cal-auth-title hks"><span>${t('Hong Kong · statutory holidays (2027)','香港 · 法定假日（2027）','香港 · 法定假日（2027）')}</span></h3><p class="cal-auth-note">${t('22 or 25 December is selected by the employer','12月22日或25日由僱主選擇其一','12月22日或25日由雇主选择其一')}</p>${rows(hksg,'hks')}</section><p class="cal-auth-source">${t('Official sources','官方資料來源','官方资料来源')}: <a href="https://www.forestry.gov.cn/lyj/1/szxx/20261105/695102.html" target="_blank" rel="noopener">${t('Mainland China notice','內地放假通知','内地放假通知')}</a> · <a href="https://www.info.gov.hk/gia/general/202605/15/P2026051400300.htm" target="_blank" rel="noopener">${t('HK general holidays','香港公眾假期','香港公众假期')}</a> · <a href="https://www.labour.gov.hk/tc/news/latest_holidays2027.htm" target="_blank" rel="noopener">${t('HK statutory holidays','香港法定假日','香港法定假日')}</a></p>`:'');}
function patchRoot(root){const d=selected(root);installStyle();patchCells(root);patchMiniCells(root);patchBar(root,d);patchSide(root,d);root.dataset.holidayAuthority=VER}
function patchPopup(){if(!lastClicked)return;const cn=CN[lastClicked],hk=HK[lastClicked],hks=HK_STATUTORY[lastClicked];document.querySelectorAll('.cal-day-detail-pop').forEach(pop=>{const rows=pop.querySelectorAll('.cal-detail-rows > div');const span=rows[1]?.querySelector('span');if(!span)return;const parts=[];if(cn)parts.push(t('Mainland China','中國內地','中国内地')+': '+localName(cn.n)+(cn.t==='work'?' ('+t('Adjusted workday','補班','补班')+')':''));if(hk)parts.push(t('Hong Kong general holiday','香港公眾假期','香港公众假期')+': '+localName(hk.n));if(hks)parts.push(t('Hong Kong statutory holiday','香港法定假日','香港法定假日')+': '+localName(hks.n));span.textContent=parts.length?parts.join(' | '):t('No official holiday record','無官方假期記錄','无官方假期记录');span.className=cn?.t==='work'?'work':(cn||hk||hks)?'holiday':''})}
function run(){queued=false;document.querySelectorAll('.calendar-v11').forEach(patchRoot);patchPopup()}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(run)}
document.addEventListener('click',e=>{const c=e.target.closest?.('[data-cal11-cell]');if(c){lastClicked=c.dataset.cal11Cell||'';setTimeout(schedule,0)}},true);
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
window.WebDeskCalendarHolidayAuthority={version:VER,cn:CN,hk:HK,hkStatutory:HK_STATUTORY};
})();
