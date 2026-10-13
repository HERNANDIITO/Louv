// @ts-check

import eslintJs from "@eslint/js";
const { configs } = eslintJs;

import tsEslint from "typescript-eslint";
const { config, configs: _configs } = tsEslint;

import angularEslint from "angular-eslint";
const { configs: __configs, processInlineTemplates } = angularEslint;

import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default config(
  {
    files: ["**/*.ts"],
    extends: [
      configs.recommended,
      ..._configs.recommended,
      ..._configs.stylistic,
      ...__configs.tsRecommended,
      eslintPluginPrettier,
    ],
    processor: processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...__configs.templateRecommended,
      ...__configs.templateAccessibility,
    ],
    rules: {},
  },
);
