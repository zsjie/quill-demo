// require all test files
const testsContext = require.context('.', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)