/* Wind Study — original native 64×64 multi-shaded bead sprites. No external assets. */
(function(){
'use strict';
const N=64, list=[
{id:'forest_fox_64',group:'animal',size:N},
{id:'starlit_owl_64',group:'animal',size:N},
{id:'garden_cottage_64',group:'nature',size:N},
{id:'koi_pond_64',group:'nature',size:N},
{id:'balloon_voyage_64',group:'sky',size:N}
];
function draw(){
 const p=Array(N*N).fill(0);
 const dot=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<N&&y>=0&&y<N)p[y*N+x]=c};
 function ellipse(cx,cy,rx,ry,c){
  if(rx<=0||ry<=0)return;
  for(let y=Math.max(0,Math.floor(cy-ry));y<=Math.min(N-1,Math.ceil(cy+ry));y++)
   for(let x=Math.max(0,Math.floor(cx-rx));x<=Math.min(N-1,Math.ceil(cx+rx));x++)
    if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)dot(x,y,c)
 }
 function border(cx,cy,rx,ry,b,c,w=2){ellipse(cx,cy,rx,ry,b);ellipse(cx,cy,rx-w,ry-w,c)}
 function rect(x,y,w,h,c){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)dot(xx,yy,c)}
 function poly(points,c){
  const xs=points.map(a=>a[0]),ys=points.map(a=>a[1]);
  for(let y=Math.max(0,Math.floor(Math.min(...ys)));y<=Math.min(N-1,Math.ceil(Math.max(...ys)));y++)
   for(let x=Math.max(0,Math.floor(Math.min(...xs)));x<=Math.min(N-1,Math.ceil(Math.max(...xs)));x++){
    let yes=false;
    for(let i=0,j=points.length-1;i<points.length;j=i++){
     const a=points[i],b=points[j];
     if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes
    }if(yes)dot(x,y,c)
   }
 }
 function line(x,y,u,v,c,w=1){const n=Math.ceil(Math.max(Math.abs(u-x),Math.abs(v-y))*2);for(let i=0;i<=n;i++){const t=i/n;ellipse(x+(u-x)*t,y+(v-y)*t,Math.max(.6,w/2),Math.max(.6,w/2),c)}}
 function spark(x,y,r,c){line(x-r,y,x+r,y,c);line(x,y-r,x,y+r,c);dot(x-1,y-1,c);dot(x+1,y+1,c)}
 function ring(x,y,r,edge,fill){border(x,y,r,r,edge,fill,1.5)}
 return {p,dot,ellipse,border,rect,poly,line,spark,ring}
}
const sprites={
forest_fox_64(c){
 const {ellipse:E,border:B,poly:P,line:L,spark:S,dot:D}=c;
 // Woodland dusk setting and foliage
 E(32,55,27,6,23);E(29,55,21,4,7);E(38,56,11,2,9);
 for(const [x,y] of [[8,12],[53,13],[9,38],[55,40]])S(x,y,2,11);
 for(const [x,y,r] of [[7,48,5],[52,47,7],[57,53,6],[15,54,5]]){E(x,y,r,r-1,23);E(x-1,y-2,r-2,r-2,7)}
 // Big fluffy tail behind body
 B(45,40,12,18,27,6,2.5);E(49,31,8,10,19);E(50,26,6,6,16);E(40,49,9,6,27);
 // Feet and chest
 B(31,47,17,13,27,6,2);E(30,49,12,10,16);B(20,55,7,5,27,17,1.7);B(43,54,7,5,27,17,1.7);
 // Ears behind oversized face, several color planes
 P([[10,28],[10,6],[17,12],[24,23]],27);P([[14,23],[13,12],[21,22]],18);
 P([[38,23],[49,5],[51,30]],27);P([[40,22],[47,12],[47,27]],18);
 B(30,31,22,18,27,6,3);E(22,24,12,10,24);E(39,23,11,9,19);
 E(19,33,11,10,16);E(39,34,12,11,16);E(30,39,8,7,29);
 E(17,35,4,3,30);E(45,35,4,3,30);
 // Eyes with specular whites
 E(21,30,3,5,27);E(40,30,3,5,27);E(20,29,1,2,29);E(39,29,1,2,29);
 P([[27,37],[33,37],[30,41]],20);
 L(29,42,31,43,20,1);D(29,44,30);D(32,44,30);
 S(57,24,2,2)
},
starlit_owl_64(c){
 const {ellipse:E,border:B,poly:P,line:L,spark:S,dot:D,ring:R}=c;
 for(const [x,y,r] of [[9,11,3],[54,12,2],[6,35,2],[57,38,3],[43,6,2]])S(x,y,r,2);
 E(31,58,24,4,9);E(32,56,15,3,22);
 // Wings underneath the rounded owl's body
 B(18,42,11,16,27,26,2);B(46,42,11,16,27,5,2);
 B(32,38,19,22,27,28,2.5);
 // Crown / ear tufts
 P([[15,24],[11,12],[26,22]],27);P([[18,22],[15,15],[24,22]],26);
 P([[40,22],[52,12],[48,29]],27);P([[41,22],[49,17],[46,27]],26);
 E(32,42,13,16,16);E(25,25,11,12,29);E(40,25,11,12,29);
 // Periocular rings and deep irises
 B(24,31,10,10,20,17,1.5);B(40,31,10,10,20,17,1.5);
 E(24,31,6,7,11);E(40,31,6,7,11);
 E(25,31,4,6,27);E(39,31,4,6,27);
 E(26,29,2,3,29);E(38,29,2,3,29);
 P([[29,39],[35,39],[32,46]],24);P([[31,40],[34,40],[32,43]],2);
 L(27,51,26,55,24,2);L(37,51,38,55,24,2);
 for(const x of [21,43]){D(x,51,30);D(x+1,53,30)}
 E(18,43,4,7,5);E(48,43,4,7,5);
 R(55,54,2,22,13)
},
garden_cottage_64(c){
 const {ellipse:E,border:B,poly:P,line:L,spark:S,dot:D,rect:Q}=c;
 // Leaves & tiny cosmos in courtyard
 E(31,58,30,5,23);E(30,60,27,4,7);
 E(8,49,6,9,23);E(8,49,4,8,7);
 E(54,47,8,11,23);E(54,45,6,9,7);E(50,42,5,6,12);
 // Roof slopes
 P([[7,27],[31,7],[55,27],[52,33],[12,33]],27);
 P([[12,27],[31,12],[51,27],[48,30],[15,30]],18);
 P([[16,26],[31,15],[46,26]],1);
 // Chimney on roof
 Q(42,10,8,15,27);Q(44,12,4,11,20);Q(41,9,10,3,27);
 E(45,6,4,2,21);E(49,3,3,2,21);
 // House body
 Q(13,30,38,25,27);Q(16,32,32,21,16);
 Q(19,34,7,10,20);Q(20,35,5,8,13);L(22,35,22,42,27,1);
 Q(38,34,7,10,20);Q(39,35,5,8,13);L(42,35,42,42,27,1);
 // Door with arch top, golden handle
 B(32,46,7,10,27,19,2);E(32,41,5,4,20);E(35,48,1,1,24);
 L(17,55,49,55,20,2);
 // Flower beds
 for(const [x,y,pal] of [[11,54,1],[53,55,30],[6,57,2],[58,57,1]]){
  E(x-2,y,2,2,pal);E(x+2,y,2,2,pal);E(x,y-2,2,2,pal);
  E(x,y,2,2,24);D(x,y,11)
 }
 S(9,10,2,24);S(56,11,2,2)
},
koi_pond_64(c){
 const {ellipse:E,border:B,poly:P,line:L,spark:S,dot:D,ring:R}=c;
 // Oval pond and aquatic ring
 B(32,34,29,24,27,13,2);
 E(32,34,25,20,22);E(31,34,20,16,4);
 E(13,24,8,6,13);E(48,47,8,6,13);
 // Layered lily pads with dark rims
 for(const [x,y,r] of [[13,43,7],[53,28,7],[13,18,4]]){
  B(x,y,r,r-2,27,23,1);E(x-2,y-1,r-3,r-3,12);
  P([[x,y],[x+r,y-3],[x+r-1,y+2]],4)
 }
 // First koi, swimming toward north-west
 P([[17,33],[11,37],[14,28]],27);
 P([[17,32],[12,35],[14,30]],18);
 B(25,30,12,6,27,16,1.5);E(27,28,6,3,1);E(23,31,4,3,6);
 P([[28,27],[31,20],[32,29]],18);
 P([[25,32],[27,39],[30,33]],18);
 E(33,28,2,2,20);D(34,28,29);
 // Second koi, facing lower-right
 P([[47,33],[53,29],[51,40]],27);
 P([[47,34],[51,32],[50,38]],18);
 B(40,38,11,6,27,16,1.5);E(38,38,5,3,1);E(42,36,5,3,6);
 P([[38,36],[34,30],[35,38]],18);P([[38,40],[34,46],[43,41]],18);
 E(31,39,2,2,20);D(30,39,29);
 // Bubbles & sparkle flecks
 for(const [x,y] of [[18,14],[43,15],[18,54],[48,54]])R(x,y,2,13,21);
 S(33,14,2,11)
},
balloon_voyage_64(c){
 const {ellipse:E,border:B,poly:P,line:L,spark:S,dot:D,rect:Q}=c;
 // Stars, dusk puffs and rolling clouds
 for(const [x,y,r] of [[8,7,3],[55,9,3],[12,31,2],[53,34,2],[43,7,2]])S(x,y,r,2);
 E(10,54,10,4,21);E(17,55,9,5,13);E(51,55,13,5,21);E(43,59,10,3,13);
 // Big hot-air balloon segmented shading
 B(31,25,20,21,27,5,2.5);E(25,21,10,16,14);
 E(18,23,6,12,1);E(39,23,7,15,24);E(47,24,4,11,18);
 E(29,18,6,8,29);E(35,24,6,13,5);
 P([[13,31],[20,40],[42,40],[50,31],[45,42],[34,49],[27,49],[18,42]],27);
 P([[18,36],[23,39],[40,39],[44,36],[39,44],[24,44]],14);
 // Ropes and hanging basket
 L(23,44,25,53,20,1.6);L(39,44,37,53,20,1.6);
 Q(23,51,16,9,27);Q(25,53,12,6,19);L(25,57,37,57,6,1);
 E(30,54,3,2,11);E(32,54,3,2,11);
 // Crescent moon & a planet
 E(55,24,4,4,24);E(57,22,3,3,0);
 B(10,42,4,4,13,21,1);L(5,42,15,42,22,1);
}
};
const cache=new Map();
function get(id){
 if(cache.has(id))return cache.get(id).slice();
 if(!sprites[id])return null;
 const p=draw();sprites[id](p);
 if(p.p.length!==N*N)return null;
 cache.set(id,p.p);return p.p.slice()
}
const old=window.getBeadArtPixels;
window.BEAD_ART_LIBRARY=(window.BEAD_ART_LIBRARY||[]).concat(list);
window.getBeadArtPixels=id=>get(id)||(typeof old==='function'?old(id):null);
})();