/*!
 * dtboost-example: app.js
 * Create   : 2017-03-09 15:18:43
 * CopyRight 2017 (c) Alibaba Group
 */
'use strict'

/**
 * app的主入口文件
 */
const Honeybee = require('hc-bee')
const app = new Honeybee()
const appConfig = require('./config');
var compression = require('compression')
/**
 * 注意：请务必调用  `app.ready(true)`
 */
app.ready(true)

if(appConfig.env!='dev'){
    // app.use(['*app.js','*vendor.js','*scene*.js','*app.css','*vendor.css','*scene*.css'], function (req, res, next) {
    //     req.url = req.url + '.gz';
    //     res.set('Content-Encoding', 'gzip');
    //     next();
    //   });
    app.use(compression())
}



/**
 * 注意，请务必导出app实例
 */
module.exports = app
