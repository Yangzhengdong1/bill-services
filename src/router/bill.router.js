const Router = require('koa-router');
const {
  authVerify
} = require('../middleware/auth.middleware');
const {
  paramsVerify,
  verifyAmount,
  verifyList
} = require('../middleware/bill.middleware');
const {
  create,
  list,
  amount
} = require('../controller/bill.controller');

const billRouter = new Router({prefix: '/bill'});

billRouter.post('/create', authVerify, paramsVerify, create);
billRouter.get('/list', authVerify, verifyList, list);
billRouter.get('/amount', authVerify, verifyAmount, amount);

module.exports = billRouter;
