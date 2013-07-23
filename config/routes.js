module.exports = function (app) {
  var maincontroller = require('../app/controllers/maincontroller')
  app.post('/upload', maincontroller.upload)
  app.get('/', maincontroller.home)
  app.get('/detail/:imageid', maincontroller.detail)
}