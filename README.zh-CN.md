# saucedemo E2E 测试套件

[![Playwright Tests](https://github.com/adlkt/browser-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/adlkt/browser-automation/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

English | [简体中文](./README.zh-CN.md)

基于 [saucedemo.com](https://www.saucedemo.com/)（一个电商演示站）的端到端测试自动化项目，技术栈为 **Playwright + TypeScript**。

测试覆盖在线商店的完整关键路径：登录认证、商品浏览、购物车管理、结算下单——采用 Page Object Model 保证可维护性，用 `storageState` 实现登录态复用，跑得快、写得省。

## 亮点

- **Page Object Model** —— 每个页面对应一个类（`login` / `inventory` / `cart` / `checkout`），选择器集中管理，测试代码读起来就是用户操作意图
- **`storageState` 登录态复用** —— 登录只在独立的 `setup` project 里执行一次，其余所有 project 从保存的会话直接开始（不重复登录，提速明显）
- **自定义 `data-test` 属性** —— 通过 `testIdAttribute` 配置，匹配应用实际使用的测试钩子
- **失败取证** —— `trace: retain-on-failure` + HTML Reporter；CI 上每次失败都附带可下载的 trace，能逐步回放定位问题
- **CI 就绪** —— GitHub Actions 工作流，带重试、并行安全配置，每次运行自动上传 HTML 报告

## 测试覆盖

| 模块 | 验证内容 |
|---|---|
| 登录 | 正确凭据登录成功；错误凭据展示报错 |
| 商品 | 按价格排序（升/降序）、商品详情跳转 |
| 购物车 | 加购、删购、badge 数量始终准确 |
| 结算 | 必填项校验、完整购买流程走通 |

## 项目结构

```
├── playwright.config.ts     # ESM 配置：projects、storageState、重试、报告
├── tests/
│   ├── auth.setup.ts        # 一次性登录 → 保存 storageState
│   ├── login.spec.ts
│   ├── products.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── pages/               # Page Object Model
│       ├── login.page.ts
│       ├── inventory.page.ts
│       ├── cart.page.ts
│       └── checkout.page.ts
└── .github/workflows/playwright.yml
```

## 快速开始

**环境要求：** Node.js ≥ 20.11（配置使用了 `import.meta.dirname`）、pnpm。

```bash
pnpm install
pnpm exec playwright install chromium
pnpm test          # 无头模式
pnpm test:headed   # 有头模式，可视化执行
pnpm test:ui       # Playwright UI Mode
pnpm report        # 打开 HTML 报告
pnpm typecheck     # 严格类型检查（不产出文件）
```

## CI

每次向 `main` 分支 push / 提 PR 时自动执行：

1. 安装依赖 + Chromium 及系统依赖
2. 运行测试套件（启用重试、单 worker 保证稳定性）
3. 将 HTML 报告上传为 Artifact —— 在 Actions 运行页下载后打开 `index.html`，可查看结果与失败 trace

## Roadmap

- [ ] 跨浏览器执行（Firefox / WebKit project）
- [ ] 视觉回归测试
- [ ] Allure 报告

## License

[MIT](LICENSE)
