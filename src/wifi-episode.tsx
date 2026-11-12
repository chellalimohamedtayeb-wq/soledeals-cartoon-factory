import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Reusable original Sol and Dex vector characters.
 * This preview uses animated poses and text timing; studio-quality voice recordings
 * should be added as separate audio files before production/publication.
 */
const INK = '#202532';
const BLUE = '#1767ED';
const IVORY = '#FBF9F3';
type Character = 'sol' | 'dex';
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Face: React.FC<{who: Character; emotion?: 'normal'|'happy'|'shock'|'angry'|'laugh'|'confused'; speaking?: boolean; frame: number}> = ({who,emotion='normal',speaking=false,frame}) => {
  const sol = who === 'sol';
  const blink = frame % (sol?113:79) < 4;
  const open = speaking ? (Math.sin(frame*1.25)>0 ? 12:4): 2;
  return <svg width="100%" height="100%" viewBox="0 0 320 440" style={{overflow:'visible'}}>
    <g stroke={INK} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      {sol ? <>
        <path d="M98 267 Q80 220 98 195 Q95 150 132 144 L183 145 Q229 155 223 204 L209 267 Z" fill={BLUE}/>
        <path d="M107 200 C73 196 57 251 63 280" fill="none" strokeWidth="13"/>
        <path d="M208 198 C236 191 250 252 241 282" fill="none" strokeWidth="13"/>
        <path d="M131 267 L123 331 M181 267 L192 331" fill="none" strokeWidth="15"/>
        <path d="M146 142 Q137 128 143 108 M159 142 Q171 117 165 102" fill="none" strokeWidth="6"/>
        <path d="M87 73 Q89 11 148 19 Q222 12 233 90 Q238 157 180 184 Q114 201 88 139 Q78 115 87 73" fill={IVORY}/>
      </>:<>
        <path d="M98 268 Q81 220 101 188 L212 188 Q239 233 221 271 Z" fill="#444C5D"/>
        <path d="M100 199 Q68 201 51 252 M211 198 Q248 200 266 240" fill="none" strokeWidth="14"/>
        <path d="M134 266 L116 331 M190 267 L208 331" fill="none" strokeWidth="17"/>
        <path d="M87 43 Q114 11 209 25 Q244 36 242 79 L233 153 Q222 190 157 195 Q94 193 81 153 Q66 93 87 43" fill={IVORY}/>
      </>}
      {emotion==='shock' ? <>
        <ellipse cx="126" cy="95" rx="15" ry="23" fill="white"/><ellipse cx="190" cy="95" rx="15" ry="23" fill="white"/>
        <circle cx="126" cy="98" r="5" fill={INK}/><circle cx="190" cy="98" r="5" fill={INK}/>
      </> : <>
        <path d={blink?'M113 98 H139':'M122 91 l0 8'} strokeWidth="6"/>
        <path d={blink?'M180 98 H206':'M193 91 l0 8'} strokeWidth="6"/>
      </>}
      {(!sol || emotion==='angry'||emotion==='confused') && <><path d={emotion==='angry'?'M107 73 l34 7':'M108 73 l29 -6'}/><path d={emotion==='angry'?'M182 80 l31 -7':'M177 67 l33 6'}/></>}
      {emotion==='happy'||emotion==='laugh' ? <path d="M137 129 Q158 158 181 129" fill="none"/> :
       emotion==='shock' ? <ellipse cx="157" cy="136" rx="15" ry="22" fill={INK}/> :
       speaking ? <ellipse cx="158" cy="136" rx="16" ry={open} fill={INK}/> :
       emotion==='angry' ? <path d="M139 151 Q157 134 178 151" fill="none"/> :
       <path d="M143 136 Q158 141 172 136" fill="none"/>}
    </g>
  </svg>;
};

const Actor: React.FC<{who: Character; x: number; y: number; scale?: number; emotion?: 'normal'|'happy'|'shock'|'angry'|'laugh'|'confused'; speaking?: boolean; bounce?:number; angle?:number}> = ({who,x,y,scale=1,emotion='normal',speaking=false,bounce=0,angle=0})=>{
 const f=useCurrentFrame();
 const hop=Math.sin(f*0.55)*bounce;
 return <div style={{position:'absolute',left:x,top:y,width:360,height:490,transform:`translateY(${hop}px) rotate(${angle}deg) scale(${scale})`,transformOrigin:'center bottom'}}>
   <Face who={who} emotion={emotion} speaking={speaking} frame={f}/>
 </div>;
};

const Router:React.FC<{x:number;y:number;scale?:number;heart?:boolean;shake?:boolean}> = ({x,y,scale=1,heart=false,shake=false})=>{
 const f=useCurrentFrame();const j=shake?Math.sin(f*3)*8:0;
 return <div style={{position:'absolute',left:x+j,top:y,width:200,height:190,transform:`scale(${scale})`}}>
  <svg viewBox="0 0 200 190" width="100%" height="100%">
   <g fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round">
    <path d="M43 99 L31 23 M155 99 L170 23"/>
    <rect x="15" y="87" width="171" height="73" rx="16" fill="#EDF1FB"/>
    <path d="M45 124 h39"/>
   </g>
   <circle cx="148" cy="124" r="9" fill={BLUE} opacity={f%24<16?1:.3}/>
   {heart ? <path d="M99 43 C79 18 55 54 99 80 C143 55 121 18 99 43Z" fill={BLUE}/> : <path d="M76 63 Q99 40 123 63 M87 75 Q99 63 111 75" stroke={BLUE} strokeWidth="5" fill="none"/>}
  </svg>
 </div>;
};
const Subtitle:React.FC<{text:string}> = ({text})=><div style={{position:'absolute',bottom:210,left:80,width:920,textAlign:'center',fontWeight:800,fontFamily:'Arial, sans-serif',fontSize:54,color:INK,textShadow:'3px 3px 0 white, -3px -3px 0 white',lineHeight:1.15}}>{text}</div>;
const Timeline:React.FC = ()=> {
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const scene=f<105?0:f<245?1:f<355?2:f<485?3:4;
 const enter=spring({fps,frame:f,config:{damping:14,mass:.6}});
 const shove=interpolate(f,[355,365,380],[0,-80,20],clamp);
 const background= <AbsoluteFill style={{backgroundColor:IVORY}}>
  <div style={{position:'absolute',top:95,left:80,fontSize:23,color:BLUE,fontWeight:900,fontFamily:'Arial'}}>SOLEDEALS MINI COMEDY</div>
  <div style={{position:'absolute',left:60,right:60,top:1410,height:5,backgroundColor:'#DBDDE2'}}/>
 </AbsoluteFill>;
 return <AbsoluteFill>{background}
  {scene===0&&<>
    <Actor who="sol" x={210} y={700} scale={1.2} emotion="happy" bounce={5} angle={-6}/>
    <Router x={385} y={1090} scale={1.08} heart/>
    <Actor who="dex" x={630} y={720} scale={1} emotion="shock" speaking={f>40&&f<103} angle={Math.sin(f/9)*2}/>
    {f>35&&<Subtitle text="Why are you hugging the router?!"/>}
  </>}
  {scene===1&&<>
    <Actor who="sol" x={260} y={710} scale={1.35} emotion="happy" speaking={f>130&&f<240} bounce={3}/>
    <Router x={485} y={1100} scale={1.05} heart/>
    <Actor who="dex" x={740} y={825} scale={.75} emotion="confused"/>
    {f>128&&<Subtitle text="My therapist said I need a stronger connection."/>}
  </>}
  {scene===2&&<>
    <Actor who="dex" x={260} y={660} scale={1.25} emotion="confused" speaking={f>272&&f<349}/>
    <div style={{position:'absolute',left:520,top:920,width:355,height:265,backgroundColor:'#E8EEFD',border:`7px solid ${INK}`,borderRadius:34,transform:'rotate(-6deg)',padding:24,textAlign:'center',fontFamily:'Arial',fontWeight:900,fontSize:40,color:INK}}>
     Wi-Fi<br/><span style={{color:BLUE,fontSize:46}}>12 devices</span><br/>connected
    </div>
    {f>270&&<Subtitle text="It's connected to twelve other devices."/>}
  </>}
  {scene===3&&<>
    <Actor who="sol" x={135+shove} y={675} scale={1.65} emotion={f<373?'shock':'angry'} speaking={f>390&&f<476} bounce={f>365?12:0}/>
    <Router x={795} y={1100} scale={.85} shake={f>380}/>
    <Subtitle text={f<397?'TWELVE?!':'I THOUGHT WE WERE EXCLUSIVE!'}/>
  </>}
  {scene===4&&<>
    <Actor who="sol" x={130} y={780} scale={1.18} emotion="angry" angle={-13}/>
    <Router x={420} y={1160} heart shake/>
    <Actor who="dex" x={670} y={780} scale={1.05} emotion="laugh" bounce={19} angle={11}/>
    <Subtitle text="...awkward Wi-Fi silence."/>
  </>}
  <div style={{position:'absolute',bottom:85,width:'100%',fontFamily:'Arial',color:BLUE,letterSpacing:5,fontWeight:700,fontSize:25,textAlign:'center'}}>SOL & DEX</div>
 </AbsoluteFill>;
};
export const WifiEpisode:React.FC = ()=> <Timeline/>;
