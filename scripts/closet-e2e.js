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
  const email = `closet_${stamp}@catalyst.app`;
  const username = `closet_${stamp}`;
  const password = 'password123';

  await page.goto(BASE + '/welcome', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.evaluate(() => localStorage.clear());

  // Sign up quickly
  await page.goto(BASE + '/signup', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const btn = nodes.find((n) => n.textContent === 'Continue With Email' && n.offsetParent !== null);
    if (btn) btn.click();
  });
  await page.waitForTimeout(500);
  await page.getByPlaceholder('name@email.com').fill(email);
  await page.getByPlaceholder('Choose a unique username').fill(username);
  await page.getByPlaceholder('Your first name').fill('Zara');
  await page.getByPlaceholder('Your last name').fill('Castillo');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder('At least 8 characters').fill(password);
  await page.getByPlaceholder('Re-enter your password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.waitForTimeout(900);
  await page.getByRole('button', { name: 'Open Email' }).click();
  await page.waitForTimeout(700);

  // Skip onboarding by marking complete
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

  await page.goto(BASE + '/closet', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Walkthrough
  await page.getByText(/Walkthrough video|Closet/i).first().waitFor({ state: 'visible' });
  await shot(page, 'closet-01-walkthrough.png');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(900);

  await page.getByText('My Closet').first().waitFor({ state: 'visible' });
  await shot(page, 'closet-02-main.png');

  // Scroll for sell/rent sections
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(400);
  await shot(page, 'closet-03-shelves.png');

  // Looks tab
  await tapExact(page, 'My Looks');
  await page.waitForTimeout(600);
  await shot(page, 'closet-04-looks.png');

  // Add item
  await page.goto(BASE + '/closet/add-item', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await shot(page, 'closet-05-add-item.png');
  await page.getByPlaceholder('e.g. Ba&sh, Levi’s, Reformation').fill('Ba&sh');
  await page.getByText('Select the type of item').first().click();
  await page.waitForTimeout(300);
  await page.getByText('Coats / Jackets', { exact: true }).click();
  await page.waitForTimeout(300);
  await page
    .getByPlaceholder('Describe your item in as much detail as possible. The more you share, the higher chances of you selling the item!', { exact: true })
    .fill('Vintage Fall Coat — soft wool, perfect for crisp evenings.');
  await page.getByPlaceholder('Enter the price you want for your item').fill('75');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForTimeout(700);
  await shot(page, 'closet-06-add-success.png');
  // Close success modal via X button
  await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const card = nodes.find((n) =>
      n.textContent?.includes('The item was successfully added to your closet!')
    );
    if (!card) return;
    const close = card.querySelectorAll('div');
    // click last pressable-looking child
    for (let i = close.length - 1; i >= 0; i--) {
      const el = close[i];
      if (el.childElementCount <= 2 && el.getBoundingClientRect().width < 50) {
        el.click();
        return;
      }
    }
  });
  await page.waitForTimeout(500);

  // Item detail
  await page.goto(BASE + '/item/1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await shot(page, 'closet-07-item-detail.png');

  // Edit closet
  await page.goto(BASE + '/closet/edit', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await shot(page, 'closet-08-edit.png');

  // Settings
  await page.goto(BASE + '/profile/settings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await shot(page, 'closet-09-settings.png');

  // Edit profile
  await page.goto(BASE + '/profile/edit', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await shot(page, 'closet-10-edit-profile.png');

  // Sales / trades
  await page.goto(BASE + '/profile/sales', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await shot(page, 'closet-11-sales.png');

  await page.goto(BASE + '/profile/trades', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await shot(page, 'closet-12-trades.png');

  console.log('DONE: closet screenshots');
  await browser.close();
})().catch((err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
