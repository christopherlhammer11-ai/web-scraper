import { scrapeHtml } from '../src/scraper';

describe('scrapeHtml', () => {
  it('extracts all data from HTML', () => {
    const html = `<html><head><title>My Page</title><meta name="author" content="Test"></head>
    <body><h1>Title</h1><p>Content here.</p><a href="/link">Link</a></body></html>`;

    const result = scrapeHtml(html, 'https://example.com');
    expect(result.title).toBe('My Page');
    expect(result.text).toContain('Content here');
    expect(result.links.length).toBe(1);
    expect(result.metadata['author']).toBe('Test');
  });

  it('handles empty HTML', () => {
    const result = scrapeHtml('');
    expect(result.title).toBe('');
    expect(result.text).toBe('');
    expect(result.links).toHaveLength(0);
  });
});
