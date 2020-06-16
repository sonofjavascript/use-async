const presets = [
  '@babel/preset-react',
  [
    '@babel/env',
    {
      useBuiltIns: 'usage',
      corejs: '3.0.0',
      targets: {
        esmodules: true,
        ie: '11'
      }
    }
  ],
  'minify'
]

module.exports = { presets }
