'use strict';
const mysql = require('mysql');
// const log = require('./log');
const config = require('../config');

if(!config.meta.user){
  config.meta.user = config.meta.username;
}
if (!config.meta.connectionLimit) config.meta.connectionLimit = 3;
const pool = mysql.createPool(config.meta);

// exec table create process
// TODO: export async callback function to make sure db ready before main program boot.
// pool.getConnection(function (err, conn) {
//   if (err) {
//     return log.error(err);
//   }
//   conn.query('SET SESSION ?', config.meta.session_variables, function () {
//     conn.release();
//   });
// });

exports.query = function (sql, param, callback) {
  pool.query(sql, param, callback);
};


exports.queryAsync = function( sql, values ) {
  // 返回一个 Promise
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
};