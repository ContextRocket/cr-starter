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
