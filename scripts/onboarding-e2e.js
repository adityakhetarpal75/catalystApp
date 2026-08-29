const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8081';
const OUT = '/workspace/artifacts';

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  console.log('SHOT', name);
}

async function tapText(page, text) {
  await page.evaluate((t) => {
    const nodes = Array.from(document.querySelectorAll('div, span, button, p'));
    const el = nodes.find((n) => n.textContent?.trim() === t && n.offsetParent !== null);
    if (el) el.click();
  }, text);
}

async function selectOption(page, optionText) {
  // Open select modal by finding placeholder "Selection" or field, then pick option
  await page.getByText(optionText, { exact: true }).first().click();
  await page.waitForTimeout(300);
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
  const email = `onboard_${stamp}@catalyst.app`;
  const username = `onboard_${stamp}`;
  const password = 'password123';

  // Fresh session
  await page.goto(BASE + '/welcome', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => localStorage.clear());

  // Sign up
  await page.goto(BASE + '/signup', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('div'));
    const btn = nodes.find((n) => n.textContent === 'Continue With Email' && n.offsetParent !== null);
    if (btn) btn.click();
  });
  await page.waitForTimeout(600);
  await page.getByPlaceholder('name@email.com').fill(email);
  await page.getByPlaceholder('Choose a unique username').fill(username);
  await page.getByPlaceholder('Your first name').fill('Juli');
  await page.getByPlaceholder('Your last name').fill('Rivera');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(600);
  await page.getByPlaceholder('At least 8 characters').fill(password);
  await page.getByPlaceholder('Re-enter your password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Open Email' }).click();
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: /Get Started|Continue|Open Catalyst/i }).click().catch(() => {});
  await page.waitForTimeout(500);

  // Force into onboarding personal-info
  await page.goto(BASE + '/personal-info', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.getByText('Tell us about yourself!').first().waitFor({ state: 'visible' });
  await shot(page, 'onboarding-01-personal-info-empty.png');

  // Fill personal info
  const userInput = page.getByPlaceholder('This is how you appear in Catalyst');
  await userInput.fill('Juli');
  // Location select
  await page.getByText('Selection').first().click();
  await page.waitForTimeout(400);
  await page.getByText('New York, NY', { exact: true }).click();
  await page.waitForTimeout(400);
  await shot(page, 'onboarding-01-personal-info-filled.png');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(1000);

  // Community
  await page.getByText('Help us find your community').first().waitFor({ state: 'visible' });
  for (const opt of ['Alaskan Native', 'American Indian', 'Indian', 'Latinx / Hispanic']) {
    await tapText(page, opt);
    await page.waitForTimeout(200);
  }
  await shot(page, 'onboarding-02-community.png');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(800);

  // Age (title may use a curly apostrophe)
  await page.getByText(/your age\?/i).first().waitFor({ state: 'visible' });
  await shot(page, 'onboarding-03-age-pick.png');
  await page.getByText('PICK', { exact: true }).click();
  await page.waitForTimeout(500);
  // Month
  await page.getByText('Select month').first().click();
  await page.waitForTimeout(300);
  await page.getByText('March', { exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByText('Select day').first().click();
  await page.waitForTimeout(300);
  await page.getByText('15', { exact: true }).first().click();
  await page.waitForTimeout(300);
  await page.getByText('Select year').first().click();
  await page.waitForTimeout(300);
  await page.getByText('1998', { exact: true }).click();
  await page.waitForTimeout(400);
  await shot(page, 'onboarding-03-age-filled.png');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(800);

  // Style
  await page.getByText('How would you describe your style?').first().waitFor({ state: 'visible' });
  await tapText(page, 'Basics Gal');
  await page.waitForTimeout(300);
  await shot(page, 'onboarding-04-style.png');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(800);

  // Goals
  await page.getByText('What are your main thrifting goals?').first().waitFor({ state: 'visible' });
  await tapText(page, 'Find a costume');
  await page.waitForTimeout(300);
  await shot(page, 'onboarding-05-goals.png');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(800);

  // Sizes
  await page.getByText('What are your sizes?').first().waitFor({ state: 'visible' });
  await page.getByText('Selection').first().click();
  await page.waitForTimeout(300);
  await page.getByText('M', { exact: true }).first().click();
  await page.waitForTimeout(300);
  await shot(page, 'onboarding-06-sizes.png');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(800);

  // Brands
  await page.getByText('Choose the brands you love').first().waitFor({ state: 'visible' });
  await tapText(page, 'Zara');
  await tapText(page, 'Nike');
  await page.waitForTimeout(300);
  await shot(page, 'onboarding-07-brands.png');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(800);

  // Follow
  await page.getByText('Follow fellow thrifters').first().waitFor({ state: 'visible' });
  await page.getByText('Follow', { exact: true }).first().click();
  await page.waitForTimeout(400);
  await shot(page, 'onboarding-08-follow.png');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(800);

  // Channels
  await page.getByText('Join channels').first().waitFor({ state: 'visible' });
  await page.getByText('Join', { exact: true }).first().click();
  await page.waitForTimeout(400);
  await shot(page, 'onboarding-09-channels.png');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1500);

  // Should land on home
  await shot(page, 'onboarding-10-home.png');
  console.log('DONE: onboarding flow screenshots captured');
  await browser.close();
})().catch((err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
