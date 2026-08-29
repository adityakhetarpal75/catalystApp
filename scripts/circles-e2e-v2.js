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

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  const stamp = Date.now().toString(36);
  const email = `circ_${stamp}@catalyst.app`;
  const username = `circ_${stamp}`;
  const password = 'password123';

  await page.goto(BASE + '/welcome', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await page.evaluate(() => localStorage.clear());

  await page.goto(BASE + '/signup', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const btn = nodes.find((n) => n.textContent === 'Continue With Email' && n.offsetParent !== null);
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
  await page.getByPlaceholder('name@email.com').fill(email);
  await page.getByPlaceholder('Choose a unique username').fill(username);
  await page.getByPlaceholder('Your first name').fill('Zara');
  await page.getByPlaceholder('Your last name').fill('Cas');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(400);
  await page.getByPlaceholder('At least 8 characters').fill(password);
  await page.getByPlaceholder('Re-enter your password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Open Email' }).click();
  await page.waitForTimeout(600);

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

  await page.goto(BASE + '/channels', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  await page.getByText('Thrifting is done best with the community!').waitFor({ state: 'visible' });
  await shot(page, 'circles-01-welcome.png');
  await page.getByRole('button', { name: 'Go To Feed' }).click();
  await page.waitForTimeout(800);

  await page.getByText('Feed').first().waitFor({ state: 'visible' });
  await shot(page, 'circles-02-feed.png');

  await page.getByTestId('circles-sort').click();
  await page.waitForTimeout(600);
  await page.getByText('Sort by').waitFor({ state: 'visible' });
  await shot(page, 'circles-03-sort.png');
  await tapExact(page, "What's Trending");
  await page.waitForTimeout(400);

  await page.getByTestId('circles-menu').click();
  await page.waitForTimeout(700);
  await page.getByText('My circles').waitFor({ state: 'visible' });
  await shot(page, 'circles-04-side-menu.png');
  await tapExact(page, 'Go back to Feed');
  await page.waitForTimeout(500);

  await page.goto(BASE + '/circles/explore', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await shot(page, 'circles-05-join.png');

  await page.goto(BASE + '/circles/vintage-finds', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await shot(page, 'circles-06-channel.png');

  await page.goto(BASE + '/circles/thread?id=p1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await shot(page, 'circles-07-thread.png');

  await tapExact(page, 'Add products');
  await page.waitForTimeout(800);
  await page.getByText('Vintage Fall Coat').first().click();
  await page.waitForTimeout(200);
  await page.getByText('Floral Baby Tee').first().click().catch(() => {});
  await page.waitForTimeout(200);
  await shot(page, 'circles-08-add-products.png');
  await page.getByRole('button', { name: /^Add/ }).click();
  await page.waitForTimeout(900);
  await shot(page, 'circles-09-thread-attachments.png');

  await page.goto(BASE + '/circles/likes', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await shot(page, 'circles-10-likes.png');

  console.log('DONE: circles screenshots');
  await browser.close();
})().catch((err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
