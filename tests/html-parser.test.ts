import { htmlToText, extractTitle, extractMetadata, extractLinks } from '../src/html-parser';

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
  <meta name="description" content="A test page for scraping">
  <meta property="og:title" content="Test OG Title">
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a <strong>test</strong> paragraph with <a href="/about">a link</a>.</p>
  <script>console.log("hidden");</script>
  <style>.hidden { display: none; }</style>
  <p>Second paragraph with an <a href="https://external.com/page">external link</a>.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</body>
</html>`;

describe('htmlToText', () => {
  it('strips HTML tags', () => {
    const text = htmlToText(SAMPLE_HTML);
    expect(text).not.toContain('<');
    expect(text).not.toContain('>');
  });

  it('preserves text content', () => {
    const text = htmlToText(SAMPLE_HTML);
    expect(text).toContain('Hello World');
    expect(text).toContain('test');
    expect(text).toContain('Item 1');
  });

  it('removes script content', () => {
    const text = htmlToText(SAMPLE_HTML);
    expect(text).not.toContain('console.log');
    expect(text).not.toContain('hidden');
  });

  it('removes style content', () => {
    const text = htmlToText(SAMPLE_HTML);
    expect(text).not.toContain('display: none');
  });

  it('decodes HTML entities', () => {
    expect(htmlToText('&amp; &lt; &gt; &quot;')).toBe('& < > "');
  });

  it('handles empty input', () => {
    expect(htmlToText('')).toBe('');
  });
});

describe('extractTitle', () => {
  it('extracts page title', () => {
    expect(extractTitle(SAMPLE_HTML)).toBe('Test Page');
  });

  it('returns empty for no title', () => {
    expect(extractTitle('<html><body>no title</body></html>')).toBe('');
  });
});

describe('extractMetadata', () => {
  it('extracts meta tags', () => {
    const meta = extractMetadata(SAMPLE_HTML);
    expect(meta['description']).toBe('A test page for scraping');
    expect(meta['og:title']).toBe('Test OG Title');
  });

  it('returns empty for no meta', () => {
    expect(extractMetadata('<html></html>')).toEqual({});
  });
});

describe('extractLinks', () => {
  it('extracts links with text', () => {
    const links = extractLinks(SAMPLE_HTML, 'https://example.com');
    expect(links.length).toBe(2);
    expect(links[0].text).toBe('a link');
    expect(links[0].href).toBe('/about');
  });

  it('identifies external links', () => {
    const links = extractLinks(SAMPLE_HTML, 'https://example.com');
    const external = links.find(l => l.isExternal);
    expect(external).toBeDefined();
    expect(external!.href).toContain('external.com');
  });

  it('skips javascript: and mailto: links', () => {
    const html = '<a href="javascript:void(0)">click</a><a href="mailto:test@test.com">email</a>';
    const links = extractLinks(html, 'https://example.com');
    expect(links).toHaveLength(0);
  });
});
