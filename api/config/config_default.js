'use strict'
const path = require('path')

module.exports = {
  /* honeybee config occupied */
  dumpConfig: true,
  root: undefined,
  serverRoot: undefined,
  serverEnv: undefined,
  /* honeybee config end  */
  debug: true,
  isDev: true,
  env: 'dev',
  prefix: '/entry',
  staticPath: undefined,
  meta: {
    debug: ['ComQueryPacket'],
    desc: 'dtboost local meta db',
    driver: 'mysql',
    host: '47.99.134.61',
    port: 3306,
    user: 'root',
    password: 'Aa@123123',
    database: 'donggua'
  },
  logs: {
    sys: {
      level: 'INFO'
    }
  },
  middleware: {
    cookieSession: {
      config: {
        name: 'permissions_session',
        secret: 'defalutSecret!PLEASE!REPLACE!'
      }
    },
    public: {
      enable: true,
      router: '/static',
      extends: 'static',
      config: {
        root: path.join(__dirname, '../static')
      }
    },
    webpack: {
      enable: true,
      module: 'honeypack',
      router: '/assets'
    },

    thirdPartyBind: {
      enable: false,
      module: '../middleware/thirdPartyBind'
    },
    login: {
      enable: false,
      module: '../middleware/login'
    },
    loginLocal: {
      enable: false,
      module: '../middleware/loginLocal'
    },
    spa: {
      enable: true,
      module: '../middleware/spa',
      config: {
        ignore: [
          '/api',
          '/assets'
        ]
      }
    },
    csrf: {
      enable: false
    }
  },
  extension: {
    redirect: {
      config: {
        allowDomains: [
          '127.0.0.1:8001'
        ]
      }
    },
    appClient: {
      enable: true,
      module: 'hc-service-client',
      config: {}
    }
  },
  services: {
    api_server:'http://localhost:8001/entry',
	  backend_server: '127.0.0.1:8084/upps',
	  upps_server: 'dot/api',
    commonuser_server: 'dot/api'
  },
  logoutPage: '/zt/api/logout?callback=',
  apiPrefix: 'api/proxy/apiPrefix',
  reqPrefix: 'http://localhost:8001/entry',
  uppsPrefix: '',
  commonUserReqPrefix: ''
}
