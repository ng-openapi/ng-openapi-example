import { GeneratorConfig } from 'ng-openapi';
import { HttpResourcePlugin } from '@ng-openapi/http-resource';
import { ZodPlugin } from '@ng-openapi/zod';

/**
 * JSON client — demonstrates runtime response validation.
 *
 * - `ZodPlugin` emits a Zod schema per model/operation into `generated/validators`.
 * - `validation.response` adds a `parse` hook to every service method so the
 *   generated Zod schemas (or any other parser) can validate responses at runtime.
 * - `modelFileStructure: 'per-type'` writes one file per schema under `generated/models`.
 */
const config: GeneratorConfig = {
  input: './swagger.json',
  output: './generated',
  clientName: 'PetStoreJson',
  plugins: [HttpResourcePlugin, ZodPlugin],
  options: {
    dateType: 'Date',
    enumStyle: 'enum',
    generateEnumBasedOnDescription: true,
    validation: {
      response: true,
    },
    modelFileStructure: 'per-type',
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
