# Embed widget: behavior contract

## WIDGET-001: Launcher shows one icon at a time

Given the embed launcher is closed,
When it is visible,
Then only the open (chat) icon is shown.

Given the panel is open,
When the launcher is visible,
Then only the close icon is shown.

Never stack both icons as visible at once.

## WIDGET-002: Panel open and close

Given the launcher is closed,
When the customer activates the launcher,
Then the chat panel is visible.

When the customer activates the launcher again (or the panel close control),
Then the panel is hidden.

## WIDGET-003: Demo mode works offline

Given chat mode is demo / canned,
When the customer sends a prompt,
Then a canned response appears without requiring a live network agent.

Never require a server API proxy for the static demo.
