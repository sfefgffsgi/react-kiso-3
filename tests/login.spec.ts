import { test, expect } from "@playwright/test";

test("Login Validation Check", async ({ page }) => {
  await page.goto("/login");

  // --- 何も入力しないパターン ---
  // 「サインイン」押下
  await page.locator(".login-button").click();

  // メールアドレスの入力エラーが表示されていることを確認
  await expect(page.locator("#error-message-email")).toHaveText(
    "メールアドレスを入力してください"
  );

  // パスワードの入力エラーが表示されていることを確認
  await expect(page.locator("#error-message-password")).toHaveText(
    "パスワードを入力してください"
  );

  // --- 正常に入力したパターン ---

  // テキストボックスに入力
  await page.locator(".email-input").fill("example@example.com");
  await page.locator(".password-input").fill("example");

  // 「サインイン」押下
  await page.locator(".login-button").click();

  // メールアドレスのエラーが表示されていないことを確認
  await expect(page.locator("#error-message-email")).toBeAttached({
    attached: false,
  });

  // パスワードのエラーが表示されていないことを確認
  await expect(page.locator("#error-message-password")).toBeAttached({
    attached: false,
  });
});
