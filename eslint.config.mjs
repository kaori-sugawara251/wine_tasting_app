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
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
        "indent": [
          "error",
          2,
          {
            "SwitchCase": 1
          }
        ],
        "no-underscore-dangle": "off",
        "no-empty-pattern": "off",
        "no-use-before-define": "off",
        "react/jsx-props-no-spreading": "off",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "eol-last": [
          "error",
          "always"
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-use-before-define": [
          "error", {}
        ],
        "@typescript-eslint/dot-notation": "off",
        "@typescript-eslint/no-implied-eval": "off",
        "@typescript-eslint/no-throw-literal": "off",
        "@typescript-eslint/return-await": "off",
        "import/prefer-default-export": "off",
        "no-void": [
          "error",
          {
            "allowAsStatement": true
          }
        ],
        "import/no-extraneous-dependencies": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            "vars": "all",
            "args": "after-used",
            "argsIgnorePattern": "_",
            "ignoreRestSiblings": false,
            "varsIgnorePattern": "_"
          }
        ],
        "semi": [
          "error",
          "always"
        ],
        "quotes": [
          "error",
          "single",
          {
            "avoidEscape": true
          }
        ],
        "react/function-component-definition": "off",
        "react/require-default-props": "off",
        "react/no-unknown-property": ["error", { "ignore": ["css"] }]
      }
  }
];

export default eslintConfig;
