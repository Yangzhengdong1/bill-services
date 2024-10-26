const path = require("path");
const log4js = require("koa-log4");

log4js.configure({
  appenders: {
    out: { type: "console" },
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.join('back-end/logs/', 'application.log'),
      compress: false, // 如果设置为 true，旧的日志文件在创建新文件时会被压缩为 .gz 文件，节省存储空间。
      daysToKeep: null, // 指定保留日志文件的天数，超过这个天数的日志文件会被自动删除。默认值是 null，即不删除旧文件。
      keepFileExt: false, // 如果设置为 true，日志文件的扩展名会保留在日期模式的后面。例如：app.log.2023-08-30.log。
      flags: "a", // 传递给 fs.open 的标志。默认是 'a'，表示追加模式。
    },
  },
  categories: {
    default: { appenders: [ 'out' ], level: 'info' },
    warning: { appenders: [ 'out' ], level: 'info' },
    application: { appenders: [ 'application' ], level: 'WARN'}
  }
});
const globalLogger = () => log4js.koaLogger(log4js.getLogger('default'), {level: "auto"}); //记录所有访问级别的日志;
const logger = log4js.getLogger("warning");

module.exports = {
  globalLogger,
  logger
}