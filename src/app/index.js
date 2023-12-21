const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const koaViews = require('koa-views');

const errorHandle = require('./error-handle');

const billRouter = require('../router/bill.router');
const accountRouter = require('../router/account.router');
const templateRouter = require('../router/template_router');


const app = new Koa();

// app.use(koaStatic(path.resolve(__dirname, '../public')));
app.use(koaViews(path.resolve(__dirname, '../views'), { extension: 'ejs' }));
app.use(bodyParser());
app.use(billRouter.routes());
app.use(billRouter.allowedMethods());
app.use(accountRouter.routes());
app.use(accountRouter.allowedMethods());
app.use(templateRouter.routes());
app.use(templateRouter.allowedMethods());

app.on('error', errorHandle);

require('./database');

module.exports = app;
