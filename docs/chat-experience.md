# Chat Experience Design: the slick conversational surface

Design contract for the chat surface (FAB, full page, embed). Everything
here is vertical-agnostic; forks supply copy and theming. Companion to
`docs/customizing-design.md` (tokens) and the chat components in
`frontend/components/chat/`.

## Principles

1. **Answer first, structure second.** A chat bubble is not a document.
   The agent's lead is 2-4 conversational sentences that answer the
   question; structured depth (lists, sections) renders inside an
   expandable "More detail" region below the lead. Never a top-level
   heading inside a bubble.
2. **Every dead end is a tappable next step.** The agent never ends with a
   prose question ("Is there something specific...?"); it ends with
   suggestion pills the user can tap.
3. **Trust is a visible surface.** Citations, source provenance, and
   guidance states are structured UI elements, not prose claims.
4. **Value before identity.** Guests get real answers immediately;
   registration is offered at value moments, never as a gate.

## Components

### Icebreakers (empty state)

- 3-5 curated starter chips + a one-line welcome, both from the surface
  configuration (per-brand), localized. Chips are real questions in the
  user's voice, phrased educationally, drawn from the corpus's strongest
  topics so the first answer is guaranteed to impress.
- Tapping a chip sends it as the user message (visible in the thread), so
  the interaction teaches the input model.
- Config shape: `{ welcome_message, icebreakers: [{label, message}] }` per
  locale; served with the surface config, overridable in site config for
  the standalone starter.

### Suggestion pills (follow-ups)

- After each assistant message: 2-3 contextual follow-up chips.
- Sourced from the agent's structured output (a `suggestions` array
  alongside the answer), not parsed from prose. Transport: stream metadata
  on the completed event.
- Rendering: quiet pill row under the bubble, disappears once tapped or
  when the user types. Never more than one row.

### Citation pills + source sheet

- Numbered citation pills per assistant message (existing component),
  DEDUPED BY DOCUMENT: one pill per source document even when multiple
  sections were cited; the sheet lists the specific sections.
- Tapping a pill opens a source sheet: title, publisher, date, license
  note when available (provenance fields from the platform), the cited
  section excerpts, and an "Open source" link. Provenance-forward display
  is the trust moment; render honestly what the platform provides and
  omit what it does not (no empty label rows).

### Policy-class card (the guidance slot)

- A structured card slot rendered BELOW the answer bubble, driven by typed
  policy-class events from the platform (escalation, guidance tiers,
  refusal classes), never parsed from prose.
- Severity styling comes from the class (danger / attention / neutral
  tokens); copy comes from the class content key (brand-authored,
  versioned). The card may carry one CTA (e.g. "Prepare a question list").
- The slot renders nothing when no class fired. Forks style it with theme
  tokens; the component owns layout only.

### Conversion moments (guest -> registered)

- Guests chat immediately (guest JWT). A dismissible inline nudge card
  appears only at configured VALUE moments:
  - after N substantive turns ("Save this conversation"),
  - when the user triggers a save/export-shaped action (question list,
    summary),
  - on return visits without an account.
- One nudge per session maximum; dismissal is remembered. Config:
  `{ turn_threshold, value_actions: [...], max_per_session: 1 }`.
- The nudge copy states the concrete benefit ("keep your history"), never
  a generic signup plea. Registration preserves the conversation (the
  guest-conversion flow already guarantees continuity).

### FAB behaviors (defaults, fork-customizable)

- **Expand to full screen**: the FAB panel carries an expand toggle that
  grows it to a full-screen chat (same thread, same state; the /chat route
  and the panel are one component in two layouts). Collapse returns to the
  panel without losing scroll position. Default ON; forks can disable.
- **Link handling**: links in answers and source sheets NEVER navigate the
  host page. Default: open in a new tab (`target="_blank"` +
  `rel="noopener noreferrer"`). Optional per-fork mode: in-panel preview
  sheet (title, favicon, description, "open in new tab" action) so the
  user never leaves the conversation; the embed/widget context forces the
  new-tab default (an iframe must not navigate its parent).
- Both are surface-config/site-config driven defaults, not code forks.

### Latency + streaming (existing three-tier stack)

- Keep: thinking pill, slow-response reassurance tiers, blur-to-sharp
  entrance, streaming text transition.
- Add: suggestion pills and the policy card animate in AFTER the text
  completes (staggered, ~150ms), so the answer reads first.

## Typography in bubbles

- No h1/h2 markdown rendering inside bubbles: map headings to bold
  paragraph lead-ins; cap list nesting at one level; tables become
  definition rows. The "More detail" expander holds anything longer than
  ~6 lines after the lead.

## What stays vertical-specific (forks)

- Icebreaker and nudge copy, guidance-class copy, theming, and which
  policy classes exist. The components, config shapes, transport, and
  interaction patterns above are the generic surface.
