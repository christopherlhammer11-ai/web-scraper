#!/usr/bin/env node
import { Command } from 'commander';
import { scrape } from './scraper';

const program = new Command();
program.name('webscrape').description('Lightweight web scraper').version('0.1.0');

program
  .command('fetch')
  .description('Scrape a URL and extract text')
  .argument('<url>', 'URL to scrape')
  .option('--json', 'Output full JSON result')
  .option('--links', 'Show extracted links')
  .option('--timeout <ms>', 'Timeout in ms', '10000')
  .action(async (url: string, opts: Record<string, string | boolean>) => {
    try {
      const result = await scrape(url, { timeout: parseInt(opts['timeout'] as string, 10) });
      if (opts['json']) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`Title: ${result.title}`);
        console.log(`Status: ${result.statusCode} (${result.responseTimeMs}ms)`);
        console.log(`---`);
        console.log(result.text);
        if (opts['links'] && result.links.length) {
          console.log(`\n--- Links (${result.links.length}) ---`);
          for (const link of result.links.slice(0, 20)) {
            console.log(`  ${link.isExternal ? '[EXT]' : '[INT]'} ${link.text} → ${link.href}`);
          }
        }
      }
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  });

program.parse();
