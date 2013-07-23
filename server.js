var express = require('express')
  , fs = require('fs')

var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose')
  
mongoose.connect(config.db)

var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

var app = express()
require('./config/express')(app, config)
require('./config/routes')(app)
var port = 3000
app.listen(port)
console.log('Express app started on port '+port)
exports = module.exports = app
