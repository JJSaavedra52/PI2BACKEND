export default {
    moduleFileExtensions: [
      'mjs',
      'js',
    ],
    testMatch: ['**/?(*.)+(spec|test).(m)js'],
    verbose: true,
    transform: {
      '^.+\\.mjs$': 'babel-jest',
    },
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  };