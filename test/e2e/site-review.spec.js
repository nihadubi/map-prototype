import { test, expect } from '@playwright/test';

const MOCK_PINS = [
  {
    id: 'pin-event-1',
    type: 'event',
    title: 'Late Night Set',
    description: 'A live electronic session in central Baku.',
    category: 'Music',
    city: 'baku',
    coordinates: [40.4093, 49.8671],
    lat: 40.4093,
    lng: 49.8671,
    createdBy: 'UndrPin Crew',
    createdAtLabel: 'Just added',
    createdAt: '2026-04-18T18:00:00.000Z',
    eventDate: '2026-04-18',
    startTime: '22:00',
    placeType: null,
    status: 'active',
  },
  {
    id: 'pin-place-1',
    type: 'place',
    title: 'Courtyard Coffee',
    description: 'Quiet courtyard coffee spot with a strong neighborhood feel.',
    category: 'Cafe',
    city: 'baku',
    coordinates: [40.4048, 49.8722],
    lat: 40.4048,
    lng: 49.8722,
    createdBy: 'UndrPin Crew',
    createdAtLabel: 'Today',
    createdAt: '2026-04-18T12:00:00.000Z',
    eventDate: null,
    startTime: null,
    placeType: 'cafe',
    status: 'active',
  },
];

function installPageErrorTrap(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error);
  });
  return pageErrors;
}

async function expectNoPageErrors(pageErrors) {
  expect(
    pageErrors.map((error) => error.message)
  ).toEqual([]);
}

async function mockPinsFeed(page) {
  await page.route('**/rest/v1/pins*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_PINS),
    });
  });
}

test.describe('UndrPin - Site Review', () => {
  test('should cover landing routes, anchors, and CTA navigation', async ({ page }) => {
    const pageErrors = installPageErrorTrap(page);

    await page.goto('/');

    await expect(page).toHaveTitle(/UndrPin/);
    await expect(page.locator('h1')).toContainText(/Find the city through what is actually happening/);
    await expect(page.locator('#features')).toBeVisible();
    await expect(page.locator('#how-it-works')).toBeVisible();

    await page.getByRole('link', { name: 'Features' }).click();
    await expect(page).toHaveURL(/#features$/);

    await page.getByRole('link', { name: 'How It Works' }).click();
    await expect(page).toHaveURL(/#how-it-works$/);

    await page.goto('/landing');
    await expect(page).toHaveURL(/\/$/);

    await page.getByRole('link', { name: 'Open the Map' }).click();
    await expect(page).toHaveURL(/\/app$/);
    await expect(page.locator('.map-screen')).toBeVisible();

    await expectNoPageErrors(pageErrors);
  });

  test('should cover authentication modes and client-side validation', async ({ page }) => {
    const pageErrors = installPageErrorTrap(page);

    await page.goto('/auth');

    await expect(page.getByRole('heading', { level: 2, name: 'Welcome back' })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();

    await page.locator('form').getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByText('Email is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();

    await page.getByRole('button', { name: 'Sign up', exact: true }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Create your account' })).toBeVisible();

    await page.locator('input[name="displayName"]').fill('Nihad');
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('input[name="password"]').fill('123');
    await page.getByRole('button', { name: 'Show password' }).click();
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'text');

    await page.locator('form').getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
    await expect(page.getByText('Password should be at least 6 characters.')).toBeVisible();

    await page.getByRole('button', { name: 'Log in instead' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Welcome back' })).toBeVisible();

    await expectNoPageErrors(pageErrors);
  });

  test('should cover the guest map experience, settings persistence, and save redirect', async ({ page }) => {
    const pageErrors = installPageErrorTrap(page);
    await mockPinsFeed(page);

    await page.goto('/app');

    await expect(page.locator('.map-screen')).toBeVisible();
    await expect(page.locator('header.map-header')).toBeVisible();
    await expect(page.locator('input[type="search"][name="search"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to my location' })).toBeVisible();
    await expect(page.locator('.map-canvas-loading, .maplibregl-map, canvas').first()).toBeVisible();

    const settingsButton = page.getByRole('button', { name: 'Settings', exact: true });
    await settingsButton.click();
    const settingsPanel = page.locator('aside[aria-label="Settings"]');
    await expect(settingsPanel).toBeVisible();

    const firstSwitch = page.getByRole('switch').nth(0);
    const initialValue = await firstSwitch.getAttribute('aria-checked');
    await firstSwitch.click();
    await expect(firstSwitch).toHaveAttribute('aria-checked', initialValue === 'true' ? 'false' : 'true');

    await page.getByRole('button', { name: 'Close settings' }).evaluate((element) => {
      element.click();
    });
    await expect(settingsPanel).not.toHaveClass(/is-open/);

    await page.reload();
    await settingsButton.click();
    await expect(page.getByRole('switch').nth(0)).toHaveAttribute(
      'aria-checked',
      initialValue === 'true' ? 'false' : 'true'
    );
    await page.getByRole('button', { name: 'Close settings' }).evaluate((element) => {
      element.click();
    });

    await page.locator('input[name="search"]').fill('zzznomatch123');
    await expect(page.getByText('No pins match this view. Try clearing search or switching filters.')).toBeVisible();
    await page.locator('input[name="search"]').fill('');
    await expect(page.getByText('No pins match this view. Try clearing search or switching filters.')).toHaveCount(0);

    await page.getByRole('button', { name: /^Events/ }).click();
    await expect(page.getByRole('button', { name: /^Events/ })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: /^Saved/ }).click();
    await expect(page.getByRole('button', { name: /^Saved/ })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: /^Discover/ }).click();
    await expect(page.getByRole('button', { name: /^Discover/ })).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/app?createdPinId=pin-event-1');
    await expect(page.locator('.map-pin-card')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Late Night Set' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open Directions' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share pin' })).toBeVisible();

    await page.getByRole('button', { name: /Save pin|Remove saved pin/ }).click();
    await page.waitForURL('**/auth');
    await expect(page.getByRole('heading', { level: 2, name: /Welcome back|Create your account/ })).toBeVisible();

    await expectNoPageErrors(pageErrors);
  });

  test('should cover guest-protected redirects and not found recovery', async ({ page }) => {
    const pageErrors = installPageErrorTrap(page);

    await page.goto('/home');
    await expect(page).toHaveURL(/\/app$/);

    await page.goto('/?openCreate=1');
    await page.waitForURL('**/auth');
    await expect(page).toHaveURL(/\/auth$/);

    await page.goto('/app?openCreate=1');
    await page.waitForURL('**/auth');
    await expect(page).toHaveURL(/\/auth$/);

    await page.goto('/add-pin');
    await page.waitForURL('**/auth');
    await expect(page).toHaveURL(/\/auth$/);

    await page.goto('/non-existent-page');
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to map' }).click();
    await expect(page).toHaveURL(/\/$/);

    await expectNoPageErrors(pageErrors);
  });
});
