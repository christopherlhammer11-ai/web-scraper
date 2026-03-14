import { LinkInfo } from './types';

/**
 * Lightweight HTML-to-text converter. No dependencies.
 * Strips tags, decodes entities, extracts links and metadata.
 */
export function htmlToText(html: string): string {
  let result = html;

  // Remove script and style blocks entirely
  result = result.replace(/<script[\s\S]*?<\/script>/gi, '');
  result = result.replace(/<style[\s\S]*?<\/style>/gi, '');
  result = result.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

  // Convert common block elements to newlines
  result = result.replace(/<\/?(?:p|div|br|hr|h[1-6]|li|tr|blockquote|section|article|header|footer|nav|main)\s*\/?>/gi, '\n');

  // Strip remaining tags
  result = result.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  result = decodeEntities(result);

  // Clean up whitespace
  result = result.replace(/[ \t]+/g, ' ');
  result = result.replace(/\n\s*\n/g, '\n\n');
  result = result.trim();

  return result;
}

export function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeEntities(match[1].trim()) : '';
}

export function extractMetadata(html: string): Record<string, string> {
  const meta: Record<string, string> = {};
  const regex = /<meta\s+(?:name|property)\s*=\s*["']([^"']+)["']\s+content\s*=\s*["']([^"']+)["']/gi;

  let match;
  while ((match = regex.exec(html)) !== null) {
    meta[match[1]] = decodeEntities(match[2]);
  }

  // Also catch reversed attribute order: content before name
  const regex2 = /<meta\s+content\s*=\s*["']([^"']+)["']\s+(?:name|property)\s*=\s*["']([^"']+)["']/gi;
  while ((match = regex2.exec(html)) !== null) {
    meta[match[2]] = decodeEntities(match[1]);
  }

  return meta;
}

export function extractLinks(html: string, baseUrl: string): LinkInfo[] {
  const links: LinkInfo[] = [];
  const regex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let baseDomain: string;
  try {
    baseDomain = new URL(baseUrl).hostname;
  } catch {
    baseDomain = '';
  }

  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();

    // Skip anchors, javascript:, mailto:
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) continue;

    let isExternal = false;
    try {
      const resolved = new URL(href, baseUrl);
      isExternal = resolved.hostname !== baseDomain;
    } catch {
      // relative URL
    }

    links.push({ href, text: text || href, isExternal });
  }

  return links;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}
