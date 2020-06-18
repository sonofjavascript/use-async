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
  ]
]

const env = {
  production: {
    presets: ['minify'],
    ignore: [
      'src/**/*.spec.js',
      '**/*.spec.js',
      '**/*.spec.jsx',
      '**.spec.js',
      '**.spec.jsx'
    ]
  }
}

module.exports = { presets, env }
