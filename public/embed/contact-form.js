"use strict";
(() => {
  // src/contact-form.ts
  var UTM_KEYS = ["source", "medium", "campaign", "content", "term"];
  var CONTACT_INTENTS = [
    "contact",
    "appointment",
    "demo",
    "support",
    "other"
  ];
  var DEFAULT_CONTACT_FIELDS = {
    name: "name",
    firstName: "",
    lastName: "",
    email: "email",
    phone: "phone",
    message: "message",
    intent: "intent",
    consent: "consent"
  };
  function validateCustomAnswers(answers) {
    if (!answers || Object.keys(answers).length === 0) return void 0;
    const entries = Object.entries(answers);
    if (entries.length > 50) {
      throw new TypeError("At most 50 custom contact answers are allowed.");
    }
    for (const [key, value] of entries) {
      if (!key || key.length > 64) {
        throw new TypeError("A custom contact answer key is invalid.");
      }
      const serialized = JSON.stringify(value);
      if (serialized === void 0 || serialized.length > 4096) {
        throw new TypeError("A custom contact answer is invalid or too large.");
      }
    }
    if (JSON.stringify(answers).length > 16384) {
      throw new TypeError("Custom contact answers exceed the allowed size.");
    }
    return answers;
  }
  function formText(values, fieldName) {
    if (!fieldName) return "";
    const value = values.get(fieldName);
    return typeof value === "string" ? value.trim() : "";
  }
  function mapCustomContactAnswers(values, fields) {
    const answers = /* @__PURE__ */ Object.create(null);
    for (const [key, field] of Object.entries(fields)) {
      if (!key || !field.name) {
        throw new TypeError("A custom contact answer field mapping is invalid.");
      }
      const selected = values.getAll(field.name).filter((value) => typeof value === "string").map((value) => value.trim()).filter(Boolean);
      const type = field.type ?? "text";
      if (type === "boolean") {
        if (selected.length > 1) {
          throw new TypeError(`Boolean contact answer ${key} has multiple values.`);
        }
        const value = selected[0]?.toLowerCase();
        if (value && !["1", "true", "yes", "on", "checked", "0", "false", "no", "off"].includes(value)) {
          throw new TypeError(`Boolean contact answer ${key} is invalid.`);
        }
        answers[key] = value ? !["0", "false", "no", "off"].includes(value) : false;
      } else if (type === "number") {
        if (!selected.length) continue;
        if (selected.length !== 1 || !Number.isFinite(Number(selected[0]))) {
          throw new TypeError(`Numeric contact answer ${key} is invalid.`);
        }
        answers[key] = Number(selected[0]);
      } else if (type === "multi_select") {
        if (selected.length) answers[key] = selected;
      } else if (type === "text") {
        if (!selected.length) continue;
        if (selected.length !== 1) {
          throw new TypeError(`Text contact answer ${key} has multiple values.`);
        }
        answers[key] = selected[0];
      } else {
        throw new TypeError(`Custom contact answer ${key} has an unsupported type.`);
      }
    }
    return validateCustomAnswers(answers) ?? {};
  }
  function mapContactFormData(values, options = {}) {
    const customAnswers = validateCustomAnswers(options.customAnswers);
    const fields = { ...DEFAULT_CONTACT_FIELDS, ...options.fields };
    const consent = formText(values, fields.consent).toLowerCase();
    if (!["1", "true", "yes", "on", "checked"].includes(consent)) {
      throw new TypeError("Explicit consent is required.");
    }
    const directName = formText(values, fields.name);
    const splitName = [
      formText(values, fields.firstName),
      formText(values, fields.lastName)
    ].filter(Boolean).join(" ");
    const name = directName || splitName;
    const rawIntent = formText(values, fields.intent);
    if (rawIntent && !CONTACT_INTENTS.includes(rawIntent)) {
      throw new TypeError("The contact form intent is not supported.");
    }
    const intentValue = rawIntent ? rawIntent : options.defaultIntent;
    return {
      name,
      email: formText(values, fields.email) || void 0,
      phone: formText(values, fields.phone) || void 0,
      message: formText(values, fields.message) || void 0,
      ...intentValue ? { intent: intentValue } : {},
      ...options.sourceChannel?.trim() ? { source_channel: options.sourceChannel.trim() } : {},
      ...customAnswers ? { custom_answers: customAnswers } : {},
      consent: true
    };
  }
  function extractContactAttribution(pageUrl, referrerUrl) {
    let page;
    try {
      page = new URL(pageUrl);
    } catch {
      return {};
    }
    if (page.protocol !== "http:" && page.protocol !== "https:") return {};
    const attribution = {};
    const sourceUrl = `${page.origin}${page.pathname}`;
    if (sourceUrl.length <= 2048) attribution.source_url = sourceUrl;
    if (referrerUrl) {
      try {
        const referrer = new URL(referrerUrl);
        if ((referrer.protocol === "http:" || referrer.protocol === "https:") && referrer.origin.length <= 2048) {
          attribution.referrer_origin = referrer.origin;
        }
      } catch {
      }
    }
    for (const key of UTM_KEYS) {
      const value = page.searchParams.get(`utm_${key}`)?.trim().slice(0, 128);
      if (value) attribution[`utm_${key}`] = value;
    }
    return attribution;
  }
  var ContactFormError = class extends Error {
    constructor(message, status, code) {
      super(message);
      this.status = status;
      this.code = code;
      this.name = "ContactFormError";
    }
  };
  function isContactFormReceipt(payload) {
    if (!payload || typeof payload !== "object") return false;
    const receipt = payload;
    return typeof receipt.lead_id === "string" && receipt.lead_id.trim().length > 0 && receipt.status === "captured" && (receipt.delivery_state === "queued" || receipt.delivery_state === "duplicate") && receipt.follow_up_state === "human_follow_up";
  }
  async function submitContactForm({
    apiBaseUrl,
    orgHandle,
    form,
    idempotencyKey,
    signal,
    fetcher = fetch
  }) {
    const handle = orgHandle.trim().replace(/^@/, "").toLowerCase();
    if (!handle) throw new TypeError("An organization handle is required.");
    if (!form.consent) throw new TypeError("Explicit consent is required.");
    const customAnswers = validateCustomAnswers(form.custom_answers);
    const endpoint = new URL("/api/apps/leads/capture", apiBaseUrl);
    endpoint.searchParams.set("org_handle", handle);
    const headers = new Headers({
      accept: "application/json",
      "content-type": "application/json"
    });
    if (idempotencyKey) headers.set("idempotency-key", idempotencyKey);
    let response;
    try {
      response = await fetcher(endpoint, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        headers,
        body: JSON.stringify({
          ...form,
          ...customAnswers ? { custom_answers: customAnswers } : {},
          org_handle: handle
        }),
        signal
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      throw new ContactFormError("The contact form could not be submitted.", 0, "NETWORK_ERROR");
    }
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const detail = payload && typeof payload === "object" ? payload.detail : void 0;
      const code = typeof detail === "string" ? detail : detail && typeof detail === "object" && typeof detail.code === "string" ? String(detail.code) : "LEAD_CAPTURE_FAILED";
      throw new ContactFormError("The contact form could not be submitted.", response.status, code);
    }
    if (!isContactFormReceipt(payload)) {
      throw new ContactFormError("The contact form response was invalid.", response.status, "INVALID_RESPONSE");
    }
    return payload;
  }
  function submitContactFormWithAttribution({
    pageUrl,
    referrerUrl,
    form,
    ...options
  }) {
    return submitContactForm({
      ...options,
      form: {
        ...form,
        ...extractContactAttribution(pageUrl, referrerUrl)
      }
    });
  }
  function createContactFormController(submitter = submitContactFormWithAttribution, createKey = () => globalThis.crypto.randomUUID()) {
    let pendingFingerprint;
    let pendingKey;
    let inFlight;
    const reset = () => {
      pendingFingerprint = void 0;
      pendingKey = void 0;
    };
    return {
      reset,
      submit(options) {
        const fingerprint = JSON.stringify({
          apiBaseUrl: options.apiBaseUrl,
          orgHandle: options.orgHandle.trim().replace(/^@/, "").toLowerCase(),
          form: options.form,
          pageUrl: String(options.pageUrl),
          referrerUrl: options.referrerUrl
        });
        if (inFlight?.fingerprint === fingerprint) return inFlight.promise;
        if (pendingFingerprint !== fingerprint || !pendingKey) {
          pendingFingerprint = fingerprint;
          pendingKey = createKey();
        }
        const requestKey = pendingKey;
        const request = submitter({ ...options, idempotencyKey: requestKey }).then(
          (receipt) => {
            if (pendingKey === requestKey) reset();
            return receipt;
          }
        );
        const current = { fingerprint, promise: request };
        inFlight = current;
        void request.finally(() => {
          if (inFlight === current) inFlight = void 0;
        }).catch(() => void 0);
        return request;
      }
    };
  }

  // src/browser-contact-form.ts
  var browserSdk = Object.freeze({
    createContactFormController,
    mapContactFormData,
    mapCustomContactAnswers,
    ContactFormError,
    extractContactAttribution,
    submitContactForm,
    submitContactFormWithAttribution
  });
  Object.defineProperty(globalThis, "ContextRocketSDK", {
    configurable: false,
    enumerable: false,
    value: browserSdk,
    writable: false
  });
})();
