/**
 * SoleDeals character dialogue via ElevenLabs.
 * Run only when intentionally requested: generates billable speech clips.
 * Never logs or stores the API secret. All audio is excluded from git.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  console.error('ELEVENLABS_API_KEY is missing. Add it as a GitHub Actions repository secret, never to source code.');
  process.exit(1);
}

const voiceIds = {
  sol: process.env.SOL_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb', // George: ElevenLabs documented default voice; test access on this workspace
  dex: process.env.DEX_VOICE_ID || 'onwK4e9ZLuTAKqWW03F9', // Daniel: documented default; test access on this workspace
};

const FPS=30;
// Fixed spots in the CURRENT 18-second Wi-Fi storyboard. Check audio fit before publishing.
const lines = [
 // Check Sol FIRST because the earlier custom Library voice caused HTTP 402; do not charge Dex again if Sol is blocked.
 {id:'sol-connection',who:'sol',text:'My therapist said I need a stronger connection.',startFrame:133,maxEndFrame:245},
 {id:'dex-question',who:'dex',text:'Why are you hugging the router?!',startFrame:40,maxEndFrame:105},
 {id:'dex-discovery',who:'dex',text:"It's connected to twelve other devices.",startFrame:270,maxEndFrame:355},
 {id:'sol-twelve',who:'sol',text:'TWELVE?!',startFrame:362,maxEndFrame:399},
 {id:'sol-exclusive',who:'sol',text:'I THOUGHT WE WERE EXCLUSIVE!',startFrame:399,maxEndFrame:485},
];
const outDir = path.resolve('public/voice');
await fs.mkdir(outDir,{recursive:true});
const output = [];
try {
 for(const line of lines) {
  const res=await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+encodeURIComponent(voiceIds[line.who])+'/with-timestamps?output_format=mp3_44100_128',{
   method:'POST',
   headers:{'xi-api-key':key,'Content-Type':'application/json'},
   body:JSON.stringify({
    text:line.text,
    model_id:'eleven_multilingual_v2',
    voice_settings:{stability:0.42,similarity_boost:0.8,style:0.35,use_speaker_boost:true}
   }),
   signal:AbortSignal.timeout(90000),
  });
  if(!res.ok){const err=await res.text();throw Error('ElevenLabs failed for '+line.id+': HTTP '+res.status+' '+err.slice(0,600));}
  const data=await res.json();
  if(!data.audio_base64)throw Error('ElevenLabs returned no audio for '+line.id);
  const alignment=data.normalized_alignment || data.alignment;
  if(!alignment?.characters?.length)throw Error('No speech alignment for '+line.id);
  const durationSeconds=Math.max(...alignment.character_end_times_seconds);
  const durationFrames=Math.ceil(durationSeconds*FPS)+2;
  const limit=line.maxEndFrame-line.startFrame;
  // Save each finished clip and report duration even if later lines cannot fit;
  // failed jobs never expose incomplete final MP4 as a published video.
  const filename=line.id+'.mp3';
  await fs.writeFile(path.join(outDir,filename),Buffer.from(data.audio_base64,'base64'));
  console.log(line.id+': '+durationSeconds.toFixed(2)+'s, fits '+(limit/FPS).toFixed(2)+'s slot: '+(durationFrames<=limit?'yes':'NO'));
  if(durationFrames>limit){
   throw Error('Dialogue exceeds allocated slot ('+line.id+'). Shorten dialogue or retime scene before rendering; no audio will be dropped silently.');
  }
  const characters = alignment.characters.map((char,i)=>({
    char,
    startFrame:line.startFrame+Math.floor(alignment.character_start_times_seconds[i]*FPS),
    endFrame:line.startFrame+Math.ceil(alignment.character_end_times_seconds[i]*FPS)
  }));
  output.push({id:line.id,who:line.who,text:line.text,startFrame:line.startFrame,durationFrames,filename,characters});
 }
 await fs.writeFile(path.resolve('src/voice-timing.generated.json'),JSON.stringify({enabled:true,fps:FPS,clips:output},null,2)+'\n');
 console.log('SUCCESS: generated five distinct dialogue clips with timestamp alignment. This preview is not approved for public posting.');
} catch(e){
 console.error(e instanceof Error ? e.message:String(e));
 process.exitCode=1;
}
