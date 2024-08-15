import globals from 'globals'
import pluginPrettier from 'eslint-plugin-prettier/recommended'

const config = [
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser, ...globals.mocha }
    }
  },
  pluginPrettier,
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    ignores: ['coverage/', 'docs/', 'dist/', 'assets/', 'tmp/']
  }
]

export default config
