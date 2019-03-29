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
    commonUserAuth : {
      enable: false,
      module: '@ali/common-user-auth',
      config: {
        logUrl: '/event-handle-v2/login',
        cookieName: 'SJCZ_USER_COOKIE',
        // ssoTicketCheckUrl: 'http://10.218.135.103:8777/user/ticketCheck',
        ssoTicketCheckUrl: 'http://127.0.0.1:8080/perceiveing/event/user/ticketCheck',
        ignore: [
          '/login',
          '/api/proxy/commonUser/user/login',
          '/api/proxy/eventHandle/event/user/login',
          '/api/getCookies',
          '/api/setCookies'
        ]
      }
    },

    thirdPartyBind: {
      enable: false,
      module: '../middleware/thirdPartyBind'
    },
    login: {
      enable: false,
      module: '../middleware/login'
    },
    aliyunLogin: {
      enable: false,
      module: '@ali/hc-aliyun-auth'
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
    // backend_server: 'dot/api',
	backend_server: '127.0.0.1:8084/upps',
	  upps_server: 'dot/api',
    commonuser_server: 'dot/api',
    mapServer: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
  },
  logoutPage: '/zt/api/logout?callback=',
  // reqPrefix: '',
  reqPrefix: 'http://10.45.70.121:9222',
  uppsPrefix: '',
  commonUserReqPrefix: '',    // 本机单机登陆
  menu_qz:[
  ]
}
