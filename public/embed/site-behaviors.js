"use strict";
(() => {
  // src/site-consent.ts
  var CONSENT_CHANGE_EVENT = "cr:consent-change";
  var OPEN_SETTINGS_EVENT = "cr:open-cookie-settings";
  var CONSENT_STORAGE_KEY = "cr_cookie_consent";
  function emptyConsentPreferences() {
    return {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
  }
  function readConsentPreferences() {
    try {
      const stored = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) || "null");
      if (stored?.version === 2 && stored.preferences) {
        return {
          necessary: true,
          functional: stored.preferences.functional === true,
          analytics: stored.preferences.analytics === true,
          marketing: stored.preferences.marketing === true
        };
      }
      if (stored?.version === 1 && stored.choice) {
        const accepted = stored.choice === "accept";
        return {
          necessary: true,
          functional: accepted,
          analytics: accepted,
          marketing: accepted
        };
      }
    } catch {
    }
    return null;
  }
  function saveConsentPreferences(preferences, choice) {
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({
          version: 2,
          choice,
          preferences,
          at: (/* @__PURE__ */ new Date()).toISOString()
        })
      );
    } catch {
    }
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGE_EVENT, {
        detail: { version: 2, preferences }
      })
    );
  }
  function initializeCookieBanner() {
    const banner = document.getElementById("cr-cookie-banner");
    if (!banner || banner.dataset.consentInitialized === "true") return;
    const bannerElement = banner;
    bannerElement.dataset.consentInitialized = "true";
    const settings = document.getElementById("cr-cookie-settings");
    const manageButton = bannerElement.querySelector('[data-action="manage"]');
    const saveButton = bannerElement.querySelector('[data-action="save"]');
    const denyButton = bannerElement.querySelector('[data-consent="deny"]');
    const acceptButton = bannerElement.querySelector('[data-consent="accept"]');
    function updateCheckboxes(preferences) {
      ["functional", "analytics", "marketing"].forEach((category) => {
        const checkbox = bannerElement.querySelector(`[name="${category}"]`);
        if (checkbox) checkbox.checked = preferences[category];
      });
    }
    function setSettingsOpen(open) {
      if (!settings) return;
      settings.hidden = !open;
      manageButton?.setAttribute("aria-expanded", String(open));
      denyButton?.classList.toggle("hidden", open);
      acceptButton?.classList.toggle("hidden", open);
      saveButton?.classList.toggle("hidden", !open);
      if (open) settings.querySelector("input:not(:disabled)")?.focus();
    }
    function finish(preferences, choice) {
      saveConsentPreferences(preferences, choice);
      bannerElement.classList.add("hidden");
      setSettingsOpen(false);
    }
    function openSettings(edit = true) {
      updateCheckboxes(readConsentPreferences() || emptyConsentPreferences());
      bannerElement.classList.remove("hidden");
      setSettingsOpen(edit);
    }
    const saved = readConsentPreferences();
    if (saved) updateCheckboxes(saved);
    else bannerElement.classList.remove("hidden");
    manageButton?.addEventListener("click", () => {
      openSettings(manageButton.getAttribute("aria-expanded") !== "true");
    });
    denyButton?.addEventListener("click", () => {
      finish(emptyConsentPreferences(), "deny");
    });
    acceptButton?.addEventListener("click", () => {
      finish({
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true
      }, "accept");
    });
    saveButton?.addEventListener("click", () => {
      const preferences = emptyConsentPreferences();
      ["functional", "analytics", "marketing"].forEach((category) => {
        const checkbox = bannerElement.querySelector(`[name="${category}"]`);
        preferences[category] = checkbox?.checked === true;
      });
      finish(preferences, "custom");
    });
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-open-cookie-settings]")) {
        event.preventDefault();
        openSettings(true);
      }
    });
    window.addEventListener(OPEN_SETTINGS_EVENT, () => openSettings(true));
  }

  // src/site-integrations.ts
  function consentGranted(category, preferences, consentManaged) {
    if (!consentManaged || category === "necessary") return true;
    return preferences?.[category ?? "analytics"] === true;
  }
  function categoryFor(integration) {
    if (integration.consentCategory) return integration.consentCategory;
    return integration.provider === "google-tag-manager" ? "marketing" : "analytics";
  }
  function googleConsentValues(preferences) {
    return {
      analytics_storage: preferences?.analytics ? "granted" : "denied",
      ad_storage: preferences?.marketing ? "granted" : "denied",
      ad_user_data: preferences?.marketing ? "granted" : "denied",
      ad_personalization: preferences?.marketing ? "granted" : "denied"
    };
  }
  function secureOrigin(value, fallback) {
    try {
      const url = new URL(value);
      if (url.protocol === "https:") return url.origin;
    } catch {
    }
    return fallback;
  }
  function ensureDataLayer(name) {
    const target = window;
    const current = target[name];
    const layer = Array.isArray(current) ? current : [];
    target[name] = layer;
    return layer;
  }
  function insertScript(src, config) {
    const script = document.createElement("script");
    script.src = src;
    script.async = config.async !== false;
    if (config.defer === true) script.defer = true;
    if (config.provider === "script") {
      for (const [name, value] of Object.entries(config.attributes ?? {})) {
        if (!/^[a-zA-Z_:][a-zA-Z0-9:._-]*$/.test(name) || /^on/i.test(name) || ["src", "type", "async", "defer"].includes(name.toLowerCase())) {
          continue;
        }
        script.setAttribute(name, value);
      }
    }
    document.head.append(script);
  }
  function loadGoogleTagManager(config, preferences) {
    const containerId = config.containerId?.trim();
    if (!containerId || !/^GTM-[A-Z0-9]+$/i.test(containerId)) return;
    const dataLayerName = config.dataLayerName?.trim() || "dataLayer";
    const dataLayer = ensureDataLayer(dataLayerName);
    dataLayer.push(["consent", "default", googleConsentValues(preferences)]);
    dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const layerQuery = dataLayerName === "dataLayer" ? "" : `&l=${encodeURIComponent(dataLayerName)}`;
    insertScript(
      `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}${layerQuery}`,
      config
    );
  }
  function loadGoogleAnalytics(config, preferences) {
    const measurementId = config.measurementId?.trim();
    if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;
    const dataLayerName = config.dataLayerName?.trim() || "dataLayer";
    const dataLayer = ensureDataLayer(dataLayerName);
    const tag = (...args) => dataLayer.push(args);
    window.gtag = tag;
    tag("consent", "default", googleConsentValues(preferences));
    tag("js", /* @__PURE__ */ new Date());
    tag("config", measurementId, config.options ?? {});
    const layerQuery = dataLayerName === "dataLayer" ? "" : `&l=${encodeURIComponent(dataLayerName)}`;
    insertScript(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}${layerQuery}`,
      config
    );
  }
  function loadPostHog(config) {
    const projectKey = config.projectKey?.trim();
    if (!projectKey) return;
    const posthog = window.posthog ?? [];
    if (!posthog.__SV) {
      const methods = "capture identify alias reset register register_once unregister get_distinct_id get_session_id get_session_replay_url opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing".split(" ");
      posthog._i = [];
      posthog.init = (token, options2) => {
        const instance = posthog;
        for (const method of methods) {
          instance[method] = (...args) => instance.push([method, ...args]);
        }
        const apiHost2 = String(options2.api_host);
        const assetsHost = apiHost2.replace(
          ".i.posthog.com",
          "-assets.i.posthog.com"
        );
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        script.async = true;
        script.src = `${assetsHost.replace(/\/$/, "")}/static/array.js`;
        document.head.append(script);
        posthog._i?.push([token, options2, "posthog"]);
      };
      posthog.__SV = 1;
      window.posthog = posthog;
    }
    const apiHost = secureOrigin(
      config.apiHost?.trim() || "https://us.i.posthog.com",
      "https://us.i.posthog.com"
    );
    const options = {
      ...config.options ?? {},
      api_host: apiHost
    };
    posthog.init?.(projectKey, options);
  }
  function loadIntegration(config, preferences) {
    switch (config.provider) {
      case "google-tag-manager":
        loadGoogleTagManager(config, preferences);
        break;
      case "google-analytics":
        loadGoogleAnalytics(config, preferences);
        break;
      case "posthog":
        loadPostHog(config);
        break;
      case "script": {
        if (!config.src) return;
        try {
          const url = new URL(config.src);
          if (url.protocol !== "https:") return;
          insertScript(url.toString(), config);
        } catch {
        }
        break;
      }
    }
  }
  function updateLoadedIntegrations(preferences, integrations, loaded, consentManaged) {
    window.gtag?.("consent", "update", googleConsentValues(preferences));
    for (const [key, integration] of Object.entries(integrations)) {
      if (!loaded.has(key) || integration.provider !== "google-tag-manager") {
        continue;
      }
      const dataLayerName = integration.dataLayerName?.trim() || "dataLayer";
      ensureDataLayer(dataLayerName).push([
        "consent",
        "update",
        googleConsentValues(preferences)
      ]);
    }
    const posthogIntegration = Object.entries(integrations).find(
      ([key, integration]) => loaded.has(key) && integration.provider === "posthog"
    )?.[1];
    if (posthogIntegration) {
      if (consentGranted(
        categoryFor(posthogIntegration),
        preferences,
        consentManaged
      )) {
        window.posthog?.opt_in_capturing?.();
      } else {
        window.posthog?.opt_out_capturing?.();
      }
    }
  }
  function initializeSiteIntegrations(config) {
    let preferences = config.consentManaged && config.consentStorage !== false ? readConsentPreferences() : null;
    const loaded = /* @__PURE__ */ new Set();
    const unrestrictedPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    const apply = () => {
      for (const [key, integration] of Object.entries(config.integrations)) {
        if (integration.enabled === false || loaded.has(key)) continue;
        const category = categoryFor(integration);
        if (!consentGranted(category, preferences, config.consentManaged)) {
          continue;
        }
        loaded.add(key);
        loadIntegration(
          integration,
          config.consentManaged ? preferences : unrestrictedPreferences
        );
        if (integration.provider === "posthog") {
          if (consentGranted(
            category,
            preferences,
            config.consentManaged
          )) {
            window.posthog?.opt_in_capturing?.();
          } else {
            window.posthog?.opt_out_capturing?.();
          }
        }
      }
    };
    apply();
    window.addEventListener(CONSENT_CHANGE_EVENT, (event) => {
      const detail = event.detail;
      if (!detail?.preferences) return;
      preferences = {
        necessary: true,
        functional: detail.preferences.functional === true,
        analytics: detail.preferences.analytics === true,
        marketing: detail.preferences.marketing === true
      };
      updateLoadedIntegrations(
        preferences,
        config.integrations,
        loaded,
        config.consentManaged
      );
      apply();
    });
  }

  // src/browser-site-behaviors.ts
  var siteBehaviors = Object.freeze({
    initialize(config) {
      if (config.consentBanner) initializeCookieBanner();
      if (Object.keys(config.integrations).length > 0) {
        initializeSiteIntegrations(config);
      }
    }
  });
  Object.defineProperty(globalThis, "ContextRocketSiteBehaviors", {
    configurable: false,
    enumerable: false,
    value: siteBehaviors,
    writable: false
  });
  var configNode = document.getElementById("cr-site-integrations-config");
  if (configNode?.textContent) {
    try {
      siteBehaviors.initialize(JSON.parse(configNode.textContent));
    } catch {
      console.error("ContextRocket site behavior configuration is invalid.");
    }
  }
})();
