import React from 'react';
import {AbsoluteFill,Audio,Sequence,interpolate,spring,staticFile,useCurrentFrame} from 'remotion';
import timings from './checkout-timing.generated.json';


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
const mouthEnergy=(who:Identity,frame:number):number=>{
 if(timings.enabled){
  const clip=voiceClips.find(c=>c.who===who&&frame>=c.startFrame&&frame<c.startFrame+c.durationFrames);
  if(!clip)return 0;
  const ch=clip.characters.find(t=>frame>=t.startFrame&&frame<t.endFrame)?.char||'';
  if(!/\\S/.test(ch)||/[.,!?]/.test(ch))return 0;
  if(/[MBP]/i.test(ch))return .17;
  if(/[AEIY]/i.test(ch))return .88;
  if(/[OUW]/i.test(ch))return .57;
  return .4;
 }
 const fallback=who==='dex'?[[28,98],[238,291],[455,532]]:[[113,196],[314,396]];
 return fallback.some(([a,b])=>frame>=a&&frame<b)?(.2+.65*Math.abs(Math.sin(frame*.36))):0;
};
const mouthPose=(who:Identity,frame:number):'closed'|'small'|'wide'|'round'|'open'=>{
 const e=mouthEnergy(who,frame);
 if(e<.11)return 'closed';
 if(e<.26)return 'small';
 if(e<.60)return 'round';
 if(e<.86)return 'wide';
 return 'open';
};
const talking=(who:Identity,frame:number,_fallback:boolean)=>mouthEnergy(who,frame)>.11;
const stroke={stroke:K.ink,strokeWidth:6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};

const Figure:React.FC<{who:Identity;x:number;y:number;scale?:number;emotion?:Emotion;speak?:boolean;act?:'hold'|'look'|'point'|'flail'|'cross'|'laugh'|'show';tilt?:number;energy?:number}> =({who,x,y,scale=1,emotion='blank',speak=false,act='look',tilt=0,energy=0})=>{
 const f=useCurrentFrame(),sol=who==='sol',wave=Math.sin(f*.27),breath=Math.sin(f*.14)*2.5;
 const isShock=emotion==='shock',angry=emotion==='mad',happy=emotion==='soft'||emotion==='laugh';
 const headTurn=(emotion==='curious'?7:angry?-10:happy?5:0)+Math.sin(f*.12)*1.5;
 const actionStart=act==='flail'?(who==='dex'?20:305):act==='point'?210:act==='cross'?405:act==='laugh'?467:act==='show'?213:0;
 const actionEase=actionStart===0?1:ease(Math.max(0,Math.min(1,(f-actionStart)/10)));
 const eventBounce=emotion==='shock'?Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,(f-(who==='dex'?20:305))/20)))):emotion==='laugh'?Math.abs(Math.sin((f-464)*.29))*.7:Math.abs(Math.sin(f*.17))*.14;
 const jump=energy>0?eventBounce*energy:0;
 const eyey=emotion==='shock'?-2:2;
 const eyeDart=(emotion==='curious'&&f%47>30)?5:(emotion==='shock'?-4:0);
 const impact=(emotion==='shock'&&energy>0)?1+.025*Math.sin(f*.9):1;
 const pose=speak?mouthPose(who,f):'closed';
 const mouthLevel=mouthEnergy(who,f);
 const talkNod=mouthLevel>0.12?Math.sin(f*.43)*Math.min(3,3*mouthLevel):0;
 const leftHand=act==='flail'?[-145,-134+wave*27]:act==='cross'?[75,66]:act==='laugh'?[-130,45+wave*24]:[-90,68];
 const rightHand=act==='point'?[224,-47+wave*5]:act==='flail'?[161,-141-wave*32]:act==='cross'?[-75,66]:act==='show'?[144,-70]:act==='laugh'?[137,47-wave*27]:[100,76];
 const baseL:[number,number]=[-92,76],baseR:[number,number]=[101,78];
 const lx=baseL[0]+(leftHand[0]-baseL[0])*actionEase;
 const ly=baseL[1]+(leftHand[1]-baseL[1])*actionEase;
 const rx=baseR[0]+(rightHand[0]-baseR[0])*actionEase;
 const ry=baseR[1]+(rightHand[1]-baseR[1])*actionEase;
 // A single square or oval head; fixed identity in every shot.
 return <g transform={'translate('+x+' '+(y+breath-jump)+') rotate('+(tilt+Math.sin(f*.18)*energy*.10)+') scale('+(scale*impact)+' '+(scale/impact)+')'}>
  <ellipse cx="0" cy="240" rx="94" ry="12" fill={K.ink} opacity=".12"/>
  <g fill="none" stroke={K.ink} strokeWidth="18" strokeLinecap="round"><path d="M-35 115 Q-48 169 -45 225 M34 115 Q42 169 49 225"/><path d="M-73 224 h49 M32 224 h48" strokeWidth="10"/></g>
  <path d="M-80 -12 Q-100 30 -88 119 Q0 135 91 120 Q104 37 77 -12 Z" fill={sol?K.blue:K.navy} {...stroke}/>
  {sol&&<path d="M0 9 V109" stroke="#0C4DAF" strokeWidth="5" opacity=".45"/>}
  {/* Limb paths use broad arcs with restrained motion; wrists end at meaningful action targets. */}
  <g fill="none" stroke={K.ink} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
   <path d={'M-83 4 Q-143 57 '+lx+' '+ly}/>
   <path d={'M81 4 Q143 36 '+rx+' '+ry}/>
  </g>
  <g stroke={K.ink} strokeWidth="4" fill={K.ivory}><ellipse cx={lx} cy={ly} rx="11" ry="9"/><ellipse cx={rx} cy={ry} rx="11" ry="9"/></g>
  <g transform={'translate(0 '+talkNod+') rotate('+headTurn+' 0 -95)'}>
   {sol?<><path d="M-93 -218 C-96 -282 81 -285 103 -220 C122 -141 91 -64 8 -57 C-88 -51 -122 -135 -93 -218Z" fill={K.ivory} {...stroke}/><path d="M-13 -274 l-9 -20 M12 -276 l7 -25" {...stroke} fill="none" strokeWidth="5"/></>:
      <path d="M-102 -245 Q-53 -277 72 -264 Q115 -239 104 -188 L98 -117 Q72 -70 -1 -72 Q-84 -70 -104 -128 Q-122 -197 -102 -245Z" fill={K.ivory} {...stroke}/>}
   <g stroke={K.ink} strokeWidth={angry?8:6} strokeLinecap="round">
    <path d={angry?'M-59 -222 l37 13':isShock?'M-67 -229 l38 -18':'M-59 -220 l36 -4'}/>
    <path d={angry?'M25 -210 l37 -13':isShock?'M24 -247 l40 19':'M26 -224 l35 5'}/>
   </g>
   {f%(sol?106:82)<3?<g stroke={K.ink} strokeWidth="5"><path d="M-56 -186 h27 M27 -186 h27"/></g>:<g fill={K.ink}><ellipse cx={-42+eyeDart} cy={-185+eyey} rx={isShock?7:5} ry={isShock?14:8}/><ellipse cx={42+eyeDart} cy={-185+eyey} rx={isShock?7:5} ry={isShock?14:8}/></g>}
   {pose!=='closed'?
    (pose==='wide'?<path d="M-25 -136 Q0 -113 25 -136 Q5 -107 -20 -124 Z" fill={K.ink}/>:
     pose==='round'?<ellipse cx="0" cy="-130" rx="13" ry={7+11*mouthLevel} fill={K.ink}/>:
     pose==='small'?<ellipse cx="0" cy="-130" rx="10" ry="5" fill={K.ink}/>:
     <ellipse cx="0" cy="-130" rx="17" ry={8+16*mouthLevel} fill={K.ink}/>)
   :emotion==='laugh'?<path d="M-30 -137 Q0 -81 31 -137 Z" fill={K.ink}/>
   :isShock?<ellipse cx="0" cy="-133" rx="17" ry="24" fill={K.ink}/>
   :angry?<path d="M-19 -123 Q0 -145 19 -123" {...stroke} fill="none"/>
   :happy?<path d="M-21 -138 Q0 -112 22 -138" {...stroke} fill="none"/>
   :<path d="M-15 -131 h29" {...stroke} fill="none" strokeWidth="4"/>}
  </g>
 </g>;
};


const Checkout:React.FC<{f:number;price?:boolean;alert?:boolean;x?:number;y?:number;scale?:number}> =({f,price=false,alert=false,x=705,y=1035,scale=1})=>{
 const pop=price?Math.min(1,Math.max(0,(f-207)/8)):0;
 const wobble=alert?Math.sin(f*.72)*5:0;
 return <g transform={'translate('+x+' '+y+') scale('+scale+')'}>
  <path d="M-158 -16 H158 L180 265 H-184 Z" fill="#DCE4F2" {...stroke}/>
  <path d="M-122 24 H116 L135 150 H-143 Z" fill="#F2F6FF" stroke={K.ink} strokeWidth="5"/>
  <rect x="-109" y="-285" width="222" height="276" rx="20" fill={K.navy} stroke={K.ink} strokeWidth="7" transform={'rotate('+wobble+' 0 -45)'}/>
  <rect x="-96" y="-268" width="194" height="236" rx="13" fill={alert?'#FFE3E1':'#EAF1FF'} stroke={K.ink} strokeWidth="3" transform={'rotate('+wobble+' 0 -45)'}/>
  {price?<g fontFamily="Arial" fontWeight="900" textAnchor="middle">
   <text x="0" y="-218" fontSize="27" fill={K.ink}>ITEM VALUE</text>
   <text x="0" y="-114" fontSize={alert?40:79} fill={alert?K.red:K.blue}>{alert?'ERROR':'$0.99'}</text>
   <text x="0" y="-64" fontSize={alert?22:20} fill={K.ink}>{alert?'RETURN REQUESTED':'PRICE VERIFIED'}</text>
  </g>:<g fontFamily="Arial" fontWeight="900" textAnchor="middle"><text x="0" y="-174" fill={K.blue} fontSize="31">SELF</text><text x="0" y="-135" fill={K.blue} fontSize="31">CHECKOUT</text></g>}
  <rect x="-75" y="168" width="150" height="42" rx="12" fill={K.ink}/>
  <rect x="-56" y="179" width="112" height="18" rx="8" fill={alert?K.red:K.blue}/>
  {f>185&&f<205&&<g fill="none" stroke={K.blue} strokeWidth="9"><path d="M-78 -330 l-35 -32 M0 -339 v-42 M78 -327 l35 -34"/></g>}
 </g>;
};
const Receipt:React.FC<{f:number}> =({f})=>{
 const down=anim(f,422,453,-185,0);
 return <g transform={'translate(759 '+(1220+down)+') rotate('+Math.sin(f*.13)*3+')'}>
  <path d="M-77 0 H76 V211 l-18 -12 -17 12 -18 -12 -18 12 -18 -12 -19 12 -17 -12 -18 12 Z" fill={K.ivory} stroke={K.ink} strokeWidth="5"/>
  <g fontFamily="Arial" fontWeight="900" textAnchor="middle" fill={K.ink}><text y="45" fontSize="24">RETURN</text><text y="82" fontSize="25">SOL</text><text y="118" fontSize="19">REJECTED</text><path d="M-52 145 H52" stroke={K.ink} strokeWidth="4"/><text y="178" fontSize="15">NO RECEIPT</text></g>
 </g>;
};
const Label:React.FC<{text:string;small?:boolean}> =({text,small=false})=><div style={{position:'absolute',bottom:176,left:55,right:55,fontFamily:'Arial,sans-serif',fontWeight:900,fontSize:small?43:58,lineHeight:1.08,textAlign:'center',color:K.blue,textShadow:'2px 2px 0 white,-2px -2px 0 white'}}>{text}</div>;
const lines=[
 {who:'dex' as Identity,start:28,end:99,text:'Why are you scanning yourself?!'},
 {who:'sol' as Identity,start:112,end:199,text:"I wanna know what I'm worth."},
 {who:'dex' as Identity,start:233,end:291,text:'Ninety-nine cents.'},
 {who:'sol' as Identity,start:312,end:396,text:"I'm a LIMITED EDITION!"},
 {who:'dex' as Identity,start:452,end:535,text:'Even the machine wants a refund!'}
];
export const SoleDealsCheckout:React.FC=()=>{
 const f=useCurrentFrame();
 const scene=f<105?0:f<208?1:f<303?2:f<410?3:4;
 const active=lines.find(l=>f>=l.start&&f<=l.end);
 const solScan=anim(f,15,45,470,580);
 const solFall=anim(f,449,489,1100,1360);
 const punch=scene===2?Math.max(0,Math.sin(Math.PI*Math.min(1,(f-208)/20))):0;
 const quake=f>408&&f<431?Math.sin(f*1.2)*12:0;
 return <AbsoluteFill style={{background:K.ivory,overflow:'hidden'}}>
  {timings.enabled&&voiceClips.map(c=><Sequence key={c.id} from={c.startFrame} durationInFrames={c.durationFrames}><Audio src={staticFile('checkout-voice/'+c.filename)}/></Sequence>)}
  <div style={{position:'absolute',top:57,left:52,right:52,fontFamily:'Arial,sans-serif',fontSize:49,lineHeight:1.14,fontWeight:900,textAlign:'center',letterSpacing:-1.1,color:K.ink}}>WHEN I ASK MY FRIEND<br/>WHAT I’M WORTH...</div>
  <div style={{position:'absolute',top:205,left:0,right:0,fontFamily:'Arial,sans-serif',fontSize:21,fontWeight:900,textAlign:'center',letterSpacing:3.5,color:K.blue}}>SOLEDEALS ORIGINALS</div>
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
   <path d="M70 1425 H1010" stroke="#DADDE3" strokeWidth="7"/>
   <g transform={'translate('+quake+' 0)'}>
   {scene===0&&<>
    <Checkout f={f} x={737} y={1045}/>
    <Figure who="sol" x={solScan} y={1108} scale={1.12} emotion="curious" act="look" tilt={anim(f,12,44,0,26)} speak={false} energy={3}/>
    <Figure who="dex" x={208} y={1110} scale={1.2} emotion={f<26?'curious':'shock'} act={f>28?'flail':'look'} speak={talking('dex',f,false)} energy={f<48?10:2}/>
    {f>52&&f<86&&<g stroke={K.blue} strokeWidth="7" fill="none"><path d="M619 766 l-32 -35 M650 741 l1 -37"/></g>}
   </>}
   {scene===1&&<>
    <Checkout f={f} x={802} y={1090} scale={1.0}/>
    <Figure who="sol" x={401} y={1160} scale={1.45} emotion="soft" act="point" speak={talking('sol',f,false)} tilt={-6+Math.sin(f*.1)*3}/>
    <Figure who="dex" x={936} y={1215} scale={.66} emotion="blank" act="cross" tilt={10}/>
   </>}
   {scene===2&&<>
    <Checkout f={f} price x={687} y={1062} scale={1.55+punch*.06}/>
    <Figure who="dex" x={229} y={1165} scale={1.26} emotion="curious" act="show" speak={talking('dex',f,false)} tilt={f>248?-9:8}/>
    {f>=209&&f<232&&<g stroke={K.blue} strokeWidth="10"><path d="M850 459 l51 -46 M810 438 v-61 M763 451 l-39 -46"/></g>}
   </>}
   {scene===3&&<>
    <Checkout f={f} price x={830} y={1104} scale={.97}/>
    <Figure who="sol" x={345} y={1113-Math.max(0,Math.sin(Math.PI*Math.min(1,(f-304)/22)))*128} scale={1.61} emotion="mad" act="flail" speak={talking('sol',f,false)} tilt={Math.sin((f-303)*.19)*13} energy={17}/>
    <Figure who="dex" x={894} y={1189} scale={.76} emotion="curious" act="cross" tilt={12}/>
   </>}
   {scene===4&&<>
    <Checkout f={f} price alert={f>=422} x={600} y={1088} scale={1.11}/>
    {f>420&&<Receipt f={f}/>}
    <Figure who="sol" x={245} y={solFall} scale={1.07} emotion={f>455?'shock':'mad'} act={f>455?'flail':'cross'} tilt={anim(f,450,481,-10,-85)} energy={f<456?5:0}/>
    <Figure who="dex" x={894} y={1110} scale={1.05} emotion={f>467?'laugh':'curious'} act={f>467?'laugh':'show'} speak={talking('dex',f,false)} tilt={f>468?Math.sin(f*.3)*9:7} energy={f>467?14:0}/>
   </>}
   </g>
  </svg>
  {active&&<Label text={active.text} small={active.text.length>31}/>}
  {scene===4&&f>425&&f<454&&<Label text="RETURN REQUESTED!" />}
  {scene===4&&f>510&&<div style={{position:'absolute',bottom:262,left:0,right:0,fontFamily:'Arial',textAlign:'center',fontSize:48,fontWeight:900,color:K.red}}>NO REFUNDS.</div>}
  <div style={{position:'absolute',bottom:68,left:0,right:0,color:K.blue,textAlign:'center',fontFamily:'Arial',fontWeight:900,fontSize:27,letterSpacing:5}}>SOL & DEX</div>
 </AbsoluteFill>;
};
