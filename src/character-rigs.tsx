import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';

/**
 * Sol & Dex reusable jointed 2D puppet rigs.
 * Each arm has a shoulder, elbow and moving hand target;
 * each leg has hip, knee and ankle, and the head pivots independently.
 * Original ink/ivory/cobalt visual identity preserved. No external assets.
 */
const ink='#202532',paper='#FBF9F3',blue='#1767ED',grey='#434B5B';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
type Feeling='warm'|'doubt'|'surprise'|'jealous'|'laugh'|'sulk'|'deadpan';
type ArmMode='hug'|'accuse'|'flail'|'cross'|'normal'|'shock'|'phone'|'laugh'|'facepalm';
type Character='sol'|'dex';
type Point={x:number;y:number};
type PuppetProps={x:number;y:number;s?:number;rot?:number;emotion:Feeling;mouth?:boolean;arms?:ArmMode;bounce?:number;hug?:boolean;holdingRouter?:boolean;startle?:number;eyeDirection?:number};
const line={fill:'none',stroke:ink,strokeWidth:18,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
const transform=(p:Point)=>'translate('+p.x+' '+p.y+')';
const q=(f:number,a:number,b:number,v:number,w:number)=>interpolate(f,[a,b],[v,w],clamp);
const bone=(a:Point,b:Point,j:Point)=>'M'+a.x+' '+a.y+' Q'+j.x+' '+j.y+' '+b.x+' '+b.y;
const joint=(a:Point,b:Point,bend:number):Point=>{
 const dx=b.x-a.x,dy=b.y-a.y,dist=Math.max(1,Math.hypot(dx,dy));
 return{x:(a.x+b.x)/2-dy/dist*bend,y:(a.y+b.y)/2+dx/dist*bend};
};
const Segment:React.FC<{a:Point;b:Point;bend:number;weight?:number;hand?:boolean}> =({a,b,bend,weight=18,hand=true})=>{
 const j=joint(a,b,bend);
 return <g {...line} strokeWidth={weight}>
   <path d={bone(a,b,j)}/>
   <circle cx={j.x} cy={j.y} r={weight*.43} fill={paper} stroke={ink} strokeWidth="5"/>
   {hand&&<ellipse cx={b.x} cy={b.y} rx="13" ry="10" fill={paper} stroke={ink} strokeWidth="5"/>}
 </g>;
};
const HeldRouter:React.FC<{f:number;startle:number}> = ({f,startle}) => {
 const pulse=Math.sin(f*.24),vibration=Math.sin(f*1.25)*(startle>0?startle*3:0);
 return <g transform={'translate('+(75+vibration)+' '+(95+pulse*2)+') rotate('+Math.sin(f*.11)*2+')'}>
  <ellipse cy="37" rx="118" ry="14" fill={ink} opacity=".08"/>
  <g stroke={ink} strokeWidth="7" fill="none" strokeLinecap="round">
   <path d={'M-66 -39 L'+(-77+pulse*3)+' -150 M69 -39 L'+(76-pulse*4)+' -151'}/>
  </g>
  <rect x="-113" y="-46" width="227" height="108" rx="22" fill="#E7EFFC" stroke={ink} strokeWidth="8"/>
  <path d="M-75 10 H-2" stroke={ink} strokeWidth="6" strokeLinecap="round"/>
  <circle cx="75" cy="12" r="11" fill={blue} opacity={f%29<20?1:.3}/>
  <path d={'M-33 -93 Q0 '+(-122+pulse*7)+' 31 -93'} stroke={blue} strokeWidth="6" fill="none" strokeLinecap="round"/>
  <path d="M-25 66 L-35 80 M82 65 L91 81" stroke={ink} strokeWidth="8" strokeLinecap="round"/>
 </g>;
};
const Torso:React.FC<{who:Character}> =({who})=><g>
 <path d={who==='sol'?'M-78 -22 Q-101 30 -88 129 Q3 150 93 126 Q110 25 72 -22 Z':'M-91 -30 Q-110 54 -89 127 Q-2 148 95 126 Q103 41 83 -32 Z'} fill={who==='sol'?blue:grey} stroke={ink} strokeWidth="8" strokeLinejoin="round"/>
 {who==='sol'&&<path d="M-4 20 L-4 117" stroke="#0946AF" strokeWidth="7" opacity=".5"/>}
 {who==='dex'&&<path d="M89 20 L105 33" stroke={blue} strokeWidth="13"/>}
 </g>;
const Head:React.FC<{who:Character;emotion:Feeling;mouth?:boolean;frame:number}> =({who,emotion,mouth=false,frame})=>{
 const sol=who==='sol',blink=frame%(sol?103:89)<3,shock=emotion==='surprise',angry=emotion==='jealous'||emotion==='sulk',laugh=emotion==='laugh',happ=emotion==='warm';
 const brow=angry?'M-65 -225 L-22 -208 M28 -208 L71 -228':shock?'M-68 -246 L-25 -261 M29 -259 L73 -246':'M-69 -231 L-23 -235 M27 -235 L71 -228';
 const headTilt=sol ? (happ?-10:angry?11:shock?-13:0) : (laugh?17:shock?-12:emotion==='doubt'?9:0);
 const bob=(mouth?Math.sin(frame*.9)*2:Math.sin(frame*.2)*1.5);
 const gaze=shock?Math.sin(frame*.21)*3:emotion==='doubt'?5:0;
 return <g transform={'translate(0 '+bob+') rotate('+headTilt+' 0 -90)'}>
  {sol?<><path d="M-106 -223 C-104 -321 61 -312 107 -235 C139 -157 103 -64 13 -59 C-80 -55 -128 -127 -106 -223Z" fill={paper} stroke={ink} strokeWidth="8"/><path d="M-20 -296 Q-32 -320 -17 -332 M2 -294 Q20 -314 11 -338" {...line} strokeWidth="6"/></>:<path d="M-106 -258 Q-62 -300 78 -276 Q126 -249 112 -191 L102 -114 Q78 -75 -7 -78 Q-94 -74 -111 -135 Q-131 -207 -106 -258Z" fill={paper} stroke={ink} strokeWidth="8"/>}
  <path d={brow} {...line} strokeWidth="7"/>
  {blink?<g {...line} strokeWidth="5"><path d="M-65 -192 H-25 M26 -192 H65"/></g>:shock?<g fill="#fff" stroke={ink} strokeWidth="5"><ellipse cx="-44" cy="-191" rx="21" ry="29"/><ellipse cx="44" cy="-191" rx="21" ry="29"/><circle cx="-39" cy="-185" r="6" fill={ink}/><circle cx="39" cy="-185" r="6" fill={ink}/></g>:<g fill={ink}><ellipse cx="-44" cy="-193" rx="6" ry="11" transform={"translate("+gaze+" 0)"}/><ellipse cx="43" cy="-193" rx="6" ry="11" transform={"translate("+gaze+" 0)"}/></g>}
  {mouth?<ellipse cx="0" cy="-129" rx={shock?19:15} ry={7+14*Math.abs(Math.sin(frame*.83))} fill={ink}/>:laugh?<path d="M-29 -154 Q0 -85 35 -154Z" fill={ink}/>:shock?<ellipse cx="0" cy="-129" rx="21" ry="28" fill={ink}/>:happ?<path d="M-28 -133 Q0 -106 27 -131" {...line} strokeWidth="6"/>:angry?<path d="M-23 -117 Q0 -147 28 -118" {...line} strokeWidth="7"/>:<path d="M-20 -135 Q1 -143 23 -135" {...line} strokeWidth="6"/>}
  </g>;
};
const Puppet:React.FC<PuppetProps&{who:Character}> =({who,x,y,s=1,rot=0,emotion,mouth=false,arms='normal',bounce=0,hug=false,holdingRouter=false,startle=0,eyeDirection=0})=>{
 const f=useCurrentFrame(),sol=who==='sol',wobble=Math.sin(f*.22)*bounce;
 const breath=Math.sin(f*.13)*2.3;
 const squish=emotion==='surprise'?1+0.035*Math.sin(f*.45):1;
 const step=arms==='shock'?Math.sin(f*.68)*18:arms==='laugh'?Math.sin(f*.5)*23:arms==='flail'?Math.sin(f*.8)*25:3*Math.sin(f*.12);
 const shake=emotion==='surprise'?Math.sin(f*1.1)*(3+startle*3):0;
 const bodyLean=arms==='hug'?Math.sin(f*.21)*2.2:emotion==='laugh'?Math.sin(f*.44)*4:0;
 const leftShoulder={x:-84,y:10},rightShoulder={x:86,y:10};
 const target= (side:'l'|'r'):Point=>{
   const sign=side==='l'?-1:1;
   const wave=Math.sin(f*(arms==='flail'?1.1:.43)+(side==='l'?0:1.1));
   if(arms==='hug'||hug)return side==='l'?{x:-30+wave*3,y:130+wave*3}:{x:170-wave*4,y:118+wave*2};
   if(arms==='flail'||arms==='shock')return {x:sign*(171+wave*13),y:-120+wave*38};
   if(arms==='accuse')return side==='r'?{x:227,y:-74+wave*6}:{x:-127,y:81};
   if(arms==='cross')return side==='l'?{x:69,y:59}:{x:-68,y:52};
   if(arms==='facepalm')return side==='r'?{x:17,y:-186}:{x:-120,y:110};
   if(arms==='phone')return side==='r'?{x:148,y:-112}:{x:-118,y:111};
   if(arms==='laugh')return{ x:sign*85+wave*10,y:114+wave*22};
   return {x:sign*125,y:122+wave*6};
 };
 const left=target('l'),right=target('r');
 const leg=(sign:number)=>{const hip={x:sign*41,y:118},ankle={x:sign*(57+step*.2),y:235-Math.max(0,sign*step*.5)};return <g key={sign}><Segment a={hip} b={ankle} bend={sign*(25+step*.3)} weight={21} hand={false}/><path d={'M'+(ankle.x-25)+' '+(ankle.y+8)+' Q'+ankle.x+' '+(ankle.y+17)+' '+(ankle.x+28)+' '+(ankle.y+8)} fill="none" stroke={ink} strokeWidth="12" strokeLinecap="round"/></g>;};
 return <g transform={'translate('+x+' '+(y+wobble+breath)+') rotate('+(rot+shake+bodyLean)+') scale('+s*squish+' '+s/squish+')'}>
  <ellipse cx="0" cy="254" rx="93" ry="12" fill={ink} opacity=".10"/>
  {leg(-1)}{leg(1)}
  <Torso who={who}/>
  {holdingRouter&&who==='sol'&&<HeldRouter f={f} startle={startle}/>}
  {/* Arms and wrists are drawn over held objects, so the grasp stays attached to the body */}
  <Segment a={leftShoulder} b={left} bend={arms==='hug'||hug?-44:arms==='cross'?22:-35} weight={20}/>
  <Segment a={rightShoulder} b={right} bend={arms==='hug'||hug?52:arms==='cross'?-20:36} weight={20}/>
  <Head who={who} emotion={emotion} mouth={mouth} frame={f}/>
 </g>;
};
export const RigSol:React.FC<PuppetProps>=(p)=><Puppet {...p} who="sol"/>;
export const RigDex:React.FC<PuppetProps>=(p)=><Puppet {...p} who="dex"/>;
