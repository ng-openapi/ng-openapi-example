import { GeneratorConfig } from 'ng-openapi';
import { HttpResourcePlugin } from '@ng-openapi/http-resource';
import { ModuleKind, ScriptTarget } from 'ts-morph';

/**
 * URL client — demonstrates the HTTP-level options against the remote spec.
 *
 * - `validateInput` rejects the downloaded spec unless it is the expected document.
 * - `customHeaders` adds default headers to every request of this client. The Pet Store
 *   API only allows `Content-Type`, `api_key` and `Authorization` cross-origin, so the demo
 *   sends its public `api_key` (`special-key`) instead of an arbitrary header.
 * - `emitAcceptHeader` (default `true`) sends an `Accept` header derived from each
 *   operation's declared response content types.
 * - `responseTypeMapping` pins Angular's `responseType` per content type.
 * - `compilerOptions` overrides the ts-morph compiler settings used during generation.
 */
const config: GeneratorConfig = {
  input: 'https://petstore3.swagger.io/api/v3/openapi.json',
  output: './generated',
  clientName: 'PetStoreUrl',
  plugins: [HttpResourcePlugin],
  validateInput: (spec) => {
    return spec.info.title === 'Swagger Petstore - OpenAPI 3.0';
  },
  compilerOptions: {
    target: ScriptTarget.ES2022,
    module: ModuleKind.Preserve,
    strict: true,
  },
  options: {
    dateType: 'Date',
    enumStyle: 'enum',
    generateEnumBasedOnDescription: true,
    customHeaders: {
      api_key: 'special-key',
    },
    emitAcceptHeader: true,
    responseTypeMapping: {
      'application/json': 'json',
      'application/octet-stream': 'blob',
    },
    customizeMethodName: (operationId) => {
      const methodName = operationId.split('_').at(-1) ?? operationId;
      return methodName
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
    },
  },
};

export default config;
