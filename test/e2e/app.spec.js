import { test, expect } from '@playwright/test';

test.describe('UndrPin - Full User Journey', () => {
  test('should load landing page and key calls to action', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/UndrPin/);
    await expect(page.locator('h1')).toContainText(/Find the city through what is actually happening/);
    await expect(page.locator('nav')).toContainText('Features');
    await expect(page.locator('nav')).toContainText('How It Works');
    await expect(page.getByRole('link', { name: 'Enter the Map' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Sign In to Create|Create Your Pin/ })).toBeVisible();
  });

  test('should show the auth form', async ({ page }) => {
    await page.goto('/auth');

    await expect(page.getByRole('heading', { level: 2, name: /Welcome back|Create your account/ })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('form').getByRole('button', { name: /Log in|Create account/ })).toBeVisible();
  });

  test('should validate signup inputs before submit', async ({ page }) => {
    await page.goto('/auth');

    await page.getByRole('button', { name: 'Sign up', exact: true }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Create your account' })).toBeVisible();

    await page.locator('form').getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByText('Please enter your name.')).toBeVisible();
    await expect(page.getByText('Email is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();

    await page.locator('input[name="displayName"]').fill('Nihad');
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('input[name="password"]').fill('123');
    await page.locator('form').getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
    await expect(page.getByText('Password should be at least 6 characters.')).toBeVisible();
  });

  test('should validate login inputs before submit', async ({ page }) => {
    await page.goto('/auth');

    await page.locator('form').getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByText('Email is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });

  test('should render the map experience shell', async ({ page }) => {
    await page.goto('/app');

    await expect(page.locator('.map-screen')).toBeVisible();
    await expect(page.locator('header.map-header')).toBeVisible();
    await expect(page.locator('input[type="search"][name="search"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to my location' })).toBeVisible();
    await expect(page.locator('.maplibregl-map, canvas').first()).toBeVisible();
  });

  test('should keep the shell visible while the map canvas resolves', async ({ page }) => {
    await page.goto('/app', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('header.map-header')).toBeVisible();
    await expect(page.locator('input[type="search"][name="search"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to my location' })).toBeVisible();
    await expect(
      page.locator('.map-canvas-loading, .maplibregl-map, canvas').first()
    ).toBeVisible();
  });

  test('should open settings from the map sidebar', async ({ page }) => {
    await page.goto('/app');

    const settingsButton = page.getByRole('button', { name: 'Settings', exact: true });
    await expect(settingsButton).toBeVisible();
    await settingsButton.click();

    await expect(page.locator('aside[aria-label="Settings"]')).toBeVisible();
    await expect(page.getByRole('switch')).toHaveCount(3);
  });

  test('should send guests to auth when they try to open the create flow directly', async ({ page }) => {
    await page.goto('/app?openCreate=1');

    await page.waitForURL('**/auth');
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('heading', { level: 2, name: /Welcome back|Create your account/ })).toBeVisible();
  });

  test('should redirect guests from add-pin route to auth', async ({ page }) => {
    await page.goto('/add-pin');

    await page.waitForURL('**/auth');
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('heading', { level: 2, name: /Welcome back|Create your account/ })).toBeVisible();
  });

  test('should show the not found page', async ({ page }) => {
    await page.goto('/non-existent-page');

    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to map' })).toBeVisible();
  });
});
