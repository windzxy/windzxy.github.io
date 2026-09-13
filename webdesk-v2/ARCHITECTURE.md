# WebDesk V2 Architecture

## Product goal
WebDesk V2 is a modular web desktop. Core owns the desktop shell; every product card is an isolated feature package. Adding or removing one card must not require editing core source and must not break another card.

A core product principle is **three-device independence**: Desktop, Tablet and Mobile are three first-class product surfaces. They may share data, domain logic and Card SDK services, but they do not share a single forced layout. Every card and app must deliberately design for all three surfaces.

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
    platform.js
  cards/
    weather/
      manifest.json
      shared/
        model.js
        services.js
      desktop/
        card.js
        card.css
        app.js
        app.css
      tablet/
        card.js
        card.css
        app.js
        app.css
      mobile/
        card.js
        card.css
        app.js
        app.css
      assets/
    global-weather/
      manifest.json
      shared/
      desktop/
      tablet/
      mobile/
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
    platform/
```

## Non-negotiable boundaries
1. `core/` never imports a concrete card package. It consumes only generated registry metadata.
2. Every card lives at `cards/<card-id>/` and owns all of its implementation/assets.
3. A card may import `core/card-sdk.js` public APIs, but may not import another card or query/mutate another card's DOM.
4. Every card has a unique `manifest.json`; this is the only discovery/registration source.
5. Card state uses a namespaced/versioned storage key: `webdesk:v2:card:<id>:v<schemaVersion>`.
6. Card code is lazy-loaded only when placed/opened. Function Center reads registry metadata only.
7. Card load/render errors are caught per card. A failed card renders a local recovery surface; Shell remains usable.
8. Page height is content-driven and never capped to one viewport.
9. **Desktop, Tablet and Mobile are separate presentation targets.** Do not solve tablet/mobile by shrinking or overriding desktop absolute-position CSS.
10. Shared logic belongs in `cards/<id>/shared/`; platform folders contain only platform presentation/interaction code. Shared code must not assume DOM shape or screen size.

## Three-device product contract
### Desktop
- Free-position desktop cards, drag + resize, multiple simultaneous cards/windows.
- High information density is allowed.
- Hover, mouse, keyboard shortcuts and right-click/context interactions may be used when they have touch-safe alternatives.
- Apps may open as resizable windows; large tools can support maximize/full-screen.
- Card content should provide useful glanceable data without embedding an entire heavy app.

### Tablet
- Tablet is **not a large phone and not a small PC**.
- Use responsive grid/stack layouts with touch-first hit targets and optional pointer/keyboard enhancement.
- Cards may have medium information density and can use two-column compositions when space permits.
- Apps prefer large sheets, split views or full-screen workspaces instead of tiny desktop windows.
- Landscape and portrait each require explicit acceptance checks.

### Mobile
- Natural vertical card flow; no desktop absolute-position layout.
- Compact, glanceable cards with clear primary actions.
- Heavy tools/maps/games open as full-screen apps or bottom sheets.
- One-handed touch ergonomics, safe-area support and no hover dependency.
- Card height is content-driven; no giant blank desktop-sized shells.

### Platform detection
Core `platform.js` exposes semantic modes (`desktop`, `tablet`, `mobile`) based on viewport, pointer capability and orientation, not user-agent strings alone. Cards consume the resolved platform through Card SDK and never run their own conflicting global breakpoints.

## Card design requirements
Every card must define three intentional designs before it is considered complete:
- **Desktop card**: full glanceable state, desktop actions, optional richer secondary data.
- **Tablet card**: touch-first medium-density layout, portrait/landscape behavior.
- **Mobile card**: compact summary, one primary CTA, minimal secondary controls.

The three designs should share visual identity (icon, color language, typography hierarchy) but may differ in component composition, order, visible fields and interaction pattern.

A new card is rejected if its tablet/mobile implementation is only a scaled desktop card or if it relies on CSS overrides to hide broken desktop layout.

## Manifest contract
Required fields:
- `id`, `version`, `schemaVersion`
- localized `name` and `description`
- `icon`, `category`, `kind`, `order`
- platform entries for `desktop`, `tablet`, `mobile`
- optional shared logic entry
- `defaultSize.desktop`, `defaultSize.tablet`, `defaultSize.mobile`
- `platforms`
- `capabilities`
- `permissions`

Recommended entry shape:
```json
{
  "entry": {
    "shared": "./shared/model.js",
    "desktop": {"card": "./desktop/card.js", "app": "./desktop/app.js"},
    "tablet": {"card": "./tablet/card.js", "app": "./tablet/app.js"},
    "mobile": {"card": "./mobile/card.js", "app": "./mobile/app.js"}
  }
}
```

Manifest validation rejects duplicate IDs, missing platform entry files, invalid paths, unsupported capabilities, schema errors, or declarations that claim a supported platform without a valid implementation.

## Automatic discovery
`generate-card-registry.mjs` scans `cards/*/manifest.json`, validates every package and generates `generated/cards.registry.json`. Core fetches only this registry. Therefore a new valid folder automatically appears in Function Center/card catalog without editing `core/bootstrap.js` or any hard-coded app list.

A malformed card is excluded with a build diagnostic. At runtime each valid card still has its own error boundary, load timeout, abort lifecycle and cleanup lifecycle.

Registry metadata includes platform availability, platform-specific entrypoints and default dimensions. Function Center can therefore filter or label cards without loading implementation code.

## Card SDK
Public SDK surface should remain intentionally small:
- `storage.get/set/remove()` scoped to current card ID
- `events.emit/on()` namespaced by card ID unless an event is explicitly public
- `openApp()` / `closeApp()`
- `requestResize()` for desktop only
- `getPlatform()` / `subscribePlatform()`
- `getLocale()` / `subscribeLocale()`
- `getTheme()` / `subscribeTheme()`
- `notify()`
- capability-gated services such as location/network/clipboard

No card receives raw Workspace, Window Manager or other card instances.

## Lifecycle
Card: `load -> mount -> activate -> deactivate -> unmount`.
App: `load -> open -> suspend/resume -> close`.
Every listener, timer, observer and request must be disposed on unmount/close. Core supplies an AbortSignal to make cleanup enforceable.

When the platform changes because of viewport/orientation changes, Card Host performs a controlled platform remount using the same isolated card state. Cards do not mutate another platform DOM implementation in place.

## Migration order
1. Architecture: manifest schema, registry generator, Card SDK, Card Host, platform resolver and error boundary.
2. Shell: Workspace, Window Manager, persistence, background, Simplified/Traditional Chinese, independent Desktop/Tablet/Mobile hosts.
3. `weather` with three platform designs.
4. `global-weather` with three platform designs (typhoon/wind/radar/satellite/precipitation).
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
- Desktop design passes drag/resize and desktop UX acceptance
- Tablet portrait and landscape designs both pass touch-first acceptance
- Mobile compact card + full-screen/Bottom Sheet app pass acceptance
- no platform is merely a scaled desktop implementation
- no fixed page-height regression
- lazy loading verified
- no leaked timers/listeners after removal
- platform transition/remount preserves card state
- smoke test and performance budget pass on all three device classes

## Three-device acceptance matrix
Every migrated card must be reviewed against this matrix:

| Area | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Card layout | Free-position/resizable | Grid/stack | Natural vertical flow |
| Card density | High | Medium | Compact |
| Primary input | Mouse + keyboard | Touch + optional pointer | Touch |
| App surface | Window/maximize | Large sheet/split/full-screen | Full-screen/Bottom Sheet |
| Orientation | Landscape primary | Portrait + landscape | Portrait primary + landscape sanity |
| Page height | Content-driven | Content-driven | Content-driven |
| Error isolation | Required | Required | Required |
| Lazy load | Required | Required | Required |

## Product acceptance gates
### Gate A — Architecture
Registry discovery, schema validation, SDK, platform resolver, isolation, storage namespaces and error boundaries are complete.

### Gate B — Core UX
Workspace/window/card hosts, unlimited-height layout, independent desktop/tablet/mobile shells, background and zh-CN/zh-HK switching are stable.

### Gate C — P0 cards
Weather and Global Weather reach or exceed legacy functionality and pass independent Desktop/Tablet/Mobile acceptance.

### Gate D — Productivity cards
Image Studio, Text, Table, JSON and Date migrated and individually testable across all three platforms.

### Gate E — Cutover
Regression matrix passes on desktop/tablet/mobile; old runtime patch stack is not required by V2; only then may root WebDesk be switched to V2.
