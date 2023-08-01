const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require("../app/config");
const errorType = require("../constant/error-type");
const { bind } = require('../service/account.service');

const createToken = (nickname, userId) => {
  const payload = { nickname, userId };
  const options = {
    expiresIn: 60 * 60 * 24,
    algorithm: 'RS256'
  };

  try {
    const token = jwt.sign(payload, PRIVATE_KEY, options, null);
    return token;
  } catch(err) {
    return false;
  }
};


class AccountController {
  async login(ctx) {
    const { nickname, userId, avatarUrl, username, password } = ctx.loginInfo;

    const token = createToken(nickname, userId);
    if (!token) {
      console.log('token生成失败');
      const error = new Error(errorType.INTERNAL_PROBLEMS);
      ctx.app.emit('error', error, ctx);
      return;
    }
    const binding = (username && password) ? 1 : 0;
    ctx.body = {
      code: 0,
      data: { token, username, nickname, avatarUrl, binding, userId },
      message: '登录成功'
    }
  }

  async bind(ctx) {
    const { username, password } = ctx.request.body;
    const { userId } = ctx.request.body.user;
    console.log(username, password, userId);
    ctx.body = '绑定账号成功';
  }

}

module.exports = new AccountController();