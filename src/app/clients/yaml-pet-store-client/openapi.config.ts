import { GeneratorConfig } from 'ng-openapi';
import { HttpResourcePlugin } from '@ng-openapi/http-resource';

/**
 * YAML client — demonstrates the ergonomics options.
 *
 * - `useSingleRequestParameter` collapses each method's parameters into one
 *   request object (`GetPetByIdParams`, `FindPetsByStatusParams`, ...).
 * - `serviceDecorator: 'service'` emits Angular 22's `@Service()` instead of
 *   `@Injectable({ providedIn: 'root' })`.
 * - `naming` prefixes services/resources with `Api` and suffixes models with `Dto`
 *   so the generated identifiers cannot collide with the other two clients.
 */
const config: GeneratorConfig = {
  input: './openapi.yaml',
  output: './generated',
  clientName: 'PetStoreYaml',
  plugins: [HttpResourcePlugin],
  options: {
    dateType: 'Date',
    enumStyle: 'enum',
    generateEnumBasedOnDescription: true,
    useSingleRequestParameter: true,
    serviceDecorator: 'service',
    naming: {
      services: { prefix: 'Api' },
      resources: { prefix: 'Api' },
      models: { suffix: 'Dto' },
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
