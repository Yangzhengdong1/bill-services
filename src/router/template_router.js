const KoaRouter = require('koa-router');
const config = require('../app/config');

const templateRouter = new KoaRouter({prefix: '/'});

templateRouter.get('', async ctx => {
  await ctx.render('index', {
    appName: config.APP_NAME
  });
});

module.exports = templateRouter;