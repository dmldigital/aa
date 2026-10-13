// Cuts the short, small loops for the Impressionen tiles (public/media/clip/*.mp4 + first-frame posters *.webp) from the original
// footage. The originals are not in the repo (see BRIEF.md, media-src/); point SRC at the folder that holds them.
//   FFMPEG=path/to/ffmpeg.exe SRC=path/to/videos node scripts/make-clips.mjs
// Every clip: 6 s, 24 fps, no audio, H.264 main, faststart, capped bitrate (about 250-450 KB each).
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const SRC = process.env.SRC;
if (!SRC) throw new Error('SRC (folder with the original videos) is missing');
const OUT = fileURLToPath(new URL('../public/media/clip/', import.meta.url));
mkdirSync(OUT, { recursive: true });

// name = file name of the clip, file = original, start = second where the loop begins, width = output width
const clips = [
  { name: 'DJI_0099-12s', file: 'DJI_0099.mp4', start: 12, width: 720 },
  { name: 'IMG_0572-1s', file: 'IMG_0572.mov', start: 1, width: 640 },
  { name: 'DJI_0165-22s', file: 'DJI_0165.mp4', start: 22, width: 720 },
  { name: 'DJI_0100-8s', file: 'DJI_0100.mp4', start: 8, width: 720 },
  { name: 'DJI_0204-15s', file: 'DJI_0204.mp4', start: 15, width: 720 },
  { name: 'DJI_0144-3s', file: 'DJI_0144.mp4', start: 3, width: 720 },
];

const run = args => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
for (const c of clips) {
  const input = `${SRC}/${c.file}`;
  const vf = `fps=24,scale=${c.width}:-2:flags=lanczos,format=yuv420p`;
  run(['-ss', String(c.start), '-t', '6', '-i', input, '-an', '-vf', vf, '-c:v', 'libx264', '-preset', 'slower', '-crf', '31', '-profile:v', 'main',
    '-maxrate', '900k', '-bufsize', '1800k', '-g', '48', '-movflags', '+faststart', `${OUT}${c.name}.mp4`]);
  run(['-ss', String(c.start), '-i', input, '-frames:v', '1', '-vf', `scale=${Math.min(c.width, 640)}:-2:flags=lanczos`, '-c:v', 'libwebp', '-quality', '60', `${OUT}${c.name}.webp`]);
  console.log(c.name, Math.round(statSync(`${OUT}${c.name}.mp4`).size / 1024), 'KB video,', Math.round(statSync(`${OUT}${c.name}.webp`).size / 1024), 'KB poster');
}
