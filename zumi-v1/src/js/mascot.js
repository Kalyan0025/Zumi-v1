/* Zumi mascot: fortune-cookie body, Taurus horn on the left ear, 8 expressions */
(function(){
let mid=0;
const EX={look:{eye:'open',px:5.5,py:.5,brow:[0,0],mouth:'smile'},happy:{eye:'happy',brow:[-1,-1],mouth:'grin'},wink:{eye:'wink',px:5.5,py:.5,brow:[0,-2],mouth:'smile'},wow:{eye:'open',px:0,py:0,pr:3.2,er:9.6,brow:[-4,-4],mouth:'o'},smirk:{eye:'open',px:5.5,py:1,brow:[0,-3],mouth:'smirk'},think:{eye:'open',px:4,py:-4,brow:[1,-4],mouth:'wavy'},nervous:{eye:'open',px:-2,py:2,brow:[-3,-3],mouth:'wob'},proud:{eye:'happy',brow:[-2,-2],mouth:'grin',blush:1}};
Z.mv=0;
Z.VARIANTS=['Current','Pinch','Rim','Slip','Crescent','Fold','Soft'];
const S0="M50,33 C44,24 33,1 22,2 C10,6 0,28 0,45 C0,68 24,84 50,84 C76,84 100,68 100,45 C100,28 90,6 78,2 C67,1 56,24 50,33 Z";
const SHAPE={0:S0,1:"M50,39 C45,28 33,1 22,2 C10,6 0,28 0,45 C0,68 24,84 50,84 C76,84 100,68 100,45 C100,28 90,6 78,2 C67,1 55,28 50,39 Z",2:S0,3:S0,
 4:"M46,32 C41,24 32,8 20,10 C8,14 0,30 1,46 C2,66 24,84 50,84 C78,84 100,66 100,44 C100,26 90,4 76,1 C64,-1 53,22 46,32 Z",5:S0,6:S0};
const TILT={0:0,1:0,2:-7,3:-7,4:5,5:-4,6:0};
const FACE={4:[3,2]};
const HORN={4:[0,8]};
const SPECK=[[18,38,.9],[30,22,.8],[24,62,1],[40,72,.8],[62,70,.9],[78,60,1],[84,36,.8],[70,18,.9],[14,50,.7],[54,78,.7],[90,50,.8],[34,52,.6],[60,10,.7],[8,38,.6],[46,58,.6],[74,44,.6]];
const OPEN="M1,50 C2,68 24,84 50,84 C36,80 20,70 12,54 C8,54 4,52 1,50 Z";
Z.mascot=function(sz,ex='look',o={}){
 const i=++mid,v=o.v!==undefined?o.v:Z.mv,e=EX[ex]||EX.look,K='#1A0F08',er=e.er||8.8,pr=e.pr||4.4,px=e.px||0,py=e.py||0;
 const shape=SHAPE[v];
 const eye=(x,y,happy)=>happy?`<path d="M${x-7},${y+2} Q${x},${y-8} ${x+7},${y+2}" fill="none" stroke="${K}" stroke-width="2.6" stroke-linecap="round"/>`:`<circle cx="${x}" cy="${y}" r="${er}" fill="#fff"/><circle class="pp" cx="${x+px}" cy="${y+py}" r="${pr}" fill="${K}"/>`;
 const h=e.eye==='happy',[b1,b2]=e.brow;
 const M={smile:`<path d="M49.5,59 Q55,63.5 61,58.5" fill="none" stroke="${K}" stroke-width="2.3" stroke-linecap="round"/>`,grin:`<path d="M47,58 Q55,68 63,58 Z" fill="${K}" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>`,o:`<ellipse cx="55" cy="62" rx="3.4" ry="4.2" fill="${K}"/>`,smirk:`<path d="M49,61 Q56,63 63,56" fill="none" stroke="${K}" stroke-width="2.3" stroke-linecap="round"/>`,wavy:`<path d="M48,61 q3,-3 6,0 t6,0" fill="none" stroke="${K}" stroke-width="2.2" stroke-linecap="round"/>`,wob:`<path d="M49,62 q2,-3 4,0 t4,0 t4,0" fill="none" stroke="${K}" stroke-width="2.2" stroke-linecap="round"/>`}[e.mouth];
 const bl=e.blush?'<ellipse cx="22" cy="58" rx="5" ry="3" fill="#FF4D3A" opacity=".45"/><ellipse cx="84" cy="58" rx="5" ry="3" fill="#FF4D3A" opacity=".35"/>':'';
 const gf=o.glow?`<filter id="bl${i}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>`:'';
 const gl=o.glow?`<path d="${shape}" fill="#FF8A2E" opacity=".35" filter="url(#bl${i})" transform="translate(0,2)"/>`:'';
 const [fx,fy]=FACE[v]||[0,0],[hx,hy]=HORN[v]||[0,0];
 const face=`<g transform="translate(${fx},${fy})">${bl}<path d="M26,${35+b1} Q32,${29.5+b1} 39,${30.5+b1}" fill="none" stroke="${K}" stroke-width="2.3" stroke-linecap="round"/><path d="M60,${33+b2} Q67,${28.5+b2} 74,${31+b2}" fill="none" stroke="${K}" stroke-width="2.3" stroke-linecap="round"/>${eye(37,46,h)}${eye(69.5,45.5,h||e.eye==='wink')}${M}</g>`;
 const horn=`<g transform="translate(${1+hx},${2.5+hy})"><path d="M17,6 C12,0 14,-8 23,-11 C18,-7 19,-1 22,4 Z" fill="#2B3A91" stroke="#2B3A91" stroke-width="1.2" stroke-linejoin="round"/></g>`;
 const defs=`<defs>${gf}<linearGradient id="mg${i}" x1="0" y1="0.2" x2="1" y2="0.6"><stop offset="0" stop-color="#EC6226"/><stop offset=".5" stop-color="#F68A2E"/><stop offset="1" stop-color="#FFA64F"/></linearGradient><radialGradient id="mr${i}" cx=".25" cy=".9" r=".5"><stop offset="0" stop-color="#FF6A3A" stop-opacity=".35"/><stop offset="1" stop-color="#FF4D3A" stop-opacity="0"/></radialGradient><clipPath id="mc${i}"><path d="${shape}"/></clipPath><filter id="mn${i}"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .6  0 0 0 0 .3  0 0 0 1.6 -.55"/></filter><radialGradient id="sh${i}" cx=".82" cy=".95" r=".7"><stop offset="0" stop-color="#9B330A" stop-opacity=".42"/><stop offset="1" stop-color="#9B330A" stop-opacity="0"/></radialGradient><radialGradient id="hl${i}" cx=".26" cy=".16" r=".5"><stop offset="0" stop-color="#FFF1D6" stop-opacity=".5"/><stop offset="1" stop-color="#FFF1D6" stop-opacity="0"/></radialGradient><radialGradient id="gs${i}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#6E2A08" stop-opacity=".3"/><stop offset="1" stop-color="#6E2A08" stop-opacity="0"/></radialGradient><linearGradient id="op${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E3410"/><stop offset="1" stop-color="#C45A1C"/></linearGradient><linearGradient id="bk${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E0561E"/><stop offset="1" stop-color="#C8431A"/></linearGradient></defs>`;
 const cookie=v>0;
 let pre='',post='';
 if(cookie){
  post+=`<g clip-path="url(#mc${i})"><rect width="110" height="90" fill="url(#sh${i})"/><rect width="110" height="90" fill="url(#hl${i})"/>${SPECK.map(a=>`<circle cx="${a[0]}" cy="${a[1]}" r="${a[2]}" fill="#B5500F" opacity=".34"/>`).join('')}`;
  /* folded rim: a seam that follows the lower edge */
  if(v!==5)post+=`<path d="M5,52 C7,70 27,80 50,80 C73,80 93,70 95,52" fill="none" stroke="#B3480F" stroke-opacity=".28" stroke-width="1.3"/><path d="M5,55 C8,72 28,83 50,83 C72,83 92,72 95,55" fill="none" stroke="#FFD9A0" stroke-opacity=".28" stroke-width="1"/>`;
  if(v===1)post+=`<ellipse cx="50" cy="37" rx="15" ry="11" fill="#9B330A" opacity=".22"/><path d="M50,39 C51.5,44 51.5,48 50.5,52" fill="none" stroke="#A9420F" stroke-opacity=".4" stroke-width="1.5" stroke-linecap="round"/><path d="M52,40 C53.5,45 53.5,49 52.5,53" fill="none" stroke="#FFE2B0" stroke-opacity=".3" stroke-width="1" stroke-linecap="round"/>`;
  if(v===5)post+=`<path d="M52,32 C74,38 90,52 92,70 L100,70 L100,20 L60,0 Z" fill="url(#bk${i})" opacity=".55"/><path d="M52,32 C74,38 90,52 92,70" fill="none" stroke="#7E2C08" stroke-opacity=".3" stroke-width="3.2" stroke-linecap="round"/><path d="M52,32 C74,38 90,52 92,70" fill="none" stroke="#FFD9A0" stroke-opacity=".55" stroke-width="1" stroke-linecap="round" transform="translate(-1.4,-1.2)"/>`;
  post+='</g>';
  if(v===2||v===3||v===4)post+=`<path d="${OPEN}" fill="url(#op${i})"/><path d="M12,54 C20,70 36,80 50,84" fill="none" stroke="#FFC48A" stroke-opacity=".75" stroke-width="1.2" stroke-dasharray="1.6 2.2" stroke-linecap="round"/>`;
 }
 if(v===3)pre+=`<g transform="translate(66,62) rotate(24)"><rect x="1.5" y="2.5" width="44" height="17" rx="2.4" fill="#6E2A08" opacity=".22"/><rect width="44" height="17" rx="2.4" fill="#FFF4E4"/><rect width="44" height="17" rx="2.4" fill="none" stroke="#000" stroke-opacity=".07"/><path d="M26 5.5H38M26 10.5H34" stroke="#D6B98E" stroke-width="1.5" stroke-linecap="round"/></g>`;
 const ground=cookie?`<ellipse cx="50" cy="86" rx="46" ry="5.5" fill="url(#gs${i})"/>`:'';
 return `<svg width="${sz}" height="${Math.round(sz*.84)}" viewBox="0 0 100 84" style="display:block;overflow:visible" ${o.track?'data-track="1"':''} aria-hidden="true">${defs}${ground}<g transform="rotate(${TILT[v]} 50 52)">${pre}${gl}<path d="${shape}" fill="url(#mg${i})"/><path d="${shape}" fill="url(#mr${i})"/><g clip-path="url(#mc${i})"><rect width="110" height="90" filter="url(#mn${i})" opacity=".32"/></g>${post}${face}${horn}</g></svg>`;
};
/* put a mascot in a node; optional pop animation */
Z.reg=[];
Z.setMascot=function(node,sz,ex,o,pop){node.innerHTML=Z.mascot(sz,ex,o);Z.reg=Z.reg.filter(r=>r.n.isConnected&&r.n!==node);Z.reg.push({n:node,sz,ex,o});if(pop){node.classList.remove('pop');void node.offsetWidth;node.classList.add('pop')}};
Z.setVariant=function(v){Z.mv=v;Z.reg=Z.reg.filter(r=>r.n.isConnected);Z.reg.forEach(r=>{r.n.innerHTML=Z.mascot(r.sz,r.ex,r.o)})};
/* eyes follow the pointer on mascots marked track */
addEventListener('pointermove',e=>{
 document.querySelectorAll('svg[data-track]').forEach(sv=>{
  const r=sv.getBoundingClientRect();if(!r.width)return;
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy)||1,k=Math.min(1,d/160);
  dx=dx/d*k*3;dy=dy/d*k*3;
  sv.querySelectorAll('.pp').forEach(p=>p.style.transform=`translate(${dx}px,${dy}px)`);
 });
});
})();
