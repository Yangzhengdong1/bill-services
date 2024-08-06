const errorTypes = require('../constant/error-type');

class ChartsMiddleware {
  async timeParamsVerify(ctx, next) {
    const { startTime, endTime } = ctx.query;
    if (!startTime || !endTime) {
      const error = new Error(errorTypes.ARGUMENT_IS_NOT_EMPTY);
      ctx.app.emit("error", error, ctx);
      return;
    }
    ctx.request.body.timeParams = { startTime, endTime };
    await next();
  }
}

module.exports = new ChartsMiddleware();
