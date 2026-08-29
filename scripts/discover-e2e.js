const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8081';
const OUT = '/opt/cursor/artifacts';

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  console.log('SHOT', name);
}

async function tapExact(page, text) {
  await page.evaluate((t) => {
    const nodes = Array.from(document.querySelectorAll('div, span, button, p, a'));
    const el = nodes.find((n) => n.textContent?.trim() === t && n.offsetParent !== null);
    if (el) el.click();
  }, text);
}

async function ensureAuth(page) {
  const stamp = Date.now().toString(36);
  await page.goto(BASE + '/welcome', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE + '/signup', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const btn = nodes.find((n) => n.textContent === 'Continue With Email' && n.offsetParent !== null);
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
  await page.getByPlaceholder('name@email.com').fill(`disc_${stamp}@c.app`);
  await page.getByPlaceholder('Choose a unique username').fill(`disc_${stamp}`);
  await page.getByPlaceholder('Your first name').fill('Disc');
  await page.getByPlaceholder('Your last name').fill('User');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(400);
  await page.getByPlaceholder('At least 8 characters').fill('password123');
  await page.getByPlaceholder('Re-enter your password').fill('password123');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'Open Email' }).click();
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const sessionRaw = localStorage.getItem('catalyst.auth.session');
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      session.onboardingComplete = true;
      localStorage.setItem('catalyst.auth.session', JSON.stringify(session));
      const users = JSON.parse(localStorage.getItem('catalyst.auth.users') || '[]');
      const idx = users.findIndex((u) => u.id === session.id);
      if (idx >= 0) {
        users[idx].onboardingComplete = true;
        localStorage.setItem('catalyst.auth.users', JSON.stringify(users));
      }
    }
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  await ensureAuth(page);

  await page.goto(BASE + '/discover', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.getByText('Discover').first().waitFor({ state: 'visible' });
  await shot(page, 'discover-01-trending.png');

  // scroll to featured creator
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(400);
  await shot(page, 'discover-02-featured.png');

  await tapExact(page, 'Watch');
  await page.waitForTimeout(600);
  await shot(page, 'discover-03-watch.png');

  await tapExact(page, 'Read');
  await page.waitForTimeout(600);
  await shot(page, 'discover-04-read.png');

  await tapExact(page, 'Explore Brands');
  await page.waitForTimeout(600);
  await shot(page, 'discover-05-brands.png');

  await page.goto(BASE + '/discover/article?id=a1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await shot(page, 'discover-06-article.png');

  await page.goto(BASE + '/discover/brand?name=Murad', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await shot(page, 'discover-07-brand.png');

  await page.goto(BASE + '/discover/creator', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await shot(page, 'discover-08-creator.png');

  console.log('DONE: discover screenshots');
  await browser.close();
})().catch((err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
