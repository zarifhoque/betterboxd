import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],

  moduleFileExtensions: ['ts', 'js', 'json'],

  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/DataSource.ts'],

  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
