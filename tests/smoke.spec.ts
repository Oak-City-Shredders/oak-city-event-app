import { test, expect, devices } from 'playwright/test';

test.use({
  ...devices['iPhone 13'], // 📱 emulate iPhone
});

test('View All Racers', async ({ page }) => {
  await page.goto('/home');
  await page.getByRole('button', { name: 'View All' }).click();
  await page.getByRole('link', { name: 'Purchase Ticket' }).click();
});

test('Test banner navigation', async ({ page }) => {
  await page.goto('/home');

  //click on the notification bell
  await page.getByRole('banner').getByRole('link').first().click();
  await page.getByRole('button', { name: 'back' }).click();

  //click on Sign In in banner
  await page.getByRole('banner').getByRole('link').nth(1).click();
  await page.getByRole('button', { name: 'back' }).click();
});
