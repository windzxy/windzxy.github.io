const DAY=86400000;
export function parseDate(value){if(!value)return null;const d=new Date(`${value}T00:00:00`);return Number.isNaN(d.getTime())?null:d}
export function formatISO(date){if(!(date instanceof Date)||Number.isNaN(date.getTime()))return'';return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
export function weekdayLabel(date,locale='zh-HK'){if(!(date instanceof Date)||Number.isNaN(date.getTime()))return'';return new Intl.DateTimeFormat(locale,{weekday:'long'}).format(date)}
export function daysBetween(a,b){const da=parseDate(a),db=parseDate(b);if(!da||!db)return null;return Math.round((db-da)/DAY)}
export function addToDate(value,{days=0,months=0,years=0}={}){const d=parseDate(value);if(!d)return null;const out=new Date(d);if(years)out.setFullYear(out.getFullYear()+Number(years||0));if(months)out.setMonth(out.getMonth()+Number(months||0));if(days)out.setDate(out.getDate()+Number(days||0));return out}
export function describeDate(value,locale='zh-HK'){const d=parseDate(value);if(!d)return null;return{iso:formatISO(d),weekday:weekdayLabel(d,locale),timestamp:d.getTime()}}
