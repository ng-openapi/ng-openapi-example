import { GeneratorConfig } from 'ng-openapi';

const config: GeneratorConfig = {
  input: './openapi.yaml',
  output: './generated',
  clientName: 'PetStoreYaml',
  options: {
    dateType: 'Date',
    enumStyle: 'enum',
    generateEnumBasedOnDescription: true,
    customizeMethodName: (operationId) => {
      const methodName = operationId.split('_').at(-1) ?? operationId;
      const camelCasedMethodName = methodName
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
      return camelCasedMethodName;
    },
  },
};

export default config;
