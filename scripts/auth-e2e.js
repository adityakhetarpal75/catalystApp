const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8081';
const OUT = '/opt/cursor/artifacts';

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 400, height: 850 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  page.setDefaultTimeout(25000);

  const stamp = Date.now().toString(36);
  const email = `user_${stamp}@catalyst.app`;
  const username = `user_${stamp}`;
  const password = 'password123';

  await page.goto(BASE + '/welcome', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => localStorage.clear());

  // ---- SIGN UP (direct route to avoid stacked screens) ----
  await page.goto(BASE + '/signup', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  // Landing mode — click email
  await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const btn = nodes.find((n) => n.textContent === 'Continue With Email' && n.offsetParent !== null);
    if (btn) btn.click();
  });
  await page.waitForTimeout(800);
  await page.getByPlaceholder('name@email.com').fill(email);
  await page.getByPlaceholder('Choose a unique username').fill(username);
  await page.getByPlaceholder('Your first name').fill('Alex');
  await page.getByPlaceholder('Your last name').fill('Rivera');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(800);
  await page.getByPlaceholder('At least 8 characters').fill(password);
  await page.getByPlaceholder('Re-enter your password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: 'Open Email' }).click();
  await page.waitForTimeout(800);
  await page.getByText('Alex').first().waitFor({ state: 'visible' });
  await shot(page, 'real-auth-signup-success.png');
  console.log('OK: signup created real user Alex');

  // Mark onboarding complete in stored session/account so we can test Home with real name
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
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.getByText('Hi Alex').first().waitFor({ state: 'visible' });
  await shot(page, 'real-auth-home.png');
  console.log('OK: home shows Hi Alex (not Julia)');

  // Settings shows real account
  await page.goto(BASE + '/profile/settings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.getByText(email).first().waitFor({ state: 'visible' });
  await page.getByText(`@${username}`).first().waitFor({ state: 'visible' });
  await shot(page, 'real-auth-settings.png');
  console.log('OK: settings shows real email/username');

  // Sign out
  await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const el = nodes.find((n) => n.textContent === 'Sign Out' && n.offsetParent !== null);
    if (el) el.click();
  });
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await page.waitForTimeout(1200);
  await page.getByText('Hi there!').first().waitFor({ state: 'visible' });
  console.log('OK: signed out');

  // Login with username + password
  await page.goto(BASE + '/login-email', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.getByPlaceholder('name@email.com or username').fill(username);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(600);
  await page.getByPlaceholder('Your password').fill(password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(2500);
  await page.getByText('Hi Alex').first().waitFor({ state: 'visible' });
  console.log('OK: login with username+password shows Alex');

  // Wrong password rejected
  await page.goto(BASE + '/profile/settings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const el = nodes.find((n) => n.textContent === 'Sign Out' && n.offsetParent !== null);
    if (el) el.click();
  });
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await page.waitForTimeout(1000);

  await page.goto(BASE + '/login-email', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.getByPlaceholder('name@email.com or username').fill(email);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(600);
  await page.getByPlaceholder('Your password').fill('wrong-password');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(800);
  await page.getByText('Incorrect password').first().waitFor({ state: 'visible' });
  console.log('OK: wrong password rejected');

  await browser.close();
  console.log('ALL REAL AUTH CHECKS PASSED');
})().catch((err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
