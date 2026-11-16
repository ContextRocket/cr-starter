import type { ContactFormData } from "@contextrocket/sdk/contact-form";
/** Render projection only; the input content contract remains the product JSON Schema. */
export interface GeneratedContactFormView {
  id: string;
  title: string;
  description?: string;
  appRef: string;
  orgHandle: string;
  apiOrigin: string;
  fields: {
    name: "name" | "email" | "phone" | "company" | "message";
    label: string;
    fieldType: "text" | "email" | "tel" | "textarea";
    required: boolean;
  }[];
  consentText: string;
  privacyUrl: string;
  successMessage: string;
  validationMessage: string;
  unavailableMessage: string;
  attribution: Pick<
    ContactFormData,
    | "campaign_ref"
    | "landing_page_ref"
    | "site_release_ref"
    | "variant_ref"
    | "controller_mode"
  >;
}
export function generatedContactPayload(
  view: GeneratedContactFormView,
  values: FormData,
): ContactFormData {
  if (values.get("consent") !== "on")
    throw new TypeError("Explicit consent required");
  const name = values.get("name");
  if (typeof name !== "string" || !name.trim())
    throw new TypeError("Name required");
  const form: ContactFormData = {
    name: name.trim(),
    app_id: view.appRef,
    consent: true,
    source_channel: "form",
    ...view.attribution,
  };
  for (const field of view.fields) {
    const value = values.get(field.name);
    if (typeof value !== "string" || (field.required && !value.trim()))
      throw new TypeError("Required field missing");
    if (value.trim()) form[field.name] = value.trim();
  }
  return form;
}
