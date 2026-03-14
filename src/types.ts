export interface ScrapeResult {
  url: string;
  title: string;
  text: string;
  links: LinkInfo[];
  metadata: Record<string, string>;
  statusCode: number;
  responseTimeMs: number;
}

export interface LinkInfo {
  href: string;
  text: string;
  isExternal: boolean;
}

export interface ScrapeOptions {
  /** Timeout in ms. Default: 10000 */
  timeout?: number;
  /** Extract links. Default: true */
  extractLinks?: boolean;
  /** Max text length. Default: 50000 */
  maxTextLength?: number;
  /** Custom headers */
  headers?: Record<string, string>;
}
