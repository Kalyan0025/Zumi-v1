/* Feed: the day's thread. Holds chat with Zumi and moments in time order. */
Z.feed=(function(){
 const feed=Z.$('#feed'),greet=Z.$('#greet');
 let view='home',busy=false;
 function show(v){
  view=v;Z.$('#phone').classList.toggle('inhome',v==='home');
  feed.classList.toggle('on',v==='feed');greet.classList.toggle('gone',v==='feed');
 }
 function scroll(){requestAnimationFrame(()=>feed.scrollTo({top:feed.scrollHeight,behavior:'smooth'}))}
 function rowsHtml(rows,delay=0){return rows.map((r,i)=>`<div class="zrow" style="animation-delay:${delay+i*140}ms"><div class="g"><span class="gt">${r[0]}</span></div><div class="t"><b>${r[1]}</b><br><span>${Z.esc(r[2])}</span></div></div>`).join('')}
 function addUser(text,instant){
  const d=document.createElement('div');d.className='bub'+(instant?'':' in');d.innerHTML=`<div>${Z.esc(text)}</div>`;feed.appendChild(d);scroll();
 }
 function typing(){
  const d=document.createElement('div');d.className='zr plain';d.innerHTML=`<div class="mk"></div><div class="bd"><div class="typing"><i></i><i></i><i></i></div></div>`;
  Z.setMascot(d.querySelector('.mk'),28,'think');feed.appendChild(d);scroll();return d;
 }
 function replyEl(r,instant){
  const d=document.createElement('div');d.className='zr';
  const base=instant?-9999:0;
  const cs=(r.chips||[]).map(c=>typeof c==='string'?{t:c}:c);
  const chips=cs.map((c,i)=>`<button style="animation-delay:${base+700+i*100}ms" data-ci="${i}">${Z.esc(c.t)}</button>`).join('');
  d.innerHTML=`<div class="mk"></div><div class="bd"><div class="in1">${Z.esc(r.intro)}</div>${r.rows?`<div class="rows">${rowsHtml(r.rows,instant?-9999:200)}</div>`:''}${r.ask?`<div class="ask" style="animation-delay:${base+620}ms">${Z.esc(r.ask)}</div>`:''}${chips?`<div class="chips">${chips}</div>`:''}</div>`;
  Z.setMascot(d.querySelector('.mk'),28,'happy');
  d.querySelectorAll('[data-ci]').forEach(b=>b.onclick=()=>{b.parentNode.querySelectorAll('button').forEach(x=>x.disabled=true);const c=cs[+b.dataset.ci];if(c.cb)c.cb(c);else send(c.t,true)});
  return d;
 }
 function send(text,isFollow){
  text=text.trim();if(!text||busy)return false;
  busy=true;
  show('feed');addUser(text);
  const t=typing();
  setTimeout(()=>{
   const r=isFollow?{intro:Z.data.followFor(text)}:Z.data.replyFor(text);
   t.remove();feed.appendChild(replyEl(r));scroll();busy=false;
   Z.sheet&&Z.sheet.markSeen();
  },1100);
  return true;
 }
 const tagHtml=t=>`<span class="tagc"><span class="gt" style="font-size:14px">${t[0]}</span>${Z.esc(t[1])}</span>`;
 function setTag(m){const w=m._el&&m._el.querySelector('.tagwrap');if(w)w.innerHTML=m.tag?tagHtml(m.tag):''}
 function momEl(m,isNew){
  const el=document.createElement('div');el.className='mom'+(isNew?' new':'');
  let media='';
  if(m.type==='photo'){const ss=m.srcs||[m.src];media=ss.length>1?`<div class="md"><div class="pstack">${ss.map(x=>`<img src="${x}" alt="Photo">`).join('')}</div></div>`:`<div class="md"><img class="ph" src="${ss[0]}" alt="Photo moment"></div>`}
  if(m.type==='voice')media=`<div class="md"><span class="vm"><canvas width="184" height="44"></canvas>${m.dur}</span></div>`;
  const body=m.text?`<div class="tx">${Z.esc(m.text)}</div>`:'';
  const tg=`<div class="tagwrap">${m.tag?tagHtml(m.tag):''}</div>`;
  el.innerHTML=`<div class="rail"><i></i><b></b></div><div><div class="tm">${m.time}</div>${m.type==='photo'?media+body:body+media}${tg}</div>`;
  if(m.type==='voice'){const cv=el.querySelector('canvas'),c=cv.getContext('2d'),n=m.bars.length,bw=cv.width/n,h=cv.height;m.bars.forEach((a,i)=>{const bh=Math.max(5,a*h*.92);c.fillStyle='#1C1C1E';c.beginPath();c.roundRect(i*bw+bw*.18,(h-bh)/2,bw*.64,bh,bw*.32);c.fill()})}
  return el;
 }
 function addMoment(m){show('feed');Z.state.moments.push(m);const el=momEl(m,true);m._el=el;feed.appendChild(el);scroll();Z.memories&&Z.memories.refreshToday();Z.night&&Z.night.sync();return el}
 function addNudge(){
  const d=replyEl({intro:`That is ${Z.state.moments.length} moments in. Want to close the day? I will line it up with this morning's reading.`,chips:[{t:'End the day',cb:()=>Z.night.open()}]});
  feed.appendChild(d);scroll();
 }
 function addClosed(sum){
  const d=replyEl({intro:sum,ask:'Your day is saved. Tap Day closed to open the card, or Zumi at the top to see your streak.'});
  Z.setMascot(d.querySelector('.mk'),28,'proud');feed.appendChild(d);scroll();
 }
 function say(r,ms=900){const t=typing();setTimeout(()=>{t.remove();feed.appendChild(replyEl(r));scroll()},ms)}
 function clear(){feed.innerHTML='';show('home');busy=false;Z.state.reset()}
 function sample(){
  clear();show('feed');
  Z.data.SEEDS.forEach(s=>{
   if(s.kind==='user')addUser(s.text,true);
   else if(s.kind==='reply')feed.appendChild(replyEl(Z.data.replyFor(s.text),true));
   else{s.fit=s.fit||'y';Z.state.moments.push(s);const e=momEl(s,false);s._el=e;feed.appendChild(e)}
  });
  Z.clock.reset();setTimeout(()=>feed.scrollTo({top:feed.scrollHeight}),50);
  Z.sheet&&Z.sheet.markSeen();Z.memories&&Z.memories.refreshToday();Z.night&&Z.night.sync(true);
 }
 return{show,send,say,setTag,addMoment,addNudge,addClosed,momEl,clear,sample,get view(){return view}};
})();
