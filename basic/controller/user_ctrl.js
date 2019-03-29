/*!
 * dtboost-example: controller/test_ctrl.js
 * Authors  : 枫弦 <fengxian.yzg@alibaba-inc.com> (https://github.com/yuzhigang33)
 * Create   : 2017-02-20 17:24:19
 * CopyRight 2017 (c) Alibaba Group
 */
'use strict'

var config = require('../config')

/**
 * @api /api/getUserInfo
 */
exports.getUserInfo = function (req, callback) {
  callback(null, req.session.user, 'json')
}

/**
 * @api /api/logout
 * @nowrap
 */
exports.logout = function (req, res) {
  req.session = {}
  res.redirect('/event-handle-v2')
}

/**
 * @api /api/getCookies
 */
exports.getCookies = function (req, callback) {
  callback(null, req.cookies[req.query.cookiesName], 'json')
}

/**
 * @api /api/setCookies
 */
exports.setCookies = function (req, callback) {
  req.cookies[req.query.cookiesName] = req.query.cookiesData
  callback()
}
