const Router = require('koa-router');
const {
  queryUserForLogin,
  queryUserForBind,
  visitorLoginVerify,
  resetPasswordMiddleware
} = require('../middleware/account.middleware');
const {
  login,
  bind,
  resetPassword
} = require('../controller/account.controller');
const { authVerify } = require('../middleware/auth.middleware');

const accountRouter = new Router({prefix: '/account'});


accountRouter.post('/login', queryUserForLogin, login);
accountRouter.post('/visitor-login', visitorLoginVerify, login);
accountRouter.post('/bind', authVerify, queryUserForBind, bind);
// 重置密码
accountRouter.post('/reset-password', authVerify, resetPasswordMiddleware, resetPassword);

module.exports = accountRouter;
