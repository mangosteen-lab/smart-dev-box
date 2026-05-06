/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { target: 'es2017' } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/.open-next/'],
  modulePathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.open-next/'],
  watchPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.open-next/'],
};

module.exports = config;
