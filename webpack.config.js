const path = require('path')

module.exports = {
  entry: './scripts/main.js',
  
  output: {
    filename: 'bundle.js',
    path: path.resolve('./dist')
  },
  
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  
  devtool: "cheap-eval-source-map"
}