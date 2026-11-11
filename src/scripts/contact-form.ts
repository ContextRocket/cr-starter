type ContactFormLabels = {
  required: string;
  demoResult: string;
  unavailable: string;
  sending: string;
  success: string;
  failure: string;
  submit: string;
};

type ContactIntent = "contact" | "appointment" | "demo" | "support";

function loadContactSdk(src: string): Promise<NonNullable<Window["ContextRocketSDK"]>> {
  if (window.ContextRocketSDK) return Promise.resolve(window.ContextRocketSDK);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.contactFormSdk = "";
    script.onload = () => {
      const sdk = window.ContextRocketSDK;
      if (sdk) resolve(sdk);
      else reject(new Error("Contact form SDK did not initialize"));
    };
    script.onerror = () => reject(new Error("Contact form SDK failed to load"));
    document.head.append(script);
  });
}

export function initializeContactForm(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  if (!status || !submit) return;

  const labels = JSON.parse(form.dataset.labels ?? "{}") as ContactFormLabels;
  const label = (key: keyof ContactFormLabels) => labels[key] ?? "";
  const controls = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea",
    ),
  );
  let submissionController: ReturnType<NonNullable<Window["ContextRocketSDK"]>["createContactFormController"]> | undefined;
  let isSubmitting = false;

  status.textContent = "";
  form.addEventListener("invalid", () => {
    status.textContent = label("required");
  }, true);
  form.addEventListener("input", () => {
    submissionController?.reset();
    status.textContent = "";
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting || !form.reportValidity()) return;

    if (form.dataset.mode === "demo") {
      status.textContent = label("demoResult");
      form.reset();
      return;
    }

    const handle = form.dataset.handle;
    const apiBaseUrl = form.dataset.apiBase;
    const sdkSrc = form.dataset.sdkSrc;
    if (!handle || !apiBaseUrl || !sdkSrc) {
      status.textContent = label("unavailable");
      return;
    }

    // Snapshot before disabling controls; disabled fields are omitted by FormData.
    const values = new FormData(form);
    isSubmitting = true;
    controls.forEach((control) => { control.disabled = true; });
    submit.disabled = true;
    submit.textContent = label("sending");
    status.textContent = "";

    try {
      const sdk = await loadContactSdk(sdkSrc);
      submissionController ??= sdk.createContactFormController();
      await submissionController.submit({
        apiBaseUrl,
        orgHandle: handle,
        pageUrl: window.location.href,
        referrerUrl: document.referrer,
        form: {
          name: String(values.get("name") ?? "").trim(),
          email: String(values.get("email") ?? "").trim(),
          phone: String(values.get("phone") ?? "").trim() || undefined,
          intent: String(values.get("intent") ?? "contact") as ContactIntent,
          message: String(values.get("message") ?? "").trim() || undefined,
          source_channel: "website",
          consent: true,
        },
      });
      status.textContent = label("success");
      form.reset();
    } catch {
      status.textContent = label("failure");
    } finally {
      isSubmitting = false;
      controls.forEach((control) => { control.disabled = false; });
      submit.disabled = false;
      submit.textContent = label("submit");
    }
  });
}

document.querySelectorAll<HTMLFormElement>("[data-contact-form]").forEach(initializeContactForm);
