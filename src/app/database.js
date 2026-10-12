const mysql = require('mysql2');
const config = require('./config');

const MYSQL_CONFIG = {
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD
};

const originalQuery = mysql.Connection.prototype.query;
const originalExecute = mysql.Connection.prototype.execute;

function logSql(method, sql, values) {
  // 提取完整的 SQL 语句（兼容对象传参形式）
  const sqlText = typeof sql === 'object' ? sql.sql : sql;
  
  console.log(`\n---------------- [MySQL Interceptor] ----------------`);
  console.log(`[类型]: ${method}`);
  console.log(`[SQL]:`, sqlText);
  if (values !== undefined && values !== null) {
    console.log(`[参数]:`, values);
  }
  console.log(`-----------------------------------------------------\n`);
}

// 拦截普通 query
mysql.Connection.prototype.query = function (sql, values, cb) {
  logSql('QUERY', sql, values);
  return originalQuery.call(this, sql, values, cb);
};

// 拦截预编译 execute（对应你代码中用的这行）
mysql.Connection.prototype.execute = function (sql, values, cb) {
  logSql('EXECUTE', sql, values);
  return originalExecute.call(this, sql, values, cb);
};

const connections = mysql.createPool(MYSQL_CONFIG);
connections.getConnection((err, connection) => {
  connection.connect((err) => {
    if (err) {
      console.log('连接数据库失败');
    } else {
      console.log('连接数据库成功');
      connection.release();
    }
  });
});

module.exports = connections.promise();
