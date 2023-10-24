const Koa = require('koa');
const path = require('path');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');

const billRouter = require('../router/bill.router');
const accountRouter = require('../router/account.router');
const errorHandle = require('./error-handle');

const app = new Koa();
app.use(koaStatic(path.resolve(__dirname, '../public')));

app.use(
  cors({
    origin: (ctx) => {
      const whiteList = ['http://localhost:8081', 'http://192.168.18.170:8080']; //可跨域白名单
      let url = 'http://' + ctx.header.host;
      if (whiteList.includes(url)) {
        return url; //注意，这里域名末尾不能带/
      }
      return 'http://127.0.0.1:29377'; //默认可跨域端口
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
);
app.use(bodyParser());

app.use(billRouter.routes());
app.use(billRouter.allowedMethods());
app.use(accountRouter.routes());
app.use(accountRouter.allowedMethods());

app.on('error', errorHandle);

require('./database');

module.exports = app;
