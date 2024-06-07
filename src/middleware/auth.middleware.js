const jwt = require('jsonwebtoken');
const { PUBLIC_KEY } = require('../app/config');
const errorType = require('../constant/error-type');
const { permission } = require("../service/account.service");

class AuthMiddleware {
  async authVerify(ctx, next) {
    // 校验token
    const { authorization } = ctx.headers;
    if (!authorization) {
      const error = new Error(errorType.UNAUTHORIZED);
      ctx.app.emit('error', error, ctx);
      return;
    }
    const token = authorization.replace('Bearer ', '');
    try {
      const result = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ['RS256']
      }, null);
      ctx.request.body.user = result;
      console.log('解密后的用户信息：', result);
    } catch (err) {
      const error = new Error(errorType.UNAUTHORIZED);
      ctx.app.emit('error', error, ctx);
      console.log(error, '解密token出错');
      return;
    }
    await next();
  }

  async permissionVerify(ctx, next) {
    const { userId } = ctx.request.body.user;
    let params = {};
    switch (ctx.method) {
      case 'GET':
        params = ctx.query;
        break;
        case 'POST':
          params = ctx.request.body;
          break;
      default:
        params = ctx.params;
        break;
    }
    const { id } = params;
    const result = await permission({id, userId});
    if (!result.length) {
      const error = new Error(errorType.INTERNAL_PROBLEMS);
      ctx.app.emit('error', error, ctx);
      return;
    }
    // ctx.request.body.permissionParams = { userId, id };
    await next();
  }
}

module.exports = new AuthMiddleware();
