'use strict'
var api = require('../model/api')
var log = require('../common/log')

/**
 * @api /api/get_path1
 */
exports.getPath1= (req, callback) => {
    api.getPath1(callback)
}


/**
 * @api /api/add_path1
 */
exports.addPath1= (req, callback) => {
    const path1 = req.query.path1
    const name = req.query.name
    api.addPath1([path1,name],callback)
}

/**
 * @api {post} /api/add_path2
 */
exports.addPath2= (req, callback) => {
    log.info(req.body)
    const id = req.body.id
    const path1 = req.body.path1
    const path2 = req.body.path2
    const name = req.body.name
    const statement = req.body.statement
    const pre = req.body.pre
    if(id){
        api.updatePath2([path1,path2,name,statement,pre,id],callback)
    }else{
        api.addPath2([path1,path2,name,statement,pre],callback)
    }
}

/**
 * @api /api/get_path2
 */
exports.getPath2= (req, callback) => {
    const path1 = req.query.path1
    api.getPath2([path1],callback)
}

/**
 * @api /api/delete_path2
 */
exports.deletePath2= (req, callback) => {
    const id = req.query.id
    api.deletePath2([id],callback)
}


/**
 * @api {get|post} /api/:path1/:path2
 */
exports.apiCustom= async (req, callback) => {
    const path1 = req.params.path1
    const path2 = req.params.path2
    const data = await api.getApi([path1,path2])
    let result = {}
    if(data.length!=0){
        const sql = await eval(data[0].statement)(req)
        const runSqlResult = await api.runSql(sql)
        result = await eval(data[0].pre)(req,runSqlResult)
    }
    callback(null,result,'json')
}