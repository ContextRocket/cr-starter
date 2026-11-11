"use strict";
(() => {
  // src/contact-form.ts
  var UTM_KEYS = ["source", "medium", "campaign", "content", "term"];
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
        body: JSON.stringify({ ...form, org_handle: handle }),
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
