# WebDesk V2 Architecture

## Product goal
WebDesk V2 is a modular web desktop. Core owns the desktop shell; every product card is an isolated feature package. Adding or removing one card must not require editing core source and must not break another card.

## Target tree
```text
webdesk-v2/
  index.html
  core/
    bootstrap.js
    registry.js
    card-host.js
    app-host.js
    window-manager.js
    workspace.js
    storage.js
    event-bus.js
    theme.js
    i18n.js
    background.js
    card-sdk.js
  cards/
    weather/
      manifest.json
      card.js
      card.css
      app.js
      app.css
      assets/
    global-weather/
      manifest.json
      card.js
      card.css
      app.js
      app.css
      assets/
    image-studio/
    text/
    table/
    json/
    date/
  generated/
    cards.registry.json
  scripts/
    generate-card-registry.mjs
    validate-cards.mjs
  schemas/
    card-manifest.schema.json
  shared/
    styles/
    icons/
  tests/
    card-isolation/
    smoke/
```

## Non-negotiable boundaries
1. `core/` never imports a concrete card package. It consumes only generated registry metadata.
2. Every card lives at `cards/<card-id>/` and owns all of its implementation/assets.
3. A card may import `core/card-sdk.js` public APIs, but may not import another card or query/mutate another card's DOM.
4. Every card has a unique `manifest.json`; this is the only discovery/registration source.
5. Card state uses a namespaced/versioned storage key: `webdesk:v2:card:<id>:v<schemaVersion>`.
6. Card code is lazy-loaded only when placed/opened. Function Center reads registry metadata only.
7. Card load/render errors are caught per card. A failed card renders a local recovery surface; Shell remains usable.
8. Desktop uses movable/resizable card hosts. Mobile/tablet uses document-flow cards and full-screen/Bottom Sheet apps. Page height is content-driven, never capped to one viewport.

## Manifest contract
Required fields:
- `id`, `version`, `schemaVersion`
- localized `name` and `description`
- `icon`, `category`, `kind`, `order`
- `entry.card`, optional `entry.app`, optional styles
- `defaultSize.desktop`, `defaultSize.mobile`
- `platforms`
- `capabilities`
- `permissions`

Manifest validation rejects duplicate IDs, missing entry files, invalid paths, unsupported capabilities, and schema errors before registry generation.

## Automatic discovery
`generate-card-registry.mjs` scans `cards/*/manifest.json`, validates every package and generates `generated/cards.registry.json`. Core fetches only this registry. Therefore a new valid folder automatically appears in Function Center/card catalog without editing `core/bootstrap.js` or any hard-coded app list.

A malformed card is excluded with a build diagnostic. At runtime each valid card still has its own error boundary, load timeout, abort lifecycle and cleanup lifecycle.

## Card SDK
Public SDK surface should remain intentionally small:
- `storage.get/set/remove()` scoped to current card ID
- `events.emit/on()` namespaced by card ID unless an event is explicitly public
- `openApp()` / `closeApp()`
- `requestResize()` for desktop only
- `getLocale()` / `subscribeLocale()`
- `getTheme()` / `subscribeTheme()`
- `notify()`
- capability-gated services such as location/network/clipboard

No card receives raw Workspace, Window Manager or other card instances.

## Lifecycle
Card: `load -> mount -> activate -> deactivate -> unmount`.
App: `load -> open -> suspend/resume -> close`.
Every listener, timer, observer and request must be disposed on unmount/close. Core supplies an AbortSignal to make cleanup enforceable.

## Migration order
1. Architecture: manifest schema, registry generator, Card SDK, Card Host, error boundary.
2. Shell: Workspace, Window Manager, persistence, background, Simplified/Traditional Chinese, responsive behavior.
3. `weather`.
4. `global-weather` (typhoon/wind/radar/satellite/precipitation).
5. `image-studio`.
6. `text`.
7. `table`.
8. `json`.
9. `date`.
10. Remaining low-frequency utilities and games.

The legacy root WebDesk stays available until V2 passes acceptance. Migration is feature-by-feature, not a big-bang replacement.

## Definition of done for every new card
- manifest/schema valid and unique
- registry auto-discovers it without core edits
- add/remove/re-add works
- failure does not break Shell or sibling cards
- state is isolated and survives reload
- desktop drag/resize works where applicable
- mobile card-flow and app full-screen/Bottom Sheet work
- no fixed page-height regression
- lazy loading verified
- no leaked timers/listeners after removal
- smoke test and performance budget pass

## Product acceptance gates
### Gate A — Architecture
Registry discovery, schema validation, SDK, isolation, storage namespaces and error boundaries are complete.

### Gate B — Core UX
Workspace/window/card hosts, unlimited-height layout, mobile/tablet flow, background and zh-CN/zh-HK switching are stable.

### Gate C — P0 cards
Weather and Global Weather reach or exceed legacy functionality and are performant on mobile.

### Gate D — Productivity cards
Image Studio, Text, Table, JSON and Date migrated and individually testable.

### Gate E — Cutover
Regression matrix passes on desktop/tablet/mobile; old runtime patch stack is not required by V2; only then may root WebDesk be switched to V2.
