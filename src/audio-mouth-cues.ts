/** Audio-driven mouth openings sampled from the current 18s voice-and-effects preview,
 * 30 FPS. The only nonzero regions correspond to spoken dialogue. No audio files or
 * third-party reference character styles are stored here.
 * Audio-envelope tracking gives much closer timing than the previous sine-wave mouth,
 * but is not a phoneme-perfect forced alignment.
 */
const data="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFSOaxYAAAAB3enU38a6zOfv7e3Qtse/nbTP0MC5sK+gorGojpicnJNsaH2Wc25uXjsNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE7lZOKfUA8cZeDh4x7OEuJhGdmPxFAWliFjoeMgWRzbI+Pk56dlGuLcmt2XGKYmnWGgneHcWtueo+UkYVuU4KQg4J2eX2BZDkSAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdJhoOIyokFgkAAAAAAAABZn9gGQAAAAGFsYJ7YkiFpZ+xn4VXFgN8rJexnY6lmYZ0Z6aWko6MkZeYbi53n42Tppuam6CZk6OTjZOqqYV+dpuHgX94fH2Ac1UgAgAAAAAAAAAAAAAAAAAAAAAABBMhLCkfe5hXpbORlJaZp6iBdTonDQEAAAAAAAAAAAAAAAAAAAAAAAAAeZmTlY5uUqmdjGcxeLqqrpOosKuZdj9lbnpcVp2vpaWMcnePmWZuaFZYWCcGAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const samples=Array.from(atob(data),c=>c.charCodeAt(0));
const speakerSpans={
 dex:[[1.10,2.84],[8.20,11.40]],
 sol:[[4.4,6.96],[11.84,14.86]]
} as const;
export const mouthEnergy=(who:'sol'|'dex',frame:number):number=>{
 if(frame<0||frame>=samples.length)return 0;
 const sec=frame/30;
 if(!speakerSpans[who].some(([lo,hi])=>sec>=lo&&sec<=hi))return 0;
 const sample=samples[frame]/240;
 return Math.min(1,Math.max(0,sample));
};
export const mouthPose=(who:'sol'|'dex',frame:number):'closed'|'small'|'wide'|'round'|'open'=>{
 const e=mouthEnergy(who,frame);
 if(e<.12)return 'closed';
 if(e<.28)return 'small';
 if(e<.52)return 'round';
 if(e<.77)return 'wide';
 return 'open';
};
