module.exports = {
  extends: 'eslint:recommended',
  env: {
    es6: true,
    node: true,
    browser: true
  },
  rules: {
    quotes: ['error', 'single'],
    indent: ['error', 2],
    semi: ['error', 'never'],
    'one-var': 0,
    'no-console': 0
  }
}
