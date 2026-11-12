# SoleDeals Cartoon Factory

Original Sol & Dex minimalist 2D cartoon starter project, using Remotion.

## Current state
- Remotion composition `SoleDeals-Wifi` exists, 1080 x 1920, 30 fps, 18 seconds.
- Animated original SVG characters, poses, eye blinks, mouth animation, router, camera-like scene changes, and Wi-Fi gag timing.
- This is an **animation preview**, not an approved master. Natural character voiceover, precise phoneme-level lip synchronization, quality-control checks, video hosting and authenticated social publishing are **not implemented yet**.
- **Automatic publishing is disabled** until the owner approves a finished master. Do not turn on Metricool publishing by default.
- Character rigs are provisional source drawings; compare them to the approved Sol & Dex visual references before calling them final.

## Install
Node.js 20+:
```bash
npm install
npm run studio
```
Run a 1080x1920 MP4 test:
```bash
npm run render
```
Output: `out/soledeals-wifi.mp4`.

## Planned production pipeline
1. Script and joke quality gate, with logical, short wordplay and a clear visual payoff.
2. Reuse fixed character rigs/props, update episode data.
3. ElevenLabs two-voice speech generation, timed transcript, facial/lip animation.
4. Remotion build + MP4 render; visual, audio and codec QA.
5. Upload rendered file to durable HTTPS-accessible storage.
6. Schedule verified media through Metricool only after owner's approval; use private environment variables for all account access.
7. Cloud scheduler or queue with cost and error controls.

No API secrets belong in this repository. Render deployment or paid cron resources have **not** been created. In particular, a GitHub push alone does not make a live service.

## Privacy
The repository was detected as **public**. To make it private: GitHub > Settings > General > Danger Zone > Change repository visibility.
