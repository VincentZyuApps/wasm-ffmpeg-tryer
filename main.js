import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;
let videoFile = null;

const videoInput = document.getElementById('videoInput');
const controls = document.getElementById('controls');
const compressBtn = document.getElementById('compressBtn');
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const result = document.getElementById('result');
const resultInfo = document.getElementById('resultInfo');
const downloadBtn = document.getElementById('downloadBtn');
const targetSize = document.getElementById('targetSize');
const resolution = document.getElementById('resolution');

videoInput.addEventListener('change', (e) => {
  videoFile = e.target.files[0];
  if (videoFile) {
    controls.classList.remove('hidden');
    result.classList.add('hidden');
  }
});

compressBtn.addEventListener('click', async () => {
  if (!videoFile) return;

  compressBtn.disabled = true;
  progress.classList.remove('hidden');
  result.classList.add('hidden');

  try {
    await loadFFmpeg();
    await compressVideo();
  } catch (error) {
    alert('压缩失败: ' + error.message);
    console.error(error);
  } finally {
    compressBtn.disabled = false;
  }
});

async function loadFFmpeg() {
  if (ffmpeg) return;

  progressText.textContent = '加载 FFmpeg...';
  progressFill.style.width = '10%';

  ffmpeg = new FFmpeg();

  ffmpeg.on('log', ({ message }) => {
    console.log(message);
  });

  ffmpeg.on('progress', ({ progress: p }) => {
    const percent = Math.round(p * 100);
    progressFill.style.width = `${10 + percent * 0.9}%`;
    progressText.textContent = `压缩中... ${percent}%`;
  });

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
}

async function compressVideo() {
  progressText.textContent = '准备文件...';
  progressFill.style.width = '10%';

  const inputName = 'input.mp4';
  const outputName = 'output.mp4';

  await ffmpeg.writeFile(inputName, new Uint8Array(await videoFile.arrayBuffer()));

  const targetSizeMB = parseInt(targetSize.value);
  const targetBitrate = Math.floor((targetSizeMB * 8192) / 60);

  const resValue = resolution.value;
  const scaleFilter = resValue === 'auto' ? '' : `-vf scale=-2:${resValue}`;

  const args = [
    '-i', inputName,
    '-b:v', `${targetBitrate}k`,
    '-maxrate', `${targetBitrate * 1.5}k`,
    '-bufsize', `${targetBitrate * 2}k`,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-c:a', 'aac',
    '-b:a', '128k',
  ];

  if (scaleFilter) {
    args.push(...scaleFilter.split(' '));
  }

  args.push(outputName);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  const blob = new Blob([data.buffer], { type: 'video/mp4' });

  const originalSize = (videoFile.size / 1024 / 1024).toFixed(2);
  const compressedSize = (blob.size / 1024 / 1024).toFixed(2);
  const ratio = ((1 - blob.size / videoFile.size) * 100).toFixed(1);

  resultInfo.textContent = `原始大小: ${originalSize} MB → 压缩后: ${compressedSize} MB (减少 ${ratio}%)`;

  downloadBtn.onclick = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${videoFile.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  progress.classList.add('hidden');
  result.classList.remove('hidden');
}
