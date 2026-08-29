import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "*.min.js"],
  },

  js.configs.recommended,

  ...pluginVue.configs["flat/recommended"],

  {
    files: ["**/*.vue", "**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "warn",
      "vue/require-default-prop": "off",
      "vue/multi-word-component-names": "off",
    },
  },

  {
    files: ["*.config.js", "vite.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  prettierConfig,
];
