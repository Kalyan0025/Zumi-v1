/* App shell: greeting, Zumi chat bar, controls, fit-to-screen */
(function(){
 const $=Z.$,phone=$('#phone');
 /* static pieces */
 $('#calBtn').innerHTML=Z.ic('cal',20,'#1C1C1E');
 Z.setMascot($('#readM'),26,'look');
 $('#readChev').innerHTML=Z.ic('right',16,'#6B6B70');
 $('#plusO').innerHTML=Z.ic('plus',14,'#FF9A2E',2);
 $('#micB').innerHTML=Z.ic('mic',20,'#1C1C1E');
 $('#sendB').innerHTML=Z.ic('up',20,'#fff',2);
 Z.setMascot($('#greetM'),96,'look',{glow:true,track:true});
 $('#calBtn').onclick=()=>Z.cal.open();

 Z.memories.renderStreak();
 /* greeting suggestions talk to Zumi */
 document.querySelectorAll('#greet .pills button').forEach(b=>b.onclick=()=>Z.feed.send(b.textContent));

 /* the bottom bar is only for talking to Zumi */
 const inp=$('#chatIn'),bar=$('#chatBar');
 inp.dataset.enter='send';
 const sync=()=>bar.classList.toggle('has',!!inp.value.trim());
 inp.addEventListener('input',sync);
 inp.addEventListener('focus',()=>{bar.classList.add('active');if(!Z.kb.on||Z.kb.target!==inp)Z.kb.open(inp)});
 inp.addEventListener('blur',()=>bar.classList.remove('active'));
 function go(){const v=inp.value;if(Z.feed.send(v)){inp.value='';sync();inp.dispatchEvent(new Event('input'))}}
 inp.addEventListener('zumi-send',go);
 inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go()}});
 $('#sendB').onclick=go;
 $('#sendB').setAttribute('data-keepkb','');
 /* mic: stand-in dictation */
 $('#micB').onclick=()=>{
  const b=$('#micB'),txt='I have a busy day today';if(b.classList.contains('live'))return;
  b.classList.add('live');inp.value='';let i=0;
  const iv=setInterval(()=>{inp.value=txt.slice(0,++i);sync();if(i>=txt.length){clearInterval(iv);b.classList.remove('live')}},55);
 };

 /* controls under the phone */
 function resetAll(){
  Z.cap.close();Z.cap.reset();$('#rev').classList.remove('on','fly');
  Z.sheet.close();Z.kb.close();Z.night.close(true);Z.memories.close();Z.feed.clear();Z.clock.reset();Z.memories.refreshToday();Z.night.sync(true);
  $('#readRow').classList.remove('seen');inp.value='';sync();
 }
 $('#reset').onclick=resetAll;
 $('#homeBtn').onclick=()=>{Z.cap.close();Z.sheet.close();Z.kb.close();Z.night.close(true);Z.memories.close();Z.feed.show('home');Z.setMascot($('#greetM'),96,'happy',{glow:true,track:true},true);setTimeout(()=>Z.setMascot($('#greetM'),96,'look',{glow:true,track:true}),1200)};
 $('#sample').onclick=()=>{resetAll();setTimeout(Z.feed.sample,60)};

 /* scale the phone to the viewport */
 function fit(){
  const st=$('#stage'),un=$('#under');
  const w=innerWidth-32,h=innerHeight-un.offsetHeight-40;
  const s=Math.max(.3,Math.min(1,w/390,h/844));
  st.style.width=390*s+'px';st.style.height=844*s+'px';phone.style.transform=`scale(${s})`;
 }
 addEventListener('resize',fit);fit();setTimeout(fit,300);
})();
