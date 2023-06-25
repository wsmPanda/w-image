module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    "vue/setup-compiler-macros": true
  },
  extends: ["plugin:vue/essential", "airbnb-base", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "import/no-absolute-path": "off",
    "import/no-extraneous-dependencies": "off",
    "vue/no-multiple-template-root": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-v-model-argument": "off",
    "no-dupe-class-members": "off",
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: [
          "state",
          "config",
          "item",
          "event",
          "ctx",
          "req",
          "res",
          "request",
          "response",
          "cur",
          "prev"
        ]
      }
    ],
    "no-unused-vars": ["off", { args: "after-used" }],
    "@typescript-eslint/no-unused-vars": ["off", { args: "after-used" }],
    "no-bitwise": ["error", { int32Hint: true, allow: ["~"] }],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-redeclare": "off",
    "@typescript-eslint/no-redeclare": ["error"],
    "linebreak-style": ["error", "unix"],
    "class-methods-use-this": "off",
    "vue/attributes-order": "off",
    "vue/no-reactive-component-props": "off"
  },
  settings: {},
  globals: {
    EventListenerOrEventListenerObject: true,
    NodeJS: "readonly",
    isInLib: "readonly",
    globalEnv: "readonly",
    electron: "readonly",
    ContactInterface: "readonly",
    MemberInterface: "readonly",
    GroupInterface: "readonly",
    UserInterface: "readonly",
    SessionData: "readonly",
    GlobalEnv: "readonly",
    WindowStatus: "readonly",
    LogoutStatus: "readonly",
    SettingData: "readonly",
    CalendarSetting: "readonly",
    LastSeenStatus: "readonly",
    JoinGroupStatus: "readonly",
    ShowCallStatus: "readonly",
    FileStats: "readonly",
    ClipboardVal: "readonly",
    ImMain: "readonly"
  }
}
