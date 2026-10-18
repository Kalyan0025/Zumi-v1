/* Night check-in: compares what you logged with this morning's reading, one line at a time */
Z.night=(function(){
 const $=Z.$,el=$('#night'),body=$('#nBody'),dots=$('#nDots'),pill=$('#endPill'),phone=$('#phone');
 const WORDS=['Steady','Tired','Proud','Rushed','Hopeful','Nervous'];
 const QS={talk:'Did you say less and let people come to you?',pace:'Did you slow your yes down?',trust:'Did you go slow with new faces?'};
 const KW={talk:/said|talk|spoke|told|asked|hello|\bhi\b|met|call/i,pace:/\byes\b|think about|slow|rush|busy|late|deadline|wait|later/i,trust:/new|someone|stranger|trust|face|friend|offer|team/i};
 let steps=[],idx=0,ans={},word='',note='',isOpen=false;
 $('#nClose').innerHTML=Z.ic('x',18,'#1C1C1E');
 function setM(ex,pop){const m=$('#nM');m.innerHTML='<span class="mi"></span>';Z.setMascot(m.firstChild,52,ex,{track:true},pop)}
 /* only what the user logged: tagged moments first, then keyword matches, else nothing */
 function evidence(key){
  const M=Z.state.moments,tagged=M.filter(m=>m.tagKey===key);
  if(tagged.length)return{list:tagged.slice(0,2),how:'You tagged this'};
  const rel=M.filter(m=>m.text&&KW[key].test(m.text));
  return rel.length?{list:rel.slice(0,2),how:'Might be related'}:{list:[],how:''};
 }
 const lab=m=>m.text||(m.type==='photo'?((m.srcs||[]).length>1?(m.srcs.length)+' photos':'A photo'):'A voice note');
 const TT=k=>Z.KEYS.find(x=>x[0]===k)[2];
 /* one quiet line tying the day's moment to the morning's line */
 function nudge(s){
  const e=s.ev,m=e.list[0],t=s.title;
  if(!m)return `Nothing today touched ${t}. That is allowed, and it is worth knowing.`;
  if(e.how==='You tagged this'){
   if(m.fit==='y')return `At ${m.time} you told me this fit. Does the rest of the day agree?`;
   if(m.fit==='n')return `At ${m.time} you said this did not fit. Hold that up against “${s.sky}”`;
   return `You put your ${m.time} moment under ${t}. The sky named it first: “${s.sky}”`;
  }
  return `Your ${m.time} moment reads a bit like ${t}. You did not tag it, so you decide.`;
 }
 function after(k,st,a){
  const m=st.ev.list[0];
  return m?`Linked to your ${m.time} moment.`:'Nothing to link.';
 }
 function build(){
  steps=Z.KEYS.map(k=>{const r=Z.data.READING.rows.find(x=>x[1]===k[2]);return{kind:'q',key:k[0],glyph:k[1],title:k[2],sky:r[2],ev:evidence(k[0])}});
  steps.push({kind:'door'},{kind:'word'},{kind:'sum'});
 }
 function drawDots(){
  const n=steps.length-1;dots.style.opacity=steps[idx].kind==='sum'?0:1;
  dots.innerHTML=Array.from({length:n},(_,i)=>`<i class="${i===idx?'on':i<idx?'done':''}"></i>`).join('');
 }
 const AB=(c,m,t,a)=>`<button class="ab ${c}" data-a="${a}"><span class="m">${m}</span>${t}</button>`;
 function render(dir){
  const s=steps[idx],old=body.firstElementChild;
  const mk=()=>{
   const d=document.createElement('div');d.className='nstep';
   if(s.kind==='q'){
    const ev=s.ev.list.length?`<div class="nlab">Your day · ${s.ev.how}</div>${s.ev.list.map(m=>`<div class="evq"><small>${m.time}</small>${m.type==='photo'&&m.src?`<img class="evth" src="${m.src}" alt="">`:''}${Z.esc(lab(m))}</div>`).join('')}`:`<div class="nlab">Your day</div><div class="evn">Nothing logged for this one.</div>`;
    d.innerHTML=`<div class="nlab">The sky said</div><div class="sky"><div class="g"><span class="gt">${s.glyph}</span></div><div class="t"><b>${s.title}</b><br><span>${Z.esc(s.sky)}</span></div></div><div class="ev">${ev}</div><div class="nudge"><span>↔</span><div>${Z.esc(nudge(s))}</div></div><div class="nq">${QS[s.key]}</div><div class="ans">${AB('y','✓','It fit','y')}${AB('p','~','Partly','p')}${AB('n','✗','Missed','n')}</div>${s.ev.list.length?'':'<button class="skip" data-a="x">Did not come up</button>'}<div class="guard">I only use what you logged.</div>`;
    const pick=(a,b)=>{ans[s.key]=a;if(b)b.classList.add('pick');setM({y:'happy',p:'wink',n:'think',x:'look'}[a],true);setTimeout(()=>go(1),420)};
    d.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>pick(b.dataset.a,b));
   }else if(s.kind==='door'){
    d.innerHTML=`<div class="nlab">One more thing from this morning</div><div class="sky"><div class="g"><span class="gt">✦</span></div><div class="t"><b>Open door</b><br><span>${Z.esc(Z.data.READING.door)}</span></div></div><div class="nq">Did someone ask the question you were avoiding?</div><div class="ans">${AB('y','✓','Yes','y')}${AB('t','–','Not today','n')}</div><div class="guard">There is no wrong answer here.</div>`;
    d.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{ans.door=b.dataset.a;b.classList.add('pick');setM(b.dataset.a==='y'?'wow':'look',true);setTimeout(()=>go(1),420)});
   }else if(s.kind==='word'){
    d.classList.add('pad');
    d.innerHTML=`<div class="nlab">Last one</div><div class="nq" style="margin-top:4px">One word for today?</div><div class="wchips">${WORDS.map(w=>`<button data-w="${w}" class="${w===word?'on':''}">${w}</button>`).join('')}</div><textarea id="nNote" inputmode="none" data-enter="newline" maxlength="240" placeholder="Add a line if you want" aria-label="Add a line"></textarea><div class="nfoot"><button class="cta" id="nSee">See the day</button></div>`;
    d.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{word=b.dataset.w;d.querySelectorAll('[data-w]').forEach(x=>x.classList.toggle('on',x===b));setM('proud',true)});
    const ta=d.querySelector('#nNote');ta.value=note;
    ta.addEventListener('focus',()=>Z.kb.open(ta));ta.addEventListener('input',()=>{note=ta.value});
    d.querySelector('#nSee').onclick=()=>{Z.kb.close();go(1)};
   }else{
    const rows=Z.KEYS.map((k,i)=>{const st=steps[i],a=ans[k[0]]||'x',e=st.ev.list[0];return `<div class="sumrow" style="animation-delay:${150+i*110}ms"><div class="g"><span class="gt">${k[1]}</span></div><div class="t"><b>${k[2]}</b><br><span>Sky: ${Z.esc(st.sky)}<br>You: ${e?'“'+Z.esc(lab(e))+'”':'nothing logged'}<br>${Z.esc(after(k[0],st,a))}</span></div>${Z.mark(a)}</div>`}).join('');
    const sc=summary();
    d.classList.add('pad');
    d.innerHTML=`<div class="nlab">Sky vs you · Sat, Oct 17</div><div class="sumh">${sc.head}</div><div class="sumsub">${sc.sub}</div>${rows}<div class="sumrow" style="animation-delay:480ms"><div class="g"><span class="gt">✦</span></div><div class="t"><b>Open door</b><br><span>${ans.door==='y'?'Someone asked the question.':'No open door today.'}</span></div>${Z.mark(ans.door==='y'?'y':'x')}</div>${threads()}<div class="refl"><b>${word?'Your word: '+word:'No word picked'}</b>${note?`<br>“${Z.esc(note)}”`:''}<br><span>I keep this next to today's reading. Patterns start to show after about a week of check-ins.</span></div><div class="nfoot"><button class="cta" id="nSave">Save to journal</button></div>`;
    d.querySelector('#nSave').onclick=save;
    setM(sc.mood,true);
   }
   return d;
  };
  const place=()=>{const d=mk();body.appendChild(d);drawDots()};
  if(old){old.classList.add('out');setTimeout(()=>{old.remove();place()},230)}else place();
 }
 function go(n){idx=Math.max(0,Math.min(steps.length-1,idx+n));render()}
 /* the day's moments laid against the lines they belong to */
 function threads(){
  const M=Z.state.moments.filter(m=>m.tagKey||KW.talk.test(m.text||'')||KW.pace.test(m.text||'')||KW.trust.test(m.text||''));
  if(!M.length)return '';
  const cards=M.map((m,i)=>{
   const k=m.tagKey||Object.keys(KW).find(x=>KW[x].test(m.text||'')),T=Z.data.TAGS[k];
   return `<div class="rcard" style="animation-delay:${600+i*90}ms"><span class="rtag"><span class="gt">${T[0]}</span>${T[1]}</span>${m.type==='photo'&&m.src?`<img src="${m.src}" alt="">`:''}<div class="rtx">${Z.esc(lab(m))}</div><small>${m.time}</small></div>`}).join('');
  const lead=ans.talk==='y'||ans.pace==='y'||ans.trust==='y'?'Where the day touched the sky':'Where your day sat against the sky';
  return `<div class="nlab" style="margin-top:18px">${lead}</div><div class="rc">${cards}</div>`;
 }
 function summary(){
  const P={y:1,p:.5,n:0},sc=Z.KEYS.map(k=>ans[k[0]]).filter(a=>a&&a!=='x');
  const fits=sc.reduce((t,a)=>t+P[a],0),tot=sc.length,fm=Number.isInteger(fits)?fits:Math.floor(fits)+'½';
  let head,mood;
  if(!tot){head='A quiet day. Nothing to compare.';mood='look'}
  else if(fits>=tot*.67){head='The sky and your day lined up.';mood='happy'}
  else if(fits>=tot*.34){head='Half and half. That is normal.';mood='wink'}
  else{head='Today went its own way. That is data too.';mood='think'}
  return{head,mood,sub:tot?`${fm} of ${tot} lines fit what you logged.`:'You did not log anything that matched, so I will not guess.',text:tot?`${head} ${fm} of ${tot} lines fit.`:head};
 }
 function save(){
  const sc=summary();
  Z.state.fb={talk:ans.talk||'x',pace:ans.pace||'x',trust:ans.trust||'x',door:ans.door,word,note};
  Z.state.closed=true;
  close();
  setTimeout(()=>{
   Z.memories.refreshToday();sync();Z.feed.addClosed(sc.text);
   const rm=$('#readM');Z.setMascot(rm,26,'proud');rm.classList.remove('wig');void rm.offsetWidth;rm.classList.add('wig');setTimeout(()=>Z.setMascot(rm,26,'look'),1700);
   Z.toast('Saved to your journal');
  },420);
 }
 function open(){
  if(Z.state.closed){Z.memories.open(5);return}
  if(isOpen)return;
  if(Z.kb.on)Z.kb.close();
  build();idx=0;ans={};word='';note='';body.innerHTML='';
  const pr=phone.getBoundingClientRect(),s=pr.width/390,r=pill.getBoundingClientRect();
  const ox=r.width?(r.left+r.width/2-pr.left)/s:260,oy=r.width?(r.top+r.height/2-pr.top)/s:722;
  el.style.setProperty('--ox',ox+'px');el.style.setProperty('--oy',oy+'px');
  isOpen=true;el.classList.add('on');el.setAttribute('aria-hidden','false');
  setM('look',true);render();
 }
 function close(){
  isOpen=false;el.classList.remove('on');el.setAttribute('aria-hidden','true');Z.kb.close();
 }
 /* pill: appears after two moments, turns into "Day closed" once saved */
 function sync(silent){
  const n=Z.state.moments.length;
  if(Z.state.closed){pill.hidden=false;pill.classList.add('done');$('#endT').textContent='Day closed';$('#endG').textContent='✓';$('#endG').className='';return}
  pill.classList.remove('done');$('#endG').textContent='☽';$('#endG').className='gt';$('#endT').textContent='End the day';
  if(n>=2){
   const was=!pill.hidden;pill.hidden=false;
   if(!was&&!Z.state.nudged){Z.state.nudged=true;if(!silent)setTimeout(()=>Z.feed.addNudge(),900)}
   if(silent)Z.state.nudged=true;
  }else{pill.hidden=true}
 }
 pill.onclick=()=>Z.state.closed?Z.memories.open(5):open();
 $('#nClose').onclick=()=>close();
 Z.kb.setKeep(()=>isOpen&&document.activeElement&&document.activeElement.id==='nNote');
 addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen)close()});
 return{open,close:(imm)=>{if(imm){isOpen=false;el.classList.remove('on')}else close()},sync,get isOpen(){return isOpen}};
})();
