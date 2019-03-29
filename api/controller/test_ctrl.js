'use strict'

var config = require('../config')

/**
 * @api {get|post} /api/hello_text
 */
exports.helloText = function (req, callback) {
  let data = req.query.name
  callback(null, data)
}

/**
 * @api /
 */
exports.welcomeTpl = function (req, callback) {
  callback(null, {
    tpl: 'welcome.html',
    data: {
      prefix: config.prefix === '/' ? '' : config.prefix
    }
  }, 'html')
}

/**
 * 如需要使用原始的API, 请加上  nowrap 标记
 * @api /api/hello_origin
 * @nowrap
 */
exports.helloOrigin = function (req, res) {
  res.send('hello')
}

/**
 * 支持 generatorFunction, 使用方式和上面一样，如果需要nowrap, 同样加个注解
 * @api /api/hello_gen
 */
exports.helloGen = function * (req, callback) {
  callback(null, 'hello')
}
