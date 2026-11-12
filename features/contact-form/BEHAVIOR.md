# Contact form: behavior contract

## CONTACT-001: Demo mode stays local

Given a valid contact form configured for demo mode,
When a visitor submits it,
Then the localized demo result is shown and the form is reset,
And no SDK script or network submission is started.

## CONTACT-002: Live mode loads the SDK before submitting

Given a valid contact form configured for live mode,
When the browser SDK is not yet loaded and the visitor submits,
Then the bridge is loaded before the request controller is created,
And the form remains disabled while the request is pending,
And success or failure is shown using localized messages.

Never silently discard a live submission because the bridge has not finished
loading.

## CONTACT-003: Demo mode discloses local handling before data entry

Given the starter contact form is configured for demo mode,
When a visitor opens the contact page,
Then a localized note explains before the fields that entered information is
not sent or saved.

The note uses semantic theme roles so automatically generated site themes can
style it without coupling form behavior to a specific brand palette.
