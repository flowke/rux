module.exports = function (api) {
  return {
    presets: [
      "@babel/preset-env",
      "@babel/preset-react",

    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-decorators",
      "@babel/plugin-proposal-optional-chaining",
    ]
  }
}