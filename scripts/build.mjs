import { cpSync, renameSync, rmSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const output = '.output/public';
rmSync(output, {recursive:true, force:true});
cpSync('dist', output, {recursive:true});

const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const dir = output + '/media/';
for (const name of ['arrival', 'welcome', 'preparation', 'surgery']) {
  const input = dir + name + '.mp4';
  const temporary = dir + name + '.encoded.mp4';
  const result = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-nostdin', '-i', input,
    '-map', '0:v:0', '-map_metadata', '-1', '-an',
    '-vf', "scale='min(1280,iw)':-2,fps=25",
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '24',
    '-maxrate', '2M', '-bufsize', '4M', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', temporary
  ], {stdio:'inherit'});
  if (result.error?.code === 'ENOENT' && statSync(input).size <= 25 * 1024 * 1024) continue;
  if (result.status !== 0) {
    throw new Error(result.error?.code === 'ENOENT'
      ? 'FFmpeg is required. Install it and rerun npm run build.'
      : 'Video conversion failed for ' + name, {cause:result.error});
  }
  renameSync(temporary,input);
}
const validation = spawnSync(process.execPath, ['scripts/check.mjs', output, '--pages'], {stdio:'inherit'});
process.exitCode = validation.status ?? 1;
