const Router = require('koa-router');
const {
  queryUserForLogin,
  queryUserForBind
} = require('../middleware/account.middleware');
const {
  login,
  bind
} = require('../controller/account.controller');
const { authVerify } = require('../middleware/auth.middleware');

const accountRouter = new Router({prefix: '/account'});


accountRouter.post('/login', queryUserForLogin, login);
accountRouter.post('/bind', authVerify, queryUserForBind, bind);

module.exports = accountRouter;
