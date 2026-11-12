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
  const customAnswersFor = (values: FormData) => {
    const fields = new Map<string, { type: string; values: string[]; names: Set<string> }>();
    for (const control of controls) {
      const key = control.dataset.crCustomAnswer?.trim();
      if (!key) continue;
      const type = control.dataset.crCustomAnswerType ||
        (control instanceof HTMLInputElement && control.type === "number"
          ? "number"
          : control instanceof HTMLSelectElement && control.multiple
            ? "multi_select"
            : "text");
      const current = fields.get(key) ?? { type, values: [], names: new Set<string>() };
      if (current.type !== type) {
        throw new TypeError(`Conflicting answer types for ${key}.`);
      }
      if (control.name && !current.names.has(control.name)) {
        current.names.add(control.name);
        current.values.push(
          ...values
            .getAll(control.name)
            .filter((value): value is string => typeof value === "string")
            .map((value) => value.trim())
            .filter(Boolean),
        );
      }
      fields.set(key, current);
    }

    const answers: Record<string, string | number | boolean | string[]> = {};
    for (const [key, field] of fields) {
      if (field.type === "boolean") {
        const markedControls = controls.filter(
          (control) => control.dataset.crCustomAnswer?.trim() === key,
        );
        answers[key] = markedControls.some(
          (control) => control instanceof HTMLInputElement && control.checked,
        );
      } else if (!field.values.length) {
        continue;
      } else if (field.type === "number") {
        if (field.values.length !== 1 || !Number.isFinite(Number(field.values[0]))) {
          throw new TypeError(`Invalid numeric answer for ${key}.`);
        }
        answers[key] = Number(field.values[0]);
      } else if (field.type === "multi_select") {
        answers[key] = field.values;
      } else {
        answers[key] = field.values.length === 1 ? field.values[0]! : field.values;
      }
    }
    return answers;
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
      const customAnswers = customAnswersFor(values);
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
