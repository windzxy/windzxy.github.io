(function(g){
  function detect(text){var first=String(text||'').split(/\r?\n/,1)[0]||'';return first.split('\t').length>first.split(',').length?'\t':',';}
  function parseLine(line,sep){if(sep==='\t')return line.split('\t');var out=[],cur='',q=false;for(var i=0;i<line.length;i++){var c=line[i];if(c==='"'){if(q&&line[i+1]==='"'){cur+='"';i++;}else q=!q;}else if(c===sep&&!q){out.push(cur);cur='';}else cur+=c;}out.push(cur);return out;}
  function parse(text,sep){sep=sep||detect(text);var rows=String(text||'').replace(/\r/g,'').split('\n').filter(function(r,i,a){return r.length||i<a.length-1;}).map(function(r){return parseLine(r,sep);});var cols=rows.reduce(function(m,r){return Math.max(m,r.length);},0);rows=rows.map(function(r){while(r.length<cols)r.push('');return r;});return {rows:rows,separator:sep,rowCount:rows.length,columnCount:cols};}
  function transpose(rows){if(!rows.length)return [];var cols=Math.max.apply(null,rows.map(function(r){return r.length;}));return Array.from({length:cols},function(_,c){return rows.map(function(r){return r[c]||'';});});}
  function quote(v,sep){v=String(v==null?'':v);return /["\n\r]/.test(v)||v.indexOf(sep)>=0?'"'+v.replace(/"/g,'""')+'"':v;}
  function serialize(rows,sep){sep=sep||'\t';return rows.map(function(r){return r.map(function(v){return quote(v,sep);}).join(sep);}).join('\n');}
  g.WebDeskTableService={detect:detect,parse:parse,transpose:transpose,serialize:serialize};
})(window);
