/* Streak orbs + a day's memory card (thread of moments, then the night's feedback) */
Z.memories=(function(){
 const $=Z.$;
 const enc=s=>'data:image/svg+xml;utf8,'+encodeURIComponent(s);
 const wrap=(g,inner)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${g}</defs>${inner}</svg>`;
 const lg=(id,a,b,c)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/>${c?`<stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/>`:`<stop offset="1" stop-color="${b}"/>`}</linearGradient>`;
 const IMG={
  sun:()=>wrap(lg('a','#FFE6CC','#FFB77A','#F2701D'),'<rect width="240" height="240" fill="url(#a)"/><circle cx="150" cy="86" r="34" fill="#FFF6E4"/><path d="M0 170 Q60 130 120 165 T240 150 V240 H0Z" fill="#C9561E" opacity=".6"/><path d="M0 195 Q70 160 130 190 T240 180 V240 H0Z" fill="#A8431A"/><path d="M0 220 Q80 195 150 215 T240 210 V240 H0Z" fill="#622810"/>'),
  coffee:()=>wrap(lg('a','#FDF1E7','#F7D2AA'),'<rect width="240" height="240" fill="url(#a)"/><ellipse cx="120" cy="176" rx="74" ry="14" fill="#fff"/><path d="M70 104H170V132Q170 174 120 176Q70 174 70 132Z" fill="#fff"/><circle cx="176" cy="128" r="17" fill="none" stroke="#fff" stroke-width="9"/><ellipse cx="120" cy="104" rx="50" ry="9" fill="#8E4A22"/><path d="M104 84q-8-14 0-26t0-24M128 84q-8-14 0-26t0-24" fill="none" stroke="#F2701D" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/>'),
  dusk:()=>wrap(lg('a','#2B3A91','#8A6BD6','#F6A06B'),'<rect width="240" height="240" fill="url(#a)"/><circle cx="168" cy="72" r="24" fill="#FFF1D6"/><g fill="#FFF1D6"><circle cx="40" cy="40" r="2"/><circle cx="82" cy="70" r="1.6"/><circle cx="110" cy="30" r="2"/><circle cx="210" cy="120" r="1.6"/><circle cx="60" cy="110" r="1.4"/></g><path d="M0 190h26v-34h24v22h22v-52h28v46h20v-28h26v40h24v-24h26v36h24v40H0Z" fill="#1B2260"/>'),
  plant:()=>wrap(lg('a','#E6EEF7','#D9D3FF'),'<rect width="240" height="240" fill="url(#a)"/><ellipse cx="96" cy="120" rx="22" ry="70" transform="rotate(-24 120 190)" fill="#F68A2E"/><ellipse cx="146" cy="116" rx="20" ry="66" transform="rotate(22 120 190)" fill="#EC6226"/><ellipse cx="122" cy="104" rx="18" ry="68" fill="#FFA64F"/><path d="M120 190V120" stroke="#2B3A91" stroke-width="4" stroke-linecap="round"/><path d="M84 186h72l-9 44H93Z" fill="#FDF1E7"/>'),
  stage:()=>wrap(lg('a','#2B3A91','#4D5FC0'),'<rect width="240" height="240" fill="url(#a)"/><path d="M120 0L44 240H196Z" fill="#fff" opacity=".16"/><ellipse cx="120" cy="214" rx="70" ry="15" fill="#FFD98A"/><rect x="96" y="150" width="48" height="58" rx="6" fill="#FDF1E7"/><circle cx="120" cy="124" r="16" fill="#F2701D"/>'),
  sky:()=>wrap(lg('a','#BFD3F2','#F7D2AA'),'<rect width="240" height="240" fill="url(#a)"/><g fill="#fff" opacity=".92"><ellipse cx="80" cy="96" rx="52" ry="20"/><ellipse cx="116" cy="82" rx="40" ry="24"/><ellipse cx="170" cy="130" rx="46" ry="16"/></g><path d="M0 214Q60 190 120 208T240 200V240H0Z" fill="#7A8FD0"/>'),
  window:()=>wrap(lg('a','#FDF1E7','#F7D2AA'),'<rect width="240" height="240" fill="url(#a)"/><rect x="56" y="34" width="128" height="150" rx="10" fill="#D9E4F7"/><path d="M120 34V184M56 108H184" stroke="#fff" stroke-width="8"/><path d="M66 190H174L196 240H44Z" fill="#F68A2E" opacity=".35"/><circle cx="150" cy="70" r="14" fill="#FFF6E4"/>'),
  books:()=>wrap(lg('a','#E6EEF7','#D9D3FF'),'<rect width="240" height="240" fill="url(#a)"/><rect x="50" y="150" width="140" height="26" rx="4" fill="#2B3A91"/><rect x="60" y="122" width="124" height="26" rx="4" fill="#F2701D"/><rect x="48" y="94" width="130" height="26" rx="4" fill="#FFA64F"/><rect x="70" y="68" width="100" height="24" rx="4" fill="#FDF1E7"/><rect x="30" y="176" width="180" height="10" rx="5" fill="#8E4A22"/>'),
  bus:()=>wrap(lg('a','#1B2260','#4D5FC0','#F6A06B'),'<rect width="240" height="240" fill="url(#a)"/><rect x="34" y="104" width="172" height="76" rx="14" fill="#FDF1E7"/><g fill="#2B3A91"><rect x="46" y="116" width="30" height="26" rx="5"/><rect x="84" y="116" width="30" height="26" rx="5"/><rect x="122" y="116" width="30" height="26" rx="5"/><rect x="160" y="116" width="34" height="26" rx="5"/></g><circle cx="70" cy="184" r="14" fill="#1C1C1E"/><circle cx="170" cy="184" r="14" fill="#1C1C1E"/><circle cx="196" cy="160" r="6" fill="#FFD98A"/>'),
  walk:()=>wrap(lg('a','#FFE6CC','#F7D2AA'),'<rect width="240" height="240" fill="url(#a)"/><circle cx="64" cy="100" r="40" fill="#F68A2E"/><circle cx="178" cy="86" r="34" fill="#EC6226"/><rect x="60" y="130" width="8" height="60" fill="#8E4A22"/><rect x="174" y="116" width="8" height="74" fill="#8E4A22"/><path d="M96 240Q116 190 150 170Q122 160 128 130L134 240Z" fill="#FDF1E7"/>'),
  bowl:()=>wrap(lg('a','#FDF1E7','#F7D2AA'),'<rect width="240" height="240" fill="url(#a)"/><path d="M50 122H190Q186 190 120 196Q54 190 50 122Z" fill="#fff"/><circle cx="96" cy="120" r="20" fill="#F2701D"/><circle cx="130" cy="112" r="18" fill="#FFA64F"/><circle cx="158" cy="122" r="14" fill="#2B3A91"/><ellipse cx="120" cy="206" rx="64" ry="8" fill="#8E4A22" opacity=".25"/>'),
  lake:()=>wrap(lg('a','#FFD98A','#F6A06B','#8A6BD6'),'<rect width="240" height="240" fill="url(#a)"/><circle cx="120" cy="104" r="28" fill="#FFF6E4"/><rect y="124" width="240" height="116" fill="#4D5FC0"/><path d="M92 136H148M100 150H140M108 164H132" stroke="#FFF6E4" stroke-width="5" stroke-linecap="round" opacity=".7"/>'),
  rain:()=>wrap(lg('a','#C8D0E4','#9AA6CC'),'<rect width="240" height="240" fill="url(#a)"/><g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"><path d="M60 50l-8 24M110 30l-8 24M160 60l-8 24M90 110l-8 24M150 130l-8 24M200 100l-8 24M50 150l-8 24"/></g><path d="M0 210Q60 196 120 210T240 206V240H0Z" fill="#2B3A91" opacity=".6"/>'),
  table:()=>wrap(lg('a','#FFD98A','#FFA64F'),'<rect width="240" height="240" fill="url(#a)"/><circle cx="120" cy="124" r="56" fill="#FDF1E7"/><circle cx="120" cy="54" r="19" fill="#F2701D"/><circle cx="190" cy="124" r="19" fill="#2B3A91"/><circle cx="120" cy="194" r="19" fill="#A8431A"/><circle cx="50" cy="124" r="19" fill="#fff"/><circle cx="108" cy="116" r="8" fill="#8E4A22"/><circle cx="136" cy="130" r="8" fill="#F68A2E"/>')
 };
 const img=k=>/^p\d+$/.test(k)?Z.photos[+k.slice(1)]:enc(IMG[k]());
 const DAYS=[
  {d:'M',theme:'pace',date:'Monday, Oct 12',img:'p3',moments:[{time:'8:30 AM',text:'Coffee in the quiet corner of the library. Wrote the outline.'},{time:'1:15 PM',text:'Said no to an extra shift. Felt lighter.',tag:['♂','Slow no. Fits that day']}],fb:{talk:'p',pace:'y',trust:'y',word:'Steady'}},
  {d:'T',theme:'talk',date:'Tuesday, Oct 13',img:'p14',moments:[{time:'10:05 AM',text:'Walked the long way and noticed the new plants by the gym.'},{time:'4:40 PM',text:'Asked a stranger for directions on purpose.',tag:['☿','Went first. Fits that day']}],fb:{talk:'y',pace:'p',trust:'p',word:'Curious'}},
  {d:'W',theme:'talk',date:'Wednesday, Oct 14',img:null,moments:[{time:'11:20 AM',text:'Rehearsed the pitch out loud, twice.'},{time:'3:10 PM',text:'Went last in the review. It helped.',tag:['☿','Said less. Fits that day']}],fb:{talk:'y',pace:'y',trust:'n',word:'Nervous'}},
  {d:'T',theme:'trust',date:'Thursday, Oct 15',img:'p17',moments:[{time:'12:45 PM',text:'Team lunch ran long. Good ideas though.'},{time:'5:30 PM',text:'Someone asked what I was avoiding. Told the truth.',tag:['☽','Opened up. Fits that day']}],fb:{talk:'y',pace:'p',trust:'y',word:'Open'}},
  {d:'F',theme:'pace',date:'Friday, Oct 16',img:'p11',moments:[{time:'6:50 PM',text:'Finished late. Quiet bus ride home.'},{time:'9:10 PM',text:'Skipped the party. No regret.',tag:['♂','Slow yes. Fits that day']}],fb:{talk:'p',pace:'y',trust:'y',word:'Tired'}}
 ];
 const MARK={y:['✓','Fit'],p:['~','Partly'],n:['✗','Missed'],x:['–','Did not come up']};
 const mark=k=>`<span class="mk ${k}"><b>${MARK[k][0]}</b>${MARK[k][1]}</span>`;
 const KEYS=[['talk','☿','Talk'],['pace','♂','Pace'],['trust','☽','Trust']];
 Z.mark=mark;Z.KEYS=KEYS;

 function todayImg(){
  const p=Z.state.moments.find(m=>m.type==='photo'&&m.src);
  if(p)return p.src;
  return Z.state.closed?img('sun'):null;
 }
 function renderStreak(){
  const st=$('#streak');
  st.innerHTML='MTWTFSS'.split('').map((d,i)=>{
   if(i<5)return `<div class="sd"><button class="orb" style="--i:${i}" data-d="${i}" aria-label="${DAYS[i].date}, open memory"><i class="${DAYS[i].img?'':'nop'}" style="${DAYS[i].img?`background-image:url('${img(DAYS[i].img)}')`:''}"></i></button><span>${d}</span></div>`;
   if(i===5)return `<div class="sd"><button class="orb now" style="--i:${i}" data-d="5" aria-label="Today, open card"><i id="todayOrb" class="noimg"></i></button><span>${d}</span></div>`;
   return `<div class="sd"><div class="orb fut" style="--i:${i}"></div><span>${d}</span></div>`;
  }).join('');
  st.querySelectorAll('button.orb').forEach(b=>b.onclick=()=>open(+b.dataset.d));
  refreshToday();
 }
 function refreshToday(){
  const o=$('#todayOrb');if(!o)return;
  const src=todayImg();
  if(src){o.classList.remove('noimg');o.style.backgroundImage=`url('${src}')`;o.parentNode.classList.add('pop')}
  else{o.classList.add('noimg');o.style.backgroundImage=''}
 }
 /* ---- memory card ---- */
 const mem=$('#mem'),panel=$('#mem .sh'),body=$('#memBody'),foot=$('#memFoot');
 $('#memClose').innerHTML=Z.ic('x',18,'#1C1C1E');
 function fbHtml(fb,door){
  if(!fb)return `<div class="nofb"><b>Night feedback</b><span>Not yet. Close the day after a couple of moments and it lands here.</span></div>`;
  const rows=KEYS.map(k=>{const r=Z.data.READING.rows.find(x=>x[1]===k[2]);return `<div class="fbr"><div class="g"><span class="gt">${k[1]}</span></div><div class="t"><b>${k[2]}</b><br><span>${Z.esc(r[2])}</span></div>${mark(fb[k[0]]||'x')}</div>`}).join('');
  return `<div class="fbh">Night feedback</div>${rows}<div class="fbw"><span>Your word</span><b>${Z.esc(fb.word||'')}</b></div>${fb.note?`<div class="fbn">“${Z.esc(fb.note)}”</div>`:''}`;
 }
 function patHtml(d){
  const r=Z.cal&&Z.cal.related(d);if(!r)return '';
  const chips=r.others.length?`<div class="mpl">${r.others.map(p=>`<button data-pk="${p.k}" class="mpc">${p.img?`<i style="background-image:url('${img(p.img)}')"></i>`:'<i class="nb"></i>'}<span>${p.short}</span></button>`).join('')}</div>`:'';
  return `<div class="mpat" style="${r.style}"><div class="mph"><span class="g"><span class="gp">${r.glyph}</span></span><b>${r.name}</b><span class="mpn">${ord(r.nth)} of ${r.total}</span></div><div class="mpt">${r.line}. This happened again on other days, far from this one:</div>${chips}</div>`;
 }
 const ord=n=>n+(['th','st','nd','rd'][(n%100>10&&n%100<14)?0:Math.min(n%10,4)%4]||'th');
 function open(i){
  let date,imgsrc,moments,fb,isToday=i===5||i==='today',d0=null;
  if(isToday){date='Today · Saturday, Oct 17';imgsrc=todayImg();moments=Z.state.moments;fb=Z.state.closed?Z.state.fb:null}
  else{const d=typeof i==='object'?i:DAYS[i];d0=d;date=d.date;imgsrc=d.img?img(d.img):null;moments=d.moments;fb=d.fb}
  body.innerHTML=`<div class="mdate">${date}</div>
   ${imgsrc?`<div class="mimg"><img src="${imgsrc}" alt="Key memory"><span>Key memory</span></div>`:`<div class="mimg empty"><span>${isToday?'Add a photo moment and it lands here':'No photo this day'}</span></div>`}
   ${patHtml(isToday?'today':d0)}
   <div class="mh">What happened</div><div class="mthread" id="mThread"></div>
   <div class="mh">${fb?'':'Tonight'}</div><div class="mfb">${fbHtml(fb)}</div>`;
  body.querySelectorAll('[data-pk]').forEach(b=>b.onclick=()=>Z.cal.openKey(b.dataset.pk));
  const th=$('#mThread');
  if(!moments.length)th.innerHTML='<div class="nofb"><span>No moments yet today.</span></div>';
  moments.forEach(m=>{const el=Z.feed.momEl(m,false);th.appendChild(el)});
  body.scrollTop=0;
  foot.hidden=!(isToday&&!Z.state.closed);
  $('#memCta').disabled=false;
  if(Z.kb.on)Z.kb.close();
  mem.classList.add('on');mem.setAttribute('aria-hidden','false');
 }
 function close(){mem.classList.remove('on');mem.setAttribute('aria-hidden','true');panel.style.transform=''}
 $('#memClose').onclick=close;$('#mem .dim').onclick=close;
 $('#memCta').onclick=()=>{close();setTimeout(()=>Z.night.open(),380)};
 (function(){
  const z=$('#mem .dragzone');let y0=0,dy=0,id=null;
  z.addEventListener('pointerdown',e=>{id=e.pointerId;y0=e.clientY;dy=0;z.setPointerCapture(id);panel.classList.add('drag')});
  z.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;const s=$('#phone').getBoundingClientRect().width/390;dy=Math.max(0,(e.clientY-y0)/s);panel.style.transform=`translateY(${dy}px)`});
  const end=e=>{if(e.pointerId!==id)return;id=null;panel.classList.remove('drag');if(dy>110)close();else panel.style.transform=''};
  z.addEventListener('pointerup',end);z.addEventListener('pointercancel',end);
 })();
 return{renderStreak,refreshToday,open,close,img,DAYS};
})();
