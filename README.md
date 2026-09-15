# ng-openapi example

Example Angular application showing how to generate and consume typed API clients with
[ng-openapi](https://ng-openapi.dev) from the Swagger Pet Store OpenAPI specification.

The same spec is consumed three ways, so you can compare the generated output:

| Client | Spec source | Config |
|---|---|---|
| `PetStoreJson` | Local `swagger.json` | `src/app/clients/json-pet-store-client/openapi.config.ts` |
| `PetStoreYaml` | Local `openapi.yaml` | `src/app/clients/yaml-pet-store-client/openapi.config.ts` |
| `PetStoreUrl` | Remote `https://petstore3.swagger.io/api/v3/openapi.json` | `src/app/clients/url-pet-store-client/openapi.config.ts` |

Each client is generated into a `generated/` folder next to its config and includes models,
injectable services, a `provide<ClientName>Client()` provider function, and
`httpResource()`-based resources from the `@ng-openapi/http-resource` plugin.

## Toolchain

| Tool | Version |
|---|---|
| Angular | 22.1 |
| Angular CLI | 22.1 |
| TypeScript | 6.0 |
| ng-openapi | 0.4 |
| @ng-openapi/http-resource | 0.2 |
| Node.js | 22.22.3+, 24.15.0+ or 26+ |

The app runs zoneless. `zone.js` is not installed and no zone polyfill is configured.

## Getting started

```bash
npm ci
npm run build:clients
npm start
```

Then open `http://localhost:4200/`. The home page links to a live example that calls the
public Pet Store API through the generated `PetService`.

## Generating the clients

```bash
npm run build:json    # from swagger.json
npm run build:yaml    # from openapi.yaml
npm run build:url     # from the remote spec
npm run build:clients # all three
```

The `url` client needs network access. Its config also demonstrates `validateInput`, which
rejects the spec unless the title matches the expected Pet Store document.

All three configs use the same options:

- `dateType: 'Date'` so date-time fields are deserialized into `Date` objects.
- `enumStyle: 'enum'` with `generateEnumBasedOnDescription` for TypeScript enums.
- `customizeMethodName` to keep only the part of the operation ID after the last underscore and camel-case it.
- `plugins: [HttpResourcePlugin]` to additionally emit signal-based `httpResource()` wrappers.

## Wiring the clients into the app

`src/app/app.config.ts` registers all three clients with `provideHttpClient()` and passes a
`basePath` plus a per-client list of class-based interceptors from
`src/app/interceptors/interceptors.ts`. Each client gets its own interceptor chain, so requests
from different clients can be logged, authenticated, or error-handled independently.

## Building and testing

```bash
npm run build   # production build into dist/
npm test        # Karma + Jasmine
```

The Karma runner needs a Chromium-based browser. If Chrome is not installed at its default
location, point `CHROME_BIN` at another binary, for example Microsoft Edge:

```powershell
$env:CHROME_BIN = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
npm test -- --watch=false --browsers=ChromeHeadless
```

## Project layout

```
src/app/
  app.config.ts          providers: router, HttpClient, three generated clients
  app.routes.ts          "" -> Home, "example" -> ExampleView
  components/
    home/                landing page
    example-view/        lists available pets via PetService + toSignal()
  interceptors/          Logging, Auth, Error and Warning HttpInterceptor classes
  clients/
    json-pet-store-client/   swagger.json + openapi.config.ts + generated/
    yaml-pet-store-client/   openapi.yaml  + openapi.config.ts + generated/
    url-pet-store-client/    openapi.config.ts + generated/
```
