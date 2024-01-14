import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [
          'macros',
          '@babel/plugin-transform-class-properties',
          ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
        ],
      },
    }),
  ],
  css: {
    devSourcemap: true,
  },
});
