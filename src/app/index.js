const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const koaViews = require('koa-views');

const errorHandle = require('./error-handle');
const { globalLogger } = require("../utils/log4js");

const billRouter = require('../router/bill.router');
const accountRouter = require('../router/account.router');
const templateRouter = require('../router/template.router');
const chartsRouter = require('../router/charts.router');


const app = new Koa();

// app.use(koaStatic(path.resolve(__dirname, '../public')));
app.use(koaViews(path.resolve(__dirname, '../views'), { extension: 'ejs' }));
app.use(bodyParser());
app.use(globalLogger());
app.use(billRouter.routes());
app.use(billRouter.allowedMethods());
app.use(accountRouter.routes());
app.use(accountRouter.allowedMethods());
app.use(templateRouter.routes());
app.use(templateRouter.allowedMethods());
app.use(chartsRouter.routes());
app.use(chartsRouter.allowedMethods());
app.use(async (ctx, next) => {
  const { url, method } = ctx.req;
  ctx.body = {
    code: -1,
    message: `${method}:${url}接口不存在`
  };
});

app.on('error', errorHandle);

require('./database');

module.exports = app;
