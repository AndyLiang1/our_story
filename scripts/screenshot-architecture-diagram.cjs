/**
 * Generates docs/architecture-diagram.png from architecture-diagram-preview.html
 * so the README diagram stays in sync with the HTML.
 *
 * Run from repo root: node scripts/screenshot-architecture-diagram.cjs
 * Or: npm run screenshot-diagram
 */

const path = require('path');
const fs = require('fs');

async function main() {
  const puppeteer = require('puppeteer');
  const root = process.cwd();
  const htmlPath = path.join(root, 'architecture-diagram-preview.html');
  const outPath = path.join(root, 'docs', 'architecture-diagram.png');
  const outDir = path.dirname(outPath);

  if (!fs.existsSync(htmlPath)) {
    console.error('architecture-diagram-preview.html not found in project root');
    process.exit(1);
  }
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900 });
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 15000 });

    await page.waitForSelector('.mermaid svg', { timeout: 10000 });

    await page.evaluate(() => {
      return new Promise((resolve) => {
        const imgs = document.querySelectorAll('.mermaid img');
        if (imgs.length === 0) return resolve();
        let loaded = 0;
        const onLoad = () => {
          loaded++;
          if (loaded >= imgs.length) resolve();
        };
        imgs.forEach((img) => {
          if (img.complete) onLoad();
          else img.addEventListener('load', onLoad);
        });
        setTimeout(resolve, 500);
      });
    });

    const clip = await page.evaluate(() => {
      const svg = document.querySelector('.mermaid svg');
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    });

    if (!clip) {
      console.error('Could not find .mermaid svg');
      process.exit(1);
    }

    await page.screenshot({
      path: outPath,
      clip,
      omitBackground: true,
    });

    console.log('Saved:', outPath);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
