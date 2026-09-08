import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { cloudflare } from "@cloudflare/vite-plugin";

import nodePath from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));

function pathsResolver(input) {
  return nodePath.resolve(__dirname, input);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), cloudflare()],
  base: "", // or "./"
  clearScreen: true,

  // css options
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },

  // build options
  build: {
    minify: true,
    copyPublicDir: true,
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: true,
    reportCompressedSize: true,
  },

  // aliases
  resolve: {
    /*prettier-ignore*/
    alias: {
      '@': pathsResolver('src'),
      '@assets': pathsResolver('src/assets'),
      '@styles': pathsResolver('src/assets/styles'),
      '@icons': pathsResolver('src/assets/icons'),
      '@components': pathsResolver('src/components'),
    },
  },
});
