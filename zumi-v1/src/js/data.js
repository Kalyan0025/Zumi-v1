/* Sample copy and canned replies. All placeholder; swap for the real engine later. */
Z.data={
 TAGS:{talk:['☿','Talk'],pace:['♂','Pace'],trust:['☽','Trust']},
 PROMPTS:['What made you smile today?','Who did you talk to just now?','What did you say yes to?','What are you glad you waited on?','Anything the reading got right?'],
 VOICE_LINES:['Met a new face in the back row. I said hi first and it went well.','Lunch ran long, but I talked the pitch through out loud. Felt steadier.','Told them I would think about it. I did not say yes right away, which is new.'],
 READING:{sign:'Taurus',date:'Saturday, Oct 17',title:['Stay steady.','Guard your yes.'],lead:'Venus keeps you grounded today. Words fly fast around you, so let others speak first.',
  rows:[['☿','Talk','Your words land fast today. Say less, and let people come to you.'],['♂','Pace','Mars rushes you. Slow your yes down.'],['☽','Trust','Go slow with new faces. Let them earn it.']],
  door:'Keep an eye out for someone who asks the question you were avoiding.'},
 replyFor(text){
  const t=text.toLowerCase();
  const R={
   busy:{intro:'Big day. Here is how the sky reads it.',rows:[['♂','Pace','Mars wants you to say yes to everything. Say it slowly.'],['☿','Talk','Speak second. Open with your strongest line.'],['☽','Trust','Go slow with new people today. Let them earn it.']]},
   stage:{intro:'A day to be heard. Here is the sky.',rows:[['☿','Talk','Your words land fast. Say less, and let the pause work.'],['♂','Pace','Slow your first minute down. Mars wants to rush it.'],['☽','Trust','Find one friendly face in the room and talk to them.']]},
   people:{intro:'Someone new is close. Here is the sky.',rows:[['☽','Trust','Let them show you who they are before you open up.'],['☿','Talk','Ask first. You learn more when they go first.'],['♂','Pace','Do not rush a yes. Let the day decide.']]},
   calm:{intro:'A steady day. Here is how the sky reads it.',rows:[['☽','Trust','Your gut is quiet and clear today. Believe it.'],['☿','Talk','Say the small thing out loud. It lands better than you think.'],['♂','Pace','Mars is soft today. Use it for one thing you have been putting off.']]}
  };
  let k='calm';
  if(/hackathon|busy|deadline|packed|long|24|exam|crunch|tired/.test(t))k='busy';
  else if(/present|pitch|talk|speech|demo|interview|stage|speak/.test(t))k='stage';
  else if(/meet|date|someone|friend|dinner|party|new/.test(t))k='people';
  const r=R[k];return {intro:r.intro,rows:r.rows,ask:'I will keep a log and check in tonight.',chips:['Nervous about something','Remind me tonight']};
 },
 followFor(text){
  const t=text.toLowerCase();
  if(/nervous|worried|anxious|scared/.test(t))return 'That is fair. Nervous usually means it matters. Add a moment when it starts to ease.';
  if(/remind|tonight|later/.test(t))return 'Done. I will check in tonight and ask how it went.';
  return 'Noted. Add a moment whenever something happens, and I will line it up with the sky tonight.';
 },
 SEEDS:[
  {kind:'user',text:'24-hour hackathon today. Need to stay active, talk well and present with confidence.'},
  {kind:'reply',text:'24-hour hackathon today. Need to stay active, talk well and present with confidence.'},
  {kind:'moment',type:'text',time:'9:42 AM',text:'Met a new face in the back row. Said hi first.',tag:['☿','You waited. Fits today'],tagKey:'talk'},
  {kind:'moment',type:'text',time:'12:10 PM',text:'Someone offered to join my team. Said I will think about it.',tag:['♂','Slow yes. Fits today'],tagKey:'pace'},
  {kind:'moment',type:'text',time:'2:35 PM',text:'Free coffee. They got the order wrong.'}
 ]
};
Z.state={moments:[],closed:false,fb:null,nudged:false,reset(){this.moments=[];this.closed=false;this.fb=null;this.nudged=false}};
Z.clock={h:2,m:52,str(){return this.h+':'+String(this.m).padStart(2,'0')+' PM'},bump(){this.m+=7;if(this.m>=60){this.m-=60;this.h++}},reset(){this.h=2;this.m=52}};
