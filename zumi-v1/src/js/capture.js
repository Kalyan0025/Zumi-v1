/* Add a moment: photo, voice, text. Opens from the black pill on Home. */
Z.cap=(function(){
 const $=Z.$,cap=$('#cap'),rev=$('#rev'),track=$('#track'),vf=$('#vf'),ta=$('#ta');
 const S={photos:[],mode:0,cur:null,tag:null,cam:0,flash:false,prompt:0,saving:false,holdCam:false};
 const TAGS=Z.data.TAGS,modeBtns=[...document.querySelectorAll('#modes button')];
 let curEx=null,camOn=false,rec={on:false},toastT=0;
 ta.dataset.enter='newline';

 /* icons */
 $('#closeCap').innerHTML=Z.ic('x',18,'#1C1C1E');
 $('#tFlash').innerHTML=Z.ic('flash',19);
 $('#tFlip').innerHTML=Z.ic('flip',19);
 $('#galE').innerHTML=Z.ic('img',22,'#6B6B70');
 $('#micI').innerHTML=Z.ic('mic',26,'#fff',1.8);
 $('#spark').innerHTML=Z.ic('spark',22,'#1C1C1E');
 $('#sparkT').insertAdjacentHTML('afterbegin',Z.ic('spark',16,'#1C1C1E'));
 $('#nextT').innerHTML=Z.ic('arrow',22,'#fff',1.9);
 $('#back').innerHTML=Z.ic('left',20,'#1C1C1E');
 $('#nextPi').innerHTML=Z.ic('arrow',24,'#fff',1.9);
 $('#plusS').innerHTML=Z.ic('plus',18,'#FF9A2E',2);

 function updateSide(){const p=S.photos.length,m=S.mode;$('#spark').classList.toggle('gone',m===2||(m===0&&p>0));$('#nextP').classList.toggle('on',m===0&&p>0);$('#nextP .cnt').textContent=p;$('#tray').classList.toggle('on',p>0);$('#p0 .chipin').style.opacity=p>0?0:1}
 function setExpr(ex,pop){
  if(ex===curEx&&!pop)return;curEx=ex;
  const m=$('#capM');m.innerHTML='<span class="mi"></span>';
  Z.setMascot(m.firstChild,52,ex,{track:true},pop);
 }
 function toast(t){
  const el=$('#toast');el.innerHTML=`<span class="gt" style="font-size:15px">✓</span>${t}`;
  el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),2100);
 }
 Z.toast=toast;

 /* open / close */
 function open(mode=0){
  if(cap.classList.contains('on'))return;
  cap.setAttribute('aria-hidden','false');cap.classList.remove('shut');cap.classList.add('on');
  setMode(mode,false);startCam();
 }
 function close(){
  if(rec.on)recStop(true);
  cap.classList.add('shut');cap.classList.remove('on','textmode');cap.setAttribute('aria-hidden','true');stopCam();
  Z.kb.close();
 }
 Z.kb.setKeep(()=>cap.classList.contains('on')&&S.mode===2&&!rev.classList.contains('on'));
 $('#openPill').onclick=()=>open(0);
 $('#closeCap').onclick=close;
 addEventListener('keydown',e=>{if(e.key==='Escape'){if(rev.classList.contains('on'))backFromReview();else if(cap.classList.contains('on'))close()}});

 /* modes */
 function moveInd(){const b=modeBtns[S.mode],ind=$('#mind');ind.style.left=b.offsetLeft+'px';ind.style.width=b.offsetWidth+'px'}
 function setMode(i,anim=true){
  if(rec.on)recStop(true);
  S.mode=i;
  track.classList.toggle('snap',anim);
  track.style.transform=`translateX(${-i*33.3334}%)`;
  modeBtns.forEach((b,k)=>b.classList.toggle('on',k===i));
  requestAnimationFrame(moveInd);
  $('#shwrap').dataset.m=i;
  $('#tools').classList.toggle('off',i!==0);
  $('#gal').classList.toggle('gone',i!==0);
  updateSide();
  cap.classList.toggle('textmode',i===2);
  setExpr(['look','look','think'][i],true);
  showPrompt(false);
  if(i===2){setTimeout(()=>{if(S.mode===2&&cap.classList.contains('on'))Z.kb.open(ta)},anim?260:520)}else Z.kb.close();
 }
 modeBtns.forEach(b=>b.onclick=()=>setMode(+b.dataset.i));
 setTimeout(moveInd,60);

 /* swipe the viewfinder */
 (function(){
  let sx=0,sy=0,t0=0,dragging=false,id=null,moved=false;
  vf.addEventListener('pointerdown',e=>{
   if(e.target.closest('textarea,button,input,.tray'))return;
   sx=e.clientX;sy=e.clientY;t0=performance.now();id=e.pointerId;dragging=false;moved=false;
   if(S.mode===0)vf.classList.add('press');
  });
  vf.addEventListener('pointermove',e=>{
   if(id!==e.pointerId)return;
   const dx=e.clientX-sx,dy=e.clientY-sy;
   if(!dragging&&Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2){dragging=true;moved=true;vf.setPointerCapture(id);track.classList.remove('snap');vf.classList.remove('press')}
   if(dragging){
    const sc=vf.getBoundingClientRect().width/358;let off=dx/sc;
    if((S.mode===0&&off>0)||(S.mode===2&&off<0))off*=.3;
    track.style.transform=`translateX(${-S.mode*358+off}px)`;
   }
  });
  const end=e=>{
   if(id!==e.pointerId)return;id=null;vf.classList.remove('press');
   if(dragging){
    const dx=(e.clientX-sx)/(vf.getBoundingClientRect().width/358),v=dx/(performance.now()-t0);
    let n=S.mode;
    if(dx<-70||v<-.45)n=Math.min(2,S.mode+1);else if(dx>70||v>.45)n=Math.max(0,S.mode-1);
    dragging=false;setMode(n,true);
   }else if(S.mode===0&&e.type==='pointerup'&&!moved){
    const r=$('#p0').getBoundingClientRect(),s=r.width/358,f=$('#focus');
    f.style.left=((e.clientX-r.left)/s-36)+'px';f.style.top=((e.clientY-r.top)/s-36)+'px';
    f.classList.remove('go');void f.offsetWidth;f.classList.add('go');
   }
  };
  vf.addEventListener('pointerup',end);vf.addEventListener('pointercancel',end);
 })();

 /* photo: stand-in scene drawn on a canvas, so the shutter really captures a frame */
 const cam=$('#cam'),cx=cam.getContext('2d');cam.width=716;cam.height=1072;
 function scene(t,v){
  const w=358,h=536;cx.setTransform(2,0,0,2,0,0);
  const g=cx.createLinearGradient(0,0,0,h);
  if(v===0){g.addColorStop(0,'#FFE6CC');g.addColorStop(.5,'#FFB77A');g.addColorStop(1,'#F2701D')}else{g.addColorStop(0,'#E6EEF7');g.addColorStop(.55,'#F7D2AA');g.addColorStop(1,'#EDB377')}
  cx.fillStyle=g;cx.fillRect(0,0,w,h);
  const sx=w*(.68+.07*Math.sin(t/3200)),sy=h*(.34+.025*Math.cos(t/2600));
  const rg=cx.createRadialGradient(sx,sy,0,sx,sy,200);rg.addColorStop(0,'rgba(255,250,235,.95)');rg.addColorStop(.18,'rgba(255,236,200,.7)');rg.addColorStop(1,'rgba(255,200,140,0)');
  cx.fillStyle=rg;cx.fillRect(0,0,w,h);cx.fillStyle='#FFF6E4';cx.beginPath();cx.arc(sx,sy,26,0,7);cx.fill();
  const cols=v===0?['rgba(201,86,30,.55)','rgba(168,67,26,.75)','rgba(98,40,16,.92)']:['rgba(143,165,196,.6)','rgba(111,134,170,.8)','rgba(70,92,128,.95)'];
  for(let k=0;k<3;k++){cx.fillStyle=cols[k];cx.beginPath();cx.moveTo(0,h);const base=h*(.58+k*.13);for(let x=0;x<=w;x+=6)cx.lineTo(x,base+Math.sin(x/(58-k*9)+k*2+t/(5200-k*900))*(16+k*7)+Math.sin(x/21+k)*3);cx.lineTo(w,h);cx.closePath();cx.fill()}
  for(let i=0;i<16;i++){const px=((i*97)%w+Math.sin(t/(2400+i*130)+i)*14+w)%w,py=((i*151)%h*.55+30+Math.cos(t/(2900+i*90)+i)*12);cx.fillStyle=`rgba(255,246,228,${.16+(i%4)*.06})`;cx.beginPath();cx.arc(px,py,5+(i%5)*3,0,7);cx.fill()}
 }
 function startCam(){if(camOn)return;camOn=true;const loop=t=>{if(!camOn)return;if(S.mode===0&&!S.holdCam)scene(t,S.cam);requestAnimationFrame(loop)};requestAnimationFrame(loop)}
 function stopCam(){camOn=false}
 $('#tFlash').onclick=()=>{S.flash=!S.flash;$('#tFlash').classList.toggle('act',S.flash);$('#tFlash').innerHTML=Z.ic('flash',19,S.flash?'#FFA64F':'currentColor')};
 $('#tFlip').onclick=()=>{S.cam=1-S.cam;cam.classList.remove('flip');void cam.offsetWidth;cam.classList.add('flip')};
 function setGal(src){const im=$('#galImg');im.src=src;im.hidden=false;$('#galE').hidden=true;const g=$('#gal');g.classList.remove('bump');void g.offsetWidth;g.classList.add('bump')}
 function snap(){
  if(S.photos.length>=10){toast('Ten photos is the max');return}
  $('#flash').className='flash '+(S.flash?'big':'go');setExpr('wow',true);S.holdCam=true;
  const src=cam.toDataURL('image/jpeg',.88);
  setTimeout(()=>{addPhoto(src);S.holdCam=false;setExpr('happy',true);setTimeout(()=>setExpr('look'),900)},S.flash?420:220);
 }
 function addPhoto(src){S.photos.push(src);setGal(src);renderTray(true);updateSide()}
 function renderTray(last){
  const t=$('#tray');
  t.innerHTML=S.photos.map((s,i)=>`<div class="th${last&&i===S.photos.length-1?' new':''}" style="--r:${i%2?2.5:-2.5}deg"><img src="${s}" alt="Photo ${i+1}"><button class="x" data-i="${i}" aria-label="Remove photo ${i+1}">×</button></div>`).join('');
  t.querySelectorAll('.x').forEach(b=>b.onclick=e=>{e.stopPropagation();S.photos.splice(+b.dataset.i,1);renderTray();updateSide();if(!S.photos.length){$('#galImg').hidden=true;$('#galE').hidden=false}});
  t.scrollLeft=t.scrollWidth;
 }
 $('#tray').onclick=e=>{if(!e.target.closest('.x'))$('#tray').classList.toggle('spread')};
 $('#file').addEventListener('change',e=>{
  const fs=[...(e.target.files||[])].slice(0,10-S.photos.length);
  fs.forEach(f=>addPhoto(URL.createObjectURL(f)));e.target.value='';
 });
 $('#nextP').onclick=()=>{if(S.photos.length)openReview({type:'photo',srcs:S.photos.slice()})};

 /* voice: hold to talk, or tap once to start and tap to stop. Waveform is simulated. */
 const wave=$('#wave'),wc=wave.getContext('2d');
 const fmt=ms=>{const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
 function drawWave(live,t){
  const w=wave.width,h=wave.height,n=44,bw=w/n,a=rec.amps||[];wc.clearRect(0,0,w,h);
  for(let i=0;i<n;i++){const idx=a.length-n+i;const v=(live&&idx>=0)?a[idx]:.06+.03*Math.sin(t/500+i*.5);const bh=Math.max(8,v*h*.95);
   wc.fillStyle=(live&&i>n-6)?'#F2701D':(live?'#1C1C1E':'rgba(58,29,10,.35)');wc.beginPath();wc.roundRect(i*bw+bw*.2,(h-bh)/2,bw*.6,bh,bw*.3);wc.fill()}
 }
 function waveLoop(t){
  if(rec.on){const el=t-rec.t0;
   if(t-rec.last>62){rec.last=t;rec.amps.push(Math.min(.98,.2+.5*Math.abs(Math.sin(el/310))*(.55+.45*Math.random())+.16*Math.random()))}
   $('#vtime').textContent=fmt(el);$('#prog').style.strokeDashoffset=276.5*(1-Math.min(1,el/60000));if(el>=60000)recStop();}
  drawWave(rec.on,t);requestAnimationFrame(waveLoop);
 }
 requestAnimationFrame(waveLoop);
 function recStart(){
  rec={on:true,t0:performance.now(),last:0,amps:[],downAt:performance.now(),stopOnUp:false};
  $('#shwrap').classList.add('rec');$('#p1').classList.add('live');
  $('#vhint').innerHTML='Release to finish.<br>Or tap once to keep going.';setExpr('wow',true);
 }
 function recStop(discard){
  if(!rec.on)return;
  const el=performance.now()-rec.t0,amps=rec.amps.slice();rec.on=false;
  $('#shwrap').classList.remove('rec');$('#p1').classList.remove('live');$('#prog').style.strokeDashoffset=276.5;$('#vtime').textContent='0:00';
  $('#vhint').innerHTML='Hold the button and talk.<br>Or tap once to start.';
  if(discard===true){setExpr('look');return}
  if(el<900){toast('Too short. Hold a little longer.');setExpr('nervous',true);setTimeout(()=>setExpr('look'),1400);return}
  const n=40,bars=[];for(let i=0;i<n;i++)bars.push(Math.max(.12,amps[Math.floor(i/n*amps.length)]||.2));
  setExpr('happy',true);
  setTimeout(()=>openReview({type:'voice',dur:fmt(el),bars,line:Z.data.VOICE_LINES[Math.floor(Math.random()*Z.data.VOICE_LINES.length)]}),260);
 }
 const sh=$('#shutter');
 sh.addEventListener('pointerdown',e=>{if(S.mode!==1)return;e.preventDefault();if(rec.on)rec.stopOnUp=true;else recStart()});
 const up=()=>{if(S.mode!==1||!rec.on)return;if(rec.stopOnUp){recStop();return}if(performance.now()-rec.downAt>380)recStop();else $('#vhint').innerHTML='Recording. Tap to finish.'};
 sh.addEventListener('pointerup',up);sh.addEventListener('pointercancel',up);
 sh.addEventListener('pointerleave',e=>{if(e.buttons&&S.mode===1&&rec.on&&performance.now()-rec.downAt>380&&!rec.stopOnUp)recStop()});
 sh.addEventListener('click',e=>{if(S.mode===0)snap();else if(S.mode===1&&e.detail===0){rec.on?recStop():recStart()}});

 /* text: a plain entry on the iOS keyboard */
 function nextState(){$('#nextT').classList.toggle('dis',!ta.value.trim())}
 let idleT=0;
 ta.addEventListener('input',()=>{
  nextState();const L=ta.value.length;setExpr(L>90?'happy':'look');
  clearTimeout(idleT);idleT=setTimeout(()=>{if(S.mode===2&&L>0)setExpr('think',true)},1800);
 });
 $('#nextT').onclick=()=>{
  if(!ta.value.trim()){setExpr('nervous',true);$('#nextT').animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:280});return}
  Z.kb.close();openReview({type:'text',text:ta.value.trim()});
 };
 nextState();

 /* prompts */
 let promptT=0;
 function showPrompt(on,txt){const p=$('#prompt');clearTimeout(promptT);if(!on){p.classList.remove('on');return}p.textContent=txt;p.classList.add('on');promptT=setTimeout(()=>p.classList.remove('on'),6000)}
 function givePrompt(){const t=Z.data.PROMPTS[S.prompt++%Z.data.PROMPTS.length];setExpr('smirk',true);if(S.mode===2){ta.placeholder=t;ta.focus({preventScroll:true})}else showPrompt(true,t)}
 $('#spark').onclick=givePrompt;$('#sparkT').onclick=givePrompt;$('#prompt').onclick=()=>showPrompt(false);

 /* review */
 function suggest(d){
  if(d.type==='photo')return 'trust';if(d.type==='voice')return 'talk';
  const t=d.text.toLowerCase();
  if(/said|talk|spoke|told|asked|call|meet|hi /.test(t))return 'talk';
  if(/fast|rush|yes|busy|late|hurry|deadline/.test(t))return 'pace';
  return 'trust';
 }
 function openReview(d){
  S.cur=d;S.tag=null;S.saving=false;rev.classList.remove('fly');
  const card=$('#card');card.style.background='';card.className='card';card.innerHTML='';
  if(d.type==='photo'){
   const n=d.srcs.length;
   card.innerHTML=`<div class="pcar${n>1?' multi':''}" id="pcar">${d.srcs.map((s,k)=>`<img src="${s}" alt="Photo ${k+1}">`).join('')}</div>${n>1?`<div class="pcount" id="pcount">1 / ${n}</div>`:''}<input class="capin" id="cin" maxlength="80" placeholder="Add a caption" aria-label="Caption" data-enter="none" inputmode="none">`;initCaption(n);
  }else if(d.type==='voice'){
   card.innerHTML=`<div class="vcard"><div class="dur">${d.dur}</div><canvas id="rw" width="620" height="220"></canvas><div class="lab">Zumi heard</div><textarea id="rt" aria-label="Transcript"></textarea></div>`;
   const cv=$('#rw'),c=cv.getContext('2d'),n=d.bars.length,bw=cv.width/n,h=cv.height;d.bars.forEach((a,i)=>{const bh=Math.max(10,a*h*.92);c.fillStyle='#C94A12';c.beginPath();c.roundRect(i*bw+bw*.18,(h-bh)/2,bw*.64,bh,bw*.32);c.fill()});
   typeOut($('#rt'),d.line);
  }else{
   card.classList.add('plain');card.innerHTML=`<div class="pl"><div class="tm">Today · ${Z.clock.str()}</div><div class="pt">${Z.esc(d.text)}</div></div>`;
  }
  const sug=suggest(d);
  $('#tags').innerHTML=Object.entries(TAGS).map(([k,v])=>`<button class="tg${k===sug?' sug':''}" data-k="${k}"><span class="gt">${v[0]}</span>${v[1]}</button>`).join('')+`<button class="tg" data-k="none">Skip</button>`;
  Z.setMascot($('#zM'),32,'wink',{track:true});
  $('#zTx').innerHTML=`Feels like a <b>${TAGS[sug][0]} ${TAGS[sug][1]}</b> moment. Tag it?`;
  $('#rmL').textContent='Today · Oct 17 · '+Z.clock.str();
  $('#rmR').textContent=d.type==='photo'?(d.srcs.length>1?d.srcs.length+' photos':'Photo'):d.type==='voice'?'Voice · '+d.dur:'Text';
  [...$('#tags').children].forEach(b=>b.onclick=()=>{
   const k=b.dataset.k;S.tag=k==='none'?null:k;
   [...$('#tags').children].forEach(x=>{x.classList.toggle('on',x===b&&k!=='none');x.classList.remove('sug')});
   if(k!=='none'){$('#zTx').innerHTML=`Tagged <b>${TAGS[k][0]} ${TAGS[k][1]}</b>. I will check it against tonight.`;Z.setMascot($('#zM'),32,'happy',{track:true},true)}
   else{$('#zTx').innerHTML='No tag. It still goes in your day.';Z.setMascot($('#zM'),32,'look',{track:true},true)}
  });
  rev.classList.add('on');rev.setAttribute('aria-hidden','false');
 }
 function typeOut(el,txt){el.value='';let i=0;const iv=setInterval(()=>{el.value=txt.slice(0,++i);if(i>=txt.length)clearInterval(iv)},26)}
 function initCaption(n){
  const inp=$('#cin');
  inp.addEventListener('focus',()=>Z.kb.open(inp));
  inp.addEventListener('input',()=>{S.cur.caption=inp.value});
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')Z.kb.close()});
  if(n>1){const c=$('#pcar');c.addEventListener('scroll',()=>{const w=c.firstElementChild.getBoundingClientRect().width+8;$('#pcount').textContent=Math.min(n,Math.round(c.scrollLeft/w)+1)+' / '+n})}
 }
 function backFromReview(){
  if(S.saving)return;Z.kb.close();rev.classList.remove('on');rev.setAttribute('aria-hidden','true');
  if(S.cur&&S.cur.type==='text')setTimeout(()=>{if(S.mode===2)Z.kb.open(ta)},520);
  setExpr(['look','look','think'][S.mode],true);
 }
 $('#back').onclick=backFromReview;
 Z.kb.setKeep(()=>(cap.classList.contains('on')&&S.mode===2&&!rev.classList.contains('on'))||(rev.classList.contains('on')&&S.cur&&S.cur.type==='photo'&&document.activeElement&&document.activeElement.id==='cin'));

 /* save */
 $('#save').onclick=()=>{
  if(S.saving)return;S.saving=true;Z.kb.close();
  const d=S.cur;rev.classList.add('fly');
  setTimeout(()=>{rev.classList.remove('on');rev.setAttribute('aria-hidden','true');cap.classList.add('shut');cap.classList.remove('on','textmode');cap.setAttribute('aria-hidden','true');stopCam()},380);
  setTimeout(()=>{
   const t=S.tag?TAGS[S.tag]:null;
   const text=d.type==='photo'?(d.caption||''):d.type==='voice'?($('#rt')?$('#rt').value:d.line):d.text;
   const mo={type:d.type,time:Z.clock.str(),text,src:d.srcs?d.srcs[0]:undefined,srcs:d.srcs,dur:d.dur,bars:d.bars,tag:t?[t[0],t[1]]:null,tagKey:S.tag};
   Z.feed.addMoment(mo);Z.react.after(mo);
   Z.clock.bump();
   const rm=$('#readM');Z.setMascot(rm,26,'happy');rm.classList.remove('wig');void rm.offsetWidth;rm.classList.add('wig');
   setTimeout(()=>Z.setMascot(rm,26,'look'),1700);
   toast('Added to today');reset();
  },760);
 };
 function reset(){S.photos=[];renderTray();updateSide();ta.value='';ta.placeholder='What happened? Write it like you would tell a friend.';nextState();S.holdCam=false;S.cur=null;S.tag=null;S.saving=false;S.mode=0;$('#galImg').hidden=true;$('#galE').hidden=false}
 return{open,close,reset,toast};
})();
