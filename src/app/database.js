const mysql = require('mysql2');
const config = require('./config');

const MYSQL_CONFIG = {
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD
};

const connections = mysql.createPool(MYSQL_CONFIG);
connections.getConnection((err, connection) => {
  connection.connect((err) => {
    if (err) {
      console.log('连接数据库失败');
    } else {
      console.log('连接数据库成功');
    }
  });
});

module.exports = connections.promise();
