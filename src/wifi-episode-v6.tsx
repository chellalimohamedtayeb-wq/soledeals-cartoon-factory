import React from 'react';
import {AbsoluteFill,Audio,Sequence,interpolate,staticFile,useCurrentFrame} from 'remotion';
import voiceTiming from './voice-timing.generated.json';
import {RigSol as Sol, RigDex as Dex} from './character-rigs';

const C={ink:'#202532',blue:'#1767ED',paper:'#FBF9F3',gray:'#434B5B'};
const E={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const lerp=(f:number,a:number,b:number,x:number,y:number)=>interpolate(f,[a,b],[x,y],E);
const clips=(voiceTiming.clips as {id:string;who:'sol'|'dex';startFrame:number;durationFrames:number;filename:string;characters:{char:string;startFrame:number;endFrame:number}[]}[]);
const talking=(who:'sol'|'dex',f:number,fallback:boolean)=>
  voiceTiming.enabled?clips.some(c=>c.who===who&&c.characters.some(q=>/\S/.test(q.char)&&f>=q.startFrame&&f<q.endFrame)):fallback;
const gfx=(x:number,y:number,s=1,rot=0)=>'translate('+x+' '+y+') rotate('+rot+') scale('+s+')';
const stroke={stroke:C.ink,strokeWidth:8,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
type Feel='warm'|'doubt'|'surprise'|'jealous'|'laugh'|'sulk'|'deadpan';
const LegacySol:React.FC<{x:number;y:number;s?:number;rot?:number;emotion:Feel;mouth?:boolean;hug?:boolean;arms?:'hug'|'accuse'|'flail'|'cross';bounce?:number}> =({x,y,s=1,rot=0,emotion,mouth=false,hug=false,arms='hug',bounce=0})=>{
 const f=useCurrentFrame(),b=Math.sin(f*.32)*bounce,eyeHeight=f%102<4?1:11;
 const surprise=emotion==='surprise'||emotion==='jealous';
 return <g transform={gfx(x,y+b,s,rot)}>
  {/* character coordinates relative to feet at ~ y+250 */}
  <ellipse cx="0" cy="250" rx="111" ry="17" fill="#2E3540" opacity=".1"/>
  <g {...stroke} fill="none">
    <path d="M-45 116 Q-62 172 -57 239 M48 115 Q58 172 68 239" strokeWidth="22"/>
    <path d="M-78 241 q27 11 39 0 M45 241 q27 9 40 0" strokeWidth="17"/>
  </g>
  <path d="M-77 -21 Q-112 20 -95 129 Q-6 153 97 125 Q117 28 74 -24Z" fill={C.blue} {...stroke}/>
  <path d="M-7 13 l0 110" {...stroke} fill="none" opacity=".23"/>
  {/* arms are behind the face but in front of torso */}
  {arms==='flail'?<g {...stroke} fill="none" strokeWidth="20"><path d={'M-78 9 Q-156 '+(-40+Math.sin(f)*22)+' -168 -132'}/><path d={'M83 7 Q162 '+(-62-Math.sin(f)*23)+' 174 -147'}/><circle cx="-168" cy="-132" r="12" fill={C.paper}/><circle cx="174" cy="-147" r="12" fill={C.paper}/></g>:null}
  {arms==='accuse'?<g {...stroke} fill="none" strokeWidth="20"><path d="M-80 10 Q-99 84 -139 62"/><path d="M85 11 Q150 -22 216 -55"/><path d="M216 -55 l11 -32 M216 -55 l24 16" strokeWidth="10"/></g>:null}
  {arms==='cross'?<g {...stroke} fill="none" strokeWidth="20"><path d="M-82 10 Q-99 96 68 40"/><path d="M85 11 Q90 90 -58 39"/></g>:null}
  {/* same oval head identity, expressive lids/brows */}
  <path d="M-107 -228 C-101 -313 54 -314 104 -235 C130 -157 98 -67 14 -60 C-74 -54 -126 -126 -107 -228Z" fill={C.paper} {...stroke}/>
  <path d="M-20 -294 Q-34 -321 -16 -331 M1 -292 Q20 -315 11 -339" {...stroke} fill="none" strokeWidth="6"/>
  {surprise?<g fill="#fff" {...stroke}><ellipse cx="-39" cy="-192" rx="23" ry="31"/><ellipse cx="45" cy="-192" rx="23" ry="31"/><circle cx="-36" cy="-190" r="7" fill={C.ink}/><circle cx="43" cy="-190" r="7" fill={C.ink}/></g>:<g {...stroke} fill="none" strokeWidth="6"><path d={'M-55 -193 q16 '+eyeHeight+' 31 0'}/><path d={'M26 -193 q16 '+eyeHeight+' 31 0'}/></g>}
  {emotion==='jealous'||emotion==='sulk'?<g {...stroke} fill="none" strokeWidth="7"><path d="M-65 -230 l42 14 M26 -216 l43 -16"/></g>:null}
  {mouth?<ellipse cx="1" cy="-124" rx={surprise?20:14} ry={surprise?22:8+6*Math.abs(Math.sin(f*.84))} fill={C.ink}/>:emotion==='warm'?<path d="M-23 -133 Q0 -107 26 -134" {...stroke} fill="none" strokeWidth="6"/>:emotion==='surprise'?<ellipse cx="0" cy="-127" rx="21" ry="29" fill={C.ink}/>:emotion==='jealous'||emotion==='sulk'?<path d="M-26 -117 Q0 -143 26 -116" {...stroke} fill="none" strokeWidth="7"/>:<path d="M-16 -125 h34" {...stroke} fill="none" strokeWidth="5"/>}
  </g>;
};
const LegacyDex:React.FC<{x:number;y:number;s?:number;rot?:number;emotion:Feel;mouth?:boolean;arms?:'normal'|'shock'|'phone'|'laugh'|'facepalm';bounce?:number}> =({x,y,s=1,rot=0,emotion,mouth=false,arms='normal',bounce=0})=>{
 const f=useCurrentFrame(),b=Math.sin(f*.48)*bounce,eyelid=f%89<4;
 return <g transform={gfx(x,y+b,s,rot)}>
  <ellipse cx="0" cy="250" rx="98" ry="16" fill="#2E3540" opacity=".1"/>
  <g {...stroke} fill="none" strokeWidth="20"><path d="M-38 114 Q-53 174 -57 235 M48 114 Q58 174 64 235"/><path d="M-78 235 h43 M44 235 h42"/></g>
  <path d="M-88 -28 Q-102 49 -90 126 Q-10 144 94 123 Q110 30 85 -31Z" fill={C.gray} {...stroke}/>
  <path d="M89 25 L105 35" stroke={C.blue} strokeWidth="14"/>
  {arms==='shock'?<g {...stroke} fill="none" strokeWidth="19"><path d={'M-86 2 Q-151 '+(-24+Math.sin(f*.65)*17)+' -180 -107'}/><path d={'M84 0 Q150 '+(-60-Math.sin(f*.65)*17)+' 168 -135'}/></g>:null}
  {arms==='normal'?<g {...stroke} fill="none" strokeWidth="18"><path d="M-82 0 Q-125 71 -113 111"/><path d="M87 0 Q129 77 121 113"/></g>:null}
  {arms==='phone'?<g {...stroke} fill="none" strokeWidth="18"><path d="M-84 5 Q-127 56 -116 118"/><path d="M85 1 Q130 -21 149 -89"/></g>:null}
  {arms==='laugh'?<g {...stroke} fill="none" strokeWidth="18"><path d={'M-83 2 Q-143 '+(72+Math.sin(f*.6)*20)+' -70 90'}/><path d={'M84 4 Q146 '+(67-Math.sin(f*.6)*18)+' 74 91'}/></g>:null}
  {arms==='facepalm'?<g {...stroke} fill="none" strokeWidth="19"><path d="M-82 2 Q-150 45 -115 111"/><path d="M85 5 Q136 -85 32 -143"/></g>:null}
  <path d="M-105 -261 Q-61 -299 76 -277 Q123 -251 113 -192 L101 -113 Q75 -76 -7 -77 Q-91 -75 -109 -131 Q-131 -209 -105 -261Z" fill={C.paper} {...stroke}/>
  <g {...stroke} fill="none" strokeWidth="8"><path d={emotion==='surprise'?"M-70 -234 l40 -25":"M-76 -236 l47 -10"}/><path d={emotion==='surprise'?"M25 -259 l50 25":"M29 -245 l51 10"}/></g>
  {eyelid?<g {...stroke} fill="none" strokeWidth="5"><path d="M-58 -198 h25 M38 -198 h25"/></g>:<g fill={C.ink}><ellipse cx="-45" cy="-201" rx={emotion==='surprise'?10:5} ry={emotion==='surprise'?16:10}/><ellipse cx="48" cy="-201" rx={emotion==='surprise'?10:5} ry={emotion==='surprise'?16:10}/></g>}
  {emotion==='laugh'?<path d="M-32 -156 Q0 -93 35 -157 Z" fill={C.ink}/>:mouth?<ellipse cx="0" cy="-143" rx="13" ry={9+6*Math.abs(Math.sin(f*.9))} fill={C.ink}/>:emotion==='surprise'?<ellipse cx="0" cy="-152" rx="20" ry="27" fill={C.ink}/>:<path d="M-20 -146 Q2 -152 25 -143" {...stroke} fill="none" strokeWidth="5"/>}
  </g>;
};
const Router:React.FC<{x:number;y:number;s?:number;rot?:number;plead?:boolean;happiness?:boolean}> =({x,y,s=1,rot=0,plead=false,happiness=false})=>{
 const f=useCurrentFrame(),wave=Math.sin(f*.45)*11;
 return <g transform={gfx(x,y,s,rot+Math.sin(f*.16)*2)}>
  <g {...stroke} fill="none"><path d={'M-68 -42 l'+wave+' -111'}/><path d={'M70 -42 l'+(-wave)+' -111'}/><path d="M-110 -51 Q-111 -67 -90 -68 H89 Q111 -65 111 -48 V32 Q107 53 86 53 H-87 Q-110 51 -110 31 Z" fill="#EAF0FB"/><path d="M-73 55 l-10 25 M75 55 l10 25" strokeWidth="12"/></g>
  <circle cx="71" cy="2" r="12" fill={C.blue} opacity={f%22<16?1:.25}/>
  <path d="M-73 3 h71" {...stroke} strokeWidth="6"/>
  {happiness?<path d="M-5 -115 c-25 -23 -45 15 0 36 c45 -22 24 -58 0 -36" fill={C.blue}/>:null}
  {plead?<g stroke={C.blue} strokeWidth="7" strokeLinecap="round"><path d="M-137 -23 l-34 -23 M135 -22 l36 -23"/></g>:null}
 </g>;
};
const Embrace:React.FC<{intensity?:number}> =({intensity=0})=>{
 const f=useCurrentFrame(),s=Math.sin(f*.3)*5;
 return <g fill="none" {...stroke} strokeWidth="23">
   <path d={'M284 1011 Q277 '+(1110+s)+' 361 1139 Q442 1169 496 1088'}/>
   <path d={'M474 987 Q550 '+(1019-s)+' 556 1082 Q552 1163 390 1134'}/>
   <ellipse cx="493" cy="1091" rx="20" ry="14" fill={C.paper} strokeWidth="6"/>
   <ellipse cx="386" cy="1132" rx="20" ry="14" fill={C.paper} strokeWidth="6"/>
   {intensity>0&&<g stroke={C.blue} strokeWidth="7"><path d="M253 1079 l-30 -25 M554 1035 l31 -28"/></g>}
 </g>;
};
const Card:React.FC<{text:string;big?:boolean}> =({text,big=false})=>{
 const f=useCurrentFrame(),pulse=big?1+0.013*Math.sin(f*.4):1;
 return <div style={{position:'absolute',bottom:175,left:65,right:65,fontSize:big?60:44,fontWeight:900,lineHeight:1.12,letterSpacing:big?-1:0,textAlign:'center',color:big?C.blue:C.ink,fontFamily:'Arial,sans-serif',textShadow:'2px 2px white,-2px -2px white',transform:'scale('+pulse+')'}}>{text}</div>;
};
const Burst:React.FC<{x:number;y:number}> =({x,y})=><g transform={'translate('+x+' '+y+')'} fill="none" stroke={C.blue} strokeWidth="10" strokeLinecap="round"><path d="M0 -70 v-49 M66 -38 l33 -45 M76 29 l62 10 M-68 -35 l-35 -45 M-70 36 l-67 26"/></g>;

export const WifiEpisodeV6:React.FC=()=>{
 const f=useCurrentFrame();
 const scene=f<105?0:f<245?1:f<355?2:f<485?3:4;
 const solJump=scene===3?lerp(f,355,372,365,255):365;
 const solRise=scene===3?Math.sin(Math.max(0,Math.min(1,(f-355)/29))*Math.PI)*-205:0;
 const dexEnter=scene===0?lerp(f,0,31,1190,760):760;
 const dexStumble=scene===0&&f>23&&f<45?Math.sin((f-23)/22*Math.PI)*-27:0;
 const solRecoils=scene===3?Math.sin(Math.min(1,Math.max(0,(f-355)/26))*Math.PI)*-80:0;
 const routerShift=scene===4?Math.sin(Math.min(1,Math.max(0,(f-490)/45))*Math.PI)*-21:0;
 const routerBack=scene===4?lerp(f,492,528,590,430):590;
 const entrance=scene===0?lerp(f,0,22,0,1):1;
 const zoom=scene===0?1.13+0.09*entrance:scene===1?1.13:scene===2?1.14:scene===3?1.10+0.06*Math.exp(-Math.pow((f-400)/15,2)):1.1;
 const focus=scene===0?495:scene===1?525:scene===2?540:scene===3?535:540;
 const shake=scene===3&&f>395&&f<425?Math.sin(f*2.7)*13*(1-(f-395)/30):0;
 return <AbsoluteFill style={{backgroundColor:C.paper,overflow:'hidden'}}>
   {voiceTiming.enabled&&clips.map(clip=><Sequence key={clip.id} from={clip.startFrame} durationInFrames={clip.durationFrames}><Audio src={staticFile('voice/'+clip.filename)}/></Sequence>)}
   <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
     <g transform={'translate('+(540+shake)+' 950) scale('+zoom+') translate('+(-focus)+' -950)'}><path d="M0 1338 H1080" stroke="#D7DBE3" strokeWidth="8"/>

     {scene===0&&<>
       <Router x={465+Math.sin(f*.17)*4} y={1076+Math.sin(f*.24)*6} s={1.19} happiness/>
       <Sol x={365} y={970} s={1.38} rot={-11+Math.sin(f*.2)*4} emotion="warm" bounce={5} arms="hug"/>
       <Dex x={dexEnter} y={1020+Math.sin((f-20)*.3)*(f>20&&f<38?60:0)} s={1.14} rot={dexStumble} emotion="surprise" arms={f>20?'shock':'normal'} mouth={talking('dex',f,f>39)}/>
       {f>=23&&f<47&&<Burst x={835} y={787}/>}
     </>}
     {scene===1&&<>
       <Router x={470} y={1090} s={1.18} happiness/>
       <Sol x={365} y={970} s={1.4} rot={-10+Math.sin(f*.2)*3} emotion="warm" bounce={6} arms="hug" mouth={talking('sol',f,f>=133)}/>
       <Dex x={855} y={1055} s={.84} emotion="doubt" arms="facepalm" rot={8}/>
     </>}
     {scene===2&&<>
       <Dex x={345} y={1105} s={1.3} emotion="doubt" arms="phone" mouth={talking('dex',f,f>=270)}/>
       <g transform="translate(765 965) rotate(-8)">
         <rect x="-190" y="-310" width="380" height="640" rx="49" fill="#E5EEFF" stroke={C.ink} strokeWidth="18"/>
         <rect x="-59" y="-284" width="115" height="20" rx="10" fill={C.ink}/>
         <text x="0" y="-130" textAnchor="middle" fontSize="47" fontWeight="900" fontFamily="Arial" fill={C.ink}>Wi-Fi</text>
         <text x="0" y="24" textAnchor="middle" fontSize="138" fontWeight="900" fontFamily="Arial" fill={C.blue}>12</text>
         <text x="0" y="97" textAnchor="middle" fontSize="43" fontWeight="900" fontFamily="Arial" fill={C.ink}>DEVICES</text>
         <text x="0" y="154" textAnchor="middle" fontSize="37" fontWeight="900" fontFamily="Arial" fill={C.ink}>CONNECTED</text>
       </g>
       <Burst x={886} y={470}/>
     </>}
     {scene===3&&<>
       {f>=394&&f<=415&&<g fill={C.blue} fontFamily="Arial" fontSize="55" fontWeight="900"><text x="630" y="630" transform={'rotate('+Math.sin(f)*8+' 630 630)'}>!!</text></g>}
       <Sol x={solJump+solRecoils} y={1030+solRise} s={1.58} rot={f<383?Math.sin(f*1.05)*13:Math.sin(f*.36)*5} emotion={f<392?'surprise':'jealous'} mouth={talking('sol',f,f>=395)} arms={f<388?'flail':'accuse'} bounce={f>390?8:0}/>
       <Router x={814} y={1215} s={.9} plead={f>=399}/>
       {f>=355&&f<391&&<Burst x={680} y={565}/>}
     </>}
     {scene===4&&<>
       <Sol x={248} y={1090} s={1.18} rot={-16-Math.min(6,(f-490)/7)} emotion="sulk" arms="cross"/>
       <Router x={routerBack} y={1218+routerShift} s={1.08} plead happiness/>
       <Dex x={826} y={1000} s={1.24} rot={18+Math.sin(f*.4)*14} emotion="laugh" arms="laugh" bounce={39}/>
       {f<519&&<Burst x={677} y={787}/>}
       {f>510&&f<526&&<g transform="translate(420 700)">
         <rect x="-184" y="-94" width="368" height="168" rx="34" fill="#E6EFFD" stroke={C.ink} strokeWidth="8"/>
         <text x="0" y="-23" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="43" fill={C.ink}>RECONNECT?</text>
         <rect x="-130" y="5" width="260" height="48" rx="19" fill={C.blue}/>
         <text x="0" y="40" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="29" fill="#fff">PLEASE ACCEPT</text>
       </g>}
       {f>=526&&<g transform="translate(420 700)">
         <rect x="-188" y="-98" width="376" height="176" rx="35" fill={C.paper} stroke={C.ink} strokeWidth="10"/>
         <text x="0" y="-12" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="39" fill="#CB4750">REJECTED!</text>
         <text x="0" y="43" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="26" fill={C.ink}>LOVE.EXE STOPPED</text>
       </g>}
     </>}
     </g>
   </svg>
   <div style={{position:'absolute',top:76,left:64,fontFamily:'Arial,sans-serif',color:C.blue,fontWeight:900,fontSize:28,letterSpacing:3}}>SOLEDEALS ORIGINALS</div>
   <div style={{position:'absolute',top:120,left:64,fontFamily:'Arial,sans-serif',color:C.ink,fontWeight:900,fontSize:44}}>THE WI-FI PROBLEM</div>
   {scene===0&&f>=38&&<Card text="Why are you hugging the router?!"/>}
   {scene===1&&f>=131&&<Card text={f<199?"My therapist said I need...":"a STRONGER CONNECTION."} big={f>=199}/>}
   {scene===2&&f>=270&&<Card text="It's connected to TWELVE other devices."/>}
   {scene===3&&<Card text={f<397?'TWELVE?!':'I THOUGHT WE WERE EXCLUSIVE!'} big/>}
   {scene===4&&f>=518&&<Card text={f<526?'RECONNECT?':'CONNECTION REJECTED.'} big/>}
   <div style={{position:'absolute',bottom:64,width:'100%',textAlign:'center',fontFamily:'Arial',fontSize:27,fontWeight:900,letterSpacing:6,color:C.blue}}>SOL & DEX</div>
 </AbsoluteFill>;
};
