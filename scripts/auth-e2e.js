const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8081';
const OUT = '/opt/cursor/artifacts';
const SHOTS = '/workspace/screenshots';

async function shot(page, name) {
  await page.screenshot({ path: path.join(SHOTS, name), fullPage: false });
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(SHOTS, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 400, height: 850 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  await page.goto(BASE + '/welcome', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.getByText('Hi there!').first().waitFor({ state: 'visible' });
  await shot(page, 'auth-welcome.png');
  console.log('OK: welcome');

  await page.getByText('Continue With Email').click();
  await page.waitForTimeout(800);
  await page.getByPlaceholder('name@email.com').fill('demo@catalyst.app');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(800);
  await page.getByPlaceholder('••••••••').fill('password123');
  await page.getByRole('button', { name: 'Log In' }).click();

  // success screen then home
  await page.waitForTimeout(2500);
  await page.getByText('Hi Julia').first().waitFor({ state: 'visible' });
  await shot(page, 'auth-home-after-login.png');
  console.log('OK: signed in → home');

  // Settings
  await page.goto(BASE + '/profile/settings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.getByText('Signed in as').first().waitFor({ state: 'visible' });
  await page.getByText('demo@catalyst.app').first().waitFor({ state: 'visible' });
  await shot(page, 'auth-settings-signed-in.png');
  console.log('OK: settings shows session');

  await page.getByText('Sign Out', { exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByText('Sign out?').waitFor({ state: 'visible' });
  await shot(page, 'auth-signout-confirm.png');
  console.log('OK: confirm modal');

  // Confirm button in modal — last Sign Out button
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await page.waitForTimeout(1200);
  await page.getByText('Hi there!').first().waitFor({ state: 'visible' });
  console.log('OK: signed out → welcome');

  // Guard
  await page.goto(BASE + '/home', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.getByText('Hi there!').first().waitFor({ state: 'visible' });
  console.log('OK: /home guarded → welcome');

  // Persist
  await page.getByText('Continue With Email').click();
  await page.waitForTimeout(600);
  await page.getByPlaceholder('name@email.com').fill('persist@catalyst.app');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(600);
  await page.getByPlaceholder('••••••••').fill('password123');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(2500);
  await page.getByText('Hi Julia').first().waitFor({ state: 'visible' });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.getByText('Hi Julia').first().waitFor({ state: 'visible' });
  await shot(page, 'auth-session-persists.png');
  console.log('OK: session persists across reload');

  await browser.close();
  console.log('ALL AUTH CHECKS PASSED');
})().catch(async (err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
