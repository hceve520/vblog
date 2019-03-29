'use strict';

module.exports = {
  verbose: true,
  collectCoverage: true,
  setupFiles: [
    './test/setup.js',"jest-canvas-mock"
  ],
  moduleFileExtensions: [
    "js", "jsx", "json"
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/test/__mocks__/styleMock.js"
  },
  'transform': {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.jsx$': 'babel-jest'
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    '!components/*/style/index.tsx',
    '!components/style/index.tsx',
    '!components/*/locale/index.tsx',
    '!components/*/__tests__/**/type.tsx',
    '!components/**/*/interface.{ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '/doc/',
    '/lang/',
    '/libs/',
    'node_modules/[^/]+?/(?!(es|node_modules)/)', // Ignore modules without es dir
    '/public/',
    '/styles/'
  ],
  testURL: 'http://localhost'
};
