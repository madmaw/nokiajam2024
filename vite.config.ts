import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '',
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [
          'macros',
          [
            '@babel/plugin-proposal-decorators',
            {
              'version': '2023-05',
            },
          ],
        ],
      },
    }),
  ],
  css: {
    devSourcemap: true,
  },
});
