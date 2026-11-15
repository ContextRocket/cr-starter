import { createContactFormController } from "@contextrocket/sdk/contact-form";
import {
  generatedContactPayload,
  type GeneratedLeadFormView,
} from "@/lib/generated-lead-form";
/** SDK validates the capture receipt and owns retry identity; HTTP 200 alone is not success. */
export function initializeGeneratedLeadForm(
  form: HTMLFormElement,
  controller = createContactFormController(),
) {
  const view = JSON.parse(form.dataset.config ?? "") as GeneratedLeadFormView;
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  if (!status || !submit) return;
  status.textContent = "";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    if (!form.reportValidity()) {
      status.textContent = view.validationMessage;
      return;
    }
    const values = new FormData(form);
    submit.disabled = true;
    try {
      await controller.submit({
        apiBaseUrl: view.apiOrigin,
        orgHandle: view.orgHandle,
        pageUrl: window.location.href,
        referrerUrl: document.referrer,
        form: generatedContactPayload(view, values),
      });
      status.textContent = view.successMessage;
      form.dataset.captureStatus = "captured";
      form.reset();
    } catch {
      status.textContent = view.unavailableMessage;
      form.dataset.captureStatus = "error";
    } finally {
      submit.disabled = false;
    }
  });
}
if (typeof document !== "undefined")
  document
    .querySelectorAll<HTMLFormElement>("[data-generated-lead-form]")
    .forEach((form) => initializeGeneratedLeadForm(form));
