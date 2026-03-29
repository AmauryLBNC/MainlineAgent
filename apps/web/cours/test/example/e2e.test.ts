import {test, expect} from '@playwright/test';
test('login puis acces dashboard',async ({page})=>{
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]','password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText(/bienvenue/i)).toBeVisible();

});