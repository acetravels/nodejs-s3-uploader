var express = require('express')
  , mongoStore = require('connect-mongo')(express)

module.exports = function (app, config) {
  app.configure(function () {
    app.use(express.cookieParser())
    app.use(express.methodOverride())

    app.use(express.session({
      secret:'noobjs',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))

    app.use(app.router)
  })
}
