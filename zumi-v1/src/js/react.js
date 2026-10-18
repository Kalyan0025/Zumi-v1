/* Zumi answers every moment with the morning's horoscope */
Z.react=(function(){
 const R=Z.data.READING,T=Z.data.TAGS;
 const line=k=>R.rows.find(r=>r[1].toLowerCase()===k)[2];
 const KW={talk:/said|talk|spoke|told|asked|hello|\bhi\b|met|call/i,pace:/\byes\b|think about|slow|rush|busy|late|deadline|wait|later/i,trust:/new|someone|stranger|trust|face|friend|offer|team/i};
 const guess=t=>t?(Object.keys(KW).find(k=>KW[k].test(t))||null):null;
 const ASK={talk:'Did it feel like saying less?',pace:'Did you slow it down?',trust:'Did you let them earn it?'};
 function mark(m,k,fit){m.tagKey=k;m.fit=fit;m.tag=[T[k][0],T[k][1]+(fit==='y'?' · fits today':fit==='n'?' · did not fit':'')];Z.feed.setTag(m);Z.memories&&Z.memories.refreshToday()}
 function lead(m){return m.type==='voice'?'Heard it.':m.type==='photo'?((m.srcs||[]).length>1?'Photos saved.':'Photo saved.'):'Logged.'}
 function reply(m,k){
  if(!k)return{intro:`${lead(m)} Nothing in this morning's reading maps to it, so I will not force a tag.`,ask:'Pick one if it belongs somewhere.',chips:Object.keys(T).map(key=>({t:T[key][0]+' '+T[key][1],cb:()=>{mark(m,key);Z.feed.say(reply(m,key),700)}}))};
  return{intro:`${lead(m)} That sits under ${T[k][0]} ${T[k][1]}. This morning: “${line(k)}”`,ask:ASK[k],chips:[
   {t:'It fit',cb:()=>{mark(m,k,'y');Z.feed.say({intro:'Good. I will bring it up when we close the day.'},700)}},
   {t:'Not really',cb:()=>{mark(m,k,'n');Z.feed.say({intro:'Fair. That counts too. It goes into tonight.'},700)}}]};
 }
 function after(m){const k=m.tagKey||guess(m.text);setTimeout(()=>Z.feed.say(reply(m,k),900),700)}
 return{after,guess};
})();
