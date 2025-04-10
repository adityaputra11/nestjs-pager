import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'es2019',
  outDir: 'dist',
  external: ['@nestjs/common', '@nestjs/core', 'typeorm', 'prisma'],
});