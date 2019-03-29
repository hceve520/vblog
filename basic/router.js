'use strict'

const config = require('./config')
const app = require('./app')
const Proxy = require('hc-proxy')
const proxyInstance = new Proxy({
  service: {
    eventHandle: {
      endpoint: config.services.backend_server,
      client: 'http',
      api: [
        '/event/*'
      ]
    },

    commonUser: {
      endpoint: config.services.commonuser_server,
      client: 'http',
      api: [
        '/user/*', '/role/*', '/perms/*', '/org_tree/*' 
      ]
    },
	
	 //upps
        upps: {
            endpoint: config.services.upps_server,
            client: 'http',
            api: [
                '/api/*',
              '/openapi/*',
              '/escort/*'
            ]
        }

  },
  headers: [
    'x-csrf-token',
    'X-Operator',
  ]
})

proxyInstance.setProxyPrefix('/api/proxy')

module.exports = function (router) {
  proxyInstance.mount(router, app)
}
