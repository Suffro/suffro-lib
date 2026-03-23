import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  entry: {
    'utils/index': './utils/index.ts',
    'firebase-utils/index': './firebase-utils/index.ts',
    'idb/index': './idb/index.ts',
    'crypto/index': './crypto/index.ts',
  }
})