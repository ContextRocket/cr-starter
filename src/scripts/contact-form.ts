type ContactFormLabels = {
  required: string;
  demoResult: string;
  unavailable: string;
  sending: string;
  success: string;
  failure: string;
  submit: string;
};

type CRBrowserSdk = NonNullable<Window["ContextRocketSDK"]>;
let crContactSdkPromise: Promise<CRBrowserSdk> | undefined;

function customAnswerType(
  value: string | undefined,
): NonNullable<import("@/types/contextrocket-contact-form").ContactFormCustomAnswerField["type"]> | undefined {
  if (value === undefined) return undefined;
  if (value === "text" || value === "number" || value === "boolean" || value === "multi_select") return value;
  throw new TypeError(`Unsupported custom answer type: ${value}`);
}

function loadCRContactSdk(src: string): Promise<CRBrowserSdk> {
  if (window.ContextRocketSDK) return Promise.resolve(window.ContextRocketSDK);
  if (crContactSdkPromise) return crContactSdkPromise;

  const pending = new Promise<CRBrowserSdk>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.contactFormSdk = "";
    script.onload = () => {
      const sdk = window.ContextRocketSDK;
      if (sdk) resolve(sdk);
      else fail(new Error("Contact form SDK did not initialize"));
    };
    script.onerror = () => fail(new Error("Contact form SDK failed to load"));
    function fail(error: Error) {
      script.remove();
      crContactSdkPromise = undefined;
      reject(error);
    }
    document.head.append(script);
  });
  crContactSdkPromise = pending;
  return pending;
}

export function initializeContactForm(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  if (!status || !submit) return;

  const labels = JSON.parse(form.dataset.labels ?? "{}") as ContactFormLabels;
  const label = (key: keyof ContactFormLabels) => labels[key] ?? "";
  const setStatus = (message: string) => {
    status.textContent = message;
    status.hidden = !message;
  };
  const controls = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea",
    ),
  );
  const customAnswerFields = () => {
    type CustomAnswerFields = Parameters<CRBrowserSdk["mapCustomContactAnswers"]>[1];
    const fields = Object.create(null) as CustomAnswerFields;
    for (const control of controls) {
      const key = control.dataset.crCustomAnswer?.trim();
      if (!key) continue;
      const configuredType = customAnswerType(control.dataset.crCustomAnswerType);
      const type = configuredType ||
        (control instanceof HTMLInputElement && control.type === "number"
          ? "number"
          : control instanceof HTMLSelectElement && control.multiple
            ? "multi_select"
            : "text");
      const current = fields[key];
      if (current && (current.type !== type || current.name !== control.name)) {
        throw new TypeError(`Conflicting answer types for ${key}.`);
      }
      if (!control.name) throw new TypeError(`Missing form name for ${key}.`);
      fields[key] = { name: control.name, type };
    }
    return fields;
  };
  let submissionController: ReturnType<NonNullable<Window["ContextRocketSDK"]>["createContactFormController"]> | undefined;
  let isSubmitting = false;

  // Keep the server-rendered no-JavaScript notice visible until this module
  // initializes; then remove the empty status row so it does not leave a gap.
  setStatus("");
  form.addEventListener("invalid", () => {
    setStatus(label("required"));
  }, true);
  form.addEventListener("input", () => {
    submissionController?.reset();
    setStatus("");
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting || !form.reportValidity()) return;

    if (form.dataset.mode === "demo") {
      setStatus(label("demoResult"));
      form.reset();
      return;
    }

    const handle = form.dataset.handle;
    const apiBaseUrl = form.dataset.apiBase;
    const sdkSrc = form.dataset.sdkSrc;
    if (!handle || !apiBaseUrl || !sdkSrc) {
      setStatus(label("unavailable"));
      return;
    }

    // Snapshot before disabling controls; disabled fields are omitted by FormData.
    const values = new FormData(form);
    isSubmitting = true;
    controls.forEach((control) => { control.disabled = true; });
    submit.disabled = true;
    submit.textContent = label("sending");
    setStatus("");

    try {
      const sdk = await loadCRContactSdk(sdkSrc);
      submissionController ??= sdk.createContactFormController();
      const payload = sdk.mapContactFormData(values, { sourceChannel: "website" });
      const customAnswers = sdk.mapCustomContactAnswers(values, customAnswerFields());
      if (Object.keys(customAnswers).length > 0) {
        payload.custom_answers = customAnswers;
      }
      await submissionController.submit({
        apiBaseUrl,
        orgHandle: handle,
        pageUrl: window.location.href,
        referrerUrl: document.referrer,
        form: payload,
      });
      setStatus(label("success"));
      form.reset();
    } catch {
      setStatus(label("failure"));
    } finally {
      isSubmitting = false;
      controls.forEach((control) => { control.disabled = false; });
      submit.disabled = false;
      submit.textContent = label("submit");
    }
  });
}

document.querySelectorAll<HTMLFormElement>("[data-contact-form]").forEach(initializeContactForm);
