/* Wind Study — high-definition, original 48×48 bead sprites.
   Pure palette-based geometry (no external images or copyrighted characters).
   Optimized for an editable single-pixel bead grid. */
(function(){
'use strict';
const S=48;
const art=[
  {id:'fox_hd',group:'animal',size:S},
  {id:'kitten_hd',group:'animal',size:S},
  {id:'whale_hd',group:'animal',size:S},
  {id:'rabbit_moon_hd',group:'sky',size:S},
  {id:'blossom_hd',group:'nature',size:S},
  {id:'cake_hd',group:'food',size:S},
  {id:'rocket_hd',group:'sky',size:S},
  {id:'butterfly_hd',group:'nature',size:S}
];
function Painter(){
 const pixels=Array(S*S).fill(0);
 function dot(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&x<S&&y>=0&&y<S)pixels[y*S+x]=c}
 function ell(cx,cy,rx,ry,c){
  for(let y=Math.max(0,Math.floor(cy-ry));y<=Math.min(S-1,Math.ceil(cy+ry));y++)
   for(let x=Math.max(0,Math.floor(cx-rx));x<=Math.min(S-1,Math.ceil(cx+rx));x++)
    if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)dot(x,y,c)
 }
 function outline(cx,cy,rx,ry,edge,fill,w=1.6){
  ell(cx,cy,rx,ry,edge);ell(cx,cy,rx-w,ry-w,fill)
 }
 function rect(x,y,w,h,c){
  for(let yy=Math.round(y);yy<Math.round(y+h);yy++)
   for(let xx=Math.round(x);xx<Math.round(x+w);xx++)dot(xx,yy,c)
 }
 function round(x,y,w,h,r,c){
  rect(x+r,y,w-2*r,h,c);rect(x,y+r,w,h-2*r,c);
  ell(x+r,y+r,r,r,c);ell(x+w-r-1,y+r,r,r,c);
  ell(x+r,y+h-r-1,r,r,c);ell(x+w-r-1,y+h-r-1,r,r,c)
 }
 function poly(points,c){
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  for(let y=Math.max(0,Math.floor(Math.min(...ys)));y<=Math.min(S-1,Math.ceil(Math.max(...ys)));y++)
   for(let x=Math.max(0,Math.floor(Math.min(...xs)));x<=Math.min(S-1,Math.ceil(Math.max(...xs)));x++){
    let inside=false;
    for(let i=0,j=points.length-1;i<points.length;j=i++){
      const a=points[i],b=points[j];
      if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside
    }
    if(inside)dot(x,y,c)
   }
 }
 function line(x1,y1,x2,y2,c,w=1){
  const steps=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))*2);
  for(let i=0;i<=steps;i++){const t=i/steps;ell(x1+(x2-x1)*t,y1+(y2-y1)*t,Math.max(.65,w/2),Math.max(.65,w/2),c)}
 }
 function sparkle(x,y,r,c){
  line(x-r,y,x+r,y,c,1);line(x,y-r,x,y+r,c,1);
  dot(x-1,y-1,c);dot(x+1,y+1,c)
 }
 function heart(x,y,c){
  ell(x-2,y-1,3,3,c);ell(x+2,y-1,3,3,c);
  poly([[x-5,y],[x+5,y],[x,y+7]],c)
 }
 function star(x,y,rad,c){
  const v=[];for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?rad*.46:rad;v.push([x+Math.cos(a)*r,y+Math.sin(a)*r])}
  poly(v,c)
 }
 return {pixels,dot,ell,outline,rect,round,poly,line,sparkle,heart,star}
}
const drawings={
 fox_hd(p){
  const {ell:E,outline:O,poly:P,round:R,line:L,dot:D,sparkle:S}=p;
  // Sweeping expressive tail, then sitting body.
  O(37,30,8,12,27,19,2);E(40,24,6,5,16);E(41,23,3,3,29);
  O(23,34,10,11,27,6,2);E(22,36,7,7,17);
  O(14,38,4,3,27,16,1);O(28,39,5,3,27,16,1);
  // Tapered ears and inner velvet.
  P([[9,19],[9,4],[15,10],[20,19]],27);P([[11,16],[11,8],[17,17]],18);
  P([[27,19],[36,5],[37,23]],27);P([[28,17],[34,10],[34,20]],18);
  O(23,21,16,14,27,6,2);E(17,17,9,7,23);E(27,17,9,7,24);
  E(19,28,10,7,16);E(27,28,10,7,16);E(23,31,5,4,29);
  E(16,19,4,5,19);E(31,19,4,5,19);
  E(17,23,2,3,27);E(30,23,2,3,27);D(18,22,29);D(31,22,29);
  E(13,27,3,2,10);E(34,27,3,2,10);
  P([[21,28],[25,28],[23,31]],20);
  L(22,33,24,34,20,1);
  S(7,34,2,23)
 },
 kitten_hd(p){
  const {ell:E,outline:O,poly:P,line:L,round:R,dot:D,heart:H,sparkle:S}=p;
  // Teacup with a tiny cat peeking out.
  P([[15,19],[15,6],[22,14]],27);P([[17,17],[17,11],[21,17]],30);
  P([[29,14],[37,6],[36,21]],27);P([[31,17],[35,11],[34,19]],30);
  O(26,21,13,13,27,11,2);E(21,18,8,7,29);
  E(21,23,3,4,27);E(32,23,3,4,27);D(22,22,29);D(33,22,29);
  E(17,28,3,2,30);E(36,28,3,2,30);
  P([[25,27],[28,27],[26.5,29]],18);L(24,30,26,31,27,1);L(27,31,29,30,27,1);
  L(12,28,21,29,31,1);L(32,29,41,27,31,1);
  // Cup body, handle, rim, base and decorative little heart.
  O(37,34,7,6,27,21,2);
  R(11,30,28,14,4,27);R(13,31,24,10,3,21);
  R(13,32,21,3,2,29);R(17,40,17,2,1,22);
  O(25,35,4,3,18,30,1);H(25,34,18);
  E(25,44,17,2,27);E(25,44,14,1,26);
  S(8,15,2,13)
 },
 whale_hd(p){
  const {ell:E,outline:O,poly:P,line:L,dot:D,sparkle:S,heart:H}=p;
  // Water, fins, spout and a curved smile.
  L(7,37,15,37,13,2);L(32,39,42,39,13,2);
  P([[34,25],[46,18],[44,31],[36,32]],27);P([[35,25],[43,22],[42,29],[35,31]],22);
  O(23,27,17,12,27,4,2);
  E(22,33,11,5,13);E(19,20,12,5,21);
  P([[14,29],[8,34],[17,35]],9);P([[33,32],[42,31],[36,37]],9);
  E(30,25,2,3,27);D(31,24,29);
  E(33,31,3,2,10);L(25,32,31,34,27,1);
  L(17,16,17,8,22,2);L(17,9,13,5,22,2);L(17,9,21,4,22,2);
  E(13,4,2,2,13);E(22,5,2,2,13);
  S(7,18,2,13);H(38,9,1)
 },
 rabbit_moon_hd(p){
  const {ell:E,outline:O,poly:P,line:L,dot:D,star:S,sparkle:X,heart:H}=p;
  // A moon crescent with layered shadow / highlight.
  O(25,24,18,18,27,24,2);E(32,17,15,16,0);
  E(17,31,7,7,16);E(18,33,4,4,11);
  // Rabbit's long tipped ears.
  O(24,14,4,11,27,29,1.5);O(32,14,4,12,27,29,1.5);
  E(24,15,2,7,30);E(32,15,2,8,30);
  O(29,29,11,10,27,29,2);E(25,27,5,4,16);
  E(24,29,1.5,2,27);E(33,29,1.5,2,27);
  E(22,33,2,1.5,10);E(36,33,2,1.5,10);
  P([[27,33],[30,33],[29,35]],18);L(28,36,30,37,27,1);
  S(39,12,3,2);S(10,12,3,2);X(41,29,2,24);
  X(9,23,2,13)
 },
 blossom_hd(p){
  const {ell:E,outline:O,poly:P,line:L,dot:D,sparkle:S}=p;
  // Little blue ceramic pot with a blooming miniature tree.
  O(24,37,12,8,27,4,2);E(20,35,8,3,13);E(24,41,8,2,9);
  L(24,35,23,16,20,3);L(23,23,13,17,20,2);L(23,23,35,11,20,2);
  L(24,24,36,25,20,2);L(22,20,14,9,20,2);
  const flowers=[[13,9,4],[19,12,4],[34,11,5],[36,25,4],[14,18,4],[25,7,4],[28,21,3]];
  flowers.forEach(([x,y,r],i)=>{
    E(x-r/2,y-r/2,r*.65,r*.6,i%2?30:1);
    E(x+r/2,y-r/2,r*.65,r*.6,30);
    E(x-r/2,y+r/2,r*.65,r*.6,10);
    E(x+r/2,y+r/2,r*.65,r*.6,1);
    E(x,y,2,2,24);D(x,y,11)
  });
  P([[30,26],[36,19],[34,29]],23);P([[13,23],[8,16],[17,20]],7);
  S(40,7,2,24)
 },
 cake_hd(p){
  const {ell:E,outline:O,poly:P,line:L,round:R,dot:D,heart:H,sparkle:S}=p;
  // Layered strawberry cake with gentle buttercream icing.
  E(24,43,18,3,27);E(24,42,16,2,21);
  R(12,21,25,20,4,27);R(14,23,21,16,3,17);
  R(14,30,21,4,2,28);R(14,36,21,3,2,16);
  R(10,18,29,10,4,27);R(12,19,25,7,3,29);
  E(15,25,3,4,29);E(24,26,3,3,29);E(33,25,3,4,29);
  E(16,33,2,1.5,11);E(32,33,2,1.5,11);
  // Strawberry on top: silhouette, leaf and sparkle.
  O(24,12,6,7,27,1,1.5);
  E(22,9,3,3,10);E(21,14,2,3,18);
  P([[17,6],[22,9],[24,4],[26,9],[31,6],[28,3],[20,3]],23);
  D(24,11,11);D(27,14,11);D(21,16,11);
  E(20,30,1.5,2,27);E(29,30,1.5,2,27);H(24,33,18);
  S(39,13,2,2)
 },
 rocket_hd(p){
  const {ell:E,outline:O,poly:P,line:L,dot:D,star:S,sparkle:X}=p;
  // A tall retro spaceship, flame and star field.
  P([[18,34],[15,40],[23,37]],27);P([[18,35],[17,38],[21,37]],6);
  P([[30,34],[34,40],[25,37]],27);P([[30,35],[32,38],[27,37]],6);
  P([[23,34],[26,34],[30,43],[25,41],[23,46],[18,42]],24);
  P([[23,35],[26,35],[28,41],[24,39],[22,44],[21,40]],2);
  // Hull top / belly with dark contours.
  P([[23,4],[18,11],[15,22],[17,34],[20,38],[29,38],[32,34],[33,22],[28,10]],27);
  P([[23,8],[20,13],[18,23],[19,33],[21,35],[28,35],[30,32],[30,23],[27,13]],21);
  P([[23,7],[20,13],[27,13]],18);
  P([[19,28],[30,28],[28,34],[20,34]],4);
  O(24,20,7,7,27,13,2);E(22,18,3,3,29);E(26,22,2,2,22);
  L(20,31,28,31,9,1);
  X(9,12,3,2);X(39,18,3,11);S(38,7,4,2);
  E(10,34,3,3,25);E(10,34,1.5,1.5,4)
 },
 butterfly_hd(p){
  const {ell:E,outline:O,poly:P,line:L,dot:D,sparkle:S,heart:H}=p;
  // Differentiated top / lower wings for a decorative butterfly.
  P([[23,23],[13,8],[5,7],[6,23],[18,27]],27);
  P([[20,23],[13,11],[8,10],[9,22],[18,24]],5);
  E(13,17,5,5,14);E(15,22,4,3,10);
  P([[24,23],[36,8],[44,7],[42,23],[29,27]],27);
  P([[27,23],[36,11],[41,10],[39,22],[30,24]],5);
  E(35,17,5,5,14);E(33,22,4,3,10);
  P([[21,26],[7,25],[9,37],[17,40],[24,31]],27);
  P([[20,28],[10,28],[12,35],[17,37],[22,30]],1);
  E(17,33,3,3,30);
  P([[26,26],[41,25],[39,37],[31,40],[24,31]],27);
  P([[28,28],[38,28],[36,35],[31,37],[26,30]],1);
  E(31,33,3,3,30);
  O(24,26,3,13,27,19,1.5);E(23,22,1,2,24);
  L(23,14,19,9,27,1);L(25,14,29,9,27,1);
  S(6,41,2,24);S(41,43,2,13)
 }
};
const cache=new Map();
function getPixels(id){
 if(cache.has(id))return cache.get(id).slice();
 const fn=drawings[id];if(!fn)return null;
 const painter=Painter();fn(painter);
 if(painter.pixels.length!==S*S)return null;
 cache.set(id,painter.pixels);return painter.pixels.slice()
}
const previous=window.getBeadArtPixels;
window.BEAD_ART_LIBRARY=(window.BEAD_ART_LIBRARY||[]).concat(art);
window.getBeadArtPixels=function(id){return getPixels(id)||(typeof previous==='function'?previous(id):null)};
})();