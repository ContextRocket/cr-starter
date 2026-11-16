// @vitest-environment happy-dom
import { expect, it } from "vitest";
import {
  createContactFormController,
  submitContactFormWithAttribution,
} from "@contextrocket/sdk/contact-form";
import { initializeGeneratedContactForm } from "../../../src/scripts/generated-contact-form";
import type { GeneratedContactFormView } from "../../../src/lib/generated-contact-form";
it("GENERATED-003: submits exact App attribution and never shows success for an invalid receipt", async () => {
  const view: GeneratedContactFormView = {
    id: "contact",
    title: "Fixture",
    appRef: "11111111-1111-4111-8111-111111111111",
    orgHandle: "example-workshop",
    apiOrigin: "https://api.example.test",
    fields: [
      { name: "name", label: "Name", fieldType: "text", required: true },
    ],
    consentText: "Fixture consent",
    privacyUrl: "https://example.test/privacy/",
    successMessage: "receipt-confirmed",
    validationMessage: "invalid-input",
    unavailableMessage: "capture-unavailable",
    attribution: {
      site_release_ref: "release-1",
      controller_mode: "organization",
    },
  };
  const form = document.createElement("form");
  form.dataset.config = JSON.stringify(view);
  form.innerHTML =
    '<input name="name" value="Example" required><input type="checkbox" name="consent" checked required><p data-form-status role="status"></p><button type="submit">Submit</button>';
  document.body.append(form);
  const requests: { url: string; body: Record<string, unknown> }[] = [];
  let valid = false;
  const fetcher: typeof fetch = async (url, options) => {
    requests.push({
      url: String(url),
      body: JSON.parse(String(options?.body)),
    });
    return new Response(
      JSON.stringify(
        valid
          ? {
              contact_id: "contact-1",
              status: "captured",
              delivery_state: "accepted",
              follow_up_state: "human_follow_up",
            }
          : { ok: true },
      ),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  const controller = createContactFormController((options) =>
    submitContactFormWithAttribution({ ...options, fetcher }),
  );
  initializeGeneratedContactForm(form, controller);
  form.dispatchEvent(new Event("submit", { cancelable: true }));
  await expect.poll(() => form.dataset.captureStatus).toBe("error");
  expect(form.querySelector('[role="status"]')?.textContent).toBe(
    view.unavailableMessage,
  );
  expect(requests[0].url).toBe(
    "https://api.example.test/api/orgs/example-workshop/contacts",
  );
  expect(requests[0].body).toMatchObject({
    app_id: view.appRef,
    site_release_ref: "release-1",
    controller_mode: "organization",
    consent: true,
    name: "Example",
  });
  valid = true;
  form.dispatchEvent(new Event("submit", { cancelable: true }));
  await expect.poll(() => form.dataset.captureStatus).toBe("captured");
  expect(form.querySelector('[role="status"]')?.textContent).toBe(
    view.successMessage,
  );
  form.remove();
});
