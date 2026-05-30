# 构建说明

本项目使用 GitHub Actions 进行自动化构建、部署和发布。

## 触发方式

通过 **commit message** 中的关键词控制 CI/CD 行为：

| Commit Message 关键词 | 构建 | 部署 GitHub Pages | 发布 Release |
|----------------------|------|-------------------|--------------|
| `build action`       | ✅   | ❌                | ❌           |
| `build release`      | ✅   | ✅                | ✅           |
| 其他                 | ❌   | ❌                | ❌           |

## 使用示例

### 仅测试构建

```bash
git commit -m "build action: 测试 CI 流程"
git push
```

**效果**：触发构建，生成 dist 产物，但不部署也不发布

### 构建并发布

```bash
git commit -m "build release: v0.1.0 新增视频压缩功能"
git push
```

**效果**：
1. ✅ 构建项目
2. ✅ 部署到 GitHub Pages
3. ✅ 创建 GitHub Release（包含 zip 压缩包）

## 工作流程

```
check ──→ build ──→ deploy (GitHub Pages)
                 └──→ release (GitHub Release)
```

### 1. check 任务

- 解析 commit message
- 提取版本号（从 package.json）
- 输出控制标志（should_build, should_release）

### 2. build 任务

- 安装依赖（npm ci）
- 构建项目（npm run build）
- 上传 dist 产物

### 3. deploy 任务

- 下载构建产物
- 部署到 GitHub Pages
- 访问地址：`https://[username].github.io/wasm-ffmpeg-tryer/`

### 4. release 任务

- 下载构建产物
- 打包成 zip（`wasm-ffmpeg-tryer-v0.1.0.zip`）
- 创建 GitHub Release
- 附带下载链接和使用说明

## 版本号管理

版本号统一在 `package.json` 中维护：

```json
{
  "version": "0.1.0"
}
```

CI 会自动读取并生成对应的 Release tag（如 `v0.1.0`）

## 注意事项

- PR 会自动触发构建测试，但不会部署或发布
- 只有推送到 `main` 分支才会触发部署和发布
- Release 会自动覆盖同版本的旧 Release（强制刷新）
