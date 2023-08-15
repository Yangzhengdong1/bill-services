const connection = require('../app/database');

class AccountService {
  async queryUser(params) {
    try {
      let statement, param;
      const statementForOpenid = `
        SELECT 
          id AS userId, name AS username, avatar_url AS avatarUrl, password AS password, nickname AS nickname
        FROM users WHERE openid = ?;
      `;
      const statementForName = `
        SELECT 
          id AS userId, name AS username, avatar_url AS avatarUrl, password AS password, nickname AS nickname
        FROM users WHERE name = ?;
      `;
      const statementForId = `
        SELECT 
          id AS userId, name AS username, avatar_url AS avatarUrl, password AS password, nickname AS nickname
        FROM users WHERE id = ?;
      `;
      // let statement = params.hasOwnProperty('openid') ? statementForOpenid : statementForName;
      // let param = params.hasOwnProperty('openid') ? params.openid : params.username;
      switch (Object.keys(params)[0]) {
        case 'openid':
          statement = statementForOpenid;
          param = params.openid;
          break;
        case 'username':
          statement = statementForName;
          param = params.username;
          break;
        case 'userId':
          statement = statementForId;
          param = params.userId;
          break;
      }
      const result = await connection.execute(statement, [ param ]);
      return result[0];
    } catch (error) {
      console.log(error, '查询用户数据库报错');
      return false;
    }
  }

  async register(params) {
    try {
      const { openid, avatarUrl, nickname } = params;
      const statement = `INSERT INTO users(openid, avatar_url, nickname) VALUES(?, ?, ?);`;
      const [ result ] = await connection.execute(statement, [ openid, avatarUrl, nickname ]);
      return result;
    } catch (error) {
      return false;
    }
  }

  async bind(params) {
    const { password, username, userId } = params;
    try {
      const statement = `UPDATE users SET name = ?, password = ? WHERE id = ?;`;
      const [ result ] = connection.execute(statement, [username, password, userId]);
      return result;
    } catch (err) {
      return false;
    }
  }
}

module.exports = new AccountService();
