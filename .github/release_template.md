## 🎬 视频压缩工具 __VERSION__

基于 WebAssembly 的浏览器端视频压缩工具

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Online-222222?style=for-the-badge&logo=githubpages&logoColor=white)](https://VincentZyuApps.github.io/wasm-ffmpeg-tryer/) [https://VincentZyuApps.github.io/wasm-ffmpeg-tryer/](https://VincentZyuApps.github.io/wasm-ffmpeg-tryer/)
<br>
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-Online-F38020?style=for-the-badge&logo=cloudflarepages&logoColor=white)](https://wasm-ffmpeg-tryer.pages.dev/) [https://wasm-ffmpeg-tryer.pages.dev/](https://wasm-ffmpeg-tryer.pages.dev/)

### 📥 使用方式

**离线使用**: 下载下方的 zip 包，解压后用本地 HTTP 服务器访问

#### 启动本地服务器

**方案1：Python（推荐，最简单）**
```bash
cd wasm-ffmpeg-tryer-v{version}
python -m http.server 60530
# 然后在浏览器访问 http://localhost:60530
```

**方案2：Node.js**
```bash
npx http-server -p 60530
# 然后在浏览器访问 http://localhost:60530
```

**方案3：Node.js serve 工具**
```bash
npm install -g serve
serve -l 60530
# 然后在浏览器访问 http://localhost:60530
```

> ⚠️ **重要**: 不能直接打开 `index.html` 文件，浏览器安全策略会阻止资源加载。必须通过 HTTP 服务器访问。

### ✨ 功能特性

- ✅ 纯浏览器端处理，数据不上传
- ✅ 支持分辨率、音质、帧率调节
- ✅ 支持快速预设
- ✅ 实时预估压缩后文件大小
- ✅ 实时进度显示

---

**构建时间**: __BUILD_TIME__
