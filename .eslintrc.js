module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/airbnb'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    "linebreak-style": ["error", (process.platform === "win32" ? "windows" : "unix")],
    "comma-dangle": [1, {
      "objects": "always",
      "arrays": "ignore",
      "imports": "ignore",
      "exports": "ignore",
      "functions": "ignore"
    }],
    'max-len': ['warn', {
      code: 100,
      ignoreComments: true,
      ignoreStrings: true,
      // fix for svg icons
      ignorePattern: 'd=([s]*?)',
    }],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-multiple-empty-lines': ['error', {
      max: 1,
      maxBOF: 1
    }],
    'no-param-reassign': 'off',
    'max-classes-per-file': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': 'warn',
    "consistent-return": "off",
    'vue/no-unused-vars': 'off',
    'vue/require-default-prop': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true
    }],
  },
}
