'use strict'

module.exports = {
  debug: false,
  env: 'production',
  middleware: {
    webpack: {
      enable: false
    },
    login: {
      enable: false
    },
    aliyunLogin: {
      enable: false
    },
    thirdPartyBind: {
      enable: false
    },
    commonUserAuth : {
      config: {
        ssoTicketCheckUrl: 'http://33.83.61.75:8777/user/ticketCheck'
      }
    }
  },
  extension: {
    redirect: {
      config: {
        allowDomains: [
          '33.83.61.75',
          '33.83.61.76',
          '33.83.61.77',
          '33.83.61.78',
          '33.83.61.79'
        ]
      }
    }
  },
  services: {
    backend_server: 'http://33.83.56.16:8085/perceiveing',
	  upps_server: 'http://33.83.55.246:8084/upps',
    // mapServer: "http://33.83.56.8:25333/v3/tile?z={z}&x={x}&y={y}",
    mapServer: 'http://33.83.56.36:25003/v3/tile?z={z}&x={x}&y={y}',
    commonuser_server: 'http://33.83.61.75:8777'
  },
  commonUserReqPrefix: '/event-handle-v2/api/proxy/commonUser'
}
