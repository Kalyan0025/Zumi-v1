/* Today's reading overlay: opens from the reading row at the top of Home */
Z.sheet=(function(){
 const sh=Z.$('#sheet'),panel=Z.$('#sheet .sh'),row=Z.$('#readRow'),R=Z.data.READING;
 const rows=R.rows.map((r,i)=>`<div class="zrow stg" style="--i:${i+4};animation:none"><div class="g"><span class="gt">${r[0]}</span></div><div class="t"><b>${r[1]}</b><br><span>${Z.esc(r[2])}</span></div></div>`).join('');
 Z.$('#sheetBody').innerHTML=`
  <div class="shm stg" style="--i:0" id="shM"></div>
  <div class="sgn stg" style="--i:1">${R.sign} · ${R.date}</div>
  <h1 class="stg" style="--i:2">${R.title[0]}<br>${R.title[1]}</h1>
  <p class="lead stg" style="--i:3">${R.lead}</p>
  <div class="rows">${rows}</div>
  <div class="od stg" style="--i:7"><b>Open door</b><br><span>${R.door}</span></div>`;
 Z.setMascot(Z.$('#shM'),54,'wink',{glow:true,track:true});
 Z.$('#sheetClose').innerHTML=Z.ic('x',18,'#1C1C1E');
 function open(){
  if(Z.kb.on)Z.kb.close();
  sh.classList.add('on');sh.setAttribute('aria-hidden','false');
  markSeen();
 }
 function close(cb){sh.classList.remove('on');sh.setAttribute('aria-hidden','true');panel.style.transform='';if(cb)setTimeout(cb,420)}
 function markSeen(){row.classList.add('seen')}
 row.onclick=open;
 Z.$('#sheetClose').onclick=()=>close();
 Z.$('#sheetSec').onclick=()=>close();
 Z.$('#sheetCta').onclick=()=>close(()=>Z.kb.open(Z.$('#chatIn')));
 Z.$('#sheet .dim').onclick=()=>close();
 /* drag down to dismiss */
 (function(){
  const z=Z.$('#sheet .dragzone');let y0=0,dy=0,id=null;
  z.addEventListener('pointerdown',e=>{id=e.pointerId;y0=e.clientY;dy=0;z.setPointerCapture(id);panel.classList.add('drag')});
  z.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;const s=Z.$('#phone').getBoundingClientRect().width/390;dy=Math.max(0,(e.clientY-y0)/s);panel.style.transform=`translateY(${dy}px)`});
  const end=e=>{if(e.pointerId!==id)return;id=null;panel.classList.remove('drag');if(dy>110)close();else panel.style.transform=''};
  z.addEventListener('pointerup',end);z.addEventListener('pointercancel',end);
 })();
 return{open,close,markSeen};
})();
