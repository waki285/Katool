module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: [".eslintrc.cjs"],
      parserOptions: {
        sourceType: "script",
      },
      env: {
        node: true,
      },
    },
    {
      files: ["build.js"],
      env: {
        node: true,
      },
    },
  ],
  plugins: ["@typescript-eslint"],
  rules: {},
};
