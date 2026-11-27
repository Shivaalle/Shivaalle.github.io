# Shiva Teja Alle — AI Systems Portfolio

**Live:** https://shivaalle.github.io

A portfolio for three production-minded AI systems: **OpsBuddy AI**, **Idea Innovator AI**, and **PM Agent**. Each case study includes an interactive demo, architecture notes, and the engineering trade-offs behind the build.

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Phosphor Icons
- GitHub Actions → GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

Type-check and production build:

```bash
npm run typecheck
npm run build
npm run preview
```

## What is inside

- **OpsBuddy AI** — a sanitized, synthetic walkthrough of a domain-isolated operations copilot: identity-aware access, concurrent agents, governed MCP tools, and hybrid BM25 + dense retrieval fused with RRF.
- **Idea Innovator AI** — a sanitized walkthrough of an 8-agent LangGraph intake, a 12-state role-gated lifecycle, deterministic ranking, and a four-stage POC compiler.
- **PM Agent** — a source-verified independent build: transcript-to-Jira auditing with verbatim citations, Git discrepancy detection, human-gated writeback, and a checked-in golden eval harness.

## Confidentiality note

OpsBuddy AI and Idea Innovator AI use synthetic demo data. Client systems, identifiers, runbooks, production prompts, scoring configuration, and generated artifacts are not included. PM Agent uses synthetic checked-in fixtures; its metrics come from the repository's golden eval results.

## Resume

The downloadable PDF at `public/Shiva-Teja-Alle-Resume.pdf` is generated from `resume/Shiva-Teja-Alle-Resume.html`. Edit the HTML and run:

```bash
./resume/build.sh
```

The script uses headless Chrome on macOS to print the resume to PDF.

## Deployment

Pushes to `main` trigger the workflow in `.github/workflows/deploy.yml`, which builds the Vite app and publishes `dist/` to GitHub Pages.
