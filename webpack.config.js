module.exports = {
  entry: './scripts/main.js',
  
  output: {
    filename: 'bundle.js',
    path: './dist'
  },
  
  devtool: "cheap-eval-source-map"
}