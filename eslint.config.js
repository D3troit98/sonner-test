import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginQuery from '@tanstack/eslint-plugin-query';

export default tseslint.config(
    ...pluginQuery.configs['flat/recommended'],
    {
        ignores: [
          'node_modules',
          'dist',
          '.next',
          '.env',
          '.cache',
          'components/ui',
          'build',
          'public/build',
          '.env',
          'src/components/ui/*',
        ],
      },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        // Remove the problematic AudioWorkletGlobalScope definition
        // Add it back here if needed, without leading/trailing spaces
        // AudioWorkletGlobalScope: 'readonly',
      },

    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': 'warn',
      "@typescript-eslint/no-explicit-any": "off",
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
