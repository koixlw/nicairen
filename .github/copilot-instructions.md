<!-- .github/copilot-instructions.md -->
目的：向 AI 编码代理提供该仓库的快速上手要点——架构、关键文件、常见问题（尤其是 GitHub Pages 空白页）以及修复示例。

- 项目类型：Vite + Vue 3（组合式），使用 Pinia 和 vue-router（见 `package.json`）。
- 入口：`index.html` -> `src/main.ts`；源代码在 `src/`。

关键架构要点（大局观）
- 单页应用（SPA），路由在 `src/router/index.ts` 定义。路由当前使用 HTML5 history 模式：
  createWebHistory(import.meta.env.BASE_URL)
  这意味着构建后页面的基路径（`import.meta.env.BASE_URL`）必须正确设置，尤其在 GitHub Pages 上托管时。
- Vite 配置在 `vite.config.ts`。目前未显式设置 `base`。

常见导致 GitHub Pages 空白页的原因（在此仓库中最容易遇到）
- 未设置 Vite `base`：当站点托管在 https://<user>.github.io/<repo>/ 时，需要把 `base` 设置为 `'/<repo>/'`，否则资源（CSS/JS）会尝试从站点根 `/` 加载并 404，页面呈现空白。
- 使用 HTML5 history 路由但没有服务器端回退支持：当直接访问子路由（例如 `/news`）时，GitHub Pages 会返回 404，或导致空白。两种解决方法：设置正确 `base` 或改用 Hash 路由（`createWebHashHistory()`）。
- `index.html` 中使用以 `/` 开头的绝对路径（如 `/src/main.ts`、`/favicon.ico`）。Vite 在 build 时会根据 `base` 处理这些路径，但如果没有设置正确 `base`，仍会导致资源路径错误。

可执行的修复示例（具体、可复制）
1) 在 `vite.config.ts` 中设置 base（适合 GitHub Pages user/repo 页面）：

  // 示例（仓库名为 `nicairen`）
  export default defineConfig({
    base: '/nicairen/',
    // ...existing config...
  })

  说明：将 `/nicairen/` 替换为实际仓库名。设置后 `pnpm build` 会生成引用正确基路径的静态资源。

2) 或者，切换路由为 Hash 模式，避免 history 回退问题：

  // src/router/index.ts
  - import { createRouter, createWebHistory } from 'vue-router'
  + import { createRouter, createWebHashHistory } from 'vue-router'

  - history: createWebHistory(import.meta.env.BASE_URL),
  + history: createWebHashHistory(),

  说明：Hash 路由（URL 带 `#`）能在不配置服务器回退的静态托管（如 GitHub Pages）下正常工作。

3) 本地构建与预览（Windows PowerShell 示例）：

  pnpm build
  pnpm preview

  若要用简单静态服务器预览（可选）：
  pnpm add -D serve
  npx serve dist

4) 推荐的 GitHub Pages 部署方法（脚本化）
  - 使用 `gh-pages` 包：
    1. 安装：`pnpm add -D gh-pages`
    2. package.json scripts 示例：
       "build": "vite build",
       "deploy": "pnpm build && gh-pages -d dist -b gh-pages"
    3. 运行：`pnpm deploy`（会把 `dist` 发布到 `gh-pages` 分支）

  - 或者，在 GitHub 仓库设置中将 Pages source 指向 `gh-pages` 分支或 `docs/` 文件夹（若你把构建输出改到 `docs/`）。

项目约定与注意事项（可被 AI 直接采纳）
- 代码分割与懒加载：路由组件多数使用 `() => import('../pages/XXX.vue')` 动态导入；保持懒加载模式不要改为同步导入，除非必须。
- 文件别名：`@` 指向 `src/`（在 `vite.config.ts` 中配置）。AI 可以使用 `@/components/...` 的路径风格。
- 资源目录：静态图片在 `src/assets/images/`。构建时资源路径受 `base` 影响。
- 404 处理：路由中已包含 `/:pathMatch(.*)*` 重定向到 `/`，但当使用 history 模式且托管在静态服务器上，直接访问子路径仍可能导致 404（服务器必须回退到 `index.html`）。

诊断时优先检查（简单清单）
1. 检查 `vite.config.ts` 是否有 `base`。
2. 检查 `src/router/index.ts` 是否使用 history 或 hash。
3. 本地运行 `pnpm build` + `pnpm preview`，或 `npx serve dist`，确认构建产物在相对于 `base` 的路径能被加载。
4. 检查 GitHub Pages 设置：是部署到 `gh-pages` 还是 `docs/`，并确保 `base` 与部署位置匹配。

如果不确定仓库名或 Pages 的 URL，优先建议使用 Hash 路由（最小侵入、可靠）。

结束：请告诉我你希望我为你直接应用哪种修复（修改 `vite.config.ts` 添加 `base`，或将路由切换为 Hash），我可以在仓库中直接修改并做一次本地构建验证。
