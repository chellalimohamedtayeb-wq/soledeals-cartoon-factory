import React from 'react';
import {AbsoluteFill,Audio,Sequence,interpolate,spring,staticFile,useCurrentFrame} from 'remotion';
import timings from './voice-timing.generated.json';

/** SIMPLE SOL & DEX: motion and comedy first, minimal permanent vector shapes.
 * Frame ranges match the existing recorded Wi-Fi dialogue.
 */
const K={ink:'#252A32',navy:'#424956',blue:'#1767EB',ivory:'#FAF8F1',muted:'#E7EDF7',red:'#E45462'};
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const v=(frame:number,a:number,b:number,x:number,y:number)=>interpolate(frame,[a,b],[x,y],clamp);
const ease=(n:number)=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2;
const anim=(frame:number,a:number,b:number,x:number,y:number)=>x+(y-x)*ease(Math.max(0,Math.min(1,(frame-a)/(b-a))));
type Emotion='soft'|'curious'|'shock'|'mad'|'laugh'|'blank';
type Identity='sol'|'dex';
const voiceClips=timings.clips as {id:string;who:'sol'|'dex';filename:string;startFrame:number;durationFrames:number;characters:{char:string;startFrame:number;endFrame:number}[]}[];
const talking=(who:Identity,frame:number,fallback:boolean)=>timings.enabled
 ?voiceClips.some(c=>c.who===who&&c.characters.some(t=>/\S/.test(t.char)&&frame>=t.startFrame&&frame<t.endFrame))
 :fallback;
const stroke={stroke:K.ink,strokeWidth:6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};

const Figure:React.FC<{who:Identity;x:number;y:number;scale?:number;emotion?:Emotion;speak?:boolean;act?:'hold'|'look'|'point'|'flail'|'cross'|'laugh'|'show';tilt?:number;energy?:number}> =({who,x,y,scale=1,emotion='blank',speak=false,act='look',tilt=0,energy=0})=>{
 const f=useCurrentFrame(),sol=who==='sol',wave=Math.sin(f*.27),breath=Math.sin(f*.14)*2.5;
 const isShock=emotion==='shock',angry=emotion==='mad',happy=emotion==='soft'||emotion==='laugh';
 const headTurn=(emotion==='curious'?7:angry?-10:happy?5:0)+Math.sin(f*.12)*1.5;
 const jump=energy>0?Math.abs(Math.sin(f*.31))*energy:0;
 const eyey=emotion==='shock'?-2:2;
 const eyeDart=(emotion==='curious'&&f%47>30)?5:(emotion==='shock'?-4:0);
 const impact=(emotion==='shock'&&energy>0)?1+.025*Math.sin(f*.9):1;
 const leftHand=act==='flail'?[-145,-134+wave*27]:act==='cross'?[75,66]:act==='laugh'?[-130,45+wave*24]:[-90,68];
 const rightHand=act==='point'?[224,-47+wave*5]:act==='flail'?[161,-141-wave*32]:act==='cross'?[-75,66]:act==='show'?[144,-70]:act==='laugh'?[137,47-wave*27]:[100,76];
 // A single square or oval head; fixed identity in every shot.
 return <g transform={'translate('+x+' '+(y+breath-jump)+') rotate('+(tilt+Math.sin(f*.18)*energy*.10)+') scale('+(scale*impact)+' '+(scale/impact)+')'}>
  <ellipse cx="0" cy="240" rx="94" ry="12" fill={K.ink} opacity=".12"/>
  <g fill="none" stroke={K.ink} strokeWidth="18" strokeLinecap="round"><path d="M-35 115 Q-48 169 -45 225 M34 115 Q42 169 49 225"/><path d="M-73 224 h49 M32 224 h48" strokeWidth="10"/></g>
  <path d="M-80 -12 Q-100 30 -88 119 Q0 135 91 120 Q104 37 77 -12 Z" fill={sol?K.blue:K.navy} {...stroke}/>
  {sol&&<path d="M0 9 V109" stroke="#0C4DAF" strokeWidth="5" opacity=".45"/>}
  {/* Limb paths use broad arcs with restrained motion; wrists end at meaningful action targets. */}
  <g fill="none" stroke={K.ink} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
   <path d={'M-83 4 Q-143 57 '+leftHand[0]+' '+leftHand[1]}/>
   <path d={'M81 4 Q143 36 '+rightHand[0]+' '+rightHand[1]}/>
  </g>
  <g stroke={K.ink} strokeWidth="4" fill={K.ivory}><ellipse cx={leftHand[0]} cy={leftHand[1]} rx="11" ry="9"/><ellipse cx={rightHand[0]} cy={rightHand[1]} rx="11" ry="9"/></g>
  <g transform={'rotate('+headTurn+' 0 -95)'}>
   {sol?<><path d="M-93 -218 C-96 -282 81 -285 103 -220 C122 -141 91 -64 8 -57 C-88 -51 -122 -135 -93 -218Z" fill={K.ivory} {...stroke}/><path d="M-13 -274 l-9 -20 M12 -276 l7 -25" {...stroke} fill="none" strokeWidth="5"/></>:
      <path d="M-102 -245 Q-53 -277 72 -264 Q115 -239 104 -188 L98 -117 Q72 -70 -1 -72 Q-84 -70 -104 -128 Q-122 -197 -102 -245Z" fill={K.ivory} {...stroke}/>}
   <g stroke={K.ink} strokeWidth={angry?8:6} strokeLinecap="round">
    <path d={angry?'M-59 -222 l37 13':isShock?'M-67 -229 l38 -18':'M-59 -220 l36 -4'}/>
    <path d={angry?'M25 -210 l37 -13':isShock?'M24 -247 l40 19':'M26 -224 l35 5'}/>
   </g>
   {f%(sol?106:82)<3?<g stroke={K.ink} strokeWidth="5"><path d="M-56 -186 h27 M27 -186 h27"/></g>:<g fill={K.ink}><ellipse cx={-42+eyeDart} cy={-185+eyey} rx={isShock?7:5} ry={isShock?14:8}/><ellipse cx={42+eyeDart} cy={-185+eyey} rx={isShock?7:5} ry={isShock?14:8}/></g>}
   {emotion==='laugh'?<path d="M-30 -137 Q0 -81 31 -137 Z" fill={K.ink}/>:speak?<ellipse cx="0" cy="-130" rx={isShock?18:12} ry={7+9*Math.abs(Math.sin(f*.83))} fill={K.ink}/>:isShock?<ellipse cx="0" cy="-133" rx="17" ry="24" fill={K.ink}/>:angry?<path d="M-19 -123 Q0 -145 19 -123" {...stroke} fill="none"/>:happy?<path d="M-21 -138 Q0 -112 22 -138" {...stroke} fill="none"/>:<path d="M-15 -131 h29" {...stroke} fill="none" strokeWidth="4"/>}
  </g>
 </g>;
};

const Router:React.FC<{x:number;y:number;scale?:number;heart?:boolean;shock?:boolean}> =({x,y,scale=1,heart=false,shock=false})=>{
 const f=useCurrentFrame(),t=Math.sin(f*.18)*3;
 return <g transform={'translate('+x+' '+(y+t)+') scale('+scale+')'}>
  <g stroke={K.ink} strokeWidth="6" fill="none" strokeLinecap="round"><path d="M-60 -28 l-9 -93 M60 -28 l8 -93"/></g>
  <rect x="-102" y="-34" width="205" height="94" rx="18" fill={K.muted} {...stroke}/>
  <path d="M-67 17 H-18" stroke={K.ink} strokeWidth="6" strokeLinecap="round"/>
  <circle cx="67" cy="18" r="9" fill={K.blue} opacity={f%25<18?1:.35}/>
  {heart&&<path d="M0 -79 C-27 -114 -53 -71 0 -41 C48 -75 24 -113 0 -79" fill={K.blue}/>}
  {shock&&<g stroke={K.blue} strokeWidth="6"><path d="M-131 -40 l-26 -23 M125 -40 l26 -23"/></g>}
 </g>;
};

const Hug:React.FC<{f:number}> =({f})=><g>
 {/* Router is physically nested inside the body motion, rather than floating by itself. */}
 <Figure who="sol" x={0} y={0} scale={1} emotion="soft" act="hold" tilt={-6+Math.sin(f*.13)*2}/>
 <Router x={60} y={99} scale={.92} heart/>
 <g fill="none" stroke={K.ink} strokeWidth="17" strokeLinecap="round">
  <path d="M-83 13 Q-142 107 -56 131 Q0 152 42 134"/>
  <path d="M85 12 Q144 66 145 123 Q123 156 83 136"/>
 </g>
 <g fill={K.ivory} stroke={K.ink} strokeWidth="4"><ellipse cx="42" cy="134" rx="14" ry="9"/><ellipse cx="83" cy="136" rx="14" ry="9"/></g>
 </g>;

const Txt:React.FC<{label:string;huge?:boolean}> =({label,huge=false})=><div style={{position:'absolute',bottom:170,left:55,right:55,textAlign:'center',fontFamily:'Arial,sans-serif',fontWeight:900,fontSize:huge?61:44,lineHeight:1.15,letterSpacing:huge?-1:0,color:huge?K.blue:K.ink,textShadow:'2px 2px 0 white,-2px -2px 0 white'}}>{label}</div>;
const Phone:React.FC=()=>{const f=useCurrentFrame(),s=1+.03*Math.sin(f*.17);return <g transform={'translate(750 970) rotate(-7) scale('+s+')'}><rect x="-172" y="-284" width="344" height="563" rx="43" stroke={K.ink} strokeWidth="13" fill="#E9F0FC"/><rect x="-50" y="-263" width="100" height="15" rx="9" fill={K.ink}/><text y="-121" textAnchor="middle" fontSize="42" fill={K.ink} fontWeight="bold" fontFamily="Arial">Wi-Fi</text><text y="17" textAnchor="middle" fontSize="130" fill={K.blue} fontWeight="bold" fontFamily="Arial">12</text><text y="95" textAnchor="middle" fontSize="40" fill={K.ink} fontWeight="bold" fontFamily="Arial">DEVICES</text><text y="148" textAnchor="middle" fontSize="34" fill={K.ink} fontWeight="bold" fontFamily="Arial">CONNECTED</text></g>};
export const SimpleWifiMaster:React.FC=()=>{
 const f=useCurrentFrame(),scene=f<105?0:f<245?1:f<355?2:f<485?3:4;
 const dexWalk=anim(f,0,27,1250,810);
 const hop=scene===3?Math.sin(Math.PI*Math.max(0,Math.min(1,(f-355)/25)))*-183:0;
 const solPush=scene===3?anim(f,355,378,360,230):360;
 const camera=scene===0?1.04:scene===1?(f>184?1.16:1.10):scene===2?(f>285?1.12:1.04):scene===3?(f<392?1.18:1.12):1.04;
 const focalX=scene===1?450:scene===2?610:scene===3?420:540;
 const punch=v(f,396,407,0,1);
 const crispFrame=scene===4&&f>=506&&f<=515;
 const freeze=(f>=343&&f<355)||(f>=477&&f<486);
 const reveal=scene===3&&f>395&&f<420?Math.sin((f-395)/25*Math.PI)*6:0;
 return <AbsoluteFill style={{backgroundColor:K.ivory,overflow:'hidden'}}>
 {timings.enabled&&voiceClips.map(c=><Sequence key={c.id} from={c.startFrame} durationInFrames={c.durationFrames}><Audio src={staticFile('voice/'+c.filename)}/></Sequence>)}
 <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
  <path d="M70 1360 H1010" stroke="#DADDE3" strokeWidth="6"/>
  <g transform={'translate(540 1000) scale('+camera+') translate('+(-focalX)+' -1000)'}>
   {scene===0&&<>
     <g transform={'translate(385 1043) scale(1.45)'}><Hug f={f}/></g>
     <Figure who="dex" x={dexWalk} y={1065+(f>25&&f<43?-47*Math.sin((f-25)/18*Math.PI):0)} scale={1.25} emotion={f<24?'curious':'shock'} act={f>24?'flail':'look'} speak={talking('dex',f,f>39)} tilt={f>23&&f<41?-21*Math.sin((f-23)/18*Math.PI):0} energy={f>24&&f<48?16:2}/>
     {f>27&&f<54&&<g stroke={K.blue} strokeWidth="8" strokeLinecap="round"><path d="M938 742 l42 -46 M973 802 l46 -24"/></g>}
   </>}
   {scene===1&&<>
     <g transform={'translate(395 1043) scale(1.56)'}><Hug f={f}/></g>
     {talking('sol',f,f>132)&&<g transform="translate(395 1043) scale(1.56)"><ellipse cx="0" cy="-128" rx="12" ry={6+8*Math.abs(Math.sin(f*.84))} fill={K.ink}/></g>}
     <Figure who="dex" x={840} y={1075} scale={.88} emotion={f<174?'curious':'blank'} act={f<177?'cross':'look'} tilt={f>208?12:5}/>
     {f>=200&&f<240&&<g fill={K.blue} fontWeight="900" fontSize="42" fontFamily="Arial"><text x="746" y="715">...?</text></g>}
   </>}
   {scene===2&&<>
     <Figure who="dex" x={350} y={1095} scale={1.28} emotion={f<295?'curious':'blank'} act="show" speak={talking('dex',f,f>270)} tilt={f<305?8:0} />
     <Phone/>
   </>}
   {scene===3&&<>
     <Figure who="sol" x={solPush+reveal} y={1062+hop} scale={1.66+(.07*Math.sin((f-355)/130*Math.PI))} emotion={f<393?'shock':'mad'} act={f<393?'flail':'point'} speak={talking('sol',f,f>=398)} energy={f>385?17:8} tilt={f>394&&f<429?-10*Math.sin((f-394)/35*Math.PI):0}/>
     <Router x={810} y={1194} scale={1} shock={f>=399}/>
     {f>350&&f<389&&<g stroke={K.blue} strokeWidth="10" strokeLinecap="round"><path d="M680 655 l27 -68 M745 705 l70 -12"/></g>}
   </>}
   {scene===4&&<>
     <Figure who="sol" x={255} y={1087} scale={1.18} emotion="mad" act="cross" tilt={-12}/>
     <Figure who="dex" x={828} y={1035} scale={1.18} emotion="laugh" act="laugh" tilt={10+Math.sin(f*.30)*12} energy={26}/>
     <Router x={anim(f,486,529,575,458)} y={1180} scale={.96} heart={f<509}/>
     <g transform="translate(515 724)">
      <rect x="-185" y="-100" width="370" height="178" rx="30" stroke={K.ink} strokeWidth="8" fill="#E5EEFE"/>
      <text x="0" y="-32" fill={K.ink} fontSize="42" fontFamily="Arial" textAnchor="middle" fontWeight="900">{f<508?'RECONNECT?':'BLOCKED!'}</text>
      <text x="0" y="32" fill={f<508?K.blue:K.red} fontSize="29" fontFamily="Arial" textAnchor="middle" fontWeight="900">{f<508?'PLEASE ACCEPT':'NO SECOND CHANCE'}</text>
     </g>
   </>}
  </g>
 </svg>
 <div style={{position:'absolute',top:70,left:67,fontFamily:'Arial,sans-serif',fontSize:27,fontWeight:900,letterSpacing:4,color:K.blue}}>SOLEDEALS ORIGINALS</div>
 {scene===0&&f>38&&<Txt label="Why are you hugging the router?!"/>}
 {scene===1&&f>132&&<Txt label={f<201?"My therapist said I need...":"a STRONGER CONNECTION."} huge={f>=201}/>}
 {scene===2&&f>271&&<Txt label="It's connected to TWELVE other devices."/>}
 {scene===3&&f>355&&<Txt label={f<395?'TWELVE?!':'I THOUGHT WE WERE EXCLUSIVE!'} huge/>}
 {scene===4&&f>511&&<Txt label="SOL BLOCKED HIS WI-FI." huge/>}
 <div style={{position:'absolute',bottom:62,left:0,right:0,textAlign:'center',color:K.blue,fontFamily:'Arial,sans-serif',fontWeight:900,fontSize:27,letterSpacing:5}}>SOL & DEX</div>
 </AbsoluteFill>;
};
