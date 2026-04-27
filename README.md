# Web Scraper

**Structured web extraction for AI research workflows.** Web Scraper pulls readable text, links, and metadata from pages so agents can work with cleaner source material.

Demo: **Related demo:** [Research Intake Layer](https://christopherhammer.dev/assets/videos/narrated/project-demos/research-intake-layer-narrated.mp4)

## Who Uses It

- AI agents that need to read public web pages
- Researchers gathering source material
- Competitive analysis workflows
- RAG/preprocessing pipelines
- Small automation jobs that need text, links, and metadata

## Core Features

- Fetch a page and extract readable text
- Separate internal and external links
- Pull OpenGraph/metadata fields
- JSON or text output
- Timeout and text-length controls
- Useful first stage for research agents

## Example

```bash
webscrape https://example.com --format json
webscrape https://example.com --links --external-only
webscrape https://example.com --metadata
```

## Quick Start

```bash
npm install
npm run build
npm test
```

## Portfolio Context

This is one of the eyes of the agent stack. HammerLock and other research workflows need source collection before verification, condensation, summarization, and drafting.

---

Built by **Christopher L. Hammer** - self-taught AI/product builder shipping local-first tools, demos, and real product surfaces.

- Portfolio: [christopherhammer.dev](https://christopherhammer.dev)
- Proof demos: [https://christopherhammer.dev#proof](https://christopherhammer.dev#proof)
- GitHub: [christopherlhammer11-ai](https://github.com/christopherlhammer11-ai)

