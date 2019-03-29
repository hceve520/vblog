const db = require('../common/mysql');
class Api {


}


const LIST_PATH1 = `
select * from dg_api_prefix;
`;

Api.getPath1 = (cb) => {
    db.query(LIST_PATH1,(err, data) => {
        if (err) {
          return cb(err);
        }
        cb(null, data);
      })
};

const ADD_PATH1 = `
INSERT INTO dg_api_prefix (prefix,name) VALUES (?, ?);
`;

Api.addPath1 = (params,cb) => {
    db.query(ADD_PATH1,params,(err, data) => {
        if (err) {
          return cb(err);
        }
        cb(null, data);
      })
};

const ADD_PATH2 = `
INSERT INTO dg_api_content (path1,path2,name,statement,pre) VALUES (?,?,?,?,?);
`;

Api.addPath2 = (params,cb) => {
    db.query(ADD_PATH2,params,(err, data) => {
        if (err) {
          return cb(err);
        }
        cb(null, data);
      })
};

const LIST_PATH2 = `
select * from dg_api_content where path1 = ?;
`;

Api.getPath2 = (params,cb) => {
    db.query(LIST_PATH2,params,(err, data) => {
        if (err) {
          return cb(err);
        }
        cb(null, data);
      })
};

const UPDATE_PATH2 = `
update dg_api_content set path1=? , path2=?,name=?,statement=?,pre=? where id = ?;
`;

Api.updatePath2 = (params,cb) => {
    db.query(UPDATE_PATH2,params,(err, data) => {
        if (err) {
          return cb(err);
        }
        cb(null, data);
      })
};

const DELETE_PATH2 = `
delete from dg_api_content where id = ?;
`;

Api.deletePath2 = (params,cb) => {
    db.query(DELETE_PATH2,params,(err, data) => {
        if (err) {
          return cb(err);
        }
        cb(null, data);
      })
};

const GET_API = `
select * from dg_api_content where path1 = ? and path2 = ?;
`;

Api.getApi = async (params) => {
    return await db.queryAsync(GET_API,params)  
};

Api.runSql = async (sql,params=[]) => {
  return await db.queryAsync(sql,params)  
};



module.exports = Api