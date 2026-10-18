/* Calendar: months of orbs. Each pattern has its own colour, so days far apart still read as a family.
   "Look into patterns" lists each pattern as a stack: it happened here, and again here. */
Z.cal=(function(){
 const $=Z.$,ov=$('#calv'),panel=$('#calv .sh'),body=$('#calBody'),pv=$('#patv'),pp=$('#patv .sh'),pb=$('#patBody');
 $('#calClose').innerHTML=Z.ic('x',18,'#1C1C1E');$('#patClose').innerHTML=Z.ic('x',18,'#1C1C1E');
 const TH=['talk','pace','trust'],GL={talk:'☿',pace:'♂',trust:'☽'},NM={talk:'Talk',pace:'Pace',trust:'Trust'};
 const LINE={talk:'Said less, let people come to you',pace:'Slowed the yes down',trust:'Went slow with new faces'};
 const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
 const DN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 const TODAY=new Date(Date.UTC(2026,9,17)),JOIN=new Date(Date.UTC(2026,7,10)),TK='2026-10-17';
 const key=d=>d.toISOString().slice(0,10);
 const rng=(a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296})(26);
 const pick=a=>a[Math.floor(rng()*a.length)];
 const tmin=t=>{const m=/(\d+):(\d+) (AM|PM)/.exec(t);return m?((+m[1]%12)+(m[3]==='PM'?12:0))*60+ +m[2]:0};
 const N=Z.photos.length,PK=Array.from({length:N},(_,i)=>'p'+i);
 let deck=[];const card=()=>{if(!deck.length)deck=PK.slice().sort(()=>rng()-.5);return deck.pop()};
 const TXT={talk:['Said less in the meeting and people filled the gap.','Let the other person finish first. Learned something.','Held back a reply. It was the right call.','Asked one question instead of giving three opinions.'],pace:['Did not answer right away. Slept on it.','Said I will think about it. Meant it.','Took the long way and nothing broke.','Turned down a rush request. The sky did not fall.'],trust:['Let a new person earn it slowly.','Told one honest thing to someone new.','Waited before sharing the plan. Glad I did.','Sat with the new team at lunch. Listened mostly.']};
 const VOX={talk:['Quick note to self. I kept quiet for the first ten minutes and it actually changed the room.','Walking back. Noticed I talk faster when I am nervous. Today I did not.'],pace:['Okay, voice note. I did not say yes on the spot today. It felt strange and then it felt fine.','Heading home. Everyone wanted an answer now. I gave myself until tomorrow.'],trust:['Met someone new today and I did not tell them everything. That is progress, I think.','Thinking out loud. Trust is slow for me and today I let it be slow.']};
 const MISC=['Coffee before anything else. Small win.','Long call. Took notes by hand.','Lunch outside. Needed it.','Replied to the email I had been avoiding.','Evening walk. Phone stayed in my pocket.','Cleaned the desk. Weirdly calming.'];
 const CAP=['Light today.','Where I ended up.','This was the view.','Kept this one.'];
 const WORDS=['Steady','Curious','Open','Tired','Proud','Hopeful'];
 const TIMES=['7:50 AM','9:15 AM','10:40 AM','12:30 PM','2:10 PM','3:45 PM','5:30 PM','7:20 PM','9:05 PM'];
 const MD=d=>MN[d.getUTCMonth()].slice(0,3)+' '+d.getUTCDate();
 const bars=()=>Array.from({length:40},(_,i)=>Math.max(.12,.25+.55*Math.abs(Math.sin(i*.7+rng()*2))*rng()));
 /* a long journal day: text, voice and photos mixed in time order */
 function journal(th,img,existing){
  const have=existing.length,n=4+Math.floor(rng()*3),ts=TIMES.slice().sort(()=>rng()-.5).slice(0,n).sort((a,b)=>TIMES.indexOf(a)-TIMES.indexOf(b));
  const out=existing.slice();let usedKey=have>0;
  ts.forEach((t,i)=>{
   if(out.some(m=>m.time===t))return;
   const r=rng();let m;
   if(r<.3)m={type:'voice',time:t,dur:'0:'+String(18+Math.floor(rng()*40)),bars:bars(),text:pick(VOX[th])};
   else if(r<.55&&img){const first=!out.some(x=>x.type==='photo');const ss=first?[img]:[];const extra=1+Math.floor(rng()*2);for(let j=0;j<extra;j++)ss.push(card());const sl=first&&rng()<.5?ss.slice(0,1):ss;m={type:'photo',time:t,srcs:sl.map(x=>Z.memories.img(x)),text:pick(CAP)};m.src=m.srcs[0]}
   else m={type:'text',time:t,text:rng()<.55?pick(TXT[th]):pick(MISC)};
   out.push(m);
  });
  if(!out.some(m=>m.tag)){const x=out.find(m=>m.type==='text');if(x)x.tag=[GL[th],NM[th]+'. Fits that day']}
  out.sort((a,b)=>tmin(a.time)-tmin(b.time));
  return out;
 }
 /* A pattern is one specific thing that keeps coming back, days or weeks apart (not a streak) */
 const PATS=[
  {id:'think',th:'pace',g:'♂',c:'#2B3A91',c2:'#6F82DA',name:'Let me think about it',line:'You did not say yes on the spot',v:['Said I will think about it. Meant it.','Asked for a day before answering.','Did not agree in the meeting. Slept on it first.','Told them I would get back tomorrow.','Paused before the yes. It changed the answer.']},
  {id:'first',th:'talk',g:'☿',c:'#F2701D',c2:'#FFA64F',name:'Let them speak first',line:'You said less and people came to you',v:['Let the other person finish first. Learned something.','Stayed quiet for the first ten minutes. The room opened up.','Asked one question instead of giving three opinions.','Held back my reply. It was the right call.','Let someone else open the call.']},
  {id:'new',th:'trust',g:'☽',c:'#8A6BD6',c2:'#BDA3F5',name:'Slow with someone new',line:'You let them earn it',v:['Let a new person earn it slowly.','Sat with the new team at lunch. Listened mostly.','Told one honest thing to someone new, nothing more.','Waited before sharing the plan. Glad I did.','Did not overshare with the new face. Felt right.']},
  {id:'no',th:'pace',g:'♂',c:'#D6609B',c2:'#F29CC4',name:'A clean no',line:'You said no and did not apologise',v:['Said no to an extra shift. Felt lighter.','Turned down a rush request. Nothing broke.','Skipped the thing I did not want. No regret.','Said no, kindly, once.','Declined the invite. Slept early.']},
  {id:'walk',th:null,g:'✦',c:'#1FA39A',c2:'#6FD6CC',name:'The reset walk',line:'A walk without the phone fixed the day',v:['Evening walk. Phone stayed in my pocket.','Walked the long way home. Head cleared.','Took the walk instead of scrolling.','Ten minutes outside between calls. Reset.','Walked it off. It worked again.']}];
 const PID={};PATS.forEach((p,i)=>{PID[p.id]=p;p.l='P'+(i+1)});
 const psty=p=>p?`--c:${p.c};--c2:${p.c2}`:'';
 const DATA={};
 (function(){
  const L=[];
  for(let t=+JOIN;t<Date.UTC(2026,9,12);t+=864e5){if(rng()>.82)continue;L.push(new Date(t))}
  const asg={};
  /* each pattern lands on days far apart, spread over the weeks */
  PATS.forEach((p,pi)=>{let idx=pi*2+Math.floor(rng()*3);const step=11+Math.floor(rng()*4);
   for(let n=0;idx<L.length;n++,idx+=step+Math.floor(rng()*3)-1){const k=key(L[idx]);if(!asg[k])asg[k]=p.id}});
  L.forEach(d=>{
   const k=key(d),pid=asg[k],p=PID[pid],th=p&&p.th||pick(TH);
   const img=rng()<.6?card():null;
   const fb={talk:'p',pace:'p',trust:'p',word:pick(WORDS)};fb[th]='y';TH.forEach(x=>{if(x!==th&&rng()<.3)fb[x]=rng()<.5?'n':'y'});
   const day={k,theme:th,pat:pid||null,img,date:DN[d.getUTCDay()]+', '+MD(d),fb};
   if(p){day.pt=p.v[(p.n=(p.n||0)+1)%p.v.length];day.moments=journal(th,img,[{type:'text',time:'12:30 PM',text:day.pt,tag:[p.l,p.name+'. Fits that day']}])}
   else day.moments=journal(th,img,[]);
   DATA[k]=day;
  });
 })();
 const REALPAT=[['no','Said no to an extra shift. Felt lighter.'],[null],['first','Went last in the review. It helped.'],['new','Someone asked what I was avoiding. Told the truth.'],[null]];
 Z.memories.DAYS.forEach((d,i)=>{const k=key(new Date(Date.UTC(2026,9,12+i)));d.k=k;d.moments=journal(d.theme,d.img,d.moments);d.pat=REALPAT[i][0]||null;d.pt=REALPAT[i][1]||'';DATA[k]=d});
 function todayDay(){
  const M=Z.state.moments;if(!M.length)return null;
  let th=null;
  if(Z.state.closed&&Z.state.fb)th=TH.find(k=>Z.state.fb[k]==='y')||null;
  if(!th){const c={};M.forEach(m=>m.tagKey&&(c[m.tagKey]=(c[m.tagKey]||0)+1));th=Object.keys(c).sort((a,b)=>c[b]-c[a])[0]||null}
  return{k:TK,theme:th,photo:M.some(m=>m.type==='photo'&&m.src),today:true,date:'Today',moments:M};
 }
 const getDay=k=>k===TK?todayDay():DATA[k];
 const firstText=d=>{const m=(d.moments||[]).find(x=>x.text);return m?m.text:''};
 const shortOf=k=>MD(new Date(k+'T00:00:00Z'));
 const allKeys=()=>{const a=Object.keys(DATA);if(todayDay())a.push(TK);return a.sort()};
 /* days of one pattern, oldest first */
 const of=id=>allKeys().filter(k=>{const d=getDay(k);return d&&d.pat===id});
 const gapDays=(a,b)=>Math.round((+new Date(b+'T00:00:00Z')-+new Date(a+'T00:00:00Z'))/864e5);
 const ord=n=>n+(['th','st','nd','rd'][(n%100>10&&n%100<14)?0:Math.min(n%10,4)%4]||'th');
 function related(d){
  const dd=d==='today'?todayDay():d;if(!dd||!dd.pat)return null;const p=PID[dd.pat],ks=of(p.id),k=dd.k;
  return{p,style:psty(p),name:p.name,glyph:p.l,line:p.line,nth:ks.indexOf(k)+1,total:ks.length,others:ks.filter(x=>x!==k).map(x=>{const y=getDay(x);return{k:x,img:y.img,short:shortOf(x)}})};
 }
 function month(y,m){
  const first=new Date(Date.UTC(y,m,1)),days=new Date(Date.UTC(y,m+1,0)).getUTCDate(),lead=(first.getUTCDay()+6)%7;
  let logged=0;const cells=[];
  for(let i=0;i<lead;i++)cells.push(null);
  for(let d=1;d<=days;d++){
   const dt=new Date(Date.UTC(y,m,d)),k=key(dt),fut=dt>TODAY;
   const info=fut?null:getDay(k);if(info)logged++;
   cells.push({d,k,isT:k===TK,fut,info,date:dt});
  }
  while(cells.length%7)cells.push(null);
  let rows='';
  for(let r=0;r<cells.length;r+=7){
   let cs='';
   cells.slice(r,r+7).forEach(c=>{
    if(!c){cs+='<div></div>';return}
    const inf=c.info,p=inf&&inf.pat?PID[inf.pat]:null,hasImg=inf&&(c.isT?inf.photo:inf.img);
    let cls=c.fut?'fut':!inf?'none':hasImg?'ph':'lg';if(c.isT)cls+=' now';if(p)cls+=' pt pt-'+p.id;
    const label=`${DN[c.date.getUTCDay()]} ${MD(c.date)}${inf?(p?', '+p.name:', logged'):', nothing logged'}`;
    const inner=hasImg?`<i ${!c.isT?`style="background-image:url('${Z.memories.img(inf.img)}')"`:'id="calTodayI"'}></i>`:(inf?'<i class="fl"></i>':'');
    const badge=p?`<em class="pl">${p.l}</em>`:'';
    const tag=inf?'button':'div';
    cs+=`<${tag} class="cd ${cls}" style="${psty(p)}" ${inf?`data-k="${c.k}"`:''} aria-label="${label}"><span class="o">${inner}</span><span class="n">${c.d}${badge}</span></${tag}>`;
   });
   rows+=`<div class="cwk">${cs}</div>`;
  }
  return `<section class="cm"><h2>${MN[m]} ${y}</h2><div class="mc">${logged?logged+(logged===1?' day':' days')+' logged':'Nothing yet'}</div><div class="cw7">${'MTWTFSS'.split('').map(x=>`<span>${x}</span>`).join('')}</div>${rows}</section>`;
 }
 /* focus one pattern: other days fade and a dotted line snakes through its days */
 let focus=null;
 function snake(id){
  const old=body.querySelector('.snk');if(old)old.remove();if(!id)return;
  const cin=body.querySelector('.cin'),sc=$('#phone').getBoundingClientRect().width/390,cr=cin.getBoundingClientRect();
  const pts=of(id).map(k=>{const o=body.querySelector(`.cd[data-k="${k}"] .o`);if(!o)return null;const r=o.getBoundingClientRect();return[(r.left-cr.left+r.width/2)/sc,(r.top-cr.top+r.height/2)/sc]}).filter(Boolean);
  if(pts.length<2)return;
  let d=`M${pts[0][0]} ${pts[0][1]}`;
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dy=(b[1]-a[1])*.55;d+=` C${a[0]} ${a[1]+dy} ${b[0]} ${b[1]-dy} ${b[0]} ${b[1]}`}
  const p=PID[id],svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class','snk');svg.setAttribute('width',cin.scrollWidth);svg.setAttribute('height',cin.scrollHeight);
  svg.innerHTML=`<path d="${d}" fill="none" stroke="rgba(28,28,30,.5)" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="0.1 7"/>`;
  cin.prepend(svg);
 }
 function setFilter(id){
  focus=id;body.classList.toggle('f',!!id);
  body.querySelectorAll('.hit').forEach(x=>x.classList.remove('hit'));
  const f=$('#cFlt');
  if(id){const p=PID[id];body.querySelectorAll('.pt-'+id).forEach(x=>x.classList.add('hit'));f.style.cssText=psty(p);f.className='cflt on';f.innerHTML=`<span class="gp">${p.l}</span>${p.name} <button id="cClr">Clear</button>`;$('#cClr').onclick=()=>setFilter(null);snake(id);
   const first=body.querySelector('.cd.hit');if(first)body.scrollTo({top:first.offsetTop+first.offsetParent.offsetTop-120,behavior:'smooth'})}
  else{f.className='cflt';snake(null)}
 }
 function render(){
  body.className='cbody';
  body.innerHTML=`<div class="cin"><div class="ctitle">Your days</div>
  <div class="crow"><button class="pbtn" id="pBtn"><span id="pBi"></span>Look into patterns</button><div class="cflt" id="cFlt"></div></div>
  ${month(2026,7)}${month(2026,8)}${month(2026,9)}</div>`;
  $('#pBi').innerHTML=Z.ic('spark',18,'#fff');
  const td=$('#calTodayI');if(td){const src=Z.state.moments.find(m=>m.type==='photo'&&m.src);if(src)td.style.backgroundImage=`url('${src.src}')`}
  body.querySelectorAll('button.cd').forEach(b=>b.onclick=()=>openKey(b.dataset.k));
  $('#pBtn').onclick=openPat;focus=null;
 }
 function openKey(k){Z.memories.open(k===TK?'today':DATA[k])}
 /* patterns: one card per pattern; the same thing, days or weeks apart */
 function openPat(){
  const cards=PATS.map(p=>({p,ks:of(p.id)})).filter(x=>x.ks.length>1).sort((a,b)=>b.ks.length-a.ks.length).map(({p,ks})=>{
   const known=ks.filter(k=>getDay(k).fb),fit=known.filter(k=>{const f=getDay(k).fb;return p.th?f[p.th]==='y':true}).length;
   const wd=[0,0,0,0,0,0,0];ks.forEach(k=>wd[new Date(k+'T00:00:00Z').getUTCDay()]++);const dow=DN[wd.indexOf(Math.max(...wd))];
   const weeks=Math.max(1,Math.round(gapDays(ks[0],ks[ks.length-1])/7));
   const rows=ks.map((k,i)=>{const d=getDay(k),txt=d.pt||firstText(d);
    const lab=i===0?'First time':`Again<small>${gapDays(ks[i-1],k)} days later</small>`;
    return `<button class="pr" data-k="${k}"><span class="pd">${lab}<b>${shortOf(k)}</b></span>${d.img?`<i style="background-image:url('${Z.memories.img(d.img)}')"></i>`:'<i class="nb"></i>'}<span class="px">${Z.esc(txt.length>78?txt.slice(0,76)+'…':txt)}</span></button>`}).join('');
   return `<article class="pcard" style="${psty(p)}"><header><span class="g"><span class="gp">${p.l}</span></span><div><b>${p.name}</b><span>${p.line}</span></div><em>${ks.length} times</em></header>
    <div class="ptl">${rows}</div>
    <div class="pfoot"><span>${ks.length} times in ${weeks} weeks${known.length&&p.th?`, the sky matched ${fit} of ${known.length}`:''}. Mostly ${dow}s.</span><button data-sh="${p.id}">Show on calendar</button></div></article>`}).join('');
  pb.className='cbody';pb.innerHTML=`<div class="ctitle">Patterns</div><div class="csub2">The same thing, happening again days or weeks apart.</div>${cards}`;
  pb.querySelectorAll('.pr').forEach(b=>b.onclick=()=>openKey(b.dataset.k));
  pb.querySelectorAll('[data-sh]').forEach(b=>b.onclick=()=>{closePat();setTimeout(()=>setFilter(b.dataset.sh),350)});
  pv.classList.add('on');pv.setAttribute('aria-hidden','false');pb.scrollTop=0;
 }
 function closePat(){pv.classList.remove('on');pv.setAttribute('aria-hidden','true');pp.style.transform=''}
 function open(){
  if(Z.kb.on)Z.kb.close();
  render();ov.classList.add('on');ov.setAttribute('aria-hidden','false');
  setTimeout(()=>{const ms=body.querySelectorAll('.cm');body.scrollTop=ms[2].offsetTop-8},60);
 }
 function close(){ov.classList.remove('on');ov.setAttribute('aria-hidden','true');panel.style.transform='';closePat()}
 $('#calClose').onclick=close;$('#calv .dim').onclick=close;$('#patClose').onclick=closePat;$('#patv .dim').onclick=closePat;
 function drag(zone,pn,fn){let y0=0,dy=0,id=null;
  zone.addEventListener('pointerdown',e=>{id=e.pointerId;y0=e.clientY;dy=0;zone.setPointerCapture(id);pn.classList.add('drag')});
  zone.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;const s=$('#phone').getBoundingClientRect().width/390;dy=Math.max(0,(e.clientY-y0)/s);pn.style.transform=`translateY(${dy}px)`});
  const end=e=>{if(e.pointerId!==id)return;id=null;pn.classList.remove('drag');if(dy>110)fn();else pn.style.transform=''};
  zone.addEventListener('pointerup',end);zone.addEventListener('pointercancel',end)}
 drag($('#calv .dragzone'),panel,close);drag($('#patv .dragzone'),pp,closePat);
 return{open,close,related,openKey};
})();
