// babel.config.js
// Make sure you are using module.exports, NOT export default

module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current', // Target your current Node.js version
          },
        },
      ],
    ],
    // Add any other Babel plugins or presets you might need here
  };