import { ScrapeResult, ScrapeOptions } from './types';
import { htmlToText, extractTitle, extractMetadata, extractLinks } from './html-parser';

const DEFAULTS: Required<ScrapeOptions> = {
  timeout: 10000,
  extractLinks: true,
  maxTextLength: 50000,
  headers: {},
};

/**
 * Scrape a URL and return structured data.
 */
export async function scrape(url: string, options?: ScrapeOptions): Promise<ScrapeResult> {
  const opts = { ...DEFAULTS, ...options };
  const start = Date.now();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeout);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WebScraper/0.1.0 (Genesis Marketplace)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...opts.headers,
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timer);

    const html = await response.text();
    const responseTimeMs = Date.now() - start;

    let text = htmlToText(html);
    if (text.length > opts.maxTextLength) {
      text = text.slice(0, opts.maxTextLength) + '\n[truncated]';
    }

    return {
      url: response.url,
      title: extractTitle(html),
      text,
      links: opts.extractLinks ? extractLinks(html, url) : [],
      metadata: extractMetadata(html),
      statusCode: response.status,
      responseTimeMs,
    };
  } catch (err) {
    clearTimeout(timer);
    throw new Error(`Scrape failed for ${url}: ${(err as Error).message}`);
  }
}

/**
 * Scrape HTML string directly (no fetch needed — useful for testing or when you already have the HTML).
 */
export function scrapeHtml(html: string, sourceUrl = 'http://localhost'): Omit<ScrapeResult, 'statusCode' | 'responseTimeMs'> {
  return {
    url: sourceUrl,
    title: extractTitle(html),
    text: htmlToText(html),
    links: extractLinks(html, sourceUrl),
    metadata: extractMetadata(html),
  };
}
