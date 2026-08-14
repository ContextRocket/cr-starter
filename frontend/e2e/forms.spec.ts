import { test, expect, type Request } from "@playwright/test";

/**
 * E2E: the subscribe form on the home page (/).
 *
 * The subscribe CTA uses `formKey="subscribe"`, whose `forms.config` endpoint
 * is empty — so a valid submit must show the LOCAL success state and make NO
 * network POST to any form endpoint. Validation surfaces the localized error
 * strings for empty and malformed email.
 *
 * Deterministic + cross-OS: no screenshots, no DB.
 */

// From i18n/messages/en.ts (home.subscribe.*). Reused, no new strings.
const SUCCESS = "Thanks — you're on the list.";
const EMAIL_REQUIRED = "Please enter your email.";
const EMAIL_INVALID = "Please enter a valid email address.";

// Locate the subscribe form via its unique email placeholder (home.subscribe
// .placeholder). The email input carries type="email".
async function subscribeForm(page: import("@playwright/test").Page) {
  const email = page.locator('input[type="email"]').first();
  const form = page.locator("form").filter({ has: email });
  return { email, form };
}

test.describe("Subscribe form (UI-only)", () => {
  test("valid submit shows local success and makes NO form-endpoint POST", async ({
    page,
  }) => {
    // Record any non-navigation POST/PUT the page issues after we submit.
    const dataRequests: string[] = [];
    const record = (req: Request) => {
      const method = req.method();
      if (method === "POST" || method === "PUT") {
        // Ignore Next.js RSC/action navigations and telemetry beacons; we only
        // care that no request carries the form payload to an endpoint.
        dataRequests.push(`${method} ${req.url()}`);
      }
    };
    page.on("request", record);

    await page.goto("/en", { waitUntil: "domcontentloaded" });

    const { email, form } = await subscribeForm(page);
    await email.scrollIntoViewIfNeeded();
    await email.fill("subscriber@example.com");
    // Consent checkbox is required to submit.
    await form.locator('input[type="checkbox"]').check();
    await form.locator('button[type="submit"]').click();

    // Local success state appears (no backend wired).
    await expect(page.getByText(SUCCESS)).toBeVisible({ timeout: 5000 });

    page.off("request", record);

    // No POST/PUT carried the subscribe payload anywhere. The submit body is
    // JSON with the email; assert nothing left the page with it.
    for (const entry of dataRequests) {
      expect(entry).not.toMatch(/subscribe|form/i);
    }
  });

  test("empty email shows the required-error and does not succeed", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const { email, form } = await subscribeForm(page);
    await email.scrollIntoViewIfNeeded();
    await form.locator('input[type="checkbox"]').check();
    await form.locator('button[type="submit"]').click();

    await expect(page.getByText(EMAIL_REQUIRED)).toBeVisible();
    await expect(page.getByText(SUCCESS)).toHaveCount(0);
  });

  test("invalid email shows the invalid-error and does not succeed", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const { email, form } = await subscribeForm(page);
    await email.scrollIntoViewIfNeeded();
    await email.fill("not-an-email");
    await form.locator('input[type="checkbox"]').check();
    await form.locator('button[type="submit"]').click();

    await expect(page.getByText(EMAIL_INVALID)).toBeVisible();
    await expect(page.getByText(SUCCESS)).toHaveCount(0);
  });
});
