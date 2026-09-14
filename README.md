# saucedemo E2E Test Suite

[![Playwright Tests](https://github.com/adlkt/browser-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/adlkt/browser-automation/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

English | [简体中文](./README.zh-CN.md)

End-to-end test automation for [saucedemo.com](https://www.saucedemo.com/) — a demo e-commerce app — built with **Playwright + TypeScript**.

The suite covers the full critical path of an online store: authentication, catalog browsing, cart management, and checkout — using the Page Object Model for maintainability and `storageState` for fast, reusable login sessions.

## Highlights

- **Page Object Model** — one class per page (`login`, `inventory`, `cart`, `checkout`); selectors live in one place, tests read like user intent
- **Reusable auth via `storageState`** — login runs once in a dedicated `setup` project; all other projects start from a saved session (no repeated logins, faster runs)
- **Custom `data-test` attribute** — configured via `testIdAttribute` to match the app's actual test hooks
- **Failure forensics** — `trace: retain-on-failure` + HTML reporter; every CI failure ships with a downloadable trace you can replay step by step
- **CI-ready** — GitHub Actions workflow with retries, parallel-safe config, and HTML report artifacts on every run

## Test Coverage

| Area | What's verified |
|---|---|
| Login | Valid credentials succeed; invalid credentials show an error |
| Products | Price sorting (asc/desc), product detail navigation |
| Cart | Add items, remove items, badge count stays accurate |
| Checkout | Required-field validation, complete purchase end-to-end |

## Project Structure

```
├── playwright.config.ts     # ESM config: projects, storageState, retries, reporters
├── tests/
│   ├── auth.setup.ts        # One-time login → saves storageState
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

## Getting Started

**Prerequisites:** Node.js ≥ 20.11 (config uses `import.meta.dirname`), pnpm.

```bash
pnpm install
pnpm exec playwright install chromium
pnpm test          # headless
pnpm test:headed   # watch it run
pnpm test:ui       # Playwright UI Mode
pnpm report        # open the HTML report
pnpm typecheck     # strict type check (no emit)
```

## CI

Tests run automatically on every push/PR to `main`:

1. Install dependencies + Chromium with system deps
2. Run the suite (retries enabled, single worker for stability)
3. Upload the HTML report as an artifact — download it from the run page and open `index.html` to inspect results and traces

## Roadmap

- [ ] Cross-browser runs (Firefox / WebKit projects)
- [ ] Visual regression testing
- [ ] Allure reporting

## License

[MIT](LICENSE)
