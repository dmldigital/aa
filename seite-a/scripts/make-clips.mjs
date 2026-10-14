// Encodes the two video tiles of the Impressionen (public/media/clip/*.mp4 + first-frame posters *.webp) from the original footage,
// in full length and at the original frame rate (a conversion to 24 fps made the first version judder). The originals are not in the
// repo (see BRIEF.md, media-src/); point SRC at the folder that holds them.
//   FFMPEG=path/to/ffmpeg.exe SRC=path/to/videos node scripts/make-clips.mjs
// Every clip: no audio, H.264 main, faststart, capped bitrate.
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const SRC = process.env.SRC;
if (!SRC) throw new Error('SRC (folder with the original videos) is missing');
const OUT = fileURLToPath(new URL('../public/media/clip/', import.meta.url));
mkdirSync(OUT, { recursive: true });

// name = file name of the clip, file = original, width = output width, crf = quality (lower = better), maxrate in kbit/s
const clips = [
  { name: 'DJI_0099', file: 'DJI_0099.mp4', width: 960, crf: 27, maxrate: 2200 },
  { name: 'IMG_0572', file: 'IMG_0572.mov', width: 720, crf: 26, maxrate: 2200 },
];

const run = args => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
for (const c of clips) {
  const input = `${SRC}/${c.file}`;
  run(['-i', input, '-an', '-vf', `scale=${c.width}:-2:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(c.crf), '-profile:v', 'main',
    '-maxrate', `${c.maxrate}k`, '-bufsize', `${c.maxrate * 2}k`, '-g', '60', '-movflags', '+faststart', `${OUT}${c.name}.mp4`]);
  run(['-i', input, '-frames:v', '1', '-vf', `scale=${Math.min(c.width, 640)}:-2:flags=lanczos`, '-c:v', 'libwebp', '-quality', '60', `${OUT}${c.name}.webp`]);
  console.log(c.name, Math.round(statSync(`${OUT}${c.name}.mp4`).size / 1024), 'KB video,', Math.round(statSync(`${OUT}${c.name}.webp`).size / 1024), 'KB poster');
}
