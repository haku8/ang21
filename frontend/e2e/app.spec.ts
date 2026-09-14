import { test, expect } from '@playwright/test';

test.describe('Item Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the application title', async ({ page }) => {
    await expect(page.locator('mat-toolbar')).toBeVisible();
    await expect(page.getByText('Datenverwaltung')).toBeVisible();
  });

  test('should display the item list table', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
  });

  test('should have a create button', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /neu/i });
    await expect(createButton).toBeVisible();
  });

  test('should open create dialog when clicking create button', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /neu/i });
    await createButton.click();
    await expect(page.locator('mat-dialog')).toBeVisible();
    await expect(page.getByText('Neuer Eintrag')).toBeVisible();
  });

  test('should close dialog when clicking cancel', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /neu/i });
    await createButton.click();
    const cancelButton = page.getByRole('button', { name: /abbrechen/i });
    await cancelButton.click();
    await expect(page.locator('mat-dialog')).not.toBeVisible();
  });

  test('should show form fields in dialog', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /neu/i });
    await createButton.click();
    await expect(page.locator('input[formcontrolname="name"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="text1"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="text2"]')).toBeVisible();
  });

  test('should have search input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Name, Text" i]');
    await expect(searchInput).toBeVisible();
  });

  test('should display table columns correctly', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByText('Text 1')).toBeVisible();
    await expect(page.getByText('Text 2')).toBeVisible();
    await expect(page.getByText('Geändert')).toBeVisible();
    await expect(page.getByText('Aktionen')).toBeVisible();
  });

  test('should have pagination', async ({ page }) => {
    const paginator = page.locator('mat-paginator');
    await expect(paginator).toBeVisible();
  });

  test('should display item count chip', async ({ page }) => {
    const countChip = page.locator('mat-chip');
    await expect(countChip).toBeVisible();
    await expect(countChip).toContainText('Einträge');
  });
});
