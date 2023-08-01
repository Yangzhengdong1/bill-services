const mysql = require('mysql2');
const { MYSQL_CONFIG } = require('./config');

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
