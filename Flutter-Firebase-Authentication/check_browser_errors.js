const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log("Navigating to http://localhost:8087...");
  try {
    await page.goto('http://localhost:8087', { waitUntil: 'networkidle2', timeout: 10000 });
  } catch(e) {
    console.log("Navigation timeout or error:", e.message);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  console.log("Done.");
  await browser.close();
})();
