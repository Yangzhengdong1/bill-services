const errorType = require('../constant/error-type');

class BillMiddleware {
  /**
   * @description: 校验创建账单接口参数是否规范
   * @param {*} ctx
   * @param {*} next
   */
  async paramsVerify(ctx, next) {
    let errorMessage;
    const { payType, billType, amount } = ctx.request.body;
    if (!(payType + '') || !(billType + '') || !amount) {
      errorMessage = new Error(errorType.ARGUMENT_IS_NOT_EMPTY);
      ctx.app.emit('error', errorMessage, ctx);
      return;
    }
    // 判断参数是否合法
    const payTypes = [0, 1, 2, 3, 4, 5];
    const billTypes = [0, 1];
    if (!payTypes.some(item => item === payType) || !billTypes.some(item => item === billType)) {
      errorMessage = new Error(errorType.INVALID_PARAMETER);
      ctx.app.emit('error', errorMessage, ctx);
      return;
    }
    await next();
  }

  /**
   * @description: 校验请求账单列表接口参数是否缺失
   * @param {*} ctx
   * @param {*} next
   */
  async verifyListOld(ctx, next) {
    let { pageSize, pageNum, date } = ctx.query;
    if (!pageSize || !pageNum) {
      const errorMessage = new Error(errorType.INVALID_PARAMETER);
      ctx.app.emit('error', errorMessage, ctx);
      return;
    }
    // 对 pageSize 与 pageNum 做處理
    /*
    * offset：指定第一个返回记录行的偏移量（即从哪一行开始返回），注意：初始行的偏移量为0
    * size：返回具体行数
    * 即：从 offset + 1 行开始，检索 size 行记录
    * */
    const offset = ((pageNum <= 0 ? 1 : pageNum) - 1) * pageSize + '';
    const size = (pageSize <= 0 ? 1 : pageSize) + '';
    ctx.query.listParams = {offset, size, date};
    await next();
  }
  async verifyList(ctx, next) {
    let { pageSize, pageNum, startTime, endTime } = ctx.query;
    if (!pageSize || !pageNum) {
      const errorMessage = new Error(errorType.INVALID_PARAMETER);
      ctx.app.emit('error', errorMessage, ctx);
      return;
    }
    // 对 pageSize 与 pageNum 做處理
    /*
    * offset：指定第一个返回记录行的偏移量（即从哪一行开始返回），注意：初始行的偏移量为0
    * size：返回具体行数
    * 即：从 offset + 1 行开始，检索 size 行记录
    * */
    const offset = ((pageNum <= 0 ? 1 : pageNum) - 1) * pageSize + '';
    const size = (pageSize <= 0 ? 1 : pageSize) + '';
    ctx.query.listParams = {offset, size, startTime, endTime};
    await next();
  }

  /**
   * @description: 校验请求账单金额接口是否传递参数
   * @param {*} ctx
   * @param {*} next
   */
  async verifyAmount(ctx, next) {
    let { date } = ctx.query;
    if (!date) {
      const errorMessage = new Error(errorType.INVALID_PARAMETER);
      ctx.app.emit('error', errorMessage);
      return;
    }
    await next();
  }
}

module.exports = new BillMiddleware();
