'use strict'
const pathIgnore = require('path-ignore')
const config = require('../config')


module.exports = function (app, options) {
  const tester = pathIgnore(options.ignore)

  return (req, res, next) => {
    if (tester(req.path)) {
      return next()
    }
   
    let userInfo = req.session.user

    res.render('index.html', {
      isDebug: config.debug,
      reqPrefix: config.reqPrefix,
      menu_qz: escape(JSON.stringify(config.menu_qz || {})),
	    uppsPrefix: config.uppsPrefix,
      commonUserReqPrefix: config.commonUserReqPrefix,
      cityInfoReqPrefix: config.cityInfoReqPrefix,
      downloadPrefix: config.downloadPrefix,
      csrfToken: req.csrfToken(),
      prefix: config.staticPath || (config.prefix === '/' ? '' : config.prefix),
      env: config.env,
      privateCloud: !!config.privateCloud,
      // title: messages[currentLang]['title'],
      title: 'ZSmartCity',
      // title: '应用名称',
      mapServer: escape(config.services.mapServer),
      logoutPage: config.logoutPage,
      userInfo: escape(JSON.stringify(userInfo || {}))
    })
  }
}
