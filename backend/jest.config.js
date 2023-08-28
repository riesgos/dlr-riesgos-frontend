/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/build'],
  moduleNameMapper: {
    "axios": "axios/dist/node/axios.cjs"
  }
};