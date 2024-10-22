import eslint from "@eslint/js";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  {
    ignores: [
      'dist',
      "*.html"
    ],
  },
  {
    files: ["**/*.{.vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts}"],
    rules: {
      rules: {
        quotes: ['error', 'single'],
        semi: ['error'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'comma-dangle': ['error', {
          'arrays': 'always-multiline',
          'objects': 'always-multiline',
          'imports': 'always-multiline',
          'exports': 'always-multiline',
          'functions': 'always-multiline',
        }],
        'space-before-function-paren': [
          'error',
          {
            anonymous: 'always',
            named: 'always',
            asyncArrow: 'always',
          },
        ],
        'newline-before-return': 'error',
      },
    }
  },
  {
    files: ['*.ts', '*.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off', // Example of TypeScript-specific rule
    },
  }
);
