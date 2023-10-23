/* eslint-disable @typescript-eslint/no-var-requires */
import type { Config } from '@jest/types';
import * as path from 'path';

const config = (): Config.InitialOptions => {
  const dotenv = require('dotenv');
  dotenv.config({ path: './.env' });
  return {
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'graphql'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
      '\\.(gql|graphql)$': '@graphql-tools/jest-transform',
      // '^.+\\.tsx?$': [
      //   'ts-jest',
      //   {
      //     tsconfig: 'tsconfig.json',
      //     isolatedModules: true,
      //     useESM: true,
      //     diagnostics: true,
      //     // babelConfig: true,
      //   },
      // ],
    },
    moduleNameMapper: {
      '^src(.*)$': path.join(__dirname, './src$1'),
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    globals: {
      NODE_ENV: 'test',
    },
    // setupFilesAfterEnv: [`./src/test/globalSetup.ts`],
    displayName: 'server',
  };
};

export default config;
