var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    db: 'mongodb://localhost/dbname',
    root: rootPath
  },
  test: {
    db: 'mongodb://localhost/dbname_test',
    root: rootPath
  },
  production: {}
}
