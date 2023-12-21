const app = require('./app/index');
const config = require('./app/config');

app.listen(config.APP_PORT, () => {
  console.log(`服务启动成功🚀~ \n 192.168.18.170:${config.APP_PORT}`);
});