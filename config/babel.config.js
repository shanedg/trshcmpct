module.exports = {
  plugins: [
    'syntax-dynamic-import',
  ],
  presets: [
    [
      '@babel/preset-env', {
        modules: false,
      }
    ],
    '@babel/preset-react',
    [
      '@babel/preset-typescript', {
        allExtensions: true,
        isTSX: true,
      }
    ],
  ],
};
