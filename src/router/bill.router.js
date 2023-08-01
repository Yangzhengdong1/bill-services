const Router = require('koa-router');
const {
  authVerify
} = require('../middleware/auth.middleware');
const {
  paramsVerify,
  verifyList
} = require('../middleware/bill.middleware');
const {
  create,
  list
} = require('../controller/bill.controller');

const billRouter = new Router({prefix: '/bill'});

billRouter.post('/create', authVerify, paramsVerify, create);
billRouter.get('/list', authVerify, verifyList, list);


module.exports = billRouter;