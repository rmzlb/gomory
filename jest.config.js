const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/jest.config.js',
  ],
  // Coverage thresholds:
  // - Set to current levels to prevent regression
  // - Goal: Gradually increase as more tests are added
  // - Focus on critical paths (optimizer, utils) first
  // - UI components can be tested with integration/e2e tests
  coverageThreshold: {
    global: {
      branches: 13,    // Current: 13.81% → Goal: 50%
      functions: 11,   // Current: 11.86% → Goal: 40%
      lines: 16,       // Current: 16.14% → Goal: 50%
      statements: 16,  // Current: 16.08% → Goal: 50%
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
