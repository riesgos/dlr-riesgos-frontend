/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist']  // jest gets confused when it encounters a compiled directory.
};