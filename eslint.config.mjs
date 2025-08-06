import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add this block to override specific rules
  {
    files: ["**/*.ts", "**/*.tsx"],

    rules: {
      "no-unused-vars": "off", // disables unused variable warnings
      "no-unused-imports": "off", // disables unused import warnings (if using a plugin)
      "unused-imports/no-unused-imports": "off", // if using 'eslint-plugin-unused-imports'
      "unused-imports/no-unused-vars": "off", // disables unused vars from that plugin too
    },
  },
];

export default eslintConfig;
