# Web Scraper

CLI tool for extracting text, links, and metadata from web pages with sensible defaults.

<!-- badges -->

## What It Does

Web Scraper (`webscrape`) fetches pages and intelligently extracts text, internal/external links, and OpenGraph metadata. Smart defaults: 50KB text limit, 10s timeout, automatic HTML-to-text conversion.

## Features

- **CLI Command**: `webscrape <url>` for instant extraction
- **Text Extraction**: htmlToText() with formatting preservation
- **Link Discovery**: extractLinks() separates internal from external
- **Metadata Parsing**: extractMetadata() for OpenGraph tags
- **Smart Limits**: 50KB text cap, 10s timeout by default
- **Configurable**: Override text limit, timeout, and output format

## Quick Start

```bash
npm install -g web-scraper
webscrape https://example.com
```

## Usage

```bash
# Extract all text
webscrape https://example.com --format text

# Get links only
webscrape https://example.com --links --external-only

# Extract metadata
webscrape https://example.com --metadata

# Custom limits
webscrape https://example.com --max-text 100000 --timeout 20000

# JSON output
webscrape https://example.com --format json
```

## Tech Stack

- Commander.js (CLI framework)
- Fetch API (HTTP client)
- DOM parsing (HTML processing)

## Part of Genesis Marketplace

Powers the web research agent in the Genesis skill marketplace.

## Author

Christopher L. Hammer  
GitHub: [christopherlhammer11-ai](https://github.com/christopherlhammer11-ai)  
Sites: [hammercg.com](https://hammercg.com) | [hammerlockai.com](https://hammerlockai.com)
