import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  config: {
    scalars: {
      //   UUID: "string",
      Date: 'Date',
      DateTime: 'Date',
    },
  },
  schema: ['./src/generated/schema.graphql'],
  documents: 'src/**/*.graphql',
  generates: {
    'src/generated/': {
      preset: 'client',
    },
    'src/generated/graphql-operations.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    },
    'src/generated/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
