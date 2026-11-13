import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import voiceTiming from './voice-timing.generated.json';

/**
 * Reusable original Sol and Dex vector characters.
 * This preview uses animated poses and text timing; studio-quality voice recordings
 * should be added as separate audio files before production/publication.
 */
const INK = '#202532';
const BLUE = '#1767ED';
const IVORY = '#FBF9F3';
type Character = 'sol' | 'dex';
type VoiceClip = {id:string;who:'sol'|'dex';text:string;startFrame:number;durationFrames:number;filename:string;characters:{char:string;startFrame:number;endFrame:number}[]};
const voiceClips = (voiceTiming.clips as VoiceClip[]);
const speakingFromVoice = (who: Character, frame: number) =>
 voiceClips.some(clip=>clip.who===who && clip.characters.some(c=>/\S/.test(c.char) && frame>=c.startFrame && frame<c.endFrame));
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


type Emotion = 'normal'|'happy'|'shock'|'angry'|'laugh'|'confused';
const Actor: React.FC<{who:Character;x:number;y:number;scale?:number;emotion?:Emotion;speaking?:boolean;bounce?:number;angle?:number; lean?:number; arm?:'point'|'facepalm'|'fold'|'flail'|'hug'|'laugh'|'none'}> = ({who,x,y,scale=1,emotion='normal',speaking=false,bounce=0,angle=0,lean=0,arm='none'})=>{
 const frame=useCurrentFrame();
 const hop=Math.sin(frame*0.48)*bounce;
 const flutter=Math.sin(frame*.8)*10;
 return <div style={{position:'absolute',left:x,top:y,width:360,height:490,transform:'translateY('+hop+'px) translateX('+lean+'px) rotate('+angle+'deg) scale('+scale+')',transformOrigin:'center 78%'}}>
  <Face who={who} emotion={emotion} speaking={voiceTiming.enabled?speakingFromVoice(who,frame):speaking} frame={frame}/>
  {arm!=='none'&&<svg viewBox="0 0 360 490" style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible',pointerEvents:'none'}}>
    <g stroke={INK} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {arm==='point'&&<><path d="M219 212 Q265 165 315 156"/><path d="M313 155 l-10 -25 M313 155 l-3 25"/></>}
      {arm==='flail'&&<><path d={'M100 210 Q55 '+(128+flutter)+' 28 98'}/><path d={'M211 210 Q255 '+(100-flutter)+' 299 80'}/></>}
      {arm==='facepalm'&&<><path d="M215 207 Q243 157 181 101"/><path d="M162 102 L190 92" strokeWidth="22"/></>}
      {arm==='fold'&&<><path d="M104 209 Q151 270 205 221"/><path d="M217 203 Q164 275 107 226"/></>}
      {arm==='laugh'&&<><path d={'M103 208 Q53 '+(271+flutter)+' 123 272'}/><path d={'M210 209 Q255 '+(263-flutter)+' 184 283'}/></>}
    </g>
  </svg>}
 </div>;
};

const Router:React.FC<{x:number;y:number;scale?:number;heart?:boolean;shake?:boolean;skitter?:number;scared?:boolean}> = ({x,y,scale=1,heart=false,shake=false,skitter=0,scared=false})=>{
 const frame=useCurrentFrame();const wiggle=shake?Math.sin(frame*1.9)*11:0;
 return <div style={{position:'absolute',left:x+skitter+wiggle,top:y,width:220,height:200,transform:'rotate('+Math.sin(frame*.15)*(shake?6:2)+'deg) scale('+scale+')',transformOrigin:'center bottom'}}>
  <svg viewBox="0 0 220 200" width="100%" height="100%" style={{overflow:'visible'}}>
    <g stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={'M46 97 l'+(Math.sin(frame*.25)*7-11)+' -72'}/>
      <path d={'M166 97 l'+(Math.sin(frame*.25+1)*7+11)+' -72'}/>
      <path d="M16 105 Q16 88 35 88 H184 Q202 88 202 105 V150 Q202 165 182 165 H35 Q16 165 16 150Z" fill="#E9EFFA"/>
      <path d="M56 168 L49 180 M164 168 L174 180"/>
      <path d="M46 124 H89"/>
    </g>
    <circle cx="165" cy="125" r="9" fill={BLUE} opacity={frame%25<15?1:.35}/>
    {scared ? <path d="M89 113 l-7 7 M128 113 l7 7" stroke={INK} strokeWidth="5"/>:null}
    {heart?<path d="M106 46 C79 15 53 57 106 80 C157 50 125 15 106 46Z" fill={BLUE}/>:null}
    {heart&&<path d="M66 18 Q107 -8 150 18" stroke={BLUE} strokeWidth="4" fill="none" opacity={.5+.5*Math.sin(frame*.2)}/>}
  </svg>
 </div>;
};

const HugArms:React.FC<{tension?:boolean}> = ({tension=false})=>{
 const frame=useCurrentFrame();const bob=Math.sin(frame*.28)*5;
 return <svg viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
  <g stroke={INK} fill="none" strokeWidth={23} strokeLinecap="round" strokeLinejoin="round">
   <path d={'M391 '+(1031+bob)+' Q360 1147 462 1188 Q524 1214 584 1145'}/>
   <path d={'M584 '+(1035+bob)+' Q648 1110 617 1177 Q580 1245 493 1201'}/>
  </g>
  <g fill={IVORY} stroke={INK} strokeWidth="6">
   <ellipse cx="583" cy="1145" rx="19" ry="13" transform="rotate(-31 583 1145)"/>
   <ellipse cx="493" cy="1202" rx="20" ry="12" transform="rotate(22 493 1202)"/>
  </g>
  {tension&&<path d="M343 1091 l-39 -31 M351 1114 l-41 -2 M656 1116 l42 -20" stroke={BLUE} strokeWidth="6" strokeLinecap="round"/>}
 </svg>;
};

const DynamicCaption:React.FC<{text:string;accent?:boolean}> = ({text,accent=false})=>{
 const frame=useCurrentFrame();
 const pop=interpolate(frame%30,[0,4,30],[.94,1,1],clamp);
 return <div style={{position:'absolute',bottom:192,left:60,right:60,textAlign:'center',fontFamily:'Arial, sans-serif',fontSize:accent?67:47,letterSpacing:accent?-1:0,lineHeight:1.12,fontWeight:900,color:accent?BLUE:INK,textShadow:'3px 3px 0 white, -3px -3px 0 white',transform:'scale('+pop+')'}}>
  {text}
 </div>;
};
const SpeedLines:React.FC<{x:number;y:number}> = ({x,y})=><svg style={{position:'absolute',left:x,top:y,width:235,height:230}} viewBox="0 0 235 230"><g stroke={BLUE} strokeWidth="8" strokeLinecap="round"><path d="M20 20 l62 52 M8 105 h90 M27 186 l60 -45 M137 8 l-2 62 M178 30 l-45 48"/></g></svg>;
const Phone:React.FC = ()=>{
 const frame=useCurrentFrame(),p=Math.sin(frame*.12)*5;
 return <div style={{position:'absolute',left:575,top:720,width:350,height:590,transform:'rotate('+(p-8)+'deg)',borderRadius:47,border:'15px solid '+INK,background:'#EBF1FF',boxShadow:'14px 18px 0 rgba(32,37,50,.12)',fontFamily:'Arial, sans-serif',textAlign:'center',color:INK}}>
 <div style={{width:100,height:16,background:INK,borderRadius:18,margin:'20px auto 92px'}}/>
 <div style={{fontSize:42,fontWeight:900}}>Wi-Fi</div>
 <div style={{fontSize:106,fontWeight:900,color:BLUE,marginTop:35}}>12</div>
 <div style={{fontSize:40,fontWeight:900}}>devices</div>
 <div style={{fontSize:36,fontWeight:800}}>connected</div>
 </div>;
};
const Timeline:React.FC=()=>{
 const frame=useCurrentFrame();
 const scene=frame<105?0:frame<245?1:frame<355?2:frame<485?3:4;
 const bodyMotion=(f:number,start:number,end:number,min:number,max:number)=>interpolate(f,[start,end],[min,max],clamp);
 const dexIntro=bodyMotion(frame,0,23,980,680);
 const dexTrip=frame>15&&frame<31?-11*Math.sin((frame-15)*Math.PI/16):0;
 const solShock=bodyMotion(frame,358,380,55,-205);
 const routerApproach=bodyMotion(frame,495,534,0,-105);
 return <AbsoluteFill style={{backgroundColor:IVORY,overflow:'hidden',fontFamily:'Arial,sans-serif'}}>
   {voiceTiming.enabled&&voiceClips.map(clip=><Sequence key={clip.id} from={clip.startFrame} durationInFrames={clip.durationFrames}><Audio src={staticFile('voice/'+clip.filename)}/></Sequence>)}
   <div style={{position:'absolute',top:112,left:68,fontSize:30,fontWeight:900,color:BLUE,letterSpacing:3}}>SOLEDEALS ORIGINALS</div>
   <div style={{position:'absolute',top:171,left:68,fontSize:56,fontWeight:900,color:INK}}>THE WI-FI PROBLEM</div>
   <div style={{position:'absolute',left:45,right:45,top:1350,height:7,backgroundColor:'#D9DEE6',borderRadius:12}}/>
   {scene===0&&<>
     <div style={{position:'absolute',top:360,left:110,fontSize:39,fontWeight:800,color:'#6F7783'}}>SOMEONE'S REALLY ATTACHED...</div>
     <Actor who="sol" x={205} y={695} scale={1.65} angle={-8+Math.sin(frame*.27)*3} emotion="happy" bounce={10}/>
     <Router x={434} y={1050} scale={1.16} heart/>
     <HugArms tension={frame>35}/>
     <Actor who="dex" x={dexIntro} y={780+dexTrip} scale={1.35} angle={frame>18&&frame<35?-17:7} emotion={frame>22?'shock':'confused'} speaking={frame>=39} arm={frame>22?'flail':'none'} bounce={frame>21&&frame<35?13:0}/>
     {frame>=22&&frame<44&&<SpeedLines x={746} y={700}/>}
     {frame>=37&&<DynamicCaption text="Why are you hugging the router?!"/>}
   </>}
   {scene===1&&<>
     <Actor who="sol" x={155} y={670} scale={1.83} angle={-10+Math.sin(frame*.22)*3} emotion="happy" speaking={frame>=132} bounce={7}/>
     <Router x={431} y={1054} scale={1.17} heart/>
     <HugArms tension/>
     <Actor who="dex" x={792} y={790} scale={.95} emotion="confused" angle={9} arm="facepalm"/>
     {frame>=130&&<DynamicCaption text={frame<211?"My therapist said I need...":"a STRONGER CONNECTION."} accent={frame>=211}/>}
   </>}
   {scene===2&&<>
     <Actor who="dex" x={95} y={650} scale={1.82} emotion="confused" speaking={frame>=270} arm="point" angle={-7}/>
     <Phone/>
     {frame>=278&&<DynamicCaption text="It's connected to TWELVE other devices."/>}
   </>}
   {scene===3&&<>
     <Actor who="sol" x={235+solShock} y={655-(frame<378?Math.max(0,45-Math.abs(frame-365)*5):0)} scale={1.88} emotion={frame<390?'shock':'angry'} speaking={frame>=397} arm={frame<384?'flail':'point'} angle={frame<385?Math.sin(frame*1.4)*12:Math.sin(frame*.35)*7} bounce={frame>385?11:0}/>
     <Router x={810} y={1070} scale={.86} scared shake={frame>399}/>
     {frame>=355&&frame<388&&<SpeedLines x={718} y={692}/>}
     {frame>=355&&<DynamicCaption text={frame<397?'TWELVE?!':'I THOUGHT WE WERE EXCLUSIVE!'} accent/>}
   </>}
   {scene===4&&<>
     <Actor who="sol" x={60} y={700} scale={1.38} emotion="angry" arm="fold" angle={-14}/>
     <Router x={520} y={1080} scale={1.03} heart shake skitter={routerApproach}/>
     <Actor who="dex" x={705} y={695} scale={1.38} emotion="laugh" arm="laugh" bounce={23} angle={12+Math.sin(frame*.3)*7}/>
     <div style={{position:'absolute',left:285,top:570,fontSize:100,color:BLUE,transform:'rotate(-12deg)'}}>?!</div>
     <DynamicCaption text={frame<525?'Dex cannot stop laughing.':'...and the router wants him back.'}/>
   </>}
   <div style={{position:'absolute',bottom:67,width:'100%',textAlign:'center',fontSize:28,color:BLUE,fontWeight:900,letterSpacing:6}}>SOL & DEX</div>
 </AbsoluteFill>;
};
export const WifiEpisode:React.FC = ()=> <Timeline/>;
