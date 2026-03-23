import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  entry: {
    'utils/index': './src/utils/index.ts',
    'firebase/index': './src/firebase/index.ts',
    'idb/index': './src/idb/index.ts',
    'crypto/index': './src/crypto/index.ts',
  }
})