(function(g){
  function detect(text){var first=String(text||'').split(/\r?\n/,1)[0]||'';return first.split('\t').length>first.split(',').length?'\t':',';}
  function parseLine(line,sep){if(sep==='\t')return line.split('\t');var out=[],cur='',q=false;for(var i=0;i<line.length;i++){var c=line[i];if(c==='"'){if(q&&line[i+1]==='"'){cur+='"';i++;}else q=!q;}else if(c===sep&&!q){out.push(cur);cur='';}else cur+=c;}out.push(cur);return out;}
  function normalize(rows){var cols=rows.reduce(function(m,r){return Math.max(m,r.length);},0);return rows.map(function(r){r=r.slice();while(r.length<cols)r.push('');return r;});}
  function parse(text,sep){sep=sep||detect(text);var rows=String(text||'').replace(/\r/g,'').split('\n').filter(function(r,i,a){return r.length||i<a.length-1;}).map(function(r){return parseLine(r,sep);});rows=normalize(rows);return {rows:rows,separator:sep,rowCount:rows.length,columnCount:rows[0]?rows[0].length:0};}
  function transpose(rows){if(!rows.length)return [];var cols=Math.max.apply(null,rows.map(function(r){return r.length;}));return Array.from({length:cols},function(_,c){return rows.map(function(r){return r[c]||'';});});}
  function quote(v,sep){v=String(v==null?'':v);return /["\n\r]/.test(v)||v.indexOf(sep)>=0?'"'+v.replace(/"/g,'""')+'"':v;}
  function serialize(rows,sep){sep=sep||'\t';return rows.map(function(r){return r.map(function(v){return quote(v,sep);}).join(sep);}).join('\n');}
  function setCell(rows,r,c,value){rows=normalize(rows);if(!rows[r])return rows;rows[r][c]=String(value==null?'':value);return rows;}
  function addRow(rows,after){rows=normalize(rows);var cols=rows[0]?rows[0].length:1,row=Array(cols).fill('');var at=Math.max(0,Math.min(rows.length,Number(after)+1));rows.splice(at,0,row);return rows;}
  function deleteRow(rows,index){rows=normalize(rows);if(index>=0&&index<rows.length)rows.splice(index,1);return rows;}
  function addColumn(rows,after){rows=normalize(rows);if(!rows.length)rows=[['']];else{var at=Math.max(0,Math.min(rows[0].length,Number(after)+1));rows.forEach(function(r){r.splice(at,0,'');});}return rows;}
  function deleteColumn(rows,index){rows=normalize(rows);if(rows[0]&&rows[0].length>1&&index>=0&&index<rows[0].length)rows.forEach(function(r){r.splice(index,1);});return rows;}
  g.WebDeskTableService={detect:detect,parse:parse,normalize:normalize,transpose:transpose,serialize:serialize,setCell:setCell,addRow:addRow,deleteRow:deleteRow,addColumn:addColumn,deleteColumn:deleteColumn};
})(window);
