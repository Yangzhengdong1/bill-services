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
      const { openid, avatarUrl, nickname, username, password } = params;
      let statement = "", paramArray = [];
      if (username && password) {
        statement = `
          INSERT INTO users(openid, avatar_url, nickname, name, password) VALUES(?, ?, ?, ?, ?);
        `;
        paramArray = [ openid, avatarUrl, nickname, username, password ];
      } else {
        statement = `
          INSERT INTO users(openid, avatar_url, nickname) VALUES(?, ?, ?);
        `;
        paramArray = [ openid, avatarUrl, nickname ];
      }

      const [ result ] = await connection.execute(statement, paramArray);
      return result;
    } catch (error) {
      console.log(error, "用户注册");
      return false;
    }
  }

  async bind(params) {
    const { password, username, userId } = params;
    try {
      const statement = `
        UPDATE users SET name = ?, password = ? WHERE id = ?;
      `;
      const [ result ] = await connection.execute(statement, [username, password, userId]);
      return result;
    } catch (err) {
      return false;
    }
  }

  async permission(params) {
    const { id, userId } = params;
    const statement = `SELECT * FROM bills WHERE id = ? AND user_id = ?`;
    try {
      const [result] = await connection.execute(statement, [id, userId]);
      return result;
    } catch (err) {
      console.log("查询出错了", err);
    }
  }
}

module.exports = new AccountService();
