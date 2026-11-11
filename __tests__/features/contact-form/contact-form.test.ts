// @vitest-environment happy-dom
/** CONTACT-001 … CONTACT-002 — static contact form behavior. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeContactForm } from "@/scripts/contact-form";

const labels = {
  required: "Complete the required fields.",
  demoResult: "Demo submission received.",
  unavailable: "Contact form is unavailable.",
  sending: "Sending…",
  success: "Message sent.",
  failure: "Could not send your message.",
  submit: "Send message",
};

function createForm(mode: "demo" | "live"): HTMLFormElement {
  document.body.innerHTML = `
    <form data-mode="${mode}" data-handle="sample-org" data-api-base="https://api.contextrocket.com"
      data-sdk-src="/embed/contact-form.js" data-labels='${JSON.stringify(labels)}'>
      <input name="name" required>
      <input name="email" type="email" required>
      <input name="consent" type="checkbox" required>
      <select name="intent"><option value="contact" selected>Contact</option></select>
      <input name="message">
      <p data-form-status></p>
      <button data-submit type="submit">Send message</button>
    </form>`;
  const form = document.querySelector<HTMLFormElement>("form")!;
  form.querySelector<HTMLInputElement>('input[name="name"]')!.value = "Alex Example";
  form.querySelector<HTMLInputElement>('input[name="email"]')!.value = "alex@example.com";
  form.querySelector<HTMLInputElement>('input[name="consent"]')!.checked = true;
  form.querySelector<HTMLInputElement>('input[name="message"]')!.value = "A question";
  return form;
}

afterEach(() => {
  document.body.innerHTML = "";
  delete window.ContextRocketSDK;
  vi.restoreAllMocks();
});

describe("static contact form", () => {
  it("CONTACT-001: handles demo submissions locally", async () => {
    const form = createForm("demo");
    initializeContactForm(form);

    const event = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(form.querySelector("[data-form-status]")?.textContent).toBe(
      labels.demoResult,
    );
    expect(document.querySelector("script[data-contact-form-sdk]")).toBeNull();
    expect(form.querySelector<HTMLInputElement>('input[name="name"]')?.value).toBe("");
  });

  it("CONTACT-002: waits for the browser bridge and reports live success", async () => {
    const form = createForm("live");
    let resolveSubmission!: (value: { status: string }) => void;
    const submit = vi.fn(() => new Promise<{ status: string }>((resolve) => {
      resolveSubmission = resolve;
    }));
    const createController = vi.fn(() => ({ submit, reset: vi.fn() }));
    const sdk = {
      createContactFormController: createController,
    } as unknown as NonNullable<Window["ContextRocketSDK"]>;
    const appendSpy = vi.spyOn(document.head, "append").mockImplementation((...nodes) => {
      window.ContextRocketSDK = sdk;
      nodes.forEach((node) => {
        if (node instanceof HTMLScriptElement) node.dispatchEvent(new Event("load"));
      });
    });
    initializeContactForm(form);

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(submit).toHaveBeenCalledOnce());

    expect(appendSpy).toHaveBeenCalledOnce();
    expect(form.querySelector<HTMLButtonElement>("[data-submit]")?.disabled).toBe(true);
    expect(createController).toHaveBeenCalledOnce();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({
      apiBaseUrl: "https://api.contextrocket.com",
      orgHandle: "sample-org",
      form: expect.objectContaining({
        name: "Alex Example",
        email: "alex@example.com",
        intent: "contact",
        consent: true,
      }),
    }));
    resolveSubmission({ status: "captured" });
    await vi.waitFor(() => expect(form.querySelector("[data-form-status]")?.textContent).toBe(labels.success));
  });
});
