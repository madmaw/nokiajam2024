/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  rules: {
    'semi': [
      'error',
      'always',
    ],
    'quotes': [
      'warn',
      'single',
    ],
    'no-console': ['warn'],
    'no-alert': ['warn'],
    'no-debugger': ['warn'],
    'indent': [
      'warn',
      2,
      {
        'FunctionDeclaration': {
          'body': 1,
          'parameters': 2,
        },
        'MemberExpression': 2,
        'SwitchCase': 1,
      },
    ],
    'eqeqeq': [
      'warn',
      'always',
      {
        'null': 'never',
      },
    ],
    'comma-dangle': [
      'warn',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'func-style': [
      'warn',
      'declaration',
      {
        'allowArrowFunctions': false,
      },
    ],
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'prefer-destructuring': 'warn',
    'object-curly-spacing': [
      'warn',
      'always',
    ],
    // eslint doesn't detect css modules properly, our TS settings will
    // complain about us using 'any' anyway
    '@typescript-eslint/no-unsafe-assignment': ['off'],
    '@typescript-eslint/no-unsafe-argument': ['off'],
    '@typescript-eslint/no-unsafe-return': ['off'],
    'object-curly-newline': [
      'warn',
      {
        'multiline': true,
        'minProperties': 2,
        'consistent': true,
      },
    ],
    'object-property-newline': [
      'warn',
      {
        'allowMultiplePropertiesPerLine': false,
      },
    ],
    'array-bracket-newline': [
      'warn',
      {
        'multiline': true,
        'minItems': 2,
      },
    ],
    'array-element-newline': [
      'warn',
      {
        'multiline': true,
        'minItems': 2,
      },
    ],
    'import-newlines/enforce': [
      'warn',
      {
        'items': 1,
        'semi': true,
      },
    ],
    'no-multi-spaces': ['warn'],
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'varsIgnorePattern': '^_',
        'args': 'after-used',
        'argsIgnorePattern': '^_',
      },
    ],
    'default-case': ['error'],
    'no-multiple-empty-lines': [
      'warn',
      {
        'max': 1,
        'maxBOF': 0,
        'maxEOF': 1,
      },
    ],
    //'destructuring-newline/object-property-newline': ['warn'],
    // seems to be produce false positives
    'import/no-relative-parent-imports': ['off'],
    'import/no-cycle': ['error'],
    'import/no-self-import': ['error'],
    'import/no-unresolved': 'error',
    'react/display-name': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/prop-types': ['off'],
    'react/jsx-max-props-per-line': [
      'warn',
      {
        maximum: 1,
      },
    ],
    'react/jsx-boolean-value': [
      'warn',
      'always',
    ],
    'react/jsx-indent-props': [
      'warn',
      2,
    ],
    'react/jsx-one-expression-per-line': [
      'warn',
      { allow: 'literal' },
    ],
    'react/jsx-first-prop-new-line': [
      'warn',
      'multiline-multiprop',
    ],
    'react/jsx-closing-bracket-location': [
      'warn',
      'tag-aligned',
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': ['error'],
    '@typescript-eslint/consistent-type-definitions': [
      'warn',
      'type',
    ],
    '@typescript-eslint/prefer-readonly': ['warn'],
    '@typescript-eslint/consistent-type-assertions': [
      'warn',
      {
        'assertionStyle': 'never',
      },
    ],
    '@typescript-eslint/ban-types': [
      'warn',
      {
        'types': {
          '{}': false,
        },
        'extendDefaults': true,
      },
    ],
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: './',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'import-newlines',
    'import',
    'unused-imports',
  ],
  root: true,
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
        '.tsx',
      ],
    },
    'import/resolver': {
      'typescript': {
        'alwaysTryTypes': true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        'project': ['tsconfig.json'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
