

const qiniu = require('qiniu')

const accessKey = '580mXgJTyIfovuYHso3brkYLaAK3uDJNj5FsqNo1'
const secretKey = '8PMF3ZBsQ7oDG4g9MLLZC2dhEtuUNGU0SrHhjah-'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const options = {
  scope: 'hceve520'
}
const putPolicy = new qiniu.rs.PutPolicy(options)


module.exports = function (app, options) {
    return (req, res, next) => {
        if (req.path.indexOf('/write') >= 0) {
            const uploadToken=putPolicy.uploadToken(mac)
            res.cookie('qntoken',uploadToken)
        }
        next()
    }
  }
