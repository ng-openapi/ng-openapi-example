# ng-openapi example

Example Angular application showing how to generate and consume typed API clients with
[ng-openapi](https://ng-openapi.dev) from the Swagger Pet Store OpenAPI specification.

The same spec is consumed three ways. Each client is configured with a different set of
ng-openapi options, so you can compare the generated output side by side:

| Client | Spec source | Config | Demonstrates |
|---|---|---|---|
| `PetStoreJson` | Local `swagger.json` | `src/app/clients/json-pet-store-client/openapi.config.ts` | `ZodPlugin`, `validation.response`, `modelFileStructure: 'per-type'` |
| `PetStoreYaml` | Local `openapi.yaml` | `src/app/clients/yaml-pet-store-client/openapi.config.ts` | `useSingleRequestParameter`, `serviceDecorator: 'service'`, `naming` |
| `PetStoreUrl` | Remote `https://petstore3.swagger.io/api/v3/openapi.json` | `src/app/clients/url-pet-store-client/openapi.config.ts` | `validateInput`, `customHeaders`, `emitAcceptHeader`, `responseTypeMapping`, `compilerOptions` |

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
| @ng-openapi/zod | 0.2 |
| zod | 4.6 |
| Node.js | 22.22.3+, 24.15.0+ or 26+ |

The app runs zoneless. `zone.js` is not installed and no zone polyfill is configured.

## Getting started

```bash
npm ci
npm run build:clients
npm start
```

Then open `http://localhost:4200/`. The home page links to a live example page with one
section per client, each calling the public Pet Store API through its generated client.

## Generating the clients

```bash
npm run build:json    # from swagger.json
npm run build:yaml    # from openapi.yaml
npm run build:url     # from the remote spec
npm run build:clients # all three
```

The `url` client needs network access.

All three configs share these options:

- `dateType: 'Date'` so date-time fields are deserialized into `Date` objects.
- `enumStyle: 'enum'` with `generateEnumBasedOnDescription` for TypeScript enums.
- `customizeMethodName` to keep only the part of the operation ID after the last underscore and camel-case it.
- `plugins: [HttpResourcePlugin]` to additionally emit signal-based `httpResource()` wrappers.

### JSON client: runtime validation with Zod

- `plugins: [HttpResourcePlugin, ZodPlugin]` adds a `generated/validators/` folder with one Zod
  schema per operation (`findPetsByStatus200Response`, `getPetById200Response`, ...).
- `validation.response: true` adds a `parse` hook to every service method's `RequestOptions`.
  Pass a Zod schema's `parse` and the response is validated before it reaches your code.
  The example page validates the pet list per item with `findPetsByStatus200ResponseItem.safeParse`
  by default and drops malformed pets, because the public Pet Store contains invalid entries.
  A "strict" toggle switches to `findPetsByStatus200Response.parse`, which rejects the whole response.
- `modelFileStructure: 'per-type'` writes one file per schema under `generated/models/`.

```ts
// httpResource supports parse natively
readonly pets = this.petResource.findPetsByStatus(this.status, {
  defaultValue: [],
  parse: findPetsByStatus200Response.parse,
});

// generated HttpClient services get the same hook from validation.response
this.petService.getPetById(petId, undefined, {parse: getPetById200Response.parse});
```

### YAML client: single request parameter, `@Service()` and naming

- `useSingleRequestParameter: true` collapses each method's parameters into one typed request
  object exported from `generated/models/request-params.ts`.
- `serviceDecorator: 'service'` emits Angular 22's `@Service()` instead of
  `@Injectable({ providedIn: 'root' })`.
- `naming` prefixes services and resources with `Api` and suffixes models with `Dto`, so the
  identifiers cannot collide with the other two clients.

```ts
const request: GetPetByIdParams = {petId: 1};
this.apiPetService.getPetById(request);      // Observable<PetDto>
this.apiUserResource.getUserByName(this.username); // HttpResourceRef<UserDto | undefined>
```

### URL client: HTTP-level options

- `validateInput` rejects the downloaded spec unless its title matches the expected document.
- `customHeaders` adds the Pet Store's public `api_key` header to every request. The Pet Store
  API only allows `Content-Type`, `api_key` and `Authorization` cross-origin, so an arbitrary
  header would fail the browser's CORS preflight.
- `emitAcceptHeader` (default `true`) sends an `Accept` header derived from each operation's
  declared response content types.
- `responseTypeMapping` pins Angular's `responseType` per content type.
- `compilerOptions` overrides the ts-morph compiler settings used while generating.

## Wiring the clients into the app

`src/app/app.config.ts` registers all three clients with `provideHttpClient()` and passes a
`basePath` plus a per-client list of class-based interceptors from
`src/app/interceptors/interceptors.ts`. Each client gets its own interceptor chain, so requests
from different clients can be logged, authenticated, or error-handled independently.

The example page is split into one component per client under `src/app/components/examples/`.

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

The component specs use `HttpTestingController`, so they run without network access.
