/* iOS-style keyboard. Types into whichever input or textarea opened it. Physical keys keep working too. */
Z.kb=(function(){
 const el=Z.$('#kb'),phone=Z.$('#phone');
 let target=null,layer='abc',shift=1,lastShift=0,keeps=[],emo=0,rep=null;
 const WORDS='about after again always and because busy but coffee day did for free from glad good had hackathon have hello just like lunch met meeting new not nervous one pitch presentation really slow someone team that the then they think tired today told very was went with yes said hi talk people morning'.split(' ');
 const NEXT={i:['am','was','think'],the:['team','day','new'],was:['a','really','so'],i_:['I','The','I\'m']};
 const L1='qwertyuiop',L2='asdfghjkl',L3='zxcvbnm',N1='1234567890',N2='-/:;()$&@"',N3='.,?!\'';
 el.innerHTML='<div class="kpred"><button></button><button></button><button></button></div><div class="krows" id="krows"></div><span class="kmic">'+Z.ic('mic',22,'#000')+'</span>';
 const rowsEl=Z.$('#krows'),preds=[...el.querySelectorAll('.kpred button')];
 const key=(a,label,cls='',ch)=>`<button class="k ${cls}" data-a="${a}"${ch!==undefined?` data-c="${Z.esc(ch)}"`:''} tabindex="-1" aria-label="${Z.esc(a==='ch'?ch:a)}"><span class="l">${label}</span><span class="pp">${label}</span></button>`;
 function render(){
  const up=shift>0;
  const chars=(s,ex)=>[...s].map(c=>key('ch',layer==='abc'&&up?c.toUpperCase():c,'',c)).join('');
  let h='';
  if(layer==='abc'){
   h+=`<div class="krow">${chars(L1)}</div><div class="krow r2">${chars(L2)}</div>`;
   h+=`<div class="krow r3">${key('shift',Z.ic('shift',20,'#000',1.6).replace('fill="none"',shift?'fill="#000"':'fill="none"'),'sp wide')}${chars(L3)}${key('del',Z.ic('del',22,'#000',1.5),'sp wide')}</div>`;
  }else{
   h+=`<div class="krow">${chars(N1)}</div><div class="krow">${chars(N2)}</div>`;
   h+=`<div class="krow r3">${key('none','#+=','sp wide')}${chars(N3)}${key('del',Z.ic('del',22,'#000',1.5),'sp wide')}</div>`;
  }
  h+=`<div class="krow rb">${key('num',layer==='abc'?'123':'ABC','sp wide')}${key('emoji',Z.ic('smile',22,'#000',1.5),'sp wide')}${key('space','space','spc')}${key('ret',target&&target.dataset.enter==='send'?'send':'return','sp ret')}</div>`;
  rowsEl.innerHTML=h;
 }
 function labels(){
  const up=shift>0&&layer==='abc';
  rowsEl.querySelectorAll('.k[data-a="ch"]').forEach(k=>{const c=k.dataset.c,t=up?c.toUpperCase():c;k.querySelectorAll('.l,.pp').forEach(n=>n.textContent=t)});
  const s=rowsEl.querySelector('[data-a="shift"] svg');if(s)s.setAttribute('fill',shift?'#000':'none');
 }
 function before(){return target?target.value.slice(0,target.selectionStart):''}
 function autoShift(){if(shift===2)return;const b=before();shift=(!b||/([.!?]\s+|\n)$/.test(b))?1:0}
 function ins(s){
  if(!target)return;
  const a=target.selectionStart,b=target.selectionEnd,v=target.value;
  if(target.maxLength>0&&v.length-(b-a)+s.length>target.maxLength)return;
  target.value=v.slice(0,a)+s+v.slice(b);
  target.selectionStart=target.selectionEnd=a+s.length;
  fire();
 }
 function del(){
  if(!target)return;
  const a=target.selectionStart,b=target.selectionEnd,v=target.value;
  if(a!==b){target.value=v.slice(0,a)+v.slice(b);target.selectionStart=target.selectionEnd=a}
  else if(a>0){const pre=v.slice(0,a).replace(/(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S])$/,'');target.value=pre+v.slice(a);target.selectionStart=target.selectionEnd=pre.length}
  fire();
 }
 function fire(){target.dispatchEvent(new Event('input',{bubbles:true}));if(target.tagName==='TEXTAREA')target.scrollTop=target.scrollHeight}
 function refresh(){autoShift();labels();predict()}
 function predict(){
  const b=before(),m=b.match(/([A-Za-z']+)$/);let out;
  if(m){const p=m[1].toLowerCase();const hit=WORDS.filter(w=>w.startsWith(p)&&w!==p).slice(0,3);out=hit.length?hit:['"'+m[1]+'"'];while(out.length<3)out.push(WORDS[(out.length*7+p.length)%WORDS.length])}
  else{const w=b.trim().split(/\s+/).pop().toLowerCase();out=(NEXT[w]||['I','The','I\'m'])}
  preds.forEach((p,i)=>{p.textContent=out[i]||'';p.dataset.w=out[i]||''});
 }
 preds.forEach(p=>{p.addEventListener('pointerdown',e=>{e.preventDefault();if(!target)return;const w=p.dataset.w.replace(/^"|"$/g,'');if(!w)return;const b=before(),m=b.match(/([A-Za-z']+)$/);if(m){target.selectionStart=target.selectionStart-m[1].length}ins(w.charAt(0)===w.charAt(0)&&shift===1?w.charAt(0).toUpperCase()+w.slice(1):w);ins(' ');refresh()})});
 function act(k){
  const a=k.dataset.a;
  if(a==='ch'){ins(k.querySelector('.l').textContent);if(shift===1)shift=0;refresh()}
  else if(a==='space'){const b=before();if(/ $/.test(b)&&/[A-Za-z0-9]/.test(b.trim().slice(-1))){target.selectionStart-=1;ins('. ')}else ins(' ');refresh()}
  else if(a==='del'){del();refresh()}
  else if(a==='shift'){const n=performance.now();if(n-lastShift<350)shift=2;else shift=shift?0:1;lastShift=n;labels()}
  else if(a==='num'){layer=layer==='abc'?'num':'abc';render();predict()}
  else if(a==='emoji'){ins(['🙂','😅','🔥','☕','✨'][emo++%5]);refresh()}
  else if(a==='ret'){if(target&&target.dataset.enter==='send')target.dispatchEvent(new CustomEvent('zumi-send'));else{ins('\n');refresh()}}
 }
 el.addEventListener('pointerdown',e=>{
  e.preventDefault();
  const k=e.target.closest('.k');if(!k)return;
  k.classList.add('dn');
  act(k);
  if(k.dataset.a==='del'){rep=setTimeout(()=>{rep=setInterval(()=>{del();refresh()},65)},420)}
 });
 const up=e=>{clearTimeout(rep);clearInterval(rep);rep=null;el.querySelectorAll('.k.dn').forEach(k=>k.classList.remove('dn'))};
 el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up);
 el.addEventListener('mousedown',e=>e.preventDefault());
 const onType=()=>{if(!el.classList.contains('on'))return;refresh()};
 function open(t){
  if(target&&target!==t)target.removeEventListener('input',onType);
  target=t;target.addEventListener('input',onType);
  t.focus({preventScroll:true});
  layer='abc';shift=0;autoShift();render();predict();
  el.classList.add('on');phone.classList.add('kb');
 }
 function close(){
  if(target){target.removeEventListener('input',onType);target.blur();target=null}
  el.classList.remove('on');phone.classList.remove('kb');
 }
 phone.addEventListener('pointerdown',e=>{
  if(!el.classList.contains('on'))return;
  if(keeps.some(f=>f())||e.target.closest('#kb,[data-keepkb]'))return;
  close();
 });
 return{open,close,get on(){return el.classList.contains('on')},get target(){return target},setKeep(f){keeps.push(f)}};
})();
