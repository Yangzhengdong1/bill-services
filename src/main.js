const app = require('./app/index');
const config = require('./app/config');

app.listen(config.SERVICE_PORT, () => {
  console.log(`服务启动成功🚀~ \n ${ config.SERVICE_HOST }:${config.SERVICE_PORT}`);
});
